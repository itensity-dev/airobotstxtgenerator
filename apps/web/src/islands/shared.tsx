import { useState } from 'preact/hooks';
import type { Dict } from '../lib/i18n-client';
import { makeT } from '../lib/i18n-client';

export interface NoticeLine {
  text: string;
  note?: string;
  kind?: 'comment' | 'ua' | 'rule' | 'other';
  mark?: 'add' | 'remove';
  highlight?: boolean;
  no?: number | null;
}

export function classifyLine(text: string): NoticeLine['kind'] {
  const tr = text.trim();
  if (tr.startsWith('#')) return 'comment';
  if (/^user-?agent\s*:/i.test(tr)) return 'ua';
  if (/^(dis)?allow\s*:/i.test(tr)) return 'rule';
  return 'other';
}

export function NoticeLines({ lines, showNotes, label }: { lines: NoticeLine[]; showNotes: boolean; label: string }) {
  return (
    <div class={`lines${showNotes ? ' lines--notes' : ''}`} role="table" aria-label={label}>
      {lines.map((l, i) => (
        <div
          role="row"
          key={i}
          class={`line${l.kind === 'comment' ? ' line--comment' : ''}${l.kind === 'ua' ? ' line--ua' : ''}${l.highlight ? ' line--hl' : ''}${l.mark ? ` line--${l.mark}` : ''}`}
        >
          <span role="cell" class="line__no">
            {l.mark === 'add' ? '+' : l.mark === 'remove' ? '−' : (l.no ?? i + 1)}
          </span>
          <span role="cell" class="line__text">
            {l.text || ' '}
          </span>
          {showNotes && (
            <span role="cell" class="line__note">
              {l.note ?? ''}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function CopyButton({ text, dict, label }: { text: string; dict: Dict; label?: string }) {
  const t = makeT(dict);
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      class="btn btn--small"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      <span aria-live="polite">{done ? t('common.copied') : (label ?? t('common.copy'))}</span>
    </button>
  );
}

export function download(filename: string, text: string, type = 'text/plain') {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Fire an analytics event if an analytics script is present (no personal data, no content). */
export function track(event: string, props?: Record<string, string>) {
  const w = window as unknown as { plausible?: (e: string, o?: { props?: Record<string, string> }) => void; gtag?: (...a: unknown[]) => void };
  try {
    w.plausible?.(event, props ? { props } : undefined);
    w.gtag?.('event', event, props ?? {});
  } catch {
    /* ignore */
  }
}
