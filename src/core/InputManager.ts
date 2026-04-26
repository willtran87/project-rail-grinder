/**
 * InputManager - Tracks keyboard and mouse state.
 *
 * Provides simple methods to check if keys are pressed and to get
 * mouse position / click events. Used by the camera system, grinding
 * controls, and UI interactions.
 */

import * as THREE from 'three';

export class InputManager {
  /** Currently held keys (lowercase) */
  private keysDown: Set<string> = new Set();
  /** Keys pressed this frame (for one-shot actions) */
  private keysPressed: Set<string> = new Set();

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
    mousemove: (e: MouseEvent) => void;
    mousedown: (e: MouseEvent) => void;
    mouseup: (e: MouseEvent) => void;
    wheel: (e: WheelEvent) => void;
    contextmenu: (e: Event) => void;
  };

  constructor() {
    this.boundHandlers = {
      keydown: (e: KeyboardEvent) => {
        const key = e.key.toLowerCase();
        // Prevent TAB from shifting browser focus away from the game
        if (key === 'tab') e.preventDefault();
        if (!this.keysDown.has(key)) {
          this.keysPressed.add(key);
        }
        this.keysDown.add(key);
      },
      keyup: (e: KeyboardEvent) => {
        this.keysDown.delete(e.key.toLowerCase());
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
    window.addEventListener('mousemove', this.boundHandlers.mousemove);
    window.addEventListener('mousedown', this.boundHandlers.mousedown);
    window.addEventListener('mouseup', this.boundHandlers.mouseup);
    window.addEventListener('wheel', this.boundHandlers.wheel);
    window.addEventListener('contextmenu', this.boundHandlers.contextmenu);
  }

  /** Check if a key is currently held down */
  isKeyDown(key: string): boolean {
    return this.keysDown.has(key.toLowerCase());
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
    window.removeEventListener('mousemove', this.boundHandlers.mousemove);
    window.removeEventListener('mousedown', this.boundHandlers.mousedown);
    window.removeEventListener('mouseup', this.boundHandlers.mouseup);
    window.removeEventListener('wheel', this.boundHandlers.wheel);
    window.removeEventListener('contextmenu', this.boundHandlers.contextmenu);
  }
}
