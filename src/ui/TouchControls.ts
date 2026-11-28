/**
 * TouchControls - On-screen controls for phones and tablets.
 *
 *   left stick   left stone: ←/→ angle, ↑/↓ pressure
 *   right stick  right stone: ←/→ angle, ↑/↓ pressure
 *   buttons      GRIND (toggle), ▲ / ▼ drive, ⏩ fast travel, 🎥 camera, ❚❚ pause
 *
 * Everything becomes "virtual keys" in the InputManager, exactly like the
 * gamepad, so the game reads touch the same way it reads the keyboard.
 * Only shown on touch screens (coarse pointer).
 */

import type { InputManager } from '../core/InputManager';

const STICK = 120; // px

export class TouchControls {
  readonly enabled: boolean;
  private root: HTMLElement | null = null;
  private grindOn = false;
  private shown = false;

  constructor(private input: InputManager) {
    this.enabled = typeof window !== 'undefined' && 'ontouchstart' in window
      && window.matchMedia?.('(pointer: coarse)').matches === true;
    if (this.enabled) this.build();
  }

  /** Show only during play */
  setVisible(on: boolean): void {
    if (!this.root || on === this.shown) return;
    this.shown = on;
    this.root.style.display = on ? 'block' : 'none';
  }

  private build(): void {
    const root = document.createElement('div');
    root.id = 'touch-controls';
    root.style.cssText = 'position: fixed; inset: 0; z-index: 30; pointer-events: none; display: none; touch-action: none;';
    root.appendChild(this.stick('left', { x: ['q', 'e'], y: ['d', 'a'] }));
    root.appendChild(this.stick('right', { x: ['u', 'o'], y: ['l', 'j'] }));
    const col = document.createElement('div');
    col.style.cssText = 'position: absolute; right: 12px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 10px; pointer-events: auto;';
    col.appendChild(this.button('GRIND', () => { this.grindOn = !this.grindOn; this.input.setTouchKey(' ', this.grindOn); return this.grindOn; }, true));
    col.appendChild(this.holdButton('▲', 'w'));
    col.appendChild(this.holdButton('▼', 's'));
    col.appendChild(this.holdButton('⏩', 'shift'));
    col.appendChild(this.tapButton('🎥', 'camnext'));
    col.appendChild(this.tapButton('❚❚', 'escape'));
    root.appendChild(col);
    document.body.appendChild(root);
    this.root = root;
  }

  private baseButton(label: string): HTMLButtonElement {
    const b = document.createElement('button');
    b.textContent = label;
    b.style.cssText = `width: 64px; height: 48px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.3);
      background: rgba(16,19,28,0.6); color: #fff; font: 600 13px var(--ui-font, sans-serif); touch-action: none;`;
    return b;
  }

  private holdButton(label: string, key: string): HTMLElement {
    const b = this.baseButton(label);
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); this.input.setTouchKey(key, true); });
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) b.addEventListener(ev, () => this.input.setTouchKey(key, false));
    return b;
  }

  private tapButton(label: string, key: string): HTMLElement {
    const b = this.baseButton(label);
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.input.setTouchKey(key, true);
      setTimeout(() => this.input.setTouchKey(key, false), 80);
    });
    return b;
  }

  private button(label: string, onTap: () => boolean, accent = false): HTMLElement {
    const b = this.baseButton(label);
    if (accent) b.style.background = 'rgba(232,160,32,0.7)';
    b.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const on = onTap();
      b.style.background = on ? 'rgba(255,90,20,0.85)' : 'rgba(232,160,32,0.7)';
    });
    return b;
  }

  /** A thumb stick: drag from its centre; past a dead zone it holds the matching keys */
  private stick(side: 'left' | 'right', keys: { x: [string, string]; y: [string, string] }): HTMLElement {
    const base = document.createElement('div');
    base.style.cssText = `position: absolute; bottom: 24px; ${side === 'left' ? 'left' : 'right'}: ${side === 'left' ? 24 : 100}px;
      width: ${STICK}px; height: ${STICK}px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.25);
      background: rgba(16,19,28,0.35); pointer-events: auto; touch-action: none;`;
    const knob = document.createElement('div');
    knob.style.cssText = `position: absolute; left: 50%; top: 50%; width: 46px; height: 46px; margin: -23px 0 0 -23px;
      border-radius: 50%; background: rgba(232,160,32,0.6);`;
    base.appendChild(knob);
    const label = document.createElement('div');
    label.textContent = side === 'left' ? 'LEFT STONE' : 'RIGHT STONE';
    label.style.cssText = 'position: absolute; top: -18px; width: 100%; text-align: center; font: 600 9px var(--ui-font, sans-serif); color: #ccc; letter-spacing: 1px;';
    base.appendChild(label);
    let id = -1;
    const set = (dx: number, dy: number) => {
      const r = STICK / 2;
      const len = Math.min(r, Math.hypot(dx, dy));
      const a = Math.atan2(dy, dx);
      const x = Math.cos(a) * len, y = Math.sin(a) * len;
      knob.style.transform = `translate(${x}px, ${y}px)`;
      const dz = r * 0.3;
      this.input.setTouchKey(keys.x[0], x < -dz);
      this.input.setTouchKey(keys.x[1], x > dz);
      this.input.setTouchKey(keys.y[0], y < -dz); // up
      this.input.setTouchKey(keys.y[1], y > dz);  // down
    };
    base.addEventListener('pointerdown', (e) => {
      id = e.pointerId;
      base.setPointerCapture(e.pointerId);
      const rect = base.getBoundingClientRect();
      set(e.clientX - rect.left - STICK / 2, e.clientY - rect.top - STICK / 2);
    });
    base.addEventListener('pointermove', (e) => {
      if (e.pointerId !== id) return;
      const rect = base.getBoundingClientRect();
      set(e.clientX - rect.left - STICK / 2, e.clientY - rect.top - STICK / 2);
    });
    const end = () => { id = -1; set(0, 0); };
    base.addEventListener('pointerup', end);
    base.addEventListener('pointercancel', end);
    return base;
  }
}
