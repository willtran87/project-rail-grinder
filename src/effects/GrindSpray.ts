/**
 * GrindSpray - Two small particle clouds under the grinding cars:
 *
 *   CHIPS  ballast grit and metal fines flicked out by the stones. They arc
 *          out sideways, drop, and bounce once on the ballast.
 *   WATER  the fire-suppression mist real grinders spray around the stones:
 *          a fine pale haze that drifts back and fades.
 *
 * One Points draw each, built at start-up (so the shader warm-up covers them)
 * and simulated in place: no objects are created while playing.
 */

import * as THREE from 'three';

const CHIPS = 220;
const MIST = 260;
const GROUND_Y = -0.42; // top of the ballast shoulder

interface Cloud {
  points: THREE.Points;
  pos: Float32Array;
  vel: Float32Array;
  life: Float32Array;
  next: number;
}

function makeCloud(count: number, material: THREE.PointsMaterial): Cloud {
  const pos = new Float32Array(count * 3).fill(-1000);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const points = new THREE.Points(geo, material);
  points.frustumCulled = false;
  return { points, pos, vel: new Float32Array(count * 3), life: new Float32Array(count), next: 0 };
}

export interface SprayPoint { position: THREE.Vector3; forward: THREE.Vector3; right: THREE.Vector3 }

export class GrindSpray {
  private chips = makeCloud(CHIPS, new THREE.PointsMaterial({ color: 0x8a7a66, size: 0.07, depthWrite: true }));
  private mist = makeCloud(MIST, new THREE.PointsMaterial({
    color: 0xdfeaf2, size: 0.14, transparent: true, opacity: 0.13, depthWrite: false,
  }));
  private active = false;
  /** 0..1 extra mist when it's raining (the rail throws up wet spray too) */
  wet = 0;

  addTo(scene: THREE.Scene): void {
    scene.add(this.chips.points, this.mist.points);
  }

  private spawn(c: Cloud, count: number, at: THREE.Vector3, vx: number, vy: number, vz: number, life: number): void {
    const n = c.life.length;
    const i = c.next;
    c.next = (c.next + 1) % n;
    c.pos[i * 3] = at.x; c.pos[i * 3 + 1] = at.y; c.pos[i * 3 + 2] = at.z;
    c.vel[i * 3] = vx; c.vel[i * 3 + 1] = vy; c.vel[i * 3 + 2] = vz;
    c.life[i] = life;
    void count;
  }

  private _p = new THREE.Vector3();

  /** Emit for this frame from each stone (call while grinding) */
  emit(dt: number, stones: SprayPoint[], pressure: number): void {
    this.active = true;
    const chipRate = 6 * (pressure / 50);    // per stone per second (~32 stones)
    const mistRate = 2 * (1 + this.wet);
    for (const s of stones) {
      // chips: out to either side of the rail, a little backward
      let n = chipRate * dt;
      while (n > 0) {
        if (n < 1 && Math.random() > n) break;
        n--;
        const side = Math.random() < 0.5 ? -1 : 1;
        this._p.copy(s.position).addScaledVector(s.right, side * 0.8);
        this._p.y += 0.05;
        const out = side * (1 + Math.random() * 2.2);
        const back = -0.5 - Math.random() * 1.5;
        this.spawn(this.chips, 1, this._p,
          s.right.x * out + s.forward.x * back, 1 + Math.random() * 2, s.right.z * out + s.forward.z * back,
          0.8 + Math.random() * 0.5);
      }
      // mist: around the stone, drifting back and up
      n = mistRate * dt;
      while (n > 0) {
        if (n < 1 && Math.random() > n) break;
        n--;
        const side = Math.random() < 0.5 ? -1 : 1;
        this._p.copy(s.position).addScaledVector(s.right, side * (0.6 + Math.random() * 0.5));
        this._p.y += 0.15;
        this.spawn(this.mist, 1, this._p,
          -s.forward.x * 1.2 + (Math.random() - 0.5) * 0.6, 0.3 + Math.random() * 0.5,
          -s.forward.z * 1.2 + (Math.random() - 0.5) * 0.6, 0.6 + Math.random() * 0.6);
      }
    }
  }

  stop(): void { this.active = false; }

  update(dt: number): void {
    this.step(this.chips, dt, 9.8, true);
    this.step(this.mist, dt, -0.2, false);
    void this.active;
  }

  private step(c: Cloud, dt: number, gravity: number, bounce: boolean): void {
    let alive = false;
    const { pos, vel, life } = c;
    for (let i = 0; i < life.length; i++) {
      if (life[i] <= 0) continue;
      life[i] -= dt;
      if (life[i] <= 0) { pos[i * 3 + 1] = -1000; continue; }
      alive = true;
      vel[i * 3 + 1] -= gravity * dt;
      pos[i * 3] += vel[i * 3] * dt;
      pos[i * 3 + 1] += vel[i * 3 + 1] * dt;
      pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
      if (bounce && pos[i * 3 + 1] < GROUND_Y && vel[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = GROUND_Y;
        vel[i * 3 + 1] *= -0.3;
        vel[i * 3] *= 0.4;
        vel[i * 3 + 2] *= 0.4;
      }
    }
    c.points.visible = alive;
    if (alive) (c.points.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
  }
}
