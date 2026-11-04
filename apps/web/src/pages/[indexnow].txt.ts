import type { APIRoute, GetStaticPaths } from 'astro';
import { INDEXNOW_KEY } from '../config/site';

/** IndexNow key file at /<key>.txt (only when INDEXNOW_KEY is set). */
export const getStaticPaths = (() =>
  /^[a-f0-9-]{8,128}$/i.test(INDEXNOW_KEY)
    ? [{ params: { indexnow: INDEXNOW_KEY } }]
    : []) satisfies GetStaticPaths;
export const GET: APIRoute = () =>
  new Response(INDEXNOW_KEY, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
