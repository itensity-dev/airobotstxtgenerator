import { useEffect, useMemo, useState } from 'preact/hooks';
import {
  SITE_TYPE_PRESETS,
  generateRobotsTxt,
  mergeIntoExisting,
  verifyPolicy,
  type Access,
  type Bot,
  type ContentSignals,
  type Goal,
  type PathException,
  type SiteType,
} from '@airobots/core';
import { makeT, type Dict } from '../lib/i18n-client';
import { CopyButton, NoticeLines, classifyLine, download, track, type NoticeLine } from './shared';

export type GenBot = Pick<
  Bot,
  | 'id'
  | 'name'
  | 'token'
  | 'purpose'
  | 'kind'
  | 'general'
  | 'respectsRobots'
  | 'legacy'
  | 'uaMatch'
  | 'verification'
  | 'lastVerified'
  | 'checkMethod'
  | 'source'
  | 'page'
  | 'summary'
  | 'operator'
  | 'operatorName'
>;

interface Props {
  dict: Dict;
  bots: GenBot[];
  communityCount: number;
  communityUrl: string;
  /** Operator id → display name. */
  operators: Record<string, string>;
  /** Verification of the initial example, computed at build time. */
  initialCheck?: { text: string; agents: number; paths: number; failed: number; count: number };
  testerHref: string;
  date: string;
  initialSiteType?: SiteType;
  initialGoal?: Goal;
}

const SITE_TYPES: SiteType[] = ['blog', 'news', 'shop', 'docs', 'saas', 'other'];
const GOALS: Goal[] = ['block-training', 'block-all-ai', 'allow-all', 'custom'];
type Signal = '' | 'yes' | 'no';

const lines = (s: string) =>
  s
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);

export default function Generator(props: Props) {
  const t = makeT(props.dict);
  const [mode, setMode] = useState<'new' | 'merge'>('new');
  const [siteType, setSiteType] = useState<SiteType>(props.initialSiteType ?? 'blog');
  const [goal, setGoal] = useState<Goal>(props.initialGoal ?? 'block-training');
  const [custom, setCustom] = useState<Record<string, Access>>({});
  const [exceptions, setExceptions] = useState<PathException[]>(SITE_TYPE_PRESETS.blog.exceptions);
  const [globalDisallow, setGlobalDisallow] = useState<string>(
    SITE_TYPE_PRESETS.blog.globalDisallow.join('\n'),
  );
  const [sitemaps, setSitemaps] = useState('https://example.com/sitemap.xml');
  const [signals, setSignals] = useState<Record<'search' | 'ai-input' | 'ai-train', Signal>>({
    search: '',
    'ai-input': '',
    'ai-train': '',
  });
  const [includeCommunity, setIncludeCommunity] = useState(false);
  const [community, setCommunity] = useState<GenBot[] | null>(null);
  const [comments, setComments] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [existing, setExisting] = useState('');
  const [existingBots, setExistingBots] = useState<'keep' | 'replace'>('keep');
  const [newPath, setNewPath] = useState('');
  const [newAccess, setNewAccess] = useState<Access>('allow');

  // Pre-fill custom choices from the current goal when switching to "custom".
  useEffect(() => {
    if (goal !== 'custom' || Object.keys(custom).length > 0) return;
    const init: Record<string, Access> = {};
    for (const b of props.bots)
      init[b.id] =
        !b.general && (b.purpose === 'training' || b.purpose === 'mixed') ? 'block' : 'allow';
    setCustom(init);
  }, [goal]);

  useEffect(() => {
    if (!includeCommunity || community) return;
    fetch(props.communityUrl)
      .then((r) => r.json())
      .then((j: { community?: { bots: GenBot[] } }) => setCommunity(j.community?.bots ?? []))
      .catch(() => setCommunity([]));
  }, [includeCommunity]);

  const chooseSiteType = (s: SiteType) => {
    setSiteType(s);
    const p = SITE_TYPE_PRESETS[s];
    setGoal(p.goal);
    setExceptions(p.exceptions);
    setGlobalDisallow(p.globalDisallow.join('\n'));
  };

  const allBots = useMemo(
    () => [...props.bots, ...(includeCommunity && community ? community : [])] as Bot[],
    [props.bots, includeCommunity, community],
  );
  const contentSignals: ContentSignals | null = useMemo(() => {
    const o: ContentSignals = {};
    for (const k of ['search', 'ai-input', 'ai-train'] as const)
      if (signals[k]) o[k] = signals[k] as 'yes' | 'no';
    return Object.keys(o).length ? o : null;
  }, [signals]);

  const result = useMemo(
    () =>
      generateRobotsTxt(allBots, {
        goal,
        siteType,
        custom,
        exceptions,
        globalDisallow: lines(globalDisallow),
        sitemaps: lines(sitemaps),
        contentSignals,
        comments,
        date: props.date,
        verify: false,
      }),
    [
      allBots,
      goal,
      siteType,
      custom,
      exceptions,
      globalDisallow,
      sitemaps,
      contentSignals,
      comments,
    ],
  );

  const merged = useMemo(
    () =>
      mode === 'merge' && existing.trim() !== ''
        ? mergeIntoExisting(existing, allBots, {
            goal,
            custom,
            exceptions,
            contentSignals,
            comments,
            existingBots,
            date: props.date,
          })
        : null,
    [mode, existing, allBots, goal, custom, exceptions, contentSignals, comments, existingBots],
  );

  const outText = mode === 'merge' ? (merged?.text ?? '') : result.text;
  // The initial example was verified at build time; verify again only when the file changes.
  const checks = useMemo(() => {
    if (mode === 'merge') return merged?.checks ?? [];
    if (props.initialCheck && result.text === props.initialCheck.text) return null;
    return verifyPolicy(result.text, allBots, {
      access: result.access,
      exceptions: result.exceptions,
      globalRules: result.globalRules,
    });
  }, [mode, merged, result, allBots]);
  const failed = checks ? checks.filter((c) => !c.ok).length : (props.initialCheck?.failed ?? 0);
  const agentsChecked = checks
    ? new Set(checks.map((c) => c.bot)).size
    : (props.initialCheck?.agents ?? 0);
  const pathsChecked = checks
    ? new Set(checks.map((c) => c.path)).size
    : (props.initialCheck?.paths ?? 0);
  const checkCount = checks ? checks.length : (props.initialCheck?.count ?? 0);

  const outLines: NoticeLine[] = useMemo(() => {
    if (mode === 'merge') {
      if (!merged) return [];
      let n = 0;
      return merged.diff
        .filter((d) => d.type !== 'remove' || true)
        .map((d) => {
          if (d.type !== 'remove') n++;
          const l: NoticeLine = {
            text: d.text,
            kind: classifyLine(d.text),
            no: d.type === 'remove' ? null : n,
          };
          if (d.type !== 'same') l.mark = d.type === 'add' ? 'add' : 'remove';
          return l;
        });
    }
    let prevUa = false;
    return result.lines.map((l) => {
      let note = l.note === 'blank' ? '' : t(`note.${l.note}`);
      const isUa = l.note === 'user-agent' || l.note === 'user-agent-token';
      if (isUa && l.ref) {
        const b = allBots.find((x) => x.id === l.ref);
        if (b) {
          const who = props.operators[b.operator] ?? b.operatorName ?? '';
          const what =
            b.kind === 'token'
              ? t('purpose.token')
              : b.general
                ? t('purpose.general')
                : t(`purpose.${b.purpose}`);
          note = prevUa
            ? `${who ? who + ' — ' : ''}${what}`
            : `${who ? who + ' — ' : ''}${what}. ${note}`;
        }
      }
      prevUa = isUa;
      return { text: l.text, note, kind: classifyLine(l.text) };
    });
  }, [mode, merged, result]);

  const nameOf = (id: string) => allBots.find((b) => b.id === id)?.token ?? id;
  const visibility =
    (mode === 'merge' ? merged?.section.blockedVisibility : result.blockedVisibility) ?? [];
  const nonCompliant =
    (mode === 'merge' ? merged?.section.blockedNonCompliant : result.blockedNonCompliant) ?? [];

  const addException = () => {
    const p = newPath.trim();
    if (!p) return;
    setExceptions([
      ...exceptions.filter((e) => e.path !== p),
      { path: p.startsWith('/') || p.startsWith('*') ? p : '/' + p, access: newAccess },
    ]);
    setNewPath('');
  };

  const openInTester = () => {
    try {
      sessionStorage.setItem('tester:paste', outText);
    } catch {
      /* ignore */
    }
    track('Open in tester');
    location.href = props.testerHref + '#paste';
  };

  const byPurpose = (bs: GenBot[]) => {
    const order = ['training', 'mixed', 'unknown', 'search', 'user'];
    return [...bs].sort(
      (a, b) =>
        Number(!!a.general) - Number(!!b.general) ||
        order.indexOf(a.purpose) - order.indexOf(b.purpose) ||
        a.name.localeCompare(b.name),
    );
  };

  return (
    <div class="tool">
      <form class="panel" onSubmit={(e) => e.preventDefault()} aria-label={t('gen.resultTitle')}>
        <div class="tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'new'}
            onClick={() => setMode('new')}
          >
            {t('gen.tabNew')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'merge'}
            onClick={() => setMode('merge')}
          >
            {t('gen.tabMerge')}
          </button>
        </div>

        {mode === 'merge' && (
          <fieldset>
            <legend class="section-label">
              <span class="sec">§0</span> {t('gen.mergeInput')}
            </legend>
            <div class="field">
              <label for="gen-existing" class="visually-hidden">
                {t('gen.mergeInput')}
              </label>
              <textarea
                id="gen-existing"
                value={existing}
                onInput={(e) => setExisting(e.currentTarget.value)}
                spellcheck={false}
                placeholder={'User-agent: *\nDisallow: /wp-admin/'}
              />
              <span class="field__hint">{t('gen.mergeHint')}</span>
            </div>
            <div class="choices choices--wide">
              <label class="choice">
                <input
                  type="radio"
                  name="gen-existing-bots"
                  checked={existingBots === 'keep'}
                  onChange={() => setExistingBots('keep')}
                />
                <span>{t('gen.mergeKeep')}</span>
              </label>
              <label class="choice">
                <input
                  type="radio"
                  name="gen-existing-bots"
                  checked={existingBots === 'replace'}
                  onChange={() => setExistingBots('replace')}
                />
                <span>{t('gen.mergeReplace')}</span>
              </label>
            </div>
          </fieldset>
        )}

        {mode === 'new' && (
          <fieldset>
            <legend class="section-label">
              <span class="sec">§1</span> {t('gen.step1')}
            </legend>
            <div class="choices">
              {SITE_TYPES.map((s) => (
                <label class="choice" key={s}>
                  <input
                    type="radio"
                    name="gen-site"
                    value={s}
                    checked={siteType === s}
                    onChange={() => chooseSiteType(s)}
                  />
                  <span>
                    <strong>{t(`gen.site.${s}`)}</strong>
                    <span class="choice__hint">{t(`gen.site.${s}Hint`)}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend class="section-label">
            <span class="sec">§2</span> {t('gen.step2')}
          </legend>
          <div class="choices choices--wide">
            {GOALS.map((g) => (
              <label class="choice" key={g}>
                <input
                  type="radio"
                  name="gen-goal"
                  value={g}
                  checked={goal === g}
                  onChange={() => setGoal(g)}
                />
                <span>
                  <strong>{t(`gen.goal.${g}`)}</strong>
                  <span class="choice__hint">
                    {t(`gen.goal.${g}Hint`, { count: props.bots.length })}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {goal === 'custom' && (
          <fieldset>
            <legend class="section-label">{t('gen.customTitle')}</legend>
            <div class="row small">
              <span>{t('gen.customAll')}</span>
              <button
                type="button"
                class="btn btn--ghost btn--small"
                onClick={() =>
                  setCustom(
                    Object.fromEntries(
                      props.bots.map((b) => [b.id, b.general ? 'allow' : 'block']),
                    ),
                  )
                }
              >
                {t('gen.customBlock')}
              </button>
              <button
                type="button"
                class="btn btn--ghost btn--small"
                onClick={() =>
                  setCustom(Object.fromEntries(props.bots.map((b) => [b.id, 'allow'])))
                }
              >
                {t('gen.customAllow')}
              </button>
            </div>
            <div class="table-wrap">
              <table class="register">
                <thead>
                  <tr>
                    <th scope="col">{t('gen.customBot')}</th>
                    <th scope="col">{t('gen.customPurpose')}</th>
                    <th scope="col">{t('gen.customAccess')}</th>
                  </tr>
                </thead>
                <tbody>
                  {byPurpose(props.bots).map((b) => {
                    const acc = custom[b.id] ?? 'allow';
                    return (
                      <tr key={b.id} class={acc === 'block' ? 'is-blocked' : 'is-allowed'}>
                        <td class="mono">{b.token}</td>
                        <td>
                          {b.general
                            ? t('purpose.general')
                            : b.kind === 'token'
                              ? t('purpose.token')
                              : t(`purpose.${b.purpose}`)}
                        </td>
                        <td>
                          <span class="row" role="radiogroup" aria-label={b.token}>
                            <label>
                              <input
                                type="radio"
                                name={`c-${b.id}`}
                                checked={acc === 'allow'}
                                onChange={() => setCustom({ ...custom, [b.id]: 'allow' })}
                              />{' '}
                              {t('gen.customAllow')}
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`c-${b.id}`}
                                checked={acc === 'block'}
                                onChange={() => setCustom({ ...custom, [b.id]: 'block' })}
                              />{' '}
                              {t('gen.customBlock')}
                            </label>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend class="section-label">
            <span class="sec">§3</span> {t('gen.step3')}
          </legend>
          <p class="field__hint">{t('gen.exceptionsHint')}</p>
          {exceptions.length > 0 && (
            <ul class="issues">
              {exceptions.map((e) => (
                <li key={e.path}>
                  <span class={`stamp ${e.access === 'allow' ? 'stamp--ok' : 'stamp--no'}`}>
                    {e.access === 'allow' ? t('verdict.allowed') : t('verdict.blocked')}
                  </span>
                  <span class="row">
                    <code>{e.path}</code>
                    <span class="muted">
                      {e.access === 'allow' ? t('gen.exceptionOpen') : t('gen.exceptionClosed')}
                    </span>
                    <button
                      type="button"
                      class="btn btn--ghost btn--small"
                      onClick={() => setExceptions(exceptions.filter((x) => x.path !== e.path))}
                    >
                      {t('common.remove')}
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div class="row">
            <label class="visually-hidden" for="gen-path">
              {t('gen.exceptionPath')}
            </label>
            <input
              id="gen-path"
              type="text"
              placeholder="/blog/"
              value={newPath}
              onInput={(e) => setNewPath(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addException();
                }
              }}
            />
            <label class="visually-hidden" for="gen-access">
              {t('gen.customAccess')}
            </label>
            <select
              id="gen-access"
              value={newAccess}
              onChange={(e) => setNewAccess(e.currentTarget.value as Access)}
            >
              <option value="allow">{t('gen.exceptionOpen')}</option>
              <option value="block">{t('gen.exceptionClosed')}</option>
            </select>
            <button type="button" class="btn btn--ghost" onClick={addException}>
              {t('gen.exceptionAdd')}
            </button>
          </div>
          {mode === 'new' && (
            <>
              <div class="field">
                <label for="gen-global">{t('gen.globalTitle')}</label>
                <textarea
                  id="gen-global"
                  class="textarea--short"
                  value={globalDisallow}
                  onInput={(e) => setGlobalDisallow(e.currentTarget.value)}
                  spellcheck={false}
                  placeholder="/admin/"
                />
                <span class="field__hint">{t('gen.globalHint')}</span>
              </div>
              <div class="field">
                <label for="gen-sitemaps">{t('gen.sitemapTitle')}</label>
                <textarea
                  id="gen-sitemaps"
                  class="textarea--short"
                  value={sitemaps}
                  onInput={(e) => setSitemaps(e.currentTarget.value)}
                  spellcheck={false}
                />
                <span class="field__hint">{t('gen.sitemapHint')}</span>
              </div>
            </>
          )}
        </fieldset>

        <fieldset>
          <legend class="section-label">
            <span class="sec">§4</span> {t('gen.step4')}
          </legend>
          {mode === 'new' && (
            <div class="field">
              <span class="label">{t('gen.signalsTitle')}</span>
              <span class="field__hint">{t('gen.signalsHint')}</span>
              <div class="row">
                {(['search', 'ai-input', 'ai-train'] as const).map((k) => (
                  <label key={k} class="row small">
                    <code>{k}</code>
                    <select
                      value={signals[k]}
                      onChange={(e) =>
                        setSignals({ ...signals, [k]: e.currentTarget.value as Signal })
                      }
                      aria-label={k}
                    >
                      <option value="">{t('gen.signalsNone')}</option>
                      <option value="yes">yes</option>
                      <option value="no">no</option>
                    </select>
                  </label>
                ))}
              </div>
            </div>
          )}
          <label class="row small">
            <input
              type="checkbox"
              checked={includeCommunity}
              onChange={(e) => setIncludeCommunity(e.currentTarget.checked)}
            />
            <span>
              {t('gen.communityTitle', { count: props.communityCount })}
              <br />
              <span class="muted">{t('gen.communityHint')}</span>
            </span>
          </label>
          <label class="row small">
            <input
              type="checkbox"
              checked={comments}
              onChange={(e) => setComments(e.currentTarget.checked)}
            />
            <span>{t('gen.commentsTitle')}</span>
          </label>
        </fieldset>
      </form>

      <section class="panel" aria-labelledby="gen-out-title">
        <div class="notice">
          <div class="notice__head">
            <h2 id="gen-out-title" class="notice__title">
              {t('gen.resultTitle')}
            </h2>
            <label class="row small notes-toggle">
              <input
                type="checkbox"
                checked={showNotes}
                onChange={(e) => setShowNotes(e.currentTarget.checked)}
              />{' '}
              {t('gen.notesToggle')}
            </label>
          </div>
          <div class="notice__body" tabIndex={0} aria-label={t('gen.resultTitle')}>
            {mode === 'merge' && !merged ? (
              <p class="small muted notice__empty">{t('gen.mergeEmpty')}</p>
            ) : (
              <NoticeLines
                lines={outLines}
                showNotes={showNotes && mode === 'new'}
                label={t('gen.resultTitle')}
              />
            )}
          </div>
          <div class="notice__foot">
            <span aria-live="polite">
              {checkCount > 0 &&
                (failed === 0 ? (
                  <span class="stamp stamp--ok stamp--big">
                    {t('gen.verified', { agents: agentsChecked, paths: pathsChecked })}
                  </span>
                ) : (
                  <span class="stamp stamp--no stamp--big">
                    {t('gen.notVerified', { count: failed })}
                  </span>
                ))}
            </span>
            <span class="row">
              <CopyButton text={outText} dict={props.dict} label={t('gen.copy')} />
              <button
                type="button"
                class="btn btn--small btn--ghost"
                onClick={() => {
                  download('robots.txt', outText);
                  track('Generate robots.txt', { goal, siteType, mode });
                }}
              >
                {t('gen.downloadFile')}
              </button>
              <button type="button" class="btn btn--small btn--ghost" onClick={openInTester}>
                {t('gen.openTester')}
              </button>
            </span>
          </div>
        </div>
        <div class="small" aria-live="polite">
          <p>
            {t('gen.summary', {
              blocked:
                (mode === 'merge' ? merged?.section.blocked.length : result.blocked.length) ?? 0,
              allowed:
                (mode === 'merge' ? merged?.section.allowed.length : result.allowed.length) ?? 0,
            })}
          </p>
          {visibility.length > 0 && (
            <p class="callout callout--warn">
              {t('gen.warnVisibility', { names: visibility.map(nameOf).join(', ') })}
            </p>
          )}
          {nonCompliant.length > 0 && (
            <p class="callout">
              {t('gen.warnNonCompliant', { names: nonCompliant.map(nameOf).join(', ') })}
            </p>
          )}
          {mode === 'merge' && merged && (
            <>
              {merged.conflicts.length > 0 && (
                <p class="callout">
                  {t('gen.mergeConflicts', {
                    names: merged.conflicts
                      .map((c) => `${c.token} (${c.lines.join(', ')})`)
                      .join('; '),
                  })}
                </p>
              )}
              <p class={`callout ${merged.equivalence.ok ? 'callout--ok' : 'callout--warn'}`}>
                {merged.equivalence.ok
                  ? t('gen.mergeEquivalent', {
                      agents: merged.equivalence.agents.length,
                      paths: merged.equivalence.paths.length,
                    })
                  : t('gen.mergeNotEquivalent', { count: merged.equivalence.mismatches.length })}
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

/** Defaults of the generator form, shared with the page that pre-computes the first example. */
export const GENERATOR_DEFAULTS = {
  siteType: 'blog' as SiteType,
  goal: 'block-training' as Goal,
  sitemaps: 'https://example.com/sitemap.xml',
};

export function initialCheckFor(bots: GenBot[], date: string): NonNullable<Props['initialCheck']> {
  const r = generateRobotsTxt(bots as Bot[], {
    goal: GENERATOR_DEFAULTS.goal,
    siteType: GENERATOR_DEFAULTS.siteType,
    custom: {},
    exceptions: SITE_TYPE_PRESETS.blog.exceptions,
    globalDisallow: SITE_TYPE_PRESETS.blog.globalDisallow,
    sitemaps: [GENERATOR_DEFAULTS.sitemaps],
    contentSignals: null,
    comments: true,
    date,
  });
  return {
    text: r.text,
    agents: new Set(r.checks.map((c) => c.bot)).size,
    paths: new Set(r.checks.map((c) => c.path)).size,
    failed: r.checks.filter((c) => !c.ok).length,
    count: r.checks.length,
  };
}
