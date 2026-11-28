/**
 * TrackMap - A horizontal strip at the top of the screen showing:
 * - The full track layout
 * - Grinder position (moving indicator)
 * - Defect severity per segment (color-coded)
 * - Completion status per segment (green checkmarks)
 *
 * This tells the player WHERE on the track they are, WHERE defects are,
 * and WHAT still needs work — the "inspection report" before grinding.
 */
import { getPalette, isColorblindMode } from './palette';

export interface SegmentStatus {
  defectSeverity: number;
  grindProgress: number;
  accuracy: number;
  completed: boolean;
  slowOrder?: boolean;     // true = speed restriction active
  /** One-letter damage kind code (W/C/H/G/F), shown on unfinished sections */
  kindCode?: string;
  /** Stars earned (finished sections) */
  stars?: number;
}

export class TrackMap {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private segments: SegmentStatus[] = [];
  private grinderT: number = 0; // 0-1 position along track

  constructor() {
    // Create the canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'track-map';
    this.canvas.width = 600;
    this.canvas.height = 50;
    this.canvas.style.cssText = `
      position: absolute;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.85);
      border: 2px solid #555;
      pointer-events: auto; cursor: help;
      image-rendering: pixelated;
    `;
    document.body.appendChild(this.canvas);

    // Hover a section for details (damage kind, estimated passes, accuracy)
    this.tooltip = document.createElement('div');
    this.tooltip.style.cssText = `position: absolute; z-index: 41; pointer-events: none; display: none;
      background: rgba(0,0,0,0.88); border: 1px solid #555; border-radius: 4px; padding: 6px 9px;
      font-family: var(--ui-mono, monospace); font-size: 10px; color: #ddd; white-space: nowrap;`;
    document.body.appendChild(this.tooltip);
    this.canvas.addEventListener('mousemove', (e) => {
      const r = this.canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) * (this.canvas.width / r.width);
      const count = this.segments.length;
      const i = Math.floor((x - 20) / ((this.canvas.width - 40) / Math.max(1, count)));
      const html = i >= 0 && i < count && this.describe ? this.describe(i) : '';
      if (!html) { this.tooltip.style.display = 'none'; return; }
      this.tooltip.innerHTML = html;
      this.tooltip.style.display = 'block';
      this.tooltip.style.left = `${e.clientX + 12}px`;
      this.tooltip.style.top = `${r.bottom + 6}px`;
    });
    this.canvas.addEventListener('mouseleave', () => { this.tooltip.style.display = 'none'; });
    this.ctx = this.canvas.getContext('2d')!;
  }

  // Redraw-on-change (see draw)
  private dirty = true;
  private lastKey = '';

  private tooltip: HTMLElement;
  /** Game fills this in: HTML describing section i (for the hover tooltip) */
  describe: ((i: number) => string) | null = null;

  /** Initialize with segment count */
  init(segmentCount: number): void {
    this.dirty = true;
    this.segments = [];
    for (let i = 0; i < segmentCount; i++) {
      this.segments.push({
        defectSeverity: 0,
        grindProgress: 0,
        accuracy: 0,
        completed: false,
      });
    }
  }

  /** Update a segment's status */
  updateSegment(index: number, status: Partial<SegmentStatus>): void {
    if (index < 0 || index >= this.segments.length) return;
    const seg = this.segments[index];
    const before = this.visualKey(seg);
    Object.assign(seg, status);
    // While grinding this is called every frame with tiny progress changes;
    // only redraw when the bar would actually look different
    if (this.visualKey(seg) !== before) this.dirty = true;
  }

  /** Everything about a section's bar that shows on screen, as one string */
  private visualKey(seg: SegmentStatus): string {
    const segW = (this.canvas.width - 40) / Math.max(1, this.segments.length);
    const progressPx = Math.round((segW - 2) * seg.grindProgress);
    const colorBand = (seg.kindCode ?? '') + (seg.completed ? 'done'
      : seg.grindProgress > 0.01 ? (seg.accuracy > 0.8 ? 'g' : seg.accuracy > 0.5 ? 'm' : 'p')
      : (seg.defectSeverity > 0.7 ? 's' : seg.defectSeverity > 0.4 ? 'o' : seg.defectSeverity > 0.1 ? 'l' : 'n'));
    const accPx = Math.round((segW - 2) * Math.min(1, seg.accuracy / 0.8));
    return `${colorBand}|${progressPx}|${seg.completed}|${seg.slowOrder}|${accPx}|${seg.stars ?? 0}`;
  }

  /** Update grinder position (0-1 along track) */
  setGrinderPosition(t: number): void {
    this.grinderT = Math.max(0, Math.min(1, t));
  }

  /** Index of nearest unfinished section (-1 if all done) */
  private nextTarget: number = -1;
  setNextTarget(index: number): void { this.nextTarget = index; }

  /** Revenue train position (0-1 along track, -1 if not active) */
  private revenueTrainT: number = -1;
  setRevenueTrainPosition(t: number): void { this.revenueTrainT = t; }

  /** Your best run's position (0..1), or -1 for none — drawn as a pale marker to race */
  private ghostT = -1;
  setGhostPosition(t: number): void {
    if (Math.abs(t - this.ghostT) > 0.001) this.dirty = true;
    this.ghostT = t;
  }

  /**
   * Redraw the map — only when something visible changed: a section's state,
   * the grinder marker moving a pixel, the NEXT arrow blinking, or (while the
   * revenue train is shown) its pulse at 30 fps. Called every frame by Game.
   */
  draw(): void {
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    const count = this.segments.length;
    if (count === 0) return;

    const now = Date.now();
    const trainShown = this.revenueTrainT >= 0 && this.revenueTrainT <= 1;
    const key = `${Math.round(this.grinderT * (width - 40) * 2)}|${this.nextTarget}|`
      + `${Math.sin(now * 0.006) > 0}|${trainShown ? Math.round(this.revenueTrainT * 1000) + ':' + Math.floor(now / 33) : -1}|`
      + `${isColorblindMode()}`;
    if (!this.dirty && key === this.lastKey) return;
    this.dirty = false;
    this.lastKey = key;

    ctx.clearRect(0, 0, width, height);

    const padding = 20;
    const trackW = width - padding * 2;
    const segW = trackW / count;
    const trackY = height / 2;
    const barH = 16;

    // Draw track rail lines
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, trackY - 3);
    ctx.lineTo(padding + trackW, trackY - 3);
    ctx.moveTo(padding, trackY + 3);
    ctx.lineTo(padding + trackW, trackY + 3);
    ctx.stroke();

    // Draw each segment
    for (let i = 0; i < count; i++) {
      const seg = this.segments[i];
      const x = padding + i * segW;

      // Background bar showing defect severity
      // Colours come from the active palette (normal or colour-blind — key C)
      const pal = getPalette();
      let barColor: string;
      if (seg.completed) {
        barColor = pal.mapDone;
      } else if (seg.grindProgress > 0.01) {
        // Being worked on - show accuracy
        const acc = seg.accuracy;
        if (acc > 0.8) barColor = pal.mapWorkGood;
        else if (acc > 0.5) barColor = pal.mapWorkMid;
        else barColor = pal.mapWorkPoor;
      } else {
        // Not started - show defect severity
        const sev = seg.defectSeverity;
        if (sev > 0.7) barColor = pal.mapSevere;
        else if (sev > 0.4) barColor = pal.mapModerate;
        else if (sev > 0.1) barColor = pal.mapLight;
        else barColor = pal.mapNone;
      }

      // Segment bar
      ctx.fillStyle = barColor;
      ctx.fillRect(x + 1, trackY - barH / 2, segW - 2, barH);

      // Quality meter under the bar: fills toward the 80% finish line while you work on it
      if (!seg.completed && seg.grindProgress > 0.01) {
        const q = Math.min(1, seg.accuracy / 0.8);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(x + 1, trackY + barH / 2 + 1, segW - 2, 3);
        ctx.fillStyle = q >= 1 ? pal.mapDone : q > 0.6 ? pal.mapWorkMid : pal.mapWorkPoor;
        ctx.fillRect(x + 1, trackY + barH / 2 + 1, (segW - 2) * q, 3);
      }
      // Finished: one gold pip per star
      if (seg.completed && seg.stars) {
        ctx.fillStyle = '#ffd84a';
        for (let p = 0; p < seg.stars; p++) {
          ctx.fillRect(x + segW / 2 - (seg.stars * 4) / 2 + p * 4, trackY - barH / 2 - 4, 3, 3);
        }
      }

      // Grind progress overlay (darker fill from left)
      if (seg.grindProgress > 0 && !seg.completed) {
        ctx.fillStyle = 'rgba(100, 200, 100, 0.3)';
        ctx.fillRect(x + 1, trackY - barH / 2, (segW - 2) * seg.grindProgress, barH);
      }

      // Segment border
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 1, trackY - barH / 2, segW - 2, barH);

      // Status text
      ctx.font = '7px sans-serif';
      ctx.textAlign = 'center';
      if (seg.completed) {
        ctx.fillStyle = '#fff';
        ctx.fillText('OK', x + segW / 2, trackY + 3);
      } else if (seg.slowOrder) {
        ctx.fillStyle = '#ffcc00';
        ctx.fillText('SLOW', x + segW / 2, trackY + 3);
      }
      // Damage kind letter in the corner of unfinished sections
      if (!seg.completed && seg.kindCode) {
        ctx.font = 'bold 6px monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.textAlign = 'left';
        ctx.fillText(seg.kindCode, x + 3, trackY - barH / 2 + 7);
        ctx.textAlign = 'center';
      }

      // Segment number
      ctx.fillStyle = '#666';
      ctx.font = '6px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${i + 1}`, x + segW / 2, trackY + barH / 2 + 8);
    }

    // Draw grinder position indicator
    const grinderX = padding + this.grinderT * trackW;
    ctx.fillStyle = '#ffaa00';
    // Triangle pointing down
    ctx.beginPath();
    ctx.moveTo(grinderX, trackY - barH / 2 - 2);
    ctx.lineTo(grinderX - 5, trackY - barH / 2 - 9);
    ctx.lineTo(grinderX + 5, trackY - barH / 2 - 9);
    ctx.closePath();
    ctx.fill();

    // Grinder label
    ctx.fillStyle = '#ffaa00';
    ctx.font = '7px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GRINDER', grinderX, trackY - barH / 2 - 11);

    // Next target arrow (blinking)
    if (this.nextTarget >= 0 && this.nextTarget < count) {
      const blink = Math.sin(Date.now() * 0.006) > 0;
      if (blink) {
        const ntX = padding + (this.nextTarget + 0.5) * segW;
        ctx.fillStyle = '#ff8800';
        // Arrow pointing down at the target segment
        ctx.beginPath();
        ctx.moveTo(ntX, trackY + barH / 2 + 4);
        ctx.lineTo(ntX - 4, trackY + barH / 2 + 10);
        ctx.lineTo(ntX + 4, trackY + barH / 2 + 10);
        ctx.closePath();
        ctx.fill();
        ctx.font = '6px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('NEXT', ntX, trackY + barH / 2 + 17);
      }
    }

    // Ghost: where your best run was at this point in time
    if (this.ghostT >= 0 && this.ghostT <= 1) {
      const gx = padding + this.ghostT * trackW;
      ctx.fillStyle = 'rgba(200, 230, 255, 0.55)';
      ctx.beginPath();
      ctx.moveTo(gx, trackY + barH / 2 + 2);
      ctx.lineTo(gx - 4, trackY + barH / 2 + 8);
      ctx.lineTo(gx + 4, trackY + barH / 2 + 8);
      ctx.closePath();
      ctx.fill();
      ctx.font = '6px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BEST', gx, trackY + barH / 2 + 15);
    }

    // Revenue train approaching (red triangle moving along the track)
    if (this.revenueTrainT >= 0 && this.revenueTrainT <= 1) {
      const rtX = padding + this.revenueTrainT * trackW;

      // Danger zone highlight from train to end of track
      ctx.fillStyle = 'rgba(255, 30, 30, 0.06)';
      ctx.fillRect(rtX, trackY - barH / 2 - 1, padding + trackW - rtX, barH + 2);

      // Pulsing red glow around train position
      const pulse = 0.4 + Math.sin(Date.now() * 0.008) * 0.2;
      ctx.fillStyle = `rgba(255, 30, 30, ${pulse * 0.15})`;
      ctx.beginPath(); ctx.arc(rtX, trackY, 14, 0, Math.PI * 2); ctx.fill();

      // Train icon (red triangle pointing left = approaching)
      ctx.fillStyle = `rgba(255, 40, 40, ${pulse + 0.3})`;
      ctx.beginPath();
      ctx.moveTo(rtX - 6, trackY);
      ctx.lineTo(rtX + 4, trackY - 6);
      ctx.lineTo(rtX + 4, trackY + 6);
      ctx.closePath();
      ctx.fill();

      // Label
      ctx.fillStyle = '#ff4444';
      ctx.font = '6px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TRAIN', rtX, trackY - barH / 2 - 12);
    }
  }

  dispose(): void {
    this.canvas.remove();
    this.tooltip.remove();
  }
}
