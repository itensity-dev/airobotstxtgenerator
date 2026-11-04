/**
 * robots.txt parser following RFC 9309 and the behaviour of Google's open-source
 * reference parser (github.com/google/robotstxt, Apache-2.0).
 *
 * The parser is line-oriented and intentionally mirrors Google's tolerance:
 * - a UTF-8 byte order mark at the very start is skipped (even a partial one when bytes are given),
 * - lines end with LF, CR or CRLF,
 * - `#` starts a comment anywhere on a line,
 * - a missing colon is accepted when the line has exactly two whitespace-separated tokens,
 * - frequent typos (`useragent`, `user agent`, `disalow`, `dissallow`, `site-map` ...) are accepted,
 * - keys are matched case-insensitively by prefix (`Disallowed:` counts as `Disallow:`),
 * - lines longer than 16 664 bytes are truncated.
 */

export type KeyType = 'user-agent' | 'allow' | 'disallow' | 'sitemap' | 'unknown';

export interface RobotsLine {
  /** 1-based line number. */
  line: number;
  /** The raw text of the line without its line terminator. */
  raw: string;
  kind: 'directive' | 'empty' | 'comment' | 'invalid';
  /** Key as written (only for directives). */
  key?: string;
  type?: KeyType;
  /** Value as written, whitespace-trimmed (only for directives). */
  rawValue?: string;
  /**
   * Value used for matching. For allow/disallow/unknown keys non-ASCII characters are
   * percent-encoded as UTF-8 and existing %xx escapes are upper-cased — exactly like Google.
   */
  value?: string;
  comment?: string;
  hasComment: boolean;
  /** The key is one of the misspellings Google accepts (e.g. `dissallow`). */
  isTypo: boolean;
  /** The line used whitespace instead of a colon as separator. */
  missingColon: boolean;
  /** The line exceeded the maximum line length and was truncated. */
  tooLong: boolean;
}

export interface ParseOptions {
  /**
   * Ignore everything after this many bytes (UTF-8). Google reads at most 500 KiB
   * (512 000 bytes). Default: no limit.
   */
  maxBytes?: number;
}

export interface ParsedRobotsFile {
  lines: RobotsLine[];
  /** Size of the input in bytes (UTF-8). */
  byteLength: number;
  /** A byte order mark was found and skipped. */
  hadBom: boolean;
  /** The input was cut at `maxBytes`. */
  truncated: boolean;
}

/** Google: kBrowserMaxLineLen (2083) * 8, minus the terminating NUL. */
export const MAX_LINE_BYTES = 2083 * 8 - 1;
/** Google reads at most 500 KiB of a robots.txt file. */
export const GOOGLE_MAX_BYTES = 500 * 1024;

const HEX = '0123456789ABCDEF';
const utf8Encoder = new TextEncoder();

function utf8Length(s: string): number {
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 0x80) n += 1;
    else if (c < 0x800) n += 2;
    else if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) {
      const d = s.charCodeAt(i + 1);
      if (d >= 0xdc00 && d <= 0xdfff) {
        n += 4;
        i++;
      } else n += 3;
    } else n += 3;
  }
  return n;
}

function truncateUtf8(s: string, maxBytes: number): string {
  if (s.length <= maxBytes / 3) return s;
  let n = 0;
  let i = 0;
  for (; i < s.length; i++) {
    const c = s.charCodeAt(i);
    let w = c < 0x80 ? 1 : c < 0x800 ? 2 : 3;
    let step = 1;
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) {
      const d = s.charCodeAt(i + 1);
      if (d >= 0xdc00 && d <= 0xdfff) {
        w = 4;
        step = 2;
      }
    }
    if (n + w > maxBytes) break;
    n += w;
    i += step - 1;
  }
  return s.slice(0, i);
}

function isHex(c: string | undefined): boolean {
  return c !== undefined && /^[0-9a-fA-F]$/.test(c);
}

/**
 * Google's MaybeEscapePattern: upper-case existing %xx escapes and percent-encode
 * every byte outside ASCII (as UTF-8).
 */
export function escapePattern(src: string): string {
  let needs = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]!;
    if (ch === '%' && isHex(src[i + 1]) && isHex(src[i + 2])) {
      if (/[a-f]/.test(src[i + 1]!) || /[a-f]/.test(src[i + 2]!)) needs = true;
      i += 2;
    } else if (src.charCodeAt(i) >= 0x80) {
      needs = true;
    }
  }
  if (!needs) return src;
  let out = '';
  for (let i = 0; i < src.length; i++) {
    const ch = src[i]!;
    if (ch === '%' && isHex(src[i + 1]) && isHex(src[i + 2])) {
      out += '%' + src[i + 1]!.toUpperCase() + src[i + 2]!.toUpperCase();
      i += 2;
    } else if (src.charCodeAt(i) >= 0x80) {
      const cp = src.codePointAt(i)!;
      const chars = String.fromCodePoint(cp);
      for (const b of utf8Encoder.encode(chars)) out += '%' + HEX[b >> 4] + HEX[b & 0xf];
      i += chars.length - 1;
    } else {
      out += ch;
    }
  }
  return out;
}

function startsWithIgnoreCase(s: string, prefix: string): boolean {
  return s.length >= prefix.length && s.slice(0, prefix.length).toLowerCase() === prefix;
}

/** Classify a key the way Google does (case-insensitive prefix match plus accepted typos). */
export function getKeyType(key: string): { type: KeyType; isTypo: boolean } {
  const userAgentTypo =
    startsWithIgnoreCase(key, 'useragent') || startsWithIgnoreCase(key, 'user agent');
  if (startsWithIgnoreCase(key, 'user-agent') || userAgentTypo) {
    return { type: 'user-agent', isTypo: userAgentTypo };
  }
  if (startsWithIgnoreCase(key, 'allow')) return { type: 'allow', isTypo: false };
  const disallowTypo = ['dissallow', 'dissalow', 'disalow', 'diasllow', 'disallaw'].some((t) =>
    startsWithIgnoreCase(key, t),
  );
  if (startsWithIgnoreCase(key, 'disallow') || disallowTypo) {
    return { type: 'disallow', isTypo: disallowTypo };
  }
  const sitemapTypo = startsWithIgnoreCase(key, 'site-map');
  if (startsWithIgnoreCase(key, 'sitemap') || sitemapTypo) {
    return { type: 'sitemap', isTypo: sitemapTypo };
  }
  return { type: 'unknown', isTypo: false };
}

const ASCII_WS = /^[ \t\n\v\f\r]+|[ \t\n\v\f\r]+$/g;
function stripAscii(s: string): string {
  return s.replace(ASCII_WS, '');
}

function parseLine(lineNo: number, raw: string, tooLong: boolean): RobotsLine {
  const result: RobotsLine = {
    line: lineNo,
    raw,
    kind: 'invalid',
    hasComment: false,
    isTypo: false,
    missingColon: false,
    tooLong,
  };
  let line = raw;
  const hash = line.indexOf('#');
  if (hash !== -1) {
    result.hasComment = true;
    result.comment = line.slice(hash + 1);
    line = line.slice(0, hash);
  }
  line = stripAscii(line);
  if (line.length === 0) {
    result.kind = result.hasComment ? 'comment' : 'empty';
    return result;
  }
  let sep = line.indexOf(':');
  if (sep === -1) {
    // Google: accept whitespace instead of a colon if there are exactly two tokens.
    const ws = line.search(/[ \t]/);
    if (ws !== -1) {
      const rest = line.slice(ws).replace(/^[ \t]+/, '');
      if (/[ \t]/.test(rest)) return result;
      result.missingColon = true;
      sep = ws;
    }
  }
  if (sep === -1) return result;
  const key = stripAscii(line.slice(0, sep));
  if (key.length === 0) return result;
  const rawValue = stripAscii(line.slice(sep + 1));
  const { type, isTypo } = getKeyType(key);
  result.kind = 'directive';
  result.key = key;
  result.type = type;
  result.isTypo = isTypo;
  result.rawValue = rawValue;
  result.value = type === 'user-agent' || type === 'sitemap' ? rawValue : escapePattern(rawValue);
  return result;
}

function decodeBytes(bytes: Uint8Array): { text: string; hadBom: boolean } {
  // Google skips a (possibly partial) UTF-8 BOM prefix byte by byte.
  const bom = [0xef, 0xbb, 0xbf];
  let skip = 0;
  while (skip < 3 && skip < bytes.length && bytes[skip] === bom[skip]) skip++;
  const text = new TextDecoder('utf-8', { ignoreBOM: true }).decode(bytes.subarray(skip));
  return { text, hadBom: skip > 0 };
}

/** Split a robots.txt body into classified lines. Accepts a string or raw bytes. */
export function parseLines(
  input: string | Uint8Array,
  options: ParseOptions = {},
): ParsedRobotsFile {
  let text: string;
  let hadBom = false;
  let byteLength: number;
  let truncated = false;
  if (typeof input === 'string') {
    text = input;
    byteLength = utf8Length(text);
    if (text.charCodeAt(0) === 0xfeff) {
      text = text.slice(1);
      hadBom = true;
    }
    if (options.maxBytes !== undefined && byteLength > options.maxBytes) {
      text = truncateUtf8(text, options.maxBytes - (hadBom ? 3 : 0));
      truncated = true;
    }
  } else {
    byteLength = input.length;
    let bytes = input;
    if (options.maxBytes !== undefined && bytes.length > options.maxBytes) {
      bytes = bytes.subarray(0, options.maxBytes);
      truncated = true;
    }
    ({ text, hadBom } = decodeBytes(bytes));
  }
  const rawLines = text.split(/\r\n|\r|\n/);
  const lines: RobotsLine[] = [];
  for (let i = 0; i < rawLines.length; i++) {
    let raw = rawLines[i]!;
    let tooLong = false;
    if (raw.length > MAX_LINE_BYTES / 4 && utf8Length(raw) > MAX_LINE_BYTES) {
      raw = truncateUtf8(raw, MAX_LINE_BYTES);
      tooLong = true;
    }
    lines.push(parseLine(i + 1, raw, tooLong));
  }
  return { lines, byteLength, hadBom, truncated };
}

export interface RobotsUserAgentLine {
  line: number;
  /** Value as written. */
  value: string;
  /** Product token Google extracts (`GPTBot/1.0` → `GPTBot`); `*` for the global group. */
  token: string;
  isGlobal: boolean;
}

export interface RobotsRule {
  line: number;
  type: 'allow' | 'disallow';
  /** Pattern as written. */
  rawPattern: string;
  /** Escaped pattern used for matching. */
  pattern: string;
}

export interface RobotsExtensionLine {
  line: number;
  key: string;
  value: string;
}

export interface RobotsGroup {
  index: number;
  startLine: number;
  endLine: number;
  userAgents: RobotsUserAgentLine[];
  rules: RobotsRule[];
  /** Unknown / non-standard lines inside the group (Crawl-delay, Content-Signal, ...). */
  extensions: RobotsExtensionLine[];
}

export interface ParsedRobots extends ParsedRobotsFile {
  groups: RobotsGroup[];
  sitemaps: { line: number; url: string }[];
  /** Allow/Disallow lines that appear before any User-agent line (ignored by crawlers). */
  orphanRules: RobotsRule[];
  /** Unknown lines outside any group. */
  orphanExtensions: RobotsExtensionLine[];
}

/** Characters allowed in a user-agent product token: [a-zA-Z_-]. */
export function extractUserAgent(value: string): string {
  const m = /^[A-Za-z_-]*/.exec(value);
  return m ? m[0] : '';
}

export function isValidUserAgentToObey(userAgent: string): boolean {
  return userAgent.length > 0 && extractUserAgent(userAgent) === userAgent;
}

/** `*` followed by nothing or whitespace is the global agent (Google). */
export function isGlobalUserAgent(value: string): boolean {
  return value.startsWith('*') && (value.length === 1 || /\s/.test(value[1]!));
}

/** Parse robots.txt into lines and groups (RFC 9309 group semantics, as implemented by Google). */
export function parseRobots(input: string | Uint8Array, options: ParseOptions = {}): ParsedRobots {
  const file = parseLines(input, options);
  const groups: RobotsGroup[] = [];
  const sitemaps: { line: number; url: string }[] = [];
  const orphanRules: RobotsRule[] = [];
  const orphanExtensions: RobotsExtensionLine[] = [];
  let current: RobotsGroup | null = null;
  let seenSeparator = false;
  for (const l of file.lines) {
    if (l.kind !== 'directive') continue;
    switch (l.type) {
      case 'user-agent': {
        if (!current || seenSeparator) {
          current = {
            index: groups.length,
            startLine: l.line,
            endLine: l.line,
            userAgents: [],
            rules: [],
            extensions: [],
          };
          groups.push(current);
          seenSeparator = false;
        }
        const value = l.rawValue ?? '';
        const isGlobal = isGlobalUserAgent(value);
        current.userAgents.push({
          line: l.line,
          value,
          token: isGlobal ? '*' : extractUserAgent(value),
          isGlobal,
        });
        current.endLine = l.line;
        break;
      }
      case 'allow':
      case 'disallow': {
        const rule: RobotsRule = {
          line: l.line,
          type: l.type,
          rawPattern: l.rawValue ?? '',
          pattern: l.value ?? '',
        };
        if (!current) {
          orphanRules.push(rule);
        } else {
          current.rules.push(rule);
          current.endLine = l.line;
          seenSeparator = true;
        }
        break;
      }
      case 'sitemap':
        sitemaps.push({ line: l.line, url: l.rawValue ?? '' });
        break;
      default: {
        const ext = { line: l.line, key: l.key ?? '', value: l.rawValue ?? '' };
        if (current) {
          current.extensions.push(ext);
          current.endLine = l.line;
        } else orphanExtensions.push(ext);
      }
    }
  }
  return { ...file, groups, sitemaps, orphanRules, orphanExtensions };
}
