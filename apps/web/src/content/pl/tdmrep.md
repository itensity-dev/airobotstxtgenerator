---
title: "Generator TDMRep: tdmrep.json i nagłówek tdm-reservation"
description: "Generator TDMRep: /.well-known/tdmrep.json, nagłówki tdm-reservation i tdm-policy oraz meta tagi HTML do zastrzeżenia eksploracji tekstów i danych (art. 4 DSM)."
h1: "Generator TDMRep"
nav: "TDMRep"
lead: "Narzędzie tworzy pliki protokołu TDM Reservation Protocol (TDMRep) – specyfikacji grupy W3C Community Group, która pozwala w formie nadającej się do odczytu maszynowego zastrzec prawa do eksploracji tekstów i danych na gruncie unijnego prawa autorskiego."
steps:
  - "Wybierz `tdm-reservation: 1`, aby zastrzec prawa, lub `0`, aby wskazać, że prawa nie są zastrzegane."
  - "Opcjonalnie dodaj URL `tdm-policy`, czyli dokumentu nadającego się do odczytu maszynowego, który wyjaśnia, jak uzyskać licencję."
  - "Opublikuj `/.well-known/tdmrep.json` w katalogu głównym strony i/lub dodaj nagłówki HTTP albo meta tagi HTML."
  - "Zachowaj reguły robots.txt dla crawlerów, które mają zostać zatrzymane: TDMRep zastrzega prawa, ale niczego nie blokuje."
capabilities:
  - feature: "Plik dla całej witryny"
    status: "yes"
    note: "`/.well-known/tdmrep.json` z polami `location`, `tdm-reservation` i `tdm-policy`."
  - feature: "Nagłówki i meta tagi dla poszczególnych odpowiedzi"
    status: "yes"
    note: "`tdm-reservation` i `tdm-policy` jako nagłówki HTTP (fragmenty konfiguracji nginx i Apache) oraz jako tagi HTML `<meta>`."
  - feature: "Porada prawna"
    status: "no"
    note: "To, czy zastrzeżenie jest skuteczne, zależy od prawa krajowego i okoliczności. Ta strona ma charakter informacyjny i nie stanowi porady prawnej."
faq:
  - q: "Czym jest TDMRep?"
    a: "To TDM Reservation Protocol, opublikowany przez grupę W3C Community Group (raport końcowy z 2024 r.). Określa, jak uprawniony może wyrazić – w pliku, nagłówku HTTP lub kodzie HTML – że eksploracja tekstów i danych jego treści jest zastrzeżona, na co pozwala art. 4 ust. 3 dyrektywy DSM (2019/790)."
  - q: "Czy TDMRep jest potrzebny, jeśli crawlery AI są już zablokowane w robots.txt?"
    a: "robots.txt określa, kto może pobierać treści; TDMRep określa, co wolno z nimi robić, niezależnie od tego, kto je pobrał. Unijny kodeks praktyk GPAI zobowiązuje sygnatariuszy do przestrzegania robots.txt i innych odpowiednich protokołów nadających się do odczytu maszynowego; publikacja obu to podwójne zabezpieczenie."
  - q: "Które firmy AI odczytują TDMRep?"
    a: "Obsługa jest ograniczona i rzadko dokumentowana. Korzystają z niego europejscy wydawcy i niektórzy dostawcy danych; większość dużych twórców AI dokumentuje wyłącznie robots.txt. TDMRep należy traktować jako dodatkową, ustandaryzowaną deklarację zastrzeżenia."
related: ["content-signals", "guide-eu-ai-act", "meta-tags", "home"]
updated: "2026-11-04"
---

## Miejsce TDMRep

Dyrektywa DSM pozwala na eksplorację tekstów i danych z legalnie dostępnych treści, chyba że uprawniony **wyraźnie ją zastrzegł** – w przypadku treści publikowanych online w odpowiedni sposób, np. za pomocą środków nadających się do odczytu maszynowego. robots.txt jest jednym z takich środków; TDMRep – kolejnym, zaprojektowanym specjalnie w tym celu. Plik `tdmrep.json` może obejmować całą witrynę lub jej części (wzorce `location`), nagłówki – dowolny typ pliku, w tym pliki PDF i obrazy, a meta tagi sprawdzają się tam, gdzie kontrola ogranicza się do kodu HTML.
