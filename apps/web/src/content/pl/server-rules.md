---
title: "Blokowanie botów AI w .htaccess i nginx: reguły serwera"
description: "Reguły zwracające 403 crawlerom AI według User-Agenta – nginx, Apache, Caddy, Cloudflare WAF, Express, Next.js, Django, PHP – i weryfikacja botów po IP."
h1: "Blokowanie botów AI na serwerze"
nav: "Reguły serwera"
lead: "robots.txt tylko prosi; te reguły sprawiają, że serwer odrzuca crawlery AI na podstawie User-Agenta. Wystarczy wybrać serwer i agentów do zablokowania, skopiować regułę i weryfikować prawdziwe boty po adresie IP lub odwrotnym DNS."
steps:
  - "Wybierz serwer lub framework: nginx, Apache, Caddy, Cloudflare WAF, Express, Next.js, Django lub PHP."
  - "Wybierz agentów: tylko crawlery treningowe, wszystkich agentów AI lub własny wybór z rejestru."
  - "Wybierz kod odpowiedzi – `403 Forbidden` to najczytelniejszy sygnał; `404` lub `410` ukrywają fakt blokowania."
  - "Wklej regułę w miejscu wskazanym w komentarzach, przeładuj serwer, a następnie sprawdź ją poleceniem `curl -A \"GPTBot\" -I https://your-site/` – serwer powinien zwrócić wybrany kod, a `/robots.txt` pozostać dostępny."
capabilities:
  - feature: "Pomija tokeny wyłącznie dla robots.txt"
    status: "yes"
    note: "Google-Extended, Applebot-Extended, FirecrawlAgent i `__usage_ai-training` nigdy nie pojawiają się w nagłówku User-Agent, więc są pomijane, zamiast tworzyć martwe reguły."
  - feature: "Nigdy nie blokuje wyszukiwarek ani podglądów linków"
    status: "yes"
    note: "Googlebot, Bingbot, Applebot i facebookexternalhit nie są dostępne w gotowych ustawieniach; ogólne nazwy z listy społeczności (Code, Spider, OpenAI …) są pomijane, aby nie blokować niepowiązanego ruchu."
  - feature: "Pozostawia dostęp do /robots.txt"
    status: "yes"
    note: "Każda reguła wyłącza `/robots.txt`, aby crawlery nadal mogły odczytać politykę."
  - feature: "Zatrzymuje boty podszywające się lub niezadeklarowane"
    status: "no"
    note: "Dopasowanie User-Agenta zatrzymuje tylko boty, które się przedstawiają. Na boty używające User-Agenta przeglądarki potrzebne są limity żądań, zarządzanie botami lub reguły oparte na IP."
  - feature: "Długość wyrażenia Cloudflare"
    status: "partly"
    note: "Wyrażenia reguł niestandardowych są ograniczone do 4096 znaków; narzędzie ostrzega, gdy wybór jest zbyt długi."
faq:
  - q: "Blokować crawlery AI w robots.txt czy na serwerze?"
    a: "W obu miejscach, z różnych powodów. robots.txt to udokumentowany, nadający się do odczytu maszynowego sposób wyrażenia decyzji – do niego odwołuje się unijny kodeks praktyk GPAI – i odpowiedzialne crawlery go przestrzegają. Reguły serwera egzekwują tę decyzję wobec crawlerów, które ignorują robots.txt lub pobierają strony w imieniu użytkownika."
  - q: "Czy bot może obejść blokadę po User-Agencie?"
    a: "Tak, wysyłając inny User-Agent. Dlatego operatorzy publikują zakresy IP lub podpisują swoje żądania: dzięki temu można dopuścić tylko prawdziwe żądania zaufanego bota albo zablokować bota po jego sieci. Tabela poniżej zawiera wszystkie opublikowane listy IP i nazwy hostów."
  - q: "Czy blokowanie kodem 403 zaszkodzi SEO?"
    a: "Nie, jeśli blokowani są wyłącznie agenci specyficzni dla AI. W ten sposób nigdy nie należy blokować Googlebot, Bingbot ani Applebot; Google-Extended i Applebot-Extended kontrolują wykorzystanie przez AI bez wpływu na wyszukiwanie."
  - q: "Jakiego kodu odpowiedzi użyć?"
    a: "`403 Forbidden` jasno komunikuje odmowę dostępu. Niektórzy właściciele stron wolą `404` lub `410`, aby crawler nie zarejestrował niczego przydatnego. Każdy z tych trzech kodów uniemożliwia dostarczenie treści."
related: ["server-nginx", "server-apache", "server-cloudflare", "bots", "guide-bad-bots"]
updated: "2026-11-04"
---

## Jak powstają reguły

Reguły pochodzą z tego samego [rejestru](page:bots) co generator. Dla każdego wybranego agenta pobieramy fragmenty nagłówka User-Agent udokumentowane przez operatora (np. `GPTBot` lub `ClaudeBot`), usuwamy duplikaty i nazwy objęte już krótszą nazwą, a następnie zapisujemy dla danego serwera dopasowanie bez rozróżniania wielkości liter. Agenci będący wyłącznie tokenami robots.txt są pomijani z adnotacją, ponieważ żadne żądanie nie zawiera ich nazwy.

## Weryfikacja autentyczności bota

Ciąg User-Agent to zwykły tekst, a fałszywe żądania „GPTBot” czy „Googlebot” są częste. Operatorzy oferują trzy sposoby udowodnienia, że żądanie jest prawdziwe:

- **Listy IP** – pliki JSON z zakresami adresów używanymi przez crawlera (OpenAI, Anthropic, Perplexity, Google, Common Crawl, DuckDuckGo i inni). Należy porównać IP klienta z zakresami i regularnie odświeżać listę.
- **Odwrotny DNS** – należy sprawdzić nazwę hosta dla IP klienta, upewnić się, że kończy się domeną operatora (np. `googlebot.com` lub `applebot.apple.com`), a następnie rozwiązać tę nazwę w przód i potwierdzić, że zwraca ten sam adres IP.
- **Podpisane żądania (Web Bot Auth)** – żądanie zawiera podpis HTTP Message Signature, który można zweryfikować kluczem opublikowanym przez operatora (Exa, You.com, agent ChatGPT, niektóre żądania Google-Agent).

Każda [strona bota](page:bots) zawiera gotowy fragment kodu Node.js dla danej metody.
