/**
 * RadioDispatch - Procedural radio messages from dispatch and other trains.
 *
 * Shows text-based messages in a small panel that add atmosphere and
 * make the world feel alive. Messages appear periodically and fade out.
 */

const MESSAGES = [
  { from: 'DISPATCH', text: 'Grinder 42, you are clear to proceed on Main Track.' },
  { from: 'DISPATCH', text: 'Be advised, slow order in effect ahead. Reduce speed.' },
  { from: 'DISPATCH', text: 'Weather report: clear skies, low humidity. Watch for fire risk.' },
  { from: 'DISPATCH', text: 'Grinder 42, confirm your position, over.' },
  { from: 'DISPATCH', text: 'Good work out there. Keep those rails smooth.' },
  { from: 'DISPATCH', text: 'Next inspection crew coming through in 45 minutes.' },
  { from: 'TRAIN 118', text: 'Eastbound freight passing on Track 2, heads up.' },
  { from: 'TRAIN 204', text: 'Westbound manifest, 118 cars, passing your location.' },
  { from: 'YARD', text: 'Grinder 42, water car status? How are your levels?' },
  { from: 'DISPATCH', text: 'Quality check on Section 4 came back good. Nice work.' },
  { from: 'DISPATCH', text: 'Reminder: document any unusual rail conditions.' },
  { from: 'TRAIN 507', text: 'Horn test... all clear.' },
  { from: 'DISPATCH', text: 'Speed restriction lifted on Section 7. Good grinding.' },
  { from: 'SAFETY', text: 'Fire watch crew reports all clear behind you.' },
  { from: 'DISPATCH', text: 'Keep it up, Grinder 42. Halfway through the shift.' },
];

export class RadioDispatch {
  private container: HTMLElement;
  private messageEl: HTMLElement;
  private timer: number = 8;
  private nextIn: number = 10 + Math.random() * 15;
  private messageIndex: number = 0;
  private visible: boolean = false;

  constructor() {
    this.container = document.createElement('div');
    this.container.style.cssText = `
      position: absolute;
      top: 70px;
      right: 16px;
      width: 260px;
      background: rgba(0, 20, 0, 0.85);
      border: 2px solid #338833;
      padding: 8px 10px;
      font-family: 'Press Start 2P', monospace;
      font-size: 7px;
      color: #44dd44;
      line-height: 2;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.5s;
      z-index: 5;
    `;

    const header = document.createElement('div');
    header.style.cssText = 'color: #338833; font-size: 6px; letter-spacing: 2px; margin-bottom: 4px;';
    header.textContent = 'RADIO';
    this.container.appendChild(header);

    this.messageEl = document.createElement('div');
    this.container.appendChild(this.messageEl);

    document.body.appendChild(this.container);

    // Shuffle messages
    this.shuffleMessages();
  }

  update(dt: number): void {
    this.timer += dt;

    if (!this.visible && this.timer >= this.nextIn) {
      this.showNext();
    }

    if (this.visible && this.timer > 6) {
      this.container.style.opacity = '0';
      this.visible = false;
      this.nextIn = 15 + Math.random() * 25;
      this.timer = 0;
    }
  }

  private showNext(): void {
    const msg = MESSAGES[this.messageIndex % MESSAGES.length];
    this.messageIndex++;

    this.messageEl.innerHTML = `
      <span style="color: #88ff88;">[${msg.from}]</span><br>
      "${msg.text}"
    `;

    this.container.style.opacity = '1';
    this.visible = true;
    this.timer = 0;
  }

  private shuffleMessages(): void {
    for (let i = MESSAGES.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [MESSAGES[i], MESSAGES[j]] = [MESSAGES[j], MESSAGES[i]];
    }
  }

  dispose(): void {
    this.container.remove();
  }
}
