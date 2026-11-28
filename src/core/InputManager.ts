/**
 * InputManager - Tracks keyboard and mouse state.
 *
 * Provides simple methods to check if keys are pressed and to get
 * mouse position / click events. Used by the camera system, grinding
 * controls, and UI interactions.
 *
 * Gamepads: pollGamepad() (called once a frame) turns the controller into
 * the same key names the game already checks, so every control works on a
 * pad without the game knowing:
 *   (A) grind (Space)        RT / LT  drive forward / back (W / S)
 *   (B) fast travel (Shift)  (Y) next camera     Start  pause (Esc)
 *   (X) spray water (X)      LB  hold the revenue train (T)   RB  change stones (Z)
 *   left stick  ←/→ left stone angle (Q/E),  ↑/↓ left pressure (D/A)
 *   right stick ←/→ right stone angle (U/O), ↑/↓ right pressure (L/J)
 */

import { buildLookup } from './keymap';
import * as THREE from 'three';

export class InputManager {
  /** Currently held keys (lowercase) */
  private keysDown: Set<string> = new Set();
  /** Keys the gamepad is "holding" this frame (see pollGamepad) */
  private padKeys: Set<string> = new Set();
  /** Which device was used last (for showing the right button names) */
  lastDevice: 'keyboard' | 'gamepad' = 'keyboard';
  private pad: Gamepad | null = null;
  /** Keys pressed this frame (for one-shot actions) */
  private keysPressed: Set<string> = new Set();
  /** Keys held by the on-screen touch controls */
  private touchKeys: Set<string> = new Set();
  /** Rebound keys: physical → action ('' = ignored). See core/keymap.ts */
  private lookup: Record<string, string> = {};

  /** Use a new keymap (action → physical key) */
  setKeymap(keymap: Record<string, string>): void {
    this.lookup = buildLookup(keymap);
    this.keysDown.clear();
  }

  /** Translate a physical key through the keymap ('' = not bound to anything) */
  private translate(key: string): string {
    return key in this.lookup ? this.lookup[key] : key;
  }

  /** Press / release a virtual key from the touch controls */
  setTouchKey(key: string, down: boolean): void {
    if (down && !this.touchKeys.has(key)) this.keysPressed.add(key);
    if (down) this.touchKeys.add(key); else this.touchKeys.delete(key);
  }

  /** Normalized mouse position (-1 to 1) for raycasting */
  readonly mouse: THREE.Vector2 = new THREE.Vector2();
  /** Whether the left mouse button is currently held */
  mouseDown: boolean = false;
  /** Set to true on the frame the mouse was clicked */
  mouseClicked: boolean = false;

  /** Mouse movement delta this frame (for camera orbit) */
  mouseDeltaX: number = 0;
  mouseDeltaY: number = 0;

  /** Scroll wheel delta this frame */
  scrollDelta: number = 0;

  private boundHandlers: {
    keydown: (e: KeyboardEvent) => void;
    keyup: (e: KeyboardEvent) => void;
    blur: () => void;
    mousemove: (e: MouseEvent) => void;
    mousedown: (e: MouseEvent) => void;
    mouseup: (e: MouseEvent) => void;
    wheel: (e: WheelEvent) => void;
    contextmenu: (e: Event) => void;
  };

  constructor() {
    this.boundHandlers = {
      keydown: (e: KeyboardEvent) => {
        const key = this.translate(InputManager.normalizeKey(e));
        if (!key) return;
        // Prevent TAB from shifting browser focus away from the game
        if (key === 'tab') e.preventDefault();
        if (!this.keysDown.has(key)) {
          this.keysPressed.add(key);
        }
        this.keysDown.add(key);
        this.lastDevice = 'keyboard';
      },
      keyup: (e: KeyboardEvent) => {
        this.keysDown.delete(this.translate(InputManager.normalizeKey(e)));
      },
      // Alt-tabbing away while holding a key means we never get its keyup,
      // so the key would stay "stuck" down. Release everything instead.
      blur: () => {
        this.keysDown.clear();
        this.mouseDown = false;
      },
      mousemove: (e: MouseEvent) => {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.mouseDeltaX += e.movementX;
        this.mouseDeltaY += e.movementY;
      },
      mousedown: (e: MouseEvent) => {
        if (e.button === 0) {
          this.mouseDown = true;
          this.mouseClicked = true;
        }
      },
      mouseup: (e: MouseEvent) => {
        if (e.button === 0) {
          this.mouseDown = false;
        }
      },
      wheel: (e: WheelEvent) => {
        this.scrollDelta += e.deltaY;
      },
      contextmenu: (e: Event) => {
        e.preventDefault();
      },
    };

    window.addEventListener('keydown', this.boundHandlers.keydown);
    window.addEventListener('keyup', this.boundHandlers.keyup);
    window.addEventListener('blur', this.boundHandlers.blur);
    window.addEventListener('mousemove', this.boundHandlers.mousemove);
    window.addEventListener('mousedown', this.boundHandlers.mousedown);
    window.addEventListener('mouseup', this.boundHandlers.mouseup);
    window.addEventListener('wheel', this.boundHandlers.wheel);
    window.addEventListener('contextmenu', this.boundHandlers.contextmenu);
  }

  /**
   * Turn a keyboard event into the lowercase key name the game checks for.
   * Number keys use the physical key (e.code), because with SHIFT held
   * e.key reports '!' instead of '1' — which broke camera switching.
   */
  private static normalizeKey(e: KeyboardEvent): string {
    if (/^Digit\d$/.test(e.code)) return e.code.slice(5);
    return e.key.toLowerCase();
  }

  /** Check if a key is currently held down (keyboard or gamepad) */
  isKeyDown(key: string): boolean {
    const k = key.toLowerCase();
    return this.keysDown.has(k) || this.padKeys.has(k) || this.touchKeys.has(k);
  }

  /**
   * Read the first connected gamepad and map it onto key names. Call once
   * per frame, before the game checks input.
   */
  pollGamepad(): void {
    const pads = typeof navigator !== 'undefined' && navigator.getGamepads ? navigator.getGamepads() : [];
    this.pad = null;
    for (const p of pads) if (p && p.connected) { this.pad = p; break; }
    const next = new Set<string>();
    const p = this.pad;
    if (p) {
      const btn = (i: number) => !!p.buttons[i] && (p.buttons[i].pressed || p.buttons[i].value > 0.4);
      const ax = (i: number) => p.axes[i] ?? 0;
      const DEAD = 0.35;
      if (btn(0)) next.add(' ');
      if (btn(1)) next.add('shift');
      if (btn(3)) next.add('camnext');
      if (btn(2)) next.add('x');   // spray water at a fire
      if (btn(4)) next.add('t');   // request a hold on the revenue train
      if (btn(5)) next.add('z');   // change worn stones (hold)
      if (btn(9)) next.add('escape');
      if (btn(7)) next.add('w');
      if (btn(6)) next.add('s');
      if (ax(0) < -DEAD) next.add('q'); else if (ax(0) > DEAD) next.add('e');
      if (ax(1) < -DEAD) next.add('d'); else if (ax(1) > DEAD) next.add('a');
      if (ax(2) < -DEAD) next.add('u'); else if (ax(2) > DEAD) next.add('o');
      if (ax(3) < -DEAD) next.add('l'); else if (ax(3) > DEAD) next.add('j');
    }
    for (const k of next) {
      if (!this.padKeys.has(k) && !this.keysDown.has(k)) this.keysPressed.add(k);
    }
    if (next.size > 0) this.lastDevice = 'gamepad';
    this.padKeys = next;
  }

  /** True if a gamepad is connected */
  get hasGamepad(): boolean { return this.pad !== null; }

  /**
   * Shake the controller (if it can).
   * @param strong - 0..1 low-frequency motor, @param weak - 0..1 high-frequency motor
   */
  rumble(strong: number, weak: number, ms: number): void {
    const act = (this.pad as (Gamepad & { vibrationActuator?: { playEffect: (t: string, p: object) => Promise<unknown> } }) | null)?.vibrationActuator;
    if (!act) return;
    act.playEffect('dual-rumble', { duration: ms, strongMagnitude: strong, weakMagnitude: weak }).catch(() => {});
  }

  /** Check if a key was pressed this frame (one-shot) */
  wasKeyPressed(key: string): boolean {
    return this.keysPressed.has(key.toLowerCase());
  }

  /** Call at the end of each frame to reset per-frame state */
  endFrame(): void {
    this.keysPressed.clear();
    this.mouseClicked = false;
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    this.scrollDelta = 0;
  }

  dispose(): void {
    window.removeEventListener('keydown', this.boundHandlers.keydown);
    window.removeEventListener('keyup', this.boundHandlers.keyup);
    window.removeEventListener('blur', this.boundHandlers.blur);
    window.removeEventListener('mousemove', this.boundHandlers.mousemove);
    window.removeEventListener('mousedown', this.boundHandlers.mousedown);
    window.removeEventListener('mouseup', this.boundHandlers.mouseup);
    window.removeEventListener('wheel', this.boundHandlers.wheel);
    window.removeEventListener('contextmenu', this.boundHandlers.contextmenu);
  }
}
