---
title: "About AI Robots.txt Generator — who makes it and why"
description: "AI Robots.txt Generator is a free, independent tool for deciding which AI crawlers may use your site. Who makes it, how the bot register is maintained, how to contact us, and why our own robots.txt allows every AI bot."
h1: "About this project"
nav: "About"
lead: "A free, independent set of tools for one decision every site owner now faces: which AI crawlers may read, cite or learn from your pages."
related: ["checker-bot", "bots", "privacy", "licenses"]
updated: "2026-11-04"
---

## What it is

AI Robots.txt Generator (airobotstxtgenerator.com) has a generator, a tester, a register of AI crawlers with a page for each, server rules and guides. Everything that can run in your browser does — generation, parsing, testing pasted files — and works offline once the page has loaded. The only server component fetches a site's public robots.txt when you ask for a live check.

It is part of a small network of free single-purpose tools by the same maker, including ibangenerator.io and metasnitch.com. There is no account, no paywall on the tools, and no limit except a rate limit on live checks to prevent abuse.

## How the register is maintained

Each curated entry is checked against the operator's own documentation and dated; the page tells you how it was checked. A weekly automated job compares our community list with the open-source [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt) project and opens a pull request with the changes, which are reviewed before they go live. The parser is tested against every test case of Google's open-source robots.txt parser and against 46 real robots.txt files whose results we compared with Google's compiled parser. The code and data are open: see [Licenses](page:licenses).

## Why our own robots.txt allows every AI bot

Our [robots.txt](/robots.txt) names GPTBot, ClaudeBot, PerplexityBot, Google-Extended and every other agent in the register — and allows all of them. That may look odd for a site that helps people block AI crawlers, but it follows from the same principle: **decide per purpose**. This site exists to answer questions; we want AI assistants to read it, cite it and send people here, and we have no objection to our explanations ending up in a model's training data if that makes the answers better. A publisher of paid journalism or original art will reasonably decide differently. The tool is built to make either decision easy and correct.

We also publish [/llms.txt](/llms.txt), [/llms-full.txt](/llms-full.txt), a Markdown version of every page (add `.md` to the address) and the whole register as [/bots.json](/bots.json).

## Contact

Corrections to the register, bug reports and questions: **{{contact}}**. If you operate a crawler and our entry for it is wrong or outdated, please send a link to your documentation — we update entries within days.

## Facts

- Online since: 4 November 2026
- Languages: English, Deutsch, Français, Español, Italiano, Nederlands, Polski, Português (Brasil), 日本語
- Advertising: none at present; if ads are added, they will never appear inside the tools.
