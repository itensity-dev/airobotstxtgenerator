---
title: "TDMRep-generator: tdmrep.json en tdm-reservation-header"
description: "Maak TDMRep-bestanden: /.well-known/tdmrep.json, de headers tdm-reservation en tdm-policy en HTML-metatags, voor een tdm-voorbehoud onder art. 4 DSM-richtlijn."
h1: "TDMRep-generator"
nav: "TDMRep"
lead: "Maak de bestanden van het TDM Reservation Protocol (TDMRep) — een specificatie van een W3C Community Group waarmee je machineleesbaar aangeeft dat je je rechten op tekst- en datamining onder het Europese auteursrecht voorbehoudt."
steps:
  - "Kies `tdm-reservation: 1` om je rechten voor te behouden, of `0` om aan te geven dat je dat niet doet."
  - "Voeg eventueel de URL van een `tdm-policy` toe: een machineleesbaar document dat uitlegt hoe je een licentie krijgt."
  - "Publiceer `/.well-known/tdmrep.json` in de root van je site, en/of voeg de HTTP-headers of HTML-metatags toe."
  - "Houd robots.txt-regels aan voor de crawlers die je wilt tegenhouden: TDMRep behoudt rechten voor, maar blokkeert niets."
capabilities:
  - feature: "Bestand voor de hele site"
    status: "yes"
    note: "`/.well-known/tdmrep.json` met `location`, `tdm-reservation` en `tdm-policy`."
  - feature: "Headers en metatags per response"
    status: "yes"
    note: "`tdm-reservation` en `tdm-policy` als HTTP-headers (fragmenten voor nginx en Apache) en als HTML-`<meta>`-tags."
  - feature: "Juridisch advies"
    status: "no"
    note: "Of een voorbehoud werkt, hangt af van het nationale recht en de feiten. Deze pagina is informatie, geen juridisch advies."
faq:
  - q: "Wat is TDMRep?"
    a: "Het TDM Reservation Protocol, gepubliceerd door een W3C Community Group (Final Report 2024). Het beschrijft hoe een rechthebbende — in een bestand, een HTTP-header of HTML — kan aangeven dat tekst- en datamining van zijn content is voorbehouden, zoals artikel 4, lid 3, van de DSM-richtlijn (2019/790) toestaat."
  - q: "Heb ik TDMRep nodig als ik AI-crawlers al in robots.txt blokkeer?"
    a: "robots.txt zegt wie mag ophalen; TDMRep zegt wat er met content mag gebeuren, ongeacht wie die heeft opgehaald. De EU-praktijkcode voor AI voor algemene doeleinden verplicht ondertekenaars robots.txt en andere passende machineleesbare protocollen te volgen; beide publiceren is dubbel zeker."
  - q: "Welke AI-bedrijven lezen TDMRep?"
    a: "De ondersteuning is beperkt en zelden gedocumenteerd. Europese uitgevers en sommige dataleveranciers gebruiken het; de meeste grote AI-ontwikkelaars documenteren alleen robots.txt. Zie het als een extra, gestandaardiseerde verklaring van je voorbehoud."
related: ["content-signals", "guide-eu-ai-act", "meta-tags", "home"]
updated: "2026-11-04"
---

## Waar TDMRep past

De DSM-richtlijn van de EU staat tekst- en datamining toe van rechtmatig toegankelijke content, tenzij de rechthebbende dat **uitdrukkelijk heeft voorbehouden** — bij online gepubliceerde content op passende wijze, zoals met machineleesbare middelen. robots.txt is zo'n middel; TDMRep is er nog een, speciaal voor dit doel ontworpen. Een `tdmrep.json`-bestand kan de hele site of delen ervan dekken (`location`-patronen), headers kunnen elk bestandstype dekken, inclusief pdf's en afbeeldingen, en metatags werken als je alleen de HTML in handen hebt.
