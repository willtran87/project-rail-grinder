import { describe, it, expect, beforeEach } from 'vitest';

// In-memory localStorage for the storage-backed helpers
const mem: Record<string, string> = {};
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => (k in mem ? mem[k] : null),
  setItem: (k: string, v: string) => { mem[k] = v; },
  removeItem: (k: string) => { delete mem[k]; },
  clear: () => { for (const k of Object.keys(mem)) delete mem[k]; },
  key: () => null, length: 0,
} as Storage;

import {
  modifierPay, weekKey, weeklyChallenge, rankFor, rankPerks, collectibleFor, COLLECTIBLES, claimLogin,
  LOGIN_REWARDS, earnSaver, MAX_SAVERS, nextGoal, completePhotos, loadMuseum, addToMuseum,
} from './engage';

beforeEach(() => { for (const k of Object.keys(mem)) delete mem[k]; });

describe('modifiers and weekly challenge', () => {
  it('modifiers stack their pay', () => {
    expect(modifierPay([])).toBe(1);
    expect(modifierPay(['fog', 'traffic'])).toBe(1.95);
  });
  it('the weekly challenge is the same all week and changes next week', () => {
    expect(weekKey(new Date(2026, 10, 23))).toBe(weekKey(new Date(2026, 10, 29)));
    expect(weekKey(new Date(2026, 10, 30))).not.toBe(weekKey(new Date(2026, 10, 29)));
    const a = weeklyChallenge('2026-W48');
    expect(weeklyChallenge('2026-W48')).toEqual(a);
    expect(a.modifiers.length).toBeGreaterThan(0);
  });
});

describe('ranks', () => {
  it('climb with career stars and stack perks', () => {
    expect(rankFor(0).rank.name).toBe('Trainee');
    expect(rankFor(20).rank.name).toBe('Foreman');
    expect(rankFor(20).next?.name).toBe('Superintendent');
    expect(rankFor(99).next).toBeNull();
    expect(rankPerks(3)).toEqual({ pay: 1.05, stoneChange: 0.6, holdCost: 0.5 });
  });
});

describe('collectibles', () => {
  it('a route always hides the same thing, never one already found', () => {
    const a = collectibleFor(1000, 12, []);
    expect(collectibleFor(1000, 12, [])).toEqual(a);
    expect(a!.section).toBeGreaterThanOrEqual(1);
    expect(a!.section).toBeLessThan(11);
    expect(collectibleFor(1000, 12, [a!.id])?.id).not.toBe(a!.id);
    expect(collectibleFor(1000, 12, COLLECTIBLES.map((c) => c.id))).toBeNull();
    expect(collectibleFor(1001, 12, [])).toBeNull();
  });
  it('the museum keeps each find once', () => {
    addToMuseum('spike'); addToMuseum('spike');
    expect(loadMuseum()).toEqual(['spike']);
  });
});

describe('login ladder, savers, photos', () => {
  it('climbs on consecutive days, resets after a gap, once per day', () => {
    const d1 = claimLogin(null, '2026-11-01', '2026-10-31')!;
    expect(d1.reward).toBe(LOGIN_REWARDS[0]);
    expect(claimLogin(d1.state, '2026-11-01', '2026-10-31')).toBeNull();
    const d2 = claimLogin(d1.state, '2026-11-02', '2026-11-01')!;
    expect(d2.day).toBe(2);
    expect(claimLogin(d2.state, '2026-11-05', '2026-11-04')!.day).toBe(1);
  });
  it('a saver every five perfect passes, capped', () => {
    let s = { savers: 0, progress: 0 };
    for (let i = 0; i < 5; i++) s = earnSaver(s);
    expect(s.savers).toBe(1);
    for (let i = 0; i < 50; i++) s = earnSaver(s);
    expect(s.savers).toBe(MAX_SAVERS);
  });
  it('photo challenges only count once', () => {
    expect(completePhotos(['deer'])).toEqual(['deer']);
    expect(completePhotos(['deer', 'fire'])).toEqual(['fire']);
  });
});

describe('next goal', () => {
  it('picks the unlock you are closest to', () => {
    const g = nextGoal({
      stars: 7, perfects: 2, sGrades: 0, dailies: 0, achievements: 0,
      liveries: [{ name: 'Forest Green', unlocked: false, need: { key: 'perfects', n: 25 } }],
    });
    expect(g!.text).toMatch(/Operator/); // 7 of 8 stars beats 2 of 25 perfects
  });
});
