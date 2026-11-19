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
│   └── dispose.ts           # Frees GPU memory of discarded scene objects
├── game/                    # Pure game logic — no Three.js/DOM, fully unit-tested
│   ├── rules.ts             # ALL tuning numbers + scoring formulas (rebalance here)
│   ├── sectionMetrics.ts    # Accuracy/deviation of a whole 20m section
│   ├── progress.ts          # Personal bests per job (saved in localStorage)
│   ├── career.ts            # Money, upgrades, unlocks (career mode)
│   └── *.test.ts            # Tests for the above (npm test)
├── rail/
│   ├── RailProfile.ts       # 2D cross-section curve — the core data model
│   ├── RailSegment.ts       # 3D mesh extruded from a profile, with visual state
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
│   ├── trackBed.ts          # Gravel texture + sloped ballast geometry (shared)
│   ├── Weather.ts           # Rain particle system
│   └── ProceduralTextures.ts # Canvas-based textures for train bodies and ground
├── effects/
│   ├── GrindEffects.ts      # Sparks + dust + work lights + contact glow, per frame
│   ├── DustSystem.ts        # Billowing grinding-dust puffs (custom point shader)
│   ├── SparkSystem.ts       # Grinding sparks drawn as glowing streaks (800 max)
│   └── GrindContact.ts      # Glowing contact point and ground trail
├── audio/
│   └── AudioManager.ts      # Web Audio API — grinding, diesel, clicks, alarms
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
  │   ├── RailSegment[] (left + right) ─── ExtrudeGeometry from RailProfile
  │   ├── Ties (InstancedMesh via Environment)
  │   └── Ballast chunks
  │
  ├── RailGrinder ─── 9 car groups, each positioned independently via bogie method
  │   └── GrindModules[] ─── depress when grinding active
  │
  ├── handleGrinding() ─── each frame while SPACE held (numbers from game/rules.ts):
  │   ├── RailProfile.removeMetalAt() ─── modifies the 2D cross-section
  │   ├── RailSegment.rebuildMesh() ─── regenerates 3D geometry
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
`SkyDome` is a shader-drawn gradient sphere with a sun/moon disc and twinkling stars (night only). Fog uses the sky’s horizon colour so distant scenery melts into the sky. `GroundMist` adds drifting haze layers that are clear around the grinder and thicken with distance. The sun’s shadow box follows the grinder, so shadows work along the whole track (it used to be fixed near the start).

### Curved Track via CatmullRom Spline
The track is a `CatmullRomCurve3` with 1000 arc-length subdivisions. Everything — rail segments, ties, ballast, grinder cars, passing trains, scenery — positions itself by querying `getTrackPoint(distance)` which returns position + forward + right + up + banking angle.

### Bogie-Based Car Positioning
Each car computes its orientation from the line between its front and rear bogie positions on the spline. This naturally produces smooth articulation through curves — a long car on a wide curve barely rotates, a short car on a tight curve rotates more.

### Dual Rail Independence
Left and right rails have independent profiles, defects, and controls. Left rail uses Q/E for angle and A/D for pressure; right rail uses U/O for angle and J/L for pressure (mirrored direction so controls match the visual). The right rail's profile display is mirrored so gauge sides face inward.

### InstancedMesh for Scenery and Adjacent Track
Trees, bushes, rocks, grass use `InstancedMesh` to reduce draw calls from ~2000 to ~15. The adjacent passing-train track (rails, ties, ballast, shoulders) also uses `InstancedMesh` — 4 draw calls instead of ~800.

### Track Section Offset
The track has a 50m lead-in zone before game sections begin (`sectionOffset`). This lets the 9-car grinder consist spread out along the track without trailing cars clamping to position 0. `getSectionIndex()` and `getSegmentsForSection()` account for this offset; `getSegmentIndex()` (visual only) does not.

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
  trackPoints: [
    new THREE.Vector3(x, 0, z),  // control points for CatmullRom spline
    // ... more points define the route's curves
  ],
}
```

Add the location to `JOB_LOCATIONS` with real longitude/latitude for the US map marker.

## Performance Notes

- **Target**: 60fps on modern hardware at 1080p
- **Main bottleneck**: `RailSegment.rebuildMesh()` during grinding (ExtrudeGeometry rebuild)
- **Light count**: 7 total (1 directional, 1 hemisphere, 4 work lights, 1 spark light)
- **Shadows**: 1024² map covering ±45m around the grinder — the most expensive pass now that it covers the train
- **Draw calls**: ties and ballast are instanced too (one call each instead of ~800)
- **Particle count**: 800 sparks + 2000 rain (when active)
