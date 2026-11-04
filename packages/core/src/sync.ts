/**
 * Import of the community list maintained by the ai.robots.txt project
 * (https://github.com/ai-robots-txt/ai.robots.txt, MIT License).
 * The upstream format is a JSON object: { "<agent name>": { operator, respect, function, frequency, description } }.
 */
import { extractUserAgent } from './parser.js';
import type { Bot, BotPurpose, CommunityBotList, RobotsCompliance } from './types.js';

export const AI_ROBOTS_TXT_URL =
  'https://raw.githubusercontent.com/ai-robots-txt/ai.robots.txt/main/robots.json';

export interface UpstreamEntry {
  operator: string;
  respect: string;
  function: string;
  frequency: string;
  description: string;
}

export class UpstreamFormatError extends Error {
  constructor(message: string) {
    super(`ai.robots.txt format changed: ${message}`);
    this.name = 'UpstreamFormatError';
  }
}

const FIELDS: (keyof UpstreamEntry)[] = [
  'operator',
  'respect',
  'function',
  'frequency',
  'description',
];

/** Validate the upstream JSON strictly; any structural change throws UpstreamFormatError. */
export function parseUpstream(json: unknown): Map<string, UpstreamEntry> {
  if (json === null || typeof json !== 'object' || Array.isArray(json)) {
    throw new UpstreamFormatError('expected a JSON object keyed by user-agent name');
  }
  const entries = Object.entries(json as Record<string, unknown>);
  if (entries.length < 20)
    throw new UpstreamFormatError(`only ${entries.length} entries (expected at least 20)`);
  const out = new Map<string, UpstreamEntry>();
  for (const [name, value] of entries) {
    if (name.trim() === '') throw new UpstreamFormatError('empty user-agent name');
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      throw new UpstreamFormatError(`entry "${name}" is not an object`);
    }
    const v = value as Record<string, unknown>;
    for (const f of FIELDS) {
      if (typeof v[f] !== 'string')
        throw new UpstreamFormatError(`entry "${name}" has no string field "${f}"`);
    }
    out.set(name, v as unknown as UpstreamEntry);
  }
  return out;
}

/** "[OpenAI](https://openai.com)" → { name: "OpenAI", url: "https://openai.com" }. */
export function parseMarkdownLink(text: string): { name: string; url?: string } {
  const m = /^\s*\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/.exec(text);
  if (m) return { name: m[1]!.trim(), url: m[2]! };
  return { name: stripMarkdown(text) };
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function mapPurpose(fn: string): BotPurpose {
  const f = fn.toLowerCase();
  if (/search/.test(f)) return 'search';
  if (/assistant|agent|on behalf|user/.test(f)) return 'user';
  if (/train|scrap|dataset|llm|data provider|data collection/.test(f)) return 'training';
  return 'unknown';
}

export function mapRespect(respect: string): RobotsCompliance {
  const r = stripMarkdown(respect).toLowerCase();
  if (r.startsWith('yes')) return 'yes';
  if (r.startsWith('no')) return 'no';
  return 'unknown';
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const UNCLEAR = /^unclear|^no information|^unknown/i;

/** Names that are ordinary words or would match unrelated User-Agents as substrings. */
const GENERIC_NAMES = new Set([
  'code',
  'codex',
  'spider',
  'dot',
  'lcc',
  'muse',
  'cursor',
  'trae',
  'devin',
  'instinct',
  'yak',
  'openai',
  'operator',
  'nbot',
  'opencode',
  'useai',
  'spider',
]);
/** Tokens of general crawlers that a community substring must never match. */
const PROTECTED_AGENTS = [
  'Googlebot',
  'bingbot',
  'Applebot',
  'Amazonbot',
  'Baiduspider',
  'YandexBot',
  'DuckDuckBot',
  'Slurp',
  'facebookexternalhit',
  'Twitterbot',
  'LinkedInBot',
  'Pinterestbot',
  'Slackbot',
  'Discordbot',
  'TelegramBot',
  'WhatsApp',
  'PetalBot',
  'Kagibot',
  'SeznamBot',
  'Qwantbot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
];

/** True if blocking this name by User-Agent substring could hit unrelated traffic. */
export function isAmbiguousUaName(name: string): boolean {
  const n = name.toLowerCase();
  if (n.length < 5 || GENERIC_NAMES.has(n)) return true;
  return PROTECTED_AGENTS.some((a) => a.toLowerCase().includes(n) && a.toLowerCase() !== n);
}

/** Build the community list: every upstream entry not already covered by a curated bot. */
export function buildCommunityList(
  upstream: Map<string, UpstreamEntry>,
  curated: Bot[],
  date: string,
  commit?: string,
): CommunityBotList {
  const covered = new Set<string>();
  for (const b of curated) {
    covered.add(b.token.toLowerCase());
    covered.add(b.name.toLowerCase());
    if (b.aiRobotsTxtKey) covered.add(b.aiRobotsTxtKey.toLowerCase());
  }
  const curatedIds = new Set(curated.map((b) => b.id));
  const seenTokens = new Set<string>();
  const bots: Bot[] = [];
  for (const [name, e] of [...upstream.entries()].sort((a, b) => a[0].localeCompare(b[0], 'en'))) {
    const product = extractUserAgent(name).toLowerCase();
    if (covered.has(name.toLowerCase()) || (product !== '' && covered.has(product))) continue;
    const key = product !== '' && product.length >= 3 ? product : name.toLowerCase();
    if (seenTokens.has(key)) continue;
    seenTokens.add(key);
    let id = slugify(name);
    if (id === '' || curatedIds.has(id)) id = `community-${id || 'agent'}`;
    const op = parseMarkdownLink(e.operator);
    const respectNote = stripMarkdown(e.respect);
    const bot: Bot = {
      id,
      name,
      token: name,
      uaMatch: [],
      operator: 'unknown',
      purpose: mapPurpose(e.function),
      kind: 'crawler',
      respectsRobots: mapRespect(e.respect),
      verification: 'none',
      lastVerified: date,
      checkMethod: 'secondary',
      source: 'ai.robots.txt',
      page: false,
      summary: stripMarkdown(e.description).slice(0, 280),
      aiRobotsTxtKey: name,
    };
    const uaName = product !== '' && product.length >= 4 ? extractUserAgent(name) : name;
    if (isAmbiguousUaName(uaName)) {
      bot.note = 'Generic name: left out of server rules so that unrelated traffic is not blocked.';
    } else {
      bot.uaMatch = [uaName];
    }
    if (!UNCLEAR.test(op.name)) bot.operatorName = op.name;
    if (op.url) bot.operatorUrl = op.url;
    if (!UNCLEAR.test(respectNote) && bot.respectsRobots !== 'unknown')
      bot.respectsNote = respectNote;
    bots.push(bot);
  }
  const list: CommunityBotList = {
    updated: date,
    source: 'https://github.com/ai-robots-txt/ai.robots.txt',
    license: 'MIT License, Copyright (c) 2024 ai.robots.txt',
    bots,
  };
  if (commit) list.commit = commit;
  return list;
}

export interface CommunityDiff {
  added: string[];
  removed: string[];
  changed: string[];
}

export function diffCommunity(
  before: CommunityBotList | null,
  after: CommunityBotList,
): CommunityDiff {
  const old = new Map((before?.bots ?? []).map((b) => [b.name, b] as const));
  const now = new Map(after.bots.map((b) => [b.name, b] as const));
  const added = [...now.keys()].filter((k) => !old.has(k));
  const removed = [...old.keys()].filter((k) => !now.has(k));
  const changed = [...now.keys()].filter((k) => {
    const a = old.get(k);
    const b = now.get(k)!;
    if (!a) return false;
    const strip = (x: Bot) => JSON.stringify({ ...x, lastVerified: '' });
    return strip(a) !== strip(b);
  });
  return { added, removed, changed };
}
