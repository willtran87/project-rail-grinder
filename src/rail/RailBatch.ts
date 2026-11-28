/**
 * RailBatch - Every rail segment on the track, drawn as ONE mesh.
 *
 * WHY: a track is ~250 rail segments (5 m each, both rails). As separate
 * meshes with their own materials that was ~250 draw calls for the rails,
 * ~250 more for their shadows, and up to ~250 for the shiny running bands.
 * Here all of them share one geometry (one draw call, one shadow draw) and
 * one "running band" geometry (one more draw call).
 *
 * How each segment still gets its own look (rusty, hot, polished, flashing):
 *   - every vertex knows which segment it belongs to (attribute `aSeg`)
 *   - a tiny data texture holds one column per segment:
 *       row 0: base colour (rgb) + metalness (a)
 *       row 1: glow colour × strength (rgb) + roughness (a)
 *       row 2: running band glow × strength (rgb) + band opacity (a)
 *       row 3: damage kind, damage strength, running band centre and
 *              half-width (across the band strip, 0..1)
 *   - the shader looks its segment up in that texture
 * Changing a segment's look = writing 12 numbers. Grinding a segment rewrites
 * only that segment's vertices, in place (no new geometry, no GPU re-allocation).
 *
 * RailSegment (one per segment) owns the colour logic and writes into this.
 */

import * as THREE from 'three';
import type { RailProfile } from './RailProfile';

// Rail cross-section (metres). The head comes from the profile, the rest is fixed.
const PROFILE_SCALE = 0.002;   // profile units → metres (as before)
const WEB_HEIGHT = 0.20;
const BASE_WIDTH = 0.30;
const BASE_HEIGHT = 0.04;
const WEB_WIDTH = 0.04;
/** Use every Nth profile point for the 3D rail. The profile is sampled every
 *  0.5 mm; 1 mm facets are still far finer than a screen pixel. */
const PROFILE_STEP = 2;

// Running band (polished strip along the top of the head)
const SHINE_WIDTH = 0.045;
const SHINE_LIFT = 0.0015;

const DATA_ROWS = 4;

/** Shared GLSL: fetch this vertex's segment column from the data texture */
const VERTEX_HEAD = /* glsl */ `
  attribute float aSeg;
  uniform sampler2D uSegData;
`;

export class RailBatch {
  /** Steel rails (casts shadows) */
  readonly railMesh: THREE.Mesh;
  /** Polished running bands on top of the rails (transparent) */
  readonly shineMesh: THREE.Mesh;
  readonly railMaterial: THREE.MeshStandardMaterial;
  readonly shineMaterial: THREE.MeshStandardMaterial;

  private readonly slots: number;
  /** Slots in one continuous rail (only its first / last segment needs end faces) */
  private readonly slotsPerRail: number;
  private readonly length: number;
  /** Cross-section outline vertex count (fixed for every segment) */
  private readonly outline: number;
  /** Vertices per segment: 4 per outline edge (side walls) + 2 caps */
  private readonly vertsPerSlot: number;
  private readonly matrices: THREE.Matrix4[] = [];
  private readonly normalMatrices: THREE.Matrix3[] = [];

  private readonly data: Float32Array;
  private readonly dataTex: THREE.DataTexture;
  private readonly positions: THREE.BufferAttribute;
  private readonly normals: THREE.BufferAttribute;
  /** Each vertex's position across / up / along its own rail (for the damage marks) */
  private readonly locals: THREE.BufferAttribute;

  // Scratch space for writing one segment
  private readonly ox: Float32Array;
  private readonly oy: Float32Array;
  private readonly _v = new THREE.Vector3();
  private readonly _n = new THREE.Vector3();

  /**
   * @param transforms - one placement (local → world) per segment
   * @param length - segment length in metres (extruded along local +z)
   * @param pointCount - number of profile points (same for every segment)
   * @param shineMap - texture for the running band (null in tests)
   */
  constructor(transforms: THREE.Matrix4[], length: number, pointCount: number,
              shineMap: THREE.Texture | null, slotsPerRail = transforms.length) {
    this.slotsPerRail = slotsPerRail;
    this.slots = transforms.length;
    this.length = length;
    const headPts = Math.floor((pointCount - 1) / PROFILE_STEP) + 1 + ((pointCount - 1) % PROFILE_STEP ? 1 : 0);
    this.outline = headPts + 8; // + 8 base/web corners (see writeOutline)
    this.vertsPerSlot = this.outline * 4 + this.outline * 2;
    this.ox = new Float32Array(this.outline);
    this.oy = new Float32Array(this.outline);
    for (const m of transforms) {
      this.matrices.push(m.clone());
      this.normalMatrices.push(new THREE.Matrix3().getNormalMatrix(m));
    }

    // --- per-segment data texture ---
    this.data = new Float32Array(this.slots * DATA_ROWS * 4);
    this.dataTex = new THREE.DataTexture(this.data, this.slots, DATA_ROWS, THREE.RGBAFormat, THREE.FloatType);
    this.dataTex.minFilter = this.dataTex.magFilter = THREE.NearestFilter;
    this.dataTex.needsUpdate = true;

    // --- rail geometry ---
    const vCount = this.slots * this.vertsPerSlot;
    this.positions = new THREE.BufferAttribute(new Float32Array(vCount * 3), 3);
    this.normals = new THREE.BufferAttribute(new Float32Array(vCount * 3), 3);
    this.positions.setUsage(THREE.DynamicDrawUsage);
    this.normals.setUsage(THREE.DynamicDrawUsage);
    this.locals = new THREE.BufferAttribute(new Float32Array(vCount * 3), 3);
    this.locals.setUsage(THREE.DynamicDrawUsage);
    const seg = new Float32Array(vCount);
    for (let s = 0; s < this.slots; s++) seg.fill(s, s * this.vertsPerSlot, (s + 1) * this.vertsPerSlot);
    const railGeo = new THREE.BufferGeometry();
    railGeo.setAttribute('position', this.positions);
    railGeo.setAttribute('normal', this.normals);
    railGeo.setAttribute('aLoc', this.locals);
    railGeo.setAttribute('aSeg', new THREE.BufferAttribute(seg, 1));
    railGeo.setIndex(this.buildIndex(pointCount));

    this.railMaterial = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
    this.patchRailMaterial(this.railMaterial);
    this.railMesh = new THREE.Mesh(railGeo, this.railMaterial);
    this.railMesh.castShadow = true;
    this.railMesh.receiveShadow = true;

    // --- running band geometry (static: a flat strip on each segment) ---
    this.shineMaterial = new THREE.MeshStandardMaterial({
      color: 0xeef2f8,
      map: shineMap,
      metalness: 0.3,
      roughness: 0.12,       // glossy: catches a sharp sun highlight
      transparent: true,
      depthWrite: false,
      polygonOffset: true,   // avoid flickering against the rail top
      polygonOffsetFactor: -2,
    });
    this.patchShineMaterial(this.shineMaterial);
    this.shineMesh = new THREE.Mesh(this.buildShine(), this.shineMaterial);
    this.shineMesh.renderOrder = 1;
  }

  /** Write a segment's look into the data texture (see the class comment) */
  setLook(slot: number,
          color: THREE.Color, metalness: number,
          emissive: THREE.Color, emissiveIntensity: number, roughness: number,
          shineEmissive: THREE.Color, shineIntensity: number, shineOpacity: number): void {
    const d = this.data;
    const w = this.slots * 4;
    let i = slot * 4;
    d[i] = color.r; d[i + 1] = color.g; d[i + 2] = color.b; d[i + 3] = metalness;
    i += w;
    d[i] = emissive.r * emissiveIntensity; d[i + 1] = emissive.g * emissiveIntensity;
    d[i + 2] = emissive.b * emissiveIntensity; d[i + 3] = roughness;
    i += w;
    d[i] = shineEmissive.r * shineIntensity; d[i + 1] = shineEmissive.g * shineIntensity;
    d[i + 2] = shineEmissive.b * shineIntensity; d[i + 3] = shineOpacity;
    this.dataTex.needsUpdate = true;
  }

  /**
   * Damage marks and the running band's shape for a segment.
   * @param kind - 0 none, 1 wear, 2 corrugation, 3 head checks, 4 gauge face, 5 flat crown
   * @param strength - 0..1 how strongly the marks show
   * @param bandCenter / bandHalf - the polished band across its strip (0..1)
   */
  setSurface(slot: number, kind: number, strength: number, bandCenter: number, bandHalf: number): void {
    const i = slot * 4 + this.slots * 4 * 3;
    const d = this.data;
    d[i] = kind; d[i + 1] = strength; d[i + 2] = bandCenter; d[i + 3] = bandHalf;
    this.dataTex.needsUpdate = true;
  }

  /** The running band strip's width (m) in profile units (mm), for working out band positions */
  static readonly BAND_STRIP_MM = SHINE_WIDTH / PROFILE_SCALE;

  /**
   * (Re)build one segment's rail from its profile, writing straight into the
   * shared vertex buffer. Only that segment's slice is re-uploaded to the GPU.
   */
  writeGeometry(slot: number, profile: RailProfile): void {
    const n = this.writeOutline(profile);
    const L = this.length;
    const m = this.matrices[slot];
    const nm = this.normalMatrices[slot];
    const pos = this.positions.array as Float32Array;
    const nor = this.normals.array as Float32Array;
    const loc = this.locals.array as Float32Array;
    const base = slot * this.vertsPerSlot;
    const ox = this.ox, oy = this.oy;

    // Outline winding decides which way is "outward"
    let area = 0;
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; area += ox[i] * oy[j] - ox[j] * oy[i]; }
    const out = area > 0 ? 1 : -1; // +1: counter-clockwise outline

    const put = (v: number, x: number, y: number, z: number, nx: number, ny: number, nz: number) => {
      this._v.set(x, y, z).applyMatrix4(m);
      this._n.set(nx, ny, nz).applyMatrix3(nm).normalize();
      const k = (base + v) * 3;
      loc[k] = x; loc[k + 1] = y; loc[k + 2] = z;
      pos[k] = this._v.x; pos[k + 1] = this._v.y; pos[k + 2] = this._v.z;
      nor[k] = this._n.x; nor[k + 1] = this._n.y; nor[k + 2] = this._n.z;
    };

    // Side walls: a flat quad per outline edge (flat shading, like before)
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const dx = ox[j] - ox[i], dy = oy[j] - oy[i];
      const len = Math.hypot(dx, dy) || 1;
      const nx = (dy / len) * out, ny = (-dx / len) * out;
      const v = i * 4;
      put(v,     ox[i], oy[i], 0, nx, ny, 0);
      put(v + 1, ox[j], oy[j], 0, nx, ny, 0);
      put(v + 2, ox[i], oy[i], L, nx, ny, 0);
      put(v + 3, ox[j], oy[j], L, nx, ny, 0);
    }
    // End caps (only ever seen at the very ends of the track)
    const c0 = n * 4, c1 = n * 5;
    for (let i = 0; i < n; i++) {
      put(c0 + i, ox[i], oy[i], 0, 0, 0, -1);
      put(c1 + i, ox[i], oy[i], L, 0, 0, 1);
    }

    const start = base * 3, count = this.vertsPerSlot * 3;
    this.positions.addUpdateRange(start, count);
    this.normals.addUpdateRange(start, count);
    this.locals.addUpdateRange(start, count);
    this.positions.needsUpdate = true;
    this.normals.needsUpdate = true;
    this.locals.needsUpdate = true;
  }

  /** Call once after the first writeGeometry of every slot */
  finishBuild(): void {
    this.railMesh.geometry.computeBoundingSphere();
    this.railMesh.geometry.computeBoundingBox();
    // The first upload sends the whole buffer anyway
    this.positions.clearUpdateRanges();
    this.normals.clearUpdateRanges();
    this.locals.clearUpdateRanges();
  }

  dispose(): void {
    this.railMesh.geometry.dispose();
    this.shineMesh.geometry.dispose();
    this.railMaterial.dispose();
    this.shineMaterial.dispose(); // (the shared scratch texture is kept)
    this.dataTex.dispose();
  }

  // ------------------------------------------------------------------

  /**
   * Fill ox/oy with the rail cross-section: flat base and web, then the
   * profile's head from right to left. Returns the outline vertex count.
   */
  private writeOutline(profile: RailProfile): number {
    const pts = profile.points;
    const ox = this.ox, oy = this.oy;
    let k = 0;
    const add = (x: number, y: number) => { ox[k] = x; oy[k] = y; k++; };
    const bL = -BASE_WIDTH / 2, bR = BASE_WIDTH / 2;
    const bB = -(WEB_HEIGHT + BASE_HEIGHT), bT = -WEB_HEIGHT;
    add(bL, bB); add(bR, bB); add(bR, bT); add(WEB_WIDTH / 2, bT); add(WEB_WIDTH / 2, 0);
    // Head, right (last point) to left (first point), every PROFILE_STEP-th point
    const last = pts.length - 1;
    for (let i = last; i >= 0; i -= PROFILE_STEP) add(pts[i].x * PROFILE_SCALE, -pts[i].y * PROFILE_SCALE);
    if (last % PROFILE_STEP) add(pts[0].x * PROFILE_SCALE, -pts[0].y * PROFILE_SCALE);
    add(-WEB_WIDTH / 2, 0); add(-WEB_WIDTH / 2, bT); add(bL, bT);
    // (the outline closes back to the first point by itself)
    // Pad if a profile ever had fewer points (keeps the buffer layout fixed)
    while (k < this.outline) add(bL, bT);
    return this.outline;
  }

  /**
   * Triangle list for every slot (same layout for all). Side walls are two
   * triangles per quad; the caps are triangulated once from the standard
   * (unground) cross-section — grinding only moves the head a few mm, which
   * never changes which triangles make up the cap.
   * Segments butt up against each other, so end faces ("caps") are only
   * drawn at the two ends of each rail: that halves the rail's triangles.
   */
  private buildIndex(pointCount: number): THREE.BufferAttribute {
    const n = this.outline;
    const { tris: capTris, ccw } = this.capTriangles(pointCount);
    const isFirst = (s: number) => s % this.slotsPerRail === 0;
    const isLast = (s: number) => s % this.slotsPerRail === this.slotsPerRail - 1;
    let total = 0;
    for (let s = 0; s < this.slots; s++) {
      total += n * 6 + (isFirst(s) ? capTris.length : 0) + (isLast(s) ? capTris.length : 0);
    }
    const vTotal = this.slots * this.vertsPerSlot;
    const idx = vTotal > 65535 ? new Uint32Array(total) : new Uint16Array(total);
    let k = 0;
    for (let s = 0; s < this.slots; s++) {
      const b = s * this.vertsPerSlot;
      // Triangles must face outward (front faces), or the double-sided
      // material would light them from the inside
      for (let i = 0; i < n; i++) {
        const v = b + i * 4;
        if (ccw) {
          idx[k++] = v; idx[k++] = v + 1; idx[k++] = v + 2;
          idx[k++] = v + 1; idx[k++] = v + 3; idx[k++] = v + 2;
        } else {
          idx[k++] = v; idx[k++] = v + 2; idx[k++] = v + 1;
          idx[k++] = v + 1; idx[k++] = v + 2; idx[k++] = v + 3;
        }
      }
      const c0 = b + n * 4, c1 = b + n * 5;
      // front cap faces -z, back cap +z: opposite windings
      if (isFirst(s)) for (let t = 0; t < capTris.length; t += 3) {
        idx[k++] = c0 + capTris[t]; idx[k++] = c0 + capTris[t + 2]; idx[k++] = c0 + capTris[t + 1];
      }
      if (isLast(s)) for (let t = 0; t < capTris.length; t += 3) {
        idx[k++] = c1 + capTris[t]; idx[k++] = c1 + capTris[t + 1]; idx[k++] = c1 + capTris[t + 2];
      }
    }
    return new THREE.BufferAttribute(idx, 1);
  }

  /**
   * Cap triangles (indices into the outline) for a standard, unground rail,
   * each wound counter-clockwise; and whether the outline itself runs CCW.
   */
  private capTriangles(pointCount: number): { tris: number[]; ccw: boolean } {
    // A flat-topped stand-in with the same number of head points is enough to
    // get a valid triangulation of the I-shaped section.
    const fake = { points: [] as { x: number; y: number }[] } as unknown as RailProfile;
    for (let i = 0; i < pointCount; i++) {
      const x = -37 + (74 * i) / (pointCount - 1);
      const y = 2 + 0.02 * x * x; // gentle crown, like the real head
      (fake.points as { x: number; y: number }[]).push({ x, y });
    }
    const n = this.writeOutline(fake);
    const contour: THREE.Vector2[] = [];
    for (let i = 0; i < n; i++) contour.push(new THREE.Vector2(this.ox[i], this.oy[i]));
    const faces = THREE.ShapeUtils.triangulateShape(contour, []);
    const signedArea = (a: number, b: number, c: number) =>
      (this.ox[b] - this.ox[a]) * (this.oy[c] - this.oy[a]) - (this.ox[c] - this.ox[a]) * (this.oy[b] - this.oy[a]);
    const tris: number[] = [];
    for (const f of faces) {
      if (signedArea(f[0], f[1], f[2]) >= 0) tris.push(f[0], f[1], f[2]);
      else tris.push(f[0], f[2], f[1]);
    }
    let area = 0;
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; area += this.ox[i] * this.oy[j] - this.ox[j] * this.oy[i]; }
    return { tris, ccw: area > 0 };
  }

  /** One flat strip per slot, lying on top of the rail head */
  private buildShine(): THREE.BufferGeometry {
    const pos = new Float32Array(this.slots * 4 * 3);
    const nor = new Float32Array(this.slots * 4 * 3);
    const uv = new Float32Array(this.slots * 4 * 2);
    const seg = new Float32Array(this.slots * 4);
    const idx = new Uint32Array(this.slots * 6);
    const hw = SHINE_WIDTH / 2, L = this.length;
    const corners = [[-hw, 0, 0, 1], [hw, 0, 1, 1], [-hw, L, 0, 0], [hw, L, 1, 0]]; // x, z, u, v
    for (let s = 0; s < this.slots; s++) {
      const m = this.matrices[s], nm = this.normalMatrices[s];
      this._n.set(0, 1, 0).applyMatrix3(nm).normalize();
      for (let c = 0; c < 4; c++) {
        const [x, z, u, v] = corners[c];
        this._v.set(x, SHINE_LIFT, z).applyMatrix4(m);
        const k = s * 4 + c;
        pos.set([this._v.x, this._v.y, this._v.z], k * 3);
        nor.set([this._n.x, this._n.y, this._n.z], k * 3);
        uv[k * 2] = u; uv[k * 2 + 1] = v;
        seg[k] = s;
      }
      const b = s * 4;
      idx.set([b, b + 2, b + 1, b + 1, b + 2, b + 3], s * 6);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setAttribute('aSeg', new THREE.BufferAttribute(seg, 1));
    geo.setIndex(new THREE.BufferAttribute(idx, 1));
    geo.computeBoundingSphere();
    return geo;
  }

  /** Rails: colour, metalness, glow and roughness come from the data texture */
  private patchRailMaterial(mat: THREE.MeshStandardMaterial): void {
    const tex = this.dataTex;
    mat.customProgramCacheKey = () => 'rail-batch';
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uSegData = { value: tex };
      shader.vertexShader = VERTEX_HEAD + `
        attribute vec3 aLoc;
        varying vec4 vSegA;
        varying vec4 vSegB;
        varying vec4 vSegC;
        varying vec3 vLoc;
        varying float vUp;
      ` + shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        vSegA = texelFetch(uSegData, ivec2(int(aSeg + 0.5), 0), 0);
        vSegB = texelFetch(uSegData, ivec2(int(aSeg + 0.5), 1), 0);
        vSegC = texelFetch(uSegData, ivec2(int(aSeg + 0.5), 3), 0);
        vLoc = aLoc;
        vUp = normal.y; // the rails are already in world space
      `);
      shader.fragmentShader = `
        varying vec4 vSegA;
        varying vec4 vSegB;
        varying vec4 vSegC;
        varying vec3 vLoc;
        varying float vUp;
        // Damage you can read on the rail head itself (darker marks, by kind)
        float railMarks(float kind, vec3 p) {
          float x = abs(p.x), z = p.z;
          if (kind < 1.5) {          // general wear: flaking spots
            float n = fract(sin(dot(floor(vec2(p.x * 420.0, z * 55.0)), vec2(12.9898, 78.233))) * 43758.5453);
            return step(0.8, n) * (1.0 - smoothstep(0.05, 0.07, x));
          } else if (kind < 2.5) {   // corrugation: ripples every ~20 cm
            return smoothstep(0.35, 0.95, sin(z * 31.4) * 0.5 + 0.5) * (1.0 - smoothstep(0.045, 0.06, x));
          } else if (kind < 3.5) {   // head checks: fine slanting cracks at the gauge corner
            return smoothstep(0.03, 0.05, x) * step(0.84, fract(z * 11.0 + x * 38.0));
          } else if (kind < 4.5) {   // gauge-face wear: a ragged lip at the edge
            float n = fract(sin(floor(z * 40.0) * 91.7) * 4375.5);
            return smoothstep(0.052, 0.066, x) * (0.6 + 0.4 * n);
          }
          return (1.0 - smoothstep(0.015, 0.04, x)) * 0.7; // flattened crown: a dull wide strip
        }
      ` + shader.fragmentShader
        .replace('vec4 diffuseColor = vec4( diffuse, opacity );', `vec4 diffuseColor = vec4( vSegA.rgb, opacity );
          if ( vSegC.y > 0.01 && vUp > 0.55 ) {
            float top = vSegC.y * smoothstep( 0.55, 0.85, vUp );
            float m = railMarks( vSegC.x, vLoc ) * top;
            // Corrugation crests and the gauge corner where head checks start are
            // worn bright by the wheels; cracks, flakes and dull patches are dark
            vec3 worn = vec3( 0.62, 0.55, 0.48 );
            if ( vSegC.x > 1.5 && vSegC.x < 2.5 ) diffuseColor.rgb = mix( diffuseColor.rgb, worn, m * 0.85 );
            else if ( vSegC.x < 1.5 ) diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.62, 0.3, 0.1 ), m * 0.9 ); // flaking: fresh orange rust
            else {
              if ( vSegC.x > 2.5 && vSegC.x < 3.5 ) diffuseColor.rgb = mix( diffuseColor.rgb, worn, smoothstep( 0.03, 0.05, abs( vLoc.x ) ) * top * 0.6 );
              diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.05, 0.035, 0.025 ), m * 0.85 );
            }
          }`)
        .replace('vec3 totalEmissiveRadiance = emissive;', 'vec3 totalEmissiveRadiance = vSegB.rgb;')
        .replace('#include <metalnessmap_fragment>', 'float metalnessFactor = vSegA.a;')
        .replace('#include <roughnessmap_fragment>', 'float roughnessFactor = vSegB.a;');
    };
  }

  /** Running bands: glow colour and opacity come from the data texture */
  private patchShineMaterial(mat: THREE.MeshStandardMaterial): void {
    const tex = this.dataTex;
    mat.customProgramCacheKey = () => 'rail-shine';
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uSegData = { value: tex };
      shader.vertexShader = VERTEX_HEAD + `
        varying vec4 vShine;
        varying vec2 vBand;
        varying float vBandU;
      ` + shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        vShine = texelFetch(uSegData, ivec2(int(aSeg + 0.5), 2), 0);
        vBand = texelFetch(uSegData, ivec2(int(aSeg + 0.5), 3), 0).zw;
        vBandU = uv.x;
      `);
      shader.fragmentShader = `
        varying vec4 vShine;
        varying vec2 vBand;
        varying float vBandU;
      ` + shader.fragmentShader
        .replace('vec4 diffuseColor = vec4( diffuse, opacity );',
          `// The band is where the wheels will ride: narrow and centred on a
           // good profile, wide or off to one side on a poor one
           float bandEdge = 1.0 - smoothstep( vBand.y * 0.85, vBand.y, abs( vBandU - vBand.x ) );
           vec4 diffuseColor = vec4( diffuse, opacity * vShine.a * ( vBand.y > 0.0 ? bandEdge : 1.0 ) );
           if ( diffuseColor.a < 0.01 ) discard; // rusty rail: no band`)
        .replace('vec3 totalEmissiveRadiance = emissive;', 'vec3 totalEmissiveRadiance = vShine.rgb;');
    };
  }
}
