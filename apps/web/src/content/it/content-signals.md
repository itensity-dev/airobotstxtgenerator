---
title: "Generatore Content-Signal e Content-Usage per robots.txt"
description: "Crea righe Content-Signal (Cloudflare: search, ai-input, ai-train) e Content-Usage (bozza IETF aipref) per robots.txt e header HTTP, con una nota sul supporto."
h1: "Generatore Content-Signal e Content-Usage"
nav: "Content signals"
lead: "Indica come possono essere usati i tuoi contenuti dopo essere stati recuperati — per la ricerca, come input per le risposte AI o per l'addestramento — nelle due sintassi proposte finora: `Content-Signal` di Cloudflare e `Content-Usage` della bozza IETF aipref."
steps:
  - "Scegli una preferenza per ogni uso: `search`, `ai-input` (risposte costruite a partire dalle tue pagine) e `ai-train`. Lasciane uno non impostato per non esprimere alcuna preferenza."
  - "Copia il blocco robots.txt. Le righe Content-Signal vanno all'interno di un gruppo `User-agent`, di solito `User-agent: *`."
  - "Facoltativamente copia la riga `Content-Usage` o l'header HTTP della bozza IETF."
  - "Ricorda che queste righe esprimono preferenze: se vuoi che i crawler stiano lontani, bloccali con regole `Disallow`."
capabilities:
  - feature: "Sintassi Cloudflare Content Signals"
    status: "yes"
    note: "`Content-Signal: search=yes, ai-input=yes, ai-train=no`, inserito in un gruppo, con il commento esplicativo raccomandato da Cloudflare."
  - feature: "Sintassi IETF aipref"
    status: "yes"
    note: "`Content-Usage: train-ai=n` (regola robots.txt con un percorso facoltativo) e l'header HTTP `Content-Usage`, secondo draft-ietf-aipref-attach."
  - feature: "Effetto garantito"
    status: "no"
    note: "Nessuna delle due sintassi è uno standard. Google ha dichiarato che Content-Signal non ha effetto sui suoi crawler; OpenAI, Anthropic e Perplexity non lo menzionano nella loro documentazione."
faq:
  - q: "Che cos'è Content-Signal?"
    a: "Un'estensione di robots.txt pubblicata da Cloudflare nel settembre 2025 come Content Signals Policy. Nomina tre usi — `search`, `ai-input` e `ai-train` — ciascuno impostato su `yes` o `no`. Cloudflare aggiunge `search=yes, ai-train=no` al robots.txt gestito di milioni di domini."
  - q: "Che cos'è Content-Usage?"
    a: "La sintassi sviluppata dal gruppo di lavoro IETF AI Preferences (aipref): un vocabolario con le categorie `train-ai`, `ai-use` e `search`, valori `y` o `n`, applicato tramite una regola robots.txt o un header HTTP. Le bozze sono ancora in lavorazione; non esiste ancora un RFC."
  - q: "Conviene usarli entrambi?"
    a: "Non sono in conflitto, e nessuno dei due è ancora ampiamente rispettato. Se usi Cloudflare, Content-Signal è già nel tuo robots.txt gestito. Aggiungere Content-Usage costa una riga e segue il percorso che ha più probabilità di diventare uno standard."
  - q: "E `__usage_ai-training`?"
    a: "È una proposta separata dell'ottobre 2026: un gruppo robots.txt (`User-agent: __usage_ai-training` con `Disallow: /`) che diverse aziende AI hanno dichiarato di trattare come opt-out dall'addestramento. A differenza di Content-Signal usa normali regole Allow e Disallow. Vedi la sua [voce nel registro](bot:usage-ai-training)."
related: ["home", "tdmrep", "meta-tags", "guide-eu-ai-act", "bots"]
updated: "2026-11-04"
---

## Tre generazioni di preferenze AI nel robots.txt

1. **Nomi dei crawler** (dal 2023): blocchi `GPTBot`, `ClaudeBot`, `Google-Extended`… un'azienda alla volta. Affidabile con chi rispetta robots.txt, ma devi conoscere ogni nome.
2. **Segnali basati sull'uso** (dal 2025): `Content-Signal` e `Content-Usage` descrivono usi anziché crawler. Sono associati a un gruppo e dicono cosa può accadere ai contenuti che vengono comunque recuperati, ad esempio da un crawler di ricerca generico.
3. **Gruppo di opt-out condiviso** (dal 2026): `__usage_ai-training` si indirizza come un crawler ma viene interpretato da più aziende contemporaneamente.

Finché uno di questi non diventerà uno standard, il file più sicuro li usa tutti e tre: i nomi dei fornitori per i crawler che conosci, un gruppo condiviso per le aziende che lo supportano e una riga basata sull'uso per tutti gli altri. Il [generatore](page:home) si occupa dei primi due; questa pagina aggiunge il terzo.
