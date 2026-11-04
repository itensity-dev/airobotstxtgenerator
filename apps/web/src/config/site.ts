/** Build-time configuration from environment variables (see .env.example). */
const env = (k: string, d = ''): string =>
  (import.meta.env[k] as string | undefined) ?? process.env[k] ?? d;

export const SITE_URL = env('SITE_URL', 'https://airobotstxtgenerator.com').replace(/\/$/, '');
export const SITE_HOST = new URL(SITE_URL).host;
export const BRAND = 'AI Robots.txt Generator';
export const CONTACT_EMAIL = env('CONTACT_EMAIL', 'contact@airobotstxtgenerator.com');
export const AUTHOR_NAME = env('AUTHOR_NAME', '');
export const LAUNCH_DATE = '2026-11-04';
export const REPO_URL = env('REPO_URL', 'https://github.com/itensity-dev/airobotstxtgenerator');
export const NPM_PACKAGE = '@airobots/core';

export const ANALYTICS_PROVIDER = env('ANALYTICS_PROVIDER', 'none') as 'none' | 'plausible' | 'ga4';
export const PLAUSIBLE_DOMAIN = env('PLAUSIBLE_DOMAIN', SITE_HOST);
export const PLAUSIBLE_SRC = env(
  'PLAUSIBLE_SRC',
  'https://plausible.io/js/script.tagged-events.js',
);
export const GA4_ID = env('GA4_ID', '');
export const ADS_ENABLED = env('ADS_ENABLED', 'false') === 'true';
export const ADSENSE_CLIENT = env('ADSENSE_CLIENT', '');
export const GSC_VERIFICATION = env('GSC_VERIFICATION', '');
export const BING_VERIFICATION = env('BING_VERIFICATION', '');
export const INDEXNOW_KEY = env('INDEXNOW_KEY', '');
