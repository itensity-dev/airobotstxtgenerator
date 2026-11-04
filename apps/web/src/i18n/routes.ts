import { LOCALES, type Locale } from './locales';

export type PageKind = 'tool' | 'directory' | 'guide' | 'info' | 'legal' | 'hub';

export type PageId =
  | 'home'
  | 'tester'
  | 'bots'
  | 'server-rules'
  | 'server-nginx'
  | 'server-apache'
  | 'server-caddy'
  | 'server-cloudflare'
  | 'server-frameworks'
  | 'llms-txt'
  | 'content-signals'
  | 'tdmrep'
  | 'meta-tags'
  | 'guides'
  | 'guide-training-search'
  | 'guide-syntax'
  | 'guide-eu-ai-act'
  | 'guide-bad-bots'
  | 'about'
  | 'checker-bot'
  | 'privacy'
  | 'terms'
  | 'licenses';

interface RouteDef {
  kind: PageKind;
  parent?: PageId;
  /** Path segment per locale (without the parent's segments). */
  slug: Record<Locale, string>;
}

const same = (s: string): Record<Locale, string> => Object.fromEntries(LOCALES.map((l) => [l, s])) as Record<Locale, string>;

export const ROUTES: Record<PageId, RouteDef> = {
  home: { kind: 'tool', slug: same('') },
  tester: {
    kind: 'tool',
    slug: {
      en: 'robots-txt-tester',
      de: 'robots-txt-tester',
      fr: 'tester-robots-txt',
      es: 'verificador-robots-txt',
      it: 'verifica-robots-txt',
      nl: 'robots-txt-checker',
      pl: 'tester-robots-txt',
      'pt-br': 'verificador-robots-txt',
      ja: 'robots-txt-tester',
    },
  },
  bots: {
    kind: 'directory',
    slug: {
      en: 'bots',
      de: 'ki-crawler',
      fr: 'robots-ia',
      es: 'bots-ia',
      it: 'bot-ai',
      nl: 'ai-bots',
      pl: 'boty-ai',
      'pt-br': 'bots-de-ia',
      ja: 'bots',
    },
  },
  'server-rules': {
    kind: 'tool',
    slug: {
      en: 'server-rules',
      de: 'serverregeln',
      fr: 'regles-serveur',
      es: 'reglas-servidor',
      it: 'regole-server',
      nl: 'serverregels',
      pl: 'reguly-serwera',
      'pt-br': 'regras-de-servidor',
      ja: 'server-rules',
    },
  },
  'server-nginx': { kind: 'tool', parent: 'server-rules', slug: same('nginx') },
  'server-apache': { kind: 'tool', parent: 'server-rules', slug: same('apache') },
  'server-caddy': { kind: 'tool', parent: 'server-rules', slug: same('caddy') },
  'server-cloudflare': { kind: 'tool', parent: 'server-rules', slug: same('cloudflare') },
  'server-frameworks': { kind: 'tool', parent: 'server-rules', slug: same('frameworks') },
  'llms-txt': {
    kind: 'tool',
    slug: {
      en: 'llms-txt-generator',
      de: 'llms-txt-generator',
      fr: 'generateur-llms-txt',
      es: 'generador-llms-txt',
      it: 'generatore-llms-txt',
      nl: 'llms-txt-generator',
      pl: 'generator-llms-txt',
      'pt-br': 'gerador-llms-txt',
      ja: 'llms-txt-generator',
    },
  },
  'content-signals': { kind: 'tool', slug: same('content-signals') },
  tdmrep: { kind: 'tool', slug: same('tdmrep') },
  'meta-tags': {
    kind: 'tool',
    slug: {
      en: 'ai-meta-tags',
      de: 'ki-meta-tags',
      fr: 'balises-meta-ia',
      es: 'etiquetas-meta-ia',
      it: 'meta-tag-ai',
      nl: 'ai-meta-tags',
      pl: 'meta-tagi-ai',
      'pt-br': 'meta-tags-ia',
      ja: 'ai-meta-tags',
    },
  },
  guides: {
    kind: 'hub',
    slug: {
      en: 'guides',
      de: 'ratgeber',
      fr: 'guides',
      es: 'guias',
      it: 'guide',
      nl: 'handleidingen',
      pl: 'poradniki',
      'pt-br': 'guias',
      ja: 'guides',
    },
  },
  'guide-training-search': {
    kind: 'guide',
    parent: 'guides',
    slug: {
      en: 'block-ai-training-keep-ai-search',
      de: 'ki-training-blockieren-ki-suche-erlauben',
      fr: 'bloquer-entrainement-ia-rester-visible',
      es: 'bloquear-entrenamiento-ia-seguir-visible',
      it: 'bloccare-addestramento-ai-restare-visibili',
      nl: 'ai-training-blokkeren-zichtbaar-blijven',
      pl: 'blokowanie-trenowania-ai-widocznosc',
      'pt-br': 'bloquear-treinamento-ia-manter-visibilidade',
      ja: 'block-ai-training-keep-ai-search',
    },
  },
  'guide-syntax': {
    kind: 'guide',
    parent: 'guides',
    slug: {
      en: 'robots-txt-syntax',
      de: 'robots-txt-syntax',
      fr: 'syntaxe-robots-txt',
      es: 'sintaxis-robots-txt',
      it: 'sintassi-robots-txt',
      nl: 'robots-txt-syntaxis',
      pl: 'skladnia-robots-txt',
      'pt-br': 'sintaxe-robots-txt',
      ja: 'robots-txt-syntax',
    },
  },
  'guide-eu-ai-act': {
    kind: 'guide',
    parent: 'guides',
    slug: {
      en: 'eu-ai-act-tdm-opt-out',
      de: 'ki-opt-out-tdm-vorbehalt',
      fr: 'opt-out-ia-fouille-textes-donnees',
      es: 'reserva-derechos-mineria-textos-datos',
      it: 'opt-out-ai-estrazione-testo-dati',
      nl: 'ai-opt-out-tdm-voorbehoud',
      pl: 'opt-out-ai-eksploracja-tekstow-i-danych',
      'pt-br': 'opt-out-ia-direitos-autorais',
      ja: 'ai-training-opt-out-copyright',
    },
  },
  'guide-bad-bots': {
    kind: 'guide',
    parent: 'guides',
    slug: {
      en: 'robots-txt-bad-bots',
      de: 'robots-txt-schuetzt-nicht-vor-bad-bots',
      fr: 'robots-txt-bots-malveillants',
      es: 'robots-txt-no-protege-bots-maliciosos',
      it: 'robots-txt-non-blocca-bot-malevoli',
      nl: 'robots-txt-beschermt-niet-tegen-kwaadaardige-bots',
      pl: 'robots-txt-nie-chroni-przed-zlosliwymi-botami',
      'pt-br': 'robots-txt-nao-protege-contra-bots-maliciosos',
      ja: 'robots-txt-bad-bots',
    },
  },
  about: {
    kind: 'info',
    slug: {
      en: 'about',
      de: 'ueber-uns',
      fr: 'a-propos',
      es: 'acerca-de',
      it: 'chi-siamo',
      nl: 'over-ons',
      pl: 'o-nas',
      'pt-br': 'sobre',
      ja: 'about',
    },
  },
  'checker-bot': { kind: 'info', slug: same('checker-bot') },
  privacy: {
    kind: 'legal',
    slug: {
      en: 'privacy',
      de: 'datenschutz',
      fr: 'confidentialite',
      es: 'privacidad',
      it: 'privacy',
      nl: 'privacy',
      pl: 'polityka-prywatnosci',
      'pt-br': 'privacidade',
      ja: 'privacy',
    },
  },
  terms: {
    kind: 'legal',
    slug: {
      en: 'terms',
      de: 'nutzungsbedingungen',
      fr: 'conditions-utilisation',
      es: 'terminos-de-uso',
      it: 'termini-di-utilizzo',
      nl: 'gebruiksvoorwaarden',
      pl: 'regulamin',
      'pt-br': 'termos-de-uso',
      ja: 'terms',
    },
  },
  licenses: {
    kind: 'legal',
    slug: {
      en: 'licenses',
      de: 'lizenzen',
      fr: 'licences',
      es: 'licencias',
      it: 'licenze',
      nl: 'licenties',
      pl: 'licencje',
      'pt-br': 'licencas',
      ja: 'licenses',
    },
  },
};

export const PAGE_IDS = Object.keys(ROUTES) as PageId[];

function segments(locale: Locale, id: PageId): string[] {
  const r = ROUTES[id];
  const own = r.slug[locale];
  return [...(r.parent ? segments(locale, r.parent) : []), ...(own ? [own] : [])];
}

/** URL path for a page, always with a trailing slash: /de/ki-crawler/ */
export function pathFor(locale: Locale, id: PageId): string {
  const segs = [...(locale === 'en' ? [] : [locale]), ...segments(locale, id)];
  return '/' + segs.map((s) => s + '/').join('');
}

export function botPath(locale: Locale, botId: string): string {
  return pathFor(locale, 'bots') + botId + '/';
}

/** Markdown twin of a page: same path + .md (`/` → `/index.md`, `/de/` → `/de/index.md`). */
export function markdownPath(path: string): string {
  const isHome = path === '/' || (LOCALES as readonly string[]).some((l) => path === `/${l}/`);
  return isHome ? path + 'index.md' : path.replace(/\/$/, '') + '.md';
}

export interface ResolvedRoute {
  locale: Locale;
  id: PageId;
  botId?: string;
}
