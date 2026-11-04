---
title: "Opt-out IA : s'opposer à la fouille de textes et de données"
description: "S'opposer à la fouille de textes et de données via robots.txt : directive DAMUN, CPI L. 122-5-3, AI Act et code de bonnes pratiques. Pas un avis juridique."
h1: "Robots IA et AI Act : ce que signifie un opt-out"
nav: "Robots IA et AI Act"
lead: "Le droit de l'UE permet à chacun de pratiquer la fouille de textes et de données sur les contenus licitement accessibles, quelle qu'en soit la finalité, sauf si le titulaire des droits s'y est opposé de manière lisible par machine. Depuis août 2025, les fournisseurs de modèles d'IA doivent montrer qu'ils respectent ces oppositions — et le code de bonnes pratiques cite robots.txt."
related: ["tdmrep", "content-signals", "home", "guide-training-search"]
updated: "2026-11-04"
faq:
  - q: "Un Disallow dans robots.txt est-il une opposition juridiquement valable ?"
    a: "Le code de bonnes pratiques traite robots.txt, tel que défini par la RFC 9309, comme un protocole que les signataires doivent respecter, et des tribunaux se sont penchés sur les réserves lisibles par machine, mais l'effet juridique dépend du droit national et des faits de chaque affaire. Ceci est une information, et non un conseil juridique."
  - q: "L'AI Act s'applique-t-il aux entreprises d'IA établies hors de l'UE ?"
    a: "Les obligations s'appliquent aux fournisseurs qui mettent des modèles d'IA à usage général sur le marché de l'UE, quel que soit leur lieu d'établissement. Leur politique en matière de droit d'auteur doit couvrir les réserves exprimées par les titulaires de droits de l'UE."
  - q: "Que dois-je publier ?"
    a: "Un robots.txt qui interdit les robots d'entraînement que vous refusez, éventuellement un fichier TDMRep, et une mention dans vos conditions d'utilisation. Conservez des copies datées de votre robots.txt pour pouvoir prouver depuis quand l'opposition était en place."
---

*Cette page est une information, et non un conseil juridique.*

## Deux textes, un seul mécanisme

**La directive (UE) 2019/790 sur le droit d'auteur dans le marché unique numérique (directive DAMUN), article 4**, autorise la fouille de textes et de données sur les œuvres auxquelles on a licitement accès — la base juridique sur laquelle repose une grande partie de l'entraînement des IA dans l'UE —, sauf si le titulaire des droits a **expressément réservé** cet usage. Pour les contenus mis à la disposition du public en ligne, cette réserve doit être exprimée « de manière appropriée, notamment par des procédés lisibles par machine ». Tous les États membres ont transposé cette règle dans leur droit d'auteur.

**Le règlement sur l'IA (RIA, « AI Act »), article 53, paragraphe 1, point c)**, impose aux fournisseurs de modèles d'IA à usage général de mettre en place une politique visant à respecter le droit d'auteur de l'Union et, en particulier, à identifier et respecter les réservations de droits exprimées au titre de l'article 4, paragraphe 3, de la directive DAMUN, « y compris au moyen de technologies de pointe ». Ces obligations s'appliquent depuis le **2 août 2025** ; le Bureau de l'IA peut les faire respecter par des amendes à partir du **2 août 2026**.

## En France : l'article L. 122-5-3 du CPI

La France a transposé l'article 4 à l'**article L. 122-5-3 du code de la propriété intellectuelle (CPI)**, consacré à la **fouille de textes et de données**. Son paragraphe III autorise la fouille à toutes fins, sauf si l'auteur « s'y est opposé de manière appropriée, notamment par des procédés lisibles par machine » pour les contenus mis à la disposition du public en ligne. L'article **R. 122-28** précise que cette opposition « n'a pas à être motivée et peut être exprimée par tout moyen ». Pour les bases de données, la règle correspondante figure à l'article L. 342-3. Le vocabulaire français parle donc d'**opposition** (ou de « droit d'opposition ») là où l'anglais dit *opt-out* ; un `Disallow` visant les robots d'entraînement dans robots.txt en est la forme lisible par machine la plus répandue.

## Ce que dit le code de bonnes pratiques

Le code de bonnes pratiques pour l'IA à usage général (chapitre droit d'auteur, juillet 2025) est le moyen par lequel la plupart des grands fournisseurs démontrent leur conformité. Les signataires s'engagent notamment à :

1. utiliser des robots d'exploration qui **lisent et respectent robots.txt tel que défini par la RFC 9309** et les versions ultérieures de ce standard ;
2. identifier et respecter **d'autres protocoles appropriés, lisibles par machine**, pour la réservation des droits — adoptés par des organismes de normalisation ou largement utilisés par les titulaires de droits ;
3. publier des informations sur leurs robots d'exploration et sur leur prise en compte de robots.txt.

La Commission a mené une consultation sur les autres protocoles à retenir ; à l'heure où nous écrivons, aucune liste officielle n'a été publiée.

## Ce que cela signifie en pratique

- Un `Disallow` visant le robot d'entraînement d'un fournisseur (par exemple `GPTBot`, `ClaudeBot`, `MistralAI-Training`, `CCBot`) est la réserve lisible par machine la plus largement reconnue.
- Un jeton comme `Google-Extended` ou `Applebot-Extended` exprime la réserve sans vous retirer de la recherche.
- **robots.txt ne réserve vos droits qu'à l'égard des robots que vous nommez.** Un robot d'entraînement que vous ne connaissez pas n'est pas couvert. Les groupes partagés comme `__usage_ai-training` et les lignes fondées sur l'usage comme `Content-Usage: train-ai=n` visent à combler cette lacune ; [TDMRep](page:tdmrep) est un protocole conçu spécifiquement pour les réserves de l'article 4.
- Une déclaration en langage naturel dans des conditions d'utilisation peut ne pas suffire pour les contenus publiés en ligne ; les tribunaux ont recherché une forme lisible par machine.

## Une configuration défendable

1. Un robots.txt qui bloque vos robots d'entraînement — utilisez le [générateur](page:home).
2. Éventuellement un `tdmrep.json` et une ligne `Content-Usage`.
3. Une phrase dans vos conditions d'utilisation réservant la fouille de textes et de données au titre de l'article 4, paragraphe 3, de la directive DAMUN (article L. 122-5-3 du CPI en droit français).
4. Une archive datée de votre robots.txt (par exemple une copie dans un système de gestion de versions).
