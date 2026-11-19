/**
 * Tests for game/progress.ts — personal-best bookkeeping.
 */

import { describe, it, expect } from 'vitest';
import { mergeResult, formatTime, recordResult, loadRecords } from './progress';

describe('mergeResult', () => {
  it('first completion is always a new best', () => {
    const { record, newBest } = mergeResult(undefined, { stars: 2, rqi: 70, time: 300 });
    expect(newBest).toBe(true);
    expect(record).toEqual({ bestStars: 2, bestRQI: 70, bestTime: 300, completions: 1 });
  });

  it('keeps the best of each stat independently', () => {
    const prev = { bestStars: 4, bestRQI: 88, bestTime: 400, completions: 2 };
    const { record, newBest } = mergeResult(prev, { stars: 3, rqi: 90, time: 350 });
    expect(record).toEqual({ bestStars: 4, bestRQI: 90, bestTime: 350, completions: 3 });
    expect(newBest).toBe(false); // fewer stars isn't a new best, even with better RQI
  });

  it('more stars, or equal stars with higher RQI, is a new best', () => {
    const prev = { bestStars: 3, bestRQI: 80, bestTime: 400, completions: 1 };
    expect(mergeResult(prev, { stars: 4, rqi: 70, time: 500 }).newBest).toBe(true);
    expect(mergeResult(prev, { stars: 3, rqi: 81, time: 500 }).newBest).toBe(true);
    expect(mergeResult(prev, { stars: 3, rqi: 80, time: 100 }).newBest).toBe(false);
  });
});

describe('storage fallback', () => {
  it('works without localStorage (records just are not persisted)', () => {
    // Vitest runs in Node, where localStorage doesn't exist
    expect(() => recordResult('test-job', { stars: 3, rqi: 80, time: 200 })).not.toThrow();
    expect(loadRecords()).toEqual({});
  });
});

describe('formatTime', () => {
  it('formats minutes and zero-padded seconds', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(599.9)).toBe('9:59');
  });
});
