---
title: "Content-Signal & Content-Usage Generator for robots.txt (AI preferences)"
description: "Write Content-Signal lines (Cloudflare: search, ai-input, ai-train) and Content-Usage lines (IETF aipref draft: train-ai, ai-use, search) for robots.txt and HTTP headers — with an honest note on support."
h1: "Content-Signal and Content-Usage generator"
nav: "Content signals"
lead: "State how your content may be used after it is fetched — for search, as input to AI answers, or for training — in the two syntaxes proposed so far: Cloudflare's `Content-Signal` and the IETF aipref draft `Content-Usage`."
steps:
  - "Choose a preference for each use: `search`, `ai-input` (answers built from your pages) and `ai-train`. Leave one unset to express no preference."
  - "Copy the robots.txt block. Content-Signal lines go inside a `User-agent` group — usually `User-agent: *`."
  - "Optionally copy the `Content-Usage` line or HTTP header from the IETF draft."
  - "Remember that these lines express preferences; block crawlers with `Disallow` rules if you need them to stay away."
capabilities:
  - feature: "Cloudflare Content Signals syntax"
    status: "yes"
    note: "`Content-Signal: search=yes, ai-input=yes, ai-train=no`, placed in a group, with the explanatory comment Cloudflare recommends."
  - feature: "IETF aipref syntax"
    status: "yes"
    note: "`Content-Usage: train-ai=n` (robots.txt rule with an optional path) and the `Content-Usage` HTTP header, following draft-ietf-aipref-attach."
  - feature: "Guaranteed effect"
    status: "no"
    note: "Neither syntax is a standard. Google has said Content-Signal has no effect on its crawlers; OpenAI, Anthropic and Perplexity do not mention it in their documentation."
faq:
  - q: "What is Content-Signal?"
    a: "A robots.txt extension published by Cloudflare in September 2025 as the Content Signals Policy. It names three uses — `search`, `ai-input` and `ai-train` — each set to `yes` or `no`. Cloudflare adds `search=yes, ai-train=no` to the managed robots.txt of millions of domains."
  - q: "What is Content-Usage?"
    a: "The syntax developed by the IETF AI Preferences working group (aipref): a vocabulary with the categories `train-ai`, `ai-use` and `search`, values `y` or `n`, attached through a robots.txt rule or an HTTP header. The drafts are still in progress; there is no RFC yet."
  - q: "Should I use both?"
    a: "They do not conflict, and neither is widely honoured yet. If you use Cloudflare, Content-Signal is already in your managed robots.txt. Adding Content-Usage costs one line and follows the track most likely to become a standard."
  - q: "What about `__usage_ai-training`?"
    a: "It is a separate proposal from October 2026: a robots.txt group (`User-agent: __usage_ai-training` with `Disallow: /`) that several AI companies have said they will treat as a training opt-out. Unlike Content-Signal it uses ordinary Allow and Disallow rules. See its [register entry](bot:usage-ai-training)."
related: ["home", "tdmrep", "meta-tags", "guide-eu-ai-act", "bots"]
updated: "2026-11-04"
---

## Three generations of AI preferences in robots.txt

1. **Crawler names** (2023–): block `GPTBot`, `ClaudeBot`, `Google-Extended`… one company at a time. Reliable for those who follow robots.txt, but you must know every name.
2. **Use-based signals** (2025–): `Content-Signal` and `Content-Usage` describe uses rather than crawlers. They are attached to a group and say what may happen to content that is fetched anyway — for example by a general search crawler.
3. **Shared opt-out group** (2026–): `__usage_ai-training` is addressed like a crawler but understood by several companies at once.

Until one of these becomes a standard, the safest file uses all three: vendor names for the crawlers you know, a shared group for the companies that support it, and a use-based line for the rest. The [generator](page:home) does the first two; this page adds the third.
