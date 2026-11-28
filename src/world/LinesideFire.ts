/**
 * LinesideFire - A grass fire started by grinding sparks, and the water-car
 * spray that puts it out.
 *
 * In dry weather, hot stones can set the trackside grass alight behind the
 * consist. The fire grows until the crew stops and sprays it from the water
 * car (hold X / gamepad X near the fire). Purely the visuals + state here;
 * Game decides when fires start and what they cost.
 *
 * No real lights (see Performance Notes): the flames are additive, glowing
 * cones that the bloom pass turns into firelight, plus a few smoke puffs.
 */

import * as THREE from 'three';

const FLAMES = 7;
const SMOKE = 8;
const SPRAY = 160;

export class LinesideFire {
  readonly group = new THREE.Group();
  /** True while a fire is burning */
  active = false;
  /** 0..1 how big it has grown */
  size = 0;
  /** 0..1 how close the crew is to putting it out */
  doused = 0;
  /** Distance along the track where it's burning */
  dist = 0;

  private flames: THREE.Mesh[] = [];
  private smoke: THREE.Mesh[] = [];
  private spray: THREE.Points;
  private sprayVel = new Float32Array(SPRAY * 3);
  private sprayLife = new Float32Array(SPRAY);
  private time = 0;
  private spraying = false;
  private sprayFrom = new THREE.Vector3();

  constructor() {
    const flameGeo = new THREE.ConeGeometry(0.35, 1.4, 6, 1, true);
    flameGeo.translate(0, 0.7, 0);
    for (let i = 0; i < FLAMES; i++) {
      const m = new THREE.Mesh(flameGeo, new THREE.MeshBasicMaterial({
        color: new THREE.Color(i % 2 ? 0xff7a1a : 0xffc040).multiplyScalar(2.2), // > 1: bloom glow
        transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false,
        side: THREE.DoubleSide, forceSinglePass: true,
      }));
      this.flames.push(m);
      this.group.add(m);
    }
    const smokeGeo = new THREE.IcosahedronGeometry(0.6, 0);
    const smokeMat = new THREE.MeshBasicMaterial({ color: 0x3a3a3a, transparent: true, opacity: 0.45, depthWrite: false });
    for (let i = 0; i < SMOKE; i++) {
      const s = new THREE.Mesh(smokeGeo, smokeMat);
      this.smoke.push(s);
      this.group.add(s);
    }
    // Water spray: one Points cloud, simulated only while spraying
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SPRAY * 3), 3));
    this.spray = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xcfe8ff, size: 0.18, transparent: true, opacity: 0.8, depthWrite: false,
    }));
    this.spray.frustumCulled = false;
    this.spray.visible = false;
    this.group.visible = false;
  }

  /** The spray lives in world space (not inside the fire group) — add this to the scene too */
  get sprayObject(): THREE.Points { return this.spray; }

  ignite(position: THREE.Vector3, dist: number): void {
    this.active = true;
    this.size = 0.15;
    this.doused = 0;
    this.dist = dist;
    this.group.position.copy(position);
    this.group.visible = true;
  }

  /** Spray from the water car's nozzle at the fire (called every frame while X is held) */
  setSpraying(on: boolean, from?: THREE.Vector3): void {
    this.spraying = on;
    if (from) this.sprayFrom.copy(from);
  }

  /**
   * @param growRate - how fast it spreads (dry, windy days: faster)
   * @param sprayReaches - the spray is close enough to hit it
   * @returns 'out' the moment it's put out, else null
   */
  update(dt: number, growRate: number, sprayReaches: boolean): 'out' | null {
    this.time += dt;
    this.updateSpray(dt);
    if (!this.active) return null;
    if (this.spraying && sprayReaches) {
      this.doused = Math.min(1, this.doused + dt / (1.5 + this.size * 2.5));
      this.size = Math.max(0.05, this.size - dt * 0.15);
    } else {
      this.size = Math.min(1, this.size + dt * growRate);
      this.doused = Math.max(0, this.doused - dt * 0.2);
    }
    // Flames: flicker and spread with size
    const spread = 0.6 + this.size * 3.2;
    this.flames.forEach((f, i) => {
      const a = (i / FLAMES) * Math.PI * 2;
      const flick = 0.75 + 0.35 * Math.sin(this.time * (9 + i) + i * 1.7);
      f.position.set(Math.cos(a) * spread * 0.5 * (i % 3) / 2, 0, Math.sin(a) * spread * 0.7 * ((i + 1) % 3) / 2);
      f.scale.set(0.7 + this.size, (0.5 + this.size * 1.4) * flick * (1 - this.doused * 0.8), 0.7 + this.size);
      (f.material as THREE.MeshBasicMaterial).opacity = 0.85 * (1 - this.doused);
    });
    // Smoke: puffs rising and drifting, more of it as the fire grows (and when doused: steam)
    this.smoke.forEach((s, i) => {
      const t = ((this.time * 0.35 + i / SMOKE) % 1);
      s.position.set(Math.sin(i * 2.3) * spread * 0.4 + t * 2.5, 1 + t * (4 + this.size * 6), Math.cos(i * 1.7) * spread * 0.4);
      s.scale.setScalar((0.6 + t * 2.2) * (0.4 + this.size));
      s.visible = t < 0.95;
    });
    if (this.doused >= 1) {
      this.active = false;
      this.group.visible = false;
      return 'out';
    }
    return null;
  }

  /** Water droplets arcing from the nozzle toward the fire */
  private updateSpray(dt: number): void {
    const pos = this.spray.geometry.getAttribute('position') as THREE.BufferAttribute;
    const p = pos.array as Float32Array;
    let alive = 0;
    const target = this.group.position;
    for (let i = 0; i < SPRAY; i++) {
      if (this.sprayLife[i] <= 0) {
        if (!this.spraying || Math.random() > 0.35) { p[i * 3 + 1] = -100; continue; }
        // new droplet: aimed at the fire, with spread
        p[i * 3] = this.sprayFrom.x; p[i * 3 + 1] = this.sprayFrom.y; p[i * 3 + 2] = this.sprayFrom.z;
        const dx = target.x - this.sprayFrom.x, dz = target.z - this.sprayFrom.z;
        const d = Math.max(1, Math.hypot(dx, dz));
        const speed = 9;
        const tFlight = d / speed;
        this.sprayVel[i * 3] = (dx / d) * speed + (Math.random() - 0.5) * 1.5;
        this.sprayVel[i * 3 + 2] = (dz / d) * speed + (Math.random() - 0.5) * 1.5;
        this.sprayVel[i * 3 + 1] = 4.9 * tFlight - (this.sprayFrom.y - target.y) / tFlight + (Math.random() - 0.5);
        this.sprayLife[i] = tFlight * 1.1;
      }
      this.sprayLife[i] -= dt;
      this.sprayVel[i * 3 + 1] -= 9.8 * dt;
      p[i * 3] += this.sprayVel[i * 3] * dt;
      p[i * 3 + 1] += this.sprayVel[i * 3 + 1] * dt;
      p[i * 3 + 2] += this.sprayVel[i * 3 + 2] * dt;
      alive++;
    }
    this.spray.visible = alive > 0;
    if (alive > 0) pos.needsUpdate = true;
  }

  /** Put it out instantly (new job) */
  reset(): void {
    this.active = false;
    this.group.visible = false;
    this.spraying = false;
    this.sprayLife.fill(0);
  }
}
