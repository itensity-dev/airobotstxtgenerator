---
title: "Block AI Crawlers in nginx (map $http_user_agent)"
description: "nginx config to block GPTBot, ClaudeBot, CCBot, Bytespider and other AI crawlers with a map on $http_user_agent — 403 for AI bots, robots.txt still reachable. Copy-ready."
h1: "Block AI crawlers in nginx"
nav: "nginx"
lead: "A `map` on `$http_user_agent` marks AI crawlers once in the `http` block; a two-line `if` in each `server` block answers them with 403 while `/robots.txt` stays open."
steps:
  - "Select the agents and copy the configuration."
  - "Put the `map` block in the `http {}` context — for example in a new file `/etc/nginx/conf.d/ai-bots.conf`, which most distributions include automatically."
  - "Put the `location = /robots.txt` block and the `if ($is_ai_bot)` lines inside every `server {}` block that should refuse AI crawlers."
  - "Run `nginx -t` to check the syntax, then `systemctl reload nginx`."
  - "Test: `curl -I -A \"Mozilla/5.0 (compatible; GPTBot/1.4)\" https://example.com/` returns 403; `curl -I https://example.com/robots.txt` still returns 200."
capabilities:
  - feature: "Case-insensitive matching"
    status: "yes"
    note: "Each line uses `~*`, nginx's case-insensitive regular expression."
  - feature: "One list for all sites"
    status: "yes"
    note: "The `map` lives in `http {}`, so every server block can use `$is_ai_bot`."
  - feature: "Safe use of if"
    status: "yes"
    note: "`if` with `return` is one of the uses nginx documents as safe inside `server`."
  - feature: "Works behind a CDN"
    status: "partly"
    note: "nginx sees the User-Agent the CDN forwards — usually the original one. Bots blocked at the CDN never reach nginx."
faq:
  - q: "Why a map instead of a long if condition?"
    a: "nginx evaluates `map` lazily and once per request, the list stays readable with one bot per line, and you can reuse the variable in several server blocks or in logging (`access_log ... if=$is_ai_bot`)."
  - q: "Can I log AI bot requests instead of blocking them?"
    a: "Yes: keep the `map` and replace the `if` with a separate log, for example `access_log /var/log/nginx/ai-bots.log combined if=$is_ai_bot;`."
  - q: "How do I allow a bot only from its real IP addresses?"
    a: "Use the `geo` module with the operator's published ranges, combine it with the User-Agent map, and refuse requests that claim to be the bot from other addresses. The ranges change, so update them with a script."
related: ["server-rules", "server-apache", "server-caddy", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Where each part goes

nginx reads configuration in contexts. The `map` directive is only allowed in `http {}`; the `if` and `location` directives belong in `server {}`. If you manage several sites, define the map once and add the three lines to each site. Keep `location = /robots.txt` before other locations that might rewrite or proxy the request — an exact-match location always wins in nginx.

If nginx is a reverse proxy in front of an application, the rule stops the request before it reaches the application, which also saves the application's resources.
