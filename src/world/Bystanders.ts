/**
 * Bystanders - People who come out to watch the grinder go by:
 *
 *   RAILFANS  at level crossings, one with a camera on a tripod (it flashes
 *             as you pass)
 *   PLATFORM  a little halt with a shelter; kids wave from it
 *
 * Everyone waves while the consist is close. Bodies are merged into one mesh;
 * the waving arms are one InstancedMesh and the camera flashes another, so the
 * whole crowd is three draw calls.
 */

import * as THREE from 'three';
import type { RailTrack } from '../rail/RailTrack';
import { bakeStatic, createVertexPbrMaterial } from '../core/bakeStatic';

const GROUND_Y = -0.6;

interface Person {
  /** Shoulder (arm pivot) in world space */
  shoulder: THREE.Vector3;
  yaw: number;
  dist: number;
  scale: number;
  phase: number;
  wave: number;
}

const SHIRTS = [0x3a6ea5, 0xc0392b, 0x2e8b57, 0xe0a030, 0x7a4fa0, 0xdddddd, 0x333333];
const SKIN = [0xe0b48c, 0xb07850, 0x7a4e30, 0xf0c8a0];

export class Bystanders {
  readonly group = new THREE.Group();
  /** Where the platform stands (track distances), for keeping scenery off it */
  readonly platform: { from: number; to: number } | null;
  private people: Person[] = [];
  private arms!: THREE.InstancedMesh;
  private flashes!: THREE.InstancedMesh;
  private cameras: { pos: THREE.Vector3; dist: number; timer: number; flash: number }[] = [];
  private vmat = createVertexPbrMaterial();
  private time = 0;
  private _m = new THREE.Matrix4();
  private _q = new THREE.Quaternion();
  private _q2 = new THREE.Quaternion();
  private _s = new THREE.Vector3();
  private _z = new THREE.Vector3(0, 0, 1);
  private _y = new THREE.Vector3(0, 1, 0);

  /**
   * @param crossings - track distances of the level crossings
   * @param platformAt - track distance for the platform (null: none)
   */
  constructor(private track: RailTrack, crossings: number[], platformAt: number | null, seed: number) {
    let s = seed >>> 0 || 7;
    const rand = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
    const bodies = new THREE.Group();
    // Railfans at up to two crossings, standing back from the road
    for (const c of crossings.slice(0, 2)) {
      const n = 2 + Math.floor(rand() * 2);
      for (let i = 0; i < n; i++) this.addPerson(bodies, c + 5 + i * 1.4, -(6.5 + rand() * 1.5), 1, rand);
      // the camera on its tripod
      const tp = this.track.getTrackPoint(c + 4);
      const cam = tp.position.clone().addScaledVector(tp.right, -6.2);
      cam.y = GROUND_Y + 1.45;
      const tri = new THREE.Group();
      for (let k = 0; k < 3; k++) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.45, 0.03), new THREE.MeshStandardMaterial({ color: 0x222222 }));
        const a = (k / 3) * Math.PI * 2;
        leg.position.set(Math.cos(a) * 0.18, -0.72, Math.sin(a) * 0.18);
        leg.rotation.set(Math.sin(a) * 0.15, 0, -Math.cos(a) * 0.15);
        tri.add(leg);
      }
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.22), new THREE.MeshStandardMaterial({ color: 0x1a1a1a }));
      tri.add(body);
      tri.position.copy(cam);
      tri.rotation.y = Math.atan2(tp.forward.x, tp.forward.z) + Math.PI / 2;
      bodies.add(tri);
      this.cameras.push({ pos: cam, dist: c + 4, timer: 0, flash: 0 });
    }
    // The platform: a slab with a shelter, and kids (and a parent) waving
    this.platform = platformAt === null ? null : { from: platformAt - 9, to: platformAt + 9 };
    if (platformAt !== null) {
      const tp = this.track.getTrackPoint(platformAt);
      const yaw = Math.atan2(tp.forward.x, tp.forward.z);
      const slab = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 18), new THREE.MeshStandardMaterial({ color: 0x9a968e, roughness: 0.95 }));
      slab.position.copy(tp.position).addScaledVector(tp.right, -4.6).setY(GROUND_Y + 0.25);
      slab.rotation.y = yaw;
      bodies.add(slab);
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.02, 18), new THREE.MeshStandardMaterial({ color: 0xe8d020 }));
      edge.position.copy(tp.position).addScaledVector(tp.right, -3.25).setY(GROUND_Y + 0.51);
      edge.rotation.y = yaw;
      bodies.add(edge);
      // shelter: posts and a roof
      const shelter = new THREE.Group();
      const post = (x: number, z: number) => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.4, 0.1), new THREE.MeshStandardMaterial({ color: 0x4a4f55 })); p.position.set(x, 1.2, z); shelter.add(p); };
      post(-0.9, -2); post(-0.9, 2); post(0.9, -2); post(0.9, 2);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 5), new THREE.MeshStandardMaterial({ color: 0x8a2d24 }));
      roof.position.set(0, 2.45, 0); shelter.add(roof);
      const bench = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 3), new THREE.MeshStandardMaterial({ color: 0x6b4a2e }));
      bench.position.set(-0.6, 0.22, 0); shelter.add(bench);
      const signPost = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.2, 0.08), new THREE.MeshStandardMaterial({ color: 0x333333 }));
      signPost.position.set(0.6, 1.1, 6); shelter.add(signPost);
      const sign = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.5, 1.6), new THREE.MeshStandardMaterial({ color: 0x1c3f7a }));
      sign.position.set(0.6, 2.2, 6); shelter.add(sign);
      shelter.position.copy(tp.position).addScaledVector(tp.right, -5.3).setY(GROUND_Y + 0.5);
      shelter.rotation.y = yaw;
      bodies.add(shelter);
      for (let i = 0; i < 5; i++) {
        const kid = i < 4;
        this.addPerson(bodies, platformAt - 6 + i * 2.6 + rand(), -(3.9 + rand() * 0.6), kid ? 0.62 + rand() * 0.12 : 1, rand, GROUND_Y + 0.5);
      }
    }
    bakeStatic(bodies, { vertexMaterial: this.vmat });
    this.group.add(bodies);

    // Waving arms (one instance each) and camera flashes
    const armGeo = new THREE.BoxGeometry(0.12, 0.56, 0.14).translate(0, -0.28, 0);
    this.arms = new THREE.InstancedMesh(armGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), Math.max(1, this.people.length));
    this.people.forEach((p, i) => this.arms.setColorAt(i, new THREE.Color(SHIRTS[i % SHIRTS.length])));
    this.arms.count = this.people.length;
    this.arms.castShadow = true;
    this.arms.frustumCulled = false;
    this.flashes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 0.12, 0.12),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 1, 1).multiplyScalar(6) }), Math.max(1, this.cameras.length));
    this.flashes.count = this.cameras.length;
    this.flashes.frustumCulled = false;
    this.group.add(this.arms, this.flashes);
    this.update(0, -1e9, -1e9);
  }

  /** One person: legs, body, head and the arm that doesn't wave (baked); the waving arm is an instance */
  private addPerson(g: THREE.Group, dist: number, lateral: number, scale: number, rand: () => number, floor = GROUND_Y): void {
    const tp = this.track.getTrackPoint(Math.max(0.1, Math.min(this.track.totalLength - 0.1, dist)));
    const p = new THREE.Group();
    const shirt = SHIRTS[Math.floor(rand() * SHIRTS.length)];
    const mat = (c: number) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 });
    const box = (w: number, h: number, d: number, c: number, x: number, y: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(c)); m.position.set(x, y, 0); m.castShadow = true; p.add(m);
    };
    box(0.15, 0.8, 0.17, 0x2a3550, -0.11, 0.4);
    box(0.15, 0.8, 0.17, 0x2a3550, 0.11, 0.4);
    box(0.44, 0.6, 0.26, shirt, 0, 1.1);
    box(0.12, 0.56, 0.14, shirt, -0.29, 1.12);
    box(0.21, 0.23, 0.21, SKIN[Math.floor(rand() * SKIN.length)], 0, 1.55);
    if (rand() < 0.5) box(0.26, 0.08, 0.26, [0xc0392b, 0x222222, 0x2e5fa0][Math.floor(rand() * 3)], 0, 1.7);
    const yaw = Math.atan2(tp.forward.x, tp.forward.z) + Math.PI / 2 + (rand() - 0.5) * 0.5; // face the track
    p.position.copy(tp.position).addScaledVector(tp.right, lateral).setY(floor);
    p.rotation.y = yaw;
    p.scale.setScalar(scale);
    g.add(p);
    // Right shoulder in world space
    const shoulder = new THREE.Vector3(0.29 * scale, 1.38 * scale, 0).applyAxisAngle(this._y, yaw).add(p.position);
    this.people.push({ shoulder, yaw, dist, scale, phase: rand() * 6, wave: 0 });
  }

  /** @param consistFrom / consistTo - track distances the consist covers */
  update(dt: number, consistFrom: number, consistTo: number): void {
    this.time += dt;
    this.people.forEach((p, i) => {
      const near = consistTo > p.dist - 60 && consistFrom < p.dist + 30;
      p.wave += ((near ? 1 : 0) - p.wave) * Math.min(1, dt * 3);
      // Arm up and waving side to side when near, hanging down otherwise
      const angle = p.wave * (2.5 + Math.sin(this.time * (p.scale < 0.9 ? 9 : 6) + p.phase) * 0.45);
      this._q.setFromAxisAngle(this._y, p.yaw).multiply(this._q2.setFromAxisAngle(this._z, angle));
      this.arms.setMatrixAt(i, this._m.compose(p.shoulder, this._q, this._s.setScalar(p.scale)));
    });
    this.arms.instanceMatrix.needsUpdate = true;
    // Railfan cameras: a flash now and then while the consist goes by
    this.cameras.forEach((c, i) => {
      const near = consistTo > c.dist - 40 && consistFrom < c.dist + 10;
      c.timer -= dt;
      if (near && c.timer <= 0) { c.timer = 0.7 + Math.random() * 1.6; c.flash = 0.07; }
      c.flash = Math.max(0, c.flash - dt);
      this.flashes.setMatrixAt(i, this._m.compose(c.pos, this._q.identity(), this._s.setScalar(c.flash > 0 ? 1 : 0.0001)));
    });
    this.flashes.instanceMatrix.needsUpdate = true;
  }
}
