import { describe, it, expect } from 'vitest';
import { phaseBlend } from './DayNightCycle';
import { nextWeatherState, CLIMATES } from './Weather';
import { freightAllowedSpeed, WORK_ZONE_SPEED } from './PassingTrain';
import { approachSpeedLimit } from '../game/rules';

describe('time of day (phaseBlend)', () => {
  it('holds each phase for the first half of its slot', () => {
    expect(phaseBlend(1.0)).toEqual({ from: 1, to: 2, f: 0 });
    expect(phaseBlend(1.4).f).toBe(0);
  });

  it('eases into the next phase over the second half', () => {
    expect(phaseBlend(1.75).f).toBeCloseTo(0.5, 5);
    expect(phaseBlend(1.999).f).toBeGreaterThan(0.99);
  });

  it('night blends back into dawn', () => {
    const b = phaseBlend(3.9);
    expect(b.from).toBe(3);
    expect(b.to).toBe(0);
  });
});

describe('weather director (nextWeatherState)', () => {
  /** A fake random source that returns the given numbers in turn */
  const seq = (...v: number[]) => { let i = 0; return () => v[i++ % v.length]; };

  it('showers never exceed the climate maximum', () => {
    for (const c of Object.values(CLIMATES)) {
      for (let r = 0; r < 1; r += 0.05) {
        const s = nextWeatherState(c, seq(0, r, r, r));
        expect(s.intensity).toBeLessThanOrEqual(c.maxIntensity + 1e-9);
      }
    }
  });

  it('cloudy and clear states are dry', () => {
    const c = CLIMATES.prairie;
    expect(nextWeatherState(c, seq(0.999, 0.5, 0.5)).intensity).toBe(0);
    expect(nextWeatherState(c, seq(c.showerChance + 0.01, 0.5, 0.5)).intensity).toBe(0);
  });

  it('each state lasts 50–120 s', () => {
    for (const r of [0, 0.5, 0.999]) {
      const d = nextWeatherState(CLIMATES.city, seq(0.9, r, r)).duration;
      expect(d).toBeGreaterThanOrEqual(50);
      expect(d).toBeLessThanOrEqual(120);
    }
  });

  it('only Marias Pass is a snow route', () => {
    expect(CLIMATES.mountain.precip).toBe('snow');
    expect(CLIMATES.mountain.snowCover).toBeGreaterThan(0);
    for (const k of ['prairie', 'city', 'coast'] as const) expect(CLIMATES[k].precip).toBe('rain');
  });
});

describe('freight past the work crew (freightAllowedSpeed)', () => {
  const zone = { start: 100, end: 300 };

  it('crawls at work-zone speed while any part of it is in the zone', () => {
    expect(freightAllowedSpeed(150, 40, zone.start, zone.end, 30)).toBe(WORK_ZONE_SPEED);
    expect(freightAllowedSpeed(400, 290, zone.start, zone.end, 30)).toBe(WORK_ZONE_SPEED);
  });

  it('is back to line speed once the last car is past', () => {
    expect(freightAllowedSpeed(420, 310, zone.start, zone.end, 30)).toBe(30);
  });

  it('braking curve: allowed speed falls smoothly to work-zone speed at the zone edge', () => {
    let last = Infinity;
    for (let front = -400; front <= zone.start; front += 10) {
      const v = freightAllowedSpeed(front, front - 112, zone.start, zone.end, 35);
      expect(v).toBeLessThanOrEqual(last + 1e-9);
      last = v;
    }
    expect(last).toBeCloseTo(WORK_ZONE_SPEED, 5);
  });
});

describe('slow-order approach (approachSpeedLimit)', () => {
  it('equals the limit at the boundary and rises with distance', () => {
    expect(approachSpeedLimit(2, 10, 0)).toBe(2);
    expect(approachSpeedLimit(2, 10, 45)).toBeCloseTo(Math.sqrt(4 + 900), 5);
    expect(approachSpeedLimit(2, 10, 10)).toBeLessThan(approachSpeedLimit(2, 10, 20));
  });

  it('a train braking at that rate really does reach the limit in time', () => {
    // As in Game: plan with 8 m/s² (20% in reserve), brake at 10 m/s² when over
    let pos = 0, v = 30;
    const boundary = 80, dt = 1 / 60;
    while (pos < boundary) {
      const allowed = approachSpeedLimit(2, 8, boundary - pos);
      if (v > allowed) v = Math.max(allowed, v - 10 * dt);
      pos += v * dt;
    }
    // Within one frame of the limit (inside the slow order it is then held at exactly 2)
    expect(v).toBeLessThanOrEqual(2.15);
  });
});
