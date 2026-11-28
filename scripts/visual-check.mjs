/**
 * visual-check.mjs - Headless screenshot regression check.
 *
 *   npm run visual            render the scenes, compare with visual/baseline/
 *   npm run visual -- --update  accept the current look as the new baseline
 *
 * Starts the Vite dev server, opens the game in headless Chromium (no window),
 * renders a few fixed scenes and compares each with its baseline image.
 * Math.random is seeded so the scenery is the same every run; small
 * differences (animation timing, GPU rounding) are allowed by a tolerance.
 * Fails (exit code 1) if a scene changed too much or the page threw errors.
 *
 * Needs a Chromium build that Playwright can use: run
 *   npx playwright-core install chromium-headless-shell
 * once, or point CHROME_PATH at any Chrome / Chromium executable.
 */

import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

const UPDATE = process.argv.includes('--update');
/** A pixel counts as changed if any channel moves more than this (0-255) */
const PIXEL_TOLERANCE = 40;
/** A scene fails if more than this fraction of its pixels changed */
const MAX_CHANGED = 0.04;

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')), '..');
const baseDir = path.join(root, 'visual', 'baseline');
const curDir = path.join(root, 'visual', 'current');
fs.mkdirSync(baseDir, { recursive: true });
fs.mkdirSync(curDir, { recursive: true });

/** Each scene: a job, time of day, weather and camera view */
const SCENES = [
  { name: 'prairie-day-chase', job: 0, time: 'day', rain: 0, view: 'chase' },
  { name: 'mountain-dusk-side', job: 1, time: 'dusk', rain: 0, view: 'side' },
  { name: 'city-night-overview', job: 2, time: 'night', rain: 0, view: 'overview' },
  { name: 'coast-rain-chase', job: 3, time: 'day', rain: 0.8, view: 'chase' },
];

const server = await createServer({ root, server: { port: 5199, strictPort: true }, logLevel: 'error' });
await server.listen();
const url = 'http://localhost:5199/project-rail-grinder/?unlock';

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
// Same random scenery every run
await page.addInitScript(() => {
  let a = 12345;
  Math.random = () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
});

let failed = 0;
try {
  await page.goto(url);
  await page.click('#title-screen');
  await page.waitForFunction(() => !!window.game);
  for (const sc of SCENES) {
    await page.evaluate(async (sc) => {
      const g = window.game;
      const { JOBS } = await import('/project-rail-grinder/src/ui/JobSelect.ts');
      g.jobSelect.hide();
      g.isFirstJob = false;
      g.currentJob = JOBS[sc.job];
      g.rebuildForJob(JOBS[sc.job]);
      document.getElementById('report-start-btn')?.click();
      g.gameStarted = true;
      g.guidedTutorial.active = false;
      document.body.classList.add('cinematic');
      g.dayNight.autoAdvance = false;
      g.dayNight.setTime(sc.time);
      g.weather.auto = false;
      g.weather.intensity = sc.rain;
      g.weather['targetIntensity'] = sc.rain;
      g.camera.angle = sc.view;
      g.engine.timeScale = 1;
      await new Promise((r) => setTimeout(r, 3000));
      // Freeze game time so moving things (trains, tumbleweeds, birds) hold still for the shot
      g.engine.timeScale = 0;
      await new Promise((r) => setTimeout(r, 300));
    }, sc);
    const file = path.join(curDir, `${sc.name}.png`);
    await page.screenshot({ path: file });
    const base = path.join(baseDir, `${sc.name}.png`);
    if (UPDATE || !fs.existsSync(base)) {
      fs.copyFileSync(file, base);
      console.log(`  baseline  ${sc.name}`);
      continue;
    }
    // Compare in the browser (canvas pixel access, no extra packages)
    const changed = await page.evaluate(async ([a, b, tol]) => {
      const load = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = src; });
      const [ia, ib] = await Promise.all([load(a), load(b)]);
      if (ia.width !== ib.width || ia.height !== ib.height) return 1;
      const c = document.createElement('canvas');
      c.width = ia.width; c.height = ia.height;
      const g = c.getContext('2d');
      g.drawImage(ia, 0, 0); const da = g.getImageData(0, 0, c.width, c.height).data;
      g.drawImage(ib, 0, 0); const db = g.getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let i = 0; i < da.length; i += 4) {
        if (Math.abs(da[i] - db[i]) > tol || Math.abs(da[i + 1] - db[i + 1]) > tol || Math.abs(da[i + 2] - db[i + 2]) > tol) n++;
      }
      return n / (da.length / 4);
    }, [`data:image/png;base64,${fs.readFileSync(file).toString('base64')}`, `data:image/png;base64,${fs.readFileSync(base).toString('base64')}`, PIXEL_TOLERANCE]);
    const ok = changed <= MAX_CHANGED;
    if (!ok) failed++;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'}      ${sc.name}  (${(changed * 100).toFixed(1)}% of pixels changed)`);
  }
} finally {
  await browser.close();
  await server.close();
}
if (errors.length) { console.log('Page errors:\n  ' + errors.slice(0, 5).join('\n  ')); failed++; }
console.log(failed ? `\n${failed} problem(s). Compare visual/current with visual/baseline.` : '\nAll scenes match.');
process.exit(failed ? 1 : 0);
