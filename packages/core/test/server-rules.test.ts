import { describe, expect, it } from 'vitest';
import {
  buildServerRules,
  buildVerificationSnippet,
  curatedBots,
  communityBots,
  getBot,
  SERVER_TARGETS,
  userAgentPatterns,
} from '../src/index.js';

const training = curatedBots.filter((b) => b.purpose === 'training');

describe('server rules', () => {
  it('skips robots.txt-only tokens', () => {
    const { patterns, skipped } = userAgentPatterns(curatedBots);
    expect(skipped).toContain('Google-Extended');
    expect(skipped).toContain('Applebot-Extended');
    expect(patterns.map((p) => p.toLowerCase())).not.toContain('google-extended');
  });

  it('collapses patterns covered by a shorter one', () => {
    const { patterns } = userAgentPatterns([
      getBot('yandexadditional')!,
      getBot('yandexadditionalbot')!,
    ]);
    expect(patterns).toEqual(['YandexAdditional']);
  });

  for (const target of SERVER_TARGETS) {
    it(`${target}: contains every pattern and keeps robots.txt reachable`, () => {
      const r = buildServerRules(target, training);
      for (const p of r.patterns)
        expect(r.code.toLowerCase()).toContain(p.toLowerCase().replace(/[.]/g, ''));
      expect(r.code).toContain('robots');
    });
  }

  it('builds regexes that match real User-Agent strings', () => {
    const r = buildServerRules(
      'express',
      curatedBots.filter((b) => !b.general),
    );
    const m = /const AI_BOTS = \/(.*)\/i;/.exec(r.code)!;
    const re = new RegExp(m[1]!, 'i');
    for (const b of curatedBots.filter((x) => !x.general && x.kind === 'crawler' && x.userAgent)) {
      expect(re.test(b.userAgent!), b.id).toBe(true);
    }
    expect(
      re.test('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'),
    ).toBe(false);
    expect(re.test('facebookexternalhit/1.1')).toBe(false);
  });

  it('never lets community names match general crawlers', () => {
    const r = buildServerRules('express', communityBots);
    const re = new RegExp(/const AI_BOTS = \/(.*)\/i;/.exec(r.code)![1]!, 'i');
    for (const ua of [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
      'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Amazonbot/0.1)',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36',
    ]) {
      expect(re.test(ua), ua).toBe(false);
    }
  });

  it('warns when the Cloudflare expression is too long', () => {
    const r = buildServerRules('cloudflare', [...curatedBots, ...communityBots]);
    expect(r.warnings.some((w) => w.includes('4096'))).toBe(true);
    const small = buildServerRules('cloudflare', training);
    expect(small.warnings.some((w) => w.includes('4096'))).toBe(false);
  });

  it('builds verification snippets', () => {
    expect(buildVerificationSnippet(getBot('gptbot')!).code).toContain(
      'https://openai.com/gptbot.json',
    );
    expect(buildVerificationSnippet(getBot('googlebot')!).code).toContain('googlebot.com');
    expect(buildVerificationSnippet(getBot('google-extended')!).code).toBe('');
  });
});
