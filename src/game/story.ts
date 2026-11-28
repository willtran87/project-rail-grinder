/**
 * story.ts - A thread of radio chatter that follows your career: the
 * dispatcher (Marge, at the Division office) gets to know Grinder 42 and
 * trusts you with harder routes. One "beat" plays at the start of a job once
 * you've done enough jobs; each beat plays once (saved).
 */

import { loadJSON, saveJSON } from '../core/storage';

export interface StoryLine { from: string; text: string }
export interface StoryBeat { id: string; afterJobs: number; lines: StoryLine[] }

const M = 'DISPATCH · MARGE';
export const STORY: StoryBeat[] = [
  { id: 'hello', afterJobs: 0, lines: [
    { from: M, text: 'Grinder 42, this is Marge at Division. First day? Nice and steady. Watch the profile, not the scenery.' },
  ] },
  { id: 'second', afterJobs: 1, lines: [
    { from: M, text: 'Heard the track inspectors liked your last job. Don\'t let it go to your head.' },
  ] },
  { id: 'crew', afterJobs: 2, lines: [
    { from: 'CREW · TEO', text: 'Teo on the crew car. Coffee\'s on. If the stones start glazing, ease off — trust me.' },
  ] },
  { id: 'trust', afterJobs: 4, lines: [
    { from: M, text: 'The superintendent asked who\'s running 42. I told her. You\'re getting the harder contracts now.' },
  ] },
  { id: 'storm', afterJobs: 6, lines: [
    { from: M, text: 'Weather service says it\'ll be a rough one. The freights still have to run — so do we.' },
  ] },
  { id: 'rival', afterJobs: 8, lines: [
    { from: 'GRINDER 17', text: 'Grinder 17 here. Saw your numbers on the board. Enjoy the top spot while it lasts.' },
  ] },
  { id: 'teo', afterJobs: 10, lines: [
    { from: 'CREW · TEO', text: 'Ten jobs together. The crew voted: you can pick the paint next time we\'re in the shop.' },
  ] },
  { id: 'mainline', afterJobs: 13, lines: [
    { from: M, text: 'They\'re routing the hot intermodals over your track now. That\'s the best compliment there is.' },
  ] },
  { id: 'veteran', afterJobs: 18, lines: [
    { from: M, text: 'Remember your first day? Neither do the rails. They just remember you were good to them.' },
  ] },
];

const KEY = 'story-v1';

/** The next beat to play (or null), given how many jobs are done */
export function nextStoryBeat(jobsDone: number): StoryBeat | null {
  const seen = loadJSON<string[]>(KEY, []);
  return STORY.find((b) => b.afterJobs <= jobsDone && !seen.includes(b.id)) ?? null;
}

export function markStorySeen(id: string): void {
  const seen = loadJSON<string[]>(KEY, []);
  if (!seen.includes(id)) saveJSON(KEY, [...seen, id]);
}

// ---------------------------------------------------------------------------
// Crew stories: each hired crew member has a short arc, a line at the start
// of their 1st, 4th and 8th job with you.
// ---------------------------------------------------------------------------

export const CREW_STORIES: Record<string, string[]> = {
  firewatch: [
    'Dee here, fire watch. I grew up on a ranch that burned. Hot stones, dry grass: I\'ll be watching.',
    'Spotted a grass fire start behind you last week before it was the size of a hat. That\'s the job.',
    'Got my wildland qualification renewed. Still say the best fire is the one that never starts.',
  ],
  welder: [
    'Sam Okafor, welder. Find me a broken rail and I\'ll have it whole before your coffee\'s cold.',
    'Thermite weld is half chemistry, half patience. You\'re learning the patience part, 42.',
    'Teaching my daughter to weld this summer. Told her about you — the operator who never over-grinds. Mostly.',
  ],
  mechanic: [
    'Ray Kowalski. I keep the stones turning. Change them before they glaze and we\'ll get along.',
    'Rebuilt the number three motor last night. Hum on it now is like a cat. Listen for it.',
    'Thirty-one years on these machines. You\'re the first operator who asks how they work. Means a lot.',
  ],
  spotter: [
    'June Park, spotter. When dispatch calls an emergency, I\'ll get you the location first.',
    'Walked the whole division on foot once. Every curve has a story. Most of them are about rails.',
    'Dispatch wants me in the office. Told them I\'d rather be out here with Grinder 42.',
  ],
};
const CREW_JOBS_KEY = 'crew-jobs-v1';
/** Jobs done with each crew member */
export function loadCrewJobs(): Record<string, number> { return loadJSON<Record<string, number>>(CREW_JOBS_KEY, {}); }
export function addCrewJob(ids: string[]): void {
  const all = loadCrewJobs();
  for (const id of ids) all[id] = (all[id] ?? 0) + 1;
  saveJSON(CREW_JOBS_KEY, all);
}
/** A crew member's line for this job, if it's one of their story jobs (1st, 4th, 8th) */
export function crewBeat(ids: string[]): StoryLine | null {
  const jobs = loadCrewJobs();
  for (const id of ids) {
    const n = jobs[id] ?? 0;
    const i = [0, 3, 7].indexOf(n);
    if (i >= 0 && CREW_STORIES[id]) return { from: `CREW · ${id.toUpperCase()}`, text: CREW_STORIES[id][i] };
  }
  return null;
}

/** Marge remembers your career now and then */
export function margeRemark(s: { jobs: number; bestCombo: number; perfects: number; sGrades: number }): string | null {
  if (s.jobs > 0 && s.jobs % 10 === 0) return `That's contract number ${s.jobs} for Grinder 42. The division has noticed.`;
  if (s.bestCombo >= 8 && s.jobs % 7 === 3) return `Still talking about that ${s.bestCombo}-section streak of yours in the office.`;
  if (s.perfects >= 25 && s.jobs % 9 === 5) return `${s.perfects} perfect passes. The inspectors have stopped checking your sections.`;
  if (s.sGrades >= 1 && s.jobs % 11 === 6) return `An S grade on the board with your name on it. Do it again, would you?`;
  return null;
}
