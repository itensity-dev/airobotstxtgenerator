// Collects licence information for /licenses. Runs before `astro build`.
// Writes src/generated/licenses.json; if pnpm is unavailable the committed file is kept.
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../src/generated/licenses.json', import.meta.url));
const root = fileURLToPath(new URL('../../..', import.meta.url));

function list(args) {
  const raw = execFileSync('pnpm', ['licenses', 'list', '--json', ...args], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const data = JSON.parse(raw);
  const pkgs = [];
  for (const [license, entries] of Object.entries(data)) {
    for (const e of entries) pkgs.push({ name: e.name, version: e.versions.join(', '), license, homepage: e.homepage ?? null, author: typeof e.author === 'string' ? e.author : null });
  }
  return pkgs.sort((a, b) => a.name.localeCompare(b.name));
}

try {
  const pkgJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const all = list(['--filter', '@airobots/web']);
  // Code that ends up in the browser: Preact (bundled into islands) and our own core package.
  const shippedNames = new Set(['preact']);
  const shipped = all.filter((p) => shippedNames.has(p.name));
  const api = list(['--prod', '--filter', '@airobots/api']);
  const build = all.filter((p) => !shippedNames.has(p.name) && !p.name.startsWith('@fontsource'));
  const byLicense = {};
  for (const p of build) byLicense[p.license] = (byLicense[p.license] ?? 0) + 1;
  writeFileSync(out, JSON.stringify({ generated: new Date().toISOString().slice(0, 10), webVersion: pkgJson.version, shipped, api, build, byLicense }, null, 1) + '\n');
  console.log(`licenses: ${shipped.length} shipped, ${api.length} api, ${build.length} build-time packages`);
} catch (e) {
  console.warn('licenses: pnpm licenses failed, keeping the existing file', e?.message ?? e);
}
