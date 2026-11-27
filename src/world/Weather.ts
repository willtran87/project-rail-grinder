/**
 * Weather - Rain or snow, plus cloud cover, changing by itself over a job.
 *
 * Each route has a climate (see CLIMATES): how often it rains or snows and
 * how cloudy it gets. A small "director" picks a new weather state every
 * minute or two (clear → cloudy → showers …) and everything eases toward it,
 * so the weather rolls in and out instead of switching instantly.
 *
 *   rain - falling streaks (line segments, faster = longer)
 *   snow - soft round flakes that drift and sway
 *
 * PERFORMANCE: the drops and flakes are animated entirely on the GPU. Each
 * one gets a fixed random seed (start spot, phase, speed) once; the vertex
 * shader works out where it is from the time, wraps it into a box around the
 * grinder and hides it once it has hit a train roof. The CPU only updates a
 * few uniforms per frame instead of moving 2,000 particles and re-uploading them.
 *
 * Outputs read by Game: `overcast` (→ DayNightCycle), `intensity`, `haze`.
 * Key P forces showers on/off (the director carries on afterwards).
 */

import * as THREE from 'three';

import type { Region } from '../types/rail';
export type { Region };
export type Precipitation = 'rain' | 'snow';

export interface Climate {
  precip: Precipitation;
  /** Chance (0..1) that the next weather state is showers */
  showerChance: number;
  /** Chance (0..1) that the next weather state is cloudy (if not showers) */
  cloudyChance: number;
  /** Heaviest the rain/snow gets (0..1) */
  maxIntensity: number;
  /** Rain or snow already falling when the job starts (0..1) */
  startIntensity: number;
  /** Snow lying on the ground (0..1) */
  snowCover: number;
}

export const CLIMATES: Record<Region, Climate> = {
  // Kansas: mostly big skies, the odd thunderstorm
  prairie:  { precip: 'rain', showerChance: 0.3,  cloudyChance: 0.3, maxIntensity: 1.0, startIntensity: 0,   snowCover: 0 },
  // Marias Pass: snow country
  mountain: { precip: 'snow', showerChance: 0.55, cloudyChance: 0.5, maxIntensity: 1.0, startIntensity: 0.45, snowCover: 1 },
  // Chicago: grey, drizzly
  city:     { precip: 'rain', showerChance: 0.4,  cloudyChance: 0.6, maxIntensity: 0.6, startIntensity: 0,   snowCover: 0 },
  // California coast: marine-layer cloud, rarely rain
  coast:    { precip: 'rain', showerChance: 0.15, cloudyChance: 0.5, maxIntensity: 0.5, startIntensity: 0,   snowCover: 0 },
};

const RAIN_COUNT = 2000;
/** Max points in the train-roof chain the shader checks (Game sends ~85) */
const MAX_SHELTER = 96;
/** The shader's clock wraps at this many seconds (keeps float precision) */
const TIME_WRAP = 600;
const SNOW_COUNT = 1600;
const AREA = 60;          // width of the box of rain/snow around the grinder (m)
const TOP = 28;           // how high drops start (m)
const EASE_TIME = 18;     // seconds for the weather to roll in / clear
const STATE_MIN = 50;     // seconds a weather state lasts (min … max)
const STATE_MAX = 120;

/**
 * The director's choice of what comes next: showers, cloudy, or clear,
 * with the odds and maximum strength set by the climate.
 * @param random - a source of numbers in [0, 1) (Math.random in the game; fixed in tests)
 */
export function nextWeatherState(
  c: Climate, random: () => number,
): { intensity: number; overcast: number; duration: number } {
  const r = random();
  let intensity = 0, overcast: number;
  if (r < c.showerChance) {
    intensity = c.maxIntensity * (0.5 + random() * 0.5);
    overcast = 0.75 + random() * 0.25;
  } else if (r < c.showerChance + (1 - c.showerChance) * c.cloudyChance) {
    overcast = 0.4 + random() * 0.3;
  } else {
    overcast = random() * 0.2;
  }
  return { intensity, overcast, duration: STATE_MIN + random() * (STATE_MAX - STATE_MIN) };
}

/** Soft round dot for snowflakes, drawn once */
function makeFlakeTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.5, 'rgba(255,255,255,0.7)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
}

export class Weather {
  /** Add this to the scene (holds both rain and snow) */
  readonly group = new THREE.Group();

  private rain: THREE.LineSegments;
  private snow: THREE.Points;
  /** Shared by the rain and snow shaders (see patchMaterial) */
  private uniforms = {
    uTime: { value: 0 },
    uCentre: { value: new THREE.Vector2() },
    uShelter: { value: new Float32Array(MAX_SHELTER * 2) },
    uShelterCount: { value: 0 },
    uShelterR2: { value: 0 },
    uShelterTop: { value: 0 },
  };
  private time = 0;

  private climate: Climate = CLIMATES.prairie;
  private stateTimer = 60;
  /** Where the weather is heading (the director sets these) */
  private targetIntensity = 0;
  private targetOvercast = 0;

  /** 0..1 how hard it's raining / snowing right now */
  intensity = 0;
  /** 0..1 cloud cover right now (fed into DayNightCycle.overcast) */
  overcast = 0;
  /** Let the director change the weather on its own */
  auto = true;

  constructor() {
    // Rain: each drop is a short line (2 vertices: top and bottom of the streak)
    const rainSeed = new Float32Array(RAIN_COUNT * 2 * 4);
    const rainEnd = new Float32Array(RAIN_COUNT * 2);
    for (let i = 0; i < RAIN_COUNT; i++) {
      const x = (Math.random() - 0.5) * AREA, z = (Math.random() - 0.5) * AREA;
      const phase = Math.random(), speed = 16 + Math.random() * 10;
      for (let e = 0; e < 2; e++) {
        rainSeed.set([x, z, phase, speed], (i * 2 + e) * 4);
        rainEnd[i * 2 + e] = e;
      }
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(RAIN_COUNT * 2 * 3), 3));
    rainGeo.setAttribute('aSeed', new THREE.BufferAttribute(rainSeed, 4));
    rainGeo.setAttribute('aEnd', new THREE.BufferAttribute(rainEnd, 1));
    const rainMat = new THREE.LineBasicMaterial({
      color: 0xaabbcc, transparent: true, opacity: 0, depthWrite: false,
    });
    this.patchMaterial(rainMat, 'rain');
    this.rain = new THREE.LineSegments(rainGeo, rainMat);
    this.rain.frustumCulled = false;
    this.rain.visible = false;
    this.group.add(this.rain);

    // Snow: soft round points
    const snowSeed = new Float32Array(SNOW_COUNT * 4);
    for (let i = 0; i < SNOW_COUNT; i++) {
      snowSeed.set([(Math.random() - 0.5) * AREA, (Math.random() - 0.5) * AREA,
        Math.random(), Math.random() * Math.PI * 2], i * 4);
    }
    const snowGeo = new THREE.BufferGeometry();
    snowGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SNOW_COUNT * 3), 3));
    snowGeo.setAttribute('aSeed', new THREE.BufferAttribute(snowSeed, 4));
    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff, size: 0.1, map: makeFlakeTexture(), transparent: true,
      opacity: 0, depthWrite: false, sizeAttenuation: true,
    });
    this.patchMaterial(snowMat, 'snow');
    this.snow = new THREE.Points(snowGeo, snowMat);
    this.snow.frustumCulled = false;
    this.snow.visible = false;
    this.group.add(this.snow);
  }

  /**
   * Move each drop / flake on the GPU. Same motion as the old CPU version:
   *   rain - falls at its own speed (16-26 m/s) with a 2,1 m/s wind drift
   *   snow - falls at 1.2-2 m/s, sways side to side, drifts with the wind
   * Both wrap around in a box (AREA wide, TOP high) centred on the grinder,
   * and vanish once they've come down onto a train roof.
   */
  private patchMaterial(mat: THREE.Material, kind: 'rain' | 'snow'): void {
    const u = this.uniforms;
    const top = TOP.toFixed(1);
    mat.customProgramCacheKey = () => 'weather-' + kind;
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, u);
      const motion = kind === 'rain' ? /* glsl */ `
        float H = ${top} + 1.0;                           // falls from TOP to -1
        float y = ${top} - mod(uTime * aSeed.w + aSeed.z * H, H);
        vec2 xz = aSeed.xy + vec2(2.0, 1.0) * uTime;      // wind drift
        float landY = y - aSeed.w * 0.04;                  // bottom of the streak
        vec3 transformed = vec3(0.0, y - aEnd * aSeed.w * 0.04, 0.0);
      ` : /* glsl */ `
        float H = ${top};
        float fall = 1.2 + fract(aSeed.w) * 0.8;
        float y = ${top} - 0.5 - mod(uTime * fall + aSeed.z * H, H);
        vec2 xz = aSeed.xy + vec2(0.8 * uTime - 0.6667 * cos(uTime * 0.9 + aSeed.w),
                                  0.7143 * sin(uTime * 0.7 + aSeed.w * 1.3));
        float landY = y;
        vec3 transformed = vec3(0.0, y, 0.0);
      `;
      shader.vertexShader = /* glsl */ `
        attribute vec4 aSeed;
        ${kind === 'rain' ? 'attribute float aEnd;' : ''}
        uniform float uTime;
        uniform vec2 uCentre;
        uniform vec2 uShelter[${MAX_SHELTER}];
        uniform int uShelterCount;
        uniform float uShelterR2;
        uniform float uShelterTop;
      ` + shader.vertexShader.replace('#include <begin_vertex>', /* glsl */ `
        ${motion}
        // wrap into the box around the grinder
        float A = ${AREA.toFixed(1)};
        xz = uCentre + mod(xz - uCentre + 0.5 * A, A) - 0.5 * A;
        transformed.xz = xz;
        // landed on a train roof? hide it until it comes round again
        if (landY < uShelterTop) {
          for (int i = 0; i < ${MAX_SHELTER}; i++) {
            if (i >= uShelterCount) break;
            vec2 d = xz - uShelter[i];
            if (dot(d, d) < uShelterR2) { transformed.y = -10000.0; break; }
          }
        }
      `);
    };
  }

  get precipitation(): Precipitation { return this.climate.precip; }
  get isRaining(): boolean { return this.climate.precip === 'rain' && this.intensity > 0.05; }
  get isSnowing(): boolean { return this.climate.precip === 'snow' && this.intensity > 0.05; }
  /** Snow lying on the ground for this route (0..1) */
  get snowCover(): number { return this.climate.snowCover; }
  /** 0..1 how "thick" the air is — makes headlight beams more visible */
  get haze(): number { return Math.min(1, this.intensity * 0.8 + this.overcast * 0.3); }

  /** New job: switch to that route's climate and its starting weather */
  setRegion(region: Region): void {
    this.climate = CLIMATES[region];
    this.intensity = this.targetIntensity = this.climate.startIntensity;
    this.overcast = this.targetOvercast = this.climate.startIntensity > 0 ? 0.7 : 0.1;
    this.stateTimer = 40 + Math.random() * 40; // first change comes a bit sooner
  }

  /** Key P: start showers if it's dry, clear up if it's wet */
  toggle(): void {
    if (this.targetIntensity > 0.05) {
      this.targetIntensity = 0;
      this.targetOvercast = 0.15;
    } else {
      this.targetIntensity = this.climate.maxIntensity;
      this.targetOvercast = 0.9;
    }
    this.stateTimer = 90; // hold the player's choice for a while
  }

  /**
   * Tell the weather where it can't fall: a chain of points (x, z pairs)
   * along the middle of the train. Anything within `radius` of a point and
   * below `top` (the roof height) has hit the train and is removed.
   */
  setShelter(points: Float32Array, count: number, radius: number, top: number): void {
    const u = this.uniforms;
    const n = Math.min(count, MAX_SHELTER);
    u.uShelter.value.set(points.subarray(0, n * 2));
    u.uShelterCount.value = n;
    u.uShelterR2.value = radius * radius;
    u.uShelterTop.value = top;
  }

  /** Pick the next weather state for this climate */
  private chooseNextState(): void {
    const next = nextWeatherState(this.climate, Math.random);
    this.targetIntensity = next.intensity;
    this.targetOvercast = next.overcast;
    this.stateTimer = next.duration;
  }


  /** Update weather. centre = grinder world position (rain falls around it). */
  update(dt: number, centre: THREE.Vector3): void {
    this.time += dt;

    // Director: change the weather every so often
    if (this.auto) {
      this.stateTimer -= dt;
      if (this.stateTimer <= 0) this.chooseNextState();
    }
    const k = Math.min(1, dt / EASE_TIME * 3);
    this.intensity += (this.targetIntensity - this.intensity) * k;
    this.overcast += (this.targetOvercast - this.overcast) * k;

    const isSnow = this.climate.precip === 'snow';
    const rainMat = this.rain.material as THREE.LineBasicMaterial;
    const snowMat = this.snow.material as THREE.PointsMaterial;
    rainMat.opacity = isSnow ? 0 : this.intensity * 0.45;
    snowMat.opacity = isSnow ? this.intensity * 0.9 : 0;
    this.rain.visible = !isSnow && this.intensity > 0.01;
    this.snow.visible = isSnow && this.intensity > 0.01;

    // The GPU does the rest (see patchMaterial)
    this.uniforms.uTime.value = this.time % TIME_WRAP;
    this.uniforms.uCentre.value.set(centre.x, centre.z);
  }


}
