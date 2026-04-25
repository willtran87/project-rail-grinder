/**
 * DayNightCycle - Beautiful time-of-day lighting with rich color palettes.
 *
 * Key principles from pixel art games:
 * - Shadows are NEVER gray — they shift to complementary hues
 * - Fog matches the sky color to create atmospheric cohesion
 * - Each time of day has a distinct emotional color palette
 *
 * Inspired by: Firewatch, A Short Hike, Journey, Proteus
 */

import * as THREE from 'three';

interface TimePreset {
  name: string;
  skyColor: THREE.Color;
  fogColor: THREE.Color;
  fogNear: number;
  fogFar: number;
  sunColor: THREE.Color;
  sunIntensity: number;
  sunPosition: THREE.Vector3;
  ambientSkyColor: THREE.Color;   // light from above
  ambientGroundColor: THREE.Color; // bounce light from ground (colored shadows)
  ambientIntensity: number;
  exposure: number;
  groundColor: THREE.Color;       // tint for ground plane
  foliageColor: THREE.Color;      // tint for trees
}

const PRESETS: Record<string, TimePreset> = {
  dawn: {
    name: 'DAWN',
    skyColor: new THREE.Color(0x4a6e8a),
    fogColor: new THREE.Color(0xd8c8a0),  // golden haze
    fogNear: 40,
    fogFar: 200,
    sunColor: new THREE.Color(0xffaa66),
    sunIntensity: 0.9,
    sunPosition: new THREE.Vector3(-30, 6, 20),
    ambientSkyColor: new THREE.Color(0x8cb4c8),
    ambientGroundColor: new THREE.Color(0x6b5530), // warm amber bounce
    ambientIntensity: 0.6,
    exposure: 1.1,
    groundColor: new THREE.Color(0xc8a050), // golden ochre
    foliageColor: new THREE.Color(0x88a848),
  },
  day: {
    name: 'DAY',
    skyColor: new THREE.Color(0x58b8e8),
    fogColor: new THREE.Color(0xa8ddf0),  // hazy blue
    fogNear: 80,
    fogFar: 350,
    sunColor: new THREE.Color(0xfff8f0),
    sunIntensity: 1.4,
    sunPosition: new THREE.Vector3(15, 30, 10),
    ambientSkyColor: new THREE.Color(0x88aadd),
    ambientGroundColor: new THREE.Color(0x667755), // green bounce from grass
    ambientIntensity: 0.7,
    exposure: 1.2,
    groundColor: new THREE.Color(0x4a7a3a), // vivid green
    foliageColor: new THREE.Color(0x48a838),
  },
  dusk: {
    name: 'DUSK',
    skyColor: new THREE.Color(0x870734),
    fogColor: new THREE.Color(0xe8a060),  // warm amber fog
    fogNear: 30,
    fogFar: 180,
    sunColor: new THREE.Color(0xef6a3a),
    sunIntensity: 0.8,
    sunPosition: new THREE.Vector3(40, 5, -15),
    ambientSkyColor: new THREE.Color(0x684971), // dusty purple
    ambientGroundColor: new THREE.Color(0x4a2c17), // deep umber
    ambientIntensity: 0.5,
    exposure: 1.0,
    groundColor: new THREE.Color(0x8b5e3c), // warm brown
    foliageColor: new THREE.Color(0x6b8c42),
  },
  night: {
    name: 'NIGHT',
    skyColor: new THREE.Color(0x0d0d3f),
    fogColor: new THREE.Color(0x0a0a1e),  // deep blue-black
    fogNear: 20,
    fogFar: 120,
    sunColor: new THREE.Color(0x6688cc),  // moonlight
    sunIntensity: 0.3,
    sunPosition: new THREE.Vector3(-15, 20, 10),
    ambientSkyColor: new THREE.Color(0x1a2240), // deep indigo
    ambientGroundColor: new THREE.Color(0x0a1015), // near-black teal
    ambientIntensity: 0.25,
    exposure: 0.9,
    groundColor: new THREE.Color(0x1e3a2a), // dark teal-green
    foliageColor: new THREE.Color(0x3a6b5c),
  },
};

const TIME_ORDER = ['dawn', 'day', 'dusk', 'night'];

export class DayNightCycle {
  private scene: THREE.Scene;
  private sun: THREE.DirectionalLight;
  private ambient: THREE.HemisphereLight;
  private renderer: THREE.WebGLRenderer;
  private groundMesh: THREE.Mesh | null = null;

  private currentIndex: number = 1; // start at day
  private targetPreset: TimePreset;
  private currentPreset: TimePreset;
  private transitionProgress: number = 1;

  currentName: string = 'DAY';

  constructor(
    scene: THREE.Scene,
    sun: THREE.DirectionalLight,
    ambient: THREE.HemisphereLight,
    renderer: THREE.WebGLRenderer
  ) {
    this.scene = scene;
    this.sun = sun;
    this.ambient = ambient;
    this.renderer = renderer;
    this.targetPreset = PRESETS[TIME_ORDER[this.currentIndex]];
    this.currentPreset = { ...this.targetPreset };
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

  update(dt: number): void {
    if (this.transitionProgress >= 1) return;

    this.transitionProgress = Math.min(1, this.transitionProgress + dt * 0.4);
    const t = this.smoothstep(this.transitionProgress);
    const p = this.targetPreset;

    // Lerp all values
    (this.scene.background as THREE.Color).lerp(p.skyColor, t);
    const fog = this.scene.fog as THREE.Fog;
    fog.color.lerp(p.fogColor, t);
    fog.near += (p.fogNear - fog.near) * t;
    fog.far += (p.fogFar - fog.far) * t;

    this.sun.color.lerp(p.sunColor, t);
    this.sun.intensity += (p.sunIntensity - this.sun.intensity) * t;
    this.sun.position.lerp(p.sunPosition, t);

    this.ambient.color.lerp(p.ambientSkyColor, t);
    this.ambient.groundColor.lerp(p.ambientGroundColor, t);
    this.ambient.intensity += (p.ambientIntensity - this.ambient.intensity) * t;

    // Exposure
    this.renderer.toneMappingExposure +=
      (p.exposure - this.renderer.toneMappingExposure) * t;

    // Ground tint
    if (this.groundMesh) {
      const mat = this.groundMesh.material as THREE.MeshStandardMaterial;
      mat.color.lerp(p.groundColor, t);
    }
  }

  private applyPreset(p: TimePreset): void {
    (this.scene.background as THREE.Color).copy(p.skyColor);
    const fog = this.scene.fog as THREE.Fog;
    fog.color.copy(p.fogColor);
    fog.near = p.fogNear;
    fog.far = p.fogFar;
    this.sun.color.copy(p.sunColor);
    this.sun.intensity = p.sunIntensity;
    this.sun.position.copy(p.sunPosition);
    this.ambient.color.copy(p.ambientSkyColor);
    this.ambient.groundColor.copy(p.ambientGroundColor);
    this.ambient.intensity = p.ambientIntensity;
    this.renderer.toneMappingExposure = p.exposure;
  }

  private smoothstep(t: number): number {
    return t * t * (3 - 2 * t);
  }
}
