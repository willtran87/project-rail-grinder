/**
 * ProfileRenderer - Draws the 2D rail cross-section profile on a canvas overlay.
 *
 * Shows current profile vs target, color-coded deviations, AND the current
 * stone contact position so players can see exactly where they're grinding.
 */

import { RailProfile } from './RailProfile';
import type { TargetProfile } from '../types/rail';

const PADDING = 30;
const LABEL_COLOR = '#888';
const GRID_COLOR = 'rgba(255, 255, 255, 0.08)';
const CURRENT_COLOR = '#ff4444';
const TARGET_COLOR = '#44ff44';
const WITHIN_TOLERANCE_COLOR = '#44ff44';
const CLOSE_COLOR = '#ffaa00';
const OVER_GROUND_COLOR = '#ff0066';
const CONTACT_COLOR = '#ff8800';

export class ProfileRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // Stone contact position
  private stoneX: number = 0;
  private stoneWidth: number = 20;
  private stoneVisible: boolean = false;
  private stoneGrinding: boolean = false; // true = actively grinding, false = just aiming
  private stonePressure: number = 50;

  // Worst zones to highlight
  private worstZones: Array<{ centerX: number; severity: number }> = [];
  private damageCount: number = 0;
  private passCount: number = 0;
  private pulsePhase: number = 0;
  private borderFlash: boolean = false;

  // Preview and before/after
  private previewProfile: RailProfile | null = null;
  private ghostProfile: RailProfile | null = null;
  private ghostAlpha: number = 0;

  /** If true, the profile is drawn mirrored (for the right rail, viewed from the other side) */
  mirrored: boolean = false;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
  }

  /** Set the worst deviation zones for pulsing highlights */
  setWorstZones(zones: Array<{ centerX: number; severity: number }>): void {
    this.worstZones = zones;
  }

  /** Set damage and pass count for display */
  setSegmentInfo(damage: number, passes: number): void {
    this.damageCount = damage;
    this.passCount = passes;
  }

  /** Set a preview profile (what the result would look like after a pass) */
  setPreview(preview: RailProfile | null): void {
    this.previewProfile = preview;
  }

  /** Set the ghost (before) profile for before/after visualization */
  showBeforeAfter(oldProfile: RailProfile): void {
    this.ghostProfile = oldProfile;
    this.ghostAlpha = 0.6;
  }

  /** Flash the border red briefly (over-grind warning) */
  flashBorder(): void {
    this.borderFlash = true;
    setTimeout(() => { this.borderFlash = false; }, 400);
  }

  /** Update the stone contact visualization */
  setStoneContact(centerX: number, width: number, pressure: number, visible: boolean, grinding?: boolean): void {
    this.stoneX = centerX;
    this.stoneWidth = width;
    this.stonePressure = pressure;
    this.stoneVisible = visible;
    this.stoneGrinding = grinding ?? false;
  }

  draw(current: RailProfile, target?: TargetProfile): void {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, width, height);

    const bounds = current.getBounds();
    const rangeX = bounds.maxX - bounds.minX;

    let minY = bounds.minY;
    let maxY = bounds.maxY;
    if (target) {
      for (const p of target.points) {
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
    }
    const marginY = Math.max(0.5, (maxY - minY) * 0.2);
    minY -= marginY;
    maxY += marginY;
    const rangeY = maxY - minY;

    const drawW = width - PADDING * 2;
    const drawH = height - PADDING * 2;
    const toCanvasX = this.mirrored
      ? (x: number) => PADDING + drawW - ((x - bounds.minX) / rangeX) * drawW
      : (x: number) => PADDING + ((x - bounds.minX) / rangeX) * drawW;
    const toCanvasY = (y: number) => PADDING + ((y - minY) / rangeY) * drawH;

    // Draw grid
    this.drawGrid(ctx, bounds.minX, bounds.maxX, minY, maxY, toCanvasX, toCanvasY);

    // Draw stone contact zone (always visible when stone is shown)
    if (this.stoneVisible) {
      this.drawStoneContact(ctx, toCanvasX, toCanvasY, minY, maxY);
    }

    // Draw target profile
    if (target) {
      ctx.strokeStyle = TARGET_COLOR;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      for (let i = 0; i < target.points.length; i++) {
        const cx = toCanvasX(target.points[i].x);
        const cy = toCanvasY(target.points[i].y);
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw ghost (before) profile fading out
    if (this.ghostProfile && this.ghostAlpha > 0.01) {
      ctx.strokeStyle = `rgba(150, 150, 150, ${this.ghostAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      for (let i = 0; i < this.ghostProfile.points.length; i++) {
        const cx = toCanvasX(this.ghostProfile.points[i].x);
        const cy = toCanvasY(this.ghostProfile.points[i].y);
        if (i === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      this.ghostAlpha -= 0.008;
      if (this.ghostAlpha <= 0.01) this.ghostProfile = null;
    }

    // Draw preview profile (what the pass would produce)
    if (this.previewProfile && target) {
      // Shaded area between current and preview
      ctx.fillStyle = 'rgba(255, 170, 0, 0.15)';
      ctx.beginPath();
      for (let i = 0; i < current.points.length && i < this.previewProfile.points.length; i++) {
        const cx = toCanvasX(current.points[i].x);
        const cy = toCanvasY(current.points[i].y);
        if (i === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
      }
      for (let i = this.previewProfile.points.length - 1; i >= 0; i--) {
        ctx.lineTo(
          toCanvasX(this.previewProfile.points[i].x),
          toCanvasY(this.previewProfile.points[i].y)
        );
      }
      ctx.closePath();
      ctx.fill();

      // Preview line (dashed orange)
      ctx.strokeStyle = 'rgba(255, 170, 0, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      for (let i = 0; i < this.previewProfile.points.length; i++) {
        const cx = toCanvasX(this.previewProfile.points[i].x);
        const cy = toCanvasY(this.previewProfile.points[i].y);
        if (i === 0) ctx.moveTo(cx, cy); else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Check if preview would over-grind (any point past target)
      const prevDev = this.previewProfile.compare(target);
      let wouldOvergrind = false;
      for (const d of prevDev.pointDeviations) {
        if (d < -target.tolerance) { wouldOvergrind = true; break; }
      }
      if (wouldOvergrind) {
        ctx.fillStyle = 'rgba(255, 0, 60, 0.15)';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('WARNING: WILL OVER-GRIND', width / 2, height - 8);
      }
    }

    // Draw current profile
    if (target) {
      this.drawColorCodedProfile(ctx, current, target, toCanvasX, toCanvasY);
    } else {
      ctx.strokeStyle = CURRENT_COLOR;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < current.points.length; i++) {
        const cx = toCanvasX(current.points[i].x);
        const cy = toCanvasY(current.points[i].y);
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }

    // Draw pulsing highlights on worst deviation zones
    this.pulsePhase += 0.08;
    for (const zone of this.worstZones) {
      const zx = toCanvasX(zone.centerX);
      const pulse = 0.3 + Math.sin(this.pulsePhase * 3) * 0.2;
      const isOverground = zone.severity < 0;
      ctx.fillStyle = isOverground
        ? `rgba(255, 0, 100, ${pulse})`
        : `rgba(255, 80, 0, ${pulse})`;
      ctx.beginPath();
      ctx.arc(zx, toCanvasY(0), 6, 0, Math.PI * 2);
      ctx.fill();
      // Arrow pointing to the zone
      ctx.fillStyle = isOverground ? '#ff0066' : '#ff5500';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isOverground ? 'OVER!' : 'GRIND', zx, toCanvasY(minY) + 14);
    }

    // Border flash on over-grind
    if (this.borderFlash) {
      ctx.strokeStyle = '#ff0044';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, width - 4, height - 4);
    }

    // Draw labels and legend
    this.drawLabels(ctx, width, current, target);
  }

  /** Draw the stone contact zone — dimmed when aiming, bright when grinding */
  private drawStoneContact(
    ctx: CanvasRenderingContext2D,
    toCanvasX: (x: number) => number,
    toCanvasY: (y: number) => number,
    minY: number, maxY: number
  ): void {
    const left = toCanvasX(this.stoneX - this.stoneWidth / 2);
    const right = toCanvasX(this.stoneX + this.stoneWidth / 2);
    const top = toCanvasY(minY);
    const bottom = toCanvasY(maxY);
    const centerX = toCanvasX(this.stoneX);

    if (this.stoneGrinding) {
      // ACTIVE: bright orange zone
      const alpha = 0.1 + (this.stonePressure / 100) * 0.15;
      ctx.fillStyle = `rgba(255, 136, 0, ${alpha})`;
      ctx.fillRect(left, top, right - left, bottom - top);

      ctx.strokeStyle = CONTACT_COLOR;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(centerX, top);
      ctx.lineTo(centerX, bottom);
      ctx.stroke();

      // Label
      ctx.fillStyle = CONTACT_COLOR;
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GRINDING', centerX, top - 8);

      // Pressure arrow (solid, bright)
      const arrowY = toCanvasY(0);
      const arrowSize = 3 + (this.stonePressure / 100) * 5;
      ctx.fillStyle = CONTACT_COLOR;
      ctx.beginPath();
      ctx.moveTo(centerX, arrowY);
      ctx.lineTo(centerX - arrowSize, arrowY - arrowSize * 1.5);
      ctx.lineTo(centerX + arrowSize, arrowY - arrowSize * 1.5);
      ctx.closePath();
      ctx.fill();
    } else {
      // AIMING: dimmed, dashed outline
      ctx.fillStyle = 'rgba(255, 200, 100, 0.04)';
      ctx.fillRect(left, top, right - left, bottom - top);

      ctx.strokeStyle = 'rgba(255, 180, 80, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(centerX, top);
      ctx.lineTo(centerX, bottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label (dimmed)
      ctx.fillStyle = 'rgba(255, 180, 80, 0.4)';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AIM', centerX, top - 6);

      // Small hollow triangle
      const arrowY = toCanvasY(0);
      ctx.strokeStyle = 'rgba(255, 180, 80, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, arrowY);
      ctx.lineTo(centerX - 4, arrowY - 6);
      ctx.lineTo(centerX + 4, arrowY - 6);
      ctx.closePath();
      ctx.stroke();
    }
  }

  private drawGrid(
    ctx: CanvasRenderingContext2D,
    minX: number, maxX: number,
    minY: number, maxY: number,
    toCanvasX: (x: number) => number,
    toCanvasY: (y: number) => number
  ): void {
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 0.5;
    ctx.font = '9px monospace';
    ctx.fillStyle = LABEL_COLOR;

    for (let x = Math.ceil(minX / 10) * 10; x <= maxX; x += 10) {
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, PADDING);
      ctx.lineTo(cx, this.canvas.height - PADDING);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(`${x}`, cx, this.canvas.height - PADDING + 12);
    }

    const yStep = (maxY - minY) > 5 ? 1 : 0.5;
    for (let y = Math.ceil(minY / yStep) * yStep; y <= maxY; y += yStep) {
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(PADDING, cy);
      ctx.lineTo(this.canvas.width - PADDING, cy);
      ctx.stroke();
      ctx.textAlign = 'left';
      ctx.fillText(`${y.toFixed(1)}`, 2, cy + 3);
    }

    // Axis labels
    ctx.fillStyle = '#555';
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    const gaugeLabel = this.mirrored ? 'FIELD' : 'GAUGE';
    const fieldLabel = this.mirrored ? 'GAUGE' : 'FIELD';
    ctx.fillText(gaugeLabel, toCanvasX(minX + 5), this.canvas.height - 4);
    ctx.fillText(fieldLabel, toCanvasX(maxX - 5), this.canvas.height - 4);
  }

  private drawColorCodedProfile(
    ctx: CanvasRenderingContext2D,
    current: RailProfile,
    target: TargetProfile,
    toCanvasX: (x: number) => number,
    toCanvasY: (y: number) => number
  ): void {
    const deviation = current.compare(target);

    for (let i = 0; i < current.points.length - 1; i++) {
      const dev = Math.abs(deviation.pointDeviations[i]);
      let color: string;
      if (dev <= target.tolerance) {
        color = WITHIN_TOLERANCE_COLOR;
      } else if (dev <= target.tolerance * 3) {
        color = CLOSE_COLOR;
      } else if (deviation.pointDeviations[i] < 0) {
        color = OVER_GROUND_COLOR;
      } else {
        color = CURRENT_COLOR;
      }

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(current.points[i].x), toCanvasY(current.points[i].y));
      ctx.lineTo(toCanvasX(current.points[i + 1].x), toCanvasY(current.points[i + 1].y));
      ctx.stroke();
    }
  }

  private drawLabels(
    ctx: CanvasRenderingContext2D,
    width: number,
    current: RailProfile,
    target?: TargetProfile
  ): void {
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'left';

    let legendY = 15;
    const legendRight = this.mirrored; // mirrored = right rail, put legend on far right
    const legendX = legendRight ? width - 10 : width - 55;
    ctx.textAlign = legendRight ? 'right' : 'left';
    const drawLegend = (color: string, label: string) => {
      if (legendRight) {
        ctx.fillStyle = LABEL_COLOR;
        ctx.fillText(label, legendX - 9, legendY);
        ctx.fillStyle = color;
        ctx.fillRect(legendX - 6, legendY - 6, 6, 6);
      } else {
        ctx.fillStyle = color;
        ctx.fillRect(legendX, legendY - 6, 6, 6);
        ctx.fillStyle = LABEL_COLOR;
        ctx.textAlign = 'left';
        ctx.fillText(label, legendX + 9, legendY);
      }
      legendY += 11;
    };

    if (target) {
      drawLegend(TARGET_COLOR, 'Target');
      drawLegend(WITHIN_TOLERANCE_COLOR, 'Good');
      drawLegend(CLOSE_COLOR, 'Close');
      drawLegend(CURRENT_COLOR, 'Grind');
      drawLegend(OVER_GROUND_COLOR, 'Over!');
      if (this.stoneVisible) {
        drawLegend(CONTACT_COLOR, this.stoneGrinding ? 'Active' : 'Aim');
      }
    }

    ctx.fillStyle = LABEL_COLOR;
    ctx.font = '9px monospace';
    ctx.fillText(`Metal: ${current.metalRemoved.toFixed(2)}mm`, PADDING, 13);
    if (this.passCount > 0) {
      ctx.fillText(`Pass: ${this.passCount}`, PADDING + 110, 13);
    }
    if (this.damageCount > 0) {
      ctx.fillStyle = '#ff0066';
      ctx.fillText(`DMG: ${this.damageCount}`, PADDING + 170, 13);
    }
  }
}
