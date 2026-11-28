/**
 * keymap - Rebindable keys.
 *
 * The game checks keys by their default name ('q', 'w', ' ' …): those names
 * are the ACTIONS. A keymap says which physical key now triggers an action
 * ({ q: 'y' } = press Y to do what Q did). InputManager translates each key
 * press through buildLookup() before the game sees it, so no game code
 * changes when keys are rebound.
 */

export interface Rebindable { action: string; label: string }

export const REBINDABLE: Rebindable[] = [
  { action: 'w', label: 'Drive forward / faster grind' },
  { action: 's', label: 'Drive back / slower grind' },
  { action: ' ', label: 'Grind (stones down)' },
  { action: 'shift', label: 'Fast travel' },
  { action: 'q', label: 'Left stone angle −' },
  { action: 'e', label: 'Left stone angle +' },
  { action: 'a', label: 'Left stone pressure −' },
  { action: 'd', label: 'Left stone pressure +' },
  { action: 'u', label: 'Right stone angle −' },
  { action: 'o', label: 'Right stone angle +' },
  { action: 'j', label: 'Right stone pressure −' },
  { action: 'l', label: 'Right stone pressure +' },
  { action: 'x', label: 'Spray water' },
  { action: 'z', label: 'Change stones' },
  { action: 't', label: 'Hold the revenue train' },
  { action: 'b', label: 'Damage scan overlay' },
  { action: 'i', label: 'Next stone grade (fitted at the next change)' },
];

/** Ready-made layouts */
export const KEYMAP_PRESETS: Record<string, { name: string; map: Record<string, string> }> = {
  default: { name: 'Default', map: {} },
  // Right hand on the left rail's keys and vice versa (for left-handed mouse users)
  leftHanded: {
    name: 'Left-handed (rails swapped)',
    map: { q: 'u', e: 'o', a: 'j', d: 'l', u: 'q', o: 'e', j: 'a', l: 'd' },
  },
};

/** How a key's name is shown */
export function keyLabel(k: string): string {
  if (k === ' ') return 'SPACE';
  if (k.startsWith('arrow')) return { arrowup: '↑', arrowdown: '↓', arrowleft: '←', arrowright: '→' }[k] ?? k;
  return k.toUpperCase();
}

/**
 * Physical key → action. A key missing from the result means "itself".
 * An action's own key that was moved elsewhere (and isn't reused) maps to ''
 * (ignored), so the old key stops working.
 */
export function buildLookup(keymap: Record<string, string>): Record<string, string> {
  const lookup: Record<string, string> = {};
  for (const [action, physical] of Object.entries(keymap)) {
    if (physical && physical !== action) lookup[physical] = action;
  }
  for (const [action, physical] of Object.entries(keymap)) {
    if (physical && physical !== action && !(action in lookup)) lookup[action] = '';
  }
  return lookup;
}

/** The physical key currently bound to an action */
export function boundKey(keymap: Record<string, string>, action: string): string {
  return keymap[action] || action;
}
