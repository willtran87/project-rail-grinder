/**
 * trackBed.ts - Shared look for the ground under the rails:
 *   - a procedural gravel texture (crushed stone in greys and browns)
 *   - a ballast "prism": the trapezoid-shaped bed of stones real track sits on,
 *     with a flat top and sloped sides, UV-mapped so the gravel tiles per metre
 *
 * Used by both the main track (RailTrack) and the adjacent track (PassingTrain),
 * plus the trackside walkways (Environment).
 */

import * as THREE from 'three';

let gravelTexture: THREE.CanvasTexture | null = null;

/**
 * Crushed-stone texture: a dark base covered in hundreds of small angular
 * stones with a light top edge and dark bottom edge (cheap fake lighting).
 * Created once and shared (one tile = 1 metre).
 */
export function getGravelTexture(): THREE.Texture {
  if (gravelTexture) return gravelTexture;
  // No canvas outside a browser (e.g. unit tests in Node) — use a blank texture
  if (typeof document === 'undefined') return new THREE.Texture();

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#56514b';
  ctx.fillRect(0, 0, size, size);

  const tones = ['#7d786f', '#88827a', '#6f6a63', '#8f897f', '#666059', '#7f7569', '#958e83'];
  for (let i = 0; i < 1400; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 2 + Math.random() * 4.5;
    const sides = 5 + Math.floor(Math.random() * 3);
    const rot = Math.random() * Math.PI;
    const stone = new Path2D();
    for (let s = 0; s < sides; s++) {
      const a = rot + (s / sides) * Math.PI * 2;
      const rr = r * (0.7 + Math.random() * 0.45);
      const px = x + Math.cos(a) * rr;
      const py = y + Math.sin(a) * rr * 0.8;
      if (s === 0) stone.moveTo(px, py); else stone.lineTo(px, py);
    }
    stone.closePath();
    // Dark rim offset down-right, then the stone, then a highlight up-left
    ctx.save();
    ctx.translate(1, 1.2);
    ctx.fillStyle = 'rgba(30,27,24,0.45)';
    ctx.fill(stone);
    ctx.restore();
    ctx.fillStyle = tones[Math.floor(Math.random() * tones.length)];
    ctx.fill(stone);
    ctx.save();
    ctx.translate(-0.6, -0.6);
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = '#d8d2c6';
    ctx.scale(1, 1);
    ctx.fill(stone);
    ctx.restore();
  }

  gravelTexture = new THREE.CanvasTexture(canvas);
  gravelTexture.wrapS = gravelTexture.wrapT = THREE.RepeatWrapping;
  gravelTexture.colorSpace = THREE.SRGBColorSpace;
  gravelTexture.anisotropy = 4;
  return gravelTexture;
}

/**
 * Trapezoid prism running along +Z from 0 to `length`, centred on X,
 * top at y = 0. UVs are in metres, so with the texture's default repeat of 1
 * the gravel tiles once per metre on every face.
 */
export function createBallastGeometry(
  topWidth: number, bottomWidth: number, height: number, length: number,
): THREE.BufferGeometry {
  const t = topWidth / 2;
  const b = bottomWidth / 2;
  const slope = Math.hypot(b - t, height); // length of a sloped side, for UVs
  const z0 = -length / 2, z1 = length / 2;

  // Each face: 4 corners (x, y, z) + (u, v); two triangles per face
  const faces: Array<{ p: number[][]; uv: number[][] }> = [
    // Top
    { p: [[-t, 0, z0], [t, 0, z0], [t, 0, z1], [-t, 0, z1]],
      uv: [[0, 0], [topWidth, 0], [topWidth, length], [0, length]] },
    // Right slope
    { p: [[t, 0, z0], [b, -height, z0], [b, -height, z1], [t, 0, z1]],
      uv: [[0, 0], [slope, 0], [slope, length], [0, length]] },
    // Left slope
    { p: [[-b, -height, z0], [-t, 0, z0], [-t, 0, z1], [-b, -height, z1]],
      uv: [[0, 0], [slope, 0], [slope, length], [0, length]] },
  ];

  const positions: number[] = [];
  const uvs: number[] = [];
  for (const f of faces) {
    for (const i of [0, 2, 1, 0, 3, 2]) { // counter-clockwise from outside
      positions.push(...f.p[i]);
      uvs.push(...f.uv[i]);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
}

/** Standard ballast material: gravel texture, fully rough */
export function createBallastMaterial(tint: number = 0xffffff): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: getGravelTexture(),
    color: tint,
    roughness: 1.0,
    metalness: 0.0,
  });
}
