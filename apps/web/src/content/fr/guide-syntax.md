---
title: "Syntaxe robots.txt (RFC 9309) : règles et exemples"
description: "La syntaxe robots.txt par l'exemple : groupes, User-agent, Allow et Disallow, jokers * et $, règle la plus longue, codes HTTP et erreurs courantes."
h1: "Syntaxe robots.txt selon la RFC 9309, avec exemples"
nav: "Syntaxe robots.txt"
lead: "robots.txt est devenu un standard Internet en septembre 2022 avec la RFC 9309. Ses règles sont courtes, mais quelques-unes — la correspondance la plus longue, un seul groupe par robot, les lignes vides — surprennent presque tout le monde. Chaque exemple ci-dessous peut être collé dans le testeur."
related: ["tester", "home", "guide-bad-bots", "bots"]
updated: "2026-11-04"
faq:
  - q: "robots.txt est-il sensible à la casse ?"
    a: "Les noms de directives (`User-agent`, `Disallow`) et de robots ne le sont pas ; les chemins, si. `Disallow: /Private/` ne bloque pas `/private/`."
  - q: "Peut-on utiliser des expressions régulières ?"
    a: "Non. Seuls `*` (n'importe quelle suite de caractères) et `$` en fin de motif (fin de l'URL) ont un sens particulier."
  - q: "Faut-il une ligne Allow ?"
    a: "Seulement pour rouvrir un chemin à l'intérieur d'un chemin interdit. Tout ce qui n'est pas interdit est autorisé."
  - q: "robots.txt s'applique-t-il aux sous-domaines ?"
    a: "Non. Chaque combinaison de protocole, d'hôte et de port a son propre fichier : `https://example.com/robots.txt` ne couvre pas `https://blog.example.com/`."
---

## Le fichier

robots.txt est un fichier en texte brut, encodé en UTF-8, placé à la racine d'un hôte : `https://example.com/robots.txt`. Les robots le récupèrent avant d'explorer le site. Les lignes ont la forme `clé: valeur` ; `#` introduit un commentaire. Google lit jusqu'à **500 Kio** et ignore le reste.

## Groupes

Un **groupe** se compose d'une ou plusieurs lignes `User-agent` suivies de règles :

```
User-agent: GPTBot
User-agent: CCBot
Disallow: /

User-agent: *
Disallow: /admin/
```

- Un robot utilise le ou les groupes qui le **nomment**. La correspondance ignore la casse et ne tient compte que du jeton de produit : `User-agent: GPTBot/1.4` est lu comme `GPTBot`.
- Si plusieurs groupes nomment le même robot, leurs règles sont **fusionnées**.
- Seul un robot qu'aucun groupe ne nomme utilise `User-agent: *`.
- Un robot qui a son propre groupe **ignore complètement `*`**. Dans l'exemple, `GPTBot` ne peut rien récupérer — mais si son groupe contenait seulement `Disallow: /blog/`, il pourrait récupérer `/admin/`, car la règle `*` ne s'appliquerait plus à lui.

**Les lignes vides ne terminent pas un groupe.** Ce fichier applique les règles `*` à `GPTBot`, car les deux lignes User-agent appartiennent au même groupe :

```
User-agent: GPTBot

User-agent: *
Disallow: /private/
```

## Règles : Allow et Disallow

`Disallow: /path` bloque toute URL dont le chemin commence par `/path` — y compris `/path.html`, `/path/` et `/pathology`. Un `Disallow:` vide autorise tout. `Allow` rouvre un chemin.

Quand plusieurs règles correspondent, **le motif le plus long l'emporte** ; si un motif Allow et un motif Disallow ont la même longueur, **Allow l'emporte**. L'ordre des lignes n'a pas d'importance.

```
User-agent: *
Disallow: /shop/
Allow: /shop/catalog/
```

`/shop/cart` est bloqué ; `/shop/catalog/shoes` est autorisé (14 caractères battent 6).

## Caractères génériques

- `*` correspond à n'importe quelle suite de caractères : `Disallow: /*.pdf` bloque toute URL contenant `.pdf`.
- `$` en fin de motif ancre la fin de l'URL : `Disallow: /*.pdf$` bloque `/a.pdf` mais pas `/a.pdf?download=1`.
- Un `*` final ne change rien : `/private*` équivaut à `/private`.
- Les motifs sont comparés au chemin **et à la chaîne de requête** : `Disallow: /*?sort=` bloque les pages de listes triées.

## Autres lignes

- `Sitemap: https://example.com/sitemap.xml` — une URL complète ; s'applique à tous les robots, n'importe où dans le fichier.
- `Crawl-delay` — ignoré par Google ; Bing, Yandex, Anthropic et Common Crawl le respectent.
- `Noindex` dans robots.txt — non pris en charge depuis 2019 ; utilisez une balise meta robots.
- `Content-Signal`, `Content-Usage` — propositions de préférences pour l'IA ; voir [signaux de contenu](page:content-signals).

## Quand le fichier est absent ou défaillant

| Réponse pour /robots.txt | Comportement de Google |
|---|---|
| 200 | Les règles s'appliquent |
| 3xx | Suit jusqu'à 5 redirections, puis traite le résultat comme une 404 |
| 4xx (sauf 429) | Aucune restriction — tout peut être exploré |
| 5xx, 429 | Exploration suspendue ; après ~30 jours, copie en cache ou aucune restriction |
| Injoignable | Traité comme une 5xx |

## Les erreurs que Google pardonne — et les autres peut-être pas

Google accepte `Dissallow`, `User agent`, l'absence de deux-points (`Disallow /admin`) et une marque d'ordre des octets. D'autres robots peut-être pas : le [testeur](page:tester) les signale donc, même si l'analyseur de Google les lit. Il signale aussi les règles placées avant toute ligne `User-agent` (ignorées par tous), les URL complètes dans `Disallow` (elles ne correspondent jamais) et les chemins sans barre oblique initiale.
