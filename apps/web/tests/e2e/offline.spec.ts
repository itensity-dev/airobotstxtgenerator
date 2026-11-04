import { expect, test } from '@playwright/test';
import { createServer, type Server } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AddressInfo } from 'node:net';

/**
 * Real offline check: serve dist/ from our own server, let the service worker precache, then shut the
 * server down (Playwright's setOffline does not route through service workers in Chromium).
 */
const dist = fileURLToPath(new URL('../../dist/', import.meta.url));
const types: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
};

function serve(): Promise<Server> {
  const server = createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    try {
      const file = join(dist, p);
      if ((await stat(file)).isDirectory()) throw new Error('dir');
      res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404);
      res.end('not found');
    }
  });
  return new Promise((r) => server.listen(0, '127.0.0.1', () => r(server)));
}

test('generator and paste test work offline after the first visit', async ({ page }) => {
  const server = await serve();
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  await page.goto(base + '/');
  await page.waitForFunction(
    async () => {
      const reg = await navigator.serviceWorker.ready;
      return !!reg.active && (await caches.keys()).some((k) => k.startsWith('airobots-'));
    },
    undefined,
    { timeout: 20_000 },
  );
  // Wait until precaching has finished (install completed → active).
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, undefined, {
    timeout: 20_000,
  });
  await new Promise<void>((r) => server.close(() => r()));
  server.closeAllConnections?.();

  await page.reload();
  await expect(page.locator('.notice').first()).toContainText('User-agent: GPTBot');
  await page.getByLabel(/Allow everything/).check();
  await expect(page.locator('.notice').first()).not.toContainText('User-agent: GPTBot');

  await page.goto(base + '/robots-txt-tester/');
  await page.getByRole('tab', { name: 'Paste robots.txt' }).click();
  await page.locator('#tester-paste').fill('User-agent: GPTBot\nDisallow: /\n');
  await expect(page.locator('tbody tr', { hasText: 'GPTBot' }).first()).toContainText('Blocked');
});
