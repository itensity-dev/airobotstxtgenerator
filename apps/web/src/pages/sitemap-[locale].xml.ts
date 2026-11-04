import type { APIRoute, GetStaticPaths } from 'astro';
import { PUBLISHED_LOCALES, type Locale } from '../i18n/locales';
import { sitemapFor } from '../lib/sitemap';

export const getStaticPaths = (() =>
  PUBLISHED_LOCALES.map((locale) => ({ params: { locale } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
  new Response(sitemapFor(params.locale as Locale), {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
