---
title: "Bloquer les robots IA côté serveur : nginx, .htaccess, Caddy"
description: "Règles serveur qui renvoient 403 aux robots d'IA selon leur User-Agent (nginx, .htaccess, Caddy, Cloudflare, Express, Next.js, Django, PHP) et vérification IP."
h1: "Bloquer les robots IA côté serveur"
nav: "Règles serveur"
lead: "robots.txt ne fait que demander ; ces règles font refuser les robots d'IA par votre serveur en fonction de leur User-Agent. Choisissez un serveur et les agents à bloquer, copiez la règle, puis vérifiez les robots authentiques par IP ou DNS inverse."
steps:
  - "Choisissez votre serveur ou framework : nginx, Apache, Caddy, Cloudflare WAF, Express, Next.js, Django ou PHP."
  - "Choisissez les agents : robots d'entraînement uniquement, tous les agents d'IA ou votre propre sélection dans le registre."
  - "Choisissez le code de réponse — `403 Forbidden` est le signal le plus clair ; `404` ou `410` masquent le fait que vous bloquez."
  - "Collez la règle à l'endroit indiqué par les commentaires, rechargez le serveur, puis vérifiez avec `curl -A \"GPTBot\" -I https://your-site/` : vous devez obtenir le code choisi, tandis que `/robots.txt` reste accessible."
capabilities:
  - feature: "Ignore les jetons propres à robots.txt"
    status: "yes"
    note: "Google-Extended, Applebot-Extended, FirecrawlAgent et `__usage_ai-training` n'apparaissent jamais dans un en-tête User-Agent : ils sont donc écartés au lieu de produire des règles inopérantes."
  - feature: "Ne bloque jamais les moteurs de recherche ni les aperçus de liens"
    status: "yes"
    note: "Googlebot, Bingbot, Applebot et facebookexternalhit ne figurent pas dans les préréglages ; les noms communautaires génériques (Code, Spider, OpenAI…) sont écartés pour ne pas bloquer du trafic sans rapport."
  - feature: "Garde /robots.txt accessible"
    status: "yes"
    note: "Chaque règle exempte `/robots.txt`, pour que les robots puissent toujours lire votre politique."
  - feature: "Arrête les bots usurpés ou non déclarés"
    status: "no"
    note: "La correspondance par User-Agent n'arrête que les bots qui s'identifient. Contre les bots qui utilisent un User-Agent de navigateur, il faut une limitation du débit, une gestion des bots ou des règles fondées sur l'IP."
  - feature: "Longueur des expressions Cloudflare"
    status: "partly"
    note: "Les expressions des règles personnalisées sont limitées à 4 096 caractères ; l'outil vous avertit quand une sélection est trop longue."
faq:
  - q: "Faut-il bloquer les robots d'IA dans robots.txt ou sur le serveur ?"
    a: "Les deux, pour des raisons différentes. robots.txt est le moyen documenté et lisible par machine d'exprimer votre choix — c'est à lui que renvoie le code de bonnes pratiques de l'UE pour l'IA à usage général — et les robots bien élevés le respectent. Les règles serveur imposent ce choix aux robots qui ignorent robots.txt ou qui récupèrent des pages pour le compte d'un utilisateur."
  - q: "Un bot peut-il contourner un blocage par User-Agent ?"
    a: "Oui, en envoyant un autre User-Agent. C'est pourquoi les opérateurs publient des plages d'IP ou signent leurs requêtes : vous pouvez ainsi n'autoriser que les requêtes authentiques d'un bot de confiance, ou bloquer un bot par son réseau. Le tableau ci-dessous recense toutes les listes d'IP et tous les noms d'hôte publiés."
  - q: "Un blocage en 403 nuit-il à mon référencement ?"
    a: "Non, si vous ne bloquez que des agents propres à l'IA. Ne bloquez jamais Googlebot, Bingbot ou Applebot de cette façon ; Google-Extended et Applebot-Extended contrôlent l'usage par l'IA sans toucher à la recherche."
  - q: "Quel code de réponse utiliser ?"
    a: "`403 Forbidden` indique clairement que l'accès est refusé. Certains propriétaires de sites préfèrent `404` ou `410` pour que le robot n'enregistre rien d'utile. Les trois empêchent la livraison du contenu."
related: ["server-nginx", "server-apache", "server-cloudflare", "bots", "guide-bad-bots"]
updated: "2026-11-04"
---

## Comment les règles sont construites

Les règles proviennent du même [registre](page:bots) que le générateur. Pour chaque agent sélectionné, nous prenons les sous-chaînes que son opérateur documente dans l'en-tête User-Agent (par exemple `GPTBot` ou `ClaudeBot`), supprimons les doublons et les noms déjà couverts par un nom plus court, puis écrivons une correspondance insensible à la casse pour votre serveur. Les agents qui ne sont que des jetons robots.txt sont ignorés, avec une note, car aucune requête ne porte jamais leur nom.

## Vérifier qu'un bot est authentique

Une chaîne User-Agent n'est que du texte, et les fausses requêtes « GPTBot » ou « Googlebot » sont courantes. Les opérateurs proposent trois moyens de prouver qu'une requête est authentique :

- **Listes d'IP** — des fichiers JSON contenant les plages d'adresses utilisées par le robot (OpenAI, Anthropic, Perplexity, Google, Common Crawl, DuckDuckGo et d'autres). Comparez l'IP du client avec ces plages et actualisez la liste régulièrement.
- **DNS inverse** — recherchez le nom d'hôte de l'IP du client, vérifiez qu'il se termine par le domaine de l'opérateur (par exemple `googlebot.com` ou `applebot.apple.com`), puis résolvez ce nom d'hôte dans l'autre sens et confirmez qu'il renvoie la même IP.
- **Requêtes signées (Web Bot Auth)** — la requête porte une signature HTTP Message Signature, vérifiable avec la clé publiée par l'opérateur (Exa, You.com, l'agent de ChatGPT, certaines requêtes de Google-Agent).

Chaque [page de robot](page:bots) propose un extrait Node.js prêt à l'emploi pour sa méthode.
