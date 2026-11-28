/** Tests for perfect passes, combos and grades. Run with: npm test */
import { describe, it, expect } from 'vitest';
import { Combo, isPerfectPass, jobGrade, sectionBonusBase } from './scoring';

describe('perfect pass', () => {
  const clean = { passes: 0, damage: 0, maxHeat: 50 };
  it('needs one pass, high accuracy, no over-grind and no overheating', () => {
    expect(isPerfectPass(0.95, clean)).toBe(true);
    expect(isPerfectPass(0.85, clean)).toBe(false);
    expect(isPerfectPass(0.95, { ...clean, passes: 2 })).toBe(false);
    expect(isPerfectPass(0.95, { ...clean, damage: 3 })).toBe(false);
    expect(isPerfectPass(0.95, { ...clean, maxHeat: 85 })).toBe(false);
  });
  it('pays more than an ordinary 3-star section', () => {
    expect(sectionBonusBase(3, true)).toBeGreaterThan(sectionBonusBase(3, false));
    expect(sectionBonusBase(3, false)).toBeGreaterThan(sectionBonusBase(2, false));
  });
});

describe('combo', () => {
  it('climbs with consecutive 3-star sections, capped at ×3', () => {
    const c = new Combo();
    expect(c.multiplier).toBe(1);
    c.sectionDone(3, false); c.sectionDone(3, false);
    expect(c.multiplier).toBe(1.25);
    for (let i = 0; i < 20; i++) c.sectionDone(3, false);
    expect(c.multiplier).toBe(3);
  });
  it('a lower-star section, over-grind or overheat breaks it (but the best is kept)', () => {
    const c = new Combo();
    c.sectionDone(3, false); c.sectionDone(3, false); c.sectionDone(3, false);
    c.sectionDone(2, false);
    expect(c.count).toBe(0);
    expect(c.best).toBe(3);
    c.sectionDone(3, false);
    expect(c.break()).toBe(true);
    expect(c.count).toBe(0);
  });
  it('the multiplier scales the bonus', () => {
    const c = new Combo();
    const first = c.sectionDone(3, false);
    for (let i = 0; i < 4; i++) c.sectionDone(3, false);
    const later = c.sectionDone(3, false);
    expect(later).toBeGreaterThan(first);
  });
});

describe('job grade', () => {
  it('S needs top stars plus perfects and combos; poor work grades low', () => {
    expect(jobGrade(5, 10, 10, 10)).toBe('S');
    expect(jobGrade(5, 0, 0, 10)).not.toBe('S');
    expect(jobGrade(1, 0, 0, 10)).toBe('D');
  });
});
