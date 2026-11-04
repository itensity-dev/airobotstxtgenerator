---
title: "Gerador de Content-Signal e Content-Usage para robots.txt"
description: "Gere linhas Content-Signal (Cloudflare) e Content-Usage (rascunho aipref da IETF) para robots.txt e cabeçalhos HTTP, com uma nota honesta sobre o suporte real."
h1: "Gerador de Content-Signal e Content-Usage"
nav: "Sinais de conteúdo"
lead: "Declare como o seu conteúdo pode ser usado depois de buscado — para busca, como insumo para respostas de IA ou para treinamento — nas duas sintaxes propostas até agora: o `Content-Signal` da Cloudflare e o `Content-Usage` do rascunho aipref da IETF."
steps:
  - "Escolha uma preferência para cada uso: `search`, `ai-input` (respostas geradas a partir das suas páginas) e `ai-train`. Deixe um uso sem definir para não expressar preferência."
  - "Copie o bloco do robots.txt. As linhas Content-Signal ficam dentro de um grupo `User-agent` — geralmente `User-agent: *`."
  - "Se quiser, copie também a linha `Content-Usage` ou o cabeçalho HTTP do rascunho da IETF."
  - "Lembre-se de que essas linhas expressam preferências; bloqueie crawlers com regras `Disallow` se precisar mantê-los afastados."
capabilities:
  - feature: "Sintaxe Content Signals da Cloudflare"
    status: "yes"
    note: "`Content-Signal: search=yes, ai-input=yes, ai-train=no`, dentro de um grupo, com o comentário explicativo que a Cloudflare recomenda."
  - feature: "Sintaxe aipref da IETF"
    status: "yes"
    note: "`Content-Usage: train-ai=n` (regra do robots.txt com caminho opcional) e o cabeçalho HTTP `Content-Usage`, conforme o draft-ietf-aipref-attach."
  - feature: "Efeito garantido"
    status: "no"
    note: "Nenhuma das duas sintaxes é um padrão. O Google disse que o Content-Signal não tem efeito sobre os seus crawlers; OpenAI, Anthropic e Perplexity não o mencionam na documentação."
faq:
  - q: "O que é Content-Signal?"
    a: "Uma extensão do robots.txt publicada pela Cloudflare em setembro de 2025 como Content Signals Policy. Ela nomeia três usos — `search`, `ai-input` e `ai-train` —, cada um definido como `yes` ou `no`. A Cloudflare adiciona `search=yes, ai-train=no` ao robots.txt gerenciado de milhões de domínios."
  - q: "O que é Content-Usage?"
    a: "A sintaxe desenvolvida pelo grupo de trabalho AI Preferences (aipref) da IETF: um vocabulário com as categorias `train-ai`, `ai-use` e `search`, com valores `y` ou `n`, anexado por meio de uma regra do robots.txt ou de um cabeçalho HTTP. Os rascunhos ainda estão em andamento; ainda não há RFC."
  - q: "Devo usar os dois?"
    a: "Eles não entram em conflito, e nenhum dos dois é amplamente respeitado ainda. Se você usa a Cloudflare, o Content-Signal já está no seu robots.txt gerenciado. Adicionar o Content-Usage custa uma linha e segue o caminho com mais chance de virar padrão."
  - q: "E o `__usage_ai-training`?"
    a: "É uma proposta separada, de outubro de 2026: um grupo do robots.txt (`User-agent: __usage_ai-training` com `Disallow: /`) que várias empresas de IA disseram que vão tratar como opt-out de treinamento. Diferentemente do Content-Signal, ele usa regras Allow e Disallow comuns. Veja a [entrada no registro](bot:usage-ai-training)."
related: ["home", "tdmrep", "meta-tags", "guide-eu-ai-act", "bots"]
updated: "2026-11-04"
---

## Três gerações de preferências de IA no robots.txt

1. **Nomes de crawlers** (2023–): bloquear `GPTBot`, `ClaudeBot`, `Google-Extended`… uma empresa de cada vez. Confiável com quem segue o robots.txt, mas você precisa conhecer todos os nomes.
2. **Sinais baseados no uso** (2025–): `Content-Signal` e `Content-Usage` descrevem usos em vez de crawlers. Eles ficam dentro de um grupo e dizem o que pode acontecer com o conteúdo buscado de qualquer forma — por exemplo, por um crawler de busca geral.
3. **Grupo de opt-out compartilhado** (2026–): o `__usage_ai-training` é endereçado como um crawler, mas várias empresas o entendem ao mesmo tempo.

Até que uma dessas opções vire padrão, o arquivo mais seguro usa as três: nomes de fornecedores para os crawlers que você conhece, um grupo compartilhado para as empresas que o suportam e uma linha baseada no uso para o resto. O [gerador](page:home) faz as duas primeiras; esta página acrescenta a terceira.
