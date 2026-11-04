import type { APIRoute } from 'astro';
import { communityList, curatedBots, registry } from '@airobots/core';
import { SITE_URL, BRAND } from '../config/site';
import { botPath } from '../i18n/routes';

/** Machine-readable bot register: curated entries plus the ai.robots.txt community list. */
export const GET: APIRoute = () => {
  const body = {
    name: `AI crawler register — ${BRAND}`,
    description:
      'AI crawlers, AI agents and robots.txt control tokens with operator, purpose, robots.txt compliance (operator statement), IP ranges, verification method, primary source and date of last check.',
    url: `${SITE_URL}/bots/`,
    updated: registry.updated,
    license:
      'CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/) — attribution: airobotstxtgenerator.com. Community entries: MIT License, ai.robots.txt.',
    sources: registry.sources,
    operators: registry.operators,
    bots: curatedBots.map((b) => ({ ...b, url: b.page ? SITE_URL + botPath('en', b.id) : null })),
    community: communityList,
  };
  return new Response(JSON.stringify(body, null, 1), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
