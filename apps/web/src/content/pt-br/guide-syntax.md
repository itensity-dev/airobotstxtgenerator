---
title: "Sintaxe do robots.txt (RFC 9309): guia com exemplos"
description: "Sintaxe do robots.txt com exemplos: grupos, User-agent, Allow e Disallow, curingas * e $, regra mais longa, grupo próprio vs. *, status HTTP e erros comuns."
h1: "Sintaxe do robots.txt segundo a RFC 9309, com exemplos"
nav: "Sintaxe do robots.txt"
lead: "O robots.txt virou padrão da internet em setembro de 2022, como RFC 9309. As regras são curtas, mas algumas delas — correspondência mais longa, um grupo por crawler, linhas em branco — surpreendem quase todo mundo. Cada exemplo abaixo pode ser colado no verificador."
related: ["tester", "home", "guide-bad-bots", "bots"]
updated: "2026-11-04"
faq:
  - q: "O robots.txt diferencia maiúsculas de minúsculas?"
    a: "Nos nomes das diretivas (`User-agent`, `Disallow`) e dos bots, não; nos caminhos, sim. `Disallow: /Private/` não bloqueia `/private/`."
  - q: "Posso usar expressões regulares?"
    a: "Não. Só `*` (qualquer sequência de caracteres) e `$` no fim de um padrão (fim da URL) são especiais."
  - q: "Preciso de uma linha Allow?"
    a: "Só para liberar um caminho dentro de outro que está bloqueado. Tudo o que não está bloqueado é permitido."
  - q: "O robots.txt vale para subdomínios?"
    a: "Não. Cada combinação de esquema, host e porta tem o próprio arquivo: `https://example.com/robots.txt` não cobre `https://blog.example.com/`."
---

## O arquivo

O robots.txt é um arquivo de texto simples, em UTF-8, na raiz de um host: `https://example.com/robots.txt`. Os crawlers o buscam antes de rastrear. As linhas têm o formato `chave: valor`; `#` inicia um comentário. O Google lê até **500 KiB** e ignora o resto.

## Grupos

Um **grupo** é uma ou mais linhas `User-agent` seguidas de regras:

```
User-agent: GPTBot
User-agent: CCBot
Disallow: /

User-agent: *
Disallow: /admin/
```

- Um crawler usa o(s) grupo(s) que o **nomeiam**. A correspondência não diferencia maiúsculas de minúsculas e usa só o token de produto: `User-agent: GPTBot/1.4` é lido como `GPTBot`.
- Se vários grupos nomeiam o mesmo crawler, as regras deles são **mescladas**.
- Só um crawler que nenhum grupo nomeia usa o `User-agent: *`.
- Um crawler com grupo próprio **ignora o `*` por completo**. No exemplo, o `GPTBot` não pode buscar nada — mas, se o grupo dele dissesse só `Disallow: /blog/`, ele poderia buscar `/admin/`, porque a regra `*` deixa de valer para ele.

**Linhas em branco não encerram um grupo.** Este arquivo dá ao `GPTBot` as regras de `*`, porque as duas linhas User-agent pertencem ao mesmo grupo:

```
User-agent: GPTBot

User-agent: *
Disallow: /private/
```

## Regras: Allow e Disallow

`Disallow: /foto` bloqueia toda URL cujo caminho comece com `/foto` — inclusive `/foto.html`, `/foto/` e `/fotografia`. Um `Disallow:` vazio permite tudo. `Allow` libera um caminho de novo.

Quando várias regras correspondem, **o padrão mais longo vence**; se um padrão Allow e um Disallow tiverem o mesmo tamanho, **o Allow vence**. A ordem das linhas não importa.

```
User-agent: *
Disallow: /shop/
Allow: /shop/catalog/
```

`/shop/cart` fica bloqueado; `/shop/catalog/shoes` é permitido (14 caracteres ganham de 6).

## Curingas

- `*` corresponde a qualquer sequência de caracteres: `Disallow: /*.pdf` bloqueia toda URL que contenha `.pdf`.
- `$` no final marca o fim da URL: `Disallow: /*.pdf$` bloqueia `/a.pdf`, mas não `/a.pdf?download=1`.
- Um `*` no final não muda nada: `/private*` equivale a `/private`.
- Os padrões são comparados com o caminho **e a query string**: `Disallow: /*?sort=` bloqueia páginas de listagem ordenadas.

## Outras linhas

- `Sitemap: https://example.com/sitemap.xml` — uma URL completa; vale para todos os crawlers, em qualquer lugar do arquivo.
- `Crawl-delay` — ignorado pelo Google; Bing, Yandex, Anthropic e Common Crawl o respeitam.
- `Noindex` no robots.txt — não é suportado desde 2019; use uma meta tag robots.
- `Content-Signal`, `Content-Usage` — propostas de preferências de IA; veja [sinais de conteúdo](page:content-signals).

## Quando o arquivo não existe ou está com problema

| Resposta para /robots.txt | Comportamento do Google |
|---|---|
| 200 | As regras valem |
| 3xx | Segue até 5 redirecionamentos e depois trata como 404 |
| 4xx (exceto 429) | Sem restrições — tudo pode ser rastreado |
| 5xx, 429 | Rastreamento pausado; após ~30 dias, cópia em cache ou nenhuma restrição |
| Inacessível | Tratado como 5xx |

## Erros que o Google perdoa — e outros talvez não

O Google aceita `Dissallow`, `User agent`, a falta dos dois-pontos (`Disallow /admin`) e uma marca de ordem de bytes. Outros crawlers podem não aceitar, por isso o [verificador](page:tester) aponta esses casos, mesmo que o parser do Google os leia. Ele também aponta regras antes de qualquer linha `User-agent` (ignoradas por todos), URLs completas em `Disallow` (nunca correspondem) e caminhos sem a barra inicial.
