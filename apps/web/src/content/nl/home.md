---
title: "AI robots.txt-generator: blokkeer GPTBot en AI-crawlers"
description: "Gratis AI robots.txt-generator: blokkeer AI-training (GPTBot, ClaudeBot, Google-Extended, CCBot), blijf in AI-zoekmachines of weer alle AI. Getest op RFC 9309."
h1: "AI robots.txt-generator"
nav: "robots.txt-generator"
lead: "Kies het type site en je doel: de generator schrijft een robots.txt voor {{all}} gedocumenteerde AI-crawlers en tokens, licht elke regel toe en controleert het resultaat met een RFC 9309-parser voordat je het kopieert."
steps:
  - "Kies het **type site** — dat bepaalt zinnige startpaden (een webshop sluit `/cart/` en `/checkout/` voor elke crawler, een nieuwssite sluit `/premium/` voor AI-bots)."
  - "Kies het **doel**: geen AI-training maar wel vindbaar in AI-zoekmachines, helemaal geen AI, alles toestaan, of per bot beslissen."
  - "Voeg **uitzonderingen voor paden** toe, bijvoorbeeld `/blog/` open voor elke AI-bot of `/members/` dicht voor allemaal."
  - "Kopieer of download het bestand en upload het als `robots.txt` naar de root van elke host (`https://example.com/robots.txt`). Heb je al een bestand? Gebruik **Toevoegen aan mijn robots.txt** — dan wordt het AI-deel toegevoegd en zie je bewezen dat je bestaande regels precies hetzelfde blijven werken."
  - "Test het live bestand met de [robots.txt-checker](page:tester) en voeg voor crawlers die robots.txt negeren [serverregels](page:server-rules) toe."
capabilities:
  - feature: "Lijst met AI-crawlers"
    status: "yes"
    note: "{{all}} agenten en tokens met de eigen documentatie van de beheerder en de datum van de laatste controle; op verzoek nog {{community}} uit de communitylijst van ai.robots.txt."
  - feature: "Presets per doel"
    status: "yes"
    note: "Training, AI-zoeken, ophaalverzoeken van gebruikers en tokens die alleen in robots.txt bestaan, worden apart behandeld."
  - feature: "Zelfcontrole"
    status: "yes"
    note: "Elk bestand wordt geparst met dezelfde regels als de opensource-parser van Google; elke agent wordt getest op `/`, je uitzonderingspaden en je gesloten paden."
  - feature: "Samenvoegen met een bestaand bestand"
    status: "yes"
    note: "Voegt een AI-deel toe, toont een diff en vergelijkt oude en nieuwe beslissingen voor elke agent die al in je bestand staat."
  - feature: "Content-Signal-regels"
    status: "partly"
    note: "Optionele `Content-Signal` voor de `*`-groep. Dit is een voorstel van Cloudflare, geen standaard."
  - feature: "Bots tegenhouden die robots.txt negeren"
    status: "no"
    note: "robots.txt is een verzoek. Gebruik [serverregels](page:server-rules) of een WAF om het af te dwingen."
  - feature: "Account, upload of tracking van je invoer"
    status: "no"
    note: "Het genereren gebeurt in je browser en werkt ook offline; je paden en bestanden worden nergens naartoe gestuurd."
faq:
  - q: "Hoe blokkeer ik AI-training en blijf ik toch zichtbaar in de zoekfuncties van ChatGPT, Claude en Perplexity?"
    a: "Blokkeer de trainingscrawlers en -tokens — `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `meta-externalagent` en andere — en laat de zoekagenten (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`) toe. Dat is het eerste doel in de generator. Meer details in de handleiding [AI-training blokkeren, zichtbaar blijven in AI-zoekmachines](page:guide-training-search)."
  - q: "Verdwijnt mijn site uit Google Zoeken of AI Overviews als ik Google-Extended blokkeer?"
    a: "Nee. `Google-Extended` is een robots.txt-token, geen crawler: het bepaalt of Google content mag gebruiken voor het trainen en grounden van Gemini. Google Zoeken, inclusief AI Overviews en AI Mode, gebruikt `Googlebot`."
  - q: "Waarom herhaalt het gegenereerde bestand sommige regels?"
    a: "Een crawler die in een eigen groep wordt genoemd, negeert de groep `User-agent: *` volledig. Als AI-bots een eigen groep nodig hebben (bijvoorbeeld om `/premium/` voor ze te sluiten), kopieert de generator je `*`-regels naar die groep, zodat er niets verloren gaat."
  - q: "Houdt elk AI-bedrijf zich aan dit bestand?"
    a: "De meeste grote beheerders verklaren dat hun crawlers robots.txt volgen. Fetchers die op verzoek van een gebruiker werken (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`) doen dat mogelijk niet, en sommige crawlers publiceren helemaal geen verklaring. Het botregister toont de verklaring van elke beheerder met een link naar de bron."
  - q: "Waar moet het robots.txt-bestand staan?"
    a: "In de root van elke host en elk protocol dat je wilt dekken: `https://example.com/robots.txt` geldt niet voor `https://shop.example.com/`. Het bestand moet platte tekst in UTF-8 zijn en voor Google kleiner dan 500 KiB."
  - q: "Wordt mijn invoer opgeslagen?"
    a: "Nee. De generator draait volledig in je browser. We tellen alleen dát er een bestand is gegenereerd en welke preset is gebruikt, zonder je paden of tekst."
  - q: "Telt een robots.txt-blokkade als tdm-voorbehoud onder de AI-verordening?"
    a: "Volgens art. 15o Auteurswet (de Nederlandse uitvoering van art. 4 DSM-richtlijn) mag tekst- en datamining, tenzij de rechthebbende dat uitdrukkelijk en op passende wijze heeft voorbehouden, bijvoorbeeld machineleesbaar. Een `Disallow` voor AI-trainingscrawlers is het meest erkende middel daarvoor, en de AI-verordening verplicht aanbieders van AI-modellen voor algemene doeleinden zulke voorbehouden te respecteren. Lees meer in [AI-bots en de AI-verordening](page:guide-eu-ai-act). Dit is informatie, geen juridisch advies."
related: ["tester", "bots", "server-rules", "guide-training-search", "llms-txt"]
updated: "2026-11-04"
---

## Hoe de generator beslist

Elke agent in het register heeft een **doel**, overgenomen uit de documentatie van de beheerder:

- **AI-training** — verzamelt pagina's die gebruikt kunnen worden om modellen te trainen (`GPTBot`, `ClaudeBot`, `CCBot`, `MistralAI-Training`).
- **robots.txt-tokens** — helemaal geen crawlers, maar namen die bepalen hoe content die een algemene crawler ophaalt gebruikt mag worden (`Google-Extended`, `Applebot-Extended`, `__usage_ai-training`).
- **AI-zoeken** — indexeert pagina's zodat een AI-product ze kan citeren en ernaar kan linken (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`).
- **Ophalen op verzoek van gebruikers** — opent een pagina omdat iemand een assistent daarom vroeg (`ChatGPT-User`, `Claude-User`, `Perplexity-User`).
- **Algemene crawlers** — `Googlebot`, `Bingbot`, `Applebot` en fetchers voor linkvoorbeelden worden door geen enkele preset geblokkeerd, omdat je dan uit de gewone zoekresultaten verdwijnt of linkvoorbeelden niet meer werken.

Het doel bepaalt welke categorieën dichtgaan. De generator schrijft daarna één groep per doel, zodat het bestand leesbaar blijft, en voegt je uitzonderingen voor paden aan elke groep toe.

## Waarom het bestand wordt gecontroleerd voordat je het ziet

robots.txt kent een paar regels die mensen verrassen: de **langste passende regel wint**, bij een gelijkspel **wint Allow**, een crawler met een **eigen groep negeert `User-agent: *`**, en **lege regels scheiden geen groepen**. Nadat het bestand is opgebouwd, parseert de generator het met hetzelfde algoritme als de opensource-parser van Google (we testen met de eigen testcases van Google en 46 echte robots.txt-bestanden) en controleert voor elke agent en elk relevant pad of het antwoord overeenkomt met het beleid dat je hebt gekozen. Het stempel onder het bestand laat zien hoeveel controles er zijn uitgevoerd.

## Wat robots.txt niet kan

robots.txt is een openbaar verzoek, vastgelegd in [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html). Fatsoenlijke crawlers houden zich eraan; andere niet, en iedereen kan een valse User-Agent meesturen. Wil je het afdwingen, blokkeer dan op de server of in het CDN — de pagina [serverregels](page:server-rules) maakt regels voor nginx, Apache, Caddy en Cloudflare op basis van hetzelfde register — en verifieer bots via hun IP-adres of reverse DNS.
