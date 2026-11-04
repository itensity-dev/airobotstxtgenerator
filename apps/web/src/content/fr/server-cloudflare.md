---
title: "Bloquer les robots IA avec une règle WAF Cloudflare"
description: "Règle personnalisée du WAF Cloudflare pour bloquer GPTBot, ClaudeBot, Bytespider et autres robots d'IA par User-Agent, robots.txt exclu. Et AI Crawl Control ?"
h1: "Bloquer les robots IA avec une règle WAF Cloudflare"
nav: "Cloudflare WAF"
lead: "Une expression de règle personnalisée pour le WAF de Cloudflare qui bloque les robots d'IA de votre choix par User-Agent, garde `/robots.txt` accessible et respecte la limite de 4 096 caractères de Cloudflare."
steps:
  - "Sélectionnez les agents et copiez l'expression."
  - "Dans le tableau de bord Cloudflare, ouvrez votre domaine → **Security** → **WAF** → **Custom rules** → **Create rule** → **Edit expression**, puis collez l'expression."
  - "Choisissez l'action **Block** (ou **Managed Challenge** si vous préférez) et déployez la règle."
  - "Au bout d'une journée, consultez **Security → Events** pour voir quels agents ont été bloqués."
capabilities:
  - feature: "Offre gratuite"
    status: "yes"
    note: "Les règles personnalisées avec `contains` et `lower()` sont disponibles dans toutes les offres ; l'opérateur d'expression régulière `matches` exige une offre payante, l'outil ne l'utilise donc pas."
  - feature: "Contrôle de la longueur de l'expression"
    status: "yes"
    note: "Cloudflare autorise 4 096 caractères par expression ; l'outil vous avertit et propose de scinder la règle."
  - feature: "Remplace AI Crawl Control"
    status: "no"
    note: "AI Crawl Control, l'outil de Cloudflare, bloque les robots d'IA vérifiés par catégorie et peut écrire un bloc géré dans votre robots.txt. Utilisez cette règle pour les agents que Cloudflare ne couvre pas ou si vous voulez un contrôle précis."
faq:
  - q: "Cloudflare bloque déjà les robots d'IA : ai-je besoin de cette règle ?"
    a: "Peut-être pas. Depuis juillet 2025, les nouveaux domaines bloquent les robots d'IA par défaut, et depuis 2026 Cloudflare propose des réglages distincts Search, Agent et Training. Sa liste couvre les bots vérifiés. Une règle personnalisée ajoute des agents hors de cette liste et bloque par nom, que le bot soit vérifié ou non."
  - q: "Pourquoi robots.txt est-il exclu ?"
    a: "Pour que les robots puissent toujours lire votre politique. Un robot qui ne peut pas récupérer robots.txt ne peut pas apprendre qu'il est interdit."
  - q: "Cloudflare a ajouté des lignes à mon robots.txt : de quoi s'agit-il ?"
    a: "C'est le robots.txt géré de Cloudflare (Bot Preference Sync) : un bloc entre des commentaires BEGIN et END, placé avant vos propres règles, avec des lignes `Content-Signal` et `Disallow` pour les robots d'IA. Collez le fichier en ligne dans le [testeur](page:tester) pour voir comment se comporte l'ensemble."
related: ["server-rules", "content-signals", "tester", "guide-bad-bots"]
updated: "2026-11-04"
---

## À propos de l'expression

Chaque condition s'écrit `(lower(http.user_agent) contains "gptbot")` : le User-Agent est converti en minuscules, puis on y cherche le nom du bot ; la casse n'a donc pas d'importance. Les conditions sont reliées par `or`, et l'ensemble est combiné avec `and not (http.request.uri.path eq "/robots.txt")`. Si vous utilisez aussi les fonctions de bots vérifiés de Cloudflare, vous pouvez ajouter `and not cf.client.bot` pour laisser les bots vérifiés aux réglages propres de Cloudflare.
