import { useMemo, useState } from 'preact/hooks';
import { buildServerRules, SERVER_TARGETS, type Bot, type ServerTarget } from '@airobots/core';
import { makeT, type Dict } from '../lib/i18n-client';
import { CopyButton, track } from './shared';
import type { GenBot } from './Generator';

interface Props {
  dict: Dict;
  bots: GenBot[];
  initialTarget: ServerTarget;
  targets?: ServerTarget[];
}

const LABELS: Record<ServerTarget, string> = {
  nginx: 'nginx',
  apache: 'Apache .htaccess',
  caddy: 'Caddy',
  cloudflare: 'Cloudflare WAF',
  express: 'Express / Node.js',
  nextjs: 'Next.js',
  django: 'Django',
  php: 'PHP / WordPress',
};

type Preset = 'training' | 'all' | 'custom';

export default function ServerRules(props: Props) {
  const t = makeT(props.dict);
  const targets = props.targets ?? SERVER_TARGETS;
  const [target, setTarget] = useState<ServerTarget>(props.initialTarget);
  const [preset, setPreset] = useState<Preset>('training');
  const [status, setStatus] = useState<403 | 404 | 410>(403);
  const candidates = props.bots.filter((b) => !b.general);
  const [picked, setPicked] = useState<Set<string>>(new Set(candidates.filter((b) => b.purpose === 'training' || b.purpose === 'mixed').map((b) => b.id)));

  const selected = useMemo(() => {
    if (preset === 'training') return candidates.filter((b) => b.purpose === 'training' || b.purpose === 'mixed');
    if (preset === 'all') return candidates;
    return candidates.filter((b) => picked.has(b.id));
  }, [preset, picked]);

  const result = useMemo(() => buildServerRules(target, selected as Bot[], { status }), [target, selected, status]);

  return (
    <div class="tool tool--even">
      <form class="panel" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend class="section-label">
            <span class="sec">§1</span> {t('server.target')}
          </legend>
          <div class="choices">
            {targets.map((x) => (
              <label class="choice" key={x}>
                <input type="radio" name="srv-target" checked={target === x} onChange={() => setTarget(x)} />
                <span>
                  <strong>{LABELS[x]}</strong>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend class="section-label">
            <span class="sec">§2</span> {t('server.bots')}
          </legend>
          <div class="choices choices--wide">
            {(['training', 'all', 'custom'] as const).map((p) => (
              <label class="choice" key={p}>
                <input type="radio" name="srv-preset" checked={preset === p} onChange={() => setPreset(p)} />
                <span>
                  <strong>{t(`server.preset.${p}`)}</strong>
                </span>
              </label>
            ))}
          </div>
          {preset === 'custom' && (
            <ul class="check-list">
              {candidates.map((b) => (
                <li key={b.id}>
                  <label class="row small">
                    <input
                      type="checkbox"
                      checked={picked.has(b.id)}
                      onChange={(e) => {
                        const n = new Set(picked);
                        if (e.currentTarget.checked) n.add(b.id);
                        else n.delete(b.id);
                        setPicked(n);
                      }}
                    />
                    <code>{b.token}</code> <span class="muted">{b.kind === 'token' ? t('purpose.token') : t(`purpose.${b.purpose}`)}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </fieldset>
        <fieldset>
          <legend class="section-label">
            <span class="sec">§3</span> {t('server.status')}
          </legend>
          <select value={String(status)} onChange={(e) => setStatus(Number(e.currentTarget.value) as 403 | 404 | 410)} aria-label={t('server.status')}>
            <option value="403">403 Forbidden</option>
            <option value="404">404 Not Found</option>
            <option value="410">410 Gone</option>
          </select>
        </fieldset>
      </form>
      <section class="panel" aria-labelledby="srv-out">
        <div class="notice">
          <div class="notice__head">
            <h2 id="srv-out" class="notice__title">
              {LABELS[target]} · {t('server.patterns', { count: result.patterns.length })}
            </h2>
            <span onClick={() => track('Copy server rules', { target })}>
              <CopyButton text={result.code} dict={props.dict} label={t('server.copy')} />
            </span>
          </div>
          <pre class="notice__pre">
            <code>{result.code}</code>
          </pre>
        </div>
        <div class="small" aria-live="polite">
          {result.skipped.length > 0 && <p class="callout">{t('server.skipped', { names: result.skipped.join(', ') })}</p>}
          {result.ambiguous.length > 0 && <p class="callout">{t('server.ambiguous', { names: result.ambiguous.join(', ') })}</p>}
          {result.warnings
            .filter((w) => w.includes('4096'))
            .map((w) => (
              <p class="callout callout--warn">{w}</p>
            ))}
        </div>
      </section>
    </div>
  );
}
