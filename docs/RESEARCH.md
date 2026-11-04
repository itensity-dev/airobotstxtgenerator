# Research — airobotstxtgenerator.com

Checked on **4 November 2026**. Method and limits: the build environment could not open most web pages
directly, so facts were taken from (a) search results restricted to the operator's own domain,
(b) public GitHub repositories cloned for this purpose (ai.robots.txt, ietf-wg-aipref/drafts,
samber/the-great-gpt-firewall), (c) pages that could be opened (Anthropic's crawler article and IP
list, DuckDuckGo's help-page source). Every bot entry records how it was checked (`checkMethod`).
Search volumes could not be measured from here — see "Demand" below.

Full working notes from the research agents are summarised here; anything marked *(unverified)* must be
re-checked before it is quoted on the site.

## 1. Drivers (status of the claims in the brief)

| Claim | Status | Notes and sources |
|---|---|---|
| Cloudflare blocks AI crawlers by default since 1 Jul 2025 and launched pay-per-crawl | **Confirmed, and moved on** | Default block for new domains + pay per crawl (still *closed beta*, not GA) — [blog](https://blog.cloudflare.com/content-independence-day-no-ai-crawl-without-compensation/), [docs](https://developers.cloudflare.com/ai-crawl-control/features/pay-per-crawl/what-is-pay-per-crawl/). AI Crawl Control GA 27 Aug 2025. 1 Jul 2026: separate **Search / Agent / Training** controls on all plans. 15 Sep 2026: new domains block Training and Agent on pages with ads by default; "Block" also stops Googlebot/Applebot/Bingbot, a new "Disallow AI Training" keeps them for search ([blog](https://blog.cloudflare.com/content-independence-day-ai-options), [docs](https://developers.cloudflare.com/bots/additional-configurations/block-ai-bots/)). **Bot Preference Sync** writes a Cloudflare-managed block *in front of* the site's own robots.txt rules ([blog](https://blog.cloudflare.com/bot-preference-sync/)). |
| EU AI Act GPAI obligations from 2 Aug 2025: copyright policy must respect machine-readable reservations, incl. robots.txt | **Confirmed** | Art. 53(1)(c); GPAI Code of Practice, copyright chapter, Measure 1.3: crawlers must read and follow robots.txt per **RFC 9309** and other appropriate machine-readable protocols ([text](https://artificialintelligenceact.eu/en/cop-copyright/)). Enforcement powers of the AI Office apply from **2 Aug 2026**; the Digital Omnibus did not delay GPAI rules. The Commission's list of "generally agreed" opt-out protocols was not yet published. |
| Cloudflare Content Signals Policy (Sept 2025) | **Confirmed, extended** | `Content-Signal: search=yes, ai-train=no` inside a User-agent group; signals `search`, `ai-input`, `ai-train`; a missing signal = no preference ([blog](https://blog.cloudflare.com/content-signals-policy/)). Optional `use=immediate|reference|full` being tested since Jul 2026. Google's John Mueller (6 Jul 2026): no effect on any crawler he knows ([SER](https://www.seroundtable.com/google-cloudflare-content-signals-41631.html)). |
| IETF AI Preferences (aipref) | **Changed, no RFC** | `draft-ietf-aipref-vocab` (-07, Aug 2026; vocabulary still without WG consensus) and `draft-ietf-aipref-attach` (-05, updates RFC 9309). Categories `train-ai`, `ai-use`, `search`, values `y`/`n`. robots.txt rule `Content-Usage: [path] train-ai=n`, HTTP header `Content-Usage: train-ai=n` ([repo](https://github.com/ietf-wg-aipref/drafts)). Separate proposal **`__usage_ai-training`** (draft-kelley-aipref-training-preference-signal-00, 30 Oct 2026): a shared robots.txt group for training opt-out; Anthropic supports it, Microsoft from 1 Feb 2027, Google early 2027, OpenAI "coming months". |
| Google removed the robots.txt Tester at the end of 2023 | **Confirmed** | Robots.txt report announced ~15 Nov 2023 ([SEL](https://searchengineland.com/google-search-console-adds-robots-txt-report-434708)); Google's help points to "a robots.txt validator" for unverified sites ([help](https://support.google.com/webmasters/answer/13144973)). Bing Webmaster Tools has a tester for Bingbot only. |
| Google-Extended / Applebot-Extended are tokens, not crawlers | **Confirmed** | [Google common crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers), [Apple](https://support.apple.com/en-us/119829). New in 2026: **Google-Agent** (20 Mar 2026, user-triggered, ignores robots.txt), **Google-GeminiNotebook** (renamed from Google-NotebookLM, 16 Jul 2026). |

## 2. Demand

No public source with search volumes for the requested keywords was reachable from the build environment;
the figures in the brief (seodata.dev) could not be re-measured. Indirect signals:

- at least 30 free tools answer "AI robots.txt generator/checker", including Semrush (Backlinko, Exploding
  Topics), SE Ranking, Merkle, Elementor, Rank Math — large brands build these only for real demand;
- Google's own help sends unverified site owners to third-party validators;
- Cloudflare's 2026 changes produced bursts of "what to do before 15 September" content;
- ~17 % of Cloudflare sites block training crawlers, <1 % block search crawlers ([Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options)).

**Action for the owner:** re-measure the keyword list (incl. "block ai crawlers", "claudebot", "perplexitybot",
"bytespider", "google-extended") in Keyword Planner/Ahrefs/Semrush after launch; Search Console data will
replace estimates within weeks.

## 3. Competitors

| Tool | What it does | Bots | Live check | Weaknesses |
|---|---|---|---|---|
| [VitalSentinel AI Crawler Blocker](https://www.vitalsentinel.com/tools/ai-crawler-blocker) | Pick crawlers → rules; compares with live robots.txt and flags the "own group overrides *" case | 20 (+29 in tester) | Yes | Small list; no server/WAF/Content-Signal output; generator and tester on separate pages; upsell to paid monitoring |
| [LLM Pulse](https://llmpulse.ai/help-center/ai-robots-txt-generator) | Presets allow all / block training / block all; separate checker; EN/ES/PT | 36 | Checker only | Small list; no server rules; framing pushes "allow" |
| [U2L](https://u2l.ai/tools/ai-robots-txt-generator) | Toggle list, training vs live retrieval | unstated | No | Opaque list, no tester, no server rules |
| [IndexFox](https://indexfox.ai/tools/ai-robots-txt-generator) | Simple form | small | No | Calls Anthropic's bot "Claude"; thin content |
| [Growtika](https://growtika.com/tools/robots-txt-generator) | Generator + checker | handful | Checker | Markdown version shows an empty "AI Crawlers" section (no-JS rendering) |
| [SEOptimer](https://www.seoptimer.com/robots-txt-generator), [SmallSEOTools](https://smallseotools.com/robots-txt-generator/) | Classic forms | classic search bots (Yahoo era) | basic | No AI bots, stale lists, ads |
| [TechnicalSEO.com (Merkle)](https://technicalseo.com/tools/robots-txt/) | Tester modelled on Google's parser; AI bot access tool | any UA | Yes | No generator, minimal linting, not AI-focused |
| [Known Agents (ex-Dark Visitors)](https://knownagents.com/agents) | 2,000+ agent directory, checker, automatic robots.txt via API | 2,000+ | Yes | Many thin "Unclear" pages; automation behind an account; no nginx/Apache/Caddy output |
| [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt) | Community list + generated robots.txt, .htaccess, nginx, Caddy, HAProxy | 202 | — | All-or-nothing; server configs block Applebot and facebookexternalhit (breaks previews) and include tokens that never appear in UAs (Google-Extended); no Cloudflare WAF; 125/202 "Unclear" compliance; misses Google-GeminiNotebook |

**New competitors found:** [Trakkr checker](https://trakkr.ai/free-tools/ai-robots-txt-checker) (94 crawlers, per-bot pages),
[Backlinko checker](https://backlinko.com/tools/robots-txt-ai-crawler-checker) (3 free checks/day),
[GEO Toolbox](https://geotoolbox.ai/tools/ai-crawler-checker) (34 agents, EN/FR glossary),
[AI Crawler Check](https://ai-crawler-check.pages.dev/tools/robots-txt-generator) (160+ crawlers),
[Spotibo tester](https://spotibo.com/robots-tester/) (Google parser, alerts), Bot Ledger, 365i.

**Domains named in the brief:** no indexed pages found for llmstxtgenerator.com, aibotblocker.com,
aicrawlerchecker.com, airobotstxtgenerator.com or aicrawlerblocker.com; registration status could not be
checked (WHOIS/RDAP blocked here). No Afternic listing for llmstxtgenerator.com was found in search.

## 4. Search results (approximation, US engine used by the research tool)

- **"ai robots.txt generator"**: llmpulse.ai, apify.com, growtika.com, u2l.ai, indexfox.ai — all small sites, no dominant brand.
- **"block gptbot"**: blog guides only (cside, otterly, searchlogistics, fliki, texta), then knownagents.
- **"robots txt tester"**: spotibo, a GitHub repo, community.plotly.com, seranking, ultrawebhosting.
- **DE "KI Crawler blockieren robots.txt"**: translated guides (one with a wrong example), Wix help; one German tool (seocrawl.ai).
- **FR "bloquer robots IA robots.txt"**: it-connect.fr, glossaries; **no French generator or tester** in the top results.

## 5. What we do differently (product decisions derived from the research)

1. Purpose-aware presets (training / search / user-triggered / tokens) instead of "block all", with a warning
   whenever AI search visibility is lost.
2. A tester that reproduces Google's parser exactly (proven against the compiled reference on 46 real files),
   shows the deciding line, recognises Cloudflare's managed block, explains 4xx/5xx/redirect/size rules.
3. Server rules for nginx, Apache, Caddy, Cloudflare WAF and four frameworks — without control tokens,
   without general crawlers, without generic names that would match unrelated traffic.
4. Per-bot pages with the operator's own statement, IP list, verification method and the date of the check.
5. Localised tools in 8 more languages where the local results are blog posts, not tools.
6. Content-Signal, Content-Usage (aipref) and `__usage_ai-training` explained honestly as proposals.

## 6. Bot registry, first version

`packages/core/src/data/bots.json`: 50 curated entries (38 with their own page) from operator documentation,
plus 149 community entries imported from ai.robots.txt (`community-bots.json`).

| checkMethod | Count | Meaning |
|---|---|---|
| `fetched` | 6 | operator page opened directly (Anthropic, DuckDuckGo) |
| `search-index` | ~40 | operator page text read through a search index restricted to the operator's domain |
| `secondary` | ~4 | no operator documentation exists (Bytespider, cohere-ai) — labelled "observed" on the site |

Notable corrections to community lists: Cohere says it runs no crawlers (cohere-ai is unofficial); Brave has
no distinct user agent ("Bravebot" is unofficial); Exa's crawler is ExaSearchBot, not ExaBot; FacebookBot,
anthropic-ai and Claude-Web are no longer documented by their operators; Anthropic states that all its bots,
including Claude-User, follow robots.txt, while OpenAI, Perplexity, Google and Meta exempt user-triggered fetches.

## 7. Localisation research (summary)

Per-language terms, title candidates and slugs are recorded in `docs/I18N.md`. Key points: "KI" (de),
"IA" (fr, es, pt-BR), "AI" in Italian, Dutch, Polish and Japanese titles; national TDM provisions —
§ 44b UrhG (de), art. L. 122-5-3 CPI (fr), art. 67 RDL 24/2021 (es), art. 70-quater LDA (it),
art. 15o Auteurswet (nl), art. 26³ (pl); Japan's Art. 30-4 has no opt-out; Brazil's PL 2338/2023 is not law.
