import type { APIRoute } from 'astro';
import { llmsTxt } from '../lib/llms';
export const GET: APIRoute = () =>
  new Response(llmsTxt('en'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
