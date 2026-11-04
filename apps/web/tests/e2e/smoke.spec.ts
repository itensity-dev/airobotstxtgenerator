import { expect, test } from '@playwright/test';

test('home renders the tool with a verified example file', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('AI robots.txt generator');
  const notice = page.locator('.notice').first();
  await expect(notice).toContainText('User-agent: GPTBot');
  await expect(page.locator('.stamp--ok.stamp--big')).toContainText('Verified');
});

test('no horizontal scrolling', async ({ page }) => {
  for (const path of ['/', '/robots-txt-tester/', '/bots/', '/bots/gptbot/']) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, path).toBeLessThanOrEqual(1);
  }
});
