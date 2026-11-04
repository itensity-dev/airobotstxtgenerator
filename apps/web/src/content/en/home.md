---
title: "AI robots.txt Generator — block GPTBot, ClaudeBot & AI crawlers"
description: "Free AI robots.txt generator: block AI training (GPTBot, ClaudeBot, Google-Extended, CCBot) and keep AI search, or block all AI. Every file is checked against RFC 9309."
h1: "AI robots.txt generator"
nav: "robots.txt generator"
lead: "Pick your site type and goal; the generator writes a robots.txt for 50 documented AI crawlers and tokens, explains every line and checks the result with an RFC 9309 parser before you copy it."
steps:
  - "Choose the **site type** — it sets sensible starting paths (a shop closes `/cart/` and `/checkout/` to every crawler, a news site closes `/premium/` to AI bots)."
  - "Choose the **goal**: no AI training but stay in AI search, no AI at all, allow everything, or decide bot by bot."
  - "Add **path exceptions**, for example open `/blog/` to every AI bot or close `/members/` to all of them."
  - "Copy or download the file and upload it as `robots.txt` to the root of each host (`https://example.com/robots.txt`). Already have a file? Use **Add to my robots.txt** — it appends the AI section and proves your existing rules still work the same."
  - "Test the live file with the [robots.txt tester](page:tester) and, for crawlers that ignore robots.txt, add [server rules](page:server-rules)."
capabilities:
  - feature: "AI crawler list"
    status: "yes"
    note: "50 agents and tokens with the operator's own documentation and the date of the last check; 149 more from the ai.robots.txt community list on request."
  - feature: "Presets by purpose"
    status: "yes"
    note: "Training, AI search, user-requested fetches and robots.txt-only tokens are treated separately."
  - feature: "Self-check"
    status: "yes"
    note: "Each file is parsed with the same rules as Google's open-source parser; every agent is tested on `/`, your exception paths and your closed paths."
  - feature: "Merge into an existing file"
    status: "yes"
    note: "Appends an AI section, shows a diff and compares old and new decisions for every agent already in your file."
  - feature: "Content-Signal lines"
    status: "partly"
    note: "Optional `Content-Signal` for the `*` group. It is a Cloudflare proposal, not a standard."
  - feature: "Stop bots that ignore robots.txt"
    status: "no"
    note: "robots.txt is a request. Use [server rules](page:server-rules) or a WAF for enforcement."
  - feature: "Sign-up, upload, tracking of your input"
    status: "no"
    note: "Generation runs in your browser and works offline; your paths and files are not sent anywhere."
faq:
  - q: "How do I block AI training but stay visible in ChatGPT, Claude and Perplexity search?"
    a: "Block the training crawlers and tokens — `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `meta-externalagent` and others — and leave the search agents (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`) allowed. That is the first goal in the generator. Details in the guide [Block AI training, keep AI search](page:guide-training-search)."
  - q: "Does blocking Google-Extended remove my site from Google Search or AI Overviews?"
    a: "No. `Google-Extended` is a robots.txt token, not a crawler: it controls whether Google may use content for Gemini training and grounding. Google Search, including AI Overviews and AI Mode, uses `Googlebot`."
  - q: "Why does the generated file repeat some rules?"
    a: "A crawler that is named in its own group ignores the `User-agent: *` group completely. When AI bots need their own group (for example to close `/premium/` to them), the generator copies your `*` rules into that group so nothing is lost."
  - q: "Will every AI company respect this file?"
    a: "Most large operators state that their crawlers follow robots.txt. Fetchers that act on a user's request (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`) may not, and some crawlers publish no statement at all. The bot register shows each operator's statement with a link to the source."
  - q: "Where does the robots.txt file go?"
    a: "At the root of every host and protocol you want to cover: `https://example.com/robots.txt` does not apply to `https://shop.example.com/`. The file must be plain text, UTF-8, and smaller than 500 KiB for Google."
  - q: "Is my input stored?"
    a: "No. The generator runs entirely in your browser. We count only that a file was generated and which preset was used, without your paths or text."
related: ["tester", "bots", "server-rules", "guide-training-search", "llms-txt"]
updated: "2026-11-04"
---

## How the generator decides

Every agent in the register has a **purpose** taken from its operator's documentation:

- **AI training** — collects pages that may be used to train models (`GPTBot`, `ClaudeBot`, `CCBot`, `MistralAI-Training`).
- **robots.txt tokens** — not crawlers at all, but names that control how content fetched by a general crawler may be used (`Google-Extended`, `Applebot-Extended`, `__usage_ai-training`).
- **AI search** — indexes pages so an AI product can cite and link them (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`).
- **User-requested fetches** — open a page because a person asked an assistant (`ChatGPT-User`, `Claude-User`, `Perplexity-User`).
- **General crawlers** — `Googlebot`, `Bingbot`, `Applebot` and link-preview fetchers are never blocked by a preset, because blocking them removes you from regular search or breaks link previews.

The goal decides which purposes are closed. The generator then writes one group per purpose, so the file stays readable, and adds your path exceptions to each group.

## Why the file is checked before you see it

robots.txt has a few rules that surprise people: the **longest matching rule wins**, an **Allow wins a tie**, a crawler with its **own group ignores `User-agent: *`**, and **blank lines do not separate groups**. After building the file, the generator parses it with the same algorithm as Google's open-source parser (we test against Google's own test cases and 46 real robots.txt files) and asks, for every agent and every relevant path, whether the answer matches the policy you chose. The stamp under the file shows how many checks were made.

## What robots.txt cannot do

robots.txt is a public request, defined in [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html). Well-behaved crawlers follow it; others do not, and anyone can send a fake User-Agent. For enforcement, block at the server or CDN — the [server rules](page:server-rules) page builds nginx, Apache, Caddy and Cloudflare rules from the same register — and verify bots by IP or reverse DNS.
