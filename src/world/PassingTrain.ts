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

  // Pre-allocated temps for per-frame car positioning
  private _tv1 = new THREE.Vector3();
  private _tv2 = new THREE.Vector3();
  private _tv3 = new THREE.Vector3();
  private _tm = new THREE.Matrix4();
  private _wu = new THREE.Vector3(0, 1, 0);

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

      for (const car of this.cars) {
        const frontPt = this.track.getTrackPoint(clamp(this.position + car.offset + car.halfLen));
        const rearPt = this.track.getTrackPoint(clamp(this.position + car.offset - car.halfLen));

        // Reuse pre-allocated temps (avoids 55 objects/frame)
        car.group.position.lerpVectors(rearPt.position, frontPt.position, 0.5);
        this._tv1.lerpVectors(rearPt.right, frontPt.right, 0.5).normalize();
        car.group.position.addScaledVector(this._tv1, ADJACENT_OFFSET);

        const fwd = this._tv1.subVectors(frontPt.position, rearPt.position).normalize();
        const right = this._tv2.crossVectors(this._wu, fwd).normalize();
        const up = this._tv3.crossVectors(fwd, right).normalize();
        car.group.quaternion.setFromRotationMatrix(this._tm.makeBasis(right, up, fwd));
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

  /** Build visible adjacent track using InstancedMesh (~5 draw calls instead of ~800) */
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

    const chunkCount = Math.floor(this.totalLength / 5);
    const tieCount = Math.floor(this.totalLength / 0.6);

    const ballastInst = new THREE.InstancedMesh(ballastGeo, ballastMat, chunkCount);
    const shoulderInst = new THREE.InstancedMesh(shoulderGeo, shoulderMat, chunkCount * 2);
    const railInst = new THREE.InstancedMesh(railGeo, railMat, chunkCount * 2);
    const tieInst = new THREE.InstancedMesh(tieGeo, tieMat, tieCount);

    ballastInst.receiveShadow = true;
    shoulderInst.receiveShadow = true;
    railInst.castShadow = true;
    tieInst.receiveShadow = true;

    const tmpPos = new THREE.Vector3();
    const tmpRight = new THREE.Vector3();
    const tmpMat4 = new THREE.Matrix4();
    const tmpQuat = new THREE.Quaternion();
    const tmpScale = new THREE.Vector3(1, 1, 1);
    const worldUp = new THREE.Vector3(0, 1, 0);

    let shoulderIdx = 0;
    let railIdx = 0;

    for (let i = 0; i < chunkCount; i++) {
      const d = i * 5;
      const tp = this.track.getTrackPoint(d);

      tmpRight.crossVectors(worldUp, tp.forward).normalize();
      const orientMat = tmpMat4.makeBasis(tmpRight, worldUp, tp.forward);
      tmpQuat.setFromRotationMatrix(orientMat);

      tmpPos.copy(tp.position).addScaledVector(tp.right, ADJACENT_OFFSET);

      // Ballast
      tmpPos.y = -0.45;
      ballastInst.setMatrixAt(i, tmpMat4.compose(tmpPos, tmpQuat, tmpScale));

      // Shoulders
      for (const side of [-1, 1]) {
        const sPos = tmpPos.clone().addScaledVector(tmpRight, side * 2.0);
        sPos.y = -0.5;
        shoulderInst.setMatrixAt(shoulderIdx++, tmpMat4.compose(sPos, tmpQuat, tmpScale));
      }

      // Rails
      for (const side of [-1, 1]) {
        const rPos = tmpPos.clone().addScaledVector(tmpRight, side * GAUGE_HALF);
        rPos.y = -0.22;
        railInst.setMatrixAt(railIdx++, tmpMat4.compose(rPos, tmpQuat, tmpScale));
      }
    }

    // Ties
    for (let i = 0; i < tieCount; i++) {
      const d = i * 0.6;
      const tp = this.track.getTrackPoint(d);
      tmpRight.crossVectors(worldUp, tp.forward).normalize();
      tmpQuat.setFromRotationMatrix(tmpMat4.makeBasis(tmpRight, worldUp, tp.forward));
      tmpPos.copy(tp.position).addScaledVector(tp.right, ADJACENT_OFFSET);
      tmpPos.y = -0.30;
      tieInst.setMatrixAt(i, tmpMat4.compose(tmpPos, tmpQuat, tmpScale));
    }

    this.adjacentTrack.add(ballastInst, shoulderInst, railInst, tieInst);
  }
}
