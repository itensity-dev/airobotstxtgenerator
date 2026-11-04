import { expect, test } from '@playwright/test';

test('HTML without JavaScript contains H1, description, steps and FAQ', async ({ request }) => {
  for (const path of ['/', '/robots-txt-tester/', '/bots/gptbot/', '/guides/block-ai-training-keep-ai-search/']) {
    const html = await (await request.get(path)).text();
    expect(html, path).toMatch(/<h1[^>]*>[^<]+<\/h1>/);
    expect(html, path).toMatch(/<meta name="description" content="[^"]{50,}"/);
    expect(html, path).toContain('<details>');
  }
});

test('hreflang, canonical and markdown alternate', async ({ request }) => {
  const html = await (await request.get('/bots/gptbot/')).text();
  expect(html).toContain('<link rel="canonical" href="https://airobotstxtgenerator.com/bots/gptbot/"');
  expect(html).toContain('hreflang="x-default"');
  expect(html).toContain('type="text/markdown"');
  const md = await request.get('/bots/gptbot.md');
  expect(md.ok()).toBe(true);
  expect(await md.text()).toContain('# GPTBot');
});

test('machine-readable files', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('User-agent: GPTBot');
  expect(robots).toContain('Sitemap: https://airobotstxtgenerator.com/sitemap-index.xml');
  const llms = await (await request.get('/llms.txt')).text();
  expect(llms.startsWith('# AI Robots.txt Generator')).toBe(true);
  const bots = await (await request.get('/bots.json')).json();
  expect(bots.bots.length).toBeGreaterThan(40);
  expect(bots.license).toContain('CC BY 4.0');
  const sm = await (await request.get('/sitemap-index.xml')).text();
  expect(sm).toContain('sitemap-en.xml');
});

test('JSON-LD is valid JSON with expected types', async ({ request }) => {
  const html = await (await request.get('/')).text();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]!));
  const types = blocks.map((b) => b['@type']);
  expect(types).toContain('WebApplication');
  expect(types).toContain('FAQPage');
  const app = blocks.find((b) => b['@type'] === 'WebApplication');
  expect(app.isAccessibleForFree).toBe(true);
  expect(app.offers.price).toBe('0');
});
