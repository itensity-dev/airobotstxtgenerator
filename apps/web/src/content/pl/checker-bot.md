---
title: "AIRobotsTxtChecker – bot naszego testera robots.txt"
description: "Informacje o AIRobotsTxtChecker, czyli User-Agencie używanym przez nasz tester robots.txt: co pobiera (tylko /robots.txt), jak często, skąd i jak go zablokować."
h1: "Nasz bot sprawdzający: AIRobotsTxtChecker"
nav: "Bot sprawdzający"
lead: "Gdy ktoś korzysta ze sprawdzania na żywo w naszym testerze robots.txt, nasz serwer jednorazowo pobiera plik /robots.txt danej witryny z tym User-Agentem. Nigdy nie pobiera niczego innego."
related: ["tester", "privacy", "about"]
updated: "2026-11-04"
---

## User-Agent

```
Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)
```

## Co robi

- Pobiera **wyłącznie** `/robots.txt` hosta wpisanego przez użytkownika – nigdy stron, obrazów ani map witryny.
- Jedno żądanie na sprawdzenie; wyniki są przechowywane w pamięci podręcznej przez 10 minut, więc ponowne sprawdzenia tego samego hosta w tym czasie nie generują nowego żądania.
- Wykonuje maksymalnie 5 przekierowań, czeka maksymalnie 5 sekund i odczytuje maksymalnie 512 KiB.
- Łączy się wyłącznie z publicznymi adresami IP na portach 80 i 443.
- Nie jest crawlerem: nie podąża za linkami, nie przechowuje pliku poza pamięcią podręczną i nie wykorzystuje go do niczego innego.

## Czy przestrzega robots.txt?

Odczytuje robots.txt, ale nie crawluje niczego, czego robots.txt mógłby dotyczyć. Podobnie jak narzędzie Google pobierające robots.txt, nie stosuje reguł robots.txt do samego pliku robots.txt.

## Jak go zablokować

Aby robots.txt witryny nie był sprawdzany za pośrednictwem naszej strony, wystarczy zwracać `403` dla User-Agenta `AIRobotsTxtChecker`, np. w nginx:

```nginx
if ($http_user_agent ~* "AIRobotsTxtChecker") { return 403; }
```

Pytania i zgłoszenia nadużyć: {{contact}}.
