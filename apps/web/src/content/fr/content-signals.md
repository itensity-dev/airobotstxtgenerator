---
title: "Générateur Content-Signal et Content-Usage (préférences IA)"
description: "Rédigez des lignes Content-Signal (Cloudflare) et Content-Usage (IETF aipref) pour robots.txt et en-têtes HTTP, avec un point honnête sur leur prise en charge."
h1: "Générateur Content-Signal et Content-Usage"
nav: "Signaux de contenu"
lead: "Indiquez comment votre contenu peut être utilisé une fois récupéré — pour la recherche, comme source de réponses d'IA ou pour l'entraînement — dans les deux syntaxes proposées à ce jour : `Content-Signal`, de Cloudflare, et `Content-Usage`, issu du brouillon IETF aipref."
steps:
  - "Choisissez une préférence pour chaque usage : `search`, `ai-input` (réponses construites à partir de vos pages) et `ai-train`. Laissez-en un non défini pour n'exprimer aucune préférence."
  - "Copiez le bloc robots.txt. Les lignes Content-Signal se placent dans un groupe `User-agent`, en général `User-agent: *`."
  - "Copiez éventuellement la ligne `Content-Usage` ou l'en-tête HTTP du brouillon de l'IETF."
  - "N'oubliez pas que ces lignes expriment des préférences : bloquez les robots avec des règles `Disallow` si vous voulez qu'ils restent à l'écart."
capabilities:
  - feature: "Syntaxe Content Signals de Cloudflare"
    status: "yes"
    note: "`Content-Signal: search=yes, ai-input=yes, ai-train=no`, placée dans un groupe, avec le commentaire explicatif recommandé par Cloudflare."
  - feature: "Syntaxe IETF aipref"
    status: "yes"
    note: "`Content-Usage: train-ai=n` (règle robots.txt avec chemin facultatif) et l'en-tête HTTP `Content-Usage`, selon draft-ietf-aipref-attach."
  - feature: "Effet garanti"
    status: "no"
    note: "Aucune des deux syntaxes n'est un standard. Google a indiqué que Content-Signal n'avait aucun effet sur ses robots ; OpenAI, Anthropic et Perplexity ne le mentionnent pas dans leur documentation."
faq:
  - q: "Qu'est-ce que Content-Signal ?"
    a: "Une extension de robots.txt publiée par Cloudflare en septembre 2025 sous le nom de Content Signals Policy. Elle nomme trois usages — `search`, `ai-input` et `ai-train` — chacun réglé sur `yes` ou `no`. Cloudflare ajoute `search=yes, ai-train=no` au robots.txt géré de millions de domaines."
  - q: "Qu'est-ce que Content-Usage ?"
    a: "La syntaxe élaborée par le groupe de travail AI Preferences de l'IETF (aipref) : un vocabulaire avec les catégories `train-ai`, `ai-use` et `search` et les valeurs `y` ou `n`, associé au contenu via une règle robots.txt ou un en-tête HTTP. Les brouillons sont encore en cours ; il n'existe pas encore de RFC."
  - q: "Faut-il utiliser les deux ?"
    a: "Elles ne se contredisent pas, et aucune n'est encore largement respectée. Si vous utilisez Cloudflare, Content-Signal figure déjà dans votre robots.txt géré. Ajouter Content-Usage coûte une ligne et suit la voie la plus susceptible de devenir un standard."
  - q: "Et `__usage_ai-training` ?"
    a: "C'est une proposition distincte, d'octobre 2026 : un groupe robots.txt (`User-agent: __usage_ai-training` avec `Disallow: /`) que plusieurs entreprises d'IA ont dit vouloir traiter comme un opt-out de l'entraînement. Contrairement à Content-Signal, il utilise des règles Allow et Disallow ordinaires. Voir sa [fiche dans le registre](bot:usage-ai-training)."
related: ["home", "tdmrep", "meta-tags", "guide-eu-ai-act", "bots"]
updated: "2026-11-04"
---

## Trois générations de préférences IA dans robots.txt

1. **Noms de robots** (depuis 2023) : bloquer `GPTBot`, `ClaudeBot`, `Google-Extended`… une entreprise à la fois. Fiable pour ceux qui respectent robots.txt, mais il faut connaître chaque nom.
2. **Signaux fondés sur l'usage** (depuis 2025) : `Content-Signal` et `Content-Usage` décrivent des usages plutôt que des robots. Ils sont rattachés à un groupe et disent ce qu'il peut advenir du contenu récupéré de toute façon — par exemple par un robot de recherche généraliste.
3. **Groupe d'opt-out partagé** (depuis 2026) : `__usage_ai-training` s'adresse comme un robot, mais il est compris par plusieurs entreprises à la fois.

Tant qu'aucun de ces mécanismes n'est devenu un standard, le fichier le plus sûr utilise les trois : les noms des robots que vous connaissez, un groupe partagé pour les entreprises qui le prennent en charge et une ligne fondée sur l'usage pour le reste. Le [générateur](page:home) se charge des deux premiers ; cette page ajoute le troisième.
