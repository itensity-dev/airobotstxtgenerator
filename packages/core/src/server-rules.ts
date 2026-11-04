/**
 * Server-level blocking rules generated from the bot registry.
 * robots.txt is a request; these rules make the server answer 403 to matching User-Agents.
 * Control tokens (Google-Extended, Applebot-Extended) never appear in User-Agent headers and
 * are skipped. /robots.txt stays reachable so crawlers can still read the policy.
 */
import type { Bot } from './types.js';

export type ServerTarget =
  | 'nginx'
  | 'apache'
  | 'caddy'
  | 'cloudflare'
  | 'express'
  | 'nextjs'
  | 'django'
  | 'php';

export const SERVER_TARGETS: ServerTarget[] = ['nginx', 'apache', 'caddy', 'cloudflare', 'express', 'nextjs', 'django', 'php'];

export interface ServerRuleResult {
  target: ServerTarget;
  code: string;
  /** Language hint for syntax highlighting. */
  language: string;
  /** User-Agent substrings included. */
  patterns: string[];
  /** Bots skipped because they are robots.txt tokens only. */
  skipped: string[];
  /** Bots skipped because their name is too generic to match safely in a User-Agent. */
  ambiguous: string[];
  /** Notes in English (the UI shows localised versions by key). */
  warnings: string[];
}

const REGEX_META = /[.*+?^${}()|[\]\\/]/g;
export function escapeRegex(s: string): string {
  return s.replace(REGEX_META, '\\$&');
}

/** Unique, case-insensitively de-duplicated User-Agent substrings for the given bots. */
export function userAgentPatterns(bots: Bot[]): { patterns: string[]; skipped: string[]; ambiguous: string[] } {
  const seen = new Set<string>();
  const patterns: string[] = [];
  const skipped: string[] = [];
  const ambiguous: string[] = [];
  for (const b of bots) {
    if (b.uaMatch.length === 0) {
      (b.kind === 'token' ? skipped : ambiguous).push(b.token);
      continue;
    }
    for (const m of b.uaMatch) {
      const k = m.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      patterns.push(m);
    }
  }
  // Remove patterns that contain a shorter pattern (it already matches them).
  const reduced = patterns.filter(
    (p) => !patterns.some((q) => q !== p && q.length < p.length && p.toLowerCase().includes(q.toLowerCase())),
  );
  return { patterns: reduced, skipped, ambiguous };
}

/** Cloudflare custom rule expressions are limited to 4,096 characters. */
export const CLOUDFLARE_EXPRESSION_LIMIT = 4096;

export function buildServerRules(target: ServerTarget, bots: Bot[], options: { status?: 403 | 404 | 410 } = {}): ServerRuleResult {
  const status = options.status ?? 403;
  const { patterns, skipped, ambiguous } = userAgentPatterns(bots);
  const alternation = patterns.map(escapeRegex).join('|');
  const warnings: string[] = [];
  let code = '';
  let language = 'text';
  const header = `AI crawler block — ${patterns.length} User-Agent pattern${patterns.length === 1 ? '' : 's'} (airobotstxtgenerator.com)`;

  switch (target) {
    case 'nginx': {
      language = 'nginx';
      const width = Math.max(...patterns.map((p) => p.length), 4) + 6;
      const lines = patterns.map((p) => {
        const re = `~*${escapeRegex(p)}`;
        const quoted = /\s/.test(re) ? `"${re}"` : re;
        return `    ${quoted.padEnd(width)} 1;`;
      });
      code = [
        `# ${header}`,
        '# 1) http {} context, e.g. /etc/nginx/conf.d/ai-bots.conf',
        'map $http_user_agent $is_ai_bot {',
        `    ${'default'.padEnd(width)} 0;`,
        ...lines,
        '}',
        '',
        '# 2) inside each server {} block',
        'location = /robots.txt {',
        '    # always let crawlers read robots.txt',
        '    try_files $uri =404;',
        '}',
        `if ($is_ai_bot) {`,
        `    return ${status};`,
        '}',
      ].join('\n');
      break;
    }
    case 'apache': {
      language = 'apache';
      code = [
        `# ${header}`,
        '# .htaccess in the document root (or a <VirtualHost> / <Directory> block); needs mod_rewrite',
        '<IfModule mod_rewrite.c>',
        '    RewriteEngine On',
        '    RewriteCond %{REQUEST_URI} !^/robots\\.txt$',
        `    RewriteCond %{HTTP_USER_AGENT} (${alternation}) [NC]`,
        status === 403 ? '    RewriteRule ^ - [F,L]' : status === 410 ? '    RewriteRule ^ - [G,L]' : '    RewriteRule ^ - [R=404,L]',
        '</IfModule>',
      ].join('\n');
      break;
    }
    case 'caddy': {
      language = 'caddyfile';
      code = [
        `# ${header}`,
        '# inside your site block in the Caddyfile',
        '@ai_bots {',
        `    header_regexp User-Agent (?i)(${alternation})`,
        '    not path /robots.txt',
        '}',
        `respond @ai_bots ${status}`,
      ].join('\n');
      break;
    }
    case 'cloudflare': {
      language = 'text';
      const conditions = patterns.map((p) => `(lower(http.user_agent) contains "${p.toLowerCase().replace(/"/g, '\\"')}")`);
      const expression = `(${conditions.join(' or ')}) and not (http.request.uri.path eq "/robots.txt")`;
      if (expression.length > CLOUDFLARE_EXPRESSION_LIMIT) {
        warnings.push(
          `The expression has ${expression.length} characters; Cloudflare allows ${CLOUDFLARE_EXPRESSION_LIMIT}. Split it into two rules or select fewer bots.`,
        );
      }
      code = [
        `# ${header}`,
        '# Cloudflare dashboard → Security → WAF → Custom rules → Create rule → Edit expression',
        '# Action: Block',
        expression,
      ].join('\n');
      break;
    }
    case 'express': {
      language = 'javascript';
      code = [
        `// ${header}`,
        '// Express / Connect middleware — register before your routes.',
        `const AI_BOTS = /(${alternation})/i;`,
        '',
        'app.use((req, res, next) => {',
        "  if (req.path !== '/robots.txt' && AI_BOTS.test(req.get('user-agent') ?? '')) {",
        `    return res.status(${status}).type('text/plain').send('Automated access by AI crawlers is not permitted.');`,
        '  }',
        '  next();',
        '});',
      ].join('\n');
      break;
    }
    case 'nextjs': {
      language = 'typescript';
      code = [
        `// ${header}`,
        '// proxy.ts in the project root (Next.js 16+). For Next.js 15 and earlier name the file',
        '// middleware.ts and the exported function `middleware`.',
        "import { NextResponse, type NextRequest } from 'next/server';",
        '',
        `const AI_BOTS = /(${alternation})/i;`,
        '',
        'export function proxy(request: NextRequest) {',
        "  const ua = request.headers.get('user-agent') ?? '';",
        "  if (request.nextUrl.pathname !== '/robots.txt' && AI_BOTS.test(ua)) {",
        `    return new NextResponse('Automated access by AI crawlers is not permitted.', { status: ${status} });`,
        '  }',
        '  return NextResponse.next();',
        '}',
      ].join('\n');
      break;
    }
    case 'django': {
      language = 'python';
      code = [
        `# ${header}`,
        '# yourproject/middleware.py — then add "yourproject.middleware.BlockAIBotsMiddleware"',
        '# near the top of MIDDLEWARE in settings.py.',
        'import re',
        'from django.http import HttpResponse',
        '',
        `AI_BOTS = re.compile(r"(${alternation})", re.IGNORECASE)`,
        '',
        '',
        'class BlockAIBotsMiddleware:',
        '    def __init__(self, get_response):',
        '        self.get_response = get_response',
        '',
        '    def __call__(self, request):',
        '        ua = request.META.get("HTTP_USER_AGENT", "")',
        '        if request.path != "/robots.txt" and AI_BOTS.search(ua):',
        `            return HttpResponse("Automated access by AI crawlers is not permitted.", status=${status}, content_type="text/plain")`,
        '        return self.get_response(request)',
      ].join('\n');
      break;
    }
    case 'php': {
      language = 'php';
      code = [
        '<?php',
        `// ${header}`,
        '// Include at the very top of index.php (or as a WordPress must-use plugin in wp-content/mu-plugins/).',
        `$aiBots = '/(${alternation.replace(/'/g, "\\'")})/i';`,
        "$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';",
        "$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);",
        "if ($path !== '/robots.txt' && preg_match($aiBots, $ua)) {",
        `    http_response_code(${status});`,
        "    header('Content-Type: text/plain');",
        "    exit('Automated access by AI crawlers is not permitted.');",
        '}',
      ].join('\n');
      break;
    }
  }
  if (skipped.length > 0) {
    warnings.push(
      `${skipped.join(', ')} ${skipped.length === 1 ? 'is a robots.txt token' : 'are robots.txt tokens'}, not ${skipped.length === 1 ? 'a crawler' : 'crawlers'}: ${skipped.length === 1 ? 'it' : 'they'} never appear in a User-Agent header, so only robots.txt can express ${skipped.length === 1 ? 'it' : 'them'}.`,
    );
  }
  if (ambiguous.length > 0) {
    warnings.push(`Left out because the name is too generic to match safely: ${ambiguous.join(', ')}.`);
  }
  return { target, code: code + '\n', language, patterns, skipped, ambiguous, warnings };
}

/** Snippets to check that a request claiming to be a bot really comes from its operator. */
export function buildVerificationSnippet(bot: Bot): { method: Bot['verification']; code: string; language: string } {
  if (bot.verification === 'ip-list' && bot.ipRanges) {
    return {
      method: 'ip-list',
      language: 'javascript',
      code: [
        `// Verify ${bot.name} by IP: compare the client IP with the operator's published ranges.`,
        `// Node.js 18+ (ESM). Cache the list; the operator updates it from time to time.`,
        "import { BlockList, isIPv6 } from 'node:net';",
        '',
        `const res = await fetch('${bot.ipRanges}');`,
        'const { prefixes } = await res.json();',
        'const ranges = new BlockList();',
        'for (const p of prefixes) {',
        '  const cidr = p.ipv4Prefix ?? p.ipv6Prefix;',
        "  const [net, bits] = cidr.split('/');",
        "  ranges.addSubnet(net, Number(bits), p.ipv6Prefix ? 'ipv6' : 'ipv4');",
        '}',
        '',
        `export const isReal${bot.token.replace(/[^A-Za-z0-9]/g, '')} = (ip) => ranges.check(ip, isIPv6(ip) ? 'ipv6' : 'ipv4');`,
      ].join('\n') + '\n',
    };
  }
  if (bot.verification === 'reverse-dns' && bot.verifyHosts && bot.verifyHosts.length > 0) {
    const hosts = bot.verifyHosts.map((h) => `'${h}'`).join(', ');
    return {
      method: 'reverse-dns',
      language: 'javascript',
      code: [
        `// Verify ${bot.name} by reverse DNS, then confirm with a forward lookup.`,
        "import { promises as dns } from 'node:dns';",
        '',
        `const SUFFIXES = [${hosts}];`,
        '',
        'export async function isRealBot(ip) {',
        '  const names = await dns.reverse(ip).catch(() => []);',
        "  const host = names.find((n) => SUFFIXES.some((s) => n === s.replace(/^\\./, '') || n.endsWith(s.startsWith('.') ? s : '.' + s)));",
        '  if (!host) return false;',
        "  const forward = await dns.lookup(host, { all: true }).catch(() => []);",
        '  return forward.some((a) => a.address === ip);',
        '}',
      ].join('\n') + '\n',
    };
  }
  return { method: bot.verification, language: 'text', code: '' };
}
