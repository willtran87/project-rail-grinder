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
import { RailSegment } from './RailSegment';

const GAUGE_WIDTH = 1.6;
const VISUAL_SEGMENT_LENGTH = 5; // must match RailSegment.SEGMENT_LENGTH
const GAME_SECTION_LENGTH = 20;  // gameplay sections (scoring, defects)
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
  readonly leftSegments: RailSegment[] = [];
  readonly rightSegments: RailSegment[] = [];
  readonly leftProfiles: RailProfile[] = [];
  readonly rightProfiles: RailProfile[] = [];

  // Pre-allocated temp objects for getTrackPoint (avoids per-call garbage)
  private _tpWorldUp = new THREE.Vector3(0, 1, 0);
  private _tpRight = new THREE.Vector3();
  private _tpBaseUp = new THREE.Vector3();
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

    // Build all track elements along the curve
    this.buildRails();
    this.buildTies();
    this.buildBallast();
  }

  /** Get a point along the track at a given distance from the start.
   *  NOTE: The returned vectors are shared/reused — copy them if you need to store them. */
  getTrackPoint(distance: number): TrackPoint {
    const t = Math.max(0, Math.min(1, distance / this.totalLength));

    const position = this.path.getPointAt(t);
    const forward = this.path.getTangentAt(t).normalize();

    // Reuse pre-allocated temps (avoids 6 object allocations per call)
    const right = this._tpRight.crossVectors(this._tpWorldUp, forward).normalize();
    const baseUp = this._tpBaseUp.crossVectors(forward, right).normalize();

    const bank = this.getBankAtT(t);

    // Apply banking
    this._tpBankQuat.setFromAxisAngle(forward, bank);
    const bankedUp = baseUp.applyQuaternion(this._tpBankQuat);
    const bankedRight = right.applyQuaternion(this._tpBankQuat);

    return { position, forward, up: bankedUp, right: bankedRight, bank, t };
  }

  /** Get the visual segment index for a distance along the track */
  getSegmentIndex(distance: number): number {
    return Math.max(0, Math.min(this.segmentCount - 1,
      Math.floor(distance / VISUAL_SEGMENT_LENGTH)));
  }

  /** Get the game section index (for scoring/defects) for a distance */
  getSectionIndex(distance: number): number {
    return Math.max(0, Math.min(this.sectionCount - 1,
      Math.floor((distance - this.sectionOffset) / GAME_SECTION_LENGTH)));
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

  /** Build rail segment meshes along the curve */
  private buildRails(): void {
    for (let i = 0; i < this.segmentCount; i++) {
      const dist = i * VISUAL_SEGMENT_LENGTH;
      const tp = this.getTrackPoint(dist);

      for (const side of ['left', 'right'] as const) {
        const profile = new RailProfile();
        const segment = new RailSegment(profile, 0);

        // Position: offset laterally from track center
        const lateralDir = side === 'left' ? -1 : 1;
        const offset = tp.right.clone().multiplyScalar(lateralDir * GAUGE_WIDTH / 2);
        segment.mesh.position.copy(tp.position).add(offset);

        // Rotation: align with the track direction and banking
        const quat = new THREE.Quaternion();
        const rotMatrix = new THREE.Matrix4().makeBasis(
          tp.right,
          tp.up,
          tp.forward
        );
        quat.setFromRotationMatrix(rotMatrix);
        segment.mesh.quaternion.copy(quat);

        if (side === 'left') {
          this.leftSegments.push(segment);
          this.leftProfiles.push(profile);
        } else {
          this.rightSegments.push(segment);
          this.rightProfiles.push(profile);
        }

        this.group.add(segment.mesh);
      }
    }
  }

  /** Place ties along the curve */
  private buildTies(): void {
    const tieGeometry = new THREE.BoxGeometry(GAUGE_WIDTH + 1.0, 0.12, 0.18);
    const tieMaterial = new THREE.MeshStandardMaterial({
      color: 0x5a4430,
      roughness: 0.9,
      metalness: 0.0,
          });

    const tieCount = Math.floor(this.totalLength / TIE_SPACING);
    for (let i = 0; i < tieCount; i++) {
      const dist = i * TIE_SPACING;
      const tp = this.getTrackPoint(dist);

      const tie = new THREE.Mesh(tieGeometry, tieMaterial);
      tie.position.copy(tp.position);
      tie.position.y -= 0.30;

      // Align tie perpendicular to track direction with banking
      const quat = new THREE.Quaternion();
      const m = new THREE.Matrix4().makeBasis(tp.right, tp.up, tp.forward);
      quat.setFromRotationMatrix(m);
      tie.quaternion.copy(quat);

      tie.receiveShadow = true;
      this.group.add(tie);
    }
  }

  /** Build ballast as a series of short sections following the curve */
  private buildBallast(): void {
    const ballastMaterial = new THREE.MeshStandardMaterial({
      color: 0x777777,
      roughness: 1.0,
      metalness: 0.0,
          });

    const chunkLength = 5; // meters per ballast chunk
    const chunkCount = Math.floor(this.totalLength / chunkLength);
    const ballastGeometry = new THREE.BoxGeometry(GAUGE_WIDTH + 2.0, 0.25, chunkLength);

    for (let i = 0; i < chunkCount; i++) {
      const dist = i * chunkLength + chunkLength / 2;
      const tp = this.getTrackPoint(dist);

      const ballast = new THREE.Mesh(ballastGeometry, ballastMaterial);
      ballast.position.copy(tp.position);
      ballast.position.y -= 0.45;

      const quat = new THREE.Quaternion();
      const m = new THREE.Matrix4().makeBasis(tp.right, tp.up, tp.forward);
      quat.setFromRotationMatrix(m);
      ballast.quaternion.copy(quat);

      ballast.receiveShadow = true;
      this.group.add(ballast);
    }
  }

  dispose(): void {
    for (const seg of [...this.leftSegments, ...this.rightSegments]) {
      seg.dispose();
    }
  }
}
