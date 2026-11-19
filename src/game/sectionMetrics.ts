/**
 * sectionMetrics.ts - Measure how good a whole 20m game section is.
 *
 * A section is made of several 5m visual segments, each with a left and
 * right rail profile. These helpers summarise all of them.
 */

import type { RailTrack } from '../rail/RailTrack';
import type { TargetProfile } from '../types/rail';

const RAILS = ['left', 'right'] as const;

/** Run `fn` on the comparison result of every profile (both rails) in a section */
function forEachProfile(
  track: RailTrack, target: TargetProfile, sec: number,
  fn: (withinTolerance: number, averageDeviation: number) => void,
): void {
  for (const vi of track.getSegmentsForSection(sec)) {
    for (const rail of RAILS) {
      const dev = track.getProfile(vi, rail).compare(target);
      fn(dev.withinTolerance, dev.averageDeviation);
    }
  }
}

/**
 * The WORST "within tolerance" fraction in the section. Used for completion:
 * a section is only as good as its worst stretch of rail.
 */
export function sectionAccuracy(track: RailTrack, target: TargetProfile, sec: number): number {
  let worst = 1;
  forEachProfile(track, target, sec, (acc) => { if (acc < worst) worst = acc; });
  return worst;
}

/** The AVERAGE "within tolerance" fraction — used for the progress fill */
export function sectionMeanAccuracy(track: RailTrack, target: TargetProfile, sec: number): number {
  let total = 0;
  let count = 0;
  forEachProfile(track, target, sec, (acc) => { total += acc; count++; });
  return count > 0 ? total / count : 1;
}

/** The worst average deviation (mm) in the section — used for severity ranking */
export function sectionWorstDeviation(track: RailTrack, target: TargetProfile, sec: number): number {
  let worst = 0;
  forEachProfile(track, target, sec, (_acc, dev) => { if (dev > worst) worst = dev; });
  return worst;
}
