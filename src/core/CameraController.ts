/**
 * CameraController - All camera behaviour for the game.
 *
 * - Five gameplay views (keys 1-5), smoothly blended with lerp
 * - Screen shake (call shake() from gameplay events)
 * - The cinematic orbit used during the end-of-job inspection pass
 *
 * Everything is positioned relative to the grinder's distance along the
 * track spline, using RailTrack.getTrackPoint().
 */

import * as THREE from 'three';
import type { RailTrack } from '../rail/RailTrack';

export type CameraAngle = 'chase' | 'side' | 'cab' | 'overview' | 'grind' | 'director';

/** The director's shots, cut between every few seconds (camera 6) */
type Shot = 'trackside' | 'drone' | 'wheels' | 'flyby' | 'high';
const SHOTS: Shot[] = ['trackside', 'drone', 'wheels', 'flyby', 'high'];
const SHOT_SECONDS = 6.5;

export class CameraController {
  angle: CameraAngle = 'chase';

  private camera: THREE.PerspectiveCamera;
  private smoothPos = new THREE.Vector3(-3, 5, -10);
  private smoothTarget = new THREE.Vector3(0, 1, 12);
  private shakeAmount = 0;

  // Pre-allocated so update() creates no garbage each frame
  private _pos = new THREE.Vector3();
  private _look = new THREE.Vector3();

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  /**
   * 0..1 scale on all camera motion effects (shake, punch). Set from the
   * "reduced motion" accessibility option.
   */
  motionScale = 1;
  private punchAmount = 0;

  /** Add screen shake. Uses the larger of the current and requested amount. */
  shake(amount: number): void {
    this.shakeAmount = Math.max(this.shakeAmount, amount * this.motionScale);
  }

  /**
   * Punch in: the camera darts `metres` toward what it's looking at and eases
   * back — makes a big moment (section complete) land.
   */
  punch(metres: number): void {
    this.punchAmount = Math.max(this.punchAmount, metres * this.motionScale);
  }

  /** Set a steady shake level (e.g. continuous rumble while grinding) */
  setShake(amount: number): void {
    this.shakeAmount = amount * this.motionScale;
  }

  /** Gameplay camera — call once per frame */
  update(dt: number, track: RailTrack, grinderPosition: number): void {
    const len = track.totalLength;
    const clamp = (d: number) => Math.max(0.1, Math.min(len - 0.1, d));
    const tp = track.getTrackPoint(clamp(grinderPosition));
    const pos = this._pos;
    const look = this._look;

    switch (this.angle) {
      case 'chase': {
        // Low 3/4 view from beside and behind the grinding cars, aimed at the
        // rail just ahead — so you can see the stones meeting the rail and the
        // sparks, instead of just the car roof.
        const camPt = track.getTrackPoint(clamp(grinderPosition - 16));
        const lookPt = track.getTrackPoint(clamp(grinderPosition + 10));
        pos.copy(camPt.position).addScaledVector(camPt.right, -7);
        pos.y += 4.2;
        look.copy(lookPt.position).addScaledVector(lookPt.right, -1.5);
        look.y += 0.2;
        break;
      }
      case 'side':
        pos.copy(tp.position).addScaledVector(tp.right, 10);
        pos.y += 3;
        look.copy(tp.position);
        look.y += 1;
        break;
      case 'cab': {
        const ahead = track.getTrackPoint(clamp(grinderPosition + 15));
        pos.copy(tp.position).addScaledVector(tp.forward, -7);
        pos.y += 3;
        look.copy(ahead.position);
        look.y += 0.5;
        break;
      }
      case 'overview': {
        const ahead = track.getTrackPoint(clamp(grinderPosition + 15));
        pos.copy(tp.position)
          .addScaledVector(tp.forward, -15)
          .addScaledVector(tp.right, -8);
        pos.y += 25;
        look.copy(ahead.position);
        break;
      }
      case 'director':
        if (this.directorShot(dt, track, grinderPosition, clamp, pos, look)) {
          // a cut: jump there instead of gliding
          this.smoothPos.copy(pos);
          this.smoothTarget.copy(look);
        }
        break;
      case 'grind': {
        const grindPt = track.getTrackPoint(clamp(grinderPosition + 2));
        pos.copy(grindPt.position).addScaledVector(grindPt.right, 2.5);
        pos.y += 0.8;
        look.copy(grindPt.position).addScaledVector(grindPt.forward, 1);
        break;
      }
    }

    const lerp = Math.min(1, 4 * dt);
    this.smoothPos.lerp(pos, lerp);
    this.smoothTarget.lerp(look, lerp);
    this.camera.position.copy(this.smoothPos);

    if (this.shakeAmount > 0.001) {
      this.camera.position.x += (Math.random() - 0.5) * this.shakeAmount;
      this.camera.position.y += (Math.random() - 0.5) * this.shakeAmount;
      this.shakeAmount *= 0.9; // decay
    }
    if (this.punchAmount > 0.01) {
      this._pos.subVectors(this.smoothTarget, this.camera.position).normalize();
      this.camera.position.addScaledVector(this._pos, this.punchAmount);
      this.punchAmount *= Math.exp(-7 * dt); // ease back out
    }

    this.camera.lookAt(this.smoothTarget);
  }

  // ---- Photo mode: free orbit around a point ----
  private orbitYaw = 0;
  private orbitPitch = 0.3;
  private orbitDist = 18;

  /** Start orbiting from wherever the camera is now, so entering photo mode doesn't jump */
  beginOrbit(target: THREE.Vector3): void {
    const offset = this._pos.copy(this.camera.position).sub(target);
    this.orbitDist = THREE.MathUtils.clamp(offset.length(), 3, 80);
    this.orbitPitch = THREE.MathUtils.clamp(Math.asin(offset.y / Math.max(0.001, offset.length())), 0.03, 1.45);
    this.orbitYaw = Math.atan2(offset.x, offset.z);
  }

  /**
   * Orbit camera for photo mode.
   * @param yawDelta / pitchDelta - radians to rotate this frame
   * @param zoomFactor - multiply distance (>1 = further away)
   */
  updateOrbit(target: THREE.Vector3, yawDelta: number, pitchDelta: number, zoomFactor: number): void {
    this.orbitYaw += yawDelta;
    this.orbitPitch = THREE.MathUtils.clamp(this.orbitPitch + pitchDelta, 0.03, 1.45);
    this.orbitDist = THREE.MathUtils.clamp(this.orbitDist * zoomFactor, 3, 80);
    const cp = Math.cos(this.orbitPitch);
    this.camera.position.set(
      target.x + Math.sin(this.orbitYaw) * cp * this.orbitDist,
      target.y + Math.sin(this.orbitPitch) * this.orbitDist,
      target.z + Math.cos(this.orbitYaw) * cp * this.orbitDist,
    );
    this.camera.lookAt(target);
    // Keep gameplay smoothing in sync so leaving photo mode glides back
    this.smoothPos.copy(this.camera.position);
    this.smoothTarget.copy(target);
  }

  // ---- Director: cinematic shots that cut every few seconds ----
  private shotIndex = -1;
  private shotTimer = 0;
  /** Fixed spot for shots where the camera stands still and the consist passes */
  private shotAnchor = 0;
  private shotSide = 1;

  /** @returns true on the frame of a cut */
  private directorShot(dt: number, track: RailTrack, g: number, clamp: (d: number) => number,
    pos: THREE.Vector3, look: THREE.Vector3): boolean {
    this.shotTimer -= dt;
    let cut = false;
    if (this.shotTimer <= 0 || this.shotIndex < 0) {
      this.shotIndex = (this.shotIndex + 1) % SHOTS.length;
      this.shotTimer = SHOT_SECONDS;
      this.shotAnchor = g + 45;
      this.shotSide = Math.random() < 0.5 ? -1 : 1;
      cut = true;
    }
    const t = 1 - this.shotTimer / SHOT_SECONDS; // 0..1 through the shot
    const tp = track.getTrackPoint(clamp(g));
    switch (SHOTS[this.shotIndex]) {
      case 'trackside': {
        // low, standing by the track ahead; the consist rolls past
        const a = track.getTrackPoint(clamp(this.shotAnchor));
        pos.copy(a.position).addScaledVector(a.right, this.shotSide * 5.5);
        pos.y += 0.9;
        const f = track.getTrackPoint(clamp(g + 30));
        look.copy(f.position);
        look.y += 1.6;
        break;
      }
      case 'drone': {
        // slow high orbit
        const ang = t * 1.4 + this.shotSide;
        pos.copy(tp.position).addScaledVector(tp.right, Math.cos(ang) * 22).addScaledVector(tp.forward, Math.sin(ang) * 22);
        pos.y += 14;
        look.copy(tp.position);
        look.y += 1;
        break;
      }
      case 'wheels': {
        // down at the stones, sliding along the consist
        const w = track.getTrackPoint(clamp(g + 2 + t * 18));
        pos.copy(w.position).addScaledVector(w.right, this.shotSide * 2.2);
        pos.y += 0.45;
        look.copy(w.position).addScaledVector(w.forward, -6);
        look.y += 0.3;
        break;
      }
      case 'flyby': {
        // sweep along the side, overtaking the consist
        const w = track.getTrackPoint(clamp(g - 40 + t * 120));
        pos.copy(w.position).addScaledVector(w.right, this.shotSide * 9);
        pos.y += 3.5;
        look.copy(tp.position);
        look.y += 1.5;
        break;
      }
      case 'high': {
        // the long view: rising up behind the consist
        const b = track.getTrackPoint(clamp(g - 60));
        pos.copy(b.position).addScaledVector(b.right, this.shotSide * 12);
        pos.y += 10 + t * 25;
        const f = track.getTrackPoint(clamp(g + 40));
        look.copy(f.position);
        break;
      }
    }
    return cut;
  }

  /**
   * End-of-job vista: crane up and back from the consist until the whole
   * restored line is in view. t: 0..1 through the shot.
   */
  updateVista(track: RailTrack, fromDist: number, toDist: number, consistDist: number, t: number): void {
    const len = track.totalLength;
    const clamp = (d: number) => Math.max(0.1, Math.min(len - 0.1, d));
    const e = t * t * (3 - 2 * t); // ease in-out
    const c = track.getTrackPoint(clamp(consistDist));
    // Look back down the line just ground (but not so far the fog hides it)
    const back = track.getTrackPoint(clamp(Math.max(fromDist, consistDist - 90)));
    void toDist;
    this._pos.copy(c.position).addScaledVector(c.forward, 14 + e * 22).addScaledVector(c.right, -6 - e * 18);
    this._pos.y += 3 + e * 24;
    this._look.copy(c.position).lerp(back.position, e * 0.8);
    this.camera.position.copy(this._pos);
    this.camera.lookAt(this._look);
    this.smoothPos.copy(this._pos);
    this.smoothTarget.copy(this._look);
  }

  /** Cinematic camera for the inspection pass: a slow low orbit around the grinder */
  updateInspection(track: RailTrack, grinderPosition: number, timer: number): void {
    const len = track.totalLength;
    const tp = track.getTrackPoint(Math.min(grinderPosition, len - 0.1));
    const ahead = track.getTrackPoint(Math.min(grinderPosition + 10, len - 1));

    const phase = timer * 0.3;
    const radius = 6;
    const camX = tp.position.x + Math.sin(phase) * radius + tp.right.x * Math.cos(phase) * radius;
    const camZ = tp.position.z + Math.cos(phase) * radius + tp.right.z * Math.cos(phase) * radius;

    this.camera.position.set(camX, 1.5 + Math.sin(timer * 0.5) * 0.5, camZ);
    this.camera.lookAt(ahead.position.x, 0.2, ahead.position.z);

    // Keep the smoothed state in sync so gameplay camera resumes without a jump
    this.smoothPos.copy(this.camera.position);
    this.smoothTarget.set(ahead.position.x, 0.2, ahead.position.z);
  }
}
