---
title: "Balise noai, X-Robots-Tag et IA : ce qui marche vraiment"
description: "Quelles balises meta et en-têtes HTTP contrôlent l'usage d'une page par l'IA ? noai n'est pas standard ; nosnippet, noarchive, X-Robots-Tag : au cas par cas."
h1: "Balises meta IA et X-Robots-Tag : ce qui fonctionne"
nav: "Balises meta IA"
lead: "Les contrôles au niveau de la page pour l'IA forment un patchwork : certaines balises sont respectées par une seule entreprise, d'autres seulement par de petites plateformes, d'autres encore par personne. Cette page indique ce que fait chaque balise aujourd'hui, sources à l'appui."
steps:
  - "Demandez-vous d'abord si vous avez vraiment besoin d'un contrôle page par page : les règles robots.txt par chemin couvrent la plupart des cas."
  - "Servez-vous du tableau pour choisir les balises que les entreprises qui comptent pour vous respectent réellement."
  - "Ajoutez-les sous la forme `<meta name=\"robots\" content=\"…\">` dans le HTML, ou d'un en-tête HTTP `X-Robots-Tag` pour les PDF, les images et les autres fichiers."
  - "Testez une page en affichant son code source et ses en-têtes de réponse ; le [testeur](page:tester) vérifie robots.txt, pas les balises meta."
capabilities:
  - feature: "Statut honnête pour chaque balise"
    status: "yes"
    note: "Chaque ligne indique qui documente la prise en charge de la balise."
  - feature: "Une balise universelle « pas d'IA »"
    status: "no"
    note: "Il n'en existe pas. `noai` est très repris, mais n'est documenté ni par Google, ni par OpenAI, Anthropic, Microsoft ou Apple."
faq:
  - q: "`<meta name=\"robots\" content=\"noai\">` fonctionne-t-il ?"
    a: "Seulement sur les plateformes qui l'ont adopté, comme certaines communautés artistiques. Il ne fait partie d'aucun standard et les grandes entreprises d'IA ne le documentent pas. Il ne fait pas de mal, mais ne remplace pas robots.txt."
  - q: "Comment exclure une page des Aperçus IA de Google ?"
    a: "Les fonctions d'IA de la recherche Google suivent les contrôles d'extraits habituels : `nosnippet` (aucun extrait), `max-snippet:0` ou `data-nosnippet` sur certains éléments limitent ce qui peut être affiché. Google-Extended dans robots.txt n'a aucun effet sur les Aperçus IA."
  - q: "Comment limiter l'usage de ma page par Copilot ?"
    a: "Bing indique que `nocache` permet à Copilot de n'afficher que l'URL, le titre et l'extrait, et que `noarchive` exclut la page des réponses de Copilot et de l'entraînement. Bing a aussi annoncé de nouvelles préférences pour l'entraînement et l'ancrage IA en 2027."
  - q: "Qu'apporte X-Robots-Tag ?"
    a: "Les mêmes directives que la balise meta robots, envoyées sous forme d'en-tête HTTP — le seul moyen de contrôler les fichiers sans en-tête HTML, comme les PDF et les images : `X-Robots-Tag: noarchive, nosnippet`."
related: ["content-signals", "tdmrep", "home", "guide-training-search"]
updated: "2026-11-04"
---

## Balises et en-têtes, un par un

| Balise ou en-tête | Effet | Qui documente la prise en charge |
|---|---|---|
| `noai`, `noimageai` | Intention : « ne pas utiliser pour l'IA » / « ne pas utiliser les images pour l'IA » | Non documentées par Google, OpenAI, Anthropic, Microsoft, Apple ; adoptées par quelques plateformes. Non standard. |
| `nosnippet` | Aucun extrait ni aperçu dans les résultats ; exclut aussi la page des Aperçus IA et du Mode IA comme source d'extraits | Google, Bing |
| `max-snippet:N` | Limite la longueur de l'extrait ; `0` équivaut à `nosnippet` | Google, Bing |
| `data-nosnippet` (attribut HTML) | Exclut une partie de la page des extraits et des fonctions d'IA de la recherche Google | Google |
| `noarchive` | Pas de copie en cache. Bing : exclut la page des réponses de Copilot et de l'entraînement ; Amazon : ne pas utiliser pour l'entraînement de modèles | Bing, Amazon |
| `nocache` | Bing : Copilot ne peut utiliser que l'URL, le titre et l'extrait | Bing |
| `noindex` | Retire entièrement la page de la recherche — et donc des fonctions de recherche IA bâties sur cet index | Tous les grands moteurs de recherche |
| `X-Robots-Tag: …` | N'importe laquelle des directives ci-dessus en en-tête HTTP, pour tout type de fichier | Google, Bing |
| `tdm-reservation: 1` | Réserve les droits de fouille de textes et de données (UE) — voir [TDMRep](page:tdmrep) | Utilisateurs de TDMRep |
| `Content-Usage: train-ai=n` | Préférence du brouillon IETF aipref, en en-tête HTTP — voir [signaux de contenu](page:content-signals) | Brouillon ; non établi |

Exemple pour une page qui doit rester dans la recherche, mais hors des réponses de Copilot et de l'entraînement :

```html
<meta name="robots" content="noarchive">
<meta name="bingbot" content="nocache">
```

Exemple d'en-tête pour un dossier de PDF dans nginx :

```nginx
location /reports/ {
    add_header X-Robots-Tag "noarchive, nosnippet" always;
}
```
