---
title: "AIRobotsTxtChecker : le robot de notre testeur robots.txt"
description: "AIRobotsTxtChecker, le User-Agent de notre testeur robots.txt : ce qu'il récupère (uniquement /robots.txt), à quelle fréquence, d'où, et comment le bloquer."
h1: "Notre robot de vérification : AIRobotsTxtChecker"
nav: "Robot de vérification"
lead: "Quand quelqu'un utilise la vérification en direct de notre testeur robots.txt, notre serveur récupère une seule fois le /robots.txt du site concerné, avec ce User-Agent. Il ne récupère jamais rien d'autre."
related: ["tester", "privacy", "about"]
updated: "2026-11-04"
---

## User-Agent

```
Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)
```

## Ce qu'il fait

- Il récupère **uniquement** le `/robots.txt` de l'hôte saisi par un utilisateur — jamais de pages, d'images ni de sitemaps.
- Une requête par vérification ; les résultats sont mis en cache 10 minutes, si bien que de nouvelles vérifications du même hôte pendant ce délai ne déclenchent aucune nouvelle requête.
- Il suit au maximum 5 redirections, attend au maximum 5 secondes et lit au maximum 512 Kio.
- Il se connecte uniquement à des adresses IP publiques, sur les ports 80 et 443.
- Ce n'est pas un robot d'exploration : il ne suit pas les liens, ne conserve pas votre fichier au-delà du cache et ne l'utilise à aucune autre fin.

## Respecte-t-il robots.txt ?

Il lit robots.txt ; il n'explore rien que robots.txt pourrait régir. Comme le robot de Google qui récupère robots.txt, il n'applique pas votre robots.txt au fichier robots.txt lui-même.

## Comment le bloquer

Si vous ne voulez pas que votre robots.txt soit vérifié via notre site, renvoyez `403` pour le User-Agent `AIRobotsTxtChecker`, par exemple dans nginx :

```nginx
if ($http_user_agent ~* "AIRobotsTxtChecker") { return 403; }
```

Questions ou signalements d'abus : {{contact}}.
