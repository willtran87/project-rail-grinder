/**
 * settings.ts - Player settings (sound, accessibility, controls), saved in
 * the browser. The settings menu (ui/SettingsMenu.ts) edits them; systems
 * read them via getSettings() and react to changes with onSettingsChange().
 *
 * Graphics quality and the colour-blind palette keep their own storage
 * (core/quality.ts, ui/palette.ts); the menu shows those too.
 */

import { loadJSON, saveJSON } from './storage';

export interface Settings {
  /** 0..1 overall volume */
  masterVolume: number;
  /** 0..1 grinding, engine, alarms, fanfares */
  effectsVolume: number;
  /** 0..1 birds, wind, rain, crossing bells */
  ambienceVolume: number;
  /** 0..1 the adaptive music */
  musicVolume: number;
  /** Less camera shake / punch-in, no hit-stop freeze */
  reducedMotion: boolean;
  /** Camera shake at all (off = none, whatever the other settings) */
  screenShake: boolean;
  /** Text captions for the sounds that matter (alarms, horn, thunder…) */
  captions: boolean;
  /** No full-screen flashes (over-grind vignette, completion glints) */
  reducedFlashing: boolean;
  /** Size of the HUD text and panels: 1, 1.25 or 1.5 */
  uiScale: number;
  /** 'hold': grind while Space / (A) is held. 'toggle': press once to start, again to stop */
  grindMode: 'hold' | 'toggle';
  /** Game speed for a gentler pace: 1, 0.85 or 0.7 */
  gameSpeed: number;
  /** Controller vibration */
  rumble: boolean;
  /** Show contextual control hints */
  hints: boolean;
  /** Profile displays: simple (big aim marker, fewer lines) or detailed */
  simpleProfile: boolean;
  /** Rebound keys: action → physical key (see core/keymap.ts) */
  keymap: Record<string, string>;
}

export const DEFAULT_SETTINGS: Settings = {
  masterVolume: 0.8,
  effectsVolume: 1,
  ambienceVolume: 1,
  musicVolume: 0.6,
  reducedMotion: false,
  screenShake: true,
  captions: false,
  reducedFlashing: false,
  uiScale: 1,
  grindMode: 'hold',
  gameSpeed: 1,
  rumble: true,
  hints: true,
  simpleProfile: false,
  keymap: {},
};

const KEY = 'settings-v1';
let current: Settings = { ...DEFAULT_SETTINGS, ...loadJSON<Partial<Settings>>(KEY, {}) };
const listeners: Array<(s: Settings) => void> = [];

export function getSettings(): Readonly<Settings> {
  return current;
}

/** Change some settings, save them, and tell everyone who listens */
export function updateSettings(patch: Partial<Settings>): void {
  current = { ...current, ...patch };
  saveJSON(KEY, current);
  for (const l of listeners) l(current);
}

/** Call `fn` now and whenever settings change */
export function onSettingsChange(fn: (s: Settings) => void): void {
  listeners.push(fn);
  fn(current);
}
