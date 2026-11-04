/**
 * Content files link to pages by id so translations never hard-code localized slugs:
 *   [tester](page:tester)  [GPTBot](bot:gptbot)  [nginx rules](page:server-nginx#verify)
 */
import { isLocale, type Locale } from '../i18n/locales';
import { ROUTES, botPath, pathFor, type PageId } from '../i18n/routes';

export function resolveHref(href: string, locale: Locale): string {
  const m = /^(page|bot):([a-z0-9-]+)(#[\w-]+)?$/.exec(href);
  if (!m) return href;
  const [, kind, id, hash = ''] = m;
  if (kind === 'bot') return botPath(locale, id!) + hash;
  if (!(id! in ROUTES)) throw new Error(`Unknown page id in link: ${href}`);
  return pathFor(locale, id as PageId) + hash;
}

export function localeFromFile(path: string): Locale {
  const m = /\/content\/([a-z-]+)\//.exec(path.replace(/\\/g, '/'));
  return m && isLocale(m[1]!) ? m[1] : 'en';
}

/** Rewrite href="page:…" / href="bot:…" in rendered HTML. */
export function resolveLinksInHtml(html: string, locale: Locale): string {
  return html.replace(
    /href="((?:page|bot):[a-z0-9-]+(?:#[\w-]+)?)"/g,
    (_m, href: string) => `href="${resolveHref(href, locale)}"`,
  );
}
