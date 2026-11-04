import { serve } from '@hono/node-server';
import { createApp, DEFAULT_USER_AGENT } from './app.js';

const port = Number(process.env.PORT ?? 8081);
const app = createApp({
  userAgent: process.env.API_USER_AGENT || DEFAULT_USER_AGENT,
  rateLimit: process.env.API_RATE_LIMIT,
  trustProxy: (process.env.TRUST_PROXY ?? 'true') === 'true',
  cacheTtlMs: Number(process.env.API_CACHE_TTL_SECONDS ?? 600) * 1000,
});

const server = serve({ fetch: app.fetch, port, hostname: process.env.HOST ?? '0.0.0.0' }, (info) => {
  console.log(`api listening on :${info.port}`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 3000).unref();
  });
}
