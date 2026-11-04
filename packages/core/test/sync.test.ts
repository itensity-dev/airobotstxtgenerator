import { describe, expect, it } from 'vitest';
import { buildCommunityList, curatedBots, diffCommunity, mapPurpose, mapRespect, parseMarkdownLink, parseUpstream, UpstreamFormatError } from '../src/index.js';

const entry = (o: Partial<Record<string, unknown>> = {}) => ({
  operator: '[Example](https://example.com)',
  respect: 'Yes',
  function: 'AI Search Crawlers',
  frequency: 'Unclear at this time.',
  description: 'Example crawler.',
  ...o,
});

function upstream(n = 25, extra: Record<string, unknown> = {}) {
  const o: Record<string, unknown> = {};
  for (let i = 0; i < n; i++) o[`ExampleBot${i}`] = entry();
  return { ...o, ...extra };
}

describe('ai.robots.txt sync', () => {
  it('accepts the current format', () => {
    expect(parseUpstream(upstream()).size).toBe(25);
  });

  it('rejects format changes', () => {
    expect(() => parseUpstream([])).toThrow(UpstreamFormatError);
    expect(() => parseUpstream({ a: entry() })).toThrow(/at least 20/);
    expect(() => parseUpstream(upstream(25, { Broken: 'x' }))).toThrow(/not an object/);
    expect(() => parseUpstream(upstream(25, { Missing: { operator: 'x' } }))).toThrow(/respect/);
    expect(() => parseUpstream(upstream(25, { Renamed: { ...entry(), respect: undefined, respectsRobots: 'Yes' } }))).toThrow(
      UpstreamFormatError,
    );
  });

  it('maps fields', () => {
    expect(parseMarkdownLink('[OpenAI](https://openai.com)')).toEqual({ name: 'OpenAI', url: 'https://openai.com' });
    expect(mapRespect('[Yes](https://x)')).toBe('yes');
    expect(mapRespect('Unclear at this time.')).toBe('unknown');
    expect(mapPurpose('AI Data Scrapers')).toBe('training');
    expect(mapPurpose('AI Assistants')).toBe('user');
    expect(mapPurpose('AI Search Crawlers')).toBe('search');
  });

  it('skips agents already curated and reports differences', () => {
    const up = parseUpstream(upstream(25, { GPTBot: entry(), 'MistralAI-User/1.0': entry(), NewBot: entry({ function: 'LLM training.' }) }));
    const list = buildCommunityList(up, curatedBots, '2026-11-04');
    const names = list.bots.map((b) => b.name);
    expect(names).not.toContain('GPTBot');
    expect(names).not.toContain('MistralAI-User/1.0');
    expect(list.bots.find((b) => b.name === 'NewBot')?.purpose).toBe('training');
    const before = buildCommunityList(parseUpstream(upstream(25)), curatedBots, '2026-10-28');
    const d = diffCommunity(before, list);
    expect(d.added).toEqual(['NewBot']);
    expect(d.removed).toEqual([]);
  });
});
