---
title: "llms.txt-generator: maak gratis je llms.txt-bestand"
description: "Gratis llms.txt-generator: schrijf een llms.txt volgens llmstxt.org — H1, samenvatting, secties met Markdown-links — met validatie. Draait in je browser."
h1: "llms.txt-generator"
nav: "llms.txt-generator"
lead: "Maak een `llms.txt`-bestand in het formaat dat op llmstxt.org is voorgesteld — een titel, een samenvatting van één alinea en secties met links naar de pagina's die het nuttigst zijn voor taalmodellen — en controleer de structuur terwijl je typt."
steps:
  - "Vul de naam van de site of het project in; die wordt de enige H1."
  - "Schrijf een korte samenvatting — wat de site is en wat het bestand opsomt. Die wordt de blockquote die modellen als eerste lezen."
  - "Voeg secties toe (`## Docs`, `## Guides` …) met links: titel, absolute URL en eventueel een beschrijving van één regel. Link naar Markdown-versies van pagina's als je die hebt."
  - "Markeer minder belangrijke secties als **Optioneel**: lezers met weinig contextruimte mogen ze overslaan."
  - "Download het bestand en upload het naar de root van de site als `/llms.txt`. Publiceer eventueel ook `/llms-full.txt` met de volledige tekst."
capabilities:
  - feature: "Structuur volgens llmstxt.org"
    status: "yes"
    note: "H1, samenvatting als blockquote, optionele toelichting, H2-secties met Markdown-linklijsten, een sectie `Optional`."
  - feature: "Validatie"
    status: "yes"
    note: "Controleert op één H1, H2-secties en absolute of root-relatieve linkdoelen."
  - feature: "Je site crawlen om de lijst te vullen"
    status: "no"
    note: "Jij kiest de pagina's; er wordt niets opgehaald."
  - feature: "Effect op rankings of AI-antwoorden"
    status: "no"
    note: "llms.txt is een voorstel; geen enkele grote zoekmachine of groot AI-bedrijf heeft gezegd het bestand te gebruiken voor beslissingen over ranking of training."
faq:
  - q: "Wat is llms.txt?"
    a: "Een Markdown-bestand in de root van een site, in september 2024 door Jeremy Howard voorgesteld op llmstxt.org, dat taalmodellen een samengestelde kaart van de site geeft: wat de site is en welke pagina's ze moeten lezen. Het is geen standaard en geen bestand voor toegangscontrole."
  - q: "Is llms.txt hetzelfde als robots.txt?"
    a: "Nee. robots.txt vertelt crawlers wat ze mogen ophalen; llms.txt suggereert wat de moeite van het lezen waard is. Een pagina die in llms.txt staat maar in robots.txt is geblokkeerd, blijft geblokkeerd voor crawlers die robots.txt volgen."
  - q: "Lezen AI-bedrijven llms.txt?"
    a: "Sommige tools en AI-codeerassistenten lezen het als een gebruiker ze naar een site verwijst; documentatieplatforms genereren het automatisch. Geen enkel groot AI-bedrijf heeft toegezegd het te gebruiken voor training of zoeken. Publiceren kost weinig moeite."
  - q: "Moet ik naar HTML-pagina's of naar Markdown linken?"
    a: "Naar Markdown waar dat kan — daar kunnen taalmodellen het best mee overweg. Deze site publiceert van elke pagina een `.md`-versie en linkt daarnaar vanuit haar eigen [llms.txt](/llms.txt)."
related: ["home", "content-signals", "meta-tags", "guide-training-search"]
updated: "2026-11-04"
---

## Wat er in een goede llms.txt staat

Houd het kort en zorgvuldig gekozen: de 10–40 pagina's die een model nodig heeft om je product of content te begrijpen, elk met een beschrijving van één regel die zegt wat de lezer er vindt. Zet naslagmateriaal voorop, voorbeelden daarna, en geschiedenis, changelogs of juridische pagina's onder **Optional**. Heb je uitgebreide documentatie, publiceer dan ook `llms-full.txt` — dezelfde structuur met de volledige tekst van de pagina's — en vermeld dat in de samenvatting.

Deze site volgt haar eigen advies: zie [/llms.txt](/llms.txt) en [/llms-full.txt](/llms-full.txt), en elke pagina heeft een Markdown-tweeling op hetzelfde adres met `.md` erachter.
