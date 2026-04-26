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
| W / S | Drive forward / reverse |
| SPACE | Hold to grind (auto-drives while grinding) |
| SHIFT | Hold for fast travel (3x speed when not grinding) |
| **Left Rail** | |
| Q / E | Adjust left stone angle |
| A / D | Adjust left pressure |
| **Right Rail** | |
| U / O | Adjust right stone angle |
| J / L | Adjust right pressure |
| **Camera & UI** | |
| 1-5 | Camera angles (chase, side, cab, overview, grind close-up) |
| N | Cycle time of day (dawn, day, dusk, night) |
| P | Toggle rain |
| M | Mute audio |
| ESC | Pause menu (resume, restart, quit to menu) |
| R | Restart |

## How to Play

1. **Select a job** from the contract screen — each route has different track layouts and defect patterns based on real US rail corridors.

2. **Read the inspection report** (shown on replay jobs) to understand the defect severity across sections.

3. **Drive to a damaged section** — the track map at the top shows section status. Orange "NEXT" arrow points to the nearest unfinished section. Sections with slow orders (yellow "SLOW") restrict your speed.

4. **Hold SPACE to grind** — the grinder auto-drives at a steady pace while you focus on aiming. Watch the dual rail profile displays at the bottom.

5. **Adjust angle** to target the orange defect zones on the profile. Left rail uses Q/E, right rail uses U/O. Both rails have independent defects and can be adjusted simultaneously.

6. **Adjust pressure** — left rail uses A/D, right rail uses J/L. Higher pressure removes more metal but generates heat. Overheating reduces effectiveness. Watch the heat gauge.

7. **Don't over-grind** — if you remove too much metal past the green target line, you'll hear an alarm and the profile flashes red. Over-ground damage is permanent.

8. **Complete a section** when both rails reach 80%+ accuracy. The slow order lifts and you see "SLOW ORDER LIFTED — TRACK SPEED 60 MPH".

9. **Beat the deadline** — dispatch sends revenue trains through periodically. A countdown timer shows when the next one arrives.

10. **Complete all sections** to trigger the inspection pass — a cinematic camera sweep showing your finished work.

## Jobs

Four contracts based on real US railroad corridors:

- **BNSF Transcon — Emporia Sub** (Kansas): Flat prairie, gentle curves, head checking from high-speed intermodal. Easy.
- **BNSF Hi-Line — Marias Pass** (Montana): Mountain crossing at 5,213 ft, sharp curves, gauge face wear. Medium.
- **BRC Clearing Yard Approach** (Chicago): Dense urban geometry, corrugation from stop-and-go traffic. Hard.
- **UP Coast Sub — Surf to SLO** (California): Coastal curves, salt air corrosion. Expert.

## Tech Stack

- **Three.js** (r184) — 3D rendering with pixel-art downscaling
- **TypeScript** — strict mode
- **Vite** (v5) — dev server and bundler
- **Web Audio API** — procedural audio (grinding, diesel, wheel clicks, horns)
- **Canvas 2D** — procedural textures, rail profile display, US map, title screen art

No external model files, textures, or audio files. Everything is generated at runtime.

## Build

```bash
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## License

MIT
