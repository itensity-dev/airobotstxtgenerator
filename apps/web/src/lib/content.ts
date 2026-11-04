import type { MarkdownInstance } from 'astro';
import { communityBots, curatedBots, registry } from '@airobots/core';
import { CONTACT_EMAIL } from '../config/site';
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

/** Numbers that change with the register; content files use {{agents}}, {{all}}, {{community}}, {{updated}}. */
export const PLACEHOLDERS: Record<string, string> = {
  agents: String(curatedBots.filter((b) => !b.legacy).length),
  all: String(curatedBots.length),
  community: String(communityBots.length),
  updated: registry.updated,
  contact: CONTACT_EMAIL,
};

export function fill(s: string): string {
  return s.replace(/\{\{(\w+)\}\}/g, (m, k: string) => PLACEHOLDERS[k] ?? m);
}

function fillDeep<T>(v: T): T {
  if (typeof v === 'string') return fill(v) as T;
  if (Array.isArray(v)) return v.map(fillDeep) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fillDeep(x)])) as T;
  return v;
}

const cache = new Map<string, PageModule>();

export function getPage(locale: Locale, id: PageId): PageModule | undefined {
  const key = `../content/${locale}/${id}.md`;
  const mod = pages[key];
  if (!mod) return undefined;
  let filled = cache.get(key);
  if (!filled) {
    filled = {
      ...mod,
      frontmatter: fillDeep(mod.frontmatter),
      compiledContent: async () => fill(await mod.compiledContent()),
      rawContent: () => fill(mod.rawContent()),
    } as PageModule;
    cache.set(key, filled);
  }
  return filled;
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
