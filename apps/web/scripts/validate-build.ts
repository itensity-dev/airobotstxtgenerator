/**
 * Validates the built site: canonical, reciprocal hreflang with x-default, JSON-LD, sitemaps,
 * robots.txt (our own linter), llms.txt structure, Markdown twins, H1/description/FAQ without JS.
 * Usage: tsx scripts/validate-build.ts   (after `pnpm build`)
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  lintRobotsTxt,
  validateLlmsTxt,
  curatedBots,
  isAllowed,
} from '../../../packages/core/src/index.ts';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const SITE = (process.env.SITE_URL || 'https://airobotstxtgenerator.com').replace(/\/$/, '');
const walk = (d: string): string[] =>
  readdirSync(d).flatMap((f) =>
    statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)],
  );
const htmlFiles = walk(dist).filter((f) => f.endsWith('index.html') && !f.includes('/og/'));
const errors: string[] = [];
const err = (m: string) => errors.push(m);

interface PageInfo {
  url: string;
  alternates: Map<string, string>;
  noindex: boolean;
}
const pages = new Map<string, PageInfo>();

for (const f of htmlFiles) {
  const rel = f.slice(dist.length).replace(/index\.html$/, '');
  if (rel === '/404/' || rel.startsWith('/styleguide')) continue;
  const html = readFileSync(f, 'utf8');
  const url = SITE + rel;
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  if (canonical !== url) err(`${rel}: canonical ${canonical} ≠ ${url}`);
  const noindex = /<meta name="robots" content="noindex/.test(html);
  const alternates = new Map<string, string>();
  for (const m of html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g))
    alternates.set(m[1]!, m[2]!);
  if (!noindex) {
    if (!alternates.has('x-default')) err(`${rel}: no x-default`);
    if (![...alternates.values()].includes(url)) err(`${rel}: hreflang does not include itself`);
  }
  if (!/<h1[^>]*>[^<]+/.test(html)) err(`${rel}: no H1 text in HTML`);
  const desc = /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '';
  if (desc.length < 50 || desc.length > 300) err(`${rel}: description length ${desc.length}`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const j = JSON.parse(m[1]!);
      if (j['@context'] !== 'https://schema.org' || !j['@type'])
        err(`${rel}: JSON-LD without @context/@type`);
      if (j['@type'] === 'FAQPage' && !(j.mainEntity?.length > 0)) err(`${rel}: empty FAQPage`);
    } catch {
      err(`${rel}: JSON-LD does not parse`);
    }
  }
  const md = /<link rel="alternate" type="text\/markdown" href="([^"]+)"/.exec(html)?.[1];
  if (!md) err(`${rel}: no Markdown alternate`);
  else if (!existsSync(join(dist, md))) err(`${rel}: Markdown twin ${md} missing`);
  const og = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1];
  if (!og) err(`${rel}: no og:image`);
  else if (!existsSync(join(dist, og.replace(SITE, '')))) err(`${rel}: og image missing ${og}`);
  pages.set(url, { url, alternates, noindex });
}

// Reciprocal hreflang: every alternate must point back with the same set.
for (const p of pages.values()) {
  if (p.noindex) continue;
  for (const [lang, href] of p.alternates) {
    if (lang === 'x-default') continue;
    const other = pages.get(href);
    if (!other) {
      err(`${p.url}: hreflang ${lang} → ${href} not built`);
      continue;
    }
    if (![...other.alternates.values()].includes(p.url))
      err(`${href} does not link back to ${p.url}`);
  }
}

// Sitemaps.
const index = readFileSync(join(dist, 'sitemap-index.xml'), 'utf8');
const sitemapUrls = new Set<string>();
for (const m of index.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const file = join(dist, m[1]!.replace(SITE, ''));
  if (!existsSync(file)) {
    err(`sitemap missing: ${m[1]}`);
    continue;
  }
  const xml = readFileSync(file, 'utf8');
  if (!xml.startsWith('<?xml') || !xml.includes('</urlset>')) err(`${m[1]}: not a urlset`);
  for (const u of xml.matchAll(
    /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/g,
  ))
    sitemapUrls.add(u[1]!.replace(/&amp;/g, '&'));
}
for (const p of pages.values())
  if (!p.noindex && !sitemapUrls.has(p.url)) err(`${p.url} not in any sitemap`);

// robots.txt: our linter, every AI agent allowed, sitemap present.
const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
const lint = lintRobotsTxt(robots, { bots: curatedBots }).filter((i) => i.severity !== 'info');
if (lint.length) err(`robots.txt lint: ${lint.map((i) => i.code).join(', ')}`);
for (const b of curatedBots)
  if (!isAllowed(robots, /^[A-Za-z_-]+/.exec(b.token)![0], '/'))
    err(`robots.txt blocks ${b.token}`);
if (!robots.includes(`Sitemap: ${SITE}/sitemap-index.xml`)) err('robots.txt without sitemap');

// llms.txt files.
for (const f of walk(dist).filter((f) => /llms\.txt$/.test(f))) {
  const issues = validateLlmsTxt(readFileSync(f, 'utf8'));
  if (issues.length) err(`${f.slice(dist.length)}: ${issues.map((i) => i.message).join('; ')}`);
}
JSON.parse(readFileSync(join(dist, 'bots.json'), 'utf8'));

if (errors.length) {
  console.error(errors.slice(0, 60).join('\n'));
  console.error(`\n${errors.length} problem(s).`);
  process.exit(1);
}
console.log(
  `build valid: ${pages.size} pages, ${sitemapUrls.size} sitemap URLs, reciprocal hreflang, JSON-LD, robots.txt, llms.txt, Markdown twins.`,
);
