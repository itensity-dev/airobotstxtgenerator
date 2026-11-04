---
title: "Blokowanie botów AI w Express, Next.js, Django i PHP"
description: "Gotowy middleware blokujący GPTBot, ClaudeBot i inne crawlery AI po User-Agencie w Express, Next.js (proxy.ts), Django i PHP/WordPress; robots.txt otwarty."
h1: "Blokowanie botów AI w aplikacji"
nav: "Frameworki"
lead: "Gdy nie można zmienić konfiguracji serwera WWW, crawlery AI można zablokować w samej aplikacji: middleware dla Express, Next.js, Django oraz czystego PHP lub WordPressa, generowany na podstawie rejestru."
steps:
  - "Wybierz framework i agentów, a następnie skopiuj kod."
  - "Express: zarejestruj middleware przed trasami. Next.js: zapisz jako `proxy.ts` w katalogu głównym projektu (`middleware.ts` w wersjach przed Next.js 16). Django: dodaj klasę do `MIDDLEWARE`. PHP: dołącz plik na samym początku `index.php` lub umieść go w `wp-content/mu-plugins/`."
  - "Wdróż i przetestuj poleceniem `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Bez dostępu do serwera"
    status: "yes"
    note: "Działa na platformach, na których kontrolowany jest tylko kod (Vercel, Render, współdzielony hosting PHP)."
  - feature: "Pliki statyczne serwowane przez CDN"
    status: "partly"
    note: "Żądania obsłużone przez CDN lub serwer plików statycznych nigdy nie docierają do middleware; tam również należy ustawić blokadę."
  - feature: "Wydajność"
    status: "yes"
    note: "Jedno skompilowane wyrażenie regularne na żądanie."
faq:
  - q: "Czy middleware jest równie dobry jak reguła serwera?"
    a: "Odrzuca te same żądania, ale później: aplikacja zaczęła już je obsługiwać. Reguły serwera lub CDN są tańsze. Middleware to właściwy wybór, gdy nie można zmienić konfiguracji serwera."
  - q: "Czy proxy w Next.js działa dla zasobów statycznych?"
    a: "Domyślnie działa dla każdej trasy; aby oszczędzić wywołania, można dodać `config.matcher`, który wyklucza `_next/static` i obrazy."
related: ["server-rules", "server-nginx", "server-cloudflare", "bots"]
updated: "2026-11-04"
---

## Jak middleware podejmuje decyzję

Każdy fragment kodu buduje z nazw User-Agent wybranych agentów jedno wyrażenie regularne bez rozróżniania wielkości liter, pomija ścieżkę `/robots.txt` i odpowiada na pasujące żądania wybranym statusem oraz krótkim komunikatem tekstowym. Nic innego w aplikacji się nie zmienia.
