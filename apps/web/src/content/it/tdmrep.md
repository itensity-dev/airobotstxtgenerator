---
title: "Generatore TDMRep: tdmrep.json e header tdm-reservation"
description: "Genera i file TDMRep: /.well-known/tdmrep.json, header tdm-reservation e tdm-policy e meta tag HTML per riservare l'estrazione di testo e di dati (art. 4 DSM)."
h1: "Generatore TDMRep"
nav: "TDMRep"
lead: "Crea i file del TDM Reservation Protocol (TDMRep), una specifica di un W3C Community Group per dichiarare, in forma leggibile da macchina, che riservi i diritti di estrazione di testo e di dati previsti dal diritto d'autore dell'UE."
steps:
  - "Scegli `tdm-reservation: 1` per riservare i tuoi diritti, oppure `0` per dichiarare che non li riservi."
  - "Facoltativamente aggiungi l'URL di una `tdm-policy`: un documento leggibile da macchina che spiega come ottenere una licenza."
  - "Pubblica `/.well-known/tdmrep.json` nella root del sito e/o aggiungi gli header HTTP o i meta tag HTML."
  - "Mantieni le regole robots.txt per i crawler che vuoi fermare: TDMRep riserva i diritti, non blocca nulla."
capabilities:
  - feature: "File valido per tutto il sito"
    status: "yes"
    note: "`/.well-known/tdmrep.json` con `location`, `tdm-reservation` e `tdm-policy`."
  - feature: "Header e meta tag per singola risposta"
    status: "yes"
    note: "`tdm-reservation` e `tdm-policy` come header HTTP (snippet per nginx e Apache) e come tag HTML `<meta>`."
  - feature: "Consulenza legale"
    status: "no"
    note: "L'efficacia di una riserva dipende dal diritto nazionale e dai fatti. Questa pagina contiene informazioni, non consulenza legale."
faq:
  - q: "Che cos'è TDMRep?"
    a: "Il TDM Reservation Protocol, pubblicato da un W3C Community Group (Final Report 2024). Definisce come un titolare dei diritti può esprimere — in un file, in un header HTTP o in HTML — che l'estrazione di testo e di dati dai suoi contenuti è riservata, come consente l'articolo 4, paragrafo 3, della direttiva Copyright (UE) 2019/790."
  - q: "Mi serve TDMRep se blocco già i crawler AI nel robots.txt?"
    a: "robots.txt dice chi può recuperare i contenuti; TDMRep dice cosa se ne può fare, indipendentemente da chi li ha recuperati. Il Codice di buone pratiche dell'UE per l'IA per finalità generali impegna i firmatari a rispettare robots.txt e altri protocolli appropriati leggibili da macchina: pubblicarli entrambi è un approccio di doppia sicurezza."
  - q: "Quali aziende AI leggono TDMRep?"
    a: "Il supporto è limitato e raramente documentato. Lo usano editori europei e alcuni fornitori di dati; la maggior parte dei grandi sviluppatori AI documenta solo robots.txt. Consideralo una dichiarazione aggiuntiva e standardizzata della tua riserva."
related: ["content-signals", "guide-eu-ai-act", "meta-tags", "home"]
updated: "2026-11-04"
---

## Il ruolo di TDMRep

La direttiva Copyright dell'UE consente l'estrazione di testo e di dati da contenuti legittimamente accessibili, a meno che il titolare dei diritti non l'abbia **espressamente riservata**, per i contenuti pubblicati online «in modo appropriato, ad esempio attraverso strumenti che consentano lettura automatizzata». robots.txt è uno di questi strumenti; TDMRep è un altro, pensato appositamente per questo scopo. Un file `tdmrep.json` può coprire tutto il sito o parti di esso (pattern `location`), gli header possono coprire qualsiasi tipo di file, compresi PDF e immagini, e i meta tag funzionano dove controlli solo l'HTML.
