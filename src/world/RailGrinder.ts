/**
 * RailGrinder - Detailed rail grinding consist.
 * Extreme geometric and color detail on every surface.
 */

import * as THREE from 'three';
import { createTrainBodyTexture, createRoughnessMap } from './ProceduralTextures';

const WG = 0.72;

export interface GrinderCar { group: THREE.Group; offset: number; halfLength: number; }

export class RailGrinder {
  readonly cars: GrinderCar[] = [];
  readonly group: THREE.Group;
  private beacons: THREE.Mesh[] = [];
  private beaconPhase = 0;
  private grindModules: THREE.Mesh[] = [];
  private grindModuleRestY: number[] = [];
  private _grinding = false;
  private m: Record<string, THREE.Material>;

  constructor() {
    this.group = new THREE.Group();
    const bodyTex = createTrainBodyTexture('#eed202', 512, 256, {});
    const roughTex = createRoughnessMap();

    this.m = {
      body: new THREE.MeshStandardMaterial({ color: 0xeed202, metalness: 0.15, roughness: 0.55, map: bodyTex, roughnessMap: roughTex }),
      bodyDk: new THREE.MeshStandardMaterial({ color: 0xccb502, metalness: 0.12, roughness: 0.6 }),
      frame: new THREE.MeshStandardMaterial({ color: 0x1e1e1e, metalness: 0.5, roughness: 0.7 }),
      fmid: new THREE.MeshStandardMaterial({ color: 0x3a3a3a, metalness: 0.35, roughness: 0.65 }),
      pipe: new THREE.MeshStandardMaterial({ color: 0x9a9a9a, metalness: 0.7, roughness: 0.3 }),
      win: new THREE.MeshStandardMaterial({ color: 0x7ab8dd, emissive: 0x1a3344, metalness: 0.9, roughness: 0.1 }),
      skirt: new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.95 }),
      rail: new THREE.MeshStandardMaterial({ color: 0xddcc00, metalness: 0.2, roughness: 0.45 }),
      hl: new THREE.MeshStandardMaterial({ color: 0xffffee, emissive: 0xffff88, emissiveIntensity: 3 }),
      beacon: new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 1, transparent: true, opacity: 0.9 }),
      red: new THREE.MeshStandardMaterial({ color: 0xcc1111 }),
      white: new THREE.MeshStandardMaterial({ color: 0xe8e8e8 }),
      blue: new THREE.MeshStandardMaterial({ color: 0x1a3366, metalness: 0.2, roughness: 0.5 }),
      green: new THREE.MeshStandardMaterial({ color: 0x228833, metalness: 0.4, roughness: 0.5 }),
      redPipe: new THREE.MeshStandardMaterial({ color: 0xbb2222, metalness: 0.4, roughness: 0.5 }),
      orange: new THREE.MeshStandardMaterial({ color: 0xdd6600, metalness: 0.15, roughness: 0.5 }),
      rust: new THREE.MeshStandardMaterial({ color: 0x6b4a30, metalness: 0.3, roughness: 0.85, transparent: true, opacity: 0.5 }),
      soot: new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.15, roughness: 0.9 }),
      inst: new THREE.MeshStandardMaterial({ color: 0x113322, emissive: 0x112211, emissiveIntensity: 0.3, metalness: 0.5, roughness: 0.3 }),
      led: new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: 0x00ff44, emissiveIntensity: 0.4 }),
      exit: new THREE.MeshStandardMaterial({ color: 0x00aa44, emissive: 0x00aa44, emissiveIntensity: 0.2 }),
      nb: new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xaaaa55, emissiveIntensity: 0.3 }),
      redLt: new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5 }),
    };

    this.buildCab(-42); this.buildWater(-26); this.buildGrind(-12); this.buildGrind(0);
    this.buildGrind(12); this.buildGrind(24); this.buildWater(38); this.buildGen(52); this.buildCrew(67);
  }

  setGrinding(a: boolean) { this._grinding = a; }
  update(dt: number) {
    this.beaconPhase += dt * 5;
    const b = 0.3 + Math.abs(Math.sin(this.beaconPhase)) * 0.7;
    for (const bm of this.beacons) (bm.material as THREE.MeshStandardMaterial).emissiveIntensity = b * 2.5;
    const drop = this._grinding ? 0.25 : 0;
    for (let i = 0; i < this.grindModules.length; i++)
      this.grindModules[i].position.y += (this.grindModuleRestY[i] - drop - this.grindModules[i].position.y) * 6 * dt;
  }

  // ---- Primitives ----
  private B(g: THREE.Group, w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number) {
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = true; g.add(o); return o;
  }
  private C(g: THREE.Group, rt: number, rb: number, h: number, s: number, m: THREE.Material, x: number, y: number, z: number, rx = 0, rz = 0) {
    const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, s), m); o.position.set(x, y, z); o.rotation.x = rx; o.rotation.z = rz; o.castShadow = true; g.add(o); return o;
  }
  private S(g: THREE.Group, r: number, s: number, m: THREE.Material, x: number, y: number, z: number) {
    const o = new THREE.Mesh(new THREE.SphereGeometry(r, s, s), m); o.position.set(x, y, z); g.add(o); return o;
  }

  // ---- Reusable assemblies ----
  private trucks(g: THREE.Group, len: number) {
    const wG = new THREE.CylinderGeometry(0.45, 0.45, 0.15, 20);
    const wM = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.85, roughness: 0.3 });
    for (const tz of [-len * 0.35, len * 0.35]) {
      // Sideframes
      this.B(g, 2.5, 0.12, 1.6, this.m.frame, 0, 0.28, tz);
      this.B(g, 2.8, 0.08, 0.3, this.m.fmid, 0, 0.42, tz);
      // Wheels, axles, hubs
      for (const wz of [-0.55, 0.55]) {
        for (const s of [-1, 1]) {
          const w = new THREE.Mesh(wG, wM); w.rotation.x = Math.PI / 2; w.position.set(s * WG, 0.45, tz + wz); g.add(w);
          this.C(g, 0.18, 0.18, 0.03, 12, this.m.pipe, s * WG, 0.45, tz + wz, Math.PI / 2, 0);
        }
        this.C(g, 0.05, 0.05, 1.5, 8, this.m.frame, 0, 0.45, tz + wz, 0, Math.PI / 2);
      }
      // Springs, brake beam, snubbers
      for (const sx of [-0.7, -0.3, 0.3, 0.7]) this.C(g, 0.06, 0.06, 0.14, 8, this.m.pipe, sx, 0.38, tz);
      this.B(g, 1.8, 0.04, 0.05, this.m.frame, 0, 0.34, tz + 0.3);
      this.B(g, 1.8, 0.04, 0.05, this.m.frame, 0, 0.34, tz - 0.3);
      // Brake cylinders
      this.C(g, 0.06, 0.06, 0.25, 8, this.m.fmid, 0.8, 0.35, tz, 0, Math.PI / 2);
      this.C(g, 0.06, 0.06, 0.25, 8, this.m.fmid, -0.8, 0.35, tz, 0, Math.PI / 2);
    }
    // Air reservoirs
    this.C(g, 0.1, 0.1, 2.5, 12, this.m.fmid, 0.9, 0.55, 0, 0, Math.PI / 2);
    this.C(g, 0.08, 0.08, 1.5, 10, this.m.fmid, -0.9, 0.55, 0, 0, Math.PI / 2);
    // Colored brake/air pipes
    this.C(g, 0.025, 0.025, len * 0.85, 6, this.m.green, 0.6, 0.58, 0, Math.PI / 2, 0);
    this.C(g, 0.02, 0.02, len * 0.85, 6, this.m.redPipe, -0.6, 0.58, 0, Math.PI / 2, 0);
    this.C(g, 0.02, 0.02, len * 0.8, 4, this.m.pipe, 1.25, 0.6, 0, Math.PI / 2, 0);
    this.C(g, 0.02, 0.02, len * 0.8, 4, this.m.pipe, -1.25, 0.6, 0, Math.PI / 2, 0);
  }

  private coupler(g: THREE.Group, z: number, d: number) {
    this.B(g, 0.5, 0.3, 0.5, this.m.frame, 0, 0.65, z);
    this.B(g, 0.25, 0.2, 0.4, this.m.fmid, 0, 0.65, z + d * 0.2);
    this.B(g, 0.35, 0.25, 0.2, this.m.fmid, 0, 0.65, z + d * 0.5);
    this.C(g, 0.025, 0.025, 0.3, 4, this.m.fmid, -0.2, 0.45, z + d * 0.4, 0.3, 0);
    this.C(g, 0.025, 0.025, 0.3, 4, this.m.fmid, 0.2, 0.45, z + d * 0.4, 0.3, 0);
    // Glad hand air hoses
    this.C(g, 0.03, 0.02, 0.2, 6, this.m.frame, -0.3, 0.55, z + d * 0.6, 0.5, 0);
    this.C(g, 0.03, 0.02, 0.2, 6, this.m.frame, 0.3, 0.55, z + d * 0.6, 0.5, 0);
  }

  private ladder(g: THREE.Group, x: number, z: number) {
    for (const dx of [-0.12, 0.12]) this.C(g, 0.015, 0.015, 2, 4, this.m.rail, x + dx, 1.5, z);
    for (let y = 0.8; y <= 2.2; y += 0.28) this.C(g, 0.012, 0.012, 0.24, 4, this.m.rail, x, y, z, 0, Math.PI / 2);
  }

  private handrails(g: THREE.Group, len: number, h: number) {
    for (const s of [-1, 1]) {
      this.C(g, 0.018, 0.018, len, 6, this.m.rail, s * 1.62, h, 0, Math.PI / 2, 0);
      const n = Math.floor(len / 1.8);
      for (let i = 0; i <= n; i++) this.B(g, 0.02, 0.5, 0.02, this.m.rail, s * 1.62, h - 0.25, -len / 2 + (len / n) * i);
    }
  }

  private endStripes(g: THREE.Group, z: number) {
    for (let i = 0; i < 6; i++) this.B(g, 0.22, 1.6, 0.025, i % 2 === 0 ? this.m.red : this.m.white, -1.2 + i * 0.5, 1.8, z);
  }

  private beacon(g: THREE.Group, x: number, y: number, z: number) {
    this.C(g, 0.07, 0.09, 0.05, 12, this.m.frame, x, y - 0.03, z);
    const bm = this.S(g, 0.1, 12, this.m.beacon, x, y + 0.05, z); this.beacons.push(bm);
  }

  private steps(g: THREE.Group, len: number) {
    for (const z of [-len / 2, len / 2]) for (const s of [-1, 1]) {
      this.B(g, 0.45, 0.03, 0.25, this.m.fmid, s * 1.4, 0.7, z);
      this.B(g, 0.45, 0.03, 0.25, this.m.fmid, s * 1.4, 0.45, z);
    }
  }

  private warnStripes(g: THREE.Group, len: number) {
    for (let z = -len / 2 + 0.3; z < len / 2; z += 0.45)
      for (const s of [-1, 1]) { const st = this.B(g, 0.02, 0.13, 0.18, this.m.frame, s * 1.65, 0.88, z); st.rotation.z = s * 0.7; }
  }

  private rivets(g: THREE.Group, x: number, yStart: number, yEnd: number, z: number) {
    for (let y = yStart; y <= yEnd; y += 0.3)
      this.S(g, 0.015, 4, this.m.pipe, x, y, z);
  }

  private sidePanelLines(g: THREE.Group, len: number, yBot: number, yTop: number, count: number) {
    const sp = len / count;
    for (let i = 1; i < count; i++) {
      const z = -len / 2 + sp * i;
      for (const s of [-1, 1]) {
        this.B(g, 0.015, yTop - yBot - 0.2, 0.01, this.m.fmid, s * 1.65, (yBot + yTop) / 2, z);
        this.rivets(g, s * 1.65, yBot + 0.2, yTop - 0.2, z);
      }
    }
    // Horizontal seam
    const midY = (yBot + yTop) * 0.45;
    for (const s of [-1, 1]) this.B(g, 0.01, 0.01, len - 0.5, this.m.fmid, s * 1.65, midY, 0);
  }

  /** Add visible light fixture meshes to a car (no actual Three.js lights — those are managed by Game.ts) */
  private addCarLighting(g: THREE.Group, len: number): void {
    // Visible light housing meshes at each end (cosmetic only)
    for (const z of [-len / 2 + 1, len / 2 - 1]) {
      this.B(g, 0.12, 0.08, 0.08, this.m.frame, 0, 2.6, z);
      this.B(g, 0.08, 0.05, 0.02, this.m.hl, 0, 2.6, z > 0 ? z + 0.05 : z - 0.05);
    }
    // Side light housings (cosmetic)
    for (const s of [-1, 1]) {
      this.B(g, 0.08, 0.06, 0.06, this.m.frame, s * 1.65, 1.8, 0);
      this.B(g, 0.05, 0.04, 0.02, this.m.hl, s * 1.65, 1.8, s * 0.04);
    }
  }

  private reg(g: THREE.Group, off: number, hl: number) { this.cars.push({ group: g, offset: off, halfLength: hl }); this.group.add(g); }

  // ---- EXHAUST ----
  private exhaust(g: THREE.Group, x: number, y: number, z: number, h: number) {
    const pts = [new THREE.Vector2(0.16, 0), new THREE.Vector2(0.12, h * 0.2), new THREE.Vector2(0.11, h * 0.6), new THREE.Vector2(0.13, h * 0.85), new THREE.Vector2(0.18, h)];
    const geo = new THREE.LatheGeometry(pts, 14);
    const m = new THREE.Mesh(geo, this.m.fmid); m.position.set(x, y, z); m.castShadow = true; g.add(m);
    this.C(g, 0.22, 0.22, 0.03, 12, this.m.frame, x, y + h + 0.02, z);
    this.B(g, 0.5, 0.01, 0.8, this.m.soot, x, y - 0.01, z);
  }

  // ======== CAR BUILDERS ========

  private buildCab(off: number) {
    const g = new THREE.Group(); const hl = 8; const len = 16;
    // Frame + walkways
    this.B(g, 3.1, 0.2, len, this.m.frame, 0, 0.55, 0);
    for (const s of [-1, 1]) this.B(g, 0.35, 0.03, len, this.m.fmid, s * 1.55, 0.82, 0);
    // Body
    this.B(g, 3.0, 2.1, 10, this.m.body, 0, 1.85, -1);
    // Cab raised
    this.B(g, 3.1, 0.7, 4.3, this.m.body, 0, 3.25, -3.3);
    // Nose
    this.B(g, 2.6, 1.6, 2.4, this.m.bodyDk, 0, 1.6, 5.5);
    // Panel lines + rivets on body
    this.sidePanelLines(g, 10, 0.9, 2.8, 6);
    // Windshields raked
    for (const x of [-0.5, 0.5]) { const w = this.B(g, 0.9, 0.85, 0.05, this.m.win, x, 2.9, -5.48); w.rotation.x = -0.2; }
    this.B(g, 0.05, 0.9, 0.06, this.m.frame, 0, 2.9, -5.5);
    // Wipers
    for (const x of [-0.5, 0.5]) this.B(g, 0.4, 0.015, 0.015, this.m.frame, x, 2.55, -5.45);
    // Side windows (multiple)
    for (const s of [-1, 1]) {
      this.B(g, 0.05, 0.65, 1.2, this.m.win, s * 1.65, 2.8, -4.5);
      this.B(g, 0.05, 0.6, 0.8, this.m.win, s * 1.65, 2.8, -3);
      // Engine compartment windows (small portholes)
      for (const z of [0, 2, 4]) this.B(g, 0.04, 0.3, 0.3, this.m.win, s * 1.65, 2.2, z);
    }
    // Headlights with housings
    for (const x of [-0.65, 0.65]) { this.B(g, 0.35, 0.28, 0.12, this.m.frame, x, 2.4, 6.78); this.B(g, 0.28, 0.2, 0.04, this.m.hl, x, 2.4, 6.85); }
    for (const x of [-1.05, 1.05]) { this.B(g, 0.25, 0.2, 0.08, this.m.frame, x, 1.2, 6.78); this.B(g, 0.18, 0.14, 0.04, this.m.hl, x, 1.2, 6.85); }
    // Headlight glow (actual dynamic lights managed by Game.ts for performance)
    // Horns (detailed)
    for (const x of [-0.3, 0.3]) { this.C(g, 0.04, 0.06, 0.4, 14, this.m.pipe, x, 3.7, -4.5); this.C(g, 0.08, 0.08, 0.06, 12, this.m.pipe, x, 3.92, -4.5); }
    // Bell
    this.C(g, 0.06, 0.08, 0.1, 12, this.m.pipe, 0.4, 3.68, -3.5); this.C(g, 0.03, 0.03, 0.08, 6, this.m.frame, 0.4, 3.58, -3.5);
    // Exhaust
    this.exhaust(g, 0, 3.2, -0.5, 0.8);
    // Roof equipment
    this.B(g, 0.7, 0.2, 1.2, this.m.fmid, 0.8, 3.2, 1);
    this.B(g, 0.5, 0.15, 0.8, this.m.fmid, -0.6, 3.2, 0.5);
    this.C(g, 0.01, 0.01, 1.2, 4, this.m.frame, 0.6, 4.2, -2); // antenna
    this.C(g, 0.01, 0.01, 0.8, 4, this.m.frame, -0.5, 4.0, -1); // antenna 2
    this.beacon(g, 0, 3.85, -3);
    // Number boards
    for (const s of [-1, 1]) this.B(g, 0.04, 0.2, 0.5, this.m.nb, s * 1.65, 3.4, -4);
    // Instrument panel
    this.B(g, 1.6, 0.3, 0.3, this.m.inst, 0, 2.3, -5.0);
    // Side text panel
    for (const s of [-1, 1]) this.B(g, 0.03, 0.25, 1.5, this.m.blue, s * 1.65, 2.3, 1);
    // Orange nose triangle
    this.B(g, 0.5, 0.5, 0.04, this.m.orange, 0, 2.0, 6.76);
    // Side vents
    for (const s of [-1, 1]) for (const z of [1, 2.5, 4]) this.B(g, 0.03, 0.35, 0.5, this.m.fmid, s * 1.65, 1.5, z);
    // Conduit
    for (const s of [-1, 1]) this.C(g, 0.02, 0.02, 8, 6, this.m.pipe, s * 1.65, 2.5, -1, Math.PI / 2, 0);
    // MU boxes
    this.B(g, 0.15, 0.12, 0.08, this.m.frame, -0.5, 1.0, -8.02); this.B(g, 0.15, 0.12, 0.08, this.m.frame, 0.5, 1.0, -8.02);
    // Sand fillers
    this.C(g, 0.05, 0.05, 0.03, 8, this.m.pipe, 1.3, 0.87, 2); this.C(g, 0.05, 0.05, 0.03, 8, this.m.pipe, 1.3, 0.87, -2);
    // Fuel cap
    this.C(g, 0.06, 0.06, 0.03, 8, this.m.fmid, 1.65, 1.3, 1);
    // Grab irons
    for (const s of [-1, 1]) for (const z of [5, -7, 2, -4]) this.C(g, 0.012, 0.012, 0.25, 4, this.m.rail, s * 1.65, 1.8, z);
    // Marker lights
    for (const x of [-1.4, 1.4]) this.C(g, 0.04, 0.04, 0.03, 8, this.m.redLt, x, 2.8, 6.86);
    this.handrails(g, len, 1.9); this.steps(g, len); this.warnStripes(g, len);
    this.endStripes(g, 6.86);
    for (const z of [hl, -hl]) { this.ladder(g, 1.55, z); this.ladder(g, -1.55, z); }
    this.coupler(g, -8.2, -1); this.trucks(g, len);
    this.addCarLighting(g, len);
    this.reg(g, off, hl);
  }

  private buildGrind(off: number) {
    const g = new THREE.Group(); const hl = 6; const len = 12;

    // Underframe + walkways
    this.B(g, 3.1, 0.2, len, this.m.frame, 0, 0.55, 0);
    for (const s of [-1, 1]) this.B(g, 0.35, 0.03, len, this.m.fmid, s * 1.55, 0.82, 0);

    // BODY: single ExtrudeGeometry with sloped/tapered roof
    // Cross-section: vertical sides up to 75%, then taper inward to narrower flat roof
    // Total height = 2.0, bottom width = 3.0 (x=±1.5), top width = 2.2 (x=±1.1)
    const bodyH = 2.0, botHW = 1.5, topHW = 1.1, taperStart = 0.75;
    const bodyShape = new THREE.Shape();
    bodyShape.moveTo(-botHW, 0);
    bodyShape.lineTo(-botHW, bodyH * taperStart);
    bodyShape.lineTo(-topHW, bodyH);
    bodyShape.lineTo(topHW, bodyH);
    bodyShape.lineTo(botHW, bodyH * taperStart);
    bodyShape.lineTo(botHW, 0);
    bodyShape.lineTo(-botHW, 0);
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShape, { depth: len - 0.5, bevelEnabled: false });
    const bodyMesh = new THREE.Mesh(bodyGeo, this.m.body);
    bodyMesh.position.set(0, 0.8, -(len - 0.5) / 2);
    bodyMesh.castShadow = true;
    g.add(bodyMesh);

    // Body surface reference: vertical wall at x=±1.5 below y=2.3, tapering to x=±1.1 at y=2.8
    // wallX(y) = y < 2.3 ? 1.5 : 1.5 - (1.5-1.1)*((y-2.3)/0.5)
    const wallX = (y: number) => y < 2.3 ? 1.5 : 1.5 - 0.4 * ((y - 2.3) / 0.5);

    // Panel lines on the vertical portion (below taper)
    this.sidePanelLines(g, len, 0.9, 2.2, 7);

    // Red stripe at mid-height of vertical section (well within flat wall)
    for (const s of [-1, 1]) this.B(g, 0.03, 0.1, len - 1, this.m.red, s * 1.55, 2.0, 0);

    // Grinding modules hidden inside the body
    for (let i = 0; i < 8; i++) {
      const z = -4.5 + i * 1.3;
      const mod = this.B(g, 2.0, 0.3, 0.9, this.m.fmid, 0, 1.2, z);
      this.grindModules.push(mod); this.grindModuleRestY.push(1.2);
      this.C(g, 0.12, 0.12, 0.7, 12, this.m.pipe, 0, 0.95, z, 0, Math.PI / 2);
    }

    // === SPARK CONTAINMENT SYSTEM ===
    // Steel curtain frames (L-shaped brackets holding the tarpaulins)
    for (const s of [-1, 1]) {
      // Vertical frame posts every 2m
      for (let z = -4.5; z <= 4.5; z += 2) {
        this.B(g, 0.04, 1.2, 0.04, this.m.frame, s * 1.58, 1.1, z);
        // Horizontal cross-bar at the top of the curtain frame
        this.B(g, 0.12, 0.03, 0.04, this.m.frame, s * 1.58, 1.7, z);
      }
      // Continuous top rail for curtain frames
      this.C(g, 0.02, 0.02, len - 1.5, 4, this.m.frame, s * 1.58, 1.72, 0, Math.PI / 2, 0);
      // Tarpaulin/curtain panels (overlapping dark rubber sheets)
      for (let z = -5; z <= 5; z += 0.6) this.B(g, 0.04, 1.3, 0.5, this.m.skirt, s * 1.62, 0.9, z);
    }

    // === STONE ACCESS DOORS (hinged panels on sides) ===
    for (const s of [-1, 1]) {
      for (let z = -4; z <= 4; z += 2.6) {
        // Door outline (recessed panel)
        this.B(g, 0.025, 0.9, 1.8, this.m.bodyDk, s * 1.55, 1.5, z);
        // Door hinges (two per door)
        this.C(g, 0.015, 0.015, 0.06, 6, this.m.fmid, s * 1.56, 2.0, z - 0.7);
        this.C(g, 0.015, 0.015, 0.06, 6, this.m.fmid, s * 1.56, 1.2, z - 0.7);
        // Door handle/latch
        this.B(g, 0.02, 0.1, 0.02, this.m.pipe, s * 1.56, 1.5, z + 0.6);
      }
    }

    // === OBSERVATION WINDOWS (viewing ports to watch grinding) ===
    for (const s of [-1, 1]) {
      for (const z of [-2.5, 0, 2.5]) {
        this.B(g, 0.04, 0.2, 0.3, this.m.win, s * 1.55, 2.1, z);
      }
    }

    // === WATER SPRAY BARS (fire suppression manifold) ===
    // Main supply pipe running the length
    for (const s of [-1, 1]) this.C(g, 0.03, 0.03, len * 0.8, 8, this.m.pipe, s * 1.0, 0.7, 0, Math.PI / 2, 0);
    // Individual spray nozzles (more prominent than before)
    for (let z = -4.5; z <= 4.5; z += 1.0) {
      for (const s of [-1, 1]) {
        this.C(g, 0.02, 0.03, 0.15, 6, this.m.pipe, s * 1.0, 0.55, z); // nozzle body
        this.C(g, 0.035, 0.035, 0.02, 6, this.m.fmid, s * 1.0, 0.47, z); // spray head
      }
    }
    // Cross-feed pipes connecting the two spray bars
    for (const z of [-3, 0, 3]) this.C(g, 0.02, 0.02, 2.0, 6, this.m.pipe, 0, 0.7, z, 0, Math.PI / 2);

    // === DUST COLLECTION HOPPERS (on sides near bottom) ===
    for (const s of [-1, 1]) {
      this.B(g, 0.2, 0.3, 2.5, this.m.fmid, s * 1.55, 0.95, -2);
      this.B(g, 0.2, 0.3, 2.5, this.m.fmid, s * 1.55, 0.95, 2);
      // Collection chute (angled down)
      this.C(g, 0.06, 0.04, 0.3, 6, this.m.pipe, s * 1.55, 0.75, -2);
      this.C(g, 0.06, 0.04, 0.3, 6, this.m.pipe, s * 1.55, 0.75, 2);
    }

    // === HYDRAULIC HOSE BUNDLES (thick cable runs along sides) ===
    for (const s of [-1, 1]) {
      // Main hydraulic bundle (thicker than single pipes)
      this.C(g, 0.04, 0.04, len * 0.75, 8, this.m.frame, s * 1.55, 1.3, 0, Math.PI / 2, 0);
      // Secondary electrical conduit
      this.C(g, 0.025, 0.025, len * 0.7, 6, this.m.fmid, s * 1.55, 1.15, 0, Math.PI / 2, 0);
      // Cable clips holding bundles to body (every 2m)
      for (let z = -4; z <= 4; z += 2) this.B(g, 0.06, 0.06, 0.03, this.m.frame, s * 1.56, 1.22, z);
    }

    // === STONE ANGLE ACTUATOR ARMS (hydraulic cylinders on modules) ===
    for (let i = 0; i < 8; i++) {
      const z = -4.5 + i * 1.3;
      // Small hydraulic ram per module (visible from outside through gaps in skirts)
      for (const s of [-1, 1]) {
        this.C(g, 0.02, 0.015, 0.35, 6, this.m.pipe, s * 0.85, 0.9, z, 0.3, 0);
        // Ram mounting bracket
        this.B(g, 0.04, 0.04, 0.03, this.m.fmid, s * 0.85, 1.1, z);
      }
    }

    // === WARNING PLACARDS ===
    // "DANGER" (orange panels)
    for (const s of [-1, 1]) {
      this.B(g, 0.03, 0.12, 0.25, this.m.orange, s * 1.55, 2.15, -4.5);
      this.B(g, 0.03, 0.12, 0.25, this.m.orange, s * 1.55, 2.15, 4.5);
    }
    // "NO STEP" (yellow panels near roof)
    for (const s of [-1, 1]) {
      this.B(g, 0.03, 0.08, 0.2, this.m.rail, s * 1.55, 2.25, -1);
      this.B(g, 0.03, 0.08, 0.2, this.m.rail, s * 1.55, 2.25, 1);
    }

    // === AIR FILTRATION UNIT (on roof) ===
    this.B(g, 0.6, 0.15, 1.2, this.m.fmid, 0, 2.88, -3);
    // Filter intake grille
    this.B(g, 0.4, 0.1, 0.8, this.m.frame, 0, 2.88, -3);

    // === INTERCOM / RADIO BOXES (at car ends) ===
    for (const z of [-hl + 0.5, hl - 0.5]) {
      this.B(g, 0.12, 0.15, 0.08, this.m.fmid, 1.55, 1.7, z);
      // Small antenna
      this.C(g, 0.008, 0.008, 0.15, 4, this.m.frame, 1.55, 1.85, z);
    }

    // LED indicators
    for (let i = 0; i < 8; i++) this.C(g, 0.02, 0.02, 0.02, 6, this.m.led, 1.55, 1.6, -4.5 + i * 1.3);

    // Side work lights on vertical wall
    for (const s of [-1, 1]) {
      for (const z of [-4, -1, 2, 5]) {
        this.B(g, 0.06, 0.05, 0.05, this.m.frame, s * 1.55, 1.9, z);
        this.B(g, 0.04, 0.03, 0.02, this.m.hl, s * 1.55, 1.9, z + 0.035);
      }
    }

    // === FIRE EXTINGUISHER STATIONS (red, visible color pop) ===
    for (const s of [-1, 1]) {
      // Two per side — near each end
      for (const z of [-4, 3.5]) {
        this.C(g, 0.035, 0.035, 0.28, 8, this.m.red, s * 1.55, 1.4, z);
        // Mounting bracket
        this.B(g, 0.06, 0.04, 0.04, this.m.fmid, s * 1.55, 1.58, z);
      }
    }

    // === EMERGENCY STOP BUTTONS (red button on yellow plate) ===
    for (const z of [-hl + 0.8, hl - 0.8]) {
      // Yellow backing plate
      this.B(g, 0.04, 0.1, 0.1, this.m.rail, 1.55, 1.7, z);
      // Red button
      this.C(g, 0.025, 0.025, 0.02, 8, this.m.red, 1.56, 1.7, z);
    }

    // === HAND BRAKE WHEELS (at each end) ===
    for (const z of [-hl + 0.3, hl - 0.3]) {
      // Wheel (ring shape — cylinder on its side)
      this.C(g, 0.15, 0.15, 0.03, 14, this.m.fmid, 0, 1.6, z, 0, Math.PI / 2);
      // Hub
      this.C(g, 0.04, 0.04, 0.04, 8, this.m.pipe, 0, 1.6, z, 0, Math.PI / 2);
      // Shaft going into the body
      this.C(g, 0.02, 0.02, 0.2, 6, this.m.pipe, 0, 1.6, z, 0, 0);
      // Brake chain
      this.C(g, 0.01, 0.01, 0.5, 4, this.m.frame, 0.08, 1.35, z);
    }

    // === VISTA LASER PROFILING SYSTEM (underneath, scans the rail) ===
    // Laser housing boxes (one per rail, mounted under the car near the front)
    for (const s of [-1, 1]) {
      // Main housing (tech-looking dark box with lens)
      this.B(g, 0.2, 0.12, 0.3, this.m.frame, s * 0.5, 0.65, -hl + 1.5);
      // Lens/emitter window (green tint)
      const lensMat = new THREE.MeshStandardMaterial({ color: 0x44aa66, emissive: 0x22aa44, emissiveIntensity: 0.3 });
      this.B(g, 0.08, 0.04, 0.02, lensMat, s * 0.5, 0.59, -hl + 1.35);
      // Camera housing next to laser
      this.B(g, 0.1, 0.08, 0.12, this.m.fmid, s * 0.5, 0.65, -hl + 2.0);
    }
    // VISTA mounting rail
    this.C(g, 0.015, 0.015, 1.5, 4, this.m.pipe, 0, 0.65, -hl + 1.7, Math.PI / 2, 0);

    // === SPEED MEASUREMENT WHEEL ===
    // Small contact wheel that rides on the rail
    this.C(g, 0.06, 0.06, 0.02, 12, this.m.fmid, 0.4, 0.58, hl - 1);
    // Encoder housing
    this.B(g, 0.06, 0.06, 0.06, this.m.frame, 0.4, 0.64, hl - 1);
    // Arm connecting to body
    this.C(g, 0.015, 0.015, 0.25, 4, this.m.pipe, 0.4, 0.72, hl - 1);

    // === SPARE STONE STORAGE RACK (one side only, asymmetric) ===
    // Rack frame
    this.B(g, 0.04, 0.5, 1.5, this.m.frame, -1.55, 1.7, 0);
    this.B(g, 0.04, 0.04, 1.5, this.m.frame, -1.55, 1.95, 0);
    this.B(g, 0.04, 0.04, 1.5, this.m.frame, -1.55, 1.45, 0);
    // Spare stones (cylindrical)
    for (let z = -0.5; z <= 0.5; z += 0.35) {
      this.C(g, 0.08, 0.08, 0.12, 10, this.m.pipe, -1.56, 1.7, z, 0, Math.PI / 2);
    }

    // === TOOLBOX / EQUIPMENT LOCKER ===
    this.B(g, 0.15, 0.25, 0.5, this.m.fmid, 1.55, 1.0, hl - 1.5);
    // Latch
    this.B(g, 0.02, 0.06, 0.02, this.m.pipe, 1.56, 1.0, hl - 1.3);

    // === DRIP PANS (under hydraulic systems) ===
    this.B(g, 1.0, 0.02, 2.0, this.m.frame, 0, 0.66, -2);
    this.B(g, 1.0, 0.02, 2.0, this.m.frame, 0, 0.66, 2);

    // === COOLING WATER HOSES (flexible lines to grinding stones) ===
    for (let i = 0; i < 4; i++) {
      const z = -3.5 + i * 2.5;
      this.C(g, 0.015, 0.015, 0.4, 4, this.m.blue, 0.6, 0.75, z, 0.4, 0);
      this.C(g, 0.015, 0.015, 0.4, 4, this.m.blue, -0.6, 0.75, z, 0.4, 0);
    }

    // === COUPLER WALKWAY PLATES (steel bridges between cars) ===
    for (const z of [-hl - 0.15, hl + 0.15]) {
      this.B(g, 1.8, 0.04, 0.6, this.m.fmid, 0, 0.84, z);
      // Safety chains at edges
      for (const s of [-1, 1]) {
        this.C(g, 0.008, 0.008, 0.6, 4, this.m.frame, s * 0.85, 1.1, z);
        // Chain stanchion
        this.C(g, 0.015, 0.015, 0.3, 4, this.m.frame, s * 0.85, 1.0, z - 0.25 * (z > 0 ? 1 : -1));
        this.C(g, 0.015, 0.015, 0.3, 4, this.m.frame, s * 0.85, 1.0, z + 0.25 * (z > 0 ? 1 : -1));
      }
    }

    // === ANTI-SLIP TREAD PLATES on walkways ===
    for (let z = -hl + 1; z < hl; z += 2) {
      for (const s of [-1, 1]) {
        this.B(g, 0.32, 0.015, 0.8, this.m.fmid, s * 1.55, 0.84, z);
      }
    }

    // === POWER CABLE CONNECTIONS (at car ends, to generator car) ===
    for (const z of [-hl + 0.2, hl - 0.2]) {
      // Cable junction box
      this.B(g, 0.15, 0.12, 0.12, this.m.orange, -0.6, 0.85, z);
      // Heavy cable stub
      this.C(g, 0.03, 0.03, 0.15, 6, this.m.frame, -0.6, 0.85, z + (z > 0 ? 0.12 : -0.12), 0.5, 0);
    }

    this.beacon(g, 0, 2.95, 0);
    this.handrails(g, len, 1.9); this.steps(g, len); this.warnStripes(g, len);
    for (const z of [hl, -hl]) { this.ladder(g, 1.55, z); this.ladder(g, -1.55, z); }
    this.coupler(g, -hl - 0.3, -1); this.coupler(g, hl + 0.3, 1); this.trucks(g, len);
    this.reg(g, off, hl);
  }

  private buildWater(off: number) {
    const g = new THREE.Group(); const hl = 7; const len = 14;
    this.B(g, 3.1, 0.2, len, this.m.frame, 0, 0.55, 0);
    this.B(g, 2.8, 2.3, len - 2, this.m.body, 0, 1.95, 0);
    this.sidePanelLines(g, len - 2, 0.9, 3.0, 7);
    // Fill hatches
    for (const z of [-4, 0, 4]) { this.C(g, 0.18, 0.18, 0.06, 14, this.m.fmid, 0, 3.15, z); this.C(g, 0.1, 0.1, 0.03, 10, this.m.pipe, 0, 3.2, z); }
    // Saddle tanks
    this.B(g, 0.6, 0.3, 2, this.m.pipe, -0.8, 3.3, -3); this.B(g, 0.6, 0.3, 2, this.m.pipe, 0.7, 3.3, 3.5);
    // Catwalks
    for (const s of [-1, 1]) this.B(g, 0.4, 0.03, len, this.m.fmid, s * 1.6, 0.82, 0);
    // Hose reels (detailed with hub)
    for (const s of [-1, 1]) for (const z of [3, -3]) {
      this.C(g, 0.2, 0.2, 0.1, 16, this.m.red, s * 1.65, 1.5, z, 0, Math.PI / 2);
      this.C(g, 0.06, 0.06, 0.12, 8, this.m.fmid, s * 1.65, 1.5, z, 0, Math.PI / 2);
    }
    // Valve wheels
    for (const z of [-1, 0, 2]) this.C(g, 0.08, 0.08, 0.02, 10, this.m.pipe, -1.65, 1.8, z, 0, Math.PI / 2);
    // Pipe manifold
    this.C(g, 0.04, 0.04, 4, 10, this.m.pipe, 1.65, 1.2, 0, Math.PI / 2, 0);
    for (let z = -1.5; z <= 1.5; z += 1) { this.C(g, 0.025, 0.025, 0.3, 6, this.m.pipe, 1.65, 1.05, z); this.C(g, 0.04, 0.04, 0.02, 6, this.m.redPipe, 1.65, 0.88, z); }
    // Drains
    for (const z of [-3, 0, 3]) { this.C(g, 0.03, 0.03, 0.15, 8, this.m.pipe, 0, 0.7, z); this.C(g, 0.05, 0.05, 0.02, 8, this.m.fmid, 0, 0.62, z); }
    // Inspection panels
    for (const s of [-1, 1]) this.B(g, 0.03, 0.8, 1.2, this.m.bodyDk, s * 1.65, 2.2, 0);
    // Level gauge
    this.B(g, 0.08, 1.5, 0.04, this.m.frame, -1.65, 2.0, 2);
    this.C(g, 0.015, 0.015, 1.3, 6, this.m.win, -1.63, 2.0, 2.04);
    // Level indicator marks
    for (let y = 1.4; y <= 2.6; y += 0.3) for (const s of [-1, 1]) this.B(g, 0.02, 0.008, 0.3, this.m.pipe, s * 1.65, y, -5);
    // Roof walkway
    this.B(g, 0.5, 0.03, len - 3, this.m.fmid, 0, 3.12, 0);
    // "WATER" text + "25000 GAL"
    this.B(g, 0.03, 0.2, 1.2, this.m.blue, 1.65, 2.5, 0);
    this.B(g, 0.03, 0.12, 0.8, this.m.blue, 1.65, 2.2, -4);
    // Fire extinguisher
    this.C(g, 0.04, 0.04, 0.3, 10, this.m.red, 1.65, 1.2, 5);
    // Rust streaks
    for (const z of [-4, 4]) this.B(g, 0.03, 0.4, 0.03, this.m.rust, 0.3, 2.7, z);
    this.handrails(g, len, 2.0); this.steps(g, len); this.warnStripes(g, len);
    for (const z of [6.8, -6.8]) { this.ladder(g, 1.55, z); this.ladder(g, -1.55, z); }
    this.coupler(g, -hl - 0.3, -1); this.coupler(g, hl + 0.3, 1); this.trucks(g, len);
    this.addCarLighting(g, len);
    this.reg(g, off, hl);
  }

  private buildGen(off: number) {
    const g = new THREE.Group(); const hl = 7; const len = 14;
    this.B(g, 3.1, 0.2, len, this.m.frame, 0, 0.55, 0);
    for (const s of [-1, 1]) this.B(g, 0.35, 0.03, len, this.m.fmid, s * 1.55, 0.82, 0);
    this.B(g, 3.0, 2.4, len - 1, this.m.body, 0, 2.0, 0);
    this.sidePanelLines(g, len, 0.9, 3.1, 8);
    // Louver panels (dense)
    for (const s of [-1, 1]) for (let z = -5; z <= 5; z += 2.5) this.B(g, 0.04, 1.4, 2.2, this.m.bodyDk, s * 1.7, 2.0, z);
    // Access doors with handles
    for (const d of [{s: 1, z: -3}, {s: -1, z: 2}]) {
      this.B(g, 0.04, 1.4, 2.5, this.m.bodyDk, d.s * 1.7, 1.8, d.z);
      this.B(g, 0.02, 0.2, 0.02, this.m.pipe, d.s * 1.72, 1.8, d.z + 0.8);
      // Hinges
      this.C(g, 0.015, 0.015, 0.08, 6, this.m.fmid, d.s * 1.72, 2.2, d.z - 1.1);
      this.C(g, 0.015, 0.015, 0.08, 6, this.m.fmid, d.s * 1.72, 1.4, d.z - 1.1);
    }
    // Twin exhaust
    this.exhaust(g, -0.35, 3.4, 2, 1.0); this.exhaust(g, 0.35, 3.4, 2, 1.0);
    // Radiator fans (detailed)
    for (const z of [-3, 0]) {
      this.C(g, 0.55, 0.55, 0.06, 20, this.m.fmid, 0, 3.45, z);
      this.C(g, 0.1, 0.1, 0.08, 10, this.m.frame, 0, 3.50, z);
      // Fan blades (cross)
      for (const r of [0, Math.PI / 2]) { const bl = this.B(g, 0.9, 0.02, 0.08, this.m.frame, 0, 3.48, z); bl.rotation.y = r; }
    }
    // Cooling intakes
    for (const z of [-5.5, 5.5]) this.B(g, 0.03, 0.6, 0.8, this.m.fmid, 1.7, 2.5, z);
    // Fuel tank
    this.B(g, 1.8, 0.4, 3, this.m.frame, 0, 0.5, 2);
    // Conduit
    this.C(g, 0.02, 0.02, len * 0.6, 6, this.m.pipe, 0.8, 3.25, 0, Math.PI / 2, 0);
    this.C(g, 0.03, 0.03, len * 0.6, 6, this.m.frame, -1.7, 2.8, 0, Math.PI / 2, 0);
    // "POWER" text
    this.B(g, 0.03, 0.2, 1.2, this.m.blue, -1.7, 2.5, 0);
    // Junction boxes
    for (const z of [-4, 2]) this.B(g, 0.04, 0.3, 0.4, this.m.orange, -1.7, 1.5, z);
    // Ground cable
    this.C(g, 0.015, 0.015, 0.5, 4, this.m.green, 0.5, 0.5, -hl + 0.5);
    this.handrails(g, len, 1.9); this.steps(g, len); this.warnStripes(g, len);
    for (const z of [hl, -hl]) { this.ladder(g, 1.55, z); this.ladder(g, -1.55, z); }
    this.coupler(g, -hl - 0.3, -1); this.coupler(g, hl + 0.3, 1); this.trucks(g, len);
    this.addCarLighting(g, len);
    this.reg(g, off, hl);
  }

  private buildCrew(off: number) {
    const g = new THREE.Group(); const hl = 8; const len = 16;
    this.B(g, 3.1, 0.2, len, this.m.frame, 0, 0.55, 0);
    for (const s of [-1, 1]) this.B(g, 0.35, 0.03, len, this.m.fmid, s * 1.55, 0.82, 0);
    this.B(g, 3.0, 3.1, len - 1, this.m.body, 0, 2.35, 0);
    this.sidePanelLines(g, len, 0.9, 3.8, 9);
    // Windows (two rows, many)
    for (const s of [-1, 1]) for (let z = -6.5; z <= 6.5; z += 1.6) {
      this.B(g, 0.05, 0.45, 0.6, this.m.win, s * 1.65, 1.9, z);
      this.B(g, 0.05, 0.45, 0.6, this.m.win, s * 1.65, 3.2, z);
      // Window sills
      this.B(g, 0.04, 0.02, 0.65, this.m.fmid, s * 1.65, 1.64, z);
      this.B(g, 0.04, 0.02, 0.65, this.m.fmid, s * 1.65, 2.94, z);
    }
    // Rear windshield
    const rw = this.B(g, 1.4, 0.7, 0.05, this.m.win, 0, 2.8, -7.52); rw.rotation.x = 0.15;
    // Rear lights + rear floodlight illuminating behind the consist
    for (const x of [-0.65, 0.65]) { this.B(g, 0.3, 0.22, 0.08, this.m.frame, x, 1.7, -7.55); this.B(g, 0.22, 0.16, 0.04, this.m.hl, x, 1.7, -7.52); }
    this.endStripes(g, -7.56);
    this.beacon(g, 0, 4.25, 0);
    // AC units with fans
    for (const ac of [{x: 0.8, z: -2}, {x: -0.6, z: 3}]) {
      this.B(g, 0.7, 0.25, 1.0, this.m.fmid, ac.x, 4.1, ac.z);
      this.C(g, 0.2, 0.2, 0.04, 12, this.m.frame, ac.x, 4.25, ac.z);
    }
    // Antennas
    this.C(g, 0.01, 0.01, 0.8, 4, this.m.frame, 0, 4.8, -1);
    this.C(g, 0.01, 0.01, 0.6, 4, this.m.frame, 0.4, 4.6, 1);
    // Interior lights (multiple)
    const il = new THREE.PointLight(0xffeecc, 0.5, 8); il.position.set(0, 2.5, 0); g.add(il);
    // End platforms with detailed railings
    for (const e of [-1, 1]) {
      this.B(g, 2.8, 0.03, 0.7, this.m.fmid, 0, 0.82, e * 7.8);
      for (const rx of [-1.2, -0.4, 0.4, 1.2]) this.C(g, 0.015, 0.015, 0.6, 6, this.m.rail, rx, 1.1, e * 8.15);
      this.B(g, 2.5, 0.02, 0.02, this.m.rail, 0, 1.4, e * 8.15);
      this.B(g, 2.5, 0.02, 0.02, this.m.rail, 0, 1.1, e * 8.15);
      // Doors
      this.B(g, 0.6, 1.5, 0.04, this.m.bodyDk, 0, 1.6, e * 7.52);
      this.B(g, 0.02, 0.15, 0.03, this.m.pipe, 0.2, 1.6, e * 7.55);
    }
    // Conduit
    this.C(g, 0.02, 0.02, len * 0.5, 6, this.m.pipe, 1.0, 3.95, 0, Math.PI / 2, 0);
    // "CREW" text
    this.B(g, 0.03, 0.2, 1.0, this.m.blue, 1.65, 2.8, 2);
    // Exit signs
    for (const z of [-4, 4]) this.B(g, 0.03, 0.1, 0.2, this.m.exit, 1.65, 3.5, z);
    // Fire extinguishers
    this.C(g, 0.04, 0.04, 0.3, 10, this.m.red, -1.65, 1.3, -2);
    this.C(g, 0.04, 0.04, 0.3, 10, this.m.red, 1.65, 1.3, 5);
    // Storage bins
    for (const e of [-1, 1]) this.B(g, 0.3, 0.4, 0.25, this.m.fmid, 1.0, 1.0, e * 7.6);
    this.handrails(g, len, 2.1); this.steps(g, len); this.warnStripes(g, len);
    for (const z of [hl, -hl]) { this.ladder(g, 1.55, z); this.ladder(g, -1.55, z); }
    this.coupler(g, hl + 0.3, 1); this.trucks(g, len);
    this.addCarLighting(g, len);
    this.reg(g, off, hl);
  }
}
