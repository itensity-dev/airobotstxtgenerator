---
title: "Bloquer l'entraînement IA sans disparaître des réponses IA"
description: "Bloquez GPTBot, ClaudeBot, Google-Extended et les autres robots d'entraînement en restant visible dans ChatGPT, Perplexity et les Aperçus IA. robots.txt testé."
h1: "Bloquer l'entraînement IA tout en restant visible dans la recherche IA"
nav: "Bloquer l'entraînement, rester visible"
lead: "La plupart des entreprises d'IA exploitent désormais des agents distincts pour l'entraînement, pour la recherche et pour les requêtes des utilisateurs. Bloquez les robots et jetons d'entraînement, autorisez les agents de recherche : vos pages restent citables dans les réponses des IA sans nourrir le prochain modèle."
related: ["home", "bots", "tester", "server-rules", "content-signals"]
updated: "2026-11-04"
faq:
  - q: "Si je bloque GPTBot, mon site disparaît-il de ChatGPT ?"
    a: "Non. Les réponses de recherche de ChatGPT proviennent de l'index d'OAI-SearchBot, qui est distinct. Bloquez GPTBot et autorisez OAI-SearchBot pour rester citable."
  - q: "Faut-il bloquer Googlebot pour tenir mon contenu à l'écart de Gemini ?"
    a: "Non — et surtout pas, car cela vous retirerait de la recherche Google. Interdisez `Google-Extended` pour refuser l'entraînement et l'ancrage de Gemini. Les Aperçus IA font partie de la recherche et se contrôlent avec des directives d'extrait comme `nosnippet`, pas avec Google-Extended."
  - q: "Bloquer les robots d'entraînement retire-t-il mon contenu des modèles déjà entraînés ?"
    a: "Non. Une règle robots.txt ne concerne que l'exploration future. Certaines entreprises proposent des procédures distinctes de suppression ou d'opposition pour les données existantes ; consultez leur documentation."
  - q: "Et Common Crawl ?"
    a: "L'archive de CCBot est utilisée par de nombreux développeurs d'IA : la bloquer fait donc partie d'un opt-out de l'entraînement. Cela retire aussi vos pages des futurs instantanés de Common Crawl utilisés pour la recherche scientifique."
---

## Les trois types d'agents d'IA

Depuis 2024, les grandes entreprises d'IA séparent leurs robots selon leur finalité, en grande partie pour que les éditeurs de sites puissent faire exactement ce choix :

| Entreprise | Entraînement | Recherche IA (indexer et citer) | Requête d'un utilisateur (accès en direct) |
|---|---|---|---|
| OpenAI | `GPTBot` | `OAI-SearchBot` | `ChatGPT-User` |
| Anthropic | `ClaudeBot` | `Claude-SearchBot` | `Claude-User` |
| Perplexity | — (dit ne pas entraîner de modèles sur le contenu exploré) | `PerplexityBot` | `Perplexity-User` |
| Google | `Google-Extended` (jeton) | Googlebot (recherche, Aperçus IA) | `Google-Agent`, `Google-GeminiNotebook` |
| Apple | `Applebot-Extended` (jeton) | Applebot | — |
| Meta | `meta-externalagent` | `meta-webindexer` | `meta-externalfetcher` |
| Mistral | `MistralAI-Training` | `MistralAI-Index` | `MistralAI-User` |
| Amazon | `Amazonbot` (aussi d'autres usages) | `Amzn-SearchBot` | `Amzn-User` |

Les robots et jetons d'**entraînement** déterminent si vos pages peuvent se retrouver dans les données d'entraînement d'un modèle. Les agents de **recherche** déterminent si un produit d'IA peut vous trouver et vous citer — c'est de là que vient le trafic référent des IA. Les agents **utilisateurs** ouvrent une page parce qu'une personne l'a demandée ; plusieurs opérateurs indiquent que robots.txt peut ne pas s'appliquer à eux.

## Le robots.txt

Le premier objectif du [générateur](page:home) produit cette politique pour chaque agent documenté. En voici le cœur :

```
# AI training crawlers — blocked
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: CCBot
User-agent: meta-externalagent
User-agent: MistralAI-Training
User-agent: Bytespider
Disallow: /

# AI usage controls (robots.txt tokens, not crawlers) — blocked
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: __usage_ai-training
Disallow: /

# Everyone else, including OAI-SearchBot, Claude-SearchBot, PerplexityBot
User-agent: *
Disallow: /admin/
```

Aucune ligne ne nomme les agents de recherche : ils n'ont pas de groupe propre et suivent donc `User-agent: *`, comme Google et Bing. C'est voulu. Si vous donnez un groupe propre à un agent de recherche — par exemple pour lui fermer `/premium/` —, il cesse complètement de lire le groupe `*` : vous devez alors répéter chaque règle `*` dans son groupe. Le générateur le fait pour vous quand vous ajoutez une exception de chemin réservée aux IA.

## Robots à finalités multiples

Certains agents servent plusieurs finalités sous un même nom. `Amazonbot` améliore les produits d'Amazon et peut servir à l'entraînement ; `meta-externalagent` entraîne des modèles et indexe aussi du contenu ; l'archive de `CCBot` alimente la recherche scientifique autant que l'entraînement des IA. Dans ce préréglage, le générateur les traite comme des robots d'entraînement, ce qui garde la politique stricte, et vous indique quels agents tombent dans ce groupe pour que vous puissiez en repasser certains sur *autoriser* en mode personnalisé.

Les robots généralistes sont un autre cas : `Googlebot`, `Bingbot` et `Applebot` alimentent les moteurs de recherche et, à travers eux, des fonctions d'IA comme les Aperçus IA et Copilot. Ne les bloquez jamais pour empêcher l'entraînement IA : utilisez `Google-Extended`, `Applebot-Extended` et, pour Bing, les balises `noarchive`/`nocache` ou le groupe `__usage_ai-training`, que Bing prend en charge à partir de 2027.

## Vérifier le résultat

1. Collez le fichier dans le [testeur](page:tester) et regardez le tableau des robots : agents d'entraînement **Bloqué**, agents de recherche **Autorisé**.
2. Testez quelques URL importantes pour `OAI-SearchBot` et `PerplexityBot`.
3. Si vous utilisez Cloudflare, vérifiez aussi les réglages d'AI Crawl Control : un blocage au niveau du CDN l'emporte sur une autorisation dans robots.txt.
4. Pour les agents qui ignorent robots.txt, ajoutez des [règles serveur](page:server-rules).
