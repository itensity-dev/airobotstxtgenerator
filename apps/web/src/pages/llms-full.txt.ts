import type { APIRoute } from 'astro';
import { llmsFullTxt } from '../lib/llms';
export const GET: APIRoute = async () =>
  new Response(await llmsFullTxt('en'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
