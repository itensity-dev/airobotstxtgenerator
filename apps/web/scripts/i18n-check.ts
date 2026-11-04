/**
 * Fails if a published language misses UI keys, pages, bot texts, uses unknown keys,
 * drops placeholders, or contains broken page:/bot: links. Usage: tsx scripts/i18n-check.ts [locale...]
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt-br', 'ja'];
const only = process.argv.slice(2);
const targets = (only.length ? only : LOCALES).filter((l) => l !== 'en');

type Nested = { [k: string]: string | Nested };
const flatten = (o: Nested, p = '', out: Record<string, string> = {}) => {
  for (const [k, v] of Object.entries(o)) {
    const key = p ? `${p}.${k}` : k;
    if (typeof v === 'string') out[key] = v;
    else flatten(v, key, out);
  }
  return out;
};
const ui = (l: string) =>
  flatten(JSON.parse(readFileSync(join(root, 'src/i18n/ui', `${l}.json`), 'utf8')));
const placeholders = (s: string) =>
  [...s.matchAll(/\{(\w+)\}/g)]
    .map((m) => m[1])
    .sort()
    .join(',');
const dbl = (s: string) =>
  [...s.matchAll(/\{\{(\w+)\}\}/g)]
    .map((m) => m[1])
    .sort()
    .join(',');
const links = (s: string) => [...s.matchAll(/\]\(((?:page|bot):[a-z0-9-]+)/g)].map((m) => m[1]);

const routes = readFileSync(join(root, 'src/i18n/routes.ts'), 'utf8');
const pageIds = new Set([...routes.matchAll(/^\s{2}'?([a-z-]+)'?: \{/gm)].map((m) => m[1]));
const registry = JSON.parse(
  readFileSync(join(root, '../../packages/core/src/data/bots.json'), 'utf8'),
) as { bots: { id: string; page: boolean }[] };
const botIds = new Set(registry.bots.map((b) => b.id));
const pageBots = registry.bots.filter((b) => b.page).map((b) => b.id);

const errors: string[] = [];
const en = ui('en');
const enPages = readdirSync(join(root, 'src/content/en')).filter((f) => f.endsWith('.md'));
const enBots = JSON.parse(readFileSync(join(root, 'src/content/en/bots.json'), 'utf8')) as Record<
  string,
  Record<string, unknown>
>;

function checkLinks(where: string, text: string) {
  for (const l of links(text)) {
    const [kind, id] = l.split(':');
    if (kind === 'page' && !pageIds.has(id!)) errors.push(`${where}: unknown page link ${l}`);
    if (kind === 'bot' && !botIds.has(id!)) errors.push(`${where}: unknown bot link ${l}`);
  }
}

for (const f of enPages)
  checkLinks(`en/${f}`, readFileSync(join(root, 'src/content/en', f), 'utf8'));

for (const l of targets) {
  const file = join(root, 'src/i18n/ui', `${l}.json`);
  if (!existsSync(file)) {
    errors.push(`${l}: missing ui/${l}.json`);
    continue;
  }
  const d = ui(l);
  for (const k of Object.keys(en)) {
    if (!(k in d)) errors.push(`${l}: missing key ${k}`);
    else if (placeholders(en[k]!) !== placeholders(d[k]!))
      errors.push(`${l}: placeholders differ in ${k}: "${d[k]}"`);
  }
  for (const k of Object.keys(d)) if (!(k in en)) errors.push(`${l}: unknown key ${k}`);
  for (const f of enPages) {
    const p = join(root, 'src/content', l, f);
    if (!existsSync(p)) {
      errors.push(`${l}: missing page ${f}`);
      continue;
    }
    const src = readFileSync(join(root, 'src/content/en', f), 'utf8');
    const txt = readFileSync(p, 'utf8');
    if (!txt.startsWith('---\n')) errors.push(`${l}/${f}: no frontmatter`);
    for (const key of ['title:', 'description:', 'h1:', 'lead:', 'updated:'])
      if (!txt.includes(`\n${key}`)) errors.push(`${l}/${f}: frontmatter lacks ${key}`);
    if (
      dbl(src) &&
      !dbl(txt)
        .split(',')
        .every((x) => !x || dbl(src).includes(x))
    )
      errors.push(`${l}/${f}: unknown {{placeholder}}`);
    const enFaq = (src.match(/\n {2}- q:/g) ?? []).length;
    const lFaq = (txt.match(/\n {2}- q:/g) ?? []).length;
    if (lFaq < enFaq) errors.push(`${l}/${f}: FAQ has ${lFaq} items, English has ${enFaq}`);
    checkLinks(`${l}/${f}`, txt);
  }
  const bp = join(root, 'src/content', l, 'bots.json');
  if (!existsSync(bp)) errors.push(`${l}: missing bots.json`);
  else {
    const b = JSON.parse(readFileSync(bp, 'utf8')) as Record<string, Record<string, unknown>>;
    for (const id of pageBots) {
      if (!b[id]) errors.push(`${l}: bots.json misses ${id}`);
      else
        for (const field of ['details', 'summary'])
          if (!b[id]![field]) errors.push(`${l}: bots.json ${id} lacks ${field}`);
    }
    for (const id of Object.keys(b))
      if (!enBots[id]) errors.push(`${l}: bots.json has unknown bot ${id}`);
  }
  if (!existsSync(join(root, 'src/content', l, 'bot-page.json')))
    errors.push(`${l}: missing bot-page.json`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n${errors.length} problem(s).`);
  process.exit(1);
}
console.log(
  `i18n OK: ${targets.length ? targets.join(', ') : 'en only'} — ${Object.keys(en).length} keys, ${enPages.length} pages, ${pageBots.length} bot texts each.`,
);
