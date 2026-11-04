---
title: "Meta tag noai, X-Robots-Tag e IA: o que realmente funciona"
description: "Quais meta tags e cabeçalhos HTTP controlam o uso de uma página por IA? noai e noimageai não são padrão; nosnippet, noarchive e X-Robots-Tag variam por empresa."
h1: "Meta tags de IA e X-Robots-Tag: o que funciona"
nav: "Meta tags de IA"
lead: "Os controles de IA por página são uma colcha de retalhos: algumas tags são respeitadas por uma empresa, outras só por plataformas pequenas e algumas por ninguém. Esta página lista o que cada tag faz hoje, com fontes."
steps:
  - "Decida se você precisa mesmo de controle por página — regras por caminho no robots.txt cobrem a maioria dos casos."
  - "Use a tabela para escolher as tags que as empresas que importam para você de fato respeitam."
  - "Adicione-as como `<meta name=\"robots\" content=\"…\">` no HTML, ou como cabeçalho HTTP `X-Robots-Tag` para PDFs, imagens e outros arquivos."
  - "Teste uma página olhando o código-fonte e os cabeçalhos de resposta; o [verificador](page:tester) checa o robots.txt, não as meta tags."
capabilities:
  - feature: "Status honesto por tag"
    status: "yes"
    note: "Cada linha informa quem documenta suporte à tag."
  - feature: "Uma tag universal de “sem IA”"
    status: "no"
    note: "Não existe. A `noai` é muito copiada, mas não é documentada por Google, OpenAI, Anthropic, Microsoft nem Apple."
faq:
  - q: "`<meta name=\"robots\" content=\"noai\">` funciona?"
    a: "Só em plataformas que a adotaram, como algumas comunidades de arte. Ela não faz parte de nenhum padrão e as grandes empresas de IA não a documentam. Não faz mal, mas não substitui o robots.txt."
  - q: "Como manter uma página fora dos AI Overviews do Google?"
    a: "Os recursos de IA da Busca do Google seguem os controles normais de snippet: `nosnippet` (nenhum snippet), `max-snippet:0` ou `data-nosnippet` em elementos específicos limitam o que pode ser exibido. O Google-Extended no robots.txt não afeta os AI Overviews."
  - q: "Como limitar o uso da minha página pelo Copilot?"
    a: "O Bing documenta que `nocache` faz o Copilot mostrar só a URL, o título e o snippet, e que `noarchive` mantém a página fora das respostas e do treinamento do Copilot. O Bing também anunciou novas preferências de treinamento e de grounding de IA para 2027."
  - q: "O que o X-Robots-Tag acrescenta?"
    a: "As mesmas diretivas da meta tag robots, enviadas como cabeçalho HTTP — a única forma de controlar arquivos que não têm head HTML, como PDFs e imagens: `X-Robots-Tag: noarchive, nosnippet`."
related: ["content-signals", "tdmrep", "home", "guide-training-search"]
updated: "2026-11-04"
---

## Tags e cabeçalhos, um a um

| Tag ou cabeçalho | O que faz | Quem documenta suporte |
|---|---|---|
| `noai`, `noimageai` | Intenção: “não usar para IA” / “não usar imagens para IA” | Não documentadas por Google, OpenAI, Anthropic, Microsoft nem Apple; adotadas por algumas plataformas. Fora do padrão. |
| `nosnippet` | Nenhum snippet de texto ou prévia nos resultados; também exclui a página como fonte de snippets nos AI Overviews e no Modo IA | Google, Bing |
| `max-snippet:N` | Limita o tamanho do snippet; `0` equivale a `nosnippet` | Google, Bing |
| `data-nosnippet` (atributo HTML) | Exclui uma parte da página dos snippets e dos recursos de IA da Busca do Google | Google |
| `noarchive` | Sem cópia em cache. Bing: mantém a página fora das respostas e do treinamento do Copilot; Amazon: não usar para treinamento de modelos | Bing, Amazon |
| `nocache` | Bing: o Copilot só pode usar URL, título e snippet | Bing |
| `noindex` | Remove a página da busca por completo — e, portanto, dos recursos de busca com IA construídos sobre esse índice | Todos os grandes mecanismos de busca |
| `X-Robots-Tag: …` | Qualquer um dos itens acima como cabeçalho HTTP, para qualquer tipo de arquivo | Google, Bing |
| `tdm-reservation: 1` | Reserva os direitos de mineração de textos e dados (UE) — veja [TDMRep](page:tdmrep) | Quem adota o TDMRep |
| `Content-Usage: train-ai=n` | Preferência do rascunho aipref da IETF como cabeçalho HTTP — veja [sinais de conteúdo](page:content-signals) | Rascunho; não consolidado |

Exemplo para uma página que deve continuar na busca, mas fora das respostas e do treinamento do Copilot:

```html
<meta name="robots" content="noarchive">
<meta name="bingbot" content="nocache">
```

Exemplo de cabeçalho para uma pasta de PDFs no nginx:

```nginx
location /reports/ {
    add_header X-Robots-Tag "noarchive, nosnippet" always;
}
```
