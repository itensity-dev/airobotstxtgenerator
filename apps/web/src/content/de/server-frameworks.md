---
title: "KI-Bots in Express, Next.js, Django & PHP blockieren"
description: "Middleware zum Kopieren, die GPTBot, ClaudeBot & andere KI-Crawler per User-Agent in Express, Next.js (proxy.ts), Django und PHP/WordPress blockiert."
h1: "KI-Bots in Ihrer Anwendung blockieren"
nav: "Frameworks"
lead: "Wenn Sie den Webserver nicht ändern können, blockieren Sie KI-Crawler in der Anwendung selbst: Middleware für Express, Next.js, Django und reines PHP oder WordPress, erzeugt aus dem Verzeichnis."
steps:
  - "Wählen Sie Framework und Agenten und kopieren Sie den Code."
  - "Express: Registrieren Sie die Middleware vor Ihren Routen. Next.js: Speichern Sie die Datei als `proxy.ts` im Projektstamm (`middleware.ts` vor Next.js 16). Django: Tragen Sie die Klasse in `MIDDLEWARE` ein. PHP: Binden Sie die Datei ganz oben in `index.php` ein oder legen Sie sie in `wp-content/mu-plugins/` ab."
  - "Deployen Sie und testen Sie mit `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Kein Serverzugriff nötig"
    status: "yes"
    note: "Funktioniert auf Plattformen, auf denen Sie nur den Code kontrollieren (Vercel, Render, Shared Hosting mit PHP)."
  - feature: "Statische Dateien über ein CDN"
    status: "partly"
    note: "Anfragen, die das CDN oder ein Server für statische Dateien beantwortet, erreichen Ihre Middleware nie; blockieren Sie dort ebenfalls."
  - feature: "Performance"
    status: "yes"
    note: "Ein kompilierter regulärer Ausdruck pro Anfrage."
faq:
  - q: "Ist Middleware so gut wie eine Serverregel?"
    a: "Sie weist dieselben Anfragen ab, aber später: Ihre Anwendung hat bereits begonnen, sie zu verarbeiten. Server- oder CDN-Regeln sind günstiger. Middleware ist die richtige Wahl, wenn Sie den Server nicht ändern können."
  - q: "Läuft der Next.js-Proxy auch für statische Assets?"
    a: "Standardmäßig läuft er für jede Route; ergänzen Sie einen `config.matcher`, der `_next/static` und Bilder ausschließt, wenn Sie Aufrufe sparen möchten."
related: ["server-rules", "server-nginx", "server-cloudflare", "bots"]
updated: "2026-11-04"
---

## Wie die Middleware entscheidet

Jedes Snippet baut aus den User-Agent-Namen der ausgewählten Agenten einen regulären Ausdruck ohne Beachtung der Groß- und Kleinschreibung, überspringt den Pfad `/robots.txt` und beantwortet passende Anfragen mit dem gewählten Status und einer kurzen Textnachricht. Sonst ändert sich nichts an Ihrer Anwendung.
