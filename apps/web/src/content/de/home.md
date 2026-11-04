---
title: "robots.txt-Generator für KI-Crawler: GPTBot & Co. sperren"
description: "Kostenloser robots.txt-Generator: KI-Training sperren (GPTBot, ClaudeBot, Google-Extended), KI-Suche erlauben oder alle KI-Bots blockieren – RFC-9309-konform."
h1: "robots.txt-Generator für KI-Crawler"
nav: "robots.txt-Generator"
lead: "Wählen Sie Website-Typ und Ziel: Der Generator schreibt eine robots.txt für {{all}} dokumentierte KI-Crawler und Tokens, erklärt jede Zeile und prüft das Ergebnis mit einem Parser nach RFC 9309, bevor Sie es kopieren."
steps:
  - "Wählen Sie den **Website-Typ** – er setzt sinnvolle Startpfade (ein Shop sperrt `/cart/` und `/checkout/` für alle Crawler, eine Nachrichtenseite sperrt `/premium/` für KI-Bots)."
  - "Wählen Sie das **Ziel**: kein KI-Training, aber in der KI-Suche bleiben; gar keine KI; alles erlauben; oder Bot für Bot entscheiden."
  - "Fügen Sie **Pfad-Ausnahmen** hinzu, zum Beispiel `/blog/` für alle KI-Bots öffnen oder `/members/` für alle sperren."
  - "Kopieren Sie die Datei oder laden Sie sie herunter und legen Sie sie als `robots.txt` im Stammverzeichnis jedes Hosts ab (`https://example.com/robots.txt`). Sie haben schon eine Datei? Nutzen Sie **Zu meiner robots.txt hinzufügen** – das hängt den KI-Abschnitt an und belegt, dass Ihre bestehenden Regeln weiterhin genauso wirken."
  - "Testen Sie die live geschaltete Datei mit dem [robots.txt-Tester](page:tester) und ergänzen Sie für Crawler, die robots.txt ignorieren, [Serverregeln](page:server-rules)."
capabilities:
  - feature: "Liste der KI-Crawler"
    status: "yes"
    note: "{{all}} Agenten und Tokens mit der Dokumentation des jeweiligen Betreibers und dem Datum der letzten Prüfung; auf Wunsch {{community}} weitere aus der Community-Liste von ai.robots.txt."
  - feature: "Voreinstellungen nach Zweck"
    status: "yes"
    note: "Training, KI-Suche, Abrufe auf Nutzeranfrage und reine robots.txt-Tokens werden getrennt behandelt."
  - feature: "Selbstprüfung"
    status: "yes"
    note: "Jede Datei wird nach denselben Regeln geparst wie mit Googles Open-Source-Parser; jeder Agent wird auf `/`, Ihren Ausnahmepfaden und Ihren gesperrten Pfaden getestet."
  - feature: "In eine bestehende Datei einfügen"
    status: "yes"
    note: "Hängt einen KI-Abschnitt an, zeigt einen Diff und vergleicht alte und neue Entscheidungen für jeden Agenten, der bereits in Ihrer Datei steht."
  - feature: "Content-Signal-Zeilen"
    status: "partly"
    note: "Optional `Content-Signal` für die `*`-Gruppe. Das ist ein Vorschlag von Cloudflare, kein Standard."
  - feature: "Bots stoppen, die robots.txt ignorieren"
    status: "no"
    note: "robots.txt ist eine Bitte. Zur Durchsetzung nutzen Sie [Serverregeln](page:server-rules) oder eine WAF."
  - feature: "Anmeldung, Upload, Tracking Ihrer Eingaben"
    status: "no"
    note: "Die Erzeugung läuft in Ihrem Browser und funktioniert offline; Ihre Pfade und Dateien werden nirgendwohin gesendet."
faq:
  - q: "Wie blockiere ich KI-Training und bleibe trotzdem in der Suche von ChatGPT, Claude und Perplexity sichtbar?"
    a: "Blockieren Sie die Trainings-Crawler und -Tokens – `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `meta-externalagent` und weitere – und lassen Sie die Such-Agenten (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`) erlaubt. Genau das ist das erste Ziel im Generator. Details im Ratgeber [KI-Training blockieren, in der KI-Suche bleiben](page:guide-training-search)."
  - q: "Entfernt das Blockieren von Google-Extended meine Website aus der Google-Suche oder den AI Overviews?"
    a: "Nein. `Google-Extended` ist ein robots.txt-Token, kein Crawler: Es steuert, ob Google Inhalte für das Training und Grounding von Gemini nutzen darf. Die Google-Suche, einschließlich AI Overviews und KI-Modus, nutzt `Googlebot`."
  - q: "Warum wiederholt die erzeugte Datei manche Regeln?"
    a: "Ein Crawler, der in einer eigenen Gruppe genannt wird, ignoriert die Gruppe `User-agent: *` vollständig. Wenn KI-Bots eine eigene Gruppe brauchen (etwa um `/premium/` für sie zu sperren), kopiert der Generator Ihre `*`-Regeln in diese Gruppe, damit nichts verloren geht."
  - q: "Hält sich jedes KI-Unternehmen an diese Datei?"
    a: "Die meisten großen Betreiber erklären, dass ihre Crawler robots.txt befolgen. Abrufdienste, die auf Anfrage eines Nutzers handeln (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`), tun das möglicherweise nicht, und manche Crawler veröffentlichen gar keine Angabe. Das Bot-Verzeichnis zeigt die Aussage jedes Betreibers mit Link zur Quelle."
  - q: "Wohin gehört die robots.txt-Datei?"
    a: "In das Stammverzeichnis jedes Hosts und Protokolls, das Sie abdecken wollen: `https://example.com/robots.txt` gilt nicht für `https://shop.example.com/`. Die Datei muss reiner Text in UTF-8 sein und für Google kleiner als 500 KiB."
  - q: "Werden meine Eingaben gespeichert?"
    a: "Nein. Der Generator läuft vollständig in Ihrem Browser. Wir zählen nur, dass eine Datei erzeugt wurde und welche Voreinstellung genutzt wurde – ohne Ihre Pfade oder Texte."
  - q: "Ist eine robots.txt ein wirksamer KI-Opt-out nach § 44b UrhG und der KI-Verordnung?"
    a: "Für online zugängliche Werke ist ein Nutzungsvorbehalt nach § 44b Abs. 3 UrhG nur wirksam, wenn er in maschinenlesbarer Form erfolgt. Ein `Disallow` für Trainings-Crawler ist die am weitesten anerkannte Form, und der GPAI-Verhaltenskodex zur KI-Verordnung (AI Act) verpflichtet die Unterzeichner, robots.txt nach RFC 9309 zu befolgen. Ob ein Vorbehalt im Einzelfall wirkt, hängt vom Recht und von den Umständen ab. Mehr dazu im Ratgeber [KI-Bots und KI-Verordnung](page:guide-eu-ai-act). Information, keine Rechtsberatung."
related: ["tester", "bots", "server-rules", "guide-training-search", "llms-txt"]
updated: "2026-11-04"
---

## Wie der Generator entscheidet

Jeder Agent im Verzeichnis hat einen **Zweck**, den wir der Dokumentation seines Betreibers entnehmen:

- **KI-Training** – sammelt Seiten, die zum Training von Modellen genutzt werden können (`GPTBot`, `ClaudeBot`, `CCBot`, `MistralAI-Training`).
- **robots.txt-Tokens** – gar keine Crawler, sondern Namen, die steuern, wie von einem allgemeinen Crawler abgerufene Inhalte genutzt werden dürfen (`Google-Extended`, `Applebot-Extended`, `__usage_ai-training`).
- **KI-Suche** – indexiert Seiten, damit ein KI-Produkt sie zitieren und verlinken kann (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`).
- **Abrufe auf Nutzeranfrage** – öffnen eine Seite, weil eine Person einen Assistenten darum gebeten hat (`ChatGPT-User`, `Claude-User`, `Perplexity-User`).
- **Allgemeine Crawler** – `Googlebot`, `Bingbot`, `Applebot` und Abrufdienste für Linkvorschauen blockiert keine Voreinstellung, denn sonst verschwinden Sie aus der normalen Suche oder Linkvorschauen funktionieren nicht mehr.

Das Ziel legt fest, welche Zwecke gesperrt werden. Der Generator schreibt dann eine Gruppe pro Zweck, damit die Datei lesbar bleibt, und ergänzt in jeder Gruppe Ihre Pfad-Ausnahmen.

## Warum die Datei geprüft wird, bevor Sie sie sehen

robots.txt hat einige Regeln, die viele überraschen: Die **längste passende Regel gewinnt**, bei Gleichstand **gewinnt Allow**, ein Crawler mit **eigener Gruppe ignoriert `User-agent: *`**, und **Leerzeilen trennen keine Gruppen**. Nach dem Erstellen parst der Generator die Datei mit demselben Algorithmus wie Googles Open-Source-Parser (wir testen gegen Googles eigene Testfälle und 46 echte robots.txt-Dateien) und prüft für jeden Agenten und jeden relevanten Pfad, ob das Ergebnis der gewählten Richtlinie entspricht. Der Stempel unter der Datei zeigt, wie viele Prüfungen durchgeführt wurden.

## Was robots.txt nicht kann

robots.txt ist eine öffentliche Bitte, definiert in [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html). Seriöse Crawler halten sich daran, andere nicht – und jeder kann einen gefälschten User-Agent senden. Zur Durchsetzung blockieren Sie am Server oder im CDN – die Seite [Serverregeln](page:server-rules) erzeugt Regeln für nginx, Apache, Caddy und Cloudflare aus demselben Verzeichnis – und verifizieren Bots per IP-Adresse oder Reverse DNS.
