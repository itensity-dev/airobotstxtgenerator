---
title: "Bloccare i bot AI sul server: .htaccess, nginx, Cloudflare"
description: "Genera regole server che rispondono 403 ai crawler AI: nginx, Apache .htaccess, Caddy, Cloudflare WAF, Express, Next.js, Django, PHP. Con verifica IP e DNS."
h1: "Bloccare i bot AI sul server"
nav: "Regole server"
lead: "Il robots.txt si limita a chiedere; queste regole fanno sì che il tuo server rifiuti i crawler AI in base allo User-Agent. Scegli un server e gli agenti da bloccare, copia la regola e verifica i bot autentici tramite IP o DNS inverso."
steps:
  - "Scegli il tuo server o framework: nginx, Apache, Caddy, Cloudflare WAF, Express, Next.js, Django o PHP."
  - "Scegli gli agenti: solo i crawler di addestramento, tutti gli agenti AI o una tua selezione dal registro."
  - "Scegli il codice di risposta: `403 Forbidden` è il segnale più chiaro; `404` o `410` nascondono il fatto che stai bloccando."
  - "Incolla la regola dove indicano i commenti, ricarica il server, poi verifica con `curl -A \"GPTBot\" -I https://your-site/`: dovresti ricevere il codice scelto, mentre `/robots.txt` resta raggiungibile."
capabilities:
  - feature: "Esclude i token validi solo in robots.txt"
    status: "yes"
    note: "Google-Extended, Applebot-Extended, FirecrawlAgent e `__usage_ai-training` non compaiono mai in un header User-Agent, quindi vengono esclusi invece di generare regole inutili."
  - feature: "Non blocca mai motori di ricerca o anteprime dei link"
    status: "yes"
    note: "Googlebot, Bingbot, Applebot e facebookexternalhit non sono inclusi nei preset; i nomi generici della lista community (Code, Spider, OpenAI …) vengono esclusi per non bloccare traffico estraneo."
  - feature: "Mantiene raggiungibile /robots.txt"
    status: "yes"
    note: "Ogni regola esclude `/robots.txt`, così i crawler possono comunque leggere le tue regole."
  - feature: "Ferma i bot camuffati o non dichiarati"
    status: "no"
    note: "Il confronto sullo User-Agent ferma solo i bot che si identificano. Per i bot con uno User-Agent da browser servono rate limit, gestione dei bot o regole basate sull'IP."
  - feature: "Lunghezza delle espressioni Cloudflare"
    status: "partly"
    note: "Le espressioni delle regole personalizzate sono limitate a 4.096 caratteri; lo strumento avvisa quando una selezione è troppo lunga."
faq:
  - q: "Devo bloccare i crawler AI nel robots.txt o sul server?"
    a: "In entrambi, per motivi diversi. Il robots.txt è il modo documentato e leggibile da macchina per dichiarare la tua scelta — è ciò a cui fa riferimento il Codice di buone pratiche dell'UE per l'IA per finalità generali — e i crawler corretti lo rispettano. Le regole server impongono la scelta ai crawler che ignorano robots.txt o che recuperano le pagine per conto di un utente."
  - q: "Un bot può aggirare il blocco basato sullo User-Agent?"
    a: "Sì, inviando uno User-Agent diverso. Per questo gli operatori pubblicano intervalli IP o firmano le richieste: così puoi consentire solo le richieste autentiche di un bot di cui ti fidi, o bloccare un bot in base alla sua rete. La tabella qui sotto elenca tutti gli elenchi IP e i nomi host pubblicati."
  - q: "Bloccare con un 403 danneggia la SEO?"
    a: "No, se blocchi solo agenti specifici per l'AI. Non bloccare mai in questo modo Googlebot, Bingbot o Applebot; Google-Extended e Applebot-Extended controllano l'uso per l'AI senza toccare la ricerca."
  - q: "Quale codice di risposta dovrei usare?"
    a: "`403 Forbidden` dice chiaramente che l'accesso è negato. Alcuni gestori di siti preferiscono `404` o `410`, così il crawler non registra nulla di utile. Tutti e tre impediscono che il contenuto venga consegnato."
related: ["server-nginx", "server-apache", "server-cloudflare", "bots", "guide-bad-bots"]
updated: "2026-11-04"
---

## Come vengono costruite le regole

Le regole derivano dallo stesso [registro](page:bots) usato dal generatore. Per ogni agente selezionato prendiamo le sottostringhe che il suo operatore documenta nell'header User-Agent (ad esempio `GPTBot` o `ClaudeBot`), rimuoviamo i duplicati e i nomi già coperti da uno più corto e scriviamo per il tuo server un confronto che non distingue maiuscole e minuscole. Gli agenti che sono solo token robots.txt vengono saltati con una nota, perché nessuna richiesta porta mai il loro nome.

## Verificare che un bot sia autentico

Una stringa User-Agent è solo testo, e le richieste false di «GPTBot» o «Googlebot» sono frequenti. Gli operatori offrono tre modi per dimostrare che una richiesta è autentica:

- **Elenchi IP**: file JSON con gli intervalli di indirizzi usati dal crawler (OpenAI, Anthropic, Perplexity, Google, Common Crawl, DuckDuckGo e altri). Confronta l'IP del client con gli intervalli e aggiorna l'elenco regolarmente.
- **DNS inverso**: cerca il nome host dell'IP del client, controlla che termini con il dominio dell'operatore (ad esempio `googlebot.com` o `applebot.apple.com`), poi risolvi quel nome host in avanti e conferma che restituisca lo stesso IP.
- **Richieste firmate (Web Bot Auth)**: la richiesta contiene una HTTP Message Signature verificabile con la chiave pubblicata dall'operatore (Exa, You.com, l'agente di ChatGPT, alcune richieste di Google-Agent).

La [pagina di ogni bot](page:bots) contiene uno snippet Node.js pronto per il relativo metodo.
