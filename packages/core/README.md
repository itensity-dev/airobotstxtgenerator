# @airobots/core

The engine behind [airobotstxtgenerator.com](https://airobotstxtgenerator.com): a robots.txt parser and
matcher that gives the same answers as Google's reference parser, an AI crawler registry with sources,
a robots.txt generator, a linter, a "merge into my file" mode with an equivalence check, and builders for
server rules (nginx, Apache, Caddy, Cloudflare WAF, Express, Next.js, Django, PHP), llms.txt and TDMRep.

Zero runtime dependencies. Works in browsers, Node.js, Deno and workers.

```js
import { isAllowed, matchUrl, lintRobotsTxt, generateRobotsTxt, curatedBots } from '@airobots/core';

isAllowed('User-agent: GPTBot\nDisallow: /\n', 'GPTBot', 'https://example.com/page'); // false

matchUrl(robotsTxt, 'ClaudeBot', '/blog/post'); // { allowed, via, decidingRule: { type, line, pattern }, ... }

generateRobotsTxt(curatedBots, { goal: 'block-training', sitemaps: ['https://example.com/sitemap.xml'] }).text;

lintRobotsTxt(robotsTxt, { bots: curatedBots }); // [{ code, severity, line, message, params }]
```

## Matching rules (RFC 9309 as implemented by Google)

- A crawler obeys every group that names it (merged); only if none does, it obeys the `*` groups.
- A group that names a crawler but has no rules allows everything — `*` rules no longer apply to it.
- Longest matching pattern wins; Allow wins a tie. `*` matches anything, a final `$` anchors the end.
- Google's tolerances are reproduced: misspelt keys, missing colons, UTF-8 BOM, CR/LF/CRLF, long lines.

The test suite contains every case from [google/robotstxt](https://github.com/google/robotstxt)'s
`robots_test.cc` and compares verdicts on 46 real robots.txt files with the compiled reference parser.

## Data

`@airobots/core/bots.json` — curated AI crawler registry: token, User-Agent, operator, purpose
(training / search / user / mixed), robots.txt compliance with the operator's statement, IP list,
verification method, primary source and the date of the last check. Licensed CC BY 4.0.

`@airobots/core/community-bots.json` — additional agents imported weekly from
[ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt) (MIT License).

## License

Code: MIT. Bot registry data: CC BY 4.0 (attribution: airobotstxtgenerator.com).
