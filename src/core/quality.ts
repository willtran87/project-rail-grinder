/**
 * quality.ts - Graphics quality presets (key G cycles, choice is remembered).
 *
 *   HIGH    everything on: bloom, 1024 shadows, ground mist, full dust,
 *           as many frames as the screen shows (144 on a 144 Hz monitor)
 *   MEDIUM  bloom on, softer 512 shadows, no mist, half dust, max 60 fps
 *   LOW     no bloom, no shadows, no mist, light dust, max 60 fps — for slower machines
 *
 * The 60 fps cap matters on high-refresh screens: without it a 144 Hz
 * laptop draws every frame 2.4 times as often, for battery and fan noise.
 *
 * Game.applyQuality() turns these numbers into actual renderer settings.
 * Use the FPS counter (` key) to see the difference.
 */

import { loadJSON, saveJSON } from './storage';

export type QualityLevel = 'low' | 'medium' | 'high';

export interface QualitySettings {
  bloom: boolean;
  shadowMapSize: number; // 0 = shadows off
  mist: boolean;
  dustAmount: number;    // 0..1 multiplier on dust emission
  fpsCap: number;        // 0 = no cap (follow the screen's refresh rate)
}

export const QUALITY_PRESETS: Record<QualityLevel, QualitySettings> = {
  high:   { bloom: true,  shadowMapSize: 1024, mist: true,  dustAmount: 1,    fpsCap: 0 },
  medium: { bloom: true,  shadowMapSize: 512,  mist: false, dustAmount: 0.5,  fpsCap: 60 },
  low:    { bloom: false, shadowMapSize: 0,    mist: false, dustAmount: 0.25, fpsCap: 60 },
};

const ORDER: QualityLevel[] = ['high', 'medium', 'low'];
const KEY = 'quality';

export function loadQuality(): QualityLevel {
  const saved = loadJSON<string>(KEY, 'high');
  return (ORDER as string[]).includes(saved) ? (saved as QualityLevel) : 'high';
}

/** Next level in the cycle (high → medium → low → high), saved for next time */
export function cycleQuality(current: QualityLevel): QualityLevel {
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  saveJSON(KEY, next);
  return next;
}
