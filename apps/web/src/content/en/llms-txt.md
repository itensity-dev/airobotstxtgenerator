---
title: "llms.txt Generator — create an llms.txt file (llmstxt.org format)"
description: "Free llms.txt generator: write an llms.txt that follows the llmstxt.org proposal — H1, summary, sections of Markdown links — with validation. Runs in your browser."
h1: "llms.txt generator"
nav: "llms.txt generator"
lead: "Build an `llms.txt` file in the format proposed at llmstxt.org — a title, a one-paragraph summary and sections of links to the pages most useful to language models — and check its structure as you type."
steps:
  - "Enter the site or project name; it becomes the only H1."
  - "Write a short summary — what the site is and what the file lists. It becomes the blockquote that models read first."
  - "Add sections (`## Docs`, `## Guides` …) with links: title, absolute URL, and an optional one-line description. Link to Markdown versions of pages where you have them."
  - "Mark less important sections as **Optional**: readers with little context space may skip them."
  - "Download the file and upload it to the site root as `/llms.txt`. Optionally publish `/llms-full.txt` with the full text."
capabilities:
  - feature: "llmstxt.org structure"
    status: "yes"
    note: "H1, blockquote summary, optional notes, H2 sections with Markdown link lists, an `Optional` section."
  - feature: "Validation"
    status: "yes"
    note: "Checks for a single H1, H2 sections and absolute or root-relative link targets."
  - feature: "Crawling your site to fill the list"
    status: "no"
    note: "You choose the pages; nothing is fetched."
  - feature: "Effect on rankings or AI answers"
    status: "no"
    note: "llms.txt is a proposal; no major search engine or AI company has said it uses the file for ranking or training decisions."
faq:
  - q: "What is llms.txt?"
    a: "A Markdown file at the root of a site, proposed by Jeremy Howard in September 2024 at llmstxt.org, that gives language models a curated map of the site: what it is and which pages to read. It is not a standard and not an access-control file."
  - q: "Is llms.txt the same as robots.txt?"
    a: "No. robots.txt tells crawlers what they may fetch; llms.txt suggests what is worth reading. A page listed in llms.txt but disallowed in robots.txt is still disallowed for crawlers that follow robots.txt."
  - q: "Do AI companies read llms.txt?"
    a: "Some tools and AI coding assistants read it when a user points them at a site; documentation platforms generate it automatically. No major AI company has committed to using it for training or search. It costs little to publish."
  - q: "Should I link HTML pages or Markdown?"
    a: "Markdown where possible — it is what language models handle best. This site publishes a `.md` version of every page and links them from its own [llms.txt](/llms.txt)."
related: ["home", "content-signals", "meta-tags", "guide-training-search"]
updated: "2026-11-04"
---

## What a good llms.txt contains

Keep it short and curated: the 10–40 pages a model needs to understand your product or content, each with a one-line description that says what the reader will find. Put reference material first, examples second, and history, changelogs or legal pages under **Optional**. If you have long documentation, publish `llms-full.txt` as well — the same structure with the full text of the pages — and say so in the summary.

This site follows its own advice: see [/llms.txt](/llms.txt) and [/llms-full.txt](/llms-full.txt), and every page has a Markdown twin at the same address plus `.md`.
