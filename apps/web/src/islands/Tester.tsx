import { useEffect, useMemo, useState } from 'preact/hooks';
import {
  GOOGLE_MAX_BYTES,
  lintRobotsTxt,
  matchUrl,
  normalizeRequestPath,
  parseRobots,
  summarizeAgent,
  type Bot,
  type LintIssue,
} from '@airobots/core';
import { makeT, type Dict } from '../lib/i18n-client';
import { NoticeLines, classifyLine, track, type NoticeLine } from './shared';
import type { GenBot } from './Generator';

interface Props {
  dict: Dict;
  bots: GenBot[];
  operators: Record<string, string>;
  communityUrl: string;
  communityCount: number;
  botBase: string;
  apiUrl: string;
}

interface Fetched {
  input: string;
  requestedUrl: string;
  finalUrl: string;
  status: number;
  contentType: string | null;
  redirects: { from: string; to: string; status: number }[];
  bytes: number;
  truncated: boolean;
  bodyBase64: string;
  httpFallback: boolean;
  durationMs: number;
  cached: boolean;
}

type Source = { kind: 'paste'; text: string } | { kind: 'fetch'; data: Fetched; body: Uint8Array };

const MAX_SHOWN_LINES = 1500;

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function formatBytes(n: number): string {
  return n < 1024 ? `${n} B` : `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`;
}

export default function Tester(props: Props) {
  const t = makeT(props.dict);
  const [tab, setTab] = useState<'fetch' | 'paste'>('fetch');
  const [domain, setDomain] = useState('');
  const [paste, setPaste] = useState('');
  const [source, setSource] = useState<Source | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [path, setPath] = useState('/');
  const [agent, setAgent] = useState('GPTBot');
  const [customAgent, setCustomAgent] = useState('');
  const [filter, setFilter] = useState<'all' | 'blocked' | 'allowed'>('all');
  const [withCommunity, setWithCommunity] = useState(false);
  const [community, setCommunity] = useState<Bot[] | null>(null);
  const [showAllLines, setShowAllLines] = useState(false);

  // Text handed over from the generator, or ?url= in the address.
  useEffect(() => {
    try {
      const handed = sessionStorage.getItem('tester:paste');
      if (handed) {
        sessionStorage.removeItem('tester:paste');
        setTab('paste');
        setPaste(handed);
        setSource({ kind: 'paste', text: handed });
        return;
      }
    } catch {
      /* ignore */
    }
    const q = new URLSearchParams(location.search);
    const u = q.get('url');
    if (u) {
      setDomain(u);
      void runFetch(u);
    }
    if (q.get('path')) setPath(q.get('path')!);
    if (location.hash === '#paste') setTab('paste');
  }, []);

  useEffect(() => {
    if (!withCommunity || community) return;
    fetch(props.communityUrl)
      .then((r) => r.json())
      .then((j: { community?: { bots: Bot[] } }) => setCommunity(j.community?.bots ?? []))
      .catch(() => setCommunity([]));
  }, [withCommunity]);

  async function runFetch(input: string) {
    const value = input.trim();
    if (!value) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`${props.apiUrl}?url=${encodeURIComponent(value)}`, { headers: { accept: 'application/json' } });
      const j = (await res.json()) as Fetched & { error?: string; retryAfter?: number };
      if (!res.ok || j.error) {
        setError(t(`tester.err.${j.error ?? 'internal-error'}`, { seconds: j.retryAfter ?? 60 }));
        setSource(null);
      } else {
        setSource({ kind: 'fetch', data: j, body: b64ToBytes(j.bodyBase64) });
        track('Check site', { status: String(j.status) });
        const url = new URL(location.href);
        url.searchParams.set('url', value);
        history.replaceState(null, '', url);
      }
    } catch {
      setError(t('tester.err.network'));
    } finally {
      setBusy(false);
    }
  }

  // Debounced analysis of pasted text.
  useEffect(() => {
    if (tab !== 'paste') return;
    const id = setTimeout(() => setSource(paste.trim() ? { kind: 'paste', text: paste } : null), 250);
    return () => clearTimeout(id);
  }, [paste, tab]);

  const input: string | Uint8Array | null = source ? (source.kind === 'paste' ? source.text : source.body) : null;
  const status = source?.kind === 'fetch' ? source.data.status : 200;
  const parsed = useMemo(() => (input === null ? null : parseRobots(input, { maxBytes: GOOGLE_MAX_BYTES })), [input]);
  const issues: LintIssue[] = useMemo(() => (input === null ? [] : lintRobotsTxt(input, { bots: props.bots as Bot[] })), [input]);
  // Google's handling of HTTP status codes for robots.txt.
  const mode: 'rules' | 'allow-all' | 'deny-all' =
    status >= 200 && status < 300 ? 'rules' : (status >= 400 && status < 500 && status !== 429) ? 'allow-all' : 'deny-all';

  const tableBots = useMemo(() => {
    const base = props.bots.filter((b) => !b.legacy);
    return [...base, ...(withCommunity && community ? community : [])] as GenBot[];
  }, [props.bots, withCommunity, community]);

  const requestPath = normalizeRequestPath(path || '/');
  const crawlerToken = (b: GenBot) => /^[A-Za-z_-]+/.exec(b.token)?.[0] ?? b.token;

  const rows = useMemo(() => {
    if (!parsed) return [];
    return tableBots.map((b) => {
      const token = crawlerToken(b);
      if (mode !== 'rules') {
        const v = mode === 'allow-all';
        return { b, verdict: v ? 'allowed' : 'blocked', pathAllowed: v, via: 'none' as const };
      }
      const s = summarizeAgent(parsed, token);
      const m = matchUrl(parsed, token, requestPath);
      return { b, verdict: s.verdict, pathAllowed: m.allowed, via: s.via };
    });
  }, [parsed, tableBots, requestPath, mode]);

  const shownRows = rows.filter((r) => filter === 'all' || (filter === 'blocked' ? !r.pathAllowed || r.verdict === 'blocked' : r.pathAllowed));

  const testAgent = (agent === '__custom' ? customAgent : agent).trim() || '*';
  const test = useMemo(() => (parsed && mode === 'rules' ? matchUrl(parsed, testAgent, requestPath) : null), [parsed, testAgent, requestPath, mode]);

  const fileLines: NoticeLine[] = useMemo(() => {
    if (!parsed) return [];
    const hl = new Set<number>([...(test?.groupLines ?? []), ...(test?.decidingRule ? [test.decidingRule.line] : [])]);
    return parsed.lines.map((l) => ({ text: l.raw, kind: classifyLine(l.raw), highlight: hl.has(l.line), no: l.line }));
  }, [parsed, test]);

  const verdictStamp = (v: string) => (
    <span class={`stamp ${v === 'allowed' ? 'stamp--ok' : v === 'blocked' ? 'stamp--no' : 'stamp--part'}`}>{t(`verdict.${v}`)}</span>
  );

  const httpNotes: string[] = [];
  if (source?.kind === 'fetch') {
    const d = source.data;
    const cls = Math.floor(d.status / 100);
    if (cls === 2) httpNotes.push(t('tester.http.2xx'));
    else if (cls === 4 && d.status !== 429) httpNotes.push(t('tester.http.4xx', { status: d.status }));
    else if (cls === 5 || d.status === 429) httpNotes.push(t('tester.http.5xx', { status: d.status }));
    else if (cls === 3) httpNotes.push(t('tester.http.3xx'));
    if (cls === 2 && d.contentType && !/^text\/plain/i.test(d.contentType)) httpNotes.push(t('tester.contentType', { type: d.contentType }));
    const head = new TextDecoder().decode(source.body.subarray(0, 1024)).toLowerCase();
    if (cls === 2 && /<html|<!doctype html/.test(head)) httpNotes.push(t('tester.htmlBody'));
    if (d.truncated || d.bytes > GOOGLE_MAX_BYTES) httpNotes.push(t('tester.truncated'));
    if (d.httpFallback) httpNotes.push(t('tester.httpFallback'));
    const finalHost = new URL(d.finalUrl).host;
    if (finalHost !== new URL(d.requestedUrl).host) httpNotes.push(t('tester.crossHost', { host: finalHost }));
  }

  const agentOptions = props.bots.filter((b) => !b.legacy);

  return (
    <div class="tester">
      <div class="panel">
        <div class="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'fetch'} onClick={() => setTab('fetch')}>
            {t('tester.tabFetch')}
          </button>
          <button type="button" role="tab" aria-selected={tab === 'paste'} onClick={() => setTab('paste')}>
            {t('tester.tabPaste')}
          </button>
        </div>
        {tab === 'fetch' ? (
          <form
            class="row"
            onSubmit={(e) => {
              e.preventDefault();
              void runFetch(domain);
            }}
          >
            <label class="visually-hidden" for="tester-domain">
              {t('tester.domain')}
            </label>
            <input id="tester-domain" type="text" inputMode="url" autoComplete="url" placeholder={t('tester.domainPlaceholder')} value={domain} onInput={(e) => setDomain(e.currentTarget.value)} />
            <button class="btn" type="submit" disabled={busy}>
              {busy ? t('common.loading') : t('tester.fetch')}
            </button>
          </form>
        ) : (
          <div class="field">
            <label for="tester-paste">{t('tester.paste')}</label>
            <textarea id="tester-paste" spellcheck={false} value={paste} placeholder={t('tester.pastePlaceholder')} onInput={(e) => setPaste(e.currentTarget.value)} />
            <span class="field__hint">{t('tester.pasteHint')}</span>
          </div>
        )}
        <div aria-live="polite">
          {error && <p class="callout callout--warn">{error}</p>}
          {source?.kind === 'fetch' && (
            <div class="fetch-status">
              <p class="status-line">
                <a href={source.data.finalUrl} rel="nofollow noopener">
                  {source.data.finalUrl}
                </a>
                {' · '}
                {t('tester.statusLine', { status: source.data.status, type: source.data.contentType ?? '—', size: formatBytes(source.data.bytes), ms: source.data.durationMs })}
                {source.data.cached ? ` · ${t('tester.fromCache')}` : ''}
              </p>
              {source.data.redirects.length > 0 && <p class="small">{t('tester.redirects', { list: source.data.redirects.map((r) => `${r.status} → ${r.to}`).join(', ') })}</p>}
              {httpNotes.map((n) => (
                <p class={`callout small ${mode === 'rules' ? '' : 'callout--warn'}`}>{n}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {parsed && (
        <>
          <section class="panel tester-test" aria-labelledby="tester-test-title">
            <h2 id="tester-test-title" class="section-label">
              <span class="sec">§1</span> {t('tester.testTitle')}
            </h2>
            <div class="row">
              <label class="field">
                <span class="label">{t('tester.testPath')}</span>
                <input type="text" value={path} placeholder={t('tester.testPathPlaceholder')} onInput={(e) => setPath(e.currentTarget.value)} />
              </label>
              <label class="field">
                <span class="label">{t('tester.testAgent')}</span>
                <select value={agent} onChange={(e) => setAgent(e.currentTarget.value)}>
                  {agentOptions.map((b) => (
                    <option value={crawlerToken(b)}>{b.token}</option>
                  ))}
                  <option value="*">* (any other crawler)</option>
                  <option value="__custom">{t('tester.testAgentCustom')}</option>
                </select>
              </label>
              {agent === '__custom' && (
                <label class="field">
                  <span class="label">{t('tester.testAgentCustom')}</span>
                  <input type="text" value={customAgent} placeholder="MyBot" onInput={(e) => setCustomAgent(e.currentTarget.value)} />
                </label>
              )}
            </div>
            <div class="test-result" aria-live="polite">
              {mode !== 'rules' ? (
                <p>
                  {verdictStamp(mode === 'allow-all' ? 'allowed' : 'blocked')} {mode === 'allow-all' ? t('tester.http.4xx', { status }) : t('tester.http.5xx', { status })}
                </p>
              ) : (
                test && (
                  <>
                    <p class="test-verdict">
                      {verdictStamp(test.allowed ? 'allowed' : 'blocked')} <code>{testAgent}</code> → <code>{test.path}</code>
                    </p>
                    <p class="small">
                      {test.decidingRule
                        ? t('tester.testDecidedBy', { line: test.decidingRule.line, rule: `${test.decidingRule.type === 'allow' ? 'Allow' : 'Disallow'}: ${test.decidingRule.pattern}` })
                        : t('tester.testNoRule')}{' '}
                      {test.via === 'specific'
                        ? t('tester.testGroupSpecific', { agent: testAgent, lines: test.groupLines.join(', ') })
                        : test.via === 'global'
                          ? t('tester.testGroupGlobal', { agent: testAgent, lines: test.groupLines.join(', ') })
                          : t('tester.testGroupNone', { agent: testAgent })}
                    </p>
                  </>
                )
              )}
            </div>
          </section>

          <section class="panel" aria-labelledby="tester-table-title">
            <h2 id="tester-table-title" class="section-label">
              <span class="sec">§2</span> {t('tester.tableTitle')}
            </h2>
            <div class="row small">
              {(['all', 'blocked', 'allowed'] as const).map((f) => (
                <label class="row">
                  <input type="radio" name="tester-filter" checked={filter === f} onChange={() => setFilter(f)} /> {t(`tester.filter${f[0]!.toUpperCase()}${f.slice(1)}`)}
                </label>
              ))}
              <label class="row">
                <input type="checkbox" checked={withCommunity} onChange={(e) => setWithCommunity(e.currentTarget.checked)} /> {t('tester.showCommunity', { count: props.communityCount })}
              </label>
            </div>
            <div class="table-wrap">
              <table class="register">
                <thead>
                  <tr>
                    <th scope="col">{t('tester.colBot')}</th>
                    <th scope="col">{t('tester.colPurpose')}</th>
                    <th scope="col">{t('tester.colHome')}</th>
                    <th scope="col">
                      {t('tester.colPath')} <code>{requestPath}</code>
                    </th>
                    <th scope="col">{t('tester.colGroup')}</th>
                  </tr>
                </thead>
                <tbody>
                  {shownRows.map(({ b, verdict, pathAllowed, via }) => (
                    <tr class={verdict === 'blocked' ? 'is-blocked' : verdict === 'partial' ? 'is-partial' : 'is-allowed'}>
                      <td class="mono">{b.page ? <a href={`${props.botBase}${b.id}/`}>{b.token}</a> : b.token}</td>
                      <td>
                        {b.general ? t('purpose.general') : b.kind === 'token' ? t('purpose.token') : t(`purpose.${b.purpose}`)}
                        <span class="muted small"> · {props.operators[b.operator] ?? b.operatorName ?? ''}</span>
                      </td>
                      <td>{verdictStamp(verdict)}</td>
                      <td>{verdictStamp(pathAllowed ? 'allowed' : 'blocked')}</td>
                      <td class="small">{via === 'specific' ? t('tester.groupSpecific') : via === 'global' ? t('tester.groupGlobal') : t('tester.groupNone')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section class="panel" aria-labelledby="tester-lint-title">
            <h2 id="tester-lint-title" class="section-label">
              <span class="sec">§3</span> {t('tester.lintTitle')}
            </h2>
            {issues.length === 0 ? (
              <p class="callout callout--ok">{t('tester.lintNone')}</p>
            ) : (
              <ul class="issues">
                {issues.map((i) => (
                  <li>
                    <span class={`stamp ${i.severity === 'error' ? 'stamp--no' : i.severity === 'warning' ? 'stamp--part' : 'stamp--info'}`}>{t(`tester.severity.${i.severity}`)}</span>
                    <span>
                      {i.line ? <strong class="mono">{t('common.lineShort', { n: i.line })}: </strong> : null}
                      {props.dict[`lint.${i.code}`] ? t(`lint.${i.code}`, i.params) : i.message}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section class="panel" aria-labelledby="tester-file-title">
            <div class="notice">
              <div class="notice__head">
                <h2 id="tester-file-title" class="notice__title">
                  {t('tester.fileTitle')} · {parsed.lines.length} {t('common.lines')}
                </h2>
              </div>
              <div class="notice__body" tabIndex={0}>
                <NoticeLines lines={showAllLines ? fileLines : fileLines.slice(0, MAX_SHOWN_LINES)} showNotes={false} label={t('tester.fileTitle')} />
              </div>
              {fileLines.length > MAX_SHOWN_LINES && !showAllLines && (
                <div class="notice__foot">
                  <button type="button" class="btn btn--small btn--ghost" onClick={() => setShowAllLines(true)}>
                    {t('common.show')} {fileLines.length - MAX_SHOWN_LINES} {t('common.lines')}
                  </button>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
