---
title: "Block AI Bots with a Cloudflare WAF Custom Rule"
description: "Cloudflare WAF custom rule expression to block GPTBot, ClaudeBot, Bytespider and other AI crawlers by User-Agent, with robots.txt excluded — and how it relates to Cloudflare's AI Crawl Control."
h1: "Block AI bots with a Cloudflare WAF rule"
nav: "Cloudflare WAF"
lead: "A custom rule expression for Cloudflare's WAF that blocks the AI crawlers you choose by User-Agent, keeps `/robots.txt` reachable, and fits within Cloudflare's 4,096-character limit."
steps:
  - "Select the agents and copy the expression."
  - "In the Cloudflare dashboard open your domain → **Security** → **WAF** → **Custom rules** → **Create rule** → **Edit expression**, and paste it."
  - "Set the action to **Block** (or **Managed Challenge** if you prefer) and deploy."
  - "Check **Security → Events** after a day to see which agents were blocked."
capabilities:
  - feature: "Free plan"
    status: "yes"
    note: "Custom rules with `contains` and `lower()` are available on every plan; regular-expression `matches` needs a paid plan, so the tool does not use it."
  - feature: "Expression length check"
    status: "yes"
    note: "Cloudflare allows 4,096 characters per expression; the tool warns and suggests splitting the rule."
  - feature: "Replaces AI Crawl Control"
    status: "no"
    note: "Cloudflare's own AI Crawl Control blocks verified AI crawlers by category and can write a managed block into your robots.txt. Use this rule for agents Cloudflare does not cover or when you want exact control."
faq:
  - q: "Cloudflare already blocks AI crawlers — do I need this rule?"
    a: "Maybe not. Since July 2025 new domains block AI crawlers by default, and since 2026 Cloudflare offers separate Search, Agent and Training settings. Its list covers verified bots. A custom rule adds agents outside that list and blocks by name regardless of verification."
  - q: "Why is robots.txt excluded?"
    a: "So crawlers can still read your policy. A crawler that cannot fetch robots.txt cannot learn that it is disallowed."
  - q: "Cloudflare put lines into my robots.txt — what are they?"
    a: "That is Cloudflare's managed robots.txt (Bot Preference Sync): a block between BEGIN and END comments, placed before your own rules, with `Content-Signal` and `Disallow` lines for AI crawlers. Paste the live file into the [tester](page:tester) to see how the combined file behaves."
related: ["server-rules", "content-signals", "tester", "guide-bad-bots"]
updated: "2026-11-04"
---

## About the expression

Each condition is `(lower(http.user_agent) contains "gptbot")`: the User-Agent is lower-cased and searched for the bot's name, so capitalisation does not matter. The conditions are joined with `or`, and the whole group is combined with `and not (http.request.uri.path eq "/robots.txt")`. If you also use Cloudflare's verified-bot features, you can add `and not cf.client.bot` to leave verified bots to Cloudflare's own settings.
