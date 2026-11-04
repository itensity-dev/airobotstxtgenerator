---
title: "KI-Crawler in nginx blockieren (map $http_user_agent)"
description: "nginx-Konfiguration, die GPTBot, ClaudeBot, CCBot, Bytespider & andere KI-Crawler per map auf $http_user_agent mit 403 abweist – robots.txt bleibt erreichbar."
h1: "KI-Crawler in nginx blockieren"
nav: "nginx"
lead: "Eine `map` auf `$http_user_agent` markiert KI-Crawler einmal im `http`-Block; ein zweizeiliges `if` in jedem `server`-Block antwortet ihnen mit 403, während `/robots.txt` offen bleibt."
steps:
  - "Wählen Sie die Agenten aus und kopieren Sie die Konfiguration."
  - "Setzen Sie den `map`-Block in den Kontext `http {}` – zum Beispiel in eine neue Datei `/etc/nginx/conf.d/ai-bots.conf`, die die meisten Distributionen automatisch einbinden."
  - "Setzen Sie den Block `location = /robots.txt` und die Zeilen `if ($is_ai_bot)` in jeden `server {}`-Block, der KI-Crawler abweisen soll."
  - "Prüfen Sie die Syntax mit `nginx -t` und führen Sie dann `systemctl reload nginx` aus."
  - "Test: `curl -I -A \"Mozilla/5.0 (compatible; GPTBot/1.4)\" https://example.com/` liefert 403; `curl -I https://example.com/robots.txt` liefert weiterhin 200."
capabilities:
  - feature: "Abgleich ohne Groß-/Kleinschreibung"
    status: "yes"
    note: "Jede Zeile nutzt `~*`, den regulären Ausdruck von nginx ohne Beachtung der Groß- und Kleinschreibung."
  - feature: "Eine Liste für alle Websites"
    status: "yes"
    note: "Die `map` steht in `http {}`, daher kann jeder Server-Block `$is_ai_bot` verwenden."
  - feature: "Sichere Verwendung von if"
    status: "yes"
    note: "`if` mit `return` gehört zu den Verwendungen, die nginx innerhalb von `server` als sicher dokumentiert."
  - feature: "Funktioniert hinter einem CDN"
    status: "partly"
    note: "nginx sieht den User-Agent, den das CDN weiterreicht – meist den ursprünglichen. Bots, die schon im CDN blockiert werden, erreichen nginx nie."
faq:
  - q: "Warum eine map statt einer langen if-Bedingung?"
    a: "nginx wertet `map` erst bei Bedarf und einmal pro Anfrage aus, die Liste bleibt mit einem Bot pro Zeile lesbar, und Sie können die Variable in mehreren Server-Blöcken oder beim Logging wiederverwenden (`access_log ... if=$is_ai_bot`)."
  - q: "Kann ich Anfragen von KI-Bots protokollieren, statt sie zu blockieren?"
    a: "Ja: Behalten Sie die `map` und ersetzen Sie das `if` durch ein separates Log, zum Beispiel `access_log /var/log/nginx/ai-bots.log combined if=$is_ai_bot;`."
  - q: "Wie erlaube ich einen Bot nur von seinen echten IP-Adressen?"
    a: "Nutzen Sie das Modul `geo` mit den veröffentlichten Bereichen des Betreibers, kombinieren Sie es mit der User-Agent-map und weisen Sie Anfragen ab, die sich von anderen Adressen aus als dieser Bot ausgeben. Die Bereiche ändern sich, aktualisieren Sie sie daher per Skript."
related: ["server-rules", "server-apache", "server-caddy", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Wohin welcher Teil gehört

nginx liest die Konfiguration in Kontexten. Die Direktive `map` ist nur in `http {}` erlaubt; die Direktiven `if` und `location` gehören in `server {}`. Wenn Sie mehrere Websites verwalten, definieren Sie die map einmal und ergänzen die drei Zeilen in jeder Website. Setzen Sie `location = /robots.txt` vor andere Locations, die die Anfrage umschreiben oder weiterleiten könnten – eine Location mit exaktem Treffer gewinnt in nginx immer.

Arbeitet nginx als Reverse Proxy vor einer Anwendung, stoppt die Regel die Anfrage, bevor sie die Anwendung erreicht – das schont auch deren Ressourcen.
