/**
 * rules.ts - The game's tuning numbers and scoring formulas, in one place.
 *
 * Everything here is a plain function with no Three.js or DOM dependencies,
 * so it's easy to unit-test (see rules.test.ts) and easy to rebalance:
 * change a number here and the whole game follows.
 */

// ---------------------------------------------------------------------------
// Completion
// ---------------------------------------------------------------------------

/** A section is complete when every stretch of both rails is at least this accurate */
export const COMPLETION_ACCURACY = 0.8;

// ---------------------------------------------------------------------------
// Grinding physics
// ---------------------------------------------------------------------------

/** Forward speed while the stones are down (m/s) — the player only aims */
export const GRIND_SPEED = 2.0;

/** Heat lost per second while the stones are lifted */
export const COOL_RATE = 8;

/** Lateral contact position (mm) for a stone angle (degrees) */
export function stoneGrindX(angleDeg: number): number {
  return angleDeg * 0.7;
}

/** Contact width (mm): more pressure squashes the contact patch narrower */
export function stoneContactWidth(pressure: number): number {
  return 10 + (100 - pressure) * 0.08;
}

/**
 * Net heat change per second while grinding, from the average stone pressure.
 * ~0/s at 25% pressure, ~3/s at 50% (overheats in ~25s), ~9/s at 100% (~9s).
 */
export function heatRatePerSec(avgPressure: number): number {
  return avgPressure * 0.12 - 3;
}

/** Overheated stones cut less: full effect below 60 heat, 80% to 80, 50% above */
export function heatPenalty(heat: number): number {
  return heat > 80 ? 0.5 : heat > 60 ? 0.8 : 1.0;
}

/** Metal removed per second at the stone centre (mm): ~0.03 at 50%, ~0.05 at 100% */
export function removalRatePerSec(pressure: number): number {
  return 0.012 + pressure * 0.0004;
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

/**
 * Stars (1-3) for finishing one section. Efficiency rewards accuracy and
 * penalises extra passes and over-grind damage.
 */
export function sectionStars(accuracy: number, passes: number, damage: number): number {
  const efficiency = accuracy / (1 + Math.max(1, passes) * 0.12 + damage * 0.05);
  return efficiency > 0.8 ? 3 : efficiency > 0.6 ? 2 : 1;
}

/**
 * Final job stars (1-5) from the post-grind RQI, minus one per delayed
 * revenue train. Never below 1.
 */
export function jobStars(rqiAfter: number, missedWindows: number): number {
  const base = rqiAfter >= 95 ? 5 : rqiAfter >= 85 ? 4 : rqiAfter >= 75 ? 3 : rqiAfter >= 60 ? 2 : 1;
  return Math.max(1, base - missedWindows);
}

/**
 * How far a section is toward passing, 0..1, for the progress fill.
 * Based on the section's average accuracy now vs at job start. Capped at
 * 0.95 until the section is actually complete, so "full" always means done.
 */
export function sectionProgress(startMean: number, nowMean: number, completed: boolean): number {
  if (completed) return 1;
  if (startMean >= COMPLETION_ACCURACY) return nowMean >= COMPLETION_ACCURACY ? 0.95 : 0;
  return Math.max(0, Math.min(0.95, (nowMean - startMean) / (COMPLETION_ACCURACY - startMean)));
}

/**
 * Fastest speed allowed `distanceAhead` metres before a lower speed limit,
 * such that braking at `brake` m/s² still gets down to `limit` in time
 * (v² = limit² + 2·brake·distance). Used for slow orders.
 */
export function approachSpeedLimit(limit: number, brake: number, distanceAhead: number): number {
  return Math.sqrt(limit * limit + 2 * brake * Math.max(0, distanceAhead));
}
