import { describe, it, expect, beforeEach } from 'vitest';

const mem: Record<string, string> = {};
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => (k in mem ? mem[k] : null),
  setItem: (k: string, v: string) => { mem[k] = v; },
  removeItem: (k: string) => { delete mem[k]; },
  clear: () => { for (const k of Object.keys(mem)) delete mem[k]; },
  key: () => null, length: 0,
} as Storage;

import {
  currentEvent, grantEventRewards, loadEventRewards, masteryLevel, addMastery, routeCode, parseRouteCode,
  offerBounty, bountyStep, awardBadges, badgeCount, ladderRoutes, loadLadder, saveCustomPaint, loadCustomPaint,
} from './loop';

beforeEach(() => { for (const k of Object.keys(mem)) delete mem[k]; });

describe('seasonal events', () => {
  it('one event per season', () => {
    expect(currentEvent(new Date(2026, 0, 10)).id).toBe('winter');
    expect(currentEvent(new Date(2026, 3, 10)).id).toBe('thaw');
    expect(currentEvent(new Date(2026, 6, 10)).id).toBe('heat');
    expect(currentEvent(new Date(2026, 9, 10)).id).toBe('harvest');
  });
  it('rewards are granted once', () => {
    const ev = currentEvent(new Date(2026, 0, 10));
    expect(grantEventRewards(ev)).toBe(true);
    expect(grantEventRewards(ev)).toBe(false);
    expect(loadEventRewards()).toContain(ev.livery.id);
  });
});

describe('route mastery', () => {
  it('levels up with stars earned on the route', () => {
    expect(masteryLevel(0)).toBe(1);
    expect(masteryLevel(8)).toBe(2);
    expect(masteryLevel(30)).toBe(4);
    addMastery('transcon', 5);
    expect(addMastery('transcon', 5)).toEqual({ before: 1, after: 2 });
  });
});

describe('route codes', () => {
  it('round-trip a seed and its risks', () => {
    const code = routeCode(123456789, ['fog', 'traffic']);
    expect(code).toMatch(/^RG-[0-9A-Z]+-[0-9A-Z]+$/);
    expect(parseRouteCode(code)).toEqual({ seed: 123456789, mods: ['fog', 'traffic'] });
    expect(parseRouteCode(code.toLowerCase())).toEqual({ seed: 123456789, mods: ['fog', 'traffic'] });
    expect(parseRouteCode('hello')).toBeNull();
  });
});

describe('bounties, badges, ladder, paint', () => {
  it('bounties are offered on a roll and settle section by section', () => {
    expect(offerBounty(1, 0, 10, () => 0.1)).toBeNull();
    const b = offerBounty(3, 0, 10, () => 0.1)!;
    expect(b.kind).toBe('threeStars');
    expect(bountyStep(b, 3, false)).toBe('going');
    expect(bountyStep(b, 3, false)).toBe('going');
    expect(bountyStep(b, 3, false)).toBe('won');
    const p = offerBounty(3, 0, 10, () => 0.9)!;
    expect(bountyStep(p, 3, false)).toBe('lost');
  });
  it('badges are awarded once each and count as stars', () => {
    expect(awardBadges('marias', { stars: 4, night: true, usedFastTravel: false, gold: false })).toEqual(['night', 'noFast']);
    expect(awardBadges('marias', { stars: 5, night: true, usedFastTravel: false, gold: true })).toEqual(['speed']);
    expect(badgeCount()).toBe(3);
  });
  it('the ladder picks three routes for the week and keeps them', () => {
    const r = ladderRoutes('2026-W48', ['a', 'b', 'c', 'd']);
    expect(r).toHaveLength(3);
    expect(new Set(r).size).toBe(3);
    expect(loadLadder('2026-W48', ['a', 'b', 'c', 'd']).routes).toEqual(r);
  });
  it('custom paint is cleaned before saving', () => {
    saveCustomPaint({ body: 'red', trim: '#112233', number: '4<2>', crew: '<b>Night Owls</b>' });
    expect(loadCustomPaint()).toEqual({ body: '#2a6fb0', trim: '#112233', number: '42', crew: 'bNight Owls/b' });
  });
});
