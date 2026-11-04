import { describe, expect, it } from 'vitest';
import { compareBehaviour, curatedBots, isAllowed, mergeIntoExisting, UNNAMED_AGENT } from '../src/index.js';

const samples: Record<string, string> = {
  simple: 'User-agent: *\nDisallow: /admin/\nAllow: /admin/public/\n\nSitemap: https://example.com/sitemap.xml\n',
  wordpress:
    '# WordPress default\nUser-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n\nSitemap: https://example.com/wp-sitemap.xml\n',
  specific: 'User-agent: Googlebot\nDisallow: /nogoogle/\n\nUser-agent: Bingbot\nUser-agent: Slurp\nDisallow: /nobing/\n\nUser-agent: *\nDisallow: /private\n',
  openEnded: 'User-agent: *\nDisallow: /tmp/\n\nUser-agent: Foobot\n',
  crlf: 'User-agent: *\r\nDisallow: /x\r\n',
  existingAi: 'User-agent: GPTBot\nDisallow: /private/\n\nUser-agent: *\nDisallow: /cgi-bin/\n',
  sharedGroup: 'User-agent: GPTBot\nUser-agent: Foobot\nDisallow: /shared/\n\nUser-agent: *\nDisallow:\n',
  empty: '',
};

describe('merge mode keeps the behaviour of existing rules', () => {
  for (const [name, existing] of Object.entries(samples)) {
    for (const goal of ['block-training', 'block-all-ai'] as const) {
      for (const existingBots of ['keep', 'replace'] as const) {
        it(`${name} / ${goal} / ${existingBots}`, () => {
          const res = mergeIntoExisting(existing, curatedBots, {
            goal,
            existingBots,
            exceptions: [{ path: '/blog/', access: 'allow' }, { path: '/premium/', access: 'block' }],
          });
          expect(res.equivalence.ok, JSON.stringify(res.equivalence.mismatches.slice(0, 5))).toBe(true);
          expect(res.checks.every((c) => c.ok), JSON.stringify(res.checks.filter((c) => !c.ok).slice(0, 3))).toBe(true);
          expect(res.equivalence.comparisons).toBeGreaterThan(0);
          expect(res.ok).toBe(true);
        });
      }
    }
  }

  it('keeps existing lines verbatim and appends the AI section', () => {
    const res = mergeIntoExisting(samples.wordpress!, curatedBots, { goal: 'block-training' });
    expect(res.text.startsWith(samples.wordpress!.trimEnd())).toBe(true);
    expect(res.diff.filter((d) => d.type === 'remove')).toEqual([]);
    expect(isAllowed(res.text, 'GPTBot', '/')).toBe(false);
    expect(isAllowed(res.text, 'Googlebot', '/wp-admin/admin-ajax.php')).toBe(true);
  });

  it('closes a trailing group without rules', () => {
    const res = mergeIntoExisting(samples.openEnded!, curatedBots, { goal: 'block-training' });
    expect(res.text).toContain('User-agent: Foobot\nDisallow: # closes the group above');
    expect(isAllowed(res.text, 'Foobot', '/tmp/x')).toBe(true);
    expect(isAllowed(res.text, 'GPTBot', '/')).toBe(false);
  });

  it('reports AI bots that already have a group (keep)', () => {
    const res = mergeIntoExisting(samples.existingAi!, curatedBots, { goal: 'block-training' });
    expect(res.conflicts).toEqual([{ bot: 'gptbot', token: 'GPTBot', lines: [1], action: 'kept' }]);
    expect(isAllowed(res.text, 'GPTBot', '/public')).toBe(true);
  });

  it('replaces AI bots that already have a group (replace)', () => {
    const res = mergeIntoExisting(samples.existingAi!, curatedBots, { goal: 'block-training', existingBots: 'replace' });
    expect(res.conflicts[0]!.action).toBe('replaced');
    expect(isAllowed(res.text, 'GPTBot', '/public')).toBe(false);
    expect(res.diff.some((d) => d.type === 'remove' && d.text === 'User-agent: GPTBot')).toBe(true);
  });

  it('replace keeps a shared group for the other agent', () => {
    const res = mergeIntoExisting(samples.sharedGroup!, curatedBots, { goal: 'block-training', existingBots: 'replace' });
    expect(isAllowed(res.text, 'Foobot', '/shared/x')).toBe(false);
    expect(isAllowed(res.text, 'GPTBot', '/x')).toBe(false);
  });

  it('preserves CRLF line endings', () => {
    const res = mergeIntoExisting(samples.crlf!, curatedBots, { goal: 'block-training' });
    expect(res.text.includes('\r\n')).toBe(true);
    expect(res.text.replace(/\r\n/g, '').includes('\n')).toBe(false);
  });

  it('compareBehaviour detects a change', () => {
    const r = compareBehaviour('User-agent: *\nDisallow: /a\n', 'User-agent: *\nDisallow: /b\n', [UNNAMED_AGENT], ['/a', '/b']);
    expect(r.ok).toBe(false);
    expect(r.mismatches).toHaveLength(2);
  });
});
