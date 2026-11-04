---
title: "Block AI Bots at the Server: nginx, Apache, Caddy, Cloudflare rules"
description: "Generate server rules that return 403 to AI crawlers by User-Agent — nginx, Apache .htaccess, Caddy, Cloudflare WAF, Express, Next.js, Django, PHP — plus how to verify bots by IP and reverse DNS."
h1: "Block AI bots at the server"
nav: "Server rules"
lead: "robots.txt only asks; these rules make your server refuse AI crawlers by their User-Agent. Pick a server and the agents to block, copy the rule, and verify genuine bots by IP or reverse DNS."
steps:
  - "Choose your server or framework: nginx, Apache, Caddy, Cloudflare WAF, Express, Next.js, Django or PHP."
  - "Choose the agents: training crawlers only, every AI agent, or your own selection from the register."
  - "Pick the response code — `403 Forbidden` is the clearest signal; `404` or `410` hide that you block."
  - "Paste the rule where the comments say, reload the server, then check with `curl -A \"GPTBot\" -I https://your-site/` — you should get the code you chose, while `/robots.txt` stays reachable."
capabilities:
  - feature: "Skips robots.txt-only tokens"
    status: "yes"
    note: "Google-Extended, Applebot-Extended, FirecrawlAgent and `__usage_ai-training` never appear in a User-Agent header, so they are left out instead of producing dead rules."
  - feature: "Never blocks search engines or link previews"
    status: "yes"
    note: "Googlebot, Bingbot, Applebot and facebookexternalhit are not offered in the presets; generic community names (Code, Spider, OpenAI …) are left out so that unrelated traffic is not blocked."
  - feature: "Keeps /robots.txt reachable"
    status: "yes"
    note: "Every rule exempts `/robots.txt`, so crawlers can still read your policy."
  - feature: "Stops spoofed or undeclared bots"
    status: "no"
    note: "User-Agent matching stops only bots that identify themselves. Bots using a browser User-Agent need rate limits, bot management or IP-based rules."
  - feature: "Cloudflare expression length"
    status: "partly"
    note: "Custom rule expressions are limited to 4,096 characters; the tool warns when a selection is too long."
faq:
  - q: "Should I block AI crawlers in robots.txt or on the server?"
    a: "Both, for different reasons. robots.txt is the documented, machine-readable way to state your choice — it is what the EU GPAI Code of Practice refers to — and well-behaved crawlers follow it. Server rules enforce the choice for crawlers that ignore robots.txt or fetch pages on a user's behalf."
  - q: "Can a bot get around User-Agent blocking?"
    a: "Yes, by sending a different User-Agent. That is why operators publish IP ranges or sign their requests: with those you can allow only genuine requests for a bot you trust, or block a bot by its network. The table below lists every published IP list and hostname."
  - q: "Will blocking with 403 hurt my SEO?"
    a: "Not if you block only AI-specific agents. Never block Googlebot, Bingbot or Applebot this way; Google-Extended and Applebot-Extended control AI use without touching search."
  - q: "Which response code should I use?"
    a: "`403 Forbidden` states clearly that access is refused. Some site owners prefer `404` or `410` so the crawler records nothing useful. All three stop the content from being delivered."
related: ["server-nginx", "server-apache", "server-cloudflare", "bots", "guide-bad-bots"]
updated: "2026-11-04"
---

## How the rules are built

The rules come from the same [register](page:bots) as the generator. For each selected agent we take the substrings its operator documents in the User-Agent header (for example `GPTBot` or `ClaudeBot`), remove duplicates and names already covered by a shorter one, and write a case-insensitive match for your server. Agents that are only robots.txt tokens are skipped with a note, because no request ever carries their name.

## Verifying that a bot is genuine

A User-Agent string is just text, and fake “GPTBot” or “Googlebot” requests are common. Operators offer three ways to prove a request is real:

- **IP lists** — JSON files with the address ranges the crawler uses (OpenAI, Anthropic, Perplexity, Google, Common Crawl, DuckDuckGo and others). Compare the client IP with the ranges and refresh the list regularly.
- **Reverse DNS** — look up the hostname of the client IP, check that it ends with the operator's domain (for example `googlebot.com` or `applebot.apple.com`), then resolve that hostname forwards and confirm it returns the same IP.
- **Signed requests (Web Bot Auth)** — the request carries an HTTP Message Signature that can be checked against the operator's published key (Exa, You.com, ChatGPT's agent, some Google-Agent requests).

Each [bot page](page:bots) has a ready Node.js snippet for its method.
