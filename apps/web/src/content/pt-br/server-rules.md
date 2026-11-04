---
title: "Bloquear bots de IA no .htaccess e nginx: regras prontas"
description: "Gere regras que retornam 403 a crawlers de IA pelo User-Agent — nginx, Apache, Caddy, Cloudflare WAF, Express, Next.js, Django, PHP — e verifique bots por IP."
h1: "Bloquear bots de IA no servidor"
nav: "Regras de servidor"
lead: "O robots.txt apenas pede; estas regras fazem o seu servidor recusar crawlers de IA pelo User-Agent. Escolha um servidor e os agentes a bloquear, copie a regra e verifique os bots legítimos por IP ou DNS reverso."
steps:
  - "Escolha o seu servidor ou framework: nginx, Apache, Caddy, Cloudflare WAF, Express, Next.js, Django ou PHP."
  - "Escolha os agentes: só os crawlers de treinamento, todos os agentes de IA ou a sua própria seleção a partir do registro."
  - "Escolha o código de resposta — `403 Forbidden` é o sinal mais claro; `404` ou `410` escondem que você está bloqueando."
  - "Cole a regra onde os comentários indicam, recarregue o servidor e confira com `curl -A \"GPTBot\" -I https://seu-site/` — você deve receber o código escolhido, enquanto o `/robots.txt` continua acessível."
capabilities:
  - feature: "Ignora tokens exclusivos do robots.txt"
    status: "yes"
    note: "Google-Extended, Applebot-Extended, FirecrawlAgent e `__usage_ai-training` nunca aparecem em um cabeçalho User-Agent, então ficam de fora em vez de gerar regras inúteis."
  - feature: "Nunca bloqueia mecanismos de busca nem prévias de links"
    status: "yes"
    note: "Googlebot, Bingbot, Applebot e facebookexternalhit não são oferecidos nas predefinições; nomes genéricos da lista comunitária (Code, Spider, OpenAI …) ficam de fora para não bloquear tráfego sem relação com IA."
  - feature: "Mantém o /robots.txt acessível"
    status: "yes"
    note: "Toda regra isenta o `/robots.txt`, para que os crawlers ainda possam ler a sua política."
  - feature: "Barra bots falsificados ou não declarados"
    status: "no"
    note: "A correspondência por User-Agent só barra bots que se identificam. Bots que usam um User-Agent de navegador exigem limites de taxa, gerenciamento de bots ou regras baseadas em IP."
  - feature: "Tamanho da expressão na Cloudflare"
    status: "partly"
    note: "Expressões de regras personalizadas são limitadas a 4.096 caracteres; a ferramenta avisa quando uma seleção fica longa demais."
faq:
  - q: "Devo bloquear crawlers de IA no robots.txt ou no servidor?"
    a: "Nos dois, por motivos diferentes. O robots.txt é a forma documentada e legível por máquina de declarar a sua escolha — é a ele que o Código de Práticas de IA de uso geral da UE se refere — e crawlers bem-comportados o seguem. As regras de servidor impõem a escolha aos crawlers que ignoram o robots.txt ou que buscam páginas em nome de um usuário."
  - q: "Um bot consegue driblar o bloqueio por User-Agent?"
    a: "Sim, enviando outro User-Agent. É por isso que os operadores publicam faixas de IP ou assinam as requisições: com isso, você pode permitir só as requisições legítimas de um bot em que confia, ou bloquear um bot pela rede dele. A tabela abaixo lista todas as listas de IPs e nomes de host publicados."
  - q: "Bloquear com 403 prejudica o meu SEO?"
    a: "Não, se você bloquear só agentes específicos de IA. Nunca bloqueie Googlebot, Bingbot ou Applebot dessa forma; Google-Extended e Applebot-Extended controlam o uso por IA sem mexer na busca."
  - q: "Qual código de resposta devo usar?"
    a: "`403 Forbidden` deixa claro que o acesso foi recusado. Alguns donos de sites preferem `404` ou `410` para que o crawler não registre nada útil. Os três impedem a entrega do conteúdo."
related: ["server-nginx", "server-apache", "server-cloudflare", "bots", "guide-bad-bots"]
updated: "2026-11-04"
---

## Como as regras são montadas

As regras vêm do mesmo [registro](page:bots) que o gerador usa. Para cada agente selecionado, pegamos as substrings que o operador documenta no cabeçalho User-Agent (por exemplo `GPTBot` ou `ClaudeBot`), removemos duplicatas e nomes já cobertos por um nome mais curto e escrevemos uma correspondência sem diferenciar maiúsculas de minúsculas para o seu servidor. Agentes que são apenas tokens do robots.txt ficam de fora, com uma observação, porque nenhuma requisição carrega o nome deles.

## Como verificar se um bot é legítimo

Uma string de User-Agent é só texto, e requisições falsas de “GPTBot” ou “Googlebot” são comuns. Os operadores oferecem três formas de provar que uma requisição é real:

- **Listas de IPs** — arquivos JSON com as faixas de endereços que o crawler usa (OpenAI, Anthropic, Perplexity, Google, Common Crawl, DuckDuckGo e outros). Compare o IP do cliente com as faixas e atualize a lista regularmente.
- **DNS reverso** — consulte o nome de host do IP do cliente, confira se ele termina com o domínio do operador (por exemplo `googlebot.com` ou `applebot.apple.com`) e depois resolva esse nome de host no sentido direto e confirme que ele retorna o mesmo IP.
- **Requisições assinadas (Web Bot Auth)** — a requisição traz uma HTTP Message Signature que pode ser verificada com a chave publicada pelo operador (Exa, You.com, o agente do ChatGPT, algumas requisições do Google-Agent).

Cada [página de bot](page:bots) tem um snippet pronto em Node.js para o método correspondente.
