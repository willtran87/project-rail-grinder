/**
 * PassingTrain - Freight train on an adjacent parallel track.
 * Includes a visible second set of rails with ballast shoulder.
 */

import * as THREE from 'three';
import type { RailTrack } from '../rail/RailTrack';

const ADJACENT_OFFSET = 5; // meters to the side
const GAUGE_HALF = 0.8;

export class PassingTrain {
  readonly group: THREE.Group;
  readonly adjacentTrack: THREE.Group;

  private active = false;
  private position = -100;
  private speed = 25;
  private timer = 0;
  private nextEventIn = 30 + Math.random() * 30;
  private hornPlayed = false;
  private audioCtx: AudioContext | null = null;
  private track: RailTrack | null = null;
  private totalLength = 300;

  /** Individual car groups for articulated curve following */
  private cars: { group: THREE.Group; offset: number; halfLen: number }[] = [];

  constructor() {
    this.group = new THREE.Group();
    this.group.visible = false;
    this.adjacentTrack = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x444488, metalness: 0.2, roughness: 0.5 });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.4, roughness: 0.7 });
    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.15, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.85, roughness: 0.3 });
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x3333aa, metalness: 0.2, roughness: 0.5 });
    const hlMat = new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffff88, emissiveIntensity: 2 });

    const addWheels = (g: THREE.Group, len: number) => {
      const off = len * 0.35;
      for (const tz of [-off, off]) {
        for (const s of [-1, 1]) {
          const w = new THREE.Mesh(wheelGeo, wheelMat);
          w.rotation.x = Math.PI / 2; w.position.set(s * GAUGE_HALF, 0.45, tz); g.add(w);
        }
        const uf = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.4), frameMat);
        uf.position.set(0, 0.32, tz); g.add(uf);
      }
    };

    const addCar = (g: THREE.Group, offset: number, halfLen: number) => {
      this.cars.push({ group: g, offset, halfLen });
      this.group.add(g);
    };

    // Locomotive
    const loco = new THREE.Group();
    const locoBody = new THREE.Mesh(new THREE.BoxGeometry(3.0, 3.0, 18), bodyMat);
    locoBody.position.y = 2.2; locoBody.castShadow = true; loco.add(locoBody);
    const cab = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.2, 4.5), cabMat);
    cab.position.set(0, 4.1, -5); loco.add(cab);
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), hlMat);
    hl.position.set(0, 3.0, 9.1); loco.add(hl);
    const hLight = new THREE.PointLight(0xffffff, 4, 35);
    hLight.position.set(0, 3.0, 10); loco.add(hLight);
    // Stripe
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.15, roughness: 0.5 });
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.15, 18.05), stripeMat);
    stripe.position.y = 1.5; loco.add(stripe);
    loco.add(new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.15, 18), frameMat)).position.y = 0.6;
    addWheels(loco, 18);
    addCar(loco, 0, 9);

    // Freight cars
    const colors = [0xaa3333, 0x33aa33, 0x888833, 0x884422, 0x336688, 0x448844, 0x886644, 0x445588];
    for (let i = 0; i < 8; i++) {
      const car = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({ color: colors[i], metalness: 0.15, roughness: 0.55 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.8, 10), mat);
      body.position.y = 2.1; body.castShadow = true; car.add(body);
      car.add(new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.12, 10), frameMat)).position.y = 0.6;
      addWheels(car, 10);
      addCar(car, -(14 + i * 12), 5);
    }
  }

  setTrack(track: RailTrack): void {
    this.track = track;
    this.totalLength = track.totalLength;
    this.buildAdjacentTrack();
  }

  setAudioContext(ctx: AudioContext): void { this.audioCtx = ctx; }

  update(dt: number, grinderDist: number): void {
    if (!this.active) {
      this.timer += dt;
      if (this.timer >= this.nextEventIn) this.startPass(grinderDist);
      return;
    }

    this.position += this.speed * dt;

    // Position each car independently using front/rear bogie positions
    if (this.track) {
      this.group.position.set(0, 0, 0);
      this.group.quaternion.identity();

      const clamp = (d: number) => Math.max(0.1, Math.min(this.totalLength - 0.1, d));
      const worldUp = new THREE.Vector3(0, 1, 0);

      for (const car of this.cars) {
        const centerDist = this.position + car.offset;
        const frontDist = clamp(centerDist + car.halfLen);
        const rearDist = clamp(centerDist - car.halfLen);

        const frontPt = this.track.getTrackPoint(frontDist);
        const rearPt = this.track.getTrackPoint(rearDist);

        // Position at midpoint, offset laterally to adjacent track
        const midPos = new THREE.Vector3().lerpVectors(rearPt.position, frontPt.position, 0.5);
        const midRight = new THREE.Vector3().lerpVectors(rearPt.right, frontPt.right, 0.5).normalize();
        car.group.position.copy(midPos).addScaledVector(midRight, ADJACENT_OFFSET);

        // Orient along the bogie-to-bogie line
        const fwd = new THREE.Vector3().subVectors(frontPt.position, rearPt.position).normalize();
        const right = new THREE.Vector3().crossVectors(worldUp, fwd).normalize();
        const up = new THREE.Vector3().crossVectors(fwd, right).normalize();
        const m = new THREE.Matrix4().makeBasis(right, up, fwd);
        car.group.quaternion.setFromRotationMatrix(m);
      }
    }

    if (!this.hornPlayed && this.position > grinderDist - 20) {
      this.playHorn();
      this.hornPlayed = true;
    }

    if (this.position > grinderDist + 200) {
      this.active = false;
      this.group.visible = false;
      this.timer = 0;
      this.nextEventIn = 60 + Math.random() * 60;
    }
  }

  private startPass(grinderDist: number): void {
    this.active = true;
    this.group.visible = true;
    this.position = grinderDist - 150;
    this.speed = 20 + Math.random() * 15;
    this.hornPlayed = false;
  }

  private playHorn(): void {
    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    for (const freq of [220, 294]) {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth'; osc.frequency.value = freq;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 600;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
      gain.gain.setValueAtTime(0.08, now + 1.0);
      gain.gain.linearRampToValueAtTime(0, now + 1.5);
      osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 1.5);
    }
  }

  /** Build visible adjacent track: rails, ties, ballast, and ballast shoulder */
  private buildAdjacentTrack(): void {
    if (!this.track) return;

    const railMat = new THREE.MeshStandardMaterial({ color: 0x7a7a88, metalness: 0.7, roughness: 0.4 });
    const tieMat = new THREE.MeshStandardMaterial({ color: 0x4a3828, roughness: 0.9 });
    const ballastMat = new THREE.MeshStandardMaterial({ color: 0x707070, roughness: 1 });
    const shoulderMat = new THREE.MeshStandardMaterial({ color: 0x686868, roughness: 1 });

    const ballastGeo = new THREE.BoxGeometry(3.2, 0.25, 5);
    const shoulderGeo = new THREE.BoxGeometry(1.0, 0.15, 5);
    const railGeo = new THREE.BoxGeometry(0.07, 0.2, 5);
    const tieGeo = new THREE.BoxGeometry(2.6, 0.12, 0.18);

    for (let d = 0; d < this.totalLength; d += 5) {
      const tp = this.track.getTrackPoint(d);

      // Compute proper orientation
      const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), tp.forward).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const mat4 = new THREE.Matrix4().makeBasis(right, up, tp.forward);
      const quat = new THREE.Quaternion().setFromRotationMatrix(mat4);

      const basePos = tp.position.clone().addScaledVector(tp.right, ADJACENT_OFFSET);

      // Ballast bed
      const ballast = new THREE.Mesh(ballastGeo, ballastMat);
      ballast.position.copy(basePos);
      ballast.position.y = -0.45;
      ballast.quaternion.copy(quat);
      ballast.receiveShadow = true;
      this.adjacentTrack.add(ballast);

      // Ballast shoulders (left and right of the track bed)
      for (const side of [-1, 1]) {
        const shoulder = new THREE.Mesh(shoulderGeo, shoulderMat);
        shoulder.position.copy(basePos);
        shoulder.position.addScaledVector(right, side * 2.0);
        shoulder.position.y = -0.5;
        shoulder.quaternion.copy(quat);
        shoulder.receiveShadow = true;
        this.adjacentTrack.add(shoulder);
      }

      // Rails
      for (const side of [-1, 1]) {
        const rail = new THREE.Mesh(railGeo, railMat);
        rail.position.copy(basePos);
        rail.position.addScaledVector(right, side * GAUGE_HALF);
        rail.position.y = -0.22;
        rail.quaternion.copy(quat);
        rail.castShadow = true;
        this.adjacentTrack.add(rail);
      }
    }

    // Ties (denser than rail/ballast segments)
    for (let d = 0; d < this.totalLength; d += 0.6) {
      const tp = this.track.getTrackPoint(d);
      const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), tp.forward).normalize();
      const mat4 = new THREE.Matrix4().makeBasis(right, new THREE.Vector3(0, 1, 0), tp.forward);
      const quat = new THREE.Quaternion().setFromRotationMatrix(mat4);

      const tie = new THREE.Mesh(tieGeo, tieMat);
      tie.position.copy(tp.position).addScaledVector(tp.right, ADJACENT_OFFSET);
      tie.position.y = -0.30;
      tie.quaternion.copy(quat);
      tie.receiveShadow = true;
      this.adjacentTrack.add(tie);
    }
  }
}
