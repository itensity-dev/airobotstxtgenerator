---
title: "robots.txt Tester & Validator — check any site and URL for AI bots"
description: "Free robots.txt tester and validator: fetch any site's robots.txt or paste your own, see which AI crawlers are allowed, test a URL for any user-agent and find errors. Google-compatible."
h1: "robots.txt tester and validator"
nav: "robots.txt tester"
lead: "Fetch the robots.txt of any website or paste a file, test a URL for any crawler, see which of {{agents}} AI agents may crawl the site, and get a list of errors — with the exact line that decides each answer."
steps:
  - "Enter a domain or any URL of the site (only its host is used) and press **Fetch robots.txt** — or switch to **Paste robots.txt** to test a draft without uploading it."
  - "Read the status line: Google treats a **4xx** answer as “no robots.txt” and a **5xx** answer as “crawl nothing for now”; redirects, size and content type are checked too."
  - "Type a path or full URL and pick a crawler: the result names the **deciding line** and the group that applies, and highlights both in the file."
  - "Scan the table of AI crawlers: home page and your path, each **Allowed**, **Blocked** or **Partial**, and whether the crawler has its own group."
  - "Fix what the **lint report** flags, then re-test. Need a new file? Open the [generator](page:home)."
capabilities:
  - feature: "Same answers as Google's parser"
    status: "yes"
    note: "Ports every test case of Google's open-source robots.txt parser and matches its verdicts on 46 real robots.txt files of large sites."
  - feature: "Live fetch of any site"
    status: "yes"
    note: "Through our checker: public http/https hosts only, standard ports, up to 5 redirects, 5 seconds, 512 KiB. Results are cached for 10 minutes."
  - feature: "Paste and test offline"
    status: "yes"
    note: "Pasted text is analysed in your browser and never uploaded."
  - feature: "Linting"
    status: "yes"
    note: "Over 35 checks: syntax, Google's tolerated typos, groups that silently drop `*` rules, blank-line pitfalls, full URLs in rules, 500 KiB limit, Content-Signal and Content-Usage syntax, Cloudflare managed blocks."
  - feature: "Pages behind a login or a firewall"
    status: "no"
    note: "We fetch only `/robots.txt` from the public internet, as a crawler would. A WAF or CDN can still block crawlers that robots.txt allows — check your CDN settings."
  - feature: "Robots meta tags and X-Robots-Tag"
    status: "no"
    note: "Page-level rules are not checked here; see [AI meta tags](page:meta-tags)."
faq:
  - q: "Where did Google's robots.txt Tester go?"
    a: "Google retired the robots.txt Tester in Search Console at the end of 2023 and replaced it with a robots.txt report that shows the fetched file and errors but cannot test a URL against a user-agent. This page fills that gap and uses the same matching rules as Google's open-source parser."
  - q: "Why is a URL allowed even though `User-agent: *` disallows it?"
    a: "Because the crawler you picked has its own group. A crawler obeys only the most specific group that names it, so the rules under `User-agent: *` stop applying to it. The lint report flags every agent for which this drops a `*` rule."
  - q: "What happens if robots.txt returns 404, 403 or 500?"
    a: "Google treats 4xx answers (except 429) as if there were no robots.txt — everything may be crawled. 5xx and 429 mean “do not crawl for now”; Google retries and, after about 30 days, may use a cached copy or treat the site as unrestricted."
  - q: "Does the order of Allow and Disallow lines matter?"
    a: "No. The longest matching pattern wins regardless of order; if an Allow and a Disallow pattern are equally long, Allow wins. `*` matches any characters and `$` anchors the end of the URL."
  - q: "Is my robots.txt or the domain I check stored?"
    a: "Pasted text never leaves your browser. For live checks our server fetches the file and keeps it in memory for up to 10 minutes so repeated checks are fast; domains are not written to logs or analytics."
  - q: "Which user-agent does the checker send?"
    a: "`Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)`. It fetches only `/robots.txt`, once per check. See [our checker bot](page:checker-bot)."
related: ["home", "bots", "server-rules", "guide-syntax", "guide-bad-bots"]
updated: "2026-11-04"
---

## How a crawler reads robots.txt

The tester applies the rules of [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) exactly the way Google's open-source parser does:

1. **Find the group.** A group is one or more `User-agent` lines followed by rules. The crawler uses every group that names its product token (case-insensitive, version numbers ignored) and merges them. Only if no group names it does it use `User-agent: *`. Blank lines do not end a group.
2. **Find the matching rules.** Each `Allow` and `Disallow` pattern is compared with the URL path and query. Patterns match from the start of the path; `*` stands for any characters, a final `$` for the end of the URL. Matching is case-sensitive.
3. **Pick the longest match.** The rule with the longest pattern wins. If an `Allow` and a `Disallow` are equally long, `Allow` wins. No matching rule means the URL is allowed.

Google also tolerates common mistakes — `Dissallow`, `User agent`, a missing colon — and ignores everything after 500 KiB. The tester reproduces this and reports each case so that other crawlers, which may be stricter, read your file the same way.

## How live checks work

Our server requests `https://your-host/robots.txt` (falling back to `http://` if HTTPS cannot connect), follows up to five redirects, stops after 5 seconds or 512 KiB, and returns the raw bytes so that byte order marks and encodings can be inspected. Before every connection it resolves the host name itself and refuses private, local and reserved addresses. Everything else — parsing, matching, linting — happens in your browser.
