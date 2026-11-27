/**
 * GrindContact - Visual effects at the point where grindstones meet rail.
 *
 * Creates:
 * 1. A glowing orange/white contact point that follows the grinder
 * 2. A bright point light for dramatic illumination
 * 3. A trail of "freshly ground" markers behind the grinder showing progress
 */

import * as THREE from 'three';

/** Most trail markers kept at once (oldest is reused) */
const TRAIL_MAX = 100;

export class GrindContact {
  readonly group: THREE.Group;

  // The glowing contact mesh
  private contactGlow: THREE.Mesh;
  /**
   * How brightly the contact point would light its surroundings. Not a real
   * light: GrindEffects adds it into its one grind-area light (every real
   * light costs something on every lit pixel of the whole scene).
   */
  readonly contactLight = { position: new THREE.Vector3(), intensity: 0 };
  private contactMaterial: THREE.MeshStandardMaterial;

  // Trail markers showing where you've ground: ONE instanced mesh with a
  // slot per marker, reused in a ring. (It used to add a new mesh — and a new
  // geometry — every 2 m: up to 100 extra draw calls, and the first one
  // compiled its shader mid-play, a visible hitch when grinding started.)
  private trail: THREE.InstancedMesh;
  private trailCount = 0;   // markers placed so far (capped at TRAIL_MAX)
  private trailNext = 0;    // ring-buffer slot for the next marker
  private _trailMatrix = new THREE.Matrix4();
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
      forceSinglePass: true, // see-through + double-sided: draw once, not back-then-front (same look; avoids a shader re-check each draw)
    });
    this.contactGlow = new THREE.Mesh(
      new THREE.CircleGeometry(0.3, 8),
      this.contactMaterial
    );
    this.contactGlow.rotation.x = -Math.PI / 2;
    this.group.add(this.contactGlow);


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
    this.trail = new THREE.InstancedMesh(new THREE.BoxGeometry(1.8, 0.02, 1.5), this.trailMaterial, TRAIL_MAX);
    this.trail.count = 0;
    this.trail.frustumCulled = false; // markers are spread along the track
    this.group.add(this.trail);
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
    // Oldest marker is reused once all TRAIL_MAX slots are in use
    this._trailMatrix.makeTranslation(position.x, position.y + 0.01, position.z);
    this.trail.setMatrixAt(this.trailNext, this._trailMatrix);
    this.trail.instanceMatrix.needsUpdate = true;
    this.trailNext = (this.trailNext + 1) % TRAIL_MAX;
    this.trailCount = Math.min(TRAIL_MAX, this.trailCount + 1);
    this.trail.count = this.trailCount;
  }

  /** Fade the contact light when not active. Call each frame. */
  update(dt: number): void {
    if (!this.active) {
      this.contactLight.intensity *= 0.85;
      this.contactMaterial.opacity *= 0.85;
    }

    // Slowly fade the trail's glow over time (all markers share one material,
    // which used to be faded once per marker: same rate as before)
    if (this.trailCount > 0) {
      this.trailMaterial.emissiveIntensity = Math.max(0,
        this.trailMaterial.emissiveIntensity - 0.02 * dt * this.trailCount);
    }
  }

  dispose(): void {
    this.trail.geometry.dispose();
    this.contactGlow.geometry.dispose();
    this.contactMaterial.dispose();
    this.trailMaterial.dispose();
  }
}
