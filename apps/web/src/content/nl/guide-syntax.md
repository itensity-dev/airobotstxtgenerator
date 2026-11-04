---
title: "robots.txt-syntaxis (RFC 9309): regels met voorbeelden"
description: "De syntaxis van robots.txt met voorbeelden: groepen, User-agent, Allow en Disallow, wildcards * en $, langste match, statuscodes en veelgemaakte fouten."
h1: "robots.txt-syntaxis volgens RFC 9309, met voorbeelden"
nav: "robots.txt-syntaxis"
lead: "robots.txt werd in september 2022 een internetstandaard: RFC 9309. De regels zijn kort, maar een paar ervan — langste match, één groep per crawler, lege regels — verrassen bijna iedereen. Elk voorbeeld hieronder kun je in de checker plakken."
related: ["tester", "home", "guide-bad-bots", "bots"]
updated: "2026-11-04"
faq:
  - q: "Is robots.txt hoofdlettergevoelig?"
    a: "Namen van instructies (`User-agent`, `Disallow`) en botnamen niet; paden wel. `Disallow: /Private/` blokkeert `/private/` niet."
  - q: "Kan ik reguliere expressies gebruiken?"
    a: "Nee. Alleen `*` (een willekeurige reeks tekens) en `$` aan het eind van een patroon (einde van de URL) hebben een speciale betekenis."
  - q: "Heb ik een Allow-regel nodig?"
    a: "Alleen om een pad binnen een geblokkeerd pad weer open te zetten. Alles wat niet wordt geblokkeerd, is toegestaan."
  - q: "Geldt robots.txt ook voor subdomeinen?"
    a: "Nee. Elke combinatie van schema, host en poort heeft een eigen bestand: `https://example.com/robots.txt` geldt niet voor `https://blog.example.com/`."
---

## Het bestand

robots.txt is een bestand met platte tekst in UTF-8 in de root van een host: `https://example.com/robots.txt`. Crawlers halen het op voordat ze gaan crawlen. Regels hebben de vorm `sleutel: waarde`; `#` begint een commentaar. Google leest maximaal **500 KiB** en negeert de rest.

## Groepen

Een **groep** bestaat uit een of meer `User-agent`-regels, gevolgd door regels:

```
User-agent: GPTBot
User-agent: CCBot
Disallow: /

User-agent: *
Disallow: /admin/
```

- Een crawler gebruikt de groep(en) die hem **noemen**. De vergelijking is hoofdletterongevoelig en gebruikt alleen het producttoken: `User-agent: GPTBot/1.4` wordt gelezen als `GPTBot`.
- Noemen meerdere groepen dezelfde crawler, dan worden hun regels **samengevoegd**.
- Alleen een crawler die door geen enkele groep wordt genoemd, gebruikt `User-agent: *`.
- Een crawler met een eigen groep **negeert `*` volledig**. In het voorbeeld mag `GPTBot` niets ophalen — maar als in zijn groep alleen `Disallow: /blog/` stond, mocht hij `/admin/` wel ophalen, omdat de `*`-regel dan niet meer voor hem geldt.

**Lege regels beëindigen een groep niet.** Dit bestand geeft `GPTBot` de `*`-regels, omdat beide User-agent-regels bij dezelfde groep horen:

```
User-agent: GPTBot

User-agent: *
Disallow: /private/
```

## Regels: Allow en Disallow

`Disallow: /path` blokkeert elke URL waarvan het pad met `/path` begint — ook `/path.html`, `/path/` en `/pathology`. Een lege `Disallow:` staat alles toe. `Allow` zet een pad weer open.

Passen er meerdere regels, dan **wint het langste patroon**; zijn een Allow- en een Disallow-patroon even lang, dan **wint Allow**. De volgorde van de regels maakt niet uit.

```
User-agent: *
Disallow: /shop/
Allow: /shop/catalog/
```

`/shop/cart` is geblokkeerd; `/shop/catalog/shoes` is toegestaan (14 tekens winnen van 6).

## Wildcards

- `*` past op elke reeks tekens: `Disallow: /*.pdf` blokkeert elke URL waarin `.pdf` voorkomt.
- `$` aan het eind verankert het einde van de URL: `Disallow: /*.pdf$` blokkeert `/a.pdf`, maar niet `/a.pdf?download=1`.
- Een `*` aan het eind verandert niets: `/private*` is gelijk aan `/private`.
- Patronen worden vergeleken met het pad **en de query**: `Disallow: /*?sort=` blokkeert gesorteerde overzichtspagina's.

## Andere regels

- `Sitemap: https://example.com/sitemap.xml` — een volledige URL; geldt voor alle crawlers en mag overal in het bestand staan.
- `Crawl-delay` — genegeerd door Google; Bing, Yandex, Anthropic en Common Crawl houden er rekening mee.
- `Noindex` in robots.txt — sinds 2019 niet meer ondersteund; gebruik een robots-metatag.
- `Content-Signal`, `Content-Usage` — voorstellen voor AI-voorkeuren; zie [content signals](page:content-signals).

## Als het bestand ontbreekt of kapot is

| Antwoord voor /robots.txt | Gedrag van Google |
|---|---|
| 200 | De regels gelden |
| 3xx | Volgt maximaal 5 doorverwijzingen en behandelt het daarna als 404 |
| 4xx (behalve 429) | Geen beperkingen — alles mag worden gecrawld |
| 5xx, 429 | Crawlen gepauzeerd; na ~30 dagen een kopie uit de cache of geen beperkingen |
| Onbereikbaar | Behandeld als 5xx |

## Fouten die Google vergeeft — en andere crawlers misschien niet

Google accepteert `Dissallow`, `User agent`, een ontbrekende dubbele punt (`Disallow /admin`) en een byte order mark. Andere crawlers misschien niet, dus de [checker](page:tester) markeert ze, ook al leest de parser van Google ze wel. Hij markeert ook regels vóór de eerste `User-agent`-regel (die iedereen negeert), volledige URL's in `Disallow` (die nooit matchen) en paden zonder slash aan het begin.
