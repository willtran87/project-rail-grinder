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
import { RailTrack } from './rail/RailTrack';
import { RailProfile } from './rail/RailProfile';
import { ProfileRenderer } from './rail/ProfileRenderer';
import { Environment } from './world/Environment';
import { createGroundTexture } from './world/ProceduralTextures';
import { RailGrinder } from './world/RailGrinder';
import { DayNightCycle } from './world/DayNightCycle';
import { Weather } from './world/Weather';
import { SparkSystem } from './effects/SparkSystem';
import { GrindContact } from './effects/GrindContact';
import { AudioManager } from './audio/AudioManager';
import { PassingTrain } from './world/PassingTrain';
import { TutorialManager } from './ui/TutorialManager';
import { GuidedTutorial } from './ui/GuidedTutorial';
import { TrackMap } from './ui/TrackMap';
import { FloatingScore } from './ui/FloatingScore';
import { RadioDispatch } from './ui/RadioDispatch';
import { InspectionReport } from './ui/InspectionReport';
import { JobSelect, type JobDefinition } from './ui/JobSelect';
import { eventBus } from './core/EventBus';
import type { TargetProfile } from './types/rail';

let SEGMENT_COUNT = 15;
let TRACK_LENGTH = 300;

type CameraAngle = 'chase' | 'side' | 'cab' | 'overview' | 'grind';

export class Game {
  private engine: Engine;
  private input: InputManager;
  private track: RailTrack;
  private profileRenderer: ProfileRenderer;
  private environment: Environment;
  private dayNight: DayNightCycle;
  private sparkSystem: SparkSystem;
  private audio: AudioManager;
  private tutorial: TutorialManager;
  private trackMap: TrackMap;
  private floatingScore: FloatingScore;
  private passingTrain: PassingTrain;
  private grindContact: GrindContact;
  private radioDispatch: RadioDispatch;
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
  private deadlineBar!: HTMLElement;
  private deadlineTime!: HTMLElement;
  private angleValueR!: HTMLElement;
  private pressureValueR!: HTMLElement;
  private jobComplete: boolean = false;
  private startTime: number = Date.now();

  // Rail grinder consist
  private grinder!: RailGrinder;
  // Dynamic grinding lights — one per grinding car
  private grindLights: THREE.PointLight[] = [];

  // Camera
  private cameraAngle: CameraAngle = 'chase';
  private smoothCamPos: THREE.Vector3 = new THREE.Vector3(-3, 5, -10);
  private smoothCamTarget: THREE.Vector3 = new THREE.Vector3(0, 1, 12);
  private screenShake: number = 0;

  // Segment tracking
  private segmentGrindTime: Float64Array = new Float64Array(50);
  private segmentCompleted: boolean[] = [];
  private segmentPasses: number[] = [];
  private segmentDamage: number[] = [];
  private segmentSlowOrder: boolean[] = [];   // true = speed restricted
  private lastSectionIndex: number = -1;
  private consecutiveCompleted: number = 0;
  private trackRestoredFt: number = 0;
  private overgrindCooldown: number = 0;

  // Revenue train deadline
  private deadlineTimer: number = 0;
  private deadlineActive: boolean = false;
  private deadlineTotal: number = 0;
  private deadlineWarned: boolean = false;
  private sectionsAtDeadlineStart: number = 0;
  private revenueTrainProgress: number = 0; // 0 = at end of track, 1 = arrived at grinder

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
  private _camPos = new THREE.Vector3();
  private _camLook = new THREE.Vector3();

  // Throttle for expensive geometry rebuilds
  private _rebuildTimer: number = 0;
  private _rebuildInterval: number = 0.15; // rebuild meshes at most ~7x/sec

  // Pre-allocated spark emit point pool (avoids 96 clones/frame)
  private _emitPool: Array<{ position: THREE.Vector3; forward: THREE.Vector3; right: THREE.Vector3 }> = [];

  private totalMetalRemoved: number = 0;

  // Audio initialized flag
  private audioReady: boolean = false;

  // Ground
  private ground!: THREE.Mesh;


  constructor() {
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
    this.deadlineBar = document.getElementById('deadline-bar')!;
    this.deadlineTime = document.getElementById('deadline-time')!;
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

    // Track with gentle curves - more control points = smoother bends
    const trackPoints = [
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(0, 0, 20),
      new THREE.Vector3(0, 0, 50),
      new THREE.Vector3(0, 0, 80),
      new THREE.Vector3(1, 0, 100),
      new THREE.Vector3(3, 0, 115),
      new THREE.Vector3(7, 0, 130),
      new THREE.Vector3(12, 0, 145),
      new THREE.Vector3(18, 0, 158),
      new THREE.Vector3(25, 0, 170),
      new THREE.Vector3(32, 0, 180),
      new THREE.Vector3(40, 0, 190),
      new THREE.Vector3(47, 0, 200),
      new THREE.Vector3(52, 0, 212),
      new THREE.Vector3(55, 0, 225),
      new THREE.Vector3(55, 0, 240),
      new THREE.Vector3(55, 0, 255),
      new THREE.Vector3(53, 0, 270),
      new THREE.Vector3(50, 0, 282),
      new THREE.Vector3(46, 0, 295),
      new THREE.Vector3(42, 0, 308),
      new THREE.Vector3(38, 0, 320),
      new THREE.Vector3(35, 0, 335),
      new THREE.Vector3(34, 0, 350),
      new THREE.Vector3(34, 0, 400),
      new THREE.Vector3(34, 0, 450),
      new THREE.Vector3(34, 0, 500),
      new THREE.Vector3(34, 0, 550),
    ];
    this.track = new RailTrack(trackPoints);
    SEGMENT_COUNT = this.track.sectionCount; // game sections for scoring
    TRACK_LENGTH = this.track.totalLength;
    this.engine.scene.add(this.track.group);

    // Init segment tracking
    this.segmentCompleted = new Array(SEGMENT_COUNT).fill(false);
    this.segmentPasses = new Array(SEGMENT_COUNT).fill(0);
    this.segmentDamage = new Array(SEGMENT_COUNT).fill(0);
    this.segmentSlowOrder = new Array(SEGMENT_COUNT).fill(true);

    // Apply defects, set visual severity, assign selective slow orders
    this.applyInitialDefects();
    this.setSegmentDefectGlow();
    this.assignSlowOrders();

    // Environment — pass the track so scenery follows the spline
    this.environment = new Environment(this.track);
    this.engine.scene.add(this.environment.group);

    // Ground
    this.createGround();

    // Rail grinder consist
    this.grinder = new RailGrinder();
    this.engine.scene.add(this.grinder.group);
    // 4 efficient work lights that follow the grinder (headlight, 2 work area, 1 rear)
    for (let i = 0; i < 4; i++) {
      const light = new THREE.PointLight(0xff8833, 0, 8);
      this.engine.scene.add(light);
      this.grindLights.push(light);
    }

    // Day/night cycle with rich color palettes
    this.dayNight = new DayNightCycle(
      this.engine.scene,
      this.engine.directionalLight,
      this.engine.ambientLight,
      this.engine.renderer
    );
    this.dayNight.setGroundMesh(this.ground);

    // Spark system
    this.sparkSystem = new SparkSystem();
    this.engine.scene.add(this.sparkSystem.points);
    this.engine.scene.add(this.sparkSystem.sparkLight);

    // Audio
    this.audio = new AudioManager();

    // Track map
    this.trackMap = new TrackMap();
    this.trackMap.init(SEGMENT_COUNT);

    // Floating scores
    this.floatingScore = new FloatingScore();

    // Grind contact visual effect
    this.grindContact = new GrindContact();
    this.engine.scene.add(this.grindContact.group);

    // Passing trains — includes a visible adjacent track
    this.passingTrain = new PassingTrain();
    this.passingTrain.setTrack(this.track);
    this.engine.scene.add(this.passingTrain.group);
    this.engine.scene.add(this.passingTrain.adjacentTrack);

    // Radio dispatch
    this.radioDispatch = new RadioDispatch();

    // Weather
    this.weather = new Weather();
    this.engine.scene.add(this.weather.rainGroup);

    // Inspection report, job selection, guided tutorial
    this.inspectionReport = new InspectionReport();
    this.jobSelect = new JobSelect();
    this.guidedTutorial = new GuidedTutorial();

    // Initialize track map with defect severity
    this.updateTrackMapDefects();


    this.tutorial = new TutorialManager();

    // Show job selection screen first
    this.startJobSelect();

    // Register update loop
    this.engine.onUpdate(this.update.bind(this));

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

    this.profileRenderer.draw(this.track.getProfile(0), this.targetProfile);
    this.updateHUD();
  }

  /**
   * Generate multi-peak defects that require angle sweeping to fix.
   * Each section gets 2-4 distinct defect peaks at different lateral positions.
   * Later sections have more defects and tighter tolerance requirements.
   */
  private applyInitialDefects(): void {
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

    const offset = this.track.sectionOffset;
    for (let vi = 0; vi < totalVisual; vi++) {
      const viDist = vi * 5; // VISUAL_SEGMENT_LENGTH = 5
      const secIdx = this.track.getSectionIndex(viDist);
      // Skip visual segments in the lead-in zone (before first section)
      if (viDist < offset) continue;
      // Skip visual segments past the last section
      if (secIdx >= SEGMENT_COUNT) continue;
      const jobSeverity = this.currentJob ? this.currentJob.defectSeverity : 0.6;
      // First 2 sections are trivially easy for onboarding
      const easyMult = (this.isFirstJob && secIdx < 2) ? 0.15 : 1.0;
      const difficulty = (0.3 + (secIdx / SEGMENT_COUNT) * 0.7) * jobSeverity * easyMult;

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
    for (let sec = 0; sec < SEGMENT_COUNT; sec++) {
      const visSegs = this.track.getSegmentsForSection(sec);
      if (visSegs.length === 0) continue;
      const vi = visSegs[0];
      const devL = this.track.getProfile(vi, 'left').compare(this.targetProfile).averageDeviation;
      const devR = this.track.getProfile(vi, 'right').compare(this.targetProfile).averageDeviation;
      severities.push({ sec, sev: Math.max(devL, devR) });
    }

    // Sort by severity, worst first
    severities.sort((a, b) => b.sev - a.sev);

    // Only the top ~45% get slow orders
    const slowCount = Math.ceil(severities.length * 0.45);
    this.segmentSlowOrder = new Array(SEGMENT_COUNT).fill(false);
    for (let i = 0; i < slowCount; i++) {
      this.segmentSlowOrder[severities[i].sec] = true;
    }
  }

  private updateTrackMapDefects(): void {
    for (let sec = 0; sec < SEGMENT_COUNT; sec++) {
      const visualSegs = this.track.getSegmentsForSection(sec);
      if (visualSegs.length > 0) {
        const vi = visualSegs[0];
        const devL = this.track.getProfile(vi, 'left').compare(this.targetProfile);
        const devR = this.track.getProfile(vi, 'right').compare(this.targetProfile);
        // Use the worst of the two rails
        const worstDev = Math.max(devL.averageDeviation, devR.averageDeviation);
        const worstAcc = Math.min(devL.withinTolerance, devR.withinTolerance);
        this.trackMap.updateSegment(sec, {
          defectSeverity: Math.min(1, worstDev * 10),
          accuracy: worstAcc,
          slowOrder: this.segmentSlowOrder[sec],
        });
      }
    }
  }

  private createGround(): void {
    // Large ground plane centered on the track area (track goes x:0-55, z:-10 to 350)
    const groundGeo = new THREE.PlaneGeometry(800, 800);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x4a6a3a, roughness: 0.95, metalness: 0.0,
      map: createGroundTexture(),
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
    if (this.input.wasKeyPressed('r')) {
      window.location.reload();
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
      this.dayNight.update(dt);
      this.grinder.update(dt);
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
      sectionsCompleted: this.segmentCompleted.filter(c => c).length,
    });
    // Auto-move during early tutorial
    if (tutResult.autoMove && !this.isGrinding && this.grinderSpeed < 1.5) {
      this.grinderSpeed = 1.5;
    }

    this.handleGrinderMovement(dt);
    this.handleGrinding(dt);
    this.handleCamera(dt);
    this.dayNight.update(dt);
    this.sparkSystem.update(dt);
    this.grindContact.update(dt);
    this.grinder.update(dt);

    // Update rail segment animations (flash fade, etc.)
    for (let vi = 0; vi < this.track.segmentCount; vi++) {
      if (vi < this.track.leftSegments.length) {
        this.track.leftSegments[vi].update(dt);
        this.track.rightSegments[vi].update(dt);
      }
    }

    // Always update both profile displays for current visual segment
    if (!this.isGrinding) {
      const visIdx = this.track.getSegmentIndex(this.grinderPosition);
      const secIdx = this.track.getSectionIndex(this.grinderPosition);
      const dmg = this.segmentDamage[secIdx] || 0;
      const passes = this.segmentPasses[secIdx] || 0;

      for (const rail of ['left', 'right'] as const) {
        const prof = this.track.getProfile(visIdx, rail);
        const renderer = rail === 'left' ? this.profileRenderer : this.profileRendererRight;
        renderer.setWorstZones(prof.findWorstZones(this.targetProfile, 3));
        renderer.setSegmentInfo(dmg, passes);
        renderer.draw(prof, this.targetProfile);
      }
    }

    // Update audio
    if (this.audioReady) {
      this.audio.setDieselSpeed(this.grinderSpeed);
      // Rail condition affects wheel sound — completed sections are smooth
      const sec = this.track.getSectionIndex(this.grinderPosition);
      const railCondition = (sec >= 0 && sec < this.segmentCompleted.length && this.segmentCompleted[sec]) ? 1.0 : 0.0;
      this.audio.updateWheelSound(this.grinderSpeed, dt, railCondition);
    }

    // Passing trains
    this.passingTrain.update(dt, this.grinderPosition);

    // Radio dispatch
    this.radioDispatch.update(dt);

    // Track map + next target
    // Normalize grinder position to the section area (offset to end of last section)
    const secOffset = this.track.sectionOffset;
    const secEnd = secOffset + SEGMENT_COUNT * 20; // GAME_SECTION_LENGTH = 20
    this.trackMap.setGrinderPosition((this.grinderPosition - secOffset) / (secEnd - secOffset));
    // Find nearest unfinished section
    const curSec = this.track.getSectionIndex(this.grinderPosition);
    let nextTarget = -1;
    let bestDist = Infinity;
    for (let s = 0; s < SEGMENT_COUNT; s++) {
      if (!this.segmentCompleted[s]) {
        const dist = Math.abs(s - curSec);
        if (dist < bestDist) { bestDist = dist; nextTarget = s; }
      }
    }
    this.trackMap.setNextTarget(nextTarget);
    this.trackMap.draw();

    // Boost exposure when grinding at night/dusk for spark drama
    if ((this.dayNight.isNight || this.dayNight.isDusk) && this.isGrinding) {
      this.engine.renderer.toneMappingExposure += (1.6 - this.engine.renderer.toneMappingExposure) * 3 * dt;
    }

    // Revenue train deadline
    this.handleDeadline(dt);

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

  private handleGrinderMovement(dt: number): void {
    // Slow order enforcement: cap speed in damaged sections
    const currentSection = this.track.getSectionIndex(this.grinderPosition);
    const inSlowOrder = currentSection >= 0 && currentSection < this.segmentSlowOrder.length && this.segmentSlowOrder[currentSection];
    const slowOrderLimit = inSlowOrder ? 2.0 : 999; // ~4.5 mph in slow order zones

    // While grinding, auto-speed is handled in handleGrinding
    // While not grinding, player drives normally
    if (!this.isGrinding) {
      // SHIFT = fast-travel (3x speed) when not grinding
      const fastTravel = this.input.isKeyDown('shift');
      const speedMult = fastTravel ? 3.0 : 1.0;
      const maxSpeed = Math.min(10 * speedMult, slowOrderLimit * speedMult);
      const accel = 5 * speedMult, friction = 3;

      if (this.input.isKeyDown('w') || this.input.isKeyDown('arrowup')) {
        this.grinderSpeed = Math.min(maxSpeed, this.grinderSpeed + accel * dt);
      } else if (this.input.isKeyDown('s') || this.input.isKeyDown('arrowdown')) {
        this.grinderSpeed = Math.max(-maxSpeed / 2, this.grinderSpeed - accel * dt);
      } else {
        if (this.grinderSpeed > 0) this.grinderSpeed = Math.max(0, this.grinderSpeed - friction * dt);
        else if (this.grinderSpeed < 0) this.grinderSpeed = Math.min(0, this.grinderSpeed + friction * dt);
      }
    }

    this.grinderPosition += this.grinderSpeed * dt;
    // Clamp so entire consist stays on track (crew car at offset +67 is the longest)
    const maxPos = TRACK_LENGTH - 75;
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

    const clampDist = (d: number) => Math.max(0.1, Math.min(TRACK_LENGTH - 0.1, d));

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
    if (this.input.wasKeyPressed('1')) { this.cameraAngle = 'chase';}
    if (this.input.wasKeyPressed('2')) { this.cameraAngle = 'side';}
    if (this.input.wasKeyPressed('3')) { this.cameraAngle = 'cab';}
    if (this.input.wasKeyPressed('4')) { this.cameraAngle = 'overview';}
    if (this.input.wasKeyPressed('5')) { this.cameraAngle = 'grind';}
  }

  private handleGrinding(dt: number): void {
    const sectionIndex = this.track.getSectionIndex(this.grinderPosition);
    const visualSegIndex = this.track.getSegmentIndex(this.grinderPosition);

    // Heat cools when not grinding
    this.stoneHeat = Math.max(0, this.stoneHeat - 10 * dt);
    this.overheatWarning = this.stoneHeat > 80;

    this.isGrinding = this.input.isKeyDown(' ');

    // Always show stone aim position
    for (const rail of ['left', 'right'] as const) {
      const renderer = rail === 'left' ? this.profileRenderer : this.profileRendererRight;
      renderer.setStoneContact(this.stoneAngle[rail] * 0.7,
        10 + (100 - this.stonePressure[rail]) * 0.08,
        this.stonePressure[rail], true, this.isGrinding);
      renderer.setPreview(null);
    }

    if (!this.isGrinding) {
      this.grinder.setGrinding(false);
      this.sparkSystem.stopEmitting();
      this.grindContact.setInactive();
      // Keep work lights on even when not grinding (night operations need light)
      const lightOffsets = [-42, -6, 18, 67];
      for (let li = 0; li < this.grindLights.length; li++) {
        const ld = Math.max(0.1, Math.min(TRACK_LENGTH - 0.1, this.grinderPosition + lightOffsets[li]));
        const ltp = this.track.getTrackPoint(ld);
        this.grindLights[li].position.copy(ltp.position);
        this.grindLights[li].position.y += 2.5;
        this.grindLights[li].intensity = li === 0 ? 4 : 1.5; // steady when not grinding
      }
      this.audio.stopGrinding();
      return;
    }

    // AUTO-SPEED: while grinding, grinder moves forward at a steady grind speed
    // Player focuses on angle/pressure, not driving
    const GRIND_SPEED = 2.0; // m/s — steady pace
    this.grinderSpeed = GRIND_SPEED;

    // Heat builds with pressure
    const avgPressure = (this.stonePressure.left + this.stonePressure.right) / 2;
    this.stoneHeat = Math.min(100, this.stoneHeat + avgPressure * 0.12 * dt);
    const heatPenalty = this.stoneHeat > 80 ? 0.5 : this.stoneHeat > 60 ? 0.8 : 1.0;

    // Grind both rails with their individual settings
    for (const rail of ['left', 'right'] as const) {
      const angle = this.stoneAngle[rail];
      const pressure = this.stonePressure[rail];
      const grindX = angle * 0.7;
      const contactWidth = 10 + (100 - pressure) * 0.08;
      const depth = (0.005 + pressure * 0.0002) * heatPenalty * dt;

      const p = this.track.getProfile(visualSegIndex, rail);
      p.removeMetalAt(grindX, contactWidth, depth);
      // Mesh rebuild is throttled below (expensive ExtrudeGeometry)
      this.totalMetalRemoved += depth;

      // Check over-grind per rail
      const devAt = p.getDeviationAtX(grindX, this.targetProfile);
      if (devAt < -this.targetProfile.tolerance) {
        this.overgrindCooldown = Math.max(0, this.overgrindCooldown - dt);
        if (this.overgrindCooldown <= 0) {
          this.overgrindCooldown = 1.0;
          this.segmentDamage[sectionIndex] = Math.max(
            this.segmentDamage[sectionIndex] || 0,
            p.countOverground(this.targetProfile));
          const renderer = rail === 'left' ? this.profileRenderer : this.profileRendererRight;
          renderer.flashBorder();
          this.screenShake = 0.06;
          if (this.audioReady) this.audio.playOvergrindAlarm();
        }
      }
    }

    this.segmentGrindTime[sectionIndex] += dt;

    // Track pass count
    if (sectionIndex !== this.lastSectionIndex) {
      if (this.lastSectionIndex >= 0) this.segmentPasses[this.lastSectionIndex]++;
      this.lastSectionIndex = sectionIndex;
    }

    // Throttled mesh rebuild (ExtrudeGeometry is expensive — ~7x/sec instead of 60)
    this._rebuildTimer += dt;
    if (this._rebuildTimer >= this._rebuildInterval) {
      this._rebuildTimer = 0;
      this.track.rebuildSegment(visualSegIndex, 'left');
      this.track.rebuildSegment(visualSegIndex, 'right');
    }

    const grindProgress = Math.min(1, this.segmentGrindTime[sectionIndex] / 5);
    const visualSegs = this.track.getSegmentsForSection(sectionIndex);
    for (const vi of visualSegs) {
      if (vi < this.track.leftSegments.length) {
        this.track.leftSegments[vi].setGrindProgress(grindProgress);
        this.track.rightSegments[vi].setGrindProgress(grindProgress);
      }
    }

    // Update both profile displays
    const dmg = this.segmentDamage[sectionIndex] || 0;
    const passes = this.segmentPasses[sectionIndex] || 0;
    for (const rail of ['left', 'right'] as const) {
      const profile = this.track.getProfile(visualSegIndex, rail);
      const renderer = rail === 'left' ? this.profileRenderer : this.profileRendererRight;
      renderer.setWorstZones(profile.findWorstZones(this.targetProfile, 3));
      renderer.setSegmentInfo(dmg, passes);
      renderer.draw(profile, this.targetProfile);
    }

    // Check section completion
    const profL = this.track.getProfile(visualSegIndex, 'left');
    const profR = this.track.getProfile(visualSegIndex, 'right');
    const accuracy = Math.min(
      profL.compare(this.targetProfile).withinTolerance,
      profR.compare(this.targetProfile).withinTolerance
    );
    this.trackMap.updateSegment(sectionIndex, { grindProgress, accuracy, slowOrder: this.segmentSlowOrder[sectionIndex] });

    if (accuracy > 0.8 && !this.segmentCompleted[sectionIndex]) {
      this.completeSegment(sectionIndex, accuracy);
    }

    // SPARKS + LIGHTS — use pre-allocated emit point pool (avoids 96 clones/frame)
    const grindCarPositions = [-12, 0, 12, 24];
    // Ensure pool is large enough
    while (this._emitPool.length < 32) {
      this._emitPool.push({ position: new THREE.Vector3(), forward: new THREE.Vector3(), right: new THREE.Vector3() });
    }
    let epIdx = 0;
    for (const carOff of grindCarPositions) {
      for (let si = 0; si < 8; si++) {
        const stoneZ = -4.5 + si * 1.3;
        const dist = Math.max(0.1, Math.min(TRACK_LENGTH - 0.1, this.grinderPosition + carOff + stoneZ));
        const stoneTp = this.track.getTrackPoint(dist);
        const ep = this._emitPool[epIdx++];
        ep.position.copy(stoneTp.position);
        ep.forward.copy(stoneTp.forward);
        ep.right.copy(stoneTp.right);
      }
    }
    // Pass the pool with the count — SparkSystem reads emitPoints.length
    const emitPoints = this._emitPool;
    // Temporarily trim to active count for the spark system
    const savedLen = emitPoints.length;
    emitPoints.length = epIdx;

    // 4 efficient work lights: headlight, front grind, rear grind, tail
    const lightOffsets = [-42, -6, 18, 67];
    for (let li = 0; li < this.grindLights.length; li++) {
      const ld = Math.max(0.1, Math.min(TRACK_LENGTH - 0.1, this.grinderPosition + lightOffsets[li]));
      const ltp = this.track.getTrackPoint(ld);
      this.grindLights[li].position.copy(ltp.position);
      this.grindLights[li].position.y += 2.5;
      this.grindLights[li].intensity = li === 0 ? 4 : (avgPressure / 50) * (1.5 + Math.random());
    }

    this.sparkSystem.setEmitPoints(emitPoints, avgPressure / 50);
    emitPoints.length = savedLen; // restore pool size
    this.grinder.setGrinding(true);

    // Contact glow at the center of the grinding section
    const grindCenterDist = Math.max(0.1, Math.min(TRACK_LENGTH - 0.1, this.grinderPosition + 6));
    const tp = this.track.getTrackPoint(grindCenterDist);
    this.grindContact.setActive(tp.position, avgPressure);
    this.screenShake = 0.01 + (avgPressure / 100) * 0.02;
    if (this.audioReady) this.audio.startGrinding(avgPressure / 80);

    eventBus.emit('grind-contact', { sectionIndex });
    this.tutorial.notifyEvent('grind-contact');
  }

  private handleDeadline(dt: number): void {
    // Don't run deadlines during tutorial
    if (this.guidedTutorial.active) return;

    if (!this.deadlineActive) {
      this.deadlineTimer += dt;
      this.trackMap.setRevenueTrainPosition(-1); // hide train indicator
      if (this.deadlineTimer > 30) {
        this.deadlineActive = true;
        this.deadlineTotal = 120 + Math.random() * 120; // 2-4 minute window
        this.deadlineTimer = this.deadlineTotal;
        this.deadlineWarned = false;
        this.revenueTrainProgress = 0;
        this.sectionsAtDeadlineStart = this.segmentCompleted.filter(c => c).length;
        this.deadlineBar.style.display = 'flex';
        if (this.audioReady) this.audio.playDing();
      }
      return;
    }

    this.deadlineTimer -= dt;
    const remaining = Math.max(0, this.deadlineTimer);
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);
    this.deadlineTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Animate revenue train position on the track map
    // Train starts at the far end (1.0) and moves toward the grinder position
    this.revenueTrainProgress = 1 - (remaining / this.deadlineTotal);
    const secOff = this.track.sectionOffset;
    const secE = secOff + SEGMENT_COUNT * 20;
    const grinderT = (this.grinderPosition - secOff) / (secE - secOff);
    // Train position: starts at end of track, moves toward grinder
    const trainT = 1.0 - this.revenueTrainProgress * (1.0 - grinderT);
    this.trackMap.setRevenueTrainPosition(trainT);

    // Color based on urgency
    if (remaining < 30) {
      this.deadlineTime.style.color = 'var(--ui-red)';
      this.deadlineBar.style.borderColor = 'rgba(255,50,50,0.5)';
    } else if (remaining < 60) {
      this.deadlineTime.style.color = 'var(--ui-accent)';
      this.deadlineBar.style.borderColor = 'rgba(255,100,0,0.3)';
    } else {
      this.deadlineTime.style.color = 'var(--ui-accent)';
      this.deadlineBar.style.borderColor = 'rgba(255,100,0,0.2)';
    }

    // Warning at 30 seconds — train horn sound
    if (remaining < 30 && !this.deadlineWarned) {
      this.deadlineWarned = true;
      if (this.audioReady) this.audio.playOvergrindAlarm();
    }

    // Train arrives!
    if (remaining <= 0) {
      this.deadlineActive = false;
      this.deadlineTimer = 0;
      this.deadlineBar.style.display = 'none';
      this.trackMap.setRevenueTrainPosition(-1);

      const completed = this.segmentCompleted.filter(c => c).length - this.sectionsAtDeadlineStart;
      if (completed > 0) {
        this.floatingScore.show(`${completed} sections cleared!`, '#44ff44');
      } else {
        this.floatingScore.show('TRAIN PASSED — NO SECTIONS CLEARED', '#ff4444');
      }

      if (this.audioReady) this.audio.playSegmentComplete();
    }
  }

  private completeSegment(sectionIndex: number, accuracy: number): void {
    const hadSlowOrder = this.segmentSlowOrder[sectionIndex];
    this.segmentCompleted[sectionIndex] = true;
    this.segmentSlowOrder[sectionIndex] = false;
    this.consecutiveCompleted++;

    // Star rating factors in efficiency (fewer passes = better)
    const passes = this.segmentPasses[sectionIndex] || 1;
    const damage = this.segmentDamage[sectionIndex] || 0;
    const efficiency = accuracy / (1 + passes * 0.12 + damage * 0.05);
    const stars = efficiency > 0.8 ? 3 : efficiency > 0.6 ? 2 : 1;
    // Track restored: each section is ~20m = 65ft of rail returned to full speed
    const sectionFt = Math.round((TRACK_LENGTH / SEGMENT_COUNT) * 3.281);
    this.trackRestoredFt += sectionFt;

    // Flash all visual segments in this section
    const visualSegs = this.track.getSegmentsForSection(sectionIndex);
    for (const vi of visualSegs) {
      if (vi < this.track.leftSegments.length) {
        this.track.leftSegments[vi].flashComplete();
        this.track.rightSegments[vi].flashComplete();
      }
    }

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
    this.screenShake = 0.05;
  }

  private handleCamera(dt: number): void {
    const cam = this.engine.camera;
    const lerpSpeed = 4 * dt;

    const tp = this.track.getTrackPoint(this.grinderPosition);
    const tpAhead = this.track.getTrackPoint(Math.min(this.grinderPosition + 15, TRACK_LENGTH - 1));

    let targetPos: THREE.Vector3;
    let targetLook: THREE.Vector3;

    switch (this.cameraAngle) {
      case 'chase':
        targetPos = this._camPos.copy(tp.position)
          .addScaledVector(tp.forward, -12)
          .addScaledVector(tp.right, -3);
        targetPos.y += 5;
        targetLook = this._camLook.copy(tpAhead.position);
        targetLook.y += 1;
        break;
      case 'side':
        targetPos = this._camPos.copy(tp.position)
          .addScaledVector(tp.right, 10);
        targetPos.y += 3;
        targetLook = this._camLook.copy(tp.position);
        targetLook.y += 1;
        break;
      case 'cab':
        targetPos = this._camPos.copy(tp.position)
          .addScaledVector(tp.forward, -7);
        targetPos.y += 3;
        targetLook = this._camLook.copy(tpAhead.position);
        targetLook.y += 0.5;
        break;
      case 'overview':
        targetPos = this._camPos.copy(tp.position)
          .addScaledVector(tp.forward, -15)
          .addScaledVector(tp.right, -8);
        targetPos.y += 25;
        targetLook = this._camLook.copy(tpAhead.position);
        break;

      case 'grind': {
        const grindPt = this.track.getTrackPoint(
          Math.max(0.1, Math.min(TRACK_LENGTH - 0.1, this.grinderPosition + 2))
        );
        targetPos = this._camPos.copy(grindPt.position)
          .addScaledVector(grindPt.right, 2.5);
        targetPos.y += 0.8;
        targetLook = this._camLook.copy(grindPt.position)
          .addScaledVector(grindPt.forward, 1);
        break;
      }
    }

    this.smoothCamPos.lerp(targetPos!, lerpSpeed);
    this.smoothCamTarget.lerp(targetLook!, lerpSpeed);

    cam.position.copy(this.smoothCamPos);

    // Screen shake
    if (this.screenShake > 0.001) {
      cam.position.x += (Math.random() - 0.5) * this.screenShake;
      cam.position.y += (Math.random() - 0.5) * this.screenShake;
      this.screenShake *= 0.9; // decay
    }

    cam.lookAt(this.smoothCamTarget);
  }


  private updateHUD(): void {
    const visIdx = this.track.getSegmentIndex(this.grinderPosition);
    const profL = this.track.getProfile(visIdx, 'left');
    const profR = this.track.getProfile(visIdx, 'right');
    const accL = profL.compare(this.targetProfile).withinTolerance;
    const accR = profR.compare(this.targetProfile).withinTolerance;
    const accuracy = (Math.min(accL, accR) * 100).toFixed(0);
    const completedSegs = this.segmentCompleted.filter(c => c).length;

    // Compact progress display (cached elements)
    this.segmentsEl.textContent = `${completedSegs}/${SEGMENT_COUNT}`;
    this.accuracyEl.textContent = `${accuracy}%`;
    this.accuracyEl.style.color = Number(accuracy) > 80 ? 'var(--ui-green)' :
      Number(accuracy) > 50 ? 'var(--ui-accent)' : 'var(--ui-red)';
  }

  private updateStonePanel(): void {
    // Always show both rails
    this.angleValue.textContent = `${this.stoneAngle.left.toFixed(0)}°`;
    this.pressureValue.textContent = `${this.stonePressure.left.toFixed(0)}%`;
    this.angleValueR.textContent = `${this.stoneAngle.right.toFixed(0)}°`;
    this.pressureValueR.textContent = `${this.stonePressure.right.toFixed(0)}%`;

    const speedMph = Math.abs(this.grinderSpeed * 2.237);
    this.speedValue.textContent = speedMph.toFixed(1);

    this.heatValue.textContent = `${this.stoneHeat.toFixed(0)}%`;
    this.heatFill.style.height = `${this.stoneHeat}%`;
    this.heatFill.style.background = this.stoneHeat > 80 ? 'var(--ui-red)' :
      this.stoneHeat > 60 ? 'var(--ui-accent)' : 'var(--ui-green)';

    // Grind status (cached elements)
    if (this.isGrinding) {
      this.grindDotEl.className = this.overheatWarning ? 'dot red' : 'dot orange';
      this.grindStatusEl.textContent = this.overheatWarning ? 'OVERHEAT' : 'GRINDING';
    } else {
      this.grindDotEl.className = 'dot green';
      this.grindStatusEl.textContent = 'DRIVING';
    }

    // Both rails always active
    this.leftRailLabel.style.color = 'var(--ui-accent)';
    this.rightRailLabel.style.color = 'var(--ui-accent)';
    this.leftRailLabel.style.fontWeight = '700';
    this.rightRailLabel.style.fontWeight = '700';
  }

  private checkJobComplete(): void {
    if (this.jobComplete) return;
    const completedCount = this.segmentCompleted.filter(c => c).length;
    if (completedCount >= SEGMENT_COUNT) {
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
    // Hide deadline if active
    this.deadlineBar.style.display = 'none';
    this.deadlineActive = false;
  }

  private handleInspectionPass(dt: number): void {
    if (!this.inspectionPass) return;

    this.inspectionTimer += dt;

    // Fast drive through the section area
    this.grinderSpeed = 25;
    this.grinderPosition += this.grinderSpeed * dt;

    // Cinematic low-angle side camera tracking the gleaming rails
    const cam = this.engine.camera;
    const tp = this.track.getTrackPoint(this.grinderPosition);
    const tpAhead = this.track.getTrackPoint(Math.min(this.grinderPosition + 10, TRACK_LENGTH - 1));

    // Sweeping camera that slowly rotates around the grinder
    const phase = this.inspectionTimer * 0.3;
    const radius = 6;
    const camX = tp.position.x + Math.sin(phase) * radius + tp.right.x * Math.cos(phase) * radius;
    const camZ = tp.position.z + Math.cos(phase) * radius + tp.right.z * Math.cos(phase) * radius;

    cam.position.set(camX, 1.5 + Math.sin(this.inspectionTimer * 0.5) * 0.5, camZ);
    cam.lookAt(tpAhead.position.x, 0.2, tpAhead.position.z);

    // Update grinder car positions
    const clampDist = (d: number) => Math.max(0.1, Math.min(TRACK_LENGTH - 0.1, d));
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
    const secEnd = this.track.sectionOffset + SEGMENT_COUNT * 20 + 30;
    if (this.grinderPosition > secEnd) {
      this.inspectionPass = false;
      setTimeout(() => this.showCompletionReport(), 500);
    }
  }

  private showCompletionReport(): void {
    const postJobReport = this.inspectionReport.computeJobReport(this.track, this.targetProfile);
    const elapsed = (Date.now() - this.startTime) / 1000;
    const completedCount = this.segmentCompleted.filter(c => c).length;

    const rqiAfter = postJobReport.overallRQI;
    const stars = rqiAfter >= 95 ? 5 : rqiAfter >= 85 ? 4 : rqiAfter >= 75 ? 3 : rqiAfter >= 60 ? 2 : 1;

    this.inspectionReport.showCompletionReport({
      ...postJobReport,
      sectionsCompleted: completedCount,
      trackRestoredFt: this.trackRestoredFt,
      elapsedTime: elapsed,
      metalRemoved: this.totalMetalRemoved,
      stars,
      rqiBefore: this.preJobRQI,
      rqiAfter,
    }).then(() => {
      // Return to job select for next contract
      this.startJobSelect();
    });
  }

  /** Show job selection and start a new job */
  private startJobSelect(): void {
    this.gameStarted = false;
    this.jobComplete = false;
    this.guidedTutorial.setReplay();
    this.isFirstJob = false;
    this.isPaused = false;
    this.pauseMenu.style.display = 'none';
    this.jobSelect.show().then((job) => {
      this.currentJob = job;
      this.rebuildForJob(job);
    });
  }

  /** Tear down current job and rebuild for a new one */
  private rebuildForJob(job: JobDefinition): void {
    // Remove and dispose old track, environment, and passing train
    if (this.track) {
      this.engine.scene.remove(this.track.group);
      this.track.dispose();
    }
    if (this.environment) {
      this.engine.scene.remove(this.environment.group);
    }
    if (this.passingTrain) {
      this.engine.scene.remove(this.passingTrain.group);
      this.engine.scene.remove(this.passingTrain.adjacentTrack);
    }

    // Build new track from job definition
    this.track = new RailTrack(job.trackPoints, undefined, job.sections, 50);
    SEGMENT_COUNT = this.track.sectionCount;
    TRACK_LENGTH = this.track.totalLength;
    this.engine.scene.add(this.track.group);

    // Reset segment tracking
    this.segmentCompleted = new Array(SEGMENT_COUNT).fill(false);
    this.segmentPasses = new Array(SEGMENT_COUNT).fill(0);
    this.segmentDamage = new Array(SEGMENT_COUNT).fill(0);
    this.segmentSlowOrder = new Array(SEGMENT_COUNT).fill(true);
    this.segmentGrindTime = new Float64Array(50);
    this.totalMetalRemoved = 0;
    this.trackRestoredFt = 0;
    this.grinderPosition = 50;
    this.grinderSpeed = 0;
    this.lastSectionIndex = -1;
    this.consecutiveCompleted = 0;
    this.stoneAngle = { left: 0, right: 0 };
    this.stonePressure = { left: 50, right: 50 };
    this.stoneHeat = 0;

    // Apply defects with job severity
    this.applyInitialDefects();
    this.setSegmentDefectGlow();

    // New environment
    this.environment = new Environment(this.track);
    this.engine.scene.add(this.environment.group);

    // New passing train
    this.passingTrain = new PassingTrain();
    this.passingTrain.setTrack(this.track);
    this.engine.scene.add(this.passingTrain.group);
    this.engine.scene.add(this.passingTrain.adjacentTrack);

    // Set time of day from job
    const times = ['dawn', 'day', 'dusk', 'night'];
    this.dayNight.setTime(times[job.timeOfDay] || 'day');

    // Update ground position to cover new track
    this.ground.position.set(30, -0.6, TRACK_LENGTH / 2);

    // Track map
    this.trackMap.init(SEGMENT_COUNT);
    this.updateTrackMapDefects();

    // Compute pre-job report
    const preJobReport = this.inspectionReport.computeJobReport(this.track, this.targetProfile);
    this.preJobRQI = preJobReport.overallRQI;

    const startGame = () => {
      this.gameStarted = true;
      this.jobComplete = false;
      this.startTime = Date.now();
      this.deadlineTimer = 0;
      this.deadlineActive = false;
      this.tutorial = new TutorialManager();
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

