/** Shared helpers for page views. */
import { curatedBots } from '@airobots/core';
import type { GenBot } from '../islands/Generator';
import { t } from '../i18n';
import type { Locale } from '../i18n/locales';
import { botPath, markdownPath, pathFor, type PageId } from '../i18n/routes';
import { getPage } from './content';
import type { SitePage } from './pages';

export function genBots(): GenBot[] {
  return curatedBots.map((b) => {
    const g: GenBot = {
      id: b.id,
      name: b.name,
      token: b.token,
      purpose: b.purpose,
      kind: b.kind,
      respectsRobots: b.respectsRobots,
      uaMatch: b.uaMatch,
      verification: b.verification,
      lastVerified: b.lastVerified,
      checkMethod: b.checkMethod,
      source: b.source,
      page: b.page,
      summary: '',
      operator: b.operator,
    };
    if (b.general) g.general = true;
    if (b.legacy) g.legacy = true;
    return g;
  });
}

export function crumbsFor(
  locale: Locale,
  id: PageId | 'bot',
  extra?: { name: string; href: string },
): { name: string; href: string }[] {
  const items = [{ name: t(locale, 'common.home'), href: pathFor(locale, 'home') }];
  const chain: PageId[] = [];
  const parents: Partial<Record<PageId, PageId>> = {
    'server-nginx': 'server-rules',
    'server-apache': 'server-rules',
    'server-caddy': 'server-rules',
    'server-cloudflare': 'server-rules',
    'server-frameworks': 'server-rules',
    'guide-training-search': 'guides',
    'guide-syntax': 'guides',
    'guide-eu-ai-act': 'guides',
    'guide-bad-bots': 'guides',
  };
  if (id === 'bot') chain.push('bots');
  else if (id !== 'home') {
    if (parents[id]) chain.push(parents[id]!);
    chain.push(id);
  }
  for (const c of chain) {
    const p = getPage(locale, c);
    items.push({ name: p?.frontmatter.nav ?? p?.frontmatter.h1 ?? c, href: pathFor(locale, c) });
  }
  if (extra) items.push(extra);
  return items;
}

export function ogPath(page: SitePage): string {
  const key = page.id === 'bot' ? `bot-${page.botId}` : page.id;
  return `/og/${page.locale}/${key}.png`;
}

export function mdPath(page: SitePage): string {
  return markdownPath(page.id === 'bot' ? botPath(page.locale, page.botId!) : page.path);
}
