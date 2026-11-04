---
title: "Meta tag noai, X-Robots-Tag i AI: co naprawdę działa"
description: "Które meta tagi i nagłówki HTTP kontrolują użycie strony przez AI? noai jest niestandardowy; nosnippet, noarchive i X-Robots-Tag działają różnie u różnych firm."
h1: "Meta tagi AI i X-Robots-Tag: co działa"
nav: "Meta tagi AI"
lead: "Kontrola AI na poziomie strony to mozaika: niektóre tagi respektuje jedna firma, inne tylko małe platformy, a jeszcze inne nikt. Ta strona pokazuje, co dziś robi każdy tag, wraz ze źródłami."
steps:
  - "Zdecyduj, czy kontrola na poziomie strony jest w ogóle potrzebna – reguły robots.txt według ścieżek obejmują większość przypadków."
  - "Na podstawie tabeli wybierz tagi, które faktycznie respektują istotne w danym przypadku firmy."
  - "Dodaj je jako `<meta name=\"robots\" content=\"…\">` w HTML albo jako nagłówek HTTP `X-Robots-Tag` dla plików PDF, obrazów i innych plików."
  - "Sprawdź stronę, przeglądając jej kod źródłowy i nagłówki odpowiedzi; [tester](page:tester) sprawdza robots.txt, a nie meta tagi."
capabilities:
  - feature: "Rzetelny status każdego tagu"
    status: "yes"
    note: "Każdy wiersz podaje, kto dokumentuje obsługę danego tagu."
  - feature: "Uniwersalny tag „bez AI”"
    status: "no"
    note: "Taki tag nie istnieje. `noai` jest powszechnie kopiowany, ale nie dokumentują go Google, OpenAI, Anthropic, Microsoft ani Apple."
faq:
  - q: "Czy `<meta name=\"robots\" content=\"noai\">` działa?"
    a: "Tylko na platformach, które go przyjęły, np. w niektórych społecznościach artystycznych. Nie jest częścią żadnego standardu, a duże firmy AI go nie dokumentują. Nie szkodzi, ale nie zastępuje robots.txt."
  - q: "Jak wykluczyć stronę z AI Overviews w Google?"
    a: "Funkcje AI w wyszukiwarce Google stosują zwykłe ustawienia fragmentów (snippetów): `nosnippet` (brak fragmentu), `max-snippet:0` lub `data-nosnippet` na wybranych elementach ograniczają to, co może zostać pokazane. Google-Extended w robots.txt nie wpływa na AI Overviews."
  - q: "Jak ograniczyć wykorzystanie strony przez Copilota?"
    a: "Bing dokumentuje, że `nocache` pozwala Copilotowi pokazywać tylko URL, tytuł i fragment, a `noarchive` wyklucza stronę z odpowiedzi Copilota i z trenowania. Bing zapowiedział też nowe preferencje dotyczące trenowania AI i groundingu na 2027 r."
  - q: "Co daje X-Robots-Tag?"
    a: "Te same dyrektywy co meta tag robots, ale wysyłane jako nagłówek HTTP – to jedyny sposób kontroli plików bez sekcji head w HTML, takich jak pliki PDF i obrazy: `X-Robots-Tag: noarchive, nosnippet`."
related: ["content-signals", "tdmrep", "home", "guide-training-search"]
updated: "2026-11-04"
---

## Tagi i nagłówki po kolei

| Tag lub nagłówek | Działanie | Kto dokumentuje obsługę |
|---|---|---|
| `noai`, `noimageai` | Zamierzone: „nie używać do AI” / „nie używać obrazów do AI” | Nie dokumentują go Google, OpenAI, Anthropic, Microsoft ani Apple; przyjęło go kilka platform. Niestandardowy. |
| `nosnippet` | Brak fragmentu tekstu i podglądu w wynikach; wyklucza też stronę jako źródło fragmentów w AI Overviews i AI Mode | Google, Bing |
| `max-snippet:N` | Ogranicza długość fragmentu; `0` oznacza to samo co `nosnippet` | Google, Bing |
| `data-nosnippet` (atrybut HTML) | Wyklucza część strony z fragmentów i funkcji AI w wyszukiwarce Google | Google |
| `noarchive` | Brak kopii w pamięci podręcznej. Bing: wyklucza stronę z odpowiedzi Copilota i z trenowania; Amazon: nie używać do trenowania modeli | Bing, Amazon |
| `nocache` | Bing: Copilot może używać tylko URL, tytułu i fragmentu | Bing |
| `noindex` | Całkowicie usuwa stronę z wyszukiwarki – a tym samym z funkcji wyszukiwania AI opartych na tym indeksie | Wszystkie główne wyszukiwarki |
| `X-Robots-Tag: …` | Każda z powyższych dyrektyw jako nagłówek HTTP, dla dowolnego typu pliku | Google, Bing |
| `tdm-reservation: 1` | Zastrzega prawa do eksploracji tekstów i danych (UE) – zob. [TDMRep](page:tdmrep) | Podmioty stosujące TDMRep |
| `Content-Usage: train-ai=n` | Preferencja z projektu IETF aipref jako nagłówek HTTP – zob. [content signals](page:content-signals) | Projekt; obsługa nieugruntowana |

Przykład dla strony, która ma pozostać w wynikach wyszukiwania, ale poza odpowiedziami Copilota i trenowaniem:

```html
<meta name="robots" content="noarchive">
<meta name="bingbot" content="nocache">
```

Przykładowy nagłówek dla folderu z plikami PDF w nginx:

```nginx
location /reports/ {
    add_header X-Robots-Tag "noarchive, nosnippet" always;
}
```
