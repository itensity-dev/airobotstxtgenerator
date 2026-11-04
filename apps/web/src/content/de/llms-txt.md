---
title: "llms.txt-Generator: llms.txt-Datei kostenlos erstellen"
description: "Kostenloser llms.txt-Generator: llms.txt nach llmstxt.org erstellen – H1, Zusammenfassung, Abschnitte mit Markdown-Links – mit Prüfung, direkt im Browser."
h1: "llms.txt-Generator"
nav: "llms.txt-Generator"
lead: "Erstellen Sie eine `llms.txt`-Datei im Format, das auf llmstxt.org vorgeschlagen wurde – ein Titel, eine Zusammenfassung in einem Absatz und Abschnitte mit Links zu den Seiten, die für Sprachmodelle am nützlichsten sind – und prüfen Sie die Struktur schon beim Tippen."
steps:
  - "Geben Sie den Namen der Website oder des Projekts ein; er wird zur einzigen H1."
  - "Schreiben Sie eine kurze Zusammenfassung – was die Website ist und was die Datei auflistet. Sie wird zum Blockzitat, das Modelle zuerst lesen."
  - "Fügen Sie Abschnitte hinzu (`## Docs`, `## Guides` …) mit Links: Titel, absolute URL und optional eine einzeilige Beschreibung. Verlinken Sie Markdown-Versionen der Seiten, wo Sie welche haben."
  - "Markieren Sie weniger wichtige Abschnitte als **Optional**: Leser mit wenig Kontextplatz dürfen sie überspringen."
  - "Laden Sie die Datei herunter und legen Sie sie als `/llms.txt` im Stammverzeichnis der Website ab. Optional veröffentlichen Sie `/llms-full.txt` mit dem vollständigen Text."
capabilities:
  - feature: "Struktur nach llmstxt.org"
    status: "yes"
    note: "H1, Zusammenfassung als Blockzitat, optionale Hinweise, H2-Abschnitte mit Markdown-Linklisten, ein Abschnitt `Optional`."
  - feature: "Validierung"
    status: "yes"
    note: "Prüft auf eine einzige H1, H2-Abschnitte und absolute oder Root-relative Linkziele."
  - feature: "Website crawlen, um die Liste zu füllen"
    status: "no"
    note: "Sie wählen die Seiten aus; es wird nichts abgerufen."
  - feature: "Wirkung auf Rankings oder KI-Antworten"
    status: "no"
    note: "llms.txt ist ein Vorschlag; keine große Suchmaschine und kein großes KI-Unternehmen hat erklärt, die Datei für Ranking- oder Trainingsentscheidungen zu nutzen."
faq:
  - q: "Was ist llms.txt?"
    a: "Eine Markdown-Datei im Stammverzeichnis einer Website, im September 2024 von Jeremy Howard auf llmstxt.org vorgeschlagen, die Sprachmodellen eine kuratierte Karte der Website gibt: was sie ist und welche Seiten sich zu lesen lohnen. Sie ist weder ein Standard noch eine Datei zur Zugriffskontrolle."
  - q: "Ist llms.txt dasselbe wie robots.txt?"
    a: "Nein. Die robots.txt sagt Crawlern, was sie abrufen dürfen; die llms.txt schlägt vor, was sich zu lesen lohnt. Eine Seite, die in der llms.txt steht, aber in der robots.txt gesperrt ist, bleibt für Crawler, die robots.txt befolgen, gesperrt."
  - q: "Lesen KI-Unternehmen die llms.txt?"
    a: "Manche Tools und KI-Coding-Assistenten lesen sie, wenn ein Nutzer sie auf eine Website verweist; Dokumentationsplattformen erzeugen sie automatisch. Kein großes KI-Unternehmen hat zugesagt, sie für Training oder Suche zu nutzen. Die Veröffentlichung kostet wenig."
  - q: "Sollte ich HTML-Seiten oder Markdown verlinken?"
    a: "Wo möglich Markdown – damit kommen Sprachmodelle am besten zurecht. Diese Website veröffentlicht von jeder Seite eine `.md`-Version und verlinkt sie in ihrer eigenen [llms.txt](/llms.txt)."
related: ["home", "content-signals", "meta-tags", "guide-training-search"]
updated: "2026-11-04"
---

## Was eine gute llms.txt enthält

Halten Sie sie kurz und kuratiert: die 10–40 Seiten, die ein Modell braucht, um Ihr Produkt oder Ihre Inhalte zu verstehen, jeweils mit einer einzeiligen Beschreibung dessen, was der Leser dort findet. Stellen Sie Referenzmaterial an den Anfang, Beispiele an zweite Stelle und Historie, Changelogs oder rechtliche Seiten unter **Optional**. Wenn Sie umfangreiche Dokumentation haben, veröffentlichen Sie zusätzlich `llms-full.txt` – dieselbe Struktur mit dem vollständigen Text der Seiten – und erwähnen Sie das in der Zusammenfassung.

Diese Website folgt ihrem eigenen Rat: Siehe [/llms.txt](/llms.txt) und [/llms-full.txt](/llms-full.txt), und jede Seite hat unter derselben Adresse plus `.md` einen Markdown-Zwilling.
