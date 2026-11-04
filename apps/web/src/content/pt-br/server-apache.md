---
title: "Bloquear bots de IA com .htaccess (Apache mod_rewrite)"
description: "Regras de .htaccess para bloquear GPTBot, ClaudeBot, CCBot, Bytespider e outros crawlers de IA no Apache (mod_rewrite): 403 para bots, robots.txt acessível."
h1: "Bloquear bots de IA com .htaccess no Apache"
nav: "Apache .htaccess"
lead: "Três linhas de `mod_rewrite` no `.htaccess` recusam crawlers de IA pelo User-Agent com 403, deixam o `/robots.txt` de fora e funcionam em hospedagem compartilhada, sem acesso à configuração principal."
steps:
  - "Selecione os agentes e copie as regras."
  - "Abra o `.htaccess` na raiz de documentos do site (crie o arquivo se ele não existir) e cole o bloco perto do topo, antes das regras de rewrite do WordPress ou do seu framework."
  - "Salve. Não é preciso reiniciar — o Apache lê o `.htaccess` a cada requisição."
  - "Teste com `curl -I -A \"ClaudeBot\" https://example.com/` (deve retornar 403) e `curl -I https://example.com/robots.txt` (deve retornar 200)."
capabilities:
  - feature: "Hospedagem compartilhada"
    status: "yes"
    note: "Precisa só de `AllowOverride FileInfo` (ativado em quase toda hospedagem) e do `mod_rewrite`."
  - feature: "Configuração do servidor em vez do .htaccess"
    status: "yes"
    note: "As mesmas linhas funcionam dentro de `<VirtualHost>` ou `<Directory>` e são mais rápidas ali."
  - feature: "LiteSpeed e OpenLiteSpeed"
    status: "yes"
    note: "O LiteSpeed lê as regras de rewrite do Apache no `.htaccess`."
  - feature: "Hospedagem só com nginx"
    status: "no"
    note: "O nginx ignora o `.htaccess`; use as [regras para nginx](page:server-nginx)."
faq:
  - q: "Em que parte do .htaccess o bloco deve ficar?"
    a: "Antes das outras regras de rewrite. O bloco do WordPress termina com `RewriteRule . /index.php [L]`, que, do contrário, trataria a requisição primeiro."
  - q: "O que significa [F,L]?"
    a: "`F` responde 403 Forbidden e `L` interrompe o processamento das regras seguintes. `[G,L]` responde 410 Gone em vez disso."
  - q: "Posso usar SetEnvIf em vez de mod_rewrite?"
    a: "Sim: `SetEnvIfNoCase User-Agent \"GPTBot\" ai_bot` seguido de `<RequireAll> Require all granted Require not env ai_bot </RequireAll>` funciona sem mod_rewrite, mas você precisa de uma linha `SetEnvIfNoCase` por bot e de uma exceção separada para o `/robots.txt`."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Como a regra funciona

`RewriteCond %{REQUEST_URI} !^/robots\.txt$` isenta o arquivo robots.txt. `RewriteCond %{HTTP_USER_AGENT} (GPTBot|ClaudeBot|…) [NC]` corresponde a qualquer um dos nomes listados em qualquer parte do User-Agent, sem diferenciar maiúsculas de minúsculas. Em seguida, `RewriteRule ^ - [F,L]` recusa a requisição sem reescrever a URL. Todas as condições precisam ser verdadeiras para que a regra seja aplicada.

No WordPress, os plugins de cache às vezes servem as páginas antes de o PHP rodar, mas ainda depois do `.htaccess`, então o bloqueio também vale para as páginas em cache.
