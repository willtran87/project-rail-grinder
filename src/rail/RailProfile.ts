/**
 * RailProfile - The core data model for the entire game.
 *
 * A rail profile is a 2D cross-section of a rail head, represented as
 * an array of points. The x-axis is lateral position (gauge side is negative,
 * field side is positive). The y-axis is height (0 = top of new rail,
 * positive values mean material has been removed / surface is lower).
 *
 * Every game system reads from or writes to this profile:
 * - DefectGenerator adds deformations (bumps, waves, wear)
 * - GrindingSimulation removes material (lowers y values)
 * - ProfileComparator measures deviation from target
 * - ProfileRenderer draws it on screen
 * - RailSegment generates 3D geometry from it
 */

import type { ProfilePoint, ProfileDeviation, TargetProfile } from '../types/rail';

/** Spacing between profile points in mm */
const POINT_SPACING = 0.5;

/** Rail head lateral range in mm (gauge side to field side) */
const HEAD_MIN_X = -37;
const HEAD_MAX_X = 37;

/**
 * How far below the target (in multiples of the tolerance) a point may be and
 * still count as accurate for finishing a section. Over-grinding is still
 * flagged (red line, broken combo, fewer stars) as soon as it passes 1x.
 */
export const OVERGRIND_ALLOWANCE = 3;

export class RailProfile {
  points: ProfilePoint[];
  surfaceFinish: number;
  metalRemoved: number;
  temperature: number;
  /**
   * Goes up by one every time the points change. Anything that remembers a
   * result worked out from this profile (compare(), the profile display)
   * checks it to know when to work it out again.
   * If you change `points` directly, call markChanged() afterwards.
   */
  version = 0;

  // compare() writes into this one object instead of building a new one
  // (and a new 149-number array) on each of its ~20 calls a frame
  private cmpResult: ProfileDeviation = { averageDeviation: 0, maxDeviation: 0, pointDeviations: [], withinTolerance: 0 };

  constructor(points?: ProfilePoint[]) {
    this.points = points ?? RailProfile.createAREMA136RE();
    this.surfaceFinish = 0;
    this.metalRemoved = 0;
    this.temperature = 20; // ambient
  }

  /**
   * Create an approximation of the AREMA 136RE rail head profile.
   *
   * The 136RE is the most common rail profile in North American freight railroads.
   * Head width is ~74.6mm, with a crown radius of ~254mm (10 inches) on top,
   * transitioning to tighter radii at the gauge and field corners.
   *
   * We approximate this with three circular arcs:
   * - Center crown: R=254mm (the broad running surface)
   * - Gauge corner: R=38mm (tighter curve on the inner/gauge side)
   * - Field corner: R=13mm (tight curve on the outer/field side)
   */
  static createAREMA136RE(): ProfilePoint[] {
    const points: ProfilePoint[] = [];

    const crownRadius = 254;   // mm - main running surface
    const gaugeRadius = 38;    // mm - gauge corner
    const fieldRadius = 13;    // mm - field corner

    // Transition points (approximate)
    const gaugeTransition = -20; // mm from center
    const fieldTransition = 22;  // mm from center

    for (let x = HEAD_MIN_X; x <= HEAD_MAX_X; x += POINT_SPACING) {
      let y: number;

      if (x < gaugeTransition) {
        // Gauge corner region - tighter radius
        const dx = x - gaugeTransition;
        // Circular arc: y = R - sqrt(R^2 - dx^2), offset to match crown at transition
        const crownAtTransition = crownRadius - Math.sqrt(
          crownRadius * crownRadius - gaugeTransition * gaugeTransition
        );
        const gaugeOffset = gaugeRadius - Math.sqrt(
          Math.max(0, gaugeRadius * gaugeRadius - dx * dx)
        );
        y = crownAtTransition + gaugeOffset;
      } else if (x > fieldTransition) {
        // Field corner region - tight radius
        const dx = x - fieldTransition;
        const crownAtTransition = crownRadius - Math.sqrt(
          crownRadius * crownRadius - fieldTransition * fieldTransition
        );
        const fieldOffset = fieldRadius - Math.sqrt(
          Math.max(0, fieldRadius * fieldRadius - dx * dx)
        );
        y = crownAtTransition + fieldOffset;
      } else {
        // Crown region - main running surface
        // Circular arc centered above the rail
        y = crownRadius - Math.sqrt(
          crownRadius * crownRadius - x * x
        );
      }

      points.push({ x, y });
    }

    return points;
  }

  /** Create a deep copy of this profile */
  clone(): RailProfile {
    const copy = new RailProfile(
      this.points.map(p => ({ x: p.x, y: p.y }))
    );
    copy.surfaceFinish = this.surfaceFinish;
    copy.metalRemoved = this.metalRemoved;
    copy.temperature = this.temperature;
    return copy;
  }

  /**
   * Remove material at a specific lateral position.
   * This is the fundamental operation that grinding performs.
   *
   * @param centerX - Lateral center of the grindstone contact (mm)
   * @param contactWidth - Width of the contact zone (mm)
   * @param maxDepth - Maximum depth of material removal at center (mm)
   */
  removeMetalAt(centerX: number, contactWidth: number, maxDepth: number): void {
    const halfWidth = contactWidth / 2;

    for (const point of this.points) {
      const dist = Math.abs(point.x - centerX);
      if (dist < halfWidth) {
        // Parabolic falloff: deepest at center, zero at edges
        const t = dist / halfWidth;
        const depthFactor = 1 - t * t;
        const removal = maxDepth * depthFactor;

        // Material removal increases y (surface moves down)
        point.y += removal;
        this.metalRemoved += removal;
      }
    }

    this.version++;
    // Update surface finish based on uniformity of removal
    this.updateSurfaceFinish();
  }

  /** Call after changing `points` directly (see `version`) */
  markChanged(): void {
    this.version++;
  }

  /**
   * Compare this profile against a target profile.
   * Returns deviation metrics used for grading.
   */
  /**
   * How far this profile is from the target, point by point.
   * The same result object is reused by every call on this profile (no
   * garbage): read it straight away, don't change it or keep it.
   */
  compare(target: TargetProfile): ProfileDeviation {
    // Fixed-size array, written by index (setting length to 0 and pushing
    // again would make the JS engine reallocate its storage every call)
    const n = Math.min(this.points.length, target.points.length);
    if (this.cmpResult.pointDeviations.length !== n) this.cmpResult.pointDeviations = new Array<number>(n).fill(0);
    const deviations = this.cmpResult.pointDeviations;
    let totalDeviation = 0;
    let maxDev = 0;
    let withinCount = 0;

    // Compare at each point by matching x positions
    for (let i = 0; i < n; i++) {
      // Deviation: positive means current is too high (needs more grinding)
      // negative means over-ground (too much removed)
      const dev = target.points[i].y - this.points[i].y;
      deviations[i] = dev;

      const absDev = Math.abs(dev);
      totalDeviation += absDev;
      if (absDev > maxDev) maxDev = absDev;
      // A little too deep still passes (the stars pay for it): metal can't be
      // put back, so without this one slip could make a section unfinishable
      if (dev <= target.tolerance && dev >= -target.tolerance * OVERGRIND_ALLOWANCE) withinCount++;
    }

    const count = deviations.length || 1;
    const r = this.cmpResult;
    r.averageDeviation = totalDeviation / count;
    r.maxDeviation = maxDev;
    r.withinTolerance = withinCount / count;
    return r;
  }

  /**
   * Find the worst remaining deviation zone.
   * Returns the lateral position (x) and severity of the biggest problem area.
   */
  findWorstZones(target: TargetProfile, count: number = 3): Array<{ centerX: number; severity: number }> {
    const deviation = this.compare(target);
    const zones: Array<{ centerX: number; severity: number }> = [];

    // Scan for local maxima in the deviation curve
    for (let i = 2; i < deviation.pointDeviations.length - 2; i++) {
      const dev = deviation.pointDeviations[i];
      const absDev = Math.abs(dev);
      // Flag anything outside tolerance — if we hid smaller errors, the markers
      // could vanish while the section still fails its 80% accuracy check.
      if (absDev <= target.tolerance) continue;

      // A local peak of its own sign: a hump is the highest point among its
      // neighbours, a dip the deepest. (Comparing sizes only used to hide a
      // hump sitting next to a deeper over-ground dip: no marker, though
      // the section still needed grinding there.)
      const d = deviation.pointDeviations;
      const s = dev > 0 ? 1 : -1;
      if (s * dev >= Math.max(s * d[i - 2], s * d[i - 1], s * d[i + 1], s * d[i + 2])) {
        zones.push({ centerX: this.points[i].x, severity: dev });
      }
    }

    // Sort by absolute severity, then keep only zones that are well apart:
    // two peaks a few mm apart are really one defect (and their labels would overlap)
    // Humps (metal still to take off) first, then dips, each worst first: three
    // deep over-ground dips used to push a small remaining hump off the list,
    // so nothing pointed at the spot that still needed grinding
    zones.sort((a, b) => (b.severity > 0 ? 1 : 0) - (a.severity > 0 ? 1 : 0) || Math.abs(b.severity) - Math.abs(a.severity));
    const MIN_SEPARATION = 8; // mm
    const picked: Array<{ centerX: number; severity: number }> = [];
    for (const zone of zones) {
      if (picked.every(p => Math.abs(p.centerX - zone.centerX) >= MIN_SEPARATION)) {
        picked.push(zone);
        if (picked.length >= count) break;
      }
    }
    return picked;
  }

  /** Get the deviation at a specific x position relative to a target */
  getDeviationAtX(x: number, target: TargetProfile): number {
    const idx = Math.round((x - this.points[0].x) / 0.5);
    if (idx < 0 || idx >= this.points.length || idx >= target.points.length) return 0;
    return target.points[idx].y - this.points[idx].y;
  }

  /** Count how many points are over-ground relative to target */
  countOverground(target: TargetProfile): number {
    let count = 0;
    for (let i = 0; i < this.points.length && i < target.points.length; i++) {
      const dev = target.points[i].y - this.points[i].y;
      if (dev < -target.tolerance) count++;
    }
    return count;
  }

  /** Get the y value at a specific x position (interpolated) */
  getYAtX(x: number): number {
    // Find the two points bracketing this x
    for (let i = 0; i < this.points.length - 1; i++) {
      const p0 = this.points[i];
      const p1 = this.points[i + 1];
      if (x >= p0.x && x <= p1.x) {
        const t = (x - p0.x) / (p1.x - p0.x);
        return p0.y + t * (p1.y - p0.y);
      }
    }
    // Out of range - return edge value
    if (x <= this.points[0].x) return this.points[0].y;
    return this.points[this.points.length - 1].y;
  }

  /** Get the min and max y values (for rendering bounds) */
  getBounds(): { minX: number; maxX: number; minY: number; maxY: number } {
    let minY = Infinity, maxY = -Infinity;
    for (const p of this.points) {
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    return {
      minX: this.points[0].x,
      maxX: this.points[this.points.length - 1].x,
      minY,
      maxY,
    };
  }

  /** Calculate surface finish quality based on local curvature consistency */
  private updateSurfaceFinish(): void {
    if (this.points.length < 3) return;

    let totalVariation = 0;
    for (let i = 1; i < this.points.length - 1; i++) {
      // Second derivative approximation (curvature change)
      const d2y = this.points[i - 1].y - 2 * this.points[i].y + this.points[i + 1].y;
      totalVariation += Math.abs(d2y);
    }

    // Normalize: 0 = perfectly smooth, 1 = very rough
    this.surfaceFinish = Math.min(1, totalVariation / this.points.length * 10);
  }
}
