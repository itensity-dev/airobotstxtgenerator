---
title: "Générateur TDMRep : tdmrep.json et en-tête tdm-reservation"
description: "Générez tdmrep.json, les en-têtes tdm-reservation et tdm-policy et les balises meta pour réserver la fouille de textes et de données (art. 4 directive DAMUN)."
h1: "Générateur TDMRep"
nav: "TDMRep"
lead: "Créez les fichiers du TDM Reservation Protocol (TDMRep) — une spécification d'un W3C Community Group permettant d'indiquer, sous une forme lisible par machine, que vous réservez vos droits de fouille de textes et de données au titre du droit d'auteur de l'UE."
steps:
  - "Choisissez `tdm-reservation: 1` pour réserver vos droits, ou `0` pour indiquer que vous ne les réservez pas."
  - "Ajoutez éventuellement l'URL d'une `tdm-policy` : un document lisible par machine qui explique comment obtenir une licence."
  - "Publiez `/.well-known/tdmrep.json` à la racine de votre site, et/ou ajoutez les en-têtes HTTP ou les balises meta HTML."
  - "Conservez les règles robots.txt pour les robots que vous voulez arrêter : TDMRep réserve des droits, il ne bloque rien."
capabilities:
  - feature: "Fichier pour tout le site"
    status: "yes"
    note: "`/.well-known/tdmrep.json` avec `location`, `tdm-reservation` et `tdm-policy`."
  - feature: "En-têtes par réponse et balises meta"
    status: "yes"
    note: "`tdm-reservation` et `tdm-policy` en en-têtes HTTP (extraits nginx et Apache) et en balises HTML `<meta>`."
  - feature: "Conseil juridique"
    status: "no"
    note: "L'efficacité d'une réserve dépend du droit national et des faits. Cette page est une information, et non un conseil juridique."
faq:
  - q: "Qu'est-ce que TDMRep ?"
    a: "Le TDM Reservation Protocol, publié par un W3C Community Group (rapport final de 2024). Il définit comment un titulaire de droits peut exprimer — dans un fichier, un en-tête HTTP ou du HTML — que la fouille de textes et de données de son contenu est réservée, comme le permet l'article 4, paragraphe 3, de la directive DAMUN (2019/790)."
  - q: "Ai-je besoin de TDMRep si je bloque déjà les robots d'IA dans robots.txt ?"
    a: "robots.txt dit qui peut récupérer ; TDMRep dit ce qu'on peut faire du contenu, quel que soit celui qui l'a récupéré. Le code de bonnes pratiques de l'UE pour l'IA à usage général engage les signataires à respecter robots.txt et d'autres protocoles appropriés lisibles par machine : publier les deux, c'est assurer ses arrières."
  - q: "Quelles entreprises d'IA lisent TDMRep ?"
    a: "La prise en charge est limitée et rarement documentée. Des éditeurs européens et certains fournisseurs de données l'utilisent ; la plupart des grands développeurs d'IA ne documentent que robots.txt. Considérez-le comme une déclaration supplémentaire et normalisée de votre réserve."
related: ["content-signals", "guide-eu-ai-act", "meta-tags", "home"]
updated: "2026-11-04"
---

## La place de TDMRep

La directive DAMUN autorise la fouille de textes et de données sur les contenus licitement accessibles, sauf si le titulaire des droits l'a **expressément réservée** « de manière appropriée, notamment par des procédés lisibles par machine » pour les contenus publiés en ligne. robots.txt est l'un de ces procédés ; TDMRep en est un autre, conçu spécialement à cet effet. Un fichier `tdmrep.json` peut couvrir tout le site ou certaines parties (motifs `location`), les en-têtes peuvent couvrir n'importe quel type de fichier, PDF et images compris, et les balises meta fonctionnent quand vous ne contrôlez que le HTML.
