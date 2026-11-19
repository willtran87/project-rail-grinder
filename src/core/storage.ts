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
