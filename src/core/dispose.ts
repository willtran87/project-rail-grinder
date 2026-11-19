/**
 * disposeObject3D - Free the GPU memory held by an object and all its children.
 *
 * Removing an object from the scene does NOT free its geometry, materials, or
 * textures — Three.js keeps them uploaded on the GPU until .dispose() is called.
 * Call this on any group you throw away (e.g. scenery from the previous job).
 *
 * Note: if a disposed material/texture is still shared with something else in
 * the scene, Three.js simply re-uploads it the next time it is drawn, so this
 * is safe — just slightly wasteful in that case.
 */

import * as THREE from 'three';

export function disposeObject3D(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();

    if (mesh.material) {
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of materials) disposeMaterial(mat);
    }

    // InstancedMesh holds its own per-instance buffers
    if ((obj as THREE.InstancedMesh).isInstancedMesh) {
      (obj as THREE.InstancedMesh).dispose();
    }
  });
}

function disposeMaterial(mat: THREE.Material): void {
  // Dispose every texture the material references (map, normalMap, etc.)
  for (const value of Object.values(mat)) {
    if (value instanceof THREE.Texture) value.dispose();
  }
  mat.dispose();
}
