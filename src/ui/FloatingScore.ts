/**
 * FloatingScore - CSS-based floating score popups.
 *
 * When a segment is completed, shows track restored and status text
 * drifting upward and fading out.
 */

export class FloatingScore {
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'floating-scores';
    this.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 15;
      overflow: hidden;
    `;
    document.body.appendChild(this.container);
  }

  /** Show a floating score at screen center (or specified position) */
  show(text: string, color: string = '#ffaa00', x?: number, y?: number): void {
    const el = document.createElement('div');

    const posX = x ?? window.innerWidth / 2;
    const posY = y ?? window.innerHeight / 2 - 50;

    el.textContent = text;
    el.style.cssText = `
      position: absolute;
      left: ${posX}px;
      top: ${posY}px;
      font-family: 'Press Start 2P', monospace;
      font-size: 16px;
      color: ${color};
      text-shadow: 0 0 8px ${color}, 2px 2px 0 rgba(0,0,0,0.8);
      transform: translate(-50%, 0) scale(1.3);
      transition: all 1.2s ease-out;
      opacity: 1;
      z-index: 16;
      pointer-events: none;
    `;
    this.container.appendChild(el);

    // Trigger animation
    requestAnimationFrame(() => {
      el.style.top = `${posY - 80}px`;
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, 0) scale(0.8)';
    });

    // Remove after animation
    setTimeout(() => el.remove(), 1300);
  }

  /** Show segment completion with stars */
  showSegmentComplete(segmentNum: number, stars: number, feetRestored: number): void {
    // Track restored
    this.show(`+${feetRestored} FT RESTORED`, '#44ff44');

    // Stars (slightly delayed)
    setTimeout(() => {
      const starStr = '\u2605'.repeat(stars) + '\u2606'.repeat(3 - stars);
      this.show(starStr, stars === 3 ? '#ffdd00' : '#aaaaaa',
        window.innerWidth / 2, window.innerHeight / 2 - 20);
    }, 200);

    // Segment name
    setTimeout(() => {
      this.show(`SEGMENT ${segmentNum} COMPLETE`, '#ffffff',
        window.innerWidth / 2, window.innerHeight / 2 + 10);
    }, 100);
  }

  /** Show streak/combo text */
  showStreak(count: number): void {
    if (count < 2) return;
    this.show(
      `${count}x STREAK!`,
      count >= 5 ? '#ff44ff' : count >= 3 ? '#ffaa00' : '#aaddff',
      window.innerWidth / 2,
      window.innerHeight / 2 - 90
    );
  }

  dispose(): void {
    this.container.remove();
  }
}
