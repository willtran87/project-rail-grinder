/**
 * Environment - Rich outdoor scenery using InstancedMesh for performance.
 *
 * Instead of thousands of individual meshes, uses instanced rendering
 * where one draw call renders hundreds of copies with different transforms.
 * Reduces draw calls from ~3000 to ~30.
 */

import * as THREE from 'three';
import type { RailTrack } from '../rail/RailTrack';

export class Environment {
  readonly group: THREE.Group;
  private track: RailTrack | null = null;

  /** Pre-computed occupancy grid — avoids 101 spline samples per isOnTrack() call */
  private occupancyGrid: Set<string> | null = null;
  private static readonly GRID_CELL = 2; // meters per cell

  constructor(track?: RailTrack) {
    this.group = new THREE.Group();
    this.track = track ?? null;
    this.buildOccupancyGrid();
    this.addTerrain();
    this.addTracksideGroundCover();
    this.addInstancedTrees();
    this.addInstancedBushes();
    this.addInstancedRocks();
    this.addInstancedGrass();
    this.addTelegraphPoles();
    this.addTrackSideDetails();
    this.addDistantMountains();
    this.addStars();
  }

  private trackCenterX(z: number): number {
    if (z < 80) return 0;
    if (z < 215) return ((z - 80) / 135) * 55;
    if (z < 340) return 55 - ((z - 215) / 125) * 20;
    return 35;
  }

  /** Build a grid of cells occupied by the track for O(1) collision checks */
  private buildOccupancyGrid(): void {
    if (!this.track) return;
    const grid = new Set<string>();
    const cell = Environment.GRID_CELL;
    const len = this.track.totalLength;
    // Sample every 2m along the track (denser than the old 101 samples)
    for (let d = 0; d < len; d += 2) {
      const tp = this.track.getTrackPoint(d);
      // Mark cells for main track (5m clearance → 3 cells radius)
      const cx = Math.floor(tp.position.x / cell);
      const cz = Math.floor(tp.position.z / cell);
      for (let dx = -3; dx <= 3; dx++) {
        for (let dz = -3; dz <= 3; dz++) {
          grid.add(`${cx + dx},${cz + dz}`);
        }
      }
      // Mark cells for adjacent track (5m offset, 4m clearance → 2 cells radius)
      const ax = Math.floor((tp.position.x + tp.right.x * 5) / cell);
      const az = Math.floor((tp.position.z + tp.right.z * 5) / cell);
      for (let dx = -2; dx <= 2; dx++) {
        for (let dz = -2; dz <= 2; dz++) {
          grid.add(`${ax + dx},${az + dz}`);
        }
      }
    }
    this.occupancyGrid = grid;
  }

  private isOnTrack(x: number, z: number): boolean {
    if (!this.track) return Math.abs(x - this.trackCenterX(z)) < 8;
    if (this.occupancyGrid) {
      const cell = Environment.GRID_CELL;
      return this.occupancyGrid.has(`${Math.floor(x / cell)},${Math.floor(z / cell)}`);
    }
    return false;
  }

  private getTrackSidePoint(dist: number, lateralOffset: number) {
    if (!this.track) {
      return { x: this.trackCenterX(dist) + lateralOffset, y: -0.6, z: dist, angle: 0 };
    }
    const tp = this.track.getTrackPoint(Math.max(0, Math.min(this.track.totalLength - 1, dist)));
    return {
      x: tp.position.x + tp.right.x * lateralOffset,
      y: tp.position.y - 0.15,
      z: tp.position.z + tp.right.z * lateralOffset,
      angle: Math.atan2(tp.forward.x, tp.forward.z),
    };
  }

  private rand(min: number, max: number) { return min + Math.random() * (max - min); }

  // ---- TERRAIN ----
  private addTerrain(): void {
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x6b5a40, roughness: 1 });
    for (let i = 0; i < 60; i++) {
      const z = this.rand(-10, 360);
      const tx = this.trackCenterX(z);
      const s = Math.random() > 0.5 ? 1 : -1;
      const x = tx + s * this.rand(6, 15);
      if (this.isOnTrack(x, z)) continue;
      const p = new THREE.Mesh(new THREE.CircleGeometry(this.rand(1, 3), 6), dirtMat);
      p.rotation.x = -Math.PI / 2; p.position.set(x, -0.58, z); this.group.add(p);
    }
    // Hills
    const hillMat = new THREE.MeshStandardMaterial({ color: 0x3a6a30, roughness: 0.9 });
    for (let i = 0; i < 30; i++) {
      const z = this.rand(-10, 360);
      const tx = this.trackCenterX(z);
      const s = Math.random() > 0.5 ? 1 : -1;
      const r = this.rand(3, 6);
      const x = tx + s * this.rand(25 + r, 60);
      // Check that the ENTIRE hill (center + radius) is clear of both tracks
      if (this.isOnTrack(x, z) || this.isOnTrack(x + r, z) || this.isOnTrack(x - r, z)
        || this.isOnTrack(x, z + r) || this.isOnTrack(x, z - r)) continue;
      const h = this.rand(0.5, 1.8);
      const hill = new THREE.Mesh(new THREE.SphereGeometry(r, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2), hillMat);
      hill.scale.y = h / r; hill.position.set(x, -0.6, z); this.group.add(hill);
    }
  }

  // ---- TRACKSIDE (uses actual spline) ----
  private addTracksideGroundCover(): void {
    const trackLen = this.track ? this.track.totalLength : 360;
    const gravelMat = new THREE.MeshStandardMaterial({ color: 0x888880, roughness: 1 });
    const ballastGeo = new THREE.BoxGeometry(1.5, 0.04, 2.3);

    // Instanced gravel shoulders
    const count = Math.floor(trackLen / 2.5) * 2;
    const inst = new THREE.InstancedMesh(ballastGeo, gravelMat, count);
    const mat4 = new THREE.Matrix4();
    let idx = 0;
    for (let d = 0; d < trackLen - 2; d += 2.5) {
      for (const side of [-1, 1]) {
        const pt = this.getTrackSidePoint(d, side * 2.8);
        mat4.makeRotationY(pt.angle);
        mat4.setPosition(pt.x, pt.y + 0.02, pt.z);
        inst.setMatrixAt(idx++, mat4);
      }
    }
    inst.count = idx;
    inst.instanceMatrix.needsUpdate = true;
    inst.receiveShadow = true;
    this.group.add(inst);
  }

  // ---- INSTANCED TREES ----
  private addInstancedTrees(): void {
    // Pine tree canopy instances
    const coneGeo = new THREE.ConeGeometry(1, 2, 7);
    const pineMat = new THREE.MeshStandardMaterial({ color: 0x1e5520, flatShading: true });
    const trunkGeo = new THREE.CylinderGeometry(0.08, 0.14, 1.5, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 0.9 });

    // Generate positions first
    const positions: { x: number; z: number; scale: number; rot: number }[] = [];
    for (let i = 0; i < 400; i++) {
      const z = this.rand(-20, 370);
      const tx = this.trackCenterX(z);
      const s = Math.random() > 0.5 ? 1 : -1;
      const x = tx + s * this.rand(5, 50);
      if (this.isOnTrack(x, z)) continue;
      positions.push({ x, z, scale: 0.5 + Math.random() * 0.8, rot: Math.random() * Math.PI * 2 });
    }

    // Canopy instances (3 layers per tree, but we'll do 1 instance per tree for perf)
    const canopyInst = new THREE.InstancedMesh(coneGeo, pineMat, positions.length);
    const trunkInst = new THREE.InstancedMesh(trunkGeo, trunkMat, positions.length);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const p = new THREE.Vector3();

    for (let i = 0; i < positions.length; i++) {
      const t = positions[i];
      // Trunk
      p.set(t.x, -0.6 + t.scale * 0.75, t.z);
      q.setFromEuler(new THREE.Euler(0, t.rot, 0));
      s.set(t.scale, t.scale, t.scale);
      m.compose(p, q, s);
      trunkInst.setMatrixAt(i, m);

      // Canopy
      p.set(t.x, -0.6 + t.scale * 2.2, t.z);
      s.set(t.scale * 0.9, t.scale * 1.3, t.scale * 0.9);
      m.compose(p, q, s);
      canopyInst.setMatrixAt(i, m);
    }
    canopyInst.instanceMatrix.needsUpdate = true;
    trunkInst.instanceMatrix.needsUpdate = true;
    canopyInst.castShadow = true;
    this.group.add(canopyInst);
    this.group.add(trunkInst);

    // Deciduous trees (round canopy)
    const decGeo = new THREE.DodecahedronGeometry(1, 1);
    const decMat = new THREE.MeshStandardMaterial({ color: 0x3a7a2a, flatShading: true });
    const decPositions: typeof positions = [];
    for (let i = 0; i < 100; i++) {
      const z = this.rand(-10, 360);
      const tx = this.trackCenterX(z);
      const si = Math.random() > 0.5 ? 1 : -1;
      const x = tx + si * this.rand(6, 45);
      if (this.isOnTrack(x, z)) continue;
      decPositions.push({ x, z, scale: 0.8 + Math.random() * 0.7, rot: Math.random() * Math.PI * 2 });
    }

    const decInst = new THREE.InstancedMesh(decGeo, decMat, decPositions.length);
    const decTrunkInst = new THREE.InstancedMesh(trunkGeo, trunkMat, decPositions.length);
    for (let i = 0; i < decPositions.length; i++) {
      const t = decPositions[i];
      p.set(t.x, -0.6 + t.scale * 0.75, t.z);
      q.setFromEuler(new THREE.Euler(0, t.rot, 0));
      s.set(t.scale, t.scale * 1.2, t.scale);
      m.compose(p, q, s);
      decTrunkInst.setMatrixAt(i, m);

      p.set(t.x, -0.6 + t.scale * 2.5, t.z);
      s.set(t.scale * 1.2, t.scale * 0.9, t.scale * 1.2);
      m.compose(p, q, s);
      decInst.setMatrixAt(i, m);
    }
    decInst.instanceMatrix.needsUpdate = true;
    decTrunkInst.instanceMatrix.needsUpdate = true;
    decInst.castShadow = true;
    this.group.add(decInst);
    this.group.add(decTrunkInst);
  }

  // ---- INSTANCED BUSHES ----
  private addInstancedBushes(): void {
    const geo = new THREE.DodecahedronGeometry(0.5, 0);
    const mat = new THREE.MeshStandardMaterial({ color: 0x3a6a28, flatShading: true });
    const positions: THREE.Matrix4[] = [];
    const m = new THREE.Matrix4();

    for (let i = 0; i < 300; i++) {
      const z = this.rand(-10, 360);
      const tx = this.trackCenterX(z);
      const si = Math.random() > 0.5 ? 1 : -1;
      const x = tx + si * this.rand(4, 25);
      if (this.isOnTrack(x, z)) continue;
      const sc = 0.5 + Math.random() * 0.8;
      m.makeScale(sc, sc * 0.6, sc);
      m.setPosition(x, -0.6 + sc * 0.15, z);
      positions.push(m.clone());
    }

    const inst = new THREE.InstancedMesh(geo, mat, positions.length);
    positions.forEach((mx, i) => inst.setMatrixAt(i, mx));
    inst.instanceMatrix.needsUpdate = true;
    inst.castShadow = true;
    this.group.add(inst);
  }

  // ---- INSTANCED ROCKS ----
  private addInstancedRocks(): void {
    const geo = new THREE.DodecahedronGeometry(0.5, 0);
    const mat = new THREE.MeshStandardMaterial({ color: 0x5a5a55, roughness: 0.95, flatShading: true });
    const positions: THREE.Matrix4[] = [];
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();

    for (let i = 0; i < 150; i++) {
      const z = this.rand(-10, 360);
      const tx = this.trackCenterX(z);
      const si = Math.random() > 0.5 ? 1 : -1;
      const x = tx + si * this.rand(4, 30);
      if (this.isOnTrack(x, z)) continue;
      const sc = 0.3 + Math.random() * 0.8;
      q.setFromEuler(new THREE.Euler(Math.random(), Math.random(), Math.random()));
      m.compose(new THREE.Vector3(x, -0.6 + sc * 0.15, z), q, new THREE.Vector3(sc, sc * 0.5, sc));
      positions.push(m.clone());
    }

    const inst = new THREE.InstancedMesh(geo, mat, positions.length);
    positions.forEach((mx, i) => inst.setMatrixAt(i, mx));
    inst.instanceMatrix.needsUpdate = true;
    this.group.add(inst);
  }

  // ---- INSTANCED GRASS ----
  private addInstancedGrass(): void {
    const geo = new THREE.ConeGeometry(0.06, 0.3, 3);
    const mat = new THREE.MeshStandardMaterial({ color: 0x4a7a35 });
    const positions: THREE.Matrix4[] = [];
    const m = new THREE.Matrix4();

    for (let i = 0; i < 1000; i++) {
      const z = this.rand(-10, 360);
      const tx = this.trackCenterX(z);
      const x = tx + (Math.random() - 0.5) * 50;
      if (this.isOnTrack(x, z)) continue;
      const sy = 0.5 + Math.random() * 2;
      m.makeScale(0.5 + Math.random(), sy, 0.5 + Math.random());
      m.setPosition(x, -0.45, z);
      positions.push(m.clone());
    }

    const inst = new THREE.InstancedMesh(geo, mat, positions.length);
    positions.forEach((mx, i) => inst.setMatrixAt(i, mx));
    inst.instanceMatrix.needsUpdate = true;
    this.group.add(inst);

    // Wildflower clusters
    const flowerColors = [0xdddd44, 0xdd8844, 0xaa44aa, 0x4488dd, 0xdd4444];
    for (const color of flowerColors) {
      const fgeo = new THREE.SphereGeometry(0.05, 4, 3);
      const fmat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.15 });
      const fpos: THREE.Matrix4[] = [];
      for (let i = 0; i < 30; i++) {
        const z = this.rand(0, 350);
        const tx = this.trackCenterX(z);
        const x = tx + (Math.random() - 0.5) * 40;
        if (this.isOnTrack(x, z)) continue;
        m.makeTranslation(x, -0.5 + Math.random() * 0.1, z);
        fpos.push(m.clone());
      }
      if (fpos.length > 0) {
        const fi = new THREE.InstancedMesh(fgeo, fmat, fpos.length);
        fpos.forEach((mx, i) => fi.setMatrixAt(i, mx));
        fi.instanceMatrix.needsUpdate = true;
        this.group.add(fi);
      }
    }
  }

  // ---- TELEGRAPH POLES ----
  private addTelegraphPoles(): void {
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: 0.85 });
    const insMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });

    for (let z = 0; z < 350; z += 20) {
      const tx = this.trackCenterX(z);
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 7, 6), poleMat)).position.y = 3.5;
      g.add(new THREE.Mesh(new THREE.BoxGeometry(2, 0.05, 0.05), poleMat)).position.y = 6.5;
      for (const ix of [-0.7, -0.3, 0, 0.3, 0.7]) {
        g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.1, 4), insMat)).position.set(ix, 6.6, 0);
      }
      g.position.set(tx + 8, -0.6, z);
      this.group.add(g);
    }
  }

  // ---- TRACKSIDE DETAILS ----
  private addTrackSideDetails(): void {
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.5 });
    const signMat = new THREE.MeshStandardMaterial({ color: 0xcccc00 });

    // Mileposts
    for (let z = 50; z < 350; z += 50) {
      const tx = this.trackCenterX(z);
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.05, 1, 0.05), metalMat)).position.y = 0.5;
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.18, 0.03), signMat)).position.y = 0.9;
      g.position.set(tx + 3.5, -0.6, z);
      this.group.add(g);
    }

    // Signals
    for (const sz of [5, 180]) {
      const tx = this.trackCenterX(sz);
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 5, 6), metalMat)).position.y = 2.5;
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.7, 0.18), metalMat)).position.y = 5.2;
      const redMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5 });
      const greenMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.5 });
      g.add(new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 4), redMat)).position.set(0, 5.4, 0.1);
      g.add(new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 4), greenMat)).position.set(0, 5.0, 0.1);
      g.position.set(tx + 4, -0.6, sz);
      this.group.add(g);
    }
  }

  // ---- MOUNTAINS ----
  private addDistantMountains(): void {
    const layers = [
      { color: 0x1a3018, dist: 80, height: 20, count: 6 },
      { color: 0x3a5838, dist: 130, height: 30, count: 5 },
      { color: 0x586868, dist: 180, height: 38, count: 6 },
      { color: 0x7888a0, dist: 240, height: 45, count: 5 },
      { color: 0x98a8b8, dist: 310, height: 55, count: 4 },
    ];
    for (const layer of layers) {
      const mat = new THREE.MeshStandardMaterial({ color: layer.color, fog: true });
      for (let i = 0; i < layer.count; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const w = this.rand(35, 70), h = layer.height * (0.5 + Math.random() * 0.5);
        const mt = new THREE.Mesh(new THREE.ConeGeometry(w, h, 5 + Math.floor(Math.random() * 3)), mat);
        mt.position.set(side * layer.dist + this.rand(-20, 50), h / 2 - 8, (i / layer.count) * 420 - 30);
        mt.rotation.y = Math.random() * Math.PI;
        this.group.add(mt);
      }
    }
  }

  // ---- STARS ----
  private addStars(): void {
    const count = 400;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2, p = Math.random() * Math.PI * 0.45, r = 180 + Math.random() * 60;
      pos[i * 3] = r * Math.sin(p) * Math.cos(t);
      pos[i * 3 + 1] = r * Math.cos(p) + 15;
      pos[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
      const b = 0.4 + Math.random() * 0.6;
      col[i * 3] = b; col[i * 3 + 1] = b; col[i * 3 + 2] = b + Math.random() * 0.1;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    this.group.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.5, sizeAttenuation: false, vertexColors: true })));
  }
}
