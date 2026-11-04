---
title: "noai Meta Tag, X-Robots-Tag & AI: what really works"
description: "Which meta tags and HTTP headers control AI use of a page? noai and noimageai are non-standard; nosnippet, data-nosnippet, noarchive and X-Robots-Tag do different things per company. An honest table."
h1: "AI meta tags and X-Robots-Tag: what works"
nav: "AI meta tags"
lead: "Page-level controls for AI are a patchwork: some tags are honoured by one company, some only by small platforms, and some by nobody. This page lists what each tag does today, with sources."
steps:
  - "Decide whether you need page-level control at all — robots.txt rules by path cover most cases."
  - "Use the table to pick the tags that the companies you care about actually honour."
  - "Add them as `<meta name=\"robots\" content=\"…\">` in HTML, or as an `X-Robots-Tag` HTTP header for PDFs, images and other files."
  - "Test a page by viewing its source and response headers; the [tester](page:tester) checks robots.txt, not meta tags."
capabilities:
  - feature: "Honest status per tag"
    status: "yes"
    note: "Each row says who documents support for the tag."
  - feature: "A universal “no AI” tag"
    status: "no"
    note: "There is none. `noai` is widely copied but not documented by Google, OpenAI, Anthropic, Microsoft or Apple."
faq:
  - q: "Does `<meta name=\"robots\" content=\"noai\">` work?"
    a: "Only on platforms that adopted it, such as some art communities. It is not part of any standard and the large AI companies do not document it. It does no harm, but it does not replace robots.txt."
  - q: "How do I keep a page out of Google's AI Overviews?"
    a: "Google's AI features in Search follow the normal snippet controls: `nosnippet` (no snippet at all), `max-snippet:0` or `data-nosnippet` on specific elements limit what can be shown. Google-Extended in robots.txt does not affect AI Overviews."
  - q: "How do I limit Copilot's use of my page?"
    a: "Bing documents that `nocache` lets Copilot show only the URL, title and snippet, and `noarchive` keeps the page out of Copilot answers and training. Bing has also announced new AI training and grounding preferences for 2027."
  - q: "What does X-Robots-Tag add?"
    a: "The same directives as the robots meta tag, sent as an HTTP header — the only way to control files that have no HTML head, such as PDFs and images: `X-Robots-Tag: noarchive, nosnippet`."
related: ["content-signals", "tdmrep", "home", "guide-training-search"]
updated: "2026-11-04"
---

## Tags and headers, one by one

| Tag or header | What it does | Who documents support |
|---|---|---|
| `noai`, `noimageai` | Intended: “do not use for AI” / “do not use images for AI” | Not documented by Google, OpenAI, Anthropic, Microsoft, Apple; adopted by a few platforms. Non-standard. |
| `nosnippet` | No text snippet or preview in results; also excludes the page from AI Overviews and AI Mode as a source of snippets | Google, Bing |
| `max-snippet:N` | Limits snippet length; `0` equals `nosnippet` | Google, Bing |
| `data-nosnippet` (HTML attribute) | Excludes a part of the page from snippets and AI features in Google Search | Google |
| `noarchive` | No cached copy. Bing: keeps the page out of Copilot answers and training; Amazon: do not use for model training | Bing, Amazon |
| `nocache` | Bing: Copilot may use only URL, title and snippet | Bing |
| `noindex` | Removes the page from search entirely — and therefore from AI search features built on that index | All major search engines |
| `X-Robots-Tag: …` | Any of the above as an HTTP header, for any file type | Google, Bing |
| `tdm-reservation: 1` | Reserves text and data mining rights (EU) — see [TDMRep](page:tdmrep) | TDMRep adopters |
| `Content-Usage: train-ai=n` | IETF aipref draft preference as an HTTP header — see [content signals](page:content-signals) | Draft; not established |

Example for a page that should stay in search but out of Copilot answers and training:

```html
<meta name="robots" content="noarchive">
<meta name="bingbot" content="nocache">
```

Example header for a PDF folder in nginx:

```nginx
location /reports/ {
    add_header X-Robots-Tag "noarchive, nosnippet" always;
}
```
