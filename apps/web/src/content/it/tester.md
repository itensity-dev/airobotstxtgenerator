---
title: "Verifica robots.txt: tester gratuito per Google e bot AI"
description: "Verifica robots.txt gratis: recupera il file di un sito o incolla il tuo, scopri quali crawler AI sono consentiti, testa un URL per ogni bot e trova gli errori."
h1: "Verifica robots.txt: tester e validatore"
nav: "Tester robots.txt"
lead: "Recupera il robots.txt di qualsiasi sito o incolla un file, testa un URL per qualsiasi crawler, scopri quali dei {{agents}} agenti AI possono scansionare il sito e ottieni l'elenco degli errori, con la riga esatta che decide ogni risposta."
steps:
  - "Inserisci un dominio o un URL qualsiasi del sito (viene usato solo l'host) e premi **Recupera robots.txt**, oppure passa a **Incolla robots.txt** per testare una bozza senza caricarla."
  - "Leggi la riga di stato: Google tratta una risposta **4xx** come «nessun robots.txt» e una risposta **5xx** come «per ora non scansionare nulla»; vengono controllati anche reindirizzamenti, dimensione e Content-Type."
  - "Scrivi un percorso o un URL completo e scegli un crawler: il risultato indica la **riga decisiva** e il gruppo applicato, ed evidenzia entrambi nel file."
  - "Scorri la tabella dei crawler AI: home page e il tuo percorso, ciascuno **Consentito**, **Bloccato** o **Parziale**, e se il crawler ha un proprio gruppo."
  - "Correggi ciò che segnala il **report dei controlli**, poi ripeti il test. Ti serve un file nuovo? Apri il [generatore](page:home)."
capabilities:
  - feature: "Stesse risposte del parser di Google"
    status: "yes"
    note: "Riproduce tutti i casi di test del parser robots.txt open source di Google e ne replica i verdetti su 46 file robots.txt reali di grandi siti."
  - feature: "Recupero online di qualsiasi sito"
    status: "yes"
    note: "Tramite il nostro servizio di verifica: solo host http/https pubblici, porte standard, fino a 5 reindirizzamenti, 5 secondi, 512 KiB. I risultati restano in cache per 10 minuti."
  - feature: "Incolla e testa offline"
    status: "yes"
    note: "Il testo incollato viene analizzato nel tuo browser e non viene mai caricato."
  - feature: "Controlli di validazione (lint)"
    status: "yes"
    note: "Oltre 35 controlli: sintassi, errori di battitura tollerati da Google, gruppi che scartano in silenzio le regole `*`, insidie delle righe vuote, URL completi nelle regole, limite di 500 KiB, sintassi di Content-Signal e Content-Usage, blocchi gestiti da Cloudflare."
  - feature: "Pagine dietro login o firewall"
    status: "no"
    note: "Recuperiamo solo `/robots.txt` dall'internet pubblico, come farebbe un crawler. Un WAF o una CDN possono comunque bloccare crawler che robots.txt consente: controlla le impostazioni della tua CDN."
  - feature: "Meta tag robots e X-Robots-Tag"
    status: "no"
    note: "Le regole a livello di pagina non vengono controllate qui; vedi [meta tag AI](page:meta-tags)."
faq:
  - q: "Che fine ha fatto lo strumento di test del robots.txt di Google?"
    a: "Google ha ritirato il tester robots.txt di Search Console alla fine del 2023 e lo ha sostituito con un report robots.txt che mostra il file recuperato e gli errori, ma non permette di testare un URL per uno user agent. Questa pagina colma quella lacuna e usa le stesse regole di confronto del parser open source di Google."
  - q: "Perché un URL è consentito anche se `User-agent: *` lo blocca?"
    a: "Perché il crawler che hai scelto ha un proprio gruppo. Un crawler rispetta solo il gruppo più specifico che lo nomina, quindi le regole sotto `User-agent: *` non si applicano più. Il report dei controlli segnala ogni agente per cui questo fa cadere una regola `*`."
  - q: "Cosa succede se robots.txt restituisce 404, 403 o 500?"
    a: "Google tratta le risposte 4xx (tranne 429) come se non esistesse un robots.txt: si può scansionare tutto. 5xx e 429 significano «per ora non scansionare»; Google riprova e, dopo circa 30 giorni, può usare una copia in cache o considerare il sito senza restrizioni."
  - q: "L'ordine delle righe Allow e Disallow conta?"
    a: "No. Vince il pattern corrispondente più lungo, indipendentemente dall'ordine; se un pattern Allow e uno Disallow hanno la stessa lunghezza, vince Allow. `*` corrisponde a qualsiasi sequenza di caratteri e `$` ancora la fine dell'URL."
  - q: "Il mio robots.txt o il dominio che controllo vengono salvati?"
    a: "Il testo incollato non lascia mai il tuo browser. Per i controlli online il nostro server recupera il file e lo tiene in memoria fino a 10 minuti, così i controlli ripetuti sono veloci; i domini non vengono scritti in log né in strumenti di analisi."
  - q: "Quale user agent invia il nostro servizio di verifica?"
    a: "`Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)`. Recupera solo `/robots.txt`, una volta per controllo. Vedi [il nostro bot di verifica](page:checker-bot)."
related: ["home", "bots", "server-rules", "guide-syntax", "guide-bad-bots"]
updated: "2026-11-04"
---

## Come un crawler legge robots.txt

Il tester applica le regole dell'[RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) esattamente come fa il parser open source di Google:

1. **Trova il gruppo.** Un gruppo è composto da una o più righe `User-agent` seguite da regole. Il crawler usa ogni gruppo che nomina il suo product token (senza distinzione tra maiuscole e minuscole, ignorando i numeri di versione) e li unisce. Solo se nessun gruppo lo nomina usa `User-agent: *`. Le righe vuote non chiudono un gruppo.
2. **Trova le regole corrispondenti.** Ogni pattern `Allow` e `Disallow` viene confrontato con il percorso e la query dell'URL. I pattern corrispondono dall'inizio del percorso; `*` sta per qualsiasi sequenza di caratteri, un `$` finale per la fine dell'URL. Il confronto distingue maiuscole e minuscole.
3. **Scegli la corrispondenza più lunga.** Vince la regola con il pattern più lungo. Se un `Allow` e un `Disallow` hanno la stessa lunghezza, vince `Allow`. Se nessuna regola corrisponde, l'URL è consentito.

Google tollera anche errori comuni — `Dissallow`, `User agent`, i due punti mancanti — e ignora tutto ciò che va oltre i 500 KiB. Il tester riproduce questo comportamento e segnala ogni caso, così che anche altri crawler, magari più rigidi, leggano il tuo file allo stesso modo.

## Come funzionano i controlli online

Il nostro server richiede `https://your-host/robots.txt` (ripiegando su `http://` se la connessione HTTPS non riesce), segue fino a cinque reindirizzamenti, si ferma dopo 5 secondi o 512 KiB e restituisce i byte grezzi, così da poter esaminare byte order mark e codifiche. Prima di ogni connessione risolve da sé il nome host e rifiuta indirizzi privati, locali e riservati. Tutto il resto — analisi, confronto, controlli — avviene nel tuo browser.
