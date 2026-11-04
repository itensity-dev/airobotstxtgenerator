---
title: "Zastrzeżenie TDM i opt-out z AI: art. 26³ prawa autorskiego"
description: "robots.txt jako zastrzeżenie TDM: AI Act, art. 4 dyrektywy DSM, art. 26³ pr. aut., kodeks praktyk GPAI i co opublikować. Informacja, nie porada prawna."
h1: "Boty AI a AI Act: co oznacza zastrzeżenie eksploracji tekstów i danych"
nav: "Boty AI a AI Act"
lead: "Prawo UE pozwala każdemu eksplorować publicznie dostępne treści w dowolnym celu, chyba że uprawniony zastrzegł to prawo w sposób nadający się do odczytu maszynowego. Od sierpnia 2025 r. dostawcy modeli AI muszą wykazać, że respektują takie zastrzeżenia – a kodeks praktyk wymienia robots.txt."
related: ["tdmrep", "content-signals", "home", "guide-training-search"]
updated: "2026-11-04"
faq:
  - q: "Czy reguła Disallow w robots.txt jest prawnie skutecznym zastrzeżeniem?"
    a: "Kodeks praktyk traktuje robots.txt zgodny z RFC 9309 jako protokół, którego sygnatariusze muszą przestrzegać, a sądy rozpatrywały już zastrzeżenia nadające się do odczytu maszynowego, jednak skutek prawny zależy od prawa krajowego i okoliczności sprawy. To informacja, nie porada prawna."
  - q: "Czy AI Act dotyczy firm AI spoza UE?"
    a: "Obowiązki dotyczą dostawców, którzy wprowadzają modele AI ogólnego przeznaczenia do obrotu na rynku UE, niezależnie od miejsca ich siedziby. Polityka w zakresie praw autorskich musi obejmować zastrzeżenia uprawnionych z UE."
  - q: "Co należy opublikować?"
    a: "Plik robots.txt blokujący niechciane crawlery treningowe AI, opcjonalnie plik TDMRep oraz stosowną klauzulę w regulaminie. Warto przechowywać datowane kopie robots.txt, aby móc wykazać, od kiedy obowiązywało zastrzeżenie."
---

*Ta strona ma charakter informacyjny i nie stanowi porady prawnej.*

## Dwa akty prawne, jeden mechanizm

**Dyrektywa DSM (UE) 2019/790, art. 4** zezwala na eksplorację tekstów i danych z legalnie dostępnych utworów – na tej podstawie prawnej opiera się znaczna część trenowania AI w UE – chyba że uprawniony **wyraźnie zastrzegł** takie korzystanie. W przypadku treści udostępnionych publicznie w internecie zastrzeżenie powinno zostać wyrażone w odpowiedni sposób, np. za pomocą środków nadających się do odczytu maszynowego. Wszystkie państwa członkowskie wdrożyły tę regułę w swoim prawie autorskim.

**AI Act, art. 53 ust. 1 lit. c** zobowiązuje dostawców modeli AI ogólnego przeznaczenia do wprowadzenia polityki zapewniającej zgodność z unijnym prawem autorskim, a w szczególności do identyfikowania i respektowania zastrzeżeń praw na podstawie art. 4 ust. 3 dyrektywy DSM – również przy użyciu najnowocześniejszych technologii. Obowiązki te mają zastosowanie od **2 sierpnia 2025 r.**; od **2 sierpnia 2026 r.** Urząd ds. AI (AI Office) może je egzekwować za pomocą kar pieniężnych.

## Co mówi kodeks praktyk

Kodeks praktyk dla modeli AI ogólnego przeznaczenia (GPAI Code of Practice, rozdział dotyczący praw autorskich, lipiec 2025 r.) to sposób, w jaki większość dużych dostawców wykazuje zgodność z przepisami. Sygnatariusze zobowiązują się m.in. do:

1. używania crawlerów, które **odczytują robots.txt i przestrzegają go zgodnie z RFC 9309** oraz późniejszymi wersjami standardu;
2. identyfikowania i respektowania **innych odpowiednich protokołów nadających się do odczytu maszynowego**, służących do zastrzegania praw – przyjętych przez organizacje normalizacyjne lub powszechnie stosowanych przez uprawnionych;
3. publikowania informacji o swoich crawlerach i o tym, jak obsługują robots.txt.

Komisja przeprowadziła konsultacje w sprawie tego, jakie inne protokoły się liczą; w chwili pisania tego tekstu oficjalna lista nie została opublikowana.

## Co to oznacza w praktyce

- Reguła `Disallow` dla crawlera treningowego danego dostawcy (np. `GPTBot`, `ClaudeBot`, `MistralAI-Training`, `CCBot`) to najszerzej uznawana forma zastrzeżenia nadającego się do odczytu maszynowego.
- Token taki jak `Google-Extended` czy `Applebot-Extended` wyraża zastrzeżenie bez usuwania strony z wyników wyszukiwania.
- **robots.txt zastrzega prawa wobec crawlerów wymienionych z nazwy.** Nieznany crawler treningowy nie jest nim objęty. Wspólne grupy, takie jak `__usage_ai-training`, i wiersze oparte na zastosowaniu, takie jak `Content-Usage: train-ai=n`, mają wypełnić tę lukę; [TDMRep](page:tdmrep) to protokół zaprojektowany specjalnie z myślą o zastrzeżeniach z art. 4.
- Oświadczenia w języku naturalnym w regulaminie mogą nie wystarczyć w przypadku treści publikowanych online; sądy oczekiwały formy nadającej się do odczytu maszynowego.

## Polska: art. 26³ ustawy o prawie autorskim

W Polsce art. 4 dyrektywy DSM wdrożono w ustawie o prawie autorskim i prawach pokrewnych. Zgodnie z art. 26³ ust. 1 „wolno zwielokrotniać rozpowszechnione utwory w celu eksploracji tekstów i danych, chyba że uprawniony zastrzegł inaczej”.

- **Zastrzeżenie** powinno być jasne i dostosowane do sposobu rozpowszechnienia utworu (art. 26³ ust. 2). W przypadku treści publikowanych w internecie praktyczną formą jest zastrzeżenie nadające się do odczytu maszynowego – reguły w robots.txt, opcjonalnie uzupełnione o TDMRep.
- Eksploracji tekstów i danych na potrzeby badań naukowych dotyczy odrębny art. 26², a baz danych – art. 8a ustawy o ochronie baz danych.
- ZAiKS zastrzegł eksplorację tekstów i danych dla swojego repertuaru (opt-out), wskazując, że bez takiego zastrzeżenia nie można domagać się wynagrodzenia za wykorzystanie utworów do trenowania AI. Organizacja publikuje też przykładowy plik robots.txt i zaznacza, że nie działa on wobec operatorów, którzy go ignorują.

## Konfiguracja, którą można obronić

1. robots.txt z zablokowanymi crawlerami treningowymi – można go utworzyć w [generatorze](page:home).
2. Opcjonalnie plik `tdmrep.json` i wiersz `Content-Usage`.
3. Zdanie w regulaminie zastrzegające eksplorację tekstów i danych na podstawie art. 4 ust. 3 dyrektywy DSM (w Polsce: art. 26³ ustawy o prawie autorskim i prawach pokrewnych).
4. Archiwum robots.txt z datami (np. kopia w systemie kontroli wersji).
