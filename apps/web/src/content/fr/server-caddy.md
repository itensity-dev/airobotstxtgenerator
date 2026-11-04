---
title: "Bloquer les robots IA dans Caddy (Caddyfile header_regexp)"
description: "Règle Caddyfile qui bloque GPTBot, ClaudeBot et les autres robots d'IA via un matcher nommé sur l'en-tête User-Agent : 403, robots.txt toujours accessible."
h1: "Bloquer les robots IA dans Caddy"
nav: "Caddy"
lead: "Un matcher nommé avec `header_regexp User-Agent` sélectionne les robots d'IA, exclut `/robots.txt`, et `respond` leur répond avant tout autre gestionnaire."
steps:
  - "Sélectionnez les agents et copiez l'extrait."
  - "Collez-le dans le bloc de votre site, dans le Caddyfile, avant `reverse_proxy`, `php_fastcgi` ou `file_server`."
  - "Lancez `caddy validate --config /etc/caddy/Caddyfile`, puis `caddy reload --config /etc/caddy/Caddyfile`."
  - "Testez avec `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Expression régulière insensible à la casse"
    status: "yes"
    note: "`(?i)` en début de motif rend la correspondance insensible à la casse."
  - feature: "Ordre des directives"
    status: "yes"
    note: "Caddy trie lui-même les directives ; `respond` s'exécute avant `reverse_proxy` et `file_server`."
  - feature: "Configuration JSON"
    status: "partly"
    note: "L'extrait est destiné au Caddyfile ; `caddy adapt` le convertit en JSON."
faq:
  - q: "Peut-on réutiliser le matcher sur plusieurs sites ?"
    a: "Oui : placez-le dans un snippet — `(ai_bots) { … }` — et ajoutez `import ai_bots` dans chaque bloc de site."
  - q: "Comment journaliser les requêtes bloquées ?"
    a: "Caddy journalise chaque requête avec son code de réponse ; filtrez le journal d'accès sur le statut 403 et les User-Agents concernés."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Ce que fait l'extrait

`@ai_bots` est un matcher nommé : une requête ne correspond que si toutes les conditions qu'il contient sont vraies — l'en-tête User-Agent correspond à l'expression et le chemin n'est pas `/robots.txt`. `respond @ai_bots 403` met immédiatement fin à ces requêtes avec une réponse 403 vide. Tout le reste continue vers vos gestionnaires habituels.
