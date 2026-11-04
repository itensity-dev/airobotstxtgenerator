import { useMemo, useState } from 'preact/hooks';
import { buildLlmsTxt, validateLlmsTxt, type LlmsTxtSection } from '@airobots/core';
import { makeT, type Dict } from '../lib/i18n-client';
import { CopyButton, download, track } from './shared';

interface Props {
  dict: Dict;
}

const EXAMPLE: { name: string; summary: string; details: string; sections: LlmsTxtSection[] } = {
  name: 'Example Docs',
  summary:
    'Example is an open-source library for parsing invoices. This file lists the pages most useful to language models.',
  details:
    'The API is stable since version 2.0. Prefer the Markdown versions of pages (same URL + .md).',
  sections: [
    {
      title: 'Docs',
      links: [
        {
          title: 'Quick start',
          url: 'https://example.com/docs/start.md',
          description: 'Install and parse a first invoice',
        },
        {
          title: 'API reference',
          url: 'https://example.com/docs/api.md',
          description: 'All functions with parameters',
        },
      ],
    },
    {
      title: 'Examples',
      links: [
        {
          title: 'Batch processing',
          url: 'https://example.com/examples/batch.md',
          description: '',
        },
      ],
    },
    {
      title: 'Optional',
      optional: true,
      links: [{ title: 'Changelog', url: 'https://example.com/changelog.md', description: '' }],
    },
  ],
};

export default function LlmsTxt(props: Props) {
  const t = makeT(props.dict);
  const [name, setName] = useState(EXAMPLE.name);
  const [summary, setSummary] = useState(EXAMPLE.summary);
  const [details, setDetails] = useState(EXAMPLE.details);
  const [sections, setSections] = useState<LlmsTxtSection[]>(EXAMPLE.sections);
  const text = useMemo(
    () => buildLlmsTxt({ name, summary, details, sections }),
    [name, summary, details, sections],
  );
  const issues = useMemo(() => validateLlmsTxt(text), [text]);

  const update = (si: number, fn: (s: LlmsTxtSection) => LlmsTxtSection) =>
    setSections(sections.map((s, i) => (i === si ? fn(s) : s)));

  return (
    <div class="tool tool--even">
      <form class="panel" onSubmit={(e) => e.preventDefault()}>
        <div class="field">
          <label for="llms-name">{t('llms.name')}</label>
          <input
            id="llms-name"
            type="text"
            value={name}
            onInput={(e) => setName(e.currentTarget.value)}
          />
        </div>
        <div class="field">
          <label for="llms-summary">{t('llms.summary')}</label>
          <textarea
            id="llms-summary"
            class="textarea--short"
            value={summary}
            onInput={(e) => setSummary(e.currentTarget.value)}
          />
          <span class="field__hint">{t('llms.summaryHint')}</span>
        </div>
        <div class="field">
          <label for="llms-details">{t('llms.details')}</label>
          <textarea
            id="llms-details"
            class="textarea--short"
            value={details}
            onInput={(e) => setDetails(e.currentTarget.value)}
          />
        </div>
        {sections.map((s, si) => (
          <fieldset key={si} class="llms-section">
            <legend class="section-label">
              <span class="sec">##</span>
              <input
                type="text"
                aria-label={t('llms.sectionTitle')}
                value={s.title}
                onInput={(e) => update(si, (x) => ({ ...x, title: e.currentTarget.value }))}
              />
            </legend>
            <label class="row small">
              <input
                type="checkbox"
                checked={!!s.optional}
                onChange={(e) => update(si, (x) => ({ ...x, optional: e.currentTarget.checked }))}
              />{' '}
              {t('llms.optional')}
            </label>
            {s.links.map((l, li) => (
              <div class="llms-link" key={li}>
                <input
                  type="text"
                  aria-label={t('llms.linkTitle')}
                  placeholder={t('llms.linkTitle')}
                  value={l.title}
                  onInput={(e) =>
                    update(si, (x) => ({
                      ...x,
                      links: x.links.map((y, j) =>
                        j === li ? { ...y, title: e.currentTarget.value } : y,
                      ),
                    }))
                  }
                />
                <input
                  type="url"
                  aria-label="URL"
                  placeholder="https://"
                  value={l.url}
                  onInput={(e) =>
                    update(si, (x) => ({
                      ...x,
                      links: x.links.map((y, j) =>
                        j === li ? { ...y, url: e.currentTarget.value } : y,
                      ),
                    }))
                  }
                />
                <input
                  type="text"
                  aria-label={t('llms.linkDesc')}
                  placeholder={t('llms.linkDesc')}
                  value={l.description ?? ''}
                  onInput={(e) =>
                    update(si, (x) => ({
                      ...x,
                      links: x.links.map((y, j) =>
                        j === li ? { ...y, description: e.currentTarget.value } : y,
                      ),
                    }))
                  }
                />
                <button
                  type="button"
                  class="btn btn--ghost btn--small"
                  onClick={() =>
                    update(si, (x) => ({ ...x, links: x.links.filter((_, j) => j !== li) }))
                  }
                >
                  {t('common.remove')}
                </button>
              </div>
            ))}
            <div class="row">
              <button
                type="button"
                class="btn btn--ghost btn--small"
                onClick={() =>
                  update(si, (x) => ({
                    ...x,
                    links: [...x.links, { title: '', url: '', description: '' }],
                  }))
                }
              >
                {t('llms.addLink')}
              </button>
              <button
                type="button"
                class="btn btn--ghost btn--small"
                onClick={() => setSections(sections.filter((_, i) => i !== si))}
              >
                {t('llms.removeSection')}
              </button>
            </div>
          </fieldset>
        ))}
        <button
          type="button"
          class="btn btn--ghost"
          onClick={() =>
            setSections([
              ...sections,
              { title: 'Section', links: [{ title: '', url: '', description: '' }] },
            ])
          }
        >
          {t('llms.addSection')}
        </button>
      </form>
      <section class="panel" aria-labelledby="llms-out">
        <div class="notice">
          <div class="notice__head">
            <h2 id="llms-out" class="notice__title">
              llms.txt
            </h2>
            <span class="row">
              <CopyButton text={text} dict={props.dict} />
              <button
                type="button"
                class="btn btn--small btn--ghost"
                onClick={() => {
                  download('llms.txt', text, 'text/markdown');
                  track('Generate llms.txt');
                }}
              >
                {t('common.download')}
              </button>
            </span>
          </div>
          <pre class="notice__pre" tabIndex={0}>
            <code>{text}</code>
          </pre>
        </div>
        <div aria-live="polite" class="small">
          {issues.length === 0 ? (
            <p class="callout callout--ok">{t('llms.valid')}</p>
          ) : (
            issues.map((i) => (
              <p class="callout callout--warn">
                {t('common.lineShort', { n: i.line })}: {i.message}
              </p>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
