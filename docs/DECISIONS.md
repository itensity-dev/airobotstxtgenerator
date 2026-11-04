# Decisions

Decisions made while building the project, with the reason. Defaults chosen without the owner's input are
marked **(default — confirm)**.

## Product and content

| # | Decision | Why |
|---|---|---|
| 1 | Brand written everywhere as **AI Robots.txt Generator**; domain airobotstxtgenerator.com | One consistent product name (brief §14). |
| 2 | Bot register = 50 curated entries (38 with pages) + 149 community entries from ai.robots.txt | Pages only where we have unique, sourced data (brief §13: no template clones). Community entries are listed, not given pages. |
| 3 | Purposes: training / AI search / user-requested fetch / mixed / unknown, plus `kind` crawler vs robots.txt token and a `general` flag | Matches how operators and Cloudflare (Search/Agent/Training) now split agents; tokens cannot be used in server rules; general crawlers (Googlebot, Bingbot, Applebot, facebookexternalhit, OAI-AdsBot, PetalBot, Kagibot) are never blocked by presets. |
| 4 | `checkMethod` per bot: `fetched`, `search-index`, `secondary` | The build environment could not open most vendor pages; we record honestly how each fact was checked. Re-check the `search-index` entries from a normal network after launch. |
| 5 | `__usage_ai-training` included as a token and blocked by the "no training" preset | Two independent research passes found the Oct 2026 Internet-Draft and announcements by Anthropic, Microsoft and Google; harmless if unsupported. |
| 6 | Mixed-purpose crawlers (Amazonbot, meta-externalagent, GoogleOther, CCBot-like) are blocked by the "no training" preset | Strict reading of "no training"; the UI names them and the custom mode lets users allow them. |
| 7 | Our own robots.txt allows every AI agent (named explicitly) and closes only `/api/`; adds `Content-Signal: search=yes, ai-input=yes, ai-train=yes` | Brief §4/§14; the API is not content and each request triggers an outbound fetch. |
| 8 | Content links use `page:<id>` / `bot:<id>` and are resolved per locale at build time | Translators never hard-code localised slugs; broken ids fail the i18n check. |
| 9 | Numbers in content come from placeholders (`{{agents}}`, `{{all}}`, `{{community}}`) | Counts stay correct after each register update. |
| 10 | Impressum / mentions légales / aviso legal pages are **not** published | They need the owner's legal identity. **(default — confirm)**: provide name and address and we add them; a German site without Impressum is at legal risk. |
| 11 | Contact address: `CONTACT_EMAIL` env, default `contact@airobotstxtgenerator.com`; author name optional (`AUTHOR_NAME`) | We did not publish the owner's personal e-mail. **(default — confirm)** |

## Parser and core

| # | Decision | Why |
|---|---|---|
| 12 | Port Google's matcher semantics exactly (typos, missing colon, BOM, line limit, index.html, merged specific groups) rather than a "pure" RFC reading | Google is the reference users compare with; RFC 9309 leaves tolerance to implementations. |
| 13 | Matching works on raw paths; the UI normalises user input with `new URL()` first | Same as Google (expects escaped URLs) while giving users realistic results for non-ASCII paths. |
| 14 | Reference verdicts come from Google's C++ parser compiled in this environment (driver in `packages/core/test/reference/`) | "Matches the reference parser" is tested against the real thing, not a re-implementation. |
| 15 | Real-site fixtures from samber/the-great-gpt-firewall (MIT), October 2026 snapshot | Live fetching of big sites was not possible from the build environment; the archive is dated and licensed. |
| 16 | The generator verifies every file it produces (policy × paths) and shows the count | Proves the "longest match / own group ignores *" pitfalls are handled. |
| 17 | Merge mode appends; it closes a trailing rule-less group with an empty `Disallow:` and compares old vs new decisions for every existing agent | Guarantees no behaviour change for prior agents (brief §9). |
| 18 | Server rules skip control tokens and generic community names (Code, Spider, OpenAI …) and never include general crawlers | Avoids dead rules and collateral blocking (ai.robots.txt's own configs block Applebot and facebookexternalhit). |
| 19 | Cloudflare rule uses `lower(http.user_agent) contains` instead of `matches` | `matches` (regex) needs a paid plan. |

## API

| # | Decision | Why |
|---|---|---|
| 20 | Hono on Node with our own DNS resolution and a `lookup` hook that pins the validated address | Prevents DNS rebinding between check and connect; every redirect is re-validated. |
| 21 | Only ports 80/443, no credentials in URLs, internal TLDs refused (.local, .internal, .test, …) | Reduces SSRF surface beyond IP checks. |
| 22 | https first, http fallback only on connection/TLS failure | Same as crawlers; reported to the user. |
| 23 | Body returned as base64 bytes | The tester can detect BOMs and encoding issues exactly as Google sees them. |
| 24 | Rate limit 30/min per IP (configurable), cache 10 min in memory, no domain logging | Brief §4/§17. |
| 25 | No Cloudflare Worker variant shipped | Optional in the brief; Workers cannot do the same DNS-level checks and the Docker service covers production. |

## Web stack

| # | Decision | Why |
|---|---|---|
| 26 | Astro 7 (static), Preact 11 islands, TypeScript 6 | Latest stable Astro; Preact is the lightest option for form-heavy islands; TS 6 because typescript-eslint and @astrojs/check do not support TS 7 yet. |
| 27 | Astro's built-in CSP (hashed inline scripts) + a header CSP for `frame-ancestors`, `object-src`, `base-uri`, `form-action`; no COOP/COEP | Strict CSP without breaking hydration; third-party origins added only when analytics/ads are enabled. |
| 28 | Markdown syntax highlighting off | Shiki's inline styles conflict with the CSP. |
| 29 | Fonts self-hosted from @fontsource (latin, latin-ext, cyrillic subsets), only Libre Franklin latin preloaded, metric-matched fallbacks | Brief §15; Japanese uses system Mincho/Gothic fonts (CJK web fonts are too heavy). |
| 30 | A language is published only when all its pages, bot texts and UI keys exist (checked at build) and CI runs `i18n-check` | Brief §12. |
| 31 | Translations produced by eight parallel translation passes with a shared brief and the local-search research in `docs/I18N.md` | Natural local phrasing, not word-for-word; legal statements limited to what the research marks verified. |
| 32 | Japanese URLs use English slugs; others use localised slugs; `pt-br` in paths, `pt-BR` in hreflang | Research recommendation (docs/I18N.md). |
| 33 | PWA: generated `sw.js` precaches the generator and tester pages of every language plus all hashed assets; network-first for pages | Generator and paste test work offline (brief §11). |
| 34 | OG images rendered at build with satori + resvg (Noto Sans JP for Japanese) | Brief §13. |
| 35 | Ads: off by default; `AdSlot` renders a fixed 336×280 block only outside tool areas when `ADS_ENABLED=true`; GA4 only after consent; Plausible needs none | Brief §17. |

## Deployment

| # | Decision | Why |
|---|---|---|
| 36 | Web image = Alpine + the Caddy binary + `dist` (not the full caddy image), user `web` (uid 10001), port 8080; only brotli copies are pre-built, gzip is done on the fly | 49.9 MB compressed (what the registry stores and transfers) with 9 languages; 173 MB unpacked because of 549 pages, 549 OG PNGs and .br copies. The 60 MB budget is met for the pushed image, not for the unpacked size. |
| 37 | Node 26 (current LTS) in Docker and CI; pnpm installed with npm (Node 26 no longer ships corepack) | |
| 38 | Optional BuildKit secret `ca` for building behind a TLS-intercepting proxy | Needed in the development sandbox only; ignored in CI. |
| 39 | Edge Caddy (profile `vps`) terminates TLS and redirects `www` and `aicrawlerblocker.com` | Brief §16. |

## Open questions for the owner

1. Are **airobotstxtgenerator.com** and **aicrawlerblocker.com** registered? (They were free on 4 Nov 2026; registration status could not be checked from the build environment.)
2. Legal identity for an Impressum (required for a German-language site run from the EU/Germany) and contact e-mail.
3. Analytics choice (Plausible cloud, self-hosted Plausible, or none) and the Search Console / Bing verification codes.
4. GitHub repository visibility and whether to publish `@airobots/core` to npm under this name (npm scope must be created).
