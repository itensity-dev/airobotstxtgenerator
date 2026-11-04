---
title: "AI-bots blokkeren in Express, Next.js, Django en PHP"
description: "Middleware die GPTBot, ClaudeBot en andere AI-crawlers op User-Agent blokkeert in Express, Next.js (proxy.ts), Django en PHP/WordPress; robots.txt blijft open."
h1: "AI-bots blokkeren in je applicatie"
nav: "Frameworks"
lead: "Kun je de webserver niet aanpassen, blokkeer AI-crawlers dan in de applicatie zelf: middleware voor Express, Next.js, Django en gewone PHP of WordPress, gegenereerd uit het register."
steps:
  - "Kies het framework en de agenten en kopieer de code."
  - "Express: registreer de middleware vóór je routes. Next.js: sla op als `proxy.ts` in de root van het project (`middleware.ts` vóór Next.js 16). Django: voeg de klasse toe aan `MIDDLEWARE`. PHP: neem het bestand helemaal bovenaan `index.php` op of zet het in `wp-content/mu-plugins/`."
  - "Deploy en test met `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Geen servertoegang nodig"
    status: "yes"
    note: "Werkt op platforms waar je alleen de code in handen hebt (Vercel, Render, shared PHP-hosting)."
  - feature: "Statische bestanden die een CDN uitlevert"
    status: "partly"
    note: "Verzoeken die het CDN of een statische bestandsserver beantwoordt, bereiken je middleware nooit; blokkeer daar ook."
  - feature: "Prestaties"
    status: "yes"
    note: "Eén gecompileerde reguliere expressie per verzoek."
faq:
  - q: "Is middleware net zo goed als een serverregel?"
    a: "Het weigert dezelfde verzoeken, maar later: je applicatie is er dan al mee bezig. Server- of CDN-regels zijn goedkoper. Middleware is de juiste keuze als je de server niet kunt aanpassen."
  - q: "Draait de proxy van Next.js ook voor statische assets?"
    a: "Standaard draait hij voor elke route; voeg een `config.matcher` toe die `_next/static` en afbeeldingen uitsluit als je aanroepen wilt besparen."
related: ["server-rules", "server-nginx", "server-cloudflare", "bots"]
updated: "2026-11-04"
---

## Hoe de middleware beslist

Elk fragment bouwt één hoofdletterongevoelige reguliere expressie uit de User-Agent-namen van de geselecteerde agenten, slaat het pad `/robots.txt` over en beantwoordt verzoeken die matchen met de status die je hebt gekozen en een korte boodschap in platte tekst. Verder verandert er niets in je applicatie.
