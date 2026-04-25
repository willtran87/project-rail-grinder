/**
 * RailSegment - 3D rail mesh with dramatic visual state changes.
 *
 * THREE VISUAL STATES:
 * 1. DAMAGED (default): Dark rusty brown with red/orange emissive glow
 *    showing defect severity. The worse the damage, the more it glows.
 * 2. GRINDING: Transitions from damaged to polished with sparkling effect.
 * 3. COMPLETE: Gleaming polished silver with a brief bright flash.
 *
 * The visual transformation IS the core game feedback — the player
 * should see the rail change from ugly glowing rust to beautiful steel.
 */

import * as THREE from 'three';
import { RailProfile } from './RailProfile';

const SEGMENT_LENGTH = 5;
const PROFILE_SCALE = 0.002;
const WEB_HEIGHT = 0.20;
const BASE_WIDTH = 0.30;
const BASE_HEIGHT = 0.04;
const WEB_WIDTH = 0.04;

// Visual state colors
const DAMAGED_COLOR = new THREE.Color(0x3a3530);      // dark rusty brown
const DAMAGED_EMISSIVE = new THREE.Color(0x331100);    // warm glow for damage
const GRINDING_COLOR = new THREE.Color(0x887766);      // mid-transition warm gray
const STEEL_COLOR = new THREE.Color(0xc8c8d0);         // bright polished steel
const STEEL_EMISSIVE = new THREE.Color(0x0a0a10);      // subtle cool sheen
const GRINDING_EMISSIVE = new THREE.Color(0x221100);
const COMPLETE_FLASH = new THREE.Color(0xffffff);       // bright flash on completion

export class RailSegment {
  readonly mesh: THREE.Mesh;
  private profile: RailProfile;
  readonly material: THREE.MeshStandardMaterial;
  readonly length: number;
  readonly positionZ: number;
  private _grindProgress: number = 0;
  private _defectSeverity: number = 0; // 0-1, controls the damage glow intensity
  private flashTimer: number = 0;

  constructor(profile: RailProfile, positionZ: number = 0) {
    this.profile = profile;
    this.length = SEGMENT_LENGTH;
    this.positionZ = positionZ;

    this.material = new THREE.MeshStandardMaterial({
      color: DAMAGED_COLOR.clone(),
      emissive: DAMAGED_EMISSIVE.clone(),
      emissiveIntensity: 0,
      metalness: 0.4,
      roughness: 0.75,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(this.buildGeometry(), this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.z = positionZ;
  }

  get grindProgress(): number { return this._grindProgress; }

  /** Set defect severity (0-1). Higher = more visible damage glow. */
  setDefectSeverity(severity: number): void {
    this._defectSeverity = Math.max(0, Math.min(1, severity));
    if (this._grindProgress < 0.1) {
      // Show damage glow on unground segments
      this.material.emissive.copy(DAMAGED_EMISSIVE);
      this.material.emissiveIntensity = this._defectSeverity * 0.4;
    }
  }

  /** Update grind progress (0-1). Drives the rust-to-steel visual transition. */
  setGrindProgress(progress: number): void {
    this._grindProgress = Math.max(0, Math.min(1, progress));
    const t = this._grindProgress;

    if (this.flashTimer > 0) return; // don't override flash

    // Color: damaged → grinding → steel
    if (t < 0.5) {
      const s = t / 0.5;
      this.material.color.copy(DAMAGED_COLOR).lerp(GRINDING_COLOR, s);
      this.material.emissive.copy(DAMAGED_EMISSIVE).lerp(GRINDING_EMISSIVE, s);
      this.material.emissiveIntensity = this._defectSeverity * 0.4 * (1 - s);
      this.material.metalness = 0.4 + s * 0.2;
      this.material.roughness = 0.75 - s * 0.15;
    } else {
      const s = (t - 0.5) / 0.5;
      this.material.color.copy(GRINDING_COLOR).lerp(STEEL_COLOR, s);
      this.material.emissive.copy(GRINDING_EMISSIVE).lerp(STEEL_EMISSIVE, s);
      this.material.emissiveIntensity = s * 0.15;
      this.material.metalness = 0.6 + s * 0.3;
      this.material.roughness = 0.6 - s * 0.2;
    }

    this.material.needsUpdate = true;
  }

  /** Flash bright on completion — call once, then update() handles the fade */
  flashComplete(): void {
    this.flashTimer = 0.4;
    this.material.emissive.copy(COMPLETE_FLASH);
    this.material.emissiveIntensity = 1.5;
  }

  /** Call each frame to handle flash fade */
  update(dt: number): void {
    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
      if (this.flashTimer <= 0) {
        this.flashTimer = 0;
        this.setGrindProgress(this._grindProgress); // restore normal appearance
      } else {
        this.material.emissiveIntensity = (this.flashTimer / 0.4) * 1.5;
      }
    }
  }

  rebuildMesh(): void {
    const old = this.mesh.geometry;
    this.mesh.geometry = this.buildGeometry();
    old.dispose();
  }

  setProfile(profile: RailProfile): void {
    this.profile = profile;
    this.rebuildMesh();
  }

  private buildGeometry(): THREE.ExtrudeGeometry {
    return new THREE.ExtrudeGeometry(this.createRailShape(), {
      steps: 1, depth: this.length, bevelEnabled: false,
    });
  }

  private createRailShape(): THREE.Shape {
    const shape = new THREE.Shape();
    const pts = this.profile.points;
    const scale = PROFILE_SCALE;
    const bL = -BASE_WIDTH / 2, bR = BASE_WIDTH / 2;
    const bB = -(WEB_HEIGHT + BASE_HEIGHT), bT = -WEB_HEIGHT;

    shape.moveTo(bL, bB);
    shape.lineTo(bR, bB);
    shape.lineTo(bR, bT);
    shape.lineTo(WEB_WIDTH / 2, bT);
    shape.lineTo(WEB_WIDTH / 2, 0);

    const rm = pts[pts.length - 1];
    shape.lineTo(rm.x * scale, -rm.y * scale);
    for (let i = pts.length - 2; i >= 0; i--) {
      shape.lineTo(pts[i].x * scale, -pts[i].y * scale);
    }

    shape.lineTo(-WEB_WIDTH / 2, 0);
    shape.lineTo(-WEB_WIDTH / 2, bT);
    shape.lineTo(bL, bT);
    shape.lineTo(bL, bB);
    return shape;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
