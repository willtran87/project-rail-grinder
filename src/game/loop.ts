/**
 * loop - The long game, round three (pure rules + storage; loop.test.ts):
 *
 *   SEASONAL EVENTS  a themed event each season with its own weekly route,
 *                    a paint scheme you can only earn then, and a museum find
 *   ROUTE MASTERY    each built-in route levels up as you earn stars on it,
 *                    unlocking a Storm variant, a Hard variant and a badge
 *   ROUTE CODES      a random route as a short code a friend can type in
 *   BOUNTIES         an optional mid-job challenge, offered when you're on a roll
 *   MASTERY BADGES   night shift / no fast travel / speed run on each built-in
 *                    route, each worth a career star
 *   WEEKLY LADDER    beat your own best on three set routes each week
 *   CUSTOM PAINT     your own colours, number and crew name
 */

import { loadJSON, saveJSON } from '../core/storage';
import type { Region } from '../types/rail';
import type { ModifierId } from './engage';

// ---------------------------------------------------------------------------
// Seasonal events
// ---------------------------------------------------------------------------

export interface SeasonalEvent {
  id: 'winter' | 'thaw' | 'heat' | 'harvest';
  name: string;
  blurb: string;
  regions: Region[];
  modifiers: ModifierId[];
  pay: number;
  livery: { id: string; name: string; body: string; trim: number };
  find: { id: string; name: string; note: string };
}

export const EVENTS: SeasonalEvent[] = [
  { id: 'winter', name: 'Winter Storm Week', blurb: 'Snow on the high lines and the freights still running.',
    regions: ['mountain', 'forest'], modifiers: ['heavyDamage'], pay: 1.5,
    livery: { id: 'ev-winter', name: 'Snowplow White', body: '#e6ecf2', trim: 0xb02a24 },
    find: { id: 'ev-flare', name: 'Fusee (railroad flare)', note: 'Burned red through a blizzard to stop a train' } },
  { id: 'thaw', name: 'Spring Thaw', blurb: 'Meltwater undermines the track: broken rails everywhere.',
    regions: ['appalachia', 'forest'], modifiers: ['wornStones'], pay: 1.4,
    livery: { id: 'ev-thaw', name: 'Spring Green', body: '#7ab648', trim: 0x4f7a2c },
    find: { id: 'ev-spike', name: 'Golden spike replica', note: 'Handed out at a centennial, lost on the line' } },
  { id: 'heat', name: 'Heat Wave', blurb: 'Sun kinks and dry brush: watch the fires.',
    regions: ['desert', 'prairie'], modifiers: ['traffic'], pay: 1.45,
    livery: { id: 'ev-heat', name: 'Desert Sand', body: '#d8b47a', trim: 0x9a6a34 },
    find: { id: 'ev-canteen', name: 'Section gang canteen', note: 'Dented tin, initials scratched in the lid' } },
  { id: 'harvest', name: 'Harvest Rush', blurb: 'Grain trains every hour: the line must stay open.',
    regions: ['prairie', 'city'], modifiers: ['traffic', 'noFastTravel'], pay: 1.6,
    livery: { id: 'ev-harvest', name: 'Harvest Gold', body: '#d89a1c', trim: 0x8a5a10 },
    find: { id: 'ev-ticket', name: 'Grain elevator ticket, 1938', note: 'Forty bushels, paid in full' } },
];

/** The event on now (one per season) */
export function currentEvent(date = new Date()): SeasonalEvent {
  const m = date.getMonth();
  return EVENTS[m === 11 || m <= 1 ? 0 : m <= 4 ? 1 : m <= 7 ? 2 : 3];
}

const EVENT_KEY = 'event-rewards-v1';
/** Event paint schemes and finds earned so far (ids) */
export function loadEventRewards(): string[] { return loadJSON<string[]>(EVENT_KEY, []); }
/** Grant an event's rewards; returns true the first time */
export function grantEventRewards(ev: SeasonalEvent): boolean {
  const got = loadEventRewards();
  if (got.includes(ev.livery.id)) return false;
  saveJSON(EVENT_KEY, [...got, ev.livery.id, ev.find.id]);
  return true;
}

// ---------------------------------------------------------------------------
// Route mastery
// ---------------------------------------------------------------------------

/** Stars earned on a route (every finish counts, not just the best) to reach each level */
export const MASTERY_LEVELS = [0, 8, 16, 28];
export const MASTERY_UNLOCKS = ['—', 'Storm variant', 'Hard variant (+30% pay)', 'Route master badge'];

const MASTERY_KEY = 'mastery-v1';
export function loadMastery(): Record<string, number> { return loadJSON<Record<string, number>>(MASTERY_KEY, {}); }
export function addMastery(jobId: string, stars: number): { before: number; after: number } {
  const all = loadMastery();
  const before = masteryLevel(all[jobId] ?? 0);
  all[jobId] = (all[jobId] ?? 0) + stars;
  saveJSON(MASTERY_KEY, all);
  return { before, after: masteryLevel(all[jobId]) };
}
/** 1-based level for a route's star total */
export function masteryLevel(stars: number): number {
  let l = 1;
  for (let i = 0; i < MASTERY_LEVELS.length; i++) if (stars >= MASTERY_LEVELS[i]) l = i + 1;
  return l;
}

// ---------------------------------------------------------------------------
// Route codes
// ---------------------------------------------------------------------------

const MOD_ORDER: ModifierId[] = ['fog', 'night', 'traffic', 'wornStones', 'noFastTravel', 'heavyDamage'];

/** A random route (seed + risks) as a short code, e.g. "RG-5K2J9Q-12" */
export function routeCode(seed: number, mods: ModifierId[]): string {
  const bits = mods.reduce((b, m) => b | (1 << MOD_ORDER.indexOf(m)), 0);
  return `RG-${(seed >>> 0).toString(36).toUpperCase()}-${bits.toString(36).toUpperCase()}`;
}
/** Read a route code back (null if it isn't one) */
export function parseRouteCode(code: string): { seed: number; mods: ModifierId[] } | null {
  const m = /^RG-([0-9A-Z]{1,8})-([0-9A-Z]{1,2})$/i.exec(code.trim());
  if (!m) return null;
  const seed = parseInt(m[1], 36);
  const bits = parseInt(m[2], 36);
  if (!Number.isFinite(seed) || seed > 0xffffffff || bits >= 64) return null;
  return { seed, mods: MOD_ORDER.filter((_, i) => bits & (1 << i)) };
}

// ---------------------------------------------------------------------------
// Mid-job bounties
// ---------------------------------------------------------------------------

export interface Bounty { kind: 'threeStars' | 'perfects'; need: number; done: number; reward: number }

/** Offer a bounty when things are going well (a combo of 2+), at most twice a job */
export function offerBounty(combo: number, offered: number, sectionsLeft: number, rand: () => number): Bounty | null {
  if (combo < 2 || offered >= 2 || sectionsLeft < 3) return null;
  return rand() < 0.5
    ? { kind: 'threeStars', need: 3, done: 0, reward: 300 }
    : { kind: 'perfects', need: 2, done: 0, reward: 400 };
}
export function bountyText(b: Bounty): string {
  return b.kind === 'threeStars'
    ? `BOUNTY: next ${b.need} sections all 3★ — ${b.done}/${b.need} (+$${b.reward})`
    : `BOUNTY: ${b.need} perfect passes in a row — ${b.done}/${b.need} (+$${b.reward})`;
}
/** A section finished: 'won', 'lost' or 'going' */
export function bountyStep(b: Bounty, stars: number, perfect: boolean): 'won' | 'lost' | 'going' {
  const ok = b.kind === 'threeStars' ? stars >= 3 : perfect;
  if (!ok) return 'lost';
  b.done++;
  return b.done >= b.need ? 'won' : 'going';
}

// ---------------------------------------------------------------------------
// Mastery badges (each worth a career star)
// ---------------------------------------------------------------------------

export type Badge = 'night' | 'noFast' | 'speed';
export const BADGES: Record<Badge, { name: string; how: string }> = {
  night: { name: 'Night shift', how: 'Finish it at night with 3★ or better' },
  noFast: { name: 'No fast travel', how: 'Finish it without using fast travel, 3★ or better' },
  speed: { name: 'Speed run', how: 'Finish it with a gold time medal' },
};
const BADGE_KEY = 'badges-v1';
export function loadBadges(): Record<string, Badge[]> { return loadJSON<Record<string, Badge[]>>(BADGE_KEY, {}); }
export function badgeCount(): number {
  return Object.values(loadBadges()).reduce((n, b) => n + b.length, 0);
}
/** Award the badges this run earned; returns the new ones */
export function awardBadges(jobId: string, run: { stars: number; night: boolean; usedFastTravel: boolean; gold: boolean }): Badge[] {
  const all = loadBadges();
  const have = all[jobId] ?? [];
  const earned: Badge[] = [];
  if (run.night && run.stars >= 3) earned.push('night');
  if (!run.usedFastTravel && run.stars >= 3) earned.push('noFast');
  if (run.gold) earned.push('speed');
  const fresh = earned.filter((b) => !have.includes(b));
  if (fresh.length) { all[jobId] = [...have, ...fresh]; saveJSON(BADGE_KEY, all); }
  return fresh;
}

// ---------------------------------------------------------------------------
// Weekly ladder
// ---------------------------------------------------------------------------

export const LADDER_RUNG_PAY = 1000;
export const LADDER_TOP_PAY = 3000;
export interface Ladder { week: string; routes: string[]; done: string[] }

/** This week's three ladder routes (from the routes you've unlocked), the same all week */
export function ladderRoutes(week: string, unlocked: string[]): string[] {
  let h = 2166136261;
  for (const c of week) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  const pool = [...unlocked];
  const out: string[] = [];
  while (pool.length && out.length < 3) { out.push(pool.splice(h % pool.length, 1)[0]); h = Math.imul(h, 2654435761) >>> 0; }
  return out;
}
const LADDER_KEY = 'ladder-v1';
export function loadLadder(week: string, unlocked: string[]): Ladder {
  const l = loadJSON<Ladder | null>(LADDER_KEY, null);
  if (l && l.week === week) {
    // Unlocked more routes since it was set: top it up to three
    if (l.routes.length < 3) {
      for (const r of ladderRoutes(week, unlocked)) if (l.routes.length < 3 && !l.routes.includes(r)) l.routes.push(r);
      saveJSON(LADDER_KEY, l);
    }
    return l;
  }
  const fresh = { week, routes: ladderRoutes(week, unlocked), done: [] };
  saveJSON(LADDER_KEY, fresh);
  return fresh;
}
export function saveLadder(l: Ladder): void { saveJSON(LADDER_KEY, l); }

// ---------------------------------------------------------------------------
// Custom paint
// ---------------------------------------------------------------------------

export interface CustomPaint { body: string; trim: string; number: string; crew: string }
const PAINT_KEY = 'custom-paint-v1';
export function loadCustomPaint(): CustomPaint {
  return { body: '#2a6fb0', trim: '#e8c020', number: '42', crew: '', ...loadJSON<Partial<CustomPaint>>(PAINT_KEY, {}) };
}
export function saveCustomPaint(p: CustomPaint): void {
  saveJSON(PAINT_KEY, {
    body: /^#[0-9a-f]{6}$/i.test(p.body) ? p.body : '#2a6fb0',
    trim: /^#[0-9a-f]{6}$/i.test(p.trim) ? p.trim : '#e8c020',
    number: p.number.replace(/[^0-9A-Z]/gi, '').slice(0, 4) || '42',
    crew: p.crew.replace(/[<>&"]/g, '').slice(0, 24),
  });
}
