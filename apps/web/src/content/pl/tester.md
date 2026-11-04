---
title: "Tester robots.txt: sprawdź plik i reguły dla botów online"
description: "Darmowy tester i walidator robots.txt: pobranie pliku dowolnej strony lub wklejenie własnego, dostęp crawlerów AI, test URL dla user-agenta i wykrywanie błędów."
h1: "Tester i walidator robots.txt"
nav: "Tester robots.txt"
lead: "Narzędzie pobiera robots.txt dowolnej strony lub analizuje wklejony plik, testuje adres URL dla dowolnego crawlera, sprawdza, czy każdy z {{agents}} agentów AI może crawlować witrynę, i wyświetla listę błędów – z dokładnym wierszem, który rozstrzyga każdą odpowiedź."
steps:
  - "Wpisz domenę lub dowolny adres URL witryny (używany jest tylko host) i kliknij **Pobierz robots.txt** – albo przełącz na **Wklej robots.txt**, aby przetestować wersję roboczą bez publikowania jej."
  - "Przeczytaj wiersz statusu: Google traktuje odpowiedź **4xx** jak „brak robots.txt”, a odpowiedź **5xx** jak „na razie niczego nie crawlować”; sprawdzane są też przekierowania, rozmiar i typ treści."
  - "Wpisz ścieżkę lub pełny URL i wybierz crawlera: wynik wskazuje **rozstrzygający wiersz** i obowiązującą grupę oraz wyróżnia oba elementy w pliku."
  - "Przejrzyj tabelę crawlerów AI: strona główna i testowana ścieżka, każda ze statusem **Dozwolone**, **Zablokowane** lub **Częściowo**, oraz informacja, czy crawler ma własną grupę."
  - "Popraw to, co wskazuje **raport walidacji**, i przetestuj ponownie. Potrzebny nowy plik? Otwórz [generator](page:home)."
capabilities:
  - feature: "Te same wyniki co parser Google"
    status: "yes"
    note: "Obejmuje wszystkie przypadki testowe otwartoźródłowego parsera robots.txt Google i daje te same werdykty dla 46 rzeczywistych plików robots.txt dużych witryn."
  - feature: "Pobieranie na żywo z dowolnej strony"
    status: "yes"
    note: "Przez nasze narzędzie sprawdzające: tylko publiczne hosty http/https, standardowe porty, do 5 przekierowań, 5 sekund, 512 KiB. Wyniki są przechowywane w pamięci podręcznej przez 10 minut."
  - feature: "Wklejanie i testowanie offline"
    status: "yes"
    note: "Wklejony tekst jest analizowany w przeglądarce i nigdy nie jest przesyłany."
  - feature: "Walidacja (linting)"
    status: "yes"
    note: "Ponad 35 kontroli: składnia, literówki tolerowane przez Google, grupy, które po cichu pomijają reguły `*`, pułapki pustych wierszy, pełne adresy URL w regułach, limit 500 KiB, składnia Content-Signal i Content-Usage, bloki zarządzane przez Cloudflare."
  - feature: "Strony za logowaniem lub zaporą"
    status: "no"
    note: "Pobieramy tylko `/robots.txt` z publicznego internetu, tak jak zrobiłby to crawler. WAF lub CDN może mimo to blokować crawlery dozwolone w robots.txt – warto sprawdzić ustawienia CDN."
  - feature: "Meta tagi robots i X-Robots-Tag"
    status: "no"
    note: "Reguły na poziomie strony nie są tu sprawdzane; zob. [meta tagi AI](page:meta-tags)."
faq:
  - q: "Co się stało z testerem robots.txt od Google?"
    a: "Pod koniec 2023 r. Google wycofał tester robots.txt z Search Console i zastąpił go raportem robots.txt, który pokazuje pobrany plik i błędy, ale nie pozwala przetestować adresu URL dla konkretnego user-agenta. Ta strona wypełnia tę lukę i stosuje te same reguły dopasowania co otwartoźródłowy parser Google."
  - q: "Dlaczego URL jest dozwolony, choć `User-agent: *` go blokuje?"
    a: "Ponieważ wybrany crawler ma własną grupę. Crawler stosuje się tylko do najbardziej szczegółowej grupy, która go wymienia, więc reguły pod `User-agent: *` przestają go dotyczyć. Raport walidacji oznacza każdego agenta, dla którego z tego powodu przepada reguła `*`."
  - q: "Co się dzieje, gdy robots.txt zwraca 404, 403 lub 500?"
    a: "Google traktuje odpowiedzi 4xx (poza 429) tak, jakby robots.txt nie istniał – crawlować można wszystko. 5xx i 429 oznaczają „na razie nie crawlować”; Google ponawia próby i po ok. 30 dniach może użyć kopii z pamięci podręcznej lub uznać witrynę za nieograniczoną."
  - q: "Czy kolejność wierszy Allow i Disallow ma znaczenie?"
    a: "Nie. Wygrywa najdłuższy pasujący wzorzec niezależnie od kolejności; jeśli wzorce Allow i Disallow są równie długie, wygrywa Allow. `*` dopasowuje dowolne znaki, a `$` oznacza koniec adresu URL."
  - q: "Czy robots.txt lub sprawdzana domena są zapisywane?"
    a: "Wklejony tekst nigdy nie opuszcza przeglądarki. Przy sprawdzaniu na żywo nasz serwer pobiera plik i przechowuje go w pamięci do 10 minut, aby kolejne sprawdzenia były szybkie; domeny nie są zapisywane w logach ani w analityce."
  - q: "Jaki user-agent wysyła narzędzie sprawdzające?"
    a: "`Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)`. Pobiera ono tylko `/robots.txt`, raz na sprawdzenie. Więcej: [nasz bot sprawdzający](page:checker-bot)."
related: ["home", "bots", "server-rules", "guide-syntax", "guide-bad-bots"]
updated: "2026-11-04"
---

## Jak crawler czyta robots.txt

Tester stosuje reguły [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) dokładnie tak jak otwartoźródłowy parser Google:

1. **Znalezienie grupy.** Grupa to jeden lub więcej wierszy `User-agent`, po których następują reguły. Crawler używa każdej grupy, która wymienia jego token produktu (bez rozróżniania wielkości liter, z pominięciem numerów wersji), i scala je. Grupę `User-agent: *` stosuje tylko wtedy, gdy żadna grupa go nie wymienia. Puste wiersze nie kończą grupy.
2. **Znalezienie pasujących reguł.** Każdy wzorzec `Allow` i `Disallow` jest porównywany ze ścieżką i parametrami zapytania adresu URL. Wzorce są dopasowywane od początku ścieżki; `*` oznacza dowolne znaki, a końcowy `$` – koniec adresu URL. Dopasowanie rozróżnia wielkość liter.
3. **Wybór najdłuższego dopasowania.** Wygrywa reguła z najdłuższym wzorcem. Jeśli `Allow` i `Disallow` są równie długie, wygrywa `Allow`. Brak pasującej reguły oznacza, że adres URL jest dozwolony.

Google toleruje też typowe błędy – `Dissallow`, `User agent`, brak dwukropka – i ignoruje wszystko powyżej 500 KiB. Tester odtwarza to zachowanie i zgłasza każdy taki przypadek, aby inne crawlery, które mogą być bardziej rygorystyczne, odczytały plik tak samo.

## Jak działa sprawdzanie na żywo

Nasz serwer wysyła żądanie `https://your-host/robots.txt` (z przejściem na `http://`, jeśli nie da się nawiązać połączenia HTTPS), wykonuje do pięciu przekierowań, przerywa po 5 sekundach lub 512 KiB i zwraca surowe bajty, aby można było sprawdzić znaczniki kolejności bajtów i kodowanie. Przed każdym połączeniem sam rozwiązuje nazwę hosta i odrzuca adresy prywatne, lokalne i zarezerwowane. Cała reszta – parsowanie, dopasowywanie, walidacja – odbywa się w przeglądarce.
