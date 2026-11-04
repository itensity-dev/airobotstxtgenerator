---
title: "Verificador de robots.txt grátis: teste regras e bots de IA"
description: "Verificador e validador de robots.txt grátis: busque o arquivo de qualquer site ou cole o seu, veja quais crawlers de IA são permitidos e teste URLs."
h1: "Verificador e validador de robots.txt"
nav: "Verificador de robots.txt"
lead: "Busque o robots.txt de qualquer site ou cole um arquivo, teste uma URL para qualquer crawler, veja quais dos {{agents}} agentes de IA podem rastrear o site e receba uma lista de erros — com a linha exata que decide cada resposta."
steps:
  - "Digite um domínio ou qualquer URL do site (só o host é usado) e clique em **Buscar robots.txt** — ou mude para **Colar robots.txt** para testar um rascunho sem publicá-lo."
  - "Leia a linha de status: o Google trata uma resposta **4xx** como “sem robots.txt” e uma resposta **5xx** como “não rastrear nada por enquanto”; redirecionamentos, tamanho e tipo de conteúdo também são verificados."
  - "Digite um caminho ou uma URL completa e escolha um crawler: o resultado aponta a **linha decisiva** e o grupo aplicado, e destaca os dois no arquivo."
  - "Confira a tabela de crawlers de IA: página inicial e o seu caminho, cada um como **Permitido**, **Bloqueado** ou **Parcial**, e se o crawler tem grupo próprio."
  - "Corrija o que o **relatório de lint** apontar e teste de novo. Precisa de um arquivo novo? Abra o [gerador](page:home)."
capabilities:
  - feature: "Mesmas respostas do parser do Google"
    status: "yes"
    note: "Reproduz todos os casos de teste do parser open source de robots.txt do Google e chega aos mesmos veredictos que ele em 46 arquivos robots.txt reais de grandes sites."
  - feature: "Busca ao vivo de qualquer site"
    status: "yes"
    note: "Pelo nosso verificador: só hosts http/https públicos, portas padrão, até 5 redirecionamentos, 5 segundos, 512 KiB. Os resultados ficam em cache por 10 minutos."
  - feature: "Colar e testar off-line"
    status: "yes"
    note: "O texto colado é analisado no seu navegador e nunca é enviado."
  - feature: "Lint"
    status: "yes"
    note: "Mais de 35 verificações: sintaxe, erros de digitação tolerados pelo Google, grupos que descartam regras `*` sem aviso, armadilhas das linhas em branco, URLs completas em regras, limite de 500 KiB, sintaxe de Content-Signal e Content-Usage, blocos gerenciados pela Cloudflare."
  - feature: "Páginas atrás de login ou de firewall"
    status: "no"
    note: "Buscamos apenas o `/robots.txt` na internet pública, como um crawler faria. Um WAF ou uma CDN ainda pode bloquear crawlers que o robots.txt permite — confira as configurações da sua CDN."
  - feature: "Meta tags robots e X-Robots-Tag"
    status: "no"
    note: "Regras por página não são verificadas aqui; veja [meta tags de IA](page:meta-tags)."
faq:
  - q: "Onde foi parar o testador de robots.txt do Google?"
    a: "O Google desativou o testador de robots.txt do Search Console no fim de 2023 e o substituiu por um relatório de robots.txt que mostra o arquivo buscado e os erros, mas não permite testar uma URL para um user-agent. Esta página preenche essa lacuna e usa as mesmas regras de correspondência do parser open source do Google."
  - q: "Por que uma URL é permitida mesmo com o `User-agent: *` bloqueando?"
    a: "Porque o crawler que você escolheu tem grupo próprio. Um crawler obedece só ao grupo mais específico que o nomeia, então as regras sob `User-agent: *` deixam de valer para ele. O relatório de lint aponta cada agente para o qual isso descarta uma regra `*`."
  - q: "O que acontece se o robots.txt retornar 404, 403 ou 500?"
    a: "O Google trata respostas 4xx (exceto 429) como se não houvesse robots.txt — tudo pode ser rastreado. 5xx e 429 significam “não rastrear por enquanto”; o Google tenta de novo e, após cerca de 30 dias, pode usar uma cópia em cache ou tratar o site como sem restrições."
  - q: "A ordem das linhas Allow e Disallow importa?"
    a: "Não. O padrão correspondente mais longo vence, independentemente da ordem; se um padrão Allow e um Disallow tiverem o mesmo tamanho, o Allow vence. `*` corresponde a quaisquer caracteres e `$` marca o fim da URL."
  - q: "Meu robots.txt ou o domínio que eu verifico fica armazenado?"
    a: "O texto colado nunca sai do seu navegador. Nas verificações ao vivo, nosso servidor busca o arquivo e o mantém na memória por até 10 minutos, para que verificações repetidas sejam rápidas; os domínios não são gravados em logs nem em ferramentas de analytics."
  - q: "Qual user-agent o verificador envia?"
    a: "`Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)`. Ele busca apenas o `/robots.txt`, uma vez por verificação. Veja [nosso bot verificador](page:checker-bot)."
related: ["home", "bots", "server-rules", "guide-syntax", "guide-bad-bots"]
updated: "2026-11-04"
---

## Como um crawler lê o robots.txt

O verificador aplica as regras da [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) exatamente como o parser open source do Google:

1. **Encontrar o grupo.** Um grupo é uma ou mais linhas `User-agent` seguidas de regras. O crawler usa todos os grupos que citam o seu token de produto (sem diferenciar maiúsculas de minúsculas e ignorando números de versão) e os mescla. Só se nenhum grupo o citar ele usa o `User-agent: *`. Linhas em branco não encerram um grupo.
2. **Encontrar as regras correspondentes.** Cada padrão `Allow` e `Disallow` é comparado com o caminho e a query string da URL. Os padrões correspondem a partir do início do caminho; `*` representa quaisquer caracteres e um `$` no final, o fim da URL. A correspondência diferencia maiúsculas de minúsculas.
3. **Escolher a correspondência mais longa.** Vence a regra com o padrão mais longo. Se um `Allow` e um `Disallow` tiverem o mesmo tamanho, o `Allow` vence. Se nenhuma regra corresponder, a URL é permitida.

O Google também tolera erros comuns — `Dissallow`, `User agent`, a falta dos dois-pontos — e ignora tudo o que vem depois de 500 KiB. O verificador reproduz esse comportamento e aponta cada caso, para que outros crawlers, que podem ser mais rígidos, leiam o seu arquivo da mesma forma.

## Como funcionam as verificações ao vivo

Nosso servidor requisita `https://seu-host/robots.txt` (recorrendo a `http://` se não conseguir conectar via HTTPS), segue até cinco redirecionamentos, para após 5 segundos ou 512 KiB e devolve os bytes brutos, para que marcas de ordem de bytes e codificações possam ser inspecionadas. Antes de cada conexão, ele mesmo resolve o nome do host e recusa endereços privados, locais e reservados. Todo o resto — análise, correspondência, lint — acontece no seu navegador.
