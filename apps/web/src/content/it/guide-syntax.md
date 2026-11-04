---
title: "Sintassi del robots.txt (RFC 9309): guida con esempi"
description: "Sintassi del robots.txt con esempi: gruppi, User-agent, Allow e Disallow, caratteri jolly * e $, corrispondenza più lunga, codici di stato ed errori comuni."
h1: "Sintassi del robots.txt secondo l'RFC 9309, con esempi"
nav: "Sintassi robots.txt"
lead: "Il robots.txt è diventato uno standard Internet nel settembre 2022 con l'RFC 9309. Le sue regole sono poche, ma alcune — la corrispondenza più lunga, un gruppo per crawler, le righe vuote — sorprendono quasi tutti. Ogni esempio qui sotto si può incollare nel tester."
related: ["tester", "home", "guide-bad-bots", "bots"]
updated: "2026-11-04"
faq:
  - q: "Il robots.txt distingue tra maiuscole e minuscole?"
    a: "I nomi delle direttive (`User-agent`, `Disallow`) e i nomi dei bot no; i percorsi sì. `Disallow: /Private/` non blocca `/private/`."
  - q: "Posso usare le espressioni regolari?"
    a: "No. Gli unici caratteri speciali sono `*` (qualsiasi sequenza di caratteri) e `$` alla fine di un pattern (fine dell'URL)."
  - q: "Mi serve una riga Allow?"
    a: "Solo per riaprire un percorso all'interno di uno bloccato. Tutto ciò che non è bloccato è consentito."
  - q: "Il robots.txt vale anche per i sottodomini?"
    a: "No. Ogni combinazione di schema, host e porta ha il proprio file: `https://example.com/robots.txt` non copre `https://blog.example.com/`."
---

## Il file

Il robots.txt è un file di testo semplice in UTF-8 che si trova nella root di un host: `https://example.com/robots.txt`. I crawler lo recuperano prima di scansionare. Le righe hanno la forma `chiave: valore`; `#` introduce un commento. Google legge fino a **500 KiB** e ignora il resto.

## Gruppi

Un **gruppo** è composto da una o più righe `User-agent` seguite da regole:

```
User-agent: GPTBot
User-agent: CCBot
Disallow: /

User-agent: *
Disallow: /admin/
```

- Un crawler usa il gruppo (o i gruppi) che lo **nominano**. Il confronto non distingue maiuscole e minuscole e usa solo il product token: `User-agent: GPTBot/1.4` viene letto come `GPTBot`.
- Se più gruppi nominano lo stesso crawler, le loro regole vengono **unite**.
- Solo un crawler che nessun gruppo nomina usa `User-agent: *`.
- Un crawler con un proprio gruppo **ignora completamente `*`**. Nell'esempio, `GPTBot` non può recuperare nulla; ma se il suo gruppo contenesse solo `Disallow: /blog/`, potrebbe recuperare `/admin/`, perché la regola `*` non si applica più a lui.

**Le righe vuote non chiudono un gruppo.** Questo file applica a `GPTBot` le regole `*`, perché entrambe le righe User-agent appartengono allo stesso gruppo:

```
User-agent: GPTBot

User-agent: *
Disallow: /private/
```

## Regole: Allow e Disallow

`Disallow: /path` blocca ogni URL il cui percorso inizia con `/path`, compresi `/path.html`, `/path/` e `/pathology`. Un `Disallow:` vuoto consente tutto. `Allow` riapre un percorso.

Quando più regole corrispondono, **vince il pattern più lungo**; se un pattern Allow e uno Disallow hanno la stessa lunghezza, **vince Allow**. L'ordine delle righe non conta.

```
User-agent: *
Disallow: /shop/
Allow: /shop/catalog/
```

`/shop/cart` è bloccato; `/shop/catalog/shoes` è consentito (14 caratteri battono 6).

## Caratteri jolly

- `*` corrisponde a qualsiasi sequenza di caratteri: `Disallow: /*.pdf` blocca ogni URL che contiene `.pdf`.
- `$` alla fine ancora la fine dell'URL: `Disallow: /*.pdf$` blocca `/a.pdf` ma non `/a.pdf?download=1`.
- Un `*` finale non cambia nulla: `/private*` equivale a `/private`.
- I pattern vengono confrontati con il percorso **e la query**: `Disallow: /*?sort=` blocca le pagine di elenco ordinate.

## Altre righe

- `Sitemap: https://example.com/sitemap.xml`: un URL completo; vale per tutti i crawler, in qualsiasi punto del file.
- `Crawl-delay`: ignorato da Google; Bing, Yandex, Anthropic e Common Crawl lo rispettano.
- `Noindex` nel robots.txt: non supportato dal 2019; usa un meta tag robots.
- `Content-Signal`, `Content-Usage`: proposte per esprimere preferenze sull'AI; vedi [content signals](page:content-signals).

## Quando il file manca o è difettoso

| Risposta per /robots.txt | Comportamento di Google |
|---|---|
| 200 | Le regole si applicano |
| 3xx | Segue fino a 5 reindirizzamenti, poi lo tratta come un 404 |
| 4xx (tranne 429) | Nessuna restrizione: si può scansionare tutto |
| 5xx, 429 | Scansione sospesa; dopo circa 30 giorni copia in cache o nessuna restrizione |
| Irraggiungibile | Trattato come un 5xx |

## Errori che Google perdona, e altri forse no

Google accetta `Dissallow`, `User agent`, i due punti mancanti (`Disallow /admin`) e un byte order mark. Altri crawler potrebbero non farlo, quindi il [tester](page:tester) li segnala anche se il parser di Google li legge. Segnala anche regole che precedono qualsiasi riga `User-agent` (ignorate da tutti), URL completi in `Disallow` (non corrispondono mai) e percorsi senza la barra iniziale.
