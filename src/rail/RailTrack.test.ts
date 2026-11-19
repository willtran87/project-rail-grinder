/**
 * Tests for RailTrack section bookkeeping.
 * Run with: npm test
 *
 * Layout reminder: the track has a lead-in (sectionOffset metres) before
 * section 1, then 20m game sections, each made of four 5m visual segments,
 * then run-out track after the last section.
 */

import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { RailTrack } from './RailTrack';

const OFFSET = 50;
const SECTIONS = 5;

// A straight 300m track: 50m lead-in + 5 sections (100m) + plenty of run-out
function makeTrack(): RailTrack {
  return new RailTrack(
    [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 150), new THREE.Vector3(0, 0, 300)],
    undefined, SECTIONS, OFFSET,
  );
}

describe('RailTrack.getSectionIndex', () => {
  const track = makeTrack();

  it('caps the section count at the job definition', () => {
    expect(track.sectionCount).toBe(SECTIONS);
  });

  it('returns -1 on the lead-in (regression: grinding there used to complete section 1)', () => {
    expect(track.getSectionIndex(0)).toBe(-1);
    expect(track.getSectionIndex(OFFSET - 0.1)).toBe(-1);
  });

  it('maps distances inside the scored area to sections', () => {
    expect(track.getSectionIndex(OFFSET)).toBe(0);
    expect(track.getSectionIndex(OFFSET + 19.9)).toBe(0);
    expect(track.getSectionIndex(OFFSET + 20)).toBe(1);
    expect(track.getSectionIndex(OFFSET + SECTIONS * 20 - 0.1)).toBe(SECTIONS - 1);
  });

  it('returns -1 on the run-out (regression: grinding there used to complete the last section)', () => {
    expect(track.getSectionIndex(OFFSET + SECTIONS * 20)).toBe(-1);
    expect(track.getSectionIndex(250)).toBe(-1);
  });
});

describe('RailTrack.getSegmentsForSection', () => {
  const track = makeTrack();

  it('gives four consecutive 5m visual segments per section, after the lead-in', () => {
    expect(track.getSegmentsForSection(0)).toEqual([10, 11, 12, 13]); // 50m / 5m = 10
    expect(track.getSegmentsForSection(1)).toEqual([14, 15, 16, 17]);
  });

  it('agrees with getSectionIndex for every segment', () => {
    for (let sec = 0; sec < SECTIONS; sec++) {
      for (const vi of track.getSegmentsForSection(sec)) {
        const midDistance = vi * 5 + 2.5;
        expect(track.getSectionIndex(midDistance)).toBe(sec);
      }
    }
  });
});
