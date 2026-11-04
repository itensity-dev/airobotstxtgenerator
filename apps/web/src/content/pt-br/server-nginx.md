---
title: "Bloquear crawlers de IA no nginx (map $http_user_agent)"
description: "Configuração do nginx que bloqueia GPTBot, ClaudeBot, CCBot, Bytespider e outros crawlers de IA com um map em $http_user_agent: 403, robots.txt acessível."
h1: "Bloquear crawlers de IA no nginx"
nav: "nginx"
lead: "Um `map` em `$http_user_agent` marca os crawlers de IA uma única vez no bloco `http`; um `if` de duas linhas em cada bloco `server` responde a eles com 403, enquanto o `/robots.txt` continua acessível."
steps:
  - "Selecione os agentes e copie a configuração."
  - "Coloque o bloco `map` no contexto `http {}` — por exemplo, em um novo arquivo `/etc/nginx/conf.d/ai-bots.conf`, que a maioria das distribuições inclui automaticamente."
  - "Coloque o bloco `location = /robots.txt` e as linhas `if ($is_ai_bot)` dentro de cada bloco `server {}` que deve recusar crawlers de IA."
  - "Rode `nginx -t` para checar a sintaxe e depois `systemctl reload nginx`."
  - "Teste: `curl -I -A \"Mozilla/5.0 (compatible; GPTBot/1.4)\" https://example.com/` retorna 403; `curl -I https://example.com/robots.txt` continua retornando 200."
capabilities:
  - feature: "Correspondência sem diferenciar maiúsculas de minúsculas"
    status: "yes"
    note: "Cada linha usa `~*`, a expressão regular do nginx que não diferencia maiúsculas de minúsculas."
  - feature: "Uma lista para todos os sites"
    status: "yes"
    note: "O `map` fica em `http {}`, então todo bloco server pode usar `$is_ai_bot`."
  - feature: "Uso seguro do if"
    status: "yes"
    note: "`if` com `return` é um dos usos que a documentação do nginx considera seguros dentro de `server`."
  - feature: "Funciona atrás de uma CDN"
    status: "partly"
    note: "O nginx vê o User-Agent que a CDN repassa — normalmente o original. Bots bloqueados na CDN nunca chegam ao nginx."
faq:
  - q: "Por que um map em vez de uma condição if longa?"
    a: "O nginx avalia o `map` sob demanda e uma vez por requisição, a lista fica legível com um bot por linha, e você pode reutilizar a variável em vários blocos server ou no log (`access_log ... if=$is_ai_bot`)."
  - q: "Posso registrar as requisições de bots de IA em log em vez de bloqueá-las?"
    a: "Sim: mantenha o `map` e troque o `if` por um log separado, por exemplo `access_log /var/log/nginx/ai-bots.log combined if=$is_ai_bot;`."
  - q: "Como permitir um bot só a partir dos IPs reais dele?"
    a: "Use o módulo `geo` com as faixas publicadas pelo operador, combine-o com o map de User-Agent e recuse as requisições que dizem ser do bot, mas vêm de outros endereços. As faixas mudam, então atualize-as com um script."
related: ["server-rules", "server-apache", "server-caddy", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Onde vai cada parte

O nginx lê a configuração em contextos. A diretiva `map` só é permitida em `http {}`; as diretivas `if` e `location` ficam em `server {}`. Se você administra vários sites, defina o map uma vez e adicione as três linhas a cada site. Mantenha `location = /robots.txt` antes de outras locations que possam reescrever a requisição ou repassá-la via proxy — no nginx, uma location de correspondência exata sempre vence.

Se o nginx for um proxy reverso na frente de uma aplicação, a regra barra a requisição antes que ela chegue à aplicação, o que também poupa os recursos dela.
