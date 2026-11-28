/**
 * Toast - Small notices that slide in at the top left and leave by themselves
 * (achievements unlocked, new paint scheme, …). Several stack up.
 */

export class Toast {
  private box: HTMLElement;

  constructor() {
    this.box = document.createElement('div');
    this.box.style.cssText = `position: fixed; top: 60px; left: 16px; z-index: 70; display: flex; flex-direction: column;
      gap: 8px; pointer-events: none;`;
    document.body.appendChild(this.box);
  }

  /** @param icon - an emoji, @param title - bold first line, @param text - second line */
  show(icon: string, title: string, text: string, seconds = 4.5): void {
    const el = document.createElement('div');
    el.style.cssText = `background: rgba(16,19,28,0.94); border: 1px solid rgba(255,200,80,0.45); border-radius: 6px;
      padding: 8px 14px 8px 10px; font-family: var(--ui-font, sans-serif); color: #eee; display: flex; gap: 10px;
      align-items: center; min-width: 220px; box-shadow: 0 4px 16px rgba(0,0,0,0.4); will-change: transform, opacity;`;
    el.innerHTML = `<div style="font-size: 22px;">${icon}</div><div><div style="font-size: 12px; font-weight: 700; color: #ffd84a;">${title}</div>
      <div style="font-size: 11px; color: #bbb;">${text}</div></div>`;
    this.box.appendChild(el);
    el.animate([{ transform: 'translateX(-120%)', opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }],
      { duration: 280, easing: 'cubic-bezier(.2,1.2,.4,1)' });
    setTimeout(() => {
      el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' }).onfinish = () => el.remove();
    }, seconds * 1000);
  }
}
