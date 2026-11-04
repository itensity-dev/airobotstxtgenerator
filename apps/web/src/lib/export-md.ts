/** Markdown twins of every page (/path.md), also used for llms-full.txt. */
import { getBot, getOperator, communityList, curatedBots, buildServerRules } from '@airobots/core';
import { t } from '../i18n';
import { formatDate, type Locale } from '../i18n/locales';
import { botPath, pathFor, type PageId } from '../i18n/routes';
import { SITE_URL, BRAND } from '../config/site';
import { getBotPagePattern, getBotTexts, getPage, fill } from './content';
import { interpolate } from '../i18n';
import { resolveHref } from './links';
import type { SitePage } from './pages';

function absolutize(md: string, locale: Locale): string {
  return md.replace(/\]\(((?:page|bot):[a-z0-9-]+(?:#[\w-]+)?|\/[^)\s]*)\)/g, (_m, href: string) => `](${SITE_URL}${resolveHref(href, locale)})`);
}

function frontSections(locale: Locale, id: PageId): string {
  const fm = getPage(locale, id)!.frontmatter;
  const out: string[] = [];
  if (fm.steps?.length) {
    out.push(`## ${t(locale, 'common.steps')}`, '', ...fm.steps.map((s, i) => `${i + 1}. ${s}`), '');
  }
  if (fm.capabilities?.length) {
    out.push(`## ${t(locale, 'common.capabilities')}`, '', `| ${t(locale, 'common.capFeature')} | ${t(locale, 'common.capStatus')} | ${t(locale, 'common.capNote')} |`, '|---|---|---|');
    const st = { yes: t(locale, 'common.yes'), no: t(locale, 'common.no'), partly: t(locale, 'common.partly') };
    for (const c of fm.capabilities) out.push(`| ${c.feature} | ${st[c.status]} | ${c.note.replace(/\|/g, '\\|')} |`);
    out.push('');
  }
  return out.join('\n');
}

function faqSection(locale: Locale, faq?: { q: string; a: string }[]): string {
  if (!faq?.length) return '';
  return [`## ${t(locale, 'common.faq')}`, '', ...faq.flatMap((f) => [`### ${f.q}`, '', f.a, ''])].join('\n');
}

function header(title: string, url: string, lead: string, updated: string, locale: Locale): string {
  return [`# ${title}`, '', `> ${lead}`, '', `Source: ${url} · ${t(locale, 'common.updated', { date: formatDate(updated, locale) })} · ${BRAND}`, ''].join('\n');
}

function botMarkdown(locale: Locale, botId: string): string {
  const bot = getBot(botId)!;
  const op = getOperator(bot.operator);
  const texts = getBotTexts(locale)[bot.id] ?? {};
  const en = getBotTexts('en')[bot.id] ?? { details: '' };
  const summary = texts.summary ?? bot.summary;
  const pattern = getBotPagePattern(locale) ?? getBotPagePattern('en')!;
  const url = SITE_URL + botPath(locale, bot.id);
  const purpose = bot.general ? t(locale, 'purpose.general') : bot.kind === 'token' ? t(locale, 'purpose.token') : t(locale, `purpose.${bot.purpose}`);
  const rows: [string, string][] = [
    [t(locale, 'bots.record.token'), `\`${bot.token}\``],
    [t(locale, 'bots.record.ua'), bot.kind === 'token' ? t(locale, 'bots.tokenOnly', { name: bot.name }) : bot.userAgent ? `\`${bot.userAgent}\`` : '—'],
    [t(locale, 'bots.record.operator'), op ? `[${op.name}](${op.url})` : '—'],
    [t(locale, 'bots.record.purpose'), purpose],
    [t(locale, 'bots.record.robots'), `${t(locale, `compliance.${bot.respectsRobots}`)}. ${texts.respectsNote ?? bot.respectsNote ?? ''}`.trim()],
    [t(locale, 'bots.record.verify'), t(locale, `verification.${bot.verification}`) + (bot.verifyHosts ? ` (${bot.verifyHosts.join(', ')})` : '')],
    [t(locale, 'bots.record.ip'), bot.ipRanges ?? t(locale, 'bots.noDocs')],
    [t(locale, 'bots.record.docs'), bot.docs ?? t(locale, 'bots.noDocs')],
    [t(locale, 'bots.record.checked'), `${bot.lastVerified} (${t(locale, `bots.method.${bot.checkMethod}`)})`],
  ];
  const out = [
    header(interpolate(pattern.h1, { name: bot.name, operator: op?.name ?? '', summary }), url, summary, bot.lastVerified, locale),
    ...rows.map(([k, v]) => `- **${k}:** ${v}`),
    '',
    texts.details ?? en.details,
    '',
  ];
  const note = texts.note ?? bot.note;
  if (note) out.push(`> ${note}`, '');
  out.push(`## ${t(locale, 'bots.blockTitle', { name: bot.name })}`, '', '```', `User-agent: ${bot.token}`, 'Disallow: /', '```', '');
  if (bot.uaMatch.length) {
    out.push(`## ${t(locale, 'bots.serverTitle', { name: bot.name })}`, '', '```nginx', buildServerRules('nginx', [bot]).code.trim(), '```', '', '```apache', buildServerRules('apache', [bot]).code.trim(), '```', '');
  }
  if (bot.history?.length) {
    out.push(`## ${t(locale, 'bots.historyTitle')}`, '', ...bot.history.map((h, i) => `- ${h.date}: ${texts.history?.[String(i)] ?? h.text}`), '');
  }
  return absolutize(out.join('\n'), locale);
}

function botsTable(locale: Locale): string {
  const lines = [`| ${t(locale, 'bots.colName')} | ${t(locale, 'bots.colOperator')} | ${t(locale, 'bots.colPurpose')} | ${t(locale, 'bots.colRobots')} | ${t(locale, 'bots.colChecked')} |`, '|---|---|---|---|---|'];
  for (const b of curatedBots) {
    const name = b.page ? `[${b.token}](${SITE_URL}${botPath(locale, b.id)}.md)` : `\`${b.token}\``;
    const purpose = b.general ? t(locale, 'purpose.general') : b.kind === 'token' ? t(locale, 'purpose.token') : t(locale, `purpose.${b.purpose}`);
    lines.push(`| ${name} | ${getOperator(b.operator)?.name ?? ''} | ${purpose} | ${t(locale, `compliance.${b.respectsRobots}`)} | ${b.lastVerified} |`);
  }
  lines.push('', `${t(locale, 'bots.community')}: ${communityList.bots.map((b) => '`' + b.token + '`').join(', ')}`, '');
  return lines.join('\n');
}

export async function pageMarkdown(page: SitePage): Promise<string> {
  const { locale } = page;
  if (page.id === 'bot') return botMarkdown(locale, page.botId!);
  const id = page.id as PageId;
  const mod = getPage(locale, id)!;
  const fm = mod.frontmatter;
  const url = SITE_URL + pathFor(locale, id);
  const parts = [header(fm.h1, url, fm.lead, fm.updated, locale)];
  if (id === 'bots') parts.push(botsTable(locale));
  parts.push(frontSections(locale, id));
  parts.push(fill(mod.rawContent()).trim(), '');
  parts.push(faqSection(locale, fm.faq));
  return absolutize(parts.filter(Boolean).join('\n'), locale).replace(/\n{3,}/g, '\n\n');
}
