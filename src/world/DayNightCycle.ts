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
 * Time passes on its own (see PHASE_SECONDS): every frame the two
 * neighbouring presets are blended, then the weather (overcast, snow) is
 * layered on top. `darkness` tells other systems when to switch lamps on.
 *
 * Inspired by: Firewatch, A Short Hike, Journey, Proteus
 */

import * as THREE from 'three';
import type { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { SkyDome } from './SkyDome';
import type { GradeUniforms } from '../core/Engine';
import type { Region } from '../types/rail';

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
    // Moonlit rather than pitch black: you should still make out the scenery
    sunColor: c(0x7090d0), sunIntensity: 0.5, sunDirection: new THREE.Vector3(-0.5, 0.65, 0.35),
    ambientSkyColor: c(0x34477a), ambientGroundColor: c(0x18222e), ambientIntensity: 0.6,
    exposure: 1.3, groundColor: c(0x2a4836),
    gradeLift: c(0x0a1428), gradeGain: c(0xeaf2ff), saturation: 0.92, contrast: 1.0,
    bloomStrength: 0.85,
  },
};

const TIME_ORDER = ['dawn', 'day', 'dusk', 'night'];
const SUN_DISTANCE = 80; // how far the shadow-casting light sits from the focus point
/** The shadow box is centred this far in front of the camera (metres) */
const SHADOW_AHEAD = 25;

/**
 * Time passes on its own: each phase (dawn, day, dusk, night) lasts this many
 * seconds — it holds for the first half, then blends into the next phase.
 * A full day is 4 × PHASE_SECONDS. Press N to skip ahead to the next phase.
 */
export const PHASE_SECONDS = 180;
const SKIP_SPEED = 0.5;   // phases per second while N is fast-forwarding

const OVERCAST_GREY = new THREE.Color(0x8a929c);
const SNOW_GROUND = new THREE.Color(0xe2e8ef);

/**
 * Which two phases to blend for a clock value, and how far (f = 0..1).
 * Each phase holds for the first half of its slot, then eases into the next.
 * Phases: 0 dawn, 1 day, 2 dusk, 3 night (night blends back into dawn).
 */
export function phaseBlend(clock: number): { from: number; to: number; f: number } {
  const n = TIME_ORDER.length;
  const whole = Math.floor(clock);
  const from = ((whole % n) + n) % n;
  const frac = clock - whole;
  const t = Math.max(0, Math.min(1, (frac - 0.5) / 0.5));
  return { from, to: (from + 1) % n, f: t * t * (3 - 2 * t) };
}

export interface PostFX {
  bloom: UnrealBloomPass;
  grade: GradeUniforms;
}

/** Per-region colour grade, multiplied onto the time-of-day grade (see applyRegionLook) */
const REGION_LOOK: Record<Region,
  { gain: [number, number, number]; lift: [number, number, number]; saturation: number; contrast: number; night?: [number, number, number] }> = {
  prairie: { gain: [1.05, 1.0, 0.9], lift: [0.008, 0.004, 0], saturation: 1.08, contrast: 1.0 },
  mountain: { gain: [0.94, 0.99, 1.07], lift: [0, 0.004, 0.016], saturation: 0.94, contrast: 1.04 },
  city: { gain: [1.0, 0.98, 0.96], lift: [0.004, 0.002, 0], saturation: 0.97, contrast: 1.06, night: [1.14, 0.96, 0.72] },
  coast: { gain: [0.97, 1.02, 1.04], lift: [0, 0.006, 0.01], saturation: 1.05, contrast: 1.0 },
  desert: { gain: [1.09, 0.99, 0.84], lift: [0.012, 0.006, 0], saturation: 1.1, contrast: 1.04 },
  forest: { gain: [0.94, 1.03, 0.98], lift: [0, 0.006, 0.004], saturation: 1.0, contrast: 1.02 },
  appalachia: { gain: [1.0, 1.0, 0.96], lift: [0.01, 0.01, 0.012], saturation: 0.92, contrast: 0.96 },
};

export class DayNightCycle {
  private scene: THREE.Scene;
  private sun: THREE.DirectionalLight;
  private ambient: THREE.HemisphereLight;
  private renderer: THREE.WebGLRenderer;
  private post: PostFX | null;
  private groundMesh: THREE.Mesh | null = null;
  readonly sky: SkyDome;

  /** Time of day in phases: 0 = dawn, 1 = day, 2 = dusk, 3 = night (wraps at 4) */
  private clock: number = 1;
  /** Where the clock is heading when N fast-forwards it */
  private clockTarget: number = 1;
  private sunDir = new THREE.Vector3();
  /** Direction toward the sun (or moon), for sun shafts */
  get sunDirection(): THREE.Vector3 { return this.sunDir; }
  private _shadowCentre = new THREE.Vector3();
  private _camFwd = new THREE.Vector3();
  private _lx = new THREE.Vector3();
  private _ly = new THREE.Vector3();
  private static readonly WORLD_UP = new THREE.Vector3(0, 1, 0);
  private _tmpDir = new THREE.Vector3();
  private _tmpColor = new THREE.Color();
  private _darkness = 0;
  private boost = 0;

  /** Let time pass on its own during play */
  autoAdvance = true;
  /** 0..1 cloud cover (set by the weather): dimmer sun, greyer sky, closer fog */
  overcast = 0;
  /** 0..1 snow on the ground (snowy routes) */
  snowCover = 0;
  /** Season tint for the ground (null = summer / none) and how much */
  seasonGround: THREE.Color | null = null;
  seasonAmount = 0;
  /** Multiplies fog distances (the end-of-job vista pushes the fog back) */
  fogScale = 1;
  /** 0..1 how wet everything is after rain (darker ground) */
  wetness = 0;
  /** Set to 1 while grinding: brightens exposure at night so sparks pop */
  grindBoost = 0;

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

    this.applyClock();
  }

  /** Set the ground mesh so we can tint it with the palette */
  setGroundMesh(mesh: THREE.Mesh): void {
    this.groundMesh = mesh;
  }

  /** Jump straight to the start of a phase ('dawn' | 'day' | 'dusk' | 'night') */
  setTime(name: string): void {
    const idx = TIME_ORDER.indexOf(name);
    if (idx >= 0) {
      this.clock = this.clockTarget = idx;
      this.applyClock();
    }
  }

  /** Fast-forward smoothly to the start of the next phase (key N) */
  cycleTime(): void {
    this.clockTarget = Math.floor(this.clockTarget) + 1;
  }

  /** Which phase we're mostly in right now (0..3) */
  private get phaseIndex(): number {
    return Math.floor(this.clock + 0.25) % TIME_ORDER.length;
  }

  get isNight(): boolean {
    return this.phaseIndex === 3;
  }

  get isDusk(): boolean {
    return this.phaseIndex === 2;
  }

  /**
   * 0 (bright day) .. 1 (dark night), changing smoothly as time passes.
   * Headlights, beacons and lineside lamps use this to fade in.
   */
  get darkness(): number {
    return this._darkness;
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
   * Where the shadow box goes: just ahead of the camera, where shadows are
   * actually seen (not behind it). Snapped to whole shadow-map texels in the
   * light's view, so shadow edges stay still instead of shimmering as the
   * camera moves.
   */
  private shadowCentre(camera: THREE.Camera, focus: THREE.Vector3): THREE.Vector3 {
    const fwd = camera.getWorldDirection(this._camFwd);
    fwd.y = 0;
    if (fwd.lengthSq() < 1e-6) fwd.set(0, 0, 1);
    fwd.normalize();
    const c = this._shadowCentre.copy(camera.position).addScaledVector(fwd, SHADOW_AHEAD);
    c.y = focus.y;

    // The shadow camera looks along -sunDir with world-up as "up":
    // its x axis = up × sunDir, its y axis = sunDir × x
    const L = this.sunDir;
    const lx = this._lx.crossVectors(DayNightCycle.WORLD_UP, L);
    if (lx.lengthSq() < 1e-6) return c; // sun straight overhead: no snapping needed
    lx.normalize();
    const ly = this._ly.crossVectors(L, lx).normalize();
    const shadowCam = this.sun.shadow.camera;
    const texel = (shadowCam.right - shadowCam.left) / Math.max(1, this.sun.shadow.mapSize.x);
    const a = Math.round(c.dot(lx) / texel) * texel;
    const b = Math.round(c.dot(ly) / texel) * texel;
    const z = c.dot(L);
    return c.copy(lx).multiplyScalar(a).addScaledVector(ly, b).addScaledVector(L, z);
  }

  /**
   * @param camera - the sky dome is centred on it
   * @param focus - where the action is (the grinder); the sun's shadow box follows it
   *                so shadows stay sharp along the whole track, not just near the start
   */
  update(dt: number, camera: THREE.Camera, focus: THREE.Vector3): void {
    this.sky.update(dt, camera.position);

    // Shadow-casting light sits at a fixed direction from the shadow centre
    const centre = this.shadowCentre(camera, focus);
    this.sun.position.copy(centre).addScaledVector(this.sunDir, SUN_DISTANCE);
    this.sun.target.position.copy(centre);
    this.sun.target.updateMatrixWorld();

    // Advance time: on its own, plus fast-forward toward clockTarget after N
    const step = this.autoAdvance ? dt / PHASE_SECONDS : 0;
    this.clockTarget += step;
    this.clock += step;
    const behind = this.clockTarget - this.clock;
    if (behind > 0) this.clock += Math.min(behind, SKIP_SPEED * dt);
    if (this.clock >= TIME_ORDER.length) {
      this.clock -= TIME_ORDER.length;
      this.clockTarget -= TIME_ORDER.length;
    }

    this.boost += (this.grindBoost - this.boost) * Math.min(1, 3 * dt);
    this.applyClock();
  }

  /**
   * Set every lighting value for the current clock: blend the two neighbouring
   * presets, then layer weather (overcast, snow) and the grinding boost on top.
   */
  private applyClock(): void {
    const { from, to, f } = phaseBlend(this.clock);
    const a = PRESETS[TIME_ORDER[from]];
    const b = PRESETS[TIME_ORDER[to]];

    this.sunDir.copy(a.sunDirection).normalize();
    this.blendToward(a, 1); // copy phase A exactly…
    this.blendToward(b, f); // …then move part of the way toward phase B
    this.currentName = PRESETS[TIME_ORDER[this.phaseIndex]].name;

    // How dark is it? Based on the brightness of the sky overhead
    const z = this.sky.uniforms.uZenith.value;
    const lum = 0.2126 * z.r + 0.7152 * z.g + 0.0722 * z.b;
    this._darkness = Math.max(0, Math.min(1, 1 - lum / 0.08));

    this.applyWeather();
    this.applyRegionLook();
    if (this.fogScale !== 1) {
      const fog = this.scene.fog as THREE.Fog;
      fog.near *= this.fogScale;
      fog.far *= this.fogScale;
    }

    // Grinding in the dark: lift exposure so the sparks light up the scene
    const boost = this.boost * this._darkness;
    this.renderer.toneMappingExposure += (1.6 - this.renderer.toneMappingExposure) * boost;
  }

  /**
   * Each kind of route has its own colour: a warm, golden prairie, cold blue
   * mountains, a city that goes sodium-orange at night, a teal coast. Layered
   * on the time-of-day grade.
   */
  region: Region | null = null;
  private applyRegionLook(): void {
    if (!this.post || !this.region) return;
    const g = this.post.grade;
    const d = this._darkness;
    const look = REGION_LOOK[this.region];
    g.uGain.value.multiply(this._tmpColor.setRGB(look.gain[0], look.gain[1], look.gain[2]));
    g.uLift.value.add(this._tmpColor.setRGB(look.lift[0], look.lift[1], look.lift[2]));
    g.uSaturation.value *= look.saturation;
    g.uContrast.value *= look.contrast;
    if (look.night) g.uGain.value.lerp(this._tmpColor.copy(g.uGain.value).multiply(
      this._tmpColor2.setRGB(look.night[0], look.night[1], look.night[2])), d);
  }
  private _tmpColor2 = new THREE.Color();

  /** Clouds grey out the sky and dim the sun; snow whitens the ground */
  private applyWeather(): void {
    const o = this.overcast;
    const sky = this.sky.uniforms;
    if (o > 0.001) {
      const fog = this.scene.fog as THREE.Fog;
      // Grey at the fog's own brightness, so overcast nights stay dark
      const l = fog.color.r * 0.3 + fog.color.g * 0.59 + fog.color.b * 0.11;
      const grey = this._tmpColor.copy(OVERCAST_GREY).multiplyScalar(Math.min(1.2, l * 1.6 + 0.02));
      fog.color.lerp(grey, 0.65 * o);
      (this.scene.background as THREE.Color).copy(fog.color);
      fog.near *= 1 - 0.5 * o;
      fog.far *= 1 - 0.45 * o;
      sky.uHorizon.value.lerp(grey, 0.7 * o);
      sky.uZenith.value.lerp(grey, 0.6 * o);
      sky.uSunGlow.value *= 1 - o;
      sky.uSunColor.value.lerp(sky.uHorizon.value, o);
      sky.uStars.value *= 1 - o;
      this.sun.intensity *= 1 - 0.65 * o;
      this.ambient.intensity *= 1 - 0.1 * o;
      if (this.post) this.post.grade.uSaturation.value *= 1 - 0.25 * o;
      this._darkness = Math.min(1, this._darkness + 0.15 * o);
    }
    if (this.groundMesh && this.seasonGround && this.seasonAmount > 0 && this.snowCover < 0.3) {
      (this.groundMesh.material as THREE.MeshLambertMaterial).color.lerp(this.seasonGround, this.seasonAmount);
    }
    if (this.groundMesh && this.wetness > 0.01) {
      (this.groundMesh.material as THREE.MeshLambertMaterial).color.multiplyScalar(1 - 0.3 * this.wetness);
    }
    const s = this.snowCover;
    if (s > 0.001) {
      if (this.groundMesh) {
        (this.groundMesh.material as THREE.MeshLambertMaterial).color.lerp(SNOW_GROUND, 0.85 * s);
      }
      sky.uGround.value.lerp(this._tmpColor.copy(SNOW_GROUND).multiplyScalar(0.6), 0.85 * s);
      // Snow catches the moonlight: snowy nights are noticeably brighter
      this.ambient.intensity += 0.3 * s * this._darkness;
      this.ambient.groundColor.lerp(this.ambient.color, 0.5 * s);
    }
  }

  /** Move every value a fraction t of the way toward preset p */
  private blendToward(p: TimePreset, t: number): void {
    const sky = this.sky.uniforms;
    sky.uZenith.value.lerp(p.zenithColor, t);
    sky.uHorizon.value.lerp(p.horizonColor, t);
    sky.uGround.value.lerp(this._tmpColor.copy(p.groundColor).multiplyScalar(0.6), t);
    sky.uSunColor.value.lerp(p.skySunColor, t);
    sky.uSunSize.value += (p.sunSize - sky.uSunSize.value) * t;
    sky.uSunGlow.value += (p.sunGlow - sky.uSunGlow.value) * t;
    sky.uStars.value += (p.stars - sky.uStars.value) * t;
    this.sunDir.lerp(this._tmpDir.copy(p.sunDirection).normalize(), t).normalize();
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
      (this.groundMesh.material as THREE.MeshLambertMaterial).color.lerp(p.groundColor, t);
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
}
