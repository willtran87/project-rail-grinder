/**
 * JobSelect - Job selection screen with multiple contracts.
 *
 * Each job has a different track layout, defect severity,
 * environment theme, and difficulty settings.
 */

import {
  MODIFIERS, modifierPay, weeklyChallenge, rankFor, RANKS, CREW, MACHINES, loadDepot, saveDepot, COLLECTIBLES,
  loadMuseum, PHOTO_CHALLENGES, loadPhotos, claimLogin, session, type ModifierId, type CrewId, type MachineId, type LoginState,
} from '../game/engage';
import { currentGoal } from '../game/meta';
import {
  currentEvent, loadEventRewards, EVENTS, loadMastery, masteryLevel, MASTERY_LEVELS, MASTERY_UNLOCKS, routeCode, parseRouteCode,
  loadBadges, BADGES, loadLadder, LADDER_RUNG_PAY, LADDER_TOP_PAY, loadCustomPaint, saveCustomPaint, type Badge,
} from '../game/loop';
import { weekKey } from '../game/engage';
import * as THREE from 'three';
import type { Region } from '../types/rail';
import { loadRecords, formatTime, type JobRecord } from '../game/progress';
import { generateRoute, dailyRoute, todayKey, type GeneratedRoute } from '../game/routes';
import { LONG_HAUL_SHIFTS, type LongHaul } from '../game/depth';
import { loadJSON, saveJSON } from '../core/storage';

const HAUL_KEY = 'longhaul-v1';
/** The long-haul contract in progress (a new one starts when the last finishes) */
export function loadLongHaul(): LongHaul {
  return loadJSON<LongHaul | null>(HAUL_KEY, null) ?? { seed: Math.floor(Math.random() * 1e9), shift: 0, stars: [] };
}
export function saveLongHaul(h: LongHaul): void { saveJSON(HAUL_KEY, h); }
import { loadGrades, routeCondition, MEDAL_ICON, loadStats, loadBoard, LIVERIES, selectedLivery, selectLivery } from '../game/meta';
import { ACHIEVEMENTS, unlockedAchievements } from '../game/achievements';
import { GRADE_COLORS, type Grade } from '../game/scoring';
import {
  loadCareer, saveCareer, buyUpgrade, nextUpgradeCost, jobPay, isUnlocked, totalBestStars,
  formatMoney, UPGRADES, type CareerState, type UpgradeId,
} from '../game/career';

export interface JobDefinition {
  /** Opt-in risks (random routes, weekly challenge), each raising the pay */
  modifiers?: ModifierId[];
  /** Hold the weather at this strength all job (Storm variants, 0..1) */
  forceWeather?: number;
  /** Shareable code for a random route (see game/loop.ts) */
  code?: string;
  id: string;
  name: string;
  location: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  difficultyColor: string;
  trackLength: string;
  sections: number;
  defectSeverity: number;   // 0-1 base severity
  timeOfDay: number;        // 0=dawn 1=day 2=dusk 3=night
  trackPoints: THREE.Vector3[];
  /** Special scenery for this route ('coast' = ocean + beach on the west side) */
  scenery?: 'coast';
  /** Kind of place: picks the landmarks, weather climate and background sounds */
  region: Region;
  /** Seed for the damage layout (default: from the job id, so it's always the same) */
  seed?: number;
  /** Contract pay at 5★ ≈ 115% of this (see career.jobPay) */
  basePay: number;
  /** Total best stars (across all jobs) needed to take this contract */
  starsToUnlock: number;
}

/**
 * Practice yard: a short, straight test track with one section of each kind
 * of damage (in order), no revenue train, no pay and no records.
 */
/** Today and yesterday as YYYY-MM-DD (local) */
function dayKey(offset = 0): string {
  const d = new Date(Date.now() + offset * 86400000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const PRACTICE_JOB: JobDefinition = {
  id: 'practice', region: 'prairie', name: 'Practice Yard', location: 'Division test track',
  description: 'One section of each kind of damage. No deadline, no pay — just practice.',
  difficulty: 'Easy', difficultyColor: '#8ad0ff', basePay: 0, starsToUnlock: 0,
  trackLength: '210m', sections: 5, defectSeverity: 0.6, timeOfDay: 1,
  trackPoints: [
    new THREE.Vector3(0, 0, -10), new THREE.Vector3(0, 0, 60), new THREE.Vector3(1, 0, 130),
    new THREE.Vector3(1, 0, 200), new THREE.Vector3(0, 0, 260), new THREE.Vector3(0, 0, 320),
  ],
};

export const JOBS: JobDefinition[] = [
  {
    id: 'transcon',
    region: 'prairie',
    name: 'BNSF Transcon — Emporia Sub',
    location: 'Kansas',
    description: 'The Southern Transcon is one of America\'s busiest freight corridors. Long straights across the Great Plains with 100M+ gross tons annually. Head checking and corrugation from high-speed intermodal traffic at 60-70 mph.',
    difficulty: 'Easy',
    basePay: 6000,
    starsToUnlock: 0,
    difficultyColor: '#44cc44',
    trackLength: '280m',
    sections: 14,
    defectSeverity: 0.55,
    timeOfDay: 1,
    trackPoints: [
      // Long tangents with very gentle curves — classic Kansas flatland
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(0, 0, 40),
      new THREE.Vector3(0, 0, 90),
      new THREE.Vector3(1, 0, 130),
      new THREE.Vector3(3, 0, 170),
      new THREE.Vector3(4, 0, 210),
      new THREE.Vector3(3, 0, 245),
      new THREE.Vector3(1, 0, 275),
      new THREE.Vector3(0, 0, 300),
      new THREE.Vector3(0, 0, 340),
      new THREE.Vector3(0, 0, 400),
      new THREE.Vector3(0, 0, 460),
      new THREE.Vector3(0, 0, 520),
    ],
  },
  {
    id: 'marias',
    region: 'mountain',
    name: 'BNSF Hi-Line — Marias Pass',
    location: 'Montana',
    description: 'Crossing the Continental Divide at 5,213 ft — the lowest rail crossing of the Rockies. Sharp 4-8 degree curves on the western descent with heavy coal and grain unit trains. Severe gauge face wear and cold-weather fracture risk.',
    difficulty: 'Medium',
    basePay: 9000,
    starsToUnlock: 3,
    difficultyColor: '#ccaa22',
    trackLength: '380m',
    sections: 18,
    defectSeverity: 0.7,
    timeOfDay: 2,
    trackPoints: [
      // Sharp mountain curves with steep grade simulation
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(0, 0, 20),
      new THREE.Vector3(0, 0, 50),
      new THREE.Vector3(0, 0, 80),
      new THREE.Vector3(3, 0, 105),
      new THREE.Vector3(8, 0, 125),
      new THREE.Vector3(16, 0, 142),
      new THREE.Vector3(26, 0, 157),
      new THREE.Vector3(36, 0, 170),
      new THREE.Vector3(44, 0, 185),
      new THREE.Vector3(50, 0, 202),
      new THREE.Vector3(52, 0, 222),
      new THREE.Vector3(50, 0, 242),
      new THREE.Vector3(45, 0, 260),
      new THREE.Vector3(38, 0, 278),
      new THREE.Vector3(32, 0, 298),
      new THREE.Vector3(30, 0, 318),
      new THREE.Vector3(30, 0, 340),
      new THREE.Vector3(32, 0, 360),
      new THREE.Vector3(32, 0, 400),
      new THREE.Vector3(32, 0, 460),
      new THREE.Vector3(32, 0, 520),
      new THREE.Vector3(32, 0, 580),
    ],
  },
  {
    id: 'clearing',
    region: 'city',
    name: 'BRC Clearing Yard Approach',
    location: 'Chicago, IL',
    description: 'Belt Railway of Chicago — where 25% of US rail freight converges. Tight urban curves around Clearing Yard. Constant stop-and-go traffic causes severe rail crush, corrugation, and switch wear. Night shift on the busiest rail junction in America.',
    difficulty: 'Hard',
    basePay: 13000,
    starsToUnlock: 7,
    difficultyColor: '#dd6622',
    trackLength: '300m',
    sections: 15,
    defectSeverity: 0.9,
    timeOfDay: 3,
    trackPoints: [
      // Tight urban geometry — short curves, S-bends, switch leads
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(0, 0, 20),
      new THREE.Vector3(3, 0, 45),
      new THREE.Vector3(10, 0, 68),
      new THREE.Vector3(20, 0, 88),
      new THREE.Vector3(28, 0, 110),
      new THREE.Vector3(30, 0, 135),
      new THREE.Vector3(25, 0, 158),
      new THREE.Vector3(18, 0, 180),
      new THREE.Vector3(15, 0, 205),
      new THREE.Vector3(18, 0, 230),
      new THREE.Vector3(24, 0, 255),
      new THREE.Vector3(26, 0, 280),
      new THREE.Vector3(24, 0, 300),
      new THREE.Vector3(24, 0, 340),
      new THREE.Vector3(24, 0, 400),
      new THREE.Vector3(24, 0, 460),
      new THREE.Vector3(24, 0, 520),
    ],
  },
  {
    id: 'coast',
    region: 'coast',
    name: 'UP Coast Sub — Surf to SLO',
    location: 'California',
    description: 'Union Pacific\'s Coast Subdivision between Surf and San Luis Obispo. Tracks run directly along the Pacific Ocean. Salt spray corrosion, base pitting, and mixed-traffic fatigue from Amtrak Coast Starlight and UP freight. Dawn start for golden hour over the ocean.',
    difficulty: 'Expert',
    basePay: 18000,
    starsToUnlock: 12,
    difficultyColor: '#dd2244',
    trackLength: '420m',
    sections: 21,
    defectSeverity: 1.0,
    timeOfDay: 0,
    scenery: 'coast',
    trackPoints: [
      // Winding coastal route following the shoreline
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(0, 0, 20),
      new THREE.Vector3(2, 0, 50),
      new THREE.Vector3(8, 0, 78),
      new THREE.Vector3(18, 0, 102),
      new THREE.Vector3(30, 0, 125),
      new THREE.Vector3(40, 0, 148),
      new THREE.Vector3(46, 0, 172),
      new THREE.Vector3(48, 0, 198),
      new THREE.Vector3(44, 0, 222),
      new THREE.Vector3(36, 0, 245),
      new THREE.Vector3(28, 0, 265),
      new THREE.Vector3(24, 0, 288),
      new THREE.Vector3(26, 0, 310),
      new THREE.Vector3(32, 0, 335),
      new THREE.Vector3(38, 0, 358),
      new THREE.Vector3(40, 0, 382),
      new THREE.Vector3(38, 0, 405),
      new THREE.Vector3(35, 0, 425),
      new THREE.Vector3(35, 0, 465),
      new THREE.Vector3(35, 0, 525),
      new THREE.Vector3(35, 0, 585),
      new THREE.Vector3(35, 0, 645),
    ],
  },
  {
    id: 'mojave',
    region: 'desert',
    name: 'BNSF Needles Sub — Mojave',
    location: 'California / Arizona',
    description: 'The Southern Transcon across the Mojave Desert: long, blistering straights past mesas and dry washes. Heat and blown sand flatten the crown; dry brush means fire risk whenever the stones run hot.',
    difficulty: 'Hard',
    basePay: 15000,
    starsToUnlock: 15,
    difficultyColor: '#e08a3a',
    trackLength: '370m',
    sections: 16,
    defectSeverity: 0.85,
    timeOfDay: 1,
    trackPoints: [
      new THREE.Vector3(0, 0, -10), new THREE.Vector3(0, 0, 40), new THREE.Vector3(2, 0, 100), new THREE.Vector3(6, 0, 160),
      new THREE.Vector3(8, 0, 220), new THREE.Vector3(6, 0, 280), new THREE.Vector3(3, 0, 340), new THREE.Vector3(2, 0, 400),
      new THREE.Vector3(2, 0, 460), new THREE.Vector3(2, 0, 520),
    ],
  },
  {
    id: 'cascade',
    region: 'forest',
    name: 'BNSF Scenic Sub — Stevens Pass',
    location: 'Washington',
    description: 'Through the Cascades toward the Cascade Tunnel: wet rail, tight curves and towering firs. Gauge-side wear on every curve, and a timber trestle-era bridge over the Skykomish.',
    difficulty: 'Expert',
    basePay: 20000,
    starsToUnlock: 19,
    difficultyColor: '#3aa86a',
    trackLength: '450m',
    sections: 20,
    defectSeverity: 1.0,
    timeOfDay: 0,
    trackPoints: [
      new THREE.Vector3(0, 0, -10), new THREE.Vector3(0, 0, 30), new THREE.Vector3(4, 0, 70), new THREE.Vector3(14, 0, 105),
      new THREE.Vector3(28, 0, 135), new THREE.Vector3(36, 0, 170), new THREE.Vector3(34, 0, 210), new THREE.Vector3(24, 0, 245),
      new THREE.Vector3(16, 0, 280), new THREE.Vector3(16, 0, 320), new THREE.Vector3(24, 0, 355), new THREE.Vector3(32, 0, 390),
      new THREE.Vector3(34, 0, 430), new THREE.Vector3(34, 0, 490), new THREE.Vector3(34, 0, 560), new THREE.Vector3(34, 0, 620),
    ],
  },
  {
    id: 'pocahontas',
    region: 'appalachia',
    name: 'NS Pocahontas District — Coal Line',
    location: 'West Virginia',
    description: 'Loaded coal trains grind up the hollows of southern West Virginia. Twisting grades, tipples and tunnels; heavy axle loads leave corrugation and gauge-face damage everywhere.',
    difficulty: 'Expert',
    basePay: 22000,
    starsToUnlock: 24,
    difficultyColor: '#8a7ad8',
    trackLength: '490m',
    sections: 22,
    defectSeverity: 1.05,
    timeOfDay: 2,
    trackPoints: [
      new THREE.Vector3(0, 0, -10), new THREE.Vector3(0, 0, 30), new THREE.Vector3(-6, 0, 70), new THREE.Vector3(-16, 0, 100),
      new THREE.Vector3(-20, 0, 135), new THREE.Vector3(-14, 0, 170), new THREE.Vector3(-2, 0, 200), new THREE.Vector3(8, 0, 235),
      new THREE.Vector3(10, 0, 275), new THREE.Vector3(2, 0, 310), new THREE.Vector3(-8, 0, 345), new THREE.Vector3(-10, 0, 385),
      new THREE.Vector3(-4, 0, 420), new THREE.Vector3(4, 0, 455), new THREE.Vector3(6, 0, 500), new THREE.Vector3(6, 0, 570),
      new THREE.Vector3(6, 0, 640),
    ],
  },
];

// Accurate continental US outline as [longitude, latitude] pairs
const US_OUTLINE: [number, number][] = [
  [-67.0,45.0],[-67.0,44.3],[-68.0,44.4],[-69.0,43.9],[-70.0,43.6],[-70.7,42.7],
  [-71.0,41.7],[-72.0,41.0],[-73.7,40.7],[-74.0,40.5],[-74.2,39.7],[-75.5,39.4],
  [-76.0,38.4],[-75.5,37.5],[-76.0,36.9],[-75.5,35.8],[-76.5,35.0],[-77.0,34.7],
  [-78.5,33.9],[-79.9,32.8],[-81.0,31.5],[-81.5,30.7],[-81.2,29.8],[-80.6,28.8],
  [-80.2,27.5],[-80.1,26.3],[-80.1,25.3],[-81.0,25.1],[-81.8,25.7],[-82.0,26.5],
  [-82.5,27.5],[-82.7,28.3],[-83.5,29.0],[-84.0,29.9],[-84.5,30.0],[-85.5,30.0],
  [-86.5,30.4],[-87.5,30.3],[-88.5,30.2],[-89.4,30.2],[-89.5,29.3],[-89.8,29.0],
  [-90.3,29.1],[-91.0,29.3],[-91.8,29.5],[-92.5,29.5],[-93.5,29.8],[-94.5,29.4],
  [-95.0,29.0],[-96.0,28.6],[-97.0,27.8],[-97.2,26.5],[-97.5,26.0],[-98.5,26.2],
  [-99.5,27.0],[-100.5,28.2],[-101.5,29.8],[-103.0,29.0],[-104.0,29.3],[-104.7,29.6],
  [-104.7,31.0],[-106.6,32.0],[-108.2,31.8],[-111.1,31.3],[-114.7,32.7],[-117.1,32.5],
  [-117.3,33.1],[-118.4,34.0],[-119.5,34.4],[-120.5,34.8],[-120.7,35.6],[-121.8,36.8],
  [-122.4,37.8],[-122.5,38.0],[-123.0,38.5],[-123.7,39.0],[-124.2,40.5],[-124.4,42.0],
  [-124.5,43.0],[-124.2,44.5],[-124.0,46.0],[-124.0,46.3],[-123.5,47.0],[-124.6,47.9],
  [-124.7,48.4],[-123.0,48.3],[-122.8,49.0],[-117.0,49.0],[-111.0,49.0],[-104.0,49.0],
  [-97.0,49.0],[-95.2,49.0],[-95.0,49.4],[-94.5,48.7],[-93.5,48.6],[-92.0,48.6],
  [-90.5,48.1],[-89.5,48.0],[-88.0,48.2],[-87.5,47.4],[-86.5,46.6],[-85.0,46.8],
  [-84.5,46.5],[-84.0,46.5],[-83.5,46.1],[-84.2,45.6],[-82.5,45.0],[-82.5,43.0],
  [-82.5,42.3],[-83.0,41.7],[-81.0,41.7],[-79.8,42.5],[-79.0,43.3],[-76.8,43.6],
  [-76.0,44.0],[-75.0,44.8],[-74.5,45.0],[-73.3,45.0],[-71.5,45.0],[-70.8,45.4],
  [-69.2,47.2],[-68.0,47.3],[-67.8,47.1],[-67.8,45.7],[-67.0,45.0],
];

// Great Lakes outlines
const LAKES: [number, number][][] = [
  // Lake Michigan
  [[-86.8,46.0],[-87.0,45.3],[-87.5,44.8],[-87.6,44.0],[-87.8,43.0],[-87.7,42.5],[-87.0,42.0],[-86.5,41.7],[-86.2,42.5],[-86.0,43.5],[-85.5,44.5],[-85.5,45.2],[-85.8,45.8],[-86.8,46.0]],
  // Lake Superior
  [[-89.5,48.0],[-89.0,47.5],[-88.0,47.0],[-87.0,46.8],[-86.0,46.7],[-85.0,46.8],[-84.8,47.0],[-85.0,47.5],[-86.0,47.6],[-87.0,47.4],[-88.5,47.8],[-89.5,48.0]],
  // Lake Erie
  [[-83.5,41.7],[-82.5,41.4],[-81.5,41.5],[-80.5,42.0],[-79.8,42.5],[-80.5,42.7],[-81.5,42.4],[-82.5,42.1],[-83.5,41.7]],
  // Lake Ontario
  [[-79.5,43.3],[-78.5,43.3],[-77.5,43.3],[-76.5,43.7],[-76.3,44.0],[-77.0,44.1],[-78.0,43.9],[-79.0,43.8],[-79.5,43.3]],
  // Lake Huron
  [[-84.5,46.0],[-83.5,45.5],[-82.5,44.5],[-82.0,43.5],[-82.0,43.0],[-82.5,43.5],[-83.0,44.0],[-83.5,44.8],[-84.0,45.5],[-84.5,46.0]],
];

// Job locations as [longitude, latitude]
const JOB_LOCATIONS: Record<string, { lon: number; lat: number; routeAngle: number; dy?: number; side?: 'left' | 'right' }> = {
  transcon: { lon: -96.5, lat: 38.5, routeAngle: 0 },        // Emporia, Kansas
  marias:   { lon: -113.3, lat: 48.3, routeAngle: -0.3 },     // Marias Pass, Montana
  clearing: { lon: -87.8, lat: 41.8, routeAngle: 0.5 },       // Chicago, Illinois
  coast:    { lon: -120.5, lat: 35.2, routeAngle: -1.2, dy: -14 }, // San Luis Obispo, California
  mojave:   { lon: -114.6, lat: 34.8, routeAngle: 0.1, dy: 16 }, // Needles, California
  cascade:  { lon: -121.1, lat: 47.7, routeAngle: -0.4, dy: 26 }, // Stevens Pass, Washington
  pocahontas: { lon: -81.6, lat: 37.4, routeAngle: 0.6, dy: 20, side: 'left' }, // Welch, West Virginia
};

export class JobSelect {
  private overlay: HTMLElement;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'job-select';
    this.overlay.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(180deg, #0a0c14 0%, #141828 50%, #0a0c14 100%);
      display: none; justify-content: center; align-items: flex-start;
      z-index: 45; font-family: 'Inter', sans-serif; color: #fff;
      overflow-y: auto; /* (top-aligned: centring cut off the top of tall pages) */
    `;
    document.body.appendChild(this.overlay);
  }

  /** "Best ★★★☆☆ · RQI 92 · 4:31" for a completed job, or a not-yet-completed hint */
  private bestRecordHTML(record: JobRecord | undefined, jobId = ''): string {
    if (!record) {
      return `<div style="margin-left: auto; color: #555;">Not completed yet</div>`;
    }
    const stars = '★'.repeat(record.bestStars) + '☆'.repeat(5 - record.bestStars);
    const gm = loadGrades()[jobId];
    const cond = routeCondition(jobId);
    const condColor = cond === null ? '#888' : cond >= 85 ? '#44cc44' : cond >= 65 ? '#ffaa00' : '#ff5544';
    return `
      <div style="margin-left: auto; text-align: right;" title="Your personal best (completed ${record.completions}x)">
        ${gm ? `<span style="color: ${GRADE_COLORS[gm.grade]}; font-weight: 700; font-size: 14px;">${gm.grade}</span>
               ${gm.medal ? MEDAL_ICON[gm.medal] : ''}` : ''}
        <span style="color: #ffdd00; letter-spacing: 1px;">${stars}</span>
        <span style="color: #aaa;">RQI ${record.bestRQI.toFixed(0)} · ${formatTime(record.bestTime)}</span>
        ${cond !== null ? `<div style="font-size: 10px; color: ${condColor}; margin-top: 2px;"
          title="Rail condition since your last visit — it wears down while you work elsewhere">
          Track condition ${cond}%${cond < 85 ? ' · needs maintenance' : ''}</div>` : ''}
      </div>`;
  }

  /** Turn a generated route (random / daily) into a contract */
  static routeToJob(r: GeneratedRoute): JobDefinition {
    const colors = { Easy: '#44cc44', Medium: '#ffaa00', Hard: '#ff6633', Expert: '#ff3366' } as const;
    return {
      id: r.id, name: r.name, location: r.location, description: r.description,
      difficulty: r.difficulty, difficultyColor: colors[r.difficulty],
      trackLength: `${r.sections * 20 + 110}m`, sections: r.sections, defectSeverity: r.defectSeverity,
      timeOfDay: r.timeOfDay, region: r.region, seed: r.seed, basePay: r.basePay, starsToUnlock: 0,
      scenery: r.scenery,
      trackPoints: r.points.map(([x, z]) => new THREE.Vector3(x, 0, z)),
    };
  }

  /**
   * The one contract to play next, and why: the "continue" button on the
   * title screen and the UP NEXT card both use it, so there's always one
   * obvious thing to do. In order: a long haul in progress, today's daily,
   * a contract you've never finished, your weakest contract, a neglected
   * route, else a fresh random route.
   */
  static recommend(): { job: JobDefinition; why: string } {
    const records = loadRecords();
    const stars = totalBestStars(records);
    const unlocked = JOBS.filter((j) => isUnlocked(j.starsToUnlock, stars));
    const haul = loadLongHaul();
    if (haul.shift > 0) return { job: JobSelect.longHaulJob(stars), why: `Long haul: shift ${haul.shift + 1} of ${LONG_HAUL_SHIFTS} is waiting` };
    const daily = dailyRoute();
    const s = loadStats();
    if (s.jobs >= 2 && !records[daily.id]) {
      const streak = s.lastDaily === dayKey(-1) ? s.dailyStreak : 0;
      return { job: JobSelect.routeToJob(daily), why: streak > 0 ? `Today's daily — keep your ${streak}-day streak` : "Today's daily contract — same route for everyone" };
    }
    const ev = currentEvent();
    if (s.jobs >= 3 && !loadEventRewards().includes(ev.livery.id)) {
      return { job: JobSelect.eventJob(stars), why: `${ev.name}: 3★ earns ${ev.livery.name} paint (this season only)` };
    }
    const fresh = unlocked.find((j) => !records[j.id]);
    if (fresh) return { job: fresh, why: fresh.starsToUnlock > 0 ? 'Newly unlocked contract' : 'Your first contract' };
    const locked = JOBS.find((j) => !isUnlocked(j.starsToUnlock, stars));
    const weakest = [...unlocked].sort((a, b) => records[a.id].bestStars - records[b.id].bestStars)[0];
    if (weakest && records[weakest.id].bestStars < 5) {
      const why = locked ? `${locked.starsToUnlock - stars} more ★ unlocks ${locked.name.split(' — ')[0]} — best here ${records[weakest.id].bestStars}★`
        : `Your best here is ${records[weakest.id].bestStars}★ — go for ${records[weakest.id].bestStars + 1}`;
      return { job: weakest, why };
    }
    const worn = unlocked.find((j) => (routeCondition(j.id) ?? 100) < 70);
    if (worn) return { job: worn, why: `Track condition ${routeCondition(worn.id)}% — it needs maintenance` };
    const seed = Math.floor(Math.random() * 1e9);
    return { job: JobSelect.routeToJob(generateRoute(seed, stars)), why: 'Every contract at 5★ — a fresh random route' };
  }

  /**
   * A new player's first three contracts are short "first shifts" (4, 5, 6
   * sections, lighter damage), so the first ten minutes end in a win.
   */
  static firstShift(job: JobDefinition, jobsDone: number): JobDefinition {
    if (jobsDone >= 3 || !JOBS.includes(job)) return job;
    const sections = Math.min(job.sections, 4 + jobsDone);
    return {
      ...job, sections, defectSeverity: job.defectSeverity * 0.75,
      basePay: Math.round(job.basePay * sections / job.sections),
      name: `${job.name} · first shift`, trackLength: `${sections * 20 + 110}m`,
    };
  }

  /** This season's event route (one per event per week), as a job */
  static eventJob(totalStars: number): JobDefinition {
    const ev = currentEvent();
    const week = weekKey();
    let h = 2166136261;
    for (const c of ev.id + week) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
    const r = generateRoute(h % 1000000000, totalStars + 5, 'random', ev.regions);
    const job = JobSelect.routeToJob(r);
    job.id = `event-${ev.id}-${week}`;
    job.name = `${ev.name} — ${r.name}`;
    job.modifiers = [...ev.modifiers];
    job.basePay = Math.round(r.basePay * ev.pay / 100) * 100;
    if (ev.id === 'winter') job.forceWeather = 0.8;
    return job;
  }

  /** This week's ladder (routes picked from the contracts you've unlocked) */
  private ladder(totalStars: number) {
    const unlocked = JOBS.filter((j) => isUnlocked(j.starsToUnlock, totalStars)).map((j) => j.id);
    return loadLadder(weekKey(), unlocked);
  }

  /** This shift of the long-haul contract, as a job */
  static longHaulJob(totalStars: number): JobDefinition {
    const h = loadLongHaul();
    saveLongHaul(h);
    const r = generateRoute(h.seed + h.shift * 7919, totalStars + 4);
    const job = JobSelect.routeToJob(r);
    job.id = `haul-${h.seed}-${h.shift}`;
    job.name = `Long Haul ${h.shift + 1}/${LONG_HAUL_SHIFTS} — ${r.name}`;
    job.basePay = Math.round(r.basePay * 1.2);
    return job;
  }

  /** Which tab of the contract screen is showing */
  tab: 'contracts' | 'modes' | 'shop' = 'contracts';
  /** Modifiers the player has switched on for the random route */
  private selectedMods: ModifierId[] = [];
  /** Login reward shown in the header this visit (set once a day) */
  private loginNote = '';

  /** The UP NEXT card's job (see recommend) */
  private upNext: JobDefinition | null = null;

  /** Seed for the "random route" card (re-rolled with the button) */
  private randomSeed = Math.floor(Math.random() * 1e9);

  /** Daily contract + random route cards, and the career button */
  private modesHTML(totalStars: number, records: Record<string, JobRecord>): string {
    const daily = dailyRoute();
    const dRec = records[daily.id];
    const stats = loadStats();
    const streak = stats.lastDaily === todayKey() ? stats.dailyStreak : 0;
    const rnd = generateRoute(this.randomSeed, totalStars);
    const card = `background: rgba(255,170,0,0.06); border: 1px solid rgba(255,170,0,0.3); border-radius: 8px;
      padding: 14px 16px; cursor: pointer;`;
    const ev = currentEvent();
    const evDone = loadEventRewards().includes(ev.livery.id);
    const ladder = this.ladder(totalStars);
    const evRoute = JobSelect.eventJob(totalStars);
    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 16px;">
        <div data-mode="event" style="${card} border-color: rgba(255,120,200,0.5); background: rgba(255,120,200,0.06);">
          <div style="font-size: 10px; letter-spacing: 3px; color: #ff88cc;">SEASONAL EVENT · ${ev.name.toUpperCase()}</div>
          <div style="font-size: 15px; font-weight: 600; margin-top: 4px;">${evRoute.name.split(' — ')[1] ?? evRoute.name}</div>
          <div style="font-size: 11px; color: #888; margin-top: 2px;">${evRoute.location} · ${evRoute.sections} sections · pay ×${ev.pay}</div>
          <div style="font-size: 11px; color: #bbb; margin-top: 6px;">${ev.blurb}</div>
          <div style="font-size: 11px; margin-top: 6px; color: ${evDone ? '#7dff8a' : '#ffcc77'};">${evDone ? `✓ Earned: ${ev.livery.name} paint + ${ev.find.name}`
            : `3★ or better earns <b>${ev.livery.name}</b> paint and a museum find (this season only)`}</div>
        </div>
        <div style="${card} cursor: default; border-color: rgba(125,255,138,0.35); background: rgba(125,255,138,0.04);">
          <div style="font-size: 10px; letter-spacing: 3px; color: #7dff8a;">WEEKLY LADDER · ${ladder.week}</div>
          <div style="font-size: 11px; color: #aaa; margin: 4px 0 6px;">Beat your own best pay on each route this week</div>
          ${ladder.routes.map((id) => { const j = JOBS.find((x) => x.id === id); const best = loadBoard(id)[0]; const done = ladder.done.includes(id);
            return `<div style="font-size: 12px; margin: 3px 0; color: ${done ? '#7dff8a' : '#ddd'};">${done ? '✓' : '○'} ${j ? j.name.split(' — ')[0] : id}
              <span style="color:#888; font-size: 11px;">${done ? 'done' : best ? `beat ${formatMoney(best.score)}` : 'finish it once'}</span></div>`; }).join('')}
          <div style="font-size: 11px; color: #ffcc77; margin-top: 6px;">${formatMoney(LADDER_RUNG_PAY)} a rung · all three +${formatMoney(LADDER_TOP_PAY)} and a streak saver</div>
        </div>
        <div data-mode="daily" style="${card}">
          <div style="font-size: 10px; letter-spacing: 3px; color: #ffaa00;">DAILY CONTRACT · ${todayKey()}</div>
          <div style="font-size: 15px; font-weight: 600; margin-top: 4px;">${daily.name.replace('Daily Contract — ', '')}</div>
          <div style="font-size: 11px; color: #888; margin-top: 2px;">${daily.location} · ${daily.sections} sections · ${daily.difficulty}</div>
          <div style="font-size: 11px; margin-top: 6px; color: #aaa;">
            ${dRec ? `Today's best: <span style="color:#ffdd00">${'★'.repeat(dRec.bestStars)}</span> · RQI ${dRec.bestRQI.toFixed(0)}` : 'Same route for everyone today — set your best'}
            ${streak > 1 ? ` · <span style="color:#ff8844">🔥 ${streak}-day streak</span>` : ''}
          </div>
        </div>
        <div data-mode="random" style="${card}">
          <div style="display:flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 10px; letter-spacing: 3px; color: #ffaa00;">RANDOM ROUTE</div>
            <button data-reroll title="A different route" style="background: rgba(255,255,255,0.08); color: #ddd; border: 1px solid #555;
              border-radius: 4px; font-size: 11px; padding: 2px 8px; cursor: pointer;">↻ NEW</button>
          </div>
          <div style="font-size: 15px; font-weight: 600; margin-top: 4px;">${rnd.name}</div>
          <div style="font-size: 11px; color: #888; margin-top: 2px;">${rnd.location} · ${rnd.sections} sections · ${rnd.difficulty}
            · pays up to <span style="color:#44cc44">${formatMoney(jobPay(rnd.basePay, 5))}</span></div>
          <div style="font-size: 11px; color: #777; margin-top: 6px;">Never the same twice — harder as your career grows</div>
          <div style="display:flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">
            ${(Object.keys(MODIFIERS) as ModifierId[]).map((id) => { const on = this.selectedMods.includes(id); return `<button data-mod="${id}"
              title="${MODIFIERS[id].desc}" style="font-size: 10px; padding: 2px 6px; border-radius: 10px; cursor: pointer;
              border: 1px solid ${on ? '#ff8844' : '#444'}; background: ${on ? 'rgba(255,136,68,0.25)' : 'transparent'}; color: ${on ? '#ffbb88' : '#999'};">
              ${MODIFIERS[id].name} ×${MODIFIERS[id].pay}</button>`; }).join('')}
          </div>
          ${this.selectedMods.length ? `<div style="font-size: 11px; color: #ff8844; margin-top: 4px;">Risk pay ×${modifierPay(this.selectedMods)}</div>` : ''}
          <div style="font-size: 11px; color: #8ad0ff; margin-top: 8px;" title="Send this code to a friend: they can play exactly this route">
            ROUTE CODE <b data-code style="user-select: all;">${routeCode(this.randomSeed, this.selectedMods)}</b></div>
          <div style="display:flex; gap: 4px; margin-top: 6px;">
            <input data-code-input placeholder="Enter a friend's code" maxlength="16" style="flex:1; min-width: 0; font-size: 11px; padding: 4px 6px;
              background: #0b0d14; color: #ddd; border: 1px solid #444; border-radius: 4px; text-transform: uppercase;">
            <button data-code-go style="font-size: 11px; padding: 4px 8px; border-radius: 4px; cursor: pointer; background: rgba(138,208,255,0.15);
              color: #8ad0ff; border: 1px solid #8ad0ff;">PLAY</button>
          </div>
        </div>
        ${(() => {
          const w = weeklyChallenge();
          const wr = generateRoute(w.seed % 1000000000, totalStars + 6);
          const best = records[`weekly-${w.week}`];
          return `<div data-mode="weekly" style="${card} border-color: rgba(138,208,255,0.4); background: rgba(138,208,255,0.05);">
          <div style="font-size: 10px; letter-spacing: 3px; color: #8ad0ff;">WEEKLY CHALLENGE · ${w.week}</div>
          <div style="font-size: 15px; font-weight: 600; margin-top: 4px;">${wr.name}</div>
          <div style="font-size: 11px; color: #888; margin-top: 2px;">${wr.location} · ${wr.sections} sections · ${w.modifiers.map((m) => MODIFIERS[m].name).join(' + ')}</div>
          <div style="font-size: 11px; margin-top: 6px; color: #aaa;">${best ? `Your best this week: <span style="color:#ffdd00">${'★'.repeat(best.bestStars)}</span>` : 'Same challenge for everyone all week'} · pay ×${modifierPay(w.modifiers)}</div>
        </div>`;
        })()}
        ${(() => {
          const h = loadLongHaul();
          return `<div data-mode="longhaul" style="${card}">
          <div style="font-size: 10px; letter-spacing: 3px; color: #ffaa00;">LONG HAUL · SHIFT ${h.shift + 1}/${LONG_HAUL_SHIFTS}</div>
          <div style="font-size: 15px; font-weight: 600; margin-top: 4px;">Three-shift contract</div>
          <div style="font-size: 11px; color: #888; margin-top: 2px;">${h.stars.length ? 'So far: ' + h.stars.map((s) => '★'.repeat(s)).join(' · ') : 'Longer routes, +20% pay'}</div>
          <div style="font-size: 11px; color: #777; margin-top: 6px;">A weak shift leaves more damage for the next. Finish all three for a big bonus.</div>
        </div>`;
        })()}
        <button data-practice title="A short test track: one section of each kind of damage, no deadline, no pay"
          style="background: rgba(120,200,255,0.06); color: #cfe8ff; border: 1px solid rgba(120,200,255,0.3);
          border-radius: 8px; padding: 0 14px; cursor: pointer; font-size: 12px; letter-spacing: 2px;">PRACTICE<br>YARD</button>

      </div>`;
  }

  /**
   * Career page: totals, achievements, paint schemes, and each contract's
   * leaderboard. BACK returns to the job list.
   */
  private renderCareer(resolve: (job: JobDefinition) => void): void {
    const s = loadStats();
    const got = unlockedAchievements();
    const records = loadRecords();
    const grades = loadGrades();
    const progress = {
      stars: totalBestStars(records), sGrades: s.sGrades, perfects: s.perfects,
      achievements: Object.keys(got).length, dailies: s.dailies,
    };
    const current = selectedLivery();
    const stat = (label: string, value: string) => `<div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
      border-radius: 6px; padding: 10px 12px;"><div style="font-size: 10px; color: #888; letter-spacing: 1px;">${label}</div>
      <div style="font-size: 18px; font-weight: 600; margin-top: 2px;">${value}</div></div>`;
    const boards = JOBS.map((j) => {
      const b = loadBoard(j.id);
      if (!b.length) return '';
      return `<div style="margin-bottom: 10px;"><div style="font-size: 12px; color: #ffcc55; margin-bottom: 3px;">${j.name}</div>
        ${b.slice(0, 5).map((e, i) => `<div style="font-family: var(--ui-mono, monospace); font-size: 11px; color: ${i === 0 ? '#ffdd00' : '#bbb'};">
          ${i + 1}. ${e.initials.padEnd(3)} &nbsp;$${e.score.toLocaleString('en-US')} &nbsp;<span style="color:${GRADE_COLORS[e.grade as Grade]}">${e.grade}</span> &nbsp;${formatTime(e.time)}</div>`).join('')}</div>`;
    }).join('') || '<div style="color:#666; font-size: 12px;">No runs on the board yet.</div>';

    this.overlay.innerHTML = `
      <div style="max-width: 900px; padding: 30px 20px; margin: 20px auto;">
        <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
          <div style="font-size: 24px; font-weight: 700; letter-spacing: 2px;">CAREER</div>
          <button data-back style="background: var(--ui-accent, #e8a020); color: #000; border: none; border-radius: 4px; padding: 8px 18px; cursor: pointer; font-weight: 600;">BACK TO JOBS</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 22px;">
          ${stat('CONTRACTS DONE', String(s.jobs))}
          ${stat('SECTIONS RESTORED', String(s.sections))}
          ${stat('TRACK RESTORED', `${(s.feetRestored / 5280).toFixed(2)} mi`)}
          ${stat('METAL REMOVED', `${s.metalMm.toFixed(1)} mm`)}
          ${stat('PERFECT PASSES', String(s.perfects))}
          ${stat('BEST COMBO', String(s.bestCombo))}
          ${stat('S GRADES', String(s.sGrades))}
          ${stat('EARNED', formatMoney(s.totalEarned))}
        </div>
        <div style="font-size: 11px; letter-spacing: 3px; color: #888; margin-bottom: 8px;">BEST GRADES</div>
        <div style="display:flex; gap: 10px; flex-wrap: wrap; margin-bottom: 22px;">
          ${JOBS.map((j) => { const g = grades[j.id]; return `<div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 6px; padding: 8px 12px; font-size: 12px;">
            ${j.location} <b style="color:${g ? GRADE_COLORS[g.grade] : '#555'}; margin-left: 6px;">${g ? g.grade : '–'}</b> ${g?.medal ? MEDAL_ICON[g.medal] : ''}</div>`; }).join('')}
        </div>
        <div style="font-size: 11px; letter-spacing: 3px; color: #888; margin-bottom: 8px;">GRINDER PAINT</div>
        <div style="display:flex; gap: 10px; flex-wrap: wrap; margin-bottom: 22px;">
          ${LIVERIES.map((l) => { const ok = l.unlocked(progress); const sel = l.id === current.id; return `
            <div data-livery="${l.id}" data-ok="${ok}" title="${ok ? 'Paint the grinder' : 'Locked: ' + l.unlockText}" style="width: 118px; cursor: ${ok ? 'pointer' : 'not-allowed'};
              border: 2px solid ${sel ? '#ffaa00' : 'rgba(255,255,255,0.08)'}; border-radius: 6px; padding: 8px; opacity: ${ok ? 1 : 0.4};">
              <div style="height: 22px; border-radius: 3px; background: ${l.body}; box-shadow: inset 0 -6px 0 #${l.trim.toString(16).padStart(6, '0')};"></div>
              <div style="font-size: 11px; margin-top: 5px;">${l.name}</div>
              <div style="font-size: 9px; color: #888;">${ok ? (sel ? 'IN USE' : 'Unlocked') : '🔒 ' + l.unlockText}</div></div>`; }).join('')}
        </div>
        ${(() => {
          const paint = loadCustomPaint();
          const canCustom = rankFor(progress.stars).index >= 1;
          const evLiveries = EVENTS.filter((e) => loadEventRewards().includes(e.livery.id));
          return `<div style="font-size: 11px; letter-spacing: 3px; color: #888; margin-bottom: 8px;">CUSTOM PAINT & NUMBER ${canCustom ? '' : '· 🔒 reach rank Operator'}</div>
          <div style="display:flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-bottom: 10px; opacity: ${canCustom ? 1 : 0.45};">
            <label style="font-size: 11px; color:#aaa;">Body <input type="color" data-paint="body" value="${paint.body}" ${canCustom ? '' : 'disabled'}></label>
            <label style="font-size: 11px; color:#aaa;">Trim <input type="color" data-paint="trim" value="${paint.trim}" ${canCustom ? '' : 'disabled'}></label>
            <label style="font-size: 11px; color:#aaa;">Number <input data-paint="number" value="${paint.number}" maxlength="4" ${canCustom ? '' : 'disabled'}
              style="width: 52px; background:#0b0d14; color:#ddd; border:1px solid #444; padding: 3px;"></label>
            <label style="font-size: 11px; color:#aaa;">Crew name <input data-paint="crew" value="${paint.crew}" maxlength="24" placeholder="e.g. Night Owls" ${canCustom ? '' : 'disabled'}
              style="width: 150px; background:#0b0d14; color:#ddd; border:1px solid #444; padding: 3px;"></label>
            <button data-paint-use ${canCustom ? '' : 'disabled'} style="font-size: 11px; padding: 5px 10px; border-radius: 4px; cursor: pointer;
              background: ${current.id === 'custom' ? '#ffaa00' : 'rgba(255,170,0,0.15)'}; color: ${current.id === 'custom' ? '#000' : '#ffcc77'}; border: 1px solid #ffaa00;">
              ${current.id === 'custom' ? 'IN USE' : 'USE CUSTOM PAINT'}</button>
          </div>
          <div style="font-size: 10px; color: #777; margin-bottom: 22px;">Your number and crew name go on the share card.</div>
          ${evLiveries.length ? `<div style="font-size: 11px; letter-spacing: 3px; color: #888; margin-bottom: 8px;">EVENT PAINT</div>
          <div style="display:flex; gap: 10px; flex-wrap: wrap; margin-bottom: 22px;">${evLiveries.map((e) => `<div data-livery="${e.livery.id}" data-ok="true"
            style="width: 118px; cursor: pointer; border: 2px solid ${current.id === e.livery.id ? '#ffaa00' : 'rgba(255,255,255,0.08)'}; border-radius: 6px; padding: 8px;">
            <div style="height: 22px; border-radius: 3px; background: ${e.livery.body}; box-shadow: inset 0 -6px 0 #${e.livery.trim.toString(16).padStart(6, '0')};"></div>
            <div style="font-size: 11px; margin-top: 5px;">${e.livery.name}</div><div style="font-size: 9px; color: #888;">${e.name}</div></div>`).join('')}</div>` : ''}`;
        })()}
        <div style="font-size: 11px; letter-spacing: 3px; color: #888; margin-bottom: 8px;">RANK</div>
        <div style="display:flex; gap: 8px; flex-wrap: wrap; margin-bottom: 22px;">
          ${RANKS.map((r, i) => { const here = rankFor(progress.stars).index; return `<div style="border: 1px solid ${i === here ? '#8ad0ff' : 'rgba(255,255,255,0.08)'};
            border-radius: 6px; padding: 8px 10px; opacity: ${i <= here ? 1 : 0.45}; min-width: 130px;">
            <div style="font-size: 12px; font-weight: 600; color: ${i === here ? '#8ad0ff' : '#ddd'};">${r.name}</div>
            <div style="font-size: 10px; color: #888;">★ ${r.stars} · ${r.perk}</div></div>`; }).join('')}
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 22px;">
          <div>
            <div style="font-size: 11px; letter-spacing: 3px; color: #888; margin-bottom: 8px;">MUSEUM · ${loadMuseum().length}/${COLLECTIBLES.length}</div>
            <div style="font-size: 10px; color: #777; margin-bottom: 6px;">Something glints by the rail? Look with camera 5 (grind) as you pass.</div>
            ${COLLECTIBLES.map((c) => { const got = loadMuseum().includes(c.id); return `<div style="padding: 3px 0; font-size: 12px; opacity: ${got ? 1 : 0.4};">
              ${got ? '🏺' : '·'} ${got ? c.name : '???'} ${got ? `<span style="font-size: 10px; color: #888;">— ${c.note}</span>` : ''}</div>`; }).join('')}
            ${EVENTS.filter((e) => loadEventRewards().includes(e.find.id)).map((e) => `<div style="padding: 3px 0; font-size: 12px; color: #ff88cc;">
              ★ ${e.find.name} <span style="font-size: 10px; color: #888;">— ${e.find.note} (${e.name})</span></div>`).join('')}
          </div>
          <div>
            <div style="font-size: 11px; letter-spacing: 3px; color: #888; margin-bottom: 8px;">PHOTO CHALLENGES · ${loadPhotos().length}/${Object.keys(PHOTO_CHALLENGES).length}</div>
            <div style="font-size: 10px; color: #777; margin-bottom: 6px;">Press F for photo mode, K to take the picture.</div>
            ${Object.entries(PHOTO_CHALLENGES).map(([id, p]) => { const got = loadPhotos().includes(id as never); return `<div style="padding: 3px 0; font-size: 12px; opacity: ${got ? 1 : 0.55};">
              ${got ? '📸' : '·'} ${p.name} <span style="font-size: 10px; color: #888;">— ${p.how} (${formatMoney(p.reward)})</span></div>`; }).join('')}
          </div>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div>
            <div style="font-size: 11px; letter-spacing: 3px; color: #888; margin-bottom: 8px;">ACHIEVEMENTS · ${Object.keys(got).length}/${ACHIEVEMENTS.length}</div>
            ${ACHIEVEMENTS.map((a) => `<div style="padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.04); opacity: ${got[a.id] ? 1 : 0.45};">
              <span style="font-size: 12px;">${got[a.id] ? '🏆' : '·'} ${a.name}</span>
              <span style="font-size: 10px; color: #888;"> — ${a.description}</span></div>`).join('')}
          </div>
          <div>
            <div style="font-size: 11px; letter-spacing: 3px; color: #888; margin-bottom: 8px;">LEADERBOARDS (THIS COMPUTER)</div>
            ${boards}
          </div>
        </div>
      </div>`;
    this.overlay.querySelector('[data-back]')!.addEventListener('click', () => this.render(resolve));
    // Custom paint editor
    const readPaint = () => {
      const v = (k: string) => this.overlay.querySelector<HTMLInputElement>(`[data-paint="${k}"]`)?.value ?? '';
      saveCustomPaint({ body: v('body'), trim: v('trim'), number: v('number'), crew: v('crew') });
    };
    this.overlay.querySelectorAll<HTMLInputElement>('[data-paint]').forEach((el) => el.addEventListener('change', () => {
      readPaint();
      if (selectedLivery().id === 'custom') this.onLiveryChange?.();
    }));
    this.overlay.querySelector('[data-paint-use]')?.addEventListener('click', () => {
      readPaint();
      selectLivery('custom');
      this.onLiveryChange?.();
      this.renderCareer(resolve);
    });
    this.overlay.querySelectorAll<HTMLElement>('[data-livery]').forEach((el) => el.addEventListener('click', () => {
      if (el.dataset.ok !== 'true') return;
      selectLivery(el.dataset.livery!);
      this.onLiveryChange?.();
      this.renderCareer(resolve);
    }));
  }

  /** Game hooks this to open the settings menu */
  onOpenSettings: (() => void) | null = null;

  /** Game hooks this to repaint the grinder when a new livery is picked */
  onLiveryChange: (() => void) | null = null;

  /**
   * A contract's mastery: level bar, what the next level unlocks, its badges
   * (each worth a career star) and the variant buttons it has earned.
   */
  private masteryHTML(jobId: string): string {
    const stars = loadMastery()[jobId] ?? 0;
    const level = masteryLevel(stars);
    const next = MASTERY_LEVELS[level];
    const lo = MASTERY_LEVELS[level - 1];
    const frac = next === undefined ? 1 : (stars - lo) / (next - lo);
    const have = loadBadges()[jobId] ?? [];
    const badge = (b: Badge) => `<span title="${BADGES[b].name}: ${BADGES[b].how} (+1 career star)" style="font-size: 10px; padding: 1px 6px;
      border-radius: 8px; border: 1px solid ${have.includes(b) ? '#ffd84a' : '#444'}; color: ${have.includes(b) ? '#ffd84a' : '#666'};">${
      { night: '🌙', noFast: '⏱', speed: '⚡' }[b]} ${BADGES[b].name}</span>`;
    const btn = (variant: string, label: string, ok: boolean) => ok ? `<button data-variant="${variant}" data-job-id="${jobId}" style="font-size: 10px;
      padding: 3px 8px; border-radius: 4px; cursor: pointer; border: 1px solid #ff8844; background: rgba(255,136,68,0.15); color: #ffbb88;">${label}</button>` : '';
    return `<div style="margin: -4px 0 12px;" data-stop>
      <div style="display:flex; align-items:center; gap: 8px; font-size: 10px; color: #aaa;">
        <span style="color:#ffcc55; letter-spacing: 1px;">MASTERY ${level}</span>
        <div style="flex:1; height: 5px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden;">
          <div style="width: ${Math.round(frac * 100)}%; height: 100%; background: #ffcc55;"></div></div>
        <span>${next === undefined ? 'MAX' : `${stars}/${next}★ → ${MASTERY_UNLOCKS[level]}`}</span>
      </div>
      <div style="display:flex; flex-wrap: wrap; gap: 4px; margin-top: 6px;">${(['night', 'noFast', 'speed'] as Badge[]).map(badge).join('')}
        ${btn('storm', '⛈ STORM', level >= 2)} ${btn('hard', '☠ HARD +30%', level >= 3)}</div>
    </div>`;
  }

  /** Career summary + upgrade shop, shown under the job cards */
  /** Depot: hire crew (perks) and buy / pick a grinding machine */
  private depotHTML(money: number): string {
    const d = loadDepot();
    const btn = (attr: string, label: string, enabled: boolean) => `<button ${attr} ${enabled ? '' : 'disabled'} style="margin-top: 8px; font-size: 11px;
      padding: 6px 12px; border-radius: 4px; cursor: ${enabled ? 'pointer' : 'default'}; border: 1px solid ${enabled ? '#ffaa00' : '#444'};
      background: ${enabled ? 'rgba(255,170,0,0.15)' : 'transparent'}; color: ${enabled ? '#ffcc77' : '#777'};">${label}</button>`;
    return `
      <div style="font-size: 11px; letter-spacing: 3px; color: #888; margin: 4px 0 10px;">MACHINES</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 12px; margin-bottom: 22px;">
        ${(Object.keys(MACHINES) as MachineId[]).map((id) => { const m = MACHINES[id]; const owned = d.machines.includes(id); const active = d.active === id;
          return `<div style="background: rgba(255,255,255,0.03); border: 1px solid ${active ? '#ffaa00' : 'rgba(255,255,255,0.08)'}; border-radius: 8px; padding: 14px;">
            <div style="font-size: 15px; font-weight: 600;">${m.name} ${active ? '<span style="font-size: 10px; color: #ffaa00;">IN SERVICE</span>' : ''}</div>
            <div style="font-size: 12px; color: #999; margin-top: 4px;">${m.desc}</div>
            ${active ? '' : owned ? btn(`data-machine="${id}"`, 'PUT IN SERVICE', true) : btn(`data-machine="${id}"`, `BUY ${formatMoney(m.cost)}`, money >= m.cost)}
          </div>`; }).join('')}
      </div>
      <div style="font-size: 11px; letter-spacing: 3px; color: #888; margin-bottom: 10px;">CREW</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
        ${(Object.keys(CREW) as CrewId[]).map((id) => { const c = CREW[id]; const hired = d.crew.includes(id);
          return `<div style="background: rgba(255,255,255,0.03); border: 1px solid ${hired ? 'rgba(125,255,138,0.4)' : 'rgba(255,255,255,0.08)'}; border-radius: 8px; padding: 14px;">
            <div style="font-size: 10px; letter-spacing: 2px; color: #8ad0ff;">${c.role.toUpperCase()}</div>
            <div style="font-size: 14px; font-weight: 600; margin-top: 2px;">${c.name}</div>
            <div style="font-size: 12px; color: #999; margin-top: 4px;">${c.perk}</div>
            ${hired ? '<div style="margin-top: 8px; font-size: 11px; color: #7dff8a;">ON THE CREW</div>' : btn(`data-hire="${id}"`, `HIRE ${formatMoney(c.cost)}`, money >= c.cost)}
          </div>`; }).join('')}
      </div>`;
  }

  private upgradesHTML(career: CareerState): string {
    let html = `
      <div style="margin-top: 28px;">
        <div style="font-size: 11px; color: rgba(255,170,0,0.6); letter-spacing: 6px; margin-bottom: 10px; text-align: center;">GRINDER UPGRADES</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">`;
    for (const up of UPGRADES) {
      const level = career.upgrades[up.id];
      const cost = nextUpgradeCost(career, up.id);
      const canBuy = cost !== null && career.money >= cost;
      const pips = '●'.repeat(level) + '○'.repeat(up.costs.length - level);
      const button = cost === null
        ? `<div style="color: #44cc44; font-size: 11px; font-weight: 600;">MAXED</div>`
        : `<button class="buy-upgrade" data-upgrade="${up.id}" ${canBuy ? '' : 'disabled'} style="
            background: ${canBuy ? 'var(--ui-accent, #e8a020)' : 'rgba(255,255,255,0.06)'};
            color: ${canBuy ? '#000' : '#666'}; border: none; border-radius: 4px;
            padding: 6px 12px; font-size: 11px; font-weight: 600; cursor: ${canBuy ? 'pointer' : 'not-allowed'};
          ">BUY ${formatMoney(cost)}</button>`;
      html += `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 14px;">
          <div style="font-size: 13px; font-weight: 600;">${up.name}</div>
          <div style="font-size: 11px; color: #888; margin: 4px 0 8px;">${up.effect} per level</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #e8a020; letter-spacing: 3px;">${pips}</span>
            ${button}
          </div>
        </div>`;
    }
    return html + `</div></div>`;
  }

  /** Show job selection and return the chosen job */
  /** @param auto - skip the menu and take this job straight away (CONTINUE on the title screen) */
  show(auto?: JobDefinition): Promise<JobDefinition> {
    if (auto) { this.claimLoginReward(); return Promise.resolve(auto); }
    return new Promise((resolve) => this.render(resolve));
  }

  /** Draw the whole screen; re-run after buying an upgrade */
  /** Daily login reward ladder: claimed the first time the menu opens each day */
  private claimLoginReward(): void {
    const res = claimLogin(loadJSON<LoginState | null>('login-v1', null), dayKey(0), dayKey(-1));
    if (!res) return;
    saveJSON('login-v1', res.state);
    const c = loadCareer();
    c.money += res.reward;
    saveCareer(c);
    this.loginNote = `DAY ${res.day} LOGIN BONUS: +${formatMoney(res.reward)}${res.day < 7 ? ` — come back tomorrow for day ${res.day + 1}` : ' — top of the ladder!'}`;
  }

  private render(resolve: (job: JobDefinition) => void): void {
      this.claimLoginReward();
      const records = loadRecords();
      const career = loadCareer();
      const totalStars = totalBestStars(records);
      // Dev/testing shortcut: add ?unlock to the URL to open every contract
      const unlockAll = new URLSearchParams(window.location.search).has('unlock');
      let html = `
        <div style="width: 100%; max-width: 900px; padding: 30px 20px; margin: 20px auto; box-sizing: border-box;">
          <div style="text-align: center; margin-bottom: 20px;">
            <button data-settings style="float: right; background: rgba(255,255,255,0.08); color: #ddd; border: 1px solid rgba(255,255,255,0.15);
              border-radius: 4px; padding: 6px 12px; font-size: 11px; cursor: pointer;">⚙ SETTINGS</button>
            <div style="font-size: 11px; color: rgba(255,170,0,0.6); letter-spacing: 6px; margin-bottom: 6px;">SELECT CONTRACT</div>
            <div style="font-size: 28px; font-weight: 700; letter-spacing: 2px;">AVAILABLE JOBS</div>
            <div style="margin-top: 10px; font-size: 14px; color: #aaa;">
              <span style="color: #44cc44; font-weight: 700;">${formatMoney(career.money)}</span>
              &nbsp;·&nbsp; <span style="color: #ffdd00;">★ ${totalStars}</span> career stars
              &nbsp;·&nbsp; <span style="color: #8ad0ff;" title="Perk: ${rankFor(totalStars).rank.perk}">${rankFor(totalStars).rank.name.toUpperCase()}</span>
            </div>
            <div style="margin-top: 4px; font-size: 10px; color: #777;" title="Money and stars do different jobs">
              <span style="color:#44cc44">$</span> buys upgrades, crew and machines in the Shop ·
              <span style="color:#ffdd00">★</span> (your best stars on each contract) unlocks contracts and raises your rank</div>
            ${(() => { const g = currentGoal(); return g ? `<div style="margin-top: 6px; font-size: 12px; color: #ffcc77;">NEXT GOAL: ${g}</div>` : ''; })()}
            ${this.loginNote ? `<div style="margin-top: 6px; font-size: 12px; color: #7dff8a;">${this.loginNote}</div>` : ''}
            ${session.jobs > 0 ? `<div style="margin-top: 6px; font-size: 11px; color: #999;">THIS SESSION: ${session.jobs} job${session.jobs > 1 ? 's' : ''}
              · ${formatMoney(session.earned)} · ${session.perfects} perfect passes${session.achievements ? ` · ${session.achievements} achievement${session.achievements > 1 ? 's' : ''}` : ''}${session.collectibles ? ` · ${session.collectibles} find${session.collectibles > 1 ? 's' : ''}` : ''}</div>` : ''}
          </div>
          ${(() => { const r = JobSelect.recommend(); this.upNext = r.job; return `
          <div data-upnext style="display:flex; align-items:center; gap: 16px; margin: 0 auto 18px; max-width: 640px; cursor: pointer;
            background: linear-gradient(90deg, rgba(255,170,0,0.16), rgba(255,170,0,0.04)); border: 1px solid rgba(255,170,0,0.55);
            border-radius: 10px; padding: 14px 18px;">
            <div style="flex: 1; min-width: 0;">
              <div style="font-size: 10px; letter-spacing: 3px; color: #ffaa00;">UP NEXT</div>
              <div style="font-size: 17px; font-weight: 700; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${r.job.name}</div>
              <div style="font-size: 12px; color: #ccc; margin-top: 2px;">${r.why}</div>
            </div>
            <button data-upnext-go style="background: #ffaa00; color: #000; border: none; border-radius: 6px; padding: 12px 22px;
              font-size: 14px; font-weight: 700; letter-spacing: 2px; cursor: pointer;">PLAY ▶</button>
          </div>`; })()}
          <div id="job-tabs" style="display: flex; gap: 6px; justify-content: center; margin-bottom: 18px; flex-wrap: wrap;">
            ${([['contracts', 'CONTRACTS'], ['modes', 'MORE WORK'], ['shop', 'SHOP'], ['career', 'CAREER']] as const).map(([id, name]) =>
              `<button data-tab="${id}" style="font-size: 12px; letter-spacing: 2px; padding: 8px 16px; border-radius: 4px; cursor: pointer;
                border: 1px solid rgba(255,170,0,0.4); background: ${this.tab === id ? '#ffaa00' : 'rgba(255,170,0,0.06)'};
                color: ${this.tab === id ? '#000' : '#ffcc77'};">${name}</button>`).join('')}
          </div>
          <div data-pane="modes" style="display: ${this.tab === 'modes' ? 'block' : 'none'};">${this.modesHTML(totalStars, records)}</div>
          <div data-pane="contracts" style="display: ${this.tab === 'contracts' ? 'block' : 'none'};">
          <div style="display: flex; justify-content: center; margin-bottom: 20px;">
            <canvas id="us-map-canvas" width="600" height="320" style="
              background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
              border-radius: 8px;
            "></canvas>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
      `;

      for (const job of JOBS) {
        const unlocked = unlockAll || isUnlocked(job.starsToUnlock, totalStars);
        const status = unlocked
          ? this.bestRecordHTML(records[job.id], job.id)
          : `<div style="margin-left: auto; color: #aaa;">🔒 Needs ★ ${job.starsToUnlock} (you have ${totalStars})</div>`;
        html += `
          <div class="job-card" data-job="${job.id}" data-locked="${unlocked ? 'no' : 'yes'}" style="
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px; padding: 20px; cursor: ${unlocked ? 'pointer' : 'not-allowed'};
            transition: all 0.2s; opacity: ${unlocked ? 1 : 0.45};
          " ${unlocked ? `onmouseover="this.style.borderColor='rgba(232,160,32,0.5)';this.style.background='rgba(255,255,255,0.06)'"
             onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.background='rgba(255,255,255,0.03)'"` : ''}>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div>
                <div style="font-size: 16px; font-weight: 600;">${job.name}</div>
                <div style="font-size: 11px; color: #666; margin-top: 2px;">${job.location}</div>
              </div>
              <div style="
                font-size: 10px; font-weight: 600; color: ${job.difficultyColor};
                background: ${job.difficultyColor}18; border: 1px solid ${job.difficultyColor}40;
                border-radius: 12px; padding: 3px 10px;
              ">${job.difficulty}</div>
            </div>
            <div style="font-size: 12px; color: #888; line-height: 1.6; margin-bottom: 12px;">
              ${job.description}
            </div>
            ${unlocked && records[job.id] ? this.masteryHTML(job.id) : ''}
            <div style="display: flex; gap: 16px; font-size: 11px; color: #666; flex-wrap: wrap;">
              <div><span style="color: #aaa;">${job.trackLength}</span> track</div>
              <div><span style="color: #aaa;">${job.sections}</span> sections</div>
              <div>pays up to <span style="color: #44cc44;">${formatMoney(jobPay(job.basePay, 5))}</span></div>
              ${status}
            </div>
          </div>
        `;
      }

      html += `</div></div><div data-pane="shop" style="display: ${this.tab === 'shop' ? 'block' : 'none'};">
        <div style="text-align:center; font-size: 12px; color: #aaa; margin-bottom: 6px;">You have <b style="color:#44cc44">${formatMoney(career.money)}</b> to spend</div>
        ${this.upgradesHTML(career)}<div style="height: 26px;"></div>${this.depotHTML(career.money)}</div></div>`;
      this.overlay.innerHTML = html;
      this.overlay.style.display = 'flex';

      // Bind click handlers (locked contracts can't be taken)
      const cards = this.overlay.querySelectorAll('.job-card');
      cards.forEach((card) => {
        card.addEventListener('click', () => {
          if (card.getAttribute('data-locked') === 'yes') return;
          const jobId = card.getAttribute('data-job');
          const job = JOBS.find(j => j.id === jobId)!;
          this.overlay.style.display = 'none';
          resolve(job);
        });
      });

      // Mastery variants (Storm / Hard) — don't also trigger the card
      this.overlay.querySelectorAll<HTMLButtonElement>('[data-variant]').forEach((b) => b.addEventListener('click', (e) => {
        e.stopPropagation();
        const base = JOBS.find((j) => j.id === b.dataset.jobId)!;
        const job: JobDefinition = b.dataset.variant === 'storm'
          ? { ...base, name: `${base.name} · Storm`, forceWeather: 0.85 }
          : { ...base, name: `${base.name} · Hard`, defectSeverity: base.defectSeverity * 1.25, basePay: Math.round(base.basePay * 1.3) };
        this.overlay.style.display = 'none';
        resolve(job);
      }));
      this.overlay.querySelectorAll<HTMLElement>('[data-stop]').forEach((el) => el.addEventListener('click', (e) => e.stopPropagation()));
      // Seasonal event route
      this.overlay.querySelector('[data-mode="event"]')?.addEventListener('click', () => {
        this.overlay.style.display = 'none';
        resolve(JobSelect.eventJob(totalStars));
      });
      // Route codes: play a friend's random route
      const codeInput = this.overlay.querySelector<HTMLInputElement>('[data-code-input]');
      codeInput?.addEventListener('click', (e) => e.stopPropagation());
      this.overlay.querySelector('[data-code-go]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const parsed = parseRouteCode(codeInput?.value ?? '');
        if (!parsed) { if (codeInput) { codeInput.value = ''; codeInput.placeholder = 'Not a route code (RG-…)'; } return; }
        const job = JobSelect.routeToJob(generateRoute(parsed.seed, totalStars));
        job.modifiers = parsed.mods;
        job.code = routeCode(parsed.seed, parsed.mods);
        this.overlay.style.display = 'none';
        resolve(job);
      });
      // Daily contract / random route / career page
      this.overlay.querySelector('[data-mode="daily"]')?.addEventListener('click', () => {
        this.overlay.style.display = 'none';
        resolve(JobSelect.routeToJob(dailyRoute()));
      });
      this.overlay.querySelectorAll<HTMLButtonElement>('[data-mod]').forEach((b) => b.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = b.dataset.mod as ModifierId;
        this.selectedMods = this.selectedMods.includes(id) ? this.selectedMods.filter((m) => m !== id) : [...this.selectedMods, id];
        this.render(resolve);
      }));
      this.overlay.querySelector('[data-mode="weekly"]')?.addEventListener('click', () => {
        const w = weeklyChallenge();
        const job = JobSelect.routeToJob(generateRoute(w.seed % 1000000000, totalStars + 6));
        job.id = `weekly-${w.week}`;
        job.name = `Weekly Challenge — ${job.name}`;
        job.modifiers = w.modifiers;
        this.overlay.style.display = 'none';
        resolve(job);
      });
      this.overlay.querySelectorAll<HTMLButtonElement>('[data-hire]').forEach((b) => b.addEventListener('click', () => {
        const id = b.dataset.hire as CrewId;
        const c = loadCareer();
        const d = loadDepot();
        if (d.crew.includes(id) || c.money < CREW[id].cost) return;
        c.money -= CREW[id].cost; saveCareer(c);
        d.crew.push(id); saveDepot(d);
        this.render(resolve);
      }));
      this.overlay.querySelectorAll<HTMLButtonElement>('[data-machine]').forEach((b) => b.addEventListener('click', () => {
        const id = b.dataset.machine as MachineId;
        const c = loadCareer();
        const d = loadDepot();
        if (!d.machines.includes(id)) {
          if (c.money < MACHINES[id].cost) return;
          c.money -= MACHINES[id].cost; saveCareer(c);
          d.machines.push(id);
        }
        d.active = id; saveDepot(d);
        this.render(resolve);
      }));
      this.overlay.querySelector('[data-mode="random"]')?.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('[data-reroll]') || (e.target as HTMLElement).closest('[data-mod]')) return;
        this.overlay.style.display = 'none';
        const job = JobSelect.routeToJob(generateRoute(this.randomSeed, totalStars));
        job.modifiers = [...this.selectedMods];
        job.code = routeCode(this.randomSeed, this.selectedMods);
        resolve(job);
      });
      this.overlay.querySelector('[data-mode="longhaul"]')?.addEventListener('click', () => {
        this.overlay.style.display = 'none';
        resolve(JobSelect.longHaulJob(totalStars));
      });
      this.overlay.querySelector('[data-reroll]')?.addEventListener('click', () => {
        this.randomSeed = Math.floor(Math.random() * 1e9);
        this.render(resolve);
      });
      this.overlay.querySelector('[data-career]')?.addEventListener('click', () => this.renderCareer(resolve));
      this.overlay.querySelectorAll<HTMLButtonElement>('#job-tabs [data-tab]').forEach((b) => b.addEventListener('click', () => {
        if (b.dataset.tab === 'career') { this.renderCareer(resolve); return; }
        this.tab = b.dataset.tab as typeof this.tab;
        this.render(resolve);
      }));
      this.overlay.querySelector('[data-upnext]')?.addEventListener('click', () => {
        if (!this.upNext) return;
        this.overlay.style.display = 'none';
        resolve(this.upNext);
      });
      this.overlay.querySelector('[data-practice]')?.addEventListener('click', () => {
        this.overlay.style.display = 'none';
        resolve(PRACTICE_JOB);
      });
      this.overlay.querySelector('[data-settings]')?.addEventListener('click', () => this.onOpenSettings?.());

      // Upgrade purchases: spend money, save, redraw the screen
      this.overlay.querySelectorAll('.buy-upgrade').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-upgrade') as UpgradeId;
          const result = buyUpgrade(loadCareer(), id);
          if (result.bought) {
            saveCareer(result.state);
            this.render(resolve);
          }
        });
      });

      // Draw the US map
      this.drawUSMap();
  }

  private drawUSMap(): void {
    const canvas = document.getElementById('us-map-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width, h = canvas.height;
    const pad = 25;

    ctx.clearRect(0, 0, w, h);

    // Geographic projection: lon/lat → canvas x/y
    const lonMin = -126, lonMax = -65, latMin = 24, latMax = 50;
    const mapW = w - pad * 2, mapH = h - pad * 2;
    const toX = (lon: number) => pad + ((lon - lonMin) / (lonMax - lonMin)) * mapW;
    const toY = (lat: number) => pad + ((latMax - lat) / (latMax - latMin)) * mapH;

    const drawPoly = (coords: [number, number][], stroke: string, fill: string, lineW: number) => {
      ctx.strokeStyle = stroke;
      ctx.fillStyle = fill;
      ctx.lineWidth = lineW;
      ctx.beginPath();
      for (let i = 0; i < coords.length; i++) {
        const x = toX(coords[i][0]), y = toY(coords[i][1]);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      if (fill !== 'none') ctx.fill();
      ctx.stroke();
    };

    // US landmass
    drawPoly(US_OUTLINE, 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.04)', 1.5);

    // Great Lakes (darker to cut out from landmass)
    for (const lake of LAKES) {
      drawPoly(lake, 'rgba(100,150,200,0.2)', 'rgba(20,40,80,0.4)', 1);
    }

    // Job locations
    const jobColors: Record<string, string> = {
      transcon: '#44cc44', marias: '#ccaa22', clearing: '#dd6622', coast: '#dd2244',
      mojave: '#e08a3a', cascade: '#3aa86a', pocahontas: '#8a7ad8',
    };

    for (const job of JOBS) {
      const loc = JOB_LOCATIONS[job.id];
      if (!loc) continue;

      const cx = toX(loc.lon), cy = toY(loc.lat);
      const color = jobColors[job.id] || '#fff';

      // Route line
      const rLen = 30;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(cx - Math.cos(loc.routeAngle) * rLen, cy - Math.sin(loc.routeAngle) * rLen);
      ctx.lineTo(cx + Math.cos(loc.routeAngle) * rLen, cy + Math.sin(loc.routeAngle) * rLen);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Glow ring
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();

      // Label
      // (labels go right of the dot in the west, left in the east; some are
      // nudged up or down so neighbours don't overlap)
      const leftSide = loc.side ? loc.side === 'right' : cx < w / 2;
      const ly = cy + (loc.dy ?? 0);
      ctx.fillStyle = color;
      ctx.font = '600 10px Inter, sans-serif';
      ctx.textAlign = leftSide ? 'left' : 'right';
      const lx = leftSide ? cx + 16 : cx - 16;
      ctx.fillText(job.name.split('—')[0].trim(), lx, ly - 6);
      ctx.font = '9px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(job.location + ' · ' + job.difficulty, lx, ly + 6);
    }

    // Title
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UNITED STATES — RAIL GRINDING CORRIDORS', w / 2, 14);
  }

  hide(): void {
    this.overlay.style.display = 'none';
  }
}
