---
title: "Generatore robots.txt per AI: blocca GPTBot e i crawler AI"
description: "Generatore robots.txt per AI: blocca l'addestramento (GPTBot, ClaudeBot, Google-Extended, CCBot) e resta nella ricerca AI, o blocca ogni AI. Verifica RFC 9309."
h1: "Generatore robots.txt per AI"
nav: "Generatore robots.txt"
lead: "Scegli il tipo di sito e l'obiettivo: il generatore scrive un robots.txt per {{all}} crawler e token AI documentati, spiega ogni riga e verifica il risultato con un parser conforme all'RFC 9309 prima che tu lo copi."
steps:
  - "Scegli il **tipo di sito**: imposta dei percorsi di partenza sensati (un e-commerce chiude `/cart/` e `/checkout/` a tutti i crawler, un sito di notizie chiude `/premium/` ai bot AI)."
  - "Scegli l'**obiettivo**: niente addestramento AI ma presenza nella ricerca AI, nessuna AI, consenti tutto, oppure decidi bot per bot."
  - "Aggiungi le **eccezioni per percorso**, ad esempio apri `/blog/` a tutti i bot AI o chiudi `/members/` a tutti."
  - "Copia o scarica il file e caricalo come `robots.txt` nella root di ogni host (`https://example.com/robots.txt`). Hai già un file? Usa **Aggiungi al mio robots.txt**: aggiunge la sezione AI e dimostra che le regole esistenti funzionano esattamente come prima."
  - "Verifica il file online con il [tester robots.txt](page:tester) e, per i crawler che ignorano robots.txt, aggiungi delle [regole server](page:server-rules)."
capabilities:
  - feature: "Elenco dei crawler AI"
    status: "yes"
    note: "{{all}} agenti e token con la documentazione ufficiale dell'operatore e la data dell'ultimo controllo; su richiesta, altri {{community}} dalla lista community di ai.robots.txt."
  - feature: "Preset per scopo"
    status: "yes"
    note: "Addestramento, ricerca AI, recuperi richiesti dagli utenti e token validi solo in robots.txt sono trattati separatamente."
  - feature: "Autoverifica"
    status: "yes"
    note: "Ogni file viene analizzato con le stesse regole del parser open source di Google; ogni agente viene testato su `/`, sui percorsi di eccezione e sui percorsi chiusi."
  - feature: "Unione con un file esistente"
    status: "yes"
    note: "Aggiunge una sezione AI, mostra le differenze e confronta le decisioni vecchie e nuove per ogni agente già presente nel tuo file."
  - feature: "Righe Content-Signal"
    status: "partly"
    note: "`Content-Signal` facoltativo per il gruppo `*`. È una proposta di Cloudflare, non uno standard."
  - feature: "Fermare i bot che ignorano robots.txt"
    status: "no"
    note: "robots.txt è una richiesta. Per imporre il blocco usa le [regole server](page:server-rules) o un WAF."
  - feature: "Registrazione, upload, tracciamento dei tuoi dati"
    status: "no"
    note: "La generazione avviene nel tuo browser e funziona offline; i tuoi percorsi e file non vengono inviati da nessuna parte."
faq:
  - q: "Come blocco l'addestramento AI ma resto visibile nella ricerca di ChatGPT, Claude e Perplexity?"
    a: "Blocca i crawler e i token di addestramento — `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `meta-externalagent` e altri — e lascia consentiti gli agenti di ricerca (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`). È il primo obiettivo del generatore. Tutti i dettagli nella guida [Bloccare l'addestramento AI e restare nella ricerca AI](page:guide-training-search)."
  - q: "Bloccare Google-Extended rimuove il mio sito dalla Ricerca Google o dalle AI Overview?"
    a: "No. `Google-Extended` è un token robots.txt, non un crawler: stabilisce se Google può usare i contenuti per l'addestramento e il grounding di Gemini. La Ricerca Google, comprese AI Overview e AI Mode, usa `Googlebot`."
  - q: "Perché il file generato ripete alcune regole?"
    a: "Un crawler nominato in un proprio gruppo ignora completamente il gruppo `User-agent: *`. Quando i bot AI hanno bisogno di un gruppo proprio (ad esempio per chiudere loro `/premium/`), il generatore copia le tue regole `*` in quel gruppo, così non si perde nulla."
  - q: "Tutte le aziende AI rispetteranno questo file?"
    a: "La maggior parte dei grandi operatori dichiara che i propri crawler rispettano robots.txt. I fetcher che agiscono su richiesta di un utente (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`) potrebbero non farlo, e alcuni crawler non pubblicano alcuna dichiarazione. Il registro dei bot riporta la dichiarazione di ciascun operatore con il link alla fonte."
  - q: "Dove va messo il file robots.txt?"
    a: "Nella root di ogni host e protocollo che vuoi coprire: `https://example.com/robots.txt` non vale per `https://shop.example.com/`. Il file deve essere testo semplice in UTF-8 e, per Google, più piccolo di 500 KiB."
  - q: "I miei dati vengono salvati?"
    a: "No. Il generatore funziona interamente nel tuo browser. Contiamo solo che è stato generato un file e quale preset è stato usato, senza i tuoi percorsi né il tuo testo."
  - q: "Il robots.txt vale come riserva dei diritti ai sensi dell'AI Act e dell'art. 70-quater LDA?"
    a: "La direttiva Copyright (art. 4), recepita in Italia dall'art. 70-quater della legge sul diritto d'autore, consente l'estrazione di testo e di dati salvo riserva espressa dei titolari; dal 2025 l'art. 70-septies (L. 132/2025) applica queste regole anche all'addestramento dell'intelligenza artificiale, e l'AI Act obbliga i fornitori di modelli a rispettare tali riserve. Un `Disallow` per i crawler di addestramento è la riserva leggibile da macchina più riconosciuta, ma l'effetto giuridico dipende dal caso concreto. Dettagli nella guida [Bot AI e AI Act](page:guide-eu-ai-act). Informazioni, non consulenza legale."
related: ["tester", "bots", "server-rules", "guide-training-search", "llms-txt"]
updated: "2026-11-04"
---

## Come decide il generatore

Ogni agente del registro ha uno **scopo**, ricavato dalla documentazione del suo operatore:

- **Addestramento AI**: raccoglie pagine che possono essere usate per addestrare modelli (`GPTBot`, `ClaudeBot`, `CCBot`, `MistralAI-Training`).
- **Token robots.txt**: non sono affatto crawler, ma nomi che stabiliscono come possono essere usati i contenuti recuperati da un crawler generico (`Google-Extended`, `Applebot-Extended`, `__usage_ai-training`).
- **Ricerca AI**: indicizza le pagine affinché un prodotto AI possa citarle e linkarle (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`).
- **Recuperi richiesti dagli utenti**: aprono una pagina perché una persona l'ha chiesto a un assistente (`ChatGPT-User`, `Claude-User`, `Perplexity-User`).
- **Crawler generici**: `Googlebot`, `Bingbot`, `Applebot` e i fetcher delle anteprime dei link non vengono mai bloccati da un preset, perché bloccarli ti toglie dalla ricerca tradizionale o rompe le anteprime dei link.

L'obiettivo decide quali scopi vengono chiusi. Il generatore scrive poi un gruppo per ogni scopo, così il file resta leggibile, e aggiunge a ciascun gruppo le tue eccezioni per percorso.

## Perché il file viene verificato prima che tu lo veda

robots.txt ha alcune regole che sorprendono: **vince la regola corrispondente più lunga**, **a parità vince Allow**, un crawler con un **proprio gruppo ignora `User-agent: *`** e **le righe vuote non separano i gruppi**. Dopo aver costruito il file, il generatore lo analizza con lo stesso algoritmo del parser open source di Google (lo testiamo con i casi di test di Google e con 46 file robots.txt reali) e verifica, per ogni agente e ogni percorso rilevante, che la risposta corrisponda alle regole che hai scelto. Il timbro sotto il file indica quanti controlli sono stati eseguiti.

## Cosa non può fare robots.txt

robots.txt è una richiesta pubblica, definita nell'[RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html). I crawler corretti la rispettano; altri no, e chiunque può inviare un User-Agent falso. Per imporre il blocco agisci sul server o sulla CDN — la pagina [regole server](page:server-rules) genera regole per nginx, Apache, Caddy e Cloudflare a partire dallo stesso registro — e verifica i bot tramite IP o DNS inverso.
