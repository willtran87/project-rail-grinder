import { describe, it, expect } from 'vitest';
import { buildLookup, boundKey, KEYMAP_PRESETS, keyLabel } from './keymap';

describe('key rebinding', () => {
  it('no keymap: every key is itself', () => {
    expect(buildLookup({})).toEqual({});
  });

  it('a moved action listens on its new key, and its old key goes quiet', () => {
    const lookup = buildLookup({ q: 'y' });
    expect(lookup.y).toBe('q');
    expect(lookup.q).toBe('');
  });

  it('swapping two keys keeps both working, the other way round', () => {
    const lookup = buildLookup({ q: 'u', u: 'q' });
    expect(lookup.u).toBe('q');
    expect(lookup.q).toBe('u');
  });

  it('the left-handed preset swaps every stone key', () => {
    const lookup = buildLookup(KEYMAP_PRESETS.leftHanded.map);
    expect(lookup.j).toBe('a');
    expect(lookup.a).toBe('j');
    expect(boundKey(KEYMAP_PRESETS.leftHanded.map, 'q')).toBe('u');
  });

  it('labels keys readably', () => {
    expect(keyLabel(' ')).toBe('SPACE');
    expect(keyLabel('arrowup')).toBe('↑');
    expect(keyLabel('q')).toBe('Q');
  });
});
