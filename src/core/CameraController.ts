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
