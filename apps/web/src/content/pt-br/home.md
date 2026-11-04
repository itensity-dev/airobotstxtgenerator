---
title: "Gerador de robots.txt para IA: bloqueie GPTBot e outros bots"
description: "Gerador de robots.txt para IA grátis: bloqueie o treinamento (GPTBot, ClaudeBot, Google-Extended, CCBot) e siga nas buscas com IA. Validado pela RFC 9309."
h1: "Gerador de robots.txt para IA"
nav: "Gerador de robots.txt"
lead: "Escolha o tipo de site e o objetivo; o gerador escreve um robots.txt para {{all}} crawlers e tokens de IA documentados, explica cada linha e confere o resultado com um parser da RFC 9309 antes de você copiar."
steps:
  - "Escolha o **tipo de site** — ele define caminhos iniciais sensatos (uma loja fecha `/cart/` e `/checkout/` para todos os crawlers, um site de notícias fecha `/premium/` para os bots de IA)."
  - "Escolha o **objetivo**: sem treinamento de IA, mas visível nas buscas com IA; nenhuma IA; permitir tudo; ou decidir bot a bot."
  - "Adicione **exceções de caminho**, por exemplo para liberar `/blog/` para todos os bots de IA ou fechar `/members/` para todos eles."
  - "Copie ou baixe o arquivo e envie-o como `robots.txt` para a raiz de cada host (`https://example.com/robots.txt`). Já tem um arquivo? Use **Adicionar ao meu robots.txt** — ele acrescenta a seção de IA e comprova que as suas regras atuais continuam funcionando do mesmo jeito."
  - "Teste o arquivo publicado com o [verificador de robots.txt](page:tester) e, para crawlers que ignoram o robots.txt, adicione [regras de servidor](page:server-rules)."
capabilities:
  - feature: "Lista de crawlers de IA"
    status: "yes"
    note: "{{all}} agentes e tokens com a documentação do próprio operador e a data da última verificação; mais {{community}} da lista comunitária do ai.robots.txt, se você quiser."
  - feature: "Predefinições por finalidade"
    status: "yes"
    note: "Treinamento, busca com IA, acessos a pedido do usuário e tokens exclusivos do robots.txt são tratados separadamente."
  - feature: "Autoverificação"
    status: "yes"
    note: "Cada arquivo é analisado com as mesmas regras do parser open source do Google; cada agente é testado em `/`, nos seus caminhos de exceção e nos seus caminhos fechados."
  - feature: "Mesclar com um arquivo existente"
    status: "yes"
    note: "Acrescenta uma seção de IA, mostra um diff e compara as decisões antigas e novas para cada agente que já está no seu arquivo."
  - feature: "Linhas Content-Signal"
    status: "partly"
    note: "`Content-Signal` opcional para o grupo `*`. É uma proposta da Cloudflare, não um padrão."
  - feature: "Barrar bots que ignoram o robots.txt"
    status: "no"
    note: "O robots.txt é um pedido. Para impor o bloqueio, use [regras de servidor](page:server-rules) ou um WAF."
  - feature: "Cadastro, upload, rastreamento do que você digita"
    status: "no"
    note: "A geração roda no seu navegador e funciona off-line; seus caminhos e arquivos não são enviados a lugar nenhum."
faq:
  - q: "Como bloquear o treinamento de IA e continuar visível nas buscas do ChatGPT, do Claude e da Perplexity?"
    a: "Bloqueie os crawlers e tokens de treinamento — `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `meta-externalagent` e outros — e deixe permitidos os agentes de busca (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`). Esse é o primeiro objetivo do gerador. Detalhes no guia [Bloqueie o treinamento de IA sem sumir das buscas com IA](page:guide-training-search)."
  - q: "Bloquear o Google-Extended tira meu site da Busca do Google ou dos AI Overviews?"
    a: "Não. O `Google-Extended` é um token do robots.txt, não um crawler: ele controla se o Google pode usar o conteúdo para treinar e fundamentar (grounding) o Gemini. A Busca do Google, incluindo os AI Overviews e o Modo IA, usa o `Googlebot`."
  - q: "Por que o arquivo gerado repete algumas regras?"
    a: "Um crawler nomeado em um grupo próprio ignora completamente o grupo `User-agent: *`. Quando os bots de IA precisam de um grupo próprio (por exemplo, para fechar `/premium/` para eles), o gerador copia as suas regras de `*` para esse grupo, para que nada se perca."
  - q: "Todas as empresas de IA vão respeitar este arquivo?"
    a: "A maioria dos grandes operadores declara que seus crawlers seguem o robots.txt. Agentes que agem a pedido de um usuário (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`) podem não seguir, e alguns crawlers não publicam declaração nenhuma. O registro de bots mostra a declaração de cada operador, com link para a fonte."
  - q: "Onde fica o arquivo robots.txt?"
    a: "Na raiz de cada host e protocolo que você quer cobrir: `https://example.com/robots.txt` não vale para `https://shop.example.com/`. O arquivo precisa ser texto simples, em UTF-8 e, para o Google, menor que 500 KiB."
  - q: "O que eu digito fica armazenado?"
    a: "Não. O gerador roda inteiramente no seu navegador. Contamos apenas que um arquivo foi gerado e qual predefinição foi usada, sem seus caminhos nem seu texto."
related: ["tester", "bots", "server-rules", "guide-training-search", "llms-txt"]
updated: "2026-11-04"
---

## Como o gerador decide

Cada agente do registro tem uma **finalidade**, tirada da documentação do seu operador:

- **Treinamento de IA** — coleta páginas que podem ser usadas para treinar modelos (`GPTBot`, `ClaudeBot`, `CCBot`, `MistralAI-Training`).
- **Tokens do robots.txt** — nem são crawlers, mas nomes que controlam como o conteúdo obtido por um crawler geral pode ser usado (`Google-Extended`, `Applebot-Extended`, `__usage_ai-training`).
- **Busca com IA** — indexa páginas para que um produto de IA possa citá-las e linká-las (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`).
- **Acessos a pedido do usuário** — abrem uma página porque uma pessoa pediu a um assistente (`ChatGPT-User`, `Claude-User`, `Perplexity-User`).
- **Crawlers gerais** — `Googlebot`, `Bingbot`, `Applebot` e os geradores de prévia de links nunca são bloqueados por uma predefinição, porque bloqueá-los tira você da busca comum ou quebra as prévias de links.

O objetivo decide quais finalidades ficam fechadas. Em seguida, o gerador escreve um grupo por finalidade, para que o arquivo continue legível, e acrescenta as suas exceções de caminho a cada grupo.

## Por que o arquivo é verificado antes de você vê-lo

O robots.txt tem algumas regras que pegam muita gente de surpresa: a **regra correspondente mais longa vence**, em caso de **empate o Allow vence**, um crawler com **grupo próprio ignora o `User-agent: *`** e **linhas em branco não separam grupos**. Depois de montar o arquivo, o gerador o analisa com o mesmo algoritmo do parser open source do Google (testamos com os casos de teste do próprio Google e com 46 arquivos robots.txt reais) e pergunta, para cada agente e cada caminho relevante, se a resposta corresponde à política que você escolheu. O selo abaixo do arquivo mostra quantas verificações foram feitas.

## O que o robots.txt não consegue fazer

O robots.txt é um pedido público, definido na [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html). Crawlers bem-comportados o seguem; outros não, e qualquer pessoa pode enviar um User-Agent falso. Para impor o bloqueio, bloqueie no servidor ou na CDN — a página de [regras de servidor](page:server-rules) gera regras para nginx, Apache, Caddy e Cloudflare a partir do mesmo registro — e verifique os bots por IP ou DNS reverso.
