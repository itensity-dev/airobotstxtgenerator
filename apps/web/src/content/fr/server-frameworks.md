---
title: "Bloquer les robots IA dans Express, Next.js, Django et PHP"
description: "Middleware prêt à copier pour bloquer GPTBot, ClaudeBot et autres robots d'IA dans Express, Next.js (proxy.ts), Django et PHP/WordPress, robots.txt ouvert."
h1: "Bloquer les robots IA dans votre application"
nav: "Frameworks"
lead: "Si vous ne pouvez pas modifier le serveur web, bloquez les robots d'IA dans l'application elle-même : middleware pour Express, Next.js, Django et PHP ou WordPress, généré à partir du registre."
steps:
  - "Choisissez le framework et les agents, puis copiez le code."
  - "Express : déclarez le middleware avant vos routes. Next.js : enregistrez le fichier sous `proxy.ts` à la racine du projet (`middleware.ts` avant Next.js 16). Django : ajoutez la classe à `MIDDLEWARE`. PHP : incluez le fichier tout en haut d'`index.php` ou déposez-le dans `wp-content/mu-plugins/`."
  - "Déployez et testez avec `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Aucun accès au serveur nécessaire"
    status: "yes"
    note: "Fonctionne sur les plateformes où vous ne contrôlez que le code (Vercel, Render, hébergement PHP mutualisé)."
  - feature: "Fichiers statiques servis par un CDN"
    status: "partly"
    note: "Les requêtes auxquelles répond le CDN ou un serveur de fichiers statiques n'atteignent jamais votre middleware ; bloquez aussi à ce niveau."
  - feature: "Performances"
    status: "yes"
    note: "Une seule expression régulière compilée par requête."
faq:
  - q: "Un middleware vaut-il une règle serveur ?"
    a: "Il refuse les mêmes requêtes, mais plus tard : votre application a déjà commencé à les traiter. Les règles serveur ou CDN coûtent moins cher. Le middleware est le bon choix quand vous ne pouvez pas modifier le serveur."
  - q: "Le proxy Next.js s'exécute-t-il pour les ressources statiques ?"
    a: "Par défaut, il s'exécute pour chaque route ; ajoutez un `config.matcher` qui exclut `_next/static` et les images si vous voulez économiser des invocations."
related: ["server-rules", "server-nginx", "server-cloudflare", "bots"]
updated: "2026-11-04"
---

## Comment le middleware décide

Chaque extrait construit une seule expression régulière insensible à la casse à partir des noms User-Agent des agents sélectionnés, ignore le chemin `/robots.txt` et répond aux requêtes correspondantes avec le code choisi et un court message en texte brut. Rien d'autre ne change dans votre application.
