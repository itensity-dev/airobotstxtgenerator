---
title: "robots.txt-Syntax nach RFC 9309: Regeln mit Beispielen"
description: "robots.txt-Syntax mit Beispielen: Gruppen, User-agent, Allow/Disallow, Platzhalter * und $, längster Treffer, Statuscodes und typische Fehler – nach RFC 9309."
h1: "robots.txt-Syntax nach RFC 9309, mit Beispielen"
nav: "robots.txt-Syntax"
lead: "Die robots.txt wurde im September 2022 als RFC 9309 zum Internetstandard. Ihre Regeln sind kurz, doch einige davon – längster Treffer, eine Gruppe pro Crawler, Leerzeilen – überraschen fast jeden. Jedes Beispiel unten können Sie in den Tester einfügen."
related: ["tester", "home", "guide-bad-bots", "bots"]
updated: "2026-11-04"
faq:
  - q: "Unterscheidet die robots.txt Groß- und Kleinschreibung?"
    a: "Bei Direktiven (`User-agent`, `Disallow`) und Bot-Namen nicht, bei Pfaden schon. `Disallow: /Private/` blockiert `/private/` nicht."
  - q: "Kann ich reguläre Ausdrücke verwenden?"
    a: "Nein. Sonderbedeutung haben nur `*` (beliebige Zeichenfolge) und `$` am Ende eines Musters (Ende der URL)."
  - q: "Brauche ich eine Allow-Zeile?"
    a: "Nur, um einen Pfad innerhalb eines gesperrten Pfads wieder zu öffnen. Alles, was nicht gesperrt ist, ist erlaubt."
  - q: "Gilt die robots.txt auch für Subdomains?"
    a: "Nein. Jede Kombination aus Schema, Host und Port hat ihre eigene Datei: `https://example.com/robots.txt` gilt nicht für `https://blog.example.com/`."
---

## Die Datei

Die robots.txt ist eine reine Textdatei in UTF-8 im Stammverzeichnis eines Hosts: `https://example.com/robots.txt`. Crawler rufen sie vor dem Crawlen ab. Zeilen haben die Form `key: value`; `#` leitet einen Kommentar ein. Google liest bis zu **500 KiB** und ignoriert den Rest.

## Gruppen

Eine **Gruppe** besteht aus einer oder mehreren `User-agent`-Zeilen, gefolgt von Regeln:

```
User-agent: GPTBot
User-agent: CCBot
Disallow: /

User-agent: *
Disallow: /admin/
```

- Ein Crawler verwendet die Gruppe(n), die ihn **nennen**. Der Abgleich ignoriert Groß- und Kleinschreibung und nutzt nur das Produkt-Token: `User-agent: GPTBot/1.4` wird als `GPTBot` gelesen.
- Nennen mehrere Gruppen denselben Crawler, werden ihre Regeln **zusammengeführt**.
- Nur ein Crawler, den keine Gruppe nennt, verwendet `User-agent: *`.
- Ein Crawler mit eigener Gruppe **ignoriert `*` vollständig**. Im Beispiel darf `GPTBot` gar nichts abrufen – stünde in seiner Gruppe aber nur `Disallow: /blog/`, dürfte er `/admin/` abrufen, weil die `*`-Regel für ihn nicht mehr gilt.

**Leerzeilen beenden keine Gruppe.** Diese Datei gibt `GPTBot` die `*`-Regeln, weil beide User-agent-Zeilen zur selben Gruppe gehören:

```
User-agent: GPTBot

User-agent: *
Disallow: /private/
```

## Regeln: Allow und Disallow

`Disallow: /path` blockiert jede URL, deren Pfad mit `/path` beginnt – also auch `/path.html`, `/path/` und `/pathology`. Ein leeres `Disallow:` erlaubt alles. `Allow` öffnet einen Pfad wieder.

Greifen mehrere Regeln, **gewinnt das längste Muster**; sind ein Allow- und ein Disallow-Muster gleich lang, **gewinnt Allow**. Die Reihenfolge der Zeilen spielt keine Rolle.

```
User-agent: *
Disallow: /shop/
Allow: /shop/catalog/
```

`/shop/cart` ist blockiert; `/shop/catalog/shoes` ist erlaubt (14 Zeichen schlagen 6).

## Platzhalter

- `*` passt auf jede Zeichenfolge: `Disallow: /*.pdf` blockiert jede URL, die `.pdf` enthält.
- `$` am Ende verankert das Ende der URL: `Disallow: /*.pdf$` blockiert `/a.pdf`, aber nicht `/a.pdf?download=1`.
- Ein abschließendes `*` ändert nichts: `/private*` entspricht `/private`.
- Muster werden mit Pfad **und Query** abgeglichen: `Disallow: /*?sort=` blockiert sortierte Listenseiten.

## Weitere Zeilen

- `Sitemap: https://example.com/sitemap.xml` – eine vollständige URL; gilt für alle Crawler, an beliebiger Stelle in der Datei.
- `Crawl-delay` – von Google ignoriert; Bing, Yandex, Anthropic und Common Crawl beachten es.
- `Noindex` in der robots.txt – seit 2019 nicht mehr unterstützt; verwenden Sie ein Robots-Meta-Tag.
- `Content-Signal`, `Content-Usage` – Vorschläge für KI-Präferenzen; siehe [Content Signals](page:content-signals).

## Wenn die Datei fehlt oder fehlerhaft ist

| Antwort auf /robots.txt | Verhalten von Google |
|---|---|
| 200 | Regeln gelten |
| 3xx | Folgt bis zu 5 Weiterleitungen, danach wie 404 behandelt |
| 4xx (außer 429) | Keine Einschränkungen – alles darf gecrawlt werden |
| 5xx, 429 | Crawling pausiert; nach ca. 30 Tagen zwischengespeicherte Kopie oder keine Einschränkungen |
| Nicht erreichbar | Wie 5xx behandelt |

## Fehler, die Google verzeiht – andere vielleicht nicht

Google akzeptiert `Dissallow`, `User agent`, einen fehlenden Doppelpunkt (`Disallow /admin`) und eine Byte-Order-Mark. Andere Crawler möglicherweise nicht – deshalb markiert der [Tester](page:tester) diese Fälle, obwohl Googles Parser sie liest. Er markiert außerdem Regeln vor der ersten `User-agent`-Zeile (von allen ignoriert), vollständige URLs in `Disallow` (greifen nie) und Pfade ohne führenden Schrägstrich.
