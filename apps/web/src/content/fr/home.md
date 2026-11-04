---
title: "Générateur robots.txt IA : bloquez GPTBot et les robots IA"
description: "Générateur robots.txt gratuit : bloquez l'entraînement IA (GPTBot, ClaudeBot, Google-Extended, CCBot) en restant dans la recherche IA. Fichier vérifié RFC 9309."
h1: "Générateur de robots.txt pour les robots IA"
nav: "Générateur robots.txt"
lead: "Choisissez le type de site et l'objectif : le générateur écrit un robots.txt couvrant les {{all}} robots d'IA et jetons documentés, explique chaque ligne et vérifie le résultat avec un analyseur conforme à la RFC 9309 avant de vous le proposer."
steps:
  - "Choisissez le **type de site** : il fixe des chemins de départ pertinents (une boutique ferme `/cart/` et `/checkout/` à tous les robots, un site de presse ferme `/premium/` aux robots d'IA)."
  - "Choisissez l'**objectif** : pas d'entraînement IA mais rester dans la recherche IA, aucune IA, tout autoriser, ou décider robot par robot."
  - "Ajoutez des **exceptions de chemin**, par exemple pour ouvrir `/blog/` à tous les robots d'IA ou leur fermer `/members/`."
  - "Copiez ou téléchargez le fichier et déposez-le sous le nom `robots.txt` à la racine de chaque hôte (`https://example.com/robots.txt`). Vous avez déjà un fichier ? Utilisez **Compléter mon robots.txt** : l'outil ajoute la section IA et prouve que vos règles existantes fonctionnent toujours à l'identique."
  - "Testez le fichier en ligne avec le [testeur robots.txt](page:tester) et, pour les robots qui ignorent robots.txt, ajoutez des [règles serveur](page:server-rules)."
capabilities:
  - feature: "Liste des robots d'IA"
    status: "yes"
    note: "{{all}} agents et jetons, avec la documentation de l'opérateur et la date de la dernière vérification ; {{community}} de plus, issus de la liste communautaire ai.robots.txt, sur demande."
  - feature: "Préréglages par finalité"
    status: "yes"
    note: "Entraînement, recherche IA, accès demandés par un utilisateur et jetons propres à robots.txt sont traités séparément."
  - feature: "Autovérification"
    status: "yes"
    note: "Chaque fichier est analysé selon les mêmes règles que l'analyseur open source de Google ; chaque agent est testé sur `/`, sur vos chemins d'exception et sur vos chemins fermés."
  - feature: "Fusion avec un fichier existant"
    status: "yes"
    note: "Ajoute une section IA, affiche un diff et compare les anciennes et nouvelles décisions pour chaque agent déjà présent dans votre fichier."
  - feature: "Lignes Content-Signal"
    status: "partly"
    note: "`Content-Signal` facultatif pour le groupe `*`. C'est une proposition de Cloudflare, pas un standard."
  - feature: "Arrêter les robots qui ignorent robots.txt"
    status: "no"
    note: "robots.txt est une demande. Pour l'imposer, utilisez des [règles serveur](page:server-rules) ou un WAF."
  - feature: "Inscription, envoi ou suivi de vos saisies"
    status: "no"
    note: "La génération s'exécute dans votre navigateur et fonctionne hors ligne ; vos chemins et vos fichiers ne sont envoyés nulle part."
faq:
  - q: "Comment bloquer l'entraînement IA tout en restant visible dans la recherche de ChatGPT, Claude et Perplexity ?"
    a: "Bloquez les robots et jetons d'entraînement — `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `meta-externalagent` et d'autres — et laissez autorisés les agents de recherche (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`). C'est le premier objectif proposé par le générateur. Détails dans le guide [Bloquer l'entraînement IA sans disparaître des réponses IA](page:guide-training-search)."
  - q: "Bloquer Google-Extended retire-t-il mon site de la recherche Google ou des Aperçus IA ?"
    a: "Non. `Google-Extended` est un jeton robots.txt, pas un robot : il détermine si Google peut utiliser le contenu pour l'entraînement et l'ancrage (grounding) de Gemini. La recherche Google, Aperçus IA (AI Overviews) et Mode IA compris, utilise `Googlebot`."
  - q: "Pourquoi le fichier généré répète-t-il certaines règles ?"
    a: "Un robot nommé dans son propre groupe ignore entièrement le groupe `User-agent: *`. Quand les robots d'IA ont besoin de leur propre groupe (par exemple pour leur fermer `/premium/`), le générateur recopie vos règles `*` dans ce groupe pour que rien ne se perde."
  - q: "Toutes les entreprises d'IA respecteront-elles ce fichier ?"
    a: "La plupart des grands opérateurs déclarent que leurs robots respectent robots.txt. Les agents qui agissent à la demande d'un utilisateur (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`) peuvent ne pas le faire, et certains robots ne publient aucune déclaration. Le registre des robots indique la déclaration de chaque opérateur, avec un lien vers la source."
  - q: "Un Disallow dans robots.txt vaut-il opposition à la fouille de textes et de données ?"
    a: "C'est la forme d'opposition lisible par machine la plus largement reconnue. En France, l'article L. 122-5-3 du code de la propriété intellectuelle permet à l'auteur de s'opposer à la fouille de textes et de données de ses contenus en ligne « notamment par des procédés lisibles par machine », et le code de bonnes pratiques de l'AI Act engage les signataires à respecter robots.txt selon la RFC 9309. Explications dans le guide [Robots IA et AI Act](page:guide-eu-ai-act). Information, et non conseil juridique."
  - q: "Où placer le fichier robots.txt ?"
    a: "À la racine de chaque hôte et de chaque protocole à couvrir : `https://example.com/robots.txt` ne s'applique pas à `https://shop.example.com/`. Le fichier doit être en texte brut, encodé en UTF-8, et peser moins de 500 Kio pour Google."
  - q: "Mes saisies sont-elles enregistrées ?"
    a: "Non. Le générateur fonctionne entièrement dans votre navigateur. Nous comptons seulement qu'un fichier a été généré et quel préréglage a été utilisé, sans vos chemins ni votre texte."
related: ["tester", "bots", "server-rules", "guide-training-search", "llms-txt"]
updated: "2026-11-04"
---

## Comment le générateur décide

Chaque agent du registre a une **finalité**, tirée de la documentation de son opérateur :

- **Entraînement IA** — collecte des pages susceptibles de servir à entraîner des modèles (`GPTBot`, `ClaudeBot`, `CCBot`, `MistralAI-Training`).
- **Jetons robots.txt** — pas des robots du tout, mais des noms qui déterminent comment le contenu récupéré par un robot généraliste peut être utilisé (`Google-Extended`, `Applebot-Extended`, `__usage_ai-training`).
- **Recherche IA** — indexe des pages pour qu'un produit d'IA puisse les citer et les lier (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`).
- **Accès à la demande d'un utilisateur** — ouvre une page parce qu'une personne l'a demandé à un assistant (`ChatGPT-User`, `Claude-User`, `Perplexity-User`).
- **Robots généralistes** — `Googlebot`, `Bingbot`, `Applebot` et les robots d'aperçu de liens ne sont jamais bloqués par un préréglage : les bloquer vous retirerait de la recherche classique ou casserait les aperçus de liens.

L'objectif détermine quelles finalités sont fermées. Le générateur écrit ensuite un groupe par finalité, pour que le fichier reste lisible, et ajoute vos exceptions de chemin à chaque groupe.

## Pourquoi le fichier est vérifié avant que vous ne le voyiez

robots.txt comporte quelques règles qui surprennent : la **règle la plus longue l'emporte**, **Allow gagne en cas d'égalité**, un robot qui a **son propre groupe ignore `User-agent: *`**, et **les lignes vides ne séparent pas les groupes**. Une fois le fichier construit, le générateur l'analyse avec le même algorithme que l'analyseur open source de Google (nous le testons avec les cas de test de Google et 46 vrais fichiers robots.txt) et vérifie, pour chaque agent et chaque chemin pertinent, que la réponse correspond à la politique choisie. Le tampon sous le fichier indique le nombre de vérifications effectuées.

## Ce que robots.txt ne peut pas faire

robots.txt est une demande publique, définie dans la [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html). Les robots bien élevés la respectent ; les autres non, et n'importe qui peut envoyer un faux User-Agent. Pour imposer vos choix, bloquez au niveau du serveur ou du CDN — la page [règles serveur](page:server-rules) génère des règles nginx, Apache, Caddy et Cloudflare à partir du même registre — et vérifiez les robots par IP ou DNS inverse.
