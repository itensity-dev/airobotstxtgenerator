---
title: "Perché il robots.txt non ferma i bot malevoli (e cosa fare)"
description: "robots.txt è una richiesta, non un controllo degli accessi: chi lo ignora, perché lo User-Agent si falsifica e cosa usare: regole server, verifica IP, WAF."
h1: "Perché il robots.txt non ti protegge dai bot malevoli"
nav: "robots.txt e bot malevoli"
lead: "Il robots.txt è un cartello sulla porta, non una serratura. Funziona perché i crawler responsabili scelgono di leggerlo; gli scraper a cui non importa, o che si spacciano per qualcun altro, non vengono fermati."
related: ["server-rules", "tester", "bots", "guide-syntax"]
updated: "2026-11-04"
faq:
  - q: "Il robots.txt può rendere privata una pagina?"
    a: "No. Chiunque può aprire un URL bloccato, e indicarlo nel robots.txt lo rende pubblico. Proteggi i contenuti privati con l'autenticazione."
  - q: "Come capisco se un bot ignora il mio robots.txt?"
    a: "Cerca nei log del server richieste a percorsi bloccati con lo User-Agent di quel bot e verifica l'IP: una richiesta che arriva da fuori degli intervalli pubblicati dall'operatore non viene dal bot vero."
  - q: "Devo semplicemente bloccare tutto ciò che sembra un bot?"
    a: "No: perderesti motori di ricerca, anteprime dei link, servizi di monitoraggio uptime e strumenti di accessibilità. Blocca per nome dove puoi, verifica dove gli operatori lo permettono e limita la frequenza delle richieste per tutto il resto."
---

## Cos'è il robots.txt

L'RFC 9309 lo dice chiaramente: le regole «non sono una forma di autorizzazione all'accesso». Un crawler recupera `/robots.txt`, legge il gruppo che lo nomina e decide di obbedire. Niente nel protocollo HTTP impone quella decisione.

## Chi lo ignora

- **Scraper e raccoglitori di dati** che non hanno mai chiesto il permesso. Molti usano normali User-Agent da browser.
- **Fetcher che agiscono per conto di un utente.** OpenAI, Perplexity, Google e Meta dichiarano che i loro fetcher attivati dagli utenti (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`, `meta-externalfetcher`) potrebbero non rispettare robots.txt, perché è una persona ad aver chiesto la pagina. Anthropic dichiara che il suo `Claude-User` lo rispetta.
- **Crawler che non pubblicano alcuna policy**: `Bytespider`, ad esempio, non ha documentazione ufficiale, e diversi gestori di siti hanno segnalato che ignora robots.txt.
- **Impostori.** Chiunque può inviare `User-Agent: GPTBot` o `Googlebot`. Gli User-Agent falsi da motore di ricerca sono un classico per aggirare i blocchi ingenui.

## Cosa rivela il robots.txt

Il file è pubblico. Una riga `Disallow: /admin-backup-2024/` dice a tutti che quel percorso esiste. Non elencare i segreti: proteggili.

## Cosa usare al suo posto, o in aggiunta

| Misura | Ferma | Note |
|---|---|---|
| robots.txt | I crawler che lo rispettano | Il segnale standard e documentato. Mantienilo. |
| [Regole server](page:server-rules) per User-Agent | I bot che si dichiarano | Economiche ed efficaci per i crawler AI con un nome |
| Verifica IP / DNS inverso | Gli impostori che si spacciano per un bot noto | Usa gli intervalli pubblicati dall'operatore; vedi la [pagina di ogni bot](page:bots) |
| Rate limiting | Scraper ad alto volume, con qualsiasi nome | Per IP o per rete; protegge il server |
| Gestione bot della CDN / WAF | Reti malevole note, automazione del browser | Cloudflare, Fastly, Akamai e altri classificano i bot |
| Autenticazione | Chiunque non abbia un account | L'unica vera protezione per i contenuti privati |

## Un ordine sensato

1. Pubblica un robots.txt onesto: documenta la tua scelta ed è ciò a cui fa riferimento il Codice di buone pratiche dell'UE.
2. Blocca per nome, sul server o sulla CDN, gli agenti AI a cui ti opponi.
3. Verifica i bot che consenti, così da respingere gli impostori che usano i loro nomi.
4. Limita la frequenza di tutto il resto e tieni d'occhio i log.
