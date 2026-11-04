import { describe, expect, it } from 'vitest';
import {
  SITE_TYPE_PRESETS,
  curatedBots,
  communityBots,
  generateRobotsTxt,
  isAllowed,
  lintRobotsTxt,
  type Goal,
  type SiteType,
} from '../src/index.js';

const goals: Goal[] = ['block-training', 'block-all-ai', 'allow-all', 'custom'];
const siteTypes = Object.keys(SITE_TYPE_PRESETS) as SiteType[];

describe('generator presets', () => {
  for (const siteType of siteTypes) {
    for (const goal of goals) {
      it(`${siteType} / ${goal} produces a valid file that matches its policy`, () => {
        const preset = SITE_TYPE_PRESETS[siteType];
        const res = generateRobotsTxt(curatedBots, {
          goal,
          siteType,
          globalDisallow: preset.globalDisallow,
          exceptions: [...preset.exceptions, { path: '/blog/', access: 'allow' }],
          sitemaps: ['https://example.com/sitemap.xml'],
          custom: { gptbot: 'block', 'claude-searchbot': 'block' },
          date: '2026-11-04',
        });
        expect(res.ok, JSON.stringify(res.checks.filter((c) => !c.ok).slice(0, 5))).toBe(true);
        expect(res.checks.length).toBeGreaterThan(0);
        const errors = lintRobotsTxt(res.text, { bots: curatedBots }).filter(
          (i) => i.severity === 'error',
        );
        expect(errors).toEqual([]);
      });
    }
  }

  it('block-training blocks GPTBot, ClaudeBot, Google-Extended and keeps search bots', () => {
    const { text, blocked, allowed } = generateRobotsTxt(curatedBots, { goal: 'block-training' });
    for (const ua of [
      'GPTBot',
      'ClaudeBot',
      'Google-Extended',
      'Applebot-Extended',
      'CCBot',
      'meta-externalagent',
    ]) {
      expect(isAllowed(text, ua, '/any/page'), ua).toBe(false);
    }
    for (const ua of [
      'OAI-SearchBot',
      'Claude-SearchBot',
      'PerplexityBot',
      'ChatGPT-User',
      'Googlebot',
      'Applebot',
      'Bingbot',
    ]) {
      expect(isAllowed(text, ua, '/any/page'), ua).toBe(true);
    }
    expect(blocked).toContain('gptbot');
    expect(allowed).toContain('oai-searchbot');
  });

  it('block-all-ai blocks search and user agents but never general crawlers', () => {
    const res = generateRobotsTxt(curatedBots, { goal: 'block-all-ai' });
    expect(isAllowed(res.text, 'OAI-SearchBot', '/')).toBe(false);
    expect(isAllowed(res.text, 'PerplexityBot', '/')).toBe(false);
    expect(isAllowed(res.text, 'Googlebot', '/')).toBe(true);
    expect(isAllowed(res.text, 'facebookexternalhit', '/')).toBe(true);
    expect(isAllowed(res.text, 'Applebot', '/')).toBe(true);
    expect(res.blockedVisibility).toContain('oai-searchbot');
    expect(res.blockedNonCompliant).toContain('perplexity-user');
  });

  it('allow-all writes no AI groups', () => {
    const res = generateRobotsTxt(curatedBots, { goal: 'allow-all', comments: false });
    expect(res.text).toBe('User-agent: *\nDisallow:\n');
  });

  it('opens /blog/ to blocked bots and closes /premium/ to allowed AI bots', () => {
    const res = generateRobotsTxt(curatedBots, {
      goal: 'block-training',
      globalDisallow: ['/cart/'],
      exceptions: [
        { path: '/blog/', access: 'allow' },
        { path: '/premium/', access: 'block' },
      ],
    });
    expect(res.ok).toBe(true);
    const t = res.text;
    expect(isAllowed(t, 'GPTBot', '/blog/post')).toBe(true);
    expect(isAllowed(t, 'GPTBot', '/premium/x')).toBe(false);
    expect(isAllowed(t, 'OAI-SearchBot', '/premium/x')).toBe(false);
    // The allowed AI group repeats the * rules because it replaces them for those bots.
    expect(isAllowed(t, 'OAI-SearchBot', '/cart/')).toBe(false);
    expect(isAllowed(t, 'OAI-SearchBot', '/blog/post')).toBe(true);
    expect(isAllowed(t, 'Googlebot', '/premium/x')).toBe(true);
    expect(isAllowed(t, 'Googlebot', '/cart/')).toBe(false);
  });

  it('keeps nested closures inside an allowed exception', () => {
    const res = generateRobotsTxt(curatedBots, {
      goal: 'block-all-ai',
      globalDisallow: ['/blog/drafts/'],
      exceptions: [
        { path: '/blog/', access: 'allow' },
        { path: '/blog/members/', access: 'block' },
      ],
    });
    expect(res.ok).toBe(true);
    expect(isAllowed(res.text, 'ClaudeBot', '/blog/a')).toBe(true);
    expect(isAllowed(res.text, 'ClaudeBot', '/blog/members/a')).toBe(false);
    expect(isAllowed(res.text, 'ClaudeBot', '/blog/drafts/a')).toBe(false);
  });

  it('adds Content-Signal to the * group', () => {
    const res = generateRobotsTxt(curatedBots, {
      goal: 'block-training',
      contentSignals: { search: 'yes', 'ai-input': 'yes', 'ai-train': 'no' },
    });
    expect(res.text).toContain(
      'User-agent: *\nContent-Signal: search=yes, ai-input=yes, ai-train=no\n',
    );
  });

  it('custom choice blocks exactly the selected bots', () => {
    const res = generateRobotsTxt(curatedBots, {
      goal: 'custom',
      custom: { bytespider: 'block', perplexitybot: 'block' },
    });
    expect(res.blocked.sort()).toEqual(['bytespider', 'perplexitybot']);
    expect(isAllowed(res.text, 'GPTBot', '/')).toBe(true);
  });

  it('works with the community list', () => {
    const res = generateRobotsTxt([...curatedBots, ...communityBots], { goal: 'block-all-ai' });
    expect(res.ok).toBe(true);
    expect(res.blocked.length).toBeGreaterThan(150);
  });

  it('every line has an explanation key', () => {
    const res = generateRobotsTxt(curatedBots, {
      goal: 'block-training',
      sitemaps: ['https://e.com/s.xml'],
    });
    expect(res.lines.every((l) => typeof l.note === 'string')).toBe(true);
    expect(res.lines.map((l) => l.text).join('\n') + '\n').toBe(res.text);
  });
});
