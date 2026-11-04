---
title: "Über AI Robots.txt Generator: wer dahintersteht und warum"
description: "Kostenlose, unabhängige Tools für die Entscheidung, welche KI-Crawler Ihre Website nutzen dürfen: wer dahintersteht, wie das Verzeichnis gepflegt wird, Kontakt."
h1: "Über dieses Projekt"
nav: "Über uns"
lead: "Kostenlose, unabhängige Tools für eine Entscheidung, vor der heute jeder Website-Betreiber steht: Welche KI-Crawler dürfen Ihre Seiten lesen, zitieren oder daraus lernen?"
related: ["checker-bot", "bots", "privacy", "licenses"]
updated: "2026-11-04"
---

## Was es ist

AI Robots.txt Generator (airobotstxtgenerator.com) umfasst einen Generator, einen Tester, ein Verzeichnis der KI-Crawler mit einer Seite pro Crawler, Serverregeln und Ratgeber. Alles, was in Ihrem Browser laufen kann, läuft dort – Erzeugung, Parsen, Testen eingefügter Dateien – und funktioniert offline, sobald die Seite geladen ist. Die einzige Serverkomponente ruft die öffentliche robots.txt einer Website ab, wenn Sie eine Live-Prüfung anfordern.

Das Projekt gehört zu einem kleinen Netz kostenloser Tools mit jeweils einem Zweck vom selben Anbieter, darunter ibangenerator.io und metasnitch.com. Es gibt kein Konto, keine Bezahlschranke vor den Tools und keine Begrenzung außer einem Rate Limit für Live-Prüfungen, das Missbrauch verhindern soll.

## Wie das Verzeichnis gepflegt wird

Jeder kuratierte Eintrag wird anhand der Dokumentation des Betreibers geprüft und datiert; die Seite sagt Ihnen, wie geprüft wurde. Ein wöchentlicher automatischer Job gleicht unsere Community-Liste mit dem Open-Source-Projekt [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt) ab und eröffnet einen Pull Request mit den Änderungen, die geprüft werden, bevor sie live gehen. Der Parser wird gegen jeden Testfall von Googles Open-Source-Parser für robots.txt getestet und gegen 46 echte robots.txt-Dateien, deren Ergebnisse wir mit Googles kompiliertem Parser verglichen haben. Code und Daten sind offen: siehe [Lizenzen](page:licenses).

## Warum unsere eigene robots.txt jeden KI-Bot erlaubt

Unsere [robots.txt](/robots.txt) nennt GPTBot, ClaudeBot, PerplexityBot, Google-Extended und jeden anderen Agenten im Verzeichnis – und erlaubt sie alle. Das mag seltsam wirken für eine Website, die beim Blockieren von KI-Crawlern hilft, folgt aber demselben Prinzip: **nach Zweck entscheiden**. Diese Website ist dazu da, Fragen zu beantworten; wir wollen, dass KI-Assistenten sie lesen, zitieren und Menschen hierher schicken, und wir haben nichts dagegen, dass unsere Erklärungen in den Trainingsdaten eines Modells landen, wenn das die Antworten verbessert. Ein Verlag mit bezahltem Journalismus oder ein Anbieter eigener Kunst wird das mit gutem Grund anders entscheiden. Das Tool soll beide Entscheidungen einfach und korrekt umsetzbar machen.

Außerdem veröffentlichen wir [/llms.txt](/llms.txt), [/llms-full.txt](/llms-full.txt), eine Markdown-Version jeder Seite (hängen Sie `.md` an die Adresse an) und das gesamte Verzeichnis als [/bots.json](/bots.json).

## Kontakt

Korrekturen am Verzeichnis, Fehlermeldungen und Fragen: **{{contact}}**. Wenn Sie einen Crawler betreiben und unser Eintrag dazu falsch oder veraltet ist, schicken Sie uns bitte einen Link zu Ihrer Dokumentation – wir aktualisieren Einträge innerhalb weniger Tage.

## Fakten

- Online seit: 4. November 2026
- Sprachen: English, Deutsch, Français, Español, Italiano, Nederlands, Polski, Português (Brasil), 日本語
- Werbung: derzeit keine; falls Werbung hinzukommt, erscheint sie nie innerhalb der Tools.
