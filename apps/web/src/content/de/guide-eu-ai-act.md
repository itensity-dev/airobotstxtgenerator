---
title: "KI-Opt-out nach § 44b UrhG: Nutzungsvorbehalt richtig setzen"
description: "robots.txt als KI-Opt-out: was KI-Verordnung und § 44b UrhG verlangen, was „maschinenlesbar“ heißt und was Sie veröffentlichen sollten. Keine Rechtsberatung."
h1: "KI-Bots, KI-Verordnung und § 44b UrhG: Was ein Opt-out bedeutet"
nav: "KI-Bots und KI-Verordnung"
lead: "Das EU-Recht erlaubt jedem, öffentlich zugängliche Inhalte für beliebige Zwecke per Text und Data Mining auszuwerten – es sei denn, der Rechtsinhaber hat sich dieses Recht maschinenlesbar vorbehalten. Seit August 2025 müssen Anbieter von KI-Modellen zeigen, dass sie solche Vorbehalte beachten – und der Verhaltenskodex nennt die robots.txt."
related: ["tdmrep", "content-signals", "home", "guide-training-search"]
updated: "2026-11-04"
faq:
  - q: "Ist ein Disallow in der robots.txt ein rechtlich wirksamer Vorbehalt?"
    a: "Der Verhaltenskodex behandelt robots.txt nach RFC 9309 als Protokoll, das die Unterzeichner befolgen müssen, und Gerichte haben sich mit maschinenlesbaren Vorbehalten befasst; die rechtliche Wirkung hängt aber vom nationalen Recht und den Umständen des Einzelfalls ab. Das ist eine Information, keine Rechtsberatung."
  - q: "Gilt die KI-Verordnung auch für KI-Unternehmen außerhalb der EU?"
    a: "Die Pflichten gelten für Anbieter, die KI-Modelle mit allgemeinem Verwendungszweck auf dem EU-Markt in Verkehr bringen, unabhängig von ihrem Sitz. Ihre Urheberrechtsstrategie muss die Vorbehalte von Rechtsinhabern in der EU abdecken."
  - q: "Was sollte ich veröffentlichen?"
    a: "Eine robots.txt, die die KI-Trainings-Crawler sperrt, mit denen Sie nicht einverstanden sind, optional eine TDMRep-Datei und eine Erklärung in Ihren Nutzungsbedingungen. Bewahren Sie datierte Kopien Ihrer robots.txt auf, damit Sie belegen können, seit wann der Vorbehalt bestand."
---

*Diese Seite ist eine Information, keine Rechtsberatung.*

## Zwei Gesetze, ein Mechanismus

**Die DSM-Richtlinie (EU) 2019/790, Artikel 4**, erlaubt Text und Data Mining an rechtmäßig zugänglichen Werken – die Rechtsgrundlage, auf die sich ein großer Teil des KI-Trainings in der EU stützt –, sofern der Rechtsinhaber diese Nutzung nicht **ausdrücklich vorbehalten** hat. Für online öffentlich zugängliche Inhalte muss der Vorbehalt „in angemessener Weise, beispielsweise mit maschinenlesbaren Mitteln“ erfolgen. Jeder Mitgliedstaat hat diese Regel in sein Urheberrecht übernommen.

**Die KI-Verordnung (AI Act), Artikel 53 Abs. 1 Buchst. c**, verpflichtet Anbieter von KI-Modellen mit allgemeinem Verwendungszweck, eine Strategie zur Einhaltung des EU-Urheberrechts einzuführen und insbesondere Rechtsvorbehalte nach Artikel 4 Abs. 3 der DSM-Richtlinie zu ermitteln und einzuhalten, „auch durch modernste Technologien“. Die Pflichten gelten ab dem **2. August 2025**; das KI-Büro (AI Office) kann sie ab dem **2. August 2026** mit Geldbußen durchsetzen.

## Deutschland: § 44b UrhG und der Nutzungsvorbehalt

Deutschland hat Artikel 4 der DSM-Richtlinie in **§ 44b UrhG** (Text und Data Mining) umgesetzt; Text und Data Mining für die wissenschaftliche Forschung (Artikel 3 der Richtlinie) regelt gesondert § 60d UrhG. Nach § 44b Abs. 3 UrhG ist die Nutzung nur zulässig, wenn der Rechtsinhaber sie sich nicht vorbehalten hat, und für Inhalte im Netz gilt: „Ein Nutzungsvorbehalt bei online zugänglichen Werken ist nur dann wirksam, wenn er in **maschinenlesbarer Form** erfolgt.“

Im Verfahren Kneschke gegen LAION hat das LG Hamburg die Klage eines Fotografen abgewiesen (Urteil vom 27. September 2024, 310 O 227/23, gestützt auf § 60d UrhG); in der Berufung sah das OLG Hamburg (Urteil vom 10. Dezember 2025, 5 U 104/24) den Nutzungsvorbehalt der Bildagentur nicht in der erforderlichen maschinenlesbaren Form – Kommentatoren lesen das so, dass robots.txt oder Metadaten der praktikable Weg sind.

Für die Praxis heißt das: Erklären Sie den Nutzungsvorbehalt maschinenlesbar – mit `Disallow`-Regeln für Trainings-Crawler in der robots.txt, optional ergänzt um TDMRep –, statt sich allein auf einen Satz in den Nutzungsbedingungen zu verlassen.

## Was der Verhaltenskodex sagt

Der Verhaltenskodex für KI-Modelle mit allgemeinem Verwendungszweck (GPAI Code of Practice, Kapitel Urheberrecht, Juli 2025) ist der Weg, auf dem die meisten großen Anbieter die Einhaltung nachweisen. Die Unterzeichner verpflichten sich unter anderem,

1. Crawler einzusetzen, die **robots.txt gemäß RFC 9309** und späteren Versionen des Standards **lesen und befolgen**;
2. **andere geeignete maschinenlesbare Protokolle** zum Rechtsvorbehalt zu ermitteln und einzuhalten – solche, die von Normungsgremien verabschiedet wurden oder unter Rechtsinhabern weit verbreitet sind;
3. Informationen über ihre Crawler und deren robots.txt-Funktionen zu veröffentlichen.

Die Kommission hat dazu konsultiert, welche weiteren Protokolle zählen; bei Redaktionsschluss war keine offizielle Liste veröffentlicht.

## Was das in der Praxis bedeutet

- Ein `Disallow` für den Trainings-Crawler eines Anbieters (zum Beispiel `GPTBot`, `ClaudeBot`, `MistralAI-Training`, `CCBot`) ist der am weitesten anerkannte maschinenlesbare Vorbehalt.
- Ein Token wie `Google-Extended` oder `Applebot-Extended` drückt den Vorbehalt aus, ohne Sie aus der Suche zu entfernen.
- **robots.txt behält Rechte nur gegenüber den Crawlern vor, die Sie nennen.** Ein Trainings-Crawler, den Sie nicht kennen, ist nicht erfasst. Gemeinsame Gruppen wie `__usage_ai-training` und nutzungsbezogene Zeilen wie `Content-Usage: train-ai=n` sollen diese Lücke schließen; [TDMRep](page:tdmrep) ist ein Protokoll, das eigens für Vorbehalte nach Artikel 4 entwickelt wurde.
- Erklärungen in natürlicher Sprache in Nutzungsbedingungen reichen für online veröffentlichte Inhalte möglicherweise nicht aus; Gerichte haben auf eine maschinenlesbare Form geachtet.

## Ein belastbares Setup

1. Eine robots.txt, die Ihre Trainings-Crawler blockiert – nutzen Sie den [Generator](page:home).
2. Optional eine `tdmrep.json` und eine `Content-Usage`-Zeile.
3. Ein Satz in Ihren Nutzungsbedingungen, der Text und Data Mining nach Artikel 4 Abs. 3 DSM-Richtlinie (in Deutschland § 44b Abs. 3 UrhG) vorbehält.
4. Ein Archiv Ihrer robots.txt mit Datum (zum Beispiel eine Kopie in der Versionsverwaltung).
