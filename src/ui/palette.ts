/**
 * palette.ts - Status colours used by the track map and rail profile displays.
 *
 * The default palette leans on red vs green, which ~1 in 12 men can't tell
 * apart. The colour-blind palette uses the Okabe-Ito set — blue / orange /
 * vermillion / purple — chosen to stay distinct for the common types of
 * colour blindness. Press C in-game to toggle; the choice is remembered.
 */

import { loadJSON, saveJSON } from '../core/storage';

export interface Palette {
  /** Profile line within tolerance / target line */
  good: string;
  target: string;
  /** Close to tolerance (needs a little more) */
  close: string;
  /** Needs grinding */
  bad: string;
  /** Over-ground (too much removed) */
  over: string;

  /** Track map: completed section */
  mapDone: string;
  /** Track map: being worked on — good / mid / poor accuracy */
  mapWorkGood: string;
  mapWorkMid: string;
  mapWorkPoor: string;
  /** Track map: not started — severe / moderate / light / none */
  mapSevere: string;
  mapModerate: string;
  mapLight: string;
  mapNone: string;
}

const DEFAULT_PALETTE: Palette = {
  good: '#44ff44',
  target: '#44ff44',
  close: '#ffaa00',
  bad: '#ff4444',
  over: '#ff0066',

  mapDone: '#22aa44',
  mapWorkGood: '#88cc44',
  mapWorkMid: '#ccaa22',
  mapWorkPoor: '#cc6622',
  mapSevere: '#cc2222',
  mapModerate: '#cc6622',
  mapLight: '#ccaa22',
  mapNone: '#446644',
};

// Okabe-Ito: sky blue #56B4E9, blue #0072B2, yellow #F0E442,
// orange #E69F00, vermillion #D55E00, reddish purple #CC79A7
const COLORBLIND_PALETTE: Palette = {
  good: '#56B4E9',
  target: '#56B4E9',
  close: '#F0E442',
  bad: '#D55E00',
  over: '#CC79A7',

  mapDone: '#0072B2',
  mapWorkGood: '#56B4E9',
  mapWorkMid: '#F0E442',
  mapWorkPoor: '#E69F00',
  mapSevere: '#D55E00',
  mapModerate: '#E69F00',
  mapLight: '#F0E442',
  mapNone: '#4a5a66',
};

const SETTING_KEY = 'colorblind';
let colorblind = loadJSON<boolean>(SETTING_KEY, false);

/** The palette currently in use */
export function getPalette(): Palette {
  return colorblind ? COLORBLIND_PALETTE : DEFAULT_PALETTE;
}

export function isColorblindMode(): boolean {
  return colorblind;
}

/** Switch palettes and remember the choice. Returns the new state. */
export function toggleColorblindMode(): boolean {
  colorblind = !colorblind;
  saveJSON(SETTING_KEY, colorblind);
  return colorblind;
}
