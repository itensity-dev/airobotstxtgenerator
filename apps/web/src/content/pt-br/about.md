---
title: "Sobre o AI Robots.txt Generator: quem faz e por quê"
description: "Ferramenta grátis e independente para decidir quais crawlers de IA podem usar seu site: quem faz o AI Robots.txt Generator, como o registro é mantido e contato."
h1: "Sobre este projeto"
nav: "Sobre"
lead: "Um conjunto gratuito e independente de ferramentas para uma decisão que todo dono de site enfrenta hoje: quais crawlers de IA podem ler, citar ou aprender com as suas páginas."
related: ["checker-bot", "bots", "privacy", "licenses"]
updated: "2026-11-04"
---

## O que é

O AI Robots.txt Generator (airobotstxtgenerator.com) reúne um gerador, um verificador, um registro de crawlers de IA com uma página para cada um, regras de servidor e guias. Tudo o que pode rodar no seu navegador roda nele — geração, análise, teste de arquivos colados — e funciona off-line depois que a página carrega. O único componente de servidor busca o robots.txt público de um site quando você pede uma verificação ao vivo.

O projeto faz parte de uma pequena rede de ferramentas gratuitas de propósito único do mesmo criador, incluindo ibangenerator.io e metasnitch.com. Não há conta, não há paywall nas ferramentas e não há limite nenhum, exceto um limite de taxa nas verificações ao vivo para evitar abusos.

## Como o registro é mantido

Cada entrada curada é conferida com a documentação do próprio operador e datada; a página informa como ela foi verificada. Um job automático semanal compara a nossa lista comunitária com o projeto open source [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt) e abre um pull request com as mudanças, que são revisadas antes de entrar no ar. O parser é testado com todos os casos de teste do parser open source de robots.txt do Google e com 46 arquivos robots.txt reais, cujos resultados comparamos com os do parser compilado do Google. O código e os dados são abertos: veja [Licenças](page:licenses).

## Por que o nosso próprio robots.txt permite todos os bots de IA

O nosso [robots.txt](/robots.txt) nomeia GPTBot, ClaudeBot, PerplexityBot, Google-Extended e todos os outros agentes do registro — e permite todos eles. Pode parecer estranho para um site que ajuda as pessoas a bloquear crawlers de IA, mas segue o mesmo princípio: **decidir por finalidade**. Este site existe para responder perguntas; queremos que assistentes de IA o leiam, o citem e mandem pessoas para cá, e não temos objeção a que as nossas explicações acabem nos dados de treinamento de um modelo, se isso deixar as respostas melhores. Quem publica jornalismo pago ou arte original vai, com razão, decidir de outro jeito. A ferramenta foi feita para tornar qualquer uma das duas decisões fácil e correta.

Também publicamos [/llms.txt](/llms.txt), [/llms-full.txt](/llms-full.txt), uma versão em Markdown de cada página (acrescente `.md` ao endereço) e o registro completo em [/bots.json](/bots.json).

## Contato

Correções no registro, relatos de bugs e perguntas: **{{contact}}**. Se você opera um crawler e a nossa entrada sobre ele está errada ou desatualizada, mande um link para a sua documentação — atualizamos as entradas em poucos dias.

## Dados

- No ar desde: 4 de novembro de 2026
- Idiomas: English, Deutsch, Français, Español, Italiano, Nederlands, Polski, Português (Brasil), 日本語
- Publicidade: nenhuma no momento; se forem adicionados anúncios, eles nunca vão aparecer dentro das ferramentas.
