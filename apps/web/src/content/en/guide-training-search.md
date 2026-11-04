---
title: "How to Block AI Training but Stay in AI Search (robots.txt)"
description: "Block GPTBot, ClaudeBot, Google-Extended and other training crawlers while staying visible in ChatGPT search, Claude, Perplexity and Google AI Overviews. Which bots to block, which to allow, with a tested robots.txt."
h1: "How to block AI training but stay visible in AI search"
nav: "Block AI training, keep AI search"
lead: "Most AI companies now run separate agents for training, for search and for user requests. Block the training crawlers and tokens, allow the search agents, and your pages stay citable in AI answers without feeding the next model."
related: ["home", "bots", "tester", "server-rules", "content-signals"]
updated: "2026-11-04"
faq:
  - q: "If I block GPTBot, will my site disappear from ChatGPT?"
    a: "No. ChatGPT's search answers come from OAI-SearchBot's index, which is separate. Block GPTBot and allow OAI-SearchBot to stay citable."
  - q: "Do I need to block Googlebot to keep my content out of Gemini?"
    a: "No — and you should not, because that removes you from Google Search. Disallow `Google-Extended` to opt out of Gemini training and grounding. AI Overviews are part of Search and are controlled with snippet tags like `nosnippet`, not with Google-Extended."
  - q: "Does blocking training crawlers remove my content from models that were already trained?"
    a: "No. A robots.txt rule only affects future crawling. Some companies offer separate removal or opt-out processes for existing data; check their documentation."
  - q: "What about Common Crawl?"
    a: "CCBot's archive is used by many AI developers, so blocking it is part of a training opt-out. It also removes your pages from future Common Crawl snapshots used for research."
---

## The three kinds of AI agents

Since 2024 the large AI companies have split their crawlers by purpose, largely so that publishers can make this exact choice:

| Company | Training | AI search (index and cite) | User request (live fetch) |
|---|---|---|---|
| OpenAI | `GPTBot` | `OAI-SearchBot` | `ChatGPT-User` |
| Anthropic | `ClaudeBot` | `Claude-SearchBot` | `Claude-User` |
| Perplexity | — (says it does not train on crawled content) | `PerplexityBot` | `Perplexity-User` |
| Google | `Google-Extended` (token) | Googlebot (Search, AI Overviews) | `Google-Agent`, `Google-GeminiNotebook` |
| Apple | `Applebot-Extended` (token) | Applebot | — |
| Meta | `meta-externalagent` | `meta-webindexer` | `meta-externalfetcher` |
| Mistral | `MistralAI-Training` | `MistralAI-Index` | `MistralAI-User` |
| Amazon | `Amazonbot` (also other uses) | `Amzn-SearchBot` | `Amzn-User` |

**Training** crawlers and tokens decide whether your pages can end up in a model's training data. **Search** agents decide whether an AI product can find and cite you — this is where AI referral traffic comes from. **User** fetchers open a page because a person asked for it; several operators say robots.txt may not apply to them.

## The robots.txt

The [generator](page:home)'s first goal produces this policy for every documented agent. The core of it looks like this:

```
# AI training crawlers — blocked
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: CCBot
User-agent: meta-externalagent
User-agent: MistralAI-Training
User-agent: Bytespider
Disallow: /

# AI usage controls (robots.txt tokens, not crawlers) — blocked
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: __usage_ai-training
Disallow: /

# Everyone else, including OAI-SearchBot, Claude-SearchBot, PerplexityBot
User-agent: *
Disallow: /admin/
```

Nothing names the search agents: they have no group of their own, so they follow `User-agent: *` like Google and Bing. That is deliberate. If you give a search agent its own group — for example to close `/premium/` to it — it stops reading the `*` group entirely, so you must repeat every `*` rule in its group. The generator does this for you when you add an AI-only path exception.

## Mixed-purpose crawlers

Some agents serve several purposes with one name. `Amazonbot` improves Amazon's products and may be used for training; `meta-externalagent` both trains models and indexes content; `CCBot`'s archive feeds research as well as AI training. The generator treats them as training crawlers in this preset, which keeps the policy strict, and tells you which agents fall into this group so you can switch individual ones to *allow* in the custom mode.

General crawlers are a different case: `Googlebot`, `Bingbot` and `Applebot` feed search engines and, through them, AI features such as AI Overviews and Copilot. Never block them to stop AI training — use `Google-Extended`, `Applebot-Extended` and, for Bing, the `noarchive`/`nocache` tags or the `__usage_ai-training` group Bing supports from 2027.

## Check the result

1. Paste the file into the [tester](page:tester) and look at the crawler table: training agents **Blocked**, search agents **Allowed**.
2. Test a few important URLs for `OAI-SearchBot` and `PerplexityBot`.
3. If you use Cloudflare, check its AI Crawl Control settings too: a CDN block overrides an allow in robots.txt.
4. For agents that ignore robots.txt, add [server rules](page:server-rules).
