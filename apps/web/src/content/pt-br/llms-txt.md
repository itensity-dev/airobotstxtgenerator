---
title: "Gerador de llms.txt grátis: crie seu arquivo llms.txt"
description: "Gerador de llms.txt grátis: crie um llms.txt no formato do llmstxt.org — H1, resumo, seções de links em Markdown — com validação. Roda no seu navegador."
h1: "Gerador de llms.txt"
nav: "Gerador de llms.txt"
lead: "Monte um arquivo `llms.txt` no formato proposto em llmstxt.org — um título, um resumo de um parágrafo e seções de links para as páginas mais úteis para modelos de linguagem — e confira a estrutura enquanto digita."
steps:
  - "Digite o nome do site ou do projeto; ele vira o único H1."
  - "Escreva um resumo curto — o que é o site e o que o arquivo lista. Ele vira o blockquote que os modelos leem primeiro."
  - "Adicione seções (`## Documentação`, `## Guias` …) com links: título, URL absoluta e uma descrição opcional de uma linha. Aponte para as versões em Markdown das páginas, quando houver."
  - "Marque as seções menos importantes como **opcionais**: leitores com pouco espaço de contexto podem pulá-las."
  - "Baixe o arquivo e envie-o para a raiz do site como `/llms.txt`. Se quiser, publique também um `/llms-full.txt` com o texto completo."
capabilities:
  - feature: "Estrutura do llmstxt.org"
    status: "yes"
    note: "H1, resumo em blockquote, observações opcionais, seções H2 com listas de links em Markdown e uma seção `Optional`."
  - feature: "Validação"
    status: "yes"
    note: "Verifica se há um único H1, seções H2 e destinos de link absolutos ou relativos à raiz."
  - feature: "Rastrear o seu site para preencher a lista"
    status: "no"
    note: "Você escolhe as páginas; nada é buscado."
  - feature: "Efeito em rankings ou respostas de IA"
    status: "no"
    note: "O llms.txt é uma proposta; nenhum grande mecanismo de busca ou empresa de IA disse que usa o arquivo para decisões de ranking ou de treinamento."
faq:
  - q: "O que é llms.txt?"
    a: "Um arquivo Markdown na raiz de um site, proposto por Jeremy Howard em setembro de 2024 em llmstxt.org, que dá aos modelos de linguagem um mapa curado do site: o que ele é e quais páginas ler. Não é um padrão nem um arquivo de controle de acesso."
  - q: "O llms.txt é a mesma coisa que o robots.txt?"
    a: "Não. O robots.txt diz aos crawlers o que eles podem buscar; o llms.txt sugere o que vale a pena ler. Uma página listada no llms.txt, mas bloqueada no robots.txt, continua bloqueada para os crawlers que seguem o robots.txt."
  - q: "As empresas de IA leem o llms.txt?"
    a: "Algumas ferramentas e assistentes de programação com IA o leem quando um usuário os direciona para um site; plataformas de documentação o geram automaticamente. Nenhuma grande empresa de IA se comprometeu a usá-lo para treinamento ou busca. Publicá-lo custa pouco."
  - q: "Devo apontar para páginas HTML ou Markdown?"
    a: "Markdown, sempre que possível — é o formato com que os modelos de linguagem lidam melhor. Este site publica uma versão `.md` de cada página e as lista no seu próprio [llms.txt](/llms.txt)."
related: ["home", "content-signals", "meta-tags", "guide-training-search"]
updated: "2026-11-04"
---

## O que um bom llms.txt contém

Seja breve e seletivo: as 10–40 páginas de que um modelo precisa para entender o seu produto ou conteúdo, cada uma com uma descrição de uma linha que diga o que o leitor vai encontrar. Coloque o material de referência primeiro, os exemplos depois, e histórico, changelogs ou páginas jurídicas em **Optional**. Se você tem uma documentação longa, publique também o `llms-full.txt` — a mesma estrutura com o texto completo das páginas — e mencione isso no resumo.

Este site segue os próprios conselhos: veja [/llms.txt](/llms.txt) e [/llms-full.txt](/llms-full.txt); além disso, cada página tem uma versão em Markdown no mesmo endereço, acrescido de `.md`.
