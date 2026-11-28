import { describe, it, expect, beforeEach } from 'vitest';

const mem: Record<string, string> = {};
(globalThis as unknown as { localStorage: Storage }).localStorage = {
  getItem: (k: string) => (k in mem ? mem[k] : null),
  setItem: (k: string, v: string) => { mem[k] = v; },
  removeItem: (k: string) => { delete mem[k]; },
  clear: () => { for (const k of Object.keys(mem)) delete mem[k]; },
  key: () => null, length: 0,
} as Storage;

import { Coach, CLEAN_TO_RETIRE, REPEAT_SECONDS } from './coach';

beforeEach(() => { for (const k of Object.keys(mem)) delete mem[k]; });

describe('live coaching', () => {
  it('shows a tip, then not again for a while', () => {
    const c = new Coach();
    expect(c.mistake('heat', 10)).toMatch(/lift/i);
    expect(c.mistake('heat', 12)).toBeNull();
    expect(c.mistake('heat', 10 + REPEAT_SECONDS + 1)).not.toBeNull();
  });

  it('retires a tip after enough clean sections, and remembers it', () => {
    const c = new Coach();
    c.mistake('pressure', 0);
    c.sectionDone(); // made it this section: not clean
    let retired: string[] = [];
    for (let i = 0; i < CLEAN_TO_RETIRE; i++) retired = c.sectionDone();
    expect(retired).toEqual(['pressure']);
    expect(new Coach().mistake('pressure', 999)).toBeNull();
  });

  it('a mistake resets the clean run', () => {
    const c = new Coach();
    c.mistake('offTarget', 0);
    c.sectionDone();
    c.sectionDone();
    c.mistake('offTarget', 100);
    c.sectionDone();
    expect(c.state.retired).not.toContain('offTarget');
  });
});
