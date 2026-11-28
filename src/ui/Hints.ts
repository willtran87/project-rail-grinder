/**
 * Hints - One short control tip at a time, for what matters right now.
 *
 * Each hint has a condition (checked every frame) and is shown in keyboard or
 * gamepad wording, whichever was used last. Once a hint has been shown
 * enough times it retires for good (saved), so experienced players stop
 * seeing it. Turn hints off in Settings.
 */

import { loadJSON, saveJSON } from '../core/storage';

export interface HintState {
  playing: boolean;
  grinding: boolean;
  speed: number;
  heat: number;              // 0..100
  /** Stone is well away from the worst spot on either rail */
  offTarget: boolean;
  /** Section under the grinder still needs work */
  needsWork: boolean;
  corrugationHeavy: boolean; // corrugation section, pressure too high
  fastTravelUseful: boolean; // long stretch of finished track ahead
}

interface HintDef {
  id: string;
  when: (s: HintState) => boolean;
  keyboard: string;
  gamepad: string;
  /** Retire after being shown this many times */
  limit: number;
}

const HINTS: HintDef[] = [
  { id: 'drive', limit: 2, when: (s) => !s.grinding && Math.abs(s.speed) < 0.2 && s.needsWork,
    keyboard: 'Hold <b>W</b> to drive · <b>SPACE</b> to lower the stones', gamepad: 'Hold <b>RT</b> to drive · <b>(A)</b> to lower the stones' },
  { id: 'aim', limit: 3, when: (s) => s.grinding && s.offTarget,
    keyboard: 'Aim at the arrow: <b>Q / E</b> left stone, <b>U / O</b> right stone', gamepad: 'Aim at the arrow with the <b>left / right sticks</b>' },
  { id: 'heat', limit: 3, when: (s) => s.grinding && s.heat > 72,
    keyboard: 'Stones are hot — ease off pressure: <b>A</b> (left) / <b>J</b> (right)', gamepad: 'Stones are hot — pull the <b>sticks down</b> to ease off pressure' },
  { id: 'corrugation', limit: 3, when: (s) => s.grinding && s.corrugationHeavy,
    keyboard: 'Corrugation: lower pressure with <b>A</b> / <b>J</b>', gamepad: 'Corrugation: pull the <b>sticks down</b> for lighter pressure' },
  { id: 'fast', limit: 2, when: (s) => !s.grinding && s.fastTravelUseful,
    keyboard: 'Hold <b>SHIFT</b> to fast-travel to the next job', gamepad: 'Hold <b>(B)</b> to fast-travel' },
];

const KEY = 'hints-seen-v1';
const SHOW_SECONDS = 5;

export class Hints {
  private el: HTMLElement;
  private seen: Record<string, number> = loadJSON<Record<string, number>>(KEY, {});
  private current: HintDef | null = null;
  private shownFor = 0;
  private cooldown = 2;
  enabled = true;

  constructor() {
    this.el = document.createElement('div');
    this.el.id = 'control-hint';
    this.el.style.cssText = `
      position: absolute; left: 50%; bottom: 200px; transform: translateX(-50%); z-index: 16;
      font-family: var(--ui-font, sans-serif); font-size: 12px; color: #eee; background: rgba(0,0,0,0.6);
      border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 5px 14px; pointer-events: none;
      opacity: 0; transition: opacity 0.3s; white-space: nowrap;`;
    document.body.appendChild(this.el);
  }

  update(dt: number, s: HintState, device: 'keyboard' | 'gamepad'): void {
    if (!this.enabled || !s.playing) { this.hide(); return; }
    if (this.current) {
      this.shownFor += dt;
      // Hide once it's done its job (condition gone) or after a while
      if (!this.current.when(s) || this.shownFor > SHOW_SECONDS) { this.hide(); this.cooldown = 4; }
      return;
    }
    this.cooldown -= dt;
    if (this.cooldown > 0) return;
    const next = HINTS.find((h) => (this.seen[h.id] ?? 0) < h.limit && h.when(s));
    if (!next) return;
    this.current = next;
    this.shownFor = 0;
    this.seen[next.id] = (this.seen[next.id] ?? 0) + 1;
    saveJSON(KEY, this.seen);
    this.el.innerHTML = device === 'gamepad' ? next.gamepad : next.keyboard;
    this.el.style.opacity = '1';
  }

  /** Hide straight away (pause, menus, cinematics) */
  hideNow(): void { this.hide(); this.cooldown = 2; }

  private hide(): void {
    if (this.current || this.el.style.opacity !== '0') this.el.style.opacity = '0';
    this.current = null;
  }

  /** Forget which hints were seen (Settings → reset) */
  reset(): void {
    this.seen = {};
    saveJSON(KEY, this.seen);
  }
}
