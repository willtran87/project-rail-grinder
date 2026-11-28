/**
 * Structures - Bridges and tunnels on the line.
 *
 *   TRUSS BRIDGE  a steel through-truss over a river (city, coast)
 *   GIRDER BRIDGE a plate-girder deck bridge over a creek (prairie)
 *   TUNNEL        a double-track bore through a hillside (mountain, coast)
 *
 * They sit on ordinary sections, so you grind on bridges and in tunnels like
 * anywhere else. Inside a tunnel the daylight drops away (the headlight and
 * the sparks are the light), the sound echoes and rain stops: see
 * `tunnelAmount`, which Game feeds to the lighting, audio and weather.
 *
 * Each structure is built from plain boxes and merged into one mesh
 * (bakeStatic), so a bridge or a tunnel costs a single draw call.
 */

import * as THREE from 'three';
import type { RailTrack } from '../rail/RailTrack';
import type { Region } from '../types/rail';
import { bakeStatic, createVertexPbrMaterial } from '../core/bakeStatic';

/** The adjacent (freight) track runs this far to the right (PassingTrain) */
const ADJACENT = 5;

export type StructureKind = 'truss' | 'girder' | 'tunnel';

export interface Structure {
  kind: StructureKind;
  /** Track distances it spans */
  from: number;
  to: number;
}

/** Which structures each region gets (in order of preference) */
const REGION_STRUCTURES: Record<Region, StructureKind[]> = {
  prairie: ['girder'],
  mountain: ['tunnel', 'girder'],
  city: ['truss'],
  coast: ['tunnel', 'truss'],
  desert: ['girder'],
  forest: ['truss', 'tunnel'],
  appalachia: ['tunnel', 'girder'],
};

const LENGTHS: Record<StructureKind, number> = { truss: 36, girder: 22, tunnel: 64 };

/**
 * Where the structures go: seeded, inside the scored sections, clear of
 * level crossings and landmarks, and apart from each other. Pure (testable).
 * @param blocked - is this track distance unsuitable (crossing, landmark)?
 */
export function planStructures(region: Region, sectionStart: number, sectionEnd: number, seed: number,
                               blocked: (d: number) => boolean): Structure[] {
  let s = seed >>> 0 || 1;
  const rand = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  const out: Structure[] = [];
  for (const kind of REGION_STRUCTURES[region]) {
    const len = LENGTHS[kind];
    for (let tries = 0; tries < 12; tries++) {
      // keep the first 40 m and last 30 m free (start of the job, run-out)
      const from = sectionStart + 40 + rand() * Math.max(0, sectionEnd - sectionStart - 70 - len);
      const to = from + len;
      if (to > sectionEnd - 20) continue;
      if (out.some((o) => from < o.to + 40 && to > o.from - 40)) continue;
      let clear = true;
      for (let d = from - 15; d <= to + 15; d += 4) if (blocked(d)) { clear = false; break; }
      if (!clear) continue;
      out.push({ kind, from, to });
      break;
    }
  }
  return out;
}

export class Structures {
  readonly group = new THREE.Group();
  readonly list: Structure[];
  /** 0..1: how far inside a tunnel the camera is (fades in over the portal) */
  tunnelAmount = 0;

  private mat = createVertexPbrMaterial();
  /** River surfaces (left out of the bake: their own glossy material) */
  private water: THREE.Mesh[] = [];

  constructor(private track: RailTrack, region: Region, seed: number, blocked: (d: number) => boolean) {
    const start = track.sectionOffset;
    const end = start + track.sectionCount * 20;
    this.list = planStructures(region, start, end, seed, blocked);
    for (const st of this.list) {
      const g = new THREE.Group();
      if (st.kind === 'tunnel') this.buildTunnel(g, st);
      else this.buildBridge(g, st);
      bakeStatic(g, { vertexMaterial: this.mat });
      this.group.add(g);
    }
  }

  /** Scenery (trees, rocks) must keep off structures and rivers */
  blocks(x: number, z: number): boolean {
    for (const st of this.list) {
      const mid = this.track.getTrackPoint((st.from + st.to) / 2);
      const dx = x - mid.position.x, dz = z - mid.position.z;
      const r = st.kind === 'tunnel' ? (st.to - st.from) / 2 + 14 : (st.to - st.from) / 2 + 30;
      if (dx * dx + dz * dz < r * r) return true;
    }
    return false;
  }

  /** Is this track distance inside a tunnel (0..1, 1 = well inside)? */
  insideTunnel(d: number): number {
    let best = 0;
    for (const st of this.list) {
      if (st.kind !== 'tunnel') continue;
      const into = Math.min(d - st.from, st.to - d);
      if (into > 0) best = Math.max(best, Math.min(1, into / 10));
    }
    return best;
  }

  /** Is this track distance on a bridge? */
  onBridge(d: number): boolean {
    return this.list.some((st) => st.kind !== 'tunnel' && d > st.from && d < st.to);
  }

  /**
   * @param cameraDist - the camera's distance along the track (nearest point)
   * @param cameraInside - true if the camera is within the tunnel bore laterally
   */
  update(dt: number, cameraDist: number, cameraInside: boolean): void {
    const target = cameraInside ? this.insideTunnel(cameraDist) : 0;
    this.tunnelAmount += (target - this.tunnelAmount) * Math.min(1, dt * 3);
  }

  // ---- building ----

  /** A box placed in track space: `d` along, `x` across (+ = right), `y` up */
  private box(g: THREE.Group, d: number, x: number, y: number, w: number, h: number, len: number,
              color: number, rough = 0.8, metal = 0, yaw = 0): void {
    const tp = this.track.getTrackPoint(d);
    const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, len), m);
    mesh.position.copy(tp.position).addScaledVector(tp.right, x);
    mesh.position.y += y;
    mesh.rotation.y = Math.atan2(tp.forward.x, tp.forward.z) + yaw;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    g.add(mesh);
  }

  /** A beam between two points in track space (d, x, y) */
  private beam(g: THREE.Group, a: [number, number, number], b: [number, number, number], thick: number, color: number): void {
    const pa = this.trackSpace(a), pb = this.trackSpace(b);
    const len = pa.distanceTo(pb);
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.5 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(thick, thick, len), m);
    mesh.position.copy(pa).add(pb).multiplyScalar(0.5);
    mesh.lookAt(pb);
    mesh.castShadow = true;
    g.add(mesh);
  }

  private trackSpace([d, x, y]: [number, number, number]): THREE.Vector3 {
    const tp = this.track.getTrackPoint(d);
    return new THREE.Vector3().copy(tp.position).addScaledVector(tp.right, x).setY(tp.position.y + y);
  }

  private buildBridge(g: THREE.Group, st: Structure): void {
    const truss = st.kind === 'truss';
    const steel = truss ? 0x5a2a22 : 0x3c4148;
    const len = st.to - st.from;
    const mid = (st.from + st.to) / 2;
    // The river: water across the line, with muddy banks
    const tp = this.track.getTrackPoint(mid);
    const riverW = len - 8;
    const heading = Math.atan2(tp.forward.x, tp.forward.z);
    const flat = (w: number, l: number) => new THREE.PlaneGeometry(w, l).rotateX(-Math.PI / 2); // w across, l along
    const water = new THREE.Mesh(flat(160, riverW),
      new THREE.MeshStandardMaterial({ color: 0x2c4a5a, roughness: 0.15, metalness: 0.2, emissive: 0x0a1a22 }));
    water.rotation.y = heading;
    water.position.copy(tp.position).setY(-0.56);
    water.receiveShadow = true;
    this.group.add(water); // (kept apart from the bake: its own glossy material)
    this.water.push(water);
    for (const side of [-1, 1]) {
      const bank = new THREE.Mesh(flat(160, 3), new THREE.MeshLambertMaterial({ color: 0x5a4a34 }));
      bank.rotation.y = heading;
      bank.position.copy(tp.position).addScaledVector(tp.forward, side * (riverW / 2 + 1.2)).setY(-0.57);
      this.group.add(bank);
    }
    // Abutments (concrete) at each end, piers in the river
    for (const d of [st.from + 1.5, st.to - 1.5]) this.box(g, d, ADJACENT / 2, -1.2, 13, 1.6, 3, 0x8a8478);
    for (let d = st.from + 9; d < st.to - 6; d += 9) this.box(g, d, ADJACENT / 2, -1.6, 12, 2.2, 1.6, 0x7c776c);
    // Deck girders along both tracks, and walkway railings
    for (const x of [-1.2, 1.2, ADJACENT - 1.2, ADJACENT + 1.2]) this.box(g, mid, x, -0.75, 0.25, 0.9, len, steel, 0.6, 0.5);
    for (const x of [-2.6, ADJACENT + 2.6]) {
      for (let d = st.from + 1; d <= st.to - 1; d += 2) this.box(g, d, x, 0.45, 0.06, 1.1, 0.06, 0xd8c020, 0.7, 0.2);
      this.box(g, mid, x, 1.0, 0.06, 0.06, len - 2, 0xd8c020, 0.7, 0.2);
    }
    if (!truss) return;
    // Through-truss over each track: chords, verticals, diagonals, top bracing
    const H = 7.2;
    for (const x of [-2.9, ADJACENT + 2.9]) {
      this.beam(g, [st.from, x, 0], [st.to, x, 0], 0.35, steel);
      this.beam(g, [st.from + 5, x, H], [st.to - 5, x, H], 0.4, steel);
      this.beam(g, [st.from, x, 0], [st.from + 5, x, H], 0.4, steel);
      this.beam(g, [st.to, x, 0], [st.to - 5, x, H], 0.4, steel);
      for (let d = st.from + 5; d <= st.to - 5 + 0.01; d += 5) {
        this.beam(g, [d, x, 0], [d, x, H], 0.25, steel);
        if (d + 5 <= st.to - 5 + 0.01) this.beam(g, [d, x, 0], [d + 5, x, H], 0.18, steel);
      }
    }
    for (let d = st.from + 5; d <= st.to - 5 + 0.01; d += 5) this.beam(g, [d, -2.9, H], [d, ADJACENT + 2.9, H], 0.2, steel);
    // Builder's plate over the portal
    this.box(g, st.from + 5, ADJACENT / 2, H + 0.6, 3.5, 0.8, 0.1, 0x2a2a2a);
  }

  private buildTunnel(g: THREE.Group, st: Structure): void {
    const rock = 0x56524c, lining = 0x3a3733, earth = 0x4d5a3a;
    const L = -3.6, R = ADJACENT + 3.6, H = 6.4, wall = 1.2;
    // The bore: walls and roof in 4 m pieces that follow the curve
    for (let d = st.from + 2; d < st.to; d += 4) {
      this.box(g, d, L - wall / 2, H / 2 - 0.6, wall, H, 4.05, lining, 0.95);
      this.box(g, d, R + wall / 2, H / 2 - 0.6, wall, H, 4.05, lining, 0.95);
      this.box(g, d, (L + R) / 2, H - 0.6 + wall / 2, R - L + wall * 2, wall, 4.05, lining, 0.95);
      // the hill above: earth and rock that rises and falls along the bore,
      // with a few firs on top
      const swell = Math.sin(d * 0.13) * 1.6 + Math.sin(d * 0.31) * 0.8;
      const into = Math.min(d - st.from, st.to - d);
      const rise = Math.min(1, into / 12);
      this.box(g, d, (L + R) / 2, H + 2.2, R - L + 14, 4, 4.05, earth, 1);
      this.box(g, d, (L + R) / 2 + Math.sin(d * 0.2) * 2, H + 4.4 + rise * (2 + swell), R - L + 2, 2 + rise * (3 + swell), 4.05, (Math.floor(d / 4) % 3 === 0) ? 0x5c5850 : earth, 1);
      if (Math.floor(d / 4) % 2 === 0) {
        const side = Math.floor(d / 8) % 2 === 0 ? -1 : 1;
        this.box(g, d, (L + R) / 2 + side * (5 + (d % 3)), H + 6 + rise * 3, 1.6, 4 + (d % 2), 1.6, 0x24452c, 1);
      }
    }
    // Lamps every 12 m along the wall (they glow; no real lights)
    for (let d = st.from + 6; d < st.to - 3; d += 12) {
      const tp = this.track.getTrackPoint(d);
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x222222, emissive: 0xffc070, emissiveIntensity: 2.2 }));
      lamp.position.copy(tp.position).addScaledVector(tp.right, L + 0.1).setY(tp.position.y + 4.2);
      g.add(lamp);
    }
    // Portals: a rock face around each mouth, with a dressed stone arch band
    for (const [d, dir] of [[st.from, -1], [st.to, 1]] as const) {
      const face = d + dir * 0.8;
      this.box(g, face, L - 6, 4, 12, 12, 1.6, rock, 1);
      this.box(g, face, R + 6, 4, 12, 12, 1.6, rock, 1);
      this.box(g, face, (L + R) / 2, H + 3, R - L + 24, 6, 1.6, rock, 1);
      this.box(g, face + dir * 0.2, (L + R) / 2, H - 0.2, R - L + 1, 0.9, 1.4, 0x8d877c, 0.9);
      // year stone
      this.box(g, face + dir * 0.3, (L + R) / 2, H + 1.1, 2.4, 0.9, 0.3, 0x9a948a, 0.9);
    }
  }
}
