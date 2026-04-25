/**
 * TutorialManager - Guides new players through the game step by step.
 *
 * Shows a sequence of tutorial boxes with instructions and waits for
 * the player to complete each step before advancing. Also manages
 * hover tooltips for UI elements.
 */

export interface TutorialStep {
  title: string;
  text: string;
  hint?: string;          // green hint text (e.g., key prompt)
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** If set, wait for this event before showing "Next" button */
  waitForAction?: string;
  /** Auto-advance after this many ms (0 = manual advance) */
  autoAdvanceMs?: number;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: 'WELCOME, OPERATOR',
    text: 'Welcome to Staying on Track! You operate a rail grinder — a specialized train that restores worn railroad tracks to their correct shape.',
    hint: 'Click NEXT to begin training',
    position: 'center',
  },
  {
    title: 'YOUR MACHINE',
    text: 'You are sitting in a multi-car rail grinder consist. Behind you is the cab. In the middle are the grinding modules with spinning grindstones. Up front is the water car for fire suppression.',
    hint: 'Press 1, 2, 3, 4 to try different camera views',
    position: 'top-left',
  },
  {
    title: 'HOW TO DRIVE',
    text: 'Your grinder rides on the rails like a train. Hold W to move forward along the track. Hold S to reverse. You can only go forward and backward — the rails guide you.',
    hint: 'W = forward, S = reverse',
    position: 'top-left',
  },
  {
    title: 'THE RAIL PROFILE',
    text: 'The panel in the bottom-right shows the rail CROSS-SECTION — imagine slicing the rail like a loaf of bread. The GREEN dashed line is the TARGET shape (perfect rail). The colored line is the CURRENT shape. RED areas need grinding. GREEN areas are already correct.',
    hint: 'Look at the profile panel >>>',
    position: 'top-left',
  },
  {
    title: 'WHY GRIND?',
    text: 'Trains wear down the rail surface over time, creating flat spots, cracks, and uneven wear. Your job is to grind the rail back to the target profile. The closer you match it, the higher your ACCURACY score.',
    hint: 'Check the ACCURACY % in the HUD',
    position: 'top-left',
  },
  {
    title: 'HOW TO GRIND',
    text: 'Hold SPACE to lower the grindstones onto the rail. The stones spin and remove tiny amounts of metal. Move forward while grinding to grind the whole track section. Watch the profile update in real-time!',
    hint: 'Hold W + SPACE together to grind while moving',
    position: 'top-left',
    waitForAction: 'grind-contact',
  },
  {
    title: 'GRINDING!',
    text: 'Great — sparks! Watch the profile panel update. Now use Q/E to adjust the STONE ANGLE — this controls WHERE on the rail head you grind. Try angling the stones to grind the worn areas shown in RED on the profile.',
    hint: 'Q = angle left (gauge side), E = angle right (field side)',
    position: 'top-left',
  },
  {
    title: 'PRESSURE CONTROL',
    text: 'Use A/D to adjust PRESSURE. Higher pressure removes more metal but is less precise — great for heavy defects. Lower pressure gives a finer finish. Watch the bottom panel for your current settings.',
    hint: 'A = less pressure, D = more pressure',
    position: 'top-left',
  },
  {
    title: 'TRACK MAP',
    text: 'The strip at the top shows the full track. RED segments have severe defects, YELLOW have moderate. As you grind, they turn GREEN when complete. Your goal: turn them all green!',
    hint: 'Each completed segment earns you money. Streaks give bonuses!',
    position: 'top-left',
  },
  {
    title: 'NIGHT GRINDING',
    text: 'Press N to change the time of day. At NIGHT, the sparks become the main light source — just like real rail grinding operations!',
    hint: 'Press N now to try night mode!',
    position: 'center',
  },
  {
    title: 'YOU ARE READY!',
    text: 'Grind the entire track to restore it to full speed. Match the target profile (green dashed line) as closely as possible for the best rating. Complete all segments to finish the job. Good luck, operator!',
    hint: 'Follow the objectives panel for guidance',
    position: 'center',
  },
];

export class TutorialManager {
  private overlay: HTMLElement;
  private currentStep: number = -1;
  private steps: TutorialStep[];
  private waitingForEvent: string | null = null;
  private onComplete?: () => void;
  private eventListenerCleanups: Array<() => void> = [];

  constructor(onComplete?: () => void) {
    this.overlay = document.getElementById('tutorial-overlay')!;
    this.steps = TUTORIAL_STEPS;
    this.onComplete = onComplete;
  }

  /** Start the tutorial from the beginning */
  start(): void {
    this.currentStep = -1;
    this.nextStep();
  }

  /** Skip the entire tutorial */
  skip(): void {
    this.overlay.innerHTML = '';
    this.currentStep = this.steps.length;
    this.cleanupListeners();
    this.onComplete?.();
  }

  /** Call this when a game event happens (e.g., 'grind-contact') */
  notifyEvent(eventName: string): void {
    if (this.waitingForEvent === eventName) {
      this.waitingForEvent = null;
      this.nextStep();
    }
  }

  /** Is the tutorial currently active? */
  isActive(): boolean {
    return this.currentStep >= 0 && this.currentStep < this.steps.length;
  }

  private nextStep(): void {
    this.currentStep++;
    if (this.currentStep >= this.steps.length) {
      this.overlay.innerHTML = '';
      this.cleanupListeners();
      this.onComplete?.();
      return;
    }

    const step = this.steps[this.currentStep];
    this.showStep(step);
  }

  private showStep(step: TutorialStep): void {
    const isLast = this.currentStep === this.steps.length - 1;
    const hasWait = !!step.waitForAction;

    // Position styles
    const posStyles: Record<string, string> = {
      'center': 'top: 50%; left: 50%; transform: translate(-50%, -50%);',
      'top-left': 'top: 80px; left: 20px;',
      'top-right': 'top: 80px; right: 20px;',
      'bottom-left': 'bottom: 80px; left: 20px;',
      'bottom-right': 'bottom: 80px; right: 20px;',
    };

    let buttonsHtml = '';
    if (hasWait) {
      // No next button - waiting for action
      this.waitingForEvent = step.waitForAction!;
    } else if (isLast) {
      buttonsHtml = `
        <button class="tutorial-btn" id="tutorial-finish">GOT IT!</button>
      `;
    } else {
      buttonsHtml = `
        <button class="tutorial-btn" id="tutorial-next">NEXT</button>
        <button class="tutorial-btn" id="tutorial-skip" style="background: transparent; color: #666; border: 1px solid #444; margin-left: 8px;">SKIP</button>
      `;
    }

    this.overlay.innerHTML = `
      <div class="tutorial-box" style="${posStyles[step.position]}">
        <span class="tutorial-title">${step.title}</span>
        <span class="tutorial-text">${step.text}</span>
        ${step.hint ? `<span class="tutorial-hint">${step.hint}</span>` : ''}
        <div style="margin-top: 12px;">
          ${buttonsHtml}
        </div>
      </div>
    `;

    // Bind buttons
    const nextBtn = document.getElementById('tutorial-next');
    const skipBtn = document.getElementById('tutorial-skip');
    const finishBtn = document.getElementById('tutorial-finish');

    if (nextBtn) {
      const handler = () => this.nextStep();
      nextBtn.addEventListener('click', handler);
      this.eventListenerCleanups.push(() => nextBtn.removeEventListener('click', handler));
    }
    if (skipBtn) {
      const handler = () => this.skip();
      skipBtn.addEventListener('click', handler);
      this.eventListenerCleanups.push(() => skipBtn.removeEventListener('click', handler));
    }
    if (finishBtn) {
      const handler = () => this.skip();
      finishBtn.addEventListener('click', handler);
      this.eventListenerCleanups.push(() => finishBtn.removeEventListener('click', handler));
    }

    // Auto-advance
    if (step.autoAdvanceMs && step.autoAdvanceMs > 0) {
      setTimeout(() => {
        if (this.currentStep < this.steps.length) {
          this.nextStep();
        }
      }, step.autoAdvanceMs);
    }
  }

  private cleanupListeners(): void {
    for (const cleanup of this.eventListenerCleanups) {
      cleanup();
    }
    this.eventListenerCleanups = [];
  }
}
