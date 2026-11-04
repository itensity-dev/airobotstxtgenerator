---
title: "Bloquear bots de IA em Express, Next.js, Django e PHP"
description: "Middleware pronto para copiar que bloqueia GPTBot, ClaudeBot e outros crawlers de IA pelo User-Agent em Express, Next.js (proxy.ts), Django e PHP/WordPress."
h1: "Bloquear bots de IA na sua aplicação"
nav: "Frameworks"
lead: "Quando você não pode alterar o servidor web, bloqueie os crawlers de IA na própria aplicação: middleware para Express, Next.js, Django e PHP puro ou WordPress, gerado a partir do registro."
steps:
  - "Escolha o framework e os agentes e copie o código."
  - "Express: registre o middleware antes das suas rotas. Next.js: salve como `proxy.ts` na raiz do projeto (`middleware.ts` antes do Next.js 16). Django: adicione a classe a `MIDDLEWARE`. PHP: inclua o arquivo logo no início do `index.php` ou coloque-o em `wp-content/mu-plugins/`."
  - "Faça o deploy e teste com `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Sem acesso ao servidor"
    status: "yes"
    note: "Funciona em plataformas onde você controla só o código (Vercel, Render, hospedagem PHP compartilhada)."
  - feature: "Arquivos estáticos servidos por uma CDN"
    status: "partly"
    note: "Requisições respondidas pela CDN ou por um servidor de arquivos estáticos nunca chegam ao seu middleware; bloqueie lá também."
  - feature: "Desempenho"
    status: "yes"
    note: "Uma expressão regular compilada por requisição."
faq:
  - q: "Um middleware é tão bom quanto uma regra de servidor?"
    a: "Ele recusa as mesmas requisições, só que mais tarde: a sua aplicação já começou a processá-las. Regras de servidor ou de CDN custam menos. O middleware é a escolha certa quando você não pode alterar o servidor."
  - q: "O proxy do Next.js roda para assets estáticos?"
    a: "Por padrão, ele roda para todas as rotas; adicione um `config.matcher` que exclua `_next/static` e as imagens se quiser economizar invocações."
related: ["server-rules", "server-nginx", "server-cloudflare", "bots"]
updated: "2026-11-04"
---

## Como o middleware decide

Cada snippet monta uma única expressão regular, sem diferenciar maiúsculas de minúsculas, a partir dos nomes de User-Agent dos agentes selecionados, ignora o caminho `/robots.txt` e responde às requisições correspondentes com o status que você escolheu e uma mensagem curta em texto simples. Nada mais muda na sua aplicação.
