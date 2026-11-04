import { Hono, type Context } from 'hono';
import { robotsUrlFor } from './address.js';
import { FetchError, fetchRobotsTxt, type FetchOptions, type FetchResult } from './fetcher.js';
import { RateLimiter, TtlCache, parseRateLimit } from './rate-limit.js';

export interface ApiConfig {
  userAgent: string;
  rateLimit: string | undefined;
  /** Use the X-Forwarded-For header set by the reverse proxy (Caddy) as client IP. */
  trustProxy: boolean;
  cacheTtlMs: number;
  fetchOptions?: Partial<FetchOptions>;
}

export interface RobotsResponse {
  input: string;
  requestedUrl: string;
  finalUrl: string;
  status: number;
  contentType: string | null;
  redirects: { from: string; to: string; status: number }[];
  bytes: number;
  truncated: boolean;
  /** Body bytes, base64 — kept as bytes so BOMs and encodings can be inspected. */
  bodyBase64: string;
  /** https failed to connect and the http:// URL was used. */
  httpFallback: boolean;
  fetchedAt: string;
  durationMs: number;
  cached: boolean;
}

export const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)';

export function createApp(config: ApiConfig) {
  const app = new Hono();
  const limiter = new RateLimiter(parseRateLimit(config.rateLimit));
  const cache = new TtlCache<Omit<RobotsResponse, 'cached' | 'input'>>(config.cacheTtlMs, 2000);

  app.use('*', async (c, next) => {
    await next();
    c.header('X-Content-Type-Options', 'nosniff');
    c.header('Referrer-Policy', 'no-referrer');
  });

  app.get('/health', (c) => c.json({ status: 'ok', cacheEntries: cache.size }));

  app.get('/api/robots', async (c) => {
    c.header('Cache-Control', 'no-store');
    const ip =
      (config.trustProxy ? c.req.header('x-forwarded-for')?.split(',')[0]?.trim() : undefined) ||
      (c.env as { incoming?: { socket?: { remoteAddress?: string } } } | undefined)?.incoming
        ?.socket?.remoteAddress ||
      'unknown';
    const input = c.req.query('url') ?? '';
    const target = robotsUrlFor(input, config.fetchOptions?.allowedPorts);
    if (!target.ok || !target.url) {
      return c.json({ error: target.reason ?? 'invalid-url' }, 400);
    }
    const key = target.url.host.toLowerCase();
    const hit = cache.get(key);
    if (hit) return c.json({ ...hit, input, cached: true } satisfies RobotsResponse);

    const rl = limiter.take(ip);
    c.header('X-RateLimit-Remaining', String(rl.remaining));
    if (!rl.allowed) {
      c.header('Retry-After', String(rl.retryAfter));
      return c.json({ error: 'rate-limited', retryAfter: rl.retryAfter }, 429);
    }

    const opts: FetchOptions = { userAgent: config.userAgent, ...config.fetchOptions };
    let result: FetchResult;
    let httpFallback = false;
    try {
      result = await fetchRobotsTxt(target.url, opts);
    } catch (e) {
      const err = e as FetchError;
      if (
        target.url.protocol === 'https:' &&
        (err.code === 'connection-failed' || err.code === 'tls-failed') &&
        err.redirects.length === 0
      ) {
        try {
          result = await fetchRobotsTxt(`http://${target.url.host}/robots.txt`, opts);
          httpFallback = true;
        } catch (e2) {
          return fetchErrorResponse(c, e2);
        }
      } else {
        return fetchErrorResponse(c, e);
      }
    }
    const body: Omit<RobotsResponse, 'cached' | 'input'> = {
      requestedUrl: result.requestedUrl,
      finalUrl: result.finalUrl,
      status: result.status,
      contentType: result.contentType,
      redirects: result.redirects,
      bytes: result.bytesRead,
      truncated: result.truncated,
      bodyBase64: Buffer.from(result.body).toString('base64'),
      httpFallback,
      fetchedAt: new Date().toISOString(),
      durationMs: result.durationMs,
    };
    cache.set(key, body);
    return c.json({ ...body, input, cached: false } satisfies RobotsResponse);
  });

  app.notFound((c) => c.json({ error: 'not-found' }, 404));
  app.onError((_e, c) => c.json({ error: 'internal-error' }, 500));
  return app;
}

function fetchErrorResponse(c: Context, e: unknown) {
  if (e instanceof FetchError) {
    const status = [
      'scheme-not-allowed',
      'port-not-allowed',
      'host-not-allowed',
      'ip-not-public',
      'address-not-public',
      'credentials-not-allowed',
      'invalid-url',
    ].includes(e.code)
      ? 400
      : e.code === 'timeout'
        ? 504
        : 502;
    return c.json({ error: e.code, redirects: e.redirects }, status);
  }
  return c.json({ error: 'internal-error' }, 500);
}
