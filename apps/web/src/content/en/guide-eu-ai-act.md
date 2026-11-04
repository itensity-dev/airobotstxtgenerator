---
title: "AI Bots and the EU AI Act: robots.txt as TDM Opt-out"
description: "How robots.txt relates to the EU AI Act and the text-and-data-mining opt-out of the DSM Directive (Art. 4): what the GPAI Code of Practice says, what counts as machine-readable, and what to publish. Information, not legal advice."
h1: "AI bots and the EU AI Act: what an opt-out means"
nav: "AI bots and the EU AI Act"
lead: "EU law lets anyone mine publicly available content for any purpose unless the rightsholder has reserved that right in a machine-readable way. Since August 2025 AI model providers must show they respect such reservations — and the Code of Practice names robots.txt."
related: ["tdmrep", "content-signals", "home", "guide-training-search"]
updated: "2026-11-04"
faq:
  - q: "Is a robots.txt Disallow a legally valid reservation?"
    a: "The Code of Practice treats robots.txt per RFC 9309 as a protocol signatories must follow, and courts have considered machine-readable reservations, but the legal effect depends on national law and the facts of a case. This is information, not legal advice."
  - q: "Does the AI Act apply to AI companies outside the EU?"
    a: "The obligations apply to providers who place general-purpose AI models on the EU market, wherever they are established. The copyright policy must cover the reservations of EU rightsholders."
  - q: "What should I publish?"
    a: "A robots.txt that disallows the AI training crawlers you object to, optionally a TDMRep file and a statement in your terms. Keep dated copies of your robots.txt so you can show when the reservation was in place."
---

*This page is information, not legal advice.*

## Two laws, one mechanism

**The DSM Directive (EU) 2019/790, Article 4** allows text and data mining of lawfully accessible works — the legal basis on which much AI training in the EU relies — unless the rightsholder has **expressly reserved** that use. For content made publicly available online, the reservation must be made “in an appropriate manner, such as machine-readable means”. Every member state has implemented this rule in its copyright act.

**The AI Act, Article 53(1)(c)** requires providers of general-purpose AI models to put in place a policy to comply with EU copyright law and, in particular, to identify and comply with reservations of rights under Article 4(3) of the DSM Directive, “including through state-of-the-art technologies”. The obligations apply from **2 August 2025**; the AI Office can enforce them with fines from **2 August 2026**.

## What the Code of Practice says

The General-Purpose AI Code of Practice (copyright chapter, July 2025) is how most large providers show compliance. Signatories commit, among other things, to:

1. use crawlers that **read and follow robots.txt as specified in RFC 9309** and later versions of the standard;
2. identify and comply with **other appropriate machine-readable protocols** for reserving rights — adopted by standards bodies or widely used by rightsholders;
3. publish information about their crawlers and their robots.txt features.

The Commission consulted on which other protocols count; at the time of writing no official list had been published.

## What this means in practice

- A `Disallow` for a provider's training crawler (for example `GPTBot`, `ClaudeBot`, `MistralAI-Training`, `CCBot`) is the most widely recognised machine-readable reservation.
- A token such as `Google-Extended` or `Applebot-Extended` expresses the reservation without removing you from search.
- **robots.txt reserves rights against crawling you name.** A training crawler you do not know about is not covered. Shared groups such as `__usage_ai-training` and use-based lines such as `Content-Usage: train-ai=n` aim to close that gap; [TDMRep](page:tdmrep) is a protocol designed specifically for Article 4 reservations.
- Natural-language statements in terms of service may not be enough for content published online; courts have looked for machine-readable form.

## A defensible setup

1. robots.txt with your training crawlers blocked — use the [generator](page:home).
2. Optionally a `tdmrep.json` and `Content-Usage` line.
3. A sentence in your terms reserving text and data mining under Article 4(3) DSM Directive.
4. An archive of your robots.txt with dates (for example a copy in version control).
