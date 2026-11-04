import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { parseRateLimit, RateLimiter, TtlCache } from '../src/rate-limit.js';

let server: http.Server;
let port = 0;
let hits = 0;
beforeAll(async () => {
  server = http.createServer((_req, res) => {
    hits++;
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('﻿User-agent: GPTBot\nDisallow: /\n');
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  port = (server.address() as AddressInfo).port;
});
afterAll(() => server.close());

function app(rateLimit = '3/min') {
  return createApp({
    userAgent: 'Test/1.0',
    rateLimit,
    trustProxy: true,
    cacheTtlMs: 60_000,
    fetchOptions: {
      resolve: async () => [{ address: '127.0.0.1', family: 4 }],
      isAllowedAddress: (a) => a === '127.0.0.1',
      allowedPorts: ['', '80', '443', String(port)],
      timeoutMs: 1000,
    },
  });
}

describe('api app', () => {
  it('health', async () => {
    const res = await app().request('/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ status: 'ok' });
  });

  it('rejects unsafe input with 400', async () => {
    const a = app();
    for (const url of ['localhost', 'http://127.0.0.1', 'http://169.254.169.254', 'file:///etc/passwd', '', 'http://[::1]']) {
      const res = await a.request(`/api/robots?url=${encodeURIComponent(url)}`);
      expect(res.status, url).toBe(400);
    }
  });

  it('fetches, returns bytes as base64 and caches for the TTL', async () => {
    const a = app();
    const before = hits;
    const r1 = await a.request(`/api/robots?url=${encodeURIComponent(`http://site.robots-check-test.dev:${port}/page`)}`);
    expect(r1.status).toBe(200);
    const j = (await r1.json()) as { status: number; bodyBase64: string; cached: boolean; requestedUrl: string };
    expect(j.status).toBe(200);
    expect(j.cached).toBe(false);
    expect(j.requestedUrl).toBe(`http://site.robots-check-test.dev:${port}/robots.txt`);
    const bytes = Buffer.from(j.bodyBase64, 'base64');
    expect([...bytes.subarray(0, 3)]).toEqual([0xef, 0xbb, 0xbf]);
    const r2 = await a.request(`/api/robots?url=${encodeURIComponent(`http://site.robots-check-test.dev:${port}/`)}`);
    expect(((await r2.json()) as { cached: boolean }).cached).toBe(true);
    expect(hits - before).toBe(1);
    expect(r2.headers.get('cache-control')).toBe('no-store');
  });

  it('rate-limits per client IP', async () => {
    const a = app('2/min');
    const call = (ip: string, n: number) =>
      a.request(`/api/robots?url=${encodeURIComponent(`http://r${n}.robots-check-test.dev:${port}/`)}`, {
        headers: { 'x-forwarded-for': ip },
      });
    expect((await call('203.0.113.9', 1)).status).toBe(200);
    expect((await call('203.0.113.9', 2)).status).toBe(200);
    const third = await call('203.0.113.9', 3);
    expect(third.status).toBe(429);
    expect(Number(third.headers.get('retry-after'))).toBeGreaterThan(0);
    expect((await call('198.51.100.7', 4)).status).toBe(200);
  });
});

describe('rate limit helpers', () => {
  it('parses limits', () => {
    expect(parseRateLimit('30/min')).toEqual({ limit: 30, windowMs: 60_000 });
    expect(parseRateLimit('5/s')).toEqual({ limit: 5, windowMs: 1000 });
    expect(parseRateLimit('100/hour')).toEqual({ limit: 100, windowMs: 3_600_000 });
    expect(parseRateLimit('nonsense')).toEqual({ limit: 30, windowMs: 60_000 });
  });

  it('resets after the window', () => {
    let t = 0;
    const rl = new RateLimiter({ limit: 1, windowMs: 1000 }, () => t);
    expect(rl.take('a').allowed).toBe(true);
    expect(rl.take('a').allowed).toBe(false);
    t = 1001;
    expect(rl.take('a').allowed).toBe(true);
  });

  it('expires cache entries', () => {
    let t = 0;
    const c = new TtlCache<number>(600_000, 2, () => t);
    c.set('a', 1);
    t = 599_999;
    expect(c.get('a')).toBe(1);
    t = 600_001;
    expect(c.get('a')).toBeUndefined();
  });
});
