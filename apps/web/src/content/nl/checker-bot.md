---
title: "AIRobotsTxtChecker: de bot achter onze robots.txt-checker"
description: "Over AIRobotsTxtChecker, de User-Agent van onze robots.txt-checker: wat hij ophaalt (alleen /robots.txt), hoe vaak, vanaf waar en hoe je hem blokkeert."
h1: "Onze checker-bot: AIRobotsTxtChecker"
nav: "Checker-bot"
lead: "Als iemand de live controle in onze robots.txt-checker gebruikt, haalt onze server één keer de /robots.txt van die site op, met deze User-Agent. Hij haalt nooit iets anders op."
related: ["tester", "privacy", "about"]
updated: "2026-11-04"
---

## User-Agent

```
Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)
```

## Wat hij doet

- Haalt **alleen** `/robots.txt` op van de host die een gebruiker heeft ingevuld — nooit pagina's, afbeeldingen of sitemaps.
- Eén verzoek per controle; resultaten worden 10 minuten gecachet, dus herhaalde controles van dezelfde host binnen die tijd leiden niet tot een nieuw verzoek.
- Volgt maximaal 5 doorverwijzingen, wacht maximaal 5 seconden en leest maximaal 512 KiB.
- Maakt alleen verbinding met openbare IP-adressen op de poorten 80 en 443.
- Is geen crawler: hij volgt geen links, bewaart je bestand niet langer dan de cache en gebruikt het nergens anders voor.

## Volgt hij robots.txt?

Hij leest robots.txt; hij crawlt niets waarover robots.txt zou kunnen beslissen. Net als de robots.txt-fetcher van Google past hij je robots.txt niet toe op het robots.txt-bestand zelf.

## Hoe je hem blokkeert

Wil je niet dat je robots.txt via onze site wordt gecontroleerd, geef dan een `403` terug voor de User-Agent `AIRobotsTxtChecker`, bijvoorbeeld in nginx:

```nginx
if ($http_user_agent ~* "AIRobotsTxtChecker") { return 403; }
```

Vragen of meldingen van misbruik: {{contact}}.
