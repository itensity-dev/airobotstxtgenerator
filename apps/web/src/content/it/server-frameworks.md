---
title: "Bloccare i bot AI in Express, Next.js, Django e PHP"
description: "Middleware pronto da copiare per bloccare GPTBot, ClaudeBot e altri crawler AI in Express, Next.js (proxy.ts), Django e PHP/WordPress, con robots.txt aperto."
h1: "Bloccare i bot AI nella tua applicazione"
nav: "Framework"
lead: "Se non puoi modificare il web server, blocca i crawler AI nell'applicazione stessa: middleware per Express, Next.js, Django e PHP puro o WordPress, generati dal registro."
steps:
  - "Scegli il framework e gli agenti, poi copia il codice."
  - "Express: registra il middleware prima delle tue route. Next.js: salvalo come `proxy.ts` nella root del progetto (`middleware.ts` prima di Next.js 16). Django: aggiungi la classe a `MIDDLEWARE`. PHP: includi il file all'inizio di `index.php` o mettilo in `wp-content/mu-plugins/`."
  - "Pubblica e verifica con `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Nessun accesso al server necessario"
    status: "yes"
    note: "Funziona sulle piattaforme dove controlli solo il codice (Vercel, Render, hosting PHP condiviso)."
  - feature: "File statici serviti da una CDN"
    status: "partly"
    note: "Le richieste a cui risponde la CDN o un file server statico non arrivano mai al tuo middleware; blocca anche lì."
  - feature: "Prestazioni"
    status: "yes"
    note: "Un'unica espressione regolare compilata per richiesta."
faq:
  - q: "Un middleware vale quanto una regola server?"
    a: "Rifiuta le stesse richieste, ma più tardi: la tua applicazione ha già iniziato a gestirle. Le regole sul server o sulla CDN costano meno. Il middleware è la scelta giusta quando non puoi modificare il server."
  - q: "Il proxy di Next.js viene eseguito anche per gli asset statici?"
    a: "Per impostazione predefinita viene eseguito per ogni route; aggiungi un `config.matcher` che escluda `_next/static` e le immagini se vuoi risparmiare invocazioni."
related: ["server-rules", "server-nginx", "server-cloudflare", "bots"]
updated: "2026-11-04"
---

## Come decide il middleware

Ogni snippet costruisce un'unica espressione regolare case-insensitive a partire dai nomi User-Agent degli agenti selezionati, salta il percorso `/robots.txt` e risponde alle richieste corrispondenti con il codice di stato scelto e un breve messaggio in testo semplice. Nient'altro cambia nella tua applicazione.
