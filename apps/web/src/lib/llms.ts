import { pageBots } from '@airobots/core';
import { t } from '../i18n';
import type { Locale } from '../i18n/locales';
import { botPath, markdownPath, pathFor, type PageId } from '../i18n/routes';
import { SITE_URL, BRAND } from '../config/site';
import { getBotTexts, getPage } from './content';
import { allPages } from './pages';
import { pageMarkdown } from './export-md';

const TOOLS: PageId[] = ['home', 'tester', 'server-rules', 'llms-txt', 'content-signals', 'tdmrep', 'meta-tags'];
const REFERENCE: PageId[] = ['bots', 'server-nginx', 'server-apache', 'server-caddy', 'server-cloudflare', 'server-frameworks'];
const GUIDES: PageId[] = ['guide-training-search', 'guide-syntax', 'guide-eu-ai-act', 'guide-bad-bots'];
const OPTIONAL: PageId[] = ['about', 'checker-bot', 'privacy', 'terms', 'licenses'];

function link(locale: Locale, id: PageId): string | null {
  const p = getPage(locale, id);
  if (!p) return null;
  return `- [${p.frontmatter.h1}](${SITE_URL}${markdownPath(pathFor(locale, id))}): ${p.frontmatter.lead}`;
}

export function llmsTxt(locale: Locale): string {
  const home = getPage(locale, 'home')!.frontmatter;
  const botTexts = getBotTexts(locale);
  const out = [
    `# ${BRAND}`,
    '',
    `> ${home.description}`,
    '',
    `${home.lead} Every page is available as Markdown at the same address plus \`.md\`. The full register is at ${SITE_URL}/bots.json (CC BY 4.0).`,
    '',
    `## ${t(locale, 'footer.tools')}`,
    '',
    ...TOOLS.map((id) => link(locale, id)).filter(Boolean),
    '',
    `## ${t(locale, 'footer.reference')}`,
    '',
    ...REFERENCE.map((id) => link(locale, id)).filter(Boolean),
    '',
    `## ${t(locale, 'nav.bots')}`,
    '',
    ...pageBots()
      .filter((b) => locale === 'en' || botTexts[b.id])
      .map((b) => `- [${b.name}](${SITE_URL}${markdownPath(botPath(locale, b.id))}): ${botTexts[b.id]?.summary ?? b.summary}`),
    '',
    `## ${t(locale, 'footer.guides')}`,
    '',
    ...GUIDES.map((id) => link(locale, id)).filter(Boolean),
    '',
    '## Optional',
    '',
    ...OPTIONAL.map((id) => link(locale, id)).filter(Boolean),
    `- [llms-full.txt](${SITE_URL}${locale === 'en' ? '' : '/' + locale}/llms-full.txt): ${t(locale, 'footer.llms')} — full text`,
    '',
  ];
  return out.join('\n');
}

export async function llmsFullTxt(locale: Locale): Promise<string> {
  const order: (PageId | 'bot')[] = [...TOOLS, ...GUIDES, ...REFERENCE, 'bot', 'about', 'checker-bot'];
  const pages = allPages().filter((p) => p.locale === locale);
  const parts: string[] = [`# ${BRAND} — full text`, '', `> ${getPage(locale, 'home')!.frontmatter.description}`, ''];
  for (const id of order) {
    for (const p of pages.filter((x) => x.id === id)) parts.push((await pageMarkdown(p)).replace(/^# /gm, '## ').replace(/^## (?=\S)/, '# '), '---', '');
  }
  return parts.join('\n');
}
