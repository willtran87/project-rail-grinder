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

export interface SegmentStatus {
  defectSeverity: number;
  grindProgress: number;
  accuracy: number;
  completed: boolean;
  slowOrder?: boolean;     // true = speed restriction active
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
      pointer-events: none;
      image-rendering: pixelated;
    `;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
  }

  /** Initialize with segment count */
  init(segmentCount: number): void {
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
    Object.assign(this.segments[index], status);
  }

  /** Update grinder position (0-1 along track) */
  setGrinderPosition(t: number): void {
    this.grinderT = Math.max(0, Math.min(1, t));
  }

  /** Index of nearest unfinished section (-1 if all done) */
  private nextTarget: number = -1;
  setNextTarget(index: number): void {
    this.nextTarget = index;
  }

  /** Redraw the map */
  draw(): void {
    const { width, height } = this.canvas;
    const ctx = this.ctx;
    const count = this.segments.length;
    if (count === 0) return;

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
      let barColor: string;
      if (seg.completed) {
        barColor = '#22aa44'; // green = done
      } else if (seg.grindProgress > 0.01) {
        // Being worked on - show accuracy
        const acc = seg.accuracy;
        if (acc > 0.8) barColor = '#88cc44';
        else if (acc > 0.5) barColor = '#ccaa22';
        else barColor = '#cc6622';
      } else {
        // Not started - show defect severity
        const sev = seg.defectSeverity;
        if (sev > 0.7) barColor = '#cc2222';
        else if (sev > 0.4) barColor = '#cc6622';
        else if (sev > 0.1) barColor = '#ccaa22';
        else barColor = '#446644';
      }

      // Segment bar
      ctx.fillStyle = barColor;
      ctx.fillRect(x + 1, trackY - barH / 2, segW - 2, barH);

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
  }

  dispose(): void {
    this.canvas.remove();
  }
}
