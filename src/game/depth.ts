/**
 * depth - Rules that add depth to the grind (pure logic, unit-tested):
 *
 *   TRACK CLASS   each route has a target profile of its own: heavy-haul
 *                 (gauge-corner relief), transit (flatter crown), high-speed
 *                 (field-side relief) or the plain AREMA standard.
 *   CURVES        on a curve the outer ("high") rail wears on the gauge face,
 *                 the inner ("low") rail on the crown.
 *   STONE GRADE   coarse / standard / fine, chosen before a job.
 *   GRIND PLAN    commit to a number of passes before the job; hit it for a bonus.
 *   WEATHER       wet rail glazes stones (cut less), cold steel is brittle
 *                 (less room before over-grinding).
 *   REGROWTH      traffic keeps wearing sections you haven't touched yet.
 *   EMERGENCIES   dispatch calls in an urgent section mid-job.
 *   LONG HAUL     a three-shift contract; each shift's result sets the next
 *                 shift's damage, with a bonus for finishing all three.
 */

import type { DefectPeak } from './defects';
import type { ProfilePoint, Region } from '../types/rail';

// ---------------------------------------------------------------------------
// Track class → target profile
// ---------------------------------------------------------------------------

export type TrackClass = 'standard' | 'heavy' | 'transit' | 'highspeed';

export const TRACK_CLASSES: Record<TrackClass, { name: string; tip: string; relief: DefectPeak[] }> = {
  standard: { name: 'AREMA 136RE', tip: 'Standard profile', relief: [] },
  heavy: {
    name: 'Heavy-haul (gauge relief)', tip: 'Take a little extra off the gauge corner',
    relief: [{ cx: -24, sigma: 4, base: 0.07 }],
  },
  transit: {
    name: 'Transit (flat crown)', tip: 'A flatter crown: grind the top a little lower',
    relief: [{ cx: 0, sigma: 7, base: 0.05 }],
  },
  highspeed: {
    name: 'High-speed (field relief)', tip: 'Ease the field side for a stable ride',
    relief: [{ cx: 22, sigma: 4, base: 0.06 }],
  },
};

/** Which profile a route uses */
export function trackClassFor(region: Region, seed = 0): TrackClass {
  if (region === 'mountain') return 'heavy';
  if (region === 'city') return 'transit';
  if (region === 'coast') return seed % 2 === 0 ? 'highspeed' : 'standard';
  return 'standard';
}

/** The target profile for a track class (removing metal raises y, so relief adds to y) */
export function applyTemplate(base: ProfilePoint[], cls: TrackClass): ProfilePoint[] {
  const relief = TRACK_CLASSES[cls].relief;
  return base.map((p) => {
    let y = p.y;
    for (const r of relief) y += r.base * Math.exp(-((p.x - r.cx) ** 2) / (2 * r.sigma * r.sigma));
    return { ...p, y };
  });
}

// ---------------------------------------------------------------------------
// Curves: high rail / low rail
// ---------------------------------------------------------------------------

/**
 * Extra wear on a curve.
 * @param turn - heading change across the section in radians (+ = turning left)
 * @param rail - which rail
 */
export function curvePeaks(turn: number, rail: 'left' | 'right'): DefectPeak[] {
  const k = Math.min(1, Math.abs(turn) / 0.25);
  if (k < 0.12) return [];
  const outer = turn > 0 ? 'right' : 'left'; // turning left: the right rail is on the outside
  return rail === outer
    ? [{ cx: -28, sigma: 3, base: 0.16 * k }]  // high rail: gauge face
    : [{ cx: 4, sigma: 9, base: 0.09 * k }];   // low rail: crushed crown
}

// ---------------------------------------------------------------------------
// Stone grade
// ---------------------------------------------------------------------------

export type StoneGrade = 'coarse' | 'standard' | 'fine';

export const STONE_GRADES: Record<StoneGrade, { name: string; desc: string; removal: number; heat: number; bonus: number }> = {
  coarse: { name: 'Coarse', desc: 'Cuts 35% faster, runs hotter, rougher finish (−15% section bonus)', removal: 1.35, heat: 1.2, bonus: 0.85 },
  standard: { name: 'Standard', desc: 'Balanced', removal: 1, heat: 1, bonus: 1 },
  fine: { name: 'Fine', desc: 'Cuts 20% slower, runs cooler, fine finish (+25% section bonus)', removal: 0.8, heat: 0.85, bonus: 1.25 },
};

// ---------------------------------------------------------------------------
// Grind plan
// ---------------------------------------------------------------------------

/**
 * Bonus for sticking to the plan. Nothing if you took more passes than you
 * planned; tighter plans (fewer passes than the estimate) pay more.
 */
export function planBonus(planned: number, actual: number, estimate: number, sections: number): number {
  if (planned <= 0 || actual > planned) return 0;
  const tightness = Math.max(0.5, Math.min(1.6, estimate / planned));
  return Math.round(40 * sections * tightness);
}

// ---------------------------------------------------------------------------
// Weather
// ---------------------------------------------------------------------------

/** Wet rail glazes the stones; cold, snowy steel is brittle */
export function weatherModifiers(wet: number, snow: boolean): { removal: number; tolerance: number; label: string } {
  const removal = 1 - 0.12 * Math.max(0, Math.min(1, wet));
  const tolerance = snow ? 0.75 : 1;
  const label = snow ? 'COLD RAIL: brittle, less room before over-grinding'
    : wet > 0.3 ? 'WET RAIL: stones glaze, cutting slower' : '';
  return { removal, tolerance, label };
}

// ---------------------------------------------------------------------------
// Regrowth
// ---------------------------------------------------------------------------

/** Seconds between wear "ticks" on untouched sections */
export const REGROWTH_INTERVAL = 50;
/** Size of each tick, as a fraction of a light defect */
export const REGROWTH_AMOUNT = 0.18;

// ---------------------------------------------------------------------------
// Emergency calls
// ---------------------------------------------------------------------------

/** Seconds you get to clear an emergency section */
export const EMERGENCY_SECONDS = 100;
export const EMERGENCY_PAY = 600;

/**
 * Pick an unfinished section for an emergency: not the one you're on, and
 * within reach (prefers ones 2–6 sections away).
 */
export function pickEmergencySection(completed: boolean[], current: number, random: () => number): number {
  const open = completed.map((d, i) => (!d && i !== current ? i : -1)).filter((i) => i >= 0);
  if (open.length === 0) return -1;
  const near = open.filter((i) => Math.abs(i - current) >= 2 && Math.abs(i - current) <= 6);
  const pool = near.length ? near : open;
  return pool[Math.floor(random() * pool.length)];
}

// ---------------------------------------------------------------------------
// Long haul (three shifts)
// ---------------------------------------------------------------------------

export interface LongHaul { seed: number; shift: number; stars: number[] }
export const LONG_HAUL_SHIFTS = 3;

/** Damage multiplier for the next shift: a poor shift leaves more for the next crew */
export function longHaulSeverity(prevStars: number[]): number {
  if (prevStars.length === 0) return 1;
  const last = prevStars[prevStars.length - 1];
  return Math.max(0.8, Math.min(1.35, 1 + (3 - last) * 0.1));
}

/** Bonus for finishing all three shifts, scaled by average stars */
export function longHaulBonus(stars: number[]): number {
  if (stars.length < LONG_HAUL_SHIFTS) return 0;
  const avg = stars.reduce((a, b) => a + b, 0) / stars.length;
  return Math.round(2000 * avg);
}
