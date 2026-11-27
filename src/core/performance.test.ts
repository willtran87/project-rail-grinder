/**
 * Tests for the performance work: merged meshes, the batched rails and the
 * track lookup table must look / behave exactly like what they replaced.
 * Run with: npm test (headless — no browser needed)
 */

import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { bakeStatic } from './bakeStatic';
import { RailTrack } from '../rail/RailTrack';

describe('bakeStatic', () => {
  function model() {
    const root = new THREE.Group();
    const steel = new THREE.MeshStandardMaterial();
    const paint = new THREE.MeshStandardMaterial();
    const add = (geo: THREE.BufferGeometry, m: THREE.Material, x: number) => {
      const mesh = new THREE.Mesh(geo, m);
      mesh.position.x = x;
      mesh.castShadow = true;
      root.add(mesh);
      return mesh;
    };
    add(new THREE.BoxGeometry(3, 2, 10), paint, 0);          // car body
    add(new THREE.BoxGeometry(0.02, 0.02, 0.02), steel, 1);  // bolt
    add(new THREE.CylinderGeometry(0.02, 0.02, 4, 6), steel, 2); // thin rod
    add(new THREE.SphereGeometry(0.5), steel, 3);
    const mover = add(new THREE.BoxGeometry(1, 1, 1), steel, 4);
    root.add(new THREE.PointLight());
    return { root, mover, steel, paint };
  }

  it('merges to one mesh per material and shadow setting, keeping movers and lights', () => {
    const { root, mover } = model();
    const merged = bakeStatic(root, { keep: new Set([mover]) });
    expect(merged).toBe(4);
    const meshes = root.children.filter((c) => (c as THREE.Mesh).isMesh);
    // body (paint, casts) + steel casting (sphere) + steel non-casting (bolt, rod) + kept mover
    expect(meshes.length).toBe(4);
    expect(root.children).toContain(mover);
    expect(root.children.some((c) => (c as THREE.PointLight).isPointLight)).toBe(true);
  });

  it('tiny and thin parts stop casting shadows; big ones still do', () => {
    const { root, steel, paint } = model();
    bakeStatic(root);
    const find = (m: THREE.Material, cast: boolean) =>
      root.children.find((c) => (c as THREE.Mesh).material === m && c.castShadow === cast);
    expect(find(paint, true)).toBeDefined();
    expect(find(steel, false)).toBeDefined(); // bolt + rod
    expect(find(steel, true)).toBeDefined();  // sphere + mover box
  });

  it('keeps every part where it was (world-space bounds unchanged)', () => {
    const { root } = model();
    root.position.set(10, 0, -5);
    root.updateMatrixWorld(true);
    const before = new THREE.Box3().setFromObject(root);
    bakeStatic(root);
    root.updateMatrixWorld(true);
    const after = new THREE.Box3().setFromObject(root);
    expect(after.min.distanceTo(before.min)).toBeLessThan(1e-5);
    expect(after.max.distanceTo(before.max)).toBeLessThan(1e-5);
  });
});

describe('RailTrack lookup table (getTrackPoint)', () => {
  const pts = [
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(30, 0, 120),
    new THREE.Vector3(-20, 0, 260), new THREE.Vector3(10, 0, 400),
  ];
  const track = new RailTrack(pts, undefined, 10, 20);

  it('matches the exact spline to well under a millimetre', () => {
    const p = new THREE.Vector3(), f = new THREE.Vector3();
    for (let d = 0; d <= track.totalLength; d += 3.7) {
      const tp = track.getTrackPoint(d);
      track.path.getPointAt(d / track.totalLength, p);
      track.path.getTangentAt(d / track.totalLength, f).normalize();
      expect(tp.position.distanceTo(p)).toBeLessThan(0.001);
      expect(tp.forward.angleTo(f)).toBeLessThan(0.001);
    }
  });

  it('two calls in a row return separate objects (front and rear bogie)', () => {
    const a = track.getTrackPoint(50);
    const b = track.getTrackPoint(150);
    expect(a.position.distanceTo(b.position)).toBeGreaterThan(50);
  });

  it('clamps beyond either end', () => {
    expect(track.getTrackPoint(-10).position.distanceTo(track.getTrackPoint(0).position)).toBeLessThan(1e-6);
    const end = track.getTrackPoint(track.totalLength).position.clone();
    expect(track.getTrackPoint(track.totalLength + 50).position.distanceTo(end)).toBeLessThan(1e-6);
  });
});

describe('batched rails', () => {
  const track = new RailTrack(
    [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 100), new THREE.Vector3(0, 0, 200)],
    undefined, 5, 20,
  );

  it('draws all rails in a single mesh (plus one for the running bands)', () => {
    const meshes: THREE.Mesh[] = [];
    track.group.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh && !(m as THREE.InstancedMesh).isInstancedMesh) meshes.push(m); });
    expect(meshes.length).toBe(2);
  });

  it('rail vertices sit on the two rails, gauge apart', () => {
    const rail = track.group.children.find((c) => (c as THREE.Mesh).castShadow && !(c as THREE.InstancedMesh).isInstancedMesh) as THREE.Mesh;
    const pos = rail.geometry.getAttribute('position');
    let minX = Infinity, maxX = -Infinity;
    for (let i = 0; i < pos.count; i++) { minX = Math.min(minX, pos.getX(i)); maxX = Math.max(maxX, pos.getX(i)); }
    // Straight track along +z: rails centred at x = ±0.8, base 0.30 wide
    expect(minX).toBeCloseTo(-0.8 - 0.15, 3);
    expect(maxX).toBeCloseTo(0.8 + 0.15, 3);
  });

  it('grinding a segment rewrites only that segment, in place', () => {
    const rail = track.group.children.find((c) => (c as THREE.Mesh).castShadow && !(c as THREE.InstancedMesh).isInstancedMesh) as THREE.Mesh;
    const pos = rail.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arrayBefore = pos.array;
    const snapshot = Float32Array.from(pos.array as Float32Array);
    const profile = track.getProfile(7, 'left');
    profile.removeMetalAt(0, 30, 5);
    track.rebuildSegment(7, 'left');
    expect(pos.array).toBe(arrayBefore); // same buffer, no new geometry
    let changed = 0, firstChanged = -1, lastChanged = -1;
    for (let i = 0; i < snapshot.length; i++) {
      if (Math.abs(snapshot[i] - (pos.array as Float32Array)[i]) > 1e-7) {
        changed++; if (firstChanged < 0) firstChanged = i; lastChanged = i;
      }
    }
    expect(changed).toBeGreaterThan(0);
    const perSlot = snapshot.length / (track.segmentCount * 2);
    expect(Math.floor(firstChanged / perSlot)).toBe(7);
    expect(Math.floor(lastChanged / perSlot)).toBe(7);
    expect(pos.updateRanges.length).toBeGreaterThan(0); // only that slice is re-uploaded
  });

  it('only animating segments stay on the update list', () => {
    const seg = track.leftSegments[3];
    seg.heatUp(0.5);
    expect(seg.update(0.1)).toBe(true);      // still cooling
    track.updateSegments(10);                 // long enough to cool fully
    expect(seg.update(0.1)).toBe(false);
  });
});

describe('bakeStatic: shared vertex material and shadow proxy', () => {
  function car() {
    const root = new THREE.Group();
    const red = new THREE.MeshStandardMaterial({ color: 0xff0000, metalness: 0.3, roughness: 0.4 });
    const grey = new THREE.MeshStandardMaterial({ color: 0x808080, emissive: 0x112233, emissiveIntensity: 2 });
    const lamp = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffff00 });
    const glass = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.5 });
    const add = (m: THREE.Material, x: number, size = 1) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), m);
      mesh.position.x = x; mesh.castShadow = true; root.add(mesh); return mesh;
    };
    add(red, 0); add(grey, 2); add(lamp, 4); add(glass, 6); add(red, 8, 0.05);
    return { root, red, grey, lamp, glass };
  }

  it('plain materials merge into one mesh that carries each part\'s colour, glow, metalness and roughness', async () => {
    const { createVertexPbrMaterial } = await import('./bakeStatic');
    const { root, lamp, glass } = car();
    const vmat = createVertexPbrMaterial();
    bakeStatic(root, { vertexMaterial: vmat, animated: new Set([lamp]) });
    const byMat = (m: THREE.Material) => root.children.filter((c) => (c as THREE.Mesh).material === m);
    expect(byMat(vmat).length).toBe(2);   // red + grey together (casting / tiny non-casting)
    expect(byMat(lamp).length).toBe(1);   // animated: kept
    expect(byMat(glass).length).toBe(1);  // see-through: kept
    const big = byMat(vmat).find((c) => c.castShadow) as THREE.Mesh;
    const col = big.geometry.getAttribute('color');
    const emi = big.geometry.getAttribute('aEmissive');
    const pbr = big.geometry.getAttribute('aPbr');
    const red = new THREE.Color(0xff0000), grey = new THREE.Color(0x808080);
    const greyGlow = new THREE.Color(0x112233).multiplyScalar(2);
    let sawRed = false, sawGrey = false;
    for (let i = 0; i < col.count; i++) {
      if (Math.abs(col.getX(i) - red.r) < 1e-6 && Math.abs(col.getY(i) - red.g) < 1e-6) {
        sawRed = true;
        expect(pbr.getX(i)).toBeCloseTo(0.3, 6); expect(pbr.getY(i)).toBeCloseTo(0.4, 6);
        expect(emi.getX(i)).toBe(0);
      } else if (Math.abs(col.getX(i) - grey.r) < 1e-6) {
        sawGrey = true;
        expect(emi.getZ(i)).toBeCloseTo(greyGlow.b, 6);
      }
    }
    expect(sawRed && sawGrey).toBe(true);
  });

  it('a shadow proxy casts every shadow from one hidden mesh', async () => {
    const { SHADOW_LAYER } = await import('./bakeStatic');
    const { root } = car();
    bakeStatic(root, { shadowProxy: true });
    const casters = root.children.filter((c) => c.castShadow);
    expect(casters.length).toBe(1);
    const proxy = casters[0] as THREE.Mesh;
    expect(proxy.layers.isEnabled(0)).toBe(false);          // main camera can't see it
    expect(proxy.layers.isEnabled(SHADOW_LAYER)).toBe(true); // shadow camera can
    // 4 big boxes cast (the 5 cm one is too small): 4 × 24 vertices
    expect(proxy.geometry.getAttribute('position').count).toBe(4 * 24);
  });
});

describe('rail end faces', () => {
  it('only the first and last segment of each rail get end faces', () => {
    const track = new RailTrack(
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 100), new THREE.Vector3(0, 0, 200)],
      undefined, 5, 20,
    );
    const rail = track.group.children.find((c) => (c as THREE.Mesh).castShadow && !(c as THREE.InstancedMesh).isInstancedMesh) as THREE.Mesh;
    const indices = rail.geometry.index!.count;
    const slots = track.segmentCount * 2;
    const perSlotVerts = rail.geometry.getAttribute('position').count / slots;
    const outline = perSlotVerts / 6;            // 4 side + 2 cap vertices per outline point
    const sides = slots * outline * 6;           // 2 triangles per side quad
    const capTris = (indices - sides) / 3;
    // 2 rails × 2 ends get a cap (about outline - 2 triangles each; the
    // triangulator skips zero-area ones), instead of 2 caps on every segment
    expect(capTris % 4).toBe(0);
    expect(capTris / 4).toBeGreaterThan(outline - 10);
    expect(capTris / 4).toBeLessThanOrEqual(outline - 2);
  });
});

describe('render resolution', () => {
  it('keeps about 540 rows with whole-number pixels', async () => {
    const { pixelScaleFor } = await import('./Engine');
    expect(pixelScaleFor(720)).toBe(2);
    expect(pixelScaleFor(1080)).toBe(2);
    expect(pixelScaleFor(1440)).toBe(3);
    expect(pixelScaleFor(2160)).toBe(4);
  });
});

describe('sparks', () => {
  it('dead sparks are reused, and an idle system skips its work', async () => {
    const { SparkSystem } = await import('../effects/SparkSystem');
    const sparks = new SparkSystem();
    const pos = sparks.streaks.geometry.getAttribute('position') as THREE.BufferAttribute;
    sparks.burst(new THREE.Vector3(), 50);
    sparks.update(1 / 60);
    expect(sparks.streaks.visible).toBe(true);
    for (let i = 0; i < 300; i++) sparks.update(1 / 60); // all burn out
    const v = pos.version;
    sparks.update(1 / 60);
    expect(pos.version).toBe(v);          // no upload while idle
    expect(sparks.streaks.visible).toBe(false);
    sparks.burst(new THREE.Vector3(), 800); // all 800 slots free again
    sparks.update(1 / 60);
    let alive = 0;
    for (let i = 0; i < pos.count; i += 2) if (pos.getY(i) > -50) alive++;
    expect(alive).toBe(800);
  });
});

describe('slow-order signs', () => {
  it('draw every sign with 3 instanced meshes, and a cleared board spins to the green side', async () => {
    const { SlowOrderSigns } = await import('../world/SlowOrderSigns');
    const track = new RailTrack(
      [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 200), new THREE.Vector3(0, 0, 400)],
      undefined, 10, 50,
    );
    const slow = [true, false, true, true, false, false, true, false, false, false];
    const signs = new SlowOrderSigns(track, slow);
    const meshes = signs.group.children as THREE.InstancedMesh[];
    expect(meshes.length).toBe(3);
    for (const m of meshes) { expect(m.isInstancedMesh).toBe(true); expect(m.count).toBe(4); }
    // The yellow face of sign #0 faces back down the track (towards the
    // oncoming grinder); after clearing, the green face does
    const fronts = meshes[1], backs = meshes[2];
    const normalOf = (m: THREE.InstancedMesh, i: number) => {
      const mat = new THREE.Matrix4(); m.getMatrixAt(i, mat);
      return new THREE.Vector3(0, 0, 1).transformDirection(mat);
    };
    expect(normalOf(fronts, 0).z).toBeLessThan(-0.9);
    signs.clear(0);
    for (let i = 0; i < 120; i++) signs.update(1 / 60);
    expect(normalOf(backs, 0).z).toBeLessThan(-0.9);
    expect(normalOf(fronts, 1).z).toBeLessThan(-0.9); // other signs untouched
  });
});
