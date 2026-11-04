---
title: "Lijst met AI-crawlers: alle AI-bots en hoe je ze blokkeert"
description: "Register van {{all}} AI-crawlers en robots.txt-tokens (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bytespider) met beheerder, doel, robots.txt en IP-lijsten."
h1: "Register van AI-crawlers"
nav: "Botregister"
lead: "Elke AI-crawler, AI-agent en elk robots.txt-controletoken dat we konden documenteren: wie hem beheert, wat hij verzamelt, of de beheerder zegt dat hij robots.txt volgt en hoe je hem verifieert — met een link naar de bron en de datum van onze laatste controle."
steps:
  - "Doorzoek het register op naam of bedrijf, of bekijk het per beheerder."
  - "Open de pagina van een agent voor de User-Agent, het robots.txt-token, de IP-lijst en regels om direct te kopiëren."
  - "Gebruik de kolom Doel om te beslissen: trainingscrawlers kun je meestal blokkeren zonder zichtbaarheid te verliezen; AI-zoekmachines en gebruikersagenten leveren citaties en bezoekers op."
  - "Maak een compleet bestand met de [generator](page:home) of test je huidige bestand met de [checker](page:tester)."
capabilities:
  - feature: "Bron bij elke vermelding"
    status: "yes"
    note: "Elke gecureerde vermelding linkt naar de eigen documentatie van de beheerder; waar die niet bestaat, staat dat op de pagina."
  - feature: "Datum van de laatste controle"
    status: "yes"
    note: "Per agent vermeld, met de manier waarop is gecontroleerd (pagina geopend of gelezen via een zoekindex)."
  - feature: "Machineleesbaar"
    status: "yes"
    note: "Het hele register is beschikbaar als [/bots.json](/bots.json) onder CC BY 4.0."
  - feature: "Wekelijkse update"
    status: "yes"
    note: "Een wekelijkse taak vergelijkt de communitylijst met ai.robots.txt en opent een pull request; gecureerde vermeldingen worden met de hand gecontroleerd."
  - feature: "Bewijs dat een verzoek echt is"
    status: "partly"
    note: "Alleen als de beheerder IP-bereiken, reverse-DNS-hostnamen of handtekeningen publiceert. Iedereen kan een User-Agent-string vervalsen."
faq:
  - q: "Welke AI-crawlers moet ik blokkeren?"
    a: "Dat hangt af van wat je wilt. Wil je content buiten AI-training houden maar zichtbaar blijven in AI-antwoorden, blokkeer dan de trainingscrawlers en -tokens (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent, Bytespider, MistralAI-Training) en sta de zoekagenten toe (OAI-SearchBot, Claude-SearchBot, PerplexityBot). De [handleiding](page:guide-training-search) legt de afwegingen uit."
  - q: "Wat is het verschil tussen een crawler en een robots.txt-token?"
    a: "Een crawler stuurt verzoeken met een eigen User-Agent. Een token zoals Google-Extended of Applebot-Extended bezoekt je site nooit; het is een naam in robots.txt die de beheerder vertelt hoe content die zijn gewone crawler ophaalt gebruikt mag worden. Tokens kun je alleen in robots.txt instellen, niet met serverregels."
  - q: "Waarom negeren sommige agenten robots.txt?"
    a: "Fetchers die op verzoek van een persoon werken — ChatGPT-User, Perplexity-User, Google-Agent, meta-externalfetcher — worden door hun beheerders als een browser behandeld en volgen robots.txt mogelijk niet. Sommige crawlers publiceren helemaal geen beleid. Blokkeer die op de server of in het CDN."
  - q: "Hoe actueel is de lijst?"
    a: "Gecureerde vermeldingen zijn op {{updated}} gecontroleerd aan de hand van de documentatie van de beheerders; elke pagina toont haar eigen datum. De communitylijst wordt elke week gesynchroniseerd met ai.robots.txt."
  - q: "Mag ik de data gebruiken?"
    a: "Ja. Het register is als JSON gepubliceerd op /bots.json onder CC BY 4.0 — vermeld daarbij airobotstxtgenerator.com. Communityvermeldingen komen uit het project ai.robots.txt onder de MIT-licentie."
related: ["home", "tester", "server-rules", "guide-training-search"]
updated: "2026-11-04"
---

## Hoe het register is opgebouwd

Elke gecureerde vermelding begint bij de eigen documentatie van de beheerder: OpenAI, Anthropic, Google, Apple, Perplexity, Meta, Amazon, Mistral, DuckDuckGo, Microsoft, Common Crawl en anderen publiceren pagina's over hun crawlers. Op basis daarvan leggen we vast: het robots.txt-token, een gedocumenteerde User-Agent-string, het doel, de verklaring van de beheerder over robots.txt, gepubliceerde IP-lijsten of hostnamen en de datum van onze controle. Publiceert een beheerder niets — ByteDance bij Bytespider bijvoorbeeld — dan staat bij de vermelding dat ze op onafhankelijke waarnemingen is gebaseerd.

**Doelen** volgen de categorieën die beheerders en Cloudflare tegenwoordig gebruiken: *AI-training*, *AI-zoeken* (indexeren en citeren), *ophalen op verzoek van gebruikers* (een assistent die een pagina opent voor een persoon) en *robots.txt-tokens*. Algemene crawlers zoals Googlebot, Bingbot en Applebot staan ter referentie in de lijst, omdat veel AI-functies op hen steunen.

De **communitylijst** onder de hoofdtabel komt uit het open project [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt). Die is breder, maar niet per vermelding geverifieerd; sommige namen worden door de beheerders zelf tegengesproken (Cohere zegt geen crawler te hebben, Brave heeft geen eigen User-Agent, de crawler van Exa heet ExaSearchBot).
