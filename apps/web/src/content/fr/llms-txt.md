---
title: "Générateur llms.txt gratuit : créez votre fichier llms.txt"
description: "Générateur llms.txt gratuit : créez un llms.txt au format llmstxt.org (H1, résumé, sections de liens Markdown), avec validation, directement dans le navigateur."
h1: "Générateur llms.txt"
nav: "Générateur llms.txt"
lead: "Créez un fichier `llms.txt` au format proposé sur llmstxt.org — un titre, un résumé d'un paragraphe et des sections de liens vers les pages les plus utiles aux modèles de langage — et vérifiez sa structure au fil de la saisie."
steps:
  - "Saisissez le nom du site ou du projet ; il devient l'unique H1."
  - "Rédigez un court résumé : ce qu'est le site et ce que le fichier répertorie. Il devient la citation (blockquote) que les modèles lisent en premier."
  - "Ajoutez des sections (`## Docs`, `## Guides`…) avec des liens : titre, URL absolue et une description facultative d'une ligne. Pointez vers les versions Markdown des pages quand elles existent."
  - "Marquez les sections moins importantes comme **facultatives** : les lecteurs qui disposent de peu de contexte peuvent les sauter."
  - "Téléchargez le fichier et déposez-le à la racine du site sous `/llms.txt`. Vous pouvez aussi publier `/llms-full.txt` avec le texte intégral."
capabilities:
  - feature: "Structure llmstxt.org"
    status: "yes"
    note: "H1, résumé en citation, notes facultatives, sections H2 avec listes de liens Markdown, section `Optional`."
  - feature: "Validation"
    status: "yes"
    note: "Vérifie l'unicité du H1, les sections H2 et les cibles de liens absolues ou relatives à la racine."
  - feature: "Exploration de votre site pour remplir la liste"
    status: "no"
    note: "C'est vous qui choisissez les pages ; rien n'est récupéré."
  - feature: "Effet sur le classement ou les réponses des IA"
    status: "no"
    note: "llms.txt est une proposition ; aucun grand moteur de recherche ni aucune grande entreprise d'IA n'a déclaré utiliser ce fichier pour le classement ou pour des décisions d'entraînement."
faq:
  - q: "Qu'est-ce que llms.txt ?"
    a: "Un fichier Markdown placé à la racine d'un site, proposé par Jeremy Howard en septembre 2024 sur llmstxt.org, qui donne aux modèles de langage une carte choisie du site : ce qu'il est et quelles pages lire. Ce n'est ni un standard ni un fichier de contrôle d'accès."
  - q: "llms.txt, est-ce la même chose que robots.txt ?"
    a: "Non. robots.txt indique aux robots ce qu'ils peuvent récupérer ; llms.txt suggère ce qui vaut la peine d'être lu. Une page listée dans llms.txt mais interdite dans robots.txt reste interdite pour les robots qui respectent robots.txt."
  - q: "Les entreprises d'IA lisent-elles llms.txt ?"
    a: "Certains outils et assistants de programmation IA le lisent quand un utilisateur les dirige vers un site ; des plateformes de documentation le génèrent automatiquement. Aucune grande entreprise d'IA ne s'est engagée à l'utiliser pour l'entraînement ou la recherche. Le publier coûte peu."
  - q: "Faut-il pointer vers des pages HTML ou Markdown ?"
    a: "Vers du Markdown si possible : c'est ce que les modèles de langage traitent le mieux. Ce site publie une version `.md` de chaque page et les référence dans son propre [llms.txt](/llms.txt)."
related: ["home", "content-signals", "meta-tags", "guide-training-search"]
updated: "2026-11-04"
---

## Ce que contient un bon llms.txt

Restez concis et sélectif : les 10 à 40 pages dont un modèle a besoin pour comprendre votre produit ou votre contenu, chacune avec une description d'une ligne qui dit ce que le lecteur y trouvera. Placez la documentation de référence en premier, les exemples ensuite, et l'historique, les journaux des modifications ou les pages juridiques sous **Optional**. Si votre documentation est longue, publiez aussi `llms-full.txt` — la même structure avec le texte intégral des pages — et mentionnez-le dans le résumé.

Ce site applique ses propres conseils : voir [/llms.txt](/llms.txt) et [/llms-full.txt](/llms-full.txt) ; chaque page a en outre un jumeau Markdown à la même adresse, suivie de `.md`.
