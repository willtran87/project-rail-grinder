/**
 * bakeStatic - Merge a model's many small, non-moving meshes into a few big ones.
 *
 * WHY: every Mesh is a separate "draw call" — the CPU has to tell the GPU about
 * it one by one, and again for the shadow map if it casts a shadow. A model
 * built from 500 little boxes and cylinders costs 500–1000 draw calls a frame.
 * Merging every mesh that shares a material into one geometry turns that into
 * one draw call per material, and looks exactly the same.
 *
 * Parts that move on their own (like the grinder's drop-down stone modules)
 * are passed in `keep` and left alone. Lights and other non-mesh children are
 * never touched.
 *
 * Tiny parts (bolts, rivets, thin rods) also stop casting shadows: at the
 * game's pixel resolution their shadows are smaller than one pixel anyway,
 * but drawing them into the shadow map still costs a draw call each.
 */

import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export interface BakeOptions {
  /** Meshes to leave as they are (they move, or need their own material) */
  keep?: Set<THREE.Object3D>;
  /** Parts whose longest side is shorter than this (metres) cast no shadow */
  minShadowSize?: number;
  /** Rods/plates thinner than this (second-longest side, metres) cast no shadow */
  minShadowThickness?: number;
}

const _rel = new THREE.Matrix4();
const _inv = new THREE.Matrix4();
const _box = new THREE.Box3();
const _size = new THREE.Vector3();

/**
 * Make a geometry mergeable with the others: same attributes (position,
 * normal, uv) and always indexed. Returns a new geometry in `root` space.
 */
function prepare(src: THREE.BufferGeometry, matrix: THREE.Matrix4): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', src.getAttribute('position').clone());
  const normal = src.getAttribute('normal');
  if (normal) geo.setAttribute('normal', normal.clone());
  const count = geo.getAttribute('position').count;
  const uv = src.getAttribute('uv');
  geo.setAttribute('uv', uv ? uv.clone() : new THREE.Float32BufferAttribute(new Float32Array(count * 2), 2));
  if (src.index) {
    geo.setIndex(src.index.clone());
  } else {
    const idx = new (count > 65535 ? Uint32Array : Uint16Array)(count);
    for (let i = 0; i < count; i++) idx[i] = i;
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
  }
  if (!normal) geo.computeVertexNormals();
  geo.applyMatrix4(matrix);
  return geo;
}

/**
 * Merge the static meshes under `root` (one mesh per material and shadow
 * setting). Call after the model is fully built, before it starts moving.
 * @returns how many meshes were merged away
 */
export function bakeStatic(root: THREE.Object3D, opts: BakeOptions = {}): number {
  const keep = opts.keep ?? new Set<THREE.Object3D>();
  const minSize = opts.minShadowSize ?? 0.35;
  const minThick = opts.minShadowThickness ?? 0.06;

  root.updateMatrixWorld(true);
  _inv.copy(root.matrixWorld).invert();

  // Collect the meshes to merge (skip kept meshes and anything inside them)
  const found: THREE.Mesh[] = [];
  const walk = (o: THREE.Object3D) => {
    if (keep.has(o)) return;
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh && !(mesh as unknown as THREE.InstancedMesh).isInstancedMesh
        && !Array.isArray(mesh.material) && mesh.visible) {
      found.push(mesh);
    }
    for (const c of o.children) walk(c);
  };
  for (const c of root.children) walk(c);

  // Group by material + whether the part is big enough to cast a shadow
  const batches = new Map<string, { material: THREE.Material; cast: boolean; receive: boolean; geos: THREE.BufferGeometry[] }>();
  const usedGeos = new Set<THREE.BufferGeometry>();
  for (const mesh of found) {
    _rel.multiplyMatrices(_inv, mesh.matrixWorld);
    const geo = prepare(mesh.geometry, _rel);
    usedGeos.add(mesh.geometry);

    let cast = mesh.castShadow;
    if (cast) {
      geo.computeBoundingBox();
      _box.copy(geo.boundingBox!).getSize(_size);
      const dims = [_size.x, _size.y, _size.z].sort((a, b) => b - a);
      if (dims[0] < minSize || dims[1] < minThick) cast = false;
    }
    const material = mesh.material as THREE.Material;
    const key = `${material.uuid}|${cast}|${mesh.receiveShadow}`;
    let b = batches.get(key);
    if (!b) { b = { material, cast, receive: mesh.receiveShadow, geos: [] }; batches.set(key, b); }
    b.geos.push(geo);
  }

  // Remove the originals (geometries shared with kept meshes stay alive)
  const foundSet = new Set<THREE.Object3D>(found);
  const keptGeos = new Set<THREE.BufferGeometry>();
  root.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && !foundSet.has(m)) keptGeos.add(m.geometry); });
  for (const mesh of found) mesh.removeFromParent();
  for (const g of usedGeos) if (!keptGeos.has(g)) g.dispose();

  // One merged mesh per batch
  for (const b of batches.values()) {
    const merged = mergeGeometries(b.geos, false);
    for (const g of b.geos) g.dispose();
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, b.material);
    mesh.castShadow = b.cast;
    mesh.receiveShadow = b.receive;
    root.add(mesh);
  }
  return found.length;
}
