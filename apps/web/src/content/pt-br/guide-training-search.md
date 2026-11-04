---
title: "Bloqueie o treinamento de IA sem sumir das buscas com IA"
description: "Bloqueie GPTBot, ClaudeBot, Google-Extended e outros crawlers de treinamento e continue visível no ChatGPT, Claude, Perplexity e AI Overviews."
h1: "Como bloquear o treinamento de IA e continuar visível nas buscas com IA"
nav: "Bloquear treinamento, manter busca com IA"
lead: "A maioria das empresas de IA hoje opera agentes separados para treinamento, para busca e para pedidos de usuários. Bloqueie os crawlers e tokens de treinamento, permita os agentes de busca, e as suas páginas continuam citáveis nas respostas de IA sem alimentar o próximo modelo."
related: ["home", "bots", "tester", "server-rules", "content-signals"]
updated: "2026-11-04"
faq:
  - q: "Se eu bloquear o GPTBot, meu site some do ChatGPT?"
    a: "Não. As respostas de busca do ChatGPT vêm do índice do OAI-SearchBot, que é separado. Bloqueie o GPTBot e permita o OAI-SearchBot para continuar citável."
  - q: "Preciso bloquear o Googlebot para manter meu conteúdo fora do Gemini?"
    a: "Não — e nem deveria, porque isso tira você da Busca do Google. Bloqueie o `Google-Extended` para sair do treinamento e do grounding do Gemini. Os AI Overviews fazem parte da Busca e são controlados com tags de snippet como `nosnippet`, não com o Google-Extended."
  - q: "Bloquear crawlers de treinamento remove meu conteúdo de modelos que já foram treinados?"
    a: "Não. Uma regra no robots.txt só afeta o rastreamento futuro. Algumas empresas oferecem processos separados de remoção ou de opt-out para dados já coletados; consulte a documentação delas."
  - q: "E o Common Crawl?"
    a: "O arquivo do CCBot é usado por muitos desenvolvedores de IA, então bloqueá-lo faz parte de um opt-out de treinamento. Isso também remove as suas páginas de futuros snapshots do Common Crawl usados em pesquisa."
---

## Os três tipos de agentes de IA

Desde 2024, as grandes empresas de IA separaram seus crawlers por finalidade, em grande parte para que os sites possam fazer exatamente essa escolha:

| Empresa | Treinamento | Busca com IA (indexar e citar) | Pedido do usuário (acesso ao vivo) |
|---|---|---|---|
| OpenAI | `GPTBot` | `OAI-SearchBot` | `ChatGPT-User` |
| Anthropic | `ClaudeBot` | `Claude-SearchBot` | `Claude-User` |
| Perplexity | — (diz que não treina com conteúdo rastreado) | `PerplexityBot` | `Perplexity-User` |
| Google | `Google-Extended` (token) | Googlebot (Busca, AI Overviews) | `Google-Agent`, `Google-GeminiNotebook` |
| Apple | `Applebot-Extended` (token) | Applebot | — |
| Meta | `meta-externalagent` | `meta-webindexer` | `meta-externalfetcher` |
| Mistral | `MistralAI-Training` | `MistralAI-Index` | `MistralAI-User` |
| Amazon | `Amazonbot` (também outros usos) | `Amzn-SearchBot` | `Amzn-User` |

**Crawlers e tokens de treinamento** decidem se as suas páginas podem acabar nos dados de treinamento de um modelo. **Agentes de busca** decidem se um produto de IA consegue encontrar e citar você — é daí que vem o tráfego de referência das IAs. **Agentes de usuário** abrem uma página porque uma pessoa pediu; vários operadores dizem que o robots.txt pode não se aplicar a eles.

## O robots.txt

O primeiro objetivo do [gerador](page:home) produz esta política para cada agente documentado. O núcleo dela é assim:

```
# AI training crawlers — blocked
User-agent: GPTBot
User-agent: ClaudeBot
User-agent: CCBot
User-agent: meta-externalagent
User-agent: MistralAI-Training
User-agent: Bytespider
Disallow: /

# AI usage controls (robots.txt tokens, not crawlers) — blocked
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: __usage_ai-training
Disallow: /

# Everyone else, including OAI-SearchBot, Claude-SearchBot, PerplexityBot
User-agent: *
Disallow: /admin/
```

Nada nomeia os agentes de busca: eles não têm grupo próprio, então seguem o `User-agent: *`, como o Google e o Bing. Isso é proposital. Se você der a um agente de busca um grupo próprio — por exemplo, para fechar `/premium/` para ele —, ele deixa de ler o grupo `*` por completo, então você precisa repetir cada regra `*` no grupo dele. O gerador faz isso por você quando você adiciona uma exceção de caminho só para IA.

## Crawlers de finalidade mista

Alguns agentes atendem a várias finalidades com um só nome. O `Amazonbot` melhora os produtos da Amazon e pode ser usado para treinamento; o `meta-externalagent` treina modelos e também indexa conteúdo; o arquivo do `CCBot` alimenta pesquisas e também o treinamento de IA. Nesta predefinição, o gerador os trata como crawlers de treinamento, o que mantém a política rigorosa, e mostra quais agentes caem nesse grupo para que você possa mudar alguns individualmente para *permitir* no modo personalizado.

Crawlers gerais são outro caso: `Googlebot`, `Bingbot` e `Applebot` alimentam mecanismos de busca e, por meio deles, recursos de IA como os AI Overviews e o Copilot. Nunca os bloqueie para impedir o treinamento de IA — use `Google-Extended`, `Applebot-Extended` e, para o Bing, as tags `noarchive`/`nocache` ou o grupo `__usage_ai-training`, que o Bing passa a suportar em 2027.

## Confira o resultado

1. Cole o arquivo no [verificador](page:tester) e olhe a tabela de crawlers: agentes de treinamento **Bloqueado**, agentes de busca **Permitido**.
2. Teste algumas URLs importantes para `OAI-SearchBot` e `PerplexityBot`.
3. Se você usa a Cloudflare, confira também as configurações do AI Crawl Control: um bloqueio na CDN se sobrepõe a um allow no robots.txt.
4. Para agentes que ignoram o robots.txt, adicione [regras de servidor](page:server-rules).
