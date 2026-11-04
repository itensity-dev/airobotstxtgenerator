---
title: "Meta tag noai, X-Robots-Tag e AI: cosa funziona davvero"
description: "Quali meta tag e header HTTP controllano l'uso di una pagina da parte dell'AI? noai non è standard; nosnippet, noarchive e X-Robots-Tag variano per azienda."
h1: "Meta tag AI e X-Robots-Tag: cosa funziona"
nav: "Meta tag AI"
lead: "I controlli a livello di pagina per l'AI sono un mosaico: alcuni tag vengono rispettati da una sola azienda, altri solo da piccole piattaforme, altri da nessuno. Questa pagina elenca cosa fa oggi ogni tag, con le fonti."
steps:
  - "Valuta se ti serve davvero un controllo a livello di pagina: le regole robots.txt per percorso coprono la maggior parte dei casi."
  - "Usa la tabella per scegliere i tag che le aziende che ti interessano rispettano davvero."
  - "Aggiungili come `<meta name=\"robots\" content=\"…\">` nell'HTML, oppure come header HTTP `X-Robots-Tag` per PDF, immagini e altri file."
  - "Verifica una pagina guardandone il sorgente e gli header di risposta; il [tester](page:tester) controlla robots.txt, non i meta tag."
capabilities:
  - feature: "Stato onesto per ogni tag"
    status: "yes"
    note: "Ogni riga indica chi documenta il supporto per quel tag."
  - feature: "Un tag universale «no AI»"
    status: "no"
    note: "Non esiste. `noai` è molto copiato ma non è documentato da Google, OpenAI, Anthropic, Microsoft né Apple."
faq:
  - q: "`<meta name=\"robots\" content=\"noai\">` funziona?"
    a: "Solo sulle piattaforme che l'hanno adottato, come alcune community artistiche. Non fa parte di alcuno standard e le grandi aziende AI non lo documentano. Non fa danni, ma non sostituisce robots.txt."
  - q: "Come tengo una pagina fuori dalle AI Overview di Google?"
    a: "Le funzioni AI della Ricerca Google seguono i normali controlli degli snippet: `nosnippet` (nessuno snippet), `max-snippet:0` o `data-nosnippet` su elementi specifici limitano ciò che può essere mostrato. Google-Extended nel robots.txt non influisce sulle AI Overview."
  - q: "Come limito l'uso della mia pagina da parte di Copilot?"
    a: "Bing documenta che `nocache` consente a Copilot di mostrare solo URL, titolo e snippet, mentre `noarchive` tiene la pagina fuori dalle risposte di Copilot e dall'addestramento. Bing ha inoltre annunciato nuove preferenze per l'addestramento e il grounding AI per il 2027."
  - q: "Cosa aggiunge X-Robots-Tag?"
    a: "Le stesse direttive del meta tag robots, inviate come header HTTP: è l'unico modo per controllare file che non hanno un head HTML, come PDF e immagini: `X-Robots-Tag: noarchive, nosnippet`."
related: ["content-signals", "tdmrep", "home", "guide-training-search"]
updated: "2026-11-04"
---

## Tag e header, uno per uno

| Tag o header | Cosa fa | Chi ne documenta il supporto |
|---|---|---|
| `noai`, `noimageai` | Intento: «non usare per l'AI» / «non usare le immagini per l'AI» | Non documentati da Google, OpenAI, Anthropic, Microsoft, Apple; adottati da poche piattaforme. Non standard. |
| `nosnippet` | Nessuno snippet di testo né anteprima nei risultati; esclude anche la pagina da AI Overview e AI Mode come fonte di snippet | Google, Bing |
| `max-snippet:N` | Limita la lunghezza dello snippet; `0` equivale a `nosnippet` | Google, Bing |
| `data-nosnippet` (attributo HTML) | Esclude una parte della pagina dagli snippet e dalle funzioni AI della Ricerca Google | Google |
| `noarchive` | Nessuna copia cache. Bing: tiene la pagina fuori dalle risposte di Copilot e dall'addestramento; Amazon: non usare per l'addestramento dei modelli | Bing, Amazon |
| `nocache` | Bing: Copilot può usare solo URL, titolo e snippet | Bing |
| `noindex` | Rimuove del tutto la pagina dalla ricerca, e quindi dalle funzioni di ricerca AI basate su quell'indice | Tutti i principali motori di ricerca |
| `X-Robots-Tag: …` | Una qualsiasi delle direttive sopra come header HTTP, per qualsiasi tipo di file | Google, Bing |
| `tdm-reservation: 1` | Riserva i diritti di estrazione di testo e di dati (UE); vedi [TDMRep](page:tdmrep) | Chi ha adottato TDMRep |
| `Content-Usage: train-ai=n` | Preferenza della bozza IETF aipref come header HTTP; vedi [content signals](page:content-signals) | Bozza; supporto non consolidato |

Esempio per una pagina che deve restare nella ricerca ma fuori dalle risposte di Copilot e dall'addestramento:

```html
<meta name="robots" content="noarchive">
<meta name="bingbot" content="nocache">
```

Esempio di header per una cartella di PDF in nginx:

```nginx
location /reports/ {
    add_header X-Robots-Tag "noarchive, nosnippet" always;
}
```
