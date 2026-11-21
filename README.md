# Staying on Track

A web-based rail grinding simulator built with Three.js and TypeScript. You operate a rail grinding consist — a specialized train that restores worn railroad tracks to their correct profile using precision grindstones.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser. Click the title screen to start.

## Controls

| Key | Action |
|-----|--------|
| W / S (or ↑ / ↓) | Drive forward / reverse |
| SPACE | Hold to grind (auto-drives while grinding) |
| SHIFT | Hold for fast travel (3x speed when not grinding — slow orders still apply, and the grinder brakes ahead of them) |
| **Left Rail** | |
| Q / E | Adjust left stone angle |
| A / D | Adjust left pressure |
| **Right Rail** | |
| U / O | Adjust right stone angle |
| J / L | Adjust right pressure |
| **Camera & UI** | |
| 1-5 | Camera angles (chase, side, cab, overview, grind close-up) |
| N | Skip ahead to the next time of day (time also passes on its own) |
| P | Start / stop rain (snow on Marias Pass) — the weather also changes by itself |
| M | Mute audio |
| C | Toggle colour-blind palette (remembered) |
| `` ` `` (backtick) | Toggle FPS / frame-time counter |
| F | Photo mode: drag or arrows to orbit, wheel or W/S to zoom, A/D to slide along the track, K to save a PNG, F or ESC to exit |
| G | Graphics quality: High → Medium → Low (remembered) |
| ESC | Pause menu (resume, restart, quit, controls list) |
| R | Restart current job |

## How to Play

1. **Select a job** from the contract screen — each route has different track layouts and defect patterns based on real US rail corridors.

2. **Read the inspection report** (shown on replay jobs) to understand the defect severity across sections.

3. **Drive to a damaged section** — the track map at the top shows section status. Orange "NEXT" arrow points to the nearest unfinished section. Sections with slow orders (yellow "SLOW") restrict your speed.

4. **Hold SPACE to grind** — the grinder auto-drives at a steady pace while you focus on aiming. Watch the dual rail profile displays at the bottom.

5. **Adjust angle** to target the orange defect zones on the profile. Left rail uses Q/E, right rail uses U/O. Both rails have independent defects and can be adjusted simultaneously.

6. **Adjust pressure** — left rail uses A/D, right rail uses J/L. Higher pressure removes more metal but generates heat. Overheating reduces effectiveness. Watch the heat gauge.

7. **Don't over-grind** — if you remove too much metal past the green target line, you'll hear an alarm and the profile flashes red. Over-ground damage is permanent.

8. **Complete a section** when every 5m stretch of both rails in it reaches 80%+ accuracy (the track-map fill shows how close you are). The slow order lifts and you see "SLOW ORDER LIFTED — TRACK SPEED 60 MPH".

9. **Beat the deadline** — dispatch sends revenue trains through periodically. A countdown timer shows when the next one arrives. If a train arrives and you haven't cleared any sections since the countdown started, it's delayed and costs you a star on the final report.

10. **Complete all sections** to trigger the inspection pass — a cinematic camera sweep showing your finished work.

11. **Beat your best** — your best stars, RQI and time for each job are saved in the browser and shown on the job cards.

## Career Mode

- **Get paid** for every contract: more stars = more pay (1★ ≈ 55% of the contract’s base pay, 5★ ≈ 115%).
- **Unlock contracts** with your career stars (the sum of your best stars on every job): Medium needs ★3, Hard ★7, Expert ★12.
- **Buy upgrades** on the contract screen, three levels each:
  - *Stone Cooling System* — stones heat up 20% slower per level
  - *Hard-Cut Stone Compound* — remove 12% more metal per level
  - *Wide-Face Stones* — contact patch 12% wider per level (covers more, but easier to over-grind)
- Progress is saved in your browser. For testing, add `?unlock` to the URL to open every contract.

## Jobs

Four contracts based on real US railroad corridors:

| Contract | Difficulty | Base pay | Unlocks at |
|----------|------------|----------|------------|
| **BNSF Transcon — Emporia Sub** (Kansas): flat prairie, gentle curves, head checking from high-speed intermodal | Easy | $6,000 | start |
| **BNSF Hi-Line — Marias Pass** (Montana): mountain crossing at 5,213 ft, sharp curves, gauge face wear | Medium | $9,000 | ★3 |
| **BRC Clearing Yard Approach** (Chicago): dense urban geometry, corrugation from stop-and-go traffic | Hard | $13,000 | ★7 |
| **UP Coast Sub — Surf to SLO** (California): coastal curves beside an animated ocean, salt air corrosion | Expert | $18,000 | ★12 |

## A Living World

- **Time passes** during a job: dawn → day → dusk → night, about 3 minutes per phase.
- **Weather rolls in and out** to suit the route: storms on the prairie, snow showers (and snow on the ground) at Marias Pass, drizzle in Chicago, marine cloud on the coast.
- **Hot rail:** freshly ground steel glows orange under the stones and cools behind the consist, leaving polished rail with fine grinding scratches.
- **Lights at night:** the headlight throws a visible beam (stronger in rain and snow), and the beacons flash brighter.
- **Landmarks:** a grain elevator, windmill and cattle in Kansas; a summit obelisk, fire lookout and log cabin at Marias Pass; the Chicago skyline (lit windows at night), warehouses and a signal gantry; a lighthouse with a sweeping beam, palms and a lifeguard tower on the coast.
- **Level crossings:** lights flash, the bell rings and the gates come down as the grinder approaches, and cars wait for you.
- **Railroad rules:** freight on the next track slows to 25 mph past your work zone, and rain and snow stop at the train roofs.
- **Sounds of the place:** birdsong or crickets on the prairie, wind and hawks in the mountains, traffic and horns in the city, surf and gulls on the coast, plus rain hiss.

## Tech Stack

- **Three.js** (r184) — 3D rendering with pixel-art downscaling
- **TypeScript** — strict mode
- **Vite** (v7) — dev server and bundler
- **Vitest** (v4) — unit tests (`npm test`)
- **Web Audio API** — procedural audio (grinding, diesel, wheel clicks, horns)
- **Canvas 2D** — procedural textures, rail profile display, US map, title screen art

No external model files, textures, or audio files. Everything is generated at runtime.

## Build

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build
npm test         # run unit tests (Vitest)
```

## License

MIT
