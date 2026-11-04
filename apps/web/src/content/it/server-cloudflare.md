---
title: "Bloccare i bot AI con una regola WAF di Cloudflare"
description: "Regola WAF di Cloudflare per bloccare GPTBot, ClaudeBot, Bytespider e altri crawler AI per User-Agent, escluso robots.txt, e differenze con AI Crawl Control."
h1: "Bloccare i bot AI con una regola WAF di Cloudflare"
nav: "Cloudflare WAF"
lead: "Un'espressione per una regola personalizzata del WAF di Cloudflare che blocca i crawler AI scelti in base allo User-Agent, mantiene raggiungibile `/robots.txt` e rientra nel limite di 4.096 caratteri di Cloudflare."
steps:
  - "Seleziona gli agenti e copia l'espressione."
  - "Nella dashboard di Cloudflare apri il tuo dominio → **Security** → **WAF** → **Custom rules** → **Create rule** → **Edit expression** e incollala."
  - "Imposta l'azione su **Block** (o **Managed Challenge**, se preferisci) e pubblica la regola."
  - "Dopo un giorno controlla **Security → Events** per vedere quali agenti sono stati bloccati."
capabilities:
  - feature: "Piano gratuito"
    status: "yes"
    note: "Le regole personalizzate con `contains` e `lower()` sono disponibili in tutti i piani; `matches` con espressioni regolari richiede un piano a pagamento, quindi lo strumento non lo usa."
  - feature: "Controllo della lunghezza dell'espressione"
    status: "yes"
    note: "Cloudflare consente 4.096 caratteri per espressione; lo strumento avvisa e suggerisce di dividere la regola."
  - feature: "Sostituisce AI Crawl Control"
    status: "no"
    note: "AI Crawl Control di Cloudflare blocca i crawler AI verificati per categoria e può scrivere un blocco gestito nel tuo robots.txt. Usa questa regola per gli agenti che Cloudflare non copre o quando vuoi un controllo preciso."
faq:
  - q: "Cloudflare blocca già i crawler AI: mi serve questa regola?"
    a: "Forse no. Da luglio 2025 i nuovi domini bloccano i crawler AI per impostazione predefinita, e dal 2026 Cloudflare offre impostazioni separate per Search, Agent e Training. Il suo elenco copre i bot verificati. Una regola personalizzata aggiunge agenti fuori da quell'elenco e blocca per nome, indipendentemente dalla verifica."
  - q: "Perché robots.txt è escluso?"
    a: "Perché i crawler possano comunque leggere le tue regole. Un crawler che non può recuperare robots.txt non può sapere di essere bloccato."
  - q: "Cloudflare ha inserito delle righe nel mio robots.txt: cosa sono?"
    a: "È il robots.txt gestito di Cloudflare (Bot Preference Sync): un blocco tra commenti BEGIN ed END, posizionato prima delle tue regole, con righe `Content-Signal` e `Disallow` per i crawler AI. Incolla il file online nel [tester](page:tester) per vedere come si comporta il file combinato."
related: ["server-rules", "content-signals", "tester", "guide-bad-bots"]
updated: "2026-11-04"
---

## L'espressione

Ogni condizione ha la forma `(lower(http.user_agent) contains "gptbot")`: lo User-Agent viene convertito in minuscolo e vi si cerca il nome del bot, quindi maiuscole e minuscole non contano. Le condizioni sono unite con `or` e l'intero gruppo è combinato con `and not (http.request.uri.path eq "/robots.txt")`. Se usi anche le funzioni di Cloudflare per i bot verificati, puoi aggiungere `and not cf.client.bot` per lasciare i bot verificati alle impostazioni di Cloudflare.
