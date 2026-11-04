---
title: "Bloquear bots de IA com uma regra do WAF da Cloudflare"
description: "Regra personalizada do WAF da Cloudflare para bloquear GPTBot, ClaudeBot, Bytespider e outros crawlers de IA pelo User-Agent, sem bloquear o robots.txt."
h1: "Bloquear bots de IA com uma regra do WAF da Cloudflare"
nav: "Cloudflare WAF"
lead: "Uma expressão de regra personalizada para o WAF da Cloudflare que bloqueia pelo User-Agent os crawlers de IA que você escolher, mantém o `/robots.txt` acessível e cabe no limite de 4.096 caracteres da Cloudflare."
steps:
  - "Selecione os agentes e copie a expressão."
  - "No painel da Cloudflare, abra o seu domínio → **Security** → **WAF** → **Custom rules** → **Create rule** → **Edit expression** e cole a expressão."
  - "Defina a ação como **Block** (ou **Managed Challenge**, se preferir) e publique a regra."
  - "Depois de um dia, confira em **Security → Events** quais agentes foram bloqueados."
capabilities:
  - feature: "Plano gratuito"
    status: "yes"
    note: "Regras personalizadas com `contains` e `lower()` estão disponíveis em todos os planos; o operador de expressão regular `matches` exige um plano pago, por isso a ferramenta não o usa."
  - feature: "Verificação do tamanho da expressão"
    status: "yes"
    note: "A Cloudflare permite 4.096 caracteres por expressão; a ferramenta avisa quando o limite é ultrapassado e sugere dividir a regra."
  - feature: "Substitui o AI Crawl Control"
    status: "no"
    note: "O próprio AI Crawl Control da Cloudflare bloqueia crawlers de IA verificados por categoria e pode escrever um bloco gerenciado no seu robots.txt. Use esta regra para agentes que a Cloudflare não cobre ou quando quiser controle exato."
faq:
  - q: "A Cloudflare já bloqueia crawlers de IA — preciso desta regra?"
    a: "Talvez não. Desde julho de 2025, domínios novos bloqueiam crawlers de IA por padrão e, desde 2026, a Cloudflare oferece configurações separadas para Search, Agent e Training. A lista dela abrange bots verificados. Uma regra personalizada acrescenta agentes que estão fora dessa lista e bloqueia pelo nome, independentemente de verificação."
  - q: "Por que o robots.txt fica de fora?"
    a: "Para que os crawlers ainda possam ler a sua política. Um crawler que não consegue buscar o robots.txt não tem como saber que está bloqueado."
  - q: "A Cloudflare colocou linhas no meu robots.txt — o que são?"
    a: "É o robots.txt gerenciado da Cloudflare (Bot Preference Sync): um bloco entre comentários BEGIN e END, colocado antes das suas próprias regras, com linhas `Content-Signal` e `Disallow` para crawlers de IA. Cole o arquivo publicado no [verificador](page:tester) para ver como o arquivo combinado se comporta."
related: ["server-rules", "content-signals", "tester", "guide-bad-bots"]
updated: "2026-11-04"
---

## Sobre a expressão

Cada condição é `(lower(http.user_agent) contains "gptbot")`: o User-Agent é convertido para minúsculas e nele se procura o nome do bot, então maiúsculas e minúsculas não importam. As condições são unidas com `or`, e o grupo inteiro é combinado com `and not (http.request.uri.path eq "/robots.txt")`. Se você também usa os recursos de bots verificados da Cloudflare, pode acrescentar `and not cf.client.bot` para deixar os bots verificados a cargo das configurações da própria Cloudflare.
