---
title: "AI-bots blokkeren met .htaccess (Apache mod_rewrite)"
description: ".htaccess-regels om GPTBot, ClaudeBot, CCBot, Bytespider en andere AI-crawlers op Apache te blokkeren met mod_rewrite: 403 voor AI-bots, robots.txt bereikbaar."
h1: "AI-bots blokkeren met .htaccess op Apache"
nav: "Apache .htaccess"
lead: "Drie `mod_rewrite`-regels in `.htaccess` weigeren AI-crawlers op User-Agent met een 403, slaan `/robots.txt` over en werken op shared hosting zonder toegang tot de hoofdconfiguratie."
steps:
  - "Selecteer de agenten en kopieer de regels."
  - "Open `.htaccess` in je document root (maak het bestand aan als het nog niet bestaat) en plak het blok bovenaan, vóór de rewriteregels van WordPress of je framework."
  - "Opslaan. Opnieuw starten is niet nodig — Apache leest `.htaccess` bij elk verzoek."
  - "Test met `curl -I -A \"ClaudeBot\" https://example.com/` (verwacht: 403) en `curl -I https://example.com/robots.txt` (verwacht: 200)."
capabilities:
  - feature: "Shared hosting"
    status: "yes"
    note: "Heeft alleen `AllowOverride FileInfo` (bij bijna elke host ingeschakeld) en `mod_rewrite` nodig."
  - feature: "Serverconfiguratie in plaats van .htaccess"
    status: "yes"
    note: "Dezelfde regels werken binnen `<VirtualHost>` of `<Directory>` en zijn daar sneller."
  - feature: "LiteSpeed en OpenLiteSpeed"
    status: "yes"
    note: "LiteSpeed leest Apache-rewriteregels in `.htaccess`."
  - feature: "Hosting met alleen nginx"
    status: "no"
    note: "nginx negeert `.htaccess`; gebruik de [nginx-regels](page:server-nginx)."
faq:
  - q: "Waar in .htaccess moet het blok staan?"
    a: "Vóór andere rewriteregels. Het blok van WordPress eindigt met `RewriteRule . /index.php [L]`, dat het verzoek anders eerst zou afhandelen."
  - q: "Wat betekent [F,L]?"
    a: "`F` antwoordt met 403 Forbidden en `L` stopt de verwerking van verdere regels. `[G,L]` antwoordt in plaats daarvan met 410 Gone."
  - q: "Kan ik SetEnvIf gebruiken in plaats van mod_rewrite?"
    a: "Ja: `SetEnvIfNoCase User-Agent \"GPTBot\" ai_bot` gevolgd door `<RequireAll> Require all granted Require not env ai_bot </RequireAll>` werkt zonder mod_rewrite, maar je hebt dan één `SetEnvIfNoCase`-regel per bot nodig en een aparte uitzondering voor `/robots.txt`."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Hoe de regel werkt

`RewriteCond %{REQUEST_URI} !^/robots\.txt$` maakt een uitzondering voor het robots.txt-bestand. `RewriteCond %{HTTP_USER_AGENT} (GPTBot|ClaudeBot|…) [NC]` matcht op elk van de genoemde namen, waar ook in de User-Agent en ongeacht hoofdletters. `RewriteRule ^ - [F,L]` weigert het verzoek vervolgens zonder de URL te herschrijven. Alle voorwaarden moeten waar zijn voordat de regel wordt toegepast.

Bij WordPress leveren cacheplug-ins pagina's soms uit voordat PHP draait, maar nog altijd ná `.htaccess`, dus de blokkade geldt ook voor gecachete pagina's.
