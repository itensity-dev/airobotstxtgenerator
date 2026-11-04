---
title: "Content-Signal & Content-Usage: Generator für robots.txt"
description: "Content-Signal (Cloudflare: search, ai-input, ai-train) und Content-Usage (IETF aipref) für robots.txt und HTTP-Header erstellen – mit Stand der Unterstützung."
h1: "Generator für Content-Signal und Content-Usage"
nav: "Content Signals"
lead: "Legen Sie fest, wie Ihre Inhalte nach dem Abruf genutzt werden dürfen – für die Suche, als Grundlage für KI-Antworten oder für das Training – in den beiden bisher vorgeschlagenen Syntaxen: Cloudflares `Content-Signal` und `Content-Usage` aus dem IETF-Entwurf aipref."
steps:
  - "Wählen Sie für jede Nutzung eine Präferenz: `search`, `ai-input` (Antworten, die aus Ihren Seiten erstellt werden) und `ai-train`. Lassen Sie eine Nutzung ungesetzt, um keine Präferenz auszudrücken."
  - "Kopieren Sie den robots.txt-Block. Content-Signal-Zeilen gehören in eine `User-agent`-Gruppe – meist `User-agent: *`."
  - "Kopieren Sie optional die `Content-Usage`-Zeile oder den HTTP-Header aus dem IETF-Entwurf."
  - "Denken Sie daran, dass diese Zeilen Präferenzen ausdrücken; blockieren Sie Crawler mit `Disallow`-Regeln, wenn sie wegbleiben sollen."
capabilities:
  - feature: "Syntax der Cloudflare Content Signals"
    status: "yes"
    note: "`Content-Signal: search=yes, ai-input=yes, ai-train=no`, in einer Gruppe platziert, mit dem erläuternden Kommentar, den Cloudflare empfiehlt."
  - feature: "Syntax von IETF aipref"
    status: "yes"
    note: "`Content-Usage: train-ai=n` (robots.txt-Regel mit optionalem Pfad) und der HTTP-Header `Content-Usage` nach draft-ietf-aipref-attach."
  - feature: "Garantierte Wirkung"
    status: "no"
    note: "Keine der beiden Syntaxen ist ein Standard. Google hat erklärt, dass Content-Signal keine Wirkung auf seine Crawler hat; OpenAI, Anthropic und Perplexity erwähnen es in ihrer Dokumentation nicht."
faq:
  - q: "Was ist Content-Signal?"
    a: "Eine Erweiterung der robots.txt, die Cloudflare im September 2025 als Content Signals Policy veröffentlicht hat. Sie nennt drei Nutzungen – `search`, `ai-input` und `ai-train` –, jeweils auf `yes` oder `no` gesetzt. Cloudflare fügt `search=yes, ai-train=no` in die verwaltete robots.txt von Millionen Domains ein."
  - q: "Was ist Content-Usage?"
    a: "Die Syntax, die die IETF-Arbeitsgruppe AI Preferences (aipref) entwickelt: ein Vokabular mit den Kategorien `train-ai`, `ai-use` und `search` und den Werten `y` oder `n`, angehängt über eine robots.txt-Regel oder einen HTTP-Header. Die Entwürfe sind noch in Arbeit; einen RFC gibt es noch nicht."
  - q: "Sollte ich beides verwenden?"
    a: "Sie widersprechen sich nicht, und keines von beiden wird bisher breit beachtet. Wenn Sie Cloudflare nutzen, steht Content-Signal bereits in Ihrer verwalteten robots.txt. Content-Usage kostet eine Zeile und folgt dem Weg, der am ehesten zum Standard wird."
  - q: "Und was ist mit `__usage_ai-training`?"
    a: "Das ist ein eigener Vorschlag vom Oktober 2026: eine robots.txt-Gruppe (`User-agent: __usage_ai-training` mit `Disallow: /`), die mehrere KI-Unternehmen nach eigener Aussage als Trainings-Opt-out behandeln werden. Anders als Content-Signal nutzt sie gewöhnliche Allow- und Disallow-Regeln. Siehe den [Verzeichniseintrag](bot:usage-ai-training)."
related: ["home", "tdmrep", "meta-tags", "guide-eu-ai-act", "bots"]
updated: "2026-11-04"
---

## Drei Generationen von KI-Präferenzen in der robots.txt

1. **Crawler-Namen** (seit 2023): `GPTBot`, `ClaudeBot`, `Google-Extended` … blockieren, ein Unternehmen nach dem anderen. Zuverlässig bei allen, die robots.txt befolgen, aber Sie müssen jeden Namen kennen.
2. **Nutzungsbasierte Signale** (seit 2025): `Content-Signal` und `Content-Usage` beschreiben Nutzungen statt Crawler. Sie hängen an einer Gruppe und sagen, was mit Inhalten geschehen darf, die ohnehin abgerufen werden – etwa von einem allgemeinen Such-Crawler.
3. **Gemeinsame Opt-out-Gruppe** (seit 2026): `__usage_ai-training` wird wie ein Crawler angesprochen, aber von mehreren Unternehmen zugleich verstanden.

Bis eines davon zum Standard wird, nutzt die sicherste Datei alle drei: Herstellernamen für die Crawler, die Sie kennen, eine gemeinsame Gruppe für die Unternehmen, die sie unterstützen, und eine nutzungsbasierte Zeile für den Rest. Der [Generator](page:home) erledigt die ersten beiden; diese Seite ergänzt die dritte.
