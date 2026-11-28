/**
 * coach - Live coaching: a short callout the moment you make a mistake, and
 * it RETIRES once you've shown you've learned it (three finished sections in
 * a row without making it again). Retired tips stay retired (saved), so a
 * seasoned player is never nagged.
 *
 * Pure logic + a tiny bit of storage; Game decides when a mistake happened.
 */

import { loadJSON, saveJSON } from '../core/storage';

export type Mistake = 'pressure' | 'offTarget' | 'heat' | 'chatter' | 'speed';

export const COACH_LINES: Record<Mistake, string> = {
  pressure: 'Too much pressure for this hump — ease off (A / J)',
  offTarget: 'The stone is off the hump — line it up with the AIM marker',
  heat: 'Stones in the red — lift (SPACE) for a moment to cool them',
  chatter: 'Corrugation chatters under heavy pressure — go light and wide',
  speed: 'Deep humps — slow the grinding speed (S) for more metal per pass',
};

/** Clean sections in a row before a tip retires */
export const CLEAN_TO_RETIRE = 3;
/** Seconds before the same tip can show again */
export const REPEAT_SECONDS = 25;

export interface CoachState {
  retired: Mistake[];
  /** Clean sections in a row since each mistake was last made */
  clean: Partial<Record<Mistake, number>>;
}

const KEY = 'coach-v1';
export function loadCoach(): CoachState {
  return { retired: [], clean: {}, ...loadJSON<Partial<CoachState>>(KEY, {}) };
}
export function saveCoach(s: CoachState): void { saveJSON(KEY, s); }

export class Coach {
  state = loadCoach();
  private lastShown: Partial<Record<Mistake, number>> = {};
  /** Mistakes made in the section being worked on */
  private madeThisSection = new Set<Mistake>();

  /**
   * A mistake happened. Returns the line to show, or null (retired, or shown
   * a moment ago).
   */
  mistake(m: Mistake, now: number): string | null {
    this.madeThisSection.add(m);
    this.state.clean[m] = 0;
    if (this.state.retired.includes(m)) return null;
    if (now - (this.lastShown[m] ?? -999) < REPEAT_SECONDS) return null;
    this.lastShown[m] = now;
    return COACH_LINES[m];
  }

  /**
   * A section was finished: every tip not made this section counts a clean
   * one. Returns tips that just retired.
   */
  sectionDone(): Mistake[] {
    const retiredNow: Mistake[] = [];
    for (const m of Object.keys(COACH_LINES) as Mistake[]) {
      if (this.madeThisSection.has(m) || this.state.retired.includes(m)) continue;
      // Only count once it's been seen (a tip never needed isn't "learned")
      if (this.state.clean[m] === undefined) continue;
      this.state.clean[m] = (this.state.clean[m] ?? 0) + 1;
      if ((this.state.clean[m] ?? 0) >= CLEAN_TO_RETIRE) {
        this.state.retired.push(m);
        retiredNow.push(m);
      }
    }
    this.madeThisSection.clear();
    saveCoach(this.state);
    return retiredNow;
  }
}
