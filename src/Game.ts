/**
 * Game - Main game class that orchestrates all systems.
 *
 * Integrates: track with curves/banking, grinder on rails, spark system,
 * audio, day/night cycle, track inspection map, segment progress with
 * micro-rewards, floating score popups, screen shake, and rail material
 * transitions from rusty to polished.
 */

import * as THREE from 'three';
import { Engine } from './core/Engine';
import { InputManager } from './core/InputManager';
import { RailTrack, GAME_SECTION_LENGTH, VISUAL_SEGMENT_LENGTH } from './rail/RailTrack';
import { RailProfile } from './rail/RailProfile';
import { ProfileRenderer } from './rail/ProfileRenderer';
import { Environment } from './world/Environment';
import { createGroundTexture, createSnowGroundTexture } from './world/ProceduralTextures';
import { RailGrinder } from './world/RailGrinder';
import { DayNightCycle } from './world/DayNightCycle';
import { Weather } from './world/Weather';
import { GrindEffects, GRIND_CAR_OFFSETS } from './effects/GrindEffects';
import { GroundMist } from './world/GroundMist';
import { Ocean } from './world/Ocean';
import { SlowOrderSigns } from './world/SlowOrderSigns';
import { Landmarks, type Occupancy } from './world/Landmarks';
import { ConsistLights } from './world/ConsistLights';
import { AudioManager } from './audio/AudioManager';
import { PassingTrain } from './world/PassingTrain';
import { GuidedTutorial } from './ui/GuidedTutorial';
import { TrackMap } from './ui/TrackMap';
import { FloatingScore, type BannerLine } from './ui/FloatingScore';
import { RadioDispatch } from './ui/RadioDispatch';
import { InspectionReport } from './ui/InspectionReport';
import { JobSelect, JOBS, type JobDefinition } from './ui/JobSelect';
import { eventBus } from './core/EventBus';
import { disposeObject3D } from './core/dispose';
import { CameraController } from './core/CameraController';
import { RevenueTrainDeadline } from './world/RevenueTrainDeadline';
import type { TargetProfile, Region } from './types/rail';
import {
  COMPLETION_ACCURACY, GRIND_SPEED, COOL_RATE,
  stoneGrindX, stoneContactWidth, heatRatePerSec, heatPenalty, removalRatePerSec,
  sectionStars, jobStars, sectionProgress, approachSpeedLimit, EVENT_PAY, STONE_WEAR, STONE_LIFT_PRESSURE,
} from './game/rules';
import { sectionAccuracy, sectionMeanAccuracy, sectionWorstDeviation, sectionHasExcess, sectionDeepestHump } from './game/sectionMetrics';
import { recordResult, loadRecords, formatTime } from './game/progress';
import { getSettings, updateSettings, onSettingsChange } from './core/settings';
import { SettingsMenu } from './ui/SettingsMenu';
import { Toast } from './ui/Toast';
import { LinesideFire } from './world/LinesideFire';
import { TrackCrews, WORK_ZONE_SPEED, WORK_ZONE_HALF } from './world/TrackCrews';
import { loadJSON, saveJSON } from './core/storage';
import { featuresFor, lessonFor } from './game/lessons';
import { seasonForMonth, SEASON_LOOK, applyCloudShadows, type Season } from './world/Seasons';
import { Wildlife } from './world/Wildlife';
import { Atmos } from './world/Atmos';
import { Structures } from './world/Structures';
import { TrackDetail } from './world/TrackDetail';
import { Bystanders } from './world/Bystanders';
import { CabView } from './ui/CabView';
import { DamageOverlay } from './world/DamageOverlay';
import { Hazards } from './world/Hazards';
import {
  trackClassFor, applyTemplate, TRACK_CLASSES, curvePeaks, STONE_GRADES, planBonus, weatherModifiers,
  REGROWTH_INTERVAL, REGROWTH_AMOUNT, REGROWTH_MAX, EMERGENCY_SECONDS, EMERGENCY_PAY, pickEmergencySection,
  longHaulSeverity, longHaulBonus, LONG_HAUL_SHIFTS, type StoneGrade, type TrackClass,
} from './game/depth';
import { loadLongHaul, saveLongHaul } from './ui/JobSelect';
import { TouchControls } from './ui/TouchControls';
import {
  modifierPay, rankFor, rankPerks, loadDepot, MACHINES, collectibleFor, COLLECTIBLES, loadMuseum, addToMuseum,
  completePhotos, PHOTO_CHALLENGES, earnSaver, session, type ModifierId, type PhotoId, type SaverState, type CollectibleId,
} from './game/engage';
import { currentGoal } from './game/meta';
import { Coach, COACH_LINES, type Mistake } from './game/coach';
import {
  addMastery, MASTERY_UNLOCKS, awardBadges, BADGES, loadLadder, saveLadder, LADDER_RUNG_PAY, LADDER_TOP_PAY,
  currentEvent, grantEventRewards, offerBounty, bountyStep, bountyText, loadCustomPaint, type Bounty,
} from './game/loop';
import { crewBeat, addCrewJob, margeRemark } from './game/story';
import { weekKey } from './game/engage';
import {
  CUSTOMERS, customerFor, customerMet, nextGrade, isMirrorFinish, MIRROR_BONUS, rollFault, FAULTS,
  FAULT_REPAIR_SECONDS, PLATFORM_TILT, SWITCH_STRIKE, QUIET, type Customer, type Fault,
} from './game/ops';
import { makeShareCard, shareBlob } from './ui/ShareCard';
import {
  loadGhost, saveGhost, ghostAt, GHOST_STEP, timeMedal, recordGradeAndMedal, updateRouteConditions,
  routeCondition, conditionSeverity, boardRank, addBoardEntry, loadStats, saveStats, nextDailyStreak,
  selectedLivery, LIVERIES, liveryProgress, loadBoard,
} from './game/meta';
import { checkAchievements, unlockedAchievements } from './game/achievements';
import { nextStoryBeat, markStorySeen } from './game/story';
import { todayKey } from './game/routes';
import { Hints } from './ui/Hints';
import { isColorblindMode } from './ui/palette';
import { DEFECT_KINDS, CHATTER_PRESSURE, CHATTER_FACTOR, chooseSectionKinds, defectPeaks, seededRandom, hashSeed, type DefectKind } from './game/defects';
import { Combo, isPerfectPass, jobGrade, OVERHEAT, GRADE_COLORS, type SectionRun, type Grade } from './game/scoring';
import { loadCareer, saveCareer, upgradeEffects, jobPay, totalBestStars, formatMoney, isUnlocked } from './game/career';
import { PerfOverlay } from './ui/PerfOverlay';
import { PhotoMode } from './ui/PhotoMode';
import { loadQuality, cycleQuality, QUALITY_PRESETS, type QualityLevel } from './core/quality';
import { toggleColorblindMode } from './ui/palette';

const RAILS = ['left', 'right'] as const;
/** Damage kind → the mark drawn on the rail head (see RailBatch.setSurface) */
const DAMAGE_MARK: Record<DefectKind, number> = { wear: 1, corrugation: 2, headCheck: 3, gaugeFace: 4, flatCrown: 5 };

/**
 * What the countryside looks like for each kind of route:
 *   trees     - woodland density (1 = forest)
 *   mountains - distant ranges (0 = flat horizon, >1 = taller)
 */
const REGION_SCENERY: Record<Region, { trees: number; mountains: number }> = {
  prairie:  { trees: 0.15, mountains: 0 },    // Kansas: open grassland, flat horizon
  mountain: { trees: 1.2,  mountains: 1.4 },  // Marias Pass: forest under big peaks
  city:     { trees: 0.3,  mountains: 0 },    // Chicago: scrubby trees, skyline instead
  coast:    { trees: 0.45, mountains: 0.55 }, // California: low coastal hills
  desert:   { trees: 0.02, mountains: 0.6 },  // Mojave: open, with distant ranges
  forest:   { trees: 1.7,  mountains: 1.0 },  // Cascades: dense firs under big hills
  appalachia: { trees: 1.0, mountains: 0.7 }, // rolling wooded ridges
};
/** Bare ground for the dry routes (tints the grass, like the seasons do) */
const DESERT_GROUND = 0xb89566;

export class Game {
  private engine: Engine;
  private input: InputManager;
  // track / environment / passingTrain are (re)built per job in buildWorld()
  private track!: RailTrack;
  private profileRenderer: ProfileRenderer;
  private environment!: Environment;
  private ocean: Ocean | null = null; // only on coastal jobs
  private slowSigns: SlowOrderSigns | null = null;
  private landmarks: Landmarks | null = null;   // route landmarks + level crossings
  private crossingBell = 0;                     // 0..1, from the level crossings
  private consistLights!: ConsistLights;        // headlight that comes on at dusk
  private dayNight: DayNightCycle;
  private grindEffects: GrindEffects; // sparks, work lights, contact glow
  private groundMist: GroundMist;
  private audio: AudioManager;
  private trackMap: TrackMap;
  private floatingScore: FloatingScore;
  private passingTrain!: PassingTrain;
  private radioDispatch: RadioDispatch;
  private perfOverlay: PerfOverlay;
  private weather: Weather;
  private inspectionReport: InspectionReport;
  private jobSelect: JobSelect;
  private guidedTutorial: GuidedTutorial;
  private currentJob: JobDefinition | null = null;
  private preJobRQI: number = 0;
  private gameStarted: boolean = false;
  private isFirstJob: boolean = true;

  private targetProfile: TargetProfile;

  // Grinder state
  private grinderPosition: number = 50;
  private grinderSpeed: number = 0;
  private isGrinding: boolean = false;


  // Stone configuration — independent per rail
  private stoneAngle: { left: number; right: number } = { left: 0, right: 0 };
  private stonePressure: { left: number; right: number } = { left: 50, right: 50 };
  private stoneHeat: number = 0;
  private overheatWarning: boolean = false;

  // Second profile renderer
  private profileRendererRight!: ProfileRenderer;

  // Cached DOM elements
  private angleValue!: HTMLElement;
  private pressureValue!: HTMLElement;
  private speedValue!: HTMLElement;
  private heatValue!: HTMLElement;
  private heatFill!: HTMLElement;
  private grindDotEl!: HTMLElement;
  private grindStatusEl!: HTMLElement;
  private leftRailLabel!: HTMLElement;
  private rightRailLabel!: HTMLElement;
  private segmentsEl!: HTMLElement;
  private accuracyEl!: HTMLElement;
  private angleValueR!: HTMLElement;
  private pressureValueR!: HTMLElement;
  private jobComplete: boolean = false;
  private playTime: number = 0; // seconds of active play this job (not paused)

  // Rail grinder consist
  private grinder!: RailGrinder;

  /** Build the grinder consist if it isn't built yet (see the constructor) */
  private ensureGrinder(): void {
    if (this.grinder) return;
    this.grinder = new RailGrinder();
    this.engine.scene.add(this.grinder.group);
    const l = selectedLivery();
    this.grinder.setLivery(l.body, l.trim);
    this.grinder.setUpgrades(loadCareer().upgrades);
  }

  // Camera views, screen shake, inspection cinematic
  private camera: CameraController;
  // Free camera, hidden HUD, save PNG (key F)
  private photoMode: PhotoMode;
  // Graphics quality preset (key G)
  private quality: QualityLevel = loadQuality();
  // Career upgrade multipliers for the current job (heat / removal / contact width)
  private upgrades = upgradeEffects(loadCareer().upgrades);

  // Revenue train countdown + "missed window" penalty
  private deadline: RevenueTrainDeadline;

  // Segment tracking
  private initialSectionAccuracy: number[] = []; // mean accuracy at job start, for progress bars
  private segmentCompleted: boolean[] = [];
  /** How many entries of segmentCompleted are true (kept up to date, not recounted every frame) */
  private completedCount = 0;
  private segmentPasses: number[] = [];
  private segmentDamage: number[] = [];
  private segmentSlowOrder: boolean[] = [];   // true = speed restricted
  private lastSectionIndex: number = -1;
  private consecutiveCompleted: number = 0;
  private settingsMenu!: SettingsMenu;
  private toast = new Toast();
  private cabView = new CabView();
  // ---- Batch D: job events ----
  /** 0..100 how much grinding the stones have left in them */
  private stoneLife = 100;
  /** Seconds Z has been held for a stone change */
  private stoneChange = 0;
  /** Grinding speed the player has set with W / S (m/s) */
  private grindSpeedSetting = GRIND_SPEED;
  private fire = new LinesideFire();
  private fireBurnTime = 0;
  private fireFined = false;
  private crews: TrackCrews | null = null;
  private weldTimer = -1;
  private weldSparkTimer = 0;
  private holdsUsed = 0;
  /** Estimated passes per section at job start (for the "under par" bonus) */
  private sectionPar: number[] = [];
  private eventText = '';
  private wasGrinding = false;
  // ---- Depth (game/depth.ts) ----
  private baseTargetPoints = RailProfile.createAREMA136RE();
  private trackClass: TrackClass = 'standard';
  private stoneGrade: StoneGrade = 'standard';
  private plannedPasses = 0;
  private weatherMods = weatherModifiers(0, false);
  private weatherNoticeShown = false;
  private regrowTimer = 0;
  private regrowNoticeShown = false;
  private emergency: { sec: number; left: number } | null = null;
  private emergencyTimer = 90;
  private emergenciesLeft = 2;
  // ---- UI (batch H) ----
  /** Left-rail profile of each section's middle stretch at job start (results scrubber) */
  private profilesBefore: { x: number; y: number }[][] = [];
  /** Stars earned per finished section */
  private segmentStars: number[] = [];
  private touch!: TouchControls;
  // ---- Engagement & loop (batches I/J, game/engage.ts) ----
  private mods: ModifierId[] = [];
  private perks = rankPerks(0);
  private machine = MACHINES.g17;
  private crew = { firewatch: false, welder: false, mechanic: false, spotter: false };
  private collectible: { id: CollectibleId; dist: number; mesh: THREE.Mesh; found: boolean } | null = null;
  /** Every rail profile at job start (to put a section back for a retry) */
  private startProfiles: { left: { x: number; y: number }[]; right: { x: number; y: number }[] }[] = [];
  private retryOffer: { sec: number; until: number } | null = null;
  /** Sections replayed for practice: they don't score */
  private practiced = new Set<number>();
  private resultFrame: Blob | null = null;
  private captureRequested = false;
  /** Which job events are switched on yet (staged tutorial, see game/lessons.ts) */
  private features = featuresFor(0);
  // ---- Batch E: visuals ----
  private wildlife: Wildlife | null = null;
  private atmos: Atmos | null = null;
  /** Bridges and tunnels on this job's line */
  private structures: Structures | null = null;
  /** Tie plates, clips and weld collars around the consist */
  private trackDetail: TrackDetail | null = null;
  /** Railfans and a station platform full of waving kids */
  private bystanders: Bystanders | null = null;
  /** The scan painted on the track (key B) */
  private overlay: DamageOverlay | null = null;
  /** Switches to lift over, and the quiet zone by the platform */
  private hazards: Hazards | null = null;
  private strikeCooldown = 0;
  private quietFined = false;
  private dawnAmount = 0;
  private cloudShadows: ReturnType<typeof applyCloudShadows> | null = null;
  private season: Season = 'summer';
  private wetness = 0;
  private lightningTimer = 8;
  private flash = 0;
  private hazeLevel = 0;
  /** End-of-job vista: seconds into the shot, or -1 */
  private vistaTime = -1;
  private _fxVec = new THREE.Vector3();
  /** Best run's positions over time (raced on the track map), and this run's */
  private ghost: number[] | null = null;
  private ghostSamples: number[] = [];
  private ghostTimer = 0;
  /** Over-grind events this job (for achievements / stats) */
  private overgrindCount = 0
  private hints!: Hints;
  /** Grinding latched on (Settings → "Press to toggle") */
  private grindLatched = false;
  private rumbleTimer = 0;
  private loadingTipTime = -1;
  /** Defect kind of each section (see game/defects.ts) */
  private sectionKinds: DefectKind[] = [];
  /** Heading change across each section (+ = left), for curve wear */
  private sectionTurn: number[] = [];
  /** Damage multiplier from the route's condition (see game/meta.ts) */
  private conditionFactor = 1;
  /** Highest stone heat while grinding each section (for perfect passes) */
  private sectionMaxHeat: number[] = [];
  /** 3-star streak and its multiplier (see game/scoring.ts) */
  private combo = new Combo();
  /** Bonus pay earned this job (perfect passes, combos), paid at the end */
  private jobBonus = 0;
  private perfectCount = 0;
  /** Stones went over OVERHEAT this stretch (so the combo only breaks once per overheat) */
  private overheated = false;
  private sweetSpotCooldown = 0;
  private chatterCooldown = 0;
  private trackRestoredFt: number = 0;
  private overgrindCooldown: number = 0;

  // Inspection pass
  private inspectionPass: boolean = false;
  private inspectionTimer: number = 0;

  // Pause menu
  private isPaused: boolean = false;
  private pauseMenu!: HTMLElement;

  // Pre-allocated temp objects to avoid per-frame garbage
  private _tmpVec = new THREE.Vector3();
  private _tmpVec2 = new THREE.Vector3();
  private _tmpVec3 = new THREE.Vector3();
  private _tmpQuat = new THREE.Quaternion();
  private _tmpMat = new THREE.Matrix4();
  private _worldUp = new THREE.Vector3(0, 1, 0);

  // Throttle for expensive geometry rebuilds
  private _rebuildTimer: number = 0;
  private _rebuildInterval: number = 0.15; // rebuild meshes at most ~7x/sec

  private totalMetalRemoved: number = 0;

  // Audio initialized flag
  private audioReady: boolean = false;

  // Ground
  private ground!: THREE.Mesh;
  private grassGroundTexture!: THREE.Texture;
  private snowGroundTexture!: THREE.Texture;

  /** Number of scored game sections on the current track */
  private get sectionCount(): number { return this.track.sectionCount; }
  /** Total length of the current track spline, in metres */
  private get trackLength(): number { return this.track.totalLength; }

  /** World position of the grinder (lighting/shadows/mist follow this) */
  private grinderFocus(): THREE.Vector3 {
    const d = Math.max(0.1, Math.min(this.trackLength - 0.1, this.grinderPosition));
    return this._focus.copy(this.track.getTrackPoint(d).position);
  }
  private _focus = new THREE.Vector3();
  private _dustColor = new THREE.Color();

  /**
   * Photo mode frame: game logic frozen, but the world keeps living —
   * sparks fall, dust drifts, sky/weather animate, and N/P still work.
   */
  private updatePhotoMode(dt: number): void {
    const target = this.photoMode.update(dt, this.track);
    this.updateAtmosphere(dt);
    this.grindEffects.update(dt);
    this.weather.update(dt, target);
    if (this.input.wasKeyPressed('n')) this.dayNight.cycleTime();
    if (this.input.wasKeyPressed('p')) this.weather.toggle();
  }

  /** Turn the current quality preset into renderer settings */
  private applyQuality(): void {
    const q = QUALITY_PRESETS[this.quality];
    this.engine.bloomEnabled = q.bloom;
    this.engine.fpsCap = q.fpsCap;
    this.engine.setPixelBoost(q.pixelBoost);
    const sun = this.engine.directionalLight;
    sun.castShadow = q.shadowMapSize > 0;
    if (q.shadowMapSize > 0 && sun.shadow.mapSize.x !== q.shadowMapSize) {
      sun.shadow.mapSize.set(q.shadowMapSize, q.shadowMapSize);
      sun.shadow.map?.dispose(); // three.js re-creates it at the new size
      sun.shadow.map = null;
    }
    this.groundMist.group.visible = q.mist;
    this.grindEffects.dustAmount = q.dustAmount;
  }

  /**
   * Stretches of track that level crossings must treat as "train coming":
   * the grinder consist and any passing freight, each stretched ahead by
   * ~6 seconds of travel so the lights and gates get going in good time.
   */
  private crossingOccupancy(): Occupancy[] {
    const LEAD_SECONDS = 6;
    const pos = this.grinderPosition;
    const v = this.grinderSpeed;
    // The consist runs from ~50 m behind grinderPosition to ~76 m ahead of it
    // (reuses the same objects every frame: no per-frame garbage)
    const occ = this._occupancy;
    occ.length = 1;
    occ[0] = this._occGrinder;
    this._occGrinder.from = pos - 50 - 15 - Math.max(0, -v) * LEAD_SECONDS;
    this._occGrinder.to = pos + 76 + 45 + Math.max(0, v) * LEAD_SECONDS;
    const freight = this.passingTrain.span();
    if (freight) {
      this._occFreight.from = freight.rear - 10;
      this._occFreight.to = freight.front + freight.speed * LEAD_SECONDS;
      occ.push(this._occFreight);
    }
    return occ;
  }
  private _occupancy: Occupancy[] = [];
  private _occGrinder: Occupancy = { from: 0, to: 0 };
  private _occFreight: Occupancy = { from: 0, to: 0 };

  /**
   * Rain and snow stop at the train roofs instead of falling through the cars
   * (and into the cab view): give the weather a chain of points along the
   * middle of the consist, every 1.5 m from its tail (−50 m) to its nose (+76 m).
   */
  private updateWeatherShelter(): void {
    const pts = this._shelterPts;
    const n = pts.length / 2;
    const len = this.trackLength;
    for (let i = 0; i < n; i++) {
      const d = Math.max(0.1, Math.min(len - 0.1, this.grinderPosition - 50 + i * 1.5));
      const p = this.track.getTrackPoint(d).position;
      pts[i * 2] = p.x;
      pts[i * 2 + 1] = p.z;
    }
    // radius 1.7 m at 1.5 m spacing covers the 3.1 m-wide cars; roofs are ~4.4 m up
    this.weather.setShelter(pts, n, 1.7, 4.4);
  }
  private _shelterPts = new Float32Array(Math.ceil(126 / 1.5 + 1) * 2);

  /** Sky, sun, fog, colour grade and ground mist — all follow time of day and the grinder */
  private updateAtmosphere(dt: number): void {
    const focus = this.grinderFocus();
    // Weather feeds the sky: clouds grey it out, snow whitens the ground
    this.dayNight.overcast = this.weather.overcast;
    this.updateWorldFx(dt);
    this.dayNight.update(dt, this.engine.camera, focus);
    this.updateScreenFx(dt);
    const inTunnel = this.updateTunnel(dt);
    const dark = Math.max(this.dayNight.darkness, inTunnel);
    this.updateWeatherShelter();
    this.consistLights.update(this.track, this.grinderPosition, dark, this.weather.haze);
    this.crossingBell = this.landmarks?.update(dt, this.crossingOccupancy(), this.grinderPosition, dark) ?? 0;
    this.groundMist.update(dt, focus, this.dayNight.fogColor, this.dayNight.currentName);
    this.ocean?.update(dt, this.dayNight.sky, this.dayNight.fogColor);
    // Dust takes on the colour of the air around it: pale tan by day, dim at night
    const fog = this.dayNight.fogColor;
    const skyLight = Math.min(1, 0.3 + (fog.r * 0.3 + fog.g * 0.59 + fog.b * 0.11) * 1.3);
    this._dustColor.setRGB(0.62, 0.56, 0.48).lerp(fog, 0.5).multiplyScalar(skyLight);
    const cam = this.engine.camera;
    this.grindEffects.setDustLook(this._dustColor,
      this.engine.renderHeight / (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2)), this.dayNight.darkness);
  }

  /**
   * Tunnels: where is the camera, and how far inside? Daylight drops away
   * (headlight and sparks do the lighting), sound echoes, rain stops.
   * @returns 0 (outside) .. 1 (deep inside)
   */
  private updateTunnel(dt: number): number {
    const st = this.structures;
    if (!st || !st.list.some((s) => s.kind === 'tunnel')) return 0;
    // Nearest track point to the camera, searched around the grinder
    const cam = this.engine.camera.position;
    let best = Infinity, bestD = this.grinderPosition;
    for (let d = this.grinderPosition - 90; d <= this.grinderPosition + 110; d += 2) {
      const p = this.track.getTrackPoint(Math.max(0.1, Math.min(this.trackLength - 0.1, d))).position;
      const dd = (p.x - cam.x) ** 2 + (p.z - cam.z) ** 2;
      if (dd < best) { best = dd; bestD = d; }
    }
    const tp = this.track.getTrackPoint(Math.max(0.1, Math.min(this.trackLength - 0.1, bestD)));
    const side = (cam.x - tp.position.x) * tp.right.x + (cam.z - tp.position.z) * tp.right.z;
    const inside = side > -3.6 && side < 8.6 && cam.y - tp.position.y < 6;
    st.update(dt, bestD, inside);
    const t = st.tunnelAmount;
    if (t > 0.01) {
      this.engine.directionalLight.intensity *= 1 - 0.93 * t;
      this.engine.ambientLight.intensity *= 1 - 0.7 * t;
    }
    this.weather.group.visible = t < 0.5;
    if (this.audioReady) this.audio.setEcho(st.insideTunnel(this.grinderPosition));
    return t;
  }

  /**
   * @param audioContext - made on the title click (a user gesture), if available
   * @param continueJob - CONTINUE on the title screen: start this job straight away
   */
  constructor(audioContext?: AudioContext, continueJob?: JobDefinition) {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    this.engine = new Engine(canvas);
    this.input = new InputManager();
    this.profileRenderer = new ProfileRenderer('profile-left');
    this.profileRendererRight = new ProfileRenderer('profile-right');
    this.profileRendererRight.mirrored = true;

    // Cache all DOM elements (avoid per-frame getElementById)
    this.angleValue = document.getElementById('angle-value')!;
    this.pressureValue = document.getElementById('pressure-value')!;
    this.speedValue = document.getElementById('speed-display')!;
    this.heatValue = document.getElementById('heat-value')!;
    this.heatFill = document.getElementById('heat-fill')!;
    this.grindDotEl = document.getElementById('grind-dot')!;
    this.grindStatusEl = document.getElementById('grind-status')!;
    this.leftRailLabel = document.getElementById('left-rail-label')!;
    this.rightRailLabel = document.getElementById('right-rail-label')!;
    this.segmentsEl = document.getElementById('segments-display')!;
    this.accuracyEl = document.getElementById('accuracy-display')!;
    this.angleValueR = document.getElementById('angle-value-r')!;
    this.pressureValueR = document.getElementById('pressure-value-r')!;

    // Pause menu
    this.pauseMenu = document.getElementById('pause-menu')!;
    document.getElementById('pause-resume')!.addEventListener('click', () => this.togglePause());
    document.getElementById('pause-restart')!.addEventListener('click', () => {
      this.togglePause();
      if (this.currentJob) this.rebuildForJob(this.currentJob);
    });
    document.getElementById('pause-quit')!.addEventListener('click', () => {
      this.togglePause();
      this.startJobSelect();
    });
    document.getElementById('pause-settings')!.addEventListener('click', () => this.settingsMenu.open('settings'));
    document.getElementById('pause-help')!.addEventListener('click', () => this.settingsMenu.open('controls'));
    document.getElementById('pause-glossary')!.addEventListener('click', () => this.settingsMenu.open('glossary'));

    this.targetProfile = {
      name: 'AREMA 136RE Standard',
      points: RailProfile.createAREMA136RE(),
      tolerance: 0.05,
    };

    // Ground (persistent — repositioned per job)
    this.createGround();

    // Rail grinder consist: built just after the job menu appears (it takes a
    // moment to merge its ~4,000 parts, and nobody sees it until a job starts).
    // ensureGrinder() also builds it on the spot if a job is picked first.
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    if (idle) idle(() => this.ensureGrinder()); else setTimeout(() => this.ensureGrinder(), 50);

    // Day/night cycle with rich color palettes
    this.dayNight = new DayNightCycle(
      this.engine.scene,
      this.engine.directionalLight,
      this.engine.ambientLight,
      this.engine.renderer,
      { bloom: this.engine.bloom, grade: this.engine.grade },
    );
    this.dayNight.setGroundMesh(this.ground);

    // Sparks, work lights, contact glow
    this.grindEffects = new GrindEffects(this.engine.scene);

    // Low-lying haze around the grinder (density/colour follow time of day)
    this.groundMist = new GroundMist();
    this.engine.scene.add(this.groundMist.group);
    this.applyQuality(); // bloom / shadows / mist / dust from the saved preset

    // Audio
    this.audio = new AudioManager();
    if (audioContext) {
      // The title click opened the audio device (the slow part); build the
      // sound graph now but stay silent in the menu, as before. The first
      // click / key press in the menu just resumes it (see initAudio below).
      this.audio.init(audioContext);
      void audioContext.suspend();
    }

    // Track map
    this.trackMap = new TrackMap();

    // Floating scores
    this.floatingScore = new FloatingScore();

    // Camera + revenue-train deadline
    this.camera = new CameraController(this.engine.camera);
    this.photoMode = new PhotoMode(this.engine, this.camera, this.input);
    this.deadline = new RevenueTrainDeadline({
      trackMap: this.trackMap,
      floatingScore: this.floatingScore,
      audio: this.audio,
      isAudioReady: () => this.audioReady,
    });

    // Radio dispatch
    this.radioDispatch = new RadioDispatch();
    this.perfOverlay = new PerfOverlay();

    // Weather
    this.weather = new Weather();
    this.engine.scene.add(this.weather.group);

    // Headlight beam at the front of the consist (fades in as it gets dark)
    this.consistLights = new ConsistLights();
    this.engine.scene.add(this.consistLights.group);

    // Inspection report, job selection, guided tutorial
    this.inspectionReport = new InspectionReport();
    this.jobSelect = new JobSelect();
    this.settingsMenu = new SettingsMenu({
      getQuality: () => this.quality,
      cycleQuality: () => { this.quality = cycleQuality(this.quality); this.applyQuality(); this.engine.prewarm(false); },
      getColorblind: () => isColorblindMode(),
      toggleColorblind: () => { toggleColorblindMode(); },
    });
    // A settings button on the job menu too
    this.jobSelect.onOpenSettings = () => this.settingsMenu.open('settings');
    this.hints = new Hints();
    this.engine.scene.add(this.fire.group, this.fire.sprayObject);
    this.touch = new TouchControls(this.input);
    this.photoMode.onSaved = () => this.checkPhotoChallenges();
    this.input.setKeymap(getSettings().keymap);
    onSettingsChange((s) => this.input.setKeymap(s.keymap));
    this.jobSelect.onLiveryChange = () => {
      const l = selectedLivery();
      this.grinder?.setLivery(l.body, l.trim);
    };
    onSettingsChange((s) => {
      if (this.audioReady) this.audio.setVolumes(s.masterVolume, s.effectsVolume, s.ambienceVolume, s.musicVolume);
      this.camera.motionScale = s.reducedMotion ? 0.3 : 1;
      this.camera.shakeScale = s.screenShake ? 1 : 0;
      this.engine.hitStopEnabled = !s.reducedMotion;
      this.engine.timeScale = s.gameSpeed;
      this.hints.enabled = s.hints;
      this.profileRenderer.simple = this.profileRendererRight.simple = s.simpleProfile;
      // Bigger HUD (text and panels) without touching every style
      for (const id of ['top-bar', 'profile-container', 'track-map', 'combo-pill', 'control-hint', 'radio-dispatch', 'deadline-bar']) {
        const el = document.getElementById(id);
        if (el) (el.style as CSSStyleDeclaration & { zoom: string }).zoom = String(s.uiScale);
      }
    });
    this.guidedTutorial = new GuidedTutorial();

    // (No world is built yet: the job-select screen covers everything, and the
    // world is built for whichever job the player picks. Building one just as
    // a hidden backdrop cost ~0.3 s plus compiling all its shaders on the first
    // frame, which froze the page for up to a second after clicking start.)
    // Compile what exists now (sky, ground, effects) in the background:
    this.engine.prewarm();

    // Show job selection screen first (or go straight into CONTINUE's job)
    if (continueJob) { this.isFirstJob = false; this.guidedTutorial.setReplay(); }
    this.startJobSelect(continueJob);

    // Register update loop
    this.engine.onUpdate(this.update.bind(this));
    // Only draw the 3D scene while it can actually change: during play, the
    // inspection pass and photo mode. In menus, reports and the pause menu
    // the world is frozen, so the last frame is simply kept on screen.
    this.engine.renderHold = () => !(this.photoMode.active || this.inspectionPass
      || (this.gameStarted && !this.jobComplete && !this.isPaused));

    // Init audio on first user interaction (use { once: true } to auto-cleanup)
    const initAudio = () => {
      if (!this.audioReady) {
        this.audio.init();
        this.audioReady = true;
        const st = getSettings();
        this.audio.setVolumes(st.masterVolume, st.effectsVolume, st.ambienceVolume, st.musicVolume);
        // Remove the other listener since only one fires first
        window.removeEventListener('keydown', initAudio);
        window.removeEventListener('click', initAudio);
      }
    };
    window.addEventListener('keydown', initAudio);
    window.addEventListener('click', initAudio);
    // (The profile displays and HUD are drawn once a job's world exists:
    // update() refreshes them every frame of play.)
  }

  /**
   * Generate multi-peak defects that require angle sweeping to fix.
   * Each section gets 2-4 distinct defect peaks at different lateral positions.
   * Later sections have more defects and tighter tolerance requirements.
   */
  private applyInitialDefects(job: JobDefinition): void {
    const totalVisual = this.track.segmentCount;
    // Seeded: the same contract always has the same damage (fair for best
    // scores); daily and random routes pass their own seed
    const rand = seededRandom(job.seed ?? hashSeed(job.id));
    // A well-kept route comes back in better shape; a neglected one worse
    this.conditionFactor = job.id.startsWith('daily-') || job.id.startsWith('random-')
      ? 1 : conditionSeverity(routeCondition(job.id));
    this.sectionKinds = job.id === 'practice'
      ? (['wear', 'corrugation', 'headCheck', 'gaugeFace', 'flatCrown'] as DefectKind[]).slice(0, this.sectionCount)
      : chooseSectionKinds(this.sectionCount, job.region, rand, this.isFirstJob);

    // Target profile for this route's class of track
    this.trackClass = job.id === 'practice' || this.isFirstJob ? 'standard' : trackClassFor(job.region, job.seed ?? 0);
    this.targetProfile.points = applyTemplate(this.baseTargetPoints, this.trackClass);
    this.targetProfile.name = TRACK_CLASSES[this.trackClass].name;
    // Long haul: a poor previous shift leaves more damage
    if (job.id.startsWith('haul-')) this.conditionFactor = longHaulSeverity(loadLongHaul().stars);
    if (job.modifiers?.includes('heavyDamage')) this.conditionFactor *= 1.3;
    // How much each section turns (+ = left): curves wear the high and low rail differently
    const sectionTurn: number[] = [];
    for (let s = 0; s < this.sectionCount; s++) {
      const a = this.track.getTrackPoint(this.track.sectionOffset + s * GAME_SECTION_LENGTH).forward;
      const b = this.track.getTrackPoint(Math.min(this.track.totalLength - 0.1, this.track.sectionOffset + (s + 1) * GAME_SECTION_LENGTH)).forward;
      let d = Math.atan2(b.x, b.z) - Math.atan2(a.x, a.z);
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      sectionTurn.push(-d); // heading grows turning right (+x), so negate for "+ = left"
    }
    this.sectionTurn = sectionTurn;

    for (let vi = 0; vi < totalVisual; vi++) {
      const viDist = vi * VISUAL_SEGMENT_LENGTH;
      const secIdx = this.track.getSectionIndex(viDist);
      // Skip lead-in and run-out track (outside the scored sections)
      if (secIdx < 0) continue;
      const jobSeverity = job.defectSeverity * this.conditionFactor;
      // First 2 sections are trivially easy for onboarding
      const easyMult = (this.isFirstJob && secIdx < 2) ? 0.15 : 1.0;
      // Severity ramps up along the route. DEFECT_SCALE sets overall difficulty:
      // tuned so even the Easy job starts below the RQI 80 target. (1.4 until
      // the play-test bot needed ~19 minutes and 3.5 passes a section on the
      // Easy job; with 1.1 and faster-cutting stones it's about half that.)
      const DEFECT_SCALE = 1.1;
      const difficulty = (0.6 + (secIdx / this.sectionCount) * 0.4) * jobSeverity * DEFECT_SCALE * easyMult;
      const kind = this.sectionKinds[secIdx];

      for (const rail of ['left', 'right'] as const) {
        // Same kind on both rails, but each 5 m stretch of each rail varies a little
        const peaks = [...defectPeaks(kind, rand), ...(this.isFirstJob ? [] : curvePeaks(sectionTurn[secIdx] ?? 0, rail))];
        const profile = this.track.getProfile(vi, rail);
        for (const point of profile.points) {
          for (const peak of peaks) {
            const dx = point.x - peak.cx;
            const defect = peak.base * difficulty * Math.exp(-(dx * dx) / (2 * peak.sigma * peak.sigma));
            const variation = 0.7 + rand() * 0.6;
            point.y -= defect * variation;
          }
        }
        profile.markChanged();
        this.track.rebuildSegment(vi, rail);
      }
    }
  }

  /** Set the damage glow intensity on each 3D rail segment based on defect severity */
  private setSegmentDefectGlow(): void {
    for (let vi = 0; vi < this.track.segmentCount; vi++) {
      for (const rail of ['left', 'right'] as const) {
        const profile = this.track.getProfile(vi, rail);
        const dev = profile.compare(this.targetProfile);
        const severity = Math.min(1, dev.averageDeviation * 8);
        const segments = rail === 'left' ? this.track.leftSegments : this.track.rightSegments;
        if (vi < segments.length) {
          segments[vi].setDefectSeverity(severity);
          // Marks on the rail head show the kind of damage from a distance
          const kind = this.sectionKinds[this.track.getSectionIndex(vi * VISUAL_SEGMENT_LENGTH)];
          segments[vi].setDamageKind(kind ? DAMAGE_MARK[kind] : 0);
        }
      }
    }
  }


  /** Only assign slow orders to the worst ~45% of sections based on defect severity */
  private assignSlowOrders(): void {
    // Compute severity per section
    const severities: { sec: number; sev: number }[] = [];
    for (let sec = 0; sec < this.sectionCount; sec++) {
      if (this.track.getSegmentsForSection(sec).length === 0) continue;
      severities.push({ sec, sev: sectionWorstDeviation(this.track, this.targetProfile, sec) });
    }

    // Sort by severity, worst first
    severities.sort((a, b) => b.sev - a.sev);

    // Only the top ~45% get slow orders
    const slowCount = Math.ceil(severities.length * 0.45);
    this.segmentSlowOrder = new Array(this.sectionCount).fill(false);
    for (let i = 0; i < slowCount; i++) {
      this.segmentSlowOrder[severities[i].sec] = true;
    }
  }

  private updateTrackMapDefects(): void {
    for (let sec = 0; sec < this.sectionCount; sec++) {
      if (this.track.getSegmentsForSection(sec).length === 0) continue;
      this.trackMap.updateSegment(sec, {
        defectSeverity: Math.min(1, sectionWorstDeviation(this.track, this.targetProfile, sec) * 10),
        accuracy: sectionAccuracy(this.track, this.targetProfile, sec),
        slowOrder: this.segmentSlowOrder[sec],
        kindCode: this.sectionKinds[sec] ? DEFECT_KINDS[this.sectionKinds[sec]].short : undefined,
      });
    }
    this.trackMap.describe = (i) => this.describeSection(i);
  }

  /** Track map hover: what this section needs */
  private describeSection(i: number): string {
    if (i < 0 || i >= this.sectionCount) return '';
    const kind = this.sectionKinds[i];
    const info = kind ? DEFECT_KINDS[kind] : null;
    if (this.segmentCompleted[i]) return `<b style="color:#7dff8a">SECTION ${i + 1} · DONE</b>`;
    const acc = Math.round(sectionAccuracy(this.track, this.targetProfile, i) * 100);
    const passes = this.estimatePasses(i);
    // Suggested settings from the worst hump of each rail in the middle stretch
    const vi = this.middleSegmentOf(i);
    const aim = RAILS.map((rail) => {
      const z = this.worstZonesFor(this.track.getProfile(vi, rail)).find((q) => q.severity > this.targetProfile.tolerance);
      return z ? `${Math.round(Math.max(-40, Math.min(40, z.centerX / 0.7)))}°` : '—';
    });
    const press = kind ? { wear: 50, corrugation: 40, headCheck: 80, gaugeFace: 75, flatCrown: 35 }[kind] : 50;
    return `<b style="color:#ffcc55">SECTION ${i + 1} · ${info ? info.name : ''}</b><br>`
      + `${info ? info.tip + '<br>' : ''}`
      + `<span style="color:#8ad0ff">Try: angle L ${aim[0]} · R ${aim[1]} · pressure ~${press}%</span><br>`
      + `Accuracy ${acc}% · est. ${passes} pass${passes === 1 ? '' : 'es'}`
      + (this.segmentSlowOrder[i] ? '<br><span style="color:#ffcc00">Slow order: 10 mph until fixed</span>' : '');
  }

  /**
   * Roughly how many grinding passes a section needs: its deepest excess metal
   * divided by what one pass at 50% pressure takes off a point (the grinder
   * spends ~2.5 s over each 5 m stretch at grinding speed).
   */
  private estimatePasses(sec: number): number {
    // The deepest hump decides it (the play-test found the average deviation
    // said "1 pass" for every section of every job)
    const excess = sectionDeepestHump(this.track, this.targetProfile, sec) - this.targetProfile.tolerance;
    const perPass = removalRatePerSec(50) * this.upgrades.removal * (5 / GRIND_SPEED);
    return Math.max(1, Math.ceil(excess / perPass));
  }

  /** Route name + a tip while a job loads (shaders compiling); fades after */
  private showLoadingTip(job: JobDefinition): void {
    const tips = [
      'Listen for the bright <i>tink</i>: your stone is right on the worst spot.',
      'Between 60% and 80% heat the stones cut faster. Past 80% they glaze — and your combo is gone.',
      'Corrugation chatters under heavy pressure. Go light and wide.',
      'Head checks are deep and narrow: aim at the gauge corner and lean on it.',
      'Gauge-face wear sits on the very edge: tilt the stone all the way.',
      'Finish a section in one clean pass for a PERFECT PASS bonus.',
      'Three-star sections in a row build a combo that multiplies your bonus pay.',
      'Hover a section on the track map to see what it needs.',
      'Press V for the simple profile display, H for settings and help.',
      'Coarse stones cut fast but cost finish bonus; fine stones pay more for patience.',
      'On a curve the outer rail wears on its gauge face and the inner rail on its crown.',
      'Untouched sections keep wearing as traffic runs — do not leave the worst for last.',
    ];
    const route = document.getElementById('loading-route');
    const text = document.getElementById('loading-text');
    const box = document.getElementById('loading-tip');
    if (!route || !text || !box) return;
    route.textContent = job.name.toUpperCase();
    text.innerHTML = tips[Math.floor(Math.random() * tips.length)];
    box.style.opacity = '1';
    this.loadingTipTime = 0;
  }

  private updateLoadingTip(dt: number): void {
    if (this.loadingTipTime < 0) return;
    this.loadingTipTime += dt;
    // Keep it up while shaders compile, and at least ~2.5 s so it can be read
    if (this.loadingTipTime > 2.5 && !this.engine.isCompiling) {
      const box = document.getElementById('loading-tip');
      if (box) box.style.opacity = '0';
      this.loadingTipTime = -1;
    }
  }

  private createGround(): void {
    // Large ground plane centered on the track area (track goes x:0-55, z:-10 to 350)
    const groundGeo = new THREE.PlaneGeometry(800, 800);
    // Grass by default; snowy routes swap in the snow texture (see buildWorld)
    this.grassGroundTexture = createGroundTexture();
    this.snowGroundTexture = createSnowGroundTexture();
    // Matte (Lambert) shading: the ground is fully rough, so this looks the
    // same as the standard material and is cheaper on the biggest surface in view
    const groundMat = new THREE.MeshLambertMaterial({
      color: 0x4a6a3a,
      map: this.grassGroundTexture,
    });
    this.ground = new THREE.Mesh(groundGeo, groundMat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.set(30, -0.6, 170); // centered on the track midpoint
    this.ground.receiveShadow = true;
    this.cloudShadows = applyCloudShadows(groundMat);
    this.engine.scene.add(this.ground);
  }



  // ---- MAIN UPDATE LOOP ----

  /** Feed the hint system what's going on right now */
  private updateHints(dt: number): void {
    const sec = this.track.getSectionIndex(this.grinderPosition);
    const needsWork = sec >= 0 && !this.segmentCompleted[sec];
    let offTarget = false, corrugationHeavy = false;
    if (needsWork) {
      const vi = this.track.getSegmentIndex(this.grinderPosition);
      for (const rail of RAILS) {
        const worst = this.worstZonesFor(this.track.getProfile(vi, rail))[0];
        if (worst && worst.severity > this.targetProfile.tolerance
            && Math.abs(worst.centerX - stoneGrindX(this.stoneAngle[rail])) > 5) offTarget = true;
        if (this.sectionKinds[sec] === 'corrugation' && this.stonePressure[rail] > CHATTER_PRESSURE) corrugationHeavy = true;
      }
    }
    // Long stretch of finished (or no) track before the next job: SHIFT helps
    let fastTravelUseful = false;
    if (!needsWork) {
      const next = this.segmentCompleted.findIndex((d, i) => !d && i > sec);
      const nextDist = next >= 0 ? this.track.sectionOffset + next * GAME_SECTION_LENGTH : Infinity;
      fastTravelUseful = nextDist - this.grinderPosition > 60 && next >= 0;
    }
    // One message at a time: control hints stay quiet while a job event or card is showing
    this.hints.update(dt, {
      playing: !this.eventText && this.cardBusyUntil < performance.now(), grinding: this.isGrinding, speed: this.grinderSpeed, heat: this.stoneHeat,
      offTarget, needsWork, corrugationHeavy, fastTravelUseful,
    }, this.input.lastDevice);
  }

  private togglePause(): void {
    this.hints.hideNow();
    if (!this.gameStarted || this.jobComplete || this.inspectionPass) return;
    this.isPaused = !this.isPaused;
    this.pauseMenu.style.display = this.isPaused ? 'flex' : 'none';
    if (this.isPaused) this.fillPauseStats();
  }

  /** The visual segment in the middle of a section */
  private middleSegmentOf(section: number): number {
    const d = this.track.sectionOffset + (section + 0.5) * GAME_SECTION_LENGTH;
    return Math.min(this.track.segmentCount - 1, Math.floor(d / VISUAL_SEGMENT_LENGTH));
  }

  /** Pause menu: how the job is going */
  private fillPauseStats(): void {
    const el = document.getElementById('pause-stats');
    if (!el) return;
    const done = this.completedCount;
    const stars = this.segmentStars.reduce((a, b) => a + (b || 0), 0);
    const est = jobGrade(Math.max(1, Math.round((stars / Math.max(1, done)) * 5 / 3)), this.perfectCount, this.combo.best, this.sectionCount);
    const mins = Math.floor(this.playTime / 60), secs = Math.floor(this.playTime % 60).toString().padStart(2, '0');
    const cell = (k: string, v: string) => `<div><div style="font-size:9px; letter-spacing:2px; color: var(--ui-dim);">${k}</div><div style="font-size:16px; font-weight:700;">${v}</div></div>`;
    el.innerHTML = [
      cell('SECTIONS', `${done} / ${this.sectionCount}`),
      cell('TIME', `${mins}:${secs}`),
      cell('COMBO', `${this.combo.count} (best ${this.combo.best})`),
      cell('BONUS SO FAR', `$${this.jobBonus.toLocaleString()}`),
      cell('PERFECT PASSES', String(this.perfectCount)),
      cell('GRADE SO FAR', done ? est : '—'),
    ].join('');
  }

  private update(dt: number): void {
    // Settings toggles work everywhere, including menus
    this.input.pollGamepad();
    this.touch?.setVisible(this.gameStarted && !this.jobComplete && !this.inspectionPass && !this.isPaused);
    this.perfOverlay.update(this.engine.renderer.info.render);
    // Settings menu (H — O is the right stone's angle key); while it's open the game is paused
    if (this.settingsMenu.isOpen) { this.input.endFrame(); return; }
    if (this.input.wasKeyPressed('h')) {
      const wasPlaying = this.gameStarted && !this.isPaused && !this.jobComplete && !this.inspectionPass;
      if (wasPlaying) this.togglePause();
      this.settingsMenu.open('settings', () => { if (wasPlaying && this.isPaused) this.togglePause(); });
      this.input.endFrame();
      return;
    }
    if (this.input.wasKeyPressed('v')) updateSettings({ simpleProfile: !getSettings().simpleProfile });
    this.updateLoadingTip(dt);
    if (this.input.wasKeyPressed('`')) this.perfOverlay.toggle();
    if (this.input.wasKeyPressed('g')) {
      this.quality = cycleQuality(this.quality);
      this.applyQuality();
      // Shadows on/off changes every material's shader: recompile in the
      // background (the picture holds for a moment) rather than freezing
      this.engine.prewarm(false);
      this.floatingScore.show(`GRAPHICS: ${this.quality.toUpperCase()}`, '#ffffff');
    }
    if (this.input.wasKeyPressed('c')) {
      // Track map and profile displays read the palette every time they draw
      const on = toggleColorblindMode();
      this.floatingScore.show(on ? 'COLOUR-BLIND PALETTE ON' : 'COLOUR-BLIND PALETTE OFF', '#ffffff');
    }

    // F toggles photo mode during play; ESC also leaves it
    const canPhoto = this.gameStarted && !this.jobComplete && !this.inspectionPass && !this.isPaused;
    if (canPhoto && (this.input.wasKeyPressed('f')
        || (this.photoMode.active && this.input.wasKeyPressed('escape')))) {
      this.photoMode.setActive(!this.photoMode.active, this.track, this.grinderPosition);
      this.input.endFrame();
      return;
    }
    if (this.photoMode.active) {
      this.updatePhotoMode(dt);
      this.input.endFrame();
      return;
    }

    // R restarts the current job (only during active play — never from menus)
    if (this.input.wasKeyPressed('r') && this.gameStarted && !this.jobComplete
        && !this.inspectionPass && this.currentJob) {
      this.rebuildForJob(this.currentJob);
      this.input.endFrame();
      return;
    }

    // ESC toggles pause during gameplay
    if (this.input.wasKeyPressed('escape') && this.gameStarted && !this.jobComplete && !this.inspectionPass) {
      this.togglePause();
    }

    // While paused, render the frozen scene but skip all game logic
    if (this.isPaused) {
      this.input.endFrame();
      return;
    }

    if (this.inspectionPass) {
      this.handleInspectionPass(dt);
      this.trackDetail?.update(this.grinderPosition);
      this.bystanders?.update(dt, this.grinderPosition - 50, this.grinderPosition + 76);
      this.updateAtmosphere(dt);
      this.grinder.update(dt, this.dayNight.darkness);
      this.input.endFrame();
      return;
    }

    if (!this.gameStarted || this.jobComplete) {
      this.input.endFrame();
      return;
    }

    // Guided tutorial
    const tutResult = this.guidedTutorial.update(dt, {
      isGrinding: this.isGrinding,
      speed: this.grinderSpeed,
      angleChanged: this.input.isKeyDown('q') || this.input.isKeyDown('e') || this.input.isKeyDown('u') || this.input.isKeyDown('o'),
      pressureChanged: this.input.isKeyDown('a') || this.input.isKeyDown('d') || this.input.isKeyDown('j') || this.input.isKeyDown('l'),
      sectionsCompleted: this.completedCount,
    });
    // Auto-move during early tutorial
    if (tutResult.autoMove && !this.isGrinding && this.grinderSpeed < 1.5) {
      this.grinderSpeed = 1.5;
    }

    this.playTime += dt;
    this.checkSignOff(dt);
    this.handleGrinderMovement(dt);
    this.trackDetail?.update(this.grinderPosition);
    this.handleGrinding(dt);
    this.camera.update(dt, this.track, this.grinderPosition, this.grinderSpeed);
    this.updateAtmosphere(dt);
    this.grindEffects.update(dt);
    this.grinder.update(dt, this.dayNight.darkness);
    this.slowSigns?.update(dt);

    // Rail segment animations (hot rail cooling, completion flash) — only the
    // few segments that are actually animating get updated
    this.track.updateSegments(dt);

    // Profiles are redrawn inside handleGrinding while grinding; keep them live while driving too
    if (!this.isGrinding) {
      this.drawProfiles(
        this.track.getSegmentIndex(this.grinderPosition),
        this.track.getSectionIndex(this.grinderPosition));
    }

    // Update audio
    if (this.audioReady) {
      this.audio.setDieselSpeed(this.grinderSpeed,
        this.isGrinding ? (this.stonePressure.left + this.stonePressure.right) / 200 : 0);
      // Rail condition affects wheel sound — completed sections are smooth
      const sec = this.track.getSectionIndex(this.grinderPosition);
      const railCondition = (sec >= 0 && sec < this.segmentCompleted.length && this.segmentCompleted[sec]) ? 1.0 : 0.0;
      this.audio.updateWheelSound(this.grinderSpeed, dt, railCondition);
      // Route background sounds: birds / crickets / surf / traffic, rain, crossing bell
      const w = this.weather;
      this.audio.updateAmbience(dt, this.dayNight.darkness,
        w.isRaining ? w.intensity : 0, w.isSnowing ? w.intensity : 0, this.crossingBell);
    }

    // Passing trains
    this.passingTrain.update(dt, this.grinderPosition, this.dayNight.darkness);
    this.updateJobEvents(dt);

    // Radio dispatch
    this.radioDispatch.update(dt, this.cardBusyUntil > performance.now() || !!this.eventText);

    // Track map + next target
    // Normalize grinder position to the section area (offset to end of last section)
    const secOffset = this.track.sectionOffset;
    const secEnd = secOffset + this.sectionCount * GAME_SECTION_LENGTH;
    this.trackMap.setGrinderPosition((this.grinderPosition - secOffset) / (secEnd - secOffset));
    // Find nearest unfinished section (clamp so lead-in/run-out still points somewhere sensible)
    const curSec = Math.max(0, Math.min(this.sectionCount - 1,
      Math.floor((this.grinderPosition - secOffset) / GAME_SECTION_LENGTH)));
    let nextTarget = -1;
    let bestDist = Infinity;
    for (let s = 0; s < this.sectionCount; s++) {
      if (!this.segmentCompleted[s]) {
        const dist = Math.abs(s - curSec);
        if (dist < bestDist) { bestDist = dist; nextTarget = s; }
      }
    }
    this.trackMap.setNextTarget(nextTarget);
    // Ghost: record this run, and show where your best run was at this moment
    const runT = (this.grinderPosition - secOffset) / (secEnd - secOffset);
    this.ghostTimer += dt;
    if (this.ghostTimer >= GHOST_STEP) { this.ghostTimer -= GHOST_STEP; this.ghostSamples.push(Math.max(0, Math.min(1, runT))); }
    if (this.ghost) this.trackMap.setGhostPosition(ghostAt(this.ghost, this.playTime));
    this.trackMap.draw();

    // Boost exposure when grinding in the dark for spark drama (eased in DayNightCycle)
    this.dayNight.grindBoost = this.isGrinding ? 1 : 0;

    // Revenue train deadline (paused during the guided tutorial)
    if (!this.guidedTutorial.active && this.currentJob?.id !== 'practice') {
      const grinderT = (this.grinderPosition - secOffset) / (secEnd - secOffset);
      this.deadline.update(dt, this.completedCount, grinderT);
    }

    // Weather
    const grindTp = this.track.getTrackPoint(this.grinderPosition);
    this.weather.update(dt, grindTp.position);

    // Day/night toggle
    if (this.input.wasKeyPressed('n')) {
      this.dayNight.cycleTime();
    }
    // Weather toggle
    if (this.input.wasKeyPressed('p')) {
      this.weather.toggle();
    }
    // Mute toggle
    if (this.input.wasKeyPressed('m')) {
      this.audio.muted = !this.audio.muted;
    }

    this.updateHints(dt);
    this.updateFeel(dt);
    // B: the damage scan painted on the track
    if (this.input.wasKeyPressed('b') && this.overlay) {
      this.floatingScore.show(this.overlay.toggle() ? 'DAMAGE SCAN ON' : 'DAMAGE SCAN OFF', '#8ad0ff', undefined, undefined, 'low');
    }
    this.overlay?.update(dt, this.targetProfile, (s) => this.segmentCompleted[s], isColorblindMode());
    // Inside the cab: window frame, wipers and the dashboard
    this.cabView.setVisible(this.camera.angle === 'cab');
    this.cabView.update(dt, {
      mph: Math.abs(this.grinderSpeed) * 2.237, heat: this.stoneHeat, stoneLife: this.stoneLife, grinding: this.isGrinding,
      rain: this.weather.isRaining ? this.weather.intensity : 0, snow: this.weather.isSnowing,
    });
    this.checkJobComplete();
    this.updateHUD();
    this.input.endFrame();
  }

  /**
   * Highest speed allowed right now because of slow orders: the limit itself
   * inside one, and ahead of one, the fastest speed that can still brake down
   * to the limit by the time the grinder reaches it (v² = limit² + 2·brake·distance).
   */
  private slowOrderSpeedLimit(limit: number, brake: number): number {
    const pos = this.grinderPosition;
    const slowAt = (d: number) => {
      const s = this.track.getSectionIndex(d);
      return s >= 0 && s < this.segmentSlowOrder.length && this.segmentSlowOrder[s];
    };
    if (slowAt(pos)) return limit;
    // Look ahead in the direction of travel, up to the longest braking distance
    const dir = this.grinderSpeed < 0 ? -1 : 1;
    const lookAhead = (30 * 30) / (2 * brake);
    for (let ahead = 1; ahead <= lookAhead; ahead += 1) {
      if (slowAt(pos + dir * ahead)) return approachSpeedLimit(limit, brake, ahead);
    }
    return Infinity;
  }

  /** Top reversing speed: half the forward top speed, but a slow order's limit isn't halved again */
  private reverseLimit(maxSpeed: number, slowOrderLimit: number): number {
    return slowOrderLimit <= maxSpeed ? maxSpeed : maxSpeed / 2;
  }

  private handleGrinderMovement(dt: number): void {
    // Slow order enforcement: 2 m/s (~4.5 mph) in damaged sections. Like a real
    // train, the grinder starts braking *before* the slow order, so that it is
    // already down to the limit when it gets there.
    // 10 mph, as the boards and the track map say (the play-test found it was
    // really 4.5 mph, which made crossing finished ground a crawl)
    const SLOW_ORDER_SPEED = 4.47;
    const SLOW_ORDER_BRAKE = 10; // m/s²
    // (plan the approach with 20% braking in reserve, so it never arrives too fast)
    const slowOrderLimit = this.slowOrderSpeedLimit(SLOW_ORDER_SPEED, SLOW_ORDER_BRAKE * 0.8);

    // While grinding, auto-speed is handled in handleGrinding
    // While not grinding, player drives normally
    if (!this.isGrinding) {
      // SHIFT = fast-travel (3x speed) when not grinding
      const fastTravel = this.input.isKeyDown('shift') && !this.mods.includes('noFastTravel');
      if (fastTravel && Math.abs(this.grinderSpeed) > 10.5) this.usedFastTravel = true;
      const speedMult = fastTravel ? 3.0 : 1.0;
      // Fast travel raises the top speed, but never the slow-order limit
      const maxSpeed = Math.min(10 * speedMult * this.machine.driveSpeed, slowOrderLimit);
      const accel = 5 * speedMult, friction = 3;

      if (this.input.isKeyDown('w') || this.input.isKeyDown('arrowup')) {
        this.grinderSpeed = Math.min(maxSpeed, this.grinderSpeed + accel * dt);
      } else if (this.input.isKeyDown('s') || this.input.isKeyDown('arrowdown')) {
        // Reversing: half the top speed, but never below a slow order's limit
        this.grinderSpeed = Math.max(-this.reverseLimit(maxSpeed, slowOrderLimit), this.grinderSpeed - accel * dt);
      } else {
        if (this.grinderSpeed > 0) this.grinderSpeed = Math.max(0, this.grinderSpeed - friction * dt);
        else if (this.grinderSpeed < 0) this.grinderSpeed = Math.min(0, this.grinderSpeed + friction * dt);
      }
      // Too fast for the limit (e.g. coasting toward a slow order)? Brake firmly down to it.
      if (this.grinderSpeed > maxSpeed) {
        this.grinderSpeed = Math.max(maxSpeed, this.grinderSpeed - SLOW_ORDER_BRAKE * dt);
      } else if (this.grinderSpeed < -this.reverseLimit(maxSpeed, slowOrderLimit)) {
        this.grinderSpeed = Math.min(-this.reverseLimit(maxSpeed, slowOrderLimit), this.grinderSpeed + SLOW_ORDER_BRAKE * dt);
      }
    }

    // Held for the welders at a broken rail: no moving until it's fixed
    if (this.weldTimer >= 0) this.grinderSpeed = 0;
    this.grinderPosition += this.grinderSpeed * dt;
    // Clamp so entire consist stays on track (crew car at offset +67 is the longest)
    const maxPos = this.trackLength - 75;
    const minPos = 0;
    this.grinderPosition = Math.max(minPos, Math.min(maxPos, this.grinderPosition));

    // Gradual slowdown near track ends (brake feel, not abrupt wall)
    // (only when heading toward that end: reversing away from it must work,
    // or the grinder could never leave the end of the track)
    const endProximity = this.grinderSpeed > 0 ? maxPos - this.grinderPosition
      : this.grinderSpeed < 0 ? this.grinderPosition - minPos : Infinity;
    if (endProximity < 20) {
      const brakeFactor = Math.max(0.05, endProximity / 20);
      this.grinderSpeed *= brakeFactor;
    }

    // Position each car using front/rear bogie (wheel truck) positions.
    // Real train cars sit on two bogies. The car body spans between them
    // and its orientation is determined by the line connecting the bogies.
    // This naturally produces gentle rotation through curves — a long car
    // on a wide curve barely rotates, while a short car on a tight curve
    // rotates more, exactly like reality.
    this.grinder.group.position.set(0, 0, 0);
    this.grinder.group.quaternion.identity();

    const clampDist = (d: number) => Math.max(0.1, Math.min(this.trackLength - 0.1, d));

    for (const car of this.grinder.cars) {
      const centerDist = this.grinderPosition + car.offset;
      const frontBogie = this.track.getTrackPoint(clampDist(centerDist + car.halfLength));
      const rearBogie = this.track.getTrackPoint(clampDist(centerDist - car.halfLength));

      car.group.position.lerpVectors(rearBogie.position, frontBogie.position, 0.5);

      // Reuse pre-allocated temp objects (no per-frame garbage)
      const fwd = this._tmpVec.subVectors(frontBogie.position, rearBogie.position).normalize();
      const right = this._tmpVec2.crossVectors(this._worldUp, fwd).normalize();
      const up = this._tmpVec3.crossVectors(fwd, right).normalize();

      const avgBank = (frontBogie.bank + rearBogie.bank) * 0.5;
      if (Math.abs(avgBank) > 0.001) {
        this._tmpQuat.setFromAxisAngle(fwd, avgBank);
        right.applyQuaternion(this._tmpQuat);
        up.applyQuaternion(this._tmpQuat);
      }

      car.group.quaternion.setFromRotationMatrix(this._tmpMat.makeBasis(right, up, fwd));
    }

    // A stuck hydraulic arm freezes that rail's angle until it's repaired
    const armStuck = (rail: 'left' | 'right') => !!this.fault?.active && this.fault.kind === 'arm' && this.fault.rail === rail;
    const angleL = this.stoneAngle.left, angleR = this.stoneAngle.right;
    // Left rail: Q/E angle, A/D pressure
    if (this.input.isKeyDown('q')) {
      this.stoneAngle.left = Math.max(-40, this.stoneAngle.left - 60 * dt);
    }
    if (this.input.isKeyDown('e')) {
      this.stoneAngle.left = Math.min(40, this.stoneAngle.left + 60 * dt);
    }
    if (this.input.isKeyDown('a')) {
      this.stonePressure.left = Math.max(0, this.stonePressure.left - 80 * dt);
    }
    if (this.input.isKeyDown('d')) {
      this.stonePressure.left = Math.min(100, this.stonePressure.left + 80 * dt);
    }

    // Right rail: U/O angle, J/L pressure (mirrored direction for right rail)
    if (this.input.isKeyDown('u')) {
      this.stoneAngle.right = Math.max(-40, this.stoneAngle.right + 60 * dt);
    }
    if (this.input.isKeyDown('o')) {
      this.stoneAngle.right = Math.min(40, this.stoneAngle.right - 60 * dt);
    }
    if (this.input.isKeyDown('j')) {
      this.stonePressure.right = Math.max(0, this.stonePressure.right - 80 * dt);
    }
    if (this.input.isKeyDown('l')) {
      this.stonePressure.right = Math.min(100, this.stonePressure.right + 80 * dt);
    }

    if (armStuck('left')) this.stoneAngle.left = angleL;
    if (armStuck('right')) this.stoneAngle.right = angleR;
    // Station platforms leave less room to tilt the stones
    if (this.atPlatform) {
      this.stoneAngle.left = Math.max(-PLATFORM_TILT, Math.min(PLATFORM_TILT, this.stoneAngle.left));
      this.stoneAngle.right = Math.max(-PLATFORM_TILT, Math.min(PLATFORM_TILT, this.stoneAngle.right));
    }
    // Update stone panel UI
    this.updateStonePanel();

    // Camera
    if (this.input.wasKeyPressed('1')) { this.camera.angle = 'chase';}
    if (this.input.wasKeyPressed('2')) { this.camera.angle = 'side';}
    if (this.input.wasKeyPressed('3')) { this.camera.angle = 'cab';}
    if (this.input.wasKeyPressed('4')) { this.camera.angle = 'overview';}
    if (this.input.wasKeyPressed('5')) { this.camera.angle = 'grind';}
    if (this.input.wasKeyPressed('6')) { this.camera.angle = 'director';}
    // Gamepad (Y): cycle through the camera views
    if (this.input.wasKeyPressed('camnext')) {
      const views = ['chase', 'side', 'cab', 'overview', 'grind', 'director'] as const;
      this.camera.angle = views[(views.indexOf(this.camera.angle) + 1) % views.length];
    }
  }

  /**
   * Each frame: lower/raise the stones (SPACE), remove metal from the rail
   * under the grinder, track heat / over-grinding / passes, and complete
   * sections when they pass. Tuning numbers live in game/rules.ts.
   */
  private handleGrinding(dt: number): void {
    const sectionIndex = this.track.getSectionIndex(this.grinderPosition);
    const visualSegIndex = this.track.getSegmentIndex(this.grinderPosition);

    if (getSettings().grindMode === 'toggle') {
      if (this.input.wasKeyPressed(' ')) this.grindLatched = !this.grindLatched;
      this.isGrinding = this.grindLatched;
    } else {
      this.isGrinding = this.input.isKeyDown(' ');
    }
    // End of the track: the consist can't creep on, so the stones would cut the
    // same spot forever. Lift them.
    if (this.isGrinding && this.grinderPosition >= this.trackLength - 75.05) {
      this.isGrinding = false;
      this.grindLatched = false;
      if (this.endLiftCooldown <= 0) this.floatingScore.show('END OF TRACK — STONES UP', '#ffcc55');
      this.endLiftCooldown = 4;
    }
    this.endLiftCooldown = Math.max(0, this.endLiftCooldown - dt);
    // Controller: a steady buzz while the stones are down
    if (this.isGrinding && getSettings().rumble) {
      this.rumbleTimer -= dt;
      if (this.rumbleTimer <= 0) {
        this.rumbleTimer = 0.2;
        const p = (this.stonePressure.left + this.stonePressure.right) / 200;
        this.input.rumble(0.08 + p * 0.2, 0.15 + p * 0.25, 240);
      }
    }
    const avgPressure = (this.stonePressure.left + this.stonePressure.right) / 2;

    // Heat: builds with pressure while grinding (cooling upgrade slows it), cools while lifted
    const heatRate = heatRatePerSec(avgPressure);
    const heatChange = this.isGrinding ? (heatRate > 0 ? heatRate * this.upgrades.heat * STONE_GRADES[this.stoneGrade].heat * this.machine.heat : heatRate) : -COOL_RATE;
    this.stoneHeat = Math.max(0, Math.min(100, this.stoneHeat + heatChange * dt));
    this.overheatWarning = this.stoneHeat > 80;
    this.sweetSpotCooldown = Math.max(0, this.sweetSpotCooldown - dt);
    this.chatterCooldown = Math.max(0, this.chatterCooldown - dt);
    if (this.stoneHeat >= OVERHEAT && !this.overheated) {
      this.overheated = true;
      this.coachMistake('heat');
      this.loseCombo('OVERHEATED');
    } else if (this.stoneHeat < OVERHEAT - 10) {
      this.overheated = false;
    }
    this.overgrindCooldown = Math.max(0, this.overgrindCooldown - dt);

    // Always show where each stone is aimed on the profile displays
    for (const rail of RAILS) {
      this.rendererFor(rail).setStoneContact(
        stoneGrindX(this.stoneAngle[rail]), stoneContactWidth(this.stonePressure[rail]) * this.upgrades.width,
        this.stonePressure[rail], true, this.isGrinding && this.stonePressure[rail] >= STONE_LIFT_PRESSURE);
      this.rendererFor(rail).setPreview(null);
    }

    // The stones on the model follow your settings
    this.grinder.setStones(this.stoneAngle.left, this.stoneAngle.right,
      this.stonePressure.left < STONE_LIFT_PRESSURE, this.stonePressure.right < STONE_LIFT_PRESSURE);
    // Sparks, work lights, contact glow
    this.grindEffects.stoneHeat = this.stoneHeat / 100;
    this.grindEffects.setState(this.track, this.grinderPosition, this.isGrinding, avgPressure);
    this.grinder.setGrinding(this.isGrinding);
    if (this.isGrinding && !this.wasGrinding) {
      this.grindEffects.stoneImpact();
      this.camera.shake(0.08);
      if (this.audioReady) this.audio.playStoneDrop();
      if (getSettings().rumble) this.input.rumble(0.6, 0.3, 120);
    }
    this.wasGrinding = this.isGrinding;

    if (!this.isGrinding) {
      this.audio.stopGrinding();
      return;
    }

    // AUTO-SPEED: while grinding, the grinder creeps forward on its own;
    // the player focuses on angle and pressure
    // W / S set the grinding speed: slower takes more metal off per pass, but costs time
    if (this.input.isKeyDown('w')) this.grindSpeedSetting = Math.min(3, this.grindSpeedSetting + 1.2 * dt);
    if (this.input.isKeyDown('s')) this.grindSpeedSetting = Math.max(1, this.grindSpeedSetting - 1.2 * dt);
    this.grinderSpeed = this.grindSpeedSetting;

    // Remove metal from both rails with their individual settings
    const penalty = heatPenalty(this.stoneHeat);
    const tol = this.targetProfile.tolerance * this.weatherMods.tolerance;
    let onDefect = 0;          // for the audio: how much excess metal is under the stones
    let overgrinding = false;
    for (const rail of RAILS) {
      const grindX = stoneGrindX(this.stoneAngle[rail]);
      let depth = removalRatePerSec(this.stonePressure[rail]) * this.upgrades.removal * penalty * dt
        * STONE_GRADES[this.stoneGrade].removal * this.weatherMods.removal;
      const profile = this.track.getProfile(visualSegIndex, rail);
      // Corrugation punishes heavy pressure: the stone chatters and skips
      if (sectionIndex >= 0 && this.sectionKinds[sectionIndex] === 'corrugation'
          && this.stonePressure[rail] > CHATTER_PRESSURE) {
        depth *= CHATTER_FACTOR;
        if (getSettings().rumble) this.input.rumble(0.35, 0.7, 60); // the stone skipping
        this.coachMistake('chatter');
        this.audio.onCue?.('[stones chattering]');
        if (this.chatterCooldown <= 0) {
          this.chatterCooldown = 2.5;
          this.floatingScore.show('CHATTER — EASE OFF PRESSURE', '#ffcc44',
            undefined, undefined, 'low');
        }
      }
      // Sweet spot: the stone is centred on this rail's worst hump
      const worst = this.worstZonesFor(profile)[0];
      if (worst && worst.severity > 0 && Math.abs(worst.centerX - grindX) < 2.5 && this.sweetSpotCooldown <= 0) {
        this.sweetSpotCooldown = 0.9;
        if (this.audioReady) this.audio.playSweetSpot();
      }

      // Before cutting: is this stone on a defect? (0 = clean rail, 1 = deep defect)
      const excess = profile.getDeviationAtX(grindX, this.targetProfile) - tol;
      onDefect += Math.max(0, Math.min(1, excess / 0.08)) / RAILS.length;

      // Worn stones cut less (see stone life)
      depth *= this.stoneLife > 30 ? 1 : this.stoneLife > 10 ? 0.7 : 0.4;
      // An overheating stone motor barely turns
      if (this.fault?.active && this.fault.kind === 'motor' && this.fault.rail === rail) depth *= 0.3;
      // First job, opening sections: a safety net — the stone can't cut past the target
      if (this.isFirstJob && sectionIndex >= 0 && sectionIndex < 2
          && profile.getDeviationAtX(grindX, this.targetProfile) < tol * 1.2) depth = 0;
      profile.removeMetalAt(grindX, stoneContactWidth(this.stonePressure[rail]) * this.upgrades.width, depth);
      this.totalMetalRemoved += depth;
      // The stones wear as they cut (the hard-cut compound wears slower)
      if (this.features.wearAndHold) this.stoneLife = Math.max(0, this.stoneLife - depth * STONE_WEAR / this.upgrades.removal * (this.crew.mechanic ? 0.7 : 1));

      // Over-grind: went past the target line at the stone centre
      const isOver = depth > 0 && profile.getDeviationAtX(grindX, this.targetProfile) < -tol;
      if (isOver) overgrinding = true;
      if (isOver && this.overgrindCooldown <= 0) {
        this.overgrindCooldown = 1.0;
        if (sectionIndex >= 0) {
          this.segmentDamage[sectionIndex] = Math.max(
            this.segmentDamage[sectionIndex] || 0, profile.countOverground(this.targetProfile));
        }
        this.rendererFor(rail).flashBorder();
        this.camera.shake(0.06);
        this.flashVignette();
        if (getSettings().rumble) this.input.rumble(0.9, 0.6, 260);
        if (this.audioReady) { this.audio.playOvergrindAlarm(); this.audio.playScreech(); }
        this.loseCombo('OVER-GRIND');
        this.overgrindCount++;
        this.showFailureTip(rail, grindX, profile);
        if (sectionIndex >= 0 && !this.practiced.has(sectionIndex)) this.retryOffer = { sec: sectionIndex, until: this.playTime + 8 };
      }
    }

    this.pressureSum += avgPressure * dt;
    this.grindSeconds += dt;
    // Coaching: grinding a while with the stones nowhere near the humps, or
    // rushing over deep ones
    if (sectionIndex >= 0 && !this.segmentCompleted[sectionIndex]) {
      let off = true, deep = 0;
      for (const rail of RAILS) {
        const z = this.worstZonesFor(this.track.getProfile(visualSegIndex, rail)).find((q) => q.severity > tol);
        if (!z) { off = false; continue; }
        deep = Math.max(deep, z.severity);
        if (Math.abs(z.centerX - stoneGrindX(this.stoneAngle[rail])) < 6) off = false;
      }
      this.offTargetTime = off ? this.offTargetTime + dt : 0;
      if (this.offTargetTime > 2.5) { this.offTargetTime = 0; this.coachMistake('offTarget'); }
      this.shallowSpeedTime = deep > 0.16 && this.grindSpeedSetting > 2.2 ? this.shallowSpeedTime + dt : 0;
      if (this.shallowSpeedTime > 3) { this.shallowSpeedTime = 0; this.coachMistake('speed'); }
    }

    // Stones down over a switch: they strike the points and the frog
    this.strikeCooldown = Math.max(0, this.strikeCooldown - dt);
    if (this.hazards?.onSwitch(this.grinderPosition) && this.strikeCooldown <= 0) {
      this.strikeCooldown = 3;
      this.stoneLife = Math.max(0, this.stoneLife - SWITCH_STRIKE.stoneLife);
      this.jobBonus -= SWITCH_STRIKE.fine;
      this.loseCombo('STONES HIT THE SWITCH');
      this.floatingScore.show(`STONES HIT THE SWITCH  −$${SWITCH_STRIKE.fine}`, '#ff5544', undefined, undefined, 'high');
      this.camera.shake(0.35);
      if (this.audioReady) { this.audio.playScreech(); this.audio.playOvergrindAlarm(); }
      if (getSettings().rumble) this.input.rumble(1, 1, 450);
    }

    // Hot rail: the steel under each grinding car glows orange, leaving a
    // cooling trail behind the consist (purely visual)
    const heat = (0.5 + avgPressure / 100) * 2.5 * dt;
    for (const carOff of GRIND_CAR_OFFSETS) {
      for (const stoneZ of [-4, 0, 4]) {
        const vi = this.track.getSegmentIndex(this.grinderPosition + carOff + stoneZ);
        if (vi >= 0 && vi < this.track.leftSegments.length) {
          this.track.leftSegments[vi].heatUp(heat);
          this.track.rightSegments[vi].heatUp(heat);
        }
      }
    }

    // Count a pass each time the grinder leaves a section while grinding
    if (sectionIndex !== this.lastSectionIndex) {
      if (this.lastSectionIndex >= 0) this.segmentPasses[this.lastSectionIndex]++;
      if (this.lastSectionIndex >= 0 && sectionIndex >= 0) {
        // The stones hop over the section joint: a little rhythm to each section
        this.grinder.hopStones();
        if (this.audioReady) this.audio.playStoneDrop();
      }
      this.lastSectionIndex = sectionIndex;
    }

    // Throttled 3D mesh rebuild (ExtrudeGeometry is expensive — ~7x/sec instead of 60)
    this._rebuildTimer += dt;
    if (this._rebuildTimer >= this._rebuildInterval) {
      this._rebuildTimer = 0;
      this.track.rebuildSegment(visualSegIndex, 'left');
      this.track.rebuildSegment(visualSegIndex, 'right');
    }

    // Section scoring only applies inside the scored sections (not lead-in / run-out)
    if (sectionIndex >= 0) {
      this.sectionMaxHeat[sectionIndex] = Math.max(this.sectionMaxHeat[sectionIndex] || 0, this.stoneHeat);
      const accuracy = sectionAccuracy(this.track, this.targetProfile, sectionIndex);
      if (this.audioReady) this.audio.accuracyLift = Math.max(0, Math.min(1, (accuracy - 0.4) / 0.5));
      const progress = sectionProgress(
        this.initialSectionAccuracy[sectionIndex] ?? 0,
        sectionMeanAccuracy(this.track, this.targetProfile, sectionIndex),
        this.segmentCompleted[sectionIndex]);

      // Rust → polished steel as the section approaches passing
      for (const vi of this.track.getSegmentsForSection(sectionIndex)) {
        if (vi < this.track.leftSegments.length) {
          this.track.leftSegments[vi].setGrindProgress(progress);
          this.track.rightSegments[vi].setGrindProgress(progress);
        }
      }
      this.trackMap.updateSegment(sectionIndex, {
        grindProgress: progress, accuracy, slowOrder: this.segmentSlowOrder[sectionIndex],
      });

      if (accuracy > COMPLETION_ACCURACY && !this.segmentCompleted[sectionIndex]) {
        this.completeSegment(sectionIndex, accuracy);
      }
    }

    this.drawProfiles(visualSegIndex, sectionIndex);

    this.camera.setShake(0.01 + (avgPressure / 100) * 0.02);
    if (this.audioReady) this.audio.startGrinding(avgPressure / 80, onDefect, overgrinding);
    // Spark colour for next frame: blue-white over-grinding, dull red off the hump
    this.grindEffects.sparkMode = overgrinding ? 'over' : onDefect > 0.15 || sectionIndex < 0 ? 'good' : 'off';
    eventBus.emit('grind-contact', { sectionIndex });
  }

  private endLiftCooldown = 0;

  /**
   * Nothing left to grind in this section but it still fails (deeply
   * over-ground): sign it off at one star rather than leave it unfinishable.
   * Runs whether or not the stones are down (the play-test found sections
   * stuck because nobody would grind a section with nothing left to cut).
   */
  private checkSignOff(dt: number): void {
    const sec = this.track.getSectionIndex(this.grinderPosition);
    if (sec < 0 || this.segmentCompleted[sec] || (this.segmentPasses[sec] || 0) === 0 && !this.isGrinding) return;
    this.excessCheckTimer += dt;
    if (this.excessCheckTimer < 0.5) return;
    this.excessCheckTimer = 0;
    if (!sectionHasExcess(this.track, this.targetProfile, sec)) {
      this.completeSegment(sec, sectionAccuracy(this.track, this.targetProfile, sec), true);
    }
  }
  /** When the section-can't-improve check last ran (it scans every point) */
  private excessCheckTimer = 0;

  /** The profile display for a rail */
  private rendererFor(rail: 'left' | 'right'): ProfileRenderer {
    return rail === 'left' ? this.profileRenderer : this.profileRendererRight;
  }

  /**
   * Worst spots on a profile, remembered until the profile changes (finding
   * them means comparing every point, and drawProfiles runs every frame).
   */
  private worstZonesFor(profile: RailProfile): Array<{ centerX: number; severity: number }> {
    const cached = this._zoneCache.get(profile);
    if (cached && cached.version === profile.version) return cached.zones;
    const zones = profile.findWorstZones(this.targetProfile, 3);
    this._zoneCache.set(profile, { version: profile.version, zones });
    return zones;
  }
  private _zoneCache = new WeakMap<RailProfile, { version: number; zones: Array<{ centerX: number; severity: number }> }>();

  /** Redraw both rail profile displays for the given visual segment */
  private drawProfiles(visualSegIndex: number, sectionIndex: number): void {
    const dmg = this.segmentDamage[sectionIndex] || 0;
    const passes = this.segmentPasses[sectionIndex] || 0;
    for (const rail of RAILS) {
      const profile = this.track.getProfile(visualSegIndex, rail);
      const renderer = this.rendererFor(rail);
      renderer.setWorstZones(this.worstZonesFor(profile));
      renderer.setSegmentInfo(dmg, passes);
      if (rail === 'left') this.showDefectHint(sectionIndex);
      renderer.draw(profile, this.targetProfile);
    }
  }

  /** One line above the profile panels: the kind of damage here and how to grind it */
  private showDefectHint(sectionIndex: number): void {
    const kind = sectionIndex >= 0 && !this.segmentCompleted[sectionIndex] ? this.sectionKinds[sectionIndex] : undefined;
    const key = kind ?? '';
    if (key === this.defectHintKey) return;
    this.defectHintKey = key;
    const name = document.getElementById('defect-name');
    const tip = document.getElementById('defect-tip');
    if (!name || !tip) return;
    name.textContent = kind ? DEFECT_KINDS[kind].name : '';
    tip.textContent = kind ? '— ' + DEFECT_KINDS[kind].tip : '';
  }
  private defectHintKey = '-';

  // ---------------------------------------------------------------------------
  // Job events: work crews, broken rail, fires, stone wear, the revenue-train
  // hold, new-damage cards, failure tips (see the Batch D notes in src/README.md)
  // ---------------------------------------------------------------------------

  /** Set up this job's crews / broken rail and reset per-job event state */
  private buildJobEvents(job: JobDefinition): void {
    const rand = seededRandom((job.seed ?? hashSeed(job.id)) ^ 0x5eed);
    const practice = job.id === 'practice';
    this.features = practice ? { fires: false, wearAndHold: true, crews: false } : featuresFor(loadStats().jobs);
    const crewDists: number[] = [];
    if (this.features.crews) {
      // One crew (two on long jobs): the play-test found two crews' slow zones
      // covering most of a 14-section job
      const n = this.sectionCount >= 18 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        const sec = 2 + Math.floor(rand() * Math.max(1, this.sectionCount - 3));
        crewDists.push(this.track.sectionOffset + sec * GAME_SECTION_LENGTH + 10);
      }
    }
    const broken = this.features.crews && rand() < 0.35
      ? this.track.sectionOffset + Math.floor(this.sectionCount * (0.35 + rand() * 0.4)) * GAME_SECTION_LENGTH + 12
      : null;
    this.crews = new TrackCrews(this.track, crewDists, broken);
    this.engine.scene.add(this.crews.group);
    this.wildlife = new Wildlife(this.track, this.track.sectionOffset);
    this.engine.scene.add(this.wildlife.group);
    this.atmos = new Atmos(this.track, job.region);
    this.engine.scene.add(this.atmos.group);
    this.fire.reset();
    this.fireBurnTime = 0;
    this.fireFined = false;
    this.stoneLife = 100;
    this.stoneChange = 0;
    this.grindSpeedSetting = GRIND_SPEED;
    this.weldTimer = -1;
    this.holdsUsed = 0;
    this.regrowTimer = 0;
    this.regrown = [];
    this.customer = customerFor(job.id, job.region, job.seed ?? hashSeed(job.id));
    const f = practice ? null : rollFault(loadStats().jobs, rand);
    this.fault = f ? { ...f, active: false, fixed: false } : null;
    this.repairTime = 0;
    this.pressureSum = 0;
    this.grindSeconds = 0;
    this.mirrorCount = 0;
    this.usedFastTravel = false;
    this.bounty = null;
    this.bountiesOffered = 0;
    this.bountyNudge = '';
    this.regrowNoticeShown = false;
    this.weatherNoticeShown = false;
    this.emergency = null;
    this.emergencyTimer = 80 + rand() * 60;
    this.emergenciesLeft = 2;
    this.sectionPar = [];
    for (let s = 0; s < this.sectionCount; s++) this.sectionPar.push(this.estimatePasses(s));
    this.profilesBefore = [];
    this.segmentStars = [];
    // Modifiers, rank perks, depot (machine + crew)
    this.mods = job.modifiers ?? [];
    this.perks = rankPerks(rankFor(totalBestStars(loadRecords())).index);
    const depot = loadDepot();
    this.machine = MACHINES[depot.active];
    this.crew = {
      firewatch: depot.crew.includes('firewatch'), welder: depot.crew.includes('welder'),
      mechanic: depot.crew.includes('mechanic'), spotter: depot.crew.includes('spotter'),
    };
    if (this.mods.includes('wornStones')) this.stoneLife = 40;
    this.deadline.pace = this.mods.includes('traffic') ? 0.6 : 1;
    this.retryOffer = null;
    this.practiced.clear();
    this.resultFrame = null;
    this.captureRequested = false;
    this.startProfiles = [];
    for (let vi = 0; vi < this.track.segmentCount; vi++) {
      this.startProfiles.push({
        left: this.track.getProfile(vi, 'left').points.map((p) => ({ x: p.x, y: p.y })),
        right: this.track.getProfile(vi, 'right').points.map((p) => ({ x: p.x, y: p.y })),
      });
    }
    // Collectible: something old glinting beside the rail (museum)
    this.collectible = null;
    const cf = practice || this.isFirstJob ? null : collectibleFor(job.seed ?? hashSeed(job.id), this.sectionCount, loadMuseum());
    if (cf && this.crews) {
      const dist = this.track.sectionOffset + (cf.section + 0.5) * GAME_SECTION_LENGTH;
      const tp = this.track.getTrackPoint(dist);
      const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.09),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffe08a).multiplyScalar(2.5) }));
      mesh.position.copy(tp.position).addScaledVector(tp.right, -1.55);
      mesh.position.y = -0.3;
      this.crews.group.add(mesh); // disposed with the crews
      this.collectible = { id: cf.id, dist, mesh, found: false };
    }
    const goal = document.getElementById('goal-line');
    if (goal) { const g = currentGoal(); goal.textContent = g ? `NEXT: ${g}` : ''; goal.style.display = g ? 'block' : 'none'; }
    for (let s = 0; s < this.sectionCount; s++) {
      this.profilesBefore.push(this.track.getProfile(this.middleSegmentOf(s), 'left').points.map((p) => ({ x: p.x, y: p.y })));
    }
  }

  /** Every frame of play: run the job's events and show the most urgent one */
  private updateJobEvents(dt: number): void {
    const pos = this.grinderPosition;
    const consistFrom = pos - 50, consistTo = pos + 76;
    let event = '';

    this.wildlife?.update(dt, consistTo, consistFrom, this.dayNight.darkness > 0.6);
    this.bystanders?.update(dt, consistFrom, consistTo);

    // ---- Work crews: pass them slowly ----
    if (this.crews) {
      this.crews.update(dt, consistFrom, consistTo);
      for (const c of this.crews.crews) {
        const inZone = consistTo > c.dist - WORK_ZONE_HALF && consistFrom < c.dist + WORK_ZONE_HALF;
        const approaching = consistTo > c.dist - 70 && consistTo < c.dist - WORK_ZONE_HALF;
        // Only while it matters: grinding speed is already under the limit
        if ((inZone || approaching) && (Math.abs(this.grinderSpeed) > WORK_ZONE_SPEED * 0.6 || (!this.isGrinding && approaching)))
          event = `👷 WORK CREW — keep it under ${Math.round(WORK_ZONE_SPEED * 2.237)} mph`;
        if (inZone && Math.abs(this.grinderSpeed) > WORK_ZONE_SPEED && !c.violated) {
          c.violated = true;
          this.jobBonus -= EVENT_PAY.safetyFine;
          this.loseCombo('SAFETY VIOLATION');
          this.floatingScore.show(`SAFETY VIOLATION  −$${EVENT_PAY.safetyFine}`, '#ff5544', window.innerWidth / 2, window.innerHeight / 2 - 60);
          if (this.audioReady) this.audio.playOvergrindAlarm();
        }
      }
      // ---- Broken rail: stop short and wait for the welders ----
      const br = this.crews.brokenRail;
      if (br && !br.fixed) {
        const ahead = br.dist - consistTo;
        if (this.weldTimer >= 0) {
          this.weldTimer -= dt;
          this.grinderSpeed = 0;
          event = `🔧 WELDING THE BROKEN RAIL… ${Math.ceil(this.weldTimer)} s`;
          this.weldSparkTimer -= dt;
          if (this.weldSparkTimer <= 0) {
            this.weldSparkTimer = 0.15;
            const tp = this.track.getTrackPoint(br.dist);
            this.grindEffects.weldSparks(tp.position.clone().addScaledVector(tp.right, -0.8));
          }
          if (this.weldTimer <= 0) {
            this.crews.fixBrokenRail();
            this.weldTimer = -1;
            this.floatingScore.show('RAIL WELDED — PROCEED', '#7dff8a');
          }
        } else if (ahead < 0) {
          // Ran over it: emergency stop, fine, and it still has to be welded
          this.grinderSpeed = 0;
          this.jobBonus -= EVENT_PAY.brokenRailFine;
          this.loseCombo('BROKEN RAIL');
          this.floatingScore.show(`RAN A BROKEN RAIL  −$${EVENT_PAY.brokenRailFine}`, '#ff5544');
          this.camera.shake(0.3);
          this.weldTimer = this.crew.welder ? 4 : 8;
        } else if (ahead < 70) {
          // Stopped anywhere short of the flag: the welders get to work (the
          // play-test found "STOP" at 45-70 m left you waiting for nothing)
          event = '⚠ BROKEN RAIL AHEAD — STOP SHORT OF THE FLAG';
          if (Math.abs(this.grinderSpeed) < 0.15) this.weldTimer = this.crew.welder ? 3.5 : 7;
        }
      }
    }

    // ---- Fire: hot stones on a dry day can set the grass alight ----
    const dry = !this.weather.isRaining && !this.weather.isSnowing && this.weather.snowCover < 0.5
      && this.features.fires;
    if (!this.fire.active && dry && this.isGrinding && this.stoneHeat > 60) {
      const chance = 0.004 + (this.stoneHeat - 60) * 0.0009; // per second
      if (Math.random() < chance * dt) {
        const d = Math.max(5, pos - 60);
        const tp = this.track.getTrackPoint(d);
        this.fire.ignite(tp.position.clone().addScaledVector(tp.right, -4.6).setY(-0.6), d);
        this.fireBurnTime = 0;
        this.fireFined = false;
        this.floatingScore.show('🔥 SPARKS STARTED A FIRE!', '#ff8844');
      }
    }
    const spraying = this.input.isKeyDown('x');
    let reach = false;
    if (this.fire.active) {
      // The nearer water car does the spraying
      const cars = [pos - 26, pos + 38];
      const car = cars.reduce((a, b) => (Math.abs(b - this.fire.dist) < Math.abs(a - this.fire.dist) ? b : a));
      reach = Math.abs(car - this.fire.dist) < 18 && Math.abs(this.grinderSpeed) < 1;
      const tp = this.track.getTrackPoint(Math.max(0.1, Math.min(this.track.totalLength - 0.1, car)));
      this.fire.setSpraying(spraying && reach, tp.position.clone().addScaledVector(tp.right, -1.6).setY(tp.position.y + 3.4));
      this.fireBurnTime += dt;
      if (this.fireBurnTime > (this.crew.firewatch ? 40 : 25) && !this.fireFined) {
        this.fireFined = true;
        this.jobBonus -= EVENT_PAY.fireFine;
        this.loseCombo('FIRE SPREAD');
        this.floatingScore.show(`FIRE SPREAD  −$${EVENT_PAY.fireFine} FINE`, '#ff5544');
      }
      event = reach ? (spraying ? '💧 SPRAYING…' : '🔥 FIRE — hold X to spray it')
        : '🔥 FIRE BEHIND — stop beside it and hold X to spray';
    } else {
      this.fire.setSpraying(false);
    }
    const dryCountry = this.currentJob?.region === 'prairie' || this.currentJob?.region === 'desert';
    const grow = (dryCountry ? 0.045 : 0.03) * (this.crew.firewatch ? 0.5 : 1);
    if (this.fire.update(dt, grow, reach) === 'out') {
      // Close call: put out just before it would have spread
      if (!this.fireFined && this.fireBurnTime > (this.crew.firewatch ? 32 : 18)) {
        this.jobBonus += EVENT_PAY.fireCloseCall; this.floatingScore.show(`CLOSE CALL! FIRE OUT  +$${EVENT_PAY.fireCloseCall}`, '#7dff8a');
      } else if (!this.fireFined) { this.jobBonus += EVENT_PAY.fireOut; this.floatingScore.show(`FIRE OUT  +$${EVENT_PAY.fireOut}`, '#8ad0ff'); }
      else this.floatingScore.show('FIRE OUT', '#8ad0ff');
    }

    // ---- Machine fault: stop and hold Z to repair it ----
    const fault = this.fault;
    if (fault && !fault.active && !fault.fixed && this.playTime >= fault.at) {
      fault.active = true;
      const info = FAULTS[fault.kind];
      this.radioDispatch.say('GRINDER 42 · MECHANIC', `${fault.rail === 'left' ? 'Left' : 'Right'} side: ${info.name.toLowerCase()}. Stop when you can and I'll sort it.`);
      if (this.audioReady) this.audio.playOvergrindAlarm();
      if (getSettings().rumble) this.input.rumble(0.8, 0.8, 400);
    }
    if (fault?.active) {
      const info = FAULTS[fault.kind];
      const stopped = Math.abs(this.grinderSpeed) < 0.15 && !this.isGrinding;
      if (stopped && this.input.isKeyDown('z')) {
        this.repairTime += dt;
        const need = FAULT_REPAIR_SECONDS * (this.crew.mechanic ? 0.6 : 1);
        event = `🔧 REPAIRING… ${Math.min(100, Math.round(this.repairTime / need * 100))}%`;
        if (this.repairTime >= need) {
          fault.active = false;
          fault.fixed = true;
          this.floatingScore.show('FAULT REPAIRED', '#7dff8a');
        }
      } else {
        this.repairTime = 0;
        event = `⚙ ${fault.rail.toUpperCase()} ${info.name} (${info.effect}) — stop and hold Z to repair`;
      }
    }

    // ---- Stone wear: stop and hold Z to put new stones on ----
    if (!fault?.active && this.stoneLife < 100 && Math.abs(this.grinderSpeed) < 0.15 && !this.isGrinding && this.input.isKeyDown('z')) {
      this.stoneChange += dt;
      const changeTime = 2.5 * this.perks.stoneChange;
      event = `🔩 CHANGING STONES… ${Math.min(100, Math.round(this.stoneChange / changeTime * 100))}%`;
      if (this.stoneChange >= changeTime) {
        this.stoneLife = 100;
        this.stoneChange = 0;
        const changed = this.stoneGrade !== this.nextStoneGrade;
        this.stoneGrade = this.nextStoneGrade;
        this.floatingScore.show(`NEW ${STONE_GRADES[this.stoneGrade].name.toUpperCase()} STONES FITTED`, '#7dff8a');
        if (changed && this.stoneGrade === 'fine') this.floatingScore.show('Finish on fine stones for a MIRROR FINISH', '#cfe8ff', undefined, undefined, 'low');
      }
    } else {
      this.stoneChange = 0;
      if (!event && this.stoneLife <= 30) event = `🔩 STONES WORN (${Math.round(this.stoneLife)}%) — stop and hold Z to change`;
    }
    // I: pick the grade for the next stone change
    if (this.input.wasKeyPressed('i')) {
      this.nextStoneGrade = nextGrade(this.nextStoneGrade);
      this.floatingScore.show(`NEXT STONES: ${STONE_GRADES[this.nextStoneGrade].name.toUpperCase()} (hold Z stopped to fit)`, '#cfe8ff', undefined, undefined, 'low');
    }
    const lifeEl = document.getElementById('stone-life');
    if (lifeEl) {
      const g = STONE_GRADES[this.stoneGrade].name.toUpperCase();
      const next = this.nextStoneGrade !== this.stoneGrade ? `→${STONE_GRADES[this.nextStoneGrade].name.toUpperCase()[0]}` : '';
      this.setText(lifeEl, `${g} ${Math.round(this.stoneLife)}%${next}`);
      this.setStyle(lifeEl, 'color', this.stoneLife > 30 ? 'var(--ui-dim)' : this.stoneLife > 10 ? 'var(--ui-accent)' : 'var(--ui-red)');
    }

    // ---- Revenue train: ask for a hold (T) ----
    const left = this.deadline.secondsLeft;
    if (left !== null && left < 45 && !event && this.features.wearAndHold) event = `🚆 Train close — press T to ask for a 60 s hold ($${Math.round(EVENT_PAY.trainHold * this.perks.holdCost)})`;
    if (this.input.wasKeyPressed('t') && this.features.wearAndHold && this.deadline.requestHold(60)) {
      this.holdsUsed++;
      const cost = Math.round(EVENT_PAY.trainHold * this.perks.holdCost);
      this.jobBonus -= cost;
      this.floatingScore.show(`DISPATCH: TRAIN HELD 60 s  −$${cost}`, '#ffcc55');
    }

    // ---- Weather changes the work (once per job, when you first grind in it) ----
    if (this.weatherMods.label && this.isGrinding && !this.weatherNoticeShown) {
      this.weatherNoticeShown = true;
      this.floatingScore.show(this.weatherMods.label, '#8ad0ff', undefined, undefined, 'low');
    }

    // ---- Regrowth: traffic keeps wearing sections nobody has touched yet ----
    if (this.features.wearAndHold) {
      this.regrowTimer += dt;
      if (this.regrowTimer >= REGROWTH_INTERVAL) {
        this.regrowTimer = 0;
        this.regrowUntouched();
      }
    }

    // ---- Emergency calls ----
    if (this.features.crews) {
      if (this.emergency) {
        this.emergency.left -= dt;
        const m = Math.floor(Math.max(0, this.emergency.left) / 60);
        const sec = Math.floor(Math.max(0, this.emergency.left) % 60).toString().padStart(2, '0');
        if (!event) event = `🚨 EMERGENCY: clear section ${this.emergency.sec + 1} — ${m}:${sec} (+$${EMERGENCY_PAY})`;
        if (this.emergency.left <= 0) {
          this.floatingScore.show('EMERGENCY MISSED', '#ff8866');
          this.emergency = null;
        }
      } else if (this.emergenciesLeft > 0) {
        this.emergencyTimer -= dt;
        if (this.emergencyTimer <= 0) {
          this.emergencyTimer = 120 + Math.random() * 80;
          const s = pickEmergencySection(this.segmentCompleted, this.track.getSectionIndex(pos), Math.random);
          if (s >= 0) {
            this.emergenciesLeft--;
            this.emergency = { sec: s, left: EMERGENCY_SECONDS + (this.crew.spotter ? 40 : 0) };
            this.radioDispatch.say('DISPATCH · MARGE', `Grinder 42, priority call: a crew reports section ${s + 1} is bad. Clear it in the next couple of minutes?`);
            if (this.audioReady) this.audio.playDing();
          }
        }
      }
    }

    // ---- Retry a section after an over-grind (practice: it won't score) ----
    if (this.retryOffer) {
      if (this.playTime > this.retryOffer.until || this.segmentCompleted[this.retryOffer.sec]) this.retryOffer = null;
      else {
        if (!event) event = `↺ Press Y to retry section ${this.retryOffer.sec + 1} from scratch (practice — won't score)`;
        if (this.input.wasKeyPressed('y')) this.retrySection(this.retryOffer.sec);
      }
    }

    // ---- Collectible: look at it from the grind camera as you pass ----
    const col = this.collectible;
    if (col && !col.found) {
      col.mesh.rotation.y += dt * 2;
      const gap = col.dist - (pos + 6);
      if (Math.abs(gap) < 40 && !event) event = '✨ Something glints by the left rail — switch to camera 5 to look';
      if (Math.abs(gap) < 7 && (this.camera.angle === 'grind' || this.camera.angle === 'cab')) {
        col.found = true;
        col.mesh.visible = false;
        addToMuseum(col.id);
        session.collectibles++;
        const info = COLLECTIBLES.find((c) => c.id === col.id)!;
        this.toast.show('🏺', `FOUND: ${info.name}`, `${info.note} — added to the museum (Career page)`);
        if (this.audioReady) this.audio.playSweetSpot();
      }
    }

    // ---- Switches ahead: lift the stones ----
    if (this.hazards) {
      if (this.isGrinding && this.hazards.switchAhead(pos, 30)) event = '⚠ SWITCH AHEAD — LIFT THE STONES (SPACE)';
      // Quiet zone: at night, by the town, go easy on the pressure
      const night = this.dayNight.darkness > 0.6;
      if (night && this.hazards.inQuietZone(pos)) {
        const p = (this.stonePressure.left + this.stonePressure.right) / 2;
        if (!event) event = `🌙 QUIET ZONE — keep pressure under ${QUIET.pressure}%`;
        if (this.isGrinding && p > QUIET.pressure && !this.quietFined) {
          this.quietFined = true;
          this.jobBonus -= QUIET.fine;
          this.floatingScore.show(`NOISE COMPLAINT  −$${QUIET.fine}`, '#ff8866', undefined, undefined, 'high');
          this.radioDispatch.say('DISPATCH · MARGE', 'Grinder 42, we\'ve had a call from the town. Ease off through there, please.');
        }
      }
    }
    // ---- Station platform: less room to tilt the stones ----
    const plat = this.bystanders?.platform;
    this.atPlatform = !!plat && pos > plat.from - 2 && pos < plat.to + 2;
    if (this.atPlatform && !event) event = `🚉 PLATFORM — stone tilt limited to ±${PLATFORM_TILT}°`;

    // ---- New kind of damage: introduce it once ----
    const sec = this.track.getSectionIndex(pos + 6);
    if (sec >= 0 && !this.segmentCompleted[sec]) this.introduceKind(this.sectionKinds[sec]);

    this.setEvent(event);
  }

  /** Add a little more of each untouched section's damage (traffic keeps wearing it) */
  private regrowUntouched(): void {
    const current = this.track.getSectionIndex(this.grinderPosition);
    const rand = Math.random;
    let any = false;
    const touched = new Set<number>();
    for (let vi = 0; vi < this.track.segmentCount; vi++) {
      const sec = this.track.getSectionIndex(vi * VISUAL_SEGMENT_LENGTH);
      if (sec < 0 || sec === current || this.segmentCompleted[sec] || (this.segmentPasses[sec] || 0) > 0) continue;
      if ((this.regrown[sec] ?? 0) >= REGROWTH_MAX) continue;
      if (!touched.has(sec)) { touched.add(sec); this.regrown[sec] = (this.regrown[sec] ?? 0) + 1; }
      any = true;
      for (const rail of ['left', 'right'] as const) {
        const profile = this.track.getProfile(vi, rail);
        for (const peak of defectPeaks(this.sectionKinds[sec], rand)) {
          for (const p of profile.points) {
            const dx = p.x - peak.cx;
            p.y -= peak.base * REGROWTH_AMOUNT * Math.exp(-(dx * dx) / (2 * peak.sigma * peak.sigma));
          }
        }
        profile.markChanged();
        this.track.rebuildSegment(vi, rail);
      }
    }
    if (any && !this.regrowNoticeShown) {
      this.regrowNoticeShown = true;
      this.floatingScore.show('Traffic is wearing the sections you haven\'t touched', '#ffb070',
        window.innerWidth / 2, window.innerHeight / 2 + 120);
    }
  }

  // ---- Running the job (game/ops.ts) ----
  private customer: Customer = 'heavyHaul';
  /** Grade fitted at the next stone change (key I cycles it) */
  private nextStoneGrade: StoneGrade = 'standard';
  private fault: (Fault & { active: boolean; fixed: boolean }) | null = null;
  private repairTime = 0;
  /** Pressure × seconds and seconds spent grinding (average pressure, for the scenic customer) */
  private pressureSum = 0;
  private grindSeconds = 0;
  private mirrorCount = 0;
  /** Fast travel used this job (no-fast-travel badge) */
  private usedFastTravel = false;
  /** The mid-job bounty, if one is running, and how many were offered */
  private bounty: Bounty | null = null;
  private bountiesOffered = 0;
  /** The consist is alongside a station platform (stone tilt limited) */
  private atPlatform = false;

  /**
   * The stretch of rail under a switch has nothing to grind (you lift the
   * stones over it): put it back to the target profile.
   */
  private clearSwitchStretches(): void {
    if (!this.hazards) return;
    const touched = new Set<number>();
    for (const z of this.hazards.switches) {
      const vi = this.track.getSegmentIndex(z.from + 0.5);
      for (const rail of RAILS) {
        const p = this.track.getProfile(vi, rail);
        p.points.forEach((pt, i) => { pt.y = this.targetProfile.points[i]?.y ?? pt.y; });
        p.markChanged();
        this.track.rebuildSegment(vi, rail);
      }
      touched.add(this.track.getSectionIndex(z.from + 0.5));
    }
    if (!touched.size) return;
    this.setSegmentDefectGlow();
    for (const sec of touched) {
      if (sec >= 0) this.initialSectionAccuracy[sec] = sectionMeanAccuracy(this.track, this.targetProfile, sec);
    }
  }

  /** Rounds of extra wear each section has had this job (capped at REGROWTH_MAX) */
  private regrown: number[] = [];

  /** Put a section back the way it was at job start, and back the consist up to it */
  private retrySection(sec: number): void {
    for (let vi = 0; vi < this.track.segmentCount; vi++) {
      if (this.track.getSectionIndex(vi * VISUAL_SEGMENT_LENGTH) !== sec) continue;
      for (const rail of ['left', 'right'] as const) {
        const profile = this.track.getProfile(vi, rail);
        const saved = this.startProfiles[vi][rail];
        profile.points.forEach((p, i) => { p.y = saved[i].y; });
        profile.markChanged();
        this.track.rebuildSegment(vi, rail);
      }
    }
    this.segmentPasses[sec] = 0;
    this.segmentDamage[sec] = 0;
    this.sectionMaxHeat[sec] = 0;
    this.practiced.add(sec);
    this.retryOffer = null;
    this.grinderPosition = Math.max(0, this.track.sectionOffset + sec * GAME_SECTION_LENGTH - 20);
    this.grinderSpeed = 0;
    this.trackMap.updateSegment(sec, { grindProgress: 0, accuracy: 0 });
    this.floatingScore.show(`SECTION ${sec + 1} RESET — PRACTICE RUN`, '#8ad0ff');
  }

  /** A photo was saved: did it meet any photo challenges? */
  private checkPhotoChallenges(): void {
    const cam = this.engine.camera;
    const inView = (p: THREE.Vector3, range: number) => {
      if (p.distanceTo(cam.position) > range) return false;
      const v = p.clone().project(cam);
      return v.z < 1 && Math.abs(v.x) < 1 && Math.abs(v.y) < 1;
    };
    const hits: PhotoId[] = [];
    if (this.wildlife?.deerPositions().some((p) => inView(p, 90))) hits.push('deer');
    if (this.engine.fx.uFlash.value > 0.1 || this.flash > 0.1) hits.push('lightning');
    if (this.isGrinding && this.dayNight.darkness > 0.6) hits.push('nightsparks');
    if (this.engine.fx.uShaft.value.z > 0.08) hits.push('sunset');
    if (this.crews?.crews.some((c) => inView(this.track.getTrackPoint(c.dist).position, 60))) hits.push('crew');
    if (this.fire.active && inView(this.fire.group.position, 80)) hits.push('fire');
    if (this.weather.isSnowing && this.isGrinding) hits.push('snow');
    const fresh = completePhotos(hits);
    if (!fresh.length) return;
    const c = loadCareer();
    fresh.forEach((id, i) => {
      c.money += PHOTO_CHALLENGES[id].reward;
      setTimeout(() => this.toast.show('📸', `PHOTO CHALLENGE: ${PHOTO_CHALLENGES[id].name}`, `+$${PHOTO_CHALLENGES[id].reward}`), i * 600);
    });
    saveCareer(c);
  }

  private setEvent(text: string): void {
    if (text === this.eventText) return;
    this.eventText = text;
    const el = document.getElementById('event-pill');
    if (!el) return;
    if (text) el.textContent = text;
    el.style.opacity = text ? '1' : '0';
  }

  /** First time you reach a kind of damage, a card explains it (once per career) */
  private introduceKind(kind: DefectKind | undefined): void {
    if (!kind) return;
    const seen = loadJSON<string[]>('kinds-seen-v1', []);
    if (seen.includes(kind)) return;
    saveJSON('kinds-seen-v1', [...seen, kind]);
    const info = DEFECT_KINDS[kind];
    this.showCard('NEW KIND OF DAMAGE', info.name, `<div>${info.tip}.</div>
      <div style="font-size: 10px; color: #999; margin-top: 6px;">Its name shows above the profile displays while you're on it.</div>`, 7);
  }

  /** The card at the top right: new damage kinds and staged-tutorial lessons */
  private showCard(kicker: string, title: string, bodyHTML: string, seconds: number): void {
    // One at a time: if a card is up, wait for it to go
    if (this.cardBusyUntil > performance.now()) {
      this.cardQueue.push(() => this.showCard(kicker, title, bodyHTML, seconds));
      return;
    }
    this.cardBusyUntil = performance.now() + seconds * 1000 + 500;
    setTimeout(() => this.cardQueue.shift()?.(), seconds * 1000 + 600);
    const card = document.getElementById('kind-card');
    if (!card) return;
    card.innerHTML = `<div style="font-size: 10px; letter-spacing: 2px; color: #ffaa00;">${kicker}</div>
      <div style="font-size: 15px; font-weight: 700; margin: 4px 0; color: #ffcc55;">${title}</div>
      <div style="font-size: 12px; line-height: 1.5;">${bodyHTML}</div>`;
    card.style.opacity = '1';
    clearTimeout(this.kindCardTimer);
    this.kindCardTimer = window.setTimeout(() => { card.style.opacity = '0'; }, seconds * 1000);
  }
  private kindCardTimer = 0;
  private cardBusyUntil = 0;
  private cardQueue: (() => void)[] = [];

  /** After an over-grind: the coach says what went wrong (until you've learned it) */
  private showFailureTip(rail: 'left' | 'right', grindX: number, profile: RailProfile): void {
    const p = this.stonePressure[rail];
    const worst = this.worstZonesFor(profile)[0];
    this.coachMistake(p > 70 ? 'pressure' : worst && Math.abs(worst.centerX - grindX) > 4 ? 'offTarget' : this.stoneHeat > 60 ? 'heat' : 'pressure');
  }

  /** Live coaching that retires tips once learned (game/coach.ts) */
  private coach = new Coach();
  private offTargetTime = 0;
  private shallowSpeedTime = 0;

  /** A coaching callout for a mistake (if that tip isn't retired) */
  private coachMistake(m: Mistake): void {
    const line = this.coach.mistake(m, this.playTime);
    if (!line || !getSettings().hints) return;
    const el = document.getElementById('coach-line');
    if (!el) return;
    el.textContent = `COACH: ${line}`;
    el.style.opacity = '1';
    clearTimeout(this.coachTimer);
    this.coachTimer = window.setTimeout(() => { el.style.opacity = '0'; }, 4500);
  }
  private coachTimer = 0;

  /** A sound caption (Settings → Sound captions) */
  private caption(text: string): void {
    const el = document.getElementById('captions');
    if (!el) return;
    el.textContent = text;
    el.style.opacity = '1';
    clearTimeout(this.captionTimer);
    this.captionTimer = window.setTimeout(() => { el.style.opacity = '0'; }, 2200);
  }
  private captionTimer = 0;

  // ---------------------------------------------------------------------------
  // Visual extras: wet ground, cloud shadows, lightning, heat haze, sun shafts
  // ---------------------------------------------------------------------------

  /** World-side weather looks (before the sky/lighting update) */
  private updateWorldFx(dt: number): void {
    // Wet: soaks in quickly while it rains, dries slowly afterwards
    const rain = this.weather.isRaining ? this.weather.intensity : 0;
    this.wetness = rain > 0 ? Math.min(1, this.wetness + rain * 0.25 * dt) : Math.max(0, this.wetness - 0.01 * dt);
    this.dayNight.wetness = this.wetness;
    this.weatherMods = weatherModifiers(this.wetness, this.weather.snowCover > 0.5 || this.weather.isSnowing);
    // Dawn: frost in the mountains, sea fog on the coast
    this.dawnAmount += ((this.dayNight.currentName.toLowerCase() === 'dawn' ? 1 : 0) - this.dawnAmount) * Math.min(1, dt * 0.5);
    const seaFog = this.currentJob?.region === 'coast' ? 1 - 0.45 * this.dawnAmount : 1;
    if (this.vistaTime < 0) this.dayNight.fogScale = (this.mods.includes('fog') ? 0.4 : 1) * seaFog;
    if (this.atmos && this.grinder) {
      const open = this.currentJob?.region === 'prairie' || this.currentJob?.region === 'desert';
      const wind = 0.3 + this.weather.intensity * 0.9 + (open ? 0.3 : 0);
      this.atmos.update(dt, this.engine.camera, this.grinder.cars.map((c) => this.grinderPosition + c.offset),
        this.wetness, this.weather.isSnowing, this.dayNight.darkness, this.dawnAmount, wind);
    }
    this.grindEffects.spray.wet = this.wetness;
    const ballast = this.track.ballastMaterial;
    if (ballast) {
      ballast.roughness = 1 - 0.6 * this.wetness;
      ballast.color.setHex(0xc8c4bc).multiplyScalar(1 - 0.35 * this.wetness);
    }
    // Cloud shadows drift with the wind on bright days
    if (this.cloudShadows) {
      this.cloudShadows.uCloudOffset.value.x += 2.2 * dt;
      this.cloudShadows.uCloudOffset.value.y += 1.1 * dt;
      this.cloudShadows.uCloudAmount.value = 0.3 * (1 - this.dayNight.darkness) * (1 - this.weather.intensity)
        * (this.weather.snowCover > 0.5 ? 0.5 : 1);
    }
  }

  /** Output-pass effects (Engine.fx): heat haze, lightning, sun shafts */
  private updateScreenFx(dt: number): void {
    const fx = this.engine.fx;
    fx.uTime.value += dt;
    const cam = this.engine.camera;
    const reduced = getSettings().reducedFlashing;

    // Lightning in heavy rain: a double flicker, thunder a few seconds later
    if (this.weather.isRaining && this.weather.intensity > 0.55) {
      this.lightningTimer -= dt;
      if (this.lightningTimer <= 0) {
        this.lightningTimer = 7 + Math.random() * 14;
        const near = Math.random();
        this.flash = (reduced ? 0.2 : 0.6) + near * (reduced ? 0.1 : 0.4);
        setTimeout(() => { this.flash = Math.max(this.flash, reduced ? 0.15 : 0.5); }, 140);
        if (this.audioReady) this.audio.playThunder(0.6 + (1 - near) * 3, near);
      }
    }
    this.flash = Math.max(0, this.flash - dt * 4);
    fx.uFlash.value = this.flash * (1 - 0.6 * (1 - this.dayNight.darkness));

    // Heat haze above hot stones
    const hot = this.gameStarted && this.isGrinding ? Math.max(0, (this.stoneHeat - 30) / 70) : 0;
    this.hazeLevel += (hot - this.hazeLevel) * Math.min(1, dt * 2);
    if (this.hazeLevel > 0.01) {
      const tp = this.track.getTrackPoint(Math.max(0.1, Math.min(this.trackLength - 0.1, this.grinderPosition + 6)));
      // Smaller and fainter the further away the stones are
      const dist = cam.position.distanceTo(tp.position);
      const v = this._fxVec.copy(tp.position).project(cam);
      fx.uHaze.value.set(v.x * 0.5 + 0.5, v.y * 0.5 + 0.5,
        v.z < 1 ? this.hazeLevel * Math.min(1, Math.max(0.15, 10 / dist)) : 0, Math.min(0.25, Math.max(0.03, 2.5 / dist)));
    } else fx.uHaze.value.z = 0;

    // Sun shafts: low sun in view, clear sky
    const sun = this.dayNight.sunDirection;
    const v = this._fxVec.copy(cam.position).addScaledVector(sun, 500).project(cam);
    const onScreen = v.z < 1 && Math.abs(v.x) < 1.4 && v.y > -0.6 && v.y < 1.5;
    const low = Math.max(0, 1 - Math.max(0, sun.y) / 0.6);
    const strength = onScreen ? low * (1 - this.dayNight.darkness) * (1 - this.weather.overcast) * (1 - this.weather.intensity) : 0;
    fx.uShaft.value.set(v.x * 0.5 + 0.5, v.y * 0.5 + 0.5, strength);
  }

  /** The 3-star streak is broken (over-grind / overheat) */
  private loseCombo(reason: string): void {
    // A streak saver keeps a combo of 3+ alive once
    if (this.combo.count >= 3 && this.savers.savers > 0) {
      this.savers = { ...this.savers, savers: this.savers.savers - 1 };
      saveJSON('savers-v1', this.savers);
      this.floatingScore.show(`${reason} — SAVER USED, STREAK KEPT (${this.savers.savers} left)`, '#8ad0ff',
        window.innerWidth / 2, window.innerHeight / 2 - 90);
      return;
    }
    const had = this.combo.count > 1;
    this.combo.break();
    this.updateComboHud();
    if (had) {
      this.floatingScore.show(`${reason} — COMBO LOST`, '#ff6655', undefined, undefined, 'high');
      if (getSettings().rumble) this.input.rumble(1, 0.2, 320);
      if (this.audioReady) this.audio.playComboBreak();
    }
  }

  /** Combo pill in the HUD: hidden until there's a streak worth showing */
  private updateComboHud(): void {
    const el = this.comboEl ??= document.getElementById('combo-pill');
    if (!el) return;
    const n = this.combo.count;
    if (n < 2) { el.style.opacity = '0'; return; }
    el.style.opacity = '1';
    el.textContent = `COMBO ${n}  ×${this.combo.multiplier.toFixed(2).replace(/\.?0+$/, '')}${this.savers.savers ? `  · ${this.savers.savers} SAVER${this.savers.savers > 1 ? 'S' : ''}` : ''}`;
    el.style.color = n >= 5 ? '#ff66ff' : '#ffaa00';
    // little pop (transform only: cheap)
    el.animate([{ transform: 'translateX(-50%) scale(1.25)' }, { transform: 'translateX(-50%) scale(1)' }], { duration: 220 });
  }
  private comboEl: HTMLElement | null = null;
  private savers: SaverState = loadJSON<SaverState>('savers-v1', { savers: 0, progress: 0 });

  /** Brief red flash around the screen edge: you cut below the target */
  private flashVignette(): void {
    if (getSettings().reducedFlashing) return;
    const el = this.vignetteEl ??= document.getElementById('overgrind-vignette');
    if (!el) return;
    el.animate([{ opacity: 0.85 }, { opacity: 0 }], { duration: 450, easing: 'ease-out' });
  }
  private vignetteEl: HTMLElement | null = null;

  /** @param accepted - signed off over-ground (nothing left to grind): one star, no bonuses */
  private completeSegment(sectionIndex: number, accuracy: number, accepted = false): void {
    // The job's final section: a moment of slow motion
    if (this.completedCount === this.sectionCount - 1 && !getSettings().reducedMotion) this.engine.slowMo(1400, 0.3);
    const hadSlowOrder = this.segmentSlowOrder[sectionIndex];
    if (hadSlowOrder) this.slowSigns?.clear(sectionIndex); // board spins to green
    this.segmentCompleted[sectionIndex] = true;
    this.completedCount++;
    this.segmentSlowOrder[sectionIndex] = false;
    this.consecutiveCompleted++;

    // Star rating: accuracy, minus penalties for extra passes and over-grind damage
    const stars = accepted ? 1 : sectionStars(accuracy, this.segmentPasses[sectionIndex] || 0, this.segmentDamage[sectionIndex] || 0);
    // Everything about this section goes in ONE banner (it used to be up to
    // eight separate pop-ups at once)
    const lines: BannerLine[] = [];
    if (accepted) lines.push({ text: 'SIGNED OFF OVER-GROUND', color: '#ffb0a0' });
    // Skill scoring: perfect pass, combo, bonus pay (see game/scoring.ts)
    const run: SectionRun = {
      passes: this.segmentPasses[sectionIndex] || 0,
      damage: this.segmentDamage[sectionIndex] || 0,
      maxHeat: this.sectionMaxHeat[sectionIndex] || 0,
    };
    const perfect = !accepted && isPerfectPass(accuracy, run);
    if (perfect) this.perfectCount++;
    const practiced = this.practiced.has(sectionIndex);
    let bonus = practiced ? 0 : Math.round(this.combo.sectionDone(stars, perfect) * STONE_GRADES[this.stoneGrade].bonus);
    if (practiced) lines.push({ text: 'PRACTICE — NOT SCORED', color: '#aaaaaa' });
    // Close call: cleared with the revenue train almost here
    const trainIn = this.deadline.secondsLeft;
    if (!practiced && trainIn !== null && trainIn < 15) {
      bonus += EVENT_PAY.trainCloseCall;
      lines.push({ text: `CLOSE CALL WITH THE TRAIN  +$${EVENT_PAY.trainCloseCall}`, color: '#ff66ff' });
    }
    // Streak savers: one for every few perfect passes
    if (perfect && !practiced) {
      const before = this.savers.savers;
      this.savers = earnSaver(this.savers);
      saveJSON('savers-v1', this.savers);
      if (this.savers.savers > before) this.toast.show('★', 'STREAK SAVER EARNED', 'Your next combo break is forgiven');
      session.perfects++;
    }
    if (this.emergency && this.emergency.sec === sectionIndex) {
      bonus += EMERGENCY_PAY;
      this.emergency = null;
      lines.push({ text: `EMERGENCY CLEARED  +$${EMERGENCY_PAY}`, color: '#7dff8a' });
      this.radioDispatch.say('DISPATCH · MARGE', 'Emergency section cleared. That one\'s going in your file, Grinder 42.');
    }
    // Mirror finish: finished on fine stones, very accurately
    if (!practiced && !accepted && isMirrorFinish(this.stoneGrade, accuracy)) {
      const m = Math.round(MIRROR_BONUS * this.combo.multiplier);
      bonus += m;
      this.mirrorCount++;
      lines.push({ text: `MIRROR FINISH  +$${m}`, color: '#cfe8ff' });
    }
    // Under par: finished in no more passes than the estimate at job start
    const par = this.sectionPar[sectionIndex] ?? 99;
    if (run.passes + 1 <= par && par > 1) {
      bonus += EVENT_PAY.underPar;
      lines.push({ text: `UNDER PAR  +$${EVENT_PAY.underPar}`, color: '#8ad0ff' });
    }
    this.jobBonus += bonus;
    this.updateComboHud();
    // Mid-job bounty: settle it, or offer one when you're on a roll
    if (!practiced && !accepted) {
      if (this.bounty) {
        const res = bountyStep(this.bounty, stars, perfect);
        if (res === 'won') {
          this.jobBonus += this.bounty.reward;
          lines.push({ text: `BOUNTY CLAIMED  +$${this.bounty.reward}`, color: '#ff88cc' });
          this.bounty = null;
        } else if (res === 'lost') {
          lines.push({ text: 'BOUNTY MISSED', color: '#aa8899' });
          this.bounty = null;
        }
      } else {
        const b = offerBounty(this.combo.count, this.bountiesOffered, this.sectionCount - this.completedCount, Math.random);
        if (b) {
          this.bounty = b;
          this.bountiesOffered++;
          setTimeout(() => this.toast.show('◎', 'BOUNTY OFFERED', bountyText(b).replace('BOUNTY: ', '')), 900);
        }
      }
      this.bountyNudge = this.bounty ? bountyText(this.bounty) : '';
    }
    for (const m of this.coach.sectionDone()) {
      this.toast.show('✔', 'TIP LEARNED', `The coach won't mention it again: "${COACH_LINES[m].split(' — ')[0]}"`);
    }
    // Track restored: each section is ~20m = 65ft of rail returned to full speed
    const sectionFt = Math.round(GAME_SECTION_LENGTH * 3.281); // metres → feet
    this.trackRestoredFt += sectionFt;

    // Celebration: the section turns polished, then a bright glint sweeps along
    // it stretch by stretch while spark fountains ripple down both rails
    const track = this.track; // capture: a restart may replace this.track mid-sweep
    track.getSegmentsForSection(sectionIndex).forEach((vi, order) => {
      if (vi >= track.leftSegments.length) return;
      track.leftSegments[vi].setGrindProgress(1);
      track.rightSegments[vi].setGrindProgress(1);
      setTimeout(() => {
        track.leftSegments[vi].flashComplete();
        track.rightSegments[vi].flashComplete();
      }, order * 110);
    });
    const sectionStart = track.sectionOffset + sectionIndex * GAME_SECTION_LENGTH;
    // Bigger celebration for better work
    const strength = perfect ? 2 : stars >= 3 ? 1.4 : stars === 2 ? 1 : 0.6;
    this.grindEffects.celebrate(track, sectionStart, sectionStart + GAME_SECTION_LENGTH, strength);
    // Make it land: a brief freeze and a punch-in (bigger for better work)
    this.engine.hitStop(perfect ? 110 : stars >= 3 ? 80 : 50);
    if (getSettings().rumble) this.input.rumble(perfect ? 0.7 : 0.45, 0.5, perfect ? 380 : 220);
    this.camera.punch(perfect ? 1.6 : stars >= 3 ? 1.1 : 0.6);

    // The section banner: stars, what it earned, and what's next
    const head: BannerLine[] = [
      { text: '★'.repeat(stars) + '☆'.repeat(3 - stars), color: stars === 3 ? '#ffdd00' : '#aaaaaa' },
      { text: `+${sectionFt} FT RESTORED${hadSlowOrder ? ' · SLOW ORDER LIFTED' : ''}`, color: '#44ff44' },
    ];
    if (perfect) head.push({ text: `PERFECT PASS  +$${bonus}`, color: '#ffd84a' });
    else if (bonus > 0) head.push({ text: `BONUS  +$${bonus}`, color: '#9fe0a0' });
    if (this.combo.count > 1) head.push({ text: `COMBO ${this.combo.count}  ×${this.combo.multiplier.toFixed(2).replace(/\.?0+$/, '')}`,
      color: this.combo.count >= 5 ? '#ff66ff' : '#ffaa00' });
    this.floatingScore.banner(`SECTION ${sectionIndex + 1} COMPLETE`, perfect ? '#ffd84a' : '#ffffff',
      [...head, ...lines], this.nextNudge(stars));

    // Track map
    this.segmentStars[sectionIndex] = stars;
    this.trackMap.updateSegment(sectionIndex, { completed: true, slowOrder: false, stars });

    // Audio: the fanfare scales with how well it went
    if (this.audioReady) {
      this.audio.playSectionFanfare(stars, perfect, this.combo.count);
      if (perfect) this.audio.music?.sting();
    }
    const calm = getSettings().reducedMotion;
    // Perfect pass: a beat of slow motion on the shining rail
    if (perfect && !calm && this.completedCount < this.sectionCount) this.engine.slowMo(500, 0.45);
    // Close call with the revenue train: a one-second replay from the lineside
    if (!calm && !practiced && trainIn !== null && trainIn < 15 && this.completedCount < this.sectionCount) {
      this.camera.startReplay(1.3);
      this.engine.slowMo(1300, 0.3);
    }

    // Screen shake for completion
    this.camera.shake(0.05);
  }

  /**
   * Feel, every frame of play: the music follows what you're doing, the combo
   * shows in the sparks / grind sound / warm screen edges, and the controller
   * warns before the stones overheat.
   */
  private updateFeel(dt: number): void {
    const n = this.combo.count;
    // Letterbox while the close-call replay runs
    const bars = this.replayBarsEl ??= document.getElementById('replay-bars');
    const showBars = this.camera.replaying ? 'block' : 'none';
    if (bars && bars.style.display !== showBars) bars.style.display = showBars;
    const music = this.audio.music;
    if (music && this.audioReady) {
      music.setIntensity(!this.isGrinding && Math.abs(this.grinderSpeed) < 0.1 && n < 3 ? 1
        : !this.isGrinding ? (n >= 3 ? 2 : 1) : n >= 5 ? 4 : n >= 3 ? 3 : 2);
      music.update();
    }
    const boost = Math.min(1, Math.max(0, (n - 1) / 6));
    this.grindEffects.comboBoost = boost;
    this.audio.comboLift = boost;
    const glow = this.comboGlowEl ??= document.getElementById('combo-glow');
    const want = getSettings().reducedFlashing ? 0 : boost * (this.isGrinding ? 0.85 : 0.4);
    if (glow && Math.abs(Number(glow.style.opacity || 0) - want) > 0.03) glow.style.opacity = want.toFixed(2);
    // Heat warning: a light pulse in the hands as the stones near the red
    if (this.isGrinding && this.stoneHeat > 72 && this.stoneHeat < OVERHEAT && getSettings().rumble) {
      this.heatPulse -= dt;
      if (this.heatPulse <= 0) { this.heatPulse = 0.55; this.input.rumble(0.25, 0.05, 90); }
    }
  }
  private comboGlowEl: HTMLElement | null = null;
  private replayBarsEl: HTMLElement | null = null;
  private heatPulse = 0;

  /**
   * The "one more" line under the section banner: how close the next combo
   * step, bounty or job star is (see the addictive-loop notes in src/README.md).
   */
  private nextNudge(stars: number): string {
    const left = this.sectionCount - this.completedCount;
    if (left <= 0) return 'LAST SECTION — INSPECTION PASS NEXT';
    const fmt = (m: number) => m.toFixed(2).replace(/\.?0+$/, '');
    if (this.bountyNudge) return this.bountyNudge;
    if (this.combo.count >= 1 && stars >= 3) {
      return `${left} to go · next 3★ → COMBO ×${fmt(Math.min(3, 1 + 0.25 * this.combo.count))}`;
    }
    // Where the job's stars stand now (RQI over the whole route)
    const rqi = this.inspectionReport.computeJobReport(this.track, this.targetProfile).overallRQI;
    const steps = [60, 75, 85, 95];
    const next = steps.find((t) => rqi < t);
    return next ? `${left} to go · route RQI ${Math.round(rqi)} — ★${steps.indexOf(next) + 2} at ${next}` : `${left} to go · route RQI ${Math.round(rqi)} — 5★ pace`;
  }
  /** Set by the mid-job bounty (if one is running): replaces the nudge line */
  private bountyNudge = '';

  /**
   * Set an element's text / style only if it changed. Writing the DOM every
   * frame (even the same text) makes the browser redo style and layout work.
   */
  private setText(el: HTMLElement, text: string): void {
    if (el.textContent !== text) el.textContent = text;
  }
  private setStyle(el: HTMLElement, prop: 'color' | 'height' | 'background' | 'fontWeight', value: string): void {
    if (el.style[prop] !== value) el.style[prop] = value;
  }

  private updateHUD(): void {
    const visIdx = this.track.getSegmentIndex(this.grinderPosition);
    const profL = this.track.getProfile(visIdx, 'left');
    const profR = this.track.getProfile(visIdx, 'right');
    const accL = profL.compare(this.targetProfile).withinTolerance;
    const accR = profR.compare(this.targetProfile).withinTolerance;
    const accuracy = (Math.min(accL, accR) * 100).toFixed(0);
    const completedSegs = this.completedCount;

    // Compact progress display (cached elements)
    this.setText(this.segmentsEl, `${completedSegs}/${this.sectionCount}`);
    this.setText(this.accuracyEl, `${accuracy}%`);
    this.setStyle(this.accuracyEl, 'color', Number(accuracy) > 80 ? 'var(--ui-green)' :
      Number(accuracy) > 50 ? 'var(--ui-accent)' : 'var(--ui-red)');
  }

  private updateStonePanel(): void {
    // Always show both rails
    this.setText(this.angleValue, `${this.stoneAngle.left.toFixed(0)}°`);
    const psi = (p: number) => (p < STONE_LIFT_PRESSURE ? 'UP' : `${p.toFixed(0)}%`);
    this.setText(this.pressureValue, psi(this.stonePressure.left));
    this.setText(this.angleValueR, `${this.stoneAngle.right.toFixed(0)}°`);
    this.setText(this.pressureValueR, psi(this.stonePressure.right));

    const speedMph = Math.abs(this.grinderSpeed * 2.237);
    this.setText(this.speedValue, speedMph.toFixed(1));

    this.setText(this.heatValue, `${this.stoneHeat.toFixed(0)}%`);
    this.setStyle(this.heatFill, 'height', `${this.stoneHeat.toFixed(1)}%`);
    this.setStyle(this.heatFill, 'background', this.stoneHeat > 80 ? 'var(--ui-red)' :
      this.stoneHeat > 60 ? 'var(--ui-accent)' : 'var(--ui-green)');

    // Grind status (cached elements)
    const dotClass = this.isGrinding ? (this.overheatWarning ? 'dot red' : 'dot orange') : 'dot green';
    if (this.grindDotEl.className !== dotClass) this.grindDotEl.className = dotClass;
    this.setText(this.grindStatusEl, this.isGrinding ? (this.overheatWarning ? 'OVERHEAT' : 'GRINDING') : 'DRIVING');

    // Both rails always active
    this.setStyle(this.leftRailLabel, 'color', 'var(--ui-accent)');
    this.setStyle(this.rightRailLabel, 'color', 'var(--ui-accent)');
    this.setStyle(this.leftRailLabel, 'fontWeight', '700');
    this.setStyle(this.rightRailLabel, 'fontWeight', '700');
  }

  private checkJobComplete(): void {
    if (this.jobComplete) return;
    const completedCount = this.completedCount;
    if (completedCount >= this.sectionCount) {
      this.jobComplete = true;
      // Start inspection pass instead of immediately showing report
      this.startInspectionPass();
    }
  }

  private startInspectionPass(): void {
    this.inspectionPass = true;
    this.inspectionTimer = 0;
    this.grinderSpeed = 0;
    // Move grinder to start of track
    this.grinderPosition = 50;
    // Show notification
    this.floatingScore.show('INSPECTION PASS', '#44ff44');
    if (this.audioReady) this.audio.playSegmentComplete();
    // Job's done — no more revenue trains
    this.deadline.cancel();
    // Hide the gameplay HUD for the cinematic (restored when a job starts / menu opens)
    this.setCinematic(true);
  }

  /** Toggle the HUD-free cinematic look (CSS: body.cinematic in index.html) */
  private setCinematic(on: boolean): void {
    this.hints?.hideNow();
    document.body.classList.toggle('cinematic', on);
  }

  private handleInspectionPass(dt: number): void {
    if (!this.inspectionPass) return;

    this.inspectionTimer += dt;

    // Last shot: crane up over the restored line, then the report
    if (this.vistaTime >= 0) {
      this.vistaTime += dt;
      const from = this.track.sectionOffset;
      const to = from + this.sectionCount * GAME_SECTION_LENGTH;
      this.camera.updateVista(this.track, from, to, this.grinderPosition, Math.min(1, this.vistaTime / 4.5));
      // Push the fog back as the camera rises, so the whole line is visible
      this.dayNight.fogScale = 1 + Math.min(1, this.vistaTime / 3) * 1.8;
      if (this.vistaTime > 4.6 && !this.captureRequested) {
        this.captureRequested = true;
        this.engine.captureFrame().then((b) => { this.resultFrame = b; });
      }
      if (this.vistaTime > 5) {
        this.vistaTime = -1;
        this.dayNight.fogScale = 1;
        this.inspectionPass = false;
        this.showCompletionReport();
      }
      return;
    }

    // Fast drive through the section area
    this.grinderSpeed = 25;
    this.grinderPosition += this.grinderSpeed * dt;

    // Cinematic low orbit tracking the gleaming rails
    this.camera.updateInspection(this.track, this.grinderPosition, this.inspectionTimer);

    // Update grinder car positions
    const clampDist = (d: number) => Math.max(0.1, Math.min(this.trackLength - 0.1, d));
    for (const car of this.grinder.cars) {
      const frontPt = this.track.getTrackPoint(clampDist(this.grinderPosition + car.offset + car.halfLength));
      const rearPt = this.track.getTrackPoint(clampDist(this.grinderPosition + car.offset - car.halfLength));
      car.group.position.lerpVectors(rearPt.position, frontPt.position, 0.5);
      const fwd = this._tmpVec.subVectors(frontPt.position, rearPt.position).normalize();
      const right = this._tmpVec2.crossVectors(this._worldUp, fwd).normalize();
      const up = this._tmpVec3.crossVectors(fwd, right).normalize();
      car.group.quaternion.setFromRotationMatrix(this._tmpMat.makeBasis(right, up, fwd));
    }

    // End after passing through the section area
    const secEnd = this.track.sectionOffset + this.sectionCount * GAME_SECTION_LENGTH + 30;
    if (this.grinderPosition > secEnd) {
      this.grinderSpeed = 0;
      this.vistaTime = 0;
      this.floatingScore.show('TRACK RESTORED', '#7dff8a', window.innerWidth / 2, window.innerHeight * 0.3);
      this.arrival();
    }
  }

  /**
   * The job's done: horn, the crowd cheers, Marge says so, and a glint runs
   * the whole length of the restored line while the camera cranes up.
   */
  private arrival(): void {
    if (this.audioReady) {
      this.audio.playTrainHorn();
      setTimeout(() => this.audio.playCheer(), 500);
      this.audio.music?.setIntensity(4);
      setTimeout(() => this.audio.music?.sting(), 900);
    }
    this.radioDispatch.say('DISPATCH · MARGE', 'That\'s the whole line back to track speed. Lovely work, Grinder 42.');
    const track = this.track;
    const segs = track.leftSegments.length;
    for (let vi = 0; vi < segs; vi++) {
      if (track.getSectionIndex(vi * VISUAL_SEGMENT_LENGTH + 0.1) < 0) continue;
      setTimeout(() => {
        if (this.track !== track) return;
        track.leftSegments[vi].flashComplete();
        track.rightSegments[vi].flashComplete();
      }, 300 + vi * 28);
    }
  }

  private showCompletionReport(): void {
    this.floatingScore.clear();
    const postJobReport = this.labelDefects(this.inspectionReport.computeJobReport(this.track, this.targetProfile));
    const elapsed = this.playTime; // excludes time spent paused
    const completedCount = this.completedCount;

    const rqiAfter = postJobReport.overallRQI;
    // RQI-based stars, minus one per delayed revenue train (never below 1)
    const stars = jobStars(rqiAfter, this.deadline.missedWindows);

    // Previous best (for the comparison line), then save this run
    const prev = this.currentJob ? loadRecords()[this.currentJob.id] : undefined;
    const { newBest } = this.currentJob
      ? recordResult(this.currentJob.id, { stars, rqi: rqiAfter, time: elapsed })
      : { newBest: false };

    // Career: get paid for the contract (more stars = more pay)
    const practice = this.currentJob?.id === 'practice';
    // Grind plan: stayed within the passes you planned?
    if (this.plannedPasses > 0 && !practice) {
      const actual = this.segmentPasses.reduce((a, b) => a + (b || 0), 0) + this.sectionCount;
      const estimate = this.sectionPar.reduce((a, b) => a + b, 0);
      const pb = planBonus(this.plannedPasses, actual, estimate, this.sectionCount);
      this.jobBonus += pb;
      setTimeout(() => this.toast.show('📋', pb > 0 ? `PLAN MET  +$${pb}` : 'PLAN MISSED',
        `${actual} passes against a plan of ${this.plannedPasses}`), 600);
    }
    // Long haul: record this shift; the last one pays the big bonus
    if (this.currentJob?.id.startsWith('haul-')) {
      const h = loadLongHaul();
      h.stars.push(jobStars(this.labelDefects(this.inspectionReport.computeJobReport(this.track, this.targetProfile)).overallRQI, this.deadline.missedWindows));
      h.shift++;
      if (h.shift >= LONG_HAUL_SHIFTS) {
        const b = longHaulBonus(h.stars);
        this.jobBonus += b;
        setTimeout(() => this.toast.show('🚂', `LONG HAUL COMPLETE  +$${b}`, h.stars.map((s) => '★'.repeat(s)).join(' · ')), 900);
        saveLongHaul({ seed: Math.floor(Math.random() * 1e9), shift: 0, stars: [] });
      } else {
        saveLongHaul(h);
        setTimeout(() => this.toast.show('🚂', `SHIFT ${h.shift}/${LONG_HAUL_SHIFTS} DONE`, 'The next shift is waiting on the contract screen'), 900);
      }
    }
    // Finished with the revenue train still out: the main line is clear early
    const spare = this.deadline.secondsLeft;
    if (spare !== null && spare > 0) this.jobBonus += Math.round(spare * EVENT_PAY.earlyClearPerSecond);
    // Risk modifiers and rank raise the contract pay
    const contractPay = this.currentJob && !practice
      ? Math.round(jobPay(this.currentJob.basePay, stars) * modifierPay(this.mods) * this.perks.pay) : 0;
    // The customer pays extra if the job gave them what they wanted
    if (!practice) {
      const met = customerMet(this.customer, {
        rqi: rqiAfter, medal: timeMedal(elapsed, this.sectionCount),
        avgPressure: this.grindSeconds > 0 ? this.pressureSum / this.grindSeconds : 0, overgrinds: this.overgrindCount,
      });
      const c = CUSTOMERS[this.customer];
      if (met) {
        const extra = Math.round(contractPay * c.bonus);
        this.jobBonus += extra;
        setTimeout(() => this.toast.show('🤝', `${c.name.toUpperCase()}: HAPPY  +$${extra}`, `They wanted ${c.wants}`), 1200);
      } else {
        setTimeout(() => this.toast.show('🤝', `${c.name.toUpperCase()}: NOT QUITE`, `They wanted ${c.wants}`), 1200);
      }
    }
    const pay = practice ? 0 : Math.max(0, contractPay + this.jobBonus);
    const grade: Grade = jobGrade(stars, this.perfectCount, this.combo.best, this.sectionCount);
    if (!practice) this.afterJobProgress(stars, grade, rqiAfter, elapsed, pay);
    const jobId = this.currentJob?.id ?? '';
    const rank = jobId && !practice ? boardRank(jobId, pay) : -1;
    const career = loadCareer();
    career.money += pay;
    saveCareer(career);

    this.inspectionReport.showCompletionReport({
      ...postJobReport,
      sectionsCompleted: completedCount,
      trackRestoredFt: this.trackRestoredFt,
      elapsedTime: elapsed,
      metalRemoved: this.totalMetalRemoved,
      stars,
      rqiBefore: this.preJobRQI,
      rqiAfter,
      missedWindows: this.deadline.missedWindows,
      newBest,
      pay,
      contractPay,
      bonusPay: this.jobBonus,
      perfects: this.perfectCount,
      bestCombo: this.combo.best,
      grade,
      prevBest: prev ? { stars: prev.bestStars, rqi: prev.bestRQI, time: prev.bestTime } : undefined,
      nextJobName: this.suggestNextJob()?.name,
      profiles: this.profilesBefore.map((before, s) => ({
        before, after: this.track.getProfile(this.middleSegmentOf(s), 'left').points.map((p) => ({ x: p.x, y: p.y })),
      })),
      target: this.targetProfile.points.map((p) => ({ x: p.x, y: p.y })),
      nextGoal: currentGoal(),
      onShare: async () => {
        const blob = await makeShareCard({
          route: this.currentJob?.name ?? 'Rail grinding', grade, gradeColor: GRADE_COLORS[grade], stars,
          pay: formatMoney(pay), time: formatTime(elapsed), rqi: rqiAfter.toFixed(0),
          crew: selectedLivery().id === 'custom'
            ? `GRINDER ${loadCustomPaint().number}${loadCustomPaint().crew ? ' · ' + loadCustomPaint().crew.toUpperCase() : ''}` : 'GRINDER 42',
          code: this.currentJob?.code,
        }, this.resultFrame);
        return blob ? shareBlob(blob) : 'downloaded';
      },
      boardRank: rank,
      onInitials: rank >= 0 ? (initials) => addBoardEntry(jobId, {
        initials, score: pay, grade, stars, time: elapsed, date: todayKey(),
      }) : undefined,
    }).then((action) => {
      if (action === 'replay' && this.currentJob) this.rebuildForJob(this.currentJob);
      else this.startJobSelect(); // next contract
    });
  }

  /**
   * Career bookkeeping after a job: stats, daily streak, route condition, best
   * grade & medal, the ghost of a new best run, achievements and new paint
   * schemes (announced with toasts).
   */
  private afterJobProgress(stars: number, grade: Grade, rqiAfter: number, elapsed: number, pay: number): void {
    const job = this.currentJob;
    if (!job) return;
    const isDaily = job.id.startsWith('daily-');
    const isRandom = job.id.startsWith('random-');
    const liveriesBefore = new Set(LIVERIES.filter((l) => l.unlocked(liveryProgress())).map((l) => l.id));

    const s = loadStats();
    s.jobs++;
    s.sections += this.completedCount;
    s.perfects += this.perfectCount;
    s.metalMm += this.totalMetalRemoved;
    s.feetRestored += this.trackRestoredFt;
    s.bestCombo = Math.max(s.bestCombo, this.combo.best);
    s.overgrinds += this.overgrindCount;
    s.totalEarned += pay;
    if (grade === 'S') s.sGrades++;
    const night = this.dayNight.darkness > 0.6;
    const snow = this.weather.snowCover > 0.5 || this.weather.isSnowing;
    if (night) s.nightJobs++;
    if (snow) s.snowJobs++;
    if (isRandom) s.randoms++;
    if (isDaily) {
      const today = todayKey();
      s.dailyStreak = nextDailyStreak(s, today);
      if (s.lastDaily !== today) s.dailies++;
      s.lastDaily = today;
    }
    saveStats(s);

    if (!isDaily && !isRandom) updateRouteConditions(job.id, rqiAfter);
    recordGradeAndMedal(job.id, grade, timeMedal(elapsed, this.sectionCount));

    // New best time on this contract: keep this run as the ghost to race
    const prevGhost = loadGhost(job.id);
    if (!prevGhost || this.ghostSamples.length < prevGhost.length) saveGhost(job.id, this.ghostSamples);

    const fresh = checkAchievements({
      jobId: job.id, stars, grade, sections: this.sectionCount, perfects: this.perfectCount,
      bestCombo: this.combo.best, overgrinds: this.overgrindCount, missedWindows: this.deadline.missedWindows,
      night, snow, deadlineSpare: this.deadline.secondsLeft ?? 0, daily: isDaily, random: isRandom,
    }, s);
    fresh.forEach((a, i) => setTimeout(() => this.toast.show('🏆', 'ACHIEVEMENT: ' + a.name, a.description), 900 + i * 700));
    let delay = 900 + fresh.length * 700;
    const later = (icon: string, title: string, text: string) => { setTimeout(() => this.toast.show(icon, title, text), delay); delay += 700; };
    const builtIn = JOBS.some((j) => j.id === job.id);
    if (builtIn) {
      // Route mastery: every finish adds its stars to this route's level
      const m = addMastery(job.id, stars);
      if (m.after > m.before) later('▲', `ROUTE MASTERY ${m.after}`, `${job.name.split(' — ')[0]}: ${MASTERY_UNLOCKS[m.after - 1]} unlocked`);
      // Mastery badges: each one is a career star
      for (const b of awardBadges(job.id, {
        stars, night, usedFastTravel: this.usedFastTravel,
        gold: timeMedal(elapsed, this.sectionCount) === 'gold',
      })) later('★', `BADGE: ${BADGES[b].name.toUpperCase()} (+1 CAREER STAR)`, job.name.split(' — ')[0]);
      // Weekly ladder: beat your own best pay on this week's routes
      const unlocked = JOBS.filter((j) => isUnlocked(j.starsToUnlock, totalBestStars(loadRecords()))).map((j) => j.id);
      const ladder = loadLadder(weekKey(), unlocked);
      const prevTop = loadBoard(job.id)[0]?.score ?? 0;
      if (ladder.routes.includes(job.id) && !ladder.done.includes(job.id) && pay > prevTop) {
        ladder.done.push(job.id);
        saveLadder(ladder);
        const c = loadCareer();
        const all = ladder.done.length >= ladder.routes.length;
        c.money += LADDER_RUNG_PAY + (all ? LADDER_TOP_PAY : 0);
        saveCareer(c);
        if (all) { this.savers = earnSaver({ ...this.savers, progress: 99 }); saveJSON('savers-v1', this.savers); }
        later('▲', all ? 'WEEKLY LADDER COMPLETE!' : `LADDER RUNG ${ladder.done.length}/3`,
          `+$${LADDER_RUNG_PAY + (all ? LADDER_TOP_PAY : 0)}${all ? ' and a streak saver' : ' — beat your best'}`);
      }
    }
    // Seasonal event route: 3★ earns the event paint and museum find
    if (job.id.startsWith('event-') && stars >= 3) {
      const ev = currentEvent();
      if (grantEventRewards(ev)) later('🎨', `EVENT PAINT: ${ev.livery.name.toUpperCase()}`, `And a museum find: ${ev.find.name}`);
    }
    const hired = Object.entries(this.crew).filter(([, on]) => on).map(([id]) => id);
    if (hired.length) addCrewJob(hired);
    session.jobs++;
    session.earned += pay;
    session.achievements += fresh.length;
    const liveriesNow = LIVERIES.filter((l) => l.unlocked(liveryProgress()) && !liveriesBefore.has(l.id));
    liveriesNow.forEach((l, i) => setTimeout(() => this.toast.show('🎨', 'NEW PAINT: ' + l.name, 'Choose it on the Career page'),
      900 + (fresh.length + i) * 700));
    void unlockedAchievements;
  }

  /** Name each section in a report by its real damage kind */
  private labelDefects<R extends { sections: Array<{ index: number; defectType: string }> }>(report: R): R {
    for (const sec of report.sections) {
      const kind = this.sectionKinds[sec.index];
      if (kind) sec.defectType = DEFECT_KINDS[kind].name;
    }
    return report;
  }

  /** The contract to suggest next: the next one in the list after this one */
  private suggestNextJob(): JobDefinition | undefined {
    const i = JOBS.findIndex((j) => j.id === this.currentJob?.id);
    return i >= 0 ? JOBS[(i + 1) % JOBS.length] : undefined;
  }

  /** Show job selection and start a new job (`auto`: skip the menu and take this one) */
  private startJobSelect(auto?: JobDefinition): void {
    this.gameStarted = false;
    this.jobComplete = false;
    // Only switch to "replay" mode once a job has actually been played.
    // (On the very first call — from the constructor — currentJob is still null,
    // so the guided tutorial and easy opening sections stay enabled.)
    if (this.currentJob) {
      this.guidedTutorial.setReplay();
      this.isFirstJob = false;
    }
    this.isPaused = false;
    this.pauseMenu.style.display = 'none';
    this.setCinematic(false);
    this.floatingScore.clear();
    this.cabView.setVisible(false);
    this.audio.onCue = (t) => { if (getSettings().captions) this.caption(t); };
    this.audio.music?.setIntensity(0);
    const glow = document.getElementById('combo-glow');
    if (glow) glow.style.opacity = '0';
    this.jobSelect.show(auto).then((picked) => {
      // A new player's first contracts are short first shifts
      const job = JobSelect.firstShift(picked, loadStats().jobs);
      this.currentJob = job;
      this.rebuildForJob(job);
    });
  }

  /**
   * Build the per-job world: track (with defects and slow orders), scenery,
   * passing train, and fresh scoring state. Disposes the previous job's world first.
   */
  private buildWorld(job: JobDefinition): void {
    // Remove old track, environment, and passing train — and free their GPU memory
    // (removing from the scene alone leaves geometry/materials/textures allocated)
    if (this.track) {
      this.engine.scene.remove(this.track.group);
      this.track.dispose();
    }
    if (this.environment) {
      this.engine.scene.remove(this.environment.group);
      disposeObject3D(this.environment.group);
    }
    if (this.slowSigns) {
      this.engine.scene.remove(this.slowSigns.group);
      disposeObject3D(this.slowSigns.group);
      this.slowSigns = null;
    }
    if (this.ocean) {
      this.engine.scene.remove(this.ocean.group);
      disposeObject3D(this.ocean.group);
      this.ocean = null;
    }
    if (this.landmarks) {
      this.engine.scene.remove(this.landmarks.group);
      disposeObject3D(this.landmarks.group);
      this.landmarks = null;
    }
    if (this.crews) {
      this.engine.scene.remove(this.crews.group);
      disposeObject3D(this.crews.group);
      this.crews = null;
    }
    if (this.wildlife) {
      this.engine.scene.remove(this.wildlife.group);
      disposeObject3D(this.wildlife.group);
      this.wildlife = null;
    }
    if (this.atmos) {
      this.engine.scene.remove(this.atmos.group);
      disposeObject3D(this.atmos.group);
      this.atmos = null;
    }
    if (this.passingTrain) {
      this.engine.scene.remove(this.passingTrain.group);
      this.engine.scene.remove(this.passingTrain.adjacentTrack);
      disposeObject3D(this.passingTrain.group);
      disposeObject3D(this.passingTrain.adjacentTrack);
    }

    // Build new track from job definition (50m lead-in before section 1)
    this.track = new RailTrack(job.trackPoints, undefined, job.sections, 50);
    this.engine.scene.add(this.track.group);

    // Reset scoring + grinder state
    this.segmentCompleted = new Array(this.sectionCount).fill(false);
    this.completedCount = 0;
    this.segmentPasses = new Array(this.sectionCount).fill(0);
    this.segmentDamage = new Array(this.sectionCount).fill(0);
    this.segmentSlowOrder = new Array(this.sectionCount).fill(false);
    this.totalMetalRemoved = 0;
    this.trackRestoredFt = 0;
    this.grinderPosition = 50;
    this.grinderSpeed = 0;
    this.lastSectionIndex = -1;
    this.consecutiveCompleted = 0;
    this.combo.reset();
    this.jobBonus = 0;
    this.perfectCount = 0;
    this.overheated = false;
    this.sectionMaxHeat = new Array(this.sectionCount).fill(0);
    this.stoneAngle = { left: 0, right: 0 };
    this.stonePressure = { left: 50, right: 50 };
    this.stoneHeat = 0;

    // Apply defects with job severity, then slow-order only the worst sections
    this.applyInitialDefects(job);
    this.setSegmentDefectGlow();
    this.assignSlowOrders();
    // Physical slow-order boards at each restricted section
    this.slowSigns = new SlowOrderSigns(this.track, this.segmentSlowOrder);
    this.engine.scene.add(this.slowSigns.group);
    this.initialSectionAccuracy = [];
    for (let sec = 0; sec < this.sectionCount; sec++) {
      this.initialSectionAccuracy.push(sectionMeanAccuracy(this.track, this.targetProfile, sec));
    }

    // Route weather (climate), background sounds and snow cover
    this.weather.setRegion(job.region);
    this.dayNight.region = job.region; // the route's own colour look
    if (job.forceWeather) this.weather.force(job.forceWeather); // Storm variants, winter event
    this.audio.setRegion(job.region);
    this.dayNight.snowCover = this.weather.snowCover;
    const groundMat = this.ground.material as THREE.MeshLambertMaterial;
    // (the pale snow texture, tinted, also makes the desert's sand)
    const groundMap = this.weather.snowCover > 0.5 || job.region === 'desert' ? this.snowGroundTexture : this.grassGroundTexture;
    if (groundMat.map !== groundMap) { groundMat.map = groundMap; groundMat.needsUpdate = true; }

    // Landmarks + level crossings first, so the scenery can keep clear of them
    const landmarks = new Landmarks(this.track, job.region);
    this.landmarks = landmarks;
    this.engine.scene.add(landmarks.group);

    // Bridges and tunnels, clear of crossings and landmarks
    if (this.structures) {
      this.engine.scene.remove(this.structures.group);
      disposeObject3D(this.structures.group);
    }
    this.structures = new Structures(this.track, job.region, (job.seed ?? hashSeed(job.id)) ^ 0x7b1d, (d) => {
      const tp = this.track.getTrackPoint(d);
      const x = tp.position.x, z = tp.position.z, rx = tp.right.x, rz = tp.right.z;
      return landmarks.blocks(x, z) || landmarks.blocks(x + rx * 5, z + rz * 5) || landmarks.blocks(x - rx * 8, z - rz * 8);
    });
    this.engine.scene.add(this.structures.group);
    const structures = this.structures;
    // Track hardware around the consist, and the people who come to watch
    for (const old of [this.trackDetail, this.bystanders]) {
      if (old) { this.engine.scene.remove(old.group); disposeObject3D(old.group); }
    }
    this.trackDetail = new TrackDetail(this.track);
    this.engine.scene.add(this.trackDetail.group);
    const overlayWasOn = this.overlay?.on ?? false;
    if (this.overlay) { this.engine.scene.remove(this.overlay.mesh); disposeObject3D(this.overlay.mesh); }
    this.overlay = new DamageOverlay(this.track);
    if (overlayWasOn) this.overlay.toggle();
    this.engine.scene.add(this.overlay.mesh);
    const crossings = landmarks.crossingDistances;
    let platformAt: number | null = null;
    const prand = seededRandom((job.seed ?? hashSeed(job.id)) ^ 0x51a7);
    for (let tries = 0; tries < 10 && platformAt === null; tries++) {
      const d = this.track.sectionOffset + (2 + Math.floor(prand() * Math.max(1, this.sectionCount - 4)) + 0.5) * GAME_SECTION_LENGTH;
      const clearOfCrossings = crossings.every((c) => Math.abs(c - d) > 30);
      const clearOfStructures = structures.list.every((s) => d < s.from - 25 || d > s.to + 25);
      if (clearOfCrossings && clearOfStructures) platformAt = d;
    }
    this.bystanders = new Bystanders(this.track, crossings, platformAt, (job.seed ?? hashSeed(job.id)) ^ 0x2f3);
    this.engine.scene.add(this.bystanders.group);
    // Switches (once crews and broken rails are on: see game/lessons.ts) and the quiet zone
    if (this.hazards) { this.engine.scene.remove(this.hazards.group); disposeObject3D(this.hazards.group); }
    const switches = job.id === 'practice' || !featuresFor(loadStats().jobs).crews ? 0 : this.sectionCount >= 18 ? 2 : 1;
    this.hazards = new Hazards(this.track, switches, (job.seed ?? hashSeed(job.id)) ^ 0x5717, (d) =>
      structures.list.some((s) => d > s.from - 10 && d < s.to + 10)
      || crossings.some((c) => Math.abs(c - d) < 12)
      || (platformAt !== null && Math.abs(platformAt - d) < 25), platformAt);
    this.engine.scene.add(this.hazards.group);
    this.clearSwitchStretches();
    this.quietFined = false;
    const plat = this.bystanders.platform;
    const platformBlocks = (x: number, z: number) => {
      if (!plat) return false;
      const mid = this.track.getTrackPoint((plat.from + plat.to) / 2).position;
      return (x - mid.x) ** 2 + (z - mid.z) ** 2 < 16 * 16;
    };

    // New environment (coastal routes keep the west side clear for the sea)
    const coast = job.scenery === 'coast';
    // Season: built-in contracts follow the calendar, random routes roll their own
    this.season = job.id.startsWith('random-')
      ? (['spring', 'summer', 'autumn', 'winter'] as Season[])[(job.seed ?? 0) % 4]
      : seasonForMonth(new Date().getMonth());
    const look = SEASON_LOOK[this.season];
    this.dayNight.seasonGround = look.grassAmount > 0 ? new THREE.Color(look.grass).multiplyScalar(0.8) : null;
    this.dayNight.seasonAmount = look.grassAmount;
    if (job.region === 'desert') {
      // Sand and scrub instead of grass
      this.dayNight.seasonGround = new THREE.Color(DESERT_GROUND).multiplyScalar(0.85);
      this.dayNight.seasonAmount = 0.85;
    }
    this.environment = new Environment(this.track, {
      season: this.season,
      clearSide: coast ? { side: -1, beyond: 7 } : undefined,
      blocked: (x, z) => landmarks.blocks(x, z) || structures.blocks(x, z) || platformBlocks(x, z),
      snow: this.weather.snowCover,
      ...REGION_SCENERY[job.region],
    });
    this.engine.scene.add(this.environment.group);
    if (coast) {
      this.ocean = new Ocean(this.track, -1);
      this.engine.scene.add(this.ocean.group);
    }

    // New passing train
    this.passingTrain = new PassingTrain();
    this.passingTrain.setTrack(this.track);
    this.engine.scene.add(this.passingTrain.group);
    this.engine.scene.add(this.passingTrain.adjacentTrack);
    this.buildJobEvents(job);
    this.giveInstancedCastersOwnDepthMaterial();

    // Set time of day from job
    const times = ['dawn', 'day', 'dusk', 'night'];
    this.dayNight.setTime(times[job.timeOfDay] || 'day');

    // Update ground position to cover new track
    this.ground.position.set(30, -0.6, this.trackLength / 2);

    // Track map
    this.trackMap.init(this.sectionCount);
    this.updateTrackMapDefects();
  }

  /**
   * The shadow map draws every caster with one shared depth material. When
   * instanced casters (trees, sign posts) and normal ones take turns, three.js
   * has to switch that material between its instanced and normal shader each
   * time. Giving the instanced ones their own identical copy avoids that.
   */
  private giveInstancedCastersOwnDepthMaterial(): void {
    this._instancedDepth ??= new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
    this.engine.scene.traverse((o) => {
      const m = o as THREE.InstancedMesh;
      if (m.isInstancedMesh && m.castShadow && !m.customDepthMaterial) m.customDepthMaterial = this._instancedDepth!;
    });
  }
  private _instancedDepth: THREE.MeshDepthMaterial | null = null;

  /** Tear down current job and rebuild for a new one */
  private rebuildForJob(job: JobDefinition): void {
    this.ensureGrinder();
    // Freeze gameplay until startGame() runs (the pre-job report may be showing)
    this.gameStarted = false;
    this.jobComplete = false;
    this.inspectionPass = false;
    this.isPaused = false;
    this.pauseMenu.style.display = 'none';
    this.setCinematic(false);
    if (this.photoMode.active) this.photoMode.setActive(false, this.track, this.grinderPosition);

    // Clear any revenue-train countdown (and missed-window count) from the previous attempt
    this.deadline.reset();

    // Stop grinding effects that may still be running
    this.isGrinding = false;
    this.dayNight.grindBoost = 0;
    this.grinder.setGrinding(false);
    this.grindEffects.stop();
    if (this.audioReady) this.audio.stopGrinding();

    this.buildWorld(job);
    this.showLoadingTip(job);
    // Compile every shader for the new world now (in the background), so the
    // first spark / freight train / headlight doesn't stall the game mid-play
    this.engine.prewarm();
    // Grinder upgrades bought in the shop apply to this job
    this.upgrades = upgradeEffects(loadCareer().upgrades);

    // Compute pre-job report
    const preJobReport = this.labelDefects(this.inspectionReport.computeJobReport(this.track, this.targetProfile));
    this.preJobRQI = preJobReport.overallRQI;

    this.grinder.setUpgrades(loadCareer().upgrades);
    this.photoMode.stampText = `${job.name} · ${job.location}`;
    this.ghost = loadGhost(job.id);
    this.ghostSamples = [];
    this.ghostTimer = 0;
    this.overgrindCount = 0;
    this.trackMap.setGhostPosition(-1);

    const startGame = () => {
      if (this.mods.includes('night')) this.dayNight.setTime('night');
      this.gameStarted = true;
      this.jobComplete = false;
      this.playTime = 0;
      this.deadline.reset();
      // The dispatcher's story moves on as your career does
      // Staged tutorial: this job's one new lesson
      const lesson = this.currentJob?.id === 'practice' ? null : lessonFor(loadStats().jobs);
      if (lesson) {
        setTimeout(() => this.showCard('NEW ON THIS JOB', lesson.title,
          lesson.lines.map((l) => `<div style="margin-bottom: 4px;">• ${l}</div>`).join(''), 14), 1200);
      }
      const beat = nextStoryBeat(loadStats().jobs);
      if (beat) {
        markStorySeen(beat.id);
        setTimeout(() => this.radioDispatch.say(beat.lines[0].from, beat.lines[0].text), 2500);
      } else {
        // The crew you've hired have their own stories; Marge remembers yours
        const hired = Object.entries(this.crew).filter(([, on]) => on).map(([id]) => id);
        const line = crewBeat(hired);
        const remark = margeRemark(loadStats());
        if (line) setTimeout(() => this.radioDispatch.say(line.from, line.text), 2500);
        else if (remark) setTimeout(() => this.radioDispatch.say('DISPATCH · MARGE', remark), 2500);
      }
    };

    this.stoneGrade = 'standard';
    this.nextStoneGrade = 'standard';
    this.plannedPasses = 0;
    // First job: skip report, go straight to guided gameplay
    if (this.guidedTutorial.isFirstJob()) {
      startGame();
    } else {
      // Subsequent jobs: show the inspection report
      // The report has its own reading time: don't show the loading tip through it
      const tipBox = document.getElementById('loading-tip');
      if (tipBox) tipBox.style.opacity = '0';
      this.loadingTipTime = -1;
      const wm = weatherModifiers(0, this.weather.snowCover > 0.5);
      this.inspectionReport.showPreJobReport(preJobReport, {
        estimate: job.id === 'practice' ? 0 : this.sectionPar.reduce((a, b) => a + b, 0),
        profileName: TRACK_CLASSES[this.trackClass].name, profileTip: TRACK_CLASSES[this.trackClass].tip,
        notes: [
          `CUSTOMER: ${CUSTOMERS[this.customer].name.toUpperCase()} — wants ${CUSTOMERS[this.customer].wants} (+${Math.round(CUSTOMERS[this.customer].bonus * 100)}% pay)`,
          ...(this.hazards?.switches.length ? [`SWITCHES: ${this.hazards.switches.length} on this line — lift the stones (SPACE) over them (yellow board 40 m before)`] : []),
          ...(this.hazards?.quiet ? ['QUIET ZONE by the station: at night keep the pressure under 60%'] : []),
          ...(this.sectionTurn.some((t) => Math.abs(t) > 0.03) ? ['CURVES: the outer rail wears its gauge face, the inner rail its crown'] : []),
          ...(wm.label ? [wm.label] : []),
        ],
      }).then((p) => {
        this.stoneGrade = p.stone;
        this.nextStoneGrade = p.stone;
        this.plannedPasses = p.plan;
        startGame();
      });
    }
  }

}

