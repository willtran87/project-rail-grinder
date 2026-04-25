/**
 * Weather - Rain particles and variable fog.
 * Toggle with key 'R' for rain.
 */

import * as THREE from 'three';

const RAIN_COUNT = 2000;

export class Weather {
  readonly rainGroup: THREE.Points;
  private positions: Float32Array;
  private velocities: Float32Array;
  private raining = false;
  private rainIntensity = 0; // 0-1, fades in/out

  constructor() {
    this.positions = new Float32Array(RAIN_COUNT * 3);
    this.velocities = new Float32Array(RAIN_COUNT);

    for (let i = 0; i < RAIN_COUNT; i++) {
      this.positions[i * 3] = (Math.random() - 0.5) * 80;
      this.positions[i * 3 + 1] = Math.random() * 30;
      this.positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      this.velocities[i] = 15 + Math.random() * 10;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xaabbcc,
      size: 0.08,
      transparent: true,
      opacity: 0,
      sizeAttenuation: true,
      depthWrite: false,
    });

    this.rainGroup = new THREE.Points(geo, mat);
    this.rainGroup.frustumCulled = false;
  }

  get isRaining() { return this.raining; }

  toggle(): void {
    this.raining = !this.raining;
  }

  /** Update rain particles. cameraPos = grinder world position for rain centering. */
  update(dt: number, cameraPos: THREE.Vector3): void {
    // Fade intensity
    const target = this.raining ? 1 : 0;
    this.rainIntensity += (target - this.rainIntensity) * 2 * dt;

    const mat = this.rainGroup.material as THREE.PointsMaterial;
    mat.opacity = this.rainIntensity * 0.4;

    if (this.rainIntensity < 0.01) return;

    const pos = this.rainGroup.geometry.getAttribute('position') as THREE.BufferAttribute;

    for (let i = 0; i < RAIN_COUNT; i++) {
      // Fall down
      this.positions[i * 3 + 1] -= this.velocities[i] * dt;

      // Slight wind drift
      this.positions[i * 3] += 2 * dt;
      this.positions[i * 3 + 2] += 1 * dt;

      // Reset when below ground — respawn near camera
      if (this.positions[i * 3 + 1] < -1) {
        this.positions[i * 3] = cameraPos.x + (Math.random() - 0.5) * 60;
        this.positions[i * 3 + 1] = 15 + Math.random() * 15;
        this.positions[i * 3 + 2] = cameraPos.z + (Math.random() - 0.5) * 60;
        this.velocities[i] = 15 + Math.random() * 10;
      }
    }

    pos.needsUpdate = true;
  }
}
