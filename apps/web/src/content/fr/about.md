---
title: "À propos d'AI Robots.txt Generator : qui, et pourquoi"
description: "Outil gratuit et indépendant pour choisir quels robots d'IA peuvent utiliser votre site : qui le fait, comment le registre est tenu, contact, notre robots.txt."
h1: "À propos de ce projet"
nav: "À propos"
lead: "Un ensemble d'outils gratuits et indépendants pour une décision à laquelle tout propriétaire de site est désormais confronté : quels robots d'IA peuvent lire vos pages, les citer ou s'en servir pour apprendre."
related: ["checker-bot", "bots", "privacy", "licenses"]
updated: "2026-11-04"
---

## De quoi s'agit-il ?

AI Robots.txt Generator (airobotstxtgenerator.com) réunit un générateur, un testeur, un registre des robots d'IA avec une page pour chacun, des règles serveur et des guides. Tout ce qui peut s'exécuter dans votre navigateur s'y exécute — génération, analyse, test des fichiers collés — et fonctionne hors ligne une fois la page chargée. Le seul composant serveur récupère le robots.txt public d'un site quand vous demandez une vérification en direct.

Le site fait partie d'un petit réseau d'outils gratuits, chacun dédié à une seule tâche, du même éditeur, dont ibangenerator.io et metasnitch.com. Pas de compte, pas d'accès payant aux outils, et aucune limite, si ce n'est une limitation du débit des vérifications en direct pour éviter les abus.

## Comment le registre est tenu à jour

Chaque entrée vérifiée est contrôlée par rapport à la documentation de l'opérateur et datée ; la page indique comment la vérification a été faite. Une tâche automatique hebdomadaire compare notre liste communautaire avec le projet open source [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt) et ouvre une pull request avec les changements, qui sont relus avant leur mise en ligne. L'analyseur est testé avec tous les cas de test de l'analyseur robots.txt open source de Google et avec 46 vrais fichiers robots.txt, dont nous avons comparé les résultats avec ceux de l'analyseur compilé de Google. Le code et les données sont ouverts : voir [Licences](page:licenses).

## Pourquoi notre propre robots.txt autorise tous les robots d'IA

Notre [robots.txt](/robots.txt) nomme GPTBot, ClaudeBot, PerplexityBot, Google-Extended et tous les autres agents du registre — et les autorise tous. Cela peut sembler étrange pour un site qui aide à bloquer les robots d'IA, mais cela découle du même principe : **décider par finalité**. Ce site existe pour répondre à des questions ; nous voulons que les assistants d'IA le lisent, le citent et nous envoient des visiteurs, et nous ne voyons pas d'objection à ce que nos explications se retrouvent dans les données d'entraînement d'un modèle si cela améliore les réponses. Un éditeur de journalisme payant ou d'œuvres originales décidera raisonnablement autrement. L'outil est conçu pour que l'une comme l'autre décision soit simple et correctement appliquée.

Nous publions aussi [/llms.txt](/llms.txt), [/llms-full.txt](/llms-full.txt), une version Markdown de chaque page (ajoutez `.md` à l'adresse) et l'ensemble du registre sous [/bots.json](/bots.json).

## Contact

Corrections du registre, rapports de bugs et questions : **{{contact}}**. Si vous exploitez un robot et que notre fiche à son sujet est erronée ou obsolète, envoyez-nous un lien vers votre documentation — nous mettons les fiches à jour sous quelques jours.

## En bref

- En ligne depuis : 4 novembre 2026
- Langues : English, Deutsch, Français, Español, Italiano, Nederlands, Polski, Português (Brasil), 日本語
- Publicité : aucune pour le moment ; si des annonces sont ajoutées, elles n'apparaîtront jamais dans les outils.
