/** What a crawler or agent does with the pages it fetches. */
export type BotPurpose =
  /** Collects content to train AI models. */
  | 'training'
  /** Indexes content so an AI search product can cite and link it. */
  | 'search'
  /** Fetches a page because a user asked an assistant or agent to. */
  | 'user'
  /** Several purposes at once (for example search and training). */
  | 'mixed'
  | 'unknown';

export type RobotsCompliance = 'yes' | 'no' | 'partial' | 'unknown';

export type VerificationMethod = 'ip-list' | 'reverse-dns' | 'web-bot-auth' | 'none';

export interface BotOperator {
  id: string;
  name: string;
  url: string;
}

export interface BotHistoryEntry {
  /** YYYY, YYYY-MM or YYYY-MM-DD — only as precise as the source. */
  date: string;
  text: string;
  source?: string;
}

export interface Bot {
  /** Stable lowercase slug, used in URLs: /bots/{id}. */
  id: string;
  /** Name as written by the operator. */
  name: string;
  /** Product token to use in `User-agent:` lines. */
  token: string;
  /**
   * Case-insensitive substrings that identify the bot in the HTTP User-Agent header.
   * Empty for robots.txt-only tokens (Google-Extended, Applebot-Extended).
   */
  uaMatch: string[];
  /** A full User-Agent string as documented by the operator. */
  userAgent?: string;
  /** Operator id from the registry's operator list, or `unknown` for community entries. */
  operator: string;
  /** Operator name as given by the source, for entries without an operator id. */
  operatorName?: string;
  operatorUrl?: string;
  purpose: BotPurpose;
  /**
   * `crawler`: sends requests with its own User-Agent.
   * `token`: robots.txt-only control token; the fetching is done by another crawler
   * (Google-Extended, Applebot-Extended).
   */
  kind: 'crawler' | 'token';
  /**
   * General-purpose crawler that is not AI-specific (Googlebot, Bingbot, Applebot, link-preview
   * fetchers). AI presets never block it; only an explicit custom choice does.
   */
  general?: boolean;
  /** No longer documented by the operator, kept because old robots.txt files still use it. */
  legacy?: boolean;
  respectsRobots: RobotsCompliance;
  /** Short English paraphrase of the operator's statement about robots.txt. */
  respectsNote?: string;
  /** Official list of IP ranges, if published. */
  ipRanges?: string;
  /** `json`: Google-style {prefixes:[{ipv4Prefix|ipv6Prefix}]}; `html`: a web page. */
  ipRangesFormat?: 'json' | 'html';
  verification: VerificationMethod;
  /** Hostname suffixes for reverse-DNS verification. */
  verifyHosts?: string[];
  /** Primary source (operator documentation). */
  docs?: string;
  /** ISO date when the entry was last checked against the primary source. */
  lastVerified: string;
  /**
   * How the last check was done: `fetched` = the operator page was opened; `search-index` = the
   * operator page's text was read through a search index; `secondary` = no operator page exists.
   */
  checkMethod: 'fetched' | 'search-index' | 'secondary';
  /**
   * `official`: operator documentation; `observed`: the operator publishes nothing, data comes from
   * independent observations; `ai.robots.txt`: imported from the community list.
   */
  source: 'official' | 'observed' | 'ai.robots.txt';
  /** Whether the site publishes a dedicated page for this bot. */
  page: boolean;
  /** One-sentence English summary. */
  summary: string;
  /** Important caveat in English (e.g. "Blocking it does not affect Google Search"). */
  note?: string;
  history?: BotHistoryEntry[];
  related?: string[];
  /** Name of the entry in the ai.robots.txt list, if different from `name`. */
  aiRobotsTxtKey?: string | null;
}

export interface CommunityBotList {
  updated: string;
  source: string;
  license: string;
  /** Upstream commit the list was built from, if known. */
  commit?: string;
  bots: Bot[];
}

export interface BotRegistry {
  updated: string;
  license: string;
  sources: { name: string; url: string; license?: string }[];
  operators: BotOperator[];
  bots: Bot[];
}
