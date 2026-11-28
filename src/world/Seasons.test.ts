import { describe, it, expect } from 'vitest';
import { seasonForMonth, SEASON_LOOK } from './Seasons';

describe('seasons', () => {
  it('maps every month to a northern-hemisphere season', () => {
    expect([0, 1, 11].map(seasonForMonth)).toEqual(['winter', 'winter', 'winter']);
    expect([2, 3, 4].map(seasonForMonth)).toEqual(['spring', 'spring', 'spring']);
    expect([5, 6, 7].map(seasonForMonth)).toEqual(['summer', 'summer', 'summer']);
    expect([8, 9, 10].map(seasonForMonth)).toEqual(['autumn', 'autumn', 'autumn']);
  });

  it('summer is the untouched default look', () => {
    expect(SEASON_LOOK.summer.grassAmount).toBe(0);
    expect(SEASON_LOOK.summer.canopyScale).toBe(1);
  });
});
