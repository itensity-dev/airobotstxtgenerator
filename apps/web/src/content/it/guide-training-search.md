---
title: "Bloccare l'addestramento AI e restare visibili su ChatGPT"
description: "Blocca GPTBot, ClaudeBot, Google-Extended e altri crawler di addestramento restando visibile su ChatGPT, Claude, Perplexity e AI Overview. Esempio testato."
h1: "Come bloccare l'addestramento AI e restare visibili nella ricerca AI"
nav: "Bloccare l'addestramento AI"
lead: "Oggi la maggior parte delle aziende AI usa agenti separati per l'addestramento, per la ricerca e per le richieste degli utenti. Blocca i crawler e i token di addestramento, consenti gli agenti di ricerca: le tue pagine restano citabili nelle risposte AI senza alimentare il prossimo modello."
related: ["home", "bots", "tester", "server-rules", "content-signals"]
updated: "2026-11-04"
faq:
  - q: "Se blocco GPTBot, il mio sito sparisce da ChatGPT?"
    a: "No. Le risposte di ricerca di ChatGPT provengono dall'indice di OAI-SearchBot, che è separato. Blocca GPTBot e consenti OAI-SearchBot per restare citabile."
  - q: "Devo bloccare Googlebot per tenere i miei contenuti fuori da Gemini?"
    a: "No, e non dovresti farlo, perché ti toglierebbe dalla Ricerca Google. Usa un Disallow per `Google-Extended` per escluderti dall'addestramento e dal grounding di Gemini. Le AI Overview fanno parte della Ricerca e si controllano con i tag per gli snippet come `nosnippet`, non con Google-Extended."
  - q: "Bloccare i crawler di addestramento rimuove i miei contenuti dai modelli già addestrati?"
    a: "No. Una regola robots.txt riguarda solo le scansioni future. Alcune aziende offrono procedure separate di rimozione o di opt-out per i dati esistenti; consulta la loro documentazione."
  - q: "E Common Crawl?"
    a: "L'archivio di CCBot è usato da molti sviluppatori AI, quindi bloccarlo fa parte di un opt-out dall'addestramento. Toglie inoltre le tue pagine dagli snapshot futuri di Common Crawl usati per la ricerca."
---

## I tre tipi di agenti AI

Dal 2024 le grandi aziende AI hanno separato i propri crawler per scopo, in buona parte proprio per permettere agli editori questa scelta:

| Azienda | Addestramento | Ricerca AI (indicizzare e citare) | Richiesta dell'utente (recupero in tempo reale) |
|---|---|---|---|
| OpenAI | `GPTBot` | `OAI-SearchBot` | `ChatGPT-User` |
| Anthropic | `ClaudeBot` | `Claude-SearchBot` | `Claude-User` |
| Perplexity | — (dichiara di non addestrare sui contenuti scansionati) | `PerplexityBot` | `Perplexity-User` |
| Google | `Google-Extended` (token) | Googlebot (Ricerca, AI Overview) | `Google-Agent`, `Google-GeminiNotebook` |
| Apple | `Applebot-Extended` (token) | Applebot | — |
| Meta | `meta-externalagent` | `meta-webindexer` | `meta-externalfetcher` |
| Mistral | `MistralAI-Training` | `MistralAI-Index` | `MistralAI-User` |
| Amazon | `Amazonbot` (anche altri usi) | `Amzn-SearchBot` | `Amzn-User` |

I crawler e i token di **addestramento** decidono se le tue pagine possono finire nei dati di addestramento di un modello. Gli agenti di **ricerca** decidono se un prodotto AI può trovarti e citarti: è da qui che arriva il traffico di referral dalle AI. I fetcher **su richiesta dell'utente** aprono una pagina perché una persona l'ha chiesta; diversi operatori dichiarano che robots.txt potrebbe non applicarsi a loro.

## Il robots.txt

Il primo obiettivo del [generatore](page:home) produce questa configurazione per ogni agente documentato. Il nucleo è questo:

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

Gli agenti di ricerca non vengono nominati: non hanno un gruppo proprio, quindi seguono `User-agent: *` come Google e Bing. È voluto. Se dai a un agente di ricerca un gruppo proprio — ad esempio per chiudergli `/premium/` — smette del tutto di leggere il gruppo `*`, quindi devi ripetere ogni regola `*` nel suo gruppo. Il generatore lo fa per te quando aggiungi un'eccezione di percorso valida solo per l'AI.

## Crawler con scopi misti

Alcuni agenti servono più scopi con un solo nome. `Amazonbot` migliora i prodotti Amazon e può essere usato per l'addestramento; `meta-externalagent` addestra modelli e indicizza contenuti; l'archivio di `CCBot` alimenta sia la ricerca scientifica sia l'addestramento AI. In questo preset il generatore li tratta come crawler di addestramento, il che mantiene le regole rigorose, e ti indica quali agenti rientrano in questo gruppo, così puoi impostare i singoli su *consenti* nella modalità personalizzata.

I crawler generici sono un caso diverso: `Googlebot`, `Bingbot` e `Applebot` alimentano i motori di ricerca e, tramite questi, funzioni AI come AI Overview e Copilot. Non bloccarli mai per fermare l'addestramento AI: usa `Google-Extended`, `Applebot-Extended` e, per Bing, i tag `noarchive`/`nocache` oppure il gruppo `__usage_ai-training`, che Bing supporta dal 2027.

## Verifica il risultato

1. Incolla il file nel [tester](page:tester) e guarda la tabella dei crawler: agenti di addestramento **Bloccati**, agenti di ricerca **Consentiti**.
2. Testa alcuni URL importanti per `OAI-SearchBot` e `PerplexityBot`.
3. Se usi Cloudflare, controlla anche le impostazioni di AI Crawl Control: un blocco sulla CDN prevale su un Allow nel robots.txt.
4. Per gli agenti che ignorano robots.txt, aggiungi delle [regole server](page:server-rules).
