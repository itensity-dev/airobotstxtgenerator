/**
 * Fetch a robots.txt file safely:
 * - http/https only, ports 80/443, no credentials, no internal hostnames;
 * - DNS is resolved by us; every resolved address must be public, and the connection is made
 *   to that validated address (no second lookup, so DNS rebinding cannot swap it);
 * - every redirect is validated the same way, at most 5 redirects;
 * - 5 s total timeout, at most 512 KiB of body.
 */
import { promises as dns, type LookupAddress } from 'node:dns';
import http from 'node:http';
import https from 'node:https';
import type { LookupFunction } from 'node:net';
import { checkTargetUrl, DEFAULT_PORTS, isPublicAddress, type UrlRejection } from './address.js';

export const MAX_BYTES = 512 * 1024;
export const MAX_REDIRECTS = 5;
export const TIMEOUT_MS = 5000;

export type Resolver = (hostname: string) => Promise<LookupAddress[]>;

export interface FetchOptions {
  userAgent: string;
  timeoutMs?: number;
  maxBytes?: number;
  maxRedirects?: number;
  resolve?: Resolver;
  /** Address policy; tests may relax it for a local server. Default: public addresses only. */
  isAllowedAddress?: (address: string) => boolean;
  /** Allowed URL ports ('' = scheme default). Default: '', 80, 443. */
  allowedPorts?: readonly string[];
}

export interface RedirectHop {
  from: string;
  to: string;
  status: number;
}

export type FetchErrorCode =
  | UrlRejection
  | 'dns-failed'
  | 'address-not-public'
  | 'too-many-redirects'
  | 'redirect-invalid'
  | 'timeout'
  | 'connection-failed'
  | 'tls-failed';

export class FetchError extends Error {
  constructor(
    public readonly code: FetchErrorCode,
    message: string,
    public readonly redirects: RedirectHop[] = [],
  ) {
    super(message);
    this.name = 'FetchError';
  }
}

export interface FetchResult {
  requestedUrl: string;
  finalUrl: string;
  status: number;
  contentType: string | null;
  redirects: RedirectHop[];
  body: Uint8Array;
  bytesRead: number;
  truncated: boolean;
  durationMs: number;
  address: string;
}

const defaultResolve: Resolver = (hostname) => dns.lookup(hostname, { all: true, verbatim: true });

function makeLookup(
  resolve: Resolver,
  allowed: (a: string) => boolean,
  onAddress: (a: string) => void,
): LookupFunction {
  return (hostname, options, callback) => {
    resolve(hostname)
      .then((addresses) => {
        if (addresses.length === 0)
          throw new FetchError('dns-failed', `No addresses for ${hostname}`);
        // Refuse the host if ANY address is not public: an attacker could mix records.
        const bad = addresses.find((a) => !allowed(a.address));
        if (bad)
          throw new FetchError(
            'address-not-public',
            `${hostname} resolves to a non-public address`,
          );
        const family =
          typeof options === 'object' && options && 'family' in options ? options.family : 0;
        const pick = addresses.find((a) => !family || a.family === family) ?? addresses[0]!;
        onAddress(pick.address);
        if (typeof options === 'object' && options && 'all' in options && options.all) {
          (callback as unknown as (e: null, a: LookupAddress[]) => void)(null, [pick]);
        } else {
          callback(null, pick.address, pick.family);
        }
      })
      .catch((e: unknown) => {
        const err =
          e instanceof FetchError
            ? e
            : new FetchError('dns-failed', `DNS lookup failed for ${hostname}`);
        callback(err as NodeJS.ErrnoException, '', 4);
      });
  };
}

interface HopResult {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: Uint8Array;
  bytesRead: number;
  truncated: boolean;
  address: string;
}

function requestOnce(
  url: URL,
  opts: Required<Omit<FetchOptions, 'resolve' | 'isAllowedAddress' | 'allowedPorts'>> & {
    resolve: Resolver;
    allowed: (a: string) => boolean;
    signal: AbortSignal;
  },
): Promise<HopResult> {
  return new Promise((resolvePromise, reject) => {
    let address = '';
    const lookup = makeLookup(opts.resolve, opts.allowed, (a) => (address = a));
    const mod = url.protocol === 'https:' ? https : http;
    const req = mod.request(
      url,
      {
        method: 'GET',
        lookup,
        signal: opts.signal,
        headers: {
          'user-agent': opts.userAgent,
          accept: 'text/plain, */*;q=0.1',
          'accept-encoding': 'identity',
        },
        // A fresh connection per request: no agent reuse across hosts.
        agent: false,
      },
      (res) => {
        const chunks: Buffer[] = [];
        let size = 0;
        let truncated = false;
        res.on('data', (chunk: Buffer) => {
          if (truncated) return;
          const room = opts.maxBytes - size;
          if (chunk.length > room) {
            chunks.push(chunk.subarray(0, room));
            size += room;
            truncated = true;
            res.destroy();
            finish();
            return;
          }
          chunks.push(chunk);
          size += chunk.length;
        });
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          resolvePromise({
            status: res.statusCode ?? 0,
            headers: res.headers,
            body: new Uint8Array(Buffer.concat(chunks)),
            bytesRead: size,
            truncated,
            address,
          });
        };
        res.on('end', finish);
        res.on('close', finish);
        res.on('error', (e) => {
          if (!done) reject(e);
        });
      },
    );
    req.on('error', reject);
    req.end();
  });
}

export async function fetchRobotsTxt(
  target: string | URL,
  options: FetchOptions,
): Promise<FetchResult> {
  const started = Date.now();
  const maxRedirects = options.maxRedirects ?? MAX_REDIRECTS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? TIMEOUT_MS);
  const redirects: RedirectHop[] = [];
  const ports = options.allowedPorts ?? DEFAULT_PORTS;
  const first = checkTargetUrl(target, ports);
  if (!first.ok || !first.url) {
    clearTimeout(timer);
    throw new FetchError(first.reason ?? 'invalid-url', 'URL not allowed');
  }
  const requestedUrl = first.url.href;
  let url = first.url;
  try {
    for (let hop = 0; ; hop++) {
      let res: HopResult;
      try {
        res = await requestOnce(url, {
          userAgent: options.userAgent,
          timeoutMs: options.timeoutMs ?? TIMEOUT_MS,
          maxBytes: options.maxBytes ?? MAX_BYTES,
          maxRedirects,
          resolve: options.resolve ?? defaultResolve,
          allowed: options.isAllowedAddress ?? isPublicAddress,
          signal: controller.signal,
        });
      } catch (e) {
        if (e instanceof FetchError) throw new FetchError(e.code, e.message, redirects);
        const cause = (e as { cause?: unknown }).cause;
        if (cause instanceof FetchError) throw new FetchError(cause.code, cause.message, redirects);
        if (controller.signal.aborted) throw new FetchError('timeout', 'Timed out', redirects);
        const code = (e as NodeJS.ErrnoException).code ?? '';
        if (/CERT|SSL|TLS|ERR_TLS|DEPTH_ZERO|SELF_SIGNED|UNABLE_TO_VERIFY/i.test(code)) {
          throw new FetchError('tls-failed', `TLS error (${code})`, redirects);
        }
        throw new FetchError(
          'connection-failed',
          `Connection failed${code ? ` (${code})` : ''}`,
          redirects,
        );
      }
      if (res.status >= 300 && res.status < 400 && res.headers.location) {
        if (hop >= maxRedirects)
          throw new FetchError(
            'too-many-redirects',
            `More than ${maxRedirects} redirects`,
            redirects,
          );
        let next: URL;
        try {
          next = new URL(res.headers.location, url);
        } catch {
          throw new FetchError('redirect-invalid', 'Invalid Location header', redirects);
        }
        const check = checkTargetUrl(next, ports);
        redirects.push({ from: url.href, to: next.href, status: res.status });
        if (!check.ok || !check.url)
          throw new FetchError(
            check.reason ?? 'redirect-invalid',
            'Redirect target not allowed',
            redirects,
          );
        url = check.url;
        continue;
      }
      return {
        requestedUrl,
        finalUrl: url.href,
        status: res.status,
        contentType:
          typeof res.headers['content-type'] === 'string' ? res.headers['content-type'] : null,
        redirects,
        body: res.body,
        bytesRead: res.bytesRead,
        truncated: res.truncated,
        durationMs: Date.now() - started,
        address: res.address,
      };
    }
  } finally {
    clearTimeout(timer);
  }
}
