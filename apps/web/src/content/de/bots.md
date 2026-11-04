---
title: "KI-Crawler-Liste: User-Agents aller KI-Bots im Überblick"
description: "Verzeichnis von {{all}} KI-Crawlern und robots.txt-Tokens (GPTBot, ClaudeBot, Google-Extended u. a.) mit Betreiber, Zweck, robots.txt-Verhalten und IP-Listen."
h1: "Verzeichnis der KI-Crawler"
nav: "Bot-Verzeichnis"
lead: "Jeder KI-Crawler, jeder KI-Agent und jedes robots.txt-Steuer-Token, das wir dokumentieren konnten: wer es betreibt, was es sammelt, ob der Betreiber erklärt, robots.txt zu befolgen, und wie Sie es verifizieren – mit Link zur Quelle und dem Datum unserer letzten Prüfung."
steps:
  - "Durchsuchen Sie das Verzeichnis nach Name oder Unternehmen oder gehen Sie es nach Betreiber durch."
  - "Öffnen Sie die Seite eines Agenten für User-Agent, robots.txt-Token, IP-Liste und Regeln zum Kopieren."
  - "Entscheiden Sie anhand der Spalte „Zweck“: Trainings-Crawler lassen sich meist ohne Sichtbarkeitsverlust blockieren; KI-Suche und Abrufe auf Nutzeranfrage bringen Zitate und Besucher."
  - "Erstellen Sie eine vollständige Datei mit dem [Generator](page:home) oder testen Sie Ihre aktuelle mit dem [Tester](page:tester)."
capabilities:
  - feature: "Quelle für jeden Eintrag"
    status: "yes"
    note: "Jeder kuratierte Eintrag verlinkt die Dokumentation des Betreibers; wo es keine gibt, steht das auf der Seite."
  - feature: "Datum der letzten Prüfung"
    status: "yes"
    note: "Pro Agent angegeben, mit der Art der Prüfung (Seite aufgerufen oder über einen Suchindex gelesen)."
  - feature: "Maschinenlesbar"
    status: "yes"
    note: "Das gesamte Verzeichnis steht als [/bots.json](/bots.json) unter CC BY 4.0 bereit."
  - feature: "Wöchentliche Aktualisierung"
    status: "yes"
    note: "Ein wöchentlicher Job gleicht die Community-Liste mit ai.robots.txt ab und eröffnet einen Pull Request; kuratierte Einträge werden von Hand geprüft."
  - feature: "Nachweis, dass eine Anfrage echt ist"
    status: "partly"
    note: "Nur wo der Betreiber IP-Bereiche, Reverse-DNS-Hostnamen oder Signaturen veröffentlicht. Einen User-Agent-String kann jeder fälschen."
faq:
  - q: "Welche KI-Crawler sollte ich blockieren?"
    a: "Das hängt von Ihrem Ziel ab. Um Inhalte aus dem KI-Training herauszuhalten, aber in KI-Antworten sichtbar zu bleiben, blockieren Sie die Trainings-Crawler und -Tokens (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent, Bytespider, MistralAI-Training) und erlauben die Such-Agenten (OAI-SearchBot, Claude-SearchBot, PerplexityBot). Der [Ratgeber](page:guide-training-search) erklärt die Abwägungen."
  - q: "Was ist der Unterschied zwischen einem Crawler und einem robots.txt-Token?"
    a: "Ein Crawler sendet Anfragen mit eigenem User-Agent. Ein Token wie Google-Extended oder Applebot-Extended besucht Ihre Website nie; es ist ein Name in der robots.txt, der dem Betreiber sagt, wie Inhalte genutzt werden dürfen, die sein regulärer Crawler abruft. Tokens lassen sich nur in der robots.txt steuern, nicht mit Serverregeln."
  - q: "Warum ignorieren manche Agenten die robots.txt?"
    a: "Abrufdienste, die auf Anfrage einer Person handeln – ChatGPT-User, Perplexity-User, Google-Agent, meta-externalfetcher –, behandeln ihre Betreiber wie einen Browser; sie befolgen robots.txt möglicherweise nicht. Manche Crawler veröffentlichen gar keine Richtlinie. Blockieren Sie diese am Server oder im CDN."
  - q: "Wie aktuell ist die Liste?"
    a: "Kuratierte Einträge wurden am {{updated}} anhand der Dokumentation der Betreiber geprüft; jede Seite zeigt ihr eigenes Datum. Die Community-Liste wird jede Woche mit ai.robots.txt synchronisiert."
  - q: "Darf ich die Daten verwenden?"
    a: "Ja. Das Verzeichnis ist als JSON unter /bots.json veröffentlicht, Lizenz: CC BY 4.0 – bitte nennen Sie airobotstxtgenerator.com als Quelle. Community-Einträge stammen aus dem Projekt ai.robots.txt unter der MIT-Lizenz."
related: ["home", "tester", "server-rules", "guide-training-search"]
updated: "2026-11-04"
---

## Wie das Verzeichnis entsteht

Jeder kuratierte Eintrag beginnt mit der Dokumentation des Betreibers: OpenAI, Anthropic, Google, Apple, Perplexity, Meta, Amazon, Mistral, DuckDuckGo, Microsoft, Common Crawl und andere veröffentlichen Seiten, die ihre Crawler beschreiben. Daraus übernehmen wir das robots.txt-Token, einen dokumentierten User-Agent-String, den Zweck, die Aussage des Betreibers zur robots.txt, veröffentlichte IP-Listen oder Hostnamen und das Datum unserer Prüfung. Veröffentlicht ein Betreiber nichts – etwa ByteDance zu Bytespider –, wird der Eintrag als auf unabhängigen Beobachtungen beruhend gekennzeichnet.

Die **Zwecke** folgen den Kategorien, die Betreiber und Cloudflare inzwischen verwenden: *KI-Training*, *KI-Suche* (indexieren und zitieren), *Abrufe auf Nutzeranfrage* (ein Assistent öffnet eine Seite für eine Person) und *robots.txt-Tokens*. Allgemeine Crawler wie Googlebot, Bingbot und Applebot sind zur Orientierung aufgeführt, weil viele KI-Funktionen auf ihnen beruhen.

Die **Community-Liste** unter der Haupttabelle stammt aus dem offenen Projekt [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt). Sie ist umfangreicher, aber nicht einzeln geprüft; manchen ihrer Namen widersprechen die Betreiber selbst (Cohere sagt, es betreibe keinen Crawler, Brave hat keinen eigenen User-Agent, der Crawler von Exa heißt ExaSearchBot).
