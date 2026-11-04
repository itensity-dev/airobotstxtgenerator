---
title: "Blokowanie crawlerów AI w nginx (map $http_user_agent)"
description: "Konfiguracja nginx blokująca GPTBot, ClaudeBot, CCBot, Bytespider i inne crawlery AI przez map na $http_user_agent – 403 dla botów AI, robots.txt dostępny."
h1: "Blokowanie crawlerów AI w nginx"
nav: "nginx"
lead: "Dyrektywa `map` na `$http_user_agent` oznacza crawlery AI raz w bloku `http`; dwuwierszowy `if` w każdym bloku `server` odpowiada im kodem 403, a `/robots.txt` pozostaje dostępny."
steps:
  - "Wybierz agentów i skopiuj konfigurację."
  - "Umieść blok `map` w kontekście `http {}` – np. w nowym pliku `/etc/nginx/conf.d/ai-bots.conf`, który większość dystrybucji dołącza automatycznie."
  - "Umieść blok `location = /robots.txt` i wiersze `if ($is_ai_bot)` w każdym bloku `server {}`, który ma odrzucać crawlery AI."
  - "Uruchom `nginx -t`, aby sprawdzić składnię, a następnie `systemctl reload nginx`."
  - "Przetestuj: `curl -I -A \"Mozilla/5.0 (compatible; GPTBot/1.4)\" https://example.com/` zwraca 403; `curl -I https://example.com/robots.txt` nadal zwraca 200."
capabilities:
  - feature: "Dopasowanie bez rozróżniania wielkości liter"
    status: "yes"
    note: "Każdy wiersz używa `~*`, czyli wyrażenia regularnego nginx bez rozróżniania wielkości liter."
  - feature: "Jedna lista dla wszystkich witryn"
    status: "yes"
    note: "`map` znajduje się w `http {}`, więc każdy blok server może używać `$is_ai_bot`."
  - feature: "Bezpieczne użycie if"
    status: "yes"
    note: "`if` z `return` to jedno z zastosowań, które dokumentacja nginx uznaje za bezpieczne wewnątrz `server`."
  - feature: "Działanie za CDN"
    status: "partly"
    note: "nginx widzi User-Agent przekazany przez CDN – zwykle oryginalny. Boty zablokowane w CDN nigdy nie docierają do nginx."
faq:
  - q: "Dlaczego map zamiast długiego warunku if?"
    a: "nginx oblicza `map` leniwie i raz na żądanie, lista pozostaje czytelna (jeden bot na wiersz), a zmienną można wykorzystać w kilku blokach server lub przy logowaniu (`access_log ... if=$is_ai_bot`)."
  - q: "Czy żądania botów AI można logować zamiast je blokować?"
    a: "Tak: wystarczy zachować `map` i zastąpić `if` osobnym logiem, np. `access_log /var/log/nginx/ai-bots.log combined if=$is_ai_bot;`."
  - q: "Jak dopuścić bota tylko z jego prawdziwych adresów IP?"
    a: "Należy użyć modułu `geo` z zakresami opublikowanymi przez operatora, połączyć go z mapą User-Agentów i odrzucać żądania podające się za tego bota, które przychodzą z innych adresów. Zakresy się zmieniają, więc warto aktualizować je skryptem."
related: ["server-rules", "server-apache", "server-caddy", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Gdzie umieścić poszczególne części

nginx odczytuje konfigurację w kontekstach. Dyrektywa `map` jest dozwolona tylko w `http {}`; dyrektywy `if` i `location` należą do `server {}`. Przy wielu witrynach wystarczy zdefiniować mapę raz i dodać trzy wiersze do każdej witryny. Blok `location = /robots.txt` powinien znajdować się przed innymi blokami location, które mogłyby przepisać lub przekazać żądanie dalej – w nginx lokalizacja z dokładnym dopasowaniem zawsze wygrywa.

Jeśli nginx działa jako reverse proxy przed aplikacją, reguła zatrzymuje żądanie, zanim dotrze ono do aplikacji, co oszczędza również jej zasoby.
