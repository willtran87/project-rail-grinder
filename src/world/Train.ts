/**
 * Train - Freight train with SD70ACe-style locomotive.
 *
 * All surface detail is offset slightly proud of the base geometry
 * to prevent z-fighting. No overlapping coplanar surfaces.
 */

import * as THREE from 'three';

const WG = 0.72;

export class Train {
  readonly group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.buildLocomotive(0);
    this.buildBoxcar(20, 0x884422);
    this.buildBoxcar(32, 0xaa3333);
    this.buildTankCar(44);
    this.buildBoxcar(56, 0x336688);
    this.buildBoxcar(68, 0x448844);
    this.buildCaboose(80);
  }

  private box(p: THREE.Group, w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number): void {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z); m.castShadow = true; p.add(m);
  }

  private cyl(p: THREE.Group, r: number, h: number, segs: number, mat: THREE.Material, x: number, y: number, z: number, rx = 0, rz = 0): void {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segs), mat);
    m.position.set(x, y, z); m.rotation.x = rx; m.rotation.z = rz;
    m.castShadow = true; p.add(m);
  }

  private addTrucks(p: THREE.Group, carLen: number): void {
    const wGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.15, 16);
    const wMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.85, roughness: 0.3 });
    const fMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.4, roughness: 0.7 });
    const off = carLen * 0.35;
    for (const tz of [-off, off]) {
      this.box(p, 2.4, 0.12, 1.4, fMat, 0, 0.32, tz);
      for (const wz of [-0.5, 0.5]) {
        for (const s of [-1, 1]) {
          const w = new THREE.Mesh(wGeo, wMat);
          w.rotation.x = Math.PI / 2;
          w.position.set(s * WG, 0.45, tz + wz);
          p.add(w);
        }
      }
    }
  }

  private buildLocomotive(zOff: number): void {
    const g = new THREE.Group();
    const body = new THREE.MeshStandardMaterial({ color: 0xf15a22, metalness: 0.2, roughness: 0.5 });
    const frame = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.4, roughness: 0.7 });
    const win = new THREE.MeshStandardMaterial({ color: 0x7ab8dd, emissive: 0x1a3344, metalness: 0.8, roughness: 0.1 });
    const hl = new THREE.MeshStandardMaterial({ color: 0xffffcc, emissive: 0xffff88, emissiveIntensity: 2 });
    const stripe = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.15, roughness: 0.5 });

    // Underframe
    this.box(g, 3.0, 0.25, 22, frame, 0, 0.7, 0);

    // Long hood (engine compartment) — top face is the roof, no separate panel
    this.box(g, 2.5, 2.4, 13, body, 0, 2.5, -2);

    // Cab (full width, taller than hood) — top face is the roof
    this.box(g, 3.0, 2.8, 3.5, body, 0, 2.7, 7);

    // Nose
    this.box(g, 2.6, 1.8, 3, body, 0, 1.9, 9.8);

    // Yellow stripe
    for (const s of [-1, 1]) {
      this.box(g, 0.03, 0.18, 13, stripe, s * 1.32, 1.8, -2);
    }
    // Red stripe below the yellow
    const redStripe = new THREE.MeshStandardMaterial({ color: 0xcc1111, metalness: 0.15, roughness: 0.5 });
    for (const s of [-1, 1]) {
      this.box(g, 0.03, 0.12, 13, redStripe, s * 1.32, 1.6, -2);
    }

    // Windshields
    this.box(g, 2.0, 0.9, 0.06, win, 0, 3.4, 8.82);
    // Side windows
    for (const s of [-1, 1]) {
      this.box(g, 0.06, 0.7, 2.0, win, s * 1.55, 3.4, 7);
    }

    // Headlights
    this.box(g, 0.3, 0.25, 0.06, hl, -0.7, 2.8, 11.33);
    this.box(g, 0.3, 0.25, 0.06, hl, 0.7, 2.8, 11.33);
    this.box(g, 0.2, 0.18, 0.06, hl, -1.1, 1.3, 11.33);
    this.box(g, 0.2, 0.18, 0.06, hl, 1.1, 1.3, 11.33);
    const light = new THREE.PointLight(0xffffcc, 4, 35);
    light.position.set(0, 3, 12); g.add(light);

    // Exhaust on hood
    const exhMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.3, roughness: 0.6 });
    this.cyl(g, 0.14, 0.7, 14, exhMat, 0, 4.1, 0, 0, 0);

    // Radiator fans on hood roof (no separate radiator box — it's part of the hood)
    const fan = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.3, roughness: 0.6 });
    for (const z of [-6, -7.5, -9]) {
      this.cyl(g, 0.5, 0.15, 16, fan, 0, 3.85, z, 0, 0);
    }

    // Walkway
    this.box(g, 3.1, 0.04, 22, frame, 0, 0.95, 0);

    // Handrails (offset from body)
    for (const s of [-1, 1]) {
      this.cyl(g, 0.02, 22, 6, stripe, s * 1.58, 1.9, 0, Math.PI / 2, 0);
    }

    this.addTrucks(g, 22);
    g.position.z = -zOff;
    this.group.add(g);
  }

  private buildBoxcar(zOff: number, color: number): void {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.15, roughness: 0.6 });
    const frame = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.4, roughness: 0.7 });
    const door = new THREE.MeshStandardMaterial({ color: new THREE.Color(color).multiplyScalar(0.6).getHex(), metalness: 0.2, roughness: 0.6 });

    this.box(g, 2.9, 0.2, 11, frame, 0, 0.7, 0);
    this.box(g, 2.8, 2.8, 10.5, mat, 0, 2.5, 0);

    // Doors (offset proud)
    for (const s of [-1, 1]) {
      this.box(g, 0.06, 2.2, 3.2, door, s * 1.5, 2.3, 0);
    }

    this.addTrucks(g, 11);
    g.position.z = -zOff;
    this.group.add(g);
  }

  private buildTankCar(zOff: number): void {
    const g = new THREE.Group();
    const frame = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.4, roughness: 0.7 });
    const tank = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.4 });

    this.box(g, 2.9, 0.2, 11, frame, 0, 0.7, 0);
    this.cyl(g, 1.25, 9.5, 20, tank, 0, 2.5, 0, Math.PI / 2, 0);

    // Dome
    this.cyl(g, 0.4, 0.5, 12, tank, 0, 3.85, 0, 0, 0);

    // Catwalk
    this.box(g, 0.5, 0.03, 8, frame, 0, 3.8, 0);

    this.addTrucks(g, 11);
    g.position.z = -zOff;
    this.group.add(g);
  }

  private buildCaboose(zOff: number): void {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color: 0xcc2222, metalness: 0.15, roughness: 0.5 });
    const frame = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.4, roughness: 0.7 });
    const win = new THREE.MeshStandardMaterial({ color: 0xffeeaa, emissive: 0x886622, emissiveIntensity: 0.5 });

    this.box(g, 2.7, 0.2, 9, frame, 0, 0.7, 0);
    this.box(g, 2.6, 2.2, 8.5, mat, 0, 2.2, 0);

    // Cupola
    this.box(g, 1.5, 0.9, 2.8, mat, 0, 3.75, 0);

    // Windows (offset proud)
    for (const s of [-1, 1]) {
      for (let z = -3; z <= 3; z += 2) {
        this.box(g, 0.06, 0.45, 0.65, win, s * 1.35, 2.5, z);
      }
      // Cupola windows
      this.box(g, 0.06, 0.4, 1.4, win, s * 0.8, 3.75, 0);
    }

    // End platforms
    for (const e of [-1, 1]) {
      this.box(g, 2.6, 0.06, 0.7, frame, 0, 0.9, e * 4.8);
    }

    const il = new THREE.PointLight(0xffaa44, 0.6, 6);
    il.position.set(0, 2.5, 0); g.add(il);

    this.addTrucks(g, 9);
    g.position.z = -zOff;
    this.group.add(g);
  }

  setPosition(x: number, y: number, z: number): void {
    this.group.position.set(x, y, z);
  }
}
