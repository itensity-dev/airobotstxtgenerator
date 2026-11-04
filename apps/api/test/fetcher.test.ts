import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { FetchError, fetchRobotsTxt, MAX_BYTES, type Resolver } from '../src/fetcher.js';

/**
 * A local server stands in for "the internet". Tests that need a successful fetch map a public-looking
 * hostname to 127.0.0.1 and relax the address policy for exactly that address; the SSRF tests use the
 * real policy and must never reach the server.
 */
let server: http.Server;
let port = 0;
let hits = 0;
const ua = 'TestChecker/1.0';

beforeAll(async () => {
  server = http.createServer((req, res) => {
    hits++;
    const url = new URL(req.url ?? '/', 'http://x');
    const route = url.searchParams.get('r') ?? req.headers.host?.split('.')[0] ?? '';
    switch (route) {
      case 'ok':
        res.writeHead(200, { 'content-type': 'text/plain', 'x-ua': String(req.headers['user-agent']) });
        res.end(`User-agent: *\nDisallow: /private/\n# ua=${req.headers['user-agent']}\n`);
        return;
      case 'big':
        res.writeHead(200, { 'content-type': 'text/plain' });
        res.end(Buffer.alloc(MAX_BYTES * 2, 'a'));
        return;
      case 'slow':
        res.writeHead(200, { 'content-type': 'text/plain' });
        res.write('User-agent: *\n');
        return; // never ends
      case 'hang':
        return; // never responds
      case 'loop':
        res.writeHead(302, { location: `http://loop.robots-check-test.dev:${port}/robots.txt` });
        res.end();
        return;
      case 'tolocal':
        res.writeHead(301, { location: 'http://localhost/robots.txt' });
        res.end();
        return;
      case 'tometa':
        res.writeHead(302, { location: 'http://169.254.169.254/latest/meta-data/' });
        res.end();
        return;
      case 'tofile':
        res.writeHead(302, { location: 'file:///etc/passwd' });
        res.end();
        return;
      case 'torebind':
        res.writeHead(302, { location: `http://rebind.robots-check-test.dev:${port}/robots.txt` });
        res.end();
        return;
      case 'chain': {
        const n = Number(url.searchParams.get('n') ?? '0');
        if (n >= 3) {
          res.writeHead(200, { 'content-type': 'text/plain' });
          res.end('User-agent: *\nAllow: /\n');
        } else {
          res.writeHead(301, { location: `/robots.txt?r=chain&n=${n + 1}` });
          res.end();
        }
        return;
      }
      case 'gone':
        res.writeHead(404);
        res.end('not found');
        return;
      default:
        res.writeHead(500);
        res.end();
    }
  });
  await new Promise<void>((r) => server.listen(0, '127.0.0.1', r));
  port = (server.address() as AddressInfo).port;
});
afterAll(() => server.close());

// Map *.robots-check-test.dev to the local server; "rebind" resolves to a private address.
const resolver: Resolver = async (host) => {
  if (host.startsWith('rebind.')) return [{ address: '10.0.0.7', family: 4 }];
  if (host.startsWith('mixed.')) return [{ address: '93.184.216.34', family: 4 }, { address: '127.0.0.1', family: 4 }];
  return [{ address: '127.0.0.1', family: 4 }];
};
const testPolicy = (a: string) => a === '127.0.0.1';
const base = () => `http://ok.robots-check-test.dev:${port}`;

describe('fetcher', () => {
  const run = (path: string, opts: Partial<Parameters<typeof fetchRobotsTxt>[1]> = {}) =>
    fetchRobotsTxt(new URL(path), {
      userAgent: ua,
      resolve: resolver,
      isAllowedAddress: testPolicy,
      allowedPorts: ['', '80', '443', String(port)],
      timeoutMs: 1500,
      ...opts,
    });

  it('refuses non-default ports by default', async () => {
    await expect(
      fetchRobotsTxt(new URL(`${base()}/robots.txt?r=ok`), { userAgent: ua, resolve: resolver, isAllowedAddress: testPolicy }),
    ).rejects.toMatchObject({ code: 'port-not-allowed' });
  });

  it('fetches with the honest User-Agent', async () => {
    const r = await run(`${base()}/robots.txt?r=ok`);
    expect(r.status).toBe(200);
    expect(new TextDecoder().decode(r.body)).toContain(`# ua=${ua}`);
    expect(r.address).toBe('127.0.0.1');
  });

  it('stops reading at 512 KiB', async () => {
    const r = await run(`${base()}/robots.txt?r=big`);
    expect(r.truncated).toBe(true);
    expect(r.body.length).toBe(MAX_BYTES);
  });

  it('times out on a hanging server', async () => {
    const t = Date.now();
    await expect(run(`${base()}/robots.txt?r=hang`, { timeoutMs: 300 })).rejects.toMatchObject({ code: 'timeout' });
    expect(Date.now() - t).toBeLessThan(2000);
  });

  it('times out on a slow body', async () => {
    await expect(run(`${base()}/robots.txt?r=slow`, { timeoutMs: 300 })).rejects.toBeInstanceOf(FetchError);
  });

  it('follows up to 5 redirects', async () => {
    const r = await run(`${base()}/robots.txt?r=chain&n=0`);
    expect(r.status).toBe(200);
    expect(r.redirects).toHaveLength(3);
  });

  it('refuses a 6th redirect', async () => {
    await expect(run(`${base()}/robots.txt?r=loop`)).rejects.toMatchObject({ code: 'too-many-redirects' });
  });

  it('refuses a redirect to localhost', async () => {
    const before = hits;
    await expect(run(`${base()}/robots.txt?r=tolocal`)).rejects.toMatchObject({ code: 'host-not-allowed' });
    expect(hits - before).toBe(1);
  });

  it('refuses a redirect to the cloud metadata address', async () => {
    await expect(run(`${base()}/robots.txt?r=tometa`)).rejects.toMatchObject({ code: 'ip-not-public' });
  });

  it('refuses a redirect to file://', async () => {
    await expect(run(`${base()}/robots.txt?r=tofile`)).rejects.toMatchObject({ code: 'scheme-not-allowed' });
  });

  it('refuses a redirect to a host that resolves to a private address (DNS rebinding)', async () => {
    const before = hits;
    await expect(run(`${base()}/robots.txt?r=torebind`)).rejects.toMatchObject({ code: 'address-not-public' });
    expect(hits - before).toBe(1);
  });

  it('refuses hosts with mixed public and private records', async () => {
    await expect(run(`http://mixed.robots-check-test.dev:${port}/robots.txt?r=ok`)).rejects.toMatchObject({ code: 'address-not-public' });
  });

  it('with the real address policy never connects to loopback', async () => {
    const before = hits;
    await expect(
      run(`${base()}/robots.txt?r=ok`, { isAllowedAddress: undefined, timeoutMs: 1000 }),
    ).rejects.toMatchObject({ code: 'address-not-public' });
    expect(hits).toBe(before);
  });

  it('resolves each hostname once per connection (no second lookup to rebind)', async () => {
    let calls = 0;
    const flipping: Resolver = async () => {
      calls++;
      return calls === 1 ? [{ address: '127.0.0.1', family: 4 }] : [{ address: '10.0.0.1', family: 4 }];
    };
    const r = await run(`${base()}/robots.txt?r=ok`, { resolve: flipping });
    expect(r.status).toBe(200);
    expect(calls).toBe(1);
  });

  it('returns 4xx statuses as results (Google treats them as "allow all")', async () => {
    const r = await run(`${base()}/robots.txt?r=gone`);
    expect(r.status).toBe(404);
  });
});
