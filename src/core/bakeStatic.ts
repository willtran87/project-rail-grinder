/**
 * bakeStatic - Merge a model's many small, non-moving meshes into a few big ones.
 *
 * WHY: every Mesh is a separate "draw call" — the CPU has to tell the GPU about
 * it one by one, and again for the shadow map if it casts a shadow. A model
 * built from 500 little boxes and cylinders costs 500–1000 draw calls a frame.
 * Merging every mesh that shares a material into one geometry turns that into
 * one draw call per material, and looks exactly the same.
 *
 * Two optional extras squeeze it further:
 *   - `vertexMaterial`: plain materials (a colour, metalness, roughness and a
 *     fixed glow — no texture, not see-through) are all merged into ONE mesh.
 *     Each vertex carries its old material's values instead (see
 *     createVertexPbrMaterial), so a car with 15 paint colours is 1 draw call.
 *   - `shadowProxy`: every part that casts a shadow is also merged into one
 *     invisible, shadow-only mesh (layer SHADOW_LAYER), so the shadow map
 *     needs one draw call per model instead of one per material.
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

/**
 * Objects on this layer are drawn only into the shadow map: the sun's shadow
 * camera sees layer 0 and this one, the main camera only layer 0 (Engine).
 */
export const SHADOW_LAYER = 1;

export interface BakeOptions {
  /** Meshes to leave as they are (they move, or need their own material) */
  keep?: Set<THREE.Object3D>;
  /** Parts whose longest side is shorter than this (metres) cast no shadow */
  minShadowSize?: number;
  /** Rods/plates thinner than this (second-longest side, metres) cast no shadow */
  minShadowThickness?: number;
  /**
   * Merge all plain materials into this one (made by createVertexPbrMaterial).
   * Materials in `animated` are left alone, because their values change at run time.
   */
  vertexMaterial?: THREE.MeshStandardMaterial;
  /** Materials whose colour / glow is changed while playing (never merged into vertexMaterial) */
  animated?: Set<THREE.Material>;
  /** Cast shadows through one merged, shadow-only mesh instead of each part */
  shadowProxy?: boolean;
}

const _rel = new THREE.Matrix4();
const _inv = new THREE.Matrix4();
const _box = new THREE.Box3();
const _size = new THREE.Vector3();
const _emissive = new THREE.Color();

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

/** Can this material's look be stored per vertex? */
export function isPlain(m: THREE.Material, animated: Set<THREE.Material> | undefined): m is THREE.MeshStandardMaterial {
  const s = m as THREE.MeshStandardMaterial;
  return !!s.isMeshStandardMaterial && !(m as THREE.MeshPhysicalMaterial).isMeshPhysicalMaterial
    && !animated?.has(m)
    && !s.map && !s.roughnessMap && !s.metalnessMap && !s.normalMap && !s.emissiveMap
    && !s.alphaMap && !s.aoMap && !s.lightMap && !s.envMap
    && !s.transparent && s.opacity === 1 && !s.vertexColors
    && s.side === THREE.FrontSide && !s.wireframe && !s.flatShading;
}

/** Bake the material's values into per-vertex attributes (for vertexMaterial) */
export function addMaterialAttributes(geo: THREE.BufferGeometry, m: THREE.MeshStandardMaterial): void {
  const n = geo.getAttribute('position').count;
  const color = new Float32Array(n * 3);
  const emissive = new Float32Array(n * 3);
  const pbr = new Float32Array(n * 2);
  _emissive.copy(m.emissive).multiplyScalar(m.emissiveIntensity);
  for (let i = 0; i < n; i++) {
    color[i * 3] = m.color.r; color[i * 3 + 1] = m.color.g; color[i * 3 + 2] = m.color.b;
    emissive[i * 3] = _emissive.r; emissive[i * 3 + 1] = _emissive.g; emissive[i * 3 + 2] = _emissive.b;
    pbr[i * 2] = m.metalness; pbr[i * 2 + 1] = m.roughness;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(color, 3));
  geo.setAttribute('aEmissive', new THREE.BufferAttribute(emissive, 3));
  geo.setAttribute('aPbr', new THREE.BufferAttribute(pbr, 2));
}

/**
 * A standard (PBR) material that takes its colour, glow, metalness and
 * roughness from each vertex instead of from the material. Make one and share
 * it between models so they all use the same compiled shader.
 */
export function createVertexPbrMaterial(): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, color: 0xffffff });
  mat.customProgramCacheKey = () => 'vertex-pbr';
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = `
      attribute vec3 aEmissive;
      attribute vec2 aPbr;
      varying vec3 vEmissive;
      varying vec2 vPbr;
    ` + shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      vEmissive = aEmissive;
      vPbr = aPbr;
    `);
    shader.fragmentShader = `
      varying vec3 vEmissive;
      varying vec2 vPbr;
    ` + shader.fragmentShader
      .replace('vec3 totalEmissiveRadiance = emissive;', 'vec3 totalEmissiveRadiance = vEmissive;')
      .replace('#include <metalnessmap_fragment>', 'float metalnessFactor = vPbr.x;')
      .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = vPbr.y;');
  };
  return mat;
}

/** Material for shadow-only meshes (never drawn on screen; see SHADOW_LAYER) */
let shadowOnlyMaterial: THREE.MeshBasicMaterial | null = null;

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

  // Group by material + whether the part casts a shadow (a shadow proxy
  // takes over all shadows, so then the batches don't need splitting)
  type Batch = { material: THREE.Material; cast: boolean; receive: boolean; geos: THREE.BufferGeometry[] };
  const batches = new Map<string, Batch>();
  const shadowGeos: THREE.BufferGeometry[] = [];
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
    if (cast && opts.shadowProxy) {
      const s = new THREE.BufferGeometry();
      s.setAttribute('position', geo.getAttribute('position').clone());
      s.setIndex(geo.index!.clone());
      shadowGeos.push(s);
      cast = false;
    }

    let material = mesh.material as THREE.Material;
    if (opts.vertexMaterial && isPlain(material, opts.animated)) {
      addMaterialAttributes(geo, material);
      material = opts.vertexMaterial;
    }
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

  // One shadow-only mesh for everything that casts a shadow
  if (shadowGeos.length) {
    const merged = mergeGeometries(shadowGeos, false);
    for (const g of shadowGeos) g.dispose();
    if (merged) {
      shadowOnlyMaterial ??= new THREE.MeshBasicMaterial();
      const proxy = new THREE.Mesh(merged, shadowOnlyMaterial);
      proxy.name = 'shadow-proxy';
      proxy.castShadow = true;
      proxy.layers.set(SHADOW_LAYER); // invisible to the main camera
      root.add(proxy);
    }
  }
  return found.length;
}
