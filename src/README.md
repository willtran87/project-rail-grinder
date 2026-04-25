# Source Architecture

## Directory Structure

```
src/
├── main.ts                  # Entry point — title screen → Game
├── Game.ts                  # Main game class — orchestrates all systems
├── core/
│   ├── Engine.ts            # Three.js renderer, scene, camera, pixel-art pipeline
│   ├── InputManager.ts      # Keyboard and mouse state tracking
│   └── EventBus.ts          # Simple pub/sub for decoupled communication
├── rail/
│   ├── RailProfile.ts       # 2D cross-section curve — the core data model
│   ├── RailSegment.ts       # 3D mesh extruded from a profile, with visual state
│   ├── RailTrack.ts         # Curved spline track with segments, ties, ballast
│   └── ProfileRenderer.ts   # 2D canvas overlay drawing the profile curves
├── world/
│   ├── RailGrinder.ts       # 9-car grinding consist with detailed geometry
│   ├── Train.ts             # Freight train (passing traffic)
│   ├── PassingTrain.ts      # Passing train logic + adjacent track construction
│   ├── Environment.ts       # Trees, rocks, grass, terrain, mountains, stars
│   ├── DayNightCycle.ts     # Time-of-day lighting with color palettes
│   ├── Weather.ts           # Rain particle system
│   └── ProceduralTextures.ts # Canvas-based textures for train bodies and ground
├── effects/
│   ├── SparkSystem.ts       # Grinding spark particles (500+, color gradient)
│   └── GrindContact.ts      # Glowing contact point and ground trail
├── audio/
│   └── AudioManager.ts      # Web Audio API — grinding, diesel, clicks, alarms
├── ui/
│   ├── TrackMap.ts           # Top-of-screen track progress strip
│   ├── ProfileRenderer.ts   # (in rail/) Dual rail profile displays
│   ├── FloatingScore.ts     # Animated floating text popups
│   ├── RadioDispatch.ts     # Periodic dispatch messages
│   ├── InspectionReport.ts  # Pre/post job reports with RQI
│   ├── JobSelect.ts         # Job selection screen with US map
│   ├── GuidedTutorial.ts    # Interactive onboarding (teaches by doing)
│   └── TutorialManager.ts   # Legacy text-box tutorial (largely superseded)
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
  ├── handleGrinding() ─── each frame while SPACE held:
  │   ├── RailProfile.removeMetalAt() ─── modifies the 2D cross-section
  │   ├── RailSegment.rebuildMesh() ─── regenerates 3D geometry
  │   ├── RailSegment.setGrindProgress() ─── rust → steel material transition
  │   ├── SparkSystem.setEmitPoints() ─── 32 spark sources across 4 cars
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
The scene renders to a WebGLRenderTarget at 1/2 screen resolution, then displays on a fullscreen quad with `NearestFilter`. This creates a stylized pixel look without changing any geometry.

### Curved Track via CatmullRom Spline
The track is a `CatmullRomCurve3` with 1000 arc-length subdivisions. Everything — rail segments, ties, ballast, grinder cars, passing trains, scenery — positions itself by querying `getTrackPoint(distance)` which returns position + forward + right + up + banking angle.

### Bogie-Based Car Positioning
Each car computes its orientation from the line between its front and rear bogie positions on the spline. This naturally produces smooth articulation through curves — a long car on a wide curve barely rotates, a short car on a tight curve rotates more.

### Dual Rail Independence
Left and right rails have independent profiles, defects, and stone settings. The right rail's profile display is mirrored so gauge sides face inward (as viewed from above). Q/E angle controls are inverted for the right rail to match the visual.

### InstancedMesh for Scenery
Trees, bushes, rocks, grass, and ballast shoulders use `InstancedMesh` to reduce draw calls from ~2000 to ~15. Each scenery type shares one geometry and one material across all instances.

### Pre-allocated Temp Objects
Hot-path methods (`handleGrinderMovement`, `handleInspectionPass`, `getTrackPoint`) reuse pre-allocated `Vector3`/`Quaternion`/`Matrix4` objects to avoid per-frame garbage collection pressure.

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
  defectMultiplier: 0.7,    // 0-1, scales defect severity
  defectSeverity: 0.7,
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
- **Draw calls**: ~50-80 (instanced scenery + train geometry + rail segments)
- **Particle count**: 800 sparks + 2000 rain (when active)
