---
title: "KI-Crawler in Caddy blockieren (Caddyfile header_regexp)"
description: "Caddyfile-Regel, die GPTBot, ClaudeBot und andere KI-Crawler per benanntem Matcher auf den User-Agent mit 403 abweist – die robots.txt bleibt erreichbar."
h1: "KI-Crawler in Caddy blockieren"
nav: "Caddy"
lead: "Ein benannter Matcher mit `header_regexp User-Agent` wählt KI-Crawler aus, nimmt `/robots.txt` aus, und `respond` antwortet ihnen vor jedem anderen Handler."
steps:
  - "Wählen Sie die Agenten aus und kopieren Sie das Snippet."
  - "Fügen Sie es im Caddyfile in Ihren Site-Block ein, vor `reverse_proxy`, `php_fastcgi` oder `file_server`."
  - "Führen Sie `caddy validate --config /etc/caddy/Caddyfile` und dann `caddy reload --config /etc/caddy/Caddyfile` aus."
  - "Testen Sie mit `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Regulärer Ausdruck ohne Groß-/Kleinschreibung"
    status: "yes"
    note: "`(?i)` am Anfang des Musters schaltet die Unterscheidung von Groß- und Kleinschreibung ab."
  - feature: "Reihenfolge der Direktiven"
    status: "yes"
    note: "Caddy sortiert Direktiven selbst; `respond` läuft vor `reverse_proxy` und `file_server`."
  - feature: "JSON-Konfiguration"
    status: "partly"
    note: "Das Snippet ist für das Caddyfile; `caddy adapt` wandelt es in JSON um."
faq:
  - q: "Kann ich den Matcher in mehreren Websites wiederverwenden?"
    a: "Ja: Legen Sie ihn in ein Snippet – `(ai_bots) { … }` – und binden Sie es mit `import ai_bots` in jeden Site-Block ein."
  - q: "Wie protokolliere ich blockierte Anfragen?"
    a: "Caddy protokolliert jede Anfrage einschließlich des Antwortstatus; filtern Sie das Access-Log nach Status 403 und den getroffenen User-Agents."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Was das Snippet macht

`@ai_bots` ist ein benannter Matcher: Eine Anfrage trifft nur zu, wenn jede Bedingung darin erfüllt ist – der User-Agent-Header passt auf den Ausdruck und der Pfad ist nicht `/robots.txt`. `respond @ai_bots 403` beendet diese Anfragen sofort mit einer leeren 403-Antwort. Alles andere läuft weiter zu Ihren normalen Handlern.
