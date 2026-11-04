/**
 * Address and hostname policy for outbound requests (SSRF protection).
 * Only globally routable unicast addresses are allowed: private, loopback, link-local
 * (including 169.254.169.254 cloud metadata), CGNAT, multicast, documentation, benchmarking,
 * reserved ranges and IPv6 equivalents are refused. IPv6 forms that embed an IPv4 address
 * (IPv4-mapped, NAT64, 6to4, Teredo) are judged by the embedded address or refused.
 */
import ipaddr from 'ipaddr.js';

const BLOCKED_HOST_SUFFIXES = ['.localhost', '.local', '.internal', '.intranet', '.lan', '.home', '.corp', '.arpa', '.test', '.invalid', '.example'];
const BLOCKED_HOSTS = new Set(['localhost', 'metadata', 'metadata.google.internal', 'instance-data', 'kubernetes', 'kubernetes.default']);

export function isPublicAddress(address: string): boolean {
  let addr: ipaddr.IPv4 | ipaddr.IPv6;
  try {
    addr = ipaddr.parse(address);
  } catch {
    return false;
  }
  if (addr.kind() === 'ipv6') {
    const v6 = addr as ipaddr.IPv6;
    if (v6.isIPv4MappedAddress()) return isPublicAddress(v6.toIPv4Address().toString());
    const range = v6.range();
    if (range === 'rfc6052') {
      // NAT64 64:ff9b::/96 — judge the embedded IPv4 address.
      const p = v6.toByteArray();
      return isPublicAddress(`${p[12]}.${p[13]}.${p[14]}.${p[15]}`);
    }
    if (range !== 'unicast') return false;
    // Global unicast is 2000::/3 only.
    const first = v6.parts[0]!;
    return first >= 0x2000 && first <= 0x3fff;
  }
  const v4 = addr as ipaddr.IPv4;
  if (v4.range() !== 'unicast') return false;
  // Ranges ipaddr.js still calls unicast but which are not globally routable.
  const extra: [string, number][] = [
    ['192.0.0.0', 24],
    ['198.18.0.0', 15],
  ];
  return !extra.some(([net, bits]) => v4.match(ipaddr.IPv4.parse(net), bits));
}

export type UrlRejection =
  | 'invalid-url'
  | 'scheme-not-allowed'
  | 'port-not-allowed'
  | 'host-not-allowed'
  | 'ip-not-public'
  | 'credentials-not-allowed';

export interface TargetCheck {
  ok: boolean;
  reason?: UrlRejection;
  url?: URL;
}

export const DEFAULT_PORTS: readonly string[] = ['', '80', '443'];

/** Validate a URL before any network activity. */
export function checkTargetUrl(input: string | URL, allowedPorts: readonly string[] = DEFAULT_PORTS): TargetCheck {
  let url: URL;
  try {
    url = typeof input === 'string' ? new URL(input) : new URL(input.href);
  } catch {
    return { ok: false, reason: 'invalid-url' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return { ok: false, reason: 'scheme-not-allowed' };
  if (url.username || url.password) return { ok: false, reason: 'credentials-not-allowed' };
  if (!allowedPorts.includes(url.port)) return { ok: false, reason: 'port-not-allowed' };
  let host = url.hostname.toLowerCase();
  if (host.startsWith('[') && host.endsWith(']')) host = host.slice(1, -1);
  if (ipaddr.isValid(host)) {
    return isPublicAddress(host) ? { ok: true, url } : { ok: false, reason: 'ip-not-public' };
  }
  const bare = host.replace(/\.$/, '');
  if (BLOCKED_HOSTS.has(bare) || BLOCKED_HOST_SUFFIXES.some((s) => bare.endsWith(s)) || !bare.includes('.')) {
    return { ok: false, reason: 'host-not-allowed' };
  }
  return { ok: true, url };
}

/** Turn user input ("example.com", "https://example.com/page") into the robots.txt URL of its origin. */
export function robotsUrlFor(input: string, allowedPorts: readonly string[] = DEFAULT_PORTS): TargetCheck {
  const trimmed = input.trim();
  if (trimmed === '' || trimmed.length > 2048) return { ok: false, reason: 'invalid-url' };
  const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const check = checkTargetUrl(withScheme, allowedPorts);
  if (!check.ok || !check.url) return check;
  const u = check.url;
  return checkTargetUrl(`${u.protocol}//${u.host}/robots.txt`, allowedPorts);
}
