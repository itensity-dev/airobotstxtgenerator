---
title: "AI Crawler List: every AI bot user agent and how to block it"
description: "Register of {{all}} AI crawlers, AI agents and robots.txt tokens — GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bytespider and more — with operator, purpose, robots.txt compliance, IP lists and sources."
h1: "AI crawler register"
nav: "Bot register"
lead: "Every AI crawler, AI agent and robots.txt control token we could document: who runs it, what it collects, whether its operator says it follows robots.txt, how to verify it — with a link to the source and the date of our last check."
steps:
  - "Search the register by name or company, or scan it by operator."
  - "Open an agent's page for its User-Agent, robots.txt token, IP list and ready-to-copy rules."
  - "Use the purpose column to decide: training crawlers can usually be blocked without losing visibility; AI search and user agents bring citations and visitors."
  - "Build a complete file with the [generator](page:home) or test your current one with the [tester](page:tester)."
capabilities:
  - feature: "Source for every entry"
    status: "yes"
    note: "Each curated entry links the operator's own documentation; where none exists, the page says so."
  - feature: "Date of the last check"
    status: "yes"
    note: "Shown per agent, with how it was checked (page opened or read through a search index)."
  - feature: "Machine-readable"
    status: "yes"
    note: "The whole register is available as [/bots.json](/bots.json) under CC BY 4.0."
  - feature: "Weekly update"
    status: "yes"
    note: "A weekly job compares the community list with ai.robots.txt and opens a pull request; curated entries are reviewed by hand."
  - feature: "Proof that a request is genuine"
    status: "partly"
    note: "Only where the operator publishes IP ranges, reverse-DNS hostnames or signatures. Anyone can fake a User-Agent string."
faq:
  - q: "Which AI crawlers should I block?"
    a: "It depends on what you want. To keep content out of AI training but stay visible in AI answers, block the training crawlers and tokens (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent, Bytespider, MistralAI-Training) and allow the search agents (OAI-SearchBot, Claude-SearchBot, PerplexityBot). The [guide](page:guide-training-search) explains the trade-offs."
  - q: "What is the difference between a crawler and a robots.txt token?"
    a: "A crawler sends requests with its own User-Agent. A token such as Google-Extended or Applebot-Extended never visits your site; it is a name in robots.txt that tells the operator how content fetched by its regular crawler may be used. Tokens can only be controlled in robots.txt, not with server rules."
  - q: "Why do some agents ignore robots.txt?"
    a: "Fetchers that act on a person's request — ChatGPT-User, Perplexity-User, Google-Agent, meta-externalfetcher — are treated by their operators like a browser and may not follow robots.txt. Some crawlers publish no policy at all. For those, block at the server or CDN."
  - q: "How current is the list?"
    a: "Curated entries were checked against operator documentation on {{updated}}; each page shows its own date. The community list is synchronised with ai.robots.txt every week."
  - q: "Can I use the data?"
    a: "Yes. The register is published as JSON at /bots.json under CC BY 4.0 — please credit airobotstxtgenerator.com. Community entries come from the ai.robots.txt project under the MIT License."
related: ["home", "tester", "server-rules", "guide-training-search"]
updated: "2026-11-04"
---

## How the register is built

Each curated entry starts from the operator's own documentation: OpenAI, Anthropic, Google, Apple, Perplexity, Meta, Amazon, Mistral, DuckDuckGo, Microsoft, Common Crawl and others publish pages describing their crawlers. From these pages we record the robots.txt token, a documented User-Agent string, the purpose, the operator's statement about robots.txt, published IP lists or hostnames, and the date we checked. When an operator publishes nothing — ByteDance for Bytespider, for example — the entry is marked as based on independent observations.

**Purposes** follow the categories that operators and Cloudflare now use: *AI training*, *AI search* (index and cite), *user-requested fetches* (an assistant opening a page for a person) and *robots.txt tokens*. General crawlers such as Googlebot, Bingbot and Applebot are listed for reference, because many AI features rely on them.

The **community list** below the main table comes from the open [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt) project. It is broader but not individually verified; some of its names are contradicted by the operators themselves (Cohere says it runs no crawler, Brave has no distinct User-Agent, Exa's crawler is ExaSearchBot).
