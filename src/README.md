# Source Architecture

## Directory Structure

```
src/
├── main.ts                  # Entry point — title screen → Game
├── Game.ts                  # Main game class — orchestrates all systems
├── core/
│   ├── Engine.ts            # Three.js renderer, scene, camera, pixel-art pipeline
│   ├── InputManager.ts      # Keyboard and mouse state tracking
│   ├── EventBus.ts          # Simple pub/sub for decoupled communication
│   ├── CameraController.ts  # Camera views (1-6, 6 = director cuts), shake, punch, inspection + vista
│   ├── settings.ts          # Player settings (volumes, accessibility, grind mode, keymap…) + change events
│   ├── keymap.ts            # Rebindable keys: physical key → action lookup, presets
│   ├── storage.ts           # Safe localStorage wrapper (never throws) + save export/import
│   ├── quality.ts           # Graphics quality presets (key G)
│   ├── bakeStatic.ts        # Merges a model's fixed parts into one mesh per material
│   ├── performance.test.ts  # Tests for the merging, batched rails and track lookup
│   └── dispose.ts           # Frees GPU memory of discarded scene objects
├── game/                    # Pure game logic — no Three.js/DOM, fully unit-tested
│   ├── rules.ts             # ALL tuning numbers + scoring formulas (rebalance here)
│   ├── sectionMetrics.ts    # Accuracy/deviation of a whole 20m section
│   ├── progress.ts          # Personal bests per job (saved in localStorage)
│   ├── career.ts            # Money, upgrades, unlocks (career mode)
│   ├── defects.ts           # The five damage kinds, seeded per job and region
│   ├── scoring.ts           # Perfect pass, combo multiplier, section bonus, job grade
│   ├── routes.ts            # Generated routes: random contracts + the daily contract
│   ├── meta.ts              # Grades/medals, route condition, ghost, leaderboard, stats, liveries
│   ├── achievements.ts      # 18 achievements and their checks
│   ├── story.ts             # Dispatcher story beats by career progress
│   ├── lessons.ts           # Staged tutorial: one new mechanic per early job
│   ├── depth.ts             # Track classes, curves, stone grades, grind plan, weather, regrowth, emergencies, long haul
│   ├── engage.ts            # Modifiers, weekly challenge, ranks, depot, museum, photo challenges, login, savers, next goal
│   └── *.test.ts            # Tests for the above (npm test)
├── rail/
│   ├── RailProfile.ts       # 2D cross-section curve — the core data model
│   ├── RailSegment.ts       # One 5 m stretch of rail: visual state (rust → steel, hot, flash)
│   ├── RailBatch.ts         # Draws every rail segment as ONE mesh (+ one for running bands)
│   ├── RailTrack.ts         # Curved spline track with segments, ties, ballast
│   ├── *.test.ts            # Unit tests for profile math and section layout (npm test)
│   └── ProfileRenderer.ts   # 2D canvas overlay drawing the profile curves
├── world/
│   ├── RailGrinder.ts       # 9-car grinding consist with detailed geometry
│   ├── PassingTrain.ts      # Freight train on adjacent track + InstancedMesh track
│   ├── RevenueTrainDeadline.ts # Revenue-train countdown + missed-window penalty
│   ├── Environment.ts       # Trees, rocks, grass, terrain, mountains, stars
│   ├── DayNightCycle.ts     # Time-of-day presets: sky, fog, light, colour grade, bloom
│   ├── SkyDome.ts           # Gradient sky shader with sun/moon and stars
│   ├── GroundMist.ts        # Drifting low haze, clear near the grinder
│   ├── Ocean.ts             # Coast job: wave shader sea + beach following the track
│   ├── SlowOrderSigns.ts    # Yellow speed boards that flip green when cleared
│   ├── Landmarks.ts         # Per-route landmarks + level crossings (gates, bell, cars)
│   ├── ConsistLights.ts     # Headlight spot + visible beam, fades in with darkness
│   ├── trackBed.ts          # Gravel texture + sloped ballast geometry (shared)
│   ├── Weather.ts           # Rain streaks / snow + per-route climate "director"
│   ├── Seasons.ts           # Season looks + cloud-shadow shader patch for the ground
│   ├── Wildlife.ts          # Birds and deer that scatter from the consist (2 instanced draws)
│   ├── LinesideFire.ts      # Grass fire + water-car spray
│   ├── TrackCrews.ts        # Work crews (speed limit) and broken rail (stop + weld)
│   ├── Atmos.ts             # Puddles, drips, town lights, aircraft, tumbleweeds, frost, wind sway
│   └── ProceduralTextures.ts # Canvas-based textures for train bodies and ground
├── effects/
│   ├── GrindEffects.ts      # Sparks + dust + work lights + contact glow, per frame
│   ├── DustSystem.ts        # Billowing grinding-dust puffs (custom point shader)
│   ├── SparkSystem.ts       # Grinding sparks drawn as glowing streaks (800 max)
│   ├── GrindSpray.ts        # Ballast chips + water mist under the stones (2 point clouds)
│   └── GrindContact.ts      # Glowing contact point and ground trail
├── audio/
│   ├── AudioManager.ts      # Web Audio API — grinding, diesel, clicks, alarms
│   ├── glide.ts             # Smooth, rate-limited sound parameter changes (no audio-engine flooding)
│   └── Ambience.ts          # Per-route background sounds + crossing bell
├── ui/
│   ├── TrackMap.ts           # Top-of-screen track progress strip
│   ├── ProfileRenderer.ts   # (in rail/) Dual rail profile displays
│   ├── FloatingScore.ts     # Animated floating text popups
│   ├── palette.ts           # Status colours + colour-blind palette (key C)
│   ├── PerfOverlay.ts       # FPS / frame-time counter (backtick key)
│   ├── PhotoMode.ts         # Free orbit camera, hidden HUD, save PNG (key F)
│   ├── RadioDispatch.ts     # Periodic dispatch messages
│   ├── InspectionReport.ts  # Pre/post job reports with RQI
│   ├── JobSelect.ts         # Job selection screen with US map
│   ├── GuidedTutorial.ts    # Interactive onboarding (teaches by doing)
│   ├── SettingsMenu.ts      # Settings / controls / how-to-play (key H)
│   ├── Hints.ts             # Contextual control hints that retire once learned
│   ├── Toast.ts             # Achievement / new-paint notices
│   ├── TouchControls.ts     # On-screen sticks and buttons (touch screens only)
│   └── ShareCard.ts         # Results image for sharing (clipboard or PNG)
└── types/
    └── rail.ts              # Shared type definitions
```

## Data Flow

```
Game.ts (orchestrator)
  │
  ├── Engine.ts ─── renders scene via pixel-art pipeline
  │                  (render to low-res target → upscale with NearestFilter)
  │
  ├── RailTrack ─── CatmullRomCurve3 spline → positions everything along the curve
  │   ├── RailSegment[] (left + right) ─── look of each 5 m stretch
  │   ├── RailBatch ─── all segments in one mesh, built from the RailProfiles
  │   ├── Ties (InstancedMesh via Environment)
  │   └── Ballast chunks
  │
  ├── RailGrinder ─── 9 car groups, each positioned independently via bogie method
  │   └── GrindModules[] ─── depress when grinding active
  │
  ├── handleGrinding() ─── each frame while SPACE held (numbers from game/rules.ts):
  │   ├── RailProfile.removeMetalAt() ─── modifies the 2D cross-section
  │   ├── RailSegment.setProfile() ─── rewrites that segment's vertices in place
  │   ├── RailSegment.setGrindProgress() ─── rust → steel, driven by section accuracy
  │   ├── GrindEffects.setState() ─── 32 spark sources across 4 cars + work lights
  │   ├── AudioManager.startGrinding() ─── pitch varies with contact deviation
  │   └── ProfileRenderer.draw() ─── updates the 2D profile display
  │
  ├── ProfileRenderer ─── draws on canvas:
  │   ├── Target profile (green dashed)
  │   ├── Current profile (color-coded: red/yellow/green/pink)
  │   ├── Stone contact zone (aim indicator or active grinding)
  │   ├── Worst defect zone highlights (pulsing orange markers)
  │   └── Ghost profile (before/after flash)
  │
  └── UI overlays ─── TrackMap, FloatingScore, RadioDispatch, etc.
```

## Key Design Decisions

### Pixel Art Pipeline
The scene renders to a HalfFloat WebGLRenderTarget at 1/2 screen resolution, then displays on a fullscreen quad with `NearestFilter`. This creates a stylized pixel look without changing any geometry.

Between those steps, `Engine` adds two post-processing passes, both at the low resolution so they stay pixel-chunky:
- **Bloom** (`UnrealBloomPass`): anything brighter than white glows — sparks, the sun, work lights, the completion glint. HalfFloat is what lets values go above 1.0 instead of clipping. `engine.bloomEnabled` turns it off.
- **Colour grade** (in the output shader): tone mapping, then lift/gain/saturation/contrast. `DayNightCycle` sets these (plus bloom strength) per time of day.

### Sky, Fog and Shadows
`SkyDome` is a shader-drawn gradient sphere with a sun/moon disc and twinkling stars (night only). Fog uses the sky’s horizon colour so distant scenery melts into the sky. `GroundMist` adds drifting haze layers that are clear around the grinder and thicken with distance. The sun’s 70 m shadow box sits just ahead of the camera, so shadows work along the whole track and are only drawn where you can see them. It snaps to whole shadow-map texels, so shadow edges don’t shimmer as the camera moves.

### Curved Track via CatmullRom Spline
The track is a `CatmullRomCurve3` with 1000 arc-length subdivisions. Everything — rail segments, ties, ballast, grinder cars, passing trains, scenery — positions itself by querying `getTrackPoint(distance)` which returns position + forward + right + up + banking angle. The spline is sampled once into a lookup table (every 25 cm) and `getTrackPoint` interpolates it, which is much cheaper than asking the spline ~130 times a frame. The result comes from a pool of 16 reused objects: copy anything you want to keep.

### Bogie-Based Car Positioning
Each car computes its orientation from the line between its front and rear bogie positions on the spline. This naturally produces smooth articulation through curves — a long car on a wide curve barely rotates, a short car on a tight curve rotates more.

### Dual Rail Independence
Left and right rails have independent profiles, defects, and controls. Left rail uses Q/E for angle and A/D for pressure; right rail uses U/O for angle and J/L for pressure (mirrored direction so controls match the visual). The right rail's profile display is mirrored so gauge sides face inward.

### InstancedMesh for Scenery and Adjacent Track
Trees, bushes, rocks, grass use `InstancedMesh` to reduce draw calls from ~2000 to ~15. The adjacent passing-train track (rails, ties, ballast, shoulders) also uses `InstancedMesh` — 4 draw calls instead of ~800.

### Track Section Offset
The track has a 50m lead-in zone before game sections begin (`sectionOffset`). This lets the 9-car grinder consist spread out along the track without trailing cars clamping to position 0. `getSectionIndex()` and `getSegmentsForSection()` account for this offset; `getSegmentIndex()` (visual only) does not.

### Merged Meshes ("baking")
Every separate mesh is a draw call, and another one for the shadow map. The grinder consist was built from ~4,000 small boxes, cylinders and spheres, which alone cost ~38 ms a frame. `core/bakeStatic.ts` merges all of a model's fixed parts into one mesh per material after it's built:
- `RailGrinder`: each car is baked. The 8 drop-down grind modules of each grinding car are merged into one piece that moves as a whole.
- `PassingTrain`: each freight car is baked.
- `Environment`: poles, signals, hills and mountains are baked; trees, bushes, rocks and grass are already instanced.
- `Landmarks` uses its own version of the same idea, with the same shared per-vertex material for its plain colours. Its moving parts (windmill wheel, cows and their heads, gate arms, cars, lighthouse beams) each have their own pieces merged too (`bakeMovingParts`), and crossing lamps that flash together share one material per crossing — prairie landmarks went from ~120 draw calls to ~30.
- `SlowOrderSigns`: all posts, yellow faces and green faces are three `InstancedMesh`es; a spinning board just rewrites its two instance matrices.
- `GrindContact`: the "freshly ground" trail markers are one `InstancedMesh` reused as a ring of 100 slots (it used to add a new mesh every 2 m).

Two options squeeze the grinder and freight cars further:
- **`vertexMaterial`**: every "plain" material (a colour, metalness, roughness and fixed glow — no texture, not see-through) is merged into one shared material. Each vertex carries its old material's values instead (`createVertexPbrMaterial`), so a car painted in 15 colours is one draw call. Materials whose brightness changes while playing (headlights, beacons) are passed as `animated` and kept separate.
- **`shadowProxy`**: everything that casts a shadow is also merged into one shadow-only mesh on `SHADOW_LAYER`. The sun's shadow camera sees that layer and the main camera doesn't, so each car's shadow costs one draw call.

Parts smaller than ~35 cm, or thinner than ~6 cm (bolts, rivets, handrails), stop casting shadows while being merged; at the game's pixel resolution their shadows were under a pixel anyway.

### Batched Rails
`RailBatch` draws all rail segments of a track as one mesh, plus one mesh for the polished running bands. Segments butt up against each other, so only the first and last segment of each rail have end faces (that halves the rail's triangles). Each vertex stores which segment it belongs to, and a small float texture holds each segment's colour, glow, metalness, roughness and band opacity, which the shader reads. `RailSegment` keeps the colour logic and writes its numbers into the batch. Grinding rewrites only that segment's vertices in the existing buffer, and only that slice is uploaded. Only segments that are cooling down or flashing are updated each frame (`RailTrack.updateSegments`).

### Shader Warm-up
three.js compiles a material's shader the first time it's drawn. It also recompiles everything when the number of lights changes, or when shadows are switched on or off. That used to freeze the game for ~4 seconds on the first freight train and on the G key. Now:
- `Engine.prewarm()` compiles everything in the background at start-up, after a job loads and after G, holding the last frame meanwhile.
- It then draws the whole scene once off screen with every hidden object switched on (`Engine.warmDraw`: sparks, dust, trail, freight, rain, snow). On Windows the browser finishes preparing a shader the first time it is actually drawn, so this avoids small stalls the first time each effect appears.
- Anything added to the scene *during* play misses the warm-up, so effects are created up front and shown/hidden (or use instance counts) rather than created on demand.
- The freight's headlight always exists and is turned to 0 when the train isn't passing, so the light count never changes during play.

### Pre-allocated Temp Objects
Hot-path methods (`handleGrinderMovement`, `handleInspectionPass`, `getTrackPoint`, `handleCamera`) reuse pre-allocated `Vector3`/`Quaternion`/`Matrix4` objects to avoid per-frame garbage collection pressure.

### Occupancy Grid for Scenery Placement
`Environment` pre-computes a hash-based occupancy grid at construction time so `isOnTrack()` is O(1) instead of sampling 101 spline points per call.

### Procedural Everything
No external files are loaded. Textures are drawn on `<canvas>` elements, audio is synthesized with Web Audio API oscillators and noise buffers, the US map is drawn from coordinate arrays, and all 3D models are built from primitive geometries.

## Adding a New Job

Edit `src/ui/JobSelect.ts` and add an entry to the `JOBS` array:

```typescript
{
  id: 'myroute',
  name: 'My Railroad — Subdivision Name',
  location: 'State',
  description: 'Description of the route and its defects.',
  difficulty: 'Medium',
  difficultyColor: '#ccaa22',
  trackLength: '300m',
  sections: 15,
  defectSeverity: 0.7,       // 0-1, scales defect depth (Easy 0.55 … Expert 1.0)
  timeOfDay: 1,              // 0=dawn, 1=day, 2=dusk, 3=night
  region: 'mountain',        // 'prairie' | 'mountain' | 'city' | 'coast' — landmarks, weather, sounds
  basePay: 9000,             // career pay; 5★ pays ≈115% of this (career.jobPay)
  starsToUnlock: 3,          // total best stars across all jobs needed to play it
  scenery: 'coast',          // optional: ocean + beach on the west side
  trackPoints: [
    new THREE.Vector3(x, 0, z),  // control points for CatmullRom spline
    // ... more points define the route's curves
  ],
}
```

Add the location to `JOB_LOCATIONS` with real longitude/latitude for the US map marker.

### Living World: Time, Weather, Regions
- **Time of day** (`DayNightCycle`): a `clock` runs 0→4 (dawn, day, dusk, night). Each phase lasts `PHASE_SECONDS` — it holds for the first half, then blends into the next. Every frame the two neighbouring presets are blended, then weather is layered on top (`overcast` greys the sky and dims the sun; `snowCover` whitens the ground). `darkness` (0..1) is what headlights, beacons, lamps and windows read.
- **Weather** (`Weather`): each `Region` has a climate (`CLIMATES`) — rain or snow, how often, how heavy. A small director picks a new state every 50–120 s and everything eases toward it. P forces showers on/off.
- **Region** (`types/rail.ts`, set per job in `JobSelect`): picks the landmarks, the climate, the background sounds and the countryside (`REGION_SCENERY` in `Game.ts`: tree density and distant mountains — none on the prairie or in Chicago).
- **Slow orders** (`Game.slowOrderSpeedLimit`): 2 m/s inside one; ahead of one, the speed that can still brake (10 m/s²) down to the limit in time. SHIFT fast travel never raises it.
- **Landmarks**: static parts are merged into one mesh per material ("baked"), so a whole route of landmarks costs only a handful of draw calls. `blocks(x, z)` is passed to `Environment` so trees stay off roads and landmarks.
- **Level crossings**: `Game.crossingOccupancy()` reports the stretches of track the grinder and any passing freight are on, plus ~6 s of travel ahead. A crossing closes when its spot is inside one of them. Cars stop at the stop line (x = +12 / −8). Only a car already between the lines when the lights start may carry on and clear the tracks.
- **Clearances**: nothing may stand within ~2.2 m of the main track centre, or 3.3–6.7 m on the right where the adjacent track's freight passes. Lineside poles, mileposts and signals are placed by distance along the track (`Environment.placeLineside`) so they stay clear on curves too.
- **Freight work-zone speed** (`freightAllowedSpeed` in `PassingTrain.ts`): the freight brakes to 11 m/s (~25 mph) before the zone around the grinder, then speeds back up once past it.
- **Rain/snow shelter** (`Weather.setShelter`): `Game` passes a chain of points along the consist each frame; drops that land within 1.7 m of one and below roof height are removed.
- **Tests for the performance work** (`core/performance.test.ts`): merged meshes keep their place and shadow rules, the lookup table matches the spline to under 1 mm, and grinding rewrites only one segment's slice of the rail buffer.
- **Tests for the world logic**: `world/Landmarks.test.ts` covers the crossing car. `world/livingWorld.test.ts` covers time-of-day blending, the weather director, freight speed and slow-order braking. These are pure functions, so they need no browser.
- **Hot rail** (`RailSegment.heatUp`): `Game.handleGrinding` heats the segments under each grinding car; they cool in `update()` over ~3.5 s.

### Game Feel, Progression and Job Events
- **Scoring** (`game/scoring.ts`, `game/defects.ts`): every section gets a damage kind (seeded by job, weighted by region) with its own ideal aim/pressure; `Game.completeSegment` decides perfect passes and feeds the `Combo`. Hit-stop (`Engine.hitStop`), camera punch, fanfares and spark fountains scale with how well the section went.
- **Meta** (`game/meta.ts`, `achievements.ts`, `story.ts`): everything after a job happens in `Game.afterJobProgress` — stats, daily streak, route condition, grade + medal, ghost, achievements, new liveries. All saved with `core/storage`.
- **Job events** (`Game.buildJobEvents` / `updateJobEvents`): crews, broken rail, fire, stone wear, the train hold, new-damage cards. Which are on comes from `featuresFor(jobsDone)` in `game/lessons.ts`.
- **Screen effects** (`Engine.fx`, set in `Game.updateScreenFx`): heat haze (UV wobble around the projected stones, smaller with distance), lightning flash, and sun shafts (a 20-sample radial smear of HDR-bright sky toward the sun) all run in the existing output pass — no extra render passes.
- **World looks** (`Game.updateWorldFx`): wetness (ground + ballast darker, ballast glossier), cloud shadows (noise in the ground's fragment shader), season (Environment recolours deciduous canopies per instance and tints greens; pines are `userData.evergreen`).

### Depth and Engagement (round 2)
- **Target profile per route** (`depth.applyTemplate`): `Game.targetProfile.points` is rebuilt from the AREMA base each job. Removing metal raises y, so relief adds to the target's y.
- **Curves** (`depth.curvePeaks`): `applyInitialDefects` measures each section's heading change (`sectionTurn`, + = left) and adds gauge-face wear to the outer rail and crown wear to the inner.
- **Pre-job choices** (`InspectionReport.showPreJobReport` resolves `{ stone, plan }`): stone grade multiplies removal, heat and the section bonus; the plan pays `depth.planBonus` at the end.
- **Engagement state** lives in `game/engage.ts` (all saved via `core/storage`). `Game.buildJobEvents` reads modifiers, rank perks, depot crew and machine at job start; `afterJobProgress` updates the session tally.
- **Retry a section**: every rail profile is copied at job start (`startProfiles`); `retrySection` copies a section back and marks it practice (`practiced`), which skips the bonus and the combo.
- **Keys**: `InputManager` translates every physical key through `buildLookup(settings.keymap)` before the game sees it, so game code always checks the default key names. Touch controls and the gamepad feed the same "virtual keys".
- **Money for job events** (fines, close calls, holds) is in `EVENT_PAY` in `game/rules.ts`.
- **Visual check**: `scripts/visual-check.mjs` seeds `Math.random`, freezes game time (`engine.timeScale = 0`) before each shot, and compares against `visual/baseline/` with a per-pixel tolerance.

### Career Mode
`game/career.ts` is pure logic (no DOM): pay per contract from stars, upgrade prices and effects, and unlock checks from total career stars. `JobSelect` shows the balance, locks contracts and runs the upgrade shop; `Game` applies upgrade multipliers (heat, removal rate, stone width) when a job starts and pays out on completion. Balance numbers live in `career.ts` and `rules.ts`. Add `?unlock` to the URL to open every contract while testing.

### Graphics Quality
`core/quality.ts` holds three presets; `Game.applyQuality()` applies them. G cycles them and the choice is saved.

| Preset | Bloom | Shadows | Ground mist | Dust | Frame rate |
|--------|-------|---------|-------------|------|------------|
| High   | on    | 1024²   | on          | 100% | screen's refresh rate |
| Medium | on    | 512²    | off         | 50%  | max 60 fps |
| Low    | off   | off     | off         | 25%  | max 60 fps, chunkier pixels |

The 60 fps cap matters on high-refresh laptops: at 144 Hz the game would otherwise draw 2.4 times as many frames, for battery and fan noise.

## Performance Notes

Measured in headless Chrome (RTX 3090) on Marias Pass. "Pass 1" fixed the frame rate; "pass 2" cut the GPU load (for weaker machines) and the garbage that causes stutters.

| | Original | Pass 1 | Pass 2 | Pass 3 | Pass 4 |
|---|---|---|---|---|---|
| Frame time (driving) | 46 ms (~20 fps) | 16.7 ms (60 fps cap) | 16.7 ms | 16.7 ms | 16.7 ms |
| Renderer CPU per frame | 42.6 ms | ~5 ms | ~2.6 ms | ~2.1 ms | ~2 ms |
| GPU: scene / shadows (1080p) | — | 4.3 / 1.7 ms | 3.4 / 0.7 ms | 1.75 / 0.55 ms | 1.4 / 0.55 ms |
| Draw calls per frame (Marias / prairie) | ~6,700 | ~380 | ~145 / ~230 | ~108 / ~196 | ~88 / ~110 |
| Lights | 11 | 8 | 5 | 5 | 5 |
| Garbage while grinding | — | ~24 MB/s | ~9 MB/s | ~8 MB/s | ~7 MB/s |
| Slow laptop (CPU ×4 slower): typical / 95th-pct / worst frame | — | — | 27.9 / 49 / 129 ms | 21.9 / 34 / 88 ms | 18 / 25 / 33 ms |
| Stutter with sound on (frames > 35 ms in 12 s) | — | — | — | 10–24 | 0 |
| Click → job menu | — | — | ~1.05 s | ~0.15–0.5 s | ~0.15–0.5 s |
| Stall when grinding first starts | — | — | ~0.2 s | none | none |
| First freight train | 4.7 s freeze | no freeze | no freeze | no freeze | no freeze |
| G key (shadows off) | 4 s freeze | ~40 ms | ~40 ms | ~40–150 ms | ~40 ms |

- **Target**: 60fps on modern hardware at 1080p
- **Draw calls are the thing to watch.** The FPS counter (backtick) shows draw calls and triangles per frame. If it jumps after you add something, the new object probably needs to be baked, instanced or given a shared material.
- **Lights**: 5 — sun, sky (hemisphere), the cab work light, one grind-area light and the headlight spot. Every light costs something on every lit pixel of the scene, even at brightness 0, so small glows are faked:
  - the spark and contact glow add into the one grind-area light (`GrindEffects.update`);
  - the freight's headlight is a soft additive pool of light on the ground (`PassingTrain.createHeadlightPool`).
- **Shadows**: a 1024² map (High) covering 70 m just ahead of the camera. Most models cast through one shadow-only proxy each (see Merged Meshes).
- **Materials**: fully rough scenery (trees, bushes, rocks, grass, the ground) uses the cheaper `MeshLambertMaterial` — same diffuse lighting, none of the specular maths (`Environment.toMatte`).
- **Rendering pauses in menus**: in the job select, reports and the pause menu nothing on screen can change, so `Engine.renderHold` skips drawing and the browser keeps the last frame (0 draw calls). A window resize forces one fresh frame.
- **Render resolution**: about 540 rows on every screen. Game pixels are 2 screen pixels up to ~1080p, 3 at 1440p and 4 at 4K (`pixelScaleFor`). That keeps the same chunky look everywhere and stops 4K costing four times as much.
- **Rain and snow** are animated in the vertex shader from a fixed random seed per drop (`Weather.patchMaterial`): no per-frame CPU work or uploads, and they still stop at the train roofs.
- **Sparks and dust** keep a free list and skip all work (and drawing) while nothing is flying.
- **Garbage**: `RailProfile.compare()` writes into one reused result. The title screen's animation stops once the game starts (it used to keep drawing all game long). The remaining few MB/s is mostly three.js's own uniform caches, which grows with the number of draw calls.
- **Shader variants**: three.js compiles one shader per material *setting*, so a material shared by objects that differ (instanced vs not, shadow-receiving vs not) or that is see-through and double-sided (drawn twice, back then front) makes it re-check every draw. The see-through double-sided materials use `forceSinglePass`, and the landmarks' moving parts receive shadows like their baked parts.
- **Depth buffer**: a normal depth buffer (near 0.5 m, far 800 m is plenty). The logarithmic one stopped the GPU skipping hidden pixels early.
- **Bloom**: 3 blur levels instead of three.js's 5; the two widest were only a few pixels at this resolution.
- **2D overlays**: the profile displays and track map redraw only when something visible changes (the track map ignores progress changes smaller than a pixel), and at 30 fps while something on them is pulsing. The coloured profile line is drawn as one path per colour. HUD text is only written when its value changes.
- **Start-up**: no world is built until a job is picked (the job menu covers everything), the grinder is built just after the menu appears (`Game.ensureGrinder`), and the game is set up *while* the title fades out (an opacity fade runs on the compositor, so it stays smooth). Click → job menu went from ~1.05 s to ~0.15–0.5 s. Google Fonts load without blocking the first paint.
- **Page (HTML) stalls**: the browser's GPU also draws the HTML interface and 2D canvases, and the first time it draws a *new kind* of shape it builds a drawing pipeline (up to ~0.3 s). The heat bar used to be a rounded fill clipped by a rounded box — a combination nothing else on the page uses — which stalled the game ~0.4 s into the first grind. The fill is rounded itself now, with no clip. Floating score popups animate only `transform` and `opacity`, so their glow is painted once instead of every frame.
- **Profile displays**: the plot's height range snaps to 0.5 mm steps, so the grid and its ~20 text labels are drawn once into an off-screen canvas and reused (canvas text was the biggest cost on slow laptops).
- **Bundle**: three.js is already tree-shaken (unused parts such as loaders, animation and raycasting are left out). What remains is the WebGL renderer and its shader code.
- **Audio** (all sound is synthesized live, so the audio engine does real work):
  - Parameters are changed through `audio/glide.ts`: only when the value really moves, at most 20 times a second, with smoothing. Scheduling a new ramp on ~10 parameters every frame (and `stopGrinding()` fading three gains every frame while *not* grinding) made the game stutter while grinding with sound on.
  - Wheel clicks re-trigger one permanent voice instead of creating three audio nodes per click.
  - One shared noise buffer (wind, grinding grit, ambience), and the grinding sound is built at audio start-up rather than on the first grind.
  - The audio device (~90 ms to open) is opened on the title click and kept paused, so picking a job doesn't hitch; the menu stays silent as before.
- **Low preset** also makes the game pixels one step chunkier (`pixelBoost`) — on a weak GPU the number of pixels is the main cost.
- **Crossing bell** re-triggers one permanent two-tone voice (it rings twice a second; it used to make 4 new audio nodes per ding).
- **Profile displays** redraw the rail curve at most 30 times a second while grinding (other changes — aim, pressure, a new segment — still redraw at once).
- **Tried and rejected (measured worse)**:
  - *Cutting route-long objects into map tiles* so off-screen parts could be skipped (trees, scenery, rails, ties). The camera sees most of the route, so it only removed ~20% of the triangles but doubled the draw calls: GPU time went **up** (1.4 → 2.5 ms on Marias at 150 m tiles; no better at 300 m).
  - *Simpler models for distant grinder cars*: hiding the whole grinder (82k triangles) changed GPU time by ~0.005 ms — triangles aren't a cost in this game, draw calls are.
- **Not done, on purpose**: merging the three ground-mist layers (they cost ~0.01 ms of GPU and their separate heights give the mist depth), and caching the static part of the shadow map (the shadow box follows the camera, so a cache would be invalid nearly every frame; the whole pass is ~0.55 ms).
- **Particle count**: 800 sparks + 300 dust puffs + 2000 rain streaks or 1600 snowflakes (when falling)
