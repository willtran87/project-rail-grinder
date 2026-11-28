/**
 * InspectionReport - Pre-job and post-job report screens.
 *
 * Pre-job: Shows the VISTA inspection results — defect locations,
 * severity breakdown, RQI (Rail Quality Index), and required work.
 * Displayed before grinding begins so the operator knows what to expect.
 *
 * Post-job: Shows work performed — segments completed, accuracy per
 * segment, final RQI, track restored, time, metal removed, and a grade.
 *
 * RQI = Rail Quality Index (0-100). Computed from average profile
 * deviation across all sections. 100 = perfect profile match.
 */

import { STONE_GRADES, type StoneGrade } from '../game/depth';

/** What the player chose before a job */
export interface JobPlan { stone: StoneGrade; plan: number }
/** Extra lines for the pre-job report */
export interface PlanOptions { estimate: number; profileName: string; profileTip: string; notes: string[] }

import type { TargetProfile, ProfileDeviation } from '../types/rail';
import type { RailTrack } from '../rail/RailTrack';

export interface SectionReport {
  index: number;
  defectType: string;
  severity: string;
  severityValue: number;
  deviation: ProfileDeviation;
  rqi: number;
  rqiLeft: number;
  rqiRight: number;
}

export interface JobReport {
  sections: SectionReport[];
  overallRQI: number;
  totalSections: number;
  criticalCount: number;
  moderateCount: number;
  lightCount: number;
  trackLengthFt: number;
}

export interface CompletionReport extends JobReport {
  sectionsCompleted: number;
  trackRestoredFt: number; // repurposed as track restored (ft)
  elapsedTime: number;    // seconds
  metalRemoved: number;   // mm
  stars: number;          // 1-5
  rqiBefore: number;
  rqiAfter: number;
  missedWindows: number;  // revenue trains that arrived with no sections cleared
  newBest: boolean;       // beat the saved personal best for this job
  pay: number;            // contract pay earned (career mode)
  contractPay?: number;   // the contract part of `pay`
  bonusPay?: number;      // perfect-pass / combo bonuses part of `pay`
  perfects?: number;      // sections finished with a perfect pass
  bestCombo?: number;     // longest 3-star streak
  grade?: string;         // S / A / B / C / D
  /** Personal best before this run (for the comparison line), if any */
  prevBest?: { stars: number; rqi: number; time: number };
  /** Name of the contract suggested next (shown on the NEXT button) */
  nextJobName?: string;
  /** Place this run takes on the contract's leaderboard (0 = top), or -1 */
  boardRank?: number;
  /** Called with the initials typed for the leaderboard */
  onInitials?: (initials: string) => void;
  /** One left-rail profile per section, before and after (for the scrubber) */
  profiles?: { before: { x: number; y: number }[]; after: { x: number; y: number }[] }[];
  /** The target profile, drawn behind the scrubber */
  target?: { x: number; y: number }[];
  /** The closest unlock, shown under the buttons */
  nextGoal?: string;
  /** Make and share the result card; resolves with what happened */
  onShare?: () => Promise<string>;
}

/** What the player chose on the results screen */
export type ReportAction = 'next' | 'replay';

const DEFECT_NAMES = [
  'Gauge Corner Wear',
  'Running Surface Fatigue',
  'Corrugation',
  'Field Side Wear',
];

export class InspectionReport {
  private overlay: HTMLElement;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'report-overlay';
    this.overlay.style.cssText = `
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 5, 0, 0.95);
      display: none;
      justify-content: center;
      align-items: flex-start;
      overflow-y: auto;
      z-index: 40;
      font-family: 'Press Start 2P', monospace;
      color: #ccc;
    `;
    document.body.appendChild(this.overlay);
  }

  /** Compute section reports from track data — analyzes BOTH rails */
  computeJobReport(track: RailTrack, target: TargetProfile): JobReport {
    const sections: SectionReport[] = [];
    let totalRQI = 0;
    let critical = 0, moderate = 0, light = 0;

    for (let sec = 0; sec < track.sectionCount; sec++) {
      const visSegs = track.getSegmentsForSection(sec);
      if (visSegs.length === 0) continue;

      // Analyze both rails independently
      let totalDevLeft = 0, totalDevRight = 0;
      let devCount = 0;
      let worstDev: ProfileDeviation | null = null;

      for (const vi of visSegs) {
        for (const rail of ['left', 'right'] as const) {
          const profile = track.getProfile(vi, rail);
          const dev = profile.compare(target);
          if (rail === 'left') totalDevLeft += dev.averageDeviation;
          else totalDevRight += dev.averageDeviation;
          if (!worstDev || dev.averageDeviation > worstDev.averageDeviation) {
            worstDev = dev;
          }
        }
        devCount++;
      }

      const avgDevLeft = devCount > 0 ? totalDevLeft / devCount : 0;
      const avgDevRight = devCount > 0 ? totalDevRight / devCount : 0;
      const avgDev = Math.max(avgDevLeft, avgDevRight); // worst of the two rails
      const rqiLeft = Math.max(0, Math.min(100, 100 - avgDevLeft * 500));
      const rqiRight = Math.max(0, Math.min(100, 100 - avgDevRight * 500));
      const rqi = Math.min(rqiLeft, rqiRight); // section RQI = worst rail

      const pattern = sec % 4;
      const defectType = DEFECT_NAMES[pattern];
      const severityValue = avgDev;

      let severity: string;
      if (avgDev > 0.15) { severity = 'CRITICAL'; critical++; }
      else if (avgDev > 0.08) { severity = 'MODERATE'; moderate++; }
      else if (avgDev > 0.02) { severity = 'LIGHT'; light++; }
      else { severity = 'GOOD'; }

      totalRQI += rqi;

      sections.push({
        index: sec,
        defectType,
        severity,
        severityValue,
        deviation: worstDev!,
        rqi,
        rqiLeft,
        rqiRight,
      });
    }

    return {
      sections,
      overallRQI: totalRQI / Math.max(1, sections.length),
      totalSections: track.sectionCount,
      criticalCount: critical,
      moderateCount: moderate,
      lightCount: light,
      trackLengthFt: Math.round(track.totalLength * 3.281),
    };
  }

  /**
   * Show the pre-job inspection report, with the stone-grade choice and the
   * grind plan. Resolves with the player's choices when they click START.
   */
  showPreJobReport(report: JobReport, opts: PlanOptions = { estimate: 0, profileName: '', profileTip: '', notes: [] }): Promise<JobPlan> {
    return new Promise((resolve) => {
      let stone: StoneGrade = 'standard';
      let plan = opts.estimate;
      const rqiColor = report.overallRQI > 70 ? '#44ff44' : report.overallRQI > 40 ? '#ffaa00' : '#ff4444';

      let sectionRows = '';
      for (const sec of report.sections) {
        const sevColor = sec.severity === 'CRITICAL' ? '#ff4444' :
                         sec.severity === 'MODERATE' ? '#ffaa00' :
                         sec.severity === 'LIGHT' ? '#aaaa44' : '#44ff44';
        const rqiLC = sec.rqiLeft > 70 ? '#44ff44' : sec.rqiLeft > 40 ? '#ffaa00' : '#ff4444';
        const rqiRC = sec.rqiRight > 70 ? '#44ff44' : sec.rqiRight > 40 ? '#ffaa00' : '#ff4444';

        sectionRows += `
          <tr>
            <td style="color: #888;">${sec.index + 1}</td>
            <td>${sec.defectType}</td>
            <td style="color: ${sevColor};">${sec.severity}</td>
            <td style="color: ${rqiLC};">${sec.rqiLeft.toFixed(0)}</td>
            <td style="color: ${rqiRC};">${sec.rqiRight.toFixed(0)}</td>
            <td>${sec.deviation.averageDeviation.toFixed(3)}mm</td>
          </tr>
        `;
      }

      this.overlay.innerHTML = `
        <div style="max-width: 750px; padding: 30px 40px; margin: 20px auto;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="color: #44ff44; font-size: 8px; letter-spacing: 3px; margin-bottom: 8px;">VISTA INSPECTION SYSTEM</div>
            <div style="color: #ffaa00; font-size: 16px; margin-bottom: 4px;">PRE-GRIND REPORT</div>
            <div style="color: #666; font-size: 7px;">TRACK SECTION ANALYSIS</div>
          </div>

          <div style="display: flex; gap: 20px; margin-bottom: 20px; justify-content: center;">
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 12px 18px; border: 1px solid #333;">
              <div style="font-size: 7px; color: #888; letter-spacing: 2px;">RAIL QUALITY INDEX</div>
              <div style="font-size: 24px; color: ${rqiColor}; margin-top: 4px;">${report.overallRQI.toFixed(0)}</div>
              <div style="font-size: 7px; color: #666;">/ 100</div>
            </div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 12px 18px; border: 1px solid #333;">
              <div style="font-size: 7px; color: #888; letter-spacing: 2px;">TRACK LENGTH</div>
              <div style="font-size: 18px; color: #fff; margin-top: 4px;">${report.trackLengthFt}</div>
              <div style="font-size: 7px; color: #666;">FEET</div>
            </div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 12px 18px; border: 1px solid #333;">
              <div style="font-size: 7px; color: #888; letter-spacing: 2px;">SECTIONS</div>
              <div style="font-size: 18px; color: #fff; margin-top: 4px;">${report.totalSections}</div>
              <div style="font-size: 7px; color: #666;">TOTAL</div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; margin-bottom: 20px; justify-content: center;">
            <div style="font-size: 8px;">
              <span style="color: #ff4444;">&#9632;</span> CRITICAL: <span style="color: #ff4444;">${report.criticalCount}</span>
            </div>
            <div style="font-size: 8px;">
              <span style="color: #ffaa00;">&#9632;</span> MODERATE: <span style="color: #ffaa00;">${report.moderateCount}</span>
            </div>
            <div style="font-size: 8px;">
              <span style="color: #aaaa44;">&#9632;</span> LIGHT: <span style="color: #aaaa44;">${report.lightCount}</span>
            </div>
          </div>

          <div style="font-size: 7px; color: #44ff44; letter-spacing: 2px; margin-bottom: 8px;">SECTION BREAKDOWN</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 7px; line-height: 2.5;">
            <thead>
              <tr style="color: #666; border-bottom: 1px solid #333;">
                <th style="text-align: left; padding: 4px;">SEC</th>
                <th style="text-align: left;">DEFECT TYPE</th>
                <th style="text-align: left;">SEVERITY</th>
                <th style="text-align: left;">RQI L</th>
                <th style="text-align: left;">RQI R</th>
                <th style="text-align: left;">DEVIATION</th>
              </tr>
            </thead>
            <tbody>
              ${sectionRows}
            </tbody>
          </table>

          <div style="text-align: center; margin-top: 24px;">
            <div style="color: #888; font-size: 7px; margin-bottom: 8px;">
              OBJECTIVE: Grind all sections to RQI > 80
            </div>
            ${opts.profileName ? `<div style="color: #8ad0ff; font-size: 7px; margin-bottom: 12px;">TARGET PROFILE: ${opts.profileName.toUpperCase()} — ${opts.profileTip}</div>` : ''}
            ${opts.notes.map((n) => `<div style="color: #ffcc55; font-size: 7px; margin-bottom: 6px;">${n}</div>`).join('')}
            <div style="display: flex; gap: 22px; justify-content: center; align-items: flex-start; margin: 14px 0 6px; font-size: 7px; color: #aaa;">
              <div>
                <div style="margin-bottom: 6px; letter-spacing: 2px;">STONE GRADE</div>
                <div id="stone-grades" style="display: flex; gap: 4px;">
                  ${(['coarse', 'standard', 'fine'] as StoneGrade[]).map((g) => `<button data-grade="${g}" title="${STONE_GRADES[g].desc}"
                    style="font-family: inherit; font-size: 8px; padding: 6px 10px; cursor: pointer; background: ${g === 'standard' ? '#ffaa00' : '#222'};
                    color: ${g === 'standard' ? '#000' : '#ccc'}; border: 1px solid #555;">${STONE_GRADES[g].name.toUpperCase()}</button>`).join('')}
                </div>
                <div id="stone-desc" style="margin-top: 6px; max-width: 260px; color: #888;">${STONE_GRADES.standard.desc}</div>
              </div>
              ${opts.estimate > 0 ? `<div>
                <div style="margin-bottom: 6px; letter-spacing: 2px;">GRIND PLAN</div>
                <div style="display: flex; gap: 6px; align-items: center; justify-content: center;">
                  <button data-plan="-1" style="font-family: inherit; font-size: 10px; width: 26px; cursor: pointer; background:#222; color:#ccc; border:1px solid #555;">−</button>
                  <span id="plan-value" style="font-size: 12px; color: #fff; min-width: 34px;">${plan}</span>
                  <button data-plan="1" style="font-family: inherit; font-size: 10px; width: 26px; cursor: pointer; background:#222; color:#ccc; border:1px solid #555;">+</button>
                </div>
                <div style="margin-top: 6px; max-width: 220px; color: #888;">Passes for the whole job (estimate ${opts.estimate}). Stay within it for a bonus — tighter plans pay more.</div>
              </div>` : ''}
            </div>
            <button id="report-start-btn" style="
              background: #ffaa00; color: #000; border: none;
              font-family: 'Press Start 2P', monospace; font-size: 10px;
              padding: 12px 32px; cursor: pointer; margin-top: 8px;
            ">BEGIN GRINDING</button>
          </div>
        </div>
      `;

      this.overlay.style.display = 'flex';

      this.overlay.querySelectorAll<HTMLButtonElement>('[data-grade]').forEach((b) => b.addEventListener('click', () => {
        stone = b.dataset.grade as StoneGrade;
        this.overlay.querySelectorAll<HTMLButtonElement>('[data-grade]').forEach((o) => {
          const on = o === b;
          o.style.background = on ? '#ffaa00' : '#222';
          o.style.color = on ? '#000' : '#ccc';
        });
        document.getElementById('stone-desc')!.textContent = STONE_GRADES[stone].desc;
      }));
      this.overlay.querySelectorAll<HTMLButtonElement>('[data-plan]').forEach((b) => b.addEventListener('click', () => {
        plan = Math.max(Math.ceil(opts.estimate * 0.5), Math.min(opts.estimate * 2, plan + Number(b.dataset.plan)));
        document.getElementById('plan-value')!.textContent = String(plan);
      }));
      document.getElementById('report-start-btn')!.addEventListener('click', () => {
        this.overlay.style.display = 'none';
        resolve({ stone, plan: opts.estimate > 0 ? plan : 0 });
      }, { once: true });
    });
  }

  /**
   * Before/after scrubber: drag from the damaged profile to the finished one
   * (the curve is blended between the two), against the green target.
   */
  private bindScrubber(report: CompletionReport): void {
    const canvas = document.getElementById('scrub-canvas') as HTMLCanvasElement | null;
    const sel = document.getElementById('scrub-section') as HTMLSelectElement | null;
    const range = document.getElementById('scrub-t') as HTMLInputElement | null;
    if (!canvas || !sel || !range || !report.profiles) return;
    const ctx = canvas.getContext('2d')!;
    const draw = () => {
      const p = report.profiles![Number(sel.value)];
      const t = Number(range.value) / 100;
      const W = canvas.width, H = canvas.height;
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, W, H);
      const all = [...p.before, ...p.after, ...(report.target ?? [])];
      const minX = Math.min(...all.map((q) => q.x)), maxX = Math.max(...all.map((q) => q.x));
      // Only the top of the rail head matters: zoom on the y range near the crown
      const ys = all.filter((q) => Math.abs(q.x) < 32).map((q) => q.y);
      const minY = Math.min(...ys) - 0.1, maxY = Math.min(Math.max(...ys), minY + 3) + 0.1;
      const sx = (x: number) => ((x - minX) / (maxX - minX)) * (W - 20) + 10;
      const sy = (y: number) => ((y - minY) / (maxY - minY)) * (H - 20) + 10;
      const line = (pts: { x: number; y: number }[], color: string, w: number) => {
        ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath();
        pts.forEach((q, i) => (i ? ctx.lineTo(sx(q.x), sy(q.y)) : ctx.moveTo(sx(q.x), sy(q.y))));
        ctx.stroke();
      };
      if (report.target) line(report.target, 'rgba(68,255,68,0.6)', 1);
      line(p.before, 'rgba(255,80,60,0.35)', 1);
      line(p.before.map((q, i) => ({ x: q.x, y: q.y + ((p.after[i]?.y ?? q.y) - q.y) * t })), '#ffcc55', 2);
    };
    sel.addEventListener('change', draw);
    range.addEventListener('input', draw);
    draw();
  }

  /** Show the post-job completion report */
  showCompletionReport(report: CompletionReport): Promise<ReportAction> {
    return new Promise((resolve) => {
      const minutes = Math.floor(report.elapsedTime / 60);
      const seconds = Math.floor(report.elapsedTime % 60);

      const rqiBeforeColor = report.rqiBefore > 70 ? '#44ff44' : report.rqiBefore > 40 ? '#ffaa00' : '#ff4444';
      const rqiAfterColor = report.rqiAfter > 70 ? '#44ff44' : report.rqiAfter > 40 ? '#ffaa00' : '#ff4444';
      const rqiImprovement = report.rqiAfter - report.rqiBefore;
      const improvColor = rqiImprovement > 0 ? '#44ff44' : '#ff4444';

      const starStr = '\u2605'.repeat(report.stars) + '\u2606'.repeat(5 - report.stars);

      // Grade: the skill grade (game/scoring.ts) if we have one, else from RQI
      const grade = report.grade ?? (report.rqiAfter >= 95 ? 'A+' :
                    report.rqiAfter >= 90 ? 'A' :
                    report.rqiAfter >= 80 ? 'B' :
                    report.rqiAfter >= 70 ? 'C' :
                    report.rqiAfter >= 60 ? 'D' : 'F');
      const gradeColor = grade === 'S' ? '#ffd84a' : grade.startsWith('A') ? '#44ff44' :
                         grade === 'B' ? '#88cc44' :
                         grade === 'C' ? '#ffaa00' : '#ff4444';

      let sectionRows = '';
      for (const sec of report.sections) {
        const rqiLC = sec.rqiLeft > 80 ? '#44ff44' : sec.rqiLeft > 60 ? '#ffaa00' : '#ff4444';
        const rqiRC = sec.rqiRight > 80 ? '#44ff44' : sec.rqiRight > 60 ? '#ffaa00' : '#ff4444';
        sectionRows += `
          <tr>
            <td style="color: #888;">${sec.index + 1}</td>
            <td>${sec.defectType}</td>
            <td style="color: ${rqiLC};">${sec.rqiLeft.toFixed(0)}</td>
            <td style="color: ${rqiRC};">${sec.rqiRight.toFixed(0)}</td>
            <td>${sec.deviation.averageDeviation.toFixed(3)}mm</td>
          </tr>
        `;
      }

      this.overlay.innerHTML = `
        <div style="max-width: 750px; padding: 30px 40px; margin: 20px auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="color: #44ff44; font-size: 8px; letter-spacing: 3px; margin-bottom: 8px;">GRINDING OPERATION COMPLETE</div>
            <div style="color: #ffaa00; font-size: 16px; margin-bottom: 4px;">POST-GRIND REPORT</div>
            <div style="display:flex; justify-content:center; align-items:center; gap: 28px; margin: 14px 0 6px;">
              <div id="report-grade" style="font-size: 56px; color: ${gradeColor}; text-shadow: 0 0 18px ${gradeColor}55; opacity: 0;">${grade}</div>
              <div style="text-align:left;">
                <div id="report-stars" style="font-size: 26px; color: #ffdd00; letter-spacing: 2px;">${[...starStr].map((c) => `<span style="opacity:0">${c}</span>`).join('')}</div>
                ${report.newBest ? `<div style="font-size: 9px; color: #44ff44; letter-spacing: 3px; margin-top: 4px;">&#9733; NEW PERSONAL BEST &#9733;</div>` : ''}
                ${report.prevBest && !report.newBest ? `<div style="font-size: 8px; color: #888; margin-top: 4px;">BEST: ${'&#9733;'.repeat(report.prevBest.stars)} · RQI ${report.prevBest.rqi.toFixed(0)}</div>` : ''}
              </div>
            </div>
            <div style="display:inline-grid; grid-template-columns: auto auto; gap: 4px 18px; font-size: 10px; text-align: right; margin: 8px 0 4px;">
              <span style="color:#888; text-align:left;">CONTRACT</span><span data-count="${report.contractPay ?? report.pay}" style="color:#ddd;">$0</span>
              <span style="color:#888; text-align:left;">BONUSES</span><span data-count="${report.bonusPay ?? 0}" style="color:#ffd84a;">$0</span>
              <span style="color:#fff; text-align:left; border-top:1px solid #444; padding-top:4px;">TOTAL</span>
              <span data-count="${report.pay}" style="color:#44ff44; font-size: 14px; border-top:1px solid #444; padding-top:4px;">$0</span>
            </div>
            ${report.perfects !== undefined ? `<div style="font-size: 8px; color: #aaa; margin-top: 6px;">
              <span style="color:#ffd84a;">${report.perfects}</span> PERFECT PASS${report.perfects === 1 ? '' : 'ES'}
              &nbsp;·&nbsp; BEST COMBO <span style="color:#ffaa00;">${report.bestCombo ?? 0}</span></div>` : ''}
          </div>

          <div style="display: flex; gap: 14px; margin-bottom: 20px; justify-content: center; flex-wrap: wrap;">
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">RQI BEFORE</div>
              <div style="font-size: 20px; color: ${rqiBeforeColor}; margin-top: 2px;">${report.rqiBefore.toFixed(0)}</div>
            </div>
            <div style="text-align: center; padding: 10px 4px; font-size: 20px; color: #888; align-self: center;">&rarr;</div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">RQI AFTER</div>
              <div style="font-size: 20px; color: ${rqiAfterColor}; margin-top: 2px;">${report.rqiAfter.toFixed(0)}</div>
            </div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">IMPROVEMENT</div>
              <div style="font-size: 20px; color: ${improvColor}; margin-top: 2px;">${rqiImprovement >= 0.5 ? '+' : ''}${rqiImprovement.toFixed(0)}</div>
            </div>
          </div>

          <div style="display: flex; gap: 14px; margin-bottom: 20px; justify-content: center; flex-wrap: wrap;">
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">SECTIONS</div>
              <div style="font-size: 14px; color: #fff; margin-top: 2px;">${report.sectionsCompleted} / ${report.totalSections}</div>
            </div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">TRACK RESTORED</div>
              <div style="font-size: 14px; color: #44ff44; margin-top: 2px;">${report.trackRestoredFt} FT</div>
            </div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">TIME</div>
              <div style="font-size: 14px; color: #fff; margin-top: 2px;">${minutes}:${seconds.toString().padStart(2, '0')}</div>
            </div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">METAL REMOVED</div>
              <div style="font-size: 14px; color: #fff; margin-top: 2px;">${report.metalRemoved.toFixed(2)}mm</div>
            </div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">TRAINS DELAYED</div>
              <div style="font-size: 14px; color: ${report.missedWindows > 0 ? '#ff4444' : '#44ff44'}; margin-top: 2px;">${report.missedWindows}${report.missedWindows > 0 ? ` (-${report.missedWindows}&#9733;)` : ''}</div>
            </div>
          </div>

          <div style="font-size: 7px; color: #44ff44; letter-spacing: 2px; margin-bottom: 8px;">FINAL SECTION BREAKDOWN</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 7px; line-height: 2.5;">
            <thead>
              <tr style="color: #666; border-bottom: 1px solid #333;">
                <th style="text-align: left; padding: 4px;">SEC</th>
                <th style="text-align: left;">DEFECT TYPE</th>
                <th style="text-align: left;">RQI L</th>
                <th style="text-align: left;">RQI R</th>
                <th style="text-align: left;">DEVIATION</th>
              </tr>
            </thead>
            <tbody>
              ${sectionRows}
            </tbody>
          </table>

          ${report.profiles && report.profiles.length ? `
          <div style="margin-top: 20px; text-align: center;">
            <div style="color: #44ff44; font-size: 8px; letter-spacing: 2px; margin-bottom: 8px;">BEFORE / AFTER — LEFT RAIL</div>
            <canvas id="scrub-canvas" width="420" height="150" style="background:#05070a; border: 1px solid #1d2a1d; max-width: 100%;"></canvas>
            <div style="display:flex; gap: 10px; justify-content:center; align-items:center; font-size: 7px; color: #888; margin-top: 6px;">
              SECTION <select id="scrub-section" style="font-family: inherit; font-size: 8px; background:#000; color:#ffcc55; border:1px solid #444;">
                ${report.profiles.map((_, i) => `<option value="${i}">${i + 1}</option>`).join('')}</select>
              BEFORE <input id="scrub-t" type="range" min="0" max="100" value="100" style="width: 180px;"> AFTER
            </div>
          </div>` : ''}

          <div style="text-align: center; margin-top: 24px;">
            <button id="report-replay-btn" style="
              background: rgba(255,255,255,0.08); color: #ddd; border: 1px solid #555;
              font-family: 'Press Start 2P', monospace; font-size: 10px;
              padding: 12px 22px; cursor: pointer; margin-right: 10px;
            ">REPLAY</button>
            <button id="report-done-btn" style="
              background: #ffaa00; color: #000; border: none;
              font-family: 'Press Start 2P', monospace; font-size: 10px;
              padding: 12px 32px; cursor: pointer;
            ">NEXT CONTRACT</button>
            ${report.onShare ? `<div style="margin-top: 12px;"><button id="report-share-btn" style="background: transparent; color: #8ad0ff;
              border: 1px solid #8ad0ff; font-family: 'Press Start 2P', monospace; font-size: 8px; padding: 8px 14px; cursor: pointer;">📋 SHARE RESULT CARD</button></div>` : ''}
            ${report.nextGoal ? `<div style="color: #ffcc77; font-size: 7px; margin-top: 12px;">NEXT GOAL: ${report.nextGoal}</div>` : ''}
            ${report.boardRank !== undefined && report.boardRank >= 0 ? `
              <div style="margin: 0 0 16px; font-size: 9px; color: #ffd84a;">#${report.boardRank + 1} ON THIS ROUTE'S LEADERBOARD — INITIALS:
                <input id="report-initials" maxlength="3" value="${(localStorage.getItem('last-initials') || 'AAA').replace(/[^A-Z]/gi, '').slice(0, 3)}"
                  style="width: 52px; text-transform: uppercase; font-family: 'Press Start 2P', monospace; font-size: 11px; background: #000;
                  color: #ffd84a; border: 1px solid #ffd84a; padding: 4px; text-align: center; margin-left: 6px;"></div>` : ''}
            ${report.nextJobName ? `<div style="color: #888; font-size: 7px; margin-top: 10px;">UP NEXT: <span style="color:#ffcc55">${report.nextJobName}</span></div>` : ''}
          </div>
        </div>
      `;

      this.overlay.style.display = 'flex';
      this.animateResults();
      if (report.profiles && report.profiles.length) this.bindScrubber(report);

      const finish = (action: ReportAction) => {
        const input = document.getElementById('report-initials') as HTMLInputElement | null;
        if (input && report.onInitials) {
          const initials = (input.value.toUpperCase().replace(/[^A-Z]/g, '') + 'AAA').slice(0, 3);
          try { localStorage.setItem('last-initials', initials); } catch { /* private mode */ }
          report.onInitials(initials);
        }
        this.overlay.style.display = 'none';
        resolve(action);
      };
      document.getElementById('report-done-btn')!.addEventListener('click', () => finish('next'), { once: true });
      document.getElementById('report-replay-btn')!.addEventListener('click', () => finish('replay'), { once: true });
      const share = document.getElementById('report-share-btn');
      share?.addEventListener('click', async () => {
        share.textContent = '…';
        const what = await report.onShare!();
        share.textContent = what === 'copied' ? '✓ COPIED — PASTE IT ANYWHERE' : '✓ SAVED AS PNG';
      });
    });
  }

  /**
   * Results reveal: the stars pop in one by one, the pay counts up, then the
   * grade stamps down. (Transform / opacity only, so it's cheap.)
   */
  private animateResults(): void {
    const stars = Array.from(this.overlay.querySelectorAll<HTMLElement>('#report-stars span'));
    stars.forEach((s, i) => {
      if (s.textContent !== '\u2605') { s.style.opacity = '0.35'; return; }
      s.animate([{ opacity: 0, transform: 'scale(2.2)' }, { opacity: 1, transform: 'scale(1)' }],
        { duration: 260, delay: 250 + i * 180, fill: 'forwards', easing: 'cubic-bezier(.2,1.6,.4,1)' });
    });
    const counters = Array.from(this.overlay.querySelectorAll<HTMLElement>('[data-count]'));
    const start = performance.now() + 300;
    const DURATION = 1100;
    const tick = (now: number) => {
      const t = Math.max(0, Math.min(1, (now - start) / DURATION));
      const ease = 1 - Math.pow(1 - t, 3);
      for (const el of counters) el.textContent = '$' + Math.round(Number(el.dataset.count) * ease).toLocaleString('en-US');
      if (t < 1 && this.overlay.style.display !== 'none') requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    const grade = this.overlay.querySelector<HTMLElement>('#report-grade');
    grade?.animate([{ opacity: 0, transform: 'scale(3) rotate(-12deg)' }, { opacity: 1, transform: 'scale(1) rotate(0deg)' }],
      { duration: 320, delay: 1500, fill: 'forwards', easing: 'cubic-bezier(.3,1.5,.5,1)' });
  }

  hide(): void {
    this.overlay.style.display = 'none';
  }

  dispose(): void {
    this.overlay.remove();
  }
}
