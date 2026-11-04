/**
 * Matching of URLs against robots.txt rules, ported from Google's reference
 * implementation (RobotsMatcher, LongestMatchRobotsMatchStrategy):
 *
 * - a crawler obeys the groups that name it (all of them, merged); only if none
 *   does, it obeys the `*` groups;
 * - a group that names the crawler but has no rules allows everything;
 * - the longest matching pattern wins; on a tie Allow wins;
 * - `*` matches any sequence of characters, `$` at the end anchors the pattern;
 * - an Allow for `.../index.htm(l)` also allows the directory itself.
 */
import { extractUserAgent, isGlobalUserAgent, parseLines, type ParsedRobotsFile } from './parser.js';

/** Google's GetPathParamsQuery: path, params and query of a URL, without the fragment. */
export function getPathParamsQuery(url: string): string {
  let searchStart = 0;
  if (url.length >= 2 && url[0] === '/' && url[1] === '/') searchStart = 2;
  const firstOf = (chars: string, from: number): number => {
    for (let i = from; i < url.length; i++) if (chars.includes(url[i]!)) return i;
    return -1;
  };
  const earlyPath = firstOf('/?;', searchStart);
  let protocolEnd = url.indexOf('://', searchStart);
  if (earlyPath !== -1 && (protocolEnd === -1 || earlyPath < protocolEnd)) protocolEnd = -1;
  protocolEnd = protocolEnd === -1 ? searchStart : protocolEnd + 3;
  const pathStart = firstOf('/?;', protocolEnd);
  if (pathStart !== -1) {
    const hashPos = url.indexOf('#', searchStart);
    if (hashPos !== -1 && hashPos < pathStart) return '/';
    const pathEnd = hashPos === -1 ? url.length : hashPos;
    const p = url.slice(pathStart, pathEnd);
    return url[pathStart] !== '/' ? '/' + p : p;
  }
  return '/';
}

/** Google's robots.txt pattern matching (`*` wildcard, trailing `$` anchor). */
export function patternMatches(path: string, pattern: string): boolean {
  const pathlen = path.length;
  const pos: number[] = new Array<number>(pathlen + 1);
  pos[0] = 0;
  let numpos = 1;
  for (let p = 0; p < pattern.length; p++) {
    const ch = pattern[p]!;
    if (ch === '$' && p + 1 === pattern.length) {
      return pos[numpos - 1] === pathlen;
    }
    if (ch === '*') {
      numpos = pathlen - pos[0]! + 1;
      for (let i = 1; i < numpos; i++) pos[i] = pos[i - 1]! + 1;
    } else {
      let newnumpos = 0;
      for (let i = 0; i < numpos; i++) {
        const at = pos[i]!;
        if (at < pathlen && path[at] === ch) pos[newnumpos++] = at + 1;
      }
      numpos = newnumpos;
      if (numpos === 0) return false;
    }
  }
  return true;
}

export interface RuleMatch {
  /** Length of the matching pattern (Google's priority); -1 = no match. */
  priority: number;
  line: number;
  pattern: string;
}

const NO_MATCH: RuleMatch = { priority: -1, line: 0, pattern: '' };

export interface MatchResult {
  allowed: boolean;
  /** Which groups decided: the crawler's own groups, the `*` groups, or none at all. */
  via: 'specific' | 'global' | 'none';
  /** The rule that decided, if any. */
  decidingRule: { type: 'allow' | 'disallow'; line: number; pattern: string } | null;
  /** Lines of User-agent entries that selected the applied groups. */
  groupLines: number[];
  /** Best allow / disallow matches in the applied groups (for explanations). */
  bestAllow: RuleMatch | null;
  bestDisallow: RuleMatch | null;
  /** The path that was matched (path + params + query). */
  path: string;
}

/**
 * Decide whether `userAgent` may fetch `url` according to `robots`.
 * `userAgent` must be a product token like `GPTBot` (compared case-insensitively);
 * `url` may be a full URL or a path. The URL is not normalised: pass it percent-encoded,
 * as a crawler would request it.
 */
export function matchUrl(
  robots: string | Uint8Array | ParsedRobotsFile,
  userAgent: string,
  url: string,
): MatchResult {
  const file = typeof robots === 'string' || robots instanceof Uint8Array ? parseLines(robots) : robots;
  const path = getPathParamsQuery(url);
  const agentLower = userAgent.toLowerCase();

  let allowSpecific = NO_MATCH;
  let disallowSpecific = NO_MATCH;
  let allowGlobal = NO_MATCH;
  let disallowGlobal = NO_MATCH;
  let seenGlobal = false;
  let seenSpecific = false;
  let everSeenSpecific = false;
  let seenSeparator = false;
  const specificLines: number[] = [];
  const globalLines: number[] = [];

  const handleRule = (type: 'allow' | 'disallow', line: number, value: string): void => {
    if (!seenGlobal && !seenSpecific) return;
    seenSeparator = true;
    if (patternMatches(path, value)) {
      const m: RuleMatch = { priority: value.length, line, pattern: value };
      if (type === 'allow') {
        if (seenSpecific) {
          if (allowSpecific.priority < m.priority) allowSpecific = m;
        } else if (allowGlobal.priority < m.priority) allowGlobal = m;
      } else if (seenSpecific) {
        if (disallowSpecific.priority < m.priority) disallowSpecific = m;
      } else if (disallowGlobal.priority < m.priority) disallowGlobal = m;
    } else if (type === 'allow') {
      // Google-specific: an Allow for /dir/index.htm(l) also allows /dir/.
      const slash = value.lastIndexOf('/');
      if (slash !== -1 && value.slice(slash).startsWith('/index.htm')) {
        handleRule('allow', line, value.slice(0, slash + 1) + '$');
      }
    }
  };

  for (const l of file.lines) {
    if (l.kind !== 'directive') continue;
    if (l.type === 'user-agent') {
      if (seenSeparator) {
        seenSpecific = seenGlobal = seenSeparator = false;
      }
      const value = l.rawValue ?? '';
      if (isGlobalUserAgent(value)) {
        seenGlobal = true;
        globalLines.push(l.line);
      } else if (extractUserAgent(value).toLowerCase() === agentLower) {
        everSeenSpecific = seenSpecific = true;
        specificLines.push(l.line);
      }
    } else if (l.type === 'allow' || l.type === 'disallow') {
      handleRule(l.type, l.line, l.value ?? '');
    }
  }

  const decide = (allow: RuleMatch, disallow: RuleMatch): MatchResult['decidingRule'] => {
    if (disallow.priority > allow.priority) {
      return { type: 'disallow', line: disallow.line, pattern: disallow.pattern };
    }
    return allow.priority > 0 ? { type: 'allow', line: allow.line, pattern: allow.pattern } : null;
  };

  if (allowSpecific.priority > 0 || disallowSpecific.priority > 0) {
    return {
      allowed: !(disallowSpecific.priority > allowSpecific.priority),
      via: 'specific',
      decidingRule: decide(allowSpecific, disallowSpecific),
      groupLines: specificLines,
      bestAllow: allowSpecific.priority >= 0 ? allowSpecific : null,
      bestDisallow: disallowSpecific.priority >= 0 ? disallowSpecific : null,
      path,
    };
  }
  if (everSeenSpecific) {
    return {
      allowed: true,
      via: 'specific',
      decidingRule: null,
      groupLines: specificLines,
      bestAllow: allowSpecific.priority >= 0 ? allowSpecific : null,
      bestDisallow: disallowSpecific.priority >= 0 ? disallowSpecific : null,
      path,
    };
  }
  if (disallowGlobal.priority > 0 || allowGlobal.priority > 0) {
    return {
      allowed: !(disallowGlobal.priority > allowGlobal.priority),
      via: 'global',
      decidingRule: decide(allowGlobal, disallowGlobal),
      groupLines: globalLines,
      bestAllow: allowGlobal.priority >= 0 ? allowGlobal : null,
      bestDisallow: disallowGlobal.priority >= 0 ? disallowGlobal : null,
      path,
    };
  }
  return {
    allowed: true,
    via: globalLines.length > 0 ? 'global' : 'none',
    decidingRule: null,
    groupLines: globalLines,
    bestAllow: allowGlobal.priority >= 0 ? allowGlobal : null,
    bestDisallow: disallowGlobal.priority >= 0 ? disallowGlobal : null,
    path,
  };
}

/** Convenience wrapper with the same signature as Google's OneAgentAllowedByRobots. */
export function isAllowed(robots: string | Uint8Array | ParsedRobotsFile, userAgent: string, url: string): boolean {
  return matchUrl(robots, userAgent, url).allowed;
}

/**
 * Normalise a user-entered URL or path the way a crawler would request it:
 * percent-encode non-ASCII characters, keep existing escapes, drop the fragment.
 */
export function normalizeRequestPath(input: string): string {
  const trimmed = input.trim();
  if (trimmed === '') return '/';
  try {
    const u = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)
      ? new URL(trimmed)
      : new URL(trimmed.startsWith('/') ? trimmed : '/' + trimmed, 'https://example.invalid');
    return u.pathname + u.search;
  } catch {
    return getPathParamsQuery(trimmed);
  }
}
