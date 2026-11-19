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
import { GuidedTutorial } from './ui/GuidedTutorial';
import { TrackMap } from './ui/TrackMap';
import { FloatingScore } from './ui/FloatingScore';
import { RadioDispatch } from './ui/RadioDispatch';
import { InspectionReport } from './ui/InspectionReport';
import { JobSelect, JOBS, type JobDefinition } from './ui/JobSelect';
import { eventBus } from './core/EventBus';
import { disposeObject3D } from './core/dispose';
import { CameraController } from './core/CameraController';
import { RevenueTrainDeadline } from './world/RevenueTrainDeadline';
import type { TargetProfile } from './types/rail';

export class Game {
  private engine: Engine;
  private input: InputManager;
  // track / environment / passingTrain are (re)built per job in buildWorld()
  private track!: RailTrack;
  private profileRenderer: ProfileRenderer;
  private environment!: Environment;
  private dayNight: DayNightCycle;
  private sparkSystem: SparkSystem;
  private audio: AudioManager;
  private trackMap: TrackMap;
  private floatingScore: FloatingScore;
  private passingTrain!: PassingTrain;
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
  private angleValueR!: HTMLElement;
  private pressureValueR!: HTMLElement;
  private jobComplete: boolean = false;
  private startTime: number = Date.now();

  // Rail grinder consist
  private grinder!: RailGrinder;
  // Dynamic grinding lights — one per grinding car
  private grindLights: THREE.PointLight[] = [];

  // Camera views, screen shake, inspection cinematic
  private camera: CameraController;

  // Revenue train countdown + "missed window" penalty
  private deadline: RevenueTrainDeadline;

  // Segment tracking
  private initialSectionAccuracy: number[] = []; // mean accuracy at job start, for progress bars
  private segmentCompleted: boolean[] = [];
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

  // Pre-allocated spark emit point pool (avoids 96 clones/frame)
  private _emitPool: Array<{ position: THREE.Vector3; forward: THREE.Vector3; right: THREE.Vector3 }> = [];

  private totalMetalRemoved: number = 0;

  // Audio initialized flag
  private audioReady: boolean = false;

  // Ground
  private ground!: THREE.Mesh;

  /** Number of scored game sections on the current track */
  private get sectionCount(): number { return this.track.sectionCount; }
  /** Total length of the current track spline, in metres */
  private get trackLength(): number { return this.track.totalLength; }

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

    // Floating scores
    this.floatingScore = new FloatingScore();

    // Grind contact visual effect
    this.grindContact = new GrindContact();
    this.engine.scene.add(this.grindContact.group);

    // Camera + revenue-train deadline
    this.camera = new CameraController(this.engine.camera);
    this.deadline = new RevenueTrainDeadline({
      trackMap: this.trackMap,
      floatingScore: this.floatingScore,
      audio: this.audio,
      isAudioReady: () => this.audioReady,
    });

    // Radio dispatch
    this.radioDispatch = new RadioDispatch();

    // Weather
    this.weather = new Weather();
    this.engine.scene.add(this.weather.rainGroup);

    // Inspection report, job selection, guided tutorial
    this.inspectionReport = new InspectionReport();
    this.jobSelect = new JobSelect();
    this.guidedTutorial = new GuidedTutorial();

    // Build the first job's world as the backdrop behind the job-select screen
    // (it gets rebuilt for whichever job the player actually picks)
    this.buildWorld(JOBS[0]);

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
      const viDist = vi * 5; // VISUAL_SEGMENT_LENGTH = 5
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

  /**
   * Accuracy of a whole section: the worst "within tolerance" fraction across
   * every visual segment in the section, on both rails. A section is only as
   * good as its worst stretch of rail.
   */
  private getSectionAccuracy(sec: number): number {
    let worst = 1;
    for (const vi of this.track.getSegmentsForSection(sec)) {
      for (const rail of ['left', 'right'] as const) {
        const acc = this.track.getProfile(vi, rail).compare(this.targetProfile).withinTolerance;
        if (acc < worst) worst = acc;
      }
    }
    return worst;
  }

  /** Worst average deviation across every visual segment in a section, both rails */
  private getSectionWorstDeviation(sec: number): number {
    let worst = 0;
    for (const vi of this.track.getSegmentsForSection(sec)) {
      for (const rail of ['left', 'right'] as const) {
        const dev = this.track.getProfile(vi, rail).compare(this.targetProfile).averageDeviation;
        if (dev > worst) worst = dev;
      }
    }
    return worst;
  }

  /** Only assign slow orders to the worst ~45% of sections based on defect severity */
  private assignSlowOrders(): void {
    // Compute severity per section
    const severities: { sec: number; sev: number }[] = [];
    for (let sec = 0; sec < this.sectionCount; sec++) {
      if (this.track.getSegmentsForSection(sec).length === 0) continue;
      severities.push({ sec, sev: this.getSectionWorstDeviation(sec) });
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
        defectSeverity: Math.min(1, this.getSectionWorstDeviation(sec) * 10),
        accuracy: this.getSectionAccuracy(sec),
        slowOrder: this.segmentSlowOrder[sec],
      });
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
    this.camera.update(dt, this.track, this.grinderPosition);
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
    const secEnd = secOffset + this.sectionCount * 20; // GAME_SECTION_LENGTH = 20
    this.trackMap.setGrinderPosition((this.grinderPosition - secOffset) / (secEnd - secOffset));
    // Find nearest unfinished section (clamp so lead-in/run-out still points somewhere sensible)
    const curSec = Math.max(0, Math.min(this.sectionCount - 1,
      Math.floor((this.grinderPosition - secOffset) / 20)));
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

    // Boost exposure when grinding at night/dusk for spark drama
    if ((this.dayNight.isNight || this.dayNight.isDusk) && this.isGrinding) {
      this.engine.renderer.toneMappingExposure += (1.6 - this.engine.renderer.toneMappingExposure) * 3 * dt;
    }

    // Revenue train deadline (paused during the guided tutorial)
    if (!this.guidedTutorial.active) {
      const grinderT = (this.grinderPosition - secOffset) / (secEnd - secOffset);
      this.deadline.update(dt, this.segmentCompleted.filter(c => c).length, grinderT);
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

  private handleGrinding(dt: number): void {
    const sectionIndex = this.track.getSectionIndex(this.grinderPosition);
    const visualSegIndex = this.track.getSegmentIndex(this.grinderPosition);

    this.isGrinding = this.input.isKeyDown(' ');

    // Stones cool off while lifted
    if (!this.isGrinding) {
      this.stoneHeat = Math.max(0, this.stoneHeat - 8 * dt);
    }
    this.overheatWarning = this.stoneHeat > 80;
    this.overgrindCooldown = Math.max(0, this.overgrindCooldown - dt);

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
        const ld = Math.max(0.1, Math.min(this.trackLength - 0.1, this.grinderPosition + lightOffsets[li]));
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

    // Heat builds with pressure, minus some passive cooling while grinding.
    // Net rate: ~0/s at 25% pressure, ~3/s at 50% (overheat in ~25s), ~9/s at 100% (~9s).
    const avgPressure = (this.stonePressure.left + this.stonePressure.right) / 2;
    const heatRate = avgPressure * 0.12 - 3;
    this.stoneHeat = Math.max(0, Math.min(100, this.stoneHeat + heatRate * dt));
    const heatPenalty = this.stoneHeat > 80 ? 0.5 : this.stoneHeat > 60 ? 0.8 : 1.0;

    // Grind both rails with their individual settings
    for (const rail of ['left', 'right'] as const) {
      const angle = this.stoneAngle[rail];
      const pressure = this.stonePressure[rail];
      const grindX = angle * 0.7;
      const contactWidth = 10 + (100 - pressure) * 0.08;
      // Metal removed per second: ~0.03mm at 50% pressure, ~0.05mm at 100%
      const depth = (0.012 + pressure * 0.0004) * heatPenalty * dt;

      const p = this.track.getProfile(visualSegIndex, rail);
      p.removeMetalAt(grindX, contactWidth, depth);
      // Mesh rebuild is throttled below (expensive ExtrudeGeometry)
      this.totalMetalRemoved += depth;

      // Check over-grind per rail
      const devAt = p.getDeviationAtX(grindX, this.targetProfile);
      if (devAt < -this.targetProfile.tolerance) {
        if (this.overgrindCooldown <= 0) {
          this.overgrindCooldown = 1.0;
          if (sectionIndex >= 0) {
            this.segmentDamage[sectionIndex] = Math.max(
              this.segmentDamage[sectionIndex] || 0,
              p.countOverground(this.targetProfile));
          }
          const renderer = rail === 'left' ? this.profileRenderer : this.profileRendererRight;
          renderer.flashBorder();
          this.camera.shake(0.06);
          if (this.audioReady) this.audio.playOvergrindAlarm();
        }
      }
    }

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

    // Section scoring only applies inside the scored sections (not lead-in / run-out)
    if (sectionIndex >= 0) {
      // Section completes only when EVERY 5m stretch of BOTH rails is 80%+ in tolerance
      const accuracy = this.getSectionAccuracy(sectionIndex);

      // Rust → polished steel visual and track-map fill, driven by how close the
      // section is to passing (not by time spent grinding — bad grinding doesn't count)
      const grindProgress = this.getSectionProgress(sectionIndex);
      for (const vi of this.track.getSegmentsForSection(sectionIndex)) {
        if (vi < this.track.leftSegments.length) {
          this.track.leftSegments[vi].setGrindProgress(grindProgress);
          this.track.rightSegments[vi].setGrindProgress(grindProgress);
        }
      }

      this.trackMap.updateSegment(sectionIndex, { grindProgress, accuracy, slowOrder: this.segmentSlowOrder[sectionIndex] });

      if (accuracy > 0.8 && !this.segmentCompleted[sectionIndex]) {
        this.completeSegment(sectionIndex, accuracy);
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
        const dist = Math.max(0.1, Math.min(this.trackLength - 0.1, this.grinderPosition + carOff + stoneZ));
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
      const ld = Math.max(0.1, Math.min(this.trackLength - 0.1, this.grinderPosition + lightOffsets[li]));
      const ltp = this.track.getTrackPoint(ld);
      this.grindLights[li].position.copy(ltp.position);
      this.grindLights[li].position.y += 2.5;
      this.grindLights[li].intensity = li === 0 ? 4 : (avgPressure / 50) * (1.5 + Math.random());
    }

    this.sparkSystem.setEmitPoints(emitPoints, avgPressure / 50);
    emitPoints.length = savedLen; // restore pool size
    this.grinder.setGrinding(true);

    // Contact glow at the center of the grinding section
    const grindCenterDist = Math.max(0.1, Math.min(this.trackLength - 0.1, this.grinderPosition + 6));
    const tp = this.track.getTrackPoint(grindCenterDist);
    this.grindContact.setActive(tp.position, avgPressure);
    this.camera.setShake(0.01 + (avgPressure / 100) * 0.02);
    if (this.audioReady) this.audio.startGrinding(avgPressure / 80);

    eventBus.emit('grind-contact', { sectionIndex });
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
    const sectionFt = Math.round((this.trackLength / this.sectionCount) * 3.281);
    this.trackRestoredFt += sectionFt;

    // Flash all visual segments in this section and show them fully polished
    const visualSegs = this.track.getSegmentsForSection(sectionIndex);
    for (const vi of visualSegs) {
      if (vi < this.track.leftSegments.length) {
        this.track.leftSegments[vi].setGrindProgress(1);
        this.track.rightSegments[vi].setGrindProgress(1);
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
    this.camera.shake(0.05);
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
    this.segmentsEl.textContent = `${completedSegs}/${this.sectionCount}`;
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
    const secEnd = this.track.sectionOffset + this.sectionCount * 20 + 30;
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
    const baseStars = rqiAfter >= 95 ? 5 : rqiAfter >= 85 ? 4 : rqiAfter >= 75 ? 3 : rqiAfter >= 60 ? 2 : 1;
    // Each delayed revenue train costs a star (never below 1)
    const stars = Math.max(1, baseStars - this.deadline.missedWindows);

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
    this.initialSectionAccuracy = [];
    for (let sec = 0; sec < this.sectionCount; sec++) {
      this.initialSectionAccuracy.push(this.getSectionMeanAccuracy(sec));
    }

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
    this.ground.position.set(30, -0.6, this.trackLength / 2);

    // Track map
    this.trackMap.init(this.sectionCount);
    this.updateTrackMapDefects();
  }

  /** Average "within tolerance" fraction across a section's visual segments, both rails */
  private getSectionMeanAccuracy(sec: number): number {
    let total = 0;
    let count = 0;
    for (const vi of this.track.getSegmentsForSection(sec)) {
      for (const rail of ['left', 'right'] as const) {
        total += this.track.getProfile(vi, rail).compare(this.targetProfile).withinTolerance;
        count++;
      }
    }
    return count > 0 ? total / count : 1;
  }

  /**
   * How far a section is from "done", 0..1, based on accuracy rather than time.
   * Uses the section's AVERAGE accuracy so the bar moves as you fix each stretch
   * (completion itself uses the WORST stretch — see getSectionAccuracy).
   * 0 = as bad as at job start; capped at 0.95 until the section actually completes.
   */
  private getSectionProgress(sec: number): number {
    if (this.segmentCompleted[sec]) return 1;
    const start = this.initialSectionAccuracy[sec] ?? 0;
    const now = this.getSectionMeanAccuracy(sec);
    if (start >= 0.8) return now >= 0.8 ? 0.95 : 0;
    return Math.max(0, Math.min(0.95, (now - start) / (0.8 - start)));
  }

  /** Tear down current job and rebuild for a new one */
  private rebuildForJob(job: JobDefinition): void {
    // Freeze gameplay until startGame() runs (the pre-job report may be showing)
    this.gameStarted = false;
    this.jobComplete = false;
    this.inspectionPass = false;
    this.isPaused = false;
    this.pauseMenu.style.display = 'none';

    // Clear any revenue-train countdown (and missed-window count) from the previous attempt
    this.deadline.reset();

    // Stop grinding effects that may still be running
    this.isGrinding = false;
    this.grinder.setGrinding(false);
    this.sparkSystem.stopEmitting();
    this.grindContact.setInactive();
    if (this.audioReady) this.audio.stopGrinding();

    this.buildWorld(job);

    // Compute pre-job report
    const preJobReport = this.inspectionReport.computeJobReport(this.track, this.targetProfile);
    this.preJobRQI = preJobReport.overallRQI;

    const startGame = () => {
      this.gameStarted = true;
      this.jobComplete = false;
      this.startTime = Date.now();
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

