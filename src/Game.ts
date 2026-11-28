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
import { FloatingScore } from './ui/FloatingScore';
import { RadioDispatch } from './ui/RadioDispatch';
import { InspectionReport } from './ui/InspectionReport';
import { JobSelect, type JobDefinition } from './ui/JobSelect';
import { eventBus } from './core/EventBus';
import { disposeObject3D } from './core/dispose';
import { CameraController } from './core/CameraController';
import { RevenueTrainDeadline } from './world/RevenueTrainDeadline';
import type { TargetProfile, Region } from './types/rail';
import {
  COMPLETION_ACCURACY, GRIND_SPEED, COOL_RATE,
  stoneGrindX, stoneContactWidth, heatRatePerSec, heatPenalty, removalRatePerSec,
  sectionStars, jobStars, sectionProgress, approachSpeedLimit,
} from './game/rules';
import { sectionAccuracy, sectionMeanAccuracy, sectionWorstDeviation } from './game/sectionMetrics';
import { recordResult } from './game/progress';
import { loadCareer, saveCareer, upgradeEffects, jobPay } from './game/career';
import { PerfOverlay } from './ui/PerfOverlay';
import { PhotoMode } from './ui/PhotoMode';
import { loadQuality, cycleQuality, QUALITY_PRESETS, type QualityLevel } from './core/quality';
import { toggleColorblindMode } from './ui/palette';

const RAILS = ['left', 'right'] as const;

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
};

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
    this.dayNight.update(dt, this.engine.camera, focus);
    const dark = this.dayNight.darkness;
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
      this.engine.renderHeight / (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2)));
  }

  /** @param audioContext - made on the title click (a user gesture), if available */
  constructor(audioContext?: AudioContext) {
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
    this.guidedTutorial = new GuidedTutorial();

    // (No world is built yet: the job-select screen covers everything, and the
    // world is built for whichever job the player picks. Building one just as
    // a hidden backdrop cost ~0.3 s plus compiling all its shaders on the first
    // frame, which froze the page for up to a second after clicking start.)
    // Compile what exists now (sky, ground, effects) in the background:
    this.engine.prewarm();

    // Show job selection screen first
    this.startJobSelect();

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

    // Defect peak templates: { centerX, width (sigma), depth multiplier }
    const peakTemplates = [
      { name: 'gauge_corner', cx: -25, sigma: 6, base: 0.18 },
      { name: 'gauge_shoulder', cx: -15, sigma: 5, base: 0.12 },
      { name: 'crown_flat', cx: 0, sigma: 10, base: 0.08 },
      { name: 'crown_bump', cx: 5, sigma: 4, base: 0.10 },
      { name: 'field_transition', cx: 15, sigma: 5, base: 0.10 },
      { name: 'field_lip', cx: 25, sigma: 6, base: 0.14 },
    ];

    // Use a seeded-ish random for reproducibility
    let seed = 42;
    const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

    for (let vi = 0; vi < totalVisual; vi++) {
      const viDist = vi * VISUAL_SEGMENT_LENGTH;
      const secIdx = this.track.getSectionIndex(viDist);
      // Skip lead-in and run-out track (outside the scored sections)
      if (secIdx < 0) continue;
      const jobSeverity = job.defectSeverity;
      // First 2 sections are trivially easy for onboarding
      const easyMult = (this.isFirstJob && secIdx < 2) ? 0.15 : 1.0;
      // Severity ramps up along the route. DEFECT_SCALE sets overall difficulty:
      // tuned so even the Easy job starts below the RQI 80 target.
      const DEFECT_SCALE = 1.4;
      const difficulty = (0.6 + (secIdx / this.sectionCount) * 0.4) * jobSeverity * DEFECT_SCALE * easyMult;

      // Pick DIFFERENT defect peaks for each rail independently
      for (const rail of ['left', 'right'] as const) {
        const numPeaks = 2 + Math.floor(rand() * 3);
        const shuffled = [...peakTemplates].sort(() => rand() - 0.5);
        const railPeaks = shuffled.slice(0, numPeaks);

        // On curves, inner rail gets more gauge-side wear, outer gets field-side
        for (let pi = 0; pi < railPeaks.length; pi++) {
          const pk = railPeaks[pi];
          if (rail === 'left' && pk.cx < 0) {
            railPeaks[pi] = { ...pk, base: pk.base * (1.0 + rand() * 0.5) };
          } else if (rail === 'right' && pk.cx > 0) {
            railPeaks[pi] = { ...pk, base: pk.base * (1.0 + rand() * 0.5) };
          }
        }

        const profile = this.track.getProfile(vi, rail);
        for (const point of profile.points) {
          for (const peak of railPeaks) {
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
      });
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
    this.engine.scene.add(this.ground);
  }



  // ---- MAIN UPDATE LOOP ----

  private togglePause(): void {
    if (!this.gameStarted || this.jobComplete || this.inspectionPass) return;
    this.isPaused = !this.isPaused;
    this.pauseMenu.style.display = this.isPaused ? 'flex' : 'none';
  }

  private update(dt: number): void {
    // Settings toggles work everywhere, including menus
    this.perfOverlay.update(this.engine.renderer.info.render);
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
    this.handleGrinderMovement(dt);
    this.handleGrinding(dt);
    this.camera.update(dt, this.track, this.grinderPosition);
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
      this.audio.setDieselSpeed(this.grinderSpeed);
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

    // Radio dispatch
    this.radioDispatch.update(dt);

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
    this.trackMap.draw();

    // Boost exposure when grinding in the dark for spark drama (eased in DayNightCycle)
    this.dayNight.grindBoost = this.isGrinding ? 1 : 0;

    // Revenue train deadline (paused during the guided tutorial)
    if (!this.guidedTutorial.active) {
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

  private handleGrinderMovement(dt: number): void {
    // Slow order enforcement: 2 m/s (~4.5 mph) in damaged sections. Like a real
    // train, the grinder starts braking *before* the slow order, so that it is
    // already down to the limit when it gets there.
    const SLOW_ORDER_SPEED = 2.0;
    const SLOW_ORDER_BRAKE = 10; // m/s²
    // (plan the approach with 20% braking in reserve, so it never arrives too fast)
    const slowOrderLimit = this.slowOrderSpeedLimit(SLOW_ORDER_SPEED, SLOW_ORDER_BRAKE * 0.8);

    // While grinding, auto-speed is handled in handleGrinding
    // While not grinding, player drives normally
    if (!this.isGrinding) {
      // SHIFT = fast-travel (3x speed) when not grinding
      const fastTravel = this.input.isKeyDown('shift');
      const speedMult = fastTravel ? 3.0 : 1.0;
      // Fast travel raises the top speed, but never the slow-order limit
      const maxSpeed = Math.min(10 * speedMult, slowOrderLimit);
      const accel = 5 * speedMult, friction = 3;

      if (this.input.isKeyDown('w') || this.input.isKeyDown('arrowup')) {
        this.grinderSpeed = Math.min(maxSpeed, this.grinderSpeed + accel * dt);
      } else if (this.input.isKeyDown('s') || this.input.isKeyDown('arrowdown')) {
        this.grinderSpeed = Math.max(-maxSpeed / 2, this.grinderSpeed - accel * dt);
      } else {
        if (this.grinderSpeed > 0) this.grinderSpeed = Math.max(0, this.grinderSpeed - friction * dt);
        else if (this.grinderSpeed < 0) this.grinderSpeed = Math.min(0, this.grinderSpeed + friction * dt);
      }
      // Too fast for the limit (e.g. coasting toward a slow order)? Brake firmly down to it.
      if (this.grinderSpeed > maxSpeed) {
        this.grinderSpeed = Math.max(maxSpeed, this.grinderSpeed - SLOW_ORDER_BRAKE * dt);
      } else if (this.grinderSpeed < -maxSpeed / 2) {
        this.grinderSpeed = Math.min(-maxSpeed / 2, this.grinderSpeed + SLOW_ORDER_BRAKE * dt);
      }
    }

    this.grinderPosition += this.grinderSpeed * dt;
    // Clamp so entire consist stays on track (crew car at offset +67 is the longest)
    const maxPos = this.trackLength - 75;
    const minPos = 0;
    this.grinderPosition = Math.max(minPos, Math.min(maxPos, this.grinderPosition));

    // Gradual slowdown near track ends (brake feel, not abrupt wall)
    const endProximity = Math.min(this.grinderPosition - minPos, maxPos - this.grinderPosition);
    if (endProximity < 20) {
      const brakeFactor = endProximity / 20;
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

    // Update stone panel UI
    this.updateStonePanel();

    // Camera
    if (this.input.wasKeyPressed('1')) { this.camera.angle = 'chase';}
    if (this.input.wasKeyPressed('2')) { this.camera.angle = 'side';}
    if (this.input.wasKeyPressed('3')) { this.camera.angle = 'cab';}
    if (this.input.wasKeyPressed('4')) { this.camera.angle = 'overview';}
    if (this.input.wasKeyPressed('5')) { this.camera.angle = 'grind';}
  }

  /**
   * Each frame: lower/raise the stones (SPACE), remove metal from the rail
   * under the grinder, track heat / over-grinding / passes, and complete
   * sections when they pass. Tuning numbers live in game/rules.ts.
   */
  private handleGrinding(dt: number): void {
    const sectionIndex = this.track.getSectionIndex(this.grinderPosition);
    const visualSegIndex = this.track.getSegmentIndex(this.grinderPosition);

    this.isGrinding = this.input.isKeyDown(' ');
    const avgPressure = (this.stonePressure.left + this.stonePressure.right) / 2;

    // Heat: builds with pressure while grinding (cooling upgrade slows it), cools while lifted
    const heatRate = heatRatePerSec(avgPressure);
    const heatChange = this.isGrinding ? (heatRate > 0 ? heatRate * this.upgrades.heat : heatRate) : -COOL_RATE;
    this.stoneHeat = Math.max(0, Math.min(100, this.stoneHeat + heatChange * dt));
    this.overheatWarning = this.stoneHeat > 80;
    this.overgrindCooldown = Math.max(0, this.overgrindCooldown - dt);

    // Always show where each stone is aimed on the profile displays
    for (const rail of RAILS) {
      this.rendererFor(rail).setStoneContact(
        stoneGrindX(this.stoneAngle[rail]), stoneContactWidth(this.stonePressure[rail]) * this.upgrades.width,
        this.stonePressure[rail], true, this.isGrinding);
      this.rendererFor(rail).setPreview(null);
    }

    // Sparks, work lights, contact glow
    this.grindEffects.setState(this.track, this.grinderPosition, this.isGrinding, avgPressure);
    this.grinder.setGrinding(this.isGrinding);

    if (!this.isGrinding) {
      this.audio.stopGrinding();
      return;
    }

    // AUTO-SPEED: while grinding, the grinder creeps forward on its own;
    // the player focuses on angle and pressure
    this.grinderSpeed = GRIND_SPEED;

    // Remove metal from both rails with their individual settings
    const penalty = heatPenalty(this.stoneHeat);
    const tol = this.targetProfile.tolerance;
    let onDefect = 0;          // for the audio: how much excess metal is under the stones
    let overgrinding = false;
    for (const rail of RAILS) {
      const grindX = stoneGrindX(this.stoneAngle[rail]);
      const depth = removalRatePerSec(this.stonePressure[rail]) * this.upgrades.removal * penalty * dt;
      const profile = this.track.getProfile(visualSegIndex, rail);

      // Before cutting: is this stone on a defect? (0 = clean rail, 1 = deep defect)
      const excess = profile.getDeviationAtX(grindX, this.targetProfile) - tol;
      onDefect += Math.max(0, Math.min(1, excess / 0.08)) / RAILS.length;

      profile.removeMetalAt(grindX, stoneContactWidth(this.stonePressure[rail]) * this.upgrades.width, depth);
      this.totalMetalRemoved += depth;

      // Over-grind: went past the target line at the stone centre
      const isOver = profile.getDeviationAtX(grindX, this.targetProfile) < -tol;
      if (isOver) overgrinding = true;
      if (isOver && this.overgrindCooldown <= 0) {
        this.overgrindCooldown = 1.0;
        if (sectionIndex >= 0) {
          this.segmentDamage[sectionIndex] = Math.max(
            this.segmentDamage[sectionIndex] || 0, profile.countOverground(this.targetProfile));
        }
        this.rendererFor(rail).flashBorder();
        this.camera.shake(0.06);
        if (this.audioReady) this.audio.playOvergrindAlarm();
      }
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
      const accuracy = sectionAccuracy(this.track, this.targetProfile, sectionIndex);
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
    eventBus.emit('grind-contact', { sectionIndex });
  }

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
      renderer.draw(profile, this.targetProfile);
    }
  }

  private completeSegment(sectionIndex: number, accuracy: number): void {
    const hadSlowOrder = this.segmentSlowOrder[sectionIndex];
    if (hadSlowOrder) this.slowSigns?.clear(sectionIndex); // board spins to green
    this.segmentCompleted[sectionIndex] = true;
    this.completedCount++;
    this.segmentSlowOrder[sectionIndex] = false;
    this.consecutiveCompleted++;

    // Star rating: accuracy, minus penalties for extra passes and over-grind damage
    const stars = sectionStars(accuracy, this.segmentPasses[sectionIndex] || 0, this.segmentDamage[sectionIndex] || 0);
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
    this.grindEffects.celebrate(track, sectionStart, sectionStart + GAME_SECTION_LENGTH);

    // Floating score popup
    this.floatingScore.showSegmentComplete(sectionIndex + 1, stars, sectionFt);
    if (this.consecutiveCompleted > 1) {
      setTimeout(() => this.floatingScore.showStreak(this.consecutiveCompleted), 400);
    }

    // SLOW ORDER LIFTED banner
    if (hadSlowOrder) {
      setTimeout(() => {
        this.floatingScore.show('SLOW ORDER LIFTED', '#44ff44',
          window.innerWidth / 2, window.innerHeight / 2 - 60);
        setTimeout(() => {
          this.floatingScore.show('TRACK SPEED 60 MPH', '#ffffff',
            window.innerWidth / 2, window.innerHeight / 2 - 30);
        }, 300);
      }, 600);
    }

    // Track map
    this.trackMap.updateSegment(sectionIndex, { completed: true, slowOrder: false });

    // Audio
    if (this.audioReady) {
      this.audio.playSegmentComplete();
    }

    // Screen shake for completion
    this.camera.shake(0.05);
  }

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
    this.setText(this.pressureValue, `${this.stonePressure.left.toFixed(0)}%`);
    this.setText(this.angleValueR, `${this.stoneAngle.right.toFixed(0)}°`);
    this.setText(this.pressureValueR, `${this.stonePressure.right.toFixed(0)}%`);

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
    document.body.classList.toggle('cinematic', on);
  }

  private handleInspectionPass(dt: number): void {
    if (!this.inspectionPass) return;

    this.inspectionTimer += dt;

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
      this.inspectionPass = false;
      setTimeout(() => this.showCompletionReport(), 500);
    }
  }

  private showCompletionReport(): void {
    const postJobReport = this.inspectionReport.computeJobReport(this.track, this.targetProfile);
    const elapsed = this.playTime; // excludes time spent paused
    const completedCount = this.completedCount;

    const rqiAfter = postJobReport.overallRQI;
    // RQI-based stars, minus one per delayed revenue train (never below 1)
    const stars = jobStars(rqiAfter, this.deadline.missedWindows);

    // Save personal best for this job (in the browser's localStorage)
    const { newBest } = this.currentJob
      ? recordResult(this.currentJob.id, { stars, rqi: rqiAfter, time: elapsed })
      : { newBest: false };

    // Career: get paid for the contract (more stars = more pay)
    const pay = this.currentJob ? jobPay(this.currentJob.basePay, stars) : 0;
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
    }).then(() => {
      // Return to job select for next contract
      this.startJobSelect();
    });
  }

  /** Show job selection and start a new job */
  private startJobSelect(): void {
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
    this.jobSelect.show().then((job) => {
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
    this.audio.setRegion(job.region);
    this.dayNight.snowCover = this.weather.snowCover;
    const groundMat = this.ground.material as THREE.MeshLambertMaterial;
    const groundMap = this.weather.snowCover > 0.5 ? this.snowGroundTexture : this.grassGroundTexture;
    if (groundMat.map !== groundMap) { groundMat.map = groundMap; groundMat.needsUpdate = true; }

    // Landmarks + level crossings first, so the scenery can keep clear of them
    const landmarks = new Landmarks(this.track, job.region);
    this.landmarks = landmarks;
    this.engine.scene.add(landmarks.group);

    // New environment (coastal routes keep the west side clear for the sea)
    const coast = job.scenery === 'coast';
    this.environment = new Environment(this.track, {
      clearSide: coast ? { side: -1, beyond: 7 } : undefined,
      blocked: (x, z) => landmarks.blocks(x, z),
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
    // Compile every shader for the new world now (in the background), so the
    // first spark / freight train / headlight doesn't stall the game mid-play
    this.engine.prewarm();
    // Grinder upgrades bought in the shop apply to this job
    this.upgrades = upgradeEffects(loadCareer().upgrades);

    // Compute pre-job report
    const preJobReport = this.inspectionReport.computeJobReport(this.track, this.targetProfile);
    this.preJobRQI = preJobReport.overallRQI;

    const startGame = () => {
      this.gameStarted = true;
      this.jobComplete = false;
      this.playTime = 0;
      this.deadline.reset();
    };

    // First job: skip report, go straight to guided gameplay
    if (this.guidedTutorial.isFirstJob()) {
      startGame();
    } else {
      // Subsequent jobs: show the inspection report
      this.inspectionReport.showPreJobReport(preJobReport).then(startGame);
    }
  }

}

