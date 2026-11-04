---
title: "Opt-out de IA: direitos autorais, AI Act e o PL 2338/2023"
description: "Robots.txt como opt-out de IA: AI Act da UE, art. 4º da Diretiva DSM e a situação no Brasil (PL 2338/2023). Informação, não aconselhamento jurídico."
h1: "Bots de IA e direitos autorais: o que significa um opt-out"
nav: "IA e direitos autorais"
lead: "A lei da União Europeia permite minerar conteúdo publicamente disponível para qualquer finalidade, a menos que o titular dos direitos tenha reservado esse direito de forma legível por máquina. Desde agosto de 2025, os provedores de modelos de IA precisam mostrar que respeitam essas reservas — e o Código de Práticas cita o robots.txt."
related: ["tdmrep", "content-signals", "home", "guide-training-search"]
updated: "2026-11-04"
faq:
  - q: "Um Disallow no robots.txt é uma reserva juridicamente válida?"
    a: "O Código de Práticas trata o robots.txt, conforme a RFC 9309, como um protocolo que os signatários devem seguir, e tribunais já analisaram reservas legíveis por máquina, mas o efeito jurídico depende da legislação nacional e dos fatos de cada caso. Isto é informação, não aconselhamento jurídico."
  - q: "O AI Act se aplica a empresas de IA de fora da UE?"
    a: "As obrigações valem para provedores que colocam modelos de IA de uso geral no mercado da UE, onde quer que estejam estabelecidos. A política de direitos autorais deve abranger as reservas dos titulares de direitos da UE."
  - q: "O que devo publicar?"
    a: "Um robots.txt que bloqueie os crawlers de treinamento de IA que você não quer, opcionalmente um arquivo TDMRep e uma declaração nos seus termos de uso. Guarde cópias datadas do seu robots.txt para poder mostrar desde quando a reserva estava em vigor."
  - q: "O Brasil já tem uma regra de opt-out para o treinamento de IA?"
    a: "Ainda não. Não há no Brasil uma regra de opt-out para mineração de textos e dados em vigor. O PL 2338/2023, aprovado pelo Senado em dezembro de 2024, prevê que titulares possam proibir o uso de suas obras no desenvolvimento de IA e prevê remuneração, mas segue em tramitação na Câmara dos Deputados (situação em outubro de 2026). Isto é informação, não aconselhamento jurídico."
---

*Esta página é informação, não aconselhamento jurídico.*

## A situação no Brasil

O Brasil não faz parte da UE e, hoje, não tem uma regra de opt-out para mineração de textos e dados em vigor: a Lei de Direitos Autorais (Lei 9.610/1998) não prevê esse mecanismo. O marco legal da IA, o **PL 2338/2023**, foi aprovado pelo Senado em 10 de dezembro de 2024 e segue **em tramitação** na Câmara dos Deputados, onde aguarda o parecer do relator na Comissão Especial (situação em outubro de 2026). O texto aprovado pelo Senado permite que titulares de direitos proíbam o uso de suas obras no desenvolvimento de sistemas de IA — com exceções para instituições de pesquisa, jornalismo, museus e arquivos — e prevê remuneração quando obras são usadas para treinar IA comercial.

As regras da UE explicadas abaixo continuam relevantes se o seu site tem usuários na União Europeia.

## Duas leis, um mecanismo

**A Diretiva DSM (UE) 2019/790, artigo 4º**, permite a mineração de textos e dados de obras acessíveis de forma lícita — a base jurídica de grande parte do treinamento de IA na UE —, a menos que o titular dos direitos tenha **reservado expressamente** esse uso. Para conteúdo disponibilizado publicamente on-line, a reserva deve ser feita “de forma adequada, por exemplo, por meios legíveis por máquina”. Todos os Estados-membros incorporaram essa regra às suas leis de direitos autorais.

**O AI Act, artigo 53(1)(c)**, exige que os provedores de modelos de IA de uso geral adotem uma política para cumprir a legislação de direitos autorais da UE e, em especial, para identificar e respeitar as reservas de direitos previstas no artigo 4(3) da Diretiva DSM, “inclusive por meio de tecnologias de última geração”. As obrigações valem desde **2 de agosto de 2025**; o AI Office pode aplicá-las com multas a partir de **2 de agosto de 2026**.

## O que diz o Código de Práticas

O Código de Práticas para IA de uso geral (General-Purpose AI Code of Practice, capítulo de direitos autorais, julho de 2025) é a forma como a maioria dos grandes provedores demonstra conformidade. Os signatários se comprometem, entre outras coisas, a:

1. usar crawlers que **leiam e sigam o robots.txt conforme especificado na RFC 9309** e em versões posteriores do padrão;
2. identificar e respeitar **outros protocolos adequados e legíveis por máquina** para a reserva de direitos — adotados por organismos de normalização ou amplamente usados pelos titulares de direitos;
3. publicar informações sobre seus crawlers e sobre os recursos de robots.txt que eles suportam.

A Comissão Europeia abriu uma consulta sobre quais outros protocolos contam; até o momento desta redação, nenhuma lista oficial havia sido publicada.

## O que isso significa na prática

- Um `Disallow` para o crawler de treinamento de um provedor (por exemplo `GPTBot`, `ClaudeBot`, `MistralAI-Training`, `CCBot`) é a reserva legível por máquina mais amplamente reconhecida.
- Um token como `Google-Extended` ou `Applebot-Extended` expressa a reserva sem tirar você da busca.
- **O robots.txt reserva direitos apenas contra os crawlers que você nomeia.** Um crawler de treinamento que você não conhece não fica coberto. Grupos compartilhados como `__usage_ai-training` e linhas baseadas no uso como `Content-Usage: train-ai=n` buscam fechar essa lacuna; o [TDMRep](page:tdmrep) é um protocolo criado especificamente para reservas do artigo 4º.
- Declarações em linguagem natural nos termos de uso podem não bastar para conteúdo publicado on-line; os tribunais têm verificado se havia uma reserva em forma legível por máquina.

## Uma configuração defensável

1. robots.txt com os seus crawlers de treinamento bloqueados — use o [gerador](page:home).
2. Opcionalmente, um `tdmrep.json` e uma linha `Content-Usage`.
3. Uma frase nos seus termos de uso reservando a mineração de textos e dados nos termos do artigo 4(3) da Diretiva DSM.
4. Um histórico do seu robots.txt com datas (por exemplo, uma cópia em controle de versão).
