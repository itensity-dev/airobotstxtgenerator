import type { APIRoute, GetStaticPaths } from 'astro';
import { allPages, type SitePage } from '../lib/pages';
import { markdownPath } from '../i18n/routes';
import { botPath } from '../i18n/routes';
import { pageMarkdown } from '../lib/export-md';

export const getStaticPaths = (() =>
  allPages().map((p) => {
    const md = markdownPath(p.id === 'bot' ? botPath(p.locale, p.botId!) : p.path);
    return { params: { md: md.replace(/^\//, '').replace(/\.md$/, '') }, props: p };
  })) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(await pageMarkdown(props as SitePage), {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
