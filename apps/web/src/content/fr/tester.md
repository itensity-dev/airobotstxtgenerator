---
title: "Tester robots.txt en ligne : vérifiez vos règles par robot"
description: "Testeur robots.txt gratuit : récupérez le robots.txt d'un site ou collez le vôtre, voyez quels robots IA sont autorisés et testez une URL. Compatible Google."
h1: "Testeur et validateur robots.txt"
nav: "Testeur robots.txt"
lead: "Récupérez le robots.txt de n'importe quel site ou collez un fichier, testez une URL pour n'importe quel robot, voyez lesquels des {{agents}} agents d'IA peuvent explorer le site et obtenez la liste des erreurs — avec la ligne exacte qui décide de chaque réponse."
steps:
  - "Saisissez un domaine ou n'importe quelle URL du site (seul l'hôte est utilisé) et cliquez sur **Récupérer le robots.txt** — ou passez à **Coller un robots.txt** pour tester un brouillon sans le mettre en ligne."
  - "Lisez la ligne d'état : Google traite une réponse **4xx** comme « pas de robots.txt » et une réponse **5xx** comme « ne rien explorer pour l'instant » ; les redirections, la taille et le type de contenu sont aussi vérifiés."
  - "Saisissez un chemin ou une URL complète et choisissez un robot : le résultat indique la **ligne décisive** et le groupe appliqué, et les met en évidence dans le fichier."
  - "Parcourez le tableau des robots d'IA : page d'accueil et votre chemin, chacun **Autorisé**, **Bloqué** ou **Partiel**, et si le robot a son propre groupe."
  - "Corrigez ce que signale le **rapport d'analyse**, puis testez à nouveau. Besoin d'un nouveau fichier ? Ouvrez le [générateur](page:home)."
capabilities:
  - feature: "Mêmes réponses que l'analyseur de Google"
    status: "yes"
    note: "Reprend tous les cas de test de l'analyseur robots.txt open source de Google et donne les mêmes verdicts que lui sur 46 vrais fichiers robots.txt de grands sites."
  - feature: "Récupération en direct de n'importe quel site"
    status: "yes"
    note: "Via notre vérificateur : hôtes http/https publics uniquement, ports standard, 5 redirections, 5 secondes et 512 Kio au maximum. Les résultats sont mis en cache 10 minutes."
  - feature: "Coller et tester hors ligne"
    status: "yes"
    note: "Le texte collé est analysé dans votre navigateur et n'est jamais envoyé."
  - feature: "Détection des erreurs"
    status: "yes"
    note: "Plus de 35 contrôles : syntaxe, fautes de frappe tolérées par Google, groupes qui écartent silencieusement les règles `*`, pièges des lignes vides, URL complètes dans les règles, limite de 500 Kio, syntaxe Content-Signal et Content-Usage, blocs gérés par Cloudflare."
  - feature: "Pages derrière une connexion ou un pare-feu"
    status: "no"
    note: "Nous récupérons uniquement `/robots.txt` depuis l'internet public, comme le ferait un robot. Un WAF ou un CDN peut quand même bloquer des robots que robots.txt autorise : vérifiez les réglages de votre CDN."
  - feature: "Balises meta robots et X-Robots-Tag"
    status: "no"
    note: "Les règles au niveau de la page ne sont pas vérifiées ici ; voir [balises meta IA](page:meta-tags)."
faq:
  - q: "Qu'est devenu l'outil de test du fichier robots.txt de Google ?"
    a: "Google a retiré l'outil de test du fichier robots.txt de la Search Console fin 2023 et l'a remplacé par un rapport robots.txt qui affiche le fichier récupéré et ses erreurs, mais ne permet pas de tester une URL pour un user-agent donné. Cette page comble ce manque et applique les mêmes règles de correspondance que l'analyseur open source de Google."
  - q: "Pourquoi une URL est-elle autorisée alors que `User-agent: *` l'interdit ?"
    a: "Parce que le robot choisi a son propre groupe. Un robot n'obéit qu'au groupe le plus spécifique qui le nomme : les règles sous `User-agent: *` cessent donc de s'appliquer à lui. Le rapport d'analyse signale chaque agent pour lequel une règle `*` est ainsi perdue."
  - q: "Que se passe-t-il si robots.txt renvoie 404, 403 ou 500 ?"
    a: "Google traite les réponses 4xx (sauf 429) comme s'il n'y avait pas de robots.txt : tout peut être exploré. Les réponses 5xx et 429 signifient « ne pas explorer pour l'instant » ; Google réessaie et, au bout d'environ 30 jours, peut utiliser une copie en cache ou considérer le site comme sans restriction."
  - q: "L'ordre des lignes Allow et Disallow compte-t-il ?"
    a: "Non. Le motif correspondant le plus long l'emporte, quel que soit l'ordre ; si un motif Allow et un motif Disallow ont la même longueur, Allow l'emporte. `*` correspond à n'importe quels caractères et `$` ancre la fin de l'URL."
  - q: "Mon robots.txt ou le domaine vérifié sont-ils enregistrés ?"
    a: "Le texte collé ne quitte jamais votre navigateur. Pour les vérifications en direct, notre serveur récupère le fichier et le garde en mémoire jusqu'à 10 minutes afin d'accélérer les vérifications répétées ; les domaines ne sont inscrits ni dans des journaux ni dans des outils de mesure d'audience."
  - q: "Quel user-agent le vérificateur envoie-t-il ?"
    a: "`Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)`. Il ne récupère que `/robots.txt`, une fois par vérification. Voir [notre robot de vérification](page:checker-bot)."
related: ["home", "bots", "server-rules", "guide-syntax", "guide-bad-bots"]
updated: "2026-11-04"
---

## Comment un robot lit robots.txt

Le testeur applique les règles de la [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) exactement comme l'analyseur open source de Google :

1. **Trouver le groupe.** Un groupe se compose d'une ou plusieurs lignes `User-agent` suivies de règles. Le robot utilise tous les groupes qui mentionnent son jeton de produit (sans tenir compte de la casse ni des numéros de version) et les fusionne. Ce n'est que si aucun groupe ne le nomme qu'il utilise `User-agent: *`. Les lignes vides ne terminent pas un groupe.
2. **Trouver les règles correspondantes.** Chaque motif `Allow` et `Disallow` est comparé au chemin et à la chaîne de requête de l'URL. Les motifs s'appliquent à partir du début du chemin ; `*` remplace n'importe quels caractères, un `$` final la fin de l'URL. La correspondance est sensible à la casse.
3. **Retenir la correspondance la plus longue.** La règle au motif le plus long l'emporte. Si un `Allow` et un `Disallow` ont la même longueur, `Allow` l'emporte. Sans règle correspondante, l'URL est autorisée.

Google tolère aussi les erreurs courantes — `Dissallow`, `User agent`, deux-points manquants — et ignore tout ce qui dépasse 500 Kio. Le testeur reproduit ce comportement et signale chaque cas, afin que les autres robots, parfois plus stricts, lisent votre fichier de la même manière.

## Fonctionnement des vérifications en direct

Notre serveur demande `https://your-host/robots.txt` (ou `http://` si la connexion HTTPS échoue), suit jusqu'à cinq redirections, s'arrête après 5 secondes ou 512 Kio et renvoie les octets bruts, pour que les marques d'ordre des octets et les encodages puissent être inspectés. Avant chaque connexion, il résout lui-même le nom d'hôte et refuse les adresses privées, locales et réservées. Tout le reste — analyse, correspondance, détection des erreurs — se fait dans votre navigateur.
