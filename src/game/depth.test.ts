import { describe, it, expect } from 'vitest';
import {
  applyTemplate, trackClassFor, curvePeaks, planBonus, weatherModifiers, pickEmergencySection,
  longHaulSeverity, longHaulBonus, STONE_GRADES,
} from './depth';
import { seededRandom } from './defects';

const flat = Array.from({ length: 61 }, (_, i) => ({ x: i - 30, y: 0 }));

describe('track class templates', () => {
  it('the standard profile is unchanged', () => {
    expect(applyTemplate(flat, 'standard')).toEqual(flat);
  });
  it('heavy-haul relieves the gauge corner only', () => {
    const t = applyTemplate(flat, 'heavy');
    expect(t.find((p) => p.x === -24)!.y).toBeGreaterThan(0.05);
    expect(t.find((p) => p.x === 20)!.y).toBeLessThan(0.001);
  });
  it('routes get a class from their region', () => {
    expect(trackClassFor('mountain')).toBe('heavy');
    expect(trackClassFor('city')).toBe('transit');
    expect(trackClassFor('prairie')).toBe('standard');
  });
});

describe('curves', () => {
  it('straight track adds nothing', () => {
    expect(curvePeaks(0.01, 'left')).toEqual([]);
  });
  it('the outer rail gets gauge-face wear, the inner the crown', () => {
    const outer = curvePeaks(0.3, 'right')[0];
    const inner = curvePeaks(0.3, 'left')[0];
    expect(outer.cx).toBeLessThan(-20);
    expect(Math.abs(inner.cx)).toBeLessThan(10);
    // turning the other way swaps them
    expect(curvePeaks(-0.3, 'left')[0].cx).toBeLessThan(-20);
  });
});

describe('stones, plan and weather', () => {
  it('coarse cuts faster but pays less bonus; fine the opposite', () => {
    expect(STONE_GRADES.coarse.removal).toBeGreaterThan(1);
    expect(STONE_GRADES.coarse.bonus).toBeLessThan(1);
    expect(STONE_GRADES.fine.bonus).toBeGreaterThan(1);
  });
  it('a plan pays only if you stay within it, more when it is tight', () => {
    expect(planBonus(20, 21, 20, 10)).toBe(0);
    expect(planBonus(20, 20, 20, 10)).toBe(400);
    expect(planBonus(16, 15, 20, 10)).toBeGreaterThan(400);
  });
  it('wet rail cuts slower; snow tightens the tolerance', () => {
    expect(weatherModifiers(1, false).removal).toBeLessThan(1);
    expect(weatherModifiers(0, true).tolerance).toBeLessThan(1);
    expect(weatherModifiers(0, false)).toMatchObject({ removal: 1, tolerance: 1, label: '' });
  });
});

describe('emergencies and long haul', () => {
  it('never picks a finished section or the current one', () => {
    const done = [true, false, false, true, false, false, false, false];
    const r = seededRandom(3);
    for (let i = 0; i < 30; i++) {
      const s = pickEmergencySection(done, 1, r);
      expect(done[s]).toBe(false);
      expect(s).not.toBe(1);
    }
    expect(pickEmergencySection([true, true], 0, r)).toBe(-1);
  });
  it('a poor shift leaves more damage; the bonus needs all three shifts', () => {
    expect(longHaulSeverity([1])).toBeGreaterThan(longHaulSeverity([5]));
    expect(longHaulBonus([4, 4])).toBe(0);
    expect(longHaulBonus([4, 4, 4])).toBe(8000);
  });
});
