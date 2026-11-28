import { describe, it, expect, beforeEach } from 'vitest';
import { saveJSON, loadJSON, exportSave, importSave } from './storage';

const mem = new Map<string, string>();
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => { mem.set(k, v); },
  removeItem: (k: string) => { mem.delete(k); },
  clear: () => mem.clear(),
  key: (i: number) => [...mem.keys()][i] ?? null,
  get length() { return mem.size; },
} as Storage;

beforeEach(() => mem.clear());

describe('save backup', () => {
  it('round-trips the whole save', () => {
    saveJSON('career-v1', { money: 1234 });
    saveJSON('museum-v1', ['spike']);
    mem.set('unrelated-site-key', 'x');
    const backup = exportSave();
    expect(backup).not.toContain('unrelated-site-key');
    mem.clear();
    expect(importSave(backup)).toBe(2);
    expect(loadJSON('career-v1', null)).toEqual({ money: 1234 });
    expect(loadJSON('museum-v1', [])).toEqual(['spike']);
  });

  it('import replaces the current save', () => {
    saveJSON('a', 1);
    const backup = exportSave();
    saveJSON('b', 2);
    importSave(backup);
    expect(loadJSON('b', null)).toBeNull();
  });

  it('rejects files that are not a save', () => {
    expect(typeof importSave('not json')).toBe('string');
    expect(typeof importSave('{"hello":1}')).toBe('string');
  });
});
