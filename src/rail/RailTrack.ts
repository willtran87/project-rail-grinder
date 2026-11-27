/**
 * RailTrack - Manages a full track that follows a curved spline path
 * with superelevation (banking) on curves.
 *
 * The track is defined as a CatmullRom spline through control points.
 * Rail segments, ties, and ballast are placed along the curve with
 * proper rotation and banking angles.
 *
 * Scale: 1 scene unit ≈ 1 meter.
 */

import * as THREE from 'three';
import { RailProfile } from './RailProfile';
import { RailSegment, getGrindMarkTexture } from './RailSegment';
import { RailBatch } from './RailBatch';
import { createBallastGeometry, createBallastMaterial } from '../world/trackBed';
import { disposeObject3D } from '../core/dispose';

const GAUGE_WIDTH = 1.6;
export const VISUAL_SEGMENT_LENGTH = 5; // must match RailSegment.SEGMENT_LENGTH
export const GAME_SECTION_LENGTH = 20;  // gameplay sections (scoring, defects)
const TIE_SPACING = 0.6;

export interface TrackPoint {
  position: THREE.Vector3;
  forward: THREE.Vector3;   // tangent direction
  up: THREE.Vector3;        // up direction (tilted for banking)
  right: THREE.Vector3;     // lateral direction
  bank: number;             // superelevation angle in radians
  t: number;                // parameter along curve [0, 1]
}

export class RailTrack {
  readonly group: THREE.Group;
  /** Ties + ballast meshes, freed in dispose() */
  private bedMeshes: THREE.Object3D[] = [];
  readonly leftSegments: RailSegment[] = [];
  readonly rightSegments: RailSegment[] = [];
  readonly leftProfiles: RailProfile[] = [];
  readonly rightProfiles: RailProfile[] = [];

  /** All rail segments in one mesh (see RailBatch) */
  private batch!: RailBatch;
  /** Segments that are cooling down or flashing (the only ones updated per frame) */
  private activeSegments = new Set<RailSegment>();

  // getTrackPoint lookup table: the spline sampled every LUT_STEP metres,
  // built once. (Asking the spline directly means an arc-length search plus
  // several new vectors per call — and the game makes ~130 calls a frame.)
  private static readonly LUT_STEP = 0.25;
  private lutPos!: Float32Array;   // x, y, z per sample
  private lutFwd!: Float32Array;   // unit tangent per sample
  private lutCount = 0;
  // Results come from a small rotating pool, so a couple of calls in a row
  // (e.g. front and rear bogie) don't overwrite each other
  private static readonly POOL = 16;
  private tpPool: TrackPoint[] = [];
  private tpNext = 0;
  private _tpWorldUp = new THREE.Vector3(0, 1, 0);
  private _tpBankQuat = new THREE.Quaternion();

  /** The spline path the track follows */
  readonly path: THREE.CatmullRomCurve3;
  /** Total arc length of the track in scene units */
  readonly totalLength: number;
  /** Number of visual segments (short, for smooth curves) */
  readonly segmentCount: number;
  /** Number of game sections (longer, for scoring/defects) */
  readonly sectionCount: number;
  /** Distance along track where game sections begin (lead-in before first section) */
  readonly sectionOffset: number;

  /** Banking angle at each control point (radians). Positive = right rail higher. */
  private bankAngles: number[];

  constructor(controlPoints: THREE.Vector3[], bankAngles?: number[], maxSections?: number, sectionOffset: number = 0) {
    this.group = new THREE.Group();

    this.path = new THREE.CatmullRomCurve3(controlPoints, false, 'catmullrom', 0.3);
    this.path.arcLengthDivisions = 1000;
    this.totalLength = this.path.getLength();
    this.segmentCount = Math.max(1, Math.floor(this.totalLength / VISUAL_SEGMENT_LENGTH));
    // If maxSections specified, cap the game section count (extra track is just run-out)
    const computedSections = Math.max(1, Math.floor(this.totalLength / GAME_SECTION_LENGTH));
    this.sectionCount = maxSections ? Math.min(computedSections, maxSections) : computedSections;
    this.sectionOffset = sectionOffset;

    // Default banking: compute from curvature
    this.bankAngles = bankAngles ?? this.computeBankAngles(controlPoints.length);
    this.buildLookup();

    // Build all track elements along the curve
    this.buildRails();
    this.buildTies();
    this.buildBallast();
  }

  /** Sample the spline once (see getTrackPoint) */
  private buildLookup(): void {
    const n = Math.ceil(this.totalLength / RailTrack.LUT_STEP) + 1;
    this.lutCount = n;
    this.lutPos = new Float32Array(n * 3);
    this.lutFwd = new Float32Array(n * 3);
    const p = new THREE.Vector3(), f = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      const t = Math.min(1, (i * RailTrack.LUT_STEP) / this.totalLength);
      this.path.getPointAt(t, p);
      this.path.getTangentAt(t, f).normalize();
      this.lutPos[i * 3] = p.x; this.lutPos[i * 3 + 1] = p.y; this.lutPos[i * 3 + 2] = p.z;
      this.lutFwd[i * 3] = f.x; this.lutFwd[i * 3 + 1] = f.y; this.lutFwd[i * 3 + 2] = f.z;
    }
    for (let i = 0; i < RailTrack.POOL; i++) {
      this.tpPool.push({
        position: new THREE.Vector3(), forward: new THREE.Vector3(),
        up: new THREE.Vector3(), right: new THREE.Vector3(), bank: 0, t: 0,
      });
    }
  }

  /**
   * Get a point along the track at a given distance from the start.
   * Interpolated from a table sampled every 25 cm (error well under a millimetre).
   * NOTE: the returned object is reused after 16 more calls — copy anything
   * you need to keep.
   */
  getTrackPoint(distance: number): TrackPoint {
    const d = Math.max(0, Math.min(this.totalLength, distance));
    const t = d / this.totalLength;
    const f = Math.min(this.lutCount - 1.000001, d / RailTrack.LUT_STEP);
    const i = Math.floor(f), k = f - i;
    const a = i * 3, b = a + 3;
    const P = this.lutPos, F = this.lutFwd;

    const tp = this.tpPool[this.tpNext];
    this.tpNext = (this.tpNext + 1) % RailTrack.POOL;
    tp.position.set(P[a] + (P[b] - P[a]) * k, P[a + 1] + (P[b + 1] - P[a + 1]) * k, P[a + 2] + (P[b + 2] - P[a + 2]) * k);
    const forward = tp.forward.set(F[a] + (F[b] - F[a]) * k, F[a + 1] + (F[b + 1] - F[a + 1]) * k, F[a + 2] + (F[b + 2] - F[a + 2]) * k).normalize();

    const right = tp.right.crossVectors(this._tpWorldUp, forward).normalize();
    const up = tp.up.crossVectors(forward, right).normalize();

    // Apply banking
    const bank = this.getBankAtT(t);
    this._tpBankQuat.setFromAxisAngle(forward, bank);
    up.applyQuaternion(this._tpBankQuat);
    right.applyQuaternion(this._tpBankQuat);
    tp.bank = bank;
    tp.t = t;
    return tp;
  }

  /**
   * Update the rail segments that are animating (hot rail cooling down,
   * completion flash). Idle segments are skipped entirely.
   */
  updateSegments(dt: number): void {
    for (const seg of this.activeSegments) {
      if (!seg.update(dt)) this.activeSegments.delete(seg);
    }
  }

  /** Get the visual segment index for a distance along the track */
  getSegmentIndex(distance: number): number {
    return Math.max(0, Math.min(this.segmentCount - 1,
      Math.floor(distance / VISUAL_SEGMENT_LENGTH)));
  }

  /** Get the game section index (for scoring/defects) for a distance */
  /**
   * Which game section a track distance falls in.
   * Returns -1 for the lead-in and run-out track outside the scored sections,
   * so grinding there can't count toward (or complete) a section.
   */
  getSectionIndex(distance: number): number {
    const idx = Math.floor((distance - this.sectionOffset) / GAME_SECTION_LENGTH);
    return idx >= 0 && idx < this.sectionCount ? idx : -1;
  }

  /** Get all visual segment indices that belong to a game section */
  getSegmentsForSection(sectionIndex: number): number[] {
    const ratio = Math.round(GAME_SECTION_LENGTH / VISUAL_SEGMENT_LENGTH);
    const start = Math.round(this.sectionOffset / VISUAL_SEGMENT_LENGTH) + sectionIndex * ratio;
    const indices: number[] = [];
    for (let i = start; i < start + ratio && i < this.segmentCount; i++) {
      indices.push(i);
    }
    return indices;
  }

  getProfile(segmentIndex: number = 0, rail: 'left' | 'right' = 'left'): RailProfile {
    const profiles = rail === 'left' ? this.leftProfiles : this.rightProfiles;
    return profiles[Math.max(0, Math.min(segmentIndex, profiles.length - 1))];
  }

  rebuildSegment(segmentIndex: number = 0, rail: 'left' | 'right' = 'left'): void {
    const segments = rail === 'left' ? this.leftSegments : this.rightSegments;
    const profiles = rail === 'left' ? this.leftProfiles : this.rightProfiles;
    const idx = Math.max(0, Math.min(segmentIndex, segments.length - 1));
    segments[idx].setProfile(profiles[idx]);
  }

  /** Compute banking angles from track curvature at evenly spaced points */
  private computeBankAngles(count: number): number[] {
    const angles: number[] = [];
    const sampleStep = 0.001;

    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      // Approximate curvature from tangent change
      const t0 = Math.max(0, t - sampleStep);
      const t1 = Math.min(1, t + sampleStep);
      const tan0 = this.path.getTangentAt(t0);
      const tan1 = this.path.getTangentAt(t1);

      // Cross product magnitude indicates how much the tangent is turning
      const cross = new THREE.Vector3().crossVectors(tan0, tan1);
      // Sign: positive y component means turning left, negative means right
      const curvature = cross.y / (2 * sampleStep);

      // Superelevation proportional to curvature, clamped
      // Real railroads bank up to ~6 inches (150mm) over gauge width
      // At our scale that's about 6 degrees max
      const maxBank = 0.12; // ~7 degrees in radians
      const bank = Math.max(-maxBank, Math.min(maxBank, curvature * 2.0));
      angles.push(bank);
    }

    return angles;
  }

  /** Interpolate bank angle at parameter t along the curve */
  private getBankAtT(t: number): number {
    if (this.bankAngles.length < 2) return 0;
    const f = t * (this.bankAngles.length - 1);
    const i = Math.floor(f);
    const frac = f - i;
    const a = this.bankAngles[Math.min(i, this.bankAngles.length - 1)];
    const b = this.bankAngles[Math.min(i + 1, this.bankAngles.length - 1)];
    return a + (b - a) * frac;
  }

  /**
   * Build the rails: one RailSegment per 5 m per rail, all drawn together by
   * a single RailBatch. Slots 0..n-1 are the left rail, n..2n-1 the right.
   */
  private buildRails(): void {
    const transforms: THREE.Matrix4[] = [];
    const basis = new THREE.Matrix4();
    const quat = new THREE.Quaternion();
    const one = new THREE.Vector3(1, 1, 1);
    const pos = new THREE.Vector3();
    for (const side of ['left', 'right'] as const) {
      const lateralDir = side === 'left' ? -1 : 1;
      for (let i = 0; i < this.segmentCount; i++) {
        const tp = this.getTrackPoint(i * VISUAL_SEGMENT_LENGTH);
        // Offset laterally from the track centre, aligned with direction and banking
        pos.copy(tp.position).addScaledVector(tp.right, lateralDir * GAUGE_WIDTH / 2);
        quat.setFromRotationMatrix(basis.makeBasis(tp.right, tp.up, tp.forward));
        transforms.push(new THREE.Matrix4().compose(pos, quat, one));
      }
    }

    const pointCount = new RailProfile().points.length;
    this.batch = new RailBatch(transforms, VISUAL_SEGMENT_LENGTH, pointCount, getGrindMarkTexture());
    const activate = (seg: RailSegment) => this.activeSegments.add(seg);
    for (let i = 0; i < this.segmentCount; i++) {
      const lp = new RailProfile(), rp = new RailProfile();
      this.leftProfiles.push(lp);
      this.rightProfiles.push(rp);
      this.leftSegments.push(new RailSegment(lp, this.batch, i, activate));
      this.rightSegments.push(new RailSegment(rp, this.batch, this.segmentCount + i, activate));
    }
    this.batch.finishBuild();
    this.group.add(this.batch.railMesh, this.batch.shineMesh);
  }

  /**
   * Place ties along the curve. One InstancedMesh = one draw call for all
   * ~700 ties (instead of 700 separate meshes). Each tie gets a slightly
   * different wood tone so the track doesn't look copy-pasted.
   */
  private buildTies(): void {
    const tieGeometry = new THREE.BoxGeometry(GAUGE_WIDTH + 1.0, 0.12, 0.18);
    const tieMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0.0 });

    const tieCount = Math.floor(this.totalLength / TIE_SPACING);
    const ties = new THREE.InstancedMesh(tieGeometry, tieMaterial, tieCount);
    const matrix = new THREE.Matrix4();
    const basis = new THREE.Matrix4();
    const quat = new THREE.Quaternion();
    const pos = new THREE.Vector3();
    const one = new THREE.Vector3(1, 1, 1);
    const tone = new THREE.Color();
    for (let i = 0; i < tieCount; i++) {
      const tp = this.getTrackPoint(i * TIE_SPACING);
      pos.copy(tp.position);
      pos.y -= 0.30;
      // Align tie perpendicular to track direction with banking
      quat.setFromRotationMatrix(basis.makeBasis(tp.right, tp.up, tp.forward));
      ties.setMatrixAt(i, matrix.compose(pos, quat, one));
      // Weathered wood: brown with random lightness / greyness
      tone.setHSL(0.07 + Math.random() * 0.03, 0.22 + Math.random() * 0.15, 0.2 + Math.random() * 0.1, THREE.SRGBColorSpace);
      ties.setColorAt(i, tone);
    }
    ties.instanceMatrix.needsUpdate = true;
    ties.receiveShadow = true;
    this.group.add(ties);
    this.bedMeshes.push(ties);
  }

  /**
   * Ballast: the sloped bed of crushed stone under the ties, built from
   * textured trapezoid "prism" pieces that follow the curve (one draw call).
   */
  private buildBallast(): void {
    const chunkLength = 5;            // metres per piece
    const pieceLength = chunkLength + 0.3; // slight overlap hides seams on curves
    const geometry = createBallastGeometry(GAUGE_WIDTH + 1.4, GAUGE_WIDTH + 3.0, 0.4, pieceLength);
    const material = createBallastMaterial(0xc8c4bc);

    const chunkCount = Math.floor(this.totalLength / chunkLength);
    const ballast = new THREE.InstancedMesh(geometry, material, chunkCount);
    const matrix = new THREE.Matrix4();
    const basis = new THREE.Matrix4();
    const quat = new THREE.Quaternion();
    const pos = new THREE.Vector3();
    const one = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < chunkCount; i++) {
      const tp = this.getTrackPoint(i * chunkLength + chunkLength / 2);
      pos.copy(tp.position);
      pos.y -= 0.33; // top of the stones just under the tie tops
      quat.setFromRotationMatrix(basis.makeBasis(tp.right, tp.up, tp.forward));
      ballast.setMatrixAt(i, matrix.compose(pos, quat, one));
    }
    ballast.instanceMatrix.needsUpdate = true;
    ballast.receiveShadow = true;
    this.group.add(ballast);
    this.bedMeshes.push(ballast);
  }

  dispose(): void {
    this.batch.dispose();
    this.activeSegments.clear();
    // Ties and ballast (instanced meshes this track owns)
    for (const m of this.bedMeshes) disposeObject3D(m);
  }
}
