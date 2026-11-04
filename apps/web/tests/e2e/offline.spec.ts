import { expect, test } from '@playwright/test';

test('generator and paste test work offline after the first visit', async ({ page, context }) => {
  await page.goto('/');
  // Wait until the service worker controls the page and has finished precaching.
  await page
    .waitForFunction(
      async () => {
        const reg = await navigator.serviceWorker.getRegistration();
        return !!reg?.active && !!navigator.serviceWorker.controller;
      },
      undefined,
      { timeout: 20_000 },
    )
    .catch(async () => {
      await page.reload();
      await page.waitForFunction(() => !!navigator.serviceWorker.controller, undefined, {
        timeout: 20_000,
      });
    });
  await page.waitForFunction(async () =>
    (await caches.keys()).some((k) => k.startsWith('airobots-')),
  );
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.notice').first()).toContainText('User-agent: GPTBot');
  await page.getByLabel(/Allow everything/).check();
  await expect(page.locator('.notice').first()).not.toContainText('User-agent: GPTBot');
  await page.goto('/robots-txt-tester/');
  await page.getByRole('tab', { name: 'Paste robots.txt' }).click();
  await page.locator('#tester-paste').fill('User-agent: GPTBot\nDisallow: /\n');
  await expect(page.locator('tbody tr', { hasText: 'GPTBot' }).first()).toContainText('Blocked');
  await context.setOffline(false);
});
