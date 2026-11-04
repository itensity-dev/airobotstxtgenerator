// Screenshots of every screen at 375, 768 and 1440 px for docs/screenshots (run against `astro preview`).
// Usage: node scripts/screenshots.mjs [baseUrl]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const base = process.argv[2] ?? 'http://127.0.0.1:4321';
const out = fileURLToPath(new URL('../../../docs/screenshots/', import.meta.url));
mkdirSync(out, { recursive: true });
const screens = [
  ['home', '/'],
  ['tester', '/robots-txt-tester/'],
  ['bots', '/bots/'],
  ['bot-gptbot', '/bots/gptbot/'],
  ['server-rules', '/server-rules/'],
  ['server-nginx', '/server-rules/nginx/'],
  ['llms-txt', '/llms-txt-generator/'],
  ['content-signals', '/content-signals/'],
  ['tdmrep', '/tdmrep/'],
  ['meta-tags', '/ai-meta-tags/'],
  ['guides', '/guides/'],
  ['guide', '/guides/block-ai-training-keep-ai-search/'],
  ['about', '/about/'],
  ['licenses', '/licenses/'],
  ['not-found', '/this-page-does-not-exist/'],
  ['de-home', '/de/'],
  ['ja-bot', '/ja/bots/claudebot/'],
];
const widths = [
  [375, 812],
  [768, 1024],
  [1440, 1000],
];
const browser = await chromium.launch();
for (const [w, h] of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const [name, path] of screens) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    if (name === 'tester') {
      await page.getByRole('tab', { name: 'Paste robots.txt' }).click();
      await page
        .locator('#tester-paste')
        .fill(
          'User-agent: GPTBot\nUser-agent: CCBot\nDisallow: /\n\nUser-agent: Google-Extended\nDisallow: /\n\nUser-agent: *\nDisallow: /private/\n\nSitemap: https://example.com/sitemap.xml\n',
        );
      await page.waitForTimeout(400);
    }
    await page.screenshot({ path: `${out}${name}-${w}.png` });
  }
  if (w !== 768) {
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await page.screenshot({
      path: `${out}home-full-${w}.jpg`,
      fullPage: true,
      type: 'jpeg',
      quality: 70,
    });
  }
  await ctx.close();
}
await browser.close();
console.log(`screenshots: ${screens.length} screens × ${widths.length} widths → docs/screenshots`);
