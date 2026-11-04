---
title: "Bloccare i crawler AI in Caddy (Caddyfile header_regexp)"
description: "Regola Caddyfile per bloccare GPTBot, ClaudeBot e altri crawler AI con un matcher sull'header User-Agent: 403 ai bot AI, robots.txt sempre raggiungibile."
h1: "Bloccare i crawler AI in Caddy"
nav: "Caddy"
lead: "Un matcher con nome basato su `header_regexp User-Agent` seleziona i crawler AI ed esclude `/robots.txt`, e `respond` risponde loro prima di qualsiasi altro handler."
steps:
  - "Seleziona gli agenti e copia lo snippet."
  - "Incollalo dentro il blocco del tuo sito nel Caddyfile, prima di `reverse_proxy`, `php_fastcgi` o `file_server`."
  - "Esegui `caddy validate --config /etc/caddy/Caddyfile`, poi `caddy reload --config /etc/caddy/Caddyfile`."
  - "Verifica con `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Espressione regolare case-insensitive"
    status: "yes"
    note: "`(?i)` all'inizio del pattern rende il confronto indipendente da maiuscole e minuscole."
  - feature: "Ordine delle direttive"
    status: "yes"
    note: "Caddy ordina le direttive da sé; `respond` viene eseguita prima di `reverse_proxy` e `file_server`."
  - feature: "Configurazione JSON"
    status: "partly"
    note: "Lo snippet è per il Caddyfile; `caddy adapt` lo converte in JSON."
faq:
  - q: "Posso riutilizzare il matcher in più siti?"
    a: "Sì: inseriscilo in uno snippet — `(ai_bots) { … }` — e usa `import ai_bots` in ogni blocco sito."
  - q: "Come registro le richieste bloccate?"
    a: "Caddy registra ogni richiesta con il relativo codice di stato; filtra l'access log per lo stato 403 e gli User-Agent intercettati."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Cosa fa lo snippet

`@ai_bots` è un matcher con nome: una richiesta corrisponde solo se tutte le condizioni al suo interno sono vere, cioè se l'header User-Agent corrisponde all'espressione e il percorso non è `/robots.txt`. `respond @ai_bots 403` chiude subito queste richieste con una risposta 403 vuota. Tutto il resto prosegue verso i tuoi handler abituali.
