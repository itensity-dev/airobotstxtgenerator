---
title: "Content-Signal- en Content-Usage-generator voor robots.txt"
description: "Schrijf Content-Signal-regels (Cloudflare: search, ai-input, ai-train) en Content-Usage-regels (IETF-aipref) voor robots.txt en HTTP-headers, met hun status."
h1: "Content-Signal- en Content-Usage-generator"
nav: "Content signals"
lead: "Geef aan hoe je content na het ophalen gebruikt mag worden — voor zoeken, als input voor AI-antwoorden of voor training — in de twee syntaxen die tot nu toe zijn voorgesteld: `Content-Signal` van Cloudflare en `Content-Usage` uit de IETF-aipref-draft."
steps:
  - "Kies een voorkeur voor elk gebruik: `search`, `ai-input` (antwoorden die op je pagina's zijn gebaseerd) en `ai-train`. Laat er een leeg om geen voorkeur uit te drukken."
  - "Kopieer het robots.txt-blok. Content-Signal-regels horen binnen een `User-agent`-groep — meestal `User-agent: *`."
  - "Kopieer eventueel de `Content-Usage`-regel of de HTTP-header uit de IETF-draft."
  - "Onthoud dat deze regels voorkeuren uitdrukken; blokkeer crawlers met `Disallow`-regels als je ze echt weg wilt houden."
capabilities:
  - feature: "Syntaxis van Cloudflare Content Signals"
    status: "yes"
    note: "`Content-Signal: search=yes, ai-input=yes, ai-train=no`, in een groep geplaatst, met het toelichtende commentaar dat Cloudflare aanbeveelt."
  - feature: "Syntaxis van IETF aipref"
    status: "yes"
    note: "`Content-Usage: train-ai=n` (robots.txt-regel met een optioneel pad) en de HTTP-header `Content-Usage`, volgens draft-ietf-aipref-attach."
  - feature: "Gegarandeerd effect"
    status: "no"
    note: "Geen van beide syntaxen is een standaard. Google heeft gezegd dat Content-Signal geen effect heeft op zijn crawlers; OpenAI, Anthropic en Perplexity noemen het niet in hun documentatie."
faq:
  - q: "Wat is Content-Signal?"
    a: "Een uitbreiding van robots.txt die Cloudflare in september 2025 publiceerde als de Content Signals Policy. Ze benoemt drie soorten gebruik — `search`, `ai-input` en `ai-train` — elk ingesteld op `yes` of `no`. Cloudflare voegt `search=yes, ai-train=no` toe aan de beheerde robots.txt van miljoenen domeinen."
  - q: "Wat is Content-Usage?"
    a: "De syntaxis die de IETF-werkgroep AI Preferences (aipref) ontwikkelt: een vocabulaire met de categorieën `train-ai`, `ai-use` en `search`, met de waarden `y` of `n`, gekoppeld via een robots.txt-regel of een HTTP-header. De drafts zijn nog in ontwikkeling; er is nog geen RFC."
  - q: "Moet ik ze allebei gebruiken?"
    a: "Ze zitten elkaar niet in de weg, en geen van beide wordt al op grote schaal gerespecteerd. Gebruik je Cloudflare, dan staat Content-Signal al in je beheerde robots.txt. Content-Usage toevoegen kost één regel en volgt het traject dat de meeste kans heeft om een standaard te worden."
  - q: "En `__usage_ai-training`?"
    a: "Dat is een apart voorstel van oktober 2026: een robots.txt-groep (`User-agent: __usage_ai-training` met `Disallow: /`) die verschillende AI-bedrijven als training-opt-out willen behandelen. Anders dan Content-Signal gebruikt het gewone Allow- en Disallow-regels. Zie de [vermelding in het register](bot:usage-ai-training)."
related: ["home", "tdmrep", "meta-tags", "guide-eu-ai-act", "bots"]
updated: "2026-11-04"
---

## Drie generaties AI-voorkeuren in robots.txt

1. **Crawlernamen** (2023–): blokkeer `GPTBot`, `ClaudeBot`, `Google-Extended`… één bedrijf tegelijk. Betrouwbaar bij crawlers die robots.txt volgen, maar je moet elke naam kennen.
2. **Signalen op basis van gebruik** (2025–): `Content-Signal` en `Content-Usage` beschrijven soorten gebruik in plaats van crawlers. Ze zijn aan een groep gekoppeld en zeggen wat er mag gebeuren met content die toch wordt opgehaald — bijvoorbeeld door een algemene zoekcrawler.
3. **Gedeelde opt-outgroep** (2026–): `__usage_ai-training` wordt aangesproken als een crawler, maar door meerdere bedrijven tegelijk begrepen.

Zolang geen van deze een standaard is, gebruikt het veiligste bestand ze alle drie: namen van leveranciers voor de crawlers die je kent, een gedeelde groep voor de bedrijven die die ondersteunen, en een regel op basis van gebruik voor de rest. De [generator](page:home) doet de eerste twee; deze pagina voegt de derde toe.
