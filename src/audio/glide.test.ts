/**
 * glide() must not flood the audio engine: one update per real change,
 * at most every 50 ms per parameter. Run with: npm test
 */
import { describe, it, expect } from 'vitest';
import { glide, forgetGlide } from './glide';

/** Just enough of an AudioParam to count what gets scheduled */
function fakeParam() {
  const calls: Array<[number, number]> = [];
  return { calls, setTargetAtTime(v: number, t: number) { calls.push([v, t]); return this; } } as unknown as AudioParam & { calls: Array<[number, number]> };
}

describe('glide', () => {
  it('sends at most one update per 50 ms, however often it is called', () => {
    const p = fakeParam();
    for (let i = 0; i < 60; i++) glide(p, i, i / 60); // one second at 60 fps, value changing every frame
    expect(p.calls.length).toBeGreaterThan(15);
    expect(p.calls.length).toBeLessThanOrEqual(21);
  });

  it('sends nothing when the value does not change', () => {
    const p = fakeParam();
    for (let i = 0; i < 60; i++) glide(p, 0.5, i / 60);
    expect(p.calls.length).toBe(1);
  });

  it('after forgetGlide, the same value is sent again (e.g. fading back in after a fade-out)', () => {
    const p = fakeParam();
    glide(p, 0.3, 0);
    forgetGlide(p);
    glide(p, 0.3, 0.01);
    expect(p.calls.length).toBe(2);
  });
});
