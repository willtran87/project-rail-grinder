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
