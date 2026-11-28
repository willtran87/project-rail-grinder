/**
 * CabView - Inside the cab (camera 3): the window frame, wipers that sweep
 * when it rains, and a dashboard with dial gauges (speed, stone heat, stone
 * life) and a grind monitor showing both rail profiles. While it's up, the
 * monitor replaces the usual profile panels (body.cab-view hides them).
 *
 * Plain DOM + one 2D canvas, redrawn ~15 times a second.
 */

export interface CabReadings {
  mph: number;
  heat: number;      // 0..100
  stoneLife: number; // 0..100
  grinding: boolean;
  rain: number;      // 0..1
  snow: boolean;
}

export class CabView {
  private root: HTMLElement;
  private dash: HTMLCanvasElement;
  private wipers: HTMLElement[] = [];
  private visible = false;
  private redraw = 0;
  private wipe = 0;

  constructor() {
    this.root = document.createElement('div');
    this.root.id = 'cab-view';
    this.root.style.cssText = `position: absolute; inset: 0; pointer-events: none; z-index: 12; display: none;`;
    // Window frame: pillars, roof header and the sill
    this.root.innerHTML = `
      <div style="position:absolute; left:0; top:0; bottom:0; width:7%; background: linear-gradient(90deg,#15171b,#262a30);"></div>
      <div style="position:absolute; right:0; top:0; bottom:0; width:7%; background: linear-gradient(270deg,#15171b,#262a30);"></div>
      <div style="position:absolute; left:0; right:0; top:0; height:9%; background: linear-gradient(180deg,#121417,#22262b);"></div>
      <div style="position:absolute; left:49.6%; top:9%; bottom:170px; width:0.8%; background:#1b1e22;"></div>`;
    for (const side of [0, 1]) {
      const w = document.createElement('div');
      w.style.cssText = `position:absolute; bottom:170px; left:${side ? 72 : 24}%; width:5px; height:44%;
        background:#0b0c0e; transform-origin: 50% 100%; border-radius: 3px; opacity: 0.92;`;
      this.root.appendChild(w);
      this.wipers.push(w);
    }
    this.dash = document.createElement('canvas');
    this.dash.width = 960; this.dash.height = 170;
    this.dash.style.cssText = `position:absolute; left:0; bottom:0; width:100%; height:170px;`;
    this.root.appendChild(this.dash);
    document.body.appendChild(this.root);
  }

  setVisible(on: boolean): void {
    if (on === this.visible) return;
    this.visible = on;
    this.root.style.display = on ? 'block' : 'none';
    document.body.classList.toggle('cab-view', on);
  }

  update(dt: number, r: CabReadings): void {
    if (!this.visible) return;
    // Wipers: sweep while it rains or snows, faster in heavy rain
    const wet = Math.max(r.rain, r.snow ? 0.4 : 0);
    if (wet > 0.05) this.wipe += dt * (2 + wet * 3);
    const a = wet > 0.05 ? Math.sin(this.wipe) * 55 : -55;
    this.wipers.forEach((w, i) => { w.style.transform = `rotate(${i ? a : -a}deg)`; });
    this.redraw -= dt;
    if (this.redraw > 0) return;
    this.redraw = 1 / 15;
    this.draw(r);
  }

  private draw(r: CabReadings): void {
    const g = this.dash.getContext('2d');
    if (!g) return;
    const W = this.dash.width, H = this.dash.height;
    const grad = g.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#2a2e34'); grad.addColorStop(1, '#14161a');
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#0d0f12';
    g.fillRect(0, 0, W, 6);
    const dial = (cx: number, label: string, value: number, max: number, unit: string, red: number) => {
      const cy = 95, rad = 58;
      g.fillStyle = '#0a0b0d'; g.beginPath(); g.arc(cx, cy, rad + 6, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#3a3f46'; g.lineWidth = 3; g.stroke();
      const start = Math.PI * 0.75, span = Math.PI * 1.5;
      for (let i = 0; i <= 10; i++) {
        const t = start + span * (i / 10);
        g.strokeStyle = i / 10 >= red ? '#ff5544' : '#c8ccd2';
        g.lineWidth = i % 5 === 0 ? 3 : 1.5;
        g.beginPath();
        g.moveTo(cx + Math.cos(t) * (rad - 4), cy + Math.sin(t) * (rad - 4));
        g.lineTo(cx + Math.cos(t) * (rad - (i % 5 === 0 ? 14 : 9)), cy + Math.sin(t) * (rad - (i % 5 === 0 ? 14 : 9)));
        g.stroke();
      }
      const t = start + span * Math.max(0, Math.min(1, value / max));
      g.strokeStyle = '#ffb020'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(t) * (rad - 12), cy + Math.sin(t) * (rad - 12)); g.stroke();
      g.fillStyle = '#ffb020'; g.beginPath(); g.arc(cx, cy, 5, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#8a9099'; g.font = '11px monospace'; g.textAlign = 'center';
      g.fillText(label, cx, cy + 30);
      g.fillStyle = '#e8eaee'; g.font = 'bold 14px monospace';
      g.fillText(`${Math.round(value)}${unit}`, cx, cy + 46);
    };
    dial(110, 'SPEED', r.mph, 40, ' mph', 0.75);
    dial(250, 'STONE HEAT', r.heat, 100, '%', 0.8);
    dial(W - 110, 'STONE LIFE', r.stoneLife, 100, '%', 2);
    // Grind monitor: both rail profiles, copied from the HUD's displays
    const mx = 340, my = 14, mw = 440, mh = 146;
    g.fillStyle = '#050607'; g.fillRect(mx - 6, my - 4, mw + 12, mh + 8);
    g.strokeStyle = '#3a3f46'; g.lineWidth = 2; g.strokeRect(mx - 6, my - 4, mw + 12, mh + 8);
    const left = document.getElementById('profile-left') as HTMLCanvasElement | null;
    const right = document.getElementById('profile-right') as HTMLCanvasElement | null;
    if (left) g.drawImage(left, mx, my, mw / 2 - 3, mh);
    if (right) g.drawImage(right, mx + mw / 2 + 3, my, mw / 2 - 3, mh);
    g.fillStyle = r.grinding ? '#ff8a30' : '#4a5058';
    g.beginPath(); g.arc(mx + mw - 10, my + 10, 5, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#8a9099'; g.font = '10px monospace'; g.textAlign = 'left';
    g.fillText(r.grinding ? 'GRINDING' : 'STONES UP', mx + 6, my + mh - 6);
  }
}
