---
title: "Block AI Bots in Express, Next.js, Django and PHP (middleware)"
description: "Copy-ready middleware that blocks GPTBot, ClaudeBot and other AI crawlers by User-Agent in Express, Next.js (proxy.ts), Django and PHP/WordPress, with robots.txt left open."
h1: "Block AI bots in your application"
nav: "Frameworks"
lead: "When you cannot change the web server, block AI crawlers in the application itself: middleware for Express, Next.js, Django and plain PHP or WordPress, generated from the register."
steps:
  - "Choose the framework and the agents, then copy the code."
  - "Express: register the middleware before your routes. Next.js: save as `proxy.ts` in the project root (`middleware.ts` before Next.js 16). Django: add the class to `MIDDLEWARE`. PHP: include the file at the very top of `index.php` or drop it into `wp-content/mu-plugins/`."
  - "Deploy and test with `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "No server access needed"
    status: "yes"
    note: "Works on platforms where you control only the code (Vercel, Render, shared PHP hosting)."
  - feature: "Static files served by a CDN"
    status: "partly"
    note: "Requests answered by the CDN or a static file server never reach your middleware; block there as well."
  - feature: "Performance"
    status: "yes"
    note: "One compiled regular expression per request."
faq:
  - q: "Is middleware as good as a server rule?"
    a: "It refuses the same requests, but later: your application has already started handling them. Server or CDN rules are cheaper. Middleware is the right choice when you cannot change the server."
  - q: "Does the Next.js proxy run for static assets?"
    a: "By default it runs for every route; add a `config.matcher` that excludes `_next/static` and images if you want to save invocations."
related: ["server-rules", "server-nginx", "server-cloudflare", "bots"]
updated: "2026-11-04"
---

## How the middleware decides

Every snippet builds one case-insensitive regular expression from the selected agents' User-Agent names, skips the path `/robots.txt`, and answers matching requests with the status you chose and a short plain-text message. Nothing else in your application changes.
