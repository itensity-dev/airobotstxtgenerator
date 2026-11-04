import type { APIRoute, GetStaticPaths } from 'astro';
import { PUBLISHED_LOCALES, type Locale } from '../../i18n/locales';
import { llmsTxt } from '../../lib/llms';
import { getPage } from '../../lib/content';
export const getStaticPaths = (() => PUBLISHED_LOCALES.filter((l) => l !== 'en' && getPage(l, 'home')).map((locale) => ({ params: { locale } }))) satisfies GetStaticPaths;
export const GET: APIRoute = ({ params }) => new Response(llmsTxt(params.locale as Locale), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
