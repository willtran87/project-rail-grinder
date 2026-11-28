/**
 * DamageOverlay - The scan painted onto the track (key B): a glowing strip
 * between the rails, one tile per 5 m stretch, coloured by how much work it
 * still needs: red (deep), amber (some), green (within tolerance). Finished
 * sections fade out. One InstancedMesh (one draw call), off by default.
 */

import * as THREE from 'three';
import type { RailTrack } from '../rail/RailTrack';
import type { TargetProfile } from '../types/rail';
import { VISUAL_SEGMENT_LENGTH } from '../rail/RailTrack';

const GOOD = new THREE.Color(0x30e060), SOME = new THREE.Color(0xffb020), BAD = new THREE.Color(0xff3020);
const GOOD_CB = new THREE.Color(0x3a8cff), BAD_CB = new THREE.Color(0xff8a00);

export class DamageOverlay {
  readonly mesh: THREE.InstancedMesh;
  private timer = 0;
  private c = new THREE.Color();

  constructor(private track: RailTrack) {
    const n = track.segmentCount;
    const geo = new THREE.PlaneGeometry(1.1, VISUAL_SEGMENT_LENGTH * 0.92).rotateX(-Math.PI / 2).translate(0, 0, VISUAL_SEGMENT_LENGTH / 2);
    this.mesh = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending,
    }), n);
    const m = new THREE.Matrix4(), basis = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), one = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < n; i++) {
      const tp = track.getTrackPoint(i * VISUAL_SEGMENT_LENGTH);
      p.copy(tp.position); p.y -= 0.13; // above the ties and ballast, below the rail heads
      q.setFromRotationMatrix(basis.makeBasis(tp.right, tp.up, tp.forward));
      this.mesh.setMatrixAt(i, m.compose(p, q, one));
      this.mesh.setColorAt(i, GOOD);
    }
    this.mesh.visible = false;
    this.mesh.renderOrder = 2;
  }

  get on(): boolean { return this.mesh.visible; }
  toggle(): boolean { this.mesh.visible = !this.mesh.visible; this.timer = 0; return this.mesh.visible; }

  /** Recolour twice a second while it's showing */
  update(dt: number, target: TargetProfile, completed: (section: number) => boolean, colorblind: boolean): void {
    if (!this.mesh.visible) return;
    this.timer -= dt;
    if (this.timer > 0) return;
    this.timer = 0.5;
    const tol = target.tolerance;
    for (let vi = 0; vi < this.track.segmentCount; vi++) {
      const sec = this.track.getSectionIndex(vi * VISUAL_SEGMENT_LENGTH + 0.1);
      if (sec < 0 || completed(sec)) { this.mesh.setColorAt(vi, this.c.setRGB(0, 0, 0)); continue; }
      let worst = 0;
      for (const rail of ['left', 'right'] as const) {
        const dev = this.track.getProfile(vi, rail).compare(target).pointDeviations;
        for (const d of dev) if (d > worst) worst = d;
      }
      const t = Math.max(0, Math.min(1, (worst - tol) / (tol * 4)));
      const good = colorblind ? GOOD_CB : GOOD, bad = colorblind ? BAD_CB : BAD;
      if (t <= 0) this.c.copy(good).multiplyScalar(0.6);
      else if (t < 0.5) this.c.copy(SOME).lerp(colorblind ? bad : SOME, t * 2);
      else this.c.copy(SOME).lerp(bad, (t - 0.5) * 2);
      this.mesh.setColorAt(vi, this.c);
    }
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }
}
