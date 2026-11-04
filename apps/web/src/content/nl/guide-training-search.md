---
title: "AI-training blokkeren, wel zichtbaar in AI-zoekmachines"
description: "Blokkeer trainingscrawlers als GPTBot, ClaudeBot en Google-Extended en blijf zichtbaar in ChatGPT, Claude, Perplexity en AI Overviews, met geteste robots.txt."
h1: "AI-training blokkeren en zichtbaar blijven in AI-zoekmachines"
nav: "AI-training blokkeren, zichtbaar blijven"
lead: "De meeste AI-bedrijven gebruiken inmiddels aparte agenten voor training, voor zoeken en voor verzoeken van gebruikers. Blokkeer de trainingscrawlers en -tokens, sta de zoekagenten toe, en je pagina's blijven citeerbaar in AI-antwoorden zonder dat ze het volgende model voeden."
related: ["home", "bots", "tester", "server-rules", "content-signals"]
updated: "2026-11-04"
faq:
  - q: "Verdwijnt mijn site uit ChatGPT als ik GPTBot blokkeer?"
    a: "Nee. De zoekantwoorden van ChatGPT komen uit de index van OAI-SearchBot, en die staat los van GPTBot. Blokkeer GPTBot en sta OAI-SearchBot toe om citeerbaar te blijven."
  - q: "Moet ik Googlebot blokkeren om mijn content buiten Gemini te houden?"
    a: "Nee — en dat moet je ook niet doen, want dan verdwijn je uit Google Zoeken. Zet een Disallow voor `Google-Extended` om je af te melden voor training en grounding van Gemini. AI Overviews zijn onderdeel van Zoeken en regel je met snippet-instructies zoals `nosnippet`, niet met Google-Extended."
  - q: "Verdwijnt mijn content uit modellen die al getraind zijn als ik trainingscrawlers blokkeer?"
    a: "Nee. Een regel in robots.txt geldt alleen voor toekomstig crawlen. Sommige bedrijven bieden aparte procedures om bestaande data te laten verwijderen of je af te melden; kijk daarvoor in hun documentatie."
  - q: "En Common Crawl?"
    a: "Het archief van CCBot wordt door veel AI-ontwikkelaars gebruikt, dus CCBot blokkeren hoort bij een training-opt-out. Je pagina's verdwijnen daarmee ook uit toekomstige snapshots van Common Crawl die voor onderzoek worden gebruikt."
---

## De drie soorten AI-agenten

Sinds 2024 hebben de grote AI-bedrijven hun crawlers naar doel opgesplitst, grotendeels zodat uitgevers precies deze keuze kunnen maken:

| Bedrijf | Training | AI-zoeken (indexeren en citeren) | Verzoek van gebruiker (live ophalen) |
|---|---|---|---|
| OpenAI | `GPTBot` | `OAI-SearchBot` | `ChatGPT-User` |
| Anthropic | `ClaudeBot` | `Claude-SearchBot` | `Claude-User` |
| Perplexity | — (zegt niet te trainen op gecrawlde content) | `PerplexityBot` | `Perplexity-User` |
| Google | `Google-Extended` (token) | Googlebot (Zoeken, AI Overviews) | `Google-Agent`, `Google-GeminiNotebook` |
| Apple | `Applebot-Extended` (token) | Applebot | — |
| Meta | `meta-externalagent` | `meta-webindexer` | `meta-externalfetcher` |
| Mistral | `MistralAI-Training` | `MistralAI-Index` | `MistralAI-User` |
| Amazon | `Amazonbot` (ook ander gebruik) | `Amzn-SearchBot` | `Amzn-User` |

**Trainingscrawlers** en -tokens bepalen of je pagina's in de trainingsdata van een model terecht kunnen komen. **Zoekagenten** bepalen of een AI-product je kan vinden en citeren — daar komt het verwijzingsverkeer uit AI vandaan. **Fetchers voor gebruikers** openen een pagina omdat iemand erom vroeg; verschillende beheerders zeggen dat robots.txt daarvoor mogelijk niet geldt.

## De robots.txt

Het eerste doel van de [generator](page:home) maakt dit beleid voor elke gedocumenteerde agent. De kern ziet er zo uit:

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

De zoekagenten worden nergens genoemd: ze hebben geen eigen groep en volgen dus `User-agent: *`, net als Google en Bing. Dat is bewust zo. Geef je een zoekagent een eigen groep — bijvoorbeeld om `/premium/` voor hem te sluiten — dan leest hij de `*`-groep helemaal niet meer, en moet je elke `*`-regel in zijn groep herhalen. De generator doet dat voor je zodra je een uitzondering voor een pad toevoegt die alleen voor AI geldt.

## Crawlers met meerdere doelen

Sommige agenten dienen meerdere doelen onder één naam. `Amazonbot` verbetert de producten van Amazon en kan voor training worden gebruikt; `meta-externalagent` traint modellen én indexeert content; het archief van `CCBot` voedt zowel onderzoek als AI-training. De generator behandelt ze in deze preset als trainingscrawlers, wat het beleid strikt houdt, en laat zien welke agenten in deze groep vallen, zodat je ze in de modus Per bot kiezen afzonderlijk op *toestaan* kunt zetten.

Algemene crawlers zijn een ander verhaal: `Googlebot`, `Bingbot` en `Applebot` voeden zoekmachines en, via die zoekmachines, AI-functies zoals AI Overviews en Copilot. Blokkeer ze nooit om AI-training tegen te houden — gebruik `Google-Extended`, `Applebot-Extended` en, voor Bing, de tags `noarchive`/`nocache` of de groep `__usage_ai-training`, die Bing vanaf 2027 ondersteunt.

## Controleer het resultaat

1. Plak het bestand in de [checker](page:tester) en bekijk de tabel met crawlers: trainingsagenten **Geblokkeerd**, zoekagenten **Toegestaan**.
2. Test een paar belangrijke URL's voor `OAI-SearchBot` en `PerplexityBot`.
3. Gebruik je Cloudflare, controleer dan ook de instellingen van AI Crawl Control: een blokkade in het CDN gaat vóór een toestemming in robots.txt.
4. Voeg voor agenten die robots.txt negeren [serverregels](page:server-rules) toe.
