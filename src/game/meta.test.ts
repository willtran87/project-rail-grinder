/** Tests for routes, career memory, achievements and story. Run with: npm test */
import { describe, it, expect, beforeEach } from 'vitest';
import { generateRoute, dailyRoute } from './routes';
import {
  betterGrade, timeMedal, conditionSeverity, ghostAt, nextDailyStreak, newStats,
  updateRouteConditions, routeCondition, boardRank, addBoardEntry, LIVERIES, WEAR_PER_JOB,
} from './meta';
import { checkAchievements, type JobSummary } from './achievements';
import { nextStoryBeat, markStorySeen } from './story';

// A tiny in-memory localStorage for node
beforeEach(() => {
  const store = new Map<string, string>();
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => { store.set(k, v); },
    removeItem: (k: string) => { store.delete(k); }, clear: () => store.clear(), key: () => null, length: 0,
  } as Storage;
});

describe('generated routes', () => {
  it('a seed always makes the same route; routes grow with the career', () => {
    expect(generateRoute(123, 0)).toEqual(generateRoute(123, 0));
    const early = generateRoute(5, 0), late = generateRoute(5, 60);
    expect(late.sections).toBeGreaterThan(early.sections);
    expect(late.basePay).toBeGreaterThan(early.basePay);
  });
  it('a route is long enough for its sections plus lead-in and run-out', () => {
    for (let s = 0; s < 20; s++) {
      const r = generateRoute(s, 10);
      const end = r.points[r.points.length - 1][1];
      expect(end).toBeGreaterThan(r.sections * 20 + 50 + 60);
    }
  });
  it('the daily contract is the same all day and different tomorrow', () => {
    expect(dailyRoute('2026-11-27')).toEqual(dailyRoute('2026-11-27'));
    expect(dailyRoute('2026-11-28').seed).not.toBe(dailyRoute('2026-11-27').seed);
  });
});

describe('grades, medals, conditions', () => {
  it('keeps the better grade', () => {
    expect(betterGrade('B', 'S')).toBe('S');
    expect(betterGrade('A', 'C')).toBe('A');
  });
  it('medals by time per section', () => {
    expect(timeMedal(20 * 10, 10)).toBe('gold');
    expect(timeMedal(30 * 10, 10)).toBe('silver');
    expect(timeMedal(45 * 10, 10)).toBe('bronze');
    expect(timeMedal(60 * 10, 10)).toBeNull();
  });
  it('a route wears while you work elsewhere, and a worn route is damaged worse', () => {
    updateRouteConditions('kansas', 95);
    expect(routeCondition('kansas')).toBe(95);
    updateRouteConditions('montana', 90);
    updateRouteConditions('montana', 90);
    expect(routeCondition('kansas')).toBe(95 - 2 * WEAR_PER_JOB);
    expect(conditionSeverity(95)).toBeLessThan(conditionSeverity(50));
    expect(conditionSeverity(null)).toBe(1);
  });
});

describe('ghost, leaderboard, daily streak', () => {
  it('ghost position interpolates between samples', () => {
    expect(ghostAt([0, 0.1, 0.3], 0.75)).toBeCloseTo(0.2, 5);
    expect(ghostAt([0, 0.1, 0.3], 99)).toBe(0.3);
  });
  it('the leaderboard keeps the top 10, best first', () => {
    for (let i = 1; i <= 12; i++) addBoardEntry('job', { initials: 'AAA', score: i * 100, grade: 'B', stars: 3, time: 60, date: 'x' });
    expect(boardRank('job', 50)).toBe(-1);   // wouldn't make it
    expect(boardRank('job', 5000)).toBe(0);  // top spot
  });
  it('a daily streak grows on consecutive days and resets after a gap', () => {
    const s = { ...newStats(), lastDaily: '2026-11-26', dailyStreak: 2 };
    expect(nextDailyStreak(s, '2026-11-27')).toBe(3);
    expect(nextDailyStreak(s, '2026-11-29')).toBe(1);
    expect(nextDailyStreak({ ...s, lastDaily: '2026-11-27' }, '2026-11-27')).toBe(2);
  });
});

describe('achievements, paint, story', () => {
  const job: JobSummary = { jobId: 'x', stars: 5, grade: 'S', sections: 10, perfects: 10, bestCombo: 10,
    overgrinds: 0, missedWindows: 0, night: true, snow: true, deadlineSpare: 150, daily: true, random: false };
  it('a great job earns several at once, and each only once', () => {
    const s = { ...newStats(), jobs: 1 };
    const first = checkAchievements(job, s).map((a) => a.id);
    expect(first).toEqual(expect.arrayContaining(['first-job', 'five-star', 's-grade', 'all-perfect', 'night-snow', 'beat-train', 'daily-1', 'combo-10']));
    expect(checkAchievements(job, s)).toEqual([]);
  });
  it('the standard paint is always available; the rest unlock with progress', () => {
    const none = { stars: 0, sGrades: 0, perfects: 0, achievements: 0, dailies: 0 };
    expect(LIVERIES.filter((l) => l.unlocked(none)).map((l) => l.id)).toEqual(['safety']);
    expect(LIVERIES.every((l) => l.unlocked({ stars: 99, sGrades: 9, perfects: 99, achievements: 99, dailies: 9 }))).toBe(true);
  });
  it('story beats play in order, once each', () => {
    const b = nextStoryBeat(0)!;
    expect(b.id).toBe('hello');
    markStorySeen(b.id);
    expect(nextStoryBeat(0)).toBeNull();
    expect(nextStoryBeat(1)!.id).toBe('second');
  });
});
