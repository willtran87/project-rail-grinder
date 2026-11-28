/**
 * scoring.ts - Skill scoring on top of the basic stars: perfect passes,
 * the combo multiplier, bonus pay, and the job grade.
 *
 *   PERFECT PASS - a section finished in ONE pass, very accurate, with no
 *                  over-grind and the stones never overheated.
 *   COMBO        - consecutive 3-star sections raise a multiplier
 *                  (×1, ×1.25, ×1.5 … up to ×3) on section bonuses. Over-grinding,
 *                  overheating, or finishing a section with fewer than 3 stars
 *                  breaks it.
 *   BONUS PAY    - every finished section earns a bonus (more for more stars,
 *                  extra for a perfect pass) times the combo multiplier, paid
 *                  on top of the contract at the end of the job.
 *   GRADE        - S / A / B / C / D for the whole job.
 *
 * Pure logic (no Three.js / DOM): unit-tested in scoring.test.ts.
 */

/** Accuracy a section needs for a perfect pass (completion itself needs 0.8) */
export const PERFECT_ACCURACY = 0.9;
/** Stone heat at or above this counts as overheated (breaks combos, spoils perfects) */
export const OVERHEAT = 80;
/** Stone heat from here up to OVERHEAT is the "hot cut" zone: faster cutting, more risk */
export const HOT_CUT = 60;

/** What happened while grinding one section */
export interface SectionRun {
  /** Times the grinder left the section while grinding before it was finished */
  passes: number;
  /** Over-ground points found in the section */
  damage: number;
  /** Highest stone heat while grinding it */
  maxHeat: number;
}

export function isPerfectPass(accuracy: number, run: SectionRun): boolean {
  return run.passes <= 1 && run.damage === 0 && run.maxHeat < OVERHEAT && accuracy >= PERFECT_ACCURACY;
}

/** Bonus pay for one section (before the combo multiplier) */
export function sectionBonusBase(stars: number, perfect: boolean): number {
  const byStars = [0, 15, 35, 70][Math.max(0, Math.min(3, stars))];
  return byStars + (perfect ? 100 : 0);
}

/** Running combo of 3-star sections */
export class Combo {
  /** Consecutive 3-star sections */
  count = 0;
  /** Best combo this job */
  best = 0;

  /** ×1 for the first, +0.25 for each one after, capped at ×3 */
  get multiplier(): number {
    return Math.min(3, 1 + 0.25 * Math.max(0, this.count - 1));
  }

  /**
   * A section was finished. Returns the bonus to pay for it (with the
   * multiplier as it stands after this section).
   */
  sectionDone(stars: number, perfect: boolean): number {
    if (stars >= 3) {
      this.count++;
      this.best = Math.max(this.best, this.count);
    } else {
      this.count = 0;
    }
    return Math.round(sectionBonusBase(stars, perfect) * (stars >= 3 ? this.multiplier : 1));
  }

  /** Over-grind or overheat: the streak is gone. Returns true if there was one to lose. */
  break(): boolean {
    const had = this.count > 0;
    this.count = 0;
    return had;
  }

  reset(): void { this.count = 0; this.best = 0; }
}

export type Grade = 'S' | 'A' | 'B' | 'C' | 'D';

/**
 * Job grade from the job's stars (1-5), how many sections were perfect,
 * and the best combo, relative to the number of sections.
 */
export function jobGrade(stars: number, perfects: number, bestCombo: number, sections: number): Grade {
  const n = Math.max(1, sections);
  const skill = stars / 5 * 0.6 + (perfects / n) * 0.25 + Math.min(1, bestCombo / n) * 0.15;
  return skill >= 0.92 ? 'S' : skill >= 0.78 ? 'A' : skill >= 0.62 ? 'B' : skill >= 0.45 ? 'C' : 'D';
}

/** Colour for showing a grade */
export const GRADE_COLORS: Record<Grade, string> = {
  S: '#ffd84a', A: '#7dff8a', B: '#8ad0ff', C: '#e0e0e0', D: '#ff8a7a',
};
