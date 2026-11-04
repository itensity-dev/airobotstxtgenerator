import { describe, expect, it } from 'vitest';
import { checkTargetUrl, isPublicAddress, robotsUrlFor } from '../src/address.js';

describe('address policy', () => {
  it.each([
    '127.0.0.1', '127.1.2.3', '10.0.0.1', '172.16.0.1', '172.31.255.255', '192.168.1.1', '169.254.169.254', '169.254.0.1',
    '100.64.0.1', '0.0.0.0', '224.0.0.1', '255.255.255.255', '192.0.2.1', '198.51.100.1', '203.0.113.1', '198.18.0.1', '192.0.0.8',
    '240.0.0.1', '::1', '::', 'fe80::1', 'fc00::1', 'fd12:3456::1', 'ff02::1', '::ffff:127.0.0.1', '::ffff:169.254.169.254',
    '::ffff:7f00:1', '64:ff9b::a9fe:a9fe', '64:ff9b::7f00:1', '2001:db8::1', '2002:7f00:1::1', '2001::1', '100::1', 'not-an-ip',
  ])('refuses %s', (a) => {
    expect(isPublicAddress(a)).toBe(false);
  });

  it.each(['93.184.216.34', '1.1.1.1', '8.8.8.8', '2606:4700:4700::1111', '2a00:1450:4001:81c::200e', '::ffff:8.8.8.8', '64:ff9b::808:808'])(
    'allows %s',
    (a) => {
      expect(isPublicAddress(a)).toBe(true);
    },
  );

  it.each([
    ['file:///etc/passwd', 'scheme-not-allowed'],
    ['ftp://example.com/', 'scheme-not-allowed'],
    ['gopher://example.com/', 'scheme-not-allowed'],
    ['http://localhost/', 'host-not-allowed'],
    ['http://foo.localhost/', 'host-not-allowed'],
    ['http://metadata.google.internal/', 'host-not-allowed'],
    ['http://intranet/', 'host-not-allowed'],
    ['http://127.0.0.1/', 'ip-not-public'],
    ['http://0x7f000001/', 'ip-not-public'],
    ['http://2130706433/', 'ip-not-public'],
    ['http://017700000001/', 'ip-not-public'],
    ['http://[::1]/', 'ip-not-public'],
    ['http://[::ffff:169.254.169.254]/', 'ip-not-public'],
    ['http://169.254.169.254/latest/meta-data/', 'ip-not-public'],
    ['http://example.com:8080/', 'port-not-allowed'],
    ['http://example.com:22/', 'port-not-allowed'],
    ['http://user:pass@example.com/', 'credentials-not-allowed'],
  ])('rejects %s (%s)', (url, reason) => {
    expect(checkTargetUrl(url)).toMatchObject({ ok: false, reason });
  });

  it('builds the robots.txt URL of the origin', () => {
    expect(robotsUrlFor('example.com').url?.href).toBe('https://example.com/robots.txt');
    expect(robotsUrlFor('http://example.com/some/page?x=1').url?.href).toBe('http://example.com/robots.txt');
    expect(robotsUrlFor('https://www.example.com:443/a').url?.href).toBe('https://www.example.com/robots.txt');
    expect(robotsUrlFor('  EXAMPLE.com  ').url?.href).toBe('https://example.com/robots.txt');
    expect(robotsUrlFor('').ok).toBe(false);
    expect(robotsUrlFor('javascript:alert(1)').ok).toBe(false);
  });
});
