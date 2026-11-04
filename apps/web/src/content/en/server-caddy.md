---
title: "Block AI Crawlers in Caddy (Caddyfile header_regexp)"
description: "Caddyfile rule to block GPTBot, ClaudeBot and other AI crawlers with a named matcher on the User-Agent header — 403 for AI bots, robots.txt still reachable."
h1: "Block AI crawlers in Caddy"
nav: "Caddy"
lead: "A named matcher with `header_regexp User-Agent` selects AI crawlers, excludes `/robots.txt`, and `respond` answers them before any other handler."
steps:
  - "Select the agents and copy the snippet."
  - "Paste it inside your site block in the Caddyfile, before `reverse_proxy`, `php_fastcgi` or `file_server`."
  - "Run `caddy validate --config /etc/caddy/Caddyfile`, then `caddy reload --config /etc/caddy/Caddyfile`."
  - "Test with `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Case-insensitive regular expression"
    status: "yes"
    note: "`(?i)` at the start of the pattern makes the match case-insensitive."
  - feature: "Order of directives"
    status: "yes"
    note: "Caddy sorts directives itself; `respond` runs before `reverse_proxy` and `file_server`."
  - feature: "JSON configuration"
    status: "partly"
    note: "The snippet is for the Caddyfile; `caddy adapt` converts it to JSON."
faq:
  - q: "Can I reuse the matcher in several sites?"
    a: "Yes: put it in a snippet — `(ai_bots) { … }` — and `import ai_bots` in each site block."
  - q: "How do I log blocked requests?"
    a: "Caddy logs every request including the response status; filter the access log for status 403 and the matched User-Agents."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## What the snippet does

`@ai_bots` is a named matcher: a request matches only if every condition inside is true — the User-Agent header matches the expression and the path is not `/robots.txt`. `respond @ai_bots 403` ends those requests immediately with an empty 403 response. Everything else continues to your normal handlers.
