// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import { fileURLToPath } from 'node:url';

const site = (process.env.SITE_URL || 'https://airobotstxtgenerator.com').replace(/\/$/, '');
const analytics = process.env.ANALYTICS_PROVIDER || 'none';
const adsEnabled = process.env.ADS_ENABLED === 'true';

// Third-party origins are added only when the corresponding feature is enabled.
const scriptResources = ["'self'"];
const connectSrc = ["'self'"];
const imgSrc = ["'self'", 'data:'];
const frameSrc = [];
if (analytics === 'plausible') {
  const src = new URL(
    process.env.PLAUSIBLE_SRC || 'https://plausible.io/js/script.tagged-events.js',
  );
  scriptResources.push(src.origin);
  connectSrc.push(src.origin);
}
if (analytics === 'ga4') {
  scriptResources.push('https://www.googletagmanager.com');
  connectSrc.push(
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://www.googletagmanager.com',
  );
  imgSrc.push('https://*.google-analytics.com', 'https://www.googletagmanager.com');
}
if (adsEnabled) {
  scriptResources.push(
    'https://pagead2.googlesyndication.com',
    'https://*.googlesyndication.com',
    'https://fundingchoicesmessages.google.com',
    'https://*.adtrafficquality.google',
  );
  connectSrc.push(
    'https://*.googlesyndication.com',
    'https://*.google.com',
    'https://*.adtrafficquality.google',
    'https://fundingchoicesmessages.google.com',
  );
  imgSrc.push('https:');
  frameSrc.push(
    'https://*.googlesyndication.com',
    'https://*.doubleclick.net',
    'https://*.google.com',
    'https://fundingchoicesmessages.google.com',
  );
}

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  output: 'static',
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
    assets: '_astro',
  },
  compressHTML: true,
  markdown: { syntaxHighlight: false },

  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        `img-src ${imgSrc.join(' ')}`,
        "font-src 'self'",
        `connect-src ${connectSrc.join(' ')}`,
        "manifest-src 'self'",
        "worker-src 'self'",
        `frame-src ${frameSrc.length ? frameSrc.join(' ') : "'none'"}`,
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      scriptDirective: { resources: scriptResources },
      styleDirective: { resources: ["'self'"] },
    },
  },
  integrations: [preact({ compat: false })],
  vite: {
    resolve: {
      alias: {
        // Use the TypeScript sources of the core package directly (no separate build step needed).
        '@airobots/core': fileURLToPath(
          new URL('../../packages/core/src/index.ts', import.meta.url),
        ),
      },
    },
    build: {
      cssMinify: true,
      assetsInlineLimit: 0,
    },
    server: {
      proxy: {
        '/api': process.env.API_DEV_URL || 'http://127.0.0.1:8081',
      },
    },
  },
});
