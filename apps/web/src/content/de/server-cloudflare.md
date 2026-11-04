---
title: "KI-Bots mit einer Cloudflare-WAF-Regel blockieren"
description: "Cloudflare-WAF-Regel, die GPTBot, ClaudeBot und andere KI-Crawler per User-Agent blockiert und robots.txt ausnimmt – plus Abgrenzung zu AI Crawl Control."
h1: "KI-Bots mit einer Cloudflare-WAF-Regel blockieren"
nav: "Cloudflare WAF"
lead: "Ein Ausdruck für eine Custom Rule der Cloudflare WAF, der die gewählten KI-Crawler per User-Agent blockiert, `/robots.txt` erreichbar hält und in Cloudflares Grenze von 4.096 Zeichen passt."
steps:
  - "Wählen Sie die Agenten aus und kopieren Sie den Ausdruck."
  - "Öffnen Sie im Cloudflare-Dashboard Ihre Domain → **Security** → **WAF** → **Custom rules** → **Create rule** → **Edit expression** und fügen Sie ihn ein."
  - "Setzen Sie die Aktion auf **Block** (oder auf **Managed Challenge**, wenn Ihnen das lieber ist) und aktivieren Sie die Regel."
  - "Sehen Sie nach einem Tag unter **Security → Events** nach, welche Agenten blockiert wurden."
capabilities:
  - feature: "Free-Plan"
    status: "yes"
    note: "Custom Rules mit `contains` und `lower()` gibt es in jedem Plan; `matches` mit regulären Ausdrücken erfordert einen kostenpflichtigen Plan, daher verwendet das Tool es nicht."
  - feature: "Prüfung der Ausdruckslänge"
    status: "yes"
    note: "Cloudflare erlaubt 4.096 Zeichen pro Ausdruck; das Tool warnt und schlägt vor, die Regel aufzuteilen."
  - feature: "Ersetzt AI Crawl Control"
    status: "no"
    note: "Cloudflares eigenes AI Crawl Control blockiert verifizierte KI-Crawler nach Kategorie und kann einen verwalteten Block in Ihre robots.txt schreiben. Nutzen Sie diese Regel für Agenten, die Cloudflare nicht abdeckt, oder wenn Sie genaue Kontrolle wollen."
faq:
  - q: "Cloudflare blockiert KI-Crawler doch schon – brauche ich diese Regel?"
    a: "Vielleicht nicht. Seit Juli 2025 blockieren neue Domains KI-Crawler standardmäßig, und seit 2026 bietet Cloudflare getrennte Einstellungen für Search, Agent und Training. Diese Liste umfasst verifizierte Bots. Eine Custom Rule ergänzt Agenten außerhalb dieser Liste und blockiert nach Namen, unabhängig von der Verifizierung."
  - q: "Warum ist die robots.txt ausgenommen?"
    a: "Damit Crawler Ihre Richtlinie weiterhin lesen können. Ein Crawler, der die robots.txt nicht abrufen kann, erfährt nicht, dass er gesperrt ist."
  - q: "Cloudflare hat Zeilen in meine robots.txt geschrieben – was ist das?"
    a: "Das ist Cloudflares verwaltete robots.txt (Bot Preference Sync): ein Block zwischen BEGIN- und END-Kommentaren vor Ihren eigenen Regeln, mit `Content-Signal`- und `Disallow`-Zeilen für KI-Crawler. Fügen Sie die Live-Datei in den [Tester](page:tester) ein, um zu sehen, wie sich die kombinierte Datei verhält."
related: ["server-rules", "content-signals", "tester", "guide-bad-bots"]
updated: "2026-11-04"
---

## Zum Ausdruck

Jede Bedingung lautet `(lower(http.user_agent) contains "gptbot")`: Der User-Agent wird in Kleinbuchstaben umgewandelt und nach dem Namen des Bots durchsucht, Groß- und Kleinschreibung spielen also keine Rolle. Die Bedingungen werden mit `or` verknüpft, und die ganze Gruppe wird mit `and not (http.request.uri.path eq "/robots.txt")` kombiniert. Wenn Sie auch Cloudflares Funktionen für verifizierte Bots nutzen, können Sie `and not cf.client.bot` ergänzen, um verifizierte Bots Cloudflares eigenen Einstellungen zu überlassen.
