import type { APIRoute } from 'astro';
import { curatedBots, registry } from '@airobots/core';
import { SITE_URL } from '../config/site';

/**
 * Our own robots.txt: every crawler is welcome, AI crawlers named explicitly from our register.
 * We want to be read and cited (see /about/). Only the live-check API is closed — it is not content.
 */
export const GET: APIRoute = () => {
  const tokens = [...new Set(curatedBots.map((b) => b.token))];
  const body = [
    '# robots.txt — airobotstxtgenerator.com',
    '# Every crawler is welcome, including every AI crawler and AI agent in our register.',
    '# We want this site to be read, cited and linked. Why: ' + SITE_URL + '/about/',
    `# AI agents listed from our register (updated ${registry.updated}):`,
    '',
    ...tokens.map((t) => `User-agent: ${t}`),
    'Allow: /',
    'Disallow: /api/',
    '',
    'User-agent: *',
    'Content-Signal: search=yes, ai-input=yes, ai-train=yes',
    'Allow: /',
    'Disallow: /api/',
    '',
    `Sitemap: ${SITE_URL}/sitemap-index.xml`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
