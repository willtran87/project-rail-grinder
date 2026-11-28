/**
 * lessons - The staged tutorial.
 *
 * Job 1 is the guided tutorial (ui/GuidedTutorial: grind, aim, pressure).
 * Each later job teaches ONE more thing, and only switches that thing on
 * when it's taught, so a new player isn't hit by everything at once:
 *
 *   job 2  heat & the hot-cut band, combos           (fires can start)
 *   job 3  stone wear, grinding speed, the train hold
 *   job 4  work crews and broken rails               (they now appear)
 *
 * After that everything is on and there are no more lessons.
 */

export interface Lesson {
  /** Shown after this many finished jobs (so job N+1 shows lesson N) */
  afterJobs: number;
  title: string;
  lines: string[];
}

export const LESSONS: Lesson[] = [
  {
    afterJobs: 1, title: 'Heat & combos',
    lines: [
      'Grinding heats the stones. In the orange band (60–80%) they cut faster.',
      'Past 80% they overheat and cut badly. Lift off (SPACE) to let them cool.',
      'Three-star sections in a row build a combo that multiplies your bonus.',
      'Hot stones on dry days can start a grass fire. Stop beside it and hold X to spray it.',
    ],
  },
  {
    afterJobs: 2, title: 'Stones, speed & the revenue train',
    lines: [
      'Stones wear as they cut (STONE % under the heat bar). Stop and hold Z to fit new ones.',
      'While grinding, W / S set the grinding speed. Slower cuts deeper but costs time.',
      'When a revenue train is due, press T to ask dispatch for a 60 s hold. It costs $500.',
    ],
  },
  {
    afterJobs: 3, title: 'Working on a live railroad',
    lines: [
      'Work crews stand beside the track. Pass them under 8 mph or it\'s a safety fine.',
      'A red flag means a BROKEN RAIL ahead. Stop short and wait while it\'s welded.',
    ],
  },
];

/** What's switched on for a player who has finished this many jobs */
export function featuresFor(jobsDone: number): { fires: boolean; wearAndHold: boolean; crews: boolean } {
  return { fires: jobsDone >= 1, wearAndHold: jobsDone >= 2, crews: jobsDone >= 3 };
}

/** The lesson to show at the start of the next job, if any */
export function lessonFor(jobsDone: number): Lesson | null {
  return LESSONS.find((l) => l.afterJobs === jobsDone) ?? null;
}
