/**
 * GroundMist - Low-lying haze that hugs the ground around the grinder.
 *
 * A few large, horizontal, see-through layers stacked just above the ground,
 * textured with soft procedural noise and slowly drifting. Seen from a low
 * camera they read as mist banks in the distance; the colour follows the
 * fog/horizon colour so they always blend with the sky.
 *
 * Density per time of day: thick at dawn, faint by day, warm haze at dusk.
 */

import * as THREE from 'three';

const LAYERS = [
  { height: -0.3, opacity: 1.0, drift: new THREE.Vector2(0.004, 0.001) },
  { height: 0.8, opacity: 0.7, drift: new THREE.Vector2(-0.003, 0.002) },
  { height: 2.0, opacity: 0.45, drift: new THREE.Vector2(0.002, -0.002) },
];
const SIZE = 320; // metres across each layer

/** Density (0..1) for each time of day, by DayNightCycle.currentName */
const DENSITY: Record<string, number> = { DAWN: 0.55, DAY: 0.12, DUSK: 0.35, NIGHT: 0.3 };

/** Soft cloudy noise with transparent holes, drawn once on a canvas */
function createMistTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  // Many overlapping soft blobs; drawn 3x3 so the texture tiles seamlessly
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 20 + Math.random() * 50;
    const a = 0.05 + Math.random() * 0.1;
    for (let ox = -1; ox <= 1; ox++) {
      for (let oy = -1; oy <= 1; oy++) {
        const g = ctx.createRadialGradient(x + ox * size, y + oy * size, 0, x + ox * size, y + oy * size, r);
        g.addColorStop(0, `rgba(255,255,255,${a})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  return tex;
}

/**
 * Radial mask: clear around the grinder (so the action is never veiled),
 * thickening with distance, then fading at the layer's outer edge.
 */
function createDistanceMask(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0.0, '#000');   // clear within ~25m
  g.addColorStop(0.16, '#000');
  g.addColorStop(0.55, '#fff');  // full mist by ~90m
  g.addColorStop(0.85, '#fff');
  g.addColorStop(1.0, '#000');   // soft outer edge
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export class GroundMist {
  readonly group = new THREE.Group();
  private materials: THREE.MeshBasicMaterial[] = [];
  private textures: THREE.Texture[] = [];
  private density = 0.12;

  constructor() {
    const mask = createDistanceMask(); // shared; stays centred (its own UV transform)
    for (const layer of LAYERS) {
      const tex = createMistTexture();
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        alphaMap: mask,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        fog: false,           // mist IS the fog — don't fade it twice
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(SIZE, SIZE), mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = layer.height;
      mesh.renderOrder = 10; // after opaque scenery
      this.group.add(mesh);
      this.materials.push(mat);
      this.textures.push(tex);
    }
  }

  /**
   * @param focus - centre the mist on the action
   * @param color - fog/horizon colour to tint with
   * @param timeName - DayNightCycle.currentName (DAWN / DAY / DUSK / NIGHT)
   */
  update(dt: number, focus: THREE.Vector3, color: THREE.Color, timeName: string): void {
    this.group.position.set(focus.x, 0, focus.z);
    const target = DENSITY[timeName] ?? 0.2;
    this.density += (target - this.density) * Math.min(1, dt * 0.8); // ease between times of day

    for (let i = 0; i < LAYERS.length; i++) {
      const mat = this.materials[i];
      mat.color.copy(color);
      mat.opacity = this.density * LAYERS[i].opacity;
      // Drift, and counter the group's movement so the mist doesn't "ride along"
      const tex = this.textures[i];
      tex.offset.x = (LAYERS[i].drift.x * performance.now() * 0.06 + focus.x / SIZE * tex.repeat.x) % 1;
      tex.offset.y = (LAYERS[i].drift.y * performance.now() * 0.06 - focus.z / SIZE * tex.repeat.y) % 1;
    }
  }
}
