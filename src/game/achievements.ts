/**
 * achievements.ts - Milestones and challenges, checked at the end of every job
 * (and a few during play). Unlocks are saved; new ones pop up as a toast.
 *
 * Pure logic + localStorage — unit-tested in achievements.test.ts.
 */

import { loadJSON, saveJSON } from '../core/storage';
import type { CareerStats } from './meta';
import type { Grade } from './scoring';

/** What a finished job looked like (for the checks) */
export interface JobSummary {
  jobId: string;
  stars: number;
  grade: Grade;
  sections: number;
  perfects: number;
  bestCombo: number;
  overgrinds: number;
  missedWindows: number;
  night: boolean;
  snow: boolean;
  /** Seconds the revenue train window had left when the job finished (0 if none) */
  deadlineSpare: number;
  daily: boolean;
  random: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  /** true when earned (job: the job just finished; stats: career totals including it) */
  check: (job: JobSummary, stats: CareerStats) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-job', name: 'First Shift', description: 'Finish your first contract', check: (_j, s) => s.jobs >= 1 },
  { id: 'five-star', name: 'Five-Star Track', description: 'Finish a contract with 5 stars', check: (j) => j.stars >= 5 },
  { id: 's-grade', name: 'Showroom Steel', description: 'Get an S grade', check: (j) => j.grade === 'S' },
  { id: 'perfect-10', name: 'Steady Hands', description: '10 perfect passes in total', check: (_j, s) => s.perfects >= 10 },
  { id: 'perfect-50', name: 'Surgeon', description: '50 perfect passes in total', check: (_j, s) => s.perfects >= 50 },
  { id: 'combo-5', name: 'On a Roll', description: 'A combo of 5 three-star sections', check: (j) => j.bestCombo >= 5 },
  { id: 'combo-10', name: 'Unbroken', description: 'A combo of 10 three-star sections', check: (j) => j.bestCombo >= 10 },
  { id: 'clean-job', name: 'Clean Cut', description: 'Finish a contract without over-grinding once', check: (j) => j.overgrinds === 0 },
  { id: 'all-perfect', name: 'Flawless', description: 'Every section of a contract a perfect pass', check: (j) => j.perfects >= j.sections && j.sections > 0 },
  { id: 'night-snow', name: 'Graveyard Shift', description: 'Finish a contract at night in the snow', check: (j) => j.night && j.snow },
  { id: 'night-owl', name: 'Night Owl', description: 'Finish 5 contracts at night', check: (_j, s) => s.nightJobs >= 5 },
  { id: 'beat-train', name: 'Clear the Main', description: 'Finish with 2+ minutes to spare before the revenue train', check: (j) => j.deadlineSpare >= 120 && j.missedWindows === 0 },
  { id: 'daily-1', name: 'Daily Grind', description: 'Finish a daily contract', check: (j) => j.daily },
  { id: 'daily-streak', name: 'Regular', description: 'Daily contracts 3 days in a row', check: (_j, s) => s.dailyStreak >= 3 },
  { id: 'random-5', name: 'Journeyman', description: 'Finish 5 random routes', check: (_j, s) => s.randoms >= 5 },
  { id: 'mile', name: 'A Mile of Steel', description: 'Restore 5,280 ft of track', check: (_j, s) => s.feetRestored >= 5280 },
  { id: 'metal', name: 'Shavings', description: 'Remove 25 mm of metal in total', check: (_j, s) => s.metalMm >= 25 },
  { id: 'rich', name: 'Payday', description: 'Earn $100,000 in total', check: (_j, s) => s.totalEarned >= 100000 },
];

const KEY = 'achievements-v1';
export function unlockedAchievements(): Record<string, string> { return loadJSON(KEY, {}); }

/** Check everything after a job; returns the newly earned ones (and saves them) */
export function checkAchievements(job: JobSummary, stats: CareerStats, today = new Date().toISOString().slice(0, 10)): Achievement[] {
  const got = unlockedAchievements();
  const fresh = ACHIEVEMENTS.filter((a) => !got[a.id] && a.check(job, stats));
  for (const a of fresh) got[a.id] = today;
  if (fresh.length) saveJSON(KEY, got);
  return fresh;
}
