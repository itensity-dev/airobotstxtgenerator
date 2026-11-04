---
title: "Why robots.txt Does Not Protect You From Bad Bots"
description: "robots.txt is a public request, not access control: which bots ignore it, why User-Agents can be faked, what robots.txt reveals, and what to use instead — server rules, IP verification, rate limits, WAF."
h1: "Why robots.txt does not protect you from bad bots"
nav: "robots.txt vs bad bots"
lead: "robots.txt is a sign on the door, not a lock. It works because responsible crawlers choose to read it; scrapers that do not care, or that pretend to be someone else, are not stopped by it."
related: ["server-rules", "tester", "bots", "guide-syntax"]
updated: "2026-11-04"
faq:
  - q: "Can robots.txt make a page private?"
    a: "No. Anyone can open a disallowed URL, and listing it in robots.txt advertises it. Protect private content with authentication."
  - q: "How do I know whether a bot ignores my robots.txt?"
    a: "Look for requests to disallowed paths in your server logs with that bot's User-Agent, and verify the IP: a request from outside the operator's published ranges is not the real bot."
  - q: "Should I just block everything that looks like a bot?"
    a: "No — you would lose search engines, link previews, uptime monitors and accessibility tools. Block by name where you can, verify where operators let you, and rate-limit the rest."
---

## What robots.txt is

RFC 9309 says it plainly: the rules “are not a form of access authorization”. A crawler fetches `/robots.txt`, reads the group that names it and decides to obey. Nothing in HTTP enforces that decision.

## Who ignores it

- **Scrapers and data harvesters** that never asked for permission. Many use ordinary browser User-Agents.
- **Fetchers acting for a user.** OpenAI, Perplexity, Google and Meta say their user-triggered fetchers (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`, `meta-externalfetcher`) may not follow robots.txt, because a person asked for the page. Anthropic says its `Claude-User` does.
- **Crawlers that publish no policy** — `Bytespider`, for example, has no official documentation, and site owners have reported it ignoring robots.txt.
- **Impostors.** Anyone can send `User-Agent: GPTBot` or `Googlebot`. Fake search-engine User-Agents are a classic way around naive blocks.

## What robots.txt reveals

The file is public. A `Disallow: /admin-backup-2024/` line tells everyone the path exists. Do not list secrets; protect them.

## What to use instead — or as well

| Measure | Stops | Notes |
|---|---|---|
| robots.txt | Crawlers that follow it | The standard, documented signal. Keep it. |
| [Server rules](page:server-rules) by User-Agent | Bots that announce themselves | Cheap and effective for named AI crawlers |
| IP / reverse-DNS verification | Impostors claiming to be a known bot | Use the operator's published ranges; see each [bot page](page:bots) |
| Rate limiting | High-volume scrapers of any name | Per IP or per network; protects the server |
| CDN bot management / WAF | Known bad networks, browser automation | Cloudflare, Fastly, Akamai and others classify bots |
| Authentication | Everyone without an account | The only real protection for private content |

## A sensible order

1. Publish an honest robots.txt — it documents your choice and is what the EU Code of Practice points to.
2. Block the AI agents you object to by name at the server or CDN.
3. Verify the bots you allow, so that impostors using their names are refused.
4. Rate-limit everything else and watch your logs.
