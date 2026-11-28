/**
 * Atmos - Small touches that make the world feel alive:
 *
 *   PUDDLES      dark glossy pools on the ballast shoulders, filling with rain
 *   DRIPS        water dripping off the car roofs when wet; snow blowing off
 *                them when it snows
 *   NIGHT LIGHTS a far-off town glowing on the horizon at night, and an
 *                aircraft blinking across the sky
 *   TUMBLEWEEDS  rolling across the prairie in the wind
 *   FROST        cold mountain mornings glitter
 *   WIND         one shared "wind" uniform that sways trees and bushes
 *                (see applyWindSway) and slants the rain
 *
 * Each is one draw call, built per job, simulated in place.
 */

import * as THREE from 'three';
import type { RailTrack } from '../rail/RailTrack';
import type { Region } from '../types/rail';

const PUDDLES = 240;
const DRIPS = 160;
const TOWN = 220;
const WEEDS = 6;
const FROST = 260;

/** Shared by every swaying material */
export const windUniforms = { uWindTime: { value: 0 }, uWind: { value: 0.3 } };

/**
 * Make an (instanced) foliage material sway in the wind: the top of each
 * plant moves, the base stays put, and each plant has its own phase.
 */
export function applyWindSway(mat: THREE.Material): void {
  const prev = mat.onBeforeCompile;
  mat.onBeforeCompile = (shader, r) => {
    prev?.call(mat, shader, r);
    Object.assign(shader.uniforms, windUniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uWindTime;\nuniform float uWind;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        #ifdef USE_INSTANCING
          vec2 plant = instanceMatrix[3].xz;
        #else
          vec2 plant = vec2(0.0);
        #endif
        float sway = sin(uWindTime * 1.7 + plant.x * 0.37 + plant.y * 0.21) + 0.4 * sin(uWindTime * 3.1 + plant.y);
        float h = max(0.0, position.y + 0.5);
        transformed.x += sway * uWind * 0.09 * h;
        transformed.z += sway * uWind * 0.05 * h;`);
  };
  const key = mat.customProgramCacheKey?.bind(mat);
  mat.customProgramCacheKey = () => (key ? key() : '') + '-wind';
  mat.needsUpdate = true;
}

export class Atmos {
  readonly group = new THREE.Group();
  private puddles: THREE.InstancedMesh;
  private puddleMat: THREE.MeshStandardMaterial;
  private drips: THREE.Points;
  private dripPos = new Float32Array(DRIPS * 3);
  private dripVel = new Float32Array(DRIPS * 3);
  private dripLife = new Float32Array(DRIPS);
  private dripNext = 0;
  private dripMat: THREE.PointsMaterial;
  private town: THREE.Points;
  private townMat: THREE.PointsMaterial;
  private plane: THREE.Mesh;
  private planeT = Math.random() * 100;
  private weeds: THREE.InstancedMesh | null = null;
  private weedState: { pos: THREE.Vector3; roll: number; speed: number }[] = [];
  private frost: THREE.Points | null = null;
  private frostMat: THREE.PointsMaterial | null = null;
  private time = 0;
  private m = new THREE.Matrix4();
  private q = new THREE.Quaternion();
  private e = new THREE.Euler();
  private s = new THREE.Vector3(1, 1, 1);

  constructor(private track: RailTrack, private region: Region) {
    // ---- Puddles on the ballast shoulders ----
    this.puddleMat = new THREE.MeshStandardMaterial({
      color: 0x1a2028, roughness: 0.04, metalness: 0.7, transparent: true, opacity: 0, depthWrite: false,
    });
    this.puddles = new THREE.InstancedMesh(new THREE.CircleGeometry(0.5, 10).rotateX(-Math.PI / 2), this.puddleMat, PUDDLES);
    for (let i = 0; i < PUDDLES; i++) {
      const d = Math.random() * track.totalLength;
      const tp = track.getTrackPoint(d);
      const side = Math.random() < 0.5 ? -1 : 1;
      // just off the ballast toe, where water collects (the shoulder itself drains)
      const p = tp.position.clone().addScaledVector(tp.right, side * (3.3 + Math.random() * 1.6));
      p.y = -0.57;
      this.s.set(0.6 + Math.random() * 1.2, 1, 0.4 + Math.random() * 0.8);
      this.e.set(0, Math.random() * Math.PI, 0);
      this.m.compose(p, this.q.setFromEuler(this.e), this.s);
      this.puddles.setMatrixAt(i, this.m);
    }
    this.puddles.visible = false;
    this.group.add(this.puddles);

    // ---- Drips / blown snow off the roofs ----
    this.dripPos.fill(-1000);
    const dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.BufferAttribute(this.dripPos, 3));
    this.dripMat = new THREE.PointsMaterial({ color: 0xbfd6ea, size: 0.06, transparent: true, opacity: 0.7, depthWrite: false });
    this.drips = new THREE.Points(dg, this.dripMat);
    this.drips.frustumCulled = false;
    this.group.add(this.drips);

    // ---- A town glowing on the horizon, and an aircraft ----
    const tpos = new Float32Array(TOWN * 3);
    const tcol = new Float32Array(TOWN * 3);
    const mid = track.getTrackPoint(track.totalLength * 0.6);
    const side = region === 'coast' ? 1 : (Math.random() < 0.5 ? -1 : 1);
    const centre = mid.position.clone().addScaledVector(mid.right, side * 330);
    for (let i = 0; i < TOWN; i++) {
      const r = Math.pow(Math.random(), 1.6) * 90;
      const a = Math.random() * Math.PI * 2;
      tpos[i * 3] = centre.x + Math.cos(a) * r;
      tpos[i * 3 + 1] = -0.5 + Math.random() * (r < 25 ? 6 : 2);
      tpos[i * 3 + 2] = centre.z + Math.sin(a) * r * 0.6;
      const warm = Math.random();
      tcol[i * 3] = 2.2; tcol[i * 3 + 1] = 1.4 + warm * 0.6; tcol[i * 3 + 2] = 0.6 + warm * 0.8; // > 1: glows
    }
    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.BufferAttribute(tpos, 3));
    tg.setAttribute('color', new THREE.BufferAttribute(tcol, 3));
    this.townMat = new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: 0, depthWrite: false });
    this.town = new THREE.Points(tg, this.townMat);
    this.town.visible = false;
    this.group.add(this.town);
    this.plane = new THREE.Mesh(new THREE.SphereGeometry(0.6, 6, 4), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 0.3, 0.2), fog: false }));
    this.plane.visible = false;
    this.group.add(this.plane);

    // ---- Tumbleweeds on the prairie ----
    if (region === 'prairie' || region === 'desert') {
      const geo = new THREE.IcosahedronGeometry(0.45, 1);
      this.weeds = new THREE.InstancedMesh(geo, new THREE.MeshLambertMaterial({ color: 0x9a7a48, wireframe: true }), WEEDS);
      this.weeds.frustumCulled = false;
      for (let i = 0; i < WEEDS; i++) this.weedState.push({ pos: new THREE.Vector3(), roll: 0, speed: 2 + Math.random() * 2.5 });
      this.group.add(this.weeds);
    }

    // ---- Frost glitter on mountain mornings ----
    if (region === 'mountain') {
      const fp = new Float32Array(FROST * 3);
      for (let i = 0; i < FROST; i++) {
        const tp = track.getTrackPoint(Math.random() * track.totalLength);
        const p = tp.position.clone().addScaledVector(tp.right, (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * 16));
        fp[i * 3] = p.x; fp[i * 3 + 1] = -0.55; fp[i * 3 + 2] = p.z;
      }
      const fg = new THREE.BufferGeometry();
      fg.setAttribute('position', new THREE.BufferAttribute(fp, 3));
      this.frostMat = new THREE.PointsMaterial({ color: new THREE.Color(2.5, 2.6, 3), size: 0.05, transparent: true, opacity: 0, depthWrite: false });
      this.frost = new THREE.Points(fg, this.frostMat);
      this.frost.visible = false;
      this.group.add(this.frost);
    }
  }

  /**
   * @param grinderPos - distance of the consist's middle
   * @param carDists - distances of each car (for drips off the roofs)
   * @param wet / snowing / darkness / dawn - the weather and light
   */
  update(dt: number, camera: THREE.Camera, carDists: number[], wet: number, snowing: boolean, darkness: number, dawn: number, wind: number): void {
    this.time += dt;
    windUniforms.uWindTime.value = this.time;
    windUniforms.uWind.value += (wind - windUniforms.uWind.value) * Math.min(1, dt);

    // Puddles fade in with the wet
    this.puddles.visible = wet > 0.05;
    this.puddleMat.opacity = Math.min(0.85, wet * 1.1);

    // Drips (wet) / blown snow (snowing) off the roofs near the camera
    const emitting = wet > 0.25 || snowing;
    if (emitting) {
      this.dripMat.color.setHex(snowing ? 0xf2f6fa : 0xbfd6ea);
      this.dripMat.size = snowing ? 0.09 : 0.06;
      const rate = snowing ? 30 : 40 * wet;
      let n = rate * dt;
      while (n > 0) {
        if (n < 1 && Math.random() > n) break;
        n--;
        const d = carDists[Math.floor(Math.random() * carDists.length)] + (Math.random() - 0.5) * 16;
        const tp = this.track.getTrackPoint(Math.max(0.1, Math.min(this.track.totalLength - 0.1, d)));
        const side = Math.random() < 0.5 ? -1 : 1;
        const i = this.dripNext;
        this.dripNext = (this.dripNext + 1) % DRIPS;
        const lat = snowing ? side * Math.random() * 1.1 : side * 1.55;
        this.dripPos[i * 3] = tp.position.x + tp.right.x * lat;
        this.dripPos[i * 3 + 1] = tp.position.y + (snowing ? 4.5 : 3.6);
        this.dripPos[i * 3 + 2] = tp.position.z + tp.right.z * lat;
        this.dripVel[i * 3] = snowing ? 2.5 + Math.random() * 2 : 0;
        this.dripVel[i * 3 + 1] = snowing ? 0.4 : 0;
        this.dripVel[i * 3 + 2] = snowing ? 1 + Math.random() : 0;
        this.dripLife[i] = snowing ? 1.6 : 1.2;
      }
    }
    let alive = false;
    for (let i = 0; i < DRIPS; i++) {
      if (this.dripLife[i] <= 0) continue;
      this.dripLife[i] -= dt;
      if (this.dripLife[i] <= 0 || this.dripPos[i * 3 + 1] < -0.4) { this.dripLife[i] = 0; this.dripPos[i * 3 + 1] = -1000; continue; }
      alive = true;
      this.dripVel[i * 3 + 1] -= (snowing ? 1.5 : 9.8) * dt;
      this.dripPos[i * 3] += this.dripVel[i * 3] * dt;
      this.dripPos[i * 3 + 1] += this.dripVel[i * 3 + 1] * dt;
      this.dripPos[i * 3 + 2] += this.dripVel[i * 3 + 2] * dt;
    }
    this.drips.visible = alive;
    if (alive) (this.drips.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;

    // Night lights: the town, and a plane crossing now and then
    const night = Math.max(0, (darkness - 0.45) / 0.55);
    this.town.visible = night > 0.01;
    this.townMat.opacity = night;
    this.planeT += dt;
    const cycle = 70;
    const t = (this.planeT % cycle) / 30; // 30 s crossing, then a gap
    this.plane.visible = night > 0.3 && t < 1 && Math.sin(this.planeT * 6) > 0.6;
    if (t < 1) {
      this.plane.position.set(camera.position.x - 250 + t * 500, 120, camera.position.z + 180 - t * 60);
    }

    // Tumbleweeds: roll across the line downwind, then start again upwind
    if (this.weeds) {
      const c = camera.position;
      for (let i = 0; i < this.weedState.length; i++) {
        const w = this.weedState[i];
        if (w.pos.lengthSq() === 0 || w.pos.x - c.x > 60) {
          w.pos.set(c.x - 50 - Math.random() * 30, -0.15, c.z + (Math.random() - 0.2) * 80);
        }
        const v = w.speed * (0.6 + wind);
        w.pos.x += v * dt;
        w.pos.y = -0.15 + Math.abs(Math.sin(this.time * 2.2 + i)) * 0.35;
        w.roll -= (v / 0.45) * dt;
        this.e.set(0, 0, w.roll);
        this.m.compose(w.pos, this.q.setFromEuler(this.e), this.s.set(1, 1, 1));
        this.weeds.setMatrixAt(i, this.m);
      }
      this.weeds.instanceMatrix.needsUpdate = true;
    }

    // Frost: glitters at dawn, gone by mid-morning
    if (this.frost && this.frostMat) {
      this.frost.visible = dawn > 0.05;
      this.frostMat.opacity = dawn * (0.6 + 0.4 * Math.sin(this.time * 9));
    }
  }
}
