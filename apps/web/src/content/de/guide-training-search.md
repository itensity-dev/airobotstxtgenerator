---
title: "KI-Training sperren, in ChatGPT & KI-Suche sichtbar bleiben"
description: "GPTBot, ClaudeBot, Google-Extended & Co. blockieren, aber in ChatGPT-Suche, Claude, Perplexity und AI Overviews sichtbar bleiben – mit getesteter robots.txt."
h1: "KI-Training blockieren und in der KI-Suche sichtbar bleiben"
nav: "KI-Training blockieren, KI-Suche behalten"
lead: "Die meisten KI-Unternehmen betreiben inzwischen getrennte Agenten für Training, Suche und Nutzeranfragen. Blockieren Sie die Trainings-Crawler und -Tokens, erlauben Sie die Such-Agenten – dann bleiben Ihre Seiten in KI-Antworten zitierbar, ohne das nächste Modell zu füttern."
related: ["home", "bots", "tester", "server-rules", "content-signals"]
updated: "2026-11-04"
faq:
  - q: "Verschwindet meine Website aus ChatGPT, wenn ich GPTBot blockiere?"
    a: "Nein. Die Suchantworten von ChatGPT stammen aus dem Index von OAI-SearchBot, der davon getrennt ist. Blockieren Sie GPTBot und erlauben Sie OAI-SearchBot, dann bleiben Sie zitierbar."
  - q: "Muss ich Googlebot blockieren, damit meine Inhalte nicht in Gemini landen?"
    a: "Nein – und das sollten Sie auch nicht, denn damit verschwinden Sie aus der Google-Suche. Sperren Sie `Google-Extended`, um Training und Grounding von Gemini zu widersprechen. AI Overviews gehören zur Suche und werden mit Snippet-Angaben wie `nosnippet` gesteuert, nicht mit Google-Extended."
  - q: "Entfernt das Blockieren von Trainings-Crawlern meine Inhalte aus bereits trainierten Modellen?"
    a: "Nein. Eine robots.txt-Regel wirkt nur auf künftiges Crawling. Manche Unternehmen bieten eigene Verfahren zur Entfernung oder zum Opt-out für vorhandene Daten an; prüfen Sie deren Dokumentation."
  - q: "Und was ist mit Common Crawl?"
    a: "Das Archiv von CCBot nutzen viele KI-Entwickler, daher gehört das Blockieren zu einem Trainings-Opt-out. Es entfernt Ihre Seiten außerdem aus künftigen Snapshots von Common Crawl, die auch für die Forschung genutzt werden."
---

## Die drei Arten von KI-Agenten

Seit 2024 haben die großen KI-Unternehmen ihre Crawler nach Zweck aufgeteilt – vor allem, damit Website-Betreiber genau diese Wahl treffen können:

| Unternehmen | Training | KI-Suche (indexieren und zitieren) | Nutzeranfrage (Live-Abruf) |
|---|---|---|---|
| OpenAI | `GPTBot` | `OAI-SearchBot` | `ChatGPT-User` |
| Anthropic | `ClaudeBot` | `Claude-SearchBot` | `Claude-User` |
| Perplexity | – (trainiert nach eigener Aussage nicht mit gecrawlten Inhalten) | `PerplexityBot` | `Perplexity-User` |
| Google | `Google-Extended` (Token) | Googlebot (Suche, AI Overviews) | `Google-Agent`, `Google-GeminiNotebook` |
| Apple | `Applebot-Extended` (Token) | Applebot | – |
| Meta | `meta-externalagent` | `meta-webindexer` | `meta-externalfetcher` |
| Mistral | `MistralAI-Training` | `MistralAI-Index` | `MistralAI-User` |
| Amazon | `Amazonbot` (auch für andere Zwecke) | `Amzn-SearchBot` | `Amzn-User` |

**Trainings**-Crawler und -Tokens entscheiden, ob Ihre Seiten in den Trainingsdaten eines Modells landen können. **Such**-Agenten entscheiden, ob ein KI-Produkt Sie finden und zitieren kann – daher kommt der Referral-Traffic aus KI-Antworten. **Nutzer**-Abrufdienste öffnen eine Seite, weil eine Person danach gefragt hat; mehrere Betreiber sagen, dass robots.txt für sie möglicherweise nicht gilt.

## Die robots.txt

Das erste Ziel im [Generator](page:home) erzeugt diese Richtlinie für jeden dokumentierten Agenten. Im Kern sieht sie so aus:

```
# AI training crawlers — blocked
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: CCBot
User-agent: meta-externalagent
User-agent: MistralAI-Training
User-agent: Bytespider
Disallow: /

# AI usage controls (robots.txt tokens, not crawlers) — blocked
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: __usage_ai-training
Disallow: /

# Everyone else, including OAI-SearchBot, Claude-SearchBot, PerplexityBot
User-agent: *
Disallow: /admin/
```

Die Such-Agenten werden nirgends genannt: Sie haben keine eigene Gruppe und folgen daher wie Google und Bing `User-agent: *`. Das ist Absicht. Geben Sie einem Such-Agenten eine eigene Gruppe – etwa um `/premium/` für ihn zu sperren –, liest er die `*`-Gruppe überhaupt nicht mehr, und Sie müssen jede `*`-Regel in seiner Gruppe wiederholen. Der Generator erledigt das für Sie, wenn Sie eine Pfad-Ausnahme nur für KI-Bots hinzufügen.

## Crawler mit mehreren Zwecken

Manche Agenten dienen unter einem Namen mehreren Zwecken. `Amazonbot` verbessert Amazons Produkte und kann für Training genutzt werden; `meta-externalagent` trainiert Modelle und indexiert Inhalte; das Archiv von `CCBot` dient der Forschung ebenso wie dem KI-Training. Der Generator behandelt sie in dieser Voreinstellung als Trainings-Crawler, was die Richtlinie streng hält, und zeigt Ihnen, welche Agenten in diese Gruppe fallen – im benutzerdefinierten Modus können Sie einzelne davon auf *erlauben* stellen.

Allgemeine Crawler sind ein anderer Fall: `Googlebot`, `Bingbot` und `Applebot` beliefern Suchmaschinen und darüber auch KI-Funktionen wie AI Overviews und Copilot. Blockieren Sie sie nie, um KI-Training zu verhindern – nutzen Sie `Google-Extended`, `Applebot-Extended` und für Bing die Tags `noarchive`/`nocache` oder die Gruppe `__usage_ai-training`, die Bing ab 2027 unterstützt.

## Ergebnis prüfen

1. Fügen Sie die Datei in den [Tester](page:tester) ein und sehen Sie sich die Crawler-Tabelle an: Trainings-Agenten **Blockiert**, Such-Agenten **Erlaubt**.
2. Testen Sie einige wichtige URLs für `OAI-SearchBot` und `PerplexityBot`.
3. Wenn Sie Cloudflare nutzen, prüfen Sie auch die Einstellungen unter AI Crawl Control: Eine Sperre im CDN hat Vorrang vor einer Erlaubnis in der robots.txt.
4. Für Agenten, die robots.txt ignorieren, ergänzen Sie [Serverregeln](page:server-rules).
