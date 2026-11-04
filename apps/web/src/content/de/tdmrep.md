---
title: "TDMRep-Generator: tdmrep.json & tdm-reservation-Header"
description: "TDMRep erstellen: /.well-known/tdmrep.json, Header tdm-reservation und tdm-policy, HTML-Meta-Tags – Nutzungsvorbehalt nach § 44b UrhG / Art. 4 DSM-Richtlinie."
h1: "TDMRep-Generator"
nav: "TDMRep"
lead: "Erstellen Sie die Dateien des TDM Reservation Protocol (TDMRep) – einer Spezifikation einer W3C Community Group, mit der Sie maschinenlesbar erklären, dass Sie sich die Rechte für Text und Data Mining nach EU-Urheberrecht vorbehalten."
steps:
  - "Wählen Sie `tdm-reservation: 1`, um sich Ihre Rechte vorzubehalten, oder `0`, um zu erklären, dass Sie das nicht tun."
  - "Ergänzen Sie optional die URL einer `tdm-policy`: ein maschinenlesbares Dokument, das erklärt, wie man eine Lizenz erhält."
  - "Veröffentlichen Sie `/.well-known/tdmrep.json` im Stammverzeichnis Ihrer Website und/oder ergänzen Sie die HTTP-Header oder HTML-Meta-Tags."
  - "Behalten Sie robots.txt-Regeln für die Crawler bei, die Sie stoppen wollen: TDMRep behält Rechte vor, blockiert aber nichts."
capabilities:
  - feature: "Datei für die ganze Website"
    status: "yes"
    note: "`/.well-known/tdmrep.json` mit `location`, `tdm-reservation` und `tdm-policy`."
  - feature: "Header und Meta-Tags pro Antwort"
    status: "yes"
    note: "`tdm-reservation` und `tdm-policy` als HTTP-Header (Snippets für nginx und Apache) und als HTML-`<meta>`-Tags."
  - feature: "Rechtsberatung"
    status: "no"
    note: "Ob ein Vorbehalt wirksam ist, hängt vom nationalen Recht und den Umständen ab. Diese Seite ist eine Information, keine Rechtsberatung."
faq:
  - q: "Was ist TDMRep?"
    a: "Das TDM Reservation Protocol, veröffentlicht von einer W3C Community Group (Final Report 2024). Es legt fest, wie ein Rechtsinhaber – in einer Datei, einem HTTP-Header oder in HTML – erklären kann, dass Text und Data Mining seiner Inhalte vorbehalten ist, wie es Artikel 4 Abs. 3 der EU-DSM-Richtlinie (2019/790) erlaubt."
  - q: "Brauche ich TDMRep, wenn ich KI-Crawler schon in der robots.txt blockiere?"
    a: "Die robots.txt sagt, wer abrufen darf; TDMRep sagt, was mit Inhalten geschehen darf – egal, wer sie abgerufen hat. Der GPAI-Verhaltenskodex der EU verpflichtet die Unterzeichner, robots.txt und andere geeignete maschinenlesbare Protokolle zu befolgen; beides zu veröffentlichen ist doppelt abgesichert."
  - q: "Welche KI-Unternehmen lesen TDMRep?"
    a: "Die Unterstützung ist begrenzt und selten dokumentiert. Europäische Verlage und einige Datenanbieter nutzen es; die meisten großen KI-Entwickler dokumentieren nur robots.txt. Betrachten Sie es als zusätzliche, standardisierte Erklärung Ihres Vorbehalts."
related: ["content-signals", "guide-eu-ai-act", "meta-tags", "home"]
updated: "2026-11-04"
---

## Wo TDMRep hingehört

Die DSM-Richtlinie der EU erlaubt Text und Data Mining an rechtmäßig zugänglichen Inhalten, sofern der Rechtsinhaber es nicht **ausdrücklich vorbehalten** hat – bei online veröffentlichten Inhalten „in angemessener Weise, beispielsweise mit maschinenlesbaren Mitteln“. Die robots.txt ist ein solches Mittel; TDMRep ist ein weiteres, eigens für diesen Zweck entwickelt. Eine `tdmrep.json`-Datei kann die ganze Website oder Teile davon abdecken (`location`-Muster), Header können jeden Dateityp abdecken, auch PDFs und Bilder, und Meta-Tags funktionieren dort, wo Sie nur das HTML kontrollieren.
