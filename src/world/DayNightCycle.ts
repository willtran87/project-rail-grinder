/**
 * DayNightCycle - Beautiful time-of-day lighting with rich color palettes.
 *
 * Key principles from pixel art games:
 * - Shadows are NEVER gray — they shift to complementary hues
 * - Fog matches the sky's horizon colour so distant things melt into the sky
 * - Each time of day has a distinct emotional color palette
 *
 * Each preset drives: sky dome (gradient, sun/moon, stars), fog, sun and
 * ambient light, exposure, ground tint, colour grade, and bloom strength.
 *
 * Inspired by: Firewatch, A Short Hike, Journey, Proteus
 */

import * as THREE from 'three';
import type { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SkyDome } from './SkyDome';
import type { GradeUniforms } from '../core/Engine';

interface TimePreset {
  name: string;
  // Sky dome
  zenithColor: THREE.Color;
  horizonColor: THREE.Color;      // also used as the fog colour (seamless horizon)
  skySunColor: THREE.Color;       // colour of the visible sun/moon disc + halo
  sunSize: number;                // cosine of disc radius (closer to 1 = smaller)
  sunGlow: number;                // halo strength
  stars: number;                  // 0..1
  // Fog
  fogNear: number;
  fogFar: number;
  // Lighting
  sunColor: THREE.Color;
  sunIntensity: number;
  sunDirection: THREE.Vector3;    // direction TOWARD the sun (normalised on use)
  ambientSkyColor: THREE.Color;   // light from above
  ambientGroundColor: THREE.Color; // bounce light from ground (colored shadows)
  ambientIntensity: number;
  exposure: number;
  groundColor: THREE.Color;       // tint for ground plane
  // Post-processing
  gradeLift: THREE.Color;         // tint added to shadows
  gradeGain: THREE.Color;         // tint multiplied into highlights
  saturation: number;
  contrast: number;
  bloomStrength: number;
}

const c = (hex: number) => new THREE.Color(hex);

const PRESETS: Record<string, TimePreset> = {
  dawn: {
    name: 'DAWN',
    zenithColor: c(0x3a5f8f), horizonColor: c(0xe8c898), skySunColor: c(0xffb070),
    sunSize: 0.9990, sunGlow: 0.7, stars: 0,
    fogNear: 40, fogFar: 220,
    sunColor: c(0xffaa66), sunIntensity: 0.9, sunDirection: new THREE.Vector3(-0.8, 0.18, 0.55),
    ambientSkyColor: c(0x8cb4c8), ambientGroundColor: c(0x6b5530), ambientIntensity: 1.0,
    exposure: 1.25, groundColor: c(0xc8a050),
    gradeLift: c(0x05030c), gradeGain: c(0xfff4e6), saturation: 1.05, contrast: 1.03,
    bloomStrength: 0.5,
  },
  day: {
    name: 'DAY',
    zenithColor: c(0x1f66c8), horizonColor: c(0xbfe4f4), skySunColor: c(0xfff4e0),
    sunSize: 0.9993, sunGlow: 0.35, stars: 0,
    fogNear: 80, fogFar: 380,
    sunColor: c(0xfff8f0), sunIntensity: 1.4, sunDirection: new THREE.Vector3(0.4, 0.8, 0.3),
    ambientSkyColor: c(0x88aadd), ambientGroundColor: c(0x667755), ambientIntensity: 1.0,
    exposure: 1.35, groundColor: c(0x4a7a3a),
    gradeLift: c(0x000004), gradeGain: c(0xfffcf6), saturation: 1.08, contrast: 1.04,
    bloomStrength: 0.3,
  },
  dusk: {
    name: 'DUSK',
    // Softer than before: indigo overhead fading to amber at the horizon
    zenithColor: c(0x2b2350), horizonColor: c(0xe89a62), skySunColor: c(0xff7a40),
    sunSize: 0.9986, sunGlow: 0.9, stars: 0,
    fogNear: 30, fogFar: 200,
    sunColor: c(0xff7a45), sunIntensity: 1.3, sunDirection: new THREE.Vector3(0.9, 0.16, -0.35),
    ambientSkyColor: c(0xb48aa8), ambientGroundColor: c(0x6a4428), ambientIntensity: 1.25,
    exposure: 1.3, groundColor: c(0xa8784c),
    gradeLift: c(0x0a020e), gradeGain: c(0xfff0dc), saturation: 1.1, contrast: 1.05,
    bloomStrength: 0.6,
  },
  night: {
    name: 'NIGHT',
    zenithColor: c(0x050818), horizonColor: c(0x141c34), skySunColor: c(0xc8d4ff), // moon
    sunSize: 0.9995, sunGlow: 0.25, stars: 1,
    fogNear: 20, fogFar: 140,
    sunColor: c(0x6688cc), sunIntensity: 0.3, sunDirection: new THREE.Vector3(-0.5, 0.65, 0.35),
    ambientSkyColor: c(0x23305a), ambientGroundColor: c(0x0c141c), ambientIntensity: 0.35,
    exposure: 1.05, groundColor: c(0x1e3a2a),
    gradeLift: c(0x000610), gradeGain: c(0xeaf2ff), saturation: 0.92, contrast: 1.08,
    bloomStrength: 0.85,
  },
};

const TIME_ORDER = ['dawn', 'day', 'dusk', 'night'];
const SUN_DISTANCE = 80; // how far the shadow-casting light sits from the focus point

export interface PostFX {
  bloom: UnrealBloomPass;
  grade: GradeUniforms;
}

export class DayNightCycle {
  private scene: THREE.Scene;
  private sun: THREE.DirectionalLight;
  private ambient: THREE.HemisphereLight;
  private renderer: THREE.WebGLRenderer;
  private post: PostFX | null;
  private groundMesh: THREE.Mesh | null = null;
  readonly sky: SkyDome;

  private currentIndex: number = 1; // start at day
  private targetPreset: TimePreset;
  private transitionProgress: number = 1;
  private sunDir = new THREE.Vector3();

  currentName: string = 'DAY';

  constructor(
    scene: THREE.Scene,
    sun: THREE.DirectionalLight,
    ambient: THREE.HemisphereLight,
    renderer: THREE.WebGLRenderer,
    post: PostFX | null = null,
  ) {
    this.scene = scene;
    this.sun = sun;
    this.ambient = ambient;
    this.renderer = renderer;
    this.post = post;

    this.sky = new SkyDome();
    scene.add(this.sky.mesh);
    // The light's target must be in the scene so we can move it with the grinder
    scene.add(this.sun.target);

    this.targetPreset = PRESETS[TIME_ORDER[this.currentIndex]];
    this.applyPreset(this.targetPreset);
  }

  /** Set the ground mesh so we can tint it with the palette */
  setGroundMesh(mesh: THREE.Mesh): void {
    this.groundMesh = mesh;
  }

  setTime(name: string): void {
    const idx = TIME_ORDER.indexOf(name);
    if (idx >= 0) {
      this.currentIndex = idx;
      this.targetPreset = PRESETS[name];
      this.currentName = this.targetPreset.name;
      this.transitionProgress = 0;
    }
  }

  cycleTime(): void {
    this.currentIndex = (this.currentIndex + 1) % TIME_ORDER.length;
    this.targetPreset = PRESETS[TIME_ORDER[this.currentIndex]];
    this.currentName = this.targetPreset.name;
    this.transitionProgress = 0;
  }

  get isNight(): boolean {
    return this.currentIndex === 3;
  }

  get isDusk(): boolean {
    return this.currentIndex === 2;
  }

  /** Current fog/horizon colour (used by the ground mist) */
  get fogColor(): THREE.Color {
    return (this.scene.fog as THREE.Fog).color;
  }

  /** Night-ness 0..1 as presets blend (for effects that should fade in at night) */
  get starAmount(): number {
    return this.sky.uniforms.uStars.value;
  }

  /**
   * @param camera - the sky dome is centred on it
   * @param focus - where the action is (the grinder); the sun's shadow box follows it
   *                so shadows stay sharp along the whole track, not just near the start
   */
  update(dt: number, camera: THREE.Camera, focus: THREE.Vector3): void {
    this.sky.update(dt, camera.position);

    // Shadow-casting light sits at a fixed direction from the focus point
    this.sun.position.copy(focus).addScaledVector(this.sunDir, SUN_DISTANCE);
    this.sun.target.position.copy(focus);
    this.sun.target.updateMatrixWorld();

    if (this.transitionProgress >= 1) return;
    this.transitionProgress = Math.min(1, this.transitionProgress + dt * 0.4);
    this.blendToward(this.targetPreset, this.smoothstep(this.transitionProgress));
  }

  /** Move every value a fraction t of the way toward preset p */
  private blendToward(p: TimePreset, t: number): void {
    const sky = this.sky.uniforms;
    sky.uZenith.value.lerp(p.zenithColor, t);
    sky.uHorizon.value.lerp(p.horizonColor, t);
    sky.uGround.value.lerp(p.groundColor.clone().multiplyScalar(0.6), t);
    sky.uSunColor.value.lerp(p.skySunColor, t);
    sky.uSunSize.value += (p.sunSize - sky.uSunSize.value) * t;
    sky.uSunGlow.value += (p.sunGlow - sky.uSunGlow.value) * t;
    sky.uStars.value += (p.stars - sky.uStars.value) * t;
    this.sunDir.lerp(p.sunDirection.clone().normalize(), t).normalize();
    sky.uSunDir.value.copy(this.sunDir);

    (this.scene.background as THREE.Color).lerp(p.horizonColor, t);
    const fog = this.scene.fog as THREE.Fog;
    fog.color.lerp(p.horizonColor, t);
    fog.near += (p.fogNear - fog.near) * t;
    fog.far += (p.fogFar - fog.far) * t;

    this.sun.color.lerp(p.sunColor, t);
    this.sun.intensity += (p.sunIntensity - this.sun.intensity) * t;

    this.ambient.color.lerp(p.ambientSkyColor, t);
    this.ambient.groundColor.lerp(p.ambientGroundColor, t);
    this.ambient.intensity += (p.ambientIntensity - this.ambient.intensity) * t;

    this.renderer.toneMappingExposure += (p.exposure - this.renderer.toneMappingExposure) * t;

    if (this.groundMesh) {
      (this.groundMesh.material as THREE.MeshStandardMaterial).color.lerp(p.groundColor, t);
    }

    if (this.post) {
      const g = this.post.grade;
      g.uLift.value.lerp(p.gradeLift, t);
      g.uGain.value.lerp(p.gradeGain, t);
      g.uSaturation.value += (p.saturation - g.uSaturation.value) * t;
      g.uContrast.value += (p.contrast - g.uContrast.value) * t;
      this.post.bloom.strength += (p.bloomStrength - this.post.bloom.strength) * t;
    }
  }

  /** Jump straight to a preset (no transition) */
  private applyPreset(p: TimePreset): void {
    // Blending with t = 1 copies every value exactly
    this.sunDir.copy(p.sunDirection).normalize();
    this.blendToward(p, 1);
  }

  private smoothstep(t: number): number {
    return t * t * (3 - 2 * t);
  }
}
