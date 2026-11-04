---
title: "noai-metatag, X-Robots-Tag en AI: wat echt werkt"
description: "Welke metatags en HTTP-headers regelen AI-gebruik van een pagina? noai is geen standaard; nosnippet, noarchive en X-Robots-Tag werken per bedrijf anders."
h1: "AI-metatags en X-Robots-Tag: wat werkt"
nav: "AI-metatags"
lead: "Instellingen op paginaniveau voor AI zijn een lappendeken: sommige tags worden door één bedrijf gerespecteerd, sommige alleen door kleine platforms en sommige door niemand. Deze pagina zet op een rij wat elke tag vandaag doet, met bronnen."
steps:
  - "Bepaal of je überhaupt controle op paginaniveau nodig hebt — robots.txt-regels per pad dekken de meeste gevallen."
  - "Kies met de tabel de tags die de bedrijven waar het jou om gaat ook echt respecteren."
  - "Voeg ze toe als `<meta name=\"robots\" content=\"…\">` in HTML, of als `X-Robots-Tag`-HTTP-header voor pdf's, afbeeldingen en andere bestanden."
  - "Test een pagina door de broncode en de responseheaders te bekijken; de [checker](page:tester) controleert robots.txt, geen metatags."
capabilities:
  - feature: "Eerlijke status per tag"
    status: "yes"
    note: "Elke rij vermeldt wie ondersteuning voor de tag documenteert."
  - feature: "Een universele “geen AI”-tag"
    status: "no"
    note: "Die bestaat niet. `noai` wordt veel gekopieerd, maar is niet gedocumenteerd door Google, OpenAI, Anthropic, Microsoft of Apple."
faq:
  - q: "Werkt `<meta name=\"robots\" content=\"noai\">`?"
    a: "Alleen op platforms die het hebben overgenomen, zoals sommige kunstcommunity's. Het maakt geen deel uit van een standaard en de grote AI-bedrijven documenteren het niet. Het kan geen kwaad, maar het vervangt robots.txt niet."
  - q: "Hoe houd ik een pagina buiten de AI Overviews van Google?"
    a: "De AI-functies van Google in Zoeken volgen de gewone snippet-instellingen: `nosnippet` (helemaal geen snippet), `max-snippet:0` of `data-nosnippet` op specifieke elementen beperken wat getoond kan worden. Google-Extended in robots.txt heeft geen invloed op AI Overviews."
  - q: "Hoe beperk ik het gebruik van mijn pagina door Copilot?"
    a: "Bing documenteert dat Copilot met `nocache` alleen de URL, titel en snippet mag tonen, en dat `noarchive` de pagina buiten de antwoorden en training van Copilot houdt. Bing heeft ook nieuwe voorkeuren voor AI-training en grounding voor 2027 aangekondigd."
  - q: "Wat voegt X-Robots-Tag toe?"
    a: "Dezelfde instructies als de robots-metatag, maar verstuurd als HTTP-header — de enige manier om bestanden zonder HTML-head te regelen, zoals pdf's en afbeeldingen: `X-Robots-Tag: noarchive, nosnippet`."
related: ["content-signals", "tdmrep", "home", "guide-training-search"]
updated: "2026-11-04"
---

## Tags en headers, een voor een

| Tag of header | Wat het doet | Wie ondersteuning documenteert |
|---|---|---|
| `noai`, `noimageai` | Bedoeld als “niet gebruiken voor AI” / “afbeeldingen niet gebruiken voor AI” | Niet gedocumenteerd door Google, OpenAI, Anthropic, Microsoft, Apple; door een paar platforms overgenomen. Geen standaard. |
| `nosnippet` | Geen tekstsnippet of voorbeeld in de resultaten; sluit de pagina ook uit als bron van snippets in AI Overviews en AI Mode | Google, Bing |
| `max-snippet:N` | Beperkt de lengte van de snippet; `0` staat gelijk aan `nosnippet` | Google, Bing |
| `data-nosnippet` (HTML-attribuut) | Sluit een deel van de pagina uit van snippets en AI-functies in Google Zoeken | Google |
| `noarchive` | Geen kopie in de cache. Bing: houdt de pagina buiten de antwoorden en training van Copilot; Amazon: niet gebruiken voor modeltraining | Bing, Amazon |
| `nocache` | Bing: Copilot mag alleen URL, titel en snippet gebruiken | Bing |
| `noindex` | Verwijdert de pagina volledig uit de zoekresultaten — en daarmee ook uit AI-zoekfuncties die op die index zijn gebouwd | Alle grote zoekmachines |
| `X-Robots-Tag: …` | Elk van de bovenstaande als HTTP-header, voor elk bestandstype | Google, Bing |
| `tdm-reservation: 1` | Behoudt de rechten op tekst- en datamining voor (EU) — zie [TDMRep](page:tdmrep) | Gebruikers van TDMRep |
| `Content-Usage: train-ai=n` | Voorkeur volgens de IETF-aipref-draft als HTTP-header — zie [content signals](page:content-signals) | Draft; nog niet gangbaar |

Voorbeeld voor een pagina die in de zoekresultaten moet blijven, maar buiten de antwoorden en training van Copilot:

```html
<meta name="robots" content="noarchive">
<meta name="bingbot" content="nocache">
```

Voorbeeldheader voor een map met pdf's in nginx:

```nginx
location /reports/ {
    add_header X-Robots-Tag "noarchive, nosnippet" always;
}
```
