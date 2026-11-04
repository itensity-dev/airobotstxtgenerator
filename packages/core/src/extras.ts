/** Generators for llms.txt, TDMRep, Content-Signal / Content-Usage and meta tags. */

export interface LlmsTxtLink {
  title: string;
  url: string;
  description?: string;
}

export interface LlmsTxtSection {
  title: string;
  links: LlmsTxtLink[];
  /** Put this section under "## Optional" semantics (llmstxt.org: may be skipped for short context). */
  optional?: boolean;
}

export interface LlmsTxtInput {
  name: string;
  summary?: string;
  details?: string;
  sections: LlmsTxtSection[];
}

/**
 * Build an llms.txt file following https://llmstxt.org/:
 * H1 with the site name, a blockquote summary, optional free text, then H2 sections
 * with Markdown link lists. A section titled "Optional" may be skipped by readers.
 */
export function buildLlmsTxt(input: LlmsTxtInput): string {
  const out: string[] = [`# ${input.name.trim() || 'Untitled'}`, ''];
  if (input.summary?.trim()) out.push(`> ${input.summary.trim().replace(/\n+/g, ' ')}`, '');
  if (input.details?.trim()) out.push(input.details.trim(), '');
  const regular = input.sections.filter((s) => !s.optional);
  const optional = input.sections.filter((s) => s.optional);
  const emit = (title: string, links: LlmsTxtLink[]) => {
    const valid = links.filter((l) => l.title.trim() && l.url.trim());
    if (valid.length === 0) return;
    out.push(`## ${title.trim()}`, '');
    for (const l of valid) {
      out.push(`- [${l.title.trim()}](${l.url.trim()})${l.description?.trim() ? `: ${l.description.trim()}` : ''}`);
    }
    out.push('');
  };
  for (const s of regular) emit(s.title, s.links);
  const optionalLinks = optional.flatMap((s) => s.links);
  if (optionalLinks.length > 0) emit('Optional', optionalLinks);
  while (out.length > 0 && out[out.length - 1] === '') out.pop();
  return out.join('\n') + '\n';
}

export interface LlmsTxtIssue {
  line: number;
  severity: 'error' | 'warning';
  message: string;
}

/** Light validation of an llms.txt file against the llmstxt.org structure. */
export function validateLlmsTxt(text: string): LlmsTxtIssue[] {
  const issues: LlmsTxtIssue[] = [];
  const lines = text.split(/\r?\n/);
  const firstContent = lines.findIndex((l) => l.trim() !== '');
  if (firstContent === -1 || !/^# \S/.test(lines[firstContent]!)) {
    issues.push({ line: firstContent + 1 || 1, severity: 'error', message: 'The file must start with an H1 ("# Name").' });
  }
  lines.forEach((l, i) => {
    if (/^# /.test(l) && i !== firstContent) {
      issues.push({ line: i + 1, severity: 'warning', message: 'Only one H1 is expected; use "## " for sections.' });
    }
    if (/^#{3,} /.test(l)) {
      issues.push({ line: i + 1, severity: 'warning', message: 'llms.txt uses H2 sections ("## ") for link lists.' });
    }
    const m = /^\s*[-*] \[([^\]]*)\]\(([^)]*)\)/.exec(l);
    if (m && !/^(https?:\/\/|\/)/.test(m[2]!)) {
      issues.push({ line: i + 1, severity: 'warning', message: `Link "${m[2]}" should be an absolute URL or a root-relative path.` });
    }
  });
  return issues;
}

export interface TdmRepInput {
  /** 1 = rights reserved (TDM not allowed without a licence), 0 = not reserved. */
  reservation: 0 | 1;
  /** URL of a machine-readable TDM policy (JSON-LD, ODRL) describing licensing terms. */
  policy?: string;
  /** Path pattern the rule applies to (`/` for the whole site). */
  location?: string;
}

/**
 * TDMRep (W3C Community Group Final Report, 2024): a site-wide /.well-known/tdmrep.json,
 * an HTTP header pair and HTML meta tags expressing a text-and-data-mining rights reservation
 * as provided for by Art. 4 of EU Directive 2019/790.
 */
export function buildTdmRep(rules: TdmRepInput[]): { json: string; headers: string; meta: string; nginx: string; apache: string } {
  const entries = rules.map((r) => {
    const e: Record<string, string | number> = { location: r.location?.trim() || '/', 'tdm-reservation': r.reservation };
    if (r.reservation === 1 && r.policy?.trim()) e['tdm-policy'] = r.policy.trim();
    return e;
  });
  const json = JSON.stringify(entries, null, 2) + '\n';
  const main = rules[0] ?? { reservation: 1 };
  const policy = main.reservation === 1 && main.policy?.trim() ? main.policy.trim() : '';
  const headers = `tdm-reservation: ${main.reservation}\n${policy ? `tdm-policy: ${policy}\n` : ''}`;
  const meta =
    `<meta name="tdm-reservation" content="${main.reservation}">\n` +
    (policy ? `<meta name="tdm-policy" content="${policy}">\n` : '');
  const nginx =
    `add_header tdm-reservation "${main.reservation}" always;\n` + (policy ? `add_header tdm-policy "${policy}" always;\n` : '');
  const apache =
    `<IfModule mod_headers.c>\n    Header always set tdm-reservation "${main.reservation}"\n` +
    (policy ? `    Header always set tdm-policy "${policy}"\n` : '') +
    '</IfModule>\n';
  return { json, headers, meta, nginx, apache };
}

export type YesNo = 'yes' | 'no';

export interface ContentSignalInput {
  search?: YesNo;
  'ai-input'?: YesNo;
  'ai-train'?: YesNo;
}

/** Cloudflare Content Signals Policy lines (placed inside a User-agent group of robots.txt). */
export function buildContentSignal(input: ContentSignalInput, userAgent = '*', withPolicyComment = true): string {
  const parts = (['search', 'ai-input', 'ai-train'] as const).filter((k) => input[k]).map((k) => `${k}=${input[k]}`);
  const out: string[] = [];
  if (withPolicyComment) {
    out.push(
      '# Content signals (https://contentsignals.org): how content may be used after access.',
      '# search: building a search index and showing links/excerpts; ai-input: using content',
      '# as input to AI answers (RAG, grounding); ai-train: training or fine-tuning AI models.',
      '# A missing signal expresses no preference.',
    );
  }
  out.push(`User-agent: ${userAgent}`);
  if (parts.length > 0) out.push(`Content-Signal: ${parts.join(', ')}`);
  out.push('Allow: /');
  return out.join('\n') + '\n';
}

export interface ContentUsageInput {
  'train-ai'?: 'y' | 'n';
  'ai-use'?: 'y' | 'n';
  search?: 'y' | 'n';
}

/** IETF aipref draft syntax (draft-ietf-aipref-vocab / -attach): `train-ai=n, search=y`. */
export function buildContentUsage(input: ContentUsageInput, path?: string): { robotsLine: string; header: string } {
  const pref = (['train-ai', 'ai-use', 'search'] as const)
    .filter((k) => input[k])
    .map((k) => `${k}=${input[k]}`)
    .join(', ');
  return {
    robotsLine: `Content-Usage: ${path && path !== '/' ? path + ' ' : ''}${pref}`,
    header: `Content-Usage: ${pref}`,
  };
}
