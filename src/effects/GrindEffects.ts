/**
 * GrindEffects - All the visual spectacle around the grinder:
 *   - spark particles from 32 stones across the 4 grinding cars
 *   - 4 work lights that follow the consist (and flicker while grinding)
 *   - the glowing contact point under the grinding section
 *
 * Purely cosmetic: the actual metal removal happens in Game.handleGrinding.
 */

import * as THREE from 'three';
import { SparkSystem } from './SparkSystem';
import { GrindContact } from './GrindContact';
import type { RailTrack } from '../rail/RailTrack';

/** Car offsets (m from grinderPosition) of the four grinding cars */
const GRIND_CAR_OFFSETS = [-12, 0, 12, 24];
const STONES_PER_CAR = 8;
/** Work lights: headlight, front grind area, rear grind area, tail */
const LIGHT_OFFSETS = [-42, -6, 18, 67];

type EmitPoint = { position: THREE.Vector3; forward: THREE.Vector3; right: THREE.Vector3 };

export class GrindEffects {
  private sparks: SparkSystem;
  private contact: GrindContact;
  private lights: THREE.PointLight[] = [];
  // Pre-allocated emit points (avoids creating 96 vectors every frame)
  private emitPool: EmitPoint[] = [];

  constructor(scene: THREE.Scene) {
    this.sparks = new SparkSystem();
    scene.add(this.sparks.points);
    scene.add(this.sparks.sparkLight);

    this.contact = new GrindContact();
    scene.add(this.contact.group);

    for (let i = 0; i < LIGHT_OFFSETS.length; i++) {
      const light = new THREE.PointLight(0xff8833, 0, 8);
      scene.add(light);
      this.lights.push(light);
    }

    for (let i = 0; i < GRIND_CAR_OFFSETS.length * STONES_PER_CAR; i++) {
      this.emitPool.push({ position: new THREE.Vector3(), forward: new THREE.Vector3(), right: new THREE.Vector3() });
    }
  }

  /** Animate particles and glow — call every frame */
  update(dt: number): void {
    this.sparks.update(dt);
    this.contact.update(dt);
  }

  /**
   * Section-complete celebration: little spark fountains rippling along both
   * rails of the finished section, one after another (start → end).
   */
  celebrate(track: RailTrack, startDist: number, endDist: number): void {
    const FOUNTAINS = 8;
    for (let i = 0; i < FOUNTAINS; i++) {
      const d = startDist + ((i + 0.5) / FOUNTAINS) * (endDist - startDist);
      setTimeout(() => {
        const tp = track.getTrackPoint(d);
        for (const side of [-1, 1]) {
          const p = tp.position.clone().addScaledVector(tp.right, side * 0.8);
          this.sparks.burst(p, 14);
        }
      }, i * 70);
    }
  }

  /** Stop sparks and glow immediately (e.g. on restart) */
  stop(): void {
    this.sparks.stopEmitting();
    this.contact.setInactive();
  }

  /**
   * Position effects for this frame.
   * @param grinding - stones down?
   * @param avgPressure - 0..100, drives spark density and light flicker
   */
  setState(track: RailTrack, grinderPosition: number, grinding: boolean, avgPressure: number): void {
    const len = track.totalLength;
    const clamp = (d: number) => Math.max(0.1, Math.min(len - 0.1, d));

    // Work lights follow the consist; steady when idle, flickering while grinding
    for (let li = 0; li < this.lights.length; li++) {
      const tp = track.getTrackPoint(clamp(grinderPosition + LIGHT_OFFSETS[li]));
      this.lights[li].position.copy(tp.position);
      this.lights[li].position.y += 2.5;
      this.lights[li].intensity = li === 0 ? 4
        : grinding ? (avgPressure / 50) * (1.5 + Math.random()) : 1.5;
    }

    if (!grinding) {
      this.stop();
      return;
    }

    // One spark source per stone
    let i = 0;
    for (const carOff of GRIND_CAR_OFFSETS) {
      for (let si = 0; si < STONES_PER_CAR; si++) {
        const stoneZ = -4.5 + si * 1.3;
        const tp = track.getTrackPoint(clamp(grinderPosition + carOff + stoneZ));
        const ep = this.emitPool[i++];
        ep.position.copy(tp.position);
        ep.forward.copy(tp.forward);
        ep.right.copy(tp.right);
      }
    }
    this.sparks.setEmitPoints(this.emitPool, avgPressure / 50);

    // Contact glow at the centre of the grinding section
    const centre = track.getTrackPoint(clamp(grinderPosition + 6));
    this.contact.setActive(centre.position, avgPressure);
  }
}
