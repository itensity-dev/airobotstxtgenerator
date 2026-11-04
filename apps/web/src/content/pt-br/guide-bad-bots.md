---
title: "Por que o robots.txt não protege contra bots maliciosos"
description: "O robots.txt é um pedido público, não controle de acesso: quem o ignora, por que User-Agents são falsificados e o que usar: regras de servidor, IP e WAF."
h1: "Por que o robots.txt não protege contra bots maliciosos"
nav: "robots.txt x bots maliciosos"
lead: "O robots.txt é uma placa na porta, não uma fechadura. Ele funciona porque crawlers responsáveis escolhem lê-lo; scrapers que não se importam, ou que se passam por outros, não são barrados por ele."
related: ["server-rules", "tester", "bots", "guide-syntax"]
updated: "2026-11-04"
faq:
  - q: "O robots.txt pode tornar uma página privada?"
    a: "Não. Qualquer pessoa pode abrir uma URL bloqueada, e listá-la no robots.txt só a divulga. Proteja conteúdo privado com autenticação."
  - q: "Como saber se um bot ignora o meu robots.txt?"
    a: "Procure nos logs do servidor requisições a caminhos bloqueados com o User-Agent desse bot e verifique o IP: uma requisição de fora das faixas publicadas pelo operador não vem do bot verdadeiro."
  - q: "Devo simplesmente bloquear tudo o que parece bot?"
    a: "Não — você perderia mecanismos de busca, prévias de links, monitores de uptime e ferramentas de acessibilidade. Bloqueie pelo nome onde puder, verifique onde os operadores permitirem e limite a taxa de requisições do resto."
---

## O que é o robots.txt

A RFC 9309 diz isso com todas as letras: as regras “não são uma forma de autorização de acesso”. Um crawler busca o `/robots.txt`, lê o grupo que o nomeia e decide obedecer. Nada no HTTP impõe essa decisão.

## Quem o ignora

- **Scrapers e coletores de dados** que nunca pediram permissão. Muitos usam User-Agents comuns de navegador.
- **Agentes que agem em nome de um usuário.** OpenAI, Perplexity, Google e Meta dizem que seus agentes acionados pelo usuário (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`, `meta-externalfetcher`) podem não seguir o robots.txt, porque uma pessoa pediu a página. A Anthropic diz que o `Claude-User` segue.
- **Crawlers que não publicam política** — o `Bytespider`, por exemplo, não tem documentação oficial, e donos de sites relatam que ele ignora o robots.txt.
- **Impostores.** Qualquer pessoa pode enviar `User-Agent: GPTBot` ou `Googlebot`. User-Agents falsos de mecanismos de busca são um jeito clássico de driblar bloqueios ingênuos.

## O que o robots.txt revela

O arquivo é público. Uma linha `Disallow: /admin-backup-2024/` conta a todo mundo que esse caminho existe. Não liste segredos; proteja-os.

## O que usar no lugar — ou em conjunto

| Medida | Barra | Observações |
|---|---|---|
| robots.txt | Crawlers que o seguem | O sinal padrão e documentado. Mantenha. |
| [Regras de servidor](page:server-rules) por User-Agent | Bots que se identificam | Barato e eficaz contra crawlers de IA nomeados |
| Verificação por IP / DNS reverso | Impostores que se passam por um bot conhecido | Use as faixas publicadas pelo operador; veja cada [página de bot](page:bots) |
| Limite de taxa (rate limiting) | Scrapers de alto volume, com qualquer nome | Por IP ou por rede; protege o servidor |
| Gerenciamento de bots na CDN / WAF | Redes maliciosas conhecidas, automação de navegador | Cloudflare, Fastly, Akamai e outros classificam bots |
| Autenticação | Todos que não têm conta | A única proteção real para conteúdo privado |

## Uma ordem sensata

1. Publique um robots.txt honesto — ele documenta a sua escolha e é a ele que o Código de Práticas da UE se refere.
2. Bloqueie pelo nome, no servidor ou na CDN, os agentes de IA que você não quer.
3. Verifique os bots que você permite, para que impostores que usam os nomes deles sejam recusados.
4. Limite a taxa de requisições de todo o resto e acompanhe os seus logs.
