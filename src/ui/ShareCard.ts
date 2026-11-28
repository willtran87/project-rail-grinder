/**
 * ShareCard - A results image to share: the route, grade, stars, pay and time
 * over a frame of the game, copied to the clipboard (or downloaded when the
 * browser won't allow clipboard images).
 */

export interface ShareInfo {
  route: string; grade: string; gradeColor: string; stars: number; pay: string; time: string; rqi: string;
  /** "GRINDER 42 · NIGHT OWLS" (custom paint) */
  crew?: string;
  /** Route code a friend can type in to play the same route */
  code?: string;
}

export async function makeShareCard(info: ShareInfo, frame: Blob | null): Promise<Blob | null> {
  const W = 800, H = 420;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  if (!g) return null;
  g.fillStyle = '#0d1018';
  g.fillRect(0, 0, W, H);
  if (frame) {
    try {
      const img = await createImageBitmap(frame);
      const s = Math.max(W / img.width, H / img.height);
      g.drawImage(img, (W - img.width * s) / 2, (H - img.height * s) / 2, img.width * s, img.height * s);
    } catch { /* no picture: plain background */ }
  }
  const grad = g.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(0,0,0,0.15)');
  grad.addColorStop(1, 'rgba(0,0,0,0.85)');
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);
  g.textBaseline = 'alphabetic';
  g.fillStyle = '#ffcc55';
  g.font = 'bold 16px monospace';
  g.fillText('STAYING ON TRACK', 28, 40);
  if (info.crew) { g.fillStyle = '#ddd'; g.font = 'bold 14px monospace'; g.fillText(info.crew, 28, 62); }
  if (info.code) { g.fillStyle = '#8ad0ff'; g.font = '14px monospace'; g.textAlign = 'right'; g.fillText(`PLAY THIS ROUTE: ${info.code}`, W - 28, 40); g.textAlign = 'left'; }
  g.fillStyle = '#fff';
  g.font = 'bold 30px sans-serif';
  g.fillText(info.route, 28, H - 120, W - 200);
  g.fillStyle = '#ffd84a';
  g.font = '28px sans-serif';
  g.fillText('★'.repeat(info.stars) + '☆'.repeat(Math.max(0, 5 - info.stars)), 28, H - 78);
  g.fillStyle = '#ddd';
  g.font = '18px monospace';
  g.fillText(`${info.pay}   ·   ${info.time}   ·   RQI ${info.rqi}`, 28, H - 40);
  g.fillStyle = info.gradeColor;
  g.font = 'bold 120px sans-serif';
  g.textAlign = 'right';
  g.fillText(info.grade, W - 30, H - 40);
  return new Promise((res) => c.toBlob((b) => res(b), 'image/png'));
}

/** Copy to the clipboard; if that isn't allowed, download it. Returns what happened. */
export async function shareBlob(blob: Blob): Promise<'copied' | 'downloaded'> {
  try {
    const CI = (window as unknown as { ClipboardItem?: new (d: Record<string, Blob>) => ClipboardItem }).ClipboardItem;
    if (CI && navigator.clipboard?.write) {
      await navigator.clipboard.write([new CI({ 'image/png': blob })]);
      return 'copied';
    }
  } catch { /* fall through to download */ }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'staying-on-track-result.png';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
}
