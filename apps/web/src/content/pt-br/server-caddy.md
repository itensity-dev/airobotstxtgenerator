---
title: "Bloquear crawlers de IA no Caddy (Caddyfile header_regexp)"
description: "Regra de Caddyfile que bloqueia GPTBot, ClaudeBot e outros crawlers de IA com um matcher nomeado no User-Agent: 403 para bots de IA, robots.txt acessível."
h1: "Bloquear crawlers de IA no Caddy"
nav: "Caddy"
lead: "Um matcher nomeado com `header_regexp User-Agent` seleciona os crawlers de IA e exclui o `/robots.txt`, e o `respond` responde a eles antes de qualquer outro handler."
steps:
  - "Selecione os agentes e copie o snippet."
  - "Cole-o dentro do bloco do seu site no Caddyfile, antes de `reverse_proxy`, `php_fastcgi` ou `file_server`."
  - "Rode `caddy validate --config /etc/caddy/Caddyfile` e depois `caddy reload --config /etc/caddy/Caddyfile`."
  - "Teste com `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Expressão regular sem diferenciar maiúsculas de minúsculas"
    status: "yes"
    note: "`(?i)` no início do padrão faz a correspondência ignorar maiúsculas e minúsculas."
  - feature: "Ordem das diretivas"
    status: "yes"
    note: "O Caddy ordena as diretivas sozinho; `respond` roda antes de `reverse_proxy` e `file_server`."
  - feature: "Configuração em JSON"
    status: "partly"
    note: "O snippet é para o Caddyfile; o `caddy adapt` o converte para JSON."
faq:
  - q: "Posso reutilizar o matcher em vários sites?"
    a: "Sim: coloque-o em um snippet — `(ai_bots) { … }` — e use `import ai_bots` em cada bloco de site."
  - q: "Como registrar em log as requisições bloqueadas?"
    a: "O Caddy registra toda requisição, incluindo o status da resposta; filtre o log de acesso pelo status 403 e pelos User-Agents correspondentes."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## O que o snippet faz

`@ai_bots` é um matcher nomeado: uma requisição só corresponde se todas as condições dentro dele forem verdadeiras — o cabeçalho User-Agent corresponde à expressão e o caminho não é `/robots.txt`. `respond @ai_bots 403` encerra essas requisições na hora, com uma resposta 403 vazia. Todo o resto segue para os seus handlers normais.
