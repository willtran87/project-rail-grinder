import { describe, it, expect } from 'vitest';
import { customerFor, customerMet, nextGrade, isMirrorFinish, rollFault, CUSTOMERS } from './ops';

describe('customers', () => {
  it('built-in routes have fixed customers; others come from the seed', () => {
    expect(customerFor('transcon', 'prairie', 1)).toBe('heavyHaul');
    expect(customerFor('clearing', 'city', 1)).toBe('commuter');
    expect(customerFor('random-5', 'city', 3)).toBe(customerFor('random-5', 'city', 3));
    expect(Object.keys(CUSTOMERS)).toContain(customerFor('random-9', 'coast', 9));
  });
  it('each customer wants something different', () => {
    const base = { rqi: 85, medal: 'bronze' as const, avgPressure: 70, overgrinds: 4 };
    expect(customerMet('heavyHaul', base)).toBe(false);
    expect(customerMet('heavyHaul', { ...base, rqi: 92 })).toBe(true);
    expect(customerMet('commuter', { ...base, medal: 'silver' })).toBe(true);
    expect(customerMet('scenic', base)).toBe(false);
    expect(customerMet('scenic', { ...base, avgPressure: 50, overgrinds: 1 })).toBe(true);
  });
});

describe('stones and faults', () => {
  it('the stone grade cycles coarse → standard → fine → coarse', () => {
    expect(nextGrade('coarse')).toBe('standard');
    expect(nextGrade('fine')).toBe('coarse');
  });
  it('a mirror finish needs fine stones and high accuracy', () => {
    expect(isMirrorFinish('fine', 0.95)).toBe(true);
    expect(isMirrorFinish('standard', 0.99)).toBe(false);
    expect(isMirrorFinish('fine', 0.85)).toBe(false);
  });
  it('no faults for new players; later about half of jobs', () => {
    expect(rollFault(1, () => 0)).toBeNull();
    let n = 0;
    let s = 1;
    const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    for (let i = 0; i < 400; i++) if (rollFault(10, rand)) n++;
    expect(n).toBeGreaterThan(120);
    expect(n).toBeLessThan(240);
  });
});
