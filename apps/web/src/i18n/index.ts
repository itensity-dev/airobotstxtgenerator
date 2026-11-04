import { DEFAULT_LOCALE, LOCALES, type Locale } from './locales';

type Nested = { [k: string]: string | Nested };
export type Dict = Record<string, string>;

const modules = import.meta.glob<{ default: Nested }>('./ui/*.json', { eager: true });

function flatten(obj: Nested, prefix = '', out: Dict = {}): Dict {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') out[key] = v;
    else flatten(v, key, out);
  }
  return out;
}

export const DICTS: Record<string, Dict> = {};
for (const [path, mod] of Object.entries(modules)) {
  const locale = path.replace('./ui/', '').replace('.json', '');
  DICTS[locale] = flatten(mod.default);
}

export function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (m, k: string) =>
    params[k] !== undefined ? String(params[k]) : m,
  );
}

export function t(locale: Locale, key: string, params?: Record<string, string | number>): string {
  const s = DICTS[locale]?.[key] ?? DICTS[DEFAULT_LOCALE]?.[key];
  if (s === undefined) {
    if (import.meta.env?.DEV) console.warn(`[i18n] missing key ${key}`);
    return key;
  }
  return interpolate(s, params);
}

export function translator(locale: Locale) {
  return (key: string, params?: Record<string, string | number>) => t(locale, key, params);
}

/** Subset of the dictionary for an island (keeps client payloads small). */
export function pick(locale: Locale, prefixes: string[]): Dict {
  const base = DICTS[DEFAULT_LOCALE] ?? {};
  const loc = DICTS[locale] ?? {};
  const out: Dict = {};
  for (const k of Object.keys(base)) {
    if (prefixes.some((p) => k.startsWith(p))) out[k] = loc[k] ?? base[k]!;
  }
  return out;
}

export { LOCALES };
export * from './locales';
export * from './routes';
