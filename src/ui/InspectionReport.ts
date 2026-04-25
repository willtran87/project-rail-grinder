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
}

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

  /** Show the pre-job inspection report. Returns a promise that resolves when user clicks START. */
  showPreJobReport(report: JobReport): Promise<void> {
    return new Promise((resolve) => {
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
            <button id="report-start-btn" style="
              background: #ffaa00; color: #000; border: none;
              font-family: 'Press Start 2P', monospace; font-size: 10px;
              padding: 12px 32px; cursor: pointer; margin-top: 8px;
            ">BEGIN GRINDING</button>
          </div>
        </div>
      `;

      this.overlay.style.display = 'flex';

      document.getElementById('report-start-btn')!.addEventListener('click', () => {
        this.overlay.style.display = 'none';
        resolve();
      }, { once: true });
    });
  }

  /** Show the post-job completion report */
  showCompletionReport(report: CompletionReport): Promise<void> {
    return new Promise((resolve) => {
      const minutes = Math.floor(report.elapsedTime / 60);
      const seconds = Math.floor(report.elapsedTime % 60);

      const rqiBeforeColor = report.rqiBefore > 70 ? '#44ff44' : report.rqiBefore > 40 ? '#ffaa00' : '#ff4444';
      const rqiAfterColor = report.rqiAfter > 70 ? '#44ff44' : report.rqiAfter > 40 ? '#ffaa00' : '#ff4444';
      const rqiImprovement = report.rqiAfter - report.rqiBefore;
      const improvColor = rqiImprovement > 0 ? '#44ff44' : '#ff4444';

      const starStr = '\u2605'.repeat(report.stars) + '\u2606'.repeat(5 - report.stars);

      // Grade
      const grade = report.rqiAfter >= 95 ? 'A+' :
                    report.rqiAfter >= 90 ? 'A' :
                    report.rqiAfter >= 80 ? 'B' :
                    report.rqiAfter >= 70 ? 'C' :
                    report.rqiAfter >= 60 ? 'D' : 'F';
      const gradeColor = grade.startsWith('A') ? '#44ff44' :
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
            <div style="font-size: 28px; color: #ffdd00; margin: 12px 0;">${starStr}</div>
            <div style="font-size: 32px; color: ${gradeColor}; margin-bottom: 4px;">GRADE: ${grade}</div>
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
              <div style="font-size: 20px; color: ${improvColor}; margin-top: 2px;">+${rqiImprovement.toFixed(0)}</div>
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

          <div style="text-align: center; margin-top: 24px;">
            <button id="report-done-btn" style="
              background: #ffaa00; color: #000; border: none;
              font-family: 'Press Start 2P', monospace; font-size: 10px;
              padding: 12px 32px; cursor: pointer;
            ">CONTINUE</button>
            <div style="color: #555; font-size: 7px; margin-top: 8px;">Press R to restart</div>
          </div>
        </div>
      `;

      this.overlay.style.display = 'flex';

      document.getElementById('report-done-btn')!.addEventListener('click', () => {
        this.overlay.style.display = 'none';
        resolve();
      }, { once: true });
    });
  }

  hide(): void {
    this.overlay.style.display = 'none';
  }

  dispose(): void {
    this.overlay.remove();
  }
}
