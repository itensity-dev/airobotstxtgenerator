---
title: "Bloquer les robots IA dans nginx (map $http_user_agent)"
description: "Configuration nginx qui bloque GPTBot, ClaudeBot, CCBot, Bytespider et autres robots d'IA via un map sur $http_user_agent : 403, robots.txt accessible."
h1: "Bloquer les robots IA dans nginx"
nav: "nginx"
lead: "Un `map` sur `$http_user_agent` repère les robots d'IA une seule fois dans le bloc `http` ; un `if` de deux lignes dans chaque bloc `server` leur répond par un 403, tandis que `/robots.txt` reste ouvert."
steps:
  - "Sélectionnez les agents et copiez la configuration."
  - "Placez le bloc `map` dans le contexte `http {}` — par exemple dans un nouveau fichier `/etc/nginx/conf.d/ai-bots.conf`, que la plupart des distributions incluent automatiquement."
  - "Placez le bloc `location = /robots.txt` et les lignes `if ($is_ai_bot)` dans chaque bloc `server {}` qui doit refuser les robots d'IA."
  - "Lancez `nginx -t` pour vérifier la syntaxe, puis `systemctl reload nginx`."
  - "Testez : `curl -I -A \"Mozilla/5.0 (compatible; GPTBot/1.4)\" https://example.com/` renvoie 403 ; `curl -I https://example.com/robots.txt` renvoie toujours 200."
capabilities:
  - feature: "Correspondance insensible à la casse"
    status: "yes"
    note: "Chaque ligne utilise `~*`, l'expression régulière insensible à la casse de nginx."
  - feature: "Une seule liste pour tous les sites"
    status: "yes"
    note: "Le `map` se trouve dans `http {}` : chaque bloc server peut donc utiliser `$is_ai_bot`."
  - feature: "Usage sûr de if"
    status: "yes"
    note: "`if` avec `return` fait partie des usages que la documentation de nginx qualifie de sûrs dans `server`."
  - feature: "Fonctionne derrière un CDN"
    status: "partly"
    note: "nginx voit le User-Agent transmis par le CDN — en général l'original. Les bots bloqués au niveau du CDN n'atteignent jamais nginx."
faq:
  - q: "Pourquoi un map plutôt qu'une longue condition if ?"
    a: "nginx évalue `map` à la demande et une seule fois par requête, la liste reste lisible avec un bot par ligne, et vous pouvez réutiliser la variable dans plusieurs blocs server ou dans la journalisation (`access_log ... if=$is_ai_bot`)."
  - q: "Peut-on journaliser les requêtes des bots IA au lieu de les bloquer ?"
    a: "Oui : gardez le `map` et remplacez le `if` par un journal distinct, par exemple `access_log /var/log/nginx/ai-bots.log combined if=$is_ai_bot;`."
  - q: "Comment n'autoriser un bot que depuis ses vraies adresses IP ?"
    a: "Utilisez le module `geo` avec les plages publiées par l'opérateur, combinez-le avec le map des User-Agents et refusez les requêtes qui se réclament du bot depuis d'autres adresses. Les plages changent : mettez-les à jour avec un script."
related: ["server-rules", "server-apache", "server-caddy", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Où va chaque partie

nginx lit sa configuration par contextes. La directive `map` n'est autorisée que dans `http {}` ; les directives `if` et `location` vont dans `server {}`. Si vous gérez plusieurs sites, définissez le map une seule fois et ajoutez les trois lignes à chaque site. Placez `location = /robots.txt` avant les autres locations susceptibles de réécrire ou de relayer la requête — dans nginx, une location à correspondance exacte l'emporte toujours.

Si nginx sert de proxy inverse devant une application, la règle arrête la requête avant qu'elle n'atteigne l'application, ce qui épargne aussi les ressources de celle-ci.
