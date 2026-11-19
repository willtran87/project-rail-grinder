/**
 * progress.ts - Personal bests per job, saved in the browser.
 *
 * mergeResult() is pure (easy to test); loadRecords()/recordResult() add
 * the localStorage reading and writing on top.
 */

import { loadJSON, saveJSON } from '../core/storage';

export interface JobRecord {
  bestStars: number;     // 1-5
  bestRQI: number;       // 0-100
  bestTime: number;      // seconds (lower is better)
  completions: number;
}

export interface JobResult {
  stars: number;
  rqi: number;
  time: number;          // seconds
}

export interface MergeOutcome {
  record: JobRecord;
  /** True if this run beat the previous best stars, or best RQI at equal stars */
  newBest: boolean;
}

const STORAGE_KEY = 'records-v1';

/** Combine a finished run with the previous record (if any) */
export function mergeResult(prev: JobRecord | undefined, result: JobResult): MergeOutcome {
  if (!prev) {
    return {
      record: { bestStars: result.stars, bestRQI: result.rqi, bestTime: result.time, completions: 1 },
      newBest: true,
    };
  }
  const newBest = result.stars > prev.bestStars
    || (result.stars === prev.bestStars && result.rqi > prev.bestRQI);
  return {
    record: {
      bestStars: Math.max(prev.bestStars, result.stars),
      bestRQI: Math.max(prev.bestRQI, result.rqi),
      bestTime: Math.min(prev.bestTime, result.time),
      completions: prev.completions + 1,
    },
    newBest,
  };
}

/** All saved records, keyed by job id */
export function loadRecords(): Record<string, JobRecord> {
  return loadJSON<Record<string, JobRecord>>(STORAGE_KEY, {});
}

/** Save a finished job and report whether it was a personal best */
export function recordResult(jobId: string, result: JobResult): MergeOutcome {
  const records = loadRecords();
  const outcome = mergeResult(records[jobId], result);
  records[jobId] = outcome.record;
  saveJSON(STORAGE_KEY, records);
  return outcome;
}

/** "4:07" style time */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
