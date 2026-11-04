---
title: "noai-Meta-Tag, X-Robots-Tag & KI: was wirklich wirkt"
description: "Welche Meta-Tags und HTTP-Header steuern die KI-Nutzung einer Seite? noai ist kein Standard; nosnippet, noarchive & X-Robots-Tag wirken je nach Anbieter anders."
h1: "KI-Meta-Tags und X-Robots-Tag: was wirkt"
nav: "KI-Meta-Tags"
lead: "Steuerung auf Seitenebene ist für KI ein Flickenteppich: Manche Tags beachtet ein einziges Unternehmen, manche nur kleine Plattformen, manche niemand. Diese Seite zeigt, was jedes Tag heute bewirkt – mit Quellen."
steps:
  - "Entscheiden Sie, ob Sie überhaupt Steuerung auf Seitenebene brauchen – robots.txt-Regeln nach Pfad decken die meisten Fälle ab."
  - "Wählen Sie anhand der Tabelle die Tags, die die für Sie wichtigen Unternehmen tatsächlich beachten."
  - "Fügen Sie sie als `<meta name=\"robots\" content=\"…\">` ins HTML ein oder als HTTP-Header `X-Robots-Tag` für PDFs, Bilder und andere Dateien."
  - "Testen Sie eine Seite, indem Sie Quelltext und Antwort-Header ansehen; der [Tester](page:tester) prüft die robots.txt, nicht Meta-Tags."
capabilities:
  - feature: "Ehrlicher Status pro Tag"
    status: "yes"
    note: "Jede Zeile nennt, wer die Unterstützung des Tags dokumentiert."
  - feature: "Ein universelles „Keine KI“-Tag"
    status: "no"
    note: "Es gibt keins. `noai` wird viel kopiert, ist aber weder von Google noch von OpenAI, Anthropic, Microsoft oder Apple dokumentiert."
faq:
  - q: "Funktioniert `<meta name=\"robots\" content=\"noai\">`?"
    a: "Nur auf Plattformen, die es übernommen haben, etwa einigen Kunst-Communitys. Es ist nicht Teil eines Standards, und die großen KI-Unternehmen dokumentieren es nicht. Es schadet nicht, ersetzt aber keine robots.txt."
  - q: "Wie halte ich eine Seite aus Googles AI Overviews heraus?"
    a: "Googles KI-Funktionen in der Suche folgen den normalen Snippet-Steuerungen: `nosnippet` (gar kein Snippet), `max-snippet:0` oder `data-nosnippet` auf bestimmten Elementen begrenzen, was angezeigt werden kann. Google-Extended in der robots.txt wirkt sich nicht auf AI Overviews aus."
  - q: "Wie begrenze ich die Nutzung meiner Seite durch Copilot?"
    a: "Bing dokumentiert, dass Copilot bei `nocache` nur URL, Titel und Snippet zeigt und dass `noarchive` die Seite aus Copilot-Antworten und dem Training heraushält. Bing hat außerdem neue Präferenzen für KI-Training und Grounding für 2027 angekündigt."
  - q: "Was bringt X-Robots-Tag zusätzlich?"
    a: "Dieselben Direktiven wie das Robots-Meta-Tag, gesendet als HTTP-Header – der einzige Weg, Dateien ohne HTML-Head zu steuern, etwa PDFs und Bilder: `X-Robots-Tag: noarchive, nosnippet`."
related: ["content-signals", "tdmrep", "home", "guide-training-search"]
updated: "2026-11-04"
---

## Tags und Header im Einzelnen

| Tag oder Header | Wirkung | Wer die Unterstützung dokumentiert |
|---|---|---|
| `noai`, `noimageai` | Gedacht als „nicht für KI verwenden“ / „Bilder nicht für KI verwenden“ | Nicht dokumentiert von Google, OpenAI, Anthropic, Microsoft, Apple; von einigen Plattformen übernommen. Kein Standard. |
| `nosnippet` | Kein Text-Snippet und keine Vorschau in den Ergebnissen; schließt die Seite auch als Snippet-Quelle für AI Overviews und den KI-Modus aus | Google, Bing |
| `max-snippet:N` | Begrenzt die Snippet-Länge; `0` entspricht `nosnippet` | Google, Bing |
| `data-nosnippet` (HTML-Attribut) | Schließt einen Teil der Seite von Snippets und KI-Funktionen in der Google-Suche aus | Google |
| `noarchive` | Keine Cache-Kopie. Bing: hält die Seite aus Copilot-Antworten und dem Training heraus; Amazon: nicht für Modelltraining verwenden | Bing, Amazon |
| `nocache` | Bing: Copilot darf nur URL, Titel und Snippet verwenden | Bing |
| `noindex` | Entfernt die Seite ganz aus der Suche – und damit auch aus KI-Suchfunktionen, die auf diesem Index aufbauen | Alle großen Suchmaschinen |
| `X-Robots-Tag: …` | Jede der obigen Angaben als HTTP-Header, für jeden Dateityp | Google, Bing |
| `tdm-reservation: 1` | Behält Rechte für Text und Data Mining vor (EU) – siehe [TDMRep](page:tdmrep) | Anwender von TDMRep |
| `Content-Usage: train-ai=n` | Präferenz nach dem IETF-Entwurf aipref als HTTP-Header – siehe [Content Signals](page:content-signals) | Entwurf; nicht etabliert |

Beispiel für eine Seite, die in der Suche bleiben, aber aus Copilot-Antworten und dem Training herausgehalten werden soll:

```html
<meta name="robots" content="noarchive">
<meta name="bingbot" content="nocache">
```

Beispiel-Header für einen PDF-Ordner in nginx:

```nginx
location /reports/ {
    add_header X-Robots-Tag "noarchive, nosnippet" always;
}
```
