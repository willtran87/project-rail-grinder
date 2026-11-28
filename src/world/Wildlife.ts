/**
 * Wildlife - A few birds and deer near the line that react to the consist.
 *
 *   BIRDS  a flock pecking on the ground ahead. When the consist gets close
 *          they burst up, flap away from the track and circle off; later the
 *          flock lands again further up the line. (Not at night.)
 *   DEER   a small herd grazing in the open. They look up when the consist
 *          is 90 m away and bound off away from the track when it's close.
 *
 * Two instanced meshes (one draw each), built per job, nothing created
 * while playing.
 */

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { RailTrack } from '../rail/RailTrack';

const BIRDS = 18;
const DEER = 4;

interface Bird { pos: THREE.Vector3; vel: THREE.Vector3; flap: number; flying: boolean }
interface Deer { dist: number; pos: THREE.Vector3; heading: number; state: 'graze' | 'alert' | 'run'; t: number; away: THREE.Vector3; phase: number }

/** One low-poly deer: body, neck, head, four legs, merged */
function deerGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const box = (w: number, h: number, d: number, x: number, y: number, z: number, rx = 0) => {
    const g = new THREE.BoxGeometry(w, h, d);
    if (rx) g.rotateX(rx);
    g.translate(x, y, z);
    parts.push(g);
  };
  box(0.36, 0.42, 1.1, 0, 1.0, 0);           // body
  box(0.18, 0.55, 0.2, 0, 1.38, 0.5, -0.5);  // neck
  box(0.2, 0.22, 0.42, 0, 1.66, 0.72);       // head
  for (const [x, z] of [[-0.12, 0.42], [0.12, 0.42], [-0.12, -0.42], [0.12, -0.42]]) box(0.09, 0.8, 0.09, x, 0.4, z);
  box(0.06, 0.2, 0.06, -0.08, 1.88, 0.62);   // ears
  box(0.06, 0.2, 0.06, 0.08, 1.88, 0.62);
  return mergeGeometries(parts)!;
}

function birdGeometry(): THREE.BufferGeometry {
  // A flat "V": two wing triangles meeting at the body
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([
    0, 0, 0.12, -0.32, 0.06, -0.06, 0, 0, -0.12,
    0, 0, 0.12, 0, 0, -0.12, 0.32, 0.06, -0.06,
  ], 3));
  g.computeVertexNormals();
  return g;
}

export class Wildlife {
  readonly group = new THREE.Group();
  private birdMesh: THREE.InstancedMesh;
  private deerMesh: THREE.InstancedMesh;
  private birds: Bird[] = [];
  private deer: Deer[] = [];
  /** Where the deer are (for the photo challenge) */
  deerPositions(): THREE.Vector3[] { return this.deer.map((d) => d.pos); }
  private flockHome = new THREE.Vector3();
  private flockDist = 0;
  private flockGone = false;
  private time = 0;
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private s = new THREE.Vector3();
  private e = new THREE.Euler();

  constructor(private track: RailTrack, startDist: number) {
    this.birdMesh = new THREE.InstancedMesh(birdGeometry(),
      new THREE.MeshLambertMaterial({ color: 0x2a2a30, side: THREE.DoubleSide }), BIRDS);
    this.deerMesh = new THREE.InstancedMesh(deerGeometry(),
      new THREE.MeshLambertMaterial({ color: 0x8a5a34, flatShading: true }), DEER);
    this.deerMesh.castShadow = true;
    this.birdMesh.frustumCulled = false;
    this.deerMesh.frustumCulled = false;
    this.group.add(this.birdMesh, this.deerMesh);
    for (let i = 0; i < BIRDS; i++) this.birds.push({ pos: new THREE.Vector3(), vel: new THREE.Vector3(), flap: Math.random() * 6, flying: false });
    this.landFlock(startDist + 120);
    // Deer: one herd in the open, some way up the line
    const herdDist = Math.min(track.totalLength - 20, startDist + 180 + Math.random() * 120);
    const side = Math.random() < 0.5 ? -1 : 1;
    const tp = track.getTrackPoint(herdDist);
    for (let i = 0; i < DEER; i++) {
      const pos = tp.position.clone().addScaledVector(tp.right, side * (22 + Math.random() * 14))
        .addScaledVector(tp.forward, (Math.random() - 0.5) * 16);
      pos.y = -0.6;
      this.deer.push({
        dist: herdDist, pos, heading: Math.random() * Math.PI * 2, state: 'graze', t: 0, phase: Math.random() * 6,
        away: tp.right.clone().multiplyScalar(side).addScaledVector(tp.forward, (Math.random() - 0.3) * 0.8).normalize(),
      });
    }
  }

  /** Settle the flock on the ground beside the track at this distance */
  private landFlock(dist: number): void {
    if (dist > this.track.totalLength - 10) { this.flockGone = true; return; }
    this.flockDist = dist;
    const tp = this.track.getTrackPoint(dist);
    const side = Math.random() < 0.5 ? -1 : 1;
    this.flockHome.copy(tp.position).addScaledVector(tp.right, side * (6 + Math.random() * 6));
    for (const b of this.birds) {
      b.flying = false;
      b.pos.set(this.flockHome.x + (Math.random() - 0.5) * 5, -0.55, this.flockHome.z + (Math.random() - 0.5) * 5);
      b.vel.set(0, 0, 0);
    }
    this.flockGone = false;
  }

  /**
   * @param consistFront / consistRear - track distances of the consist's ends
   * @param night - hide the birds at night
   */
  update(dt: number, consistFront: number, consistRear: number, night: boolean): void {
    this.time += dt;
    this.birdMesh.visible = !night && !this.flockGone;

    // ---- Birds ----
    if (!this.flockGone) {
      const scatter = consistFront > this.flockDist - 35 && consistRear < this.flockDist + 10;
      let allFar = true;
      for (let i = 0; i < BIRDS; i++) {
        const b = this.birds[i];
        if (!b.flying && scatter) {
          b.flying = true;
          const away = new THREE.Vector3(b.pos.x - this.flockHome.x, 0, b.pos.z - this.flockHome.z).normalize();
          b.vel.set(away.x * 4 + (Math.random() - 0.5) * 3, 3 + Math.random() * 3, away.z * 4 + (Math.random() - 0.5) * 3);
        }
        if (b.flying) {
          b.vel.y += (1.2 - b.vel.y) * dt * 0.8; // climb out, then cruise
          b.pos.addScaledVector(b.vel, dt);
          b.flap += dt * 18;
          if (b.pos.y < 60) allFar = false;
        } else {
          allFar = false;
          // pecking: little hops
          b.flap += dt * 2;
          b.pos.y = -0.55 + Math.max(0, Math.sin(this.time * 3 + i * 1.7)) * 0.05;
        }
        const wing = b.flying ? Math.sin(b.flap) * 0.9 : 0.1;
        this.e.set(0, Math.atan2(b.vel.x || 0.01, b.vel.z || 0.01), 0);
        this.q.setFromEuler(this.e);
        this.s.set(1, b.flying ? 1 + wing * 3 : 1, 1);
        this.m.compose(b.pos, this.q, this.s);
        this.birdMesh.setMatrixAt(i, this.m);
      }
      this.birdMesh.instanceMatrix.needsUpdate = true;
      // Once they're well away, the flock lands again further up the line
      if (allFar) this.landFlock(consistFront + 160 + Math.random() * 120);
    }

    // ---- Deer ----
    for (let i = 0; i < DEER; i++) {
      const d = this.deer[i];
      const near = consistFront > d.dist - 90 && consistRear < d.dist + 30;
      const close = consistFront > d.dist - 45 && consistRear < d.dist + 15;
      if (d.state === 'graze' && near) d.state = 'alert';
      if (d.state !== 'run' && close) { d.state = 'run'; d.t = 0; }
      let bob = 0;
      let pitch = 0;
      if (d.state === 'graze') {
        pitch = 0.35 + Math.sin(this.time * 0.7 + d.phase) * 0.1; // head down
        d.heading += Math.sin(this.time * 0.2 + d.phase) * dt * 0.2;
      } else if (d.state === 'alert') {
        d.heading += (Math.atan2(-d.away.x, -d.away.z) - d.heading) * dt * 2; // look toward the track
      } else {
        d.t += dt;
        const speed = d.t < 6 ? 9 : 0;
        d.pos.addScaledVector(d.away, speed * dt);
        d.heading = Math.atan2(d.away.x, d.away.z);
        bob = Math.abs(Math.sin(d.t * 9 + d.phase)) * 0.5 * (speed > 0 ? 1 : 0);
        pitch = speed > 0 ? Math.sin(d.t * 9 + d.phase) * 0.15 : 0;
      }
      this.e.set(pitch, d.heading, 0);
      this.q.setFromEuler(this.e);
      this.s.setScalar(1);
      this.m.compose(this._tmp.set(d.pos.x, d.pos.y + bob, d.pos.z), this.q, this.s);
      this.deerMesh.setMatrixAt(i, this.m);
    }
    this.deerMesh.instanceMatrix.needsUpdate = true;
  }
  private _tmp = new THREE.Vector3();
}
