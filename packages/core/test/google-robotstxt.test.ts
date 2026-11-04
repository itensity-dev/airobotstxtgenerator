/**
 * Test cases ported from Google's robots.txt parser:
 * https://github.com/google/robotstxt/blob/master/robots_test.cc (Apache License 2.0).
 * Each `it` corresponds to a TEST() in the original file; expectations are kept 1:1.
 */
import { describe, expect, it } from 'vitest';
import {
  escapePattern,
  getPathParamsQuery,
  isAllowed,
  isValidUserAgentToObey,
  parseLines,
  type RobotsLine,
} from '../src/index.js';

const allowed = (robotstxt: string | Uint8Array, ua: string, url: string) =>
  isAllowed(robotstxt, ua, url);

describe('google/robotstxt robots_test.cc', () => {
  it('GoogleOnly_SystemTest', () => {
    const robotstxt = 'user-agent: FooBot\ndisallow: /\n';
    expect(allowed('', 'FooBot', '')).toBe(true);
    expect(allowed(robotstxt, '', '')).toBe(true);
    expect(allowed(robotstxt, 'FooBot', '')).toBe(false);
    expect(allowed('', '', '')).toBe(true);
  });

  it('ID_LineSyntax_Line', () => {
    const correct = 'user-agent: FooBot\ndisallow: /\n';
    const incorrect = 'foo: FooBot\nbar: /\n';
    const incorrectAccepted = 'user-agent FooBot\ndisallow /\n';
    const url = 'http://foo.bar/x/y';
    expect(allowed(correct, 'FooBot', url)).toBe(false);
    expect(allowed(incorrect, 'FooBot', url)).toBe(true);
    expect(allowed(incorrectAccepted, 'FooBot', url)).toBe(false);
  });

  it('ID_LineSyntax_Groups', () => {
    const robotstxt =
      'allow: /foo/bar/\n' +
      '\n' +
      'user-agent: FooBot\n' +
      'disallow: /\n' +
      'allow: /x/\n' +
      'user-agent: BarBot\n' +
      'disallow: /\n' +
      'allow: /y/\n' +
      '\n' +
      '\n' +
      'allow: /w/\n' +
      'user-agent: BazBot\n' +
      '\n' +
      'user-agent: FooBot\n' +
      'allow: /z/\n' +
      'disallow: /\n';
    const urlW = 'http://foo.bar/w/a';
    const urlX = 'http://foo.bar/x/b';
    const urlY = 'http://foo.bar/y/c';
    const urlZ = 'http://foo.bar/z/d';
    const urlFoo = 'http://foo.bar/foo/bar/';
    expect(allowed(robotstxt, 'FooBot', urlX)).toBe(true);
    expect(allowed(robotstxt, 'FooBot', urlZ)).toBe(true);
    expect(allowed(robotstxt, 'FooBot', urlY)).toBe(false);
    expect(allowed(robotstxt, 'BarBot', urlY)).toBe(true);
    expect(allowed(robotstxt, 'BarBot', urlW)).toBe(true);
    expect(allowed(robotstxt, 'BarBot', urlZ)).toBe(false);
    expect(allowed(robotstxt, 'BazBot', urlZ)).toBe(true);
    expect(allowed(robotstxt, 'FooBot', urlFoo)).toBe(false);
    expect(allowed(robotstxt, 'BarBot', urlFoo)).toBe(false);
    expect(allowed(robotstxt, 'BazBot', urlFoo)).toBe(false);
  });

  it('ID_LineSyntax_Groups_OtherRules', () => {
    {
      const robotstxt =
        'User-agent: BarBot\nSitemap: https://foo.bar/sitemap\nUser-agent: *\nDisallow: /\n';
      const url = 'http://foo.bar/';
      expect(allowed(robotstxt, 'FooBot', url)).toBe(false);
      expect(allowed(robotstxt, 'BarBot', url)).toBe(false);
    }
    {
      const robotstxt =
        'User-agent: FooBot\nInvalid-Unknown-Line: unknown\nUser-agent: *\nDisallow: /\n';
      const url = 'http://foo.bar/';
      expect(allowed(robotstxt, 'FooBot', url)).toBe(false);
      expect(allowed(robotstxt, 'BarBot', url)).toBe(false);
    }
  });

  it('ID_REPLineNamesCaseInsensitive', () => {
    const upper = 'USER-AGENT: FooBot\nALLOW: /x/\nDISALLOW: /\n';
    const lower = 'user-agent: FooBot\nallow: /x/\ndisallow: /\n';
    const camel = 'uSeR-aGeNt: FooBot\nAlLoW: /x/\ndIsAlLoW: /\n';
    const ok = 'http://foo.bar/x/y';
    const no = 'http://foo.bar/a/b';
    for (const r of [upper, lower, camel]) {
      expect(allowed(r, 'FooBot', ok)).toBe(true);
      expect(allowed(r, 'FooBot', no)).toBe(false);
    }
  });

  it('ID_VerifyValidUserAgentsToObey', () => {
    expect(isValidUserAgentToObey('Foobot')).toBe(true);
    expect(isValidUserAgentToObey('Foobot-Bar')).toBe(true);
    expect(isValidUserAgentToObey('Foo_Bar')).toBe(true);
    expect(isValidUserAgentToObey('')).toBe(false);
    expect(isValidUserAgentToObey('ツ')).toBe(false);
    expect(isValidUserAgentToObey('Foobot*')).toBe(false);
    expect(isValidUserAgentToObey(' Foobot ')).toBe(false);
    expect(isValidUserAgentToObey('Foobot/2.1')).toBe(false);
    expect(isValidUserAgentToObey('Foobot Bar')).toBe(false);
  });

  it('ID_UserAgentValueCaseInsensitive', () => {
    const upper = 'User-Agent: FOO BAR\nAllow: /x/\nDisallow: /\n';
    const lower = 'User-Agent: foo bar\nAllow: /x/\nDisallow: /\n';
    const camel = 'User-Agent: FoO bAr\nAllow: /x/\nDisallow: /\n';
    const ok = 'http://foo.bar/x/y';
    const no = 'http://foo.bar/a/b';
    for (const r of [upper, lower, camel]) {
      for (const ua of ['Foo', 'foo']) {
        expect(allowed(r, ua, ok)).toBe(true);
        expect(allowed(r, ua, no)).toBe(false);
      }
    }
  });

  it('GoogleOnly_AcceptUserAgentUpToFirstSpace', () => {
    expect(isValidUserAgentToObey('Foobot Bar')).toBe(false);
    const robotstxt = 'User-Agent: *\nDisallow: /\nUser-Agent: Foo Bar\nAllow: /x/\nDisallow: /\n';
    const url = 'http://foo.bar/x/y';
    expect(allowed(robotstxt, 'Foo', url)).toBe(true);
    expect(allowed(robotstxt, 'Foo Bar', url)).toBe(false);
  });

  it('ID_GlobalGroups_Secondary', () => {
    const empty = '';
    const global = 'user-agent: *\nallow: /\nuser-agent: FooBot\ndisallow: /\n';
    const onlySpecific =
      'user-agent: FooBot\nallow: /\nuser-agent: BarBot\ndisallow: /\nuser-agent: BazBot\ndisallow: /\n';
    const url = 'http://foo.bar/x/y';
    expect(allowed(empty, 'FooBot', url)).toBe(true);
    expect(allowed(global, 'FooBot', url)).toBe(false);
    expect(allowed(global, 'BarBot', url)).toBe(true);
    expect(allowed(onlySpecific, 'QuxBot', url)).toBe(true);
  });

  it('ID_AllowDisallow_Value_CaseSensitive', () => {
    const lowercaseUrl = 'user-agent: FooBot\ndisallow: /x/\n';
    const uppercaseUrl = 'user-agent: FooBot\ndisallow: /X/\n';
    const url = 'http://foo.bar/x/y';
    expect(allowed(lowercaseUrl, 'FooBot', url)).toBe(false);
    expect(allowed(uppercaseUrl, 'FooBot', url)).toBe(true);
  });

  it('ID_LongestMatch', () => {
    const url = 'http://foo.bar/x/page.html';
    expect(allowed('user-agent: FooBot\ndisallow: /x/page.html\nallow: /x/\n', 'FooBot', url)).toBe(
      false,
    );
    {
      const r = 'user-agent: FooBot\nallow: /x/page.html\ndisallow: /x/\n';
      expect(allowed(r, 'FooBot', url)).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/x/')).toBe(false);
    }
    expect(allowed('user-agent: FooBot\ndisallow: \nallow: \n', 'FooBot', url)).toBe(true);
    expect(allowed('user-agent: FooBot\ndisallow: /\nallow: /\n', 'FooBot', url)).toBe(true);
    {
      const r = 'user-agent: FooBot\ndisallow: /x\nallow: /x/\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/x')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/x/')).toBe(true);
    }
    expect(
      allowed('user-agent: FooBot\ndisallow: /x/page.html\nallow: /x/page.html\n', 'FooBot', url),
    ).toBe(true);
    {
      const r = 'user-agent: FooBot\nallow: /page\ndisallow: /*.html\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/page.html')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/page')).toBe(true);
    }
    {
      const r = 'user-agent: FooBot\nallow: /x/page.\ndisallow: /*.html\n';
      expect(allowed(r, 'FooBot', url)).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/x/y.html')).toBe(false);
    }
    {
      const r = 'User-agent: *\nDisallow: /x/\nUser-agent: FooBot\nDisallow: /y/\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/x/page')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/y/page')).toBe(false);
    }
  });

  it('ID_Encoding', () => {
    {
      const r =
        'User-agent: FooBot\nDisallow: /\nAllow: /foo/bar?qux=taz&baz=http://foo.bar?tar&par\n';
      expect(
        allowed(r, 'FooBot', 'http://foo.bar/foo/bar?qux=taz&baz=http://foo.bar?tar&par'),
      ).toBe(true);
    }
    {
      const r = 'User-agent: FooBot\nDisallow: /\nAllow: /foo/bar/ツ\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/bar/%E3%83%84')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/bar/ツ')).toBe(false);
    }
    {
      const r = 'User-agent: FooBot\nDisallow: /\nAllow: /foo/bar/%E3%83%84\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/bar/%E3%83%84')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/bar/ツ')).toBe(false);
    }
    {
      const r = 'User-agent: FooBot\nDisallow: /\nAllow: /foo/bar/%62%61%7A\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/bar/baz')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/bar/%62%61%7A')).toBe(true);
    }
  });

  it('ID_SpecialCharacters', () => {
    {
      const r = 'User-agent: FooBot\nDisallow: /foo/bar/quz\nAllow: /foo/*/qux\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/bar/quz')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/quz')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo//quz')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/bax/quz')).toBe(true);
    }
    {
      const r = 'User-agent: FooBot\nDisallow: /foo/bar$\nAllow: /foo/bar/qux\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/bar')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/bar/qux')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/bar/')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/bar/baz')).toBe(true);
    }
    {
      const r = 'User-agent: FooBot\n# Disallow: /\nDisallow: /foo/quz#qux\nAllow: /\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/bar')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/foo/quz')).toBe(false);
    }
  });

  it('GoogleOnly_IndexHTMLisDirectory', () => {
    const r = 'User-Agent: *\nAllow: /allowed-slash/index.html\nDisallow: /\n';
    expect(allowed(r, 'foobot', 'http://foo.com/allowed-slash/')).toBe(true);
    expect(allowed(r, 'foobot', 'http://foo.com/allowed-slash/index.htm')).toBe(false);
    expect(allowed(r, 'foobot', 'http://foo.com/allowed-slash/index.html')).toBe(true);
    expect(allowed(r, 'foobot', 'http://foo.com/anyother-url')).toBe(false);
  });

  it('GoogleOnly_LineTooLong', () => {
    const kEOLLen = 1;
    const kMaxLineLen = 2083 * 8;
    const allow = 'allow: ';
    const disallow = 'disallow: ';
    {
      let robotstxt = 'user-agent: FooBot\n';
      let longline = '/x/';
      const maxLength = kMaxLineLen - longline.length - disallow.length + kEOLLen;
      while (longline.length < maxLength) longline += 'a';
      robotstxt += disallow + longline + '/qux\n';
      expect(allowed(robotstxt, 'FooBot', 'http://foo.bar/fux')).toBe(true);
      expect(allowed(robotstxt, 'FooBot', `http://foo.bar${longline}/fux`)).toBe(false);
    }
    {
      let robotstxt = 'user-agent: FooBot\ndisallow: /\n';
      let a = '/x/';
      let b = '/x/';
      const maxLength = kMaxLineLen - a.length - allow.length + kEOLLen;
      while (a.length < maxLength) {
        a += 'a';
        b += 'b';
      }
      robotstxt += allow + a + '/qux\n';
      robotstxt += allow + b + '/qux\n';
      expect(allowed(robotstxt, 'FooBot', 'http://foo.bar/')).toBe(false);
      expect(allowed(robotstxt, 'FooBot', `http://foo.bar${a}/qux`)).toBe(true);
      expect(allowed(robotstxt, 'FooBot', `http://foo.bar${b}/fux`)).toBe(true);
    }
  });

  it('GoogleOnly_DocumentationChecks', () => {
    {
      const r = 'user-agent: FooBot\ndisallow: /\nallow: /fish\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/bar')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish.html')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish/salmon.html')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fishheads')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fishheads/yummy.html')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish.html?id=anything')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/Fish.asp')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/catfish')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/?id=fish')).toBe(false);
    }
    {
      const r = 'user-agent: FooBot\ndisallow: /\nallow: /fish*\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/bar')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish.html')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish/salmon.html')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fishheads')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fishheads/yummy.html')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish.html?id=anything')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/Fish.bar')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/catfish')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/?id=fish')).toBe(false);
    }
    {
      const r = 'user-agent: FooBot\ndisallow: /\nallow: /fish/\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/bar')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish/')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish/salmon')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish/?salmon')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish/salmon.html')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish/?id=anything')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish.html')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/Fish/Salmon.html')).toBe(false);
    }
    {
      const r = 'user-agent: FooBot\ndisallow: /\nallow: /*.php\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/bar')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/filename.php')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/folder/filename.php')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/folder/filename.php?parameters')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar//folder/any.php.file.html')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/filename.php/')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/index?f=filename.php/')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/php/')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/index?php')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/windows.PHP')).toBe(false);
    }
    {
      const r = 'user-agent: FooBot\ndisallow: /\nallow: /*.php$\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/bar')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/filename.php')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/folder/filename.php')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/filename.php?parameters')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/filename.php/')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/filename.php5')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/php/')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/filename?php')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/aaaphpaaa')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar//windows.PHP')).toBe(false);
    }
    {
      const r = 'user-agent: FooBot\ndisallow: /\nallow: /fish*.php\n';
      expect(allowed(r, 'FooBot', 'http://foo.bar/bar')).toBe(false);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fish.php')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/fishheads/catfish.php?parameters')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://foo.bar/Fish.PHP')).toBe(false);
    }
    expect(
      allowed('user-agent: FooBot\nallow: /p\ndisallow: /\n', 'FooBot', 'http://example.com/page'),
    ).toBe(true);
    expect(
      allowed(
        'user-agent: FooBot\nallow: /folder\ndisallow: /folder\n',
        'FooBot',
        'http://example.com/folder/page',
      ),
    ).toBe(true);
    expect(
      allowed(
        'user-agent: FooBot\nallow: /page\ndisallow: /*.htm\n',
        'FooBot',
        'http://example.com/page.htm',
      ),
    ).toBe(false);
    {
      const r = 'user-agent: FooBot\nallow: /$\ndisallow: /\n';
      expect(allowed(r, 'FooBot', 'http://example.com/')).toBe(true);
      expect(allowed(r, 'FooBot', 'http://example.com/page.html')).toBe(false);
    }
  });

  /** RobotsStatsReporter equivalent. */
  function stats(input: string | Uint8Array) {
    const { lines } = parseLines(input);
    const directives = lines.filter(
      (l): l is RobotsLine & { type: string } => l.kind === 'directive',
    );
    let lastLineSeen = 0;
    for (const l of lines) if (l.kind === 'directive') lastLineSeen = l.line;
    return {
      validDirectives: directives.filter((d) => d.type !== 'unknown').length,
      unknownDirectives: directives.filter((d) => d.type === 'unknown').length,
      lastLineSeen,
      sitemap: directives
        .filter((d) => d.type === 'sitemap')
        .map((d) => d.rawValue)
        .join(''),
    };
  }

  it('ID_LinesNumbersAreCountedCorrectly', () => {
    const files = [
      'User-Agent: foo\nAllow: /some/path\nUser-Agent: bar\n\n\nDisallow: /\n',
      'User-Agent: foo\r\nAllow: /some/path\r\nUser-Agent: bar\r\n\r\n\r\nDisallow: /\r\n',
      'User-Agent: foo\rAllow: /some/path\rUser-Agent: bar\r\r\rDisallow: /\r',
      'User-Agent: foo\nAllow: /some/path\nUser-Agent: bar\n\n\nDisallow: /',
      'User-Agent: foo\nAllow: /some/path\r\nUser-Agent: bar\n\r\n\nDisallow: /',
    ];
    for (const f of files) {
      const s = stats(f);
      expect(s.validDirectives).toBe(4);
      expect(s.lastLineSeen).toBe(6);
    }
  });

  it('ID_UTF8ByteOrderMarkIsSkipped', () => {
    const enc = (prefix: number[], rest: string) =>
      new Uint8Array([...prefix, ...new TextEncoder().encode(rest)]);
    const body = 'User-Agent: foo\nAllow: /AnyValue\n';
    let s = stats(enc([0xef, 0xbb, 0xbf], body));
    expect(s.validDirectives).toBe(2);
    expect(s.unknownDirectives).toBe(0);
    s = stats(enc([0xef, 0xbb], body));
    expect(s.validDirectives).toBe(2);
    expect(s.unknownDirectives).toBe(0);
    s = stats(enc([0xef], body));
    expect(s.validDirectives).toBe(2);
    expect(s.unknownDirectives).toBe(0);
    s = stats(enc([0xef, 0x11, 0xbf], body));
    expect(s.validDirectives).toBe(1);
    expect(s.unknownDirectives).toBe(1);
    s = stats(
      new Uint8Array([
        ...new TextEncoder().encode('User-Agent: foo\n'),
        0xef,
        0xbb,
        0xbf,
        ...new TextEncoder().encode('Allow: /AnyValue\n'),
      ]),
    );
    expect(s.validDirectives).toBe(1);
    expect(s.unknownDirectives).toBe(1);
    // String input with a BOM character behaves like the full byte BOM.
    s = stats('﻿' + body);
    expect(s.validDirectives).toBe(2);
  });

  it('ID_NonStandardLineExample_Sitemap', () => {
    const loc = 'http://foo.bar/sitemap.xml';
    const temp = 'User-Agent: foo\nAllow: /some/path\nUser-Agent: bar\n\n\n';
    expect(stats(temp + `Sitemap: ${loc}\n`).sitemap).toBe(loc);
    expect(stats(`Sitemap: ${loc}\n` + temp).sitemap).toBe(loc);
  });

  it('TestGetPathParamsQuery', () => {
    const cases: [string, string][] = [
      ['', '/'],
      ['http://www.example.com', '/'],
      ['http://www.example.com/', '/'],
      ['http://www.example.com/a', '/a'],
      ['http://www.example.com/a/', '/a/'],
      ['http://www.example.com/a/b?c=http://d.e/', '/a/b?c=http://d.e/'],
      ['http://www.example.com/a/b?c=d&e=f#fragment', '/a/b?c=d&e=f'],
      ['example.com', '/'],
      ['example.com/', '/'],
      ['example.com/a', '/a'],
      ['example.com/a/', '/a/'],
      ['example.com/a/b?c=d&e=f#fragment', '/a/b?c=d&e=f'],
      ['a', '/'],
      ['a/', '/'],
      ['/a', '/a'],
      ['a/b', '/b'],
      ['example.com?a', '/?a'],
      ['example.com/a;b#c', '/a;b'],
      ['//a/b/c', '/b/c'],
    ];
    for (const [url, path] of cases) expect(getPathParamsQuery(url), url).toBe(path);
  });

  it('TestMaybeEscapePattern', () => {
    expect(escapePattern('http://www.example.com')).toBe('http://www.example.com');
    expect(escapePattern('/a/b/c')).toBe('/a/b/c');
    expect(escapePattern('á')).toBe('%C3%A1');
    expect(escapePattern('%aa')).toBe('%AA');
  });
});
