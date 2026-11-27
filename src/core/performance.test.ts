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
