/**
 * SkyDome - A gradient sky with a sun (or moon) disc, halo and stars.
 *
 * A huge inverted sphere drawn behind everything with a small shader:
 *   - vertical gradient: horizon colour → zenith colour
 *   - a sun disc + soft glow in the sun's direction (brighter than white,
 *     so the bloom pass makes it glow)
 *   - procedural twinkling stars that fade in at night
 *
 * DayNightCycle drives the colours; the dome follows the camera so it
 * always looks infinitely far away.
 */

import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    // Direction from the dome centre — position is already a unit-ish direction
    vDir = normalize(position);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_Position.z = gl_Position.w; // push to the far plane: always behind everything
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uGround;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uSunSize;    // angular size of the disc (cosine threshold)
  uniform float uSunGlow;    // strength of the halo around the sun
  uniform float uStars;      // 0 = no stars, 1 = full night sky
  uniform float uTime;
  varying vec3 vDir;

  // Cheap 3D hash for star placement
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    vec3 dir = normalize(vDir);
    float h = dir.y;

    // Gradient: ground tint below the horizon, horizon → zenith above it.
    // pow() keeps the horizon band wide and soft.
    vec3 sky = mix(uHorizon, uZenith, pow(clamp(h, 0.0, 1.0), 0.4));
    sky = mix(sky, uGround, smoothstep(0.0, -0.15, h));

    // Sun: hard-ish disc + wide soft halo, plus a warm horizon glow toward it
    float cosAng = dot(dir, normalize(uSunDir));
    float disc = smoothstep(uSunSize, uSunSize + 0.0015, cosAng);
    float halo = pow(max(cosAng, 0.0), 12.0) * uSunGlow;
    float horizonGlow = pow(max(cosAng, 0.0), 3.0) * (1.0 - abs(h)) * uSunGlow * 0.6;
    sky += uSunColor * (halo + horizonGlow);
    sky = mix(sky, uSunColor * 3.0, disc); // > 1.0 so bloom picks it up

    // Stars: sparse bright cells, twinkling slowly; only above the horizon
    if (uStars > 0.0 && h > 0.0) {
      vec3 cell = floor(dir * 220.0);
      float r = hash(cell);
      if (r > 0.9965) {
        float twinkle = 0.6 + 0.4 * sin(uTime * (1.0 + r * 4.0) + r * 50.0);
        sky += vec3(0.9, 0.95, 1.0) * twinkle * uStars * smoothstep(0.0, 0.25, h) * 1.5;
      }
    }

    gl_FragColor = vec4(sky, 1.0);
  }
`;

export interface SkyColors {
  zenith: THREE.Color;
  horizon: THREE.Color;
  ground: THREE.Color;
  sunColor: THREE.Color;
  sunSize: number;
  sunGlow: number;
  stars: number;
}

export class SkyDome {
  readonly mesh: THREE.Mesh;
  readonly uniforms: {
    uZenith: { value: THREE.Color };
    uHorizon: { value: THREE.Color };
    uGround: { value: THREE.Color };
    uSunDir: { value: THREE.Vector3 };
    uSunColor: { value: THREE.Color };
    uSunSize: { value: number };
    uSunGlow: { value: number };
    uStars: { value: number };
    uTime: { value: number };
  };

  constructor() {
    this.uniforms = {
      uZenith: { value: new THREE.Color(0x2a6ab8) },
      uHorizon: { value: new THREE.Color(0xa8ddf0) },
      uGround: { value: new THREE.Color(0x40503a) },
      uSunDir: { value: new THREE.Vector3(0.4, 0.8, 0.3).normalize() },
      uSunColor: { value: new THREE.Color(0xfff2d8) },
      uSunSize: { value: 0.9992 },
      uSunGlow: { value: 0.5 },
      uStars: { value: 0 },
      uTime: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,   // we're inside the sphere
      depthWrite: false,
      fog: false,
    });

    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -1000; // draw first
  }

  /** Keep the dome centred on the camera so it never gets closer */
  update(dt: number, cameraPosition: THREE.Vector3): void {
    this.mesh.position.copy(cameraPosition);
    this.uniforms.uTime.value += dt;
  }
}
