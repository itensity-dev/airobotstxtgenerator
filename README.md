# AI Robots.txt Generator

**[airobotstxtgenerator.com](https://airobotstxtgenerator.com)** — a free tool for deciding which AI crawlers may
use your site: an AI robots.txt generator with presets by purpose, a robots.txt tester that gives the same
answers as Google's parser, server rules (nginx, Apache, Caddy, Cloudflare WAF, Express, Next.js, Django, PHP),
and a register of AI crawlers with a page per bot. English, Deutsch, Français, Español, Italiano,
Nederlands, Polski, Português (Brasil), 日本語.

```
packages/core   @airobots/core — RFC 9309 parser/matcher, generator, linter, merge mode, server rules,
                bot register (JSON), ai.robots.txt sync. Zero runtime dependencies. MIT.
apps/web        Astro static site + Preact islands. Everything runs in the browser.
apps/api        Hono service that fetches /robots.txt of a site for the live tester (SSRF-safe).
deploy          Caddyfiles: inside the web image, and an edge config for a VPS.
docs            RESEARCH, DESIGN, DECISIONS, I18N, screenshots.
```

## Local development

Requirements: Node.js ≥ 22.23 (CI and Docker use 26), pnpm 10.

```bash
pnpm install
```

```bash
pnpm dev:api        # api on http://127.0.0.1:8081
```

```bash
pnpm dev            # site on http://localhost:4321 (proxies /api to the api)
```

Checks — the same as CI:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm i18n:check
```

```bash
pnpm build                                   # core, api, web (dist/ with .br/.gz copies and sw.js)
```

```bash
pnpm --filter @airobots/web test:e2e         # Playwright against the built site
```

## Docker

```bash
cp .env.example .env
```

```bash
docker compose up --build
```

The site is on <http://localhost:8080>, the api is reachable through `/api/*`. Both containers run as
non-root users with health checks (`/healthz` for web, `/health` for api). If Docker Hub rate-limits you,
set `NODE_IMAGE`, `CADDY_IMAGE` and `ALPINE_IMAGE` in `.env` to a mirror such as `mirror.gcr.io/library/…`.

## Deploy to a VPS in ten minutes

1. Point the DNS `A`/`AAAA` records of `airobotstxtgenerator.com`, `www.airobotstxtgenerator.com` and
   (optionally) `aicrawlerblocker.com` + `www.aicrawlerblocker.com` to the server.
2. Install Docker with the compose plugin, then:

   ```bash
   git clone https://github.com/itensity-dev/airobotstxtgenerator.git && cd airobotstxtgenerator
   ```

   ```bash
   cp .env.example .env && nano .env   # set SITE_DOMAIN, ACME_EMAIL, CONTACT_EMAIL, analytics, verification codes
   ```

3. Start with the edge Caddy (automatic HTTPS, `www` and `aicrawlerblocker.com` redirect to the main domain):

   ```bash
   docker compose --profile vps pull && docker compose --profile vps up -d
   ```

   `pull` takes the images CI published to GHCR (`ghcr.io/itensity-dev/airobotstxtgenerator-web|api`). Build-time
   settings (SITE_URL, analytics, verification, IndexNow key) are baked into the web image; if you change them,
   build locally instead: `docker compose --profile vps up -d --build`.
4. Check: `curl -I https://airobotstxtgenerator.com/` and `docker compose ps` (all `healthy`).
5. Add the site to Google Search Console and Bing Webmaster Tools (verification codes via `.env`), submit
   `https://airobotstxtgenerator.com/sitemap-index.xml`, then notify IndexNow:

   ```bash
   pnpm install && pnpm --filter @airobots/web build && node apps/web/scripts/indexnow.mjs --all
   ```

   (with `INDEXNOW_KEY` and `SITE_URL` exported; the key file `/<key>.txt` is published by the site itself).

### Update and roll back

```bash
docker compose --profile vps pull && docker compose --profile vps up -d     # update to :latest
```

```bash
WEB_IMAGE=ghcr.io/itensity-dev/airobotstxtgenerator-web:sha-abc1234 \
API_IMAGE=ghcr.io/itensity-dev/airobotstxtgenerator-api:sha-abc1234 \
docker compose --profile vps up -d                                          # roll back to a known build
```

Every CI build on `main` publishes images tagged `sha-<commit>` and `latest`; tags `v1.2.3` also publish
`1.2.3` and `1.2`. Pin a tag in `.env` (`WEB_IMAGE`, `API_IMAGE`) to stay on a version.

## Bot register updates

`packages/core/src/data/bots.json` is curated by hand (each entry has its source and check date).
`community-bots.json` is generated from [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt):

```bash
pnpm bots:sync
```

The `Weekly bot list sync` workflow runs this every Monday, runs the tests and opens a pull request; if the
upstream format changes it opens an issue instead. After merging, deploy and run `scripts/indexnow.mjs`.

## The core package

```js
import { isAllowed, matchUrl, generateRobotsTxt, lintRobotsTxt, mergeIntoExisting, curatedBots } from '@airobots/core';
```

See [packages/core/README.md](packages/core/README.md). Its tests port every case of Google's
`robots_test.cc` and compare verdicts on 46 real robots.txt files with the compiled reference parser.

## Licenses

Code: MIT. Bot register data: CC BY 4.0. Fonts: SIL OFL 1.1. Community bot entries: MIT (ai.robots.txt).
The full list of dependencies is generated at build time on `/licenses/`.
