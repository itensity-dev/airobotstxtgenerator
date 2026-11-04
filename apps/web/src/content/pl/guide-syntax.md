---
title: "Składnia robots.txt (RFC 9309): reguły i przykłady"
description: "Składnia robots.txt z przykładami: grupy, User-agent, Allow i Disallow, symbole * i $, najdłuższe dopasowanie, rozmiar pliku, kody statusu i typowe błędy."
h1: "Składnia robots.txt według RFC 9309 – z przykładami"
nav: "Składnia robots.txt"
lead: "robots.txt stał się standardem internetowym we wrześniu 2022 r. jako RFC 9309. Jego reguły są krótkie, ale kilka z nich – najdłuższe dopasowanie, jedna grupa na crawlera, puste wiersze – zaskakuje niemal wszystkich. Każdy przykład poniżej można wkleić do testera."
related: ["tester", "home", "guide-bad-bots", "bots"]
updated: "2026-11-04"
faq:
  - q: "Czy robots.txt rozróżnia wielkość liter?"
    a: "W nazwach dyrektyw (`User-agent`, `Disallow`) i nazwach botów – nie; w ścieżkach – tak. `Disallow: /Private/` nie blokuje `/private/`."
  - q: "Czy można używać wyrażeń regularnych?"
    a: "Nie. Specjalne znaczenie mają tylko `*` (dowolny ciąg znaków) i `$` na końcu wzorca (koniec adresu URL)."
  - q: "Czy potrzebny jest wiersz Allow?"
    a: "Tylko po to, aby ponownie otworzyć ścieżkę wewnątrz zablokowanej. Wszystko, co nie jest zablokowane, jest dozwolone."
  - q: "Czy robots.txt obowiązuje dla subdomen?"
    a: "Nie. Każda kombinacja schematu, hosta i portu ma własny plik: `https://example.com/robots.txt` nie obejmuje `https://blog.example.com/`."
---

## Plik

robots.txt to plik zwykłego tekstu w kodowaniu UTF-8, umieszczony w katalogu głównym hosta: `https://example.com/robots.txt`. Crawlery pobierają go przed rozpoczęciem crawlowania. Wiersze mają postać `klucz: wartość`; `#` rozpoczyna komentarz. Google odczytuje do **500 KiB** i ignoruje resztę.

## Grupy

**Grupa** to jeden lub więcej wierszy `User-agent`, po których następują reguły:

```
User-agent: GPTBot
User-agent: CCBot
Disallow: /

User-agent: *
Disallow: /admin/
```

- Crawler używa grupy (lub grup), które go **wymieniają**. Dopasowanie nie rozróżnia wielkości liter i uwzględnia tylko token produktu: `User-agent: GPTBot/1.4` jest odczytywany jako `GPTBot`.
- Jeśli kilka grup wymienia tego samego crawlera, ich reguły są **scalane**.
- Grupy `User-agent: *` używa tylko crawler, którego nie wymienia żadna grupa.
- Crawler z własną grupą **całkowicie ignoruje `*`**. W przykładzie `GPTBot` nie może pobrać niczego – ale gdyby jego grupa zawierała tylko `Disallow: /blog/`, mógłby pobrać `/admin/`, ponieważ reguła `*` przestałaby go dotyczyć.

**Puste wiersze nie kończą grupy.** Ten plik przypisuje `GPTBot` reguły `*`, ponieważ oba wiersze User-agent należą do tej samej grupy:

```
User-agent: GPTBot

User-agent: *
Disallow: /private/
```

## Reguły: Allow i Disallow

`Disallow: /path` blokuje każdy URL, którego ścieżka zaczyna się od `/path` – w tym `/path.html`, `/path/` i `/pathology`. Pusty `Disallow:` zezwala na wszystko. `Allow` ponownie otwiera ścieżkę.

Gdy pasuje kilka reguł, **wygrywa najdłuższy wzorzec**; jeśli wzorce Allow i Disallow mają tę samą długość, **wygrywa Allow**. Kolejność wierszy nie ma znaczenia.

```
User-agent: *
Disallow: /shop/
Allow: /shop/catalog/
```

`/shop/cart` jest zablokowany; `/shop/catalog/shoes` jest dozwolony (14 znaków wygrywa z 6).

## Symbole wieloznaczne

- `*` dopasowuje dowolny ciąg znaków: `Disallow: /*.pdf` blokuje każdy URL zawierający `.pdf`.
- `$` na końcu oznacza koniec adresu URL: `Disallow: /*.pdf$` blokuje `/a.pdf`, ale nie `/a.pdf?download=1`.
- Końcowa `*` niczego nie zmienia: `/private*` to to samo co `/private`.
- Wzorce są dopasowywane do ścieżki **i parametrów zapytania**: `Disallow: /*?sort=` blokuje posortowane strony list.

## Inne wiersze

- `Sitemap: https://example.com/sitemap.xml` – pełny URL; dotyczy wszystkich crawlerów i może się znajdować w dowolnym miejscu pliku.
- `Crawl-delay` – ignorowany przez Google; respektują go Bing, Yandex, Anthropic i Common Crawl.
- `Noindex` w robots.txt – nieobsługiwany od 2019 r.; należy użyć meta tagu robots.
- `Content-Signal`, `Content-Usage` – propozycje preferencji AI; zob. [content signals](page:content-signals).

## Gdy pliku brakuje lub jest uszkodzony

| Odpowiedź dla /robots.txt | Zachowanie Google |
|---|---|
| 200 | Reguły obowiązują |
| 3xx | Wykonuje do 5 przekierowań, potem traktuje jak 404 |
| 4xx (poza 429) | Brak ograniczeń – crawlować można wszystko |
| 5xx, 429 | Crawlowanie wstrzymane; po ok. 30 dniach kopia z pamięci podręcznej lub brak ograniczeń |
| Serwer nieosiągalny | Traktowane jak 5xx |

## Błędy, które Google wybacza – a inni niekoniecznie

Google akceptuje `Dissallow`, `User agent`, brak dwukropka (`Disallow /admin`) i znacznik kolejności bajtów. Inne crawlery mogą ich nie akceptować, dlatego [tester](page:tester) je zgłasza, mimo że parser Google je odczytuje. Wskazuje też reguły przed jakimkolwiek wierszem `User-agent` (ignorowane przez wszystkich), pełne adresy URL w `Disallow` (nigdy nie pasują) i ścieżki bez początkowego ukośnika.
