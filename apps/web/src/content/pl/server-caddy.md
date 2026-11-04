---
title: "Blokowanie crawlerów AI w Caddy (Caddyfile header_regexp)"
description: "Reguła Caddyfile blokująca GPTBot, ClaudeBot i inne crawlery AI nazwanym matcherem na nagłówku User-Agent – 403 dla botów AI, robots.txt nadal dostępny."
h1: "Blokowanie crawlerów AI w Caddy"
nav: "Caddy"
lead: "Nazwany matcher z `header_regexp User-Agent` wybiera crawlery AI i wyklucza `/robots.txt`, a `respond` odpowiada im przed jakimkolwiek innym handlerem."
steps:
  - "Wybierz agentów i skopiuj fragment konfiguracji."
  - "Wklej go wewnątrz bloku witryny w Caddyfile, przed `reverse_proxy`, `php_fastcgi` lub `file_server`."
  - "Uruchom `caddy validate --config /etc/caddy/Caddyfile`, a następnie `caddy reload --config /etc/caddy/Caddyfile`."
  - "Przetestuj poleceniem `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Wyrażenie regularne bez rozróżniania wielkości liter"
    status: "yes"
    note: "`(?i)` na początku wzorca wyłącza rozróżnianie wielkości liter."
  - feature: "Kolejność dyrektyw"
    status: "yes"
    note: "Caddy sam sortuje dyrektywy; `respond` jest wykonywane przed `reverse_proxy` i `file_server`."
  - feature: "Konfiguracja JSON"
    status: "partly"
    note: "Fragment jest przeznaczony dla Caddyfile; `caddy adapt` konwertuje go do formatu JSON."
faq:
  - q: "Czy matcher można wykorzystać w kilku witrynach?"
    a: "Tak: wystarczy umieścić go we fragmencie wielokrotnego użytku (snippet) – `(ai_bots) { … }` – i dodać `import ai_bots` w każdym bloku witryny."
  - q: "Jak logować zablokowane żądania?"
    a: "Caddy loguje każde żądanie wraz ze statusem odpowiedzi; wystarczy przefiltrować log dostępu pod kątem statusu 403 i dopasowanych User-Agentów."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Co robi ten fragment

`@ai_bots` to nazwany matcher: żądanie pasuje tylko wtedy, gdy spełnione są wszystkie warunki wewnątrz – nagłówek User-Agent pasuje do wyrażenia, a ścieżka nie jest `/robots.txt`. `respond @ai_bots 403` natychmiast kończy takie żądania pustą odpowiedzią 403. Wszystkie pozostałe żądania trafiają do zwykłych handlerów.
