---
title: "AIRobotsTxtChecker — the bot behind our robots.txt tester"
description: "Information about AIRobotsTxtChecker, the User-Agent our robots.txt tester uses: what it fetches (only /robots.txt), how often, from where, and how to block it."
h1: "Our checker bot: AIRobotsTxtChecker"
nav: "Checker bot"
lead: "When someone uses the live check in our robots.txt tester, our server fetches that site's /robots.txt once, with this User-Agent. It never fetches anything else."
related: ["tester", "privacy", "about"]
updated: "2026-11-04"
---

## User-Agent

```
Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)
```

## What it does

- Fetches **only** `/robots.txt` of the host a user entered — never pages, images or sitemaps.
- One request per check; results are cached for 10 minutes, so repeated checks of the same host within that time cause no new request.
- Follows at most 5 redirects, waits at most 5 seconds and reads at most 512 KiB.
- Connects only to public IP addresses on ports 80 and 443.
- Is not a crawler: it does not follow links, store your file beyond the cache or use it for anything else.

## Does it follow robots.txt?

It reads robots.txt; it does not crawl anything that robots.txt could govern. Like Google's robots.txt fetcher, it does not apply your robots.txt to the robots.txt file itself.

## How to block it

If you do not want your robots.txt to be checked through our site, return `403` for the User-Agent `AIRobotsTxtChecker`, for example in nginx:

```nginx
if ($http_user_agent ~* "AIRobotsTxtChecker") { return 403; }
```

Questions or abuse reports: {{contact}}.
