---
title: "Bloccare i bot AI con .htaccess (Apache mod_rewrite)"
description: "Regole .htaccess per bloccare GPTBot, ClaudeBot, CCBot, Bytespider e altri crawler AI su Apache con mod_rewrite: 403 ai bot AI, robots.txt raggiungibile."
h1: "Bloccare i bot AI con .htaccess su Apache"
nav: "Apache .htaccess"
lead: "Tre righe `mod_rewrite` nel file `.htaccess` rifiutano i crawler AI in base allo User-Agent con un 403, escludono `/robots.txt` e funzionano anche su hosting condiviso, senza accesso alla configurazione principale."
steps:
  - "Seleziona gli agenti e copia le regole."
  - "Apri `.htaccess` nella document root (crealo se non esiste) e incolla il blocco verso l'inizio del file, prima delle regole di rewrite di WordPress o del tuo framework."
  - "Salva. Non serve riavviare: Apache legge `.htaccess` a ogni richiesta."
  - "Verifica con `curl -I -A \"ClaudeBot\" https://example.com/` (atteso 403) e `curl -I https://example.com/robots.txt` (atteso 200)."
capabilities:
  - feature: "Hosting condiviso"
    status: "yes"
    note: "Servono solo `AllowOverride FileInfo` (attivo su quasi tutti gli hosting) e `mod_rewrite`."
  - feature: "Configurazione del server al posto di .htaccess"
    status: "yes"
    note: "Le stesse righe funzionano dentro `<VirtualHost>` o `<Directory>` e lì sono più veloci."
  - feature: "LiteSpeed e OpenLiteSpeed"
    status: "yes"
    note: "LiteSpeed legge le regole di rewrite Apache in `.htaccess`."
  - feature: "Hosting solo nginx"
    status: "no"
    note: "nginx ignora `.htaccess`; usa le [regole nginx](page:server-nginx)."
faq:
  - q: "In quale punto del file .htaccess va messo il blocco?"
    a: "Prima delle altre regole di rewrite. Il blocco di WordPress termina con `RewriteRule . /index.php [L]`, che altrimenti gestirebbe la richiesta per primo."
  - q: "Cosa significa [F,L]?"
    a: "`F` risponde 403 Forbidden e `L` interrompe l'elaborazione delle regole successive. `[G,L]` risponde invece 410 Gone."
  - q: "Posso usare SetEnvIf al posto di mod_rewrite?"
    a: "Sì: `SetEnvIfNoCase User-Agent \"GPTBot\" ai_bot` seguito da `<RequireAll> Require all granted Require not env ai_bot </RequireAll>` funziona senza mod_rewrite, ma serve una riga `SetEnvIfNoCase` per ogni bot e un'eccezione separata per `/robots.txt`."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Come funziona la regola

`RewriteCond %{REQUEST_URI} !^/robots\.txt$` esclude il file robots.txt. `RewriteCond %{HTTP_USER_AGENT} (GPTBot|ClaudeBot|…) [NC]` trova uno qualsiasi dei nomi elencati in qualunque punto dello User-Agent, senza distinguere maiuscole e minuscole. `RewriteRule ^ - [F,L]` rifiuta quindi la richiesta senza riscrivere l'URL. Perché la regola si applichi, tutte le condizioni devono essere vere.

Su WordPress i plugin di cache a volte servono le pagine prima che PHP venga eseguito, ma comunque dopo `.htaccess`, quindi il blocco vale anche per le pagine in cache.
