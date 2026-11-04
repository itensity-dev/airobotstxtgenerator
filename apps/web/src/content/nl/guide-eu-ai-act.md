---
title: "AI-opt-out: tdm-voorbehoud maken volgens art. 15o Auteurswet"
description: "robots.txt, de AI-verordening en het tdm-voorbehoud uit art. 15o Auteurswet (art. 4 DSM-richtlijn): wat de praktijkcode vraagt. Geen juridisch advies."
h1: "AI-bots en de AI-verordening: wat een opt-out betekent"
nav: "AI-bots en de AI-verordening"
lead: "Het EU-recht staat iedereen toe openbaar beschikbare content voor elk doel te minen, tenzij de rechthebbende dat recht machineleesbaar heeft voorbehouden. Sinds augustus 2025 moeten aanbieders van AI-modellen aantonen dat ze zulke voorbehouden respecteren — en de praktijkcode noemt daarbij robots.txt."
related: ["tdmrep", "content-signals", "home", "guide-training-search"]
updated: "2026-11-04"
faq:
  - q: "Is een Disallow in robots.txt een juridisch geldig voorbehoud?"
    a: "De praktijkcode behandelt robots.txt volgens RFC 9309 als een protocol dat ondertekenaars moeten volgen, en rechters hebben machineleesbare voorbehouden al beoordeeld, maar het juridische effect hangt af van het nationale recht en de feiten van een zaak. Dit is informatie, geen juridisch advies."
  - q: "Geldt de AI-verordening ook voor AI-bedrijven buiten de EU?"
    a: "De verplichtingen gelden voor aanbieders die AI-modellen voor algemene doeleinden op de EU-markt brengen, waar ze ook gevestigd zijn. Het auteursrechtbeleid moet de voorbehouden van rechthebbenden in de EU dekken."
  - q: "Wat moet ik publiceren?"
    a: "Een robots.txt die de AI-trainingscrawlers waartegen je bezwaar hebt een Disallow geeft, eventueel een TDMRep-bestand, en een bepaling in je voorwaarden. Bewaar gedateerde kopieën van je robots.txt, zodat je kunt aantonen sinds wanneer het voorbehoud gold."
---

*Deze pagina is informatie, geen juridisch advies.*

## Twee wetten, één mechanisme

**De DSM-richtlijn (EU) 2019/790, artikel 4** staat tekst- en datamining toe van werken die rechtmatig toegankelijk zijn — de juridische basis waarop veel AI-training in de EU steunt — tenzij de rechthebbende dat gebruik **uitdrukkelijk heeft voorbehouden**. Voor content die online openbaar is gemaakt, moet dat voorbehoud op passende wijze worden gemaakt, zoals met machineleesbare middelen. Elke lidstaat heeft deze regel in zijn auteurswet opgenomen.

**De AI-verordening, artikel 53, lid 1, onder c,** verplicht aanbieders van AI-modellen voor algemene doeleinden om beleid in te voeren waarmee ze het auteursrecht van de EU naleven en in het bijzonder voorbehouden van rechten op grond van artikel 4, lid 3, van de DSM-richtlijn opsporen en respecteren, ook met behulp van geavanceerde technologie. De verplichtingen gelden sinds **2 augustus 2025**; het AI-bureau kan ze vanaf **2 augustus 2026** met boetes handhaven.

## Zo is het in Nederland geregeld

Nederland heeft artikel 4 van de DSM-richtlijn omgezet in **artikel 15o van de Auteurswet** (tekst- en datamining voor elk doel); artikel 15n regelt tekst- en datamining voor wetenschappelijk onderzoek. Beide artikelen zijn ingevoerd met de Implementatiewet richtlijn auteursrecht in de digitale eengemaakte markt (Stb. 2020, 558) en gelden sinds 7 juni 2021. Het sleutelbegrip is het **voorbehoud**: tdm is toegestaan, tenzij de maker of rechthebbende het uitdrukkelijk heeft voorbehouden, bij online content op passende wijze, zoals met **machineleesbare** middelen. Een robots.txt-regel voor trainingscrawlers is zo'n machineleesbaar middel.

Voor Belgische (Vlaamse) sites geldt het Belgische recht: daar is de DSM-richtlijn omgezet in boek XI van het Wetboek van economisch recht.

## Wat de praktijkcode zegt

De praktijkcode voor AI voor algemene doeleinden (General-Purpose AI Code of Practice, hoofdstuk auteursrecht, juli 2025) is de manier waarop de meeste grote aanbieders aantonen dat ze zich aan de regels houden. Ondertekenaars verbinden zich onder meer tot het volgende:

1. crawlers gebruiken die **robots.txt lezen en volgen zoals beschreven in RFC 9309** en latere versies van de standaard;
2. **andere passende machineleesbare protocollen** voor het voorbehouden van rechten herkennen en respecteren — protocollen die door standaardisatie-instellingen zijn vastgesteld of die op grote schaal door rechthebbenden worden gebruikt;
3. informatie publiceren over hun crawlers en de manier waarop ze met robots.txt omgaan.

De Europese Commissie heeft een consultatie gehouden over welke andere protocollen meetellen; op het moment van schrijven was er nog geen officiële lijst gepubliceerd.

## Wat dit in de praktijk betekent

- Een `Disallow` voor de trainingscrawler van een aanbieder (bijvoorbeeld `GPTBot`, `ClaudeBot`, `MistralAI-Training`, `CCBot`) is het meest erkende machineleesbare voorbehoud.
- Een token zoals `Google-Extended` of `Applebot-Extended` drukt het voorbehoud uit zonder dat je uit de zoekresultaten verdwijnt.
- **robots.txt behoudt rechten voor tegenover de crawlers die je noemt.** Een trainingscrawler die je niet kent, valt er niet onder. Gedeelde groepen zoals `__usage_ai-training` en regels op basis van gebruik zoals `Content-Usage: train-ai=n` moeten dat gat dichten; [TDMRep](page:tdmrep) is een protocol dat speciaal is ontworpen voor voorbehouden onder artikel 4.
- Verklaringen in gewone taal in je algemene voorwaarden zijn voor online gepubliceerde content mogelijk niet genoeg; rechters hebben gekeken naar een machineleesbare vorm.

## Een verdedigbare opzet

1. Een robots.txt waarin je trainingscrawlers zijn geblokkeerd — gebruik de [generator](page:home).
2. Eventueel een `tdmrep.json` en een `Content-Usage`-regel.
3. Een zin in je voorwaarden waarin je tekst- en datamining voorbehoudt op grond van artikel 4, lid 3, DSM-richtlijn (in Nederland: artikel 15o Auteurswet).
4. Een archief van je robots.txt met datums (bijvoorbeeld een kopie in versiebeheer).
