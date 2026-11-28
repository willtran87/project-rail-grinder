/**
 * TrackCrews - People working beside the track, and the broken-rail marker.
 *
 *   WORK CREWS  two or three workers in hi-vis vests and hard hats, with a
 *               flagman, standing by the track. A "MEN WORKING" board stands
 *               50 m before them. As the consist gets close they step back
 *               and wave. Pass them faster than the work-zone limit and it's
 *               a safety violation (Game decides the penalty).
 *   BROKEN RAIL a red flag and a glowing crack on the rail: the consist must
 *               stop short of it and wait while it's welded.
 *
 * Low-poly figures built from boxes, merged per figure (see bakeStatic).
 */

import * as THREE from 'three';
import type { RailTrack } from '../rail/RailTrack';
import { bakeStatic, createVertexPbrMaterial } from '../core/bakeStatic';

/** Work-zone speed limit (m/s) — about 8 mph */
export const WORK_ZONE_SPEED = 3.6;
/** Half-length of a work zone along the track (m) */
export const WORK_ZONE_HALF = 12;

interface Worker { root: THREE.Group; arm: THREE.Object3D; home: number; phase: number }
export interface Crew { dist: number; workers: Worker[]; violated: boolean; group: THREE.Group }

export class TrackCrews {
  readonly group = new THREE.Group();
  readonly crews: Crew[] = [];
  /** Broken-rail marker (null if this job has none) */
  brokenRail: { dist: number; group: THREE.Group; glow: THREE.Mesh; fixed: boolean } | null = null;
  private vmat = createVertexPbrMaterial();
  private mats = {
    vest: new THREE.MeshStandardMaterial({ color: 0xff7a10, emissive: 0x552000, emissiveIntensity: 0.6, roughness: 0.6 }),
    stripe: new THREE.MeshStandardMaterial({ color: 0xe8f0c8, emissive: 0xc8d8a0, emissiveIntensity: 0.35 }),
    pants: new THREE.MeshStandardMaterial({ color: 0x2a3550, roughness: 0.9 }),
    skin: new THREE.MeshStandardMaterial({ color: 0xc08a64, roughness: 0.8 }),
    hat: new THREE.MeshStandardMaterial({ color: 0xffe040, roughness: 0.4 }),
    flag: new THREE.MeshStandardMaterial({ color: 0xff2020, emissive: 0x400000, side: THREE.DoubleSide }),
    pole: new THREE.MeshStandardMaterial({ color: 0x777777 }),
    sign: new THREE.MeshStandardMaterial({ color: 0xffb000, emissive: 0x402800, emissiveIntensity: 0.5 }),
  };
  private time = 0;

  /**
   * @param crewDists - where work crews stand (distance along the track)
   * @param brokenAt - distance of a broken rail, or null
   */
  constructor(private track: RailTrack, crewDists: number[], brokenAt: number | null) {
    for (const d of crewDists) this.crews.push(this.buildCrew(d));
    if (brokenAt !== null) this.buildBrokenRail(brokenAt);
  }

  private place(obj: THREE.Object3D, dist: number, lateral: number): void {
    const tp = this.track.getTrackPoint(Math.max(0.1, Math.min(this.track.totalLength - 0.1, dist)));
    obj.position.copy(tp.position).addScaledVector(tp.right, lateral);
    obj.position.y = -0.6;
    obj.rotation.y = Math.atan2(tp.forward.x, tp.forward.z);
  }

  private box(g: THREE.Object3D, w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    g.add(mesh);
    return mesh;
  }

  private buildWorker(flagman: boolean): Worker {
    const root = new THREE.Group();
    const body = new THREE.Group();
    const m = this.mats;
    this.box(body, 0.16, 0.8, 0.18, m.pants, -0.12, 0.4, 0);
    this.box(body, 0.16, 0.8, 0.18, m.pants, 0.12, 0.4, 0);
    this.box(body, 0.48, 0.62, 0.28, m.vest, 0, 1.12, 0);
    this.box(body, 0.5, 0.06, 0.3, m.stripe, 0, 1.0, 0);
    this.box(body, 0.5, 0.06, 0.3, m.stripe, 0, 1.25, 0);
    this.box(body, 0.22, 0.24, 0.22, m.skin, 0, 1.58, 0);
    this.box(body, 0.3, 0.1, 0.3, m.hat, 0, 1.74, 0);
    this.box(body, 0.13, 0.58, 0.15, m.vest, -0.31, 1.12, 0); // left arm (still)
    bakeStatic(body, { vertexMaterial: this.vmat });
    root.add(body);
    // Right arm pivots at the shoulder so it can wave
    const arm = new THREE.Group();
    arm.position.set(0.31, 1.4, 0);
    this.box(arm, 0.13, 0.58, 0.15, m.vest, 0, -0.29, 0);
    if (flagman) {
      this.box(arm, 0.03, 0.9, 0.03, m.pole, 0, -0.05, 0.1);
      this.box(arm, 0.02, 0.3, 0.42, m.flag, 0, 0.3, 0.32);
    }
    bakeStatic(arm, { vertexMaterial: this.vmat });
    root.add(arm);
    return { root, arm, home: 0, phase: Math.random() * 6 };
  }

  private buildCrew(dist: number): Crew {
    const group = new THREE.Group();
    const workers: Worker[] = [];
    const n = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < n; i++) {
      const w = this.buildWorker(i === 0);
      const lateral = -(3.4 + Math.random() * 0.6); // left side, clear of the consist
      w.home = lateral;
      this.place(w.root, dist + (i - n / 2) * 2.2, lateral);
      w.root.rotation.y += Math.PI / 2 + (Math.random() - 0.5) * 0.6; // face the track
      group.add(w.root);
      workers.push(w);
    }
    // Their hi-rail truck, parked off the track behind them (amber light bar)
    const truck = new THREE.Group();
    const white = new THREE.MeshStandardMaterial({ color: 0xe8e8e4, roughness: 0.6 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x222428, roughness: 0.7 });
    this.box(truck, 2.0, 1.0, 5.2, white, 0, 0.9, 0);          // body
    this.box(truck, 2.0, 0.9, 1.9, white, 0, 1.85, 1.3);        // cab
    this.box(truck, 1.9, 0.5, 0.05, dark, 0, 1.95, 2.26);       // windscreen
    this.box(truck, 1.2, 0.12, 0.25, this.mats.sign, 0, 2.36, 1.3); // light bar
    for (const x of [-0.95, 0.95]) for (const z of [-1.6, 1.7]) this.box(truck, 0.25, 0.7, 0.7, dark, x, 0.35, z);
    this.box(truck, 1.8, 0.25, 0.3, this.mats.stripe, 0, 0.55, -2.6); // hi-rail wheel frame
    bakeStatic(truck, { vertexMaterial: this.vmat, animated: new Set([this.mats.sign]) });
    this.place(truck, dist + 9, -8.5);
    group.add(truck);
    // "MEN WORKING" board 50 m before the crew
    const sign = new THREE.Group();
    this.box(sign, 0.06, 1.6, 0.06, this.mats.pole, 0, 0.8, 0);
    const board = this.box(sign, 0.06, 0.7, 0.7, this.mats.sign, 0, 1.8, 0);
    board.rotation.x = Math.PI / 4; // diamond
    bakeStatic(sign, { vertexMaterial: this.vmat, animated: new Set([this.mats.sign]) });
    this.place(sign, dist - 50, -3.6);
    group.add(sign);
    this.group.add(group);
    return { dist, workers, violated: false, group };
  }

  private buildBrokenRail(dist: number): void {
    const group = new THREE.Group();
    // Red flag on a stake between the rails' left side
    const flag = new THREE.Group();
    this.box(flag, 0.04, 1.4, 0.04, this.mats.pole, 0, 0.7, 0);
    this.box(flag, 0.02, 0.32, 0.5, this.mats.flag, 0, 1.25, 0.25);
    bakeStatic(flag, { vertexMaterial: this.vmat });
    this.place(flag, dist - 6, -2.0);
    group.add(flag);
    // The crack: a hot glowing sliver on the left rail head
    const glow = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.35),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff4010).multiplyScalar(3) }));
    const tp = this.track.getTrackPoint(dist);
    glow.position.copy(tp.position).addScaledVector(tp.right, -0.8);
    glow.position.y += 0.02;
    glow.rotation.y = Math.atan2(tp.forward.x, tp.forward.z);
    group.add(glow);
    this.group.add(group);
    this.brokenRail = { dist, group, glow, fixed: false };
  }

  /**
   * Animate: workers step back and wave while the consist is near them.
   * @param consistFrom / consistTo - track distances the consist covers
   */
  update(dt: number, consistFrom: number, consistTo: number): void {
    this.time += dt;
    for (const c of this.crews) {
      const near = consistTo > c.dist - 45 && consistFrom < c.dist + 25;
      for (const w of c.workers) {
        const target = near ? 1 : 0;
        const k = Math.min(1, dt * 2.5);
        w.root.userData.back = (w.root.userData.back ?? 0) + (target - (w.root.userData.back ?? 0)) * k;
        // step back away from the track (local +x faces the track after the turn)
        w.root.children[0].position.x = -w.root.userData.back * 1.3;
        w.arm.position.x = 0.31 - w.root.userData.back * 1.3;
        w.arm.rotation.z = near ? 2.4 + Math.sin(this.time * 7 + w.phase) * 0.45 : 0;
      }
    }
    if (this.brokenRail && !this.brokenRail.fixed) {
      const s = 2.5 + Math.sin(this.time * 6) * 0.8;
      (this.brokenRail.glow.material as THREE.MeshBasicMaterial).color.setRGB(s, s * 0.25, s * 0.05);
    }
  }

  /** The rail is welded: the crack stops glowing */
  fixBrokenRail(): void {
    if (!this.brokenRail) return;
    this.brokenRail.fixed = true;
    this.brokenRail.glow.visible = false;
  }
}
