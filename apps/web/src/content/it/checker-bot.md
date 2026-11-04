---
title: "AIRobotsTxtChecker: il bot del nostro tester robots.txt"
description: "AIRobotsTxtChecker è lo User-Agent del nostro tester robots.txt: cosa recupera (solo /robots.txt), con che frequenza, da dove e come bloccarlo."
h1: "Il nostro bot di verifica: AIRobotsTxtChecker"
nav: "Bot di verifica"
lead: "Quando qualcuno usa il controllo online del nostro tester robots.txt, il nostro server recupera una sola volta il /robots.txt di quel sito, con questo User-Agent. Non recupera mai nient'altro."
related: ["tester", "privacy", "about"]
updated: "2026-11-04"
---

## User-Agent

```
Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)
```

## Cosa fa

- Recupera **solo** il `/robots.txt` dell'host inserito da un utente: mai pagine, immagini o sitemap.
- Una richiesta per controllo; i risultati restano in cache per 10 minuti, quindi controlli ripetuti dello stesso host in quel lasso di tempo non generano nuove richieste.
- Segue al massimo 5 reindirizzamenti, attende al massimo 5 secondi e legge al massimo 512 KiB.
- Si connette solo a indirizzi IP pubblici sulle porte 80 e 443.
- Non è un crawler: non segue link, non conserva il tuo file oltre la cache e non lo usa per nient'altro.

## Rispetta robots.txt?

Legge robots.txt; non scansiona nulla che robots.txt possa regolare. Come il fetcher robots.txt di Google, non applica il tuo robots.txt al file robots.txt stesso.

## Come bloccarlo

Se non vuoi che il tuo robots.txt venga controllato tramite il nostro sito, restituisci `403` allo User-Agent `AIRobotsTxtChecker`, ad esempio in nginx:

```nginx
if ($http_user_agent ~* "AIRobotsTxtChecker") { return 403; }
```

Domande o segnalazioni di abusi: {{contact}}.
