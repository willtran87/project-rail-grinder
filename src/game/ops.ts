/**
 * ops - Running the job (pure rules, unit-tested in ops.test.ts):
 *
 *   CUSTOMERS     who you're grinding for, and what they pay extra for
 *   STONE GRADES  swapping coarse / standard / fine stones mid-job
 *   MIRROR FINISH a section finished on fine stones, very accurately
 *   FAULTS        a stone motor or a hydraulic arm playing up mid-job
 *   HAZARDS       switches (lift the stones!) and quiet zones (go easy at night)
 */

import type { StoneGrade } from './depth';
import type { Region } from '../types/rail';

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export type Customer = 'heavyHaul' | 'commuter' | 'scenic';

export const CUSTOMERS: Record<Customer, { name: string; wants: string; bonus: number }> = {
  heavyHaul: { name: 'Heavy-haul freight', wants: 'rail life — finish with RQI 90 or better', bonus: 0.15 },
  commuter: { name: 'Commuter railroad', wants: 'time — finish fast enough for a silver medal', bonus: 0.15 },
  scenic: { name: 'Scenic railroad', wants: 'quiet — average pressure 60% or less, and at most two over-grinds', bonus: 0.2 },
};

/** The customer for a contract: fixed for the built-in routes, from the seed otherwise */
export function customerFor(jobId: string, region: Region, seed: number): Customer {
  const fixed: Record<string, Customer> = {
    transcon: 'heavyHaul', marias: 'heavyHaul', clearing: 'commuter', coast: 'scenic',
    mojave: 'heavyHaul', cascade: 'scenic', pocahontas: 'heavyHaul',
  };
  if (fixed[jobId]) return fixed[jobId];
  if (region === 'city') return seed % 3 === 0 ? 'heavyHaul' : 'commuter';
  if (region === 'coast' || region === 'forest') return seed % 2 === 0 ? 'scenic' : 'commuter';
  return seed % 4 === 0 ? 'scenic' : 'heavyHaul';
}

export interface JobOutcome { rqi: number; medal: 'gold' | 'silver' | 'bronze' | null; avgPressure: number; overgrinds: number }

/** Did the job give the customer what they wanted? */
export function customerMet(c: Customer, o: JobOutcome): boolean {
  if (c === 'heavyHaul') return o.rqi >= 90;
  if (c === 'commuter') return o.medal === 'gold' || o.medal === 'silver';
  return o.avgPressure <= 60 && o.overgrinds <= 2;
}

// ---------------------------------------------------------------------------
// Stone grades mid-job, mirror finish
// ---------------------------------------------------------------------------

const GRADE_ORDER: StoneGrade[] = ['coarse', 'standard', 'fine'];
/** The next grade to fit at a stone change (key I cycles it) */
export function nextGrade(g: StoneGrade): StoneGrade {
  return GRADE_ORDER[(GRADE_ORDER.indexOf(g) + 1) % GRADE_ORDER.length];
}

/** A mirror finish: the section was finished on fine stones, very accurately */
export const MIRROR_ACCURACY = 0.93;
export const MIRROR_BONUS = 120;
export function isMirrorFinish(grade: StoneGrade, accuracy: number): boolean {
  return grade === 'fine' && accuracy >= MIRROR_ACCURACY;
}

// ---------------------------------------------------------------------------
// Machine faults
// ---------------------------------------------------------------------------

export type FaultKind = 'motor' | 'arm';
export interface Fault { kind: FaultKind; rail: 'left' | 'right'; at: number }

export const FAULTS: Record<FaultKind, { name: string; effect: string }> = {
  motor: { name: 'STONE MOTOR OVERHEATING', effect: 'cutting at a third' },
  arm: { name: 'HYDRAULIC ARM STUCK', effect: 'angle frozen' },
};
/** Seconds to fix a fault (stopped, holding Z); the mechanic is quicker */
export const FAULT_REPAIR_SECONDS = 4;

/**
 * Does this job have a fault, and when? None for the first few jobs; then
 * about half of jobs, somewhere between 1 and 4 minutes in.
 */
export function rollFault(jobsDone: number, rand: () => number): Fault | null {
  if (jobsDone < 4 || rand() > 0.45) return null;
  return {
    kind: rand() < 0.5 ? 'motor' : 'arm',
    rail: rand() < 0.5 ? 'left' : 'right',
    at: 60 + rand() * 180,
  };
}

// ---------------------------------------------------------------------------
// Hazards
// ---------------------------------------------------------------------------

/** Grinding over a switch: the stones hit the frog */
export const SWITCH_STRIKE = { stoneLife: 35, fine: 300 };
/** Quiet zones: at night, pressure above this near town is a noise complaint */
export const QUIET = { pressure: 60, fine: 150 };
/** Station platforms leave room for this much stone tilt (degrees) */
export const PLATFORM_TILT = 18;
