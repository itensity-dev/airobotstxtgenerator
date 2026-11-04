---
title: "Opt-out AI e TDM: riserva dei diritti (art. 70-quater LDA)"
description: "robots.txt come riserva sull'estrazione di testo e di dati: AI Act, direttiva Copyright, artt. 70-quater e 70-septies LDA. Informazioni, non consulenza legale."
h1: "Bot AI e AI Act: cosa significa l'opt-out"
nav: "Bot AI e AI Act"
lead: "Il diritto UE consente a chiunque l'estrazione di testo e di dati dai contenuti pubblicamente accessibili, per qualsiasi scopo, salvo che il titolare dei diritti abbia riservato tale uso in forma leggibile da macchina. Da agosto 2025 i fornitori di modelli AI devono dimostrare di rispettare queste riserve, e il Codice di buone pratiche cita espressamente il robots.txt."
related: ["tdmrep", "content-signals", "home", "guide-training-search"]
updated: "2026-11-04"
faq:
  - q: "Un Disallow nel robots.txt è una riserva giuridicamente valida?"
    a: "Il Codice di buone pratiche considera il robots.txt secondo l'RFC 9309 un protocollo che i firmatari devono rispettare, e i tribunali hanno preso in esame riserve leggibili da macchina, ma l'effetto giuridico dipende dal diritto nazionale e dai fatti del caso. Sono informazioni, non consulenza legale."
  - q: "L'AI Act si applica anche alle aziende AI con sede fuori dall'UE?"
    a: "Gli obblighi riguardano i fornitori che immettono modelli di AI per finalità generali sul mercato dell'UE, ovunque abbiano sede. La loro policy sul diritto d'autore deve coprire le riserve dei titolari di diritti dell'UE."
  - q: "Cosa dovrei pubblicare?"
    a: "Un robots.txt che blocca i crawler di addestramento AI a cui ti opponi, eventualmente un file TDMRep e una dichiarazione nei tuoi termini di utilizzo. Conserva copie datate del tuo robots.txt per poter dimostrare da quando la riserva era in vigore."
  - q: "Cosa cambia in Italia con la legge sull'intelligenza artificiale (L. 132/2025)?"
    a: "La Legge 23 settembre 2025, n. 132, in vigore dal 10 ottobre 2025, ha aggiunto l'art. 70-septies alla legge sul diritto d'autore: riproduzioni ed estrazioni di testo e di dati per l'addestramento di modelli AI sono consentite solo nel rispetto degli artt. 70-ter e 70-quater LDA. La riserva espressa prevista dall'art. 70-quater si applica quindi esplicitamente anche all'addestramento. Informazioni, non consulenza legale."
---

*Questa pagina contiene informazioni, non consulenza legale.*

## Due leggi, un solo meccanismo

**La direttiva Copyright (direttiva (UE) 2019/790, detta anche direttiva DSM), articolo 4**, consente l'estrazione di testo e di dati da opere a cui si ha legittimamente accesso — la base giuridica su cui poggia gran parte dell'addestramento AI nell'UE — a meno che il titolare dei diritti non abbia **espressamente riservato** tale utilizzo. Per i contenuti resi pubblicamente disponibili online, la riserva va fatta «in modo appropriato, ad esempio attraverso strumenti che consentano lettura automatizzata». Ogni Stato membro ha recepito questa norma nella propria legge sul diritto d'autore.

**L'AI Act, articolo 53, paragrafo 1, lettera c)**, impone ai fornitori di modelli di AI per finalità generali di adottare una policy per rispettare il diritto d'autore dell'UE e, in particolare, di individuare e rispettare le riserve di diritti espresse ai sensi dell'articolo 4, paragrafo 3, della direttiva Copyright, «anche attraverso tecnologie all'avanguardia». Gli obblighi si applicano dal **2 agosto 2025**; l'Ufficio per l'IA (AI Office) può farli rispettare con sanzioni dal **2 agosto 2026**.

## Come l'Italia ha recepito l'articolo 4

In Italia l'estrazione di testo e di dati è disciplinata dalla legge sul diritto d'autore (**Legge 633/1941, LDA**), negli articoli introdotti dal D.Lgs. 177/2021:

- **art. 70-ter**: estrazione di testo e di dati a fini di ricerca scientifica;
- **art. 70-quater**: estrazione di testo e di dati per qualsiasi scopo, consentita purché l'utilizzo «non sia stato espressamente riservato» dai titolari dei diritti. È la norma italiana che corrisponde all'opt-out dell'articolo 4: la parola chiave è **riserva espressa**.

La **Legge 23 settembre 2025, n. 132** (la legge italiana sull'intelligenza artificiale, in vigore dal 10 ottobre 2025) ha aggiunto l'**art. 70-septies**: le riproduzioni e le estrazioni per l'addestramento di modelli di AI sono consentite solo nel rispetto degli artt. 70-ter e 70-quater. L'Italia è così il primo Stato membro a collegare espressamente, in una legge nazionale, l'addestramento AI all'opt-out sull'estrazione di testo e di dati.

## Cosa dice il Codice di buone pratiche

Il Codice di buone pratiche per l'IA per finalità generali (capitolo sul diritto d'autore, luglio 2025) è lo strumento con cui la maggior parte dei grandi fornitori dimostra la propria conformità. I firmatari si impegnano, tra l'altro, a:

1. usare crawler che **leggono e rispettano il robots.txt come specificato nell'RFC 9309** e nelle versioni successive dello standard;
2. individuare e rispettare **altri protocolli appropriati leggibili da macchina** per la riserva dei diritti, adottati da organismi di normazione o ampiamente usati dai titolari dei diritti;
3. pubblicare informazioni sui propri crawler e sul modo in cui gestiscono il robots.txt.

La Commissione ha avviato una consultazione su quali altri protocolli siano validi; al momento della stesura non era stato pubblicato alcun elenco ufficiale.

## Cosa significa in pratica

- Un `Disallow` per il crawler di addestramento di un fornitore (ad esempio `GPTBot`, `ClaudeBot`, `MistralAI-Training`, `CCBot`) è la riserva leggibile da macchina più riconosciuta.
- Un token come `Google-Extended` o `Applebot-Extended` esprime la riserva senza toglierti dalla ricerca.
- **robots.txt riserva i diritti solo nei confronti dei crawler che nomini.** Un crawler di addestramento che non conosci non è coperto. Gruppi condivisi come `__usage_ai-training` e righe basate sull'uso come `Content-Usage: train-ai=n` puntano a colmare questa lacuna; [TDMRep](page:tdmrep) è un protocollo pensato appositamente per le riserve ai sensi dell'articolo 4.
- Le dichiarazioni in linguaggio naturale nei termini di servizio potrebbero non bastare per i contenuti pubblicati online; i tribunali hanno guardato alla forma leggibile da macchina.

## Una configurazione difendibile

1. Un robots.txt con i crawler di addestramento bloccati: usa il [generatore](page:home).
2. Facoltativamente un `tdmrep.json` e una riga `Content-Usage`.
3. Una frase nei tuoi termini di utilizzo che riservi l'estrazione di testo e di dati ai sensi dell'articolo 4, paragrafo 3, della direttiva Copyright e dell'art. 70-quater LDA.
4. Un archivio datato del tuo robots.txt (ad esempio una copia sotto controllo di versione).
