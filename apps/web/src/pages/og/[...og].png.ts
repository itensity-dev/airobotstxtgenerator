import type { APIRoute, GetStaticPaths } from 'astro';
import { getBot, getOperator } from '@airobots/core';
import { allPages, type SitePage } from '../../lib/pages';
import { getBotTexts, getPage } from '../../lib/content';
import { renderOg } from '../../lib/og';
import { t } from '../../i18n';
import { formatDate } from '../../i18n/locales';
import type { PageId } from '../../i18n/routes';

export const getStaticPaths = (() =>
  allPages().map((p) => ({ params: { og: `${p.locale}/${p.id === 'bot' ? `bot-${p.botId}` : p.id}` }, props: p }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const p = props as SitePage;
  const { locale } = p;
  const japanese = locale === 'ja';
  let input;
  if (p.id === 'bot') {
    const b = getBot(p.botId!)!;
    const op = getOperator(b.operator)?.name ?? '';
    const purpose = b.general ? t(locale, 'purpose.general') : b.kind === 'token' ? t(locale, 'purpose.token') : t(locale, `purpose.${b.purpose}`);
    const colors = { yes: '#2d6a3d', no: '#b0251b', partial: '#8a5a00', unknown: '#4b463e' } as const;
    input = {
      kicker: `${op} · ${purpose}`,
      title: b.name,
      lead: getBotTexts(locale)[b.id]?.summary ?? b.summary,
      stamp: { text: t(locale, `compliance.${b.respectsRobots}`), color: colors[b.respectsRobots] },
      footer: `${t(locale, 'nav.bots')} · ${formatDate(b.lastVerified, locale)}`,
      japanese,
    };
  } else {
    const fm = getPage(locale, p.id as PageId)!.frontmatter;
    input = { kicker: fm.nav ?? '', title: fm.og ?? fm.h1, lead: fm.lead, footer: t(locale, 'common.updated', { date: formatDate(fm.updated, locale) }), japanese };
  }
  const png = await renderOg(input);
  return new Response(new Uint8Array(png), { headers: { 'content-type': 'image/png' } });
};
