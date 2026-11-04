---
title: "Elenco crawler AI: tutti i bot AI e come bloccarli"
description: "Registro di {{all}} crawler AI, agenti e token robots.txt (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bytespider…) con operatore, scopo, IP e fonti."
h1: "Registro dei crawler AI"
nav: "Registro bot"
lead: "Tutti i crawler AI, gli agenti AI e i token di controllo robots.txt che siamo riusciti a documentare: chi li gestisce, cosa raccolgono, se l'operatore dichiara di rispettare robots.txt e come verificarli, con il link alla fonte e la data del nostro ultimo controllo."
steps:
  - "Cerca nel registro per nome o azienda, oppure scorrilo per operatore."
  - "Apri la pagina di un agente per vedere User-Agent, token robots.txt, elenco IP e regole pronte da copiare."
  - "Usa la colonna dello scopo per decidere: i crawler di addestramento di solito si possono bloccare senza perdere visibilità; gli agenti di ricerca AI e quelli su richiesta degli utenti portano citazioni e visitatori."
  - "Crea un file completo con il [generatore](page:home) o testa quello attuale con il [tester](page:tester)."
capabilities:
  - feature: "Fonte per ogni voce"
    status: "yes"
    note: "Ogni voce curata rimanda alla documentazione ufficiale dell'operatore; dove non esiste, la pagina lo dice."
  - feature: "Data dell'ultimo controllo"
    status: "yes"
    note: "Indicata per ogni agente, insieme al metodo di controllo (pagina aperta o letta tramite un indice di ricerca)."
  - feature: "Leggibile da macchina"
    status: "yes"
    note: "L'intero registro è disponibile come [/bots.json](/bots.json) con licenza CC BY 4.0."
  - feature: "Aggiornamento settimanale"
    status: "yes"
    note: "Un job settimanale confronta la lista community con ai.robots.txt e apre una pull request; le voci curate vengono revisionate a mano."
  - feature: "Prova che una richiesta è autentica"
    status: "partly"
    note: "Solo dove l'operatore pubblica intervalli IP, nomi host per il DNS inverso o firme. Chiunque può falsificare una stringa User-Agent."
faq:
  - q: "Quali crawler AI dovrei bloccare?"
    a: "Dipende da cosa vuoi ottenere. Per tenere i contenuti fuori dall'addestramento AI restando visibile nelle risposte AI, blocca i crawler e i token di addestramento (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent, Bytespider, MistralAI-Training) e consenti gli agenti di ricerca (OAI-SearchBot, Claude-SearchBot, PerplexityBot). La [guida](page:guide-training-search) spiega pro e contro."
  - q: "Che differenza c'è tra un crawler e un token robots.txt?"
    a: "Un crawler invia richieste con un proprio User-Agent. Un token come Google-Extended o Applebot-Extended non visita mai il tuo sito: è un nome nel robots.txt che dice all'operatore come possono essere usati i contenuti recuperati dal suo crawler normale. I token si controllano solo con robots.txt, non con regole server."
  - q: "Perché alcuni agenti ignorano robots.txt?"
    a: "I fetcher che agiscono su richiesta di una persona — ChatGPT-User, Perplexity-User, Google-Agent, meta-externalfetcher — vengono trattati dai loro operatori come un browser e potrebbero non rispettare robots.txt. Alcuni crawler non pubblicano alcuna policy. Per questi, blocca a livello di server o CDN."
  - q: "Quanto è aggiornato l'elenco?"
    a: "Le voci curate sono state controllate sulla documentazione degli operatori il {{updated}}; ogni pagina mostra la propria data. La lista community viene sincronizzata con ai.robots.txt ogni settimana."
  - q: "Posso usare i dati?"
    a: "Sì. Il registro è pubblicato in JSON su /bots.json con licenza CC BY 4.0: cita airobotstxtgenerator.com. Le voci della community provengono dal progetto ai.robots.txt con licenza MIT."
related: ["home", "tester", "server-rules", "guide-training-search"]
updated: "2026-11-04"
---

## Come è costruito il registro

Ogni voce curata parte dalla documentazione ufficiale dell'operatore: OpenAI, Anthropic, Google, Apple, Perplexity, Meta, Amazon, Mistral, DuckDuckGo, Microsoft, Common Crawl e altri pubblicano pagine che descrivono i propri crawler. Da queste pagine annotiamo il token robots.txt, una stringa User-Agent documentata, lo scopo, la dichiarazione dell'operatore su robots.txt, gli elenchi IP o i nomi host pubblicati e la data del controllo. Quando un operatore non pubblica nulla — ad esempio ByteDance per Bytespider — la voce è contrassegnata come basata su osservazioni indipendenti.

Gli **scopi** seguono le categorie che oggi usano gli operatori e Cloudflare: *addestramento AI*, *ricerca AI* (indicizzare e citare), *recuperi richiesti dagli utenti* (un assistente che apre una pagina per una persona) e *token robots.txt*. I crawler generici come Googlebot, Bingbot e Applebot sono elencati come riferimento, perché molte funzioni AI si basano su di loro.

La **lista community** sotto la tabella principale proviene dal progetto open source [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt). È più ampia ma non verificata voce per voce; alcuni nomi sono smentiti dagli stessi operatori (Cohere dichiara di non usare alcun crawler, Brave non ha uno User-Agent distinto, il crawler di Exa si chiama ExaSearchBot).
