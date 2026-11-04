---
title: "KI-Bots per .htaccess blockieren (Apache mod_rewrite)"
description: ".htaccess-Regeln, die GPTBot, ClaudeBot, CCBot, Bytespider & andere KI-Crawler auf Apache per mod_rewrite mit 403 abweisen – robots.txt bleibt erreichbar."
h1: "KI-Bots per .htaccess auf Apache blockieren"
nav: "Apache .htaccess"
lead: "Drei `mod_rewrite`-Zeilen in der `.htaccess` weisen KI-Crawler per User-Agent mit 403 ab, nehmen `/robots.txt` aus und funktionieren auf Shared Hosting ohne Zugriff auf die Hauptkonfiguration."
steps:
  - "Wählen Sie die Agenten aus und kopieren Sie die Regeln."
  - "Öffnen Sie die `.htaccess` in Ihrem Document Root (legen Sie sie an, falls es sie nicht gibt) und fügen Sie den Block weit oben ein – vor den Rewrite-Regeln von WordPress oder Ihrem Framework."
  - "Speichern. Ein Neustart ist nicht nötig – Apache liest die `.htaccess` bei jeder Anfrage."
  - "Testen Sie mit `curl -I -A \"ClaudeBot\" https://example.com/` (erwartet: 403) und `curl -I https://example.com/robots.txt` (erwartet: 200)."
capabilities:
  - feature: "Shared Hosting"
    status: "yes"
    note: "Benötigt nur `AllowOverride FileInfo` (bei fast jedem Hoster aktiv) und `mod_rewrite`."
  - feature: "Serverkonfiguration statt .htaccess"
    status: "yes"
    note: "Dieselben Zeilen funktionieren in `<VirtualHost>` oder `<Directory>` und sind dort schneller."
  - feature: "LiteSpeed und OpenLiteSpeed"
    status: "yes"
    note: "LiteSpeed liest Apache-Rewrite-Regeln in der `.htaccess`."
  - feature: "Reines nginx-Hosting"
    status: "no"
    note: "nginx ignoriert die `.htaccess`; nutzen Sie die [nginx-Regeln](page:server-nginx)."
faq:
  - q: "Wo in der .htaccess sollte der Block stehen?"
    a: "Vor anderen Rewrite-Regeln. Der WordPress-Block endet mit `RewriteRule . /index.php [L]`, der die Anfrage sonst zuerst verarbeiten würde."
  - q: "Was bedeutet [F,L]?"
    a: "`F` antwortet mit 403 Forbidden und `L` beendet die Verarbeitung weiterer Regeln. `[G,L]` antwortet stattdessen mit 410 Gone."
  - q: "Kann ich SetEnvIf statt mod_rewrite verwenden?"
    a: "Ja: `SetEnvIfNoCase User-Agent \"GPTBot\" ai_bot` gefolgt von `<RequireAll> Require all granted Require not env ai_bot </RequireAll>` funktioniert ohne mod_rewrite, aber Sie brauchen eine `SetEnvIfNoCase`-Zeile pro Bot und eine eigene Ausnahme für `/robots.txt`."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## So funktioniert die Regel

`RewriteCond %{REQUEST_URI} !^/robots\.txt$` nimmt die robots.txt-Datei aus. `RewriteCond %{HTTP_USER_AGENT} (GPTBot|ClaudeBot|…) [NC]` trifft jeden der aufgeführten Namen an beliebiger Stelle im User-Agent, ohne Beachtung der Groß- und Kleinschreibung. `RewriteRule ^ - [F,L]` weist die Anfrage dann ab, ohne die URL umzuschreiben. Alle Bedingungen müssen erfüllt sein, damit die Regel greift.

Unter WordPress liefern Caching-Plugins Seiten manchmal aus, bevor PHP läuft, aber trotzdem erst nach der `.htaccess` – die Sperre gilt also auch für zwischengespeicherte Seiten.
