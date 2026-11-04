import { getBot } from '@airobots/core';
import { LOCALE_INFO, type Locale } from '../i18n/locales';
import { SITE_URL } from '../config/site';
import { getPage } from './content';
import { allPages, alternatesFor, type SitePage } from './pages';
import type { PageId } from '../i18n/routes';

export function lastmod(p: SitePage): string {
  if (p.id === 'bot') return getBot(p.botId!)!.lastVerified;
  return getPage(p.locale, p.id as PageId)?.frontmatter.updated ?? '2026-11-04';
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function sitemapFor(locale: Locale): string {
  const pages = allPages().filter((p) => p.locale === locale);
  const urls = pages.map((p) => {
    const alts = alternatesFor(p.id, p.botId);
    const links = Object.entries(alts)
      .map(([l, path]) => `    <xhtml:link rel="alternate" hreflang="${LOCALE_INFO[l as Locale].hreflang}" href="${esc(SITE_URL + path)}"/>`)
      .concat(alts.en ? [`    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(SITE_URL + alts.en)}"/>`] : []);
    return `  <url>\n    <loc>${esc(SITE_URL + p.path)}</loc>\n    <lastmod>${lastmod(p)}</lastmod>\n${links.join('\n')}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}

export function latest(locale: Locale): string {
  return allPages()
    .filter((p) => p.locale === locale)
    .map(lastmod)
    .sort()
    .at(-1)!;
}
