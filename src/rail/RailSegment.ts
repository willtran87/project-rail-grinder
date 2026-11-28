/**
 * RailSegment - One 5 m stretch of one rail, with dramatic visual state changes.
 *
 * THREE VISUAL STATES:
 * 1. DAMAGED (default): Dark rusty brown with red/orange emissive glow
 *    showing defect severity. The worse the damage, the more it glows.
 * 2. GRINDING: Transitions from damaged to polished with sparkling effect.
 * 3. COMPLETE: Gleaming polished silver with a brief bright flash.
 *
 * The visual transformation IS the core game feedback — the player
 * should see the rail change from ugly glowing rust to beautiful steel.
 *
 * PERFORMANCE: a segment has no mesh or material of its own. All segments are
 * drawn together by RailBatch (one draw call); a segment just works out its
 * colours and writes them into the batch. Segments that are cooling down or
 * flashing put themselves on an "active" list (see RailTrack.updateSegments),
 * so update() only runs for the few that are actually animating.
 */

import * as THREE from 'three';
import { RailProfile } from './RailProfile';
import type { RailBatch } from './RailBatch';

export const SEGMENT_LENGTH = 5;

// Visual state colors
const DAMAGED_COLOR = new THREE.Color(0x4a3122);      // rusty brown (reads clearly against ground steel)
const DAMAGED_EMISSIVE = new THREE.Color(0x331100);    // warm glow for damage
const GRINDING_COLOR = new THREE.Color(0x887766);      // mid-transition warm gray
const STEEL_COLOR = new THREE.Color(0xc8c8d0);         // bright polished steel
const STEEL_EMISSIVE = new THREE.Color(0x0a0a10);      // subtle cool sheen
const GRINDING_EMISSIVE = new THREE.Color(0x221100);
const COMPLETE_FLASH = new THREE.Color(0xffffff);       // bright flash on completion
const FLASH_TIME = 0.6;                                 // seconds the completion flash takes to fade

// The polished running band: a thin bright strip along the top of the rail
// where the wheels (and the grindstones) touch (drawn by RailBatch)
const SHINE_BASE_GLOW = 0.5;
const SHINE_EMISSIVE = new THREE.Color(0x9aa4b4);
let grindMarkTexture: THREE.CanvasTexture | null = null;

// Hot rail: freshly ground steel glows dull orange, then cools back to silver
const HOT_COLOR = new THREE.Color(0xff5a14);
const HEAT_COOL_TIME = 3.5;   // seconds to cool from fully hot to cold

/**
 * Fine lengthwise scratches, like the facets real grindstones leave on the
 * rail head. Drawn once on a small canvas and shared by every rail.
 * (u = across the rail head, v = along the rail.)
 */
export function getGrindMarkTexture(): THREE.CanvasTexture | null {
  if (grindMarkTexture) return grindMarkTexture;
  if (typeof document === 'undefined') return null; // unit tests run without a browser
  const W = 64, H = 128;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const g = canvas.getContext('2d')!;
  g.fillStyle = '#c8ccd4';
  g.fillRect(0, 0, W, H);
  // Facet bands: a few slightly different shades across the head
  for (let x = 0; x < W; x += 8) {
    const v = 190 + Math.floor(Math.random() * 50);
    g.fillStyle = `rgb(${v},${v + 2},${v + 6})`;
    g.fillRect(x, 0, 8, H);
  }
  // Scratches running along the rail
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * W;
    const bright = Math.random() < 0.5;
    g.strokeStyle = bright ? 'rgba(255,255,255,0.55)' : 'rgba(90,95,105,0.45)';
    g.lineWidth = 0.6 + Math.random() * 0.8;
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x + (Math.random() - 0.5) * 2, H);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 3);
  tex.colorSpace = THREE.SRGBColorSpace;
  grindMarkTexture = tex;
  return tex;
}

export class RailSegment {
  private readonly batch: RailBatch;
  /** This segment's slot in the batch (its column in the data texture) */
  private readonly slot: number;
  readonly length = SEGMENT_LENGTH;
  private _grindProgress: number = 0;
  private _defectSeverity: number = 0; // 0-1, controls the damage glow intensity
  private flashTimer: number = 0;
  /** 0..1 — how hot this stretch of rail is from grinding (glows orange) */
  private heat: number = 0;

  // Current look (sent to the batch by commit())
  private color = DAMAGED_COLOR.clone();
  private metalness = 0.4;
  private roughness = 0.75;
  private emissive = DAMAGED_EMISSIVE.clone();
  private emissiveIntensity = 0;
  private shineEmissive = SHINE_EMISSIVE.clone();
  private shineIntensity = SHINE_BASE_GLOW;
  private shineOpacity = 0;

  // The rail's "normal" glow for its grind state; heat glow is added on top
  private baseEmissive = new THREE.Color();
  private baseEmissiveIntensity = 0;
  private bandOpacity = 0;

  /**
   * @param onActive - called when the segment starts animating (heat / flash),
   *   so its owner updates it each frame until update() returns false
   */
  constructor(profile: RailProfile, batch: RailBatch, slot: number,
              private readonly onActive: (seg: RailSegment) => void = () => {}) {
    this.batch = batch;
    this.slot = slot;
    this.batch.writeGeometry(slot, profile);
    this.commit();
  }

  get grindProgress(): number { return this._grindProgress; }

  /** Set defect severity (0-1). Higher = more visible damage glow. */
  setDefectSeverity(severity: number): void {
    this._defectSeverity = Math.max(0, Math.min(1, severity));
    if (this._grindProgress < 0.1) {
      // Show damage glow on unground segments
      this.baseEmissive.copy(DAMAGED_EMISSIVE);
      this.baseEmissiveIntensity = this._defectSeverity * 0.4;
      this.applyGlow();
    }
  }

  /**
   * The grindstones just passed over this rail: warm it up.
   * @param amount - heat to add (0..1); it cools by itself in update()
   */
  heatUp(amount: number): void {
    if (amount <= 0) return;
    this.heat = Math.min(1, this.heat + amount);
    this.onActive(this);
    this.applyGlow();
  }

  /** Combine the normal glow with the orange heat glow */
  private applyGlow(): void {
    if (this.flashTimer > 0) return; // the completion flash owns the glow for now
    const h = this.heat;
    // Running band: fades in as the section is ground, and shows while hot
    this.shineOpacity = Math.max(this.bandOpacity, h);
    this.shineEmissive.copy(SHINE_EMISSIVE).lerp(HOT_COLOR, h);
    this.shineIntensity = SHINE_BASE_GLOW + h * 3.5; // > 1 → bloom
    this.emissive.copy(this.baseEmissive).lerp(HOT_COLOR, h);
    this.emissiveIntensity = this.baseEmissiveIntensity + h * 0.9;
    this.commit();
  }

  /** Update grind progress (0-1). Drives the rust-to-steel visual transition. */
  setGrindProgress(progress: number): void {
    this._grindProgress = Math.max(0, Math.min(1, progress));
    const t = this._grindProgress;

    // Running band fades in over the second half of the transition
    const band = Math.max(0, Math.min(1, (t - 0.35) / 0.65));
    this.bandOpacity = band * 0.9;

    // Color: damaged → grinding → steel
    if (t < 0.5) {
      const s = t / 0.5;
      this.color.copy(DAMAGED_COLOR).lerp(GRINDING_COLOR, s);
      this.baseEmissive.copy(DAMAGED_EMISSIVE).lerp(GRINDING_EMISSIVE, s);
      this.baseEmissiveIntensity = this._defectSeverity * 0.4 * (1 - s);
      this.metalness = 0.4 + s * 0.2;
      this.roughness = 0.75 - s * 0.15;
    } else {
      const s = (t - 0.5) / 0.5;
      this.color.copy(GRINDING_COLOR).lerp(STEEL_COLOR, s);
      this.baseEmissive.copy(GRINDING_EMISSIVE).lerp(STEEL_EMISSIVE, s);
      this.baseEmissiveIntensity = s * 0.15;
      this.metalness = 0.6 + s * 0.3;
      this.roughness = 0.6 - s * 0.2;
    }
    this.applyGlow();
  }

  /** Flash bright on completion — call once, then update() handles the fade */
  flashComplete(): void {
    this.flashTimer = FLASH_TIME;
    this.emissive.copy(COMPLETE_FLASH);
    this.emissiveIntensity = 1.5;
    // Running band flares well past white so the bloom makes it glint
    this.shineOpacity = 1;
    this.shineIntensity = 4;
    this.onActive(this);
    this.commit();
  }

  /**
   * Handle the flash fade and the rail cooling down.
   * @returns true while still animating (false = it can be left alone)
   */
  update(dt: number): boolean {
    if (this.heat > 0) {
      this.heat = Math.max(0, this.heat - dt / HEAT_COOL_TIME);
      this.applyGlow();
    }
    if (this.flashTimer > 0) {
      this.flashTimer -= dt;
      if (this.flashTimer <= 0) {
        this.flashTimer = 0;
        this.setGrindProgress(this._grindProgress); // restore normal appearance
      } else {
        const k = this.flashTimer / FLASH_TIME;
        this.emissiveIntensity = k * 1.5;
        this.shineIntensity = SHINE_BASE_GLOW + k * 3.65;
        this.commit();
      }
    }
    return this.heat > 0 || this.flashTimer > 0;
  }

  /** Rebuild the 3D rail from the (ground) profile — in place, inside the batch */
  setProfile(profile: RailProfile): void {
    this.batch.writeGeometry(this.slot, profile);
  }

  /** Send the current look to the batch */
  private commit(): void {
    this.batch.setLook(this.slot, this.color, this.metalness,
      this.emissive, this.emissiveIntensity, this.roughness,
      this.shineEmissive, this.shineIntensity, this.shineOpacity);
  }

  /** Nothing to free: the batch owns all GPU resources */
  dispose(): void {}
}
