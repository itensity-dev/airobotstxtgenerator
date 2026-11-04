#!/usr/bin/env node
// Notify IndexNow (Bing, Yandex, Seznam, Naver …) about changed URLs after a deploy.
// Usage: INDEXNOW_KEY=… SITE_URL=https://airobotstxtgenerator.com node scripts/indexnow.mjs [--since=YYYY-MM-DD] [--all] [--dry-run]
// Reads the built sitemaps in dist/ and submits URLs whose <lastmod> is on or after --since (default: 7 days ago).
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((a) => a.replace(/^--/, '').split('='))
    .map(([k, v]) => [k, v ?? true]),
);
const key = process.env.INDEXNOW_KEY;
const site = (process.env.SITE_URL || 'https://airobotstxtgenerator.com').replace(/\/$/, '');
if (!key) {
  console.log('indexnow: INDEXNOW_KEY not set — skipping.');
  process.exit(0);
}
const since = args.since ?? new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10);
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const urls = [];
for (const f of readdirSync(dist).filter(
  (f) => /^sitemap-[a-z-]+\.xml$/.test(f) && f !== 'sitemap-index.xml',
)) {
  const xml = readFileSync(dist + f, 'utf8');
  for (const m of xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) {
    if (args.all || m[2] >= since) urls.push(m[1].replace(/&amp;/g, '&'));
  }
}
const extra = [`${site}/robots.txt`, `${site}/llms.txt`, `${site}/bots.json`];
const list = [...new Set([...urls, ...extra])];
console.log(`indexnow: ${list.length} URLs changed since ${args.all ? 'ever' : since}`);
if (args['dry-run']) {
  console.log(list.slice(0, 20).join('\n'));
  process.exit(0);
}
for (let i = 0; i < list.length; i += 10000) {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(site).host,
      key,
      keyLocation: `${site}/${key}.txt`,
      urlList: list.slice(i, i + 10000),
    }),
  });
  console.log(`indexnow: batch ${i / 10000 + 1} → HTTP ${res.status}`);
  if (res.status >= 400 && res.status !== 422) process.exitCode = 1;
}
