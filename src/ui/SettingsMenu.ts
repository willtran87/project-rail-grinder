/**
 * SettingsMenu - One place for every option, plus the controls and a short
 * "how grinding works" guide. Opened from the pause menu, the job menu, or H.
 *
 *   SETTINGS     sound levels, graphics, accessibility, controls options
 *   CONTROLS     keyboard and gamepad reference
 *   HOW TO GRIND reading the profile, and the five kinds of damage
 *
 * Plain settings live in core/settings.ts. Graphics quality and the
 * colour-blind palette have their own storage, so Game passes in hooks for those.
 */

import { exportSave, importSave } from '../core/storage';
import { REBINDABLE, KEYMAP_PRESETS, keyLabel, boundKey } from '../core/keymap';
import { getSettings, updateSettings, type Settings } from '../core/settings';
import { DEFECT_KINDS } from '../game/defects';

export interface SettingsHooks {
  getQuality(): string;
  cycleQuality(): void;
  getColorblind(): boolean;
  toggleColorblind(): void;
}

type Tab = 'settings' | 'controls' | 'guide' | 'glossary';

const BUTTON = `background: rgba(255,255,255,0.08); color: var(--ui-text, #ddd); border: 1px solid var(--ui-border, #444);
  font-family: var(--ui-font, sans-serif); font-size: 12px; padding: 6px 12px; border-radius: 4px; cursor: pointer;`;

export class SettingsMenu {
  private overlay: HTMLElement;
  private body: HTMLElement;
  private tab: Tab = 'settings';
  private onClose: (() => void) | null = null;

  constructor(private hooks: SettingsHooks) {
    this.overlay = document.createElement('div');
    this.overlay.id = 'settings-menu';
    this.overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 60; display: none; justify-content: center; align-items: center;
      background: rgba(4,6,12,0.86); font-family: var(--ui-font, sans-serif); color: #e8e8e8;`;
    this.overlay.innerHTML = `
      <div style="width: min(560px, 92vw); max-height: 86vh; overflow: auto; background: #10131c;
        border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 18px 22px;">
        <div style="display:flex; gap:8px; margin-bottom: 14px; align-items:center;">
          <button data-tab="settings" style="${BUTTON}">SETTINGS</button>
          <button data-tab="controls" style="${BUTTON}">CONTROLS</button>
          <button data-tab="guide" style="${BUTTON}">HOW TO GRIND</button>
          <button data-tab="glossary" style="${BUTTON}">GLOSSARY</button>
          <div style="flex:1"></div>
          <button data-close style="${BUTTON}">CLOSE (ESC)</button>
        </div>
        <div data-body></div>
      </div>`;
    document.body.appendChild(this.overlay);
    this.body = this.overlay.querySelector('[data-body]')!;
    this.overlay.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((b) =>
      b.addEventListener('click', () => { this.tab = b.dataset.tab as Tab; this.render(); }));
    this.overlay.querySelector('[data-close]')!.addEventListener('click', () => this.close());
    window.addEventListener('keydown', (e) => {
      if (this.isOpen && e.key === 'Escape') { e.stopImmediatePropagation(); this.close(); }
    }, true);
  }

  get isOpen(): boolean { return this.overlay.style.display !== 'none'; }

  open(tab: Tab = 'settings', onClose?: () => void): void {
    this.tab = tab;
    this.onClose = onClose ?? null;
    this.render();
    this.overlay.style.display = 'flex';
  }

  close(): void {
    this.overlay.style.display = 'none';
    const cb = this.onClose;
    this.onClose = null;
    cb?.();
  }

  private render(): void {
    this.overlay.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((b) => {
      b.style.background = b.dataset.tab === this.tab ? 'var(--ui-accent, #e8a020)' : 'rgba(255,255,255,0.08)';
      b.style.color = b.dataset.tab === this.tab ? '#000' : 'var(--ui-text, #ddd)';
    });
    if (this.tab === 'settings') this.renderSettings();
    else if (this.tab === 'controls') this.renderControls();
    else if (this.tab === 'glossary') this.renderGlossary();
    else this.renderGuide();
  }

  // ---- SETTINGS ----
  private renderSettings(): void {
    const s = getSettings();
    const section = (title: string) => `<div style="margin: 14px 0 6px; font-size: 10px; letter-spacing: 2px; color: #8a8f9c;">${title}</div>`;
    const row = (label: string, control: string, hint = '') => `
      <div style="display:flex; align-items:center; gap: 12px; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
        <div style="flex:1; font-size: 13px;">${label}${hint ? `<div style="font-size:10px; color:#7c8290;">${hint}</div>` : ''}</div>${control}</div>`;
    const slider = (key: keyof Settings) => `<input type="range" min="0" max="1" step="0.05" value="${s[key]}" data-slider="${key}" style="width: 160px;">`;
    const toggle = (key: keyof Settings) => `<button data-toggle="${key}" style="${BUTTON} min-width: 64px;">${s[key] ? 'ON' : 'OFF'}</button>`;
    const choice = (key: keyof Settings, options: Array<[string | number, string]>) =>
      `<select data-choice="${key}" style="${BUTTON}">${options.map(([v, l]) =>
        `<option value="${v}" ${String(s[key]) === String(v) ? 'selected' : ''}>${l}</option>`).join('')}</select>`;

    this.body.innerHTML = `
      ${section('SOUND')}
      ${row('Master volume', slider('masterVolume'))}
      ${row('Effects', slider('effectsVolume'), 'Grinding, engine, alarms, fanfares')}
      ${row('Ambience', slider('ambienceVolume'), 'Birds, wind, rain, crossing bells')}
      ${row('Music', slider('musicVolume'), 'Builds as your combo grows')}
      ${section('GRAPHICS')}
      ${row('Quality', `<button data-quality style="${BUTTON} min-width: 90px;">${this.hooks.getQuality().toUpperCase()}</button>`, 'Lower settings help slower computers (key G)')}
      ${section('ACCESSIBILITY')}
      ${row('Colour-blind palette', `<button data-colorblind style="${BUTTON} min-width: 64px;">${this.hooks.getColorblind() ? 'ON' : 'OFF'}</button>`, 'Key C')}
      ${row('Reduced motion', toggle('reducedMotion'), 'Less camera shake, no freeze-frame on success')}
      ${row('Reduced flashing', toggle('reducedFlashing'), 'No red screen flash on over-grind')}
      ${row('Screen shake', toggle('screenShake'), 'Off: the camera never shakes')}
      ${row('Sound captions', toggle('captions'), 'Short captions for alarms, horns, thunder and other important sounds')}
      ${row('Text & panel size', choice('uiScale', [[1, '100%'], [1.25, '125%'], [1.5, '150%'], [1.75, '175%'], [2, '200%']]))}
      ${row('Game speed', choice('gameSpeed', [[1, 'Normal'], [0.85, 'Relaxed (85%)'], [0.7, 'Slow (70%)']]), 'Slows the whole game, deadlines included')}
      ${section('CONTROLS')}
      ${row('Grinding', choice('grindMode', [['hold', 'Hold to grind'], ['toggle', 'Press to toggle']]))}
      ${row('Simple profile display', toggle('simpleProfile'), 'Big "aim here" marker, fewer lines (key V)')}
      ${row('Control hints', toggle('hints'), 'Short tips for the controls that matter right now')}
      ${row('Controller vibration', toggle('rumble'))}
      ${section('SAVE')}
      ${row('Back up your progress', `<button data-export style="${BUTTON}">EXPORT</button> <button data-import style="${BUTTON}">IMPORT</button>`,
        'Progress lives in this browser: export a file to keep it safe or move it to another computer')}
      <div id="save-msg" style="font-size: 11px; color: #8ad0ff; min-height: 14px; margin-top: 4px;"></div>`;

    this.body.querySelectorAll<HTMLInputElement>('[data-slider]').forEach((el) =>
      el.addEventListener('input', () => updateSettings({ [el.dataset.slider!]: Number(el.value) } as Partial<Settings>)));
    this.body.querySelectorAll<HTMLButtonElement>('[data-toggle]').forEach((el) =>
      el.addEventListener('click', () => {
        const key = el.dataset.toggle as keyof Settings;
        updateSettings({ [key]: !getSettings()[key] } as Partial<Settings>);
        this.render();
      }));
    this.body.querySelectorAll<HTMLSelectElement>('[data-choice]').forEach((el) =>
      el.addEventListener('change', () => {
        const key = el.dataset.choice as keyof Settings;
        const v = isNaN(Number(el.value)) ? el.value : Number(el.value);
        updateSettings({ [key]: v } as Partial<Settings>);
      }));
    this.body.querySelector('[data-quality]')!.addEventListener('click', () => { this.hooks.cycleQuality(); this.render(); });
    this.body.querySelector('[data-colorblind]')!.addEventListener('click', () => { this.hooks.toggleColorblind(); this.render(); });
    const msg = this.body.querySelector('#save-msg') as HTMLElement;
    this.body.querySelector('[data-export]')!.addEventListener('click', () => {
      const url = URL.createObjectURL(new Blob([exportSave()], { type: 'application/json' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `staying-on-track-save-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      msg.textContent = 'Save exported.';
    });
    this.body.querySelector('[data-import]')!.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json,application/json';
      input.addEventListener('change', async () => {
        const file = input.files?.[0];
        if (!file) return;
        if (!confirm('Replace your current progress with this backup?')) return;
        const res = importSave(await file.text());
        if (typeof res === 'string') { msg.textContent = res; return; }
        msg.textContent = `Restored ${res} saved items — reloading…`;
        setTimeout(() => location.reload(), 800);
      });
      input.click();
    });
  }

  // ---- CONTROLS ----
  private renderControls(): void {
    const rows: Array<[string, string, string]> = [
      ['Grind (stones down)', 'SPACE', '(A)'],
      ['Drive forward / back', 'W / S', 'RT / LT'],
      ['Fast travel (not grinding)', 'hold SHIFT', '(B)'],
      ['Left stone angle', 'Q / E', 'left stick ←/→'],
      ['Left stone pressure', 'A / D', 'left stick ↓/↑'],
      ['Right stone angle', 'U / O', 'right stick ←/→'],
      ['Right stone pressure', 'J / L', 'right stick ↓/↑'],
      ['Camera views (6 = director)', '1 – 6', '(Y) next view'],
      ['Spray water at a fire', 'hold X', '(X)'],
      ['Change worn stones (stopped)', 'hold Z', 'hold RB'],
      ['Ask dispatch to hold the train', 'T', 'LB'],
      ['Grinding speed (while grinding)', 'W / S', 'RT / LT'],
      ['Pause', 'ESC', 'START'],
      ['Settings & help', 'H', '—'],
      ['Photo mode', 'F', '—'],
      ['Time of day / weather', 'N / P', '—'],
      ['Graphics quality', 'G', '—'],
      ['Colour-blind palette', 'C', '—'],
      ['Simple / detailed profile', 'V', '—'],
      ['Mute', 'M', '—'],
      ['Restart job', 'R', '—'],
      ['FPS counter', '` (backtick)', '—'],
    ];
    const km = getSettings().keymap;
    this.body.innerHTML = `
      <div style="font-size: 10px; letter-spacing: 2px; color: #8a8f9c; margin-bottom: 6px;">REBIND KEYS — click a key, then press the new one (ESC cancels)</div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 4px 14px; margin-bottom: 8px; font-size: 12px;">
        ${REBINDABLE.map((r) => `<div style="display:flex; justify-content: space-between; align-items: center;">
          <span>${r.label}</span>
          <button data-bind="${r.action === ' ' ? 'space' : r.action}" style="min-width: 64px; font-family: var(--ui-mono, monospace); font-size: 11px;
            background: ${km[r.action] ? 'rgba(232,160,32,0.25)' : 'rgba(255,255,255,0.08)'}; color: #ffcc55; border: 1px solid #555;
            border-radius: 3px; padding: 2px 6px; cursor: pointer;">${keyLabel(boundKey(km, r.action))}</button></div>`).join('')}
      </div>
      <div style="display:flex; gap: 8px; margin-bottom: 14px;">
        ${Object.entries(KEYMAP_PRESETS).map(([id, p]) => `<button data-preset="${id}" style="font-size: 11px; background: rgba(255,255,255,0.08);
          color: #ddd; border: 1px solid #555; border-radius: 3px; padding: 4px 10px; cursor: pointer;">${p.name}</button>`).join('')}
      </div>
      <table style="width:100%; border-collapse: collapse; font-size: 13px;">
        <tr style="color:#8a8f9c; font-size:10px; letter-spacing:2px;"><td style="padding:4px 0">ACTION</td><td>KEYBOARD (DEFAULT)</td><td>GAMEPAD</td></tr>
        ${rows.map(([a, k, p]) => `<tr style="border-top: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 5px 0;">${a}</td>
          <td style="font-family: var(--ui-mono, monospace); color: #ffcc55;">${k}</td>
          <td style="font-family: var(--ui-mono, monospace); color: #8ad0ff;">${p}</td></tr>`).join('')}
      </table>`;
    this.body.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach((b) => b.addEventListener('click', () => {
      updateSettings({ keymap: { ...KEYMAP_PRESETS[b.dataset.preset!].map } });
      this.renderControls();
    }));
    this.body.querySelectorAll<HTMLButtonElement>('[data-bind]').forEach((b) => b.addEventListener('click', () => {
      const action = b.dataset.bind === 'space' ? ' ' : b.dataset.bind!;
      b.textContent = 'press…';
      const grab = (e: KeyboardEvent) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.removeEventListener('keydown', grab, true);
        if (e.key !== 'Escape') {
          const key = /^Digit\d$/.test(e.code) ? e.code.slice(5) : e.key.toLowerCase();
          const map = { ...getSettings().keymap };
          // Whoever had this key before gets this action's old key (a swap)
          const old = boundKey(map, action);
          for (const r of REBINDABLE) if (r.action !== action && boundKey(map, r.action) === key) map[r.action] = old;
          map[action] = key;
          for (const k of Object.keys(map)) if (map[k] === k) delete map[k];
          updateSettings({ keymap: map });
        }
        this.renderControls();
      };
      window.addEventListener('keydown', grab, true);
    }));
  }

  // ---- HOW TO GRIND ----
  /** What the words mean (also reachable from the pause menu) */
  private renderGlossary(): void {
    const terms: [string, string][] = [
      ['RQI', 'Rail Quality Index, 0–100: how close the whole route is to the target shape. Your job stars come from it.'],
      ['Profile', 'The shape of the rail head, seen end-on. The two displays show it for each rail; the dashed line is the target.'],
      ['Tolerance', 'How far from the target a point may be and still count as good. A section passes when 80% of every stretch is in tolerance.'],
      ['Over-grind', 'Cutting below the target. Metal can\'t be put back: it costs stars and breaks your combo.'],
      ['Gauge side / field side', 'The inside edge of the rail (where the wheel flanges run) and the outside edge.'],
      ['Gauge corner', 'The rounded inside corner of the rail head, where head checks start.'],
      ['General wear', 'Several humps across the head. Sweep the stone angle from one to the next.'],
      ['Corrugation', 'Short ripples along the rail. Grind it with light pressure — heavy pressure makes the stones chatter.'],
      ['Head checks', 'Fine cracks at the gauge corner. Aim at the corner with high pressure.'],
      ['Gauge-face wear', 'Metal worn off the inside face. Tilt the stone all the way to reach it.'],
      ['Flattened crown', 'The top of the rail crushed flat and wide. Light pressure, centred on the crown.'],
      ['Running band', 'The shiny strip where the wheels ride. Narrow and centred means a good profile.'],
      ['Stone angle / pressure', 'Angle moves where the stone touches; pressure sets how deep and narrow it cuts. Pressure at 0 lifts that stone.'],
      ['Hot cut', 'Stones between 60% and 80% heat cut 25% faster. Over 80% they glaze and cut badly.'],
      ['Stone grade', 'Coarse cuts fast but rough, fine is slow but leaves a fine finish. Press I to choose the next set, hold Z (stopped) to fit it.'],
      ['Mirror finish', 'A section finished on fine stones, very accurately: extra pay.'],
      ['Perfect pass', 'A section finished in one pass, 90%+ accurate, no over-grind, no overheating.'],
      ['Combo', 'Three-star sections in a row. It multiplies section bonuses, up to ×3.'],
      ['Slow order', 'A speed limit (10 mph) on a damaged section, lifted when you fix it.'],
      ['Revenue train', 'The next scheduled train. Clear sections before it arrives, or ask dispatch to hold it (T).'],
      ['Switch / frog', 'Where a track branches off. Lift the stones over it or they strike the points and the frog.'],
      ['Quiet zone', 'Near a town at night: keep the pressure under 60% or there\'s a noise complaint.'],
      ['Hi-rail truck', 'A road truck that can also run on the rails: the work crews arrive in one.'],
    ];
    this.body.innerHTML = `<div style="font-size: 13px; line-height: 1.5; color: #d6d6d6;">
      ${terms.map(([t, d]) => `<div style="padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <b style="color:#ffcc55;">${t}</b> — ${d}</div>`).join('')}</div>`;
  }

  private renderGuide(): void {
    const kinds = Object.values(DEFECT_KINDS).map((k) =>
      `<li style="margin: 4px 0;"><b style="color:#ffcc55;">${k.name}</b> — ${k.tip}</li>`).join('');
    this.body.innerHTML = `
      <div style="font-size: 13px; line-height: 1.55; color: #d6d6d6;">
        <p><b>The goal:</b> bring each 20 m section of both rails back to the target shape (the dashed line on the
        two profile displays). A section passes when every stretch of both rails is within tolerance.</p>
        <p><b>Reading the profile:</b> <span style="color:#7dff8a">green</span> is good, <span style="color:#ffcc44">amber</span>
        is close, <span style="color:#ff8844">orange</span> still needs grinding, <span style="color:#ff3366">pink</span> is over-ground
        (you cut too deep — that can't be undone). The pulsing dot marks the worst spot.</p>
        <p><b>Aim and pressure:</b> the stone angle moves where it touches the rail head. More pressure cuts deeper
        through a narrower patch; less pressure is wider and gentler. Hearing a bright <i>tink</i> means you're right on the worst spot.</p>
        <p><b>Heat:</b> pressure heats the stones. Between 60% and 80% (the marked band) they cut 25% faster — but go past
        80% and they glaze over, cut half as well, and your combo is gone.</p>
        <p><b>Scoring:</b> finish a section in one clean pass, very accurately, without overheating, for a
        <span style="color:#ffd84a">PERFECT PASS</span>. Three-star sections in a row build a <b>combo</b> that multiplies
        your bonus pay. Over-grinding or overheating breaks it.</p>
        <p style="margin-bottom:4px;"><b>Kinds of damage</b> (shown above the profile displays):</p>
        <ul style="margin-top:0; padding-left: 18px;">${kinds}</ul>
      </div>`;
  }
}
