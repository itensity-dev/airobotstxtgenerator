---
title: "AI-crawlers blokkeren in nginx (map $http_user_agent)"
description: "nginx-configuratie die GPTBot, ClaudeBot, CCBot, Bytespider en andere AI-crawlers blokkeert met een map op $http_user_agent: 403, robots.txt blijft bereikbaar."
h1: "AI-crawlers blokkeren in nginx"
nav: "nginx"
lead: "Een `map` op `$http_user_agent` markeert AI-crawlers één keer in het `http`-blok; een `if` van twee regels in elk `server`-blok geeft ze een 403, terwijl `/robots.txt` open blijft."
steps:
  - "Selecteer de agenten en kopieer de configuratie."
  - "Zet het `map`-blok in de context `http {}` — bijvoorbeeld in een nieuw bestand `/etc/nginx/conf.d/ai-bots.conf`, dat de meeste distributies automatisch inladen."
  - "Zet het blok `location = /robots.txt` en de regels `if ($is_ai_bot)` in elk `server {}`-blok dat AI-crawlers moet weigeren."
  - "Voer `nginx -t` uit om de syntaxis te controleren, en daarna `systemctl reload nginx`."
  - "Test: `curl -I -A \"Mozilla/5.0 (compatible; GPTBot/1.4)\" https://example.com/` geeft 403; `curl -I https://example.com/robots.txt` geeft nog steeds 200."
capabilities:
  - feature: "Hoofdletterongevoelig matchen"
    status: "yes"
    note: "Elke regel gebruikt `~*`, de hoofdletterongevoelige reguliere expressie van nginx."
  - feature: "Eén lijst voor alle sites"
    status: "yes"
    note: "De `map` staat in `http {}`, dus elk serverblok kan `$is_ai_bot` gebruiken."
  - feature: "Veilig gebruik van if"
    status: "yes"
    note: "`if` met `return` is een van de toepassingen die nginx binnen `server` als veilig documenteert."
  - feature: "Werkt achter een CDN"
    status: "partly"
    note: "nginx ziet de User-Agent die het CDN doorgeeft — meestal de oorspronkelijke. Bots die het CDN al blokkeert, bereiken nginx nooit."
faq:
  - q: "Waarom een map in plaats van een lange if-voorwaarde?"
    a: "nginx evalueert `map` pas wanneer het nodig is en één keer per verzoek, de lijst blijft leesbaar met één bot per regel, en je kunt de variabele hergebruiken in meerdere serverblokken of bij het loggen (`access_log ... if=$is_ai_bot`)."
  - q: "Kan ik verzoeken van AI-bots loggen in plaats van ze te blokkeren?"
    a: "Ja: houd de `map` en vervang de `if` door een apart log, bijvoorbeeld `access_log /var/log/nginx/ai-bots.log combined if=$is_ai_bot;`."
  - q: "Hoe sta ik een bot alleen toe vanaf zijn echte IP-adressen?"
    a: "Gebruik de module `geo` met de gepubliceerde bereiken van de beheerder, combineer die met de User-Agent-map en weiger verzoeken die zich vanaf andere adressen als de bot voordoen. De bereiken veranderen, dus werk ze bij met een script."
related: ["server-rules", "server-apache", "server-caddy", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Waar elk onderdeel komt

nginx leest de configuratie in contexten. De instructie `map` is alleen toegestaan in `http {}`; de instructies `if` en `location` horen in `server {}`. Beheer je meerdere sites, definieer de map dan één keer en voeg de drie regels aan elke site toe. Zet `location = /robots.txt` vóór andere locations die het verzoek zouden kunnen herschrijven of doorsturen — een location met exacte match wint in nginx altijd.

Draait nginx als reverse proxy vóór een applicatie, dan houdt de regel het verzoek tegen voordat het de applicatie bereikt; dat spaart ook de resources van de applicatie.
