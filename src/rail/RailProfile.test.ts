/**
 * Tests for RailProfile — the core grinding math.
 * Run with: npm test
 *
 * Coordinate reminder: x = lateral mm (gauge side negative), y = depth in mm
 * (positive = further down / more metal removed). A defect that leaves the rail
 * "too high" has a SMALLER y than the target.
 */

import { describe, it, expect } from 'vitest';
import { RailProfile } from './RailProfile';
import type { TargetProfile } from '../types/rail';

const TOL = 0.05;

function makeTarget(): TargetProfile {
  return { name: 'test', points: RailProfile.createAREMA136RE(), tolerance: TOL };
}

/** Raise the rail surface (leave extra metal) by `amount` mm for points within [x0, x1] */
function addDefect(profile: RailProfile, x0: number, x1: number, amount: number): void {
  for (const p of profile.points) {
    if (p.x >= x0 && p.x <= x1) p.y -= amount;
  }
}

describe('RailProfile.compare', () => {
  it('a brand-new rail matches the target perfectly', () => {
    const result = new RailProfile().compare(makeTarget());
    expect(result.averageDeviation).toBe(0);
    expect(result.withinTolerance).toBe(1);
  });

  it('extra metal shows as positive deviation and lowers accuracy', () => {
    const profile = new RailProfile();
    addDefect(profile, -10, 10, 0.2);
    const result = profile.compare(makeTarget());
    expect(result.maxDeviation).toBeCloseTo(0.2, 5);
    expect(result.withinTolerance).toBeLessThan(1);
    // deviation is positive (too high) where the defect is
    expect(Math.max(...result.pointDeviations)).toBeGreaterThan(0);
  });

  it('a defect smaller than the tolerance still counts as accurate', () => {
    const profile = new RailProfile();
    addDefect(profile, -37, 37, TOL * 0.5);
    expect(profile.compare(makeTarget()).withinTolerance).toBe(1);
  });
});

describe('RailProfile.removeMetalAt', () => {
  it('removes the most metal at the centre of the stone', () => {
    const profile = new RailProfile();
    const before = profile.getYAtX(0);
    profile.removeMetalAt(0, 10, 0.1);
    expect(profile.getYAtX(0) - before).toBeCloseTo(0.1, 5);
  });

  it('falls off toward the edges and leaves metal outside the contact width alone', () => {
    const profile = new RailProfile();
    const target = makeTarget();
    profile.removeMetalAt(0, 10, 0.1); // half-width = 5mm
    const dev = profile.compare(target).pointDeviations;
    const devAt = (x: number) => dev[profile.points.findIndex(p => p.x === x)];

    expect(-devAt(0)).toBeCloseTo(0.1, 5);       // full depth at centre
    expect(-devAt(3)).toBeLessThan(0.1);           // shallower off-centre
    expect(-devAt(3)).toBeGreaterThan(0);
    expect(devAt(5)).toBe(0);                      // at/after the edge: untouched
    expect(devAt(20)).toBe(0);
  });

  it('grinding a defect away restores accuracy', () => {
    const profile = new RailProfile();
    const target = makeTarget();
    addDefect(profile, -2, 2, 0.1);
    expect(profile.compare(target).withinTolerance).toBeLessThan(1);

    // A narrow stone centred on the defect, removing exactly the extra metal
    for (const p of profile.points) {
      if (p.x >= -2 && p.x <= 2) p.y += 0.1; // perfect removal
    }
    expect(profile.compare(target).withinTolerance).toBe(1);
  });

  it('tracks total metal removed', () => {
    const profile = new RailProfile();
    profile.removeMetalAt(0, 10, 0.1);
    expect(profile.metalRemoved).toBeGreaterThan(0);
  });
});

describe('RailProfile.findWorstZones', () => {
  it('finds nothing on a perfect rail', () => {
    expect(new RailProfile().findWorstZones(makeTarget())).toHaveLength(0);
  });

  it('points at the centre of a defect', () => {
    const profile = new RailProfile();
    // Gaussian bump centred at x = 15
    for (const p of profile.points) {
      p.y -= 0.2 * Math.exp(-((p.x - 15) ** 2) / (2 * 4 * 4));
    }
    const zones = profile.findWorstZones(makeTarget(), 3);
    expect(zones.length).toBeGreaterThan(0);
    expect(zones[0].centerX).toBeCloseTo(15, 0);
    expect(zones[0].severity).toBeGreaterThan(0); // positive = needs grinding
  });

  it('flags deviations just above tolerance (regression: markers used to vanish below 1.5x tolerance)', () => {
    const profile = new RailProfile();
    addDefect(profile, -6, 6, TOL * 1.3); // out of tolerance, but < 1.5x
    expect(profile.findWorstZones(makeTarget()).length).toBeGreaterThan(0);
  });

  it('reports nearby peaks as one zone, but separate defects separately', () => {
    const profile = new RailProfile();
    // Two narrow bumps 3mm apart (one defect) + one far away at x = -25
    for (const p of profile.points) {
      p.y -= 0.15 * Math.exp(-((p.x - 10) ** 2) / 2);
      p.y -= 0.12 * Math.exp(-((p.x - 13) ** 2) / 2);
      p.y -= 0.2 * Math.exp(-((p.x + 25) ** 2) / 8);
    }
    const zones = profile.findWorstZones(makeTarget(), 3);
    expect(zones).toHaveLength(2);
    const xs = zones.map(z => z.centerX).sort((a, b) => a - b);
    expect(xs[0]).toBeCloseTo(-25, 0);
    expect(xs[1]).toBeGreaterThanOrEqual(9);
    expect(xs[1]).toBeLessThanOrEqual(14);
  });

  it('ignores deviations within tolerance', () => {
    const profile = new RailProfile();
    addDefect(profile, -6, 6, TOL * 0.9);
    expect(profile.findWorstZones(makeTarget())).toHaveLength(0);
  });
});

describe('RailProfile over-grinding', () => {
  it('counts points ground below the target', () => {
    const profile = new RailProfile();
    const target = makeTarget();
    expect(profile.countOverground(target)).toBe(0);
    profile.removeMetalAt(0, 10, 0.2); // way past tolerance at the centre
    expect(profile.countOverground(target)).toBeGreaterThan(0);
  });

  it('getDeviationAtX is negative where over-ground', () => {
    const profile = new RailProfile();
    profile.removeMetalAt(0, 10, 0.2);
    expect(profile.getDeviationAtX(0, makeTarget())).toBeCloseTo(-0.2, 5);
  });
});
