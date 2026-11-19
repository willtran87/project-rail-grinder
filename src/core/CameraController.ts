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

export type CameraAngle = 'chase' | 'side' | 'cab' | 'overview' | 'grind';

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

  /** Add screen shake. Uses the larger of the current and requested amount. */
  shake(amount: number): void {
    this.shakeAmount = Math.max(this.shakeAmount, amount);
  }

  /** Set a steady shake level (e.g. continuous rumble while grinding) */
  setShake(amount: number): void {
    this.shakeAmount = amount;
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
