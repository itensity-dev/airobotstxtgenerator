---
title: "KI-Bots per .htaccess & nginx blockieren: Serverregeln"
description: "Serverregeln, die KI-Crawler per User-Agent mit 403 abweisen – nginx, Apache, Caddy, Cloudflare WAF, Express, Next.js, Django, PHP – plus Bot-Prüfung per IP."
h1: "KI-Bots am Server blockieren"
nav: "Serverregeln"
lead: "Die robots.txt bittet nur; mit diesen Regeln weist Ihr Server KI-Crawler anhand ihres User-Agents ab. Wählen Sie Server und zu blockierende Agenten, kopieren Sie die Regel und verifizieren Sie echte Bots per IP oder Reverse DNS."
steps:
  - "Wählen Sie Ihren Server oder Ihr Framework: nginx, Apache, Caddy, Cloudflare WAF, Express, Next.js, Django oder PHP."
  - "Wählen Sie die Agenten: nur Trainings-Crawler, alle KI-Agenten oder Ihre eigene Auswahl aus dem Verzeichnis."
  - "Wählen Sie den Statuscode – `403 Forbidden` ist das klarste Signal; `404` oder `410` verbergen, dass Sie blockieren."
  - "Fügen Sie die Regel dort ein, wo die Kommentare es angeben, laden Sie den Server neu und prüfen Sie mit `curl -A \"GPTBot\" -I https://your-site/` – Sie sollten den gewählten Code erhalten, während `/robots.txt` erreichbar bleibt."
capabilities:
  - feature: "Überspringt reine robots.txt-Tokens"
    status: "yes"
    note: "Google-Extended, Applebot-Extended, FirecrawlAgent und `__usage_ai-training` erscheinen nie in einem User-Agent-Header, deshalb werden sie weggelassen, statt wirkungslose Regeln zu erzeugen."
  - feature: "Blockiert nie Suchmaschinen oder Linkvorschauen"
    status: "yes"
    note: "Googlebot, Bingbot, Applebot und facebookexternalhit werden in den Voreinstellungen nicht angeboten; allgemeine Community-Namen (Code, Spider, OpenAI …) werden weggelassen, damit kein unbeteiligter Traffic blockiert wird."
  - feature: "Hält /robots.txt erreichbar"
    status: "yes"
    note: "Jede Regel nimmt `/robots.txt` aus, damit Crawler Ihre Richtlinie weiterhin lesen können."
  - feature: "Stoppt gefälschte oder nicht deklarierte Bots"
    status: "no"
    note: "Der Abgleich per User-Agent stoppt nur Bots, die sich zu erkennen geben. Gegen Bots mit Browser-User-Agent helfen Rate Limits, Bot-Management oder IP-basierte Regeln."
  - feature: "Länge von Cloudflare-Ausdrücken"
    status: "partly"
    note: "Ausdrücke für Custom Rules sind auf 4.096 Zeichen begrenzt; das Tool warnt, wenn eine Auswahl zu lang ist."
faq:
  - q: "Sollte ich KI-Crawler in der robots.txt oder am Server blockieren?"
    a: "Beides, aus unterschiedlichen Gründen. Die robots.txt ist der dokumentierte, maschinenlesbare Weg, Ihre Entscheidung zu erklären – auf sie verweist der GPAI-Verhaltenskodex der EU –, und seriöse Crawler befolgen sie. Serverregeln setzen die Entscheidung gegenüber Crawlern durch, die robots.txt ignorieren oder Seiten im Auftrag eines Nutzers abrufen."
  - q: "Kann ein Bot die Sperre per User-Agent umgehen?"
    a: "Ja, indem er einen anderen User-Agent sendet. Deshalb veröffentlichen Betreiber IP-Bereiche oder signieren ihre Anfragen: Damit können Sie für einen vertrauenswürdigen Bot nur echte Anfragen zulassen oder einen Bot anhand seines Netzes blockieren. Die Tabelle unten listet jede veröffentlichte IP-Liste und jeden Hostnamen auf."
  - q: "Schadet das Blockieren mit 403 meiner SEO?"
    a: "Nicht, wenn Sie nur KI-spezifische Agenten blockieren. Blockieren Sie Googlebot, Bingbot oder Applebot nie auf diese Weise; Google-Extended und Applebot-Extended steuern die KI-Nutzung, ohne die Suche zu berühren."
  - q: "Welchen Statuscode sollte ich verwenden?"
    a: "`403 Forbidden` sagt klar, dass der Zugriff verweigert wird. Manche Website-Betreiber bevorzugen `404` oder `410`, damit der Crawler nichts Verwertbares erfährt. Alle drei verhindern, dass der Inhalt ausgeliefert wird."
related: ["server-nginx", "server-apache", "server-cloudflare", "bots", "guide-bad-bots"]
updated: "2026-11-04"
---

## Wie die Regeln entstehen

Die Regeln stammen aus demselben [Verzeichnis](page:bots) wie der Generator. Für jeden ausgewählten Agenten übernehmen wir die Teilzeichenfolgen, die sein Betreiber für den User-Agent-Header dokumentiert (zum Beispiel `GPTBot` oder `ClaudeBot`), entfernen Duplikate und Namen, die schon durch einen kürzeren abgedeckt sind, und schreiben einen Abgleich ohne Beachtung der Groß- und Kleinschreibung für Ihren Server. Agenten, die nur robots.txt-Tokens sind, werden mit einem Hinweis übersprungen, weil keine Anfrage je ihren Namen trägt.

## Prüfen, ob ein Bot echt ist

Ein User-Agent-String ist nur Text, und gefälschte Anfragen von „GPTBot“ oder „Googlebot“ sind häufig. Betreiber bieten drei Wege, eine Anfrage als echt nachzuweisen:

- **IP-Listen** – JSON-Dateien mit den Adressbereichen, die der Crawler nutzt (OpenAI, Anthropic, Perplexity, Google, Common Crawl, DuckDuckGo und andere). Vergleichen Sie die Client-IP mit den Bereichen und aktualisieren Sie die Liste regelmäßig.
- **Reverse DNS** – ermitteln Sie den Hostnamen der Client-IP, prüfen Sie, dass er auf die Domain des Betreibers endet (zum Beispiel `googlebot.com` oder `applebot.apple.com`), lösen Sie diesen Hostnamen dann vorwärts auf und bestätigen Sie, dass er dieselbe IP liefert.
- **Signierte Anfragen (Web Bot Auth)** – die Anfrage trägt eine HTTP Message Signature, die sich mit dem veröffentlichten Schlüssel des Betreibers prüfen lässt (Exa, You.com, der Agent von ChatGPT, manche Anfragen von Google-Agent).

Jede [Bot-Seite](page:bots) enthält ein fertiges Node.js-Snippet für die jeweilige Methode.
