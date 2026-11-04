---
title: "Warum robots.txt nicht vor bösartigen Bots schützt"
description: "robots.txt ist keine Zugriffskontrolle: welche Bots sie ignorieren, warum User-Agents fälschbar sind und was stattdessen hilft – Serverregeln, IP-Prüfung, WAF."
h1: "Warum robots.txt nicht vor bösartigen Bots schützt"
nav: "robots.txt vs. Bad Bots"
lead: "Die robots.txt ist ein Schild an der Tür, kein Schloss. Sie wirkt, weil verantwortungsvolle Crawler sie freiwillig lesen; Scraper, denen das egal ist oder die sich als jemand anderes ausgeben, hält sie nicht auf."
related: ["server-rules", "tester", "bots", "guide-syntax"]
updated: "2026-11-04"
faq:
  - q: "Kann die robots.txt eine Seite privat machen?"
    a: "Nein. Jeder kann eine gesperrte URL öffnen, und wer sie in der robots.txt aufführt, macht sie erst bekannt. Schützen Sie private Inhalte mit einer Authentifizierung."
  - q: "Woran erkenne ich, ob ein Bot meine robots.txt ignoriert?"
    a: "Suchen Sie in Ihren Server-Logs nach Anfragen auf gesperrte Pfade mit dem User-Agent dieses Bots und prüfen Sie die IP-Adresse: Eine Anfrage von außerhalb der veröffentlichten Bereiche des Betreibers stammt nicht vom echten Bot."
  - q: "Sollte ich einfach alles blockieren, was nach Bot aussieht?"
    a: "Nein – damit verlieren Sie Suchmaschinen, Linkvorschauen, Uptime-Monitore und Barrierefreiheits-Tools. Blockieren Sie nach Namen, wo es geht, verifizieren Sie, wo Betreiber es ermöglichen, und begrenzen Sie für den Rest die Anfragerate."
---

## Was die robots.txt ist

RFC 9309 sagt es deutlich: Die Regeln sind „keine Form der Zugriffsautorisierung“. Ein Crawler ruft `/robots.txt` ab, liest die Gruppe, die ihn nennt, und entscheidet sich, sie zu befolgen. Nichts in HTTP erzwingt diese Entscheidung.

## Wer sie ignoriert

- **Scraper und Datensammler**, die nie um Erlaubnis gefragt haben. Viele verwenden gewöhnliche Browser-User-Agents.
- **Abrufdienste, die für einen Nutzer handeln.** OpenAI, Perplexity, Google und Meta sagen, dass ihre von Nutzern ausgelösten Abrufdienste (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`, `meta-externalfetcher`) robots.txt möglicherweise nicht befolgen, weil eine Person die Seite angefordert hat. Anthropic sagt, dass sein `Claude-User` sie befolgt.
- **Crawler ohne veröffentlichte Richtlinie** – zu `Bytespider` etwa gibt es keine offizielle Dokumentation, und Website-Betreiber berichten, dass er robots.txt ignoriert.
- **Hochstapler.** Jeder kann `User-Agent: GPTBot` oder `Googlebot` senden. Gefälschte Suchmaschinen-User-Agents sind ein klassischer Weg, naive Sperren zu umgehen.

## Was die robots.txt verrät

Die Datei ist öffentlich. Eine Zeile `Disallow: /admin-backup-2024/` verrät jedem, dass es den Pfad gibt. Listen Sie keine Geheimnisse auf – schützen Sie sie.

## Was stattdessen hilft – oder zusätzlich

| Maßnahme | Stoppt | Hinweise |
|---|---|---|
| robots.txt | Crawler, die sie befolgen | Das standardisierte, dokumentierte Signal. Behalten Sie sie. |
| [Serverregeln](page:server-rules) nach User-Agent | Bots, die sich zu erkennen geben | Günstig und wirksam gegen namentlich bekannte KI-Crawler |
| Prüfung per IP / Reverse DNS | Hochstapler, die sich als bekannter Bot ausgeben | Nutzen Sie die veröffentlichten Bereiche des Betreibers; siehe die jeweilige [Bot-Seite](page:bots) |
| Rate Limiting | Scraper mit hohem Volumen, egal unter welchem Namen | Pro IP oder pro Netz; schützt den Server |
| Bot-Management im CDN / WAF | Bekannte bösartige Netze, Browser-Automatisierung | Cloudflare, Fastly, Akamai und andere klassifizieren Bots |
| Authentifizierung | Alle ohne Konto | Der einzige echte Schutz für private Inhalte |

## Eine sinnvolle Reihenfolge

1. Veröffentlichen Sie eine ehrliche robots.txt – sie dokumentiert Ihre Entscheidung und ist das, worauf der EU-Verhaltenskodex verweist.
2. Blockieren Sie die KI-Agenten, mit denen Sie nicht einverstanden sind, namentlich am Server oder im CDN.
3. Verifizieren Sie die Bots, die Sie erlauben, damit Hochstapler unter deren Namen abgewiesen werden.
4. Begrenzen Sie für alles andere die Anfragerate und behalten Sie Ihre Logs im Blick.
