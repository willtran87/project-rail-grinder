/**
 * Tests for game/career.ts — pay, upgrades and unlocks.
 */

import { describe, it, expect } from 'vitest';
import {
  newCareer, buyUpgrade, nextUpgradeCost, upgradeEffects, jobPay,
  isUnlocked, totalBestStars, formatMoney, UPGRADES,
} from './career';

describe('jobPay', () => {
  it('pays more for more stars', () => {
    expect(jobPay(10000, 1)).toBe(5500);
    expect(jobPay(10000, 5)).toBe(11500);
    expect(jobPay(10000, 3)).toBeGreaterThan(jobPay(10000, 2));
  });
});

describe('buyUpgrade', () => {
  it('buys the next level when affordable and charges for it', () => {
    const start = { ...newCareer(), money: 5000 };
    const { state, bought } = buyUpgrade(start, 'cooling');
    expect(bought).toBe(true);
    expect(state.upgrades.cooling).toBe(1);
    expect(state.money).toBe(5000 - UPGRADES[0].costs[0]);
    expect(start.upgrades.cooling).toBe(0); // original untouched
  });

  it('refuses when too poor', () => {
    const { state, bought } = buyUpgrade({ ...newCareer(), money: 100 }, 'compound');
    expect(bought).toBe(false);
    expect(state.upgrades.compound).toBe(0);
  });

  it('stops at max level', () => {
    let state = { ...newCareer(), money: 1_000_000 };
    for (let i = 0; i < 5; i++) state = buyUpgrade(state, 'wideStones').state;
    expect(state.upgrades.wideStones).toBe(3);
    expect(nextUpgradeCost(state, 'wideStones')).toBeNull();
  });
});

describe('upgradeEffects', () => {
  it('no upgrades = no change', () => {
    expect(upgradeEffects(newCareer().upgrades)).toEqual({ heat: 1, removal: 1, width: 1 });
  });

  it('upgrades cool, cut and widen', () => {
    const e = upgradeEffects({ cooling: 3, compound: 2, wideStones: 1 });
    expect(e.heat).toBeCloseTo(0.4);
    expect(e.removal).toBeCloseTo(1.24);
    expect(e.width).toBeCloseTo(1.12);
  });
});

describe('unlocks', () => {
  it('sums best stars and compares to the requirement', () => {
    const total = totalBestStars({ a: { bestStars: 3 }, b: { bestStars: 4 } });
    expect(total).toBe(7);
    expect(isUnlocked(7, total)).toBe(true);
    expect(isUnlocked(8, total)).toBe(false);
    expect(isUnlocked(0, 0)).toBe(true); // first job always open
  });
});

describe('formatMoney', () => {
  it('adds a dollar sign and thousands separators', () => {
    expect(formatMoney(12400)).toBe('$12,400');
  });
});
