---
title: "Pourquoi robots.txt ne bloque pas les bots malveillants"
description: "robots.txt est une demande, pas un contrôle d'accès : quels bots l'ignorent, pourquoi un User-Agent se falsifie et quoi faire (règles serveur, IP, WAF)."
h1: "Pourquoi robots.txt ne vous protège pas des bots malveillants"
nav: "robots.txt et bots malveillants"
lead: "robots.txt est un panneau sur la porte, pas une serrure. Il fonctionne parce que les robots responsables choisissent de le lire ; les scrapers qui n'en ont cure, ou qui se font passer pour d'autres, ne sont pas arrêtés par lui."
related: ["server-rules", "tester", "bots", "guide-syntax"]
updated: "2026-11-04"
faq:
  - q: "robots.txt peut-il rendre une page privée ?"
    a: "Non. N'importe qui peut ouvrir une URL interdite, et la mentionner dans robots.txt revient à en faire la publicité. Protégez les contenus privés par une authentification."
  - q: "Comment savoir si un bot ignore mon robots.txt ?"
    a: "Cherchez dans les journaux de votre serveur des requêtes vers des chemins interdits portant le User-Agent de ce bot, et vérifiez l'IP : une requête venant d'en dehors des plages publiées par l'opérateur ne provient pas du vrai bot."
  - q: "Faut-il bloquer tout ce qui ressemble à un bot ?"
    a: "Non : vous perdriez les moteurs de recherche, les aperçus de liens, les outils de surveillance de disponibilité et les outils d'accessibilité. Bloquez par nom quand c'est possible, vérifiez quand les opérateurs le permettent et limitez le débit du reste."
---

## Ce qu'est robots.txt

La RFC 9309 le dit clairement : ces règles « ne constituent pas une forme d'autorisation d'accès ». Un robot récupère `/robots.txt`, lit le groupe qui le nomme et décide d'obéir. Rien dans HTTP n'impose cette décision.

## Qui l'ignore

- **Les scrapers et collecteurs de données** qui n'ont jamais demandé la permission. Beaucoup utilisent des User-Agents de navigateur ordinaires.
- **Les agents qui agissent pour un utilisateur.** OpenAI, Perplexity, Google et Meta indiquent que leurs agents déclenchés par l'utilisateur (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`, `meta-externalfetcher`) peuvent ne pas respecter robots.txt, puisqu'une personne a demandé la page. Anthropic affirme que son `Claude-User` le respecte.
- **Les robots qui ne publient aucune politique** — `Bytespider`, par exemple, n'a aucune documentation officielle, et des propriétaires de sites signalent qu'il ignore robots.txt.
- **Les imposteurs.** N'importe qui peut envoyer `User-Agent: GPTBot` ou `Googlebot`. Les faux User-Agents de moteurs de recherche sont un moyen classique de contourner les blocages naïfs.

## Ce que révèle robots.txt

Le fichier est public. Une ligne `Disallow: /admin-backup-2024/` apprend à tout le monde que ce chemin existe. N'y listez pas de secrets ; protégez-les.

## Quoi utiliser à la place — ou en plus

| Mesure | Arrête | Remarques |
|---|---|---|
| robots.txt | Les robots qui le respectent | Le signal standard et documenté. Gardez-le. |
| [Règles serveur](page:server-rules) par User-Agent | Les bots qui s'annoncent | Simple et efficace pour les robots d'IA nommés |
| Vérification par IP / DNS inverse | Les imposteurs qui se font passer pour un bot connu | Utilisez les plages publiées par l'opérateur ; voir la [page de chaque bot](page:bots) |
| Limitation du débit | Les scrapers à gros volume, quel que soit leur nom | Par IP ou par réseau ; protège le serveur |
| Gestion des bots par le CDN / WAF | Réseaux malveillants connus, automatisation de navigateur | Cloudflare, Fastly, Akamai et d'autres classent les bots |
| Authentification | Toute personne sans compte | La seule vraie protection des contenus privés |

## Un ordre raisonnable

1. Publiez un robots.txt honnête : il documente votre choix, et c'est à lui que renvoie le code de bonnes pratiques de l'UE.
2. Bloquez par leur nom, au niveau du serveur ou du CDN, les agents d'IA que vous refusez.
3. Vérifiez les robots que vous autorisez, pour refuser les imposteurs qui usurpent leur nom.
4. Limitez le débit de tout le reste et surveillez vos journaux.
