import { describe, expect, it } from 'vitest';
import { buildContentSignal, buildContentUsage, buildLlmsTxt, buildTdmRep, diffLines, lintRobotsTxt, validateLlmsTxt } from '../src/index.js';

describe('extras', () => {
  it('builds llms.txt per llmstxt.org', () => {
    const t = buildLlmsTxt({
      name: 'Example Docs',
      summary: 'Docs for Example.',
      sections: [
        { title: 'Docs', links: [{ title: 'Quick start', url: 'https://e.com/start.md', description: 'Install and run' }] },
        { title: 'Extra', optional: true, links: [{ title: 'Changelog', url: 'https://e.com/changelog.md' }] },
      ],
    });
    expect(t).toBe(
      '# Example Docs\n\n> Docs for Example.\n\n## Docs\n\n- [Quick start](https://e.com/start.md): Install and run\n\n## Optional\n\n- [Changelog](https://e.com/changelog.md)\n',
    );
    expect(validateLlmsTxt(t)).toEqual([]);
    expect(validateLlmsTxt('no heading').length).toBeGreaterThan(0);
  });

  it('builds TDMRep files', () => {
    const r = buildTdmRep([{ reservation: 1, policy: 'https://e.com/policy.json' }]);
    expect(JSON.parse(r.json)).toEqual([{ location: '/', 'tdm-reservation': 1, 'tdm-policy': 'https://e.com/policy.json' }]);
    expect(r.headers).toBe('tdm-reservation: 1\ntdm-policy: https://e.com/policy.json\n');
    expect(r.meta).toContain('<meta name="tdm-reservation" content="1">');
  });

  it('builds Content-Signal and Content-Usage lines the linter accepts', () => {
    const cs = buildContentSignal({ search: 'yes', 'ai-train': 'no' });
    expect(cs).toContain('Content-Signal: search=yes, ai-train=no');
    expect(lintRobotsTxt(cs).map((i) => i.code)).toContain('content-signal');
    const cu = buildContentUsage({ 'train-ai': 'n', search: 'y' }, '/');
    expect(cu.robotsLine).toBe('Content-Usage: train-ai=n, search=y');
    expect(lintRobotsTxt(`User-agent: *\nAllow: /\n${cu.robotsLine}\n`).map((i) => i.code)).toContain('content-usage');
  });

  it('diffs lines', () => {
    const d = diffLines('a\nb\nc', 'a\nc\nd');
    expect(d.map((x) => `${x.type[0]}${x.text}`)).toEqual(['sa', 'rb', 'sc', 'ad']);
  });
});
