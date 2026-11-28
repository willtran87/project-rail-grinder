/**
 * engage - Long-term goals and reasons to come back (pure logic + storage):
 *
 *   WEEKLY      one challenge route per week with a twist (a modifier)
 *   MODIFIERS   opt-in risks on random routes: fog, night, heavy traffic…
 *               each multiplies the pay
 *   RANKS       Trainee → Chief Engineer by career stars, each with a perk
 *   DEPOT       crew to hire (perks) and a second grinding machine
 *   MUSEUM      collectibles hidden along the routes
 *   PHOTOS      photo challenges ("lightning over the grinder")
 *   LOGIN       a seven-day reward ladder
 *   SAVERS      streak savers: one mistake doesn't wipe a long combo
 *   NEXT GOAL   the closest thing to unlock, always shown
 *   SESSION     what you did since opening the game
 */

import { loadJSON, saveJSON } from '../core/storage';

// ---------------------------------------------------------------------------
// Modifiers (random routes, weekly challenge)
// ---------------------------------------------------------------------------

export type ModifierId = 'fog' | 'night' | 'traffic' | 'wornStones' | 'noFastTravel' | 'heavyDamage';

export const MODIFIERS: Record<ModifierId, { name: string; desc: string; pay: number }> = {
  fog: { name: 'Fog', desc: 'Thick fog all job', pay: 1.3 },
  night: { name: 'Night shift', desc: 'Starts at night', pay: 1.25 },
  traffic: { name: 'Heavy traffic', desc: 'Revenue trains come 40% sooner', pay: 1.5 },
  wornStones: { name: 'Worn stones', desc: 'Start with stones at 40%', pay: 1.3 },
  noFastTravel: { name: 'No fast travel', desc: 'SHIFT does nothing', pay: 1.2 },
  heavyDamage: { name: 'Heavy damage', desc: '30% more damage', pay: 1.4 },
};

/** Pay multiplier for a set of modifiers (they stack) */
export function modifierPay(ids: ModifierId[]): number {
  return Math.round(ids.reduce((m, id) => m * MODIFIERS[id].pay, 1) * 100) / 100;
}

// ---------------------------------------------------------------------------
// Weekly challenge
// ---------------------------------------------------------------------------

/** ISO-ish week key, e.g. "2026-W48" */
export function weekKey(d = new Date()): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** This week's challenge: a seed and two modifiers, the same for everyone */
export function weeklyChallenge(week = weekKey()): { seed: number; modifiers: ModifierId[]; week: string } {
  let h = 2166136261;
  for (const c of week) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  const ids = Object.keys(MODIFIERS) as ModifierId[];
  const a = ids[h % ids.length];
  const b = ids[(h >>> 8) % ids.length];
  return { seed: h, modifiers: a === b ? [a] : [a, b], week };
}

// ---------------------------------------------------------------------------
// Ranks
// ---------------------------------------------------------------------------

export interface Rank { name: string; stars: number; perk: string }
export const RANKS: Rank[] = [
  { name: 'Trainee', stars: 0, perk: '—' },
  { name: 'Operator', stars: 8, perk: '+5% contract pay' },
  { name: 'Foreman', stars: 18, perk: 'Stone changes 40% faster' },
  { name: 'Superintendent', stars: 32, perk: 'Train holds cost half' },
  { name: 'Chief Engineer', stars: 50, perk: '+10% contract pay (total)' },
];

export function rankFor(stars: number): { rank: Rank; index: number; next: Rank | null } {
  let index = 0;
  for (let i = 0; i < RANKS.length; i++) if (stars >= RANKS[i].stars) index = i;
  return { rank: RANKS[index], index, next: RANKS[index + 1] ?? null };
}

/** Perks of a rank (and every rank below it) */
export function rankPerks(index: number): { pay: number; stoneChange: number; holdCost: number } {
  return {
    pay: index >= 4 ? 1.1 : index >= 1 ? 1.05 : 1,
    stoneChange: index >= 2 ? 0.6 : 1,
    holdCost: index >= 3 ? 0.5 : 1,
  };
}

// ---------------------------------------------------------------------------
// Depot: crew and machines
// ---------------------------------------------------------------------------

export type CrewId = 'firewatch' | 'welder' | 'mechanic' | 'spotter';
export const CREW: Record<CrewId, { name: string; role: string; perk: string; cost: number }> = {
  firewatch: { name: 'Dee Alvarez', role: 'Fire watch', perk: 'Fires spread half as fast and go out faster', cost: 8000 },
  welder: { name: 'Sam Okafor', role: 'Welder', perk: 'Broken rails welded in half the time', cost: 9000 },
  mechanic: { name: 'Ray Kowalski', role: 'Mechanic', perk: 'Stones wear 30% slower', cost: 12000 },
  spotter: { name: 'June Park', role: 'Spotter', perk: 'Emergency calls give you 40 s more', cost: 7000 },
};

export type MachineId = 'g17' | 'g22';
export const MACHINES: Record<MachineId, { name: string; desc: string; cost: number; driveSpeed: number; heat: number }> = {
  g17: { name: 'Grinder 42', desc: 'The trusty standard consist', cost: 0, driveSpeed: 1, heat: 1 },
  g22: { name: 'Grinder 22 "Rapid"', desc: '30% faster between sections, stones run 10% hotter', cost: 60000, driveSpeed: 1.3, heat: 1.1 },
};

export interface Depot { crew: CrewId[]; machines: MachineId[]; active: MachineId }
const DEPOT_KEY = 'depot-v1';
export function loadDepot(): Depot {
  return { crew: [], machines: ['g17'], active: 'g17', ...loadJSON<Partial<Depot>>(DEPOT_KEY, {}) };
}
export function saveDepot(d: Depot): void { saveJSON(DEPOT_KEY, d); }
export function hasCrew(id: CrewId): boolean { return loadDepot().crew.includes(id); }

// ---------------------------------------------------------------------------
// Museum: collectibles
// ---------------------------------------------------------------------------

export const COLLECTIBLES = [
  { id: 'spike', name: 'Hand-forged spike', note: 'Driven by a section gang around 1890' },
  { id: 'datenail', name: 'Date nail "27"', note: 'Hammered into ties to record the year they went in' },
  { id: 'lantern', name: 'Brakeman\'s lantern', note: 'Red globe, kerosene, still smells of it' },
  { id: 'insulator', name: 'Glass insulator', note: 'From the old telegraph line along the right of way' },
  { id: 'switchkey', name: 'Switch key', note: 'Brass, stamped with the railroad\'s initials' },
  { id: 'torpedo', name: 'Track torpedo', note: 'Clipped to the rail, it bangs to warn a train (defused!)' },
  { id: 'button', name: 'Conductor\'s button', note: 'Brass uniform button from a passenger conductor' },
  { id: 'tieplate', name: 'Stamped tie plate', note: 'Mill mark and year cast into the steel' },
  { id: 'watch', name: 'Railroad watch', note: 'Stopped at 4:17 — on time, once' },
  { id: 'telegraph', name: 'Telegraph key', note: 'Train orders went over this' },
  { id: 'pass', name: 'Employee pass, 1952', note: 'Good for travel on any division' },
  { id: 'medal', name: 'Safety medal', note: '"Ten years without a lost-time injury"' },
] as const;
export type CollectibleId = typeof COLLECTIBLES[number]['id'];

const MUSEUM_KEY = 'museum-v1';
export function loadMuseum(): CollectibleId[] { return loadJSON<CollectibleId[]>(MUSEUM_KEY, []); }
export function addToMuseum(id: CollectibleId): void {
  const m = loadMuseum();
  if (!m.includes(id)) saveJSON(MUSEUM_KEY, [...m, id]);
}

/**
 * Is there a collectible on this job, and which? Deterministic per job (so a
 * route always hides the same thing), about half of jobs have one, and found
 * items don't appear again.
 */
export function collectibleFor(seed: number, sections: number, found: string[]): { id: CollectibleId; section: number } | null {
  if (seed % 2 === 1) return null;
  const left = COLLECTIBLES.filter((c) => !found.includes(c.id));
  if (left.length === 0 || sections < 3) return null;
  const c = left[(seed >>> 3) % left.length];
  return { id: c.id, section: 1 + ((seed >>> 7) % (sections - 2)) };
}

// ---------------------------------------------------------------------------
// Photo challenges
// ---------------------------------------------------------------------------

export type PhotoId = 'deer' | 'lightning' | 'nightsparks' | 'sunset' | 'crew' | 'fire' | 'snow';
export const PHOTO_CHALLENGES: Record<PhotoId, { name: string; how: string; reward: number }> = {
  deer: { name: 'Wild neighbours', how: 'A deer in the shot with the consist', reward: 600 },
  lightning: { name: 'Storm chaser', how: 'Catch a lightning flash', reward: 800 },
  nightsparks: { name: 'Fireworks', how: 'Sparks flying at night', reward: 500 },
  sunset: { name: 'Golden hour', how: 'The sun low in the frame', reward: 500 },
  crew: { name: 'The crew', how: 'A work crew in the picture', reward: 500 },
  fire: { name: 'Hot spot', how: 'A lineside fire (before you put it out)', reward: 400 },
  snow: { name: 'Winter work', how: 'Grinding in falling snow', reward: 600 },
};
const PHOTO_KEY = 'photos-v1';
export function loadPhotos(): PhotoId[] { return loadJSON<PhotoId[]>(PHOTO_KEY, []); }
/** Mark these done; returns the ones that are new */
export function completePhotos(ids: PhotoId[]): PhotoId[] {
  const done = loadPhotos();
  const fresh = ids.filter((id) => !done.includes(id));
  if (fresh.length) saveJSON(PHOTO_KEY, [...done, ...fresh]);
  return fresh;
}

// ---------------------------------------------------------------------------
// Login ladder
// ---------------------------------------------------------------------------

export const LOGIN_REWARDS = [200, 300, 400, 600, 800, 1000, 2000];
export interface LoginState { lastDay: string; day: number }

/**
 * Claim today's reward. Consecutive days climb the ladder (it loops after
 * day 7); a missed day starts again at day 1. Returns null if already claimed.
 */
export function claimLogin(state: LoginState | null, today: string, yesterday: string): { state: LoginState; reward: number; day: number } | null {
  if (state && state.lastDay === today) return null;
  const day = state && state.lastDay === yesterday ? (state.day % LOGIN_REWARDS.length) + 1 : 1;
  return { state: { lastDay: today, day }, reward: LOGIN_REWARDS[day - 1], day };
}

// ---------------------------------------------------------------------------
// Streak savers
// ---------------------------------------------------------------------------

/** One saver per this many perfect passes (career), at most MAX_SAVERS held */
export const PERFECTS_PER_SAVER = 5;
export const MAX_SAVERS = 2;
export interface SaverState { savers: number; progress: number }
export function earnSaver(s: SaverState): SaverState {
  const progress = s.progress + 1;
  if (progress >= PERFECTS_PER_SAVER) return { savers: Math.min(MAX_SAVERS, s.savers + 1), progress: 0 };
  return { savers: s.savers, progress };
}

// ---------------------------------------------------------------------------
// Next goal
// ---------------------------------------------------------------------------

export interface GoalInput {
  stars: number; perfects: number; sGrades: number; dailies: number; achievements: number;
  liveries: { name: string; unlocked: boolean; need: { key: 'stars' | 'perfects' | 'sGrades' | 'dailies' | 'achievements'; n: number } | null }[];
}

/** The unlock you're closest to (by fraction done), as one line */
export function nextGoal(p: GoalInput): { text: string; fraction: number } | null {
  const candidates: { text: string; fraction: number }[] = [];
  const { next } = rankFor(p.stars);
  if (next) candidates.push({ text: `★ ${next.stars - p.stars} to rank ${next.name}`, fraction: p.stars / next.stars });
  for (const l of p.liveries) {
    if (l.unlocked || !l.need) continue;
    const have = p[l.need.key];
    candidates.push({ text: `${l.need.n - have} more ${label(l.need.key, l.need.n - have)} to ${l.name} paint`, fraction: have / l.need.n });
  }
  for (const n of [10, 50, 100]) {
    if (p.perfects < n) { candidates.push({ text: `${n - p.perfects} perfect passes to the ${n}-perfect badge`, fraction: p.perfects / n }); break; }
  }
  candidates.sort((a, b) => b.fraction - a.fraction);
  return candidates[0] ?? null;
}
function label(k: string, n: number): string {
  const one = n === 1;
  return { stars: one ? 'star' : 'stars', perfects: one ? 'perfect pass' : 'perfect passes', sGrades: one ? 'S grade' : 'S grades',
    dailies: one ? 'daily' : 'dailies', achievements: one ? 'achievement' : 'achievements' }[k] ?? k;
}

// ---------------------------------------------------------------------------
// Session summary (not saved: since the page was opened)
// ---------------------------------------------------------------------------

export const session = { jobs: 0, earned: 0, achievements: 0, perfects: 0, collectibles: 0 };
