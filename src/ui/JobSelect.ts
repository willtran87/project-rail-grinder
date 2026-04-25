/**
 * JobSelect - Job selection screen with multiple contracts.
 *
 * Each job has a different track layout, defect severity,
 * environment theme, and difficulty settings.
 */

import * as THREE from 'three';

export interface JobDefinition {
  id: string;
  name: string;
  location: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  difficultyColor: string;
  trackLength: string;
  sections: number;
  defectMultiplier: number;
  defectSeverity: number;   // 0-1 base severity
  timeOfDay: number;        // 0=dawn 1=day 2=dusk 3=night
  trackPoints: THREE.Vector3[];
}

export const JOBS: JobDefinition[] = [
  {
    id: 'transcon',
    name: 'BNSF Transcon — Emporia Sub',
    location: 'Kansas',
    description: 'The Southern Transcon is one of America\'s busiest freight corridors. Long straights across the Great Plains with 100M+ gross tons annually. Head checking and corrugation from high-speed intermodal traffic at 60-70 mph.',
    difficulty: 'Easy',
    difficultyColor: '#44cc44',
    trackLength: '280m',
    sections: 14,
    defectMultiplier: 1.0,
    defectSeverity: 0.4,
    timeOfDay: 1,
    trackPoints: [
      // Long tangents with very gentle curves — classic Kansas flatland
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(0, 0, 40),
      new THREE.Vector3(0, 0, 90),
      new THREE.Vector3(1, 0, 130),
      new THREE.Vector3(3, 0, 170),
      new THREE.Vector3(4, 0, 210),
      new THREE.Vector3(3, 0, 245),
      new THREE.Vector3(1, 0, 275),
      new THREE.Vector3(0, 0, 300),
    ],
  },
  {
    id: 'marias',
    name: 'BNSF Hi-Line — Marias Pass',
    location: 'Montana',
    description: 'Crossing the Continental Divide at 5,213 ft — the lowest rail crossing of the Rockies. Sharp 4-8 degree curves on the western descent with heavy coal and grain unit trains. Severe gauge face wear and cold-weather fracture risk.',
    difficulty: 'Medium',
    difficultyColor: '#ccaa22',
    trackLength: '380m',
    sections: 18,
    defectMultiplier: 1.5,
    defectSeverity: 0.7,
    timeOfDay: 2,
    trackPoints: [
      // Sharp mountain curves with steep grade simulation
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(0, 0, 20),
      new THREE.Vector3(0, 0, 50),
      new THREE.Vector3(0, 0, 80),
      new THREE.Vector3(3, 0, 105),
      new THREE.Vector3(8, 0, 125),
      new THREE.Vector3(16, 0, 142),
      new THREE.Vector3(26, 0, 157),
      new THREE.Vector3(36, 0, 170),
      new THREE.Vector3(44, 0, 185),
      new THREE.Vector3(50, 0, 202),
      new THREE.Vector3(52, 0, 222),
      new THREE.Vector3(50, 0, 242),
      new THREE.Vector3(45, 0, 260),
      new THREE.Vector3(38, 0, 278),
      new THREE.Vector3(32, 0, 298),
      new THREE.Vector3(30, 0, 318),
      new THREE.Vector3(30, 0, 340),
      new THREE.Vector3(32, 0, 360),
    ],
  },
  {
    id: 'clearing',
    name: 'BRC Clearing Yard Approach',
    location: 'Chicago, IL',
    description: 'Belt Railway of Chicago — where 25% of US rail freight converges. Tight urban curves around Clearing Yard. Constant stop-and-go traffic causes severe rail crush, corrugation, and switch wear. Night shift on the busiest rail junction in America.',
    difficulty: 'Hard',
    difficultyColor: '#dd6622',
    trackLength: '300m',
    sections: 15,
    defectMultiplier: 2.0,
    defectSeverity: 0.9,
    timeOfDay: 3,
    trackPoints: [
      // Tight urban geometry — short curves, S-bends, switch leads
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(0, 0, 20),
      new THREE.Vector3(3, 0, 45),
      new THREE.Vector3(10, 0, 68),
      new THREE.Vector3(20, 0, 88),
      new THREE.Vector3(28, 0, 110),
      new THREE.Vector3(30, 0, 135),
      new THREE.Vector3(25, 0, 158),
      new THREE.Vector3(18, 0, 180),
      new THREE.Vector3(15, 0, 205),
      new THREE.Vector3(18, 0, 230),
      new THREE.Vector3(24, 0, 255),
      new THREE.Vector3(26, 0, 280),
      new THREE.Vector3(24, 0, 300),
    ],
  },
  {
    id: 'coast',
    name: 'UP Coast Sub — Surf to SLO',
    location: 'California',
    description: 'Union Pacific\'s Coast Subdivision between Surf and San Luis Obispo. Tracks run directly along the Pacific Ocean. Salt spray corrosion, base pitting, and mixed-traffic fatigue from Amtrak Coast Starlight and UP freight. Dawn start for golden hour over the ocean.',
    difficulty: 'Expert',
    difficultyColor: '#dd2244',
    trackLength: '420m',
    sections: 21,
    defectMultiplier: 2.5,
    defectSeverity: 1.0,
    timeOfDay: 0,
    trackPoints: [
      // Winding coastal route following the shoreline
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(0, 0, 20),
      new THREE.Vector3(2, 0, 50),
      new THREE.Vector3(8, 0, 78),
      new THREE.Vector3(18, 0, 102),
      new THREE.Vector3(30, 0, 125),
      new THREE.Vector3(40, 0, 148),
      new THREE.Vector3(46, 0, 172),
      new THREE.Vector3(48, 0, 198),
      new THREE.Vector3(44, 0, 222),
      new THREE.Vector3(36, 0, 245),
      new THREE.Vector3(28, 0, 265),
      new THREE.Vector3(24, 0, 288),
      new THREE.Vector3(26, 0, 310),
      new THREE.Vector3(32, 0, 335),
      new THREE.Vector3(38, 0, 358),
      new THREE.Vector3(40, 0, 382),
      new THREE.Vector3(38, 0, 405),
      new THREE.Vector3(35, 0, 425),
    ],
  },
];

// Accurate continental US outline as [longitude, latitude] pairs
const US_OUTLINE: [number, number][] = [
  [-67.0,45.0],[-67.0,44.3],[-68.0,44.4],[-69.0,43.9],[-70.0,43.6],[-70.7,42.7],
  [-71.0,41.7],[-72.0,41.0],[-73.7,40.7],[-74.0,40.5],[-74.2,39.7],[-75.5,39.4],
  [-76.0,38.4],[-75.5,37.5],[-76.0,36.9],[-75.5,35.8],[-76.5,35.0],[-77.0,34.7],
  [-78.5,33.9],[-79.9,32.8],[-81.0,31.5],[-81.5,30.7],[-81.2,29.8],[-80.6,28.8],
  [-80.2,27.5],[-80.1,26.3],[-80.1,25.3],[-81.0,25.1],[-81.8,25.7],[-82.0,26.5],
  [-82.5,27.5],[-82.7,28.3],[-83.5,29.0],[-84.0,29.9],[-84.5,30.0],[-85.5,30.0],
  [-86.5,30.4],[-87.5,30.3],[-88.5,30.2],[-89.4,30.2],[-89.5,29.3],[-89.8,29.0],
  [-90.3,29.1],[-91.0,29.3],[-91.8,29.5],[-92.5,29.5],[-93.5,29.8],[-94.5,29.4],
  [-95.0,29.0],[-96.0,28.6],[-97.0,27.8],[-97.2,26.5],[-97.5,26.0],[-98.5,26.2],
  [-99.5,27.0],[-100.5,28.2],[-101.5,29.8],[-103.0,29.0],[-104.0,29.3],[-104.7,29.6],
  [-104.7,31.0],[-106.6,32.0],[-108.2,31.8],[-111.1,31.3],[-114.7,32.7],[-117.1,32.5],
  [-117.3,33.1],[-118.4,34.0],[-119.5,34.4],[-120.5,34.8],[-120.7,35.6],[-121.8,36.8],
  [-122.4,37.8],[-122.5,38.0],[-123.0,38.5],[-123.7,39.0],[-124.2,40.5],[-124.4,42.0],
  [-124.5,43.0],[-124.2,44.5],[-124.0,46.0],[-124.0,46.3],[-123.5,47.0],[-124.6,47.9],
  [-124.7,48.4],[-123.0,48.3],[-122.8,49.0],[-117.0,49.0],[-111.0,49.0],[-104.0,49.0],
  [-97.0,49.0],[-95.2,49.0],[-95.0,49.4],[-94.5,48.7],[-93.5,48.6],[-92.0,48.6],
  [-90.5,48.1],[-89.5,48.0],[-88.0,48.2],[-87.5,47.4],[-86.5,46.6],[-85.0,46.8],
  [-84.5,46.5],[-84.0,46.5],[-83.5,46.1],[-84.2,45.6],[-82.5,45.0],[-82.5,43.0],
  [-82.5,42.3],[-83.0,41.7],[-81.0,41.7],[-79.8,42.5],[-79.0,43.3],[-76.8,43.6],
  [-76.0,44.0],[-75.0,44.8],[-74.5,45.0],[-73.3,45.0],[-71.5,45.0],[-70.8,45.4],
  [-69.2,47.2],[-68.0,47.3],[-67.8,47.1],[-67.8,45.7],[-67.0,45.0],
];

// Great Lakes outlines
const LAKES: [number, number][][] = [
  // Lake Michigan
  [[-86.8,46.0],[-87.0,45.3],[-87.5,44.8],[-87.6,44.0],[-87.8,43.0],[-87.7,42.5],[-87.0,42.0],[-86.5,41.7],[-86.2,42.5],[-86.0,43.5],[-85.5,44.5],[-85.5,45.2],[-85.8,45.8],[-86.8,46.0]],
  // Lake Superior
  [[-89.5,48.0],[-89.0,47.5],[-88.0,47.0],[-87.0,46.8],[-86.0,46.7],[-85.0,46.8],[-84.8,47.0],[-85.0,47.5],[-86.0,47.6],[-87.0,47.4],[-88.5,47.8],[-89.5,48.0]],
  // Lake Erie
  [[-83.5,41.7],[-82.5,41.4],[-81.5,41.5],[-80.5,42.0],[-79.8,42.5],[-80.5,42.7],[-81.5,42.4],[-82.5,42.1],[-83.5,41.7]],
  // Lake Ontario
  [[-79.5,43.3],[-78.5,43.3],[-77.5,43.3],[-76.5,43.7],[-76.3,44.0],[-77.0,44.1],[-78.0,43.9],[-79.0,43.8],[-79.5,43.3]],
  // Lake Huron
  [[-84.5,46.0],[-83.5,45.5],[-82.5,44.5],[-82.0,43.5],[-82.0,43.0],[-82.5,43.5],[-83.0,44.0],[-83.5,44.8],[-84.0,45.5],[-84.5,46.0]],
];

// Job locations as [longitude, latitude]
const JOB_LOCATIONS: Record<string, { lon: number; lat: number; routeAngle: number }> = {
  transcon: { lon: -96.5, lat: 38.5, routeAngle: 0 },        // Emporia, Kansas
  marias:   { lon: -113.3, lat: 48.3, routeAngle: -0.3 },     // Marias Pass, Montana
  clearing: { lon: -87.8, lat: 41.8, routeAngle: 0.5 },       // Chicago, Illinois
  coast:    { lon: -120.5, lat: 35.2, routeAngle: -1.2 },      // San Luis Obispo, California
};

export class JobSelect {
  private overlay: HTMLElement;

  constructor() {
    this.overlay = document.createElement('div');
    this.overlay.id = 'job-select';
    this.overlay.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(180deg, #0a0c14 0%, #141828 50%, #0a0c14 100%);
      display: none; justify-content: center; align-items: center;
      z-index: 45; font-family: 'Inter', sans-serif; color: #fff;
      overflow-y: auto;
    `;
    document.body.appendChild(this.overlay);
  }

  /** Show job selection and return the chosen job */
  show(): Promise<JobDefinition> {
    return new Promise((resolve) => {
      let html = `
        <div style="max-width: 900px; padding: 30px 20px; margin: 20px auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 11px; color: rgba(255,170,0,0.6); letter-spacing: 6px; margin-bottom: 6px;">SELECT CONTRACT</div>
            <div style="font-size: 28px; font-weight: 700; letter-spacing: 2px;">AVAILABLE JOBS</div>
          </div>
          <div style="display: flex; justify-content: center; margin-bottom: 20px;">
            <canvas id="us-map-canvas" width="600" height="320" style="
              background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
              border-radius: 8px;
            "></canvas>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      `;

      for (const job of JOBS) {
        html += `
          <div class="job-card" data-job="${job.id}" style="
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px; padding: 20px; cursor: pointer;
            transition: all 0.2s;
          " onmouseover="this.style.borderColor='rgba(232,160,32,0.5)';this.style.background='rgba(255,255,255,0.06)'"
             onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.background='rgba(255,255,255,0.03)'">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div>
                <div style="font-size: 16px; font-weight: 600;">${job.name}</div>
                <div style="font-size: 11px; color: #666; margin-top: 2px;">${job.location}</div>
              </div>
              <div style="
                font-size: 10px; font-weight: 600; color: ${job.difficultyColor};
                background: ${job.difficultyColor}18; border: 1px solid ${job.difficultyColor}40;
                border-radius: 12px; padding: 3px 10px;
              ">${job.difficulty}</div>
            </div>
            <div style="font-size: 12px; color: #888; line-height: 1.6; margin-bottom: 12px;">
              ${job.description}
            </div>
            <div style="display: flex; gap: 16px; font-size: 11px; color: #666;">
              <div><span style="color: #aaa;">${job.trackLength}</span> track</div>
              <div><span style="color: #aaa;">${job.sections}</span> sections</div>
              <div><span style="color: #44cc44;">${job.difficulty}</span></div>
            </div>
          </div>
        `;
      }

      html += `</div></div>`;
      this.overlay.innerHTML = html;
      this.overlay.style.display = 'flex';

      // Bind click handlers
      const cards = this.overlay.querySelectorAll('.job-card');
      cards.forEach((card) => {
        card.addEventListener('click', () => {
          const jobId = card.getAttribute('data-job');
          const job = JOBS.find(j => j.id === jobId)!;
          this.overlay.style.display = 'none';
          resolve(job);
        });
      });

      // Draw the US map
      this.drawUSMap();
    });
  }

  private drawUSMap(): void {
    const canvas = document.getElementById('us-map-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width, h = canvas.height;
    const pad = 25;

    ctx.clearRect(0, 0, w, h);

    // Geographic projection: lon/lat → canvas x/y
    const lonMin = -126, lonMax = -65, latMin = 24, latMax = 50;
    const mapW = w - pad * 2, mapH = h - pad * 2;
    const toX = (lon: number) => pad + ((lon - lonMin) / (lonMax - lonMin)) * mapW;
    const toY = (lat: number) => pad + ((latMax - lat) / (latMax - latMin)) * mapH;

    const drawPoly = (coords: [number, number][], stroke: string, fill: string, lineW: number) => {
      ctx.strokeStyle = stroke;
      ctx.fillStyle = fill;
      ctx.lineWidth = lineW;
      ctx.beginPath();
      for (let i = 0; i < coords.length; i++) {
        const x = toX(coords[i][0]), y = toY(coords[i][1]);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      if (fill !== 'none') ctx.fill();
      ctx.stroke();
    };

    // US landmass
    drawPoly(US_OUTLINE, 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.04)', 1.5);

    // Great Lakes (darker to cut out from landmass)
    for (const lake of LAKES) {
      drawPoly(lake, 'rgba(100,150,200,0.2)', 'rgba(20,40,80,0.4)', 1);
    }

    // Job locations
    const jobColors: Record<string, string> = {
      transcon: '#44cc44', marias: '#ccaa22', clearing: '#dd6622', coast: '#dd2244',
    };

    for (const job of JOBS) {
      const loc = JOB_LOCATIONS[job.id];
      if (!loc) continue;

      const cx = toX(loc.lon), cy = toY(loc.lat);
      const color = jobColors[job.id] || '#fff';

      // Route line
      const rLen = 30;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(cx - Math.cos(loc.routeAngle) * rLen, cy - Math.sin(loc.routeAngle) * rLen);
      ctx.lineTo(cx + Math.cos(loc.routeAngle) * rLen, cy + Math.sin(loc.routeAngle) * rLen);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Glow ring
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Dot
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();

      // Label
      const leftSide = cx < w / 2;
      ctx.fillStyle = color;
      ctx.font = '600 10px Inter, sans-serif';
      ctx.textAlign = leftSide ? 'left' : 'right';
      const lx = leftSide ? cx + 16 : cx - 16;
      ctx.fillText(job.name.split('—')[0].trim(), lx, cy - 6);
      ctx.font = '9px Inter, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(job.location + ' · ' + job.difficulty, lx, cy + 6);
    }

    // Title
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UNITED STATES — RAIL GRINDING CORRIDORS', w / 2, 14);
  }

  hide(): void {
    this.overlay.style.display = 'none';
  }
}
