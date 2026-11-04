# Readiness checklist (brief §19) — status on 4 November 2026

| # | Item | Status | Evidence |
|---|---|---|---|
| 1 | All MVP functions of §3 work; core and api tests green | ✅ | Generator (presets, exceptions, custom per bot), merge mode with diff and equivalence check, tester (live via api + paste, URL test, crawler table, lint), server rules (nginx, Apache, Caddy, Cloudflare WAF, Express, Next.js, Django, PHP + verification), llms.txt, Content-Signal/Content-Usage, TDMRep, AI meta tags. `pnpm test`: core 175, api 81, web 6 tests. |
| 2 | Register: every bot has a primary source link and a check date; weekly update works | ✅ / ⚠️ | 50 curated entries with `docs`, `lastVerified`, `checkMethod`; 4 have no operator documentation (marked "observed"). Weekly workflow `bots-sync.yml` (PR on change, issue on format change); sync logic tested, the scheduled run itself happens on the first Monday after merge. |
| 3 | Generator works offline; api passes SSRF tests | ✅ | `tests/e2e/offline.spec.ts` (server stopped, generator + paste test still work); api tests: private/link-local/metadata IPs, IPv6 embeddings, DNS rebinding, redirect to localhost/metadata/file, timeouts, 512 KiB cap. |
| 4 | All phase-1 languages published, hreflang valid, no missing keys | ✅ | 9 languages × 61 pages = 549 pages; `i18n-check` (365 keys, 23 pages, 38 bot texts per language); `validate-build.ts` checks reciprocal hreflang + x-default. |
| 5 | Lighthouse ≥ 95 on home + 3 inner pages, mobile | ✅ | Local Lighthouse 13.6 mobile: Performance 100, Accessibility 100, Best Practices 96 (local run only — the 404 for sw.js came from a build without the post-build step), SEO 100; LCP 0.97–1.37 s, CLS 0. CI runs Lighthouse CI with the same thresholds. |
| 6 | curl of any page returns H1, text and FAQ without JS | ✅ | `tests/e2e/seo.spec.ts` (request API, no browser JS) on 4 page types; `validate-build.ts` checks H1 and description on all 549 pages. |
| 7 | robots.txt, sitemap, llms.txt, llms-full.txt, bots.json, .md versions, JSON-LD validate | ✅ | `validate-build.ts`: our robots.txt passes our linter and allows every agent; sitemap-index + 9 sitemaps cover every page; llms.txt per llmstxt.org (10 files); every page has a .md twin; JSON-LD parses with @context/@type. |
| 8 | `docker compose up` starts web and api, healthchecks green | ✅ | Verified locally: both containers `healthy`, br encoding, cache headers, CSP/HSTS/Permissions-Policy, 404 page, `/api` proxy with SSRF refusal. |
| 9 | CI green, images published to GHCR | see report | CI run on the working branch; images are pushed by the `docker` job (tags `sha-…`, `latest`). |
| 10 | Every screen checked against the forbidden list; screenshots in docs/screenshots | ✅ | `check-forbidden.mjs` on all 551 built files (no gradients, blur, glow, emoji icons, default fonts, marketing words, fake social proof) + visual review; 17 screens × 375/768/1440 px. |
| 11 | Privacy, Terms, About and Licenses in all languages | ✅ | Built for all 9 languages; Licenses generated at build time. Impressum/mentions légales pending owner data (see DECISIONS #10). |

Budgets: JS on the first screen 18.8 KB gzip (budget 100 KB); fonts: one preloaded woff2 (29 KB), metric-matched fallbacks; web image 49.9 MB compressed, 173 MB uncompressed (see DECISIONS #36).
