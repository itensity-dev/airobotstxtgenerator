---
title: "Bloquer les robots IA avec .htaccess (Apache mod_rewrite)"
description: "Règles .htaccess (mod_rewrite) pour bloquer GPTBot, ClaudeBot, CCBot, Bytespider et autres robots d'IA sur Apache : 403, robots.txt accessible. Prêt à copier."
h1: "Bloquer les robots IA avec .htaccess sur Apache"
nav: "Apache .htaccess"
lead: "Trois lignes `mod_rewrite` dans `.htaccess` refusent les robots d'IA par User-Agent avec un 403, épargnent `/robots.txt` et fonctionnent sur un hébergement mutualisé sans accès à la configuration principale."
steps:
  - "Sélectionnez les agents et copiez les règles."
  - "Ouvrez `.htaccess` à la racine de votre site (créez-le s'il n'existe pas) et collez le bloc en haut du fichier, avant les règles de réécriture de WordPress ou de votre framework."
  - "Enregistrez. Aucun redémarrage n'est nécessaire : Apache lit `.htaccess` à chaque requête."
  - "Testez avec `curl -I -A \"ClaudeBot\" https://example.com/` (403 attendu) et `curl -I https://example.com/robots.txt` (200 attendu)."
capabilities:
  - feature: "Hébergement mutualisé"
    status: "yes"
    note: "Nécessite seulement `AllowOverride FileInfo` (activé chez presque tous les hébergeurs) et `mod_rewrite`."
  - feature: "Configuration du serveur au lieu de .htaccess"
    status: "yes"
    note: "Les mêmes lignes fonctionnent dans `<VirtualHost>` ou `<Directory>`, et y sont plus rapides."
  - feature: "LiteSpeed et OpenLiteSpeed"
    status: "yes"
    note: "LiteSpeed lit les règles de réécriture Apache dans `.htaccess`."
  - feature: "Hébergement nginx seul"
    status: "no"
    note: "nginx ignore `.htaccess` ; utilisez les [règles nginx](page:server-nginx)."
faq:
  - q: "Où placer le bloc dans .htaccess ?"
    a: "Avant les autres règles de réécriture. Le bloc de WordPress se termine par `RewriteRule . /index.php [L]`, qui traiterait sinon la requête en premier."
  - q: "Que signifie [F,L] ?"
    a: "`F` répond 403 Forbidden et `L` arrête le traitement des règles suivantes. `[G,L]` répond 410 Gone à la place."
  - q: "Peut-on utiliser SetEnvIf au lieu de mod_rewrite ?"
    a: "Oui : `SetEnvIfNoCase User-Agent \"GPTBot\" ai_bot` suivi de `<RequireAll> Require all granted Require not env ai_bot </RequireAll>` fonctionne sans mod_rewrite, mais il faut une ligne `SetEnvIfNoCase` par bot et une exception distincte pour `/robots.txt`."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Comment fonctionne la règle

`RewriteCond %{REQUEST_URI} !^/robots\.txt$` exempte le fichier robots.txt. `RewriteCond %{HTTP_USER_AGENT} (GPTBot|ClaudeBot|…) [NC]` détecte l'un des noms listés n'importe où dans le User-Agent, sans tenir compte de la casse. `RewriteRule ^ - [F,L]` refuse ensuite la requête sans réécrire l'URL. Toutes les conditions doivent être vraies pour que la règle s'applique.

Sous WordPress, les extensions de cache servent parfois les pages avant l'exécution de PHP, mais toujours après `.htaccess` : le blocage s'applique donc aussi aux pages en cache.
