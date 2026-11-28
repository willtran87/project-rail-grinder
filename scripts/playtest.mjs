/**
 * playtest.mjs - A bot plays whole jobs headlessly and logs how they went.
 *
 *   npm run playtest                 play the four built-in contracts
 *   npm run playtest -- --jobs 0,2   only some of them (indexes into JOBS)
 *   npm run playtest -- --first      play the very first job (guided tutorial rules)
 *   npm run playtest -- --skill 0.6  a sloppier player (0..1, default 0.8)
 *
 * The bot aims each stone at the worst hump, keeps the heat out of the red,
 * reverses for another pass when a section isn't done, changes worn stones,
 * stops for broken rails, slows past work crews and sprays fires — roughly
 * what a decent player does. While it plays, every pop-up, card, toast and
 * radio call is logged, so the report shows:
 *
 *   - time per job and per section, passes, stars, grade and pay
 *   - "noise": the most messages on screen in any 2-second window
 *   - dead time: stretches of driving with nothing to do
 *
 * Results go to the console and to playtest/report.json. Uses the same
 * headless Chromium as `npm run visual`.
 */

import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const arg = (name, def) => {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : def;
};
const FIRST = process.argv.includes('--first');
const SKILL = Number(arg('--skill', '0.8'));
const JOB_IDS = arg('--jobs', FIRST ? '0' : '0,1,2,3').split(',').map(Number);
/** Game runs this many times faster than real time (dt is scaled) */
const SPEED = Number(arg('--speed', '2'));

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const outDir = path.join(root, 'playtest');
fs.mkdirSync(outDir, { recursive: true });

const server = await createServer({ root, server: { port: 5198, strictPort: true, hmr: false }, logLevel: 'error' });
await server.listen();
const url = 'http://localhost:5198/project-rail-grinder/?unlock';

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)));

/** Runs inside the page: install the bot and the loggers, play one job, return the log */
async function playJob({ jobIndex, first, skill, speed, limit }) {
  const g = window.game;
  const { JOBS } = await import('/project-rail-grinder/src/ui/JobSelect.ts');
  const meta = await import('/project-rail-grinder/src/game/meta.ts');
  const { stoneGrindX } = await import('/project-rail-grinder/src/game/rules.ts');
  const { CHATTER_PRESSURE } = await import('/project-rail-grinder/src/game/defects.ts');
  const job = JOBS[jobIndex];
  // A player who has done a few jobs: every job event is switched on
  if (!first) { const s = meta.loadStats(); s.jobs = Math.max(s.jobs, 4); meta.saveStats(s); }

  const log = { job: job.name, popups: [], sections: [], events: [], trace: [], stuck: 0 };
  const now = () => +g.playTime.toFixed(1);
  const wrap = (obj, name, kind, text) => {
    const orig = obj[name].bind(obj);
    obj[name] = (...a) => { log.popups.push({ t: now(), kind, text: text(...a) }); return orig(...a); };
  };
  wrap(g.floatingScore, 'show', 'float', (t) => t);
  wrap(g.toast, 'show', 'toast', (_i, t) => t);
  wrap(g, 'showCard', 'card', (_k, t) => t);
  wrap(g.radioDispatch, 'say', 'radio', (_f, t) => t.slice(0, 40));
  const origEvent = g.setEvent.bind(g);
  g.setEvent = (t) => { if (t && t !== g.eventText) log.events.push({ t: now(), text: t.slice(0, 50) }); origEvent(t); };

  // ---- Virtual keyboard ----
  const keys = new Set();
  const taps = new Set();
  g.input.isKeyDown = (k) => keys.has(k);
  g.input.wasKeyPressed = (k) => { if (taps.has(k)) { taps.delete(k); return true; } return false; };

  g.engine.timeScale = speed;
  g.jobSelect.hide();
  g.isFirstJob = first;
  if (!first) g.guidedTutorial.setReplay();
  g.currentJob = job;
  g.rebuildForJob(job);
  await new Promise((r) => setTimeout(r, 300));
  document.getElementById('report-start-btn')?.click();
  if (g.guidedTutorial.active) g.guidedTutorial.active = false;

  // Aim error for this player (degrees), fixed per section so it's consistent
  const aimNoise = () => (Math.random() - 0.5) * 2 * (1 - skill) * 8;
  let noise = { left: 0, right: 0 }, noiseSec = -1;
  let cooling = false;
  let locked = -1;
  /** 'approach' = driving to a section's start, 'pass' = grinding through it */
  let mode = 'approach';
  let lastTrace = -9; let lastPos = 0, stillFor = 0, idleSince = -1, idle = 0;
  const secStart = [];

  let frames = 0;
  const brain = () => {
    frames++;
    if (!g.gameStarted || g.jobComplete || g.inspectionPass || g.isPaused) return;
    keys.clear();
    const t = g.track, pos = g.grinderPosition, v = g.grinderSpeed;
    const SEC = 20;
    const secAt = (d) => t.getSectionIndex(d);
    const cur = secAt(pos);
    const startOf = (s) => t.sectionOffset + s * SEC;
    const drive = (target, cap = 10) => {
      const gap = target - pos;
      if (Math.abs(gap) < 0.8) { if (Math.abs(v) > 0.2) keys.add(v > 0 ? 's' : 'w'); return true; }
      const want = Math.sign(gap) * Math.min(cap, Math.sqrt(Math.abs(gap)) * 2.2);
      if (want > v + 0.3) keys.add('w'); else if (want < v - 0.3) keys.add('s');
      if (Math.abs(gap) > 60 && Math.abs(v) > 6 && cap > 10) keys.add('shift');
      return false;
    };

    // Stuck detection (for the report)
    if (Math.abs(pos - lastPos) < 0.01) stillFor += 1 / 60; else stillFor = 0;
    lastPos = pos;

    const ev = g.eventText || '';
    if (g.playTime - lastTrace > 3) {
      lastTrace = g.playTime;
      const vi0 = t.getSegmentIndex(pos);
      const z = ['left', 'right'].map((r) => (g.worstZonesFor(t.getProfile(vi0, r))[0] || {}));
      log.trace.push(`${now()} wall ${(performance.now() / 1000).toFixed(0)} fr ${frames} pos ${pos.toFixed(0)} sec ${cur} v ${v.toFixed(1)} grind ${g.isGrinding} heat ${g.stoneHeat.toFixed(0)} life ${g.stoneLife.toFixed(0)} ang ${g.stoneAngle.left.toFixed(0)}/${g.stoneAngle.right.toFixed(0)} zones ${z.map((q) => q.centerX?.toFixed(0) + ':' + q.severity?.toFixed(3)).join(' ')} acc ${cur >= 0 ? g.sectionAccuracy?.(cur) ?? '' : ''} ev ${ev.slice(0, 20)}`);
    }
    // Broken rail: stop and wait
    if (ev.includes('WELDING')) return;
    if (ev.includes('BROKEN RAIL AHEAD')) { if (v > 0.1) keys.add('s'); return; }
    // Fire: get a water car beside it and spray
    if (g.fire.active) {
      const want = g.fire.dist + 26; // rear water car at pos − 26
      if (drive(want, 6) && Math.abs(v) < 0.5) keys.add('x');
      return;
    }
    // Worn stones: stop and change
    if (g.features.wearAndHold && g.stoneLife < 22 && !g.isGrinding) {
      if (Math.abs(v) > 0.1) { keys.add(v > 0 ? 's' : 'w'); return; }
      keys.add('z');
      return;
    }
    // Revenue train close and lots left: ask for one hold
    const left = g.deadline.secondsLeft;
    if (left !== null && left < 20 && g.holdsUsed < 1 && g.features.wearAndHold
        && g.completedCount < g.sectionCount - 2) taps.add('t');

    // Which section to work on: an emergency first, else the nearest unfinished ahead
    let target = -1;
    if (g.emergency && !g.segmentCompleted[g.emergency.sec] && Math.abs(g.emergency.sec - cur) <= 3) target = g.emergency.sec;
    // Finish the section you started before moving on
    if (target < 0 && locked >= 0 && !g.segmentCompleted[locked]) target = locked;
    if (target < 0) {
      for (let s = Math.max(0, cur); s < g.sectionCount; s++) if (!g.segmentCompleted[s]) { target = s; break; }
      if (target < 0) for (let s = g.sectionCount - 1; s >= 0; s--) if (!g.segmentCompleted[s]) { target = s; break; }
    }
    if (target < 0) return;
    locked = target;
    if (secStart[target] === undefined) secStart[target] = g.playTime;
    const crew = ev.includes('WORK CREW');
    const cap = crew ? 2.6 : 30;

    // Passes: drive to the section start, then grind one full pass through it
    // (lifting only to cool), and repeat until the section is finished.
    const start = startOf(target), end = start + SEC;
    if (mode === 'pass' && (pos >= end - 0.05 || cur !== target)) mode = 'approach';
    if (mode === 'approach') {
      if (g.isGrinding) return; // SPACE released this frame
      if (idleSince < 0) idleSince = g.playTime;
      if (drive(start + 0.6, cap) && Math.abs(v) < 0.3) mode = 'pass';
      return;
    }
    if (idleSince >= 0) { idle += g.playTime - idleSince; idleSince = -1; }
    if (noiseSec !== target) { noiseSec = target; noise = { left: aimNoise(), right: aimNoise() }; }

    // Aim each stone at its rail's worst hump on this stretch
    const vi = t.getSegmentIndex(pos);
    const tol = g.targetProfile.tolerance;
    let allDone = true, deepest = 0;
    for (const rail of ['left', 'right']) {
      // Only humps (metal to take off): over-ground dips can't be fixed by grinding
      const zones = g.worstZonesFor(t.getProfile(vi, rail)).filter((z) => z.severity > tol);
      const zone = zones[0];
      if (zone) { allDone = false; deepest = Math.max(deepest, zone.severity); }
      const wantAngle = Math.max(-40, Math.min(40, (zone ? zone.centerX : 0) / 0.7 + noise[rail]));
      const ang = g.stoneAngle[rail];
      const up = rail === 'left' ? 'e' : 'u', down = rail === 'left' ? 'q' : 'o';
      if (wantAngle > ang + 1.2) keys.add(up); else if (wantAngle < ang - 1.2) keys.add(down);
      // Pressure: lighter on corrugation, near zero on a finished rail
      const kind = g.sectionKinds[target];
      const wantP = !zone ? 0 : { corrugation: CHATTER_PRESSURE - 8, headCheck: 85, gaugeFace: 80, flatCrown: 30, wear: 50 }[kind] ?? 50;
      const p = g.stonePressure[rail];
      const pu = rail === 'left' ? 'd' : 'l', pd = rail === 'left' ? 'a' : 'j';
      if (wantP > p + 3) keys.add(pu); else if (wantP < p - 3) keys.add(pd);
    }
    void stoneGrindX;
    // Heat: lift at 74%, back down at 45%
    if (g.stoneHeat > 74) cooling = true;
    if (g.stoneHeat < 45) cooling = false;
    if (allDone || cooling) {
      // Stones up, creep on through this stretch
      if (v < 1.8) keys.add('w');
    } else {
      keys.add(' ');
      // Deep humps: slow the grinding speed (more metal per pass); light: speed up
      const wantSpeed = deepest > 0.14 ? 1.1 : deepest > 0.09 ? 1.6 : 2.4;
      if (g.grindSpeedSetting > wantSpeed + 0.1) keys.add('s');
      else if (g.grindSpeedSetting < wantSpeed - 0.1) keys.add('w');
    }
  };
  g.engine.onUpdate(brain);

  // Collect section results as they finish
  const origComplete = g.completeSegment.bind(g);
  g.completeSegment = (i, acc) => {
    origComplete(i, acc);
    log.sections.push({ i, t: now(), took: +(g.playTime - (secStart[i] ?? 0)).toFixed(1),
      passes: g.segmentPasses[i], stars: g.segmentStars[i] });
  };

  // Wait for the results screen
  const report = await new Promise((resolve) => {
    const orig = g.inspectionReport.showCompletionReport.bind(g.inspectionReport);
    g.inspectionReport.showCompletionReport = (r) => { resolve(r); g.inspectionReport.showCompletionReport = orig; return orig(r); };
    const timer = setInterval(() => {
      if (g.playTime > limit) { clearInterval(timer); resolve(null); }
    }, 1000);
  });
  g.engine.timeScale = 1;
  log.stuck = +stillFor.toFixed(1);
  log.result = report ? {
    time: +report.elapsedTime.toFixed(0), stars: report.stars, grade: report.grade, pay: report.pay,
    contract: report.contractPay, bonus: report.bonusPay, perfects: report.perfects, bestCombo: report.bestCombo,
    rqiBefore: +report.rqiBefore.toFixed(0), rqiAfter: +report.rqiAfter.toFixed(0), missedTrains: report.missedWindows,
  } : { timedOut: true, done: g.completedCount, of: g.sectionCount, time: +g.playTime.toFixed(0) };
  log.driving = +idle.toFixed(0);
  document.getElementById('report-done-btn')?.click();
  return log;
}

/** Summaries the report needs */
function summarise(log) {
  // Noise: most messages started in any 2 s window
  let worst = 0, worstAt = 0;
  for (const p of log.popups) {
    const n = log.popups.filter((q) => q.t >= p.t && q.t < p.t + 2).length;
    if (n > worst) { worst = n; worstAt = p.t; }
  }
  const burst = log.popups.filter((q) => q.t >= worstAt && q.t < worstAt + 2).map((q) => `${q.kind}:${q.text}`);
  const secTimes = log.sections.map((s) => s.took);
  const avg = secTimes.reduce((a, b) => a + b, 0) / Math.max(1, secTimes.length);
  const passes = log.sections.map((s) => s.passes);
  const stars = log.sections.map((s) => s.stars);
  return {
    job: log.job,
    result: log.result,
    sections: log.sections.length,
    avgSectionSeconds: +avg.toFixed(1),
    slowestSection: Math.max(0, ...secTimes),
    avgPasses: +(passes.reduce((a, b) => a + b, 0) / Math.max(1, passes.length)).toFixed(2),
    starSpread: [1, 2, 3].map((n) => stars.filter((s) => s === n).length),
    drivingSeconds: log.driving,
    messages: log.popups.length,
    messagesPerMinute: log.result?.time ? +(log.popups.length / (log.result.time / 60)).toFixed(1) : null,
    noisiest2s: { count: worst, at: worstAt, burst },
    events: log.events.length,
  };
}

const results = [];
try {
  await page.goto(url);
  await page.click('#title-screen');
  await page.waitForFunction(() => !!window.game);
  await page.waitForSelector('#job-tabs', { state: 'visible' });
  for (const j of JOB_IDS) {
    console.log(`Playing job ${j}…`);
    const log = await page.evaluate(playJob, { jobIndex: j, first: FIRST, skill: SKILL, speed: SPEED, limit: Number(arg("--limit", "1200")) });
    const sum = summarise(log);
    console.log(JSON.stringify(sum, null, 1));
    results.push({ summary: sum, log });
    // back to a clean menu for the next job
    await page.reload();
    await page.click('#title-screen');
    await page.waitForFunction(() => !!window.game);
    await page.waitForSelector('#job-tabs', { state: 'visible' });
  }
} finally {
  fs.writeFileSync(path.join(outDir, process.env.PT_OUT || 'report.json'), JSON.stringify({ skill: SKILL, first: FIRST, results, errors }, null, 1));
  console.log(`Errors: ${errors.length ? errors.join('\n') : 'none'}`);
  console.log(`Full log: ${path.join(outDir, process.env.PT_OUT || 'report.json')}`);
  await browser.close();
  await server.close();
}
