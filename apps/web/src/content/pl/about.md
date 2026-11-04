---
title: "O projekcie AI Robots.txt Generator: kto go tworzy i po co"
description: "Bezpłatne, niezależne narzędzie do wyboru crawlerów AI, które mogą korzystać ze strony: kto je tworzy, jak prowadzi rejestr botów i dlaczego wpuszcza boty AI."
h1: "O projekcie"
nav: "O nas"
lead: "Bezpłatny, niezależny zestaw narzędzi do jednej decyzji, przed którą stoi dziś każdy właściciel strony: które crawlery AI mogą czytać i cytować jej treści oraz uczyć się na nich."
related: ["checker-bot", "bots", "privacy", "licenses"]
updated: "2026-11-04"
---

## Czym jest ten projekt

AI Robots.txt Generator (airobotstxtgenerator.com) obejmuje generator, tester, rejestr crawlerów AI z osobną stroną dla każdego z nich, reguły serwera i poradniki. Wszystko, co może działać w przeglądarce – generowanie, parsowanie, testowanie wklejonych plików – działa właśnie tam, a po załadowaniu strony także offline. Jedyny komponent serwerowy pobiera publiczny robots.txt witryny, gdy użytkownik zleci sprawdzenie na żywo.

Projekt należy do niewielkiej sieci bezpłatnych narzędzi jednego twórcy, obejmującej m.in. ibangenerator.io i metasnitch.com. Nie ma kont ani płatnego dostępu do narzędzi, a jedynym ograniczeniem jest limit żądań przy sprawdzaniu na żywo, chroniący przed nadużyciami.

## Jak prowadzony jest rejestr

Każdy wpis redakcyjny jest sprawdzany w dokumentacji operatora i opatrzony datą; strona informuje, w jaki sposób go sprawdzono. Cotygodniowe automatyczne zadanie porównuje naszą listę społeczności z otwartoźródłowym projektem [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt) i otwiera pull request ze zmianami, które są przeglądane przed publikacją. Parser jest testowany na wszystkich przypadkach testowych otwartoźródłowego parsera robots.txt Google oraz na 46 rzeczywistych plikach robots.txt, których wyniki porównaliśmy ze skompilowanym parserem Google. Kod i dane są otwarte: zob. [Licencje](page:licenses).

## Dlaczego nasz robots.txt wpuszcza wszystkie boty AI

Nasz [robots.txt](/robots.txt) wymienia GPTBot, ClaudeBot, PerplexityBot, Google-Extended i wszystkich pozostałych agentów z rejestru – i zezwala im wszystkim na dostęp. Może się to wydawać dziwne w przypadku strony, która pomaga blokować crawlery AI, ale wynika z tej samej zasady: **decyzja według przeznaczenia**. Ta strona istnieje po to, by odpowiadać na pytania; chcemy, aby asystenci AI ją czytali, cytowali i kierowali tu ludzi, i nie mamy nic przeciwko temu, by nasze objaśnienia trafiły do danych treningowych modelu, jeśli dzięki temu odpowiedzi będą lepsze. Wydawca płatnych treści dziennikarskich lub oryginalnej twórczości artystycznej może zasadnie zdecydować inaczej. Narzędzie ułatwia podjęcie każdej z tych decyzji i jej poprawne wdrożenie.

Publikujemy też [/llms.txt](/llms.txt), [/llms-full.txt](/llms-full.txt), wersję Markdown każdej strony (wystarczy dodać `.md` do adresu) oraz cały rejestr jako [/bots.json](/bots.json).

## Kontakt

Poprawki do rejestru, zgłoszenia błędów i pytania: **{{contact}}**. Operatorów crawlerów, których wpis jest błędny lub nieaktualny, prosimy o przesłanie linku do dokumentacji – aktualizujemy wpisy w ciągu kilku dni.

## Fakty

- Online od: 4 listopada 2026 r.
- Języki: English, Deutsch, Français, Español, Italiano, Nederlands, Polski, Português (Brasil), 日本語
- Reklamy: obecnie brak; jeśli zostaną wprowadzone, nigdy nie pojawią się wewnątrz narzędzi.
