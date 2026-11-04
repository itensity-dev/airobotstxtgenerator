import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { matchUrl, parseLines } from '../src/index.js';

interface Expected {
  agents: string[];
  cases: Record<
    string,
    { site: string; bytes: number; paths: string[]; verdicts: Record<string, string> }
  >;
}

const dir = join(import.meta.dirname, 'fixtures');
const expected = JSON.parse(readFileSync(join(dir, 'real-expected.json'), 'utf8')) as Expected;

describe('real robots.txt files (Oct 2026) match Google reference parser verdicts', () => {
  const entries = Object.entries(expected.cases);
  it('has at least 30 fixtures', () => {
    expect(entries.length).toBeGreaterThanOrEqual(30);
  });
  for (const [file, c] of entries) {
    it(c.site, () => {
      const bytes = new Uint8Array(readFileSync(join(dir, 'real', file)));
      const parsed = parseLines(bytes);
      const mismatches: string[] = [];
      for (const agent of expected.agents) {
        const want = c.verdicts[agent]!;
        c.paths.forEach((p, i) => {
          const got = matchUrl(parsed, agent, `https://${c.site}${p}`).allowed ? '1' : '0';
          if (got !== want[i]) mismatches.push(`${agent} ${p}: expected ${want[i]}, got ${got}`);
        });
      }
      expect(mismatches).toEqual([]);
    });
  }
});
