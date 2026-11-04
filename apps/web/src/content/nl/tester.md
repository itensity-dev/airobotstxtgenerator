---
title: "robots.txt testen: gratis checker voor Google en AI-bots"
description: "Gratis robots.txt-checker: haal de robots.txt van een site op of plak je bestand, zie welke AI-crawlers toegang hebben, test URL's per user-agent, vind fouten."
h1: "robots.txt testen en valideren"
nav: "robots.txt-checker"
lead: "Haal de robots.txt van elke website op of plak een bestand, test een URL voor elke crawler, zie welke van de {{agents}} AI-agenten de site mogen crawlen en krijg een lijst met fouten — met de precieze regel die elk antwoord bepaalt."
steps:
  - "Vul een domein of een willekeurige URL van de site in (alleen de host wordt gebruikt) en klik op **robots.txt ophalen** — of kies **robots.txt plakken** om een concept te testen zonder het te uploaden."
  - "Lees de statusregel: Google behandelt een **4xx**-antwoord als “geen robots.txt” en een **5xx**-antwoord als “voorlopig niets crawlen”; ook doorverwijzingen, bestandsgrootte en Content-Type worden gecontroleerd."
  - "Typ een pad of volledige URL en kies een crawler: het resultaat noemt de **beslissende regel** en de groep die van toepassing is, en markeert beide in het bestand."
  - "Bekijk de tabel met AI-crawlers: homepage en jouw pad, telkens **Toegestaan**, **Geblokkeerd** of **Gedeeltelijk**, en of de crawler een eigen groep heeft."
  - "Los op wat het **foutenrapport** aangeeft en test opnieuw. Een nieuw bestand nodig? Open de [generator](page:home)."
capabilities:
  - feature: "Dezelfde antwoorden als de parser van Google"
    status: "yes"
    note: "Bevat alle testcases van de opensource robots.txt-parser van Google en komt overeen met de uitkomsten daarvan op 46 echte robots.txt-bestanden van grote sites."
  - feature: "Live ophalen van elke site"
    status: "yes"
    note: "Via onze checker: alleen openbare http/https-hosts, standaardpoorten, maximaal 5 doorverwijzingen, 5 seconden en 512 KiB. Resultaten worden 10 minuten gecachet."
  - feature: "Plakken en offline testen"
    status: "yes"
    note: "Geplakte tekst wordt in je browser geanalyseerd en nooit geüpload."
  - feature: "Linting"
    status: "yes"
    note: "Meer dan 35 controles: syntaxis, typefouten die Google tolereert, groepen die stilletjes `*`-regels laten vallen, valkuilen met lege regels, volledige URL's in regels, de limiet van 500 KiB, de syntaxis van Content-Signal en Content-Usage, door Cloudflare beheerde blokken."
  - feature: "Pagina's achter een login of firewall"
    status: "no"
    note: "We halen alleen `/robots.txt` op van het openbare internet, zoals een crawler dat zou doen. Een WAF of CDN kan crawlers nog steeds blokkeren die robots.txt toestaat — controleer de instellingen van je CDN."
  - feature: "Robots-metatags en X-Robots-Tag"
    status: "no"
    note: "Regels op paginaniveau worden hier niet gecontroleerd; zie [AI-metatags](page:meta-tags)."
faq:
  - q: "Waar is de robots.txt-tester van Google gebleven?"
    a: "Google heeft de robots.txt-tester in Search Console eind 2023 uitgefaseerd en vervangen door een robots.txt-rapport dat het opgehaalde bestand en fouten toont, maar geen URL kan testen voor een user-agent. Deze pagina vult dat gat en gebruikt dezelfde matchingregels als de opensource-parser van Google."
  - q: "Waarom is een URL toegestaan terwijl `User-agent: *` hem blokkeert?"
    a: "Omdat de crawler die je hebt gekozen een eigen groep heeft. Een crawler volgt alleen de meest specifieke groep die hem noemt, dus de regels onder `User-agent: *` gelden dan niet meer voor hem. Het foutenrapport markeert elke agent waarvoor hierdoor een `*`-regel wegvalt."
  - q: "Wat gebeurt er als robots.txt 404, 403 of 500 teruggeeft?"
    a: "Google behandelt 4xx-antwoorden (behalve 429) alsof er geen robots.txt is — alles mag worden gecrawld. 5xx en 429 betekenen “voorlopig niet crawlen”; Google probeert het opnieuw en kan na ongeveer 30 dagen een kopie uit de cache gebruiken of de site als onbeperkt behandelen."
  - q: "Maakt de volgorde van Allow- en Disallow-regels uit?"
    a: "Nee. Het langste passende patroon wint, ongeacht de volgorde; zijn een Allow- en een Disallow-patroon even lang, dan wint Allow. `*` staat voor willekeurige tekens en `$` verankert het einde van de URL."
  - q: "Wordt mijn robots.txt of het domein dat ik controleer opgeslagen?"
    a: "Geplakte tekst verlaat je browser nooit. Bij live controles haalt onze server het bestand op en houdt het maximaal 10 minuten in het geheugen, zodat herhaalde controles snel zijn; domeinen worden niet in logs of statistieken vastgelegd."
  - q: "Welke user-agent stuurt de checker mee?"
    a: "`Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)`. Hij haalt alleen `/robots.txt` op, één keer per controle. Zie [onze checker-bot](page:checker-bot)."
related: ["home", "bots", "server-rules", "guide-syntax", "guide-bad-bots"]
updated: "2026-11-04"
---

## Hoe een crawler robots.txt leest

De checker past de regels van [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) precies zo toe als de opensource-parser van Google:

1. **Zoek de groep.** Een groep bestaat uit een of meer `User-agent`-regels gevolgd door regels. De crawler gebruikt elke groep die zijn producttoken noemt (hoofdletterongevoelig, versienummers genegeerd) en voegt ze samen. Alleen als geen enkele groep hem noemt, gebruikt hij `User-agent: *`. Lege regels beëindigen een groep niet.
2. **Zoek de passende regels.** Elk `Allow`- en `Disallow`-patroon wordt vergeleken met het pad en de query van de URL. Patronen matchen vanaf het begin van het pad; `*` staat voor willekeurige tekens, een `$` aan het eind voor het einde van de URL. Matching is hoofdlettergevoelig.
3. **Kies de langste match.** De regel met het langste patroon wint. Zijn een `Allow` en een `Disallow` even lang, dan wint `Allow`. Past er geen enkele regel, dan is de URL toegestaan.

Google tolereert ook veelgemaakte fouten — `Dissallow`, `User agent`, een ontbrekende dubbele punt — en negeert alles na 500 KiB. De checker doet dat na en meldt elk geval, zodat je je bestand zo kunt schrijven dat andere, mogelijk strengere crawlers het op dezelfde manier lezen.

## Hoe live controles werken

Onze server vraagt `https://your-host/robots.txt` op (en valt terug op `http://` als HTTPS geen verbinding krijgt), volgt maximaal vijf doorverwijzingen, stopt na 5 seconden of 512 KiB en geeft de ruwe bytes terug, zodat byte order marks en coderingen kunnen worden geïnspecteerd. Vóór elke verbinding zoekt de server de hostnaam zelf op en weigert privé-, lokale en gereserveerde adressen. Al het andere — parsen, matchen, linten — gebeurt in je browser.
