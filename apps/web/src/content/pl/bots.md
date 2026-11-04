---
title: "Lista botów AI: wszystkie crawlery AI i jak je zablokować"
description: "Rejestr {{all}} crawlerów i tokenów AI – GPTBot, ClaudeBot, PerplexityBot, Google-Extended i inne – z operatorem, celem, stosunkiem do robots.txt i listami IP."
h1: "Rejestr crawlerów AI"
nav: "Rejestr botów"
lead: "Wszystkie crawlery AI, agenci AI i tokeny sterujące robots.txt, które udało się udokumentować: kto je obsługuje, co zbierają, czy operator deklaruje przestrzeganie robots.txt i jak je zweryfikować – z linkiem do źródła i datą ostatniego sprawdzenia."
steps:
  - "Przeszukaj rejestr według nazwy lub firmy albo przejrzyj go według operatora."
  - "Otwórz stronę agenta, aby zobaczyć jego User-Agent, token robots.txt, listę IP i gotowe reguły do skopiowania."
  - "Kieruj się kolumną przeznaczenia: crawlery treningowe zwykle można zablokować bez utraty widoczności; wyszukiwarki AI i agenci użytkowników przynoszą cytowania i odwiedzających."
  - "Zbuduj pełny plik w [generatorze](page:home) lub przetestuj obecny w [testerze](page:tester)."
capabilities:
  - feature: "Źródło dla każdego wpisu"
    status: "yes"
    note: "Każdy wpis redakcyjny zawiera link do dokumentacji operatora; jeśli jej brak, strona wyraźnie to zaznacza."
  - feature: "Data ostatniego sprawdzenia"
    status: "yes"
    note: "Podawana dla każdego agenta wraz z metodą sprawdzenia (otwarcie strony lub odczyt przez indeks wyszukiwarki)."
  - feature: "Format do odczytu maszynowego"
    status: "yes"
    note: "Cały rejestr jest dostępny jako [/bots.json](/bots.json) na licencji CC BY 4.0."
  - feature: "Cotygodniowa aktualizacja"
    status: "yes"
    note: "Cotygodniowe zadanie porównuje listę społeczności z ai.robots.txt i otwiera pull request; wpisy redakcyjne są sprawdzane ręcznie."
  - feature: "Dowód autentyczności żądania"
    status: "partly"
    note: "Tylko tam, gdzie operator publikuje zakresy IP, nazwy hostów dla odwrotnego DNS lub podpisy. Ciąg User-Agent może podrobić każdy."
faq:
  - q: "Które crawlery AI blokować?"
    a: "To zależy od celu. Aby wykluczyć treści z trenowania AI, a zachować widoczność w odpowiedziach AI, należy zablokować crawlery i tokeny treningowe (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent, Bytespider, MistralAI-Training) i dopuścić agentów wyszukiwania (OAI-SearchBot, Claude-SearchBot, PerplexityBot). [Poradnik](page:guide-training-search) omawia wady i zalety poszczególnych wariantów."
  - q: "Czym różni się crawler od tokenu robots.txt?"
    a: "Crawler wysyła żądania z własnym User-Agentem. Token taki jak Google-Extended czy Applebot-Extended nigdy nie odwiedza strony; to nazwa w robots.txt, która informuje operatora, jak można wykorzystywać treści pobrane przez jego zwykłego crawlera. Tokeny można kontrolować wyłącznie w robots.txt, a nie regułami serwera."
  - q: "Dlaczego niektórzy agenci ignorują robots.txt?"
    a: "Narzędzia pobierające strony na prośbę człowieka – ChatGPT-User, Perplexity-User, Google-Agent, meta-externalfetcher – są traktowane przez operatorów jak przeglądarka i mogą nie przestrzegać robots.txt. Niektóre crawlery w ogóle nie publikują swojej polityki. W takich przypadkach blokadę należy ustawić na serwerze lub w CDN."
  - q: "Jak aktualna jest lista?"
    a: "Wpisy redakcyjne sprawdzono w dokumentacji operatorów (stan na {{updated}}); każda strona podaje własną datę. Lista społeczności jest synchronizowana z ai.robots.txt co tydzień."
  - q: "Czy można korzystać z tych danych?"
    a: "Tak. Rejestr jest publikowany w formacie JSON pod adresem /bots.json na licencji CC BY 4.0 – prosimy o podanie źródła: airobotstxtgenerator.com. Wpisy społeczności pochodzą z projektu ai.robots.txt na licencji MIT."
related: ["home", "tester", "server-rules", "guide-training-search"]
updated: "2026-11-04"
---

## Jak powstaje rejestr

Każdy wpis redakcyjny opiera się na dokumentacji samego operatora: OpenAI, Anthropic, Google, Apple, Perplexity, Meta, Amazon, Mistral, DuckDuckGo, Microsoft, Common Crawl i inni publikują strony opisujące swoje crawlery. Na ich podstawie zapisujemy token robots.txt, udokumentowany ciąg User-Agent, przeznaczenie, deklarację operatora dotyczącą robots.txt, opublikowane listy IP lub nazwy hostów oraz datę sprawdzenia. Gdy operator niczego nie publikuje – jak ByteDance w przypadku crawlera Bytespider – wpis jest oznaczony jako oparty na niezależnych obserwacjach.

**Przeznaczenie** odpowiada kategoriom, których używają dziś operatorzy i Cloudflare: *trenowanie AI*, *wyszukiwanie AI* (indeksowanie i cytowanie), *pobieranie na żądanie użytkownika* (asystent otwiera stronę dla człowieka) oraz *tokeny robots.txt*. Crawlery ogólne, takie jak Googlebot, Bingbot i Applebot, są wymienione informacyjnie, ponieważ wiele funkcji AI na nich bazuje.

**Lista społeczności** pod główną tabelą pochodzi z otwartego projektu [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt). Jest obszerniejsza, ale jej wpisy nie są weryfikowane indywidualnie; niektórym nazwom przeczą sami operatorzy (Cohere twierdzi, że nie prowadzi żadnego crawlera, Brave nie ma odrębnego User-Agenta, a crawler Exa to ExaSearchBot).
