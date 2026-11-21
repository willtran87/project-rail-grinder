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
  private rainPos: Float32Array;      // 2 points per drop (top, bottom)
  private rainSpeed: Float32Array;
  private snow: THREE.Points;
  private snowPos: Float32Array;
  private snowSeed: Float32Array;     // per-flake phase for the sway
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

  // Shelter: rain/snow stops at the train roofs (see setShelter)
  private shelterPts = new Float32Array(0);
  private shelterCount = 0;
  private shelterR2 = 0;
  private shelterTop = 0;
  private shelterBox = { minX: 0, maxX: 0, minZ: 0, maxZ: 0 };

  constructor() {
    // Rain: each drop is a short line, so fast drops read as streaks
    this.rainPos = new Float32Array(RAIN_COUNT * 6);
    this.rainSpeed = new Float32Array(RAIN_COUNT);
    for (let i = 0; i < RAIN_COUNT; i++) this.respawnDrop(i, 0, 0, true);
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute('position', new THREE.BufferAttribute(this.rainPos, 3));
    this.rain = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({
      color: 0xaabbcc, transparent: true, opacity: 0, depthWrite: false,
    }));
    this.rain.frustumCulled = false;
    this.rain.visible = false;
    this.group.add(this.rain);

    // Snow: soft round points
    this.snowPos = new Float32Array(SNOW_COUNT * 3);
    this.snowSeed = new Float32Array(SNOW_COUNT);
    for (let i = 0; i < SNOW_COUNT; i++) {
      this.snowPos[i * 3] = (Math.random() - 0.5) * AREA;
      this.snowPos[i * 3 + 1] = Math.random() * TOP;
      this.snowPos[i * 3 + 2] = (Math.random() - 0.5) * AREA;
      this.snowSeed[i] = Math.random() * Math.PI * 2;
    }
    const snowGeo = new THREE.BufferGeometry();
    snowGeo.setAttribute('position', new THREE.BufferAttribute(this.snowPos, 3));
    this.snow = new THREE.Points(snowGeo, new THREE.PointsMaterial({
      color: 0xffffff, size: 0.1, map: makeFlakeTexture(), transparent: true,
      opacity: 0, depthWrite: false, sizeAttenuation: true,
    }));
    this.snow.frustumCulled = false;
    this.snow.visible = false;
    this.group.add(this.snow);
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
    this.shelterPts = points;
    this.shelterCount = count;
    this.shelterR2 = radius * radius;
    this.shelterTop = top;
    const b = this.shelterBox;
    b.minX = b.minZ = Infinity; b.maxX = b.maxZ = -Infinity;
    for (let i = 0; i < count; i++) {
      const x = points[i * 2], z = points[i * 2 + 1];
      if (x < b.minX) b.minX = x; if (x > b.maxX) b.maxX = x;
      if (z < b.minZ) b.minZ = z; if (z > b.maxZ) b.maxZ = z;
    }
    b.minX -= radius; b.maxX += radius; b.minZ -= radius; b.maxZ += radius;
  }

  /** Has a drop/flake at (x, y, z) landed on the train? */
  private sheltered(x: number, y: number, z: number): boolean {
    if (y > this.shelterTop || this.shelterCount === 0) return false;
    const b = this.shelterBox;
    if (x < b.minX || x > b.maxX || z < b.minZ || z > b.maxZ) return false; // quick reject
    const p = this.shelterPts;
    for (let i = 0; i < this.shelterCount; i++) {
      const dx = x - p[i * 2], dz = z - p[i * 2 + 1];
      if (dx * dx + dz * dz < this.shelterR2) return true;
    }
    return false;
  }

  /** Pick the next weather state for this climate */
  private chooseNextState(): void {
    const next = nextWeatherState(this.climate, Math.random);
    this.targetIntensity = next.intensity;
    this.targetOvercast = next.overcast;
    this.stateTimer = next.duration;
  }

  /** Put a raindrop back at the top, somewhere around (cx, cz) */
  private respawnDrop(i: number, cx: number, cz: number, anyHeight = false): void {
    const x = cx + (Math.random() - 0.5) * AREA;
    const z = cz + (Math.random() - 0.5) * AREA;
    const y = anyHeight ? Math.random() * TOP : TOP * (0.5 + Math.random() * 0.5);
    const speed = 16 + Math.random() * 10;
    this.rainSpeed[i] = speed;
    const p = this.rainPos;
    p[i * 6] = x; p[i * 6 + 1] = y; p[i * 6 + 2] = z;
    p[i * 6 + 3] = x; p[i * 6 + 4] = y - speed * 0.04; p[i * 6 + 5] = z; // streak length ∝ speed
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

    if (this.rain.visible) this.updateRain(dt, centre);
    if (this.snow.visible) this.updateSnow(dt, centre);
  }

  private updateRain(dt: number, c: THREE.Vector3): void {
    const p = this.rainPos;
    const windX = 2 * dt, windZ = 1 * dt;
    for (let i = 0; i < RAIN_COUNT; i++) {
      const fall = this.rainSpeed[i] * dt;
      p[i * 6 + 1] -= fall; p[i * 6 + 4] -= fall;
      p[i * 6] += windX; p[i * 6 + 3] += windX;
      p[i * 6 + 2] += windZ; p[i * 6 + 5] += windZ;
      // Hit the ground, or a train roof: start again at the top
      if (p[i * 6 + 4] < -1 || this.sheltered(p[i * 6 + 3], p[i * 6 + 4], p[i * 6 + 5])) {
        this.respawnDrop(i, c.x, c.z);
      }
    }
    (this.rain.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
  }

  private updateSnow(dt: number, c: THREE.Vector3): void {
    const p = this.snowPos;
    const t = this.time;
    const half = AREA / 2;
    for (let i = 0; i < SNOW_COUNT; i++) {
      const s = this.snowSeed[i];
      p[i * 3 + 1] -= (1.2 + (s % 1) * 0.8) * dt;               // slow fall
      p[i * 3] += (Math.sin(t * 0.9 + s) * 0.6 + 0.8) * dt;     // sway + gentle wind
      p[i * 3 + 2] += Math.cos(t * 0.7 + s * 1.3) * 0.5 * dt;
      // Keep flakes in a box around the grinder: wrap round instead of respawning
      // Landed (on the ground or a train roof): wrap back up to the top
      if (p[i * 3 + 1] < -0.5 || this.sheltered(p[i * 3], p[i * 3 + 1], p[i * 3 + 2])) p[i * 3 + 1] += TOP;
      if (p[i * 3] - c.x > half) p[i * 3] -= AREA; else if (c.x - p[i * 3] > half) p[i * 3] += AREA;
      if (p[i * 3 + 2] - c.z > half) p[i * 3 + 2] -= AREA; else if (c.z - p[i * 3 + 2] > half) p[i * 3 + 2] += AREA;
    }
    (this.snow.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
  }
}
