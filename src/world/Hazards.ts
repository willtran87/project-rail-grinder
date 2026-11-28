/**
 * Hazards - Things on the line you have to work around:
 *
 *   SWITCHES    a crossover to the next track. The stones must be LIFTED
 *               over the switch (points and frog), or they strike it: worn
 *               stones, a fine and a broken combo. A yellow LIFT board
 *               stands 40 m before each one.
 *   QUIET ZONE  by the station platform (a town): at night, heavy pressure
 *               there brings a noise complaint.
 *
 * Switches sit on the last 5 m stretch of a section, and that stretch is
 * left undamaged (nothing to grind there). All of it is one baked mesh.
 */

import * as THREE from 'three';
import type { RailTrack } from '../rail/RailTrack';
import { GAME_SECTION_LENGTH } from '../rail/RailTrack';
import { bakeStatic, createVertexPbrMaterial } from '../core/bakeStatic';

export interface Zone { from: number; to: number }

export class Hazards {
  readonly group = new THREE.Group();
  readonly switches: Zone[] = [];
  readonly quiet: Zone | null;
  private vmat = createVertexPbrMaterial();

  /**
   * @param count - how many switches (0 on the first jobs)
   * @param avoid - track distances to keep clear of (structures, platform)
   * @param platformAt - the platform's middle (the quiet zone), or null
   */
  constructor(private track: RailTrack, count: number, seed: number, avoid: (d: number) => boolean, platformAt: number | null) {
    let s = seed >>> 0 || 3;
    const rand = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
    const n = track.sectionCount;
    const g = new THREE.Group();
    for (let tries = 0; tries < 20 && this.switches.length < count; tries++) {
      const sec = 2 + Math.floor(rand() * Math.max(1, n - 4));
      const from = track.sectionOffset + sec * GAME_SECTION_LENGTH + 15;
      const zone = { from, to: from + 5 };
      if (this.switches.some((z) => Math.abs(z.from - from) < 60)) continue;
      if (avoid(from - 10) || avoid(from + 2.5) || avoid(from + 15)) continue;
      this.switches.push(zone);
      this.buildSwitch(g, zone);
    }
    this.quiet = platformAt === null ? null : { from: platformAt - 45, to: platformAt + 45 };
    if (this.quiet) this.board(g, this.quiet.from - 5, -3.4, 0x1c3f7a, 0xffffff);
    bakeStatic(g, { vertexMaterial: this.vmat });
    this.group.add(g);
  }

  /** Is this track distance on a switch? */
  onSwitch(d: number): Zone | null {
    return this.switches.find((z) => d >= z.from && d <= z.to) ?? null;
  }

  /** The next switch within `range` metres ahead of `d`, if any */
  switchAhead(d: number, range: number): Zone | null {
    return this.switches.find((z) => z.from > d && z.from - d < range) ?? null;
  }

  inQuietZone(d: number): boolean {
    return !!this.quiet && d >= this.quiet.from && d <= this.quiet.to;
  }

  // ---- building ----

  private put(g: THREE.Group, d: number, x: number, y: number, w: number, h: number, len: number, color: number, yaw = 0, metal = 0.5): void {
    const tp = this.track.getTrackPoint(d);
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, len), new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: metal }));
    mesh.position.copy(tp.position).addScaledVector(tp.right, x);
    mesh.position.y += y;
    mesh.rotation.y = Math.atan2(tp.forward.x, tp.forward.z) + yaw;
    mesh.castShadow = true;
    g.add(mesh);
  }

  /** A crossover: switch points, a frog, the diverging rails toward the next track, and a switch stand */
  private buildSwitch(g: THREE.Group, z: Zone): void {
    const steel = 0x6a6c70, dark = 0x2c2c2e;
    const mid = (z.from + z.to) / 2;
    // Points: two thin tapered blades inside the rails
    this.put(g, mid - 1, -0.72, 0.02, 0.05, 0.12, 3.2, 0xb8bcc4, 0.03);
    this.put(g, mid - 1, 0.72, 0.02, 0.05, 0.12, 3.2, 0xb8bcc4, 0.03);
    // Frog: the dark casting where the rails cross
    this.put(g, mid + 1.6, 0.55, -0.02, 0.35, 0.14, 1.4, dark, 0.03);
    // Diverging rails: angled off toward the adjacent track, then out of sight
    for (const x of [-0.8, 0.8]) {
      for (let k = 0; k < 4; k++) this.put(g, z.to + 2 + k * 3, x + 0.9 + k * 0.9, -0.05, 0.08, 0.18, 3.1, steel, 0.3);
    }
    // Long switch ties under it all
    for (let k = 0; k < 9; k++) this.put(g, z.from + k * 0.6, 0.6, -0.28, 3.8, 0.12, 0.2, 0x3a2a1c, 0, 0);
    // Switch stand with its red/green target, on the left
    this.put(g, mid - 2, -2.4, 0.2, 0.18, 1.2, 0.18, dark);
    this.put(g, mid - 2, -2.4, 0.95, 0.06, 0.45, 0.45, 0xc0201a);
    this.put(g, mid - 2, -2.4, 0.95, 0.07, 0.25, 0.25, 0x30a040);
    // The LIFT board 40 m before
    this.board(g, z.from - 40, -3.4, 0xe8c020, 0x111111);
  }

  /** A square board on a post (yellow LIFT / blue QUIET ZONE) */
  private board(g: THREE.Group, d: number, x: number, face: number, mark: number): void {
    this.put(g, d, x, 0.4, 0.08, 2.0, 0.08, 0x333333);
    this.put(g, d, x, 1.6, 0.06, 0.8, 0.8, face, 0, 0.1);
    this.put(g, d, x - 0.04, 1.6, 0.02, 0.12, 0.6, mark, 0, 0);
    this.put(g, d, x - 0.04, 1.75, 0.02, 0.12, 0.45, mark, 0, 0);
  }
}
