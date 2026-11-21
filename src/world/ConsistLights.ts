/**
 * ConsistLights - The grinder's headlight, which switches on as it gets dark.
 *
 * Two parts:
 *   - a real SpotLight that lights the track ahead of the consist
 *   - a soft see-through cone (the "beam") so you can see the light in the air,
 *     like headlights in fog. Bloom makes the bright end near the lamp glow.
 *
 * Both fade in with DayNightCycle.darkness, so at midday you see nothing.
 */

import * as THREE from 'three';
import type { RailTrack } from '../rail/RailTrack';

/** Leading end of the consist, metres ahead of grinderPosition (crew car nose) */
const FRONT_OFFSET = 75.5;
const LAMP_HEIGHT = 2.4;
const BEAM_LENGTH = 26;
const BEAM_RADIUS = 4.5;
/** How far ahead (m) the beam is aimed at the rail */
const AIM_DISTANCE = 30;

// A cone that is bright near the lamp, fades toward the far end, and is
// softest at its edges (where you look through less "lit air").
const beamVertex = /* glsl */ `
  #include <common>
  #include <logdepthbuf_pars_vertex>
  varying float vAlong;
  varying float vFacing;
  void main() {
    vAlong = uv.y; // 1 at the lamp (cone tip), 0 at the far end
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    vFacing = abs(dot(n, normalize(-mv.xyz)));
    gl_Position = projectionMatrix * mv;
    #include <logdepthbuf_vertex>
  }
`;

const beamFragment = /* glsl */ `
  #include <common>
  #include <logdepthbuf_pars_fragment>
  uniform vec3 uColor;
  uniform float uStrength;
  varying float vAlong;
  varying float vFacing;
  void main() {
    #include <logdepthbuf_fragment>
    float a = pow(vAlong, 1.6) * pow(vFacing, 1.5) * uStrength;
    gl_FragColor = vec4(uColor * a, 1.0); // additive: colour × alpha
  }
`;

export class ConsistLights {
  readonly group = new THREE.Group();
  private spot: THREE.SpotLight;
  private beam: THREE.Mesh;
  private uniforms = {
    uColor: { value: new THREE.Color(0xfff1c8) },
    uStrength: { value: 0 },
  };
  private _aim = new THREE.Vector3();

  constructor() {
    this.spot = new THREE.SpotLight(0xfff1c8, 0, 60, 0.45, 0.6, 1.2);
    this.spot.castShadow = false; // shadows from a second light would double the cost
    this.group.add(this.spot);
    this.group.add(this.spot.target);

    // Cone with its tip at the origin, opening along +z (lookAt aims +z)
    const geo = new THREE.ConeGeometry(BEAM_RADIUS, BEAM_LENGTH, 24, 1, true);
    geo.translate(0, -BEAM_LENGTH / 2, 0);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: beamVertex,
      fragmentShader: beamFragment,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    this.beam = new THREE.Mesh(geo, mat);
    this.beam.frustumCulled = false;
    this.beam.renderOrder = 4;
    this.group.add(this.beam);
  }

  /**
   * @param darkness - 0 (day) .. 1 (night), from DayNightCycle
   * @param haze - 0..1 extra beam visibility in rain / snow / overcast
   */
  update(track: RailTrack, grinderPosition: number, darkness: number, haze: number): void {
    const len = track.totalLength;
    const clamp = (d: number) => Math.max(0.1, Math.min(len - 0.1, d));
    const front = track.getTrackPoint(clamp(grinderPosition + FRONT_OFFSET));
    const aim = track.getTrackPoint(clamp(grinderPosition + FRONT_OFFSET + AIM_DISTANCE));

    this.spot.position.copy(front.position);
    this.spot.position.y += LAMP_HEIGHT;
    this._aim.copy(aim.position);
    this.spot.target.position.copy(this._aim);
    this.spot.target.updateMatrixWorld();

    this.beam.position.copy(this.spot.position);
    this._aim.y += 0.8; // beam centre a little above the rail so it reads as a beam
    this.beam.lookAt(this._aim);

    // Lamps come on from dusk; the beam shows more in falling rain or snow
    const on = THREE.MathUtils.smoothstep(darkness, 0.25, 0.75);
    this.spot.intensity = on * 150;
    this.uniforms.uStrength.value = on * (0.16 + haze * 0.2);
    this.beam.visible = on > 0.01;
  }
}
