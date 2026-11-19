/**
 * PhotoMode - Freeze the action, hide the HUD and frame a shot.
 *
 * Controls (shown on screen while active):
 *   drag mouse / arrow keys  orbit the camera
 *   mouse wheel / W S        zoom in and out
 *   A / D                    slide along the track
 *   N / P                    time of day / rain (handled by Game)
 *   K                        save a PNG
 *   F or ESC                 exit
 *
 * Game logic is paused; sparks, dust, sky and weather keep animating so
 * the scene stays alive.
 */

import * as THREE from 'three';
import type { InputManager } from '../core/InputManager';
import type { CameraController } from '../core/CameraController';
import type { Engine } from '../core/Engine';
import type { RailTrack } from '../rail/RailTrack';

const ORBIT_KEY_SPEED = 1.5;   // radians per second with arrow keys
const MOUSE_SPEED = 0.006;     // radians per pixel dragged
const SLIDE_SPEED = 12;        // metres per second along the track with A/D

export class PhotoMode {
  active = false;
  private hint: HTMLElement;
  private focusDist = 0;       // distance along the track we're looking at
  private target = new THREE.Vector3();

  constructor(
    private engine: Engine,
    private camera: CameraController,
    private input: InputManager,
  ) {
    this.hint = document.createElement('div');
    this.hint.id = 'photo-hint';
    this.hint.style.cssText = `
      position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%);
      z-index: 40; pointer-events: none; display: none;
      font-family: var(--ui-mono, monospace); font-size: 11px; color: #ddd;
      background: rgba(10,12,18,0.75); border: 1px solid rgba(255,255,255,0.12);
      border-radius: 6px; padding: 6px 14px; white-space: nowrap;
    `;
    this.hint.innerHTML = `<span style="color:#e8a020">PHOTO MODE</span> &nbsp;
      drag / arrows: orbit &nbsp;·&nbsp; wheel / W S: zoom &nbsp;·&nbsp; A D: slide &nbsp;·&nbsp;
      N: time &nbsp;·&nbsp; P: rain &nbsp;·&nbsp; <span style="color:#e8a020">K: save</span> &nbsp;·&nbsp; F: exit`;
    document.body.appendChild(this.hint);
  }

  /** Enter/leave photo mode. `grinderDist` = where the grinder is along the track. */
  setActive(on: boolean, track: RailTrack, grinderDist: number): void {
    this.active = on;
    document.body.classList.toggle('photo-mode', on);
    this.hint.style.display = on ? 'block' : 'none';
    if (on) {
      this.focusDist = grinderDist;
      this.updateTarget(track);
      this.camera.beginOrbit(this.target);
    }
  }

  /** Per-frame camera control; returns the point being looked at */
  update(dt: number, track: RailTrack): THREE.Vector3 {
    const inp = this.input;
    let yaw = 0, pitch = 0, zoom = 1;

    if (inp.mouseDown) {
      yaw -= inp.mouseDeltaX * MOUSE_SPEED;
      pitch += inp.mouseDeltaY * MOUSE_SPEED;
    }
    if (inp.isKeyDown('arrowleft')) yaw -= ORBIT_KEY_SPEED * dt;
    if (inp.isKeyDown('arrowright')) yaw += ORBIT_KEY_SPEED * dt;
    if (inp.isKeyDown('arrowup')) pitch += ORBIT_KEY_SPEED * dt;
    if (inp.isKeyDown('arrowdown')) pitch -= ORBIT_KEY_SPEED * dt;
    if (inp.scrollDelta) zoom *= 1 + inp.scrollDelta * 0.001;
    if (inp.isKeyDown('w')) zoom *= 1 - dt;
    if (inp.isKeyDown('s')) zoom *= 1 + dt;
    if (inp.isKeyDown('a')) this.focusDist -= SLIDE_SPEED * dt;
    if (inp.isKeyDown('d')) this.focusDist += SLIDE_SPEED * dt;
    this.focusDist = Math.max(1, Math.min(track.totalLength - 1, this.focusDist));

    this.updateTarget(track);
    this.camera.updateOrbit(this.target, yaw, pitch, zoom);

    if (inp.wasKeyPressed('k')) this.savePhoto();
    return this.target;
  }

  private updateTarget(track: RailTrack): void {
    this.target.copy(track.getTrackPoint(this.focusDist).position);
    this.target.y += 1.2; // look at the train body, not the ground
  }

  /** Grab the next frame (HUD-free) and download it as a PNG */
  private async savePhoto(): Promise<void> {
    this.hint.style.display = 'none'; // the hint is HTML, not in the canvas — but hide anyway for clarity
    const blob = await this.engine.captureFrame();
    if (this.active) this.hint.style.display = 'block';
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    a.href = url;
    a.download = `staying-on-track-${stamp}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
