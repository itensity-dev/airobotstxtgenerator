---
title: "AI-bots blokkeren met een Cloudflare WAF-regel"
description: "Cloudflare WAF-regel die GPTBot, ClaudeBot, Bytespider en andere AI-crawlers op User-Agent blokkeert en robots.txt uitzondert. Plus de rol van AI Crawl Control."
h1: "AI-bots blokkeren met een Cloudflare WAF-regel"
nav: "Cloudflare WAF"
lead: "Een expressie voor een custom rule in de WAF van Cloudflare die de AI-crawlers die je kiest op User-Agent blokkeert, `/robots.txt` bereikbaar houdt en binnen de limiet van 4.096 tekens van Cloudflare blijft."
steps:
  - "Selecteer de agenten en kopieer de expressie."
  - "Open in het Cloudflare-dashboard je domein → **Security** → **WAF** → **Custom rules** → **Create rule** → **Edit expression** en plak de expressie."
  - "Stel de actie in op **Block** (of **Managed Challenge** als je dat liever hebt) en zet de regel live."
  - "Kijk na een dag in **Security → Events** welke agenten zijn geblokkeerd."
capabilities:
  - feature: "Gratis abonnement"
    status: "yes"
    note: "Custom rules met `contains` en `lower()` zijn op elk abonnement beschikbaar; `matches` met reguliere expressies vereist een betaald abonnement, dus de tool gebruikt dat niet."
  - feature: "Controle van de lengte van de expressie"
    status: "yes"
    note: "Cloudflare staat 4.096 tekens per expressie toe; de tool waarschuwt en stelt voor de regel op te splitsen."
  - feature: "Vervangt AI Crawl Control"
    status: "no"
    note: "Het eigen AI Crawl Control van Cloudflare blokkeert geverifieerde AI-crawlers per categorie en kan een beheerd blok in je robots.txt schrijven. Gebruik deze regel voor agenten die Cloudflare niet dekt of als je precies zelf wilt bepalen wat er gebeurt."
faq:
  - q: "Cloudflare blokkeert al AI-crawlers — heb ik deze regel nodig?"
    a: "Misschien niet. Sinds juli 2025 blokkeren nieuwe domeinen standaard AI-crawlers, en sinds 2026 biedt Cloudflare aparte instellingen voor Search, Agent en Training. Die lijst dekt geverifieerde bots. Een custom rule voegt agenten buiten die lijst toe en blokkeert op naam, ongeacht verificatie."
  - q: "Waarom wordt robots.txt uitgezonderd?"
    a: "Zodat crawlers je beleid nog steeds kunnen lezen. Een crawler die robots.txt niet kan ophalen, kan ook niet ontdekken dat hij geblokkeerd is."
  - q: "Cloudflare heeft regels in mijn robots.txt gezet — wat zijn dat?"
    a: "Dat is de beheerde robots.txt van Cloudflare (Bot Preference Sync): een blok tussen BEGIN- en END-commentaar, vóór je eigen regels, met `Content-Signal`- en `Disallow`-regels voor AI-crawlers. Plak het live bestand in de [checker](page:tester) om te zien hoe het gecombineerde bestand zich gedraagt."
related: ["server-rules", "content-signals", "tester", "guide-bad-bots"]
updated: "2026-11-04"
---

## Over de expressie

Elke voorwaarde luidt `(lower(http.user_agent) contains "gptbot")`: de User-Agent wordt naar kleine letters omgezet en doorzocht op de naam van de bot, dus hoofdletters maken niet uit. De voorwaarden worden verbonden met `or`, en de hele groep wordt gecombineerd met `and not (http.request.uri.path eq "/robots.txt")`. Gebruik je ook de functies voor geverifieerde bots van Cloudflare, dan kun je `and not cf.client.bot` toevoegen om geverifieerde bots aan de eigen instellingen van Cloudflare over te laten.
