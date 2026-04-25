/**
 * GrindContact - Visual effects at the point where grindstones meet rail.
 *
 * Creates:
 * 1. A glowing orange/white contact point that follows the grinder
 * 2. A bright point light for dramatic illumination
 * 3. A trail of "freshly ground" markers behind the grinder showing progress
 */

import * as THREE from 'three';

export class GrindContact {
  readonly group: THREE.Group;

  // The glowing contact mesh
  private contactGlow: THREE.Mesh;
  private contactLight: THREE.PointLight;
  private contactMaterial: THREE.MeshStandardMaterial;

  // Trail markers showing where you've ground
  private trailMarkers: THREE.Mesh[] = [];
  private trailMaterial: THREE.MeshStandardMaterial;
  private lastTrailZ: number = -Infinity;

  private active: boolean = false;
  private pulsePhase: number = 0;

  constructor() {
    this.group = new THREE.Group();

    // Contact glow - a small flat disc at the grind point
    this.contactMaterial = new THREE.MeshStandardMaterial({
      color: 0xff8800,
      emissive: 0xff6600,
      emissiveIntensity: 3,
      transparent: true,
      opacity: 0,
      flatShading: true,
      side: THREE.DoubleSide,
    });
    this.contactGlow = new THREE.Mesh(
      new THREE.CircleGeometry(0.3, 8),
      this.contactMaterial
    );
    this.contactGlow.rotation.x = -Math.PI / 2;
    this.group.add(this.contactGlow);

    // Bright contact light
    this.contactLight = new THREE.PointLight(0xff8833, 0, 8);
    this.contactLight.position.y = 0.2;
    this.group.add(this.contactLight);

    // Trail material - bright silver to show ground path
    this.trailMaterial = new THREE.MeshStandardMaterial({
      color: 0xddddee,
      emissive: 0x444455,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.3,
      flatShading: true,
      transparent: true,
      opacity: 0.8,
    });
  }

  /** Activate the contact effect at a position */
  setActive(position: THREE.Vector3, pressure: number): void {
    this.active = true;
    this.contactGlow.position.copy(position);
    this.contactGlow.position.y += 0.02; // just above rail surface
    this.contactLight.position.copy(position);
    this.contactLight.position.y += 0.3;

    // Intensity based on pressure
    const intensity = pressure / 100;
    this.contactMaterial.opacity = 0.6 + intensity * 0.4;
    this.contactMaterial.emissiveIntensity = 2 + intensity * 4;
    this.contactLight.intensity = intensity * 5 + Math.random() * 2; // flicker

    // Pulse the contact glow
    this.pulsePhase += 0.3;
    const pulse = 0.25 + Math.sin(this.pulsePhase) * 0.08;
    this.contactGlow.scale.setScalar(pulse + intensity * 0.15);

    // Leave trail markers every ~2 meters
    if (Math.abs(position.z - this.lastTrailZ) > 2 || this.lastTrailZ === -Infinity) {
      this.addTrailMarker(position);
      this.lastTrailZ = position.z;
    }
  }

  /** Deactivate (not grinding) */
  setInactive(): void {
    if (!this.active) return;
    this.active = false;
    this.contactMaterial.opacity = 0;
    this.contactLight.intensity *= 0.5;
  }

  /** Add a small bright marker on the rail to show where you've ground */
  private addTrailMarker(position: THREE.Vector3): void {
    const marker = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.02, 1.5),
      this.trailMaterial
    );
    marker.position.copy(position);
    marker.position.y += 0.01;
    this.group.add(marker);
    this.trailMarkers.push(marker);

    // Limit trail length to avoid memory issues
    if (this.trailMarkers.length > 100) {
      const old = this.trailMarkers.shift()!;
      this.group.remove(old);
      old.geometry.dispose();
    }
  }

  /** Fade the contact light when not active. Call each frame. */
  update(dt: number): void {
    if (!this.active) {
      this.contactLight.intensity *= 0.85;
      this.contactMaterial.opacity *= 0.85;
    }

    // Slowly fade trail markers over time
    for (const marker of this.trailMarkers) {
      const mat = marker.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = Math.max(0, mat.emissiveIntensity - 0.02 * dt);
    }
  }

  dispose(): void {
    for (const m of this.trailMarkers) {
      m.geometry.dispose();
    }
    this.contactGlow.geometry.dispose();
    this.contactMaterial.dispose();
    this.trailMaterial.dispose();
  }
}
