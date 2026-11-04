export const LOCALES = ['en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'pt-br', 'ja'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export interface LocaleInfo {
  /** BCP 47 tag for hreflang and <html lang>. */
  hreflang: string;
  /** Locale for Intl formatting. */
  intl: string;
  /** Native name for the language switcher. */
  name: string;
  /** EU member-state language: pages get EU AI Act / TDM paragraphs. */
  eu: boolean;
  /** og:locale */
  og: string;
}

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  en: { hreflang: 'en', intl: 'en-GB', name: 'English', eu: false, og: 'en_US' },
  de: { hreflang: 'de', intl: 'de-DE', name: 'Deutsch', eu: true, og: 'de_DE' },
  fr: { hreflang: 'fr', intl: 'fr-FR', name: 'Français', eu: true, og: 'fr_FR' },
  es: { hreflang: 'es', intl: 'es-ES', name: 'Español', eu: true, og: 'es_ES' },
  it: { hreflang: 'it', intl: 'it-IT', name: 'Italiano', eu: true, og: 'it_IT' },
  nl: { hreflang: 'nl', intl: 'nl-NL', name: 'Nederlands', eu: true, og: 'nl_NL' },
  pl: { hreflang: 'pl', intl: 'pl-PL', name: 'Polski', eu: true, og: 'pl_PL' },
  'pt-br': { hreflang: 'pt-BR', intl: 'pt-BR', name: 'Português (Brasil)', eu: false, og: 'pt_BR' },
  ja: { hreflang: 'ja', intl: 'ja-JP', name: '日本語', eu: false, og: 'ja_JP' },
};

/**
 * Languages published on the site: a language appears only when every page, bot text and UI key
 * exists (CI additionally runs scripts/i18n-check.ts for placeholders and links).
 */
const contentFiles = Object.keys(import.meta.glob('../content/*/*.{md,json}'));
const uiFiles = import.meta.glob<{ default: Record<string, unknown> }>('./ui/*.json', {
  eager: true,
});
function filesOf(l: string): Set<string> {
  return new Set(
    contentFiles
      .filter((f) => f.startsWith(`../content/${l}/`))
      .map((f) => f.slice(`../content/${l}/`.length)),
  );
}
function keyCount(o: Record<string, unknown>): number {
  return Object.values(o).reduce<number>(
    (n, v) => n + (typeof v === 'string' ? 1 : keyCount(v as Record<string, unknown>)),
    0,
  );
}
const enFiles = filesOf('en');
const enKeys = keyCount(uiFiles['./ui/en.json']?.default ?? {});
export const PUBLISHED_LOCALES: Locale[] = LOCALES.filter((l) => {
  if (l === 'en') return true;
  const ui = uiFiles[`./ui/${l}.json`]?.default;
  if (!ui || keyCount(ui) < enKeys) return false;
  const files = filesOf(l);
  return [...enFiles].every((f) => files.has(f));
});

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

export function formatDate(iso: string, locale: Locale, style: 'long' | 'medium' = 'long'): string {
  const d = new Date(iso.length === 4 ? `${iso}-01-01` : iso.length === 7 ? `${iso}-01` : iso);
  const opts: Intl.DateTimeFormatOptions =
    iso.length === 4
      ? { year: 'numeric', timeZone: 'UTC' }
      : iso.length === 7
        ? { year: 'numeric', month: 'long', timeZone: 'UTC' }
        : {
            year: 'numeric',
            month: style === 'long' ? 'long' : 'short',
            day: 'numeric',
            timeZone: 'UTC',
          };
  return new Intl.DateTimeFormat(LOCALE_INFO[locale].intl, opts).format(d);
}

export function formatNumber(n: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_INFO[locale].intl).format(n);
}
