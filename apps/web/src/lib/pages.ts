/** Enumerates every HTML page of the site (locale × page, plus bot pages). */
import { pageBots } from '@airobots/core';
import { PUBLISHED_LOCALES, type Locale } from '../i18n/locales';
import { PAGE_IDS, botPath, pathFor, type PageId } from '../i18n/routes';
import { getPage, getBotTexts } from './content';

export type SitePage = {
  locale: Locale;
  id: PageId | 'bot';
  botId?: string;
  path: string;
};

export function pageExists(locale: Locale, id: PageId | 'bot', botId?: string): boolean {
  if (id === 'bot') return !!botId && (locale === 'en' || !!getBotTexts(locale)[botId]);
  return !!getPage(locale, id);
}

export function alternatesFor(id: PageId | 'bot', botId?: string): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const l of PUBLISHED_LOCALES) {
    if (!pageExists(l, id, botId)) continue;
    out[l] = id === 'bot' ? botPath(l, botId!) : pathFor(l, id);
  }
  return out;
}

export function allPages(): SitePage[] {
  const out: SitePage[] = [];
  for (const locale of PUBLISHED_LOCALES) {
    for (const id of PAGE_IDS) {
      if (pageExists(locale, id)) out.push({ locale, id, path: pathFor(locale, id) });
    }
    if (pageExists(locale, 'bots')) {
      for (const b of pageBots()) {
        if (pageExists(locale, 'bot', b.id))
          out.push({ locale, id: 'bot', botId: b.id, path: botPath(locale, b.id) });
      }
    }
  }
  return out;
}
