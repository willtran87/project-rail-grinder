/**
 * DustSystem - Clouds of grinding dust that billow up behind the stones.
 *
 * Each puff is a soft round point sprite that rises slowly, drifts, grows
 * and fades. A tiny custom shader lets every puff have its own size and
 * opacity (the built-in PointsMaterial can't do per-point size).
 */

import * as THREE from 'three';

const MAX_PUFFS = 300;

// The logdepthbuf includes are needed because the renderer uses a logarithmic
// depth buffer — without them, custom shaders sort wrongly against the scene.
const vertexShader = /* glsl */ `
  #include <common>
  #include <logdepthbuf_pars_vertex>
  attribute float aSize;
  attribute float aAlpha;
  uniform float uScale;   // converts world size → pixels at distance 1
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    #include <logdepthbuf_vertex>
    gl_PointSize = aSize * uScale / max(0.5, -mv.z); // bigger when closer
    vAlpha = aAlpha;
  }
`;

const fragmentShader = /* glsl */ `
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    #include <logdepthbuf_fragment>
    // Soft round puff: opaque-ish centre fading to a transparent edge
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

interface Puff {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  age: number;
  life: number;
  size: number;
}

export class DustSystem {
  readonly points: THREE.Points;
  private puffs: Puff[] = [];
  private positions = new Float32Array(MAX_PUFFS * 3);
  private sizes = new Float32Array(MAX_PUFFS);
  private alphas = new Float32Array(MAX_PUFFS);
  private uniforms = {
    uColor: { value: new THREE.Color(0x8a7f70) },
    uScale: { value: 300 },
  };
  private next = 0; // ring-buffer write position
  /** Puffs still drifting; 0 = nothing to update or upload */
  private active = 0;

  constructor() {
    for (let i = 0; i < MAX_PUFFS; i++) {
      this.puffs.push({ pos: new THREE.Vector3(0, -100, 0), vel: new THREE.Vector3(), age: 1, life: 0, size: 1 });
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(this.alphas, 1));
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
  }

  /** Puff a little dust from `origin`, drifting along `drift` (m/s) */
  emit(origin: THREE.Vector3, drift: THREE.Vector3): void {
    const p = this.puffs[this.next];
    this.next = (this.next + 1) % MAX_PUFFS; // oldest puff gets recycled
    p.pos.copy(origin);
    p.pos.x += (Math.random() - 0.5) * 0.6;
    p.pos.z += (Math.random() - 0.5) * 0.6;
    p.vel.copy(drift);
    p.vel.x += (Math.random() - 0.5) * 0.6;
    p.vel.y = 0.3 + Math.random() * 0.5;
    p.vel.z += (Math.random() - 0.5) * 0.6;
    if (p.age >= p.life) this.active++; // recycled a finished puff
    p.age = 0;
    p.life = 2 + Math.random() * 2;
    p.size = 0.8 + Math.random() * 0.8;
  }

  /** Tint so dust matches the light (pale tan by day, dark at night) */
  setColor(color: THREE.Color): void {
    this.uniforms.uColor.value.copy(color);
  }

  /** Pixel scale: viewport height (in render pixels) / (2·tan(fov/2)) */
  setScale(scale: number): void {
    this.uniforms.uScale.value = scale;
  }

  update(dt: number): void {
    // No dust in the air: nothing to move, upload or draw
    this.points.visible = this.active > 0;
    if (this.active === 0) return;
    for (let i = 0; i < MAX_PUFFS; i++) {
      const p = this.puffs[i];
      if (p.age >= p.life) {
        this.alphas[i] = 0;
        continue;
      }
      p.age += dt;
      if (p.age >= p.life) { this.active--; this.alphas[i] = 0; continue; }
      p.vel.multiplyScalar(1 - dt * 0.6); // air drag
      p.pos.addScaledVector(p.vel, dt);
      const t = p.age / p.life;
      this.positions[i * 3] = p.pos.x;
      this.positions[i * 3 + 1] = p.pos.y;
      this.positions[i * 3 + 2] = p.pos.z;
      this.sizes[i] = p.size * (1 + t * 3);                     // billows outward
      this.alphas[i] = 0.35 * Math.min(1, t * 6) * (1 - t);     // fade in fast, out slow
    }
    const geo = this.points.geometry;
    geo.attributes.position.needsUpdate = true;
    geo.attributes.aSize.needsUpdate = true;
    geo.attributes.aAlpha.needsUpdate = true;
  }
}
