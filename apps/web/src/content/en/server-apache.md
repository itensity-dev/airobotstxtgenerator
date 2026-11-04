---
title: "Block AI Bots with .htaccess (Apache mod_rewrite)"
description: ".htaccess rules to block GPTBot, ClaudeBot, CCBot, Bytespider and other AI crawlers on Apache with mod_rewrite — 403 for AI bots, robots.txt still reachable. Copy-ready."
h1: "Block AI bots with .htaccess on Apache"
nav: "Apache .htaccess"
lead: "Three `mod_rewrite` lines in `.htaccess` refuse AI crawlers by User-Agent with 403, skip `/robots.txt`, and work on shared hosting without access to the main configuration."
steps:
  - "Select the agents and copy the rules."
  - "Open `.htaccess` in your document root (create it if it does not exist) and paste the block near the top, before WordPress's or your framework's own rewrite rules."
  - "Save. No restart is needed — Apache reads `.htaccess` on every request."
  - "Test with `curl -I -A \"ClaudeBot\" https://example.com/` (expect 403) and `curl -I https://example.com/robots.txt` (expect 200)."
capabilities:
  - feature: "Shared hosting"
    status: "yes"
    note: "Needs only `AllowOverride FileInfo` (enabled on almost every host) and `mod_rewrite`."
  - feature: "Server configuration instead of .htaccess"
    status: "yes"
    note: "The same lines work inside `<VirtualHost>` or `<Directory>` and are faster there."
  - feature: "LiteSpeed and OpenLiteSpeed"
    status: "yes"
    note: "LiteSpeed reads Apache rewrite rules in `.htaccess`."
  - feature: "nginx-only hosting"
    status: "no"
    note: "nginx ignores `.htaccess`; use the [nginx rules](page:server-nginx)."
faq:
  - q: "Where in .htaccess should the block go?"
    a: "Before other rewrite rules. WordPress's block ends with `RewriteRule . /index.php [L]`, which would otherwise handle the request first."
  - q: "What does [F,L] mean?"
    a: "`F` answers 403 Forbidden and `L` stops processing further rules. `[G,L]` answers 410 Gone instead."
  - q: "Can I use SetEnvIf instead of mod_rewrite?"
    a: "Yes: `SetEnvIfNoCase User-Agent \"GPTBot\" ai_bot` followed by `<RequireAll> Require all granted Require not env ai_bot </RequireAll>` works without mod_rewrite, but you need one `SetEnvIfNoCase` line per bot and a separate exception for `/robots.txt`."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## How the rule works

`RewriteCond %{REQUEST_URI} !^/robots\.txt$` exempts the robots.txt file. `RewriteCond %{HTTP_USER_AGENT} (GPTBot|ClaudeBot|…) [NC]` matches any of the listed names anywhere in the User-Agent, ignoring case. `RewriteRule ^ - [F,L]` then refuses the request without rewriting the URL. All conditions must be true for the rule to apply.

On WordPress, caching plugins sometimes serve pages before PHP runs but still after `.htaccess`, so the block applies to cached pages too.
