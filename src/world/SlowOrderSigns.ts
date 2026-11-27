/**
 * SlowOrderSigns - Physical speed-restriction boards beside the track.
 *
 * Every section under a slow order gets a yellow "10 / SLOW" board on a post
 * at its start, facing the oncoming grinder. When the section is cleared the
 * board spins round to show the green "60 / CLEAR" side — a satisfying,
 * visible sign that the track is back to full speed.
 *
 * Boards are slightly emissive (like reflective sheeting) so they read at night.
 */

import * as THREE from 'three';
import { GAME_SECTION_LENGTH, type RailTrack } from '../rail/RailTrack';

const SIDE_OFFSET = -3.9;  // metres from track centre (left side, clear of the walkway)
const FLIP_TIME = 0.8;     // seconds for the board to spin round

let slowTex: THREE.Texture | null = null;
let clearTex: THREE.Texture | null = null;

/** Draw a sign face on a canvas: coloured board, border, big number, label */
function drawSign(bg: string, fg: string, big: string, label: string): THREE.Texture {
  if (typeof document === 'undefined') return new THREE.Texture();
  const c = document.createElement('canvas');
  c.width = 128; c.height = 160;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 128, 160);
  ctx.strokeStyle = fg;
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 112, 144);
  ctx.fillStyle = fg;
  ctx.textAlign = 'center';
  ctx.font = 'bold 76px sans-serif';
  ctx.fillText(big, 64, 98);
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(label, 64, 136);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function signMaterial(tex: THREE.Texture): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.35, roughness: 0.6,
  });
}

interface Sign {
  /** Where the sign stands (ground point, facing along the track) */
  base: THREE.Matrix4;
  /** Instance slot in the post / front / back meshes */
  index: number;
  flipT: number;        // -1 = not flipping, else 0..1 progress
}

/**
 * All signs are drawn as three InstancedMeshes (every post, every yellow face,
 * every green face): 3 draw calls for the whole route instead of 3 per sign.
 * A spinning board just rewrites its own two instance matrices.
 */
export class SlowOrderSigns {
  readonly group = new THREE.Group();
  private signs = new Map<number, Sign>();
  private posts: THREE.InstancedMesh;
  private fronts: THREE.InstancedMesh;
  private backs: THREE.InstancedMesh;
  // Scratch matrices for placing a board
  private _m = new THREE.Matrix4();
  private _spin = new THREE.Matrix4();
  private static readonly POST_LOCAL = new THREE.Matrix4().makeTranslation(0, 1.1, 0);
  private static readonly BOARD_LOCAL = new THREE.Matrix4().makeTranslation(0, 2.0, 0);
  // Yellow face toward the oncoming grinder (-forward), green on the back
  private static readonly FRONT_LOCAL = new THREE.Matrix4().makeRotationY(Math.PI)
    .premultiply(new THREE.Matrix4().makeTranslation(0, 0, -0.02));
  private static readonly BACK_LOCAL = new THREE.Matrix4().makeTranslation(0, 0, 0.02);

  /** @param slowOrders - true for each section that starts under a slow order */
  constructor(track: RailTrack, slowOrders: boolean[]) {
    slowTex ??= drawSign('#f2c200', '#111111', '10', 'SLOW');
    clearTex ??= drawSign('#1f8f3a', '#ffffff', '60', 'CLEAR');

    const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.2, 6);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x9a9a9a, metalness: 0.6, roughness: 0.5 });
    const faceGeo = new THREE.PlaneGeometry(0.8, 1.0);
    const count = Math.max(1, slowOrders.filter(Boolean).length);
    this.posts = new THREE.InstancedMesh(postGeo, postMat, count);
    this.fronts = new THREE.InstancedMesh(faceGeo, signMaterial(slowTex), count);
    this.backs = new THREE.InstancedMesh(faceGeo, signMaterial(clearTex), count);
    this.posts.castShadow = true;
    this.fronts.castShadow = true;
    for (const m of [this.posts, this.fronts, this.backs]) { m.count = 0; this.group.add(m); }

    const basis = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const one = new THREE.Vector3(1, 1, 1);
    slowOrders.forEach((isSlow, sec) => {
      if (!isSlow) return;
      const dist = track.sectionOffset + sec * GAME_SECTION_LENGTH;
      const tp = track.getTrackPoint(Math.min(dist, track.totalLength - 0.1));
      pos.copy(tp.position).addScaledVector(tp.right, SIDE_OFFSET);
      pos.y = -0.6; // ground level
      quat.setFromRotationMatrix(basis.makeBasis(tp.right, tp.up, tp.forward));
      const sign: Sign = { base: new THREE.Matrix4().compose(pos, quat, one), index: this.posts.count, flipT: -1 };
      this.posts.count++; this.fronts.count++; this.backs.count++;
      this.posts.setMatrixAt(sign.index, this._m.multiplyMatrices(sign.base, SlowOrderSigns.POST_LOCAL));
      this.placeBoard(sign, 0);
      this.signs.set(sec, sign);
    });
    for (const m of [this.posts, this.fronts, this.backs]) {
      m.instanceMatrix.needsUpdate = true;
      m.computeBoundingSphere();
    }
  }

  /** Put a sign's board (both faces) at a spin angle around its post */
  private placeBoard(sign: Sign, angle: number): void {
    this._spin.makeRotationY(angle).premultiply(SlowOrderSigns.BOARD_LOCAL).premultiply(sign.base);
    this.fronts.setMatrixAt(sign.index, this._m.multiplyMatrices(this._spin, SlowOrderSigns.FRONT_LOCAL));
    this.backs.setMatrixAt(sign.index, this._m.multiplyMatrices(this._spin, SlowOrderSigns.BACK_LOCAL));
  }

  /** Section cleared: spin its board round to green */
  clear(section: number): void {
    const sign = this.signs.get(section);
    if (sign && sign.flipT < 0) sign.flipT = 0;
  }

  update(dt: number): void {
    let moved = false;
    for (const sign of this.signs.values()) {
      if (sign.flipT < 0 || sign.flipT >= 1) continue;
      sign.flipT = Math.min(1, sign.flipT + dt / FLIP_TIME);
      const t = sign.flipT;
      // Ease out with a little overshoot so it "snaps" into place
      const eased = 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
      this.placeBoard(sign, Math.PI * eased);
      moved = true;
    }
    if (moved) {
      this.fronts.instanceMatrix.needsUpdate = true;
      this.backs.instanceMatrix.needsUpdate = true;
    }
  }
}
