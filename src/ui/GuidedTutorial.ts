/**
 * GuidedTutorial - Teaches through doing, not reading.
 *
 * Shows contextual prompts that appear when the player needs to act
 * and disappear when they do it. No text walls, no NEXT buttons.
 * The first section is trivially easy so the player gets the
 * satisfaction of completing something within 10 seconds.
 */

export type TutorialPhase =
  | 'wait_start'       // waiting for player to press any key
  | 'prompt_grind'     // "Hold SPACE to grind"
  | 'grinding'         // player is grinding, waiting for first completion
  | 'first_complete'   // first section done! brief celebration
  | 'prompt_angle'     // "Press Q/E to aim at red zones"
  | 'adjusting'        // player is adjusting angle
  | 'prompt_pressure'  // "Press A/D to adjust pressure"
  | 'prompt_tab'       // "Press TAB to switch rails"
  | 'free_play'        // tutorial complete, player is on their own
  ;

export class GuidedTutorial {
  private overlay: HTMLElement;
  private promptEl: HTMLElement;
  phase: TutorialPhase = 'wait_start';
  private phaseTimer: number = 0;
  private firstJob: boolean = true;
  active: boolean = true;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 12;
    `;
    document.body.appendChild(this.overlay);

    this.promptEl = document.createElement('div');
    this.promptEl.style.cssText = `
      position: absolute; bottom: 260px; left: 50%; transform: translateX(-50%);
      background: rgba(10, 12, 18, 0.9); border: 1px solid rgba(232, 160, 32, 0.4);
      border-radius: 8px; padding: 12px 24px;
      font-family: 'Inter', sans-serif; font-size: 14px; color: #fff;
      text-align: center; line-height: 1.8;
      opacity: 0; transition: opacity 0.4s;
      pointer-events: none;
    `;
    this.overlay.appendChild(this.promptEl);
  }

  /** Call this for subsequent jobs (not first time) */
  setReplay(): void {
    this.firstJob = false;
    this.active = false;
    this.phase = 'free_play';
    this.hidePrompt();
  }

  /** Is this the first job? (skip inspection report) */
  isFirstJob(): boolean { return this.firstJob; }

  private showPrompt(html: string): void {
    this.promptEl.innerHTML = html;
    this.promptEl.style.opacity = '1';
  }

  private hidePrompt(): void {
    this.promptEl.style.opacity = '0';
  }

  /**
   * Update each frame. Returns actions the game should take.
   */
  update(dt: number, state: {
    isGrinding: boolean;
    speed: number;
    angleChanged: boolean;
    pressureChanged: boolean;
    tabPressed: boolean;
    sectionsCompleted: number;
  }): { autoMove?: boolean; skipReport?: boolean } {

    if (!this.active) return {};
    this.phaseTimer += dt;

    switch (this.phase) {
      case 'wait_start':
        if (this.phaseTimer > 1.0) {
          this.showPrompt(`
            Hold <kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:var(--ui-mono);color:var(--ui-accent);">SPACE</kbd> to lower the grindstones
          `);
          this.phase = 'prompt_grind';
          this.phaseTimer = 0;
        }
        return { autoMove: true }; // start moving automatically

      case 'prompt_grind':
        if (state.isGrinding) {
          this.showPrompt(`
            <span style="color:var(--ui-green);">Grinding!</span> Watch the sparks and the rail profile below
          `);
          this.phase = 'grinding';
          this.phaseTimer = 0;
        }
        return { autoMove: true };

      case 'grinding':
        if (state.sectionsCompleted >= 1) {
          this.hidePrompt();
          this.phase = 'first_complete';
          this.phaseTimer = 0;
        }
        return {};

      case 'first_complete':
        if (this.phaseTimer > 2.0) {
          this.showPrompt(`
            Use <kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:var(--ui-mono);color:var(--ui-accent);">Q</kbd> and <kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:var(--ui-mono);color:var(--ui-accent);">E</kbd> to aim at the <span style="color:#ff5500;">orange</span> zones on the profile
          `);
          this.phase = 'prompt_angle';
          this.phaseTimer = 0;
        }
        return {};

      case 'prompt_angle':
        if (state.angleChanged) {
          this.showPrompt(`
            <span style="color:var(--ui-green);">Good!</span> Now try <kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:var(--ui-mono);color:var(--ui-accent);">A</kbd> / <kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:var(--ui-mono);color:var(--ui-accent);">D</kbd> to adjust grinding pressure
          `);
          this.phase = 'prompt_pressure';
          this.phaseTimer = 0;
        }
        if (this.phaseTimer > 15) { this.phase = 'prompt_pressure'; this.phaseTimer = 0; }
        return {};

      case 'prompt_pressure':
        if (state.pressureChanged || this.phaseTimer > 10) {
          this.showPrompt(`
            Press <kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:var(--ui-mono);color:var(--ui-accent);">TAB</kbd> to switch between left and right rail
          `);
          this.phase = 'prompt_tab';
          this.phaseTimer = 0;
        }
        return {};

      case 'prompt_tab':
        if (state.tabPressed || this.phaseTimer > 12) {
          this.showPrompt(`
            <span style="color:var(--ui-green);">You're ready!</span> Grind all sections to lift the slow orders.
            <div style="font-size:11px;color:var(--ui-dim);margin-top:4px;">SHIFT+W = fast travel &nbsp; 1-5 = cameras &nbsp; N = time &nbsp; P = rain</div>
          `);
          this.phase = 'free_play';
          this.phaseTimer = 0;
          // Fade out after a few seconds
          setTimeout(() => this.hidePrompt(), 5000);
          this.active = false;
        }
        return {};

      case 'free_play':
        return {};
    }
    return {};
  }

  dispose(): void {
    this.overlay.remove();
  }
}
