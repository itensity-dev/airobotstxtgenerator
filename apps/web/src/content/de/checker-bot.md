---
title: "AIRobotsTxtChecker: der Bot hinter unserem robots.txt-Tester"
description: "Informationen zu AIRobotsTxtChecker, dem User-Agent unseres robots.txt-Testers: was er abruft (nur /robots.txt), wie oft, von wo aus und wie Sie ihn blockieren."
h1: "Unser Checker-Bot: AIRobotsTxtChecker"
nav: "Checker-Bot"
lead: "Wenn jemand die Live-Prüfung in unserem robots.txt-Tester nutzt, ruft unser Server die /robots.txt der betreffenden Website einmal mit diesem User-Agent ab. Er ruft nie etwas anderes ab."
related: ["tester", "privacy", "about"]
updated: "2026-11-04"
---

## User-Agent

```
Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)
```

## Was er tut

- Ruft **nur** `/robots.txt` des Hosts ab, den ein Nutzer eingegeben hat – nie Seiten, Bilder oder Sitemaps.
- Eine Anfrage pro Prüfung; Ergebnisse werden 10 Minuten zwischengespeichert, sodass wiederholte Prüfungen desselben Hosts in dieser Zeit keine neue Anfrage auslösen.
- Folgt höchstens 5 Weiterleitungen, wartet höchstens 5 Sekunden und liest höchstens 512 KiB.
- Verbindet sich nur mit öffentlichen IP-Adressen auf den Ports 80 und 443.
- Ist kein Crawler: Er folgt keinen Links, speichert Ihre Datei nicht über den Cache hinaus und verwendet sie für nichts anderes.

## Befolgt er die robots.txt?

Er liest die robots.txt; er crawlt nichts, was die robots.txt regeln könnte. Wie der robots.txt-Abruf von Google wendet er Ihre robots.txt nicht auf die robots.txt-Datei selbst an.

## So blockieren Sie ihn

Wenn Sie nicht möchten, dass Ihre robots.txt über unsere Website geprüft wird, antworten Sie dem User-Agent `AIRobotsTxtChecker` mit `403`, zum Beispiel in nginx:

```nginx
if ($http_user_agent ~* "AIRobotsTxtChecker") { return 403; }
```

Fragen oder Hinweise auf Missbrauch: {{contact}}.
