---
title: "Generator Content-Signal i Content-Usage do robots.txt"
description: "Wiersze Content-Signal (Cloudflare) i Content-Usage (projekt IETF aipref) do robots.txt i nagłówków HTTP: search, ai-input, ai-train – z rzetelną oceną obsługi."
h1: "Generator Content-Signal i Content-Usage"
nav: "Content signals"
lead: "Narzędzie pozwala określić, jak można wykorzystywać treści po ich pobraniu – do wyszukiwania, jako dane wejściowe do odpowiedzi AI lub do trenowania – w obu zaproponowanych dotąd składniach: `Content-Signal` od Cloudflare i `Content-Usage` z projektu IETF aipref."
steps:
  - "Wybierz preferencję dla każdego zastosowania: `search`, `ai-input` (odpowiedzi budowane na podstawie stron) i `ai-train`. Wartość pozostawiona bez ustawienia oznacza brak preferencji."
  - "Skopiuj blok robots.txt. Wiersze Content-Signal umieszcza się wewnątrz grupy `User-agent` – zwykle `User-agent: *`."
  - "Opcjonalnie skopiuj wiersz `Content-Usage` lub nagłówek HTTP z projektu IETF."
  - "Pamiętaj, że te wiersze wyrażają jedynie preferencje; aby crawlery trzymały się z daleka, potrzebne są reguły `Disallow`."
capabilities:
  - feature: "Składnia Cloudflare Content Signals"
    status: "yes"
    note: "`Content-Signal: search=yes, ai-input=yes, ai-train=no` umieszczony w grupie, z komentarzem objaśniającym zalecanym przez Cloudflare."
  - feature: "Składnia IETF aipref"
    status: "yes"
    note: "`Content-Usage: train-ai=n` (reguła robots.txt z opcjonalną ścieżką) oraz nagłówek HTTP `Content-Usage`, zgodnie z draft-ietf-aipref-attach."
  - feature: "Gwarantowany efekt"
    status: "no"
    note: "Żadna z tych składni nie jest standardem. Google oświadczył, że Content-Signal nie ma wpływu na jego crawlery; OpenAI, Anthropic i Perplexity nie wspominają o nim w swojej dokumentacji."
faq:
  - q: "Czym jest Content-Signal?"
    a: "To rozszerzenie robots.txt opublikowane przez Cloudflare we wrześniu 2025 r. jako Content Signals Policy. Określa trzy zastosowania – `search`, `ai-input` i `ai-train` – z wartością `yes` lub `no`. Cloudflare dodaje `search=yes, ai-train=no` do zarządzanego robots.txt milionów domen."
  - q: "Czym jest Content-Usage?"
    a: "To składnia opracowywana przez grupę roboczą IETF AI Preferences (aipref): słownik z kategoriami `train-ai`, `ai-use` i `search` oraz wartościami `y` lub `n`, dołączany za pomocą reguły robots.txt lub nagłówka HTTP. Prace nad projektami wciąż trwają; RFC jeszcze nie ma."
  - q: "Czy warto używać obu?"
    a: "Nie wykluczają się, a żadna z nich nie jest jeszcze powszechnie respektowana. Przy korzystaniu z Cloudflare Content-Signal znajduje się już w zarządzanym robots.txt. Dodanie Content-Usage to jeden wiersz, zgodny ze ścieżką, która ma największe szanse stać się standardem."
  - q: "A co z `__usage_ai-training`?"
    a: "To odrębna propozycja z października 2026 r.: grupa w robots.txt (`User-agent: __usage_ai-training` z `Disallow: /`), którą kilka firm AI zapowiedziało traktować jako opt-out z trenowania. W przeciwieństwie do Content-Signal używa zwykłych reguł Allow i Disallow. Zob. [wpis w rejestrze](bot:usage-ai-training)."
related: ["home", "tdmrep", "meta-tags", "guide-eu-ai-act", "bots"]
updated: "2026-11-04"
---

## Trzy generacje preferencji AI w robots.txt

1. **Nazwy crawlerów** (od 2023 r.): blokowanie `GPTBot`, `ClaudeBot`, `Google-Extended`… po jednej firmie naraz. Niezawodne wobec tych, którzy przestrzegają robots.txt, ale wymaga znajomości każdej nazwy.
2. **Sygnały oparte na zastosowaniu** (od 2025 r.): `Content-Signal` i `Content-Usage` opisują zastosowania, a nie crawlery. Są dołączane do grupy i określają, co może się dziać z treściami, które i tak zostały pobrane – np. przez crawlera ogólnej wyszukiwarki.
3. **Wspólna grupa opt-out** (od 2026 r.): do `__usage_ai-training` zwraca się jak do crawlera, ale rozumie ją jednocześnie kilka firm.

Dopóki żadne z tych rozwiązań nie stanie się standardem, najbezpieczniejszy plik wykorzystuje wszystkie trzy: nazwy dostawców dla znanych crawlerów, wspólną grupę dla firm, które ją obsługują, i wiersz oparty na zastosowaniu dla pozostałych. [Generator](page:home) obsługuje dwa pierwsze, a ta strona dodaje trzeci.
