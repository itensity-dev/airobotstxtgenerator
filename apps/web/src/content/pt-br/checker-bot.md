---
title: "AIRobotsTxtChecker: o bot do nosso verificador de robots.txt"
description: "O AIRobotsTxtChecker é o User-Agent do nosso verificador de robots.txt: o que ele busca (só /robots.txt), com que frequência, de onde e como bloqueá-lo."
h1: "Nosso bot verificador: AIRobotsTxtChecker"
nav: "Bot verificador"
lead: "Quando alguém usa a verificação ao vivo do nosso verificador de robots.txt, nosso servidor busca o /robots.txt daquele site uma única vez, com este User-Agent. Ele nunca busca mais nada."
related: ["tester", "privacy", "about"]
updated: "2026-11-04"
---

## User-Agent

```
Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)
```

## O que ele faz

- Busca **apenas** o `/robots.txt` do host que um usuário digitou — nunca páginas, imagens ou sitemaps.
- Uma requisição por verificação; os resultados ficam em cache por 10 minutos, então verificações repetidas do mesmo host nesse intervalo não geram uma nova requisição.
- Segue no máximo 5 redirecionamentos, espera no máximo 5 segundos e lê no máximo 512 KiB.
- Conecta-se apenas a endereços IP públicos, nas portas 80 e 443.
- Não é um crawler: não segue links, não guarda o seu arquivo além do cache e não o usa para nenhuma outra finalidade.

## Ele segue o robots.txt?

Ele lê o robots.txt; não rastreia nada que o robots.txt possa controlar. Assim como o sistema do Google que busca o robots.txt, ele não aplica o seu robots.txt ao próprio arquivo robots.txt.

## Como bloqueá-lo

Se você não quer que o seu robots.txt seja verificado pelo nosso site, retorne `403` para o User-Agent `AIRobotsTxtChecker`, por exemplo no nginx:

```nginx
if ($http_user_agent ~* "AIRobotsTxtChecker") { return 403; }
```

Dúvidas ou denúncias de abuso: {{contact}}.
