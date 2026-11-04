---
title: "Waarom robots.txt niet beschermt tegen kwaadaardige bots"
description: "robots.txt is een verzoek, geen toegangscontrole: welke bots het negeren, waarom User-Agents te vervalsen zijn en wat wel helpt, zoals serverregels en een WAF."
h1: "Waarom robots.txt je niet beschermt tegen kwaadaardige bots"
nav: "robots.txt en kwaadaardige bots"
lead: "robots.txt is een bordje op de deur, geen slot. Het werkt omdat verantwoordelijke crawlers ervoor kiezen het te lezen; scrapers die zich er niets van aantrekken of zich voordoen als iemand anders, houdt het niet tegen."
related: ["server-rules", "tester", "bots", "guide-syntax"]
updated: "2026-11-04"
faq:
  - q: "Kan robots.txt een pagina privé maken?"
    a: "Nee. Iedereen kan een geblokkeerde URL openen, en door hem in robots.txt te zetten maak je hem juist bekend. Bescherm privécontent met authenticatie."
  - q: "Hoe weet ik of een bot mijn robots.txt negeert?"
    a: "Zoek in je serverlogs naar verzoeken op geblokkeerde paden met de User-Agent van die bot, en controleer het IP-adres: een verzoek van buiten de gepubliceerde bereiken van de beheerder komt niet van de echte bot."
  - q: "Kan ik niet gewoon alles blokkeren wat op een bot lijkt?"
    a: "Nee — dan verlies je zoekmachines, linkvoorbeelden, uptimemonitors en toegankelijkheidstools. Blokkeer op naam waar het kan, verifieer waar beheerders dat mogelijk maken, en beperk de rest met rate limiting."
---

## Wat robots.txt is

RFC 9309 zegt het zonder omwegen: de regels zijn geen vorm van toegangsautorisatie. Een crawler haalt `/robots.txt` op, leest de groep die hem noemt en besluit zich eraan te houden. Niets in HTTP dwingt dat besluit af.

## Wie het negeert

- **Scrapers en dataverzamelaars** die nooit om toestemming hebben gevraagd. Veel van hen gebruiken gewone browser-User-Agents.
- **Fetchers die namens een gebruiker werken.** OpenAI, Perplexity, Google en Meta zeggen dat hun fetchers die door gebruikers worden aangestuurd (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`, `meta-externalfetcher`) robots.txt mogelijk niet volgen, omdat iemand om de pagina vroeg. Anthropic zegt dat zijn `Claude-User` dat wel doet.
- **Crawlers die geen beleid publiceren** — `Bytespider` heeft bijvoorbeeld geen officiële documentatie, en sitebeheerders melden dat hij robots.txt negeert.
- **Bedriegers.** Iedereen kan `User-Agent: GPTBot` of `Googlebot` meesturen. Nagemaakte User-Agents van zoekmachines zijn een klassieke manier om naïeve blokkades te omzeilen.

## Wat robots.txt verraadt

Het bestand is openbaar. Een regel `Disallow: /admin-backup-2024/` vertelt iedereen dat het pad bestaat. Zet er geen geheimen in; bescherm ze.

## Wat je in plaats daarvan — of daarnaast — gebruikt

| Maatregel | Houdt tegen | Opmerkingen |
|---|---|---|
| robots.txt | Crawlers die het volgen | Het standaard, gedocumenteerde signaal. Houd het. |
| [Serverregels](page:server-rules) op User-Agent | Bots die zich bekendmaken | Goedkoop en effectief voor AI-crawlers met een naam |
| Verificatie via IP / reverse DNS | Bedriegers die zich voordoen als een bekende bot | Gebruik de gepubliceerde bereiken van de beheerder; zie de [pagina van elke bot](page:bots) |
| Rate limiting | Scrapers met veel verzoeken, onder welke naam ook | Per IP of per netwerk; beschermt de server |
| Botbeheer van het CDN / WAF | Bekende foute netwerken, browserautomatisering | Cloudflare, Fastly, Akamai en anderen classificeren bots |
| Authenticatie | Iedereen zonder account | De enige echte bescherming voor privécontent |

## Een verstandige volgorde

1. Publiceer een eerlijke robots.txt — die documenteert je keuze en is waar de EU-praktijkcode naar verwijst.
2. Blokkeer de AI-agenten waartegen je bezwaar hebt op naam, op de server of in het CDN.
3. Verifieer de bots die je toestaat, zodat bedriegers die hun naam gebruiken worden geweigerd.
4. Beperk al het andere met rate limiting en houd je logs in de gaten.
