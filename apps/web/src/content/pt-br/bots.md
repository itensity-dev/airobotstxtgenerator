---
title: "Lista de bots de IA: user agents e como bloquear cada um"
description: "Registro de {{all}} crawlers, agentes e tokens de IA — GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bytespider… — com operador, finalidade, IPs e fontes."
h1: "Registro de bots de IA"
nav: "Registro de bots"
lead: "Todos os crawlers, agentes de IA e tokens de controle do robots.txt que conseguimos documentar: quem opera, o que coleta, se o operador diz que segue o robots.txt e como verificá-lo — com link para a fonte e a data da nossa última verificação."
steps:
  - "Pesquise no registro por nome ou empresa, ou percorra a lista por operador."
  - "Abra a página de um agente para ver o User-Agent, o token do robots.txt, a lista de IPs e regras prontas para copiar."
  - "Use a coluna de finalidade para decidir: crawlers de treinamento geralmente podem ser bloqueados sem perda de visibilidade; agentes de busca com IA e de usuário trazem citações e visitantes."
  - "Monte um arquivo completo com o [gerador](page:home) ou teste o seu arquivo atual com o [verificador](page:tester)."
capabilities:
  - feature: "Fonte para cada entrada"
    status: "yes"
    note: "Cada entrada curada tem link para a documentação do próprio operador; quando ela não existe, a página informa isso."
  - feature: "Data da última verificação"
    status: "yes"
    note: "Mostrada por agente, junto com o modo de verificação (página aberta ou lida via índice de busca)."
  - feature: "Legível por máquina"
    status: "yes"
    note: "O registro completo está disponível em [/bots.json](/bots.json) sob CC BY 4.0."
  - feature: "Atualização semanal"
    status: "yes"
    note: "Um job semanal compara a lista comunitária com o ai.robots.txt e abre um pull request; as entradas curadas são revisadas manualmente."
  - feature: "Prova de que uma requisição é legítima"
    status: "partly"
    note: "Só quando o operador publica faixas de IP, nomes de host para DNS reverso ou assinaturas. Qualquer pessoa pode falsificar uma string de User-Agent."
faq:
  - q: "Quais crawlers de IA devo bloquear?"
    a: "Depende do que você quer. Para manter o conteúdo fora do treinamento de IA, mas continuar visível nas respostas de IA, bloqueie os crawlers e tokens de treinamento (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent, Bytespider, MistralAI-Training) e permita os agentes de busca (OAI-SearchBot, Claude-SearchBot, PerplexityBot). O [guia](page:guide-training-search) explica os prós e contras."
  - q: "Qual é a diferença entre um crawler e um token do robots.txt?"
    a: "Um crawler envia requisições com o próprio User-Agent. Um token como Google-Extended ou Applebot-Extended nunca visita o seu site; é um nome no robots.txt que diz ao operador como o conteúdo obtido pelo crawler comum dele pode ser usado. Tokens só podem ser controlados no robots.txt, não com regras de servidor."
  - q: "Por que alguns agentes ignoram o robots.txt?"
    a: "Agentes que agem a pedido de uma pessoa — ChatGPT-User, Perplexity-User, Google-Agent, meta-externalfetcher — são tratados pelos operadores como um navegador e podem não seguir o robots.txt. Alguns crawlers nem publicam uma política. Para esses, bloqueie no servidor ou na CDN."
  - q: "Quão atualizada é a lista?"
    a: "As entradas curadas foram conferidas com a documentação dos operadores em {{updated}}; cada página mostra a própria data. A lista comunitária é sincronizada com o ai.robots.txt toda semana."
  - q: "Posso usar os dados?"
    a: "Sim. O registro é publicado em JSON em /bots.json sob CC BY 4.0 — por favor, dê o crédito a airobotstxtgenerator.com. As entradas comunitárias vêm do projeto ai.robots.txt, sob a Licença MIT."
related: ["home", "tester", "server-rules", "guide-training-search"]
updated: "2026-11-04"
---

## Como o registro é montado

Cada entrada curada parte da documentação do próprio operador: OpenAI, Anthropic, Google, Apple, Perplexity, Meta, Amazon, Mistral, DuckDuckGo, Microsoft, Common Crawl e outros publicam páginas que descrevem seus crawlers. Dessas páginas, registramos o token do robots.txt, uma string de User-Agent documentada, a finalidade, a declaração do operador sobre o robots.txt, as listas de IPs ou nomes de host publicados e a data da nossa verificação. Quando um operador não publica nada — como a ByteDance no caso do Bytespider —, a entrada é marcada como baseada em observações independentes.

As **finalidades** seguem as categorias que os operadores e a Cloudflare usam hoje: *treinamento de IA*, *busca com IA* (indexar e citar), *acessos a pedido do usuário* (um assistente que abre uma página para uma pessoa) e *tokens do robots.txt*. Crawlers gerais como Googlebot, Bingbot e Applebot aparecem como referência, porque muitos recursos de IA dependem deles.

A **lista comunitária**, abaixo da tabela principal, vem do projeto aberto [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt). Ela é mais ampla, mas não é verificada item a item; alguns dos nomes são contestados pelos próprios operadores (a Cohere diz que não opera nenhum crawler, o Brave não tem um User-Agent próprio, o crawler da Exa se chama ExaSearchBot).
