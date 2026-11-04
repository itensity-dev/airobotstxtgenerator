// Checks the built site against the brief's "forbidden" list (section 10): gradients, glass/blur,
// glow, emoji/sparkles as icons, default fonts, marketing words, fake social proof.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = fileURLToPath(new URL('../dist', import.meta.url));
const walk = (d) =>
  readdirSync(d).flatMap((f) =>
    statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)],
  );
const files = walk(dist).filter((f) => /\.(html|css)$/.test(f));
const rules = [
  ['gradient', /(linear|radial|conic)-gradient\(/i],
  ['glass / blur', /backdrop-filter|filter:\s*blur/i],
  [
    'glow (coloured text/box shadow)',
    /text-shadow\s*:|box-shadow:[^;]*\d+px\s+\d+px\s+[1-9]\d*px/i,
  ],
  ['sparkles / emoji icons', /[✨\u{1F300}-\u{1FAFF}]/u],
  ['default font stack only', /font-family:\s*(Inter|Geist|system-ui)\s*[,;]/i],
  [
    'marketing words',
    /\b(unleash|supercharge|seamless(ly)?|effortless(ly)?|AI-powered|in (just )?a few clicks|game-chang|revolutioni[sz]e|trusted by|10x)\b/i,
  ],
  ['fake social proof', /(\d[\d,.]*\+?\s*(happy\s+)?(users|customers)\b)|testimonial/i],
];
let problems = 0;
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  for (const [name, re] of rules) {
    const m = re.exec(text);
    if (m) {
      problems++;
      console.log(
        `${name}: ${f.replace(dist, '')} → “${text.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' ')}”`,
      );
    }
  }
}
console.log(
  problems ? `${problems} problem(s)` : `forbidden-list check: ${files.length} files clean`,
);
process.exitCode = problems ? 1 : 0;
