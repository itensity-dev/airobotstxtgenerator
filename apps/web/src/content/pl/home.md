---
title: "Generator robots.txt dla AI: zablokuj GPTBot i boty AI"
description: "Darmowy generator robots.txt dla AI: blokada trenowania (GPTBot, ClaudeBot, Google-Extended, CCBot) przy zachowaniu wyszukiwania AI albo pełna blokada AI."
h1: "Generator robots.txt dla AI"
nav: "Generator robots.txt"
lead: "Wystarczy wybrać typ strony i cel: generator utworzy robots.txt dla {{all}} udokumentowanych crawlerów i tokenów AI, objaśni każdy wiersz i sprawdzi wynik parserem zgodnym z RFC 9309, zanim plik zostanie skopiowany."
steps:
  - "Wybierz **typ strony** – ustawia on rozsądne ścieżki początkowe (sklep zamyka `/cart/` i `/checkout/` dla wszystkich crawlerów, serwis informacyjny zamyka `/premium/` dla botów AI)."
  - "Wybierz **cel**: bez trenowania AI, ale z widocznością w wyszukiwarkach AI, całkowita blokada AI, zezwolenie na wszystko albo decyzja osobno dla każdego bota."
  - "Dodaj **wyjątki dla ścieżek**, np. otwórz `/blog/` dla wszystkich botów AI albo zamknij dla nich `/members/`."
  - "Skopiuj lub pobierz plik i umieść go jako `robots.txt` w katalogu głównym każdego hosta (`https://example.com/robots.txt`). Plik już istnieje? Opcja **Dodaj do istniejącego robots.txt** dopisze sekcję AI i wykaże, że dotychczasowe reguły działają tak samo."
  - "Przetestuj opublikowany plik w [testerze robots.txt](page:tester), a dla crawlerów ignorujących robots.txt dodaj [reguły serwera](page:server-rules)."
capabilities:
  - feature: "Lista crawlerów AI"
    status: "yes"
    note: "Agenci i tokeny ({{all}}) z dokumentacją operatora i datą ostatniego sprawdzenia; na życzenie także wpisy z listy społeczności ai.robots.txt ({{community}})."
  - feature: "Ustawienia według przeznaczenia"
    status: "yes"
    note: "Trenowanie, wyszukiwanie AI, pobieranie na żądanie użytkownika i tokeny wyłącznie dla robots.txt są traktowane osobno."
  - feature: "Automatyczna kontrola"
    status: "yes"
    note: "Każdy plik jest parsowany według tych samych reguł co otwartoźródłowy parser Google; każdy agent jest testowany dla `/`, ścieżek wyjątków i ścieżek zamkniętych."
  - feature: "Scalanie z istniejącym plikiem"
    status: "yes"
    note: "Dopisuje sekcję AI, pokazuje różnice i porównuje stare oraz nowe decyzje dla każdego agenta, który już występuje w pliku."
  - feature: "Wiersze Content-Signal"
    status: "partly"
    note: "Opcjonalny `Content-Signal` dla grupy `*`. To propozycja Cloudflare, a nie standard."
  - feature: "Zatrzymanie botów ignorujących robots.txt"
    status: "no"
    note: "robots.txt to tylko prośba. Do egzekwowania służą [reguły serwera](page:server-rules) lub WAF."
  - feature: "Rejestracja, przesyłanie i śledzenie wprowadzanych danych"
    status: "no"
    note: "Generowanie odbywa się w przeglądarce i działa offline; ścieżki i pliki nie są nigdzie wysyłane."
faq:
  - q: "Jak zablokować trenowanie AI, a zachować widoczność w wyszukiwaniu ChatGPT, Claude i Perplexity?"
    a: "Należy zablokować crawlery i tokeny treningowe – `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `meta-externalagent` i inne – a agentom wyszukiwania (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`) pozostawić dostęp. To pierwszy cel w generatorze. Szczegóły w poradniku [Zablokuj trenowanie AI i zostań widoczny w wyszukiwarkach AI](page:guide-training-search)."
  - q: "Czy zablokowanie Google-Extended usuwa stronę z wyszukiwarki Google lub z AI Overviews?"
    a: "Nie. `Google-Extended` to token robots.txt, a nie crawler: określa, czy Google może wykorzystywać treści do trenowania Gemini i do groundingu. Wyszukiwarka Google, w tym AI Overviews i AI Mode, korzysta z `Googlebot`."
  - q: "Dlaczego wygenerowany plik powtarza niektóre reguły?"
    a: "Crawler wymieniony we własnej grupie całkowicie ignoruje grupę `User-agent: *`. Gdy boty AI potrzebują własnej grupy (np. aby zamknąć dla nich `/premium/`), generator kopiuje do niej reguły `*`, dzięki czemu nic nie zostaje utracone."
  - q: "Czy każda firma AI będzie respektować ten plik?"
    a: "Większość dużych operatorów deklaruje, że ich crawlery przestrzegają robots.txt. Narzędzia pobierające strony na żądanie użytkownika (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`) mogą tego nie robić, a niektóre crawlery nie publikują żadnej deklaracji. Rejestr botów pokazuje deklarację każdego operatora wraz z linkiem do źródła."
  - q: "Gdzie umieścić plik robots.txt?"
    a: "W katalogu głównym każdego hosta i protokołu, którego ma dotyczyć: `https://example.com/robots.txt` nie obejmuje `https://shop.example.com/`. Plik musi być zwykłym tekstem w kodowaniu UTF-8, a w przypadku Google – mniejszy niż 500 KiB."
  - q: "Czy wprowadzane dane są zapisywane?"
    a: "Nie. Generator działa w całości w przeglądarce. Zliczamy jedynie fakt wygenerowania pliku i wybrany wariant, bez ścieżek ani treści."
  - q: "Czy blokada w robots.txt jest zastrzeżeniem eksploracji tekstów i danych w rozumieniu AI Act?"
    a: "Reguła `Disallow` dla crawlera treningowego to najszerzej uznawana forma zastrzeżenia nadającego się do odczytu maszynowego. Art. 26³ ustawy o prawie autorskim i prawach pokrewnych pozwala na eksplorację tekstów i danych, chyba że uprawniony zastrzegł inaczej, a AI Act zobowiązuje dostawców modeli AI ogólnego przeznaczenia do przestrzegania takich zastrzeżeń – kodeks praktyk wskazuje przy tym robots.txt. Skutek prawny zależy od okoliczności sprawy; szczegóły w poradniku [Zastrzeżenie TDM i opt-out z AI](page:guide-eu-ai-act). Informacja, nie porada prawna."
related: ["tester", "bots", "server-rules", "guide-training-search", "llms-txt"]
updated: "2026-11-04"
---

## Jak generator podejmuje decyzje

Każdy agent w rejestrze ma **przeznaczenie** ustalone na podstawie dokumentacji operatora:

- **Trenowanie AI** – zbiera strony, które mogą posłużyć do trenowania modeli (`GPTBot`, `ClaudeBot`, `CCBot`, `MistralAI-Training`).
- **Tokeny robots.txt** – to w ogóle nie są crawlery, lecz nazwy określające, jak można wykorzystywać treści pobrane przez crawlera ogólnego (`Google-Extended`, `Applebot-Extended`, `__usage_ai-training`).
- **Wyszukiwanie AI** – indeksuje strony, aby produkt AI mógł je cytować i linkować (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`).
- **Pobieranie na żądanie użytkownika** – otwiera stronę, ponieważ ktoś poprosił o to asystenta (`ChatGPT-User`, `Claude-User`, `Perplexity-User`).
- **Crawlery ogólne** – `Googlebot`, `Bingbot`, `Applebot` i narzędzia generujące podglądy linków nigdy nie są blokowane przez gotowe ustawienia, ponieważ ich zablokowanie usuwa witrynę ze zwykłych wyników wyszukiwania lub psuje podglądy linków.

Cel określa, które kategorie zostają zamknięte. Następnie generator zapisuje jedną grupę na kategorię, dzięki czemu plik pozostaje czytelny, i dodaje do każdej grupy wyjątki dla ścieżek.

## Dlaczego plik jest sprawdzany przed wyświetleniem

robots.txt ma kilka reguł, które zaskakują: **wygrywa najdłuższa pasująca reguła**, przy remisie **wygrywa Allow**, crawler z **własną grupą ignoruje `User-agent: *`**, a **puste wiersze nie rozdzielają grup**. Po zbudowaniu pliku generator parsuje go tym samym algorytmem co otwartoźródłowy parser Google (testujemy go na przypadkach testowych samego Google i na 46 rzeczywistych plikach robots.txt) i sprawdza dla każdego agenta i każdej istotnej ścieżki, czy wynik odpowiada wybranej polityce. Pieczątka pod plikiem pokazuje, ile sprawdzeń wykonano.

## Czego robots.txt nie potrafi

robots.txt to publiczna prośba zdefiniowana w [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html). Odpowiedzialne crawlery jej przestrzegają, inne nie, a fałszywy User-Agent może wysłać każdy. Do egzekwowania służy blokada na serwerze lub w CDN – strona [reguły serwera](page:server-rules) tworzy reguły dla nginx, Apache, Caddy i Cloudflare na podstawie tego samego rejestru – oraz weryfikacja botów po adresie IP lub odwrotnym DNS.
