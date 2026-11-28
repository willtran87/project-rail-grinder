/**
 * Tests for game/rules.ts — scoring and grinding tuning.
 * If you rebalance a number in rules.ts and a test here fails, check that the
 * new behaviour is what you intended, then update the test.
 */

import { describe, it, expect } from 'vitest';
import {
  COMPLETION_ACCURACY, heatRatePerSec, heatPenalty, removalRatePerSec,
  stoneContactWidth, stoneGrindX, sectionStars, jobStars, sectionProgress,
} from './rules';

describe('grinding physics', () => {
  it('low pressure never overheats; high pressure heats fast', () => {
    expect(heatRatePerSec(25)).toBeLessThanOrEqual(0);
    expect(heatRatePerSec(50)).toBeGreaterThan(0);
    expect(heatRatePerSec(100)).toBeGreaterThan(heatRatePerSec(50) * 2);
  });

  it('overheated stones cut less', () => {
    expect(heatPenalty(30)).toBe(1);
    expect(heatPenalty(70)).toBeGreaterThan(1);   // hot-cut zone: faster
    expect(heatPenalty(90)).toBeLessThan(1);      // overheated: glazed
    expect(heatPenalty(90)).toBeLessThan(heatPenalty(70));
  });

  it('more pressure removes more metal through a narrower contact', () => {
    expect(removalRatePerSec(100)).toBeGreaterThan(removalRatePerSec(50));
    expect(stoneContactWidth(100)).toBeLessThan(stoneContactWidth(0));
  });

  it('stone angle maps across the rail head (±40° reaches the corners)', () => {
    expect(stoneGrindX(0)).toBe(0);
    expect(stoneGrindX(40)).toBeGreaterThan(25);
    expect(stoneGrindX(-40)).toBeLessThan(-25);
  });
});

describe('sectionStars', () => {
  it('a clean single pass earns 3 stars', () => {
    expect(sectionStars(1.0, 1, 0)).toBe(3);
  });

  it('many passes and damage cost stars', () => {
    expect(sectionStars(0.85, 6, 0)).toBeLessThan(3);
    expect(sectionStars(0.85, 6, 20)).toBe(1);
  });

  it('treats 0 recorded passes like 1 (first pass not yet counted)', () => {
    expect(sectionStars(0.9, 0, 0)).toBe(sectionStars(0.9, 1, 0));
  });
});

describe('jobStars', () => {
  it('maps RQI to 1-5 stars', () => {
    expect(jobStars(96, 0)).toBe(5);
    expect(jobStars(86, 0)).toBe(4);
    expect(jobStars(76, 0)).toBe(3);
    expect(jobStars(61, 0)).toBe(2);
    expect(jobStars(40, 0)).toBe(1);
  });

  it('each delayed train costs a star, never below 1', () => {
    expect(jobStars(96, 1)).toBe(4);
    expect(jobStars(96, 2)).toBe(3);
    expect(jobStars(61, 5)).toBe(1);
  });
});

describe('sectionProgress', () => {
  it('starts at 0 and is full only when complete', () => {
    expect(sectionProgress(0.4, 0.4, false)).toBe(0);
    expect(sectionProgress(0.4, 0.9, false)).toBe(0.95); // capped until complete
    expect(sectionProgress(0.4, 0.9, true)).toBe(1);
  });

  it('moves proportionally toward the completion threshold', () => {
    const halfway = 0.4 + (COMPLETION_ACCURACY - 0.4) / 2;
    expect(sectionProgress(0.4, halfway, false)).toBeCloseTo(0.5, 5);
  });

  it('never goes negative if grinding makes things worse', () => {
    expect(sectionProgress(0.5, 0.3, false)).toBe(0);
  });
});

describe('job-event money', () => {
  it('fines and bonuses are positive whole dollars, fines bigger than the matching bonus', async () => {
    const { EVENT_PAY } = await import('./rules');
    for (const v of Object.values(EVENT_PAY)) { expect(v).toBeGreaterThan(0); expect(Number.isInteger(v)).toBe(true); }
    expect(EVENT_PAY.fireFine).toBeGreaterThan(EVENT_PAY.fireOut);
    expect(EVENT_PAY.fireCloseCall).toBeGreaterThan(EVENT_PAY.fireOut);
  });
});
