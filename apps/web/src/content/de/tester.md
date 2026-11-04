---
title: "robots.txt prüfen – kostenloser Tester für Google & KI-Bots"
description: "Kostenloser robots.txt-Tester: robots.txt abrufen oder einfügen, erlaubte KI-Crawler sehen, URLs für jeden User-Agent testen und Fehler finden – wie bei Google."
h1: "robots.txt-Tester und -Validator"
nav: "robots.txt-Tester"
lead: "Rufen Sie die robots.txt einer beliebigen Website ab oder fügen Sie eine Datei ein, testen Sie eine URL für jeden Crawler, sehen Sie, welche von {{agents}} KI-Agenten die Website crawlen dürfen, und erhalten Sie eine Fehlerliste – mit der genauen Zeile, die jede Antwort entscheidet."
steps:
  - "Geben Sie eine Domain oder eine beliebige URL der Website ein (nur der Host wird verwendet) und klicken Sie auf **robots.txt abrufen** – oder wechseln Sie zu **robots.txt einfügen**, um einen Entwurf zu testen, ohne ihn hochzuladen."
  - "Lesen Sie die Statuszeile: Google wertet eine **4xx**-Antwort als „keine robots.txt“ und eine **5xx**-Antwort als „vorerst nichts crawlen“; Weiterleitungen, Größe und Content-Type werden ebenfalls geprüft."
  - "Geben Sie einen Pfad oder eine vollständige URL ein und wählen Sie einen Crawler: Das Ergebnis nennt die **entscheidende Zeile** und die geltende Gruppe und hebt beide in der Datei hervor."
  - "Gehen Sie die Tabelle der KI-Crawler durch: Startseite und Ihr Pfad, jeweils **Erlaubt**, **Blockiert** oder **Teilweise**, und ob der Crawler eine eigene Gruppe hat."
  - "Beheben Sie, was der **Prüfbericht** meldet, und testen Sie erneut. Sie brauchen eine neue Datei? Öffnen Sie den [Generator](page:home)."
capabilities:
  - feature: "Dieselben Ergebnisse wie Googles Parser"
    status: "yes"
    note: "Übernimmt jeden Testfall von Googles Open-Source-Parser für robots.txt und stimmt bei 46 echten robots.txt-Dateien großer Websites mit dessen Ergebnissen überein."
  - feature: "Live-Abruf jeder Website"
    status: "yes"
    note: "Über unseren Prüfdienst: nur öffentliche http/https-Hosts, Standardports, bis zu 5 Weiterleitungen, 5 Sekunden, 512 KiB. Ergebnisse werden 10 Minuten zwischengespeichert."
  - feature: "Einfügen und offline testen"
    status: "yes"
    note: "Eingefügter Text wird in Ihrem Browser analysiert und nie hochgeladen."
  - feature: "Linting"
    status: "yes"
    note: "Über 35 Prüfungen: Syntax, von Google tolerierte Tippfehler, Gruppen, die `*`-Regeln stillschweigend aushebeln, Fallstricke mit Leerzeilen, vollständige URLs in Regeln, 500-KiB-Grenze, Syntax von Content-Signal und Content-Usage, von Cloudflare verwaltete Blöcke."
  - feature: "Seiten hinter Login oder Firewall"
    status: "no"
    note: "Wir rufen nur `/robots.txt` aus dem öffentlichen Internet ab, wie ein Crawler. Eine WAF oder ein CDN kann Crawler trotzdem blockieren, die robots.txt erlaubt – prüfen Sie Ihre CDN-Einstellungen."
  - feature: "Robots-Meta-Tags und X-Robots-Tag"
    status: "no"
    note: "Regeln auf Seitenebene werden hier nicht geprüft; siehe [KI-Meta-Tags](page:meta-tags)."
faq:
  - q: "Wo ist der robots.txt-Tester von Google geblieben?"
    a: "Google hat den robots.txt-Tester in der Search Console Ende 2023 eingestellt und durch einen robots.txt-Bericht ersetzt, der die abgerufene Datei und Fehler zeigt, aber keine URL für einen User-Agent testen kann. Diese Seite schließt die Lücke und nutzt dieselben Abgleichregeln wie Googles Open-Source-Parser."
  - q: "Warum ist eine URL erlaubt, obwohl `User-agent: *` sie sperrt?"
    a: "Weil der gewählte Crawler eine eigene Gruppe hat. Ein Crawler befolgt nur die spezifischste Gruppe, die ihn nennt, daher gelten die Regeln unter `User-agent: *` für ihn nicht mehr. Der Prüfbericht markiert jeden Agenten, für den dadurch eine `*`-Regel wegfällt."
  - q: "Was passiert, wenn die robots.txt 404, 403 oder 500 zurückgibt?"
    a: "Google behandelt 4xx-Antworten (außer 429) so, als gäbe es keine robots.txt – alles darf gecrawlt werden. 5xx und 429 bedeuten „vorerst nicht crawlen“; Google versucht es erneut und nutzt nach etwa 30 Tagen eventuell eine zwischengespeicherte Kopie oder behandelt die Website als uneingeschränkt."
  - q: "Spielt die Reihenfolge von Allow- und Disallow-Zeilen eine Rolle?"
    a: "Nein. Das längste passende Muster gewinnt, unabhängig von der Reihenfolge; sind ein Allow- und ein Disallow-Muster gleich lang, gewinnt Allow. `*` passt auf beliebige Zeichen, `$` verankert das Ende der URL."
  - q: "Werden meine robots.txt oder die geprüfte Domain gespeichert?"
    a: "Eingefügter Text verlässt Ihren Browser nie. Bei Live-Prüfungen ruft unser Server die Datei ab und hält sie bis zu 10 Minuten im Arbeitsspeicher, damit wiederholte Prüfungen schnell sind; Domains werden weder in Logs noch in Statistiken geschrieben."
  - q: "Welchen User-Agent sendet der Prüfdienst?"
    a: "`Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)`. Er ruft nur `/robots.txt` ab, einmal pro Prüfung. Siehe [unseren Checker-Bot](page:checker-bot)."
related: ["home", "bots", "server-rules", "guide-syntax", "guide-bad-bots"]
updated: "2026-11-04"
---

## Wie ein Crawler die robots.txt liest

Der Tester wendet die Regeln aus [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) genau so an wie Googles Open-Source-Parser:

1. **Gruppe finden.** Eine Gruppe besteht aus einer oder mehreren `User-agent`-Zeilen, gefolgt von Regeln. Der Crawler verwendet jede Gruppe, die sein Produkt-Token nennt (ohne Beachtung der Groß- und Kleinschreibung, Versionsnummern werden ignoriert), und führt sie zusammen. Nur wenn ihn keine Gruppe nennt, verwendet er `User-agent: *`. Leerzeilen beenden keine Gruppe.
2. **Passende Regeln finden.** Jedes `Allow`- und `Disallow`-Muster wird mit Pfad und Query der URL verglichen. Muster greifen ab dem Anfang des Pfads; `*` steht für beliebige Zeichen, ein abschließendes `$` für das Ende der URL. Der Abgleich unterscheidet Groß- und Kleinschreibung.
3. **Längsten Treffer wählen.** Die Regel mit dem längsten Muster gewinnt. Sind ein `Allow` und ein `Disallow` gleich lang, gewinnt `Allow`. Greift keine Regel, ist die URL erlaubt.

Google toleriert außerdem häufige Fehler – `Dissallow`, `User agent`, einen fehlenden Doppelpunkt – und ignoriert alles nach 500 KiB. Der Tester bildet das nach und meldet jeden Fall, damit auch andere, möglicherweise strengere Crawler Ihre Datei genauso lesen.

## Wie Live-Prüfungen funktionieren

Unser Server fragt `https://your-host/robots.txt` an (mit Rückfall auf `http://`, wenn HTTPS keine Verbindung herstellt), folgt bis zu fünf Weiterleitungen, bricht nach 5 Sekunden oder 512 KiB ab und gibt die Rohdaten zurück, damit Byte-Order-Marks und Kodierungen geprüft werden können. Vor jeder Verbindung löst er den Hostnamen selbst auf und verweigert private, lokale und reservierte Adressen. Alles andere – Parsen, Abgleich, Linting – geschieht in Ihrem Browser.
