/**
 * Tests for game/sectionMetrics.ts — how a whole 20m section is judged.
 */

import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { RailTrack } from '../rail/RailTrack';
import { RailProfile } from '../rail/RailProfile';
import { sectionAccuracy, sectionMeanAccuracy, sectionWorstDeviation } from './sectionMetrics';
import type { TargetProfile } from '../types/rail';

const target: TargetProfile = { name: 'test', points: RailProfile.createAREMA136RE(), tolerance: 0.05 };

function makeTrack(): RailTrack {
  return new RailTrack(
    [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 150), new THREE.Vector3(0, 0, 300)],
    undefined, 5, 50,
  );
}

/** Leave extra metal across the whole head of one rail in one visual segment */
function damage(track: RailTrack, vi: number, rail: 'left' | 'right'): void {
  for (const p of track.getProfile(vi, rail).points) p.y -= 0.2;
}

describe('sectionMetrics', () => {
  it('a fresh section is perfect', () => {
    const track = makeTrack();
    expect(sectionAccuracy(track, target, 0)).toBe(1);
    expect(sectionMeanAccuracy(track, target, 0)).toBe(1);
    expect(sectionWorstDeviation(track, target, 0)).toBe(0);
  });

  it('one bad 5m stretch fails the whole section (regression: only the stretch under the grinder used to count)', () => {
    const track = makeTrack();
    const [first, , , last] = track.getSegmentsForSection(0);
    damage(track, last, 'right');
    expect(sectionAccuracy(track, target, 0)).toBe(0);       // worst stretch decides completion
    expect(sectionMeanAccuracy(track, target, 0)).toBeCloseTo(7 / 8, 5); // 7 of 8 profiles still perfect
    expect(sectionWorstDeviation(track, target, 0)).toBeCloseTo(0.2, 5);
    // the damaged stretch belongs to section 0 only
    expect(sectionAccuracy(track, target, 1)).toBe(1);
    expect(first).toBeLessThan(last);
  });
});
