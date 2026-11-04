---
title: "Bloccare i crawler AI in nginx (map $http_user_agent)"
description: "Configurazione nginx per bloccare GPTBot, ClaudeBot, CCBot, Bytespider e altri crawler AI con una map su $http_user_agent: 403 e robots.txt raggiungibile."
h1: "Bloccare i crawler AI in nginx"
nav: "nginx"
lead: "Una `map` su `$http_user_agent` contrassegna i crawler AI una sola volta nel blocco `http`; un `if` di due righe in ogni blocco `server` risponde loro con un 403, mentre `/robots.txt` resta aperto."
steps:
  - "Seleziona gli agenti e copia la configurazione."
  - "Inserisci il blocco `map` nel contesto `http {}`, ad esempio in un nuovo file `/etc/nginx/conf.d/ai-bots.conf`, che la maggior parte delle distribuzioni include automaticamente."
  - "Inserisci il blocco `location = /robots.txt` e le righe `if ($is_ai_bot)` in ogni blocco `server {}` che deve rifiutare i crawler AI."
  - "Esegui `nginx -t` per controllare la sintassi, poi `systemctl reload nginx`."
  - "Verifica: `curl -I -A \"Mozilla/5.0 (compatible; GPTBot/1.4)\" https://example.com/` restituisce 403; `curl -I https://example.com/robots.txt` restituisce ancora 200."
capabilities:
  - feature: "Confronto senza distinzione tra maiuscole e minuscole"
    status: "yes"
    note: "Ogni riga usa `~*`, l'espressione regolare case-insensitive di nginx."
  - feature: "Un solo elenco per tutti i siti"
    status: "yes"
    note: "La `map` sta in `http {}`, quindi ogni blocco server può usare `$is_ai_bot`."
  - feature: "Uso sicuro di if"
    status: "yes"
    note: "`if` con `return` è uno degli usi che nginx documenta come sicuri dentro `server`."
  - feature: "Funziona dietro una CDN"
    status: "partly"
    note: "nginx vede lo User-Agent inoltrato dalla CDN, di solito quello originale. I bot bloccati dalla CDN non arrivano mai a nginx."
faq:
  - q: "Perché una map invece di una lunga condizione if?"
    a: "nginx valuta la `map` in modo lazy e una sola volta per richiesta, l'elenco resta leggibile con un bot per riga e puoi riutilizzare la variabile in più blocchi server o nei log (`access_log ... if=$is_ai_bot`)."
  - q: "Posso registrare le richieste dei bot AI invece di bloccarle?"
    a: "Sì: mantieni la `map` e sostituisci l'`if` con un log separato, ad esempio `access_log /var/log/nginx/ai-bots.log combined if=$is_ai_bot;`."
  - q: "Come consento un bot solo dai suoi indirizzi IP reali?"
    a: "Usa il modulo `geo` con gli intervalli pubblicati dall'operatore, combinalo con la map sullo User-Agent e rifiuta le richieste che si spacciano per il bot da altri indirizzi. Gli intervalli cambiano, quindi aggiornali con uno script."
related: ["server-rules", "server-apache", "server-caddy", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Dove va ogni parte

nginx legge la configurazione per contesti. La direttiva `map` è ammessa solo in `http {}`; le direttive `if` e `location` vanno in `server {}`. Se gestisci più siti, definisci la map una sola volta e aggiungi le tre righe a ciascun sito. Metti `location = /robots.txt` prima di altre location che potrebbero riscrivere o inoltrare la richiesta: in nginx una location con corrispondenza esatta vince sempre.

Se nginx fa da reverse proxy davanti a un'applicazione, la regola ferma la richiesta prima che arrivi all'applicazione, risparmiando anche le sue risorse.
