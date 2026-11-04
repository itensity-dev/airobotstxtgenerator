import { describe, expect, it } from 'vitest';
import { LOCALES } from '../../src/i18n/locales';
import { PAGE_IDS, ROUTES, botPath, markdownPath, pathFor } from '../../src/i18n/routes';
import { resolveHref, resolveLinksInHtml } from '../../src/lib/links';
import { renderInline, plainText } from '../../src/lib/markdown';

describe('routes', () => {
  it('every page has a unique path per locale', () => {
    for (const l of LOCALES) {
      const paths = PAGE_IDS.map((id) => pathFor(l, id));
      expect(new Set(paths).size, l).toBe(paths.length);
    }
  });

  it('slugs are lowercase ASCII with hyphens', () => {
    for (const id of PAGE_IDS)
      for (const l of LOCALES) expect(ROUTES[id].slug[l]).toMatch(/^[a-z0-9-]*$/);
  });

  it('builds localized paths', () => {
    expect(pathFor('en', 'home')).toBe('/');
    expect(pathFor('de', 'home')).toBe('/de/');
    expect(pathFor('de', 'bots')).toBe('/de/ki-crawler/');
    expect(pathFor('fr', 'server-nginx')).toBe('/fr/regles-serveur/nginx/');
    expect(pathFor('pt-br', 'guide-syntax')).toBe('/pt-br/guias/sintaxe-robots-txt/');
    expect(botPath('ja', 'gptbot')).toBe('/ja/bots/gptbot/');
  });

  it('markdown twins', () => {
    expect(markdownPath('/')).toBe('/index.md');
    expect(markdownPath('/de/')).toBe('/de/index.md');
    expect(markdownPath('/bots/gptbot/')).toBe('/bots/gptbot.md');
  });
});

describe('content links', () => {
  it('resolves page: and bot: links per locale', () => {
    expect(resolveHref('page:tester', 'es')).toBe('/es/verificador-robots-txt/');
    expect(resolveHref('bot:claudebot', 'it')).toBe('/it/bot-ai/claudebot/');
    expect(resolveHref('page:server-rules#verify', 'en')).toBe('/server-rules/#verify');
    expect(resolveHref('https://example.com', 'en')).toBe('https://example.com');
    expect(() => resolveHref('page:nope', 'en')).toThrow();
    expect(resolveLinksInHtml('<a href="page:bots">x</a>', 'nl')).toBe(
      '<a href="/nl/ai-bots/">x</a>',
    );
  });

  it('renders inline markdown safely', () => {
    expect(renderInline('Use `Disallow: /` and **bold** <script>', false, 'en')).toBe(
      'Use <code>Disallow: /</code> and <strong>bold</strong> &lt;script&gt;',
    );
    expect(renderInline('[tester](page:tester)', false, 'pl')).toBe(
      '<a href="/pl/tester-robots-txt/">tester</a>',
    );
    expect(plainText('A [link](page:x) and `code`')).toBe('A link and code');
  });
});
