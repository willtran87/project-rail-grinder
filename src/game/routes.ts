/**
 * routes.ts - Contracts made up on the spot: a new random route every time,
 * and one "daily contract" that is the same for everyone on the same day.
 *
 * A route is generated from a seed: the region (prairie / mountain / city /
 * coast), its curves, length, damage and pay all come from it, so a seed
 * always gives the same contract. Random routes get harder (and pay more)
 * as the career grows; the daily contract is a fixed medium challenge with
 * its own best score.
 *
 * Plain data in, plain data out — the job menu turns these into JobDefinitions.
 */

import type { Region } from '../types/rail';
import { seededRandom, hashSeed } from './defects';

export interface GeneratedRoute {
  id: string;
  seed: number;
  name: string;
  location: string;
  description: string;
  region: Region;
  sections: number;
  defectSeverity: number;
  timeOfDay: number;
  basePay: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  /** Track centre line as [x, z] points, metres (y is always 0) */
  points: Array<[number, number]>;
  scenery?: 'coast';
}

const REGIONS: Region[] = ['prairie', 'mountain', 'city', 'coast', 'desert', 'forest', 'appalachia'];

const PLACE_NAMES: Record<Region, { lines: string[]; places: string[] }> = {
  prairie: { lines: ['Plains Sub', 'Flint Hills Line', 'Prairie Main', 'Wheat Belt Sub'], places: ['Kansas', 'Nebraska', 'Oklahoma', 'Dakota'] },
  mountain: { lines: ['Summit Grade', 'Canyon Sub', 'High Pass Line', 'Timberline Sub'], places: ['Montana', 'Colorado', 'Idaho', 'Wyoming'] },
  city: { lines: ['Terminal Belt', 'Yard Lead', 'Interchange Line', 'Harbor Belt'], places: ['Chicago, IL', 'Kansas City, MO', 'St. Louis, MO', 'Memphis, TN'] },
  coast: { lines: ['Shoreline Sub', 'Bluffs Line', 'Pacific Sub', 'Dunes Sub'], places: ['California', 'Oregon', 'Washington', 'California'] },
  desert: { lines: ['Needles Sub', 'Mesa Line', 'Dry Lake Sub', 'Sunset Route'], places: ['Arizona', 'New Mexico', 'Nevada', 'California'] },
  forest: { lines: ['Cascade Sub', 'Timber Line', 'Fir Creek Sub', 'Skykomish Line'], places: ['Washington', 'Oregon', 'Idaho', 'Washington'] },
  appalachia: { lines: ['Coal River Sub', 'Hollow Line', 'Big Sandy Sub', 'Ridge Line'], places: ['West Virginia', 'Kentucky', 'Virginia', 'Pennsylvania'] },
};

const DESCRIPTIONS: Record<Region, string> = {
  prairie: 'Long, fast straights. Expect rolling-contact fatigue on the crown and corrugation from heavy unit trains.',
  mountain: 'Tight curves and steep grades. The gauge side takes a beating: head checks and gauge-face wear.',
  city: 'Slow, stop-and-go terminal trackage. Corrugation everywhere, with tight clearances.',
  coast: 'Salt air and mixed traffic: a bit of every kind of damage, with views to match.',
  desert: 'Long, hot straights. Heat and blown sand flatten and wear the crown.',
  forest: 'Wet rail winding through the firs: gauge-side wear on every curve.',
  appalachia: 'Loaded coal trains on twisting grades: corrugation and gauge-face wear.',
};

/**
 * Make a route's centre line: a lead-in, then curves whose sharpness depends
 * on the region, then run-out. Spacing ~45 m between control points.
 */
function makePoints(region: Region, lengthM: number, rand: () => number): Array<[number, number]> {
  const curviness = { prairie: 4, mountain: 22, city: 14, coast: 12, desert: 6, forest: 18, appalachia: 20 }[region];
  const pts: Array<[number, number]> = [[0, -10], [0, 40]];
  let x = 0, z = 40, drift = 0;
  while (z < lengthM + 120) {
    z += 40 + rand() * 15;
    drift = drift * 0.6 + (rand() - 0.5) * curviness; // smooth wandering, not zig-zag
    x += drift;
    pts.push([Math.round(x * 10) / 10, Math.round(z)]);
  }
  return pts;
}

/** A random contract. `level` (career stars, 0..∞) makes it longer, harder and better paid. */
export function generateRoute(seed: number, level: number, kind: 'random' | 'daily' = 'random', onlyRegions?: Region[]): GeneratedRoute {
  const rand = seededRandom(seed);
  const pick = Math.floor(rand() * REGIONS.length);
  // (an event can limit the regions; the same seed still gives the same route)
  const region = onlyRegions?.length ? onlyRegions[pick % onlyRegions.length] : REGIONS[pick];
  const tier = Math.min(1, level / 30);                  // 0 → 1 over the first ~30 career stars
  const sections = Math.round(10 + tier * 10 + rand() * 4);
  const defectSeverity = Math.round((0.5 + tier * 0.35 + rand() * 0.1) * 100) / 100;
  const names = PLACE_NAMES[region];
  const line = names.lines[Math.floor(rand() * names.lines.length)];
  const place = names.places[Math.floor(rand() * names.places.length)];
  const lengthM = sections * 20 + 50 + 60;
  const difficulty = defectSeverity < 0.6 ? 'Easy' : defectSeverity < 0.72 ? 'Medium' : defectSeverity < 0.82 ? 'Hard' : 'Expert';
  return {
    id: kind === 'daily' ? `daily-${seed}` : `random-${seed}`,
    seed,
    name: kind === 'daily' ? `Daily Contract — ${line}` : `${line}`,
    location: place,
    description: DESCRIPTIONS[region],
    region,
    sections,
    defectSeverity,
    timeOfDay: Math.floor(rand() * 4),
    basePay: Math.round((4500 + sections * 320 + defectSeverity * 6000) / 100) * 100,
    difficulty,
    points: makePoints(region, lengthM, rand),
    scenery: region === 'coast' ? 'coast' : undefined,
  };
}

/** Today's date as YYYY-MM-DD (local time) */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** The daily contract: the same route for everyone on the same day (medium difficulty) */
export function dailyRoute(day = todayKey()): GeneratedRoute {
  const route = generateRoute(hashSeed('daily-' + day), 15, 'daily');
  return { ...route, id: `daily-${day}` };
}
