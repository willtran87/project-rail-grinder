/**
 * defects.ts - The kinds of rail damage, and how a route's damage is laid out.
 *
 * Each 20 m section has ONE kind of defect, and each kind wants a different
 * technique, so reading the rail is the skill:
 *
 *   General wear   - a few humps across the head          → sweep the angle
 *   Corrugation    - shallow ripples over the crown        → LIGHT pressure (wide stone);
 *                                                             heavy pressure chatters
 *   Head checks    - deep, narrow cracking at the gauge corner → aim precisely, HIGH pressure
 *   Gauge-face wear- metal rolled onto the very edge       → STEEP stone angle
 *   Flattened crown- a broad flat spot on top              → light pressure, centred
 *
 * Pure logic (no Three.js / DOM), so it's unit-tested (defects.test.ts).
 * Layouts come from a seeded random generator: the same seed always gives the
 * same route, which keeps contracts fair and makes daily routes possible.
 */

import type { Region } from '../types/rail';

export type DefectKind = 'wear' | 'corrugation' | 'headCheck' | 'gaugeFace' | 'flatCrown';

/** One hump of excess metal: centre across the head (mm), width (mm), depth (mm before scaling) */
export interface DefectPeak { cx: number; sigma: number; base: number }

export interface DefectKindInfo {
  kind: DefectKind;
  /** Shown on the profile display and track map */
  name: string;
  /** One-line hint for the player */
  tip: string;
  /** Short code for the track map */
  short: string;
}

export const DEFECT_KINDS: Record<DefectKind, DefectKindInfo> = {
  wear:        { kind: 'wear',        name: 'GENERAL WEAR',    short: 'W', tip: 'Sweep the angle across each hump' },
  corrugation: { kind: 'corrugation', name: 'CORRUGATION',     short: 'C', tip: 'Light pressure — heavy pressure chatters' },
  headCheck:   { kind: 'headCheck',   name: 'HEAD CHECKS',     short: 'H', tip: 'Aim at the gauge corner, high pressure' },
  gaugeFace:   { kind: 'gaugeFace',   name: 'GAUGE-FACE WEAR', short: 'G', tip: 'Steep stone angle to reach the edge' },
  flatCrown:   { kind: 'flatCrown',   name: 'FLATTENED CROWN', short: 'F', tip: 'Light pressure, centred on the crown' },
};

/** Above this pressure, grinding corrugation chatters (less metal comes off) */
export const CHATTER_PRESSURE = 65;
/** How much of the cut survives chatter */
export const CHATTER_FACTOR = 0.45;

/** How likely each kind is on each kind of route (they're normalised) */
const REGION_WEIGHTS: Record<Region, Record<DefectKind, number>> = {
  // Long straights: rolling-contact fatigue on the crown
  prairie:  { wear: 35, corrugation: 25, flatCrown: 25, headCheck: 10, gaugeFace: 5 },
  // Sharp curves: the gauge side takes the punishment
  mountain: { wear: 25, corrugation: 10, flatCrown: 5, headCheck: 30, gaugeFace: 30 },
  // Stop-and-go yard traffic: corrugation everywhere
  city:     { wear: 25, corrugation: 40, flatCrown: 15, headCheck: 15, gaugeFace: 5 },
  // A bit of everything
  coast:    { wear: 30, corrugation: 15, flatCrown: 15, headCheck: 20, gaugeFace: 20 },
};

/** Small, fast, seeded random number generator (mulberry32): same seed → same numbers */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Turn a string (a job id, a date) into a seed */
export function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Pick each section's defect kind for a route */
export function chooseSectionKinds(
  count: number, region: Region, random: () => number, easyStart = false,
): DefectKind[] {
  const weights = REGION_WEIGHTS[region];
  const kinds = Object.keys(weights) as DefectKind[];
  const total = kinds.reduce((s, k) => s + weights[k], 0);
  const out: DefectKind[] = [];
  for (let i = 0; i < count; i++) {
    if (easyStart && i < 2) { out.push('wear'); continue; } // onboarding: the forgiving kind
    let r = random() * total;
    let pick: DefectKind = 'wear';
    for (const k of kinds) { r -= weights[k]; if (r <= 0) { pick = k; break; } }
    // Avoid three of the same in a row: variety keeps you reading the rail
    if (out.length >= 2 && out[out.length - 1] === pick && out[out.length - 2] === pick) {
      pick = kinds[(kinds.indexOf(pick) + 1 + Math.floor(random() * (kinds.length - 1))) % kinds.length];
    }
    out.push(pick);
  }
  return out;
}

/** General-wear hump templates (the original defect set) */
const WEAR_TEMPLATES: DefectPeak[] = [
  { cx: -25, sigma: 6, base: 0.18 },
  { cx: -15, sigma: 5, base: 0.12 },
  { cx: 0, sigma: 10, base: 0.08 },
  { cx: 5, sigma: 4, base: 0.10 },
  { cx: 15, sigma: 5, base: 0.10 },
  { cx: 25, sigma: 6, base: 0.14 },
];

/**
 * The humps for one 5 m stretch of one rail. Stretches in a section share
 * the kind but vary a little, like real damage.
 */
export function defectPeaks(kind: DefectKind, random: () => number): DefectPeak[] {
  const jitter = (mm: number) => (random() - 0.5) * 2 * mm;
  switch (kind) {
    case 'wear': {
      const n = 2 + Math.floor(random() * 3);
      const shuffled = [...WEAR_TEMPLATES].sort(() => random() - 0.5);
      return shuffled.slice(0, n).map((p) => ({ ...p, cx: p.cx + jitter(1.5) }));
    }
    case 'corrugation': {
      // Shallow ripples across the crown on a broad low hump
      const peaks: DefectPeak[] = [{ cx: jitter(2), sigma: 13, base: 0.05 }];
      for (let x = -12; x <= 12; x += 6) peaks.push({ cx: x + jitter(1), sigma: 2.2, base: 0.05 + random() * 0.02 });
      return peaks;
    }
    case 'headCheck':
      return [
        { cx: -22 + jitter(1.5), sigma: 3, base: 0.26 + random() * 0.06 },
        { cx: -17 + jitter(1.5), sigma: 2, base: 0.08 },
      ];
    case 'gaugeFace':
      return [{ cx: -29 + jitter(1), sigma: 3.5, base: 0.22 + random() * 0.05 }];
    case 'flatCrown':
      return [{ cx: jitter(3), sigma: 13 + random() * 3, base: 0.12 + random() * 0.03 }];
  }
}
