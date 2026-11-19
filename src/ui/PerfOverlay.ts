/**
 * PerfOverlay - A tiny FPS / frame-time readout for checking performance.
 *
 * Toggle with the backtick key (`). Shows average FPS, average frame time,
 * and the worst frame in the last half-second (spikes = visible stutter).
 * The on/off choice is remembered.
 */

import { loadJSON, saveJSON } from '../core/storage';

const SETTING_KEY = 'perf-overlay';
const SAMPLE_WINDOW = 0.5; // seconds between readout updates

export class PerfOverlay {
  private el: HTMLElement;
  private visible: boolean;
  private elapsed = 0;
  private frames = 0;
  private worst = 0;

  constructor() {
    this.el = document.createElement('div');
    this.el.id = 'perf-overlay';
    this.el.style.cssText = `
      position: absolute; top: 52px; left: 16px; z-index: 40;
      font-family: monospace; font-size: 11px; color: #9f9;
      background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 4px;
      pointer-events: none; white-space: pre;
    `;
    document.body.appendChild(this.el);
    this.visible = loadJSON<boolean>(SETTING_KEY, false);
    this.el.style.display = this.visible ? 'block' : 'none';
    this.el.textContent = '-- FPS';
  }

  toggle(): void {
    this.visible = !this.visible;
    this.el.style.display = this.visible ? 'block' : 'none';
    saveJSON(SETTING_KEY, this.visible);
  }

  private lastTime = performance.now();

  /**
   * Call once per frame. Measures real wall-clock frame time itself, because
   * the game's dt is capped at 100ms and would hide big stalls.
   */
  update(): void {
    const now = performance.now();
    const frameSeconds = (now - this.lastTime) / 1000;
    this.lastTime = now;
    if (!this.visible) return;
    this.elapsed += frameSeconds;
    this.frames++;
    this.worst = Math.max(this.worst, frameSeconds);
    if (this.elapsed < SAMPLE_WINDOW) return;

    const fps = this.frames / this.elapsed;
    const avgMs = (this.elapsed / this.frames) * 1000;
    const worstMs = this.worst * 1000;
    this.el.style.color = fps >= 55 ? '#9f9' : fps >= 30 ? '#fd6' : '#f77';
    this.el.textContent = `${fps.toFixed(0)} FPS  ${avgMs.toFixed(1)} ms  (worst ${worstMs.toFixed(1)} ms)`;

    this.elapsed = 0;
    this.frames = 0;
    this.worst = 0;
  }
}
