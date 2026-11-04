---
title: "AI-bots blokkeren met .htaccess en nginx: serverregels"
description: "Serverregels die AI-crawlers op User-Agent een 403 geven: nginx, Apache .htaccess, Caddy, Cloudflare WAF, Express, Next.js, Django, PHP. Plus IP-verificatie."
h1: "AI-bots blokkeren op de server"
nav: "Serverregels"
lead: "robots.txt vraagt alleen; met deze regels weigert je server AI-crawlers op basis van hun User-Agent. Kies een server en de agenten die je wilt blokkeren, kopieer de regel en verifieer echte bots via IP of reverse DNS."
steps:
  - "Kies je server of framework: nginx, Apache, Caddy, Cloudflare WAF, Express, Next.js, Django of PHP."
  - "Kies de agenten: alleen trainingscrawlers, alle AI-agenten of je eigen selectie uit het register."
  - "Kies de antwoordcode — `403 Forbidden` is het duidelijkste signaal; met `404` of `410` verberg je dat je blokkeert."
  - "Plak de regel waar het commentaar dat aangeeft, herlaad de server en controleer met `curl -A \"GPTBot\" -I https://your-site/` — je moet de gekozen code krijgen, terwijl `/robots.txt` bereikbaar blijft."
capabilities:
  - feature: "Slaat tokens over die alleen in robots.txt bestaan"
    status: "yes"
    note: "Google-Extended, Applebot-Extended, FirecrawlAgent en `__usage_ai-training` komen nooit voor in een User-Agent-header en worden daarom weggelaten in plaats van dode regels op te leveren."
  - feature: "Blokkeert nooit zoekmachines of linkvoorbeelden"
    status: "yes"
    note: "Googlebot, Bingbot, Applebot en facebookexternalhit worden in de presets niet aangeboden; algemene communitynamen (Code, Spider, OpenAI …) worden weggelaten, zodat ander verkeer niet wordt geblokkeerd."
  - feature: "Houdt /robots.txt bereikbaar"
    status: "yes"
    note: "Elke regel maakt een uitzondering voor `/robots.txt`, zodat crawlers je beleid nog steeds kunnen lezen."
  - feature: "Houdt vervalste of niet-aangemelde bots tegen"
    status: "no"
    note: "Matchen op User-Agent houdt alleen bots tegen die zich bekendmaken. Voor bots met een browser-User-Agent heb je rate limits, botbeheer of regels op IP-basis nodig."
  - feature: "Lengte van Cloudflare-expressies"
    status: "partly"
    note: "Expressies van custom rules mogen maximaal 4.096 tekens lang zijn; de tool waarschuwt als een selectie te lang is."
faq:
  - q: "Moet ik AI-crawlers in robots.txt blokkeren of op de server?"
    a: "Allebei, om verschillende redenen. robots.txt is de gedocumenteerde, machineleesbare manier om je keuze kenbaar te maken — daar verwijst de EU-praktijkcode voor AI voor algemene doeleinden naar — en fatsoenlijke crawlers volgen het. Serverregels dwingen de keuze af bij crawlers die robots.txt negeren of pagina's namens een gebruiker ophalen."
  - q: "Kan een bot een blokkade op User-Agent omzeilen?"
    a: "Ja, door een andere User-Agent mee te sturen. Daarom publiceren beheerders IP-bereiken of ondertekenen ze hun verzoeken: daarmee kun je voor een bot die je vertrouwt alleen echte verzoeken toelaten, of een bot op zijn netwerk blokkeren. De tabel hieronder toont elke gepubliceerde IP-lijst en hostnaam."
  - q: "Is blokkeren met 403 slecht voor mijn SEO?"
    a: "Niet als je alleen AI-specifieke agenten blokkeert. Blokkeer Googlebot, Bingbot of Applebot nooit op deze manier; Google-Extended en Applebot-Extended regelen het AI-gebruik zonder dat zoeken wordt geraakt."
  - q: "Welke antwoordcode moet ik gebruiken?"
    a: "`403 Forbidden` zegt duidelijk dat toegang wordt geweigerd. Sommige sitebeheerders kiezen liever `404` of `410`, zodat de crawler niets bruikbaars vastlegt. Alle drie zorgen ervoor dat de content niet wordt uitgeleverd."
related: ["server-nginx", "server-apache", "server-cloudflare", "bots", "guide-bad-bots"]
updated: "2026-11-04"
---

## Hoe de regels worden opgebouwd

De regels komen uit hetzelfde [register](page:bots) als de generator. Voor elke geselecteerde agent nemen we de deelstrings die de beheerder voor de User-Agent-header documenteert (bijvoorbeeld `GPTBot` of `ClaudeBot`), verwijderen we dubbele namen en namen die al door een kortere worden gedekt, en schrijven we een hoofdletterongevoelige match voor je server. Agenten die alleen robots.txt-tokens zijn, worden met een toelichting overgeslagen, omdat geen enkel verzoek hun naam bevat.

## Controleren of een bot echt is

Een User-Agent-string is gewoon tekst, en nagemaakte verzoeken van “GPTBot” of “Googlebot” komen veel voor. Beheerders bieden drie manieren om te bewijzen dat een verzoek echt is:

- **IP-lijsten** — JSON-bestanden met de adresbereiken die de crawler gebruikt (OpenAI, Anthropic, Perplexity, Google, Common Crawl, DuckDuckGo en anderen). Vergelijk het IP-adres van de client met de bereiken en ververs de lijst regelmatig.
- **Reverse DNS** — zoek de hostnaam van het client-IP op, controleer of die eindigt op het domein van de beheerder (bijvoorbeeld `googlebot.com` of `applebot.apple.com`), zoek die hostnaam daarna weer voorwaarts op en controleer of hetzelfde IP-adres terugkomt.
- **Ondertekende verzoeken (Web Bot Auth)** — het verzoek bevat een HTTP Message Signature die je kunt controleren met de gepubliceerde sleutel van de beheerder (Exa, You.com, de agent van ChatGPT, sommige verzoeken van Google-Agent).

Elke [botpagina](page:bots) heeft een kant-en-klaar Node.js-fragment voor de bijbehorende methode.
