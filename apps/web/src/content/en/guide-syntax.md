---
title: "robots.txt Syntax (RFC 9309) with Examples"
description: "robots.txt syntax explained with examples: groups, User-agent, Allow and Disallow, wildcards * and $, longest match, why a bot ignores User-agent: * once named, file size, status codes and common mistakes."
h1: "robots.txt syntax per RFC 9309, with examples"
nav: "robots.txt syntax"
lead: "robots.txt became an Internet standard in September 2022 as RFC 9309. Its rules are short, but a few of them — longest match, one group per crawler, blank lines — surprise almost everyone. Each example below can be pasted into the tester."
related: ["tester", "home", "guide-bad-bots", "bots"]
updated: "2026-11-04"
faq:
  - q: "Is robots.txt case-sensitive?"
    a: "Directive names (`User-agent`, `Disallow`) and bot names are not; paths are. `Disallow: /Private/` does not block `/private/`."
  - q: "Can I use regular expressions?"
    a: "No. Only `*` (any sequence of characters) and `$` at the end of a pattern (end of URL) are special."
  - q: "Do I need an Allow line?"
    a: "Only to re-open a path inside a disallowed one. Everything not disallowed is allowed."
  - q: "Does robots.txt apply to subdomains?"
    a: "No. Each combination of scheme, host and port has its own file: `https://example.com/robots.txt` does not cover `https://blog.example.com/`."
---

## The file

robots.txt is a UTF-8 plain-text file at the root of a host: `https://example.com/robots.txt`. Crawlers fetch it before crawling. Lines have the form `key: value`; `#` starts a comment. Google reads up to **500 KiB** and ignores the rest.

## Groups

A **group** is one or more `User-agent` lines followed by rules:

```
User-agent: GPTBot
User-agent: CCBot
Disallow: /

User-agent: *
Disallow: /admin/
```

- A crawler uses the group(s) that **name** it. Matching is case-insensitive and uses only the product token: `User-agent: GPTBot/1.4` is read as `GPTBot`.
- If several groups name the same crawler, their rules are **merged**.
- Only a crawler that no group names uses `User-agent: *`.
- A crawler with its own group **ignores `*` completely**. In the example, `GPTBot` may not fetch anything — but if its group said only `Disallow: /blog/`, it could fetch `/admin/`, because the `*` rule no longer applies to it.

**Blank lines do not end a group.** This file gives `GPTBot` the `*` rules, because both User-agent lines belong to the same group:

```
User-agent: GPTBot

User-agent: *
Disallow: /private/
```

## Rules: Allow and Disallow

`Disallow: /path` blocks every URL whose path starts with `/path` — including `/path.html`, `/path/` and `/pathology`. An empty `Disallow:` allows everything. `Allow` re-opens a path.

When several rules match, **the longest pattern wins**; if an Allow and a Disallow pattern have the same length, **Allow wins**. The order of lines does not matter.

```
User-agent: *
Disallow: /shop/
Allow: /shop/catalog/
```

`/shop/cart` is blocked; `/shop/catalog/shoes` is allowed (14 characters beat 6).

## Wildcards

- `*` matches any sequence of characters: `Disallow: /*.pdf` blocks every URL containing `.pdf`.
- `$` at the end anchors the end of the URL: `Disallow: /*.pdf$` blocks `/a.pdf` but not `/a.pdf?download=1`.
- A trailing `*` changes nothing: `/private*` equals `/private`.
- Patterns are matched against the path **and query**: `Disallow: /*?sort=` blocks sorted listing pages.

## Other lines

- `Sitemap: https://example.com/sitemap.xml` — a full URL; applies to all crawlers, anywhere in the file.
- `Crawl-delay` — ignored by Google; Bing, Yandex, Anthropic and Common Crawl honour it.
- `Noindex` in robots.txt — not supported since 2019; use a robots meta tag.
- `Content-Signal`, `Content-Usage` — AI preference proposals; see [content signals](page:content-signals).

## When the file is missing or broken

| Response for /robots.txt | Google's behaviour |
|---|---|
| 200 | Rules apply |
| 3xx | Follows up to 5 redirects, then treats it as 404 |
| 4xx (except 429) | No restrictions — everything may be crawled |
| 5xx, 429 | Crawling paused; after ~30 days a cached copy or no restrictions |
| Unreachable | Treated like 5xx |

## Mistakes Google forgives — and others may not

Google accepts `Dissallow`, `User agent`, a missing colon (`Disallow /admin`) and a byte order mark. Other crawlers may not, so the [tester](page:tester) flags them even though Google's parser reads them. It also flags rules before any `User-agent` line (ignored by everyone), full URLs in `Disallow` (never match), and paths without a leading slash.
