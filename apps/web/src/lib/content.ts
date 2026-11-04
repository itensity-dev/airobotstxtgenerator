import type { MarkdownInstance } from 'astro';
import type { Locale } from '../i18n/locales';
import type { PageId } from '../i18n/routes';

export interface Capability {
  feature: string;
  status: 'yes' | 'no' | 'partly';
  note: string;
}

export interface PageFrontmatter {
  /** <title> — matches the search query in this language. */
  title: string;
  /** Meta description: a concrete answer, not an advert. */
  description: string;
  h1: string;
  /** Short label for navigation and footers. */
  nav?: string;
  /** One sentence: what the page/tool does. */
  lead: string;
  steps?: string[];
  capabilities?: Capability[];
  faq?: { q: string; a: string }[];
  related?: PageId[];
  updated: string;
  /** Text for the OG image if different from h1. */
  og?: string;
}

export type PageModule = MarkdownInstance<PageFrontmatter>;

const pages = import.meta.glob<PageModule>('../content/*/*.md', { eager: true });

export function getPage(locale: Locale, id: PageId): PageModule | undefined {
  return pages[`../content/${locale}/${id}.md`];
}

export function hasPage(locale: Locale, id: PageId): boolean {
  return getPage(locale, id) !== undefined;
}

export interface BotText {
  /** What the agent is and does (2–4 sentences, unique per bot). */
  details: string;
  summary?: string;
  respectsNote?: string;
  note?: string;
  history?: Record<string, string>;
  /** Optional overrides for title/description of the bot page. */
  title?: string;
  description?: string;
}

const botTexts = import.meta.glob<{ default: Record<string, BotText> }>('../content/*/bots.json', { eager: true });

export function getBotTexts(locale: Locale): Record<string, BotText> {
  return botTexts[`../content/${locale}/bots.json`]?.default ?? {};
}

export interface BotPageStrings {
  title: string;
  description: string;
  h1: string;
}

const botPageStrings = import.meta.glob<{ default: { pattern: BotPageStrings } }>('../content/*/bot-page.json', { eager: true });

export function getBotPagePattern(locale: Locale): BotPageStrings | undefined {
  return botPageStrings[`../content/${locale}/bot-page.json`]?.default.pattern;
}
