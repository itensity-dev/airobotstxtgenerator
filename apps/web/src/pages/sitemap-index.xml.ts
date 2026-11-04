import type { APIRoute } from 'astro';
import { PUBLISHED_LOCALES } from '../i18n/locales';
import { SITE_URL } from '../config/site';
import { latest } from '../lib/sitemap';

export const GET: APIRoute = () => {
  const items = PUBLISHED_LOCALES.map((l) => `  <sitemap>\n    <loc>${SITE_URL}/sitemap-${l}.xml</loc>\n    <lastmod>${latest(l)}</lastmod>\n  </sitemap>`);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items.join('\n')}\n</sitemapindex>\n`, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
};
