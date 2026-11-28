/**
 * FloatingScore - Short messages that float up and fade, plus the section
 * banner.
 *
 * Messages stack in one column in the middle of the screen, so they never
 * land on top of each other. At most MAX_LIVE are up at once; the rest wait
 * their turn, and LOW-priority ones (tips) are simply dropped when the
 * screen is already busy. (The play-test counted six messages in under two
 * seconds when a section finished; now that's one banner.)
 *
 * The banner is a single panel for "something finished" moments: a title,
 * a few lines, and a footer (what's next).
 */

export type Priority = 'high' | 'normal' | 'low';

interface Pending { text: string; color: string; x?: number; priority: Priority }

/** Most floating messages on screen at once */
const MAX_LIVE = 3;
/** Most messages waiting their turn */
const MAX_QUEUE = 3;
/** How long one floats (ms) */
const LIFE_MS = 1300;
/** Vertical gap between stacked messages (px) */
const ROW = 34;

export interface BannerLine { text: string; color?: string }

export class FloatingScore {
  private container: HTMLElement;
  private live: { el: HTMLElement; born: number }[] = [];
  private queue: Pending[] = [];
  private bannerEl: HTMLElement;
  private bannerTimer = 0;

  constructor() {
    this.container = document.createElement('div');
    this.container.id = 'floating-scores';
    this.container.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 15; overflow: hidden;
    `;
    document.body.appendChild(this.container);

    this.bannerEl = document.createElement('div');
    this.bannerEl.id = 'section-banner';
    this.bannerEl.style.cssText = `
      position: absolute; left: 50%; top: 128px; transform: translateX(-50%);
      min-width: 260px; max-width: 420px; padding: 10px 18px 9px; text-align: center;
      background: rgba(8,10,16,0.78); border: 1px solid rgba(255,200,80,0.35); border-radius: 8px;
      font-family: var(--ui-font, sans-serif); color: #eee; opacity: 0; pointer-events: none;
      transition: opacity 0.25s; z-index: 17; will-change: opacity, transform;
    `;
    document.body.appendChild(this.bannerEl);
  }

  /**
   * Show a floating message. `x` is kept for callers that place it sideways;
   * the height comes from the stack (`_y` is ignored: stacking replaces the
   * hand-picked offsets that used to collide).
   */
  show(text: string, color: string = '#ffaa00', x?: number, _y?: number, priority: Priority = 'normal'): void {
    this.prune();
    if (this.live.length >= MAX_LIVE) {
      if (priority === 'low') return;
      // A high-priority message jumps the queue
      if (priority === 'high') this.queue.unshift({ text, color, x, priority });
      else this.queue.push({ text, color, x, priority });
      // Too many waiting: drop the oldest low one, else the oldest normal one
      while (this.queue.length > MAX_QUEUE) {
        const i = this.queue.findIndex((q) => q.priority === 'low');
        this.queue.splice(i >= 0 ? i : this.queue.findIndex((q) => q.priority !== 'high'), 1);
      }
      return;
    }
    if (priority === 'low' && this.live.length >= 2) return;
    this.spawn(text, color, x);
  }

  /** Forget messages that have finished */
  private prune(): void {
    const now = performance.now();
    this.live = this.live.filter((m) => now - m.born < LIFE_MS);
  }

  private spawn(text: string, color: string, x?: number): void {
    const el = document.createElement('div');
    const posX = x ?? window.innerWidth / 2;
    const slot = this.live.length;
    const posY = window.innerHeight / 2 - 40 - slot * ROW;
    el.textContent = text;
    el.style.cssText = `
      position: absolute; left: ${posX}px; top: ${posY}px;
      font-family: 'Press Start 2P', monospace; font-size: 16px; color: ${color};
      text-shadow: 0 0 8px ${color}, 2px 2px 0 rgba(0,0,0,0.8);
      transform: translate(-50%, 0) scale(1.3);
      transition: transform 1.2s ease-out, opacity 1.2s ease-out;
      will-change: transform, opacity; opacity: 1; z-index: 16; pointer-events: none; white-space: nowrap;
    `;
    this.container.appendChild(el);
    this.live.push({ el, born: performance.now() });
    // Float up, shrink and fade (transform / opacity only: cheap)
    requestAnimationFrame(() => {
      el.style.opacity = '0';
      el.style.transform = 'translate(-50%, -80px) scale(0.8)';
    });
    setTimeout(() => {
      el.remove();
      this.prune();
      const next = this.queue.shift();
      if (next) this.show(next.text, next.color, next.x, undefined, next.priority);
    }, LIFE_MS);
  }

  /**
   * One panel for a finished moment (a section, an event): replaces any
   * banner already up.
   */
  banner(title: string, titleColor: string, lines: BannerLine[], footer = '', ms = 2800): void {
    const esc = (s: string) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));
    this.bannerEl.innerHTML = `
      <div style="font-family: 'Press Start 2P', monospace; font-size: 13px; color: ${titleColor};
        text-shadow: 0 0 8px ${titleColor}88; margin-bottom: ${lines.length ? 6 : 0}px;">${esc(title)}</div>
      ${lines.map((l) => `<div style="font-size: 13px; font-weight: 700; color: ${l.color ?? '#ddd'}; line-height: 1.5;">${esc(l.text)}</div>`).join('')}
      ${footer ? `<div style="font-size: 11px; color: #ffcc77; margin-top: 6px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 5px;">${esc(footer)}</div>` : ''}`;
    this.bannerEl.style.opacity = '1';
    this.bannerEl.animate([{ transform: 'translateX(-50%) scale(1.12)' }, { transform: 'translateX(-50%) scale(1)' }],
      { duration: 220, easing: 'cubic-bezier(.2,1.4,.4,1)' });
    clearTimeout(this.bannerTimer);
    this.bannerTimer = window.setTimeout(() => { this.bannerEl.style.opacity = '0'; }, ms);
  }

  /** Clear everything (new job, menus) */
  clear(): void {
    for (const m of this.live) m.el.remove();
    this.live = [];
    this.queue = [];
    this.bannerEl.style.opacity = '0';
  }

  /** Section finished, without the details (kept for older callers) */
  showSegmentComplete(segmentNum: number, stars: number, feetRestored: number): void {
    this.banner(`SECTION ${segmentNum} COMPLETE`, '#ffffff',
      [{ text: '★'.repeat(stars) + '☆'.repeat(3 - stars), color: stars === 3 ? '#ffdd00' : '#aaaaaa' },
        { text: `+${feetRestored} FT RESTORED`, color: '#44ff44' }]);
  }

  dispose(): void {
    this.container.remove();
    this.bannerEl.remove();
  }
}
