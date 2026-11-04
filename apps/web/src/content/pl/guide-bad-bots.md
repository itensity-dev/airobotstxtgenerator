---
title: "Dlaczego robots.txt nie chroni przed złośliwymi botami"
description: "robots.txt to prośba, a nie kontrola dostępu: kto go ignoruje, dlaczego User-Agent można podrobić i czego używać zamiast – reguł serwera, weryfikacji IP, WAF."
h1: "Dlaczego robots.txt nie chroni przed złośliwymi botami"
nav: "robots.txt a złośliwe boty"
lead: "robots.txt to tabliczka na drzwiach, a nie zamek. Działa, ponieważ odpowiedzialne crawlery same decydują się go czytać; scraperów, którym na tym nie zależy lub które podszywają się pod kogoś innego, nie zatrzyma."
related: ["server-rules", "tester", "bots", "guide-syntax"]
updated: "2026-11-04"
faq:
  - q: "Czy robots.txt może uczynić stronę prywatną?"
    a: "Nie. Każdy może otworzyć zablokowany adres URL, a wpisanie go do robots.txt wręcz go reklamuje. Prywatne treści należy chronić uwierzytelnianiem."
  - q: "Jak sprawdzić, czy bot ignoruje robots.txt?"
    a: "Należy szukać w logach serwera żądań do zablokowanych ścieżek z User-Agentem tego bota i zweryfikować adres IP: żądanie spoza zakresów opublikowanych przez operatora nie pochodzi od prawdziwego bota."
  - q: "Czy po prostu blokować wszystko, co wygląda na bota?"
    a: "Nie – oznaczałoby to utratę wyszukiwarek, podglądów linków, monitoringu dostępności (uptime) i narzędzi ułatwień dostępu. Najlepiej blokować po nazwie tam, gdzie to możliwe, weryfikować tam, gdzie pozwalają na to operatorzy, a resztę ograniczać limitami żądań."
---

## Czym jest robots.txt

RFC 9309 mówi to wprost: reguły „nie stanowią formy autoryzacji dostępu”. Crawler pobiera `/robots.txt`, czyta grupę, która go wymienia, i sam decyduje, czy się do niej zastosować. Nic w protokole HTTP nie wymusza tej decyzji.

## Kto go ignoruje

- **Scrapery i narzędzia do masowego zbierania danych**, które nigdy nie pytały o zgodę. Wiele z nich używa zwykłych User-Agentów przeglądarek.
- **Narzędzia pobierające strony w imieniu użytkownika.** OpenAI, Perplexity, Google i Meta podają, że ich narzędzia uruchamiane przez użytkownika (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`, `meta-externalfetcher`) mogą nie przestrzegać robots.txt, ponieważ o stronę poprosił człowiek. Anthropic deklaruje, że jego `Claude-User` go przestrzega.
- **Crawlery bez opublikowanej polityki** – np. `Bytespider` nie ma oficjalnej dokumentacji, a właściciele stron zgłaszali, że ignoruje robots.txt.
- **Podszywające się boty.** Każdy może wysłać `User-Agent: GPTBot` lub `Googlebot`. Fałszywe User-Agenty wyszukiwarek to klasyczny sposób na obejście naiwnych blokad.

## Co ujawnia robots.txt

Plik jest publiczny. Wiersz `Disallow: /admin-backup-2024/` informuje wszystkich, że taka ścieżka istnieje. Tajnych zasobów nie należy tam wpisywać, lecz je chronić.

## Czego używać zamiast niego – lub dodatkowo

| Środek | Zatrzymuje | Uwagi |
|---|---|---|
| robots.txt | Crawlery, które go przestrzegają | Standardowy, udokumentowany sygnał. Warto go zachować. |
| [Reguły serwera](page:server-rules) według User-Agenta | Boty, które się przedstawiają | Tanie i skuteczne wobec nazwanych crawlerów AI |
| Weryfikacja IP / odwrotnego DNS | Boty podszywające się pod znane boty | Zakresy opublikowane przez operatora; zob. [strony botów](page:bots) |
| Limity żądań (rate limiting) | Scrapery o dużym wolumenie, niezależnie od nazwy | Na adres IP lub sieć; chroni serwer |
| Zarządzanie botami w CDN / WAF | Znane złośliwe sieci, automatyzacja przeglądarek | Cloudflare, Fastly, Akamai i inni klasyfikują boty |
| Uwierzytelnianie | Każdego bez konta | Jedyna prawdziwa ochrona prywatnych treści |

## Rozsądna kolejność

1. Opublikuj rzetelny robots.txt – dokumentuje on decyzję i właśnie na niego wskazuje unijny kodeks praktyk.
2. Zablokuj niechcianych agentów AI po nazwie na serwerze lub w CDN.
3. Weryfikuj dopuszczone boty, aby odrzucać podszywające się pod nie żądania.
4. Ogranicz limitami żądań całą resztę i obserwuj logi.
