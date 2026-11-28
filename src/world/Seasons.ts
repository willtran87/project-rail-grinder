/**
 * Seasons - The time of year changes the scenery's colours.
 *
 *   spring  fresh light greens
 *   summer  the default look
 *   autumn  orange, red and gold trees; straw-coloured grass
 *   winter  (no snow) brown grass, bare grey-brown trees
 *
 * Built-in contracts follow the real calendar; random routes roll their own.
 * Snowy routes are always winter-white (see Environment.applySnow).
 *
 * Also: cloud shadows, a shader tweak that lets soft cloud shadows drift
 * across the ground on part-cloudy days (applyCloudShadows).
 */

import * as THREE from 'three';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/** Northern-hemisphere season for a month (0 = January) */
export function seasonForMonth(month: number): Season {
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

export interface SeasonLook {
  /** Colours deciduous canopies are picked from (per tree) */
  canopy: number[];
  /** Tint for grass, bushes, hills and the ground (multiplied in) */
  grass: number;
  /** How strongly to apply the grass tint, 0..1 */
  grassAmount: number;
  /** Canopy size (winter trees are bare, so smaller) */
  canopyScale: number;
}

export const SEASON_LOOK: Record<Season, SeasonLook> = {
  spring: { canopy: [0x5aa83a, 0x6cbc46, 0x8fcf5a, 0xe7b8d0], grass: 0x7ec850, grassAmount: 0.35, canopyScale: 1 },
  summer: { canopy: [0x3a7a2a], grass: 0x4a7a35, grassAmount: 0, canopyScale: 1 },
  autumn: { canopy: [0xd2691e, 0xe8a030, 0xb8401c, 0xc8a028, 0x8a6a2a], grass: 0xa89858, grassAmount: 0.55, canopyScale: 1 },
  winter: { canopy: [0x6a5a4a, 0x5a5048, 0x786858], grass: 0x8a7e5c, grassAmount: 0.5, canopyScale: 0.75 },
};

/**
 * Soft cloud shadows drifting over a (Lambert or Standard) material.
 * Returns the uniforms: move uCloudOffset with the wind, and set
 * uCloudAmount (0 = none, ~0.35 = part cloudy).
 */
export function applyCloudShadows(material: THREE.Material): { uCloudOffset: { value: THREE.Vector2 }; uCloudAmount: { value: number } } {
  const uniforms = { uCloudOffset: { value: new THREE.Vector2() }, uCloudAmount: { value: 0 } };
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vCloudXZ;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvCloudXZ = (modelMatrix * vec4(transformed, 1.0)).xz;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec2 vCloudXZ;
        uniform vec2 uCloudOffset;
        uniform float uCloudAmount;
        float cloudHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float cloudNoise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(cloudHash(i), cloudHash(i + vec2(1, 0)), f.x),
                     mix(cloudHash(i + vec2(0, 1)), cloudHash(i + vec2(1, 1)), f.x), f.y);
        }`)
      .replace('#include <map_fragment>', `#include <map_fragment>
        if (uCloudAmount > 0.001) {
          vec2 cp = (vCloudXZ + uCloudOffset) * 0.012;
          float n = cloudNoise(cp) * 0.65 + cloudNoise(cp * 2.3) * 0.35;
          diffuseColor.rgb *= 1.0 - uCloudAmount * smoothstep(0.5, 0.68, n);
        }`);
  };
  material.customProgramCacheKey = () => 'cloud-shadows';
  material.needsUpdate = true;
  return uniforms;
}
