import { useMemo, useState } from 'preact/hooks';
import { buildContentSignal, buildContentUsage, buildTdmRep } from '@airobots/core';
import { makeT, type Dict } from '../lib/i18n-client';
import { CopyButton } from './shared';

interface Props {
  dict: Dict;
  mode: 'signals' | 'tdmrep';
}

type YN = '' | 'yes' | 'no';

function Out({ title, text, dict }: { title: string; text: string; dict: Dict }) {
  return (
    <div class="notice signal-out">
      <div class="notice__head">
        <h3 class="notice__title">{title}</h3>
        <CopyButton text={text} dict={dict} />
      </div>
      <pre class="notice__pre">
        <code>{text}</code>
      </pre>
    </div>
  );
}

export default function Signals(props: Props) {
  const t = makeT(props.dict);
  const [search, setSearch] = useState<YN>('yes');
  const [aiInput, setAiInput] = useState<YN>('yes');
  const [aiTrain, setAiTrain] = useState<YN>('no');
  const [usageToken, setUsageToken] = useState(true);
  const [reservation, setReservation] = useState<0 | 1>(1);
  const [policy, setPolicy] = useState('');

  const signals = useMemo(() => {
    const o: Record<string, 'yes' | 'no'> = {};
    if (search) o.search = search;
    if (aiInput) o['ai-input'] = aiInput;
    if (aiTrain) o['ai-train'] = aiTrain;
    return buildContentSignal(o);
  }, [search, aiInput, aiTrain]);
  const usage = useMemo(
    () =>
      buildContentUsage({
        ...(aiTrain ? { 'train-ai': aiTrain === 'yes' ? 'y' : 'n' } : {}),
        ...(aiInput ? { 'ai-use': aiInput === 'yes' ? 'y' : 'n' } : {}),
        ...(search ? { search: search === 'yes' ? 'y' : 'n' } : {}),
      } as Parameters<typeof buildContentUsage>[0]),
    [search, aiInput, aiTrain],
  );
  const shared = aiTrain === 'no' && usageToken ? '\n# Shared AI-training opt-out (proposal, 2026)\nUser-agent: __usage_ai-training\nDisallow: /\n' : '';
  const tdm = useMemo(() => buildTdmRep([{ reservation, policy }]), [reservation, policy]);

  const sel = (label: string, v: YN, set: (x: YN) => void) => (
    <label class="field">
      <span class="label">
        <code>{label}</code>
      </span>
      <select value={v} onChange={(e) => set(e.currentTarget.value as YN)}>
        <option value="">{t('signals.unset')}</option>
        <option value="yes">yes</option>
        <option value="no">no</option>
      </select>
    </label>
  );

  if (props.mode === 'tdmrep') {
    return (
      <div class="tool tool--even">
        <form class="panel" onSubmit={(e) => e.preventDefault()}>
          <fieldset>
            <legend class="section-label">
              <span class="sec">§1</span> tdm-reservation
            </legend>
            <div class="choices choices--wide">
              <label class="choice">
                <input type="radio" name="tdm-r" checked={reservation === 1} onChange={() => setReservation(1)} />
                <span>
                  <strong>1 — {t('tdm.reserved')}</strong>
                  <span class="choice__hint">{t('tdm.reservedHint')}</span>
                </span>
              </label>
              <label class="choice">
                <input type="radio" name="tdm-r" checked={reservation === 0} onChange={() => setReservation(0)} />
                <span>
                  <strong>0 — {t('tdm.notReserved')}</strong>
                  <span class="choice__hint">{t('tdm.notReservedHint')}</span>
                </span>
              </label>
            </div>
          </fieldset>
          <div class="field">
            <label for="tdm-policy">tdm-policy</label>
            <input id="tdm-policy" type="url" placeholder="https://example.com/tdm-policy.json" value={policy} onInput={(e) => setPolicy(e.currentTarget.value)} />
            <span class="field__hint">{t('tdm.policyHint')}</span>
          </div>
        </form>
        <section class="panel">
          <Out title="/.well-known/tdmrep.json" text={tdm.json} dict={props.dict} />
          <Out title={t('tdm.headers')} text={tdm.headers} dict={props.dict} />
          <Out title="HTML <head>" text={tdm.meta} dict={props.dict} />
          <Out title="nginx" text={tdm.nginx} dict={props.dict} />
          <Out title="Apache" text={tdm.apache} dict={props.dict} />
        </section>
      </div>
    );
  }

  return (
    <div class="tool tool--even">
      <form class="panel" onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend class="section-label">
            <span class="sec">§1</span> {t('signals.choose')}
          </legend>
          <div class="row">
            {sel('search', search, setSearch)}
            {sel('ai-input', aiInput, setAiInput)}
            {sel('ai-train', aiTrain, setAiTrain)}
          </div>
          <p class="field__hint">{t('signals.hint')}</p>
          <label class="row small">
            <input type="checkbox" checked={usageToken} onChange={(e) => setUsageToken(e.currentTarget.checked)} /> {t('signals.usageToken')}
          </label>
        </fieldset>
      </form>
      <section class="panel">
        <Out title={t('signals.cloudflare')} text={signals + shared} dict={props.dict} />
        <Out title={t('signals.aipref')} text={`User-agent: *\nAllow: /\n${usage.robotsLine}\n`} dict={props.dict} />
        <Out title={t('signals.header')} text={usage.header + '\n'} dict={props.dict} />
      </section>
    </div>
  );
}
