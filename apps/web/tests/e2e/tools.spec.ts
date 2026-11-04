import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

/** Wait until every island on the page has hydrated. */
async function hydrated(page: Page) {
  await page.waitForFunction(() =>
    [...document.querySelectorAll('astro-island')].every((i) => !i.hasAttribute('ssr')),
  );
}

test('generator: goals change the file', async ({ page }) => {
  await page.goto('/');
  await hydrated(page);
  const out = page.locator('.notice').first();
  await page.getByLabel(/Allow everything/).check();
  await expect(out).not.toContainText('User-agent: GPTBot');
  await page.getByLabel(/No AI at all/).check();
  await expect(out).toContainText('User-agent: OAI-SearchBot');
  await expect(page.locator('.callout--warn')).toContainText('OAI-SearchBot');
});

test('generator: path exception', async ({ page }) => {
  await page.goto('/');
  await hydrated(page);
  await page.locator('#gen-path').fill('/blog/');
  await page.getByRole('button', { name: 'Add path' }).click();
  await expect(page.locator('.notice').first()).toContainText('Allow: /blog/');
  await expect(page.locator('.stamp--ok.stamp--big')).toBeVisible();
});

test('merge mode keeps existing rules and proves it', async ({ page }) => {
  await page.goto('/');
  await hydrated(page);
  await page.getByRole('tab', { name: 'Add to my robots.txt' }).click();
  await page
    .locator('#gen-existing')
    .fill('User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n');
  await expect(page.locator('.callout--ok')).toContainText('Unchanged for existing agents');
  await expect(page.locator('.notice').first()).toContainText('Disallow: /wp-admin/');
});

test('tester: paste mode shows verdicts and the deciding line', async ({ page }) => {
  await page.goto('/robots-txt-tester/');
  await hydrated(page);
  await page.getByRole('tab', { name: 'Paste robots.txt' }).click();
  await page
    .locator('#tester-paste')
    .fill('User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nDisallow: /private/\n');
  const row = page.locator('tbody tr', { hasText: 'GPTBot' }).first();
  await expect(row).toContainText('Blocked');
  await expect(page.locator('.test-result')).toContainText('line 2');
  await page.getByLabel('URL or path').fill('/private/x');
  await page.getByLabel('Crawler', { exact: true }).selectOption('*');
  await expect(page.locator('.test-result')).toContainText('Blocked');
});

test('tester: live check through the api (mocked)', async ({ page }) => {
  await page.route('**/api/robots?**', (route) =>
    route.fulfill({
      json: {
        input: 'example.com',
        requestedUrl: 'https://example.com/robots.txt',
        finalUrl: 'https://example.com/robots.txt',
        status: 200,
        contentType: 'text/plain',
        redirects: [],
        bytes: 40,
        truncated: false,
        bodyBase64: Buffer.from('User-agent: ClaudeBot\nDisallow: /\n').toString('base64'),
        httpFallback: false,
        durationMs: 12,
        cached: false,
      },
    }),
  );
  await page.goto('/robots-txt-tester/');
  await hydrated(page);
  await page.getByLabel('Website or URL').fill('example.com');
  await page.getByRole('button', { name: 'Fetch robots.txt' }).click();
  await expect(page.locator('.status-line')).toContainText('200');
  await expect(page.locator('tbody tr', { hasText: 'ClaudeBot' }).first()).toContainText('Blocked');
});

test('tester: api errors are explained', async ({ page }) => {
  await page.route('**/api/robots?**', (route) =>
    route.fulfill({ status: 400, json: { error: 'ip-not-public' } }),
  );
  await page.goto('/robots-txt-tester/');
  await hydrated(page);
  await page.getByLabel('Website or URL').fill('http://169.254.169.254');
  await page.getByRole('button', { name: 'Fetch robots.txt' }).click();
  await expect(page.locator('.callout--warn')).toContainText('Private, local and reserved');
});

for (const path of [
  '/',
  '/robots-txt-tester/',
  '/bots/',
  '/bots/gptbot/',
  '/server-rules/nginx/',
  '/guides/robots-txt-syntax/',
]) {
  test(`accessibility: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(serious.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
}

test('keyboard: generator goal can be changed with the keyboard', async ({ page }) => {
  await page.goto('/');
  await hydrated(page);
  await page.getByLabel(/No AI training, stay in AI search/).focus();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByLabel(/No AI at all/)).toBeChecked();
});
