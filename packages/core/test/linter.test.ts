import { describe, expect, it } from 'vitest';
import {
  curatedBots,
  GOOGLE_MAX_BYTES,
  isAllowed,
  lintRobotsTxt,
  parseLines,
  suggestBot,
} from '../src/index.js';

const codes = (t: string | Uint8Array) =>
  lintRobotsTxt(t, { bots: curatedBots }).map((i) => i.code);

describe('linter', () => {
  it('flags a specific group that silently drops * rules (the most common mistake)', () => {
    const t = 'User-agent: *\nDisallow: /private/\n\nUser-agent: GPTBot\nDisallow: /blog/\n';
    const issues = lintRobotsTxt(t, { bots: curatedBots });
    const i = issues.find((x) => x.code === 'specific-overrides-global');
    expect(i?.params).toMatchObject({ agent: 'GPTBot', example: '/private/' });
    expect(isAllowed(t, 'GPTBot', '/private/x')).toBe(true);
  });

  it('does not flag when the specific group repeats the rule', () => {
    const t =
      'User-agent: *\nDisallow: /private/\n\nUser-agent: GPTBot\nDisallow: /private/\nDisallow: /blog/\n';
    expect(codes(t)).not.toContain('specific-overrides-global');
  });

  it('explains that blank lines do not split groups', () => {
    const t = 'User-agent: GPTBot\n\nUser-agent: *\nDisallow: /private/\n';
    expect(codes(t)).toContain('blank-line-does-not-split');
    expect(isAllowed(t, 'GPTBot', '/private/')).toBe(false);
  });

  it('finds syntax problems', () => {
    const c = codes(
      'Disallow: /early\nUser-agent: GPT-Bot\nDissallow: /a\nDisallow private\nDisallow: https://example.com/x\nNoindex: /y\nCrawl-delay: 10\nSitemap: /sitemap.xml\nhello world foo\n',
    );
    for (const code of [
      'rule-before-user-agent',
      'unknown-agent',
      'typo-key',
      'missing-colon',
      'pattern-no-leading-slash',
      'pattern-full-url',
      'noindex-directive',
      'crawl-delay',
      'sitemap-relative',
      'invalid-line',
    ]) {
      expect(c, code).toContain(code);
    }
  });

  it('suggests the right token for misspelt bots', () => {
    expect(suggestBot('GPT-Bot', curatedBots)?.token).toBe('GPTBot');
    expect(suggestBot('Claude-Bot', curatedBots)?.token).toBe('ClaudeBot');
    expect(suggestBot('PerplexityBott', curatedBots)?.token).toBe('PerplexityBot');
    expect(suggestBot('Wibble', curatedBots)).toBeUndefined();
  });

  it('notes control tokens and blocked AI search', () => {
    const c = codes('User-agent: Google-Extended\nUser-agent: OAI-SearchBot\nDisallow: /\n');
    expect(c).toContain('token-only-agent');
    expect(c).toContain('ai-search-blocked');
  });

  it('flags group without rules, version suffix and Disallow: / for everyone', () => {
    const c = codes(
      'User-agent: GPTBot/1.4\nDisallow: /x\n\nUser-agent: Foo\n\nUser-agent: *\nDisallow: /\n',
    );
    expect(c).toContain('user-agent-version');
    expect(codes('User-agent: AI2Bot\nDisallow: /\n')).toContain('user-agent-nonstandard');
    expect(c).toContain('disallow-all-global');
  });

  it('validates Content-Signal and Content-Usage lines', () => {
    expect(
      codes('User-agent: *\nContent-Signal: search=yes, ai-train=no, use=reference\nAllow: /\n'),
    ).toContain('content-signal');
    expect(codes('User-agent: *\nContent-Signal: ai-train=maybe\nAllow: /\n')).toContain(
      'content-signal-invalid',
    );
    expect(
      codes(
        'User-agent: *\nAllow: /\nContent-Usage: train-ai=n\nContent-Usage: /ai-ok/ train-ai=y\n',
      ),
    ).toContain('content-usage');
    expect(codes('User-agent: *\nAllow: /\nContent-Usage: train-ai=no\n')).toContain(
      'content-usage-invalid',
    );
  });

  it('recognises a Cloudflare managed block', () => {
    const t =
      '# BEGIN Cloudflare Managed content\nUser-Agent: *\nContent-signal: search=yes,ai-train=no\nAllow: /\n# END Cloudflare Managed Content\n';
    expect(codes(t)).toContain('cloudflare-managed');
  });

  it('reports files over 500 KiB and BOMs', () => {
    const big =
      'User-agent: *\n' +
      'Disallow: /some/long/path/that/repeats\n'.repeat(14000) +
      'Disallow: /tail\n';
    expect(big.length).toBeGreaterThan(GOOGLE_MAX_BYTES);
    expect(codes(big)).toContain('file-too-large');
    const cut = parseLines(big, { maxBytes: GOOGLE_MAX_BYTES });
    expect(cut.truncated).toBe(true);
    expect(isAllowed(cut, 'x', '/tail')).toBe(true);
    expect(isAllowed(big, 'x', '/tail')).toBe(false);
    expect(codes(new Uint8Array([0xef, 0xbb, 0xbf, 0x55, 0x73]))).toContain('bom');
  });

  it('returns nothing serious for a clean file', () => {
    const issues = lintRobotsTxt(
      'User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nDisallow: /admin/\n\nSitemap: https://e.com/s.xml\n',
      {
        bots: curatedBots,
      },
    );
    expect(issues.filter((i) => i.severity !== 'info')).toEqual([]);
  });
});

import { parseRobots, summarizeAgent } from '../src/index.js';
describe('summarizeAgent', () => {
  const p = parseRobots(
    'User-agent: GPTBot\nDisallow: /\nAllow: /blog/\n\nUser-agent: *\nDisallow: /admin/\n\nUser-agent: CCBot\nDisallow: /\n',
  );
  it('classifies', () => {
    expect(summarizeAgent(p, 'GPTBot')).toMatchObject({
      via: 'specific',
      verdict: 'partial',
      rootAllowed: false,
    });
    expect(summarizeAgent(p, 'CCBot')).toMatchObject({ via: 'specific', verdict: 'blocked' });
    expect(summarizeAgent(p, 'ClaudeBot')).toMatchObject({
      via: 'global',
      verdict: 'partial',
      rootAllowed: true,
    });
    expect(summarizeAgent(parseRobots('User-agent: *\nDisallow:\n'), 'X')).toMatchObject({
      verdict: 'allowed',
    });
    expect(summarizeAgent(parseRobots(''), 'X')).toMatchObject({ via: 'none', verdict: 'allowed' });
  });
});
