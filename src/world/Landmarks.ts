/**
 * Landmarks - Things that make each route feel like a real place, plus
 * working level crossings.
 *
 *   prairie  (Kansas)      grain elevator, farm windmill, grazing cattle
 *   mountain (Marias Pass) summit obelisk, fire lookout, log cabin
 *   city     (Chicago)     distant skyline (lit windows at night), warehouses,
 *                          signal gantry over the tracks, water tower
 *   coast    (California)  lighthouse with a sweeping beam, palm trees,
 *                          lifeguard tower
 *
 * Level crossings: a road across the track with flashing lights and gates
 * that drop when the grinder comes near, and a car that waits for them.
 *
 * Performance: everything that never moves is merged into one mesh per
 * material ("baked"), so a whole route of landmarks costs only a few draw
 * calls. Only moving parts (gates, lamps, blades, cows' heads, cars, beams)
 * stay as separate meshes.
 */

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { GAME_SECTION_LENGTH, type RailTrack } from '../rail/RailTrack';
import type { Region } from '../types/rail';

const GROUND_Y = -0.6;

/** Where a crossing's road runs: from `-near` (left side) to `+far` (right side) */
interface CrossingSpec { t: number; near: number; far: number }

interface Crossing {
  dist: number;               // distance along the track
  active: boolean;
  timer: number;              // seconds since the lights started (or stopped)
  gateAngle: number;          // 0 = down (closed) .. 1 = up (open)
  gates: { pivot: THREE.Object3D; upSign: number }[];
  lamps: THREE.Mesh[][];      // per mast: [left lamp, right lamp]
  car: THREE.Group;
  carX: number;               // car position along the road (crossing-local x)
  carDir: -1 | 1;             // −1 = driving toward −x, +1 = toward +x
  carSpeed: number;
  carWait: number;            // seconds left parked at a road end before turning round
  near: number;
  far: number;
  origin: THREE.Vector3;
  right: THREE.Vector3;
  forward: THREE.Vector3;
}

/**
 * A stretch of track that is (or is about to be) occupied by a train,
 * as distances along the track. Includes the warning time ahead of it.
 */
export interface Occupancy { from: number; to: number }

// Crossing-local x: the main track is at 0, the adjacent track at +5.
// A car must not be anywhere between these while a train is near.
export const STOP_LINE_RIGHT = 12;   // car coming from +x waits here
export const STOP_LINE_LEFT = -8;    // car coming from −x waits here
const CAR_SPEED = 9;          // m/s (~20 mph)
const BRAKE = 5;              // m/s² — firm but ordinary braking

/** Circle of ground kept clear of trees */
interface Blocker { x: number; z: number; r: number }

/** The parts of a crossing that the car logic needs (a Crossing has all of them) */
export interface CrossingCar {
  carX: number;
  carDir: -1 | 1;
  carSpeed: number;
  carWait: number;
  near: number;
  far: number;
}

/**
 * Move a level-crossing car on by one frame. It drives back and forth along
 * the road, pausing at each end and turning round, and stops at the stop
 * line whenever the crossing is closed. A car already between the stop lines
 * when the lights start keeps going: the lights give several seconds of
 * warning, and it clears the tracks in about two.
 *
 * Pure logic (no Three.js) so it can be unit-tested.
 * @param closed - lights flashing / gates not fully up
 * @param random - source of [0, 1) numbers for the pause length
 */
export function stepCrossingCar(c: CrossingCar, dt: number, closed: boolean, random: () => number = Math.random): void {
  // Parked at a road end, about to turn round
  if (c.carWait > 0) {
    c.carWait -= dt;
    if (c.carWait <= 0) c.carDir = c.carDir < 0 ? 1 : -1;
  } else {
    const stopX = c.carDir < 0 ? STOP_LINE_RIGHT : STOP_LINE_LEFT;
    const toStop = (c.carX - stopX) * -c.carDir; // metres until the stop line (negative = past it)
    // Between the two stop lines = on or right next to the tracks. A car
    // already in there keeps going to clear them; any other car must wait.
    const inZone = c.carX > STOP_LINE_LEFT && c.carX < STOP_LINE_RIGHT;
    const mustStop = closed && !inZone;
    // Speed that still lets it stop exactly at the line (braking at BRAKE m/s²)
    const wanted = mustStop ? Math.min(CAR_SPEED, Math.sqrt(2 * BRAKE * Math.max(0, toStop))) : CAR_SPEED;
    c.carSpeed = wanted < c.carSpeed ? wanted : Math.min(wanted, c.carSpeed + 3 * dt);
    const step = c.carSpeed * dt;
    // Never roll over the line while the crossing is closed
    c.carX += c.carDir * (mustStop ? Math.min(step, Math.max(0, toStop)) : step);

    // Reached the end of the road: stop, then turn round
    const end = c.carDir < 0 ? -c.near + 2.5 : c.far - 2.5;
    if ((c.carDir < 0 && c.carX <= end) || (c.carDir > 0 && c.carX >= end)) {
      c.carX = end;
      c.carSpeed = 0;
      c.carWait = 4 + random() * 4;
    }
  }
}

export class Landmarks {
  readonly group = new THREE.Group();
  private track: RailTrack;
  private crossings: Crossing[] = [];
  private blockers: Blocker[] = [];
  private spinners: { obj: THREE.Object3D; speed: number; axis: 'y' | 'z' }[] = [];
  private bobbers: { obj: THREE.Object3D; phase: number }[] = [];
  private beams: THREE.Object3D[] = [];
  private beamMat: THREE.MeshBasicMaterial | null = null;
  private time = 0;

  // Static meshes waiting to be merged, grouped by material
  private batches = new Map<THREE.Material, THREE.BufferGeometry[]>();

  // Shared materials (sharing them is what lets the baked meshes merge)
  private mat = {
    white: new THREE.MeshStandardMaterial({ color: 0xe8e4dc, roughness: 0.8 }),
    concrete: new THREE.MeshStandardMaterial({ color: 0xb8b2a6, roughness: 0.95 }),
    darkMetal: new THREE.MeshStandardMaterial({ color: 0x3a3c40, metalness: 0.5, roughness: 0.6 }),
    galvanized: new THREE.MeshStandardMaterial({ color: 0x9aa0a6, metalness: 0.6, roughness: 0.45 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x6b4a2e, roughness: 0.9 }),
    darkWood: new THREE.MeshStandardMaterial({ color: 0x4a3220, roughness: 0.95 }),
    roof: new THREE.MeshStandardMaterial({ color: 0x5a3a2a, roughness: 0.85 }),
    red: new THREE.MeshStandardMaterial({ color: 0xb02020, roughness: 0.6 }),
    brick: new THREE.MeshStandardMaterial({ color: 0x8a4a34, roughness: 0.95 }),
    asphalt: new THREE.MeshStandardMaterial({ color: 0x3a3a3c, roughness: 1 }),
    paint: new THREE.MeshStandardMaterial({ color: 0xe8e0a0, roughness: 0.8 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x7a7670, roughness: 1, flatShading: true }),
    cow: new THREE.MeshStandardMaterial({ color: 0x5a3a28, roughness: 0.9 }),
    cowWhite: new THREE.MeshStandardMaterial({ color: 0xe8e0d4, roughness: 0.9 }),
    palmTrunk: new THREE.MeshStandardMaterial({ color: 0x8a7050, roughness: 0.95 }),
    palmLeaf: new THREE.MeshStandardMaterial({ color: 0x3a7a30, roughness: 0.8, side: THREE.DoubleSide, flatShading: true }),
    // Glowing parts — their brightness follows the time of day (see update)
    lampRed: new THREE.MeshStandardMaterial({ color: 0x400808, emissive: 0xff1a0a, emissiveIntensity: 0 }),
    lampWarm: new THREE.MeshStandardMaterial({ color: 0xfff0c0, emissive: 0xffd080, emissiveIntensity: 0 }),
    signalGreen: new THREE.MeshStandardMaterial({ color: 0x0a300a, emissive: 0x30ff50, emissiveIntensity: 1.5 }),
    signalRed: new THREE.MeshStandardMaterial({ color: 0x300a0a, emissive: 0xff2010, emissiveIntensity: 1.5 }),
    windows: null as THREE.MeshStandardMaterial | null, // city only
  };

  constructor(track: RailTrack, region: Region) {
    this.track = track;
    // Roads first, so the landmarks (and random cows / palms) can avoid them
    const roads: Record<Region, CrossingSpec[]> = {
      prairie: [{ t: 0.22, near: 110, far: 110 }, { t: 0.9, near: 110, far: 110 }],
      mountain: [{ t: 0.18, near: 90, far: 90 }],
      city: [{ t: 0.25, near: 110, far: 110 }, { t: 0.72, near: 110, far: 110 }],
      // The sea is on the left, so this road only runs inland (a beach access road
      // ending at a little car park on the sand)
      coast: [{ t: 0.4, near: 12, far: 110 }],
    };
    this.layOutRoads(roads[region]);
    switch (region) {
      case 'prairie': this.buildPrairie(); break;
      case 'mountain': this.buildMountain(); break;
      case 'city': this.buildCity(); break;
      case 'coast': this.buildCoast(); break;
    }
    this.buildCrossings();
    this.bake();
    // The moving parts (gates, lamps, blades) share materials with the baked
    // parts, which receive shadows. Make them match: three.js compiles a
    // material once per receive-shadow setting, and objects that disagree
    // make it switch shader variants back and forth on every draw.
    this.group.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.receiveShadow = true; });
  }

  // ------------------------------------------------------------------
  // Placement helpers
  // ------------------------------------------------------------------

  /**
   * A group placed beside the track, turned to line up with it.
   * Inside the group: +x = away from the track on the right, +z = along the track.
   * @param t - 0..1 along the track
   * @param lateral - metres from the track centre (negative = left side)
   */
  private placeAt(t: number, lateral: number): THREE.Group {
    return this.placeAtDist(t * this.track.totalLength, lateral);
  }

  /** Same as placeAt, but by distance along the track (metres) */
  private placeAtDist(d: number, lateral: number): THREE.Group {
    const tp = this.track.getTrackPoint(Math.max(0.1, Math.min(this.track.totalLength - 0.1, d)));
    const g = new THREE.Group();
    g.position.copy(tp.position).addScaledVector(tp.right, lateral);
    g.position.y = GROUND_Y;
    g.rotation.y = Math.atan2(tp.forward.x, tp.forward.z);
    g.updateMatrixWorld(true);
    return g;
  }

  /** Keep trees away from a landmark */
  private block(g: THREE.Object3D, r: number): void {
    this.blockers.push({ x: g.position.x, z: g.position.z, r });
  }

  /** Add a box mesh to a group (sizes in metres, position = centre) */
  private box(g: THREE.Object3D, w: number, h: number, d: number, m: THREE.Material,
              x: number, y: number, z: number): THREE.Mesh {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    g.add(mesh);
    return mesh;
  }

  /** Add a cylinder (or cone, if rTop = 0) standing upright */
  private cyl(g: THREE.Object3D, rTop: number, rBot: number, h: number, m: THREE.Material,
              x: number, y: number, z: number, seg = 12): THREE.Mesh {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg), m);
    mesh.position.set(x, y, z);
    g.add(mesh);
    return mesh;
  }

  /** Queue every mesh in a (positioned) group for merging, then throw the group away */
  private bakeGroup(g: THREE.Object3D): void {
    g.updateMatrixWorld(true);
    g.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const geo = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
      mesh.geometry.dispose();
      const m = mesh.material as THREE.Material;
      if (!this.batches.has(m)) this.batches.set(m, []);
      this.batches.get(m)!.push(geo);
    });
  }

  /** Merge all queued static geometry: one mesh (one draw call) per material */
  private bake(): void {
    for (const [m, geos] of this.batches) {
      const merged = mergeGeometries(geos, false);
      for (const geo of geos) geo.dispose();
      if (!merged) continue;
      const mesh = new THREE.Mesh(merged, m);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.group.add(mesh);
    }
    this.batches.clear();
  }

  // ------------------------------------------------------------------
  // Kansas prairie
  // ------------------------------------------------------------------

  private buildPrairie(): void {
    const m = this.mat;

    // Grain elevator: a row of tall concrete silos with a headhouse on top
    const elev = this.placeAt(0.38, 24);
    for (let i = 0; i < 4; i++) {
      this.cyl(elev, 2.3, 2.3, 17, m.concrete, 0, 8.5, -6 + i * 4.4, 20);
      this.cyl(elev, 0.4, 2.3, 1.2, m.concrete, 0, 17.6, -6 + i * 4.4, 20);
    }
    this.box(elev, 5, 7, 6, m.concrete, 0, 20, 0.6);     // headhouse
    this.box(elev, 5.2, 0.4, 6.2, m.darkMetal, 0, 23.7, 0.6);
    this.box(elev, 6, 3, 8, m.galvanized, -5, 1.5, 0.6); // loading shed
    this.box(elev, 0.4, 14, 0.4, m.galvanized, -2.6, 13, 5); // spout pipe
    this.bakeGroup(elev);
    this.block(elev, 14);

    // Farm windmill: lattice tower, spinning wheel and tail vane
    const mill = this.placeAt(0.62, -20);
    for (const [x, z] of [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]]) {
      const leg = this.box(mill, 0.12, 10.2, 0.12, m.galvanized, x * 0.55, 5, z * 0.55);
      leg.rotation.set(z * 0.09, 0, -x * 0.09); // legs lean in toward the top
    }
    this.box(mill, 0.6, 0.5, 0.8, m.galvanized, 0, 10.2, 0);
    this.box(mill, 0.08, 0.5, 2.2, m.galvanized, 0, 10.3, -1.4);  // tail boom
    this.box(mill, 0.05, 1.1, 1.0, m.red, 0, 10.4, -2.6);        // tail vane
    this.bakeGroup(mill);
    const wheel = new THREE.Group();
    const wheelBase = this.placeAt(0.62, -20);
    wheel.position.set(0, 10.3, 0.55);
    for (let i = 0; i < 16; i++) {
      const blade = this.box(wheel, 0.32, 1.5, 0.03, m.galvanized, 0, 1.15, 0);
      blade.rotation.y = 0.35;
      const arm = new THREE.Group();
      arm.rotation.z = (i / 16) * Math.PI * 2;
      arm.add(blade);
      wheel.add(arm);
    }
    wheelBase.add(wheel);
    this.group.add(wheelBase);
    this.spinners.push({ obj: wheel, speed: 1.6, axis: 'z' });
    this.block(mill, 4);

    // Cattle grazing behind a fence on the left
    const field = this.placeAt(0.76, -16);
    for (let z = -16; z <= 16; z += 3.2) {
      this.box(field, 0.12, 1.2, 0.12, m.darkWood, 0, 0.6, z); // fence posts
    }
    this.box(field, 0.05, 0.08, 32, m.darkWood, 0, 0.95, 0);   // fence rails
    this.box(field, 0.05, 0.08, 32, m.darkWood, 0, 0.55, 0);
    this.bakeGroup(field);
    for (let i = 0; i < 7; i++) {
      const cow = this.placeClear(() => [0.76 + (Math.random() - 0.5) * 0.06, -19 - Math.random() * 14], 3);
      if (!cow) continue;
      cow.rotation.y += Math.random() * Math.PI * 2;
      this.buildCow(cow, Math.random() < 0.5 ? m.cow : m.cowWhite);
      this.group.add(cow);
    }
    this.block(field, 20);
  }

  /** A simple cow: body, legs, and a head that slowly bobs while grazing */
  private buildCow(g: THREE.Group, coat: THREE.Material): void {
    this.box(g, 0.75, 0.7, 1.6, coat, 0, 1.05, 0);
    for (const [x, z] of [[-0.25, -0.6], [0.25, -0.6], [-0.25, 0.6], [0.25, 0.6]]) {
      this.box(g, 0.16, 0.75, 0.16, coat, x, 0.37, z);
    }
    const neck = new THREE.Group();
    neck.position.set(0, 1.2, 0.8);
    this.box(neck, 0.4, 0.4, 0.55, coat, 0, -0.1, 0.3);
    this.box(neck, 0.48, 0.08, 0.08, this.mat.white, 0, 0.12, 0.15); // horns
    g.add(neck);
    this.bobbers.push({ obj: neck, phase: Math.random() * 10 });
  }

  // ------------------------------------------------------------------
  // Marias Pass (mountains)
  // ------------------------------------------------------------------

  private buildMountain(): void {
    const m = this.mat;

    // Summit marker: a stone obelisk on a stepped base, with a sign
    const summit = this.placeAt(0.5, -9);
    this.box(summit, 3, 0.6, 3, m.stone, 0, 0.3, 0);
    this.box(summit, 2.2, 0.6, 2.2, m.stone, 0, 0.9, 0);
    const shaft = this.cyl(summit, 0.45, 0.85, 11, m.concrete, 0, 6.7, 0, 4);
    shaft.rotation.y = Math.PI / 4;
    this.cyl(summit, 0, 0.45, 1, m.concrete, 0, 12.7, 0, 4).rotation.y = Math.PI / 4;
    this.box(summit, 0.12, 2, 0.12, m.darkWood, 2.6, 1, -2.4);       // sign posts
    this.box(summit, 0.12, 2, 0.12, m.darkWood, 2.6, 1, -0.6);
    this.box(summit, 0.1, 0.8, 2.4, m.darkWood, 2.6, 2.1, -1.5);     // sign board
    this.box(summit, 0.02, 0.5, 2.0, m.paint, 2.66, 2.1, -1.5);      // lettering panel
    this.bakeGroup(summit);
    this.block(summit, 5);

    // Fire lookout: a small cabin up on a timber tower
    const tower = this.placeAt(0.3, 32);
    for (const x of [-1.6, 1.6]) for (const z of [-1.6, 1.6]) {
      const leg = this.box(tower, 0.25, 12.5, 0.25, m.wood, x * 0.8, 6, z * 0.8);
      leg.rotation.set(-z * 0.035, 0, x * 0.035);
    }
    for (const y of [3, 6.5, 10]) this.box(tower, 3, 0.15, 3, m.wood, 0, y, 0);
    this.box(tower, 3.4, 2.2, 3.4, m.wood, 0, 13.2, 0);
    this.box(tower, 3.5, 0.9, 3.5, m.lampWarm, 0, 13.5, 0);           // windows glow at night
    this.cyl(tower, 0, 2.8, 1.4, m.roof, 0, 15, 0, 4).rotation.y = Math.PI / 4;
    this.bakeGroup(tower);
    this.block(tower, 4);

    // Log cabin with a stone chimney
    const cabin = this.placeAt(0.74, -22);
    this.box(cabin, 6, 2.8, 4.5, m.darkWood, 0, 1.4, 0);
    const roofL = this.box(cabin, 6.6, 0.25, 3, m.roof, 0, 3.4, -1.15);
    roofL.rotation.x = 0.6;
    const roofR = this.box(cabin, 6.6, 0.25, 3, m.roof, 0, 3.4, 1.15);
    roofR.rotation.x = -0.6;
    this.box(cabin, 0.9, 5, 0.9, m.stone, 2.6, 2.5, 0);
    this.box(cabin, 0.8, 0.7, 0.05, m.lampWarm, -1, 1.5, 2.26);       // lit window
    this.box(cabin, 0.8, 0.7, 0.05, m.lampWarm, 1, 1.5, 2.26);
    this.box(cabin, 0.9, 1.8, 0.05, m.wood, -2.3, 0.9, 2.26);          // door
    this.bakeGroup(cabin);
    this.block(cabin, 6);
  }

  // ------------------------------------------------------------------
  // Chicago (city)
  // ------------------------------------------------------------------

  /** Canvas texture of office windows, a few lit (for the skyline at night) */
  private makeWindowTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 64; c.height = 128;
    const g = c.getContext('2d')!;
    g.fillStyle = '#1a1c22';
    g.fillRect(0, 0, 64, 128);
    for (let y = 2; y < 128; y += 6) {
      for (let x = 2; x < 64; x += 6) {
        const lit = Math.random() < 0.35;
        g.fillStyle = lit ? (Math.random() < 0.7 ? '#ffd890' : '#cfe4ff') : '#2c3038';
        g.fillRect(x, y, 4, 3);
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private buildCity(): void {
    const m = this.mat;
    const winTex = this.makeWindowTexture();
    m.windows = new THREE.MeshStandardMaterial({
      color: 0x8890a0, map: winTex, emissive: 0xffffff, emissiveMap: winTex,
      emissiveIntensity: 0, roughness: 0.6, metalness: 0.3,
    });

    // Skyline: tall towers far off on the right, all along the route
    for (let i = 0; i < 26; i++) {
      const t = i / 25;
      const g = this.placeAt(t, 90 + Math.random() * 80);
      const w = 8 + Math.random() * 10;
      const h = 22 + Math.random() * 60 * (1 - Math.abs(t - 0.55)); // tallest near the middle
      this.box(g, w, h, w * (0.7 + Math.random() * 0.5), m.windows, 0, h / 2, 0);
      if (Math.random() < 0.4) this.box(g, 0.3, 8, 0.3, m.darkMetal, 0, h + 4, 0); // antenna
      this.bakeGroup(g);
    }

    // Brick warehouses close to the track on the left
    for (const t of [0.12, 0.45, 0.86]) {
      const g = this.placeAt(t, -20);
      this.box(g, 12, 8, 26, m.brick, 0, 4, 0);
      this.box(g, 12.4, 0.5, 26.4, m.darkMetal, 0, 8.2, 0);
      for (let z = -11; z <= 11; z += 3.6) {
        for (const y of [2.5, 5.5]) this.box(g, 0.05, 1.4, 1.8, m.windows, 6.02, y, z);
      }
      this.box(g, 0.05, 3.2, 4, m.darkMetal, 6.02, 1.6, 0); // loading door
      this.bakeGroup(g);
      this.block(g, 16);
    }

    // Water tower on legs
    const wt = this.placeAt(0.32, -30);
    for (const x of [-2, 2]) for (const z of [-2, 2]) this.box(wt, 0.3, 12, 0.3, m.darkMetal, x, 6, z);
    this.cyl(wt, 3.2, 3.2, 4.5, m.galvanized, 0, 14, 0, 16);
    this.cyl(wt, 0.3, 3.4, 1.8, m.galvanized, 0, 17.1, 0, 16);
    this.bakeGroup(wt);
    this.block(wt, 5);

    // Signal gantry spanning both tracks (main + adjacent on the right)
    const gan = this.placeAt(0.56, 0);
    // High enough that the signal heads clear the grinder and freight (≥ 6 m)
    this.box(gan, 0.4, 8.5, 0.4, m.galvanized, -4.2, 4.25, 0);
    this.box(gan, 0.4, 8.5, 0.4, m.galvanized, 9.2, 4.25, 0);
    this.box(gan, 13.8, 0.5, 0.5, m.galvanized, 2.5, 8.5, 0);
    this.box(gan, 13.8, 0.15, 0.8, m.galvanized, 2.5, 8.8, 0); // walkway
    for (const [x, lamp] of [[0, m.signalGreen], [5, m.signalRed]] as const) {
      this.box(gan, 0.6, 1.6, 0.5, m.darkMetal, x, 7.4, -0.1);
      this.box(gan, 0.3, 0.3, 0.05, lamp, x, 7.8, -0.38);
      this.box(gan, 0.3, 0.3, 0.05, m.darkMetal, x, 7.2, -0.38);
    }
    this.bakeGroup(gan);
  }

  // ------------------------------------------------------------------
  // California coast
  // ------------------------------------------------------------------

  private buildCoast(): void {
    const m = this.mat;

    // Lighthouse on a rock in the surf (the sea is on the left)
    const lh = this.placeAt(0.62, -32);
    for (let i = 0; i < 6; i++) {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(2.5 + Math.random() * 2, 0), m.stone);
      rock.position.set((Math.random() - 0.5) * 6, 0.2, (Math.random() - 0.5) * 6);
      rock.rotation.set(Math.random() * 3, Math.random() * 3, 0);
      lh.add(rock);
    }
    this.cyl(lh, 1.5, 2.2, 14, m.white, 0, 9, 0, 16);
    this.cyl(lh, 1.55, 1.75, 2.2, m.red, 0, 10, 0, 16);          // red band
    this.cyl(lh, 1.9, 1.9, 0.3, m.darkMetal, 0, 16.1, 0, 16);    // gallery
    this.cyl(lh, 1.1, 1.1, 1.8, m.lampWarm, 0, 17.2, 0, 12);     // lamp room
    this.cyl(lh, 0, 1.3, 1.2, m.red, 0, 18.7, 0, 12);            // cap
    this.bakeGroup(lh);
    // Sweeping beam: two long faint cones, turning
    this.beamMat = new THREE.MeshBasicMaterial({
      color: 0xfff2c0, transparent: true, opacity: 0, depthWrite: false,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      forceSinglePass: true, // see-through + double-sided: draw once, not back-then-front (same look; avoids a shader re-check each draw)
    });
    const beamGeo = new THREE.ConeGeometry(3, 60, 16, 1, true);
    beamGeo.translate(0, -30, 0);
    beamGeo.rotateZ(Math.PI / 2); // tip at the lamp, pointing along +x
    const spin = new THREE.Group();
    spin.position.set(0, 17.2, 0);
    for (const dir of [0, Math.PI]) {
      const beam = new THREE.Mesh(beamGeo, this.beamMat);
      beam.rotation.y = dir;
      spin.add(beam);
    }
    const lhAnim = this.placeAt(0.62, -32);
    lhAnim.add(spin);
    this.group.add(lhAnim);
    this.spinners.push({ obj: spin, speed: 0.9, axis: 'y' });
    this.beams.push(spin);

    // Lifeguard tower on the beach
    const lg = this.placeAt(0.3, -11);
    for (const x of [-1, 1]) for (const z of [-1, 1]) this.box(lg, 0.15, 2.4, 0.15, m.white, x, 1.2, z);
    this.box(lg, 2.6, 1.8, 2.6, m.white, 0, 3.3, 0);
    this.box(lg, 0.05, 0.8, 2, m.lampWarm, -1.32, 3.5, 0);
    const lgRoof = this.box(lg, 3, 0.2, 3, m.red, 0, 4.4, 0);
    lgRoof.rotation.z = 0.12;
    const ramp = this.box(lg, 3.5, 0.1, 1, m.wood, 2.5, 1.3, 0);
    ramp.rotation.z = -0.65;
    this.bakeGroup(lg);

    // Palm trees on the inland side
    for (let i = 0; i < 14; i++) {
      const g = this.placeClear(() => [0.05 + Math.random() * 0.9, 10 + Math.random() * 18], 4);
      if (!g) continue;
      this.buildPalm(g, 6 + Math.random() * 4);
      this.bakeGroup(g);
      this.block(g, 2.5);
    }
  }

  /** Palm: a slightly bending trunk made of segments, topped with drooping fronds */
  private buildPalm(g: THREE.Group, height: number): void {
    const segs = 6;
    const lean = (Math.random() - 0.5) * 0.25;
    let x = 0, y = 0;
    for (let i = 0; i < segs; i++) {
      const h = height / segs;
      const seg = this.cyl(g, 0.18, 0.24, h, this.mat.palmTrunk, x, y + h / 2, 0, 7);
      seg.rotation.z = -lean * (i / segs) * 2;
      x += Math.sin(lean * (i / segs) * 2) * h;
      y += h * 0.98;
    }
    for (let i = 0; i < 8; i++) {
      const frond = new THREE.Mesh(new THREE.ConeGeometry(0.5, 3.4, 4, 1), this.mat.palmLeaf);
      frond.scale.set(1, 1, 0.15); // flatten into a leaf
      const a = (i / 8) * Math.PI * 2;
      frond.position.set(x + Math.cos(a) * 1.4, y - 0.5, Math.sin(a) * 1.4);
      frond.rotation.set(0, -a, 0);
      frond.rotateZ(-Math.PI / 2 - 0.5); // point outward and droop
      g.add(frond);
    }
  }

  // ------------------------------------------------------------------
  // Level crossings
  // ------------------------------------------------------------------

  /**
   * Decide where the crossing roads go (before any landmarks are built).
   * Each crossing is snapped to the middle of a 20 m section, so it never
   * lands on a slow-order sign (those stand at section starts).
   */
  private layOutRoads(specs: CrossingSpec[]): void {
    const off = this.track.sectionOffset;
    for (const spec of specs) {
      const raw = spec.t * this.track.totalLength;
      const k = Math.max(0, Math.floor((raw - off) / GAME_SECTION_LENGTH));
      const dist = Math.min(off + (k + 0.5) * GAME_SECTION_LENGTH, this.track.totalLength - 20);
      const tp = this.track.getTrackPoint(dist);
      const origin = tp.position.clone();
      origin.y = GROUND_Y;
      this.crossings.push({
        dist, active: false, timer: 99, gateAngle: 1, gates: [], lamps: [],
        car: new THREE.Group(), carX: spec.far - 5, carDir: -1, carSpeed: CAR_SPEED, carWait: 0,
        near: spec.near, far: spec.far,
        origin, right: tp.right.clone(), forward: tp.forward.clone(),
      });
    }
  }

  /** Is (x, z) on (or within `margin` m of) a crossing road? */
  private onRoad(x: number, z: number, margin = 0): boolean {
    for (const c of this.crossings) {
      const dx = x - c.origin.x, dz = z - c.origin.z;
      const lat = dx * c.right.x + dz * c.right.z;
      const along = dx * c.forward.x + dz * c.forward.z;
      if (Math.abs(along) < 3.25 + margin && lat > -c.near - margin && lat < c.far + margin) return true;
    }
    return false;
  }

  /**
   * Try random spots (from `pick`, returning [t, lateral]) until one is off
   * the roads. Returns null if none found — the caller just skips that item.
   */
  private placeClear(pick: () => [number, number], margin: number): THREE.Group | null {
    for (let tries = 0; tries < 12; tries++) {
      const [t, lateral] = pick();
      const g = this.placeAt(t, lateral);
      if (!this.onRoad(g.position.x, g.position.z, margin)) return g;
    }
    return null;
  }

  /** Build the road, signals, gates and car for each crossing laid out earlier */
  private buildCrossings(): void {
    const m = this.mat;
    for (const crossing of this.crossings) {
      const s = this.placeAtDist(crossing.dist, 0); // static parts
      const a = this.placeAtDist(crossing.dist, 0); // moving parts
      const { near, far } = crossing;

      // Road (runs across the track along local x), with a dashed centre line
      const roadLen = near + far;
      const road = new THREE.Mesh(new THREE.PlaneGeometry(roadLen, 6.5), m.asphalt);
      road.rotation.x = -Math.PI / 2;
      road.position.set((far - near) / 2, 0.035, 0);
      s.add(road);
      for (let x = -near + 2; x < far - 2; x += 4) {
        if (Math.abs(x - 2.5) < 9) continue; // no paint across the tracks
        this.box(s, 2, 0.02, 0.15, m.paint, x, 0.05, 0);
      }
      // Concrete crossing panels over the ties of both tracks (main at x = 0,
      // adjacent at x = 5). Top sits at y ≈ −0.22: above the ties, below the rail heads.
      for (const x of [0, 5]) this.box(s, 3.4, 0.2, 6.5, m.concrete, x, 0.28, 0);

      // Two signal masts, on opposite road edges, each with a gate for the
      // lane that approaches it
      const masts = [
        { x: -3.8, z: -3.6, armDir: 1 },  // left side, arm reaches +z
        { x: 8.8, z: 3.6, armDir: -1 },   // right side (past the adjacent track)
      ];
      for (const mast of masts) {
        this.cyl(s, 0.09, 0.11, 4.2, m.galvanized, mast.x, 2.1, mast.z, 8);
        // Crossbuck: two white boards in an X
        for (const r of [0.6, -0.6]) {
          const board = this.box(s, 0.04, 0.22, 1.5, m.white, mast.x - 0.08, 3.8, mast.z);
          board.rotation.x = r;
        }
        this.box(s, 0.05, 0.1, 1.3, m.darkMetal, mast.x - 0.06, 2.9, mast.z); // lamp bar
        this.box(s, 0.5, 0.5, 0.5, m.darkMetal, mast.x, 0.25, mast.z);        // gate motor box
        const lamps: THREE.Mesh[] = [];
        for (const lz of [-0.5, 0.5]) {
          const lamp = this.box(a, 0.08, 0.28, 0.28, m.lampRed.clone(), mast.x - 0.12, 2.9, mast.z + lz);
          lamps.push(lamp);
        }
        crossing.lamps.push(lamps);
        // Gate arm: red and white stripes, pivoting at the mast
        const pivot = new THREE.Group();
        pivot.position.set(mast.x - 0.3, 1.0, mast.z);
        for (let i = 0; i < 6; i++) {
          this.box(pivot, 0.08, 0.1, 0.62, i % 2 ? m.white : m.red, 0, 0, mast.armDir * (0.35 + i * 0.62));
        }
        a.add(pivot);
        crossing.gates.push({ pivot, upSign: -mast.armDir });
      }

      // A car that drives back and forth along the road (waiting at the gates)
      this.buildCar(crossing.car);
      crossing.car.rotation.y = -Math.PI / 2; // facing −x (toward the track)
      crossing.car.position.set(crossing.carX, 0, 1.6);
      a.add(crossing.car);

      this.bakeGroup(s);
      this.group.add(a);
    }
  }

  private buildCar(g: THREE.Group): void {
    const colours = [0x2a5aa8, 0xa82a2a, 0xe0e0e0, 0x2a2a2a, 0x3a7a4a];
    const body = new THREE.MeshStandardMaterial({
      color: colours[Math.floor(Math.random() * colours.length)], metalness: 0.4, roughness: 0.4,
    });
    this.box(g, 1.8, 0.7, 4.2, body, 0, 0.65, 0);
    this.box(g, 1.6, 0.6, 2.2, body, 0, 1.3, -0.2);
    this.box(g, 1.62, 0.45, 2.0, this.mat.darkMetal, 0, 1.32, -0.2); // windows
    for (const x of [-0.85, 0.85]) for (const z of [-1.3, 1.3]) {
      const w = this.cyl(g, 0.33, 0.33, 0.25, this.mat.darkMetal, x, 0.33, z, 10);
      w.rotation.z = Math.PI / 2;
    }
    for (const x of [-0.6, 0.6]) this.box(g, 0.35, 0.18, 0.05, this.mat.lampWarm, x, 0.75, 2.11); // headlights
    for (const x of [-0.6, 0.6]) this.box(g, 0.35, 0.15, 0.05, this.mat.lampRed, x, 0.75, -2.11); // tail lights
  }

  // ------------------------------------------------------------------
  // Public
  // ------------------------------------------------------------------

  /** True if trees/rocks shouldn't be placed at (x, z): roads and landmarks */
  blocks(x: number, z: number): boolean {
    for (const b of this.blockers) {
      const dx = x - b.x, dz = z - b.z;
      if (dx * dx + dz * dz < b.r * b.r) return true;
    }
    return this.onRoad(x, z, 2.5);
  }

  /**
   * Animate everything and run the crossings.
   * @param occupied - stretches of track a train is on or about to reach
   *                   (the grinder and any passing freight, with warning time)
   * @param grinderPosition - distance along the track of the consist (for the bell volume)
   * @param darkness - 0 (day) .. 1 (night) — lamps and windows glow in the dark
   * @returns crossing bell loudness 0..1 (for the audio)
   */
  update(dt: number, occupied: Occupancy[], grinderPosition: number, darkness: number): number {
    this.time += dt;
    for (const s of this.spinners) s.obj.rotation[s.axis] += s.speed * dt;
    for (const b of this.bobbers) {
      b.obj.rotation.x = 0.55 + Math.sin(this.time * 0.6 + b.phase) * 0.35; // grazing
    }

    // Lamps, windows and the lighthouse come alive at night
    this.mat.lampWarm.emissiveIntensity = darkness * 2.2;
    if (this.mat.windows) this.mat.windows.emissiveIntensity = 0.05 + darkness * 1.4;
    if (this.beamMat) this.beamMat.opacity = THREE.MathUtils.smoothstep(darkness, 0.3, 0.8) * 0.12;
    for (const spin of this.beams) spin.visible = darkness > 0.3;

    let bell = 0;
    for (const c of this.crossings) {
      bell = Math.max(bell, this.updateCrossing(c, dt, occupied, grinderPosition));
    }
    return bell;
  }

  /**
   * Lights flash and gates drop while any train is on or approaching the
   * crossing. The car only drives over the tracks when the crossing is open
   * and both tracks are clear; otherwise it waits at the stop line.
   */
  private updateCrossing(c: Crossing, dt: number, occupied: Occupancy[], grinderPosition: number): number {
    const active = occupied.some((o) => o.from < c.dist && c.dist < o.to);
    if (active !== c.active) { c.active = active; c.timer = 0; }
    c.timer += dt;

    // Gates: lights flash for 2 s first, then the arms come down over ~3 s
    const target = active && c.timer > 2 ? 0 : 1;
    const step = dt / 3;
    c.gateAngle = target < c.gateAngle ? Math.max(target, c.gateAngle - step)
                                       : Math.min(target, c.gateAngle + step);
    const ease = c.gateAngle * c.gateAngle * (3 - 2 * c.gateAngle);
    for (const g of c.gates) g.pivot.rotation.x = g.upSign * ease * (Math.PI / 2);

    // Alternating red lamps, about once a second each
    const flashOn = active || c.gateAngle < 1;
    const phase = Math.floor(this.time * 2) % 2;
    for (const pair of c.lamps) {
      pair.forEach((lamp, i) => {
        (lamp.material as THREE.MeshStandardMaterial).emissiveIntensity = flashOn && i === phase ? 4 : 0;
      });
    }

    this.updateCar(c, dt, flashOn);

    // Bell is loudest when the consist is right at the crossing
    if (!flashOn) return 0;
    return Math.max(0.2, 1 - Math.abs(grinderPosition + 10 - c.dist) / 120);
  }

  /** Drive the crossing's car (see stepCrossingCar), then place its mesh */
  private updateCar(c: Crossing, dt: number, closed: boolean): void {
    stepCrossingCar(c, dt, closed);

    // Keep right: the lane (and the way the car faces) follows its direction,
    // easing across while it turns round at the road end
    const laneZ = c.carDir < 0 ? 1.6 : -1.6;
    const yaw = c.carDir < 0 ? -Math.PI / 2 : Math.PI / 2;
    const k = Math.min(1, dt * 1.5);
    c.car.position.x = c.carX;
    c.car.position.z += (laneZ - c.car.position.z) * k;
    c.car.rotation.y += (yaw - c.car.rotation.y) * k;
  }
}
