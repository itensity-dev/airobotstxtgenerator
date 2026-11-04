---
title: "TDMRep Generator — tdmrep.json and tdm-reservation header (EU TDM opt-out)"
description: "Generate TDMRep files: /.well-known/tdmrep.json, tdm-reservation and tdm-policy HTTP headers and HTML meta tags, to reserve text and data mining rights under Art. 4 of the EU DSM Directive."
h1: "TDMRep generator"
nav: "TDMRep"
lead: "Create the files of the TDM Reservation Protocol (TDMRep) — a W3C Community Group specification for stating, in machine-readable form, that you reserve text and data mining rights under EU copyright law."
steps:
  - "Choose `tdm-reservation: 1` to reserve your rights, or `0` to state that you do not."
  - "Optionally add the URL of a `tdm-policy`: a machine-readable document explaining how to obtain a licence."
  - "Publish `/.well-known/tdmrep.json` at the root of your site, and/or add the HTTP headers or HTML meta tags."
  - "Keep robots.txt rules for the crawlers you want to stop: TDMRep reserves rights, it does not block anything."
capabilities:
  - feature: "Site-wide file"
    status: "yes"
    note: "`/.well-known/tdmrep.json` with `location`, `tdm-reservation` and `tdm-policy`."
  - feature: "Per-response headers and meta tags"
    status: "yes"
    note: "`tdm-reservation` and `tdm-policy` as HTTP headers (nginx and Apache snippets) and as HTML `<meta>` tags."
  - feature: "Legal advice"
    status: "no"
    note: "Whether a reservation is effective depends on national law and the facts. This page is information, not legal advice."
faq:
  - q: "What is TDMRep?"
    a: "The TDM Reservation Protocol, published by a W3C Community Group (Final Report 2024). It defines how a rightsholder can express — in a file, an HTTP header or HTML — that text and data mining of their content is reserved, as Article 4(3) of the EU DSM Directive (2019/790) allows."
  - q: "Do I need TDMRep if I already block AI crawlers in robots.txt?"
    a: "robots.txt says who may fetch; TDMRep says what may be done with content regardless of who fetched it. The EU GPAI Code of Practice commits signatories to follow robots.txt and other appropriate machine-readable protocols; publishing both is a belt-and-braces approach."
  - q: "Which AI companies read TDMRep?"
    a: "Support is limited and rarely documented. European publishers and some data providers use it; most large AI developers document only robots.txt. Treat it as an additional, standardised statement of your reservation."
related: ["content-signals", "guide-eu-ai-act", "meta-tags", "home"]
updated: "2026-11-04"
---

## Where TDMRep fits

The EU DSM Directive allows text and data mining of lawfully accessible content unless the rightsholder has **expressly reserved** it “in an appropriate manner, such as machine-readable means” for content published online. robots.txt is one such means; TDMRep is another, designed specifically for this purpose. A `tdmrep.json` file can cover the whole site or parts of it (`location` patterns), headers can cover any file type including PDFs and images, and meta tags work where you control only the HTML.
