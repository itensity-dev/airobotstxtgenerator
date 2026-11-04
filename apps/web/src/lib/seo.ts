import { BRAND, CONTACT_EMAIL, REPO_URL, SITE_URL, AUTHOR_NAME } from '../config/site';
import { LOCALE_INFO, type Locale } from '../i18n/locales';
import { plainText } from './markdown';

export function webApplication(o: { name: string; description: string; url: string; locale: Locale; category?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: o.name,
    description: o.description,
    url: o.url,
    inLanguage: LOCALE_INFO[o.locale].hreflang,
    applicationCategory: o.category ?? 'DeveloperApplication',
    operatingSystem: 'Any (runs in the browser)',
    browserRequirements: 'Requires JavaScript for the interactive tool',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: BRAND, url: SITE_URL },
  };
}

export function breadcrumbList(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((i, idx) => ({ '@type': 'ListItem', position: idx + 1, name: i.name, item: SITE_URL + i.href })),
  };
}

export function faqPage(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: plainText(f.q),
      acceptedAnswer: { '@type': 'Answer', text: plainText(f.a) },
    })),
  };
}

export function organization() {
  const org: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    email: CONTACT_EMAIL,
    sameAs: [REPO_URL],
  };
  if (AUTHOR_NAME) org.founder = { '@type': 'Person', name: AUTHOR_NAME };
  return org;
}

export function article(o: { headline: string; description: string; url: string; locale: Locale; updated: string; published?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: o.headline,
    description: o.description,
    url: o.url,
    inLanguage: LOCALE_INFO[o.locale].hreflang,
    dateModified: o.updated,
    datePublished: o.published ?? o.updated,
    author: { '@type': 'Organization', name: BRAND, url: SITE_URL },
    publisher: { '@type': 'Organization', name: BRAND, url: SITE_URL },
  };
}

export function dataset(o: { name: string; description: string; url: string; updated: string; count: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: o.name,
    description: o.description,
    url: o.url,
    dateModified: o.updated,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    creator: { '@type': 'Organization', name: BRAND, url: SITE_URL },
    distribution: [{ '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${SITE_URL}/bots.json` }],
    variableMeasured: ['robots.txt token', 'User-Agent', 'operator', 'purpose', 'robots.txt compliance', 'IP ranges', 'verification method'],
    size: `${o.count} agents`,
  };
}
