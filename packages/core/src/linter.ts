/**
 * robots.txt linter: syntax problems, rules that do not do what people expect,
 * and AI-crawler specific advice. Messages are English; the web UI localises by `code`.
 */
import { samplePath } from './generator.js';
import { matchUrl } from './matcher.js';
import { GOOGLE_MAX_BYTES, parseRobots, type ParsedRobots, type ParseOptions } from './parser.js';
import type { Bot } from './types.js';

export type LintSeverity = 'error' | 'warning' | 'info';

export type LintCode =
  | 'file-too-large'
  | 'bom'
  | 'invalid-line'
  | 'missing-colon'
  | 'typo-key'
  | 'nonstandard-key'
  | 'unknown-directive'
  | 'crawl-delay'
  | 'noindex-directive'
  | 'host-directive'
  | 'content-signal'
  | 'content-signal-invalid'
  | 'content-usage'
  | 'content-usage-invalid'
  | 'cloudflare-managed'
  | 'rule-before-user-agent'
  | 'empty-user-agent'
  | 'user-agent-version'
  | 'user-agent-invalid'
  | 'unknown-agent'
  | 'pattern-no-leading-slash'
  | 'pattern-full-url'
  | 'dollar-in-middle'
  | 'redundant-wildcard'
  | 'group-without-rules'
  | 'blank-line-does-not-split'
  | 'specific-overrides-global'
  | 'duplicate-group'
  | 'disallow-all-global'
  | 'sitemap-relative'
  | 'line-too-long'
  | 'no-groups'
  | 'ai-search-blocked'
  | 'token-only-agent'
  | 'non-compliant-bot';

export interface LintIssue {
  code: LintCode;
  severity: LintSeverity;
  line?: number;
  /** Values for message templates (agent names, paths, counts). */
  params: Record<string, string | number>;
  message: string;
}

export interface LintOptions extends ParseOptions {
  bots?: Bot[];
}

const CANONICAL: Record<string, string> = {
  'user-agent': 'user-agent',
  allow: 'allow',
  disallow: 'disallow',
  sitemap: 'sitemap',
};

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]!;
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j]!;
      dp[j] = Math.min(dp[j]! + 1, dp[j - 1]! + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[n]!;
}

function squash(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Suggest a known bot token for a misspelt one (`GPT-Bot` → `GPTBot`). */
export function suggestBot(token: string, bots: Bot[]): Bot | undefined {
  const t = squash(token);
  if (t.length < 3) return undefined;
  let best: Bot | undefined;
  let bestScore = Infinity;
  for (const b of bots) {
    const s = squash(b.token);
    if (s === t) return b;
    const d = levenshtein(t, s);
    if (d < bestScore && d <= Math.max(1, Math.floor(s.length / 6))) {
      best = b;
      bestScore = d;
    }
  }
  return best;
}

export function lintRobotsTxt(input: string | Uint8Array, options: LintOptions = {}): LintIssue[] {
  const parsed: ParsedRobots = parseRobots(input, options);
  const bots = options.bots ?? [];
  const issues: LintIssue[] = [];
  const add = (
    code: LintCode,
    severity: LintSeverity,
    message: string,
    line?: number,
    params: Record<string, string | number> = {},
  ) => issues.push(line === undefined ? { code, severity, params, message } : { code, severity, line, params, message });

  if (parsed.byteLength > GOOGLE_MAX_BYTES) {
    add(
      'file-too-large',
      'error',
      `The file is ${parsed.byteLength} bytes. Google reads only the first 500 KiB (512,000 bytes) and ignores the rest.`,
      undefined,
      { bytes: parsed.byteLength },
    );
  }
  const cfBegin = parsed.lines.find((l) => l.kind === 'comment' && /BEGIN\s+Cloudflare\s+Managed/i.test(l.raw));
  if (cfBegin) {
    add('cloudflare-managed', 'info', 'This file contains a block managed by Cloudflare (managed robots.txt / Bot Preference Sync). Cloudflare places it before your own rules and updates it itself.', cfBegin.line);
  }
  if (parsed.hadBom) {
    add('bom', 'info', 'The file starts with a UTF-8 byte order mark. Google skips it, some other parsers may not.');
  }

  const byType = new Map<string, number>();
  for (const l of parsed.lines) {
    if (l.tooLong) {
      add('line-too-long', 'warning', `Line ${l.line} is longer than 16,663 bytes and is cut off.`, l.line);
    }
    if (l.kind === 'invalid') {
      add('invalid-line', 'error', `Line ${l.line} is not a "key: value" directive and is ignored.`, l.line, {
        text: l.raw.trim().slice(0, 80),
      });
      continue;
    }
    if (l.kind !== 'directive') continue;
    byType.set(l.type!, (byType.get(l.type!) ?? 0) + 1);
    const key = l.key ?? '';
    if (l.missingColon) {
      add('missing-colon', 'warning', `Line ${l.line} has no colon after "${key}". Google accepts it; other crawlers may not.`, l.line, { key });
    }
    if (l.isTypo) {
      add(
        'typo-key',
        'warning',
        `"${key}" is a misspelling Google tolerates; other crawlers ignore the line. Write "${l.type === 'user-agent' ? 'User-agent' : l.type === 'disallow' ? 'Disallow' : 'Sitemap'}".`,
        l.line,
        { key, expected: l.type === 'user-agent' ? 'User-agent' : l.type === 'disallow' ? 'Disallow' : 'Sitemap' },
      );
    } else if (l.type !== 'unknown' && CANONICAL[key.toLowerCase()] === undefined) {
      add('nonstandard-key', 'warning', `"${key}" is read as "${l.type}" by Google only because it starts with it. Use the exact key.`, l.line, {
        key,
        expected: l.type!,
      });
    }
    if (l.type === 'unknown') {
      const k = key.toLowerCase();
      const value = l.rawValue ?? '';
      if (k === 'crawl-delay') {
        add('crawl-delay', 'info', 'Crawl-delay is ignored by Google. Bing and Yandex honour it.', l.line, { value });
      } else if (k === 'noindex' || k === 'nofollow') {
        add('noindex-directive', 'warning', `"${key}" in robots.txt is not supported (Google stopped honouring it in 2019). Use a robots meta tag or X-Robots-Tag header.`, l.line, { key });
      } else if (k === 'host' || k === 'clean-param') {
        add('host-directive', 'info', `"${key}" is a Yandex-only directive; other crawlers ignore it.`, l.line, { key });
      } else if (k === 'content-signal') {
        const ok = value
          .split(',')
          .map((p) => p.trim())
          .filter((p) => p !== '')
          .every((p) => /^(search|ai-input|ai-train)\s*=\s*(yes|no)$/i.test(p) || /^use\s*=\s*(immediate|reference|full)$/i.test(p));
        if (ok && value.trim() !== '') {
          add('content-signal', 'info', 'Content-Signal (Cloudflare Content Signals Policy) states how content may be used after it is fetched. It is not a standard; Google has said it has no effect on its crawlers.', l.line, { value });
        } else {
          add('content-signal-invalid', 'warning', 'Content-Signal values must be search, ai-input or ai-train set to yes or no, separated by commas.', l.line, { value });
        }
      } else if (k === 'content-usage') {
        // draft-ietf-aipref-attach: [path-pattern WS] usage-pref, usage-pref = train-ai=n, search=y ...
        const pref = value.replace(/^[/*]\S*\s+/, '');
        const ok = pref
          .split(',')
          .map((p) => p.trim())
          .every((p) => /^[a-z][a-z0-9-]*\s*=\s*[yn]$/.test(p));
        if (ok && pref.trim() !== '') {
          add('content-usage', 'info', 'Content-Usage comes from the IETF AI Preferences (aipref) drafts, which are not an RFC yet; crawler support is not established.', l.line, { value });
        } else {
          add('content-usage-invalid', 'warning', 'Content-Usage expects an optional path followed by preferences such as train-ai=n, search=y (lowercase labels, values y or n).', l.line, { value });
        }
      } else {
        add('unknown-directive', 'info', `"${key}" is not a standard robots.txt directive; most crawlers ignore it.`, l.line, { key });
      }
    }
    if (l.type === 'allow' || l.type === 'disallow') {
      const v = l.rawValue ?? '';
      if (/^https?:\/\//i.test(v)) {
        add('pattern-full-url', 'error', 'Allow/Disallow take a path such as /private/, not a full URL. This rule never matches.', l.line, { pattern: v });
      } else if (v !== '' && !v.startsWith('/') && !v.startsWith('*')) {
        add('pattern-no-leading-slash', 'warning', `"${v}" does not start with / or *, so it never matches a URL path. Did you mean "/${v}"?`, l.line, { pattern: v });
      }
      const dollar = v.indexOf('$');
      if (dollar !== -1 && dollar !== v.length - 1) {
        add('dollar-in-middle', 'warning', '"$" means "end of URL" only as the last character; elsewhere it is matched literally.', l.line, { pattern: v });
      }
      if (v.length > 1 && v.endsWith('*')) {
        add('redundant-wildcard', 'info', 'A trailing "*" is redundant: rules already match by prefix.', l.line, { pattern: v });
      }
    }
    if (l.type === 'sitemap') {
      const v = l.rawValue ?? '';
      if (!/^https?:\/\//i.test(v)) {
        add('sitemap-relative', 'error', 'Sitemap must be a full URL, e.g. https://example.com/sitemap.xml.', l.line, { value: v });
      }
    }
  }

  for (const r of parsed.orphanRules) {
    add('rule-before-user-agent', 'error', `This ${r.type === 'allow' ? 'Allow' : 'Disallow'} line comes before any User-agent line, so no crawler applies it.`, r.line, {
      pattern: r.rawPattern,
    });
  }

  if (parsed.groups.length === 0 && parsed.lines.some((l) => l.kind === 'directive')) {
    add('no-groups', 'warning', 'The file has no User-agent groups, so it allows everything.');
  }

  const knownTokens = new Map(bots.map((b) => [b.token.toLowerCase(), b] as const));
  const agentGroups = new Map<string, number[]>();
  const globalGroups = parsed.groups.filter((g) => g.userAgents.some((u) => u.isGlobal));
  const rawLines = parsed.lines;

  for (const g of parsed.groups) {
    for (let i = 0; i < g.userAgents.length; i++) {
      const ua = g.userAgents[i]!;
      if (ua.value === '') {
        add('empty-user-agent', 'error', 'Empty User-agent value. Use * for all crawlers or a bot name.', ua.line);
        continue;
      }
      // Blank lines between User-agent lines do not start a new group.
      if (i > 0) {
        const prev = g.userAgents[i - 1]!;
        for (let ln = prev.line + 1; ln < ua.line; ln++) {
          if (rawLines[ln - 1]?.kind === 'empty') {
            add('blank-line-does-not-split', 'warning', `The blank line before "User-agent: ${ua.value}" does not start a new group: it shares the rules below with "${prev.value}".`, ua.line, {
              agent: ua.value,
              previous: prev.value,
            });
            break;
          }
        }
      }
      if (ua.isGlobal) continue;
      if (ua.token === '') {
        add('user-agent-invalid', 'warning', `"${ua.value}" does not start with a valid product token (letters, "-" or "_"), so it matches no crawler.`, ua.line, { value: ua.value });
        continue;
      }
      if (ua.token !== ua.value) {
        add('user-agent-version', 'warning', `Only "${ua.token}" of "${ua.value}" is used for matching. Write just the product token.`, ua.line, {
          value: ua.value,
          token: ua.token,
        });
      }
      const key = ua.token.toLowerCase();
      agentGroups.set(key, [...(agentGroups.get(key) ?? []), g.index]);
      const known = knownTokens.get(key) ?? bots.find((b) => b.token.toLowerCase().startsWith(key + ' '));
      if (!known && bots.length > 0) {
        const s = suggestBot(ua.token, bots);
        if (s) {
          add('unknown-agent', 'warning', `"${ua.token}" is not a known crawler token. Did you mean "${s.token}"?`, ua.line, {
            token: ua.token,
            suggestion: s.token,
          });
        }
      }
      if (known?.kind === 'token') {
        add('token-only-agent', 'info', `${known.token} is a control token, not a crawler: it does not affect ${known.operator === 'google' ? 'Google Search' : 'regular search'}.`, ua.line, {
          token: known.token,
        });
      }
    }
    if (g.rules.length === 0) {
      const names = g.userAgents.map((u) => u.value).join(', ');
      add(
        'group-without-rules',
        'warning',
        `The group for ${names} has no Allow or Disallow rules: these crawlers may fetch everything and ignore the * group.`,
        g.startLine,
        { agents: names },
      );
    }
  }

  for (const [agent, groups] of agentGroups) {
    if (groups.length > 1) {
      const lines = groups.map((i) => parsed.groups[i]!.startLine);
      add('duplicate-group', 'info', `"${agent}" appears in ${groups.length} groups (lines ${lines.join(', ')}). Google merges them; some crawlers use only the first.`, lines[1], {
        agent,
        count: groups.length,
        lines: lines.join(', '),
      });
    }
  }

  // A crawler with its own group ignores the * group: report * disallows that no longer apply.
  const globalDisallows = globalGroups.flatMap((g) => g.rules.filter((r) => r.type === 'disallow' && r.pattern !== ''));
  if (globalDisallows.length > 0) {
    for (const [agent, groups] of agentGroups) {
      const firstGroup = parsed.groups[groups[0]!]!;
      if (firstGroup.userAgents.some((u) => u.isGlobal)) continue;
      const display = firstGroup.userAgents.find((u) => u.token.toLowerCase() === agent)?.token ?? agent;
      const lost = globalDisallows.filter((r) => {
        const p = samplePath(r.pattern);
        return !matchUrl(`user-agent: *\ndisallow: ${r.pattern}\n`, 'x', p).allowed && matchUrl(parsed, display, p).allowed;
      });
      if (lost.length > 0) {
        add(
          'specific-overrides-global',
          'warning',
          `${display} has its own group, so ${lost.length} Disallow rule(s) from "User-agent: *" do not apply to it (e.g. ${lost[0]!.rawPattern}). Repeat them in its group if needed.`,
          firstGroup.startLine,
          { agent: display, count: lost.length, example: lost[0]!.rawPattern },
        );
      }
    }
  }

  for (const g of globalGroups) {
    if (g.rules.some((r) => r.type === 'disallow' && r.pattern === '/') && !g.rules.some((r) => r.type === 'allow' && r.pattern.length > 1)) {
      add('disallow-all-global', 'warning', '"User-agent: *" with "Disallow: /" blocks every crawler without its own group, including Google and Bing.', g.startLine);
    }
  }

  // AI-specific advice based on the registry.
  if (bots.length > 0) {
    const blockedSearch: string[] = [];
    const blockedNonCompliant: string[] = [];
    for (const b of bots) {
      if (b.purpose !== 'search' && b.purpose !== 'user' && b.respectsRobots !== 'no') continue;
      const token = /^[A-Za-z_-]+/.exec(b.token)?.[0];
      if (!token || !agentGroups.has(token.toLowerCase())) continue;
      if (matchUrl(parsed, token, '/').allowed) continue;
      if (b.purpose === 'search' || b.purpose === 'user') blockedSearch.push(b.token);
      if (b.respectsRobots === 'no') blockedNonCompliant.push(b.token);
    }
    if (blockedSearch.length > 0) {
      add('ai-search-blocked', 'info', `Blocking ${blockedSearch.join(', ')} removes the site from AI search answers and user-requested fetches by these products.`, undefined, {
        agents: blockedSearch.join(', '),
      });
    }
    if (blockedNonCompliant.length > 0) {
      add('non-compliant-bot', 'info', `${blockedNonCompliant.join(', ')}: reported not to follow robots.txt. Block at the server or CDN as well.`, undefined, {
        agents: blockedNonCompliant.join(', '),
      });
    }
  }

  const order: Record<LintSeverity, number> = { error: 0, warning: 1, info: 2 };
  return issues.sort((a, b) => order[a.severity] - order[b.severity] || (a.line ?? 0) - (b.line ?? 0));
}
