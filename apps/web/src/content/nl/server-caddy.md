---
title: "AI-crawlers blokkeren in Caddy (Caddyfile header_regexp)"
description: "Caddyfile-regel die GPTBot, ClaudeBot en andere AI-crawlers blokkeert met een named matcher op de User-Agent: 403 voor AI-bots, robots.txt blijft bereikbaar."
h1: "AI-crawlers blokkeren in Caddy"
nav: "Caddy"
lead: "Een named matcher met `header_regexp User-Agent` selecteert AI-crawlers en sluit `/robots.txt` uit, en `respond` beantwoordt ze vóór elke andere handler."
steps:
  - "Selecteer de agenten en kopieer het fragment."
  - "Plak het in je siteblok in de Caddyfile, vóór `reverse_proxy`, `php_fastcgi` of `file_server`."
  - "Voer `caddy validate --config /etc/caddy/Caddyfile` uit, en daarna `caddy reload --config /etc/caddy/Caddyfile`."
  - "Test met `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Hoofdletterongevoelige reguliere expressie"
    status: "yes"
    note: "`(?i)` aan het begin van het patroon maakt de match hoofdletterongevoelig."
  - feature: "Volgorde van directives"
    status: "yes"
    note: "Caddy sorteert directives zelf; `respond` draait vóór `reverse_proxy` en `file_server`."
  - feature: "JSON-configuratie"
    status: "partly"
    note: "Het fragment is bedoeld voor de Caddyfile; `caddy adapt` zet het om naar JSON."
faq:
  - q: "Kan ik de matcher in meerdere sites hergebruiken?"
    a: "Ja: zet hem in een snippet — `(ai_bots) { … }` — en gebruik `import ai_bots` in elk siteblok."
  - q: "Hoe log ik geblokkeerde verzoeken?"
    a: "Caddy logt elk verzoek inclusief de antwoordstatus; filter het toegangslog op status 403 en de gematchte User-Agents."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Wat het fragment doet

`@ai_bots` is een named matcher: een verzoek matcht alleen als elke voorwaarde erin waar is — de User-Agent-header matcht de expressie en het pad is niet `/robots.txt`. `respond @ai_bots 403` beëindigt die verzoeken direct met een leeg 403-antwoord. Al het andere gaat door naar je gewone handlers.
