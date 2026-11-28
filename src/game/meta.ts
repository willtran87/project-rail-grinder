/**
 * meta.ts - Everything the career remembers between jobs:
 *
 *   GRADES & MEDALS  best grade (S–D) and best-time medal per contract
 *   ROUTE CONDITION  each route's rail quality after your last visit, which
 *                    slowly wears down as you work elsewhere — come back to
 *                    maintain it (worn routes are damaged worse and pay more)
 *   GHOST RUNS       your best run's position over time, raced on the track map
 *   LEADERBOARDS     the top 10 runs per contract, with initials (this browser)
 *   CAREER STATS     totals for the career summary page
 *   LIVERIES         paint schemes for the grinder, unlocked by playing well
 *
 * Pure logic + localStorage (via core/storage) — unit-tested in meta.test.ts.
 */

import { nextGoal } from './engage';
import { loadCustomPaint, EVENTS, loadEventRewards } from './loop';
import { loadJSON, saveJSON } from '../core/storage';
import type { Grade } from './scoring';
import { loadRecords } from './progress';
import { totalBestStars } from './career';
import { unlockedAchievements } from './achievements';

// ---------------------------------------------------------------------------
// Grades and medals
// ---------------------------------------------------------------------------

const GRADE_ORDER: Grade[] = ['D', 'C', 'B', 'A', 'S'];
export function betterGrade(a: Grade | undefined, b: Grade): Grade {
  if (!a) return b;
  return GRADE_ORDER.indexOf(b) > GRADE_ORDER.indexOf(a) ? b : a;
}

export type Medal = 'gold' | 'silver' | 'bronze' | null;
/**
 * Medal for finishing time: seconds per section (gold < 30 s, silver < 42 s,
 * bronze < 60 s). Set from the play-test: a steady player runs ~40-45 s a section.
 */
export function timeMedal(seconds: number, sections: number): Medal {
  const per = seconds / Math.max(1, sections);
  return per < 30 ? 'gold' : per < 42 ? 'silver' : per < 60 ? 'bronze' : null;
}
export const MEDAL_ICON: Record<Exclude<Medal, null>, string> = { gold: '🥇', silver: '🥈', bronze: '🥉' };

const GRADES_KEY = 'grades-v1';
export function loadGrades(): Record<string, { grade: Grade; medal: Medal }> {
  return loadJSON(GRADES_KEY, {});
}
/** Remember a run's grade and medal if they beat the saved ones; returns the new bests */
export function recordGradeAndMedal(jobId: string, grade: Grade, medal: Medal): { grade: Grade; medal: Medal } {
  const all = loadGrades();
  const prev = all[jobId];
  const medalRank = (m: Medal) => (m === 'gold' ? 3 : m === 'silver' ? 2 : m === 'bronze' ? 1 : 0);
  const best = {
    grade: betterGrade(prev?.grade, grade),
    medal: prev && medalRank(prev.medal) >= medalRank(medal) ? prev.medal : medal,
  };
  all[jobId] = best;
  saveJSON(GRADES_KEY, all);
  return best;
}

// ---------------------------------------------------------------------------
// Route condition
// ---------------------------------------------------------------------------

/** Condition points a route loses for each job done elsewhere */
export const WEAR_PER_JOB = 6;
const CONDITION_KEY = 'route-condition-v1';
interface RouteCondition { rqi: number; jobsSince: number }

function loadConditions(): Record<string, RouteCondition> { return loadJSON(CONDITION_KEY, {}); }

/** A route's condition now (0-100), or null if never worked */
export function routeCondition(jobId: string): number | null {
  const c = loadConditions()[jobId];
  return c ? Math.max(30, Math.round(c.rqi - c.jobsSince * WEAR_PER_JOB)) : null;
}

/** After a job: that route is as good as you left it; every other worked route wears a bit */
export function updateRouteConditions(playedId: string, rqiAfter: number): void {
  const all = loadConditions();
  for (const id of Object.keys(all)) if (id !== playedId) all[id].jobsSince++;
  all[playedId] = { rqi: rqiAfter, jobsSince: 0 };
  saveJSON(CONDITION_KEY, all);
}

/**
 * How much worse the damage is on a return visit: a well-kept route
 * (high condition) has less, a neglected one more. Unvisited routes: ×1.
 */
export function conditionSeverity(condition: number | null): number {
  if (condition === null) return 1;
  return Math.max(0.75, Math.min(1.2, 1.3 - condition / 180));
}

// ---------------------------------------------------------------------------
// Ghost runs (best run's position over time)
// ---------------------------------------------------------------------------

/** One sample every this many seconds */
export const GHOST_STEP = 0.5;
const GHOST_KEY = 'ghosts-v1';

/** Positions (0..1 along the route) of the best run, one per GHOST_STEP seconds */
export function loadGhost(jobId: string): number[] | null {
  return loadJSON<Record<string, number[]>>(GHOST_KEY, {})[jobId] ?? null;
}
export function saveGhost(jobId: string, samples: number[]): void {
  const all = loadJSON<Record<string, number[]>>(GHOST_KEY, {});
  // Rounded and capped so a long run can't fill the browser storage
  all[jobId] = samples.slice(0, 2400).map((v) => Math.round(v * 1000) / 1000);
  saveJSON(GHOST_KEY, all);
}
/** Where the ghost is `t` seconds into its run */
export function ghostAt(samples: number[], t: number): number {
  if (samples.length === 0) return 0;
  const f = t / GHOST_STEP;
  const i = Math.floor(f);
  if (i >= samples.length - 1) return samples[samples.length - 1];
  return samples[i] + (samples[i + 1] - samples[i]) * (f - i);
}

// ---------------------------------------------------------------------------
// Leaderboards
// ---------------------------------------------------------------------------

export interface BoardEntry { initials: string; score: number; grade: Grade; stars: number; time: number; date: string }
const BOARD_KEY = 'leaderboards-v1';
const BOARD_SIZE = 10;

export function loadBoard(jobId: string): BoardEntry[] {
  return loadJSON<Record<string, BoardEntry[]>>(BOARD_KEY, {})[jobId] ?? [];
}
/** Position (0-based) a score would take, or -1 if it doesn't make the top 10 */
export function boardRank(jobId: string, score: number): number {
  const board = loadBoard(jobId);
  const i = board.findIndex((e) => score > e.score);
  if (i >= 0) return i;
  return board.length < BOARD_SIZE ? board.length : -1;
}
export function addBoardEntry(jobId: string, entry: BoardEntry): number {
  const all = loadJSON<Record<string, BoardEntry[]>>(BOARD_KEY, {});
  const board = [...(all[jobId] ?? []), entry].sort((a, b) => b.score - a.score).slice(0, BOARD_SIZE);
  all[jobId] = board;
  saveJSON(BOARD_KEY, all);
  return board.indexOf(entry);
}

// ---------------------------------------------------------------------------
// Career stats
// ---------------------------------------------------------------------------

export interface CareerStats {
  jobs: number;
  sections: number;
  perfects: number;
  metalMm: number;
  feetRestored: number;
  bestCombo: number;
  sGrades: number;
  overgrinds: number;
  dailies: number;
  /** Random routes finished */
  randoms: number;
  /** Consecutive days with a daily contract done */
  dailyStreak: number;
  lastDaily: string;
  totalEarned: number;
  nightJobs: number;
  snowJobs: number;
}
const STATS_KEY = 'career-stats-v1';
export function newStats(): CareerStats {
  return { jobs: 0, sections: 0, perfects: 0, metalMm: 0, feetRestored: 0, bestCombo: 0, sGrades: 0, overgrinds: 0,
    dailies: 0, randoms: 0, dailyStreak: 0, lastDaily: '', totalEarned: 0, nightJobs: 0, snowJobs: 0 };
}
export function loadStats(): CareerStats { return { ...newStats(), ...loadJSON<Partial<CareerStats>>(STATS_KEY, {}) }; }
export function saveStats(s: CareerStats): void { saveJSON(STATS_KEY, s); }

/** Daily streak: +1 if yesterday's daily was done, else back to 1 (same day: unchanged) */
export function nextDailyStreak(s: CareerStats, today: string): number {
  if (s.lastDaily === today) return s.dailyStreak;
  const y = new Date(today + 'T12:00:00');
  y.setDate(y.getDate() - 1);
  const yesterday = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
  return s.lastDaily === yesterday ? s.dailyStreak + 1 : 1;
}

// ---------------------------------------------------------------------------
// Liveries (paint schemes)
// ---------------------------------------------------------------------------

export interface Livery {
  id: string;
  name: string;
  /** Main body colour, and the darker trim */
  body: string;
  trim: number;
  /** How to unlock it, and a test against career progress */
  unlockText: string;
  /** What it needs, for the "next goal" line (null = free) */
  need?: { key: 'stars' | 'perfects' | 'sGrades' | 'dailies' | 'achievements'; n: number };
  unlocked: (p: { stars: number; sGrades: number; perfects: number; achievements: number; dailies: number }) => boolean;
}

export const LIVERIES: Livery[] = [
  { id: 'safety', name: 'Safety Yellow', body: '#eed202', trim: 0xccb502, unlockText: 'Standard paint', unlocked: () => true },
  { id: 'heritage', name: 'Heritage Red', body: '#b8322a', trim: 0x8e241e, unlockText: 'Earn 10 career stars', need: { key: 'stars', n: 10 }, unlocked: (p) => p.stars >= 10 },
  { id: 'forest', name: 'Forest Green', body: '#2f7a46', trim: 0x235c35, unlockText: '25 perfect passes', need: { key: 'perfects', n: 25 }, unlocked: (p) => p.perfects >= 25 },
  { id: 'midnight', name: 'Midnight Blue', body: '#24407a', trim: 0x1a2f5a, unlockText: 'Finish 3 daily contracts', need: { key: 'dailies', n: 3 }, unlocked: (p) => p.dailies >= 3 },
  { id: 'safetyorange', name: 'Work-Zone Orange', body: '#e8701c', trim: 0xb85612, unlockText: 'Unlock 8 achievements', need: { key: 'achievements', n: 8 }, unlocked: (p) => p.achievements >= 8 },
  { id: 'chrome', name: 'Polished Steel', body: '#c9ccd2', trim: 0x9a9da4, unlockText: 'Get an S grade', need: { key: 'sGrades', n: 1 }, unlocked: (p) => p.sGrades >= 1 },
  { id: 'gold', name: 'Gold Standard', body: '#d4a017', trim: 0xa67c0f, unlockText: 'Get 5 S grades', need: { key: 'sGrades', n: 5 }, unlocked: (p) => p.sGrades >= 5 },
];
/** What the paint-scheme unlocks are checked against */
export function liveryProgress() {
  const s = loadStats();
  return {
    stars: totalBestStars(loadRecords()), sGrades: s.sGrades, perfects: s.perfects,
    achievements: Object.keys(unlockedAchievements()).length, dailies: s.dailies,
  };
}

const LIVERY_KEY = 'livery-v1';
export function selectedLivery(): Livery {
  const id = loadJSON<string>(LIVERY_KEY, 'safety');
  if (id === 'custom') {
    const c = loadCustomPaint();
    return { id: 'custom', name: 'Custom', body: c.body, trim: parseInt(c.trim.slice(1), 16), unlockText: '', unlocked: () => true };
  }
  const ev = EVENTS.find((e) => e.livery.id === id);
  if (ev && loadEventRewards().includes(id)) return { ...ev.livery, unlockText: ev.name, unlocked: () => true };
  return LIVERIES.find((l) => l.id === id) ?? LIVERIES[0];
}
export function selectLivery(id: string): void { saveJSON(LIVERY_KEY, id); }

/** The closest unlock right now, as one line (see engage.nextGoal) */
export function currentGoal(): string {
  const p = liveryProgress();
  const g = nextGoal({
    ...p,
    liveries: LIVERIES.map((l) => ({ name: l.name, unlocked: l.unlocked(p), need: l.need ?? null })),
  });
  return g ? g.text : '';
}
