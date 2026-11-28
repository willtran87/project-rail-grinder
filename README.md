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
| W / S (or ↑ / ↓) | Drive forward / reverse; **while grinding**, set the grinding speed (slower cuts deeper) |
| SPACE | Hold to grind (auto-drives while grinding; Settings can make it a toggle) |
| SHIFT | Hold for fast travel (3x speed when not grinding — slow orders still apply, and the grinder brakes ahead of them) |
| **Left Rail** | |
| Q / E | Adjust left stone angle |
| A / D | Adjust left pressure |
| **Right Rail** | |
| U / O | Adjust right stone angle |
| J / L | Adjust right pressure |
| **On the job** | |
| X | Hold to spray water at a lineside fire (stop beside it first) |
| Z | Hold (stopped, stones up) to fit new stones when they're worn |
| T | Ask dispatch to hold the revenue train 60 s (costs $500) |
| Y | Right after an over-grind: retry that section from scratch (practice — it won't score) |
| **Camera & UI** | |
| 1-6 | Camera angles (chase, side, cab, overview, grind close-up, 6 = director: cinematic cuts) |
| H | Settings, controls and how-to-play (volumes, accessibility, UI size, game speed, **key rebinding**, save backup) |
| V | Simple profile display (just the aim arrow and cues) |
| N | Skip ahead to the next time of day (time also passes on its own) |
| P | Start / stop rain (snow on Marias Pass) — the weather also changes by itself |
| M | Mute audio |
| C | Toggle colour-blind palette (remembered) |
| `` ` `` (backtick) | Toggle FPS / frame-time / draw-call counter |
| F | Photo mode: drag or arrows to orbit, wheel or W/S to zoom, A/D to slide along the track, K to save a PNG, F or ESC to exit |
| G | Graphics quality: High → Medium → Low (remembered; Medium and Low cap at 60 fps, Low also uses chunkier pixels) |
| ESC | Pause menu (resume, restart, quit, controls list) |
| R | Restart current job |

Keys can be rebound in Settings → Controls (there's a left-handed preset). On a phone or tablet, on-screen sticks and buttons appear.

**Gamepad** (Xbox layout): left stick = left stone (x angle, y pressure), right stick = right stone, RT/LT drive, (A) grind, (B) fast travel, (X) spray, (Y) next camera, LB train hold, RB change stones, Start pause. The pad rumbles while grinding.

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

### Damage, combos and grades

- **Five kinds of damage**, each ground differently: general wear, corrugation (light pressure — heavy pressure chatters), head checks (gauge corner, high pressure), gauge-face wear and flattened crown. Its name and tip show above the profile displays; the first time you meet one, a card explains it.
- **Perfect pass**: a section finished in one pass, 90 %+ accurate, without over-grinding or overheating — big bonus.
- **Combo**: three-star sections in a row multiply your section bonuses (up to ×3). Over-grinding, overheating, fires and safety fines break it.
- **Hot cut**: between 60 % and 80 % heat the stones cut 25 % faster. Past 80 % they glaze.
- **Grades** S–D for the whole job, plus a time medal. Results show stars, pay, grade and your previous best; top ten runs per route go on the leaderboard (enter your initials).

### Before each job

The pre-grind report lets you pick a **stone grade** (coarse cuts fast but pays less finish bonus; fine is slower but pays more) and set a **grind plan** — the number of passes for the whole job. Stay within it for a bonus; tighter plans pay more. It also shows the route's **target profile** (heavy-haul, transit, high-speed or standard) and notes on curves and weather.

### How the rail behaves

- **Curves**: the outer rail wears on its gauge face, the inner rail on its crown.
- **Weather**: wet rail glazes the stones (they cut slower); cold, snowy steel leaves less room before over-grinding.
- **Traffic**: sections you haven't touched keep wearing while you work elsewhere.
- **Sparks tell you how it's going**: orange-white on target, dull red off the hump, blue-white when over-grinding. The grind sound shudders on rough rail and runs smooth as it improves.

### Things that happen on the line

- **Lineside fires**: hot stones on dry days can set the grass alight behind you. Stop beside it and hold X to spray it from the water car before it spreads (fine).
- **Work crews**: pass them under 8 mph or it's a safety fine. **Broken rails**: a red flag — stop short and wait while it's welded.
- **Stone wear**: stones cut less as they wear (STONE % under the heat gauge). Stop and hold Z to change them.
- **Revenue train**: press T to buy a 60 s hold; finishing with time to spare pays a bonus. Clearing a section with the train under 15 s away is a **close call** bonus.
- **Emergency calls**: dispatch sometimes radios in an urgent section — clear it in time for $600.
- **Collectibles**: something glinting by the rail? Switch to camera 5 as you pass to pick it up for the museum.
- New players meet these one job at a time: the first job is the guided tutorial, and each of the next three jobs introduces one more thing (card at the top right). The **Practice Yard** (job screen) has one section of each damage kind with no deadline and no pay.

## Career Mode

- **Get paid** for every contract: more stars = more pay (1★ ≈ 55% of the contract’s base pay, 5★ ≈ 115%).
- **Unlock contracts** with your career stars (the sum of your best stars on every job): Medium needs ★3, Hard ★7, Expert ★12.
- **Buy upgrades** on the contract screen, three levels each:
  - *Stone Cooling System* — stones heat up 20% slower per level
  - *Hard-Cut Stone Compound* — remove 12% more metal per level
  - *Wide-Face Stones* — contact patch 12% wider per level (covers more, but easier to over-grind)
- **Contract screen tabs**: Contracts, Daily · Weekly · Random, Upgrades, Depot.
- **Daily contract**: the same generated route for everyone each day; play daily to keep a streak. A **login reward** climbs over seven days in a row.
- **Weekly challenge**: one route per week with a twist (two modifiers) and higher pay.
- **Long haul**: a three-shift contract; a weak shift leaves more damage for the next one, and finishing all three pays a big bonus.
- **Risk modifiers** on random routes — fog, night shift, heavy traffic, worn stones, no fast travel, heavy damage — each multiply the pay.
- **Rank**: Trainee → Operator → Foreman → Superintendent → Chief Engineer by career stars, each with a perk.
- **Depot**: hire crew (fire watch, welder, mechanic, spotter — each a perk) and buy a second machine, Grinder 22 "Rapid".
- **Streak savers**: every five perfect passes earns one; it forgives your next combo break.
- **Next goal**: the unlock you're closest to is always shown (menu, HUD, results).
- **Photo challenges**: deer, lightning, sparks at night, golden hour, the crew, a fire, snow — take the shot in photo mode (F, then K) for a reward.
- **Results**: a before/after slider for each section's profile, and a **share card** (copied to the clipboard, or saved as a PNG).
- **Random routes**: endless generated contracts that get harder as your career grows.
- **Career & records page**: lifetime stats, best grades and medals, achievements (18), leaderboards, and paint schemes for the consist unlocked by your career (pick one there). Upgrades you buy show on the consist (radiators, stripes, skirts).
- **Ghost**: your fastest run on each route races you on the track map.
- **Route condition**: routes you keep in good shape come back with less damage; neglected ones get worse.
- **Dispatcher story**: Marge, Teo and the crew of Grinder 17 have more to say as your career goes on.
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
- **Seasons**: autumn colours, spring greens or bare winter trees — built-in routes follow the real calendar, random routes roll their own.
- **Wildlife**: birds lift off the ballast and deer bolt as the consist approaches.
- **Weather you can see**: lightning and thunder in heavy rain, wet darkened ballast afterwards, cloud shadows drifting across the fields, sun shafts through the consist at dawn and dusk.
- **Grinding up close**: heat haze shimmers above hot stones; ballast chips flick out and water mist drifts back from the stones.
- **End-of-job vista**: after the inspection pass the camera cranes up over the restored line (the fog pulls back so you can see it).
- **More life**: puddles after rain and water dripping off the cars (snow blowing off them in winter), trees swaying in the wind and rain slanting with it, tumbleweeds on the prairie, frost glitter on mountain mornings, sea fog at dawn on the coast, a town glowing on the horizon at night and the odd aircraft blinking overhead.
- **The last section** of a job finishes in a moment of slow motion.
- **Sounds of the place:** birdsong or crickets on the prairie, wind and hawks in the mountains, traffic and horns in the city, surf and gulls on the coast, plus rain hiss.

## Tech Stack

- **Three.js** (r184) — 3D rendering with pixel-art downscaling
- **TypeScript** — strict mode
- **Vite** (v7) — dev server and bundler
- **Vitest** (v4) — unit tests (`npm test`)
- **Web Audio API** — procedural audio (grinding, diesel, wheel clicks, horns)
- **Canvas 2D** — procedural textures, rail profile display, US map, title screen art

No external model files, textures, or audio files. Everything is generated at runtime.

## Screenshot check

`npm run visual` starts the dev server, renders four fixed scenes in headless Chromium and compares them with `visual/baseline/` (it fails if a scene changed a lot or the page threw an error). `npm run visual -- --update` accepts the current look. It needs a Chromium build Playwright can use: run `npx playwright-core install chromium-headless-shell` once, or set `CHROME_PATH`.

## Saving

Progress lives in your browser. Settings → Save → **Export** downloads a backup file; **Import** restores one (on this or another computer).

## Build

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build
npm test         # run unit tests (Vitest)
```

## License

MIT
