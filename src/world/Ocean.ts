/**
 * Ocean - Animated sea along one side of the track, with a sandy beach.
 *
 * Built as long "ribbons" that follow the track spline, so the shoreline
 * hugs the route through every curve:
 *   track → walkway → beach (sand) → shoreline foam → open water → horizon
 *
 * The water shader (no textures):
 *   - gentle rolling waves from a few overlapping sine waves (their slope
 *     gives the surface normal, which drives all the lighting)
 *   - Fresnel: looking across the water at a low angle reflects the sky;
 *     looking down shows the deeper water colour
 *   - sun glitter: a sharp highlight brighter than white, so it blooms
 *   - animated foam where the waves meet the beach
 */

import * as THREE from 'three';
import type { RailTrack } from '../rail/RailTrack';
import type { SkyDome } from './SkyDome';

const SHORE_OFFSET = 15;   // metres from track centre to the water's edge
const BEACH_START = 7;     // sand starts just past the walkway
const SEA_REACH = 700;     // how far out the water ribbon extends
const STEP = 4;            // metres between ribbon cross-sections

const vertexShader = /* glsl */ `
  #include <common>
  #include <fog_pars_vertex>
  #include <logdepthbuf_pars_vertex>
  attribute float aShore;     // 0 at the shoreline → 1 far out to sea
  varying vec3 vWorld;
  varying float vShore;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    vShore = aShore;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <logdepthbuf_vertex>
    #include <fog_vertex>
  }
`;

const fragmentShader = /* glsl */ `
  #include <common>
  #include <fog_pars_fragment>
  #include <logdepthbuf_pars_fragment>
  uniform float uTime;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uSky;        // horizon colour, reflected at grazing angles
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uLight;     // overall brightness for time of day
  varying vec3 vWorld;
  varying float vShore;

  // Height field = sum of travelling sine waves; we only need its slope
  vec2 waveSlope(vec2 p, float t) {
    vec2 s = vec2(0.0);
    // direction, wavelength, amplitude, speed
    vec2 d1 = normalize(vec2(1.0, 0.25));  float k1 = 6.2832 / 9.0;
    vec2 d2 = normalize(vec2(0.7, -0.6));  float k2 = 6.2832 / 5.5;
    vec2 d3 = normalize(vec2(0.2, 1.0));   float k3 = 6.2832 / 3.1;
    s += d1 * k1 * 0.10 * cos(dot(d1, p) * k1 - t * 1.1);
    s += d2 * k2 * 0.06 * cos(dot(d2, p) * k2 - t * 1.6);
    s += d3 * k3 * 0.03 * cos(dot(d3, p) * k3 - t * 2.3);
    return s;
  }

  void main() {
    #include <logdepthbuf_fragment>
    vec2 slope = waveSlope(vWorld.xz, uTime);
    vec3 n = normalize(vec3(-slope.x, 1.0, -slope.y));
    vec3 v = normalize(cameraPosition - vWorld);

    // Water body: lighter near the beach, deep blue further out
    vec3 water = mix(uShallow, uDeep, smoothstep(0.0, 0.08, vShore)) * uLight;

    // Fresnel: grazing view angles reflect the sky
    float fresnel = 0.04 + 0.96 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
    vec3 col = mix(water, uSky, fresnel * 0.85);

    // Sun / moon glitter (HDR, so bloom makes it sparkle)
    vec3 r = reflect(-normalize(uSunDir), n);
    float glint = pow(max(dot(r, v), 0.0), 180.0);
    col += uSunColor * glint * 4.0;

    // Foam: bands that wash up and down at the shoreline
    float edge = 1.0 - smoothstep(0.0, 0.02, vShore);
    float surge = 0.5 + 0.5 * sin(uTime * 1.3 + vWorld.x * 0.25 + vWorld.z * 0.18);
    col = mix(col, vec3(0.92, 0.95, 0.97) * (0.4 + uLight * 0.6), edge * surge * 0.85);

    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`;

/**
 * Build a strip that follows the track at lateral offsets [near, far] on `side`.
 * Returns geometry with an extra 0..1 attribute across the strip (aShore).
 */
function buildRibbon(track: RailTrack, side: number, near: number, far: number, y: number): THREE.BufferGeometry {
  const positions: number[] = [];
  const shore: number[] = [];
  const indices: number[] = [];
  // Extend 300m past both ends of the track so the sea doesn't stop early
  const len = track.totalLength;
  const samples: { p: THREE.Vector3; r: THREE.Vector3 }[] = [];
  const first = track.getTrackPoint(0.1);
  const last = track.getTrackPoint(len - 0.1);
  samples.push({ p: first.position.clone().addScaledVector(first.forward, -300), r: first.right.clone() });
  for (let d = 0; d <= len; d += STEP) {
    const tp = track.getTrackPoint(Math.min(d, len - 0.1));
    samples.push({ p: tp.position.clone(), r: tp.right.clone() });
  }
  samples.push({ p: last.position.clone().addScaledVector(last.forward, 300), r: last.right.clone() });

  for (let i = 0; i < samples.length; i++) {
    const { p, r } = samples[i];
    // Flatten "right" to horizontal so banking doesn't tilt the sea
    const right = new THREE.Vector3(r.x, 0, r.z).normalize();
    positions.push(p.x + right.x * near * side, y, p.z + right.z * near * side);
    positions.push(p.x + right.x * far * side, y, p.z + right.z * far * side);
    shore.push(0, 1);
    if (i > 0) {
      const a = (i - 1) * 2, b = a + 1, c = i * 2, d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('aShore', new THREE.Float32BufferAttribute(shore, 1));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

export class Ocean {
  readonly group = new THREE.Group();
  private uniforms: Record<string, THREE.IUniform>;

  /** @param side which side of the track the sea is on (-1 = left / −x) */
  constructor(track: RailTrack, side: -1 | 1 = -1) {
    // Sand beach (under the water's edge so there's no gap)
    const beach = new THREE.Mesh(
      buildRibbon(track, side, BEACH_START, SHORE_OFFSET + 3, -0.56),
      new THREE.MeshStandardMaterial({ color: 0xd8c49a, roughness: 1, side: THREE.DoubleSide }),
    );
    beach.receiveShadow = true;
    this.group.add(beach);

    this.uniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uTime: { value: 0 },
        uDeep: { value: new THREE.Color(0x0e3a5c) },
        uShallow: { value: new THREE.Color(0x2f8f9a) },
        uSky: { value: new THREE.Color(0xa8ddf0) },
        uSunDir: { value: new THREE.Vector3(0, 1, 0) },
        uSunColor: { value: new THREE.Color(0xffffff) },
        uLight: { value: 1 },
      },
    ]);
    const water = new THREE.Mesh(
      buildRibbon(track, side, SHORE_OFFSET, SEA_REACH, -0.5),
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader,
        fragmentShader,
        fog: true,
        side: THREE.DoubleSide, // the far edge folds over itself on tight bends
      }),
    );
    this.group.add(water);
  }

  /** Follow the sky: reflect its horizon, glint in the sun/moon, dim at night */
  update(dt: number, sky: SkyDome, horizon: THREE.Color): void {
    const u = this.uniforms;
    u.uTime.value += dt;
    u.uSky.value.copy(horizon);
    u.uSunDir.value.copy(sky.uniforms.uSunDir.value);
    u.uSunColor.value.copy(sky.uniforms.uSunColor.value);
    // Brightness from how bright the horizon is (day ≈ 1, night ≈ 0.15)
    const lum = horizon.r * 0.3 + horizon.g * 0.59 + horizon.b * 0.11;
    u.uLight.value = 0.15 + Math.min(1, lum * 1.4);
  }
}
