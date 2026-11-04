/**
 * robots.txt generator for AI crawlers.
 *
 * Builds a file from a policy (goal + per-bot choices + path exceptions) and verifies the
 * result with the RFC 9309 matcher, so every generated file is checked before it is shown.
 */
import { matchUrl } from './matcher.js';
import { parseLines } from './parser.js';
import type { Bot, BotPurpose } from './types.js';

export type SiteType = 'blog' | 'news' | 'shop' | 'docs' | 'saas' | 'other';
export type Goal = 'block-training' | 'block-all-ai' | 'allow-all' | 'custom';
export type Access = 'allow' | 'block';

export interface PathException {
  /** Path prefix or pattern, e.g. `/blog/` or `/*.pdf$`. */
  path: string;
  /** `allow` = open to every AI bot (even blocked ones); `block` = closed to every AI bot. */
  access: Access;
}

export interface ContentSignals {
  search?: 'yes' | 'no';
  'ai-input'?: 'yes' | 'no';
  'ai-train'?: 'yes' | 'no';
}

export interface GeneratorOptions {
  goal: Goal;
  siteType?: SiteType;
  /** Per-bot decisions for the `custom` goal (bot id → access). Unlisted bots are allowed. */
  custom?: Record<string, Access>;
  /** Path exceptions that apply to AI bots only. */
  exceptions?: PathException[];
  /** Rules for every crawler (`User-agent: *`). */
  globalDisallow?: string[];
  sitemaps?: string[];
  contentSignals?: ContentSignals | null;
  /** Add `#` comments to the file. Default true. */
  comments?: boolean;
  /** Date written in the header comment (YYYY-MM-DD). */
  date?: string;
  /** Emit the `User-agent: *` group. Default true; the merge mode turns it off. */
  includeGlobalGroup?: boolean;
  /**
   * Rules of the `*` group to repeat inside AI groups that need their own group
   * (a crawler obeys only its most specific group). Defaults to `globalDisallow`.
   */
  globalRulesToRepeat?: { type: 'allow' | 'disallow'; pattern: string }[];
  /** Header line naming the tool. */
  generatorName?: string;
}

/** Why a line is in the file — rendered as a localised explanation in the UI. */
export type LineNote =
  | 'header'
  | 'policy'
  | 'section'
  | 'user-agent'
  | 'user-agent-token'
  | 'disallow-all'
  | 'allow-exception'
  | 'block-exception'
  | 'repeat-global'
  | 'global-group'
  | 'global-disallow'
  | 'allow-everything'
  | 'content-signal'
  | 'sitemap'
  | 'blank'
  | 'separator';

export interface GeneratedLine {
  text: string;
  note: LineNote;
  /** Bot id for user-agent lines, path for rules. */
  ref?: string;
}

export interface PolicyCheck {
  bot: string;
  token: string;
  path: string;
  expected: boolean;
  actual: boolean;
  ok: boolean;
}

export interface GeneratorResult {
  text: string;
  lines: GeneratedLine[];
  /** Bot ids that end up blocked from `/`. */
  blocked: string[];
  allowed: string[];
  /** Blocked bots that power AI search or user-requested fetches (losing visibility). */
  blockedVisibility: string[];
  /** Blocked bots that state they do not follow robots.txt. */
  blockedNonCompliant: string[];
  checks: PolicyCheck[];
  ok: boolean;
}

export interface SiteTypePreset {
  goal: Goal;
  globalDisallow: string[];
  exceptions: PathException[];
}

/** Starting points for the wizard; every value can be edited by the user. */
export const SITE_TYPE_PRESETS: Record<SiteType, SiteTypePreset> = {
  blog: { goal: 'block-training', globalDisallow: [], exceptions: [] },
  news: {
    goal: 'block-training',
    globalDisallow: [],
    exceptions: [{ path: '/premium/', access: 'block' }],
  },
  shop: {
    goal: 'block-training',
    globalDisallow: ['/cart/', '/checkout/', '/account/'],
    exceptions: [],
  },
  docs: { goal: 'allow-all', globalDisallow: [], exceptions: [] },
  saas: { goal: 'block-training', globalDisallow: ['/app/', '/api/'], exceptions: [] },
  other: { goal: 'block-training', globalDisallow: [], exceptions: [] },
};

const TRAINING_PURPOSES: BotPurpose[] = ['training', 'mixed'];

/** Decide allow/block for one bot under a goal. */
export function decideAccess(bot: Bot, goal: Goal, custom: Record<string, Access> = {}): Access {
  if (bot.general) return goal === 'custom' ? (custom[bot.id] ?? 'allow') : 'allow';
  switch (goal) {
    case 'block-training':
      return TRAINING_PURPOSES.includes(bot.purpose) ? 'block' : 'allow';
    case 'block-all-ai':
      return 'block';
    case 'allow-all':
      return 'allow';
    case 'custom':
      return custom[bot.id] ?? 'allow';
  }
}

type Section = BotPurpose | 'token' | 'general';
const SECTION_TITLES: Record<Section, string> = {
  training: 'AI training crawlers',
  token: 'AI usage controls (robots.txt tokens, not separate crawlers)',
  mixed: 'Crawlers used for both AI training and other products',
  search: 'AI search crawlers',
  user: 'AI assistants fetching pages on behalf of a user',
  unknown: 'Other AI crawlers',
  general: 'General-purpose crawlers',
};

const SECTION_ORDER: Section[] = [
  'training',
  'token',
  'mixed',
  'unknown',
  'search',
  'user',
  'general',
];

function sectionOf(b: Bot): Section {
  if (b.general) return 'general';
  return b.kind === 'token' ? 'token' : b.purpose;
}

interface Rule {
  type: 'allow' | 'disallow';
  pattern: string;
  note: LineNote;
}

function isUnder(path: string, prefix: string): boolean {
  return path.length > prefix.length && path.startsWith(prefix);
}

function normalizePath(p: string): string {
  const t = p.trim();
  if (t === '') return t;
  return t.startsWith('/') || t.startsWith('*') ? t : '/' + t;
}

/** Turn a pattern into a concrete sample path for verification. */
export function samplePath(pattern: string): string {
  let p = pattern.endsWith('$') ? pattern.slice(0, -1) : pattern;
  p = p.replace(/\*/g, 'x');
  if (!p.startsWith('/')) p = '/' + p;
  return p;
}

/** Longest-match decision on a simple rule list (used to compute the intended policy). */
function intended(rules: Rule[], path: string): boolean {
  let best: Rule | null = null;
  let bestLen = -1;
  for (const r of rules) {
    if (r.pattern === '') continue;
    if (matchUrl(`user-agent: x\n${r.type}: ${r.pattern}\n`, 'x', path).decidingRule) {
      const len = r.pattern.length;
      if (len > bestLen || (len === bestLen && r.type === 'allow')) {
        best = r;
        bestLen = len;
      }
    }
  }
  return !best || best.type === 'allow';
}

export function generateRobotsTxt(bots: Bot[], options: GeneratorOptions): GeneratorResult {
  const comments = options.comments !== false;
  const includeGlobal = options.includeGlobalGroup !== false;
  const exceptions = (options.exceptions ?? [])
    .map((e) => ({ ...e, path: normalizePath(e.path) }))
    .filter((e) => e.path !== '' && e.path !== '/');
  const globalDisallow = (options.globalDisallow ?? []).map(normalizePath).filter((p) => p !== '');
  const repeat =
    options.globalRulesToRepeat ??
    globalDisallow.map((pattern) => ({ type: 'disallow' as const, pattern }));
  const allowEx = exceptions.filter((e) => e.access === 'allow');
  const blockEx = exceptions.filter((e) => e.access === 'block');

  const access = new Map<string, Access>();
  for (const b of bots) access.set(b.id, decideAccess(b, options.goal, options.custom));

  // Rules for blocked bots: everything closed, AI-open exceptions reopened, nested closures kept.
  const blockedRules: Rule[] = [{ type: 'disallow', pattern: '/', note: 'disallow-all' }];
  for (const a of allowEx)
    blockedRules.push({ type: 'allow', pattern: a.path, note: 'allow-exception' });
  for (const b of blockEx) {
    if (allowEx.some((a) => isUnder(b.path, a.path))) {
      blockedRules.push({ type: 'disallow', pattern: b.path, note: 'block-exception' });
    }
  }
  for (const r of repeat) {
    if (r.type === 'disallow' && allowEx.some((a) => isUnder(r.pattern, a.path))) {
      blockedRules.push({ type: 'disallow', pattern: r.pattern, note: 'repeat-global' });
    }
  }

  // Rules for allowed AI bots: they need their own group only if some paths are closed to AI.
  const allowedRules: Rule[] = [];
  if (blockEx.length > 0) {
    for (const r of repeat)
      allowedRules.push({ type: r.type, pattern: r.pattern, note: 'repeat-global' });
    for (const b of blockEx)
      allowedRules.push({ type: 'disallow', pattern: b.path, note: 'block-exception' });
    for (const a of allowEx) {
      if (blockEx.some((b) => isUnder(a.path, b.path))) {
        allowedRules.push({ type: 'allow', pattern: a.path, note: 'allow-exception' });
      }
    }
  }

  const lines: GeneratedLine[] = [];
  const push = (text: string, note: LineNote, ref?: string) =>
    lines.push(ref === undefined ? { text, note } : { text, note, ref });

  if (comments) {
    push(
      `# robots.txt — ${options.generatorName ?? 'generated with airobotstxtgenerator.com'}${options.date ? ` on ${options.date}` : ''}`,
      'header',
    );
    const policy: Record<Goal, string> = {
      'block-training': 'Policy: no AI training; AI search and user-requested fetches allowed.',
      'block-all-ai': 'Policy: no AI crawlers or AI agents; regular search engines allowed.',
      'allow-all': 'Policy: all crawlers allowed, including AI crawlers.',
      custom: 'Policy: custom choice per AI crawler.',
    };
    push(`# ${policy[options.goal]}`, 'policy');
    push(
      '# robots.txt is a request, not access control: see server rules for enforcement.',
      'policy',
    );
    push('', 'blank');
  }

  const blockedIds: string[] = [];
  const allowedIds: string[] = [];
  for (const b of bots) (access.get(b.id) === 'block' ? blockedIds : allowedIds).push(b.id);

  const emitGroup = (members: Bot[], rules: Rule[], title: string) => {
    if (members.length === 0 || rules.length === 0) return;
    if (comments) push(`# ${title}`, 'section');
    const seen = new Set<string>();
    for (const m of members) {
      const key = m.token.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      push(`User-agent: ${m.token}`, m.kind === 'token' ? 'user-agent-token' : 'user-agent', m.id);
    }
    for (const r of rules) {
      push(`${r.type === 'allow' ? 'Allow' : 'Disallow'}: ${r.pattern}`, r.note, r.pattern);
    }
    push('', 'blank');
  };

  for (const section of SECTION_ORDER) {
    const members = bots.filter((b) => sectionOf(b) === section && access.get(b.id) === 'block');
    emitGroup(members, blockedRules, `${SECTION_TITLES[section]} — blocked`);
  }
  if (allowedRules.length > 0) {
    const members = bots.filter((b) => access.get(b.id) === 'allow' && !b.general);
    emitGroup(
      members,
      allowedRules,
      'AI crawlers allowed except for AI-restricted paths (they ignore the * group once named)',
    );
  }

  if (includeGlobal) {
    if (comments) push('# All other crawlers, including search engines', 'section');
    push('User-agent: *', 'global-group');
    const signals = options.contentSignals;
    if (signals && Object.keys(signals).length > 0) {
      const parts = (['search', 'ai-input', 'ai-train'] as const)
        .filter((k) => signals[k] !== undefined)
        .map((k) => `${k}=${signals[k]}`);
      if (parts.length > 0) push(`Content-Signal: ${parts.join(', ')}`, 'content-signal');
    }
    if (globalDisallow.length === 0) push('Disallow:', 'allow-everything');
    for (const p of globalDisallow) push(`Disallow: ${p}`, 'global-disallow', p);
    push('', 'blank');
  }

  for (const s of options.sitemaps ?? []) {
    if (s.trim() !== '') push(`Sitemap: ${s.trim()}`, 'sitemap', s.trim());
  }
  while (lines.length > 0 && lines[lines.length - 1]!.text === '') lines.pop();
  const text = lines.map((l) => l.text).join('\n') + '\n';

  const blockedVisibility: string[] = [];
  const blockedNonCompliant: string[] = [];
  for (const b of bots) {
    if (access.get(b.id) !== 'block') continue;
    if (b.purpose === 'search' || b.purpose === 'user') blockedVisibility.push(b.id);
    if (b.respectsRobots === 'no') blockedNonCompliant.push(b.id);
  }
  const checks = includeGlobal
    ? verifyPolicy(text, bots, { access, exceptions, globalRules: repeat })
    : [];
  return {
    text,
    lines,
    blocked: blockedIds,
    allowed: allowedIds,
    blockedVisibility,
    blockedNonCompliant,
    checks,
    ok: checks.every((c) => c.ok),
  };
}

export interface PolicySpec {
  access: Map<string, Access>;
  exceptions: PathException[];
  /** Rules every crawler gets from the `*` group. */
  globalRules: { type: 'allow' | 'disallow'; pattern: string }[];
}

/** The product token a crawler sends (`ChatGPT Agent` → `ChatGPT`). */
export function crawlerToken(token: string): string {
  const t = /^[A-Za-z_-]*/.exec(token)?.[0] ?? '';
  return t === '' ? token : t;
}

/**
 * Check a complete robots.txt against the intended policy: for every bot and a set of
 * sample paths, the RFC 9309 matcher must give the same answer as the policy.
 */
export function verifyPolicy(text: string, bots: Bot[], spec: PolicySpec): PolicyCheck[] {
  const parsed = parseLines(text);
  const exceptions = spec.exceptions.map((e) => ({ ...e, path: normalizePath(e.path) }));
  const allowEx = exceptions.filter((e) => e.access === 'allow');
  const blockEx = exceptions.filter((e) => e.access === 'block');
  const paths = new Set<string>(['/', '/some-page']);
  for (const e of exceptions) {
    paths.add(samplePath(e.path));
    paths.add(samplePath(e.path) + 'page');
  }
  for (const g of spec.globalRules) if (g.pattern) paths.add(samplePath(g.pattern));
  const global: Rule[] = spec.globalRules.map((g) => ({ ...g, note: 'repeat-global' as const }));
  const checks: PolicyCheck[] = [];
  const seen = new Set<string>();
  for (const b of bots) {
    const token = crawlerToken(b.token);
    if (seen.has(token.toLowerCase())) continue;
    seen.add(token.toLowerCase());
    const acc = spec.access.get(b.id) ?? 'allow';
    let rules: Rule[];
    if (acc === 'block') {
      rules = [
        ...global.filter(
          (g) => g.type === 'disallow' && allowEx.some((a) => isUnder(g.pattern, a.path)),
        ),
        { type: 'disallow', pattern: '/', note: 'disallow-all' },
        ...allowEx.map((a) => ({
          type: 'allow' as const,
          pattern: a.path,
          note: 'allow-exception' as const,
        })),
        ...blockEx
          .filter((x) => allowEx.some((a) => isUnder(x.path, a.path)))
          .map((x) => ({
            type: 'disallow' as const,
            pattern: x.path,
            note: 'block-exception' as const,
          })),
      ];
    } else if (b.general) {
      rules = global;
    } else {
      rules = [
        ...global,
        ...blockEx.map((x) => ({
          type: 'disallow' as const,
          pattern: x.path,
          note: 'block-exception' as const,
        })),
        ...allowEx
          .filter((a) => blockEx.some((x) => isUnder(a.path, x.path)))
          .map((a) => ({
            type: 'allow' as const,
            pattern: a.path,
            note: 'allow-exception' as const,
          })),
      ];
    }
    for (const path of paths) {
      const expected = intended(rules, path);
      const actual = matchUrl(parsed, token, path).allowed;
      checks.push({ bot: b.id, token: b.token, path, expected, actual, ok: expected === actual });
    }
  }
  return checks;
}
