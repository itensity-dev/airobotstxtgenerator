/**
 * "Add to my robots.txt": append an AI section to an existing file without changing
 * how the existing rules apply to the user-agents that already had them.
 */
import { diffLines, type DiffLine } from './diff.js';
import {
  generateRobotsTxt,
  samplePath,
  verifyPolicy,
  crawlerToken,
  decideAccess,
  type Access,
  type GeneratorOptions,
  type GeneratorResult,
  type PolicyCheck,
} from './generator.js';
import { matchUrl } from './matcher.js';
import { parseRobots, type ParsedRobots } from './parser.js';
import type { Bot } from './types.js';

export interface MergeOptions extends Omit<GeneratorOptions, 'includeGlobalGroup' | 'globalRulesToRepeat' | 'globalDisallow' | 'sitemaps'> {
  /**
   * What to do with AI bots that already have their own group in the file:
   * `keep` leaves them as they are, `replace` removes their User-agent lines so the new
   * AI section decides for them.
   */
  existingBots?: 'keep' | 'replace';
}

export interface MergeConflict {
  bot: string;
  token: string;
  /** Lines of the existing groups naming this bot. */
  lines: number[];
  action: 'kept' | 'replaced';
}

export interface EquivalenceMismatch {
  agent: string;
  path: string;
  before: boolean;
  after: boolean;
}

export interface EquivalenceReport {
  agents: string[];
  paths: string[];
  comparisons: number;
  mismatches: EquivalenceMismatch[];
  ok: boolean;
}

export interface MergeResult {
  text: string;
  diff: DiffLine[];
  section: GeneratorResult;
  conflicts: MergeConflict[];
  equivalence: EquivalenceReport;
  checks: PolicyCheck[];
  ok: boolean;
}

/** Concrete sample paths derived from every pattern in a file. */
export function samplePathsFor(parsed: ParsedRobots, extra: string[] = []): string[] {
  const out = new Set<string>(['/', '/index.html', '/a', '/random/path?query=1']);
  for (const g of parsed.groups) {
    for (const r of g.rules) {
      if (!r.pattern) continue;
      const s = samplePath(r.pattern);
      out.add(s);
      out.add(s + (s.endsWith('/') ? 'x' : '/x'));
      out.add(s + '.html');
      if (s.length > 1) out.add(s.slice(0, -1));
    }
  }
  for (const e of extra) out.add(samplePath(e));
  return [...out];
}

/** Compare allow/deny decisions of two files for the given agents and paths. */
export function compareBehaviour(
  before: string,
  after: string,
  agents: string[],
  paths: string[],
): EquivalenceReport {
  const mismatches: EquivalenceMismatch[] = [];
  let comparisons = 0;
  for (const agent of agents) {
    for (const path of paths) {
      comparisons++;
      const a = matchUrl(before, agent, path).allowed;
      const b = matchUrl(after, agent, path).allowed;
      if (a !== b) mismatches.push({ agent, path, before: a, after: b });
    }
  }
  return { agents, paths, comparisons, mismatches, ok: mismatches.length === 0 };
}

/** Agent used to represent "any crawler not named in the file". */
export const UNNAMED_AGENT = 'SomeOtherCrawler';

export function mergeIntoExisting(existing: string, bots: Bot[], options: MergeOptions): MergeResult {
  const strategy = options.existingBots ?? 'keep';
  const parsed = parseRobots(existing);
  const eol = /\r\n/.test(existing) ? '\r\n' : '\n';
  const lines = existing.replace(/^﻿/, '').split(/\r\n|\r|\n/);
  if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();

  // Bots already named in the file.
  const named = new Map<string, number[]>();
  for (const g of parsed.groups) {
    for (const ua of g.userAgents) {
      if (ua.isGlobal) continue;
      const key = ua.token.toLowerCase();
      named.set(key, [...(named.get(key) ?? []), ua.line]);
    }
  }
  const conflicts: MergeConflict[] = [];
  const targetBots: Bot[] = [];
  const removeLines = new Set<number>();
  for (const b of bots) {
    const key = crawlerToken(b.token).toLowerCase();
    const at = named.get(key);
    if (!at) {
      targetBots.push(b);
      continue;
    }
    if (strategy === 'keep') {
      conflicts.push({ bot: b.id, token: b.token, lines: at, action: 'kept' });
    } else {
      conflicts.push({ bot: b.id, token: b.token, lines: at, action: 'replaced' });
      targetBots.push(b);
      for (const l of at) removeLines.add(l);
    }
  }

  // Replacing: drop User-agent lines; if a group loses all of them, drop the group's lines.
  if (removeLines.size > 0) {
    for (const g of parsed.groups) {
      const remaining = g.userAgents.filter((u) => !removeLines.has(u.line));
      if (remaining.length === 0) {
        for (let l = g.startLine; l <= g.endLine; l++) {
          const raw = lines[l - 1] ?? '';
          if (raw.trim() !== '' && !raw.trim().startsWith('#')) removeLines.add(l);
        }
      }
    }
  }
  const kept = lines.filter((_, i) => !removeLines.has(i + 1));

  // Rules of the existing `*` groups: repeated in AI groups that must restrict allowed bots.
  const globalRules = parsed.groups
    .filter((g) => g.userAgents.some((u) => u.isGlobal))
    .flatMap((g) => g.rules.map((r) => ({ type: r.type, pattern: r.rawPattern })));

  const section = generateRobotsTxt(targetBots, {
    ...options,
    includeGlobalGroup: false,
    globalRulesToRepeat: globalRules,
  });

  // If the file ends with User-agent lines without rules, our first User-agent line would join
  // that group. An empty Disallow closes it without changing its meaning.
  const keptParsed = parseRobots(kept.join('\n'));
  let lastDirective: string | undefined;
  for (const l of keptParsed.lines) if (l.kind === 'directive') lastDirective = l.type;
  const out = [...kept];
  while (out.length > 0 && out[out.length - 1]!.trim() === '') out.pop();
  if (lastDirective === 'user-agent') {
    out.push('Disallow:' + (options.comments === false ? '' : ' # closes the group above'));
  }
  if (out.length > 0) out.push('');
  const sectionLines = section.text.replace(/\n$/, '').split('\n');
  if (options.comments !== false) {
    out.push('# --- AI crawlers (added by airobotstxtgenerator.com) ---');
  }
  out.push(...sectionLines.filter((l, i) => !(i === 0 && l.startsWith('# robots.txt'))));
  const text = out.join(eol) + eol;

  // Behaviour for previously named agents (except replaced ones) and for unnamed agents.
  const previousAgents = new Set<string>();
  for (const g of parsed.groups) {
    for (const u of g.userAgents) {
      if (u.isGlobal || u.token === '') continue;
      if (removeLines.has(u.line)) continue;
      if (targetBots.some((b) => crawlerToken(b.token).toLowerCase() === u.token.toLowerCase())) continue;
      previousAgents.add(u.token);
    }
  }
  const agents = [...previousAgents, UNNAMED_AGENT, 'Googlebot', 'Bingbot'].filter(
    (a, i, arr) => arr.findIndex((x) => x.toLowerCase() === a.toLowerCase()) === i &&
      !targetBots.some((b) => crawlerToken(b.token).toLowerCase() === a.toLowerCase()),
  );
  const exceptionPaths = (options.exceptions ?? []).map((e) => e.path);
  const equivalence = compareBehaviour(existing, text, agents, samplePathsFor(parsed, exceptionPaths));

  const access = new Map<string, Access>();
  for (const b of targetBots) access.set(b.id, decideAccess(b, options.goal, options.custom));
  const checks = verifyPolicy(text, targetBots, {
    access,
    exceptions: options.exceptions ?? [],
    globalRules,
  });
  return {
    text,
    diff: diffLines(existing.replace(/^﻿/, ''), text),
    section,
    conflicts,
    equivalence,
    checks,
    ok: equivalence.ok && checks.every((c) => c.ok),
  };
}
