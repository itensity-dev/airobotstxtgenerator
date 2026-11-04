// After `astro build`: write the service worker with a precache list, then pre-compress text files
// with brotli (Caddy serves .br via `file_server { precompressed br }` and gzips on the fly for the
// few clients without brotli support — keeping the image small).
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { brotliCompressSync, constants } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const walk = (d) =>
  readdirSync(d).flatMap((f) =>
    statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)],
  );
const files = walk(dist).filter((f) => !/\.(br|gz)$/.test(f));
const rel = (f) => '/' + relative(dist, f).split('\\').join('/');

// 1. Service worker: precache the app shell (JS, CSS, fonts), the generator and tester pages of
// every language and bots.json, so the generator and the paste test work offline.
const locales = ['', 'de/', 'fr/', 'es/', 'it/', 'nl/', 'pl/', 'pt-br/', 'ja/'];
const testerSlugs = [
  'robots-txt-tester',
  'tester-robots-txt',
  'verificador-robots-txt',
  'verifica-robots-txt',
  'robots-txt-checker',
];
const pages = [];
for (const l of locales) {
  if (statSync(join(dist, l, 'index.html'), { throwIfNoEntry: false })) pages.push('/' + l);
  for (const s of testerSlugs)
    if (statSync(join(dist, l, s, 'index.html'), { throwIfNoEntry: false }))
      pages.push(`/${l}${s}/`);
}
const assets = files
  .map(rel)
  .filter((p) => p.startsWith('/_astro/') && /\.(js|css|woff2)$/.test(p));
const precache = [
  ...pages,
  ...assets,
  '/bots.json',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.png',
];
const version = createHash('sha256')
  .update(
    precache.join('\n') +
      files
        .filter((f) => f.endsWith('.html'))
        .map((f) => readFileSync(f, 'utf8').length)
        .join(','),
  )
  .digest('hex')
  .slice(0, 12);
const sw = `// Generated at build time. Network-first for pages, cache-first for hashed assets.
const VERSION = '${version}';
const CACHE = 'airobots-' + VERSION;
const PRECACHE = ${JSON.stringify(precache)};
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('airobots-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
  if (url.pathname.startsWith('/_astro/')) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })));
    return;
  }
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && (req.mode === 'navigate' || url.pathname === '/bots.json')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(async () => {
        const hit = await caches.match(req, { ignoreSearch: true });
        if (hit) return hit;
        const m = url.pathname.match(/^\\/(de|fr|es|it|nl|pl|pt-br|ja)\\//);
        return (await caches.match(m ? '/' + m[1] + '/' : '/')) || Response.error();
      }),
  );
});
`;
writeFileSync(join(dist, 'sw.js'), sw);
files.push(join(dist, 'sw.js'));

// 2. Pre-compression.
let n = 0;
let saved = 0;
for (const f of files) {
  if (!/\.(html|css|js|mjs|json|txt|md|xml|svg|webmanifest|ico)$/.test(f)) continue;
  const buf = readFileSync(f);
  if (buf.length < 1024) continue;
  const br = brotliCompressSync(buf, {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: 11,
      [constants.BROTLI_PARAM_SIZE_HINT]: buf.length,
    },
  });
  if (br.length >= buf.length) continue;
  writeFileSync(f + '.br', br);
  n++;
  saved += buf.length - br.length;
}
console.log(
  `postbuild: sw.js (${precache.length} precached URLs, version ${version}); ${n} files pre-compressed, ${(saved / 1024 / 1024).toFixed(1)} MB saved with brotli`,
);
