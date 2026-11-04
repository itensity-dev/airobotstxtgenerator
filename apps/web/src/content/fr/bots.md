---
title: "Liste des robots IA : user-agents et comment les bloquer"
description: "Registre de {{all}} robots d'IA et jetons robots.txt (GPTBot, ClaudeBot, Google-Extended…) : opérateur, finalité, respect de robots.txt, IP et sources."
h1: "Registre des robots d'IA"
nav: "Registre des robots"
lead: "Tous les robots d'exploration IA, agents d'IA et jetons de contrôle robots.txt que nous avons pu documenter : qui les exploite, ce qu'ils collectent, si leur opérateur déclare respecter robots.txt, comment les vérifier — avec un lien vers la source et la date de notre dernière vérification."
steps:
  - "Cherchez dans le registre par nom ou par entreprise, ou parcourez-le par opérateur."
  - "Ouvrez la page d'un agent pour voir son User-Agent, son jeton robots.txt, sa liste d'IP et des règles prêtes à copier."
  - "Décidez grâce à la colonne Finalité : les robots d'entraînement peuvent en général être bloqués sans perte de visibilité ; la recherche IA et les agents utilisateurs apportent des citations et des visiteurs."
  - "Créez un fichier complet avec le [générateur](page:home) ou testez votre fichier actuel avec le [testeur](page:tester)."
capabilities:
  - feature: "Une source pour chaque entrée"
    status: "yes"
    note: "Chaque entrée vérifiée renvoie à la documentation de l'opérateur ; lorsqu'il n'en existe pas, la page le précise."
  - feature: "Date de la dernière vérification"
    status: "yes"
    note: "Affichée pour chaque agent, avec la méthode de vérification (page consultée ou lue via un index de recherche)."
  - feature: "Lisible par machine"
    status: "yes"
    note: "L'ensemble du registre est disponible sous [/bots.json](/bots.json), sous licence CC BY 4.0."
  - feature: "Mise à jour hebdomadaire"
    status: "yes"
    note: "Une tâche hebdomadaire compare la liste communautaire avec ai.robots.txt et ouvre une pull request ; les entrées vérifiées sont relues à la main."
  - feature: "Preuve qu'une requête est authentique"
    status: "partly"
    note: "Uniquement si l'opérateur publie des plages d'IP, des noms d'hôte pour le DNS inverse ou des signatures. N'importe qui peut falsifier une chaîne User-Agent."
faq:
  - q: "Quels robots d'IA bloquer ?"
    a: "Cela dépend de votre objectif. Pour tenir votre contenu à l'écart de l'entraînement des IA tout en restant visible dans leurs réponses, bloquez les robots et jetons d'entraînement (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent, Bytespider, MistralAI-Training) et autorisez les agents de recherche (OAI-SearchBot, Claude-SearchBot, PerplexityBot). Le [guide](page:guide-training-search) détaille les compromis."
  - q: "Quelle différence entre un robot d'exploration et un jeton robots.txt ?"
    a: "Un robot envoie des requêtes avec son propre User-Agent. Un jeton comme Google-Extended ou Applebot-Extended ne visite jamais votre site : c'est un nom, dans robots.txt, qui indique à l'opérateur comment le contenu récupéré par son robot habituel peut être utilisé. Les jetons ne se contrôlent que dans robots.txt, pas avec des règles serveur."
  - q: "Pourquoi certains agents ignorent-ils robots.txt ?"
    a: "Les agents qui agissent à la demande d'une personne — ChatGPT-User, Perplexity-User, Google-Agent, meta-externalfetcher — sont traités par leurs opérateurs comme un navigateur et peuvent ne pas respecter robots.txt. Certains robots ne publient aucune politique. Pour ceux-là, bloquez au niveau du serveur ou du CDN."
  - q: "La liste est-elle à jour ?"
    a: "Les entrées vérifiées ont été contrôlées par rapport à la documentation des opérateurs le {{updated}} ; chaque page affiche sa propre date. La liste communautaire est synchronisée chaque semaine avec ai.robots.txt."
  - q: "Puis-je réutiliser les données ?"
    a: "Oui. Le registre est publié en JSON sous /bots.json, sous licence CC BY 4.0 — merci de citer airobotstxtgenerator.com. Les entrées communautaires proviennent du projet ai.robots.txt, sous licence MIT."
related: ["home", "tester", "server-rules", "guide-training-search"]
updated: "2026-11-04"
---

## Comment le registre est construit

Chaque entrée vérifiée part de la documentation de l'opérateur : OpenAI, Anthropic, Google, Apple, Perplexity, Meta, Amazon, Mistral, DuckDuckGo, Microsoft, Common Crawl et d'autres publient des pages qui décrivent leurs robots. Nous en tirons le jeton robots.txt, une chaîne User-Agent documentée, la finalité, la déclaration de l'opérateur au sujet de robots.txt, les listes d'IP ou noms d'hôte publiés et la date de notre vérification. Quand un opérateur ne publie rien — ByteDance pour Bytespider, par exemple —, l'entrée est signalée comme fondée sur des observations indépendantes.

Les **finalités** suivent les catégories qu'utilisent désormais les opérateurs et Cloudflare : *entraînement IA*, *recherche IA* (indexer et citer), *accès à la demande d'un utilisateur* (un assistant qui ouvre une page pour une personne) et *jetons robots.txt*. Les robots généralistes comme Googlebot, Bingbot et Applebot sont listés pour référence, car de nombreuses fonctions d'IA s'appuient sur eux.

La **liste communautaire**, sous le tableau principal, provient du projet ouvert [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt). Elle est plus large mais n'est pas vérifiée entrée par entrée ; certains de ses noms sont démentis par les opérateurs eux-mêmes (Cohere dit n'exploiter aucun robot, Brave n'a pas de User-Agent distinct, le robot d'Exa s'appelle ExaSearchBot).
