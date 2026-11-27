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
│   ├── CameraController.ts  # Camera views (1-5), screen shake, inspection cinematic
│   ├── storage.ts           # Safe localStorage wrapper (never throws)
│   ├── quality.ts           # Graphics quality presets (key G)
│   ├── bakeStatic.ts        # Merges a model's fixed parts into one mesh per material
│   ├── performance.test.ts  # Tests for the merging, batched rails and track lookup
│   └── dispose.ts           # Frees GPU memory of discarded scene objects
├── game/                    # Pure game logic — no Three.js/DOM, fully unit-tested
│   ├── rules.ts             # ALL tuning numbers + scoring formulas (rebalance here)
│   ├── sectionMetrics.ts    # Accuracy/deviation of a whole 20m section
│   ├── progress.ts          # Personal bests per job (saved in localStorage)
│   ├── career.ts            # Money, upgrades, unlocks (career mode)
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
│   └── ProceduralTextures.ts # Canvas-based textures for train bodies and ground
├── effects/
│   ├── GrindEffects.ts      # Sparks + dust + work lights + contact glow, per frame
│   ├── DustSystem.ts        # Billowing grinding-dust puffs (custom point shader)
│   ├── SparkSystem.ts       # Grinding sparks drawn as glowing streaks (800 max)
│   └── GrindContact.ts      # Glowing contact point and ground trail
├── audio/
│   ├── AudioManager.ts      # Web Audio API — grinding, diesel, clicks, alarms
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
│   └── GuidedTutorial.ts    # Interactive onboarding (teaches by doing)
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
- `RailGrinder`: each car is baked; the drop-down grind modules stay separate because they move.
- `PassingTrain`: each freight car is baked.
- `Environment`: poles, signals, hills and mountains are baked; trees, bushes, rocks and grass are already instanced.
- `Landmarks` uses its own version of the same idea.

Parts smaller than ~35 cm, or thinner than ~6 cm (bolts, rivets, handrails), stop casting shadows while being merged; at the game's pixel resolution their shadows were under a pixel anyway. When you add detail to a model, keep sharing the `this.m.*` materials: every new material is another draw call after baking.

### Batched Rails
`RailBatch` draws all rail segments of a track as one mesh, plus one mesh for the polished running bands. Each vertex stores which segment it belongs to, and a small float texture holds each segment's colour, glow, metalness, roughness and band opacity, which the shader reads. `RailSegment` keeps the colour logic and writes its numbers into the batch. Grinding rewrites only that segment's vertices in the existing buffer, and only that slice is uploaded. Only segments that are cooling down or flashing are updated each frame (`RailTrack.updateSegments`).

### Shader Warm-up
three.js compiles a material's shader the first time it's drawn. It also recompiles everything when the number of lights changes, or when shadows are switched on or off. That used to freeze the game for ~4 seconds on the first freight train and on the G key. Now:
- `Engine.prewarm()` compiles everything in the background after a job loads and after G, holding the last frame meanwhile.
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

### Career Mode
`game/career.ts` is pure logic (no DOM): pay per contract from stars, upgrade prices and effects, and unlock checks from total career stars. `JobSelect` shows the balance, locks contracts and runs the upgrade shop; `Game` applies upgrade multipliers (heat, removal rate, stone width) when a job starts and pays out on completion. Balance numbers live in `career.ts` and `rules.ts`. Add `?unlock` to the URL to open every contract while testing.

### Graphics Quality
`core/quality.ts` holds three presets; `Game.applyQuality()` applies them. G cycles them and the choice is saved.

| Preset | Bloom | Shadows | Ground mist | Dust |
|--------|-------|---------|-------------|------|
| High   | on    | 1024²   | on          | 100% |
| Medium | on    | 512²    | off         | 50%  |
| Low    | off   | off     | off         | 25%  |

## Performance Notes

Measured in headless Chrome (RTX 3090, 1600×900) on Marias Pass:

| | Before | After |
|---|---|---|
| Frame time (driving) | 46 ms (~20 fps) | 16.7 ms (60 fps cap) |
| Renderer CPU per frame | 42.6 ms | ~4–5 ms |
| Draw calls per frame | ~6,700 | ~380 |
| Meshes in the scene | ~5,100 | ~360 |
| First freight train | 4.7 s freeze | no freeze |
| G key (shadows off) | 4 s freeze | ~40 ms |

- **Target**: 60fps on modern hardware at 1080p
- **Draw calls are the thing to watch.** The FPS counter (backtick) shows draw calls and triangles per frame. If it jumps after you add something, the new object probably needs to be baked, instanced or given a shared material.
- **Light count**: 7 total (1 directional, 1 hemisphere, 2 work lights, 1 spark light, 1 contact glow, 1 headlight spot), plus the freight headlight (always present, 0 when idle). Every light costs something on every lit pixel, so prefer emissive materials and bloom for small glows.
- **Shadows**: a 1024² map (High) covering 70 m just ahead of the camera.
- **Depth buffer**: a normal depth buffer (near 0.5 m, far 800 m is plenty). The logarithmic one stopped the GPU skipping hidden pixels early.
- **Bloom**: 3 blur levels instead of three.js's 5; the two widest were only a few pixels at this resolution.
- **2D overlays**: the profile displays and track map redraw only when something changes, and at 30 fps while something on them is pulsing. HUD text is only written when its value changes.
- **Particle count**: 800 sparks + 300 dust puffs + 2000 rain streaks or 1600 snowflakes (when falling)
