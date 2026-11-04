---
title: "Zablokuj trenowanie AI i zostań widoczny w wyszukiwarkach AI"
description: "Jak zablokować GPTBot, ClaudeBot i Google-Extended, a zachować widoczność w ChatGPT, Perplexity i AI Overviews: które boty blokować, a które wpuścić."
h1: "Jak zablokować trenowanie AI i pozostać widocznym w wyszukiwarkach AI"
nav: "Blokada trenowania AI bez utraty widoczności"
lead: "Większość firm AI używa dziś osobnych agentów do trenowania, wyszukiwania i obsługi żądań użytkowników. Zablokowanie crawlerów i tokenów treningowych przy jednoczesnym dopuszczeniu agentów wyszukiwania sprawia, że strony pozostają cytowane w odpowiedziach AI, nie zasilając kolejnego modelu."
related: ["home", "bots", "tester", "server-rules", "content-signals"]
updated: "2026-11-04"
faq:
  - q: "Czy po zablokowaniu GPTBot strona zniknie z ChatGPT?"
    a: "Nie. Odpowiedzi wyszukiwania w ChatGPT pochodzą z indeksu OAI-SearchBot, który jest odrębny. Wystarczy zablokować GPTBot i dopuścić OAI-SearchBot, aby strona nadal mogła być cytowana."
  - q: "Czy trzeba zablokować Googlebot, aby treści nie trafiały do Gemini?"
    a: "Nie – i nie należy tego robić, bo usuwa to stronę z wyszukiwarki Google. Aby zrezygnować z trenowania Gemini i groundingu, wystarczy reguła Disallow dla `Google-Extended`. AI Overviews są częścią wyszukiwarki i kontroluje się je tagami dotyczącymi fragmentów, np. `nosnippet`, a nie za pomocą Google-Extended."
  - q: "Czy zablokowanie crawlerów treningowych usuwa treści z już wytrenowanych modeli?"
    a: "Nie. Reguła w robots.txt wpływa tylko na przyszłe crawlowanie. Niektóre firmy oferują osobne procedury usunięcia lub rezygnacji dotyczące istniejących danych; szczegóły można znaleźć w ich dokumentacji."
  - q: "A co z Common Crawl?"
    a: "Z archiwum CCBot korzysta wielu twórców AI, więc jego zablokowanie jest częścią rezygnacji z trenowania. Usuwa ono też strony z przyszłych migawek Common Crawl używanych do badań."
---

## Trzy rodzaje agentów AI

Od 2024 r. duże firmy AI rozdzieliły swoje crawlery według przeznaczenia, w dużej mierze po to, aby wydawcy mogli dokonać właśnie tego wyboru:

| Firma | Trenowanie | Wyszukiwanie AI (indeksowanie i cytowanie) | Żądanie użytkownika (pobranie na żywo) |
|---|---|---|---|
| OpenAI | `GPTBot` | `OAI-SearchBot` | `ChatGPT-User` |
| Anthropic | `ClaudeBot` | `Claude-SearchBot` | `Claude-User` |
| Perplexity | — (deklaruje, że nie trenuje modeli na pobranych treściach) | `PerplexityBot` | `Perplexity-User` |
| Google | `Google-Extended` (token) | Googlebot (wyszukiwarka, AI Overviews) | `Google-Agent`, `Google-GeminiNotebook` |
| Apple | `Applebot-Extended` (token) | Applebot | — |
| Meta | `meta-externalagent` | `meta-webindexer` | `meta-externalfetcher` |
| Mistral | `MistralAI-Training` | `MistralAI-Index` | `MistralAI-User` |
| Amazon | `Amazonbot` (także inne zastosowania) | `Amzn-SearchBot` | `Amzn-User` |

Crawlery i tokeny **treningowe** decydują o tym, czy strony mogą trafić do danych treningowych modelu. Agenci **wyszukiwania** decydują, czy produkt AI może znaleźć i zacytować witrynę – to z nich pochodzi ruch z AI. Narzędzia działające **na żądanie użytkownika** otwierają stronę, ponieważ ktoś o nią poprosił; kilku operatorów podaje, że robots.txt może ich nie dotyczyć.

## Plik robots.txt

Pierwszy cel [generatora](page:home) tworzy taką politykę dla każdego udokumentowanego agenta. Jej rdzeń wygląda tak:

```
# AI training crawlers — blocked
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: CCBot
User-agent: meta-externalagent
User-agent: MistralAI-Training
User-agent: Bytespider
Disallow: /

# AI usage controls (robots.txt tokens, not crawlers) — blocked
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: __usage_ai-training
Disallow: /

# Everyone else, including OAI-SearchBot, Claude-SearchBot, PerplexityBot
User-agent: *
Disallow: /admin/
```

Agenci wyszukiwania nie są nigdzie wymienieni: nie mają własnej grupy, więc stosują `User-agent: *` tak jak Google i Bing. To celowe. Jeśli agent wyszukiwania dostanie własną grupę – np. aby zamknąć dla niego `/premium/` – całkowicie przestaje czytać grupę `*`, więc każdą regułę `*` trzeba powtórzyć w jego grupie. Generator robi to automatycznie po dodaniu wyjątku ścieżki tylko dla AI.

## Crawlery o mieszanym przeznaczeniu

Niektórzy agenci pod jedną nazwą realizują kilka celów. `Amazonbot` ulepsza produkty Amazona i może być używany do trenowania; `meta-externalagent` zarówno trenuje modele, jak i indeksuje treści; archiwum `CCBot` zasila badania naukowe, a także trenowanie AI. W tym wariancie generator traktuje je jak crawlery treningowe, co utrzymuje restrykcyjną politykę, i wskazuje, którzy agenci należą do tej grupy, aby w trybie wyboru dla każdego bota można było przełączyć wybranych na *zezwól*.

Crawlery ogólne to inny przypadek: `Googlebot`, `Bingbot` i `Applebot` zasilają wyszukiwarki, a za ich pośrednictwem funkcje AI, takie jak AI Overviews i Copilot. Nie należy ich blokować, aby powstrzymać trenowanie AI – do tego służą `Google-Extended`, `Applebot-Extended`, a w przypadku Binga tagi `noarchive`/`nocache` lub grupa `__usage_ai-training`, którą Bing obsługuje od 2027 r.

## Sprawdzenie wyniku

1. Wklej plik do [testera](page:tester) i sprawdź tabelę crawlerów: agenci treningowi – **Zablokowane**, agenci wyszukiwania – **Dozwolone**.
2. Przetestuj kilka ważnych adresów URL dla `OAI-SearchBot` i `PerplexityBot`.
3. W przypadku korzystania z Cloudflare sprawdź też ustawienia AI Crawl Control: blokada w CDN ma pierwszeństwo przed zezwoleniem w robots.txt.
4. Dla agentów ignorujących robots.txt dodaj [reguły serwera](page:server-rules).
