/**
 * career.ts - Money, upgrades and job unlocks (career mode).
 *
 * The loop: finish a contract → get paid (more stars = more pay) → spend it
 * on grinder upgrades → unlock harder contracts as your star total grows.
 *
 * Everything except loadCareer/saveCareer is a pure function, so the
 * numbers are easy to test (career.test.ts) and rebalance.
 */

import { loadJSON, saveJSON } from '../core/storage';
import { badgeCount } from './loop';

// ---------------------------------------------------------------------------
// Upgrades
// ---------------------------------------------------------------------------

export type UpgradeId = 'cooling' | 'compound' | 'wideStones';

export interface UpgradeDef {
  id: UpgradeId;
  name: string;
  /** What one level does, for the shop */
  effect: string;
  /** Price of each level: costs[0] buys level 1, etc. Length = max level. */
  costs: number[];
}

export const UPGRADES: UpgradeDef[] = [
  { id: 'cooling', name: 'Stone Cooling System', effect: 'Stones heat up 20% slower', costs: [4000, 9000, 16000] },
  { id: 'compound', name: 'Hard-Cut Stone Compound', effect: 'Remove 12% more metal', costs: [5000, 11000, 18000] },
  { id: 'wideStones', name: 'Wide-Face Stones', effect: 'Contact patch 12% wider', costs: [3000, 7000, 12000] },
];

export interface CareerState {
  money: number;
  upgrades: Record<UpgradeId, number>; // current level of each, 0 = not bought
}

export function newCareer(): CareerState {
  return { money: 0, upgrades: { cooling: 0, compound: 0, wideStones: 0 } };
}

/** Cost of the next level, or null if already at max */
export function nextUpgradeCost(state: CareerState, id: UpgradeId): number | null {
  const def = UPGRADES.find(u => u.id === id)!;
  const level = state.upgrades[id];
  return level < def.costs.length ? def.costs[level] : null;
}

/** Try to buy the next level. Returns a NEW state (or the same one if not affordable/maxed). */
export function buyUpgrade(state: CareerState, id: UpgradeId): { state: CareerState; bought: boolean } {
  const cost = nextUpgradeCost(state, id);
  if (cost === null || state.money < cost) return { state, bought: false };
  return {
    state: { money: state.money - cost, upgrades: { ...state.upgrades, [id]: state.upgrades[id] + 1 } },
    bought: true,
  };
}

/** How the upgrades change grinding (multipliers applied in Game.handleGrinding) */
export function upgradeEffects(upgrades: Record<UpgradeId, number>) {
  return {
    heat: 1 - 0.2 * upgrades.cooling,          // ×1.0 → ×0.4 at level 3
    removal: 1 + 0.12 * upgrades.compound,     // ×1.0 → ×1.36
    width: 1 + 0.12 * upgrades.wideStones,     // ×1.0 → ×1.36
  };
}

// ---------------------------------------------------------------------------
// Pay and unlocks
// ---------------------------------------------------------------------------

/** Contract pay: base × a stars multiplier (1★ = 55% … 5★ = 115%) */
export function jobPay(basePay: number, stars: number): number {
  return Math.round(basePay * (0.4 + 0.15 * stars));
}

/** A job is unlocked once your total best stars across all jobs reach its requirement */
export function isUnlocked(starsRequired: number, totalStars: number): boolean {
  return totalStars >= starsRequired;
}

/**
 * Career stars: the sum of best stars across jobs (from progress.ts records),
 * plus one for each mastery badge (night shift / no fast travel / speed run).
 */
export function totalBestStars(records: Record<string, { bestStars: number }>): number {
  return Object.values(records).reduce((sum, r) => sum + r.bestStars, 0) + badgeCount();
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

const KEY = 'career-v1';

export function loadCareer(): CareerState {
  const saved = loadJSON<CareerState | null>(KEY, null);
  if (!saved) return newCareer();
  // Merge with defaults so older saves gain any new upgrade slots
  return { money: saved.money ?? 0, upgrades: { ...newCareer().upgrades, ...saved.upgrades } };
}

export function saveCareer(state: CareerState): void {
  saveJSON(KEY, state);
}

/** "$12,400" */
export function formatMoney(amount: number): string {
  return '$' + amount.toLocaleString('en-US');
}
