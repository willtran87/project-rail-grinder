/**
 * PassingTrain - Freight train on an adjacent parallel track.
 * Includes a visible second set of rails with ballast shoulder.
 */

import * as THREE from 'three';
import type { RailTrack } from '../rail/RailTrack';
import { createBallastGeometry, createBallastMaterial } from './trackBed';
import { bakeStatic, createVertexPbrMaterial } from '../core/bakeStatic';

const ADJACENT_OFFSET = 5; // meters to the side
const GAUGE_HALF = 0.8;

/** Trains on the next track pass the work crew at restricted speed (~25 mph) */
export const WORK_ZONE_SPEED = 11;   // m/s
const FREIGHT_BRAKE = 1.5;           // m/s² — gentle, like a heavy train
const FREIGHT_ACCEL = 0.5;           // m/s²

/**
 * Fastest the freight may go right now. Railroads slow trains on the adjacent
 * track while a work crew is out, so the train brakes before it reaches the
 * work zone (the grinder plus a margin), crawls past, then speeds back up.
 *
 * @param front / rear - the train's ends (distance along the track)
 * @param zoneStart / zoneEnd - the work zone (distance along the track)
 * @param cruise - the train's normal speed
 */
export function freightAllowedSpeed(
  front: number, rear: number, zoneStart: number, zoneEnd: number, cruise: number,
): number {
  if (rear > zoneEnd) return cruise;               // fully past the work zone
  if (front >= zoneStart) return WORK_ZONE_SPEED;  // some of it is in the zone
  // Approaching: the speed that can still brake down to WORK_ZONE_SPEED in time
  const room = zoneStart - front;
  return Math.min(cruise, Math.sqrt(WORK_ZONE_SPEED ** 2 + 2 * FREIGHT_BRAKE * room));
}

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
  /** Normal line speed for this pass (it slows below this near the work crew) */
  private cruiseSpeed = 25;
  private timer = 0;
  private nextEventIn = 30 + Math.random() * 30;
  private hornPlayed = false;
  private audioCtx: AudioContext | null = null;
  private track: RailTrack | null = null;
  private totalLength = 300;

  /** Pool of headlight on the ground ahead of the locomotive (brighter at night) */
  private headlightPool: THREE.Mesh;
  private vertexMat = createVertexPbrMaterial();

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
      // a car's parts never move relative to each other: merge them (one draw
      // call for all plain colours, one shadow-only mesh)
      bakeStatic(g, { vertexMaterial: this.vertexMat, shadowProxy: true });
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
    // Stripe
    const stripeMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.15, roughness: 0.5 });
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.15, 18.05), stripeMat);
    stripe.position.y = 1.5; loco.add(stripe);
    loco.add(new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.15, 18), frameMat)).position.y = 0.6;
    addWheels(loco, 18);
    addCar(loco, 0, 9);
    // Headlight on the ground: a soft pool of light ahead of the locomotive.
    // (A real PointLight would cost something on every lit pixel of the whole
    // scene all the time, even with the train out of sight; this is one quad.)
    this.headlightPool = this.createHeadlightPool();
    loco.add(this.headlightPool);

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

  /**
   * Where the train is right now, as distances along the track
   * (null when no train is passing). Level crossings use this.
   */
  span(): { front: number; rear: number; speed: number } | null {
    if (!this.active) return null;
    // (one reused object: this is asked every frame)
    this._span.front = this.position + 9;
    this._span.rear = this.position - 103;
    this._span.speed = this.speed;
    return this._span;
  }
  private _span = { front: 0, rear: 0, speed: 0 };

  /**
   * A soft oval of light on the ground ahead of the locomotive, drawn with
   * additive blending so it brightens whatever is underneath (ballast, rails).
   */
  private createHeadlightPool(): THREE.Mesh {
    const LENGTH = 30, WIDTH = 9;
    const geo = new THREE.PlaneGeometry(WIDTH, LENGTH);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.ShaderMaterial({
      uniforms: { uStrength: { value: 0 }, uColor: { value: new THREE.Color(0xfff1d0) } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        uniform float uStrength;
        uniform vec3 uColor;
        varying vec2 vUv;
        void main() {
          // brightest just ahead of the nose (v = 1), fading forward and to the sides
          float along = vUv.y;
          float across = abs(vUv.x - 0.5) * 2.0;
          float spread = mix(0.35, 1.0, 1.0 - along);   // widens with distance
          float side = smoothstep(1.0, 0.0, across / spread);
          float fade = smoothstep(0.0, 0.85, along);
          gl_FragColor = vec4(uColor * uStrength * side * fade, 1.0);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -4,
    });
    const pool = new THREE.Mesh(geo, mat);
    // nose of the loco is at z = +9; the pool starts there and runs forward
    pool.position.set(0, 0.05, 9 + LENGTH / 2); // just above the ties and ballast
    pool.renderOrder = 2;
    return pool;
  }

  update(dt: number, grinderDist: number, darkness = 0): void {
    if (!this.active) {
      this.timer += dt;
      if (this.timer >= this.nextEventIn) this.startPass(grinderDist);
      return;
    }

    // Slow down past the work crew, speed back up afterwards
    const allowed = freightAllowedSpeed(
      this.position + 9, this.position - 103, grinderDist - 80, grinderDist + 100, this.cruiseSpeed);
    this.speed = this.speed > allowed
      ? Math.max(allowed, this.speed - FREIGHT_BRAKE * 1.4 * dt)
      : Math.min(allowed, this.speed + FREIGHT_ACCEL * dt);
    this.position += this.speed * dt;

    // Position each car independently using front/rear bogie positions
    if (this.track) {
      this.group.position.set(0, 0, 0);
      this.group.quaternion.identity();

      const clamp = (d: number) => Math.max(0.1, Math.min(this.totalLength - 0.1, d));

      for (const car of this.cars) {
        // Cars beyond either end of the track are hidden (otherwise they'd all
        // be clamped to the track end and pile up in one spot)
        const centre = this.position + car.offset;
        car.group.visible = centre - car.halfLen > 0 && centre + car.halfLen < this.totalLength;
        if (!car.group.visible) continue;
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
      // Headlight pool: hardly visible by day, bright at night
      (this.headlightPool.material as THREE.ShaderMaterial).uniforms.uStrength.value = 0.06 + darkness * 0.42;
    }

    if (!this.hornPlayed && this.position > grinderDist - 20) {
      this.playHorn();
      this.hornPlayed = true;
    }

    // Done once the last car has run off the end of the track (it used to
    // vanish all at once 200 m past the grinder, sometimes in plain view)
    if (this.position - 103 > this.totalLength) {
      this.active = false;
      this.group.visible = false;
      this.timer = 0;
      this.nextEventIn = 60 + Math.random() * 60;
    }
  }

  private startPass(grinderDist: number): void {
    this.active = true;
    this.group.visible = true;
    // Start far enough back to brake for the work zone before anyone sees it
    this.position = grinderDist - 450;
    this.cruiseSpeed = 20 + Math.random() * 15;
    this.speed = Math.min(this.cruiseSpeed, freightAllowedSpeed(
      this.position + 9, this.position - 103, grinderDist - 80, grinderDist + 100, this.cruiseSpeed));
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
    // Same gravel bed as the main track, slightly darker (less maintained line)
    const ballastMat = createBallastMaterial(0xa8a49c);
    const shoulderMat = createBallastMaterial(0x8e8a82);

    const ballastGeo = createBallastGeometry(2.8, 4.4, 0.4, 5.3);
    const shoulderGeo = createBallastGeometry(1.0, 1.4, 0.12, 5.3);
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
      tmpPos.y = -0.33; // top of the ballast bed
      ballastInst.setMatrixAt(i, tmpMat4.compose(tmpPos, tmpQuat, tmpScale));

      // Shoulders
      for (const side of [-1, 1]) {
        const sPos = tmpPos.clone().addScaledVector(tmpRight, side * 2.6);
        sPos.y = -0.52;
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
