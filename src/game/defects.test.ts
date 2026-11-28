/** Tests for defect kinds and route layouts. Run with: npm test */
import { describe, it, expect } from 'vitest';
import { chooseSectionKinds, defectPeaks, seededRandom, hashSeed, DEFECT_KINDS, type DefectKind } from './defects';

describe('seeded routes', () => {
  it('the same seed always gives the same layout; different seeds differ', () => {
    const a = chooseSectionKinds(20, 'coast', seededRandom(hashSeed('job-1')));
    const b = chooseSectionKinds(20, 'coast', seededRandom(hashSeed('job-1')));
    const c = chooseSectionKinds(20, 'coast', seededRandom(hashSeed('job-2')));
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });

  it('opens with two forgiving sections for a first job', () => {
    const k = chooseSectionKinds(10, 'mountain', seededRandom(1), true);
    expect(k.slice(0, 2)).toEqual(['wear', 'wear']);
  });

  it('never three of the same kind in a row', () => {
    for (let seed = 0; seed < 50; seed++) {
      const k = chooseSectionKinds(30, 'city', seededRandom(seed));
      for (let i = 2; i < k.length; i++) expect(k[i] === k[i - 1] && k[i] === k[i - 2]).toBe(false);
    }
  });

  it('routes lean towards their typical damage (mountain: gauge side, city: corrugation)', () => {
    const count = (region: 'mountain' | 'city', kind: DefectKind) =>
      chooseSectionKinds(2000, region, seededRandom(7)).filter((k) => k === kind).length;
    expect(count('mountain', 'gaugeFace')).toBeGreaterThan(count('city', 'gaugeFace'));
    expect(count('city', 'corrugation')).toBeGreaterThan(count('mountain', 'corrugation'));
  });
});

describe('defect shapes need different techniques', () => {
  const r = seededRandom(3);
  it('gauge-face wear sits at the very edge, only reachable with a steep angle', () => {
    for (const p of defectPeaks('gaugeFace', r)) expect(p.cx).toBeLessThan(-26);
  });
  it('head checks are deep and narrow at the gauge corner', () => {
    const main = defectPeaks('headCheck', r)[0];
    expect(main.cx).toBeLessThan(-18);
    expect(main.sigma).toBeLessThanOrEqual(3);
    expect(main.base).toBeGreaterThan(0.2);
  });
  it('a flattened crown is broad and centred', () => {
    const p = defectPeaks('flatCrown', r)[0];
    expect(Math.abs(p.cx)).toBeLessThan(4);
    expect(p.sigma).toBeGreaterThan(10);
  });
  it('every kind has a name and a tip', () => {
    for (const info of Object.values(DEFECT_KINDS)) { expect(info.name.length).toBeGreaterThan(3); expect(info.tip.length).toBeGreaterThan(10); }
  });
});
