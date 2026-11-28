import { describe, it, expect } from 'vitest';
import { featuresFor, lessonFor, LESSONS } from './lessons';

describe('staged tutorial', () => {
  it('a brand-new player has none of the extra mechanics', () => {
    expect(featuresFor(0)).toEqual({ fires: false, wearAndHold: false, crews: false });
  });

  it('each mechanic switches on the job its lesson is shown', () => {
    expect(lessonFor(1)?.title).toMatch(/heat/i);
    expect(featuresFor(1).fires).toBe(true);
    expect(lessonFor(2)?.title).toMatch(/stones/i);
    expect(featuresFor(2).wearAndHold).toBe(true);
    expect(lessonFor(3)?.title).toMatch(/live railroad/i);
    expect(featuresFor(3).crews).toBe(true);
  });

  it('no lesson on the first job (the guided tutorial) or after the last', () => {
    expect(lessonFor(0)).toBeNull();
    expect(lessonFor(LESSONS.length + 1)).toBeNull();
    expect(featuresFor(50)).toEqual({ fires: true, wearAndHold: true, crews: true });
  });
});
