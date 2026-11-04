---
title: "Blokowanie botów AI w .htaccess (Apache mod_rewrite)"
description: "Reguły .htaccess blokujące GPTBot, ClaudeBot, CCBot, Bytespider i inne crawlery AI na Apache (mod_rewrite): 403 dla botów AI, robots.txt nadal dostępny."
h1: "Blokowanie botów AI w .htaccess na serwerze Apache"
nav: "Apache .htaccess"
lead: "Trzy wiersze `mod_rewrite` w `.htaccess` odrzucają crawlery AI kodem 403 na podstawie User-Agenta, pomijają `/robots.txt` i działają na hostingu współdzielonym bez dostępu do głównej konfiguracji."
steps:
  - "Wybierz agentów i skopiuj reguły."
  - "Otwórz `.htaccess` w katalogu głównym dokumentów (utwórz go, jeśli nie istnieje) i wklej blok blisko początku pliku, przed regułami przepisywania WordPressa lub używanego frameworka."
  - "Zapisz plik. Restart nie jest potrzebny – Apache odczytuje `.htaccess` przy każdym żądaniu."
  - "Przetestuj poleceniem `curl -I -A \"ClaudeBot\" https://example.com/` (oczekiwany kod 403) oraz `curl -I https://example.com/robots.txt` (oczekiwany kod 200)."
capabilities:
  - feature: "Hosting współdzielony"
    status: "yes"
    note: "Wymaga jedynie `AllowOverride FileInfo` (włączone niemal u każdego dostawcy) i `mod_rewrite`."
  - feature: "Konfiguracja serwera zamiast .htaccess"
    status: "yes"
    note: "Te same wiersze działają wewnątrz `<VirtualHost>` lub `<Directory>` i są tam szybsze."
  - feature: "LiteSpeed i OpenLiteSpeed"
    status: "yes"
    note: "LiteSpeed odczytuje reguły przepisywania Apache z `.htaccess`."
  - feature: "Hosting wyłącznie z nginx"
    status: "no"
    note: "nginx ignoruje `.htaccess`; należy użyć [reguł dla nginx](page:server-nginx)."
faq:
  - q: "W którym miejscu .htaccess umieścić blok?"
    a: "Przed innymi regułami przepisywania. Blok WordPressa kończy się regułą `RewriteRule . /index.php [L]`, która w przeciwnym razie obsłużyłaby żądanie jako pierwsza."
  - q: "Co oznacza [F,L]?"
    a: "`F` zwraca 403 Forbidden, a `L` kończy przetwarzanie kolejnych reguł. `[G,L]` zwraca zamiast tego 410 Gone."
  - q: "Czy zamiast mod_rewrite można użyć SetEnvIf?"
    a: "Tak: `SetEnvIfNoCase User-Agent \"GPTBot\" ai_bot`, a następnie `<RequireAll> Require all granted Require not env ai_bot </RequireAll>` działa bez mod_rewrite, ale wymaga jednego wiersza `SetEnvIfNoCase` na bota i osobnego wyjątku dla `/robots.txt`."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Jak działa reguła

`RewriteCond %{REQUEST_URI} !^/robots\.txt$` wyłącza plik robots.txt. `RewriteCond %{HTTP_USER_AGENT} (GPTBot|ClaudeBot|…) [NC]` dopasowuje dowolną z wymienionych nazw w dowolnym miejscu User-Agenta, bez rozróżniania wielkości liter. Następnie `RewriteRule ^ - [F,L]` odrzuca żądanie bez przepisywania adresu URL. Aby reguła zadziałała, wszystkie warunki muszą być spełnione.

W WordPressie wtyczki cache czasem serwują strony, zanim uruchomi się PHP, ale wciąż po przetworzeniu `.htaccess`, więc blokada obejmuje także strony z pamięci podręcznej.
