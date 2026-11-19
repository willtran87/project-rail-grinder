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
  board: THREE.Group;   // the part that spins
  flipT: number;        // -1 = not flipping, else 0..1 progress
}

export class SlowOrderSigns {
  readonly group = new THREE.Group();
  private signs = new Map<number, Sign>();

  /** @param slowOrders - true for each section that starts under a slow order */
  constructor(track: RailTrack, slowOrders: boolean[]) {
    slowTex ??= drawSign('#f2c200', '#111111', '10', 'SLOW');
    clearTex ??= drawSign('#1f8f3a', '#ffffff', '60', 'CLEAR');

    const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 2.2, 6);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x9a9a9a, metalness: 0.6, roughness: 0.5 });
    const faceGeo = new THREE.PlaneGeometry(0.8, 1.0);
    const slowMat = signMaterial(slowTex);
    const clearMat = signMaterial(clearTex);
    const basis = new THREE.Matrix4();

    slowOrders.forEach((isSlow, sec) => {
      if (!isSlow) return;
      const dist = track.sectionOffset + sec * GAME_SECTION_LENGTH;
      const tp = track.getTrackPoint(Math.min(dist, track.totalLength - 0.1));

      const sign = new THREE.Group();
      sign.position.copy(tp.position).addScaledVector(tp.right, SIDE_OFFSET);
      sign.position.y = -0.6; // ground level
      sign.quaternion.setFromRotationMatrix(basis.makeBasis(tp.right, tp.up, tp.forward));

      const post = new THREE.Mesh(postGeo, postMat);
      post.position.y = 1.1;
      post.castShadow = true;
      sign.add(post);

      // Board: yellow face toward the oncoming grinder (−forward), green on the back
      const board = new THREE.Group();
      board.position.y = 2.0;
      const front = new THREE.Mesh(faceGeo, slowMat);
      front.rotation.y = Math.PI;      // face −forward
      front.position.z = -0.02;
      const back = new THREE.Mesh(faceGeo, clearMat);
      back.position.z = 0.02;          // face +forward (seen after the flip)
      front.castShadow = true;
      board.add(front, back);
      sign.add(board);

      this.group.add(sign);
      this.signs.set(sec, { board, flipT: -1 });
    });
  }

  /** Section cleared: spin its board round to green */
  clear(section: number): void {
    const sign = this.signs.get(section);
    if (sign && sign.flipT < 0) sign.flipT = 0;
  }

  update(dt: number): void {
    for (const sign of this.signs.values()) {
      if (sign.flipT < 0 || sign.flipT >= 1) continue;
      sign.flipT = Math.min(1, sign.flipT + dt / FLIP_TIME);
      const t = sign.flipT;
      // Ease out with a little overshoot so it "snaps" into place
      const eased = 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);
      sign.board.rotation.y = Math.PI * eased;
    }
  }
}
