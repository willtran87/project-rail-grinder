/**
 * TrackDetail - Close-up track hardware near the camera: a steel tie plate
 * under each rail on every tie, with a spring clip either side of the rail
 * foot, and a thermite weld collar at each rail weld (every 20 m, where the
 * sections join).
 *
 * Only the stretch around the consist gets it (from 60 m behind to 100 m
 * ahead): further away it would be smaller than a pixel. The instances are
 * re-placed whenever the consist has moved a few metres, so it costs two
 * draw calls however long the job is.
 */

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { RailTrack } from '../rail/RailTrack';

const TIE_SPACING = 0.6;     // as RailTrack
const GAUGE = 1.6;           // as RailTrack
const BEHIND = 60, AHEAD = 100;
const WELD_EVERY = 20;
const MAX_TIES = Math.ceil((BEHIND + AHEAD) / TIE_SPACING) + 2;
const MAX_WELDS = Math.ceil((BEHIND + AHEAD) / WELD_EVERY) + 2;

export class TrackDetail {
  readonly group = new THREE.Group();
  private plates: THREE.InstancedMesh;
  private welds: THREE.InstancedMesh;
  private placedAt = -999;
  private m = new THREE.Matrix4();
  private basis = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private p = new THREE.Vector3();
  private one = new THREE.Vector3(1, 1, 1);

  constructor(private track: RailTrack) {
    // Plate + two clips, in rail-local space (rail foot at y = -0.24)
    const plate = new THREE.BoxGeometry(0.36, 0.022, 0.2).translate(0, -0.229, 0);
    const clipA = new THREE.BoxGeometry(0.045, 0.035, 0.07).translate(-0.12, -0.208, 0);
    const clipB = new THREE.BoxGeometry(0.045, 0.035, 0.07).translate(0.12, -0.208, 0);
    const geo = mergeGeometries([plate, clipA, clipB])!;
    this.plates = new THREE.InstancedMesh(geo,
      new THREE.MeshStandardMaterial({ color: 0x3d3a36, roughness: 0.85, metalness: 0.4 }), MAX_TIES * 2);
    this.plates.receiveShadow = true;
    this.plates.frustumCulled = false; // re-placed around the consist; bounds would go stale
    // Weld collar: a slightly proud band around the head and web
    this.welds = new THREE.InstancedMesh(new THREE.BoxGeometry(0.17, 0.24, 0.06).translate(0, -0.1, 0),
      new THREE.MeshStandardMaterial({ color: 0x8c8a86, roughness: 0.5, metalness: 0.7 }), MAX_WELDS * 2);
    this.welds.frustumCulled = false;
    this.group.add(this.plates, this.welds);
  }

  /** Keep the hardware around the consist (re-placed every 6 m of travel) */
  update(grinderPosition: number): void {
    if (Math.abs(grinderPosition - this.placedAt) < 6) return;
    this.placedAt = grinderPosition;
    const len = this.track.totalLength;
    let n = 0;
    const first = Math.max(0, Math.ceil((grinderPosition - BEHIND) / TIE_SPACING));
    for (let i = first; n < MAX_TIES * 2; i++) {
      const d = i * TIE_SPACING;
      if (d > Math.min(len - 0.1, grinderPosition + AHEAD)) break;
      for (const side of [-1, 1]) this.plates.setMatrixAt(n++, this.at(d, side));
    }
    this.plates.count = n;
    this.plates.instanceMatrix.needsUpdate = true;
    let w = 0;
    const firstWeld = Math.max(1, Math.ceil((grinderPosition - BEHIND) / WELD_EVERY));
    for (let i = firstWeld; w < MAX_WELDS * 2; i++) {
      const d = i * WELD_EVERY + 0.3; // just off the tie
      if (d > Math.min(len - 0.1, grinderPosition + AHEAD)) break;
      for (const side of [-1, 1]) this.welds.setMatrixAt(w++, this.at(d, side));
    }
    this.welds.count = w;
    this.welds.instanceMatrix.needsUpdate = true;
  }

  private at(d: number, side: number): THREE.Matrix4 {
    const tp = this.track.getTrackPoint(d);
    this.p.copy(tp.position).addScaledVector(tp.right, side * GAUGE / 2);
    this.q.setFromRotationMatrix(this.basis.makeBasis(tp.right, tp.up, tp.forward));
    return this.m.compose(this.p, this.q, this.one);
  }
}
