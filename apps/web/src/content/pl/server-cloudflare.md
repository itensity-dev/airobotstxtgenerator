---
title: "Blokowanie botów AI w Cloudflare: niestandardowa reguła WAF"
description: "Niestandardowa reguła Cloudflare WAF blokująca GPTBot, ClaudeBot i inne crawlery AI po User-Agencie, bez blokady robots.txt – i jej związek z AI Crawl Control."
h1: "Blokowanie botów AI regułą Cloudflare WAF"
nav: "Cloudflare WAF"
lead: "Wyrażenie niestandardowej reguły (custom rule) dla Cloudflare WAF, które blokuje wybrane crawlery AI na podstawie User-Agenta, pozostawia dostęp do `/robots.txt` i mieści się w limicie 4096 znaków obowiązującym w Cloudflare."
steps:
  - "Wybierz agentów i skopiuj wyrażenie."
  - "W panelu Cloudflare otwórz domenę → **Security** → **WAF** → **Custom rules** → **Create rule** → **Edit expression** i wklej wyrażenie."
  - "Ustaw akcję **Block** (lub w razie potrzeby **Managed Challenge**) i wdróż regułę."
  - "Po upływie doby sprawdź **Security → Events**, aby zobaczyć, którzy agenci zostali zablokowani."
capabilities:
  - feature: "Plan bezpłatny"
    status: "yes"
    note: "Reguły niestandardowe z `contains` i `lower()` są dostępne w każdym planie; dopasowanie wyrażeniami regularnymi (`matches`) wymaga planu płatnego, dlatego narzędzie z niego nie korzysta."
  - feature: "Kontrola długości wyrażenia"
    status: "yes"
    note: "Cloudflare dopuszcza 4096 znaków na wyrażenie; narzędzie ostrzega o przekroczeniu i proponuje podział reguły."
  - feature: "Zastępuje AI Crawl Control"
    status: "no"
    note: "Własna funkcja Cloudflare AI Crawl Control blokuje zweryfikowane crawlery AI według kategorii i może dopisać zarządzany blok do robots.txt. Ta reguła przydaje się dla agentów nieobjętych przez Cloudflare lub gdy potrzebna jest dokładna kontrola."
faq:
  - q: "Cloudflare już blokuje crawlery AI – czy ta reguła jest potrzebna?"
    a: "Być może nie. Od lipca 2025 r. nowe domeny domyślnie blokują crawlery AI, a od 2026 r. Cloudflare oferuje osobne ustawienia Search, Agent i Training. Jego lista obejmuje zweryfikowane boty. Reguła niestandardowa dodaje agentów spoza tej listy i blokuje po nazwie niezależnie od weryfikacji."
  - q: "Dlaczego robots.txt jest wyłączony z reguły?"
    a: "Aby crawlery nadal mogły odczytać politykę. Crawler, który nie może pobrać robots.txt, nie dowie się, że nie ma dostępu."
  - q: "Cloudflare dodał wiersze do robots.txt – co to jest?"
    a: "To zarządzany robots.txt Cloudflare (Bot Preference Sync): blok między komentarzami BEGIN i END, umieszczony przed regułami właściciela strony, z wierszami `Content-Signal` i `Disallow` dla crawlerów AI. Aby zobaczyć, jak działa połączony plik, wystarczy wkleić opublikowany plik do [testera](page:tester)."
related: ["server-rules", "content-signals", "tester", "guide-bad-bots"]
updated: "2026-11-04"
---

## Budowa wyrażenia

Każdy warunek ma postać `(lower(http.user_agent) contains "gptbot")`: User-Agent jest zamieniany na małe litery i przeszukiwany pod kątem nazwy bota, więc wielkość liter nie ma znaczenia. Warunki są połączone operatorem `or`, a cała grupa jest łączona z `and not (http.request.uri.path eq "/robots.txt")`. Przy korzystaniu z funkcji zweryfikowanych botów Cloudflare można dodać `and not cf.client.bot`, aby zweryfikowane boty podlegały własnym ustawieniom Cloudflare.
