/**
 * storage.ts - Safe wrapper around localStorage.
 *
 * localStorage can be missing or throw (private browsing, blocked cookies,
 * storage full, or running in Node during tests). These helpers never throw:
 * reads fall back to a default and failed writes are silently ignored, so the
 * game always works — it just won't remember things in those cases.
 */

const PREFIX = 'staying-on-track:';

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = globalThis.localStorage?.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    globalThis.localStorage?.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage unavailable or full — progress just won't persist this session
  }
}

/** Everything the game has saved, as one JSON string (for a backup file) */
export function exportSave(): string {
  const out: Record<string, string> = {};
  try {
    const ls = globalThis.localStorage;
    for (let i = 0; i < (ls?.length ?? 0); i++) {
      const k = ls!.key(i);
      if (k && (k.startsWith(PREFIX) || k === 'last-initials')) out[k] = ls!.getItem(k) ?? '';
    }
  } catch { /* nothing to export */ }
  return JSON.stringify({ game: 'staying-on-track', version: 1, saved: new Date().toISOString(), data: out });
}

/**
 * Restore a backup made by exportSave(). Replaces the current save.
 * @returns how many entries were restored, or an error message
 */
export function importSave(json: string): number | string {
  let parsed: { game?: string; data?: Record<string, unknown> };
  try { parsed = JSON.parse(json); } catch { return 'That file is not a save backup.'; }
  if (parsed?.game !== 'staying-on-track' || typeof parsed.data !== 'object' || !parsed.data) return 'That file is not a Staying on Track save.';
  const entries = Object.entries(parsed.data).filter(([k, v]) => (k.startsWith(PREFIX) || k === 'last-initials') && typeof v === 'string');
  try {
    const ls = globalThis.localStorage!;
    const old: string[] = [];
    for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (k && k.startsWith(PREFIX)) old.push(k); }
    old.forEach((k) => ls.removeItem(k));
    for (const [k, v] of entries) ls.setItem(k, v as string);
  } catch { return 'Could not write the save (storage blocked?).'; }
  return entries.length;
}
