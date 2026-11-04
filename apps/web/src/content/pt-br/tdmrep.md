---
title: "Gerador de TDMRep: tdmrep.json e cabeçalho tdm-reservation"
description: "Gere arquivos TDMRep: /.well-known/tdmrep.json, cabeçalhos tdm-reservation e tdm-policy e meta tags para reservar a mineração de textos e dados (art. 4º DSM)."
h1: "Gerador de TDMRep"
nav: "TDMRep"
lead: "Crie os arquivos do TDM Reservation Protocol (TDMRep) — uma especificação de um Community Group do W3C para declarar, de forma legível por máquina, que você reserva os direitos de mineração de textos e dados previstos na legislação de direitos autorais da UE."
steps:
  - "Escolha `tdm-reservation: 1` para reservar os seus direitos ou `0` para declarar que não os reserva."
  - "Se quiser, adicione a URL de uma `tdm-policy`: um documento legível por máquina que explica como obter uma licença."
  - "Publique `/.well-known/tdmrep.json` na raiz do seu site e/ou adicione os cabeçalhos HTTP ou as meta tags HTML."
  - "Mantenha as regras do robots.txt para os crawlers que você quer barrar: o TDMRep reserva direitos, não bloqueia nada."
capabilities:
  - feature: "Arquivo para o site inteiro"
    status: "yes"
    note: "`/.well-known/tdmrep.json` com `location`, `tdm-reservation` e `tdm-policy`."
  - feature: "Cabeçalhos e meta tags por resposta"
    status: "yes"
    note: "`tdm-reservation` e `tdm-policy` como cabeçalhos HTTP (snippets para nginx e Apache) e como tags HTML `<meta>`."
  - feature: "Aconselhamento jurídico"
    status: "no"
    note: "A eficácia de uma reserva depende da legislação nacional e dos fatos. Esta página é informação, não aconselhamento jurídico."
faq:
  - q: "O que é TDMRep?"
    a: "O TDM Reservation Protocol, publicado por um Community Group do W3C (Final Report de 2024). Ele define como um titular de direitos pode declarar — em um arquivo, em um cabeçalho HTTP ou no HTML — que a mineração de textos e dados do seu conteúdo está reservada, como permite o artigo 4(3) da Diretiva DSM da UE (2019/790)."
  - q: "Preciso do TDMRep se já bloqueio crawlers de IA no robots.txt?"
    a: "O robots.txt diz quem pode buscar; o TDMRep diz o que pode ser feito com o conteúdo, independentemente de quem o buscou. O Código de Práticas de IA de uso geral da UE compromete os signatários a seguir o robots.txt e outros protocolos adequados e legíveis por máquina; publicar os dois é uma forma de garantia dupla."
  - q: "Quais empresas de IA leem o TDMRep?"
    a: "O suporte é limitado e raramente documentado. Editoras europeias e alguns provedores de dados o usam; a maioria dos grandes desenvolvedores de IA documenta apenas o robots.txt. Trate-o como uma declaração adicional e padronizada da sua reserva."
related: ["content-signals", "guide-eu-ai-act", "meta-tags", "home"]
updated: "2026-11-04"
---

## Onde o TDMRep se encaixa

A Diretiva DSM da UE permite a mineração de textos e dados de conteúdo acessível de forma lícita, a menos que o titular dos direitos a tenha **reservado expressamente** “de forma adequada, por exemplo, por meios legíveis por máquina”, no caso de conteúdo publicado on-line. O robots.txt é um desses meios; o TDMRep é outro, criado especificamente para essa finalidade. Um arquivo `tdmrep.json` pode cobrir o site inteiro ou partes dele (padrões de `location`), os cabeçalhos podem cobrir qualquer tipo de arquivo, inclusive PDFs e imagens, e as meta tags funcionam onde você controla só o HTML.
