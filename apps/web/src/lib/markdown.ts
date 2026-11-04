/**
 * Minimal inline Markdown for frontmatter strings (FAQ answers, steps, notes):
 * `code`, **bold**, *italic*, [links](url) and paragraphs. Input is trusted (our own content files),
 * but HTML is still escaped first.
 */
import type { Locale } from '../i18n/locales';
import { resolveHref } from './links';

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderInline(md: string, paragraphs = false, locale: Locale = 'en'): string {
  const render = (text: string) =>
    escapeHtml(text)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
        const external = /^https?:\/\//.test(href);
        return `<a href="${resolveHref(href, locale)}"${external ? ' rel="noopener"' : ''}>${label}</a>`;
      });
  if (!paragraphs) return render(md);
  return md
    .split(/\n{2,}/)
    .map((p) => `<p>${render(p.trim())}</p>`)
    .join('');
}

/** Strip inline Markdown for plain-text contexts (JSON-LD, meta). */
export function plainText(md: string): string {
  return md
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}
