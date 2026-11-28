/**
 * RevenueTrainDeadline - The "beat the train" pressure system.
 *
 * Cycle:
 *   1. Quiet period (30s) — no train scheduled.
 *   2. Dispatch schedules a revenue train 2-4 minutes out. A countdown appears
 *      and the train icon creeps along the track map toward the grinder.
 *   3. At 30s remaining, a locomotive horn sounds.
 *   4. When the train arrives: if the player cleared at least one section since
 *      the countdown began, good. If not, the train was delayed — that's a
 *      "missed window", and each one costs a star on the final report.
 *   5. Back to step 1.
 */

import type { TrackMap } from '../ui/TrackMap';
import type { FloatingScore } from '../ui/FloatingScore';
import type { AudioManager } from '../audio/AudioManager';

const QUIET_PERIOD = 30;   // seconds between trains
const MIN_WINDOW = 120;    // shortest countdown (s)
const WINDOW_RANGE = 120;  // countdown is MIN_WINDOW + random(0..WINDOW_RANGE)
const HORN_AT = 30;        // horn warning when this many seconds remain

export interface DeadlineDeps {
  trackMap: TrackMap;
  floatingScore: FloatingScore;
  audio: AudioManager;
  /** Audio can only play after the first user interaction */
  isAudioReady: () => boolean;
}

export class RevenueTrainDeadline {
  /** Trains that arrived with no sections cleared during their countdown */
  missedWindows = 0;

  private deps: DeadlineDeps;
  private bar: HTMLElement;
  private timeEl: HTMLElement;

  private active = false;
  private timer = 0;        // counts up during quiet period, down during countdown
  private total = 0;        // length of the current countdown
  private warned = false;
  private sectionsAtStart = 0;

  /** < 1: trains come sooner (heavy-traffic modifier) */
  pace = 1;

  /**
   * Ask dispatch to hold the revenue train: +seconds on the current countdown.
   * @returns false if no train is coming
   */
  requestHold(seconds: number): boolean {
    if (!this.active) return false;
    this.timer += seconds;
    this.total += seconds;
    this.warned = false;
    return true;
  }

  /** Seconds left before the revenue train arrives, or null if none is coming */
  get secondsLeft(): number | null {
    return this.active ? Math.max(0, this.timer) : null;
  }

  constructor(deps: DeadlineDeps) {
    this.deps = deps;
    this.bar = document.getElementById('deadline-bar')!;
    this.timeEl = document.getElementById('deadline-time')!;
  }

  /** Clear everything for a fresh job */
  reset(): void {
    this.missedWindows = 0;
    this.cancel();
  }

  /** Stop any countdown in progress and hide the UI (keeps missedWindows) */
  cancel(): void {
    this.active = false;
    this.timer = 0;
    this.bar.style.display = 'none';
    this.deps.trackMap.setRevenueTrainPosition(-1);
  }

  /**
   * @param sectionsCompleted - how many sections are done right now
   * @param grinderT - grinder's position along the scored area, 0..1 (for the map icon)
   */
  update(dt: number, sectionsCompleted: number, grinderT: number): void {
    const { trackMap, floatingScore, audio } = this.deps;
    const audioOn = this.deps.isAudioReady();

    // ---- Quiet period: wait, then schedule a train ----
    if (!this.active) {
      this.timer += dt;
      trackMap.setRevenueTrainPosition(-1);
      if (this.timer > QUIET_PERIOD * this.pace) {
        this.active = true;
        this.total = MIN_WINDOW + Math.random() * WINDOW_RANGE;
        this.timer = this.total;
        this.warned = false;
        this.sectionsAtStart = sectionsCompleted;
        this.bar.style.display = 'flex';
        if (audioOn) audio.playDing();
      }
      return;
    }

    // ---- Countdown ----
    this.timer -= dt;
    const remaining = Math.max(0, this.timer);
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);
    this.timeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Train icon moves from the far end of the map toward the grinder
    const progress = 1 - remaining / this.total;
    trackMap.setRevenueTrainPosition(1.0 - progress * (1.0 - grinderT));

    // Urgency colours
    if (remaining < 30) {
      this.timeEl.style.color = 'var(--ui-red)';
      this.bar.style.borderColor = 'rgba(255,50,50,0.5)';
    } else {
      this.timeEl.style.color = 'var(--ui-accent)';
      this.bar.style.borderColor = remaining < 60 ? 'rgba(255,100,0,0.3)' : 'rgba(255,100,0,0.2)';
    }

    if (remaining < HORN_AT && !this.warned) {
      this.warned = true;
      if (audioOn) audio.playTrainHorn();
    }

    // ---- Train arrives ----
    if (remaining <= 0) {
      this.cancel();
      const cleared = sectionsCompleted - this.sectionsAtStart;
      if (cleared > 0) {
        floatingScore.show(`${cleared} sections cleared!`, '#44ff44');
        if (audioOn) audio.playSegmentComplete();
      } else {
        this.missedWindows++;
        floatingScore.show('TRAIN DELAYED — NO SECTIONS CLEARED', '#ff4444');
        setTimeout(() => {
          floatingScore.show('-1 ★ ON FINAL REPORT', '#ff4444',
            window.innerWidth / 2, window.innerHeight / 2 - 30);
        }, 400);
      }
    }
  }
}
