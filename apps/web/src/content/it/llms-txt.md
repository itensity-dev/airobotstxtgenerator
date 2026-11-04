---
title: "Generatore llms.txt gratuito: crea il tuo file llms.txt"
description: "Generatore llms.txt gratuito: scrivi un llms.txt secondo la proposta llmstxt.org (H1, riepilogo, sezioni di link Markdown) con validazione, nel browser."
h1: "Generatore llms.txt"
nav: "Generatore llms.txt"
lead: "Crea un file `llms.txt` nel formato proposto su llmstxt.org — un titolo, un riepilogo di un paragrafo e sezioni di link alle pagine più utili per i modelli linguistici — e controllane la struttura mentre scrivi."
steps:
  - "Inserisci il nome del sito o del progetto: diventa l'unico H1."
  - "Scrivi un breve riepilogo: cos'è il sito e cosa elenca il file. Diventa il blockquote che i modelli leggono per primo."
  - "Aggiungi sezioni (`## Docs`, `## Guides` …) con dei link: titolo, URL assoluto e una descrizione facoltativa di una riga. Dove puoi, linka le versioni Markdown delle pagine."
  - "Contrassegna le sezioni meno importanti come **Optional**: chi ha poco spazio di contesto può saltarle."
  - "Scarica il file e caricalo nella root del sito come `/llms.txt`. Facoltativamente pubblica `/llms-full.txt` con il testo completo."
capabilities:
  - feature: "Struttura llmstxt.org"
    status: "yes"
    note: "H1, riepilogo in blockquote, note facoltative, sezioni H2 con elenchi di link Markdown, una sezione `Optional`."
  - feature: "Validazione"
    status: "yes"
    note: "Controlla che ci sia un solo H1, che ci siano sezioni H2 e che i link siano assoluti o relativi alla root."
  - feature: "Scansione del tuo sito per compilare l'elenco"
    status: "no"
    note: "Le pagine le scegli tu; non viene recuperato nulla."
  - feature: "Effetto sul posizionamento o sulle risposte AI"
    status: "no"
    note: "llms.txt è una proposta; nessun grande motore di ricerca né azienda AI ha dichiarato di usare il file per il posizionamento o per decidere sull'addestramento."
faq:
  - q: "Che cos'è llms.txt?"
    a: "Un file Markdown nella root di un sito, proposto da Jeremy Howard nel settembre 2024 su llmstxt.org, che offre ai modelli linguistici una mappa curata del sito: cos'è e quali pagine leggere. Non è uno standard né un file di controllo degli accessi."
  - q: "llms.txt è la stessa cosa di robots.txt?"
    a: "No. robots.txt dice ai crawler cosa possono recuperare; llms.txt suggerisce cosa vale la pena leggere. Una pagina elencata in llms.txt ma bloccata in robots.txt resta bloccata per i crawler che rispettano robots.txt."
  - q: "Le aziende AI leggono llms.txt?"
    a: "Alcuni strumenti e assistenti AI per la programmazione lo leggono quando un utente indica loro un sito; le piattaforme di documentazione lo generano automaticamente. Nessuna grande azienda AI si è impegnata a usarlo per l'addestramento o la ricerca. Pubblicarlo costa poco."
  - q: "Devo linkare pagine HTML o Markdown?"
    a: "Markdown, dove possibile: è il formato che i modelli linguistici gestiscono meglio. Questo sito pubblica una versione `.md` di ogni pagina e le linka dal proprio [llms.txt](/llms.txt)."
related: ["home", "content-signals", "meta-tags", "guide-training-search"]
updated: "2026-11-04"
---

## Cosa contiene un buon llms.txt

Tienilo breve e curato: le 10–40 pagine di cui un modello ha bisogno per capire il tuo prodotto o i tuoi contenuti, ognuna con una descrizione di una riga che dica cosa troverà il lettore. Metti prima il materiale di riferimento, poi gli esempi, e la cronologia, i changelog o le pagine legali sotto **Optional**. Se hai una documentazione lunga, pubblica anche `llms-full.txt` — la stessa struttura con il testo completo delle pagine — e indicalo nel riepilogo.

Questo sito segue i propri consigli: vedi [/llms.txt](/llms.txt) e [/llms-full.txt](/llms-full.txt); inoltre ogni pagina ha una versione Markdown allo stesso indirizzo con l'aggiunta di `.md`.
