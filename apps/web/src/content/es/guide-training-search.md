---
title: "Bloquear el entrenamiento de IA y seguir visible en ChatGPT"
description: "Bloquea GPTBot, ClaudeBot, Google-Extended y otros bots de entrenamiento y sigue visible en ChatGPT, Perplexity y AI Overviews, con un robots.txt probado."
h1: "Cómo bloquear el entrenamiento de IA y seguir visible en la búsqueda con IA"
nav: "Bloquear el entrenamiento, seguir en la búsqueda con IA"
lead: "La mayoría de las empresas de IA ya usan agentes distintos para el entrenamiento, la búsqueda y las peticiones de los usuarios. Bloquea los rastreadores y tokens de entrenamiento, permite los agentes de búsqueda y tus páginas seguirán pudiendo citarse en las respuestas de IA sin alimentar el próximo modelo."
related: ["home", "bots", "tester", "server-rules", "content-signals"]
updated: "2026-11-04"
faq:
  - q: "Si bloqueo GPTBot, ¿desaparecerá mi sitio de ChatGPT?"
    a: "No. Las respuestas de búsqueda de ChatGPT salen del índice de OAI-SearchBot, que es independiente. Bloquea GPTBot y permite OAI-SearchBot para que te sigan citando."
  - q: "¿Tengo que bloquear Googlebot para que mi contenido no llegue a Gemini?"
    a: "No, y no deberías, porque eso te saca de la Búsqueda de Google. Bloquea `Google-Extended` para excluirte del entrenamiento y del grounding de Gemini. AI Overviews forma parte de la Búsqueda y se controla con etiquetas de fragmentos como `nosnippet`, no con Google-Extended."
  - q: "¿Bloquear los rastreadores de entrenamiento elimina mi contenido de los modelos ya entrenados?"
    a: "No. Una regla de robots.txt solo afecta al rastreo futuro. Algunas empresas ofrecen procesos aparte de eliminación u opt-out para los datos existentes; consulta su documentación."
  - q: "¿Y Common Crawl?"
    a: "Muchos desarrolladores de IA usan el archivo de CCBot, así que bloquearlo forma parte de un opt-out del entrenamiento. También saca tus páginas de las futuras capturas de Common Crawl que se usan en investigación."
---

## Los tres tipos de agentes de IA

Desde 2024, las grandes empresas de IA han separado sus rastreadores por finalidad, en buena parte para que los editores puedan hacer exactamente esta elección:

| Empresa | Entrenamiento | Búsqueda con IA (indexar y citar) | Petición del usuario (acceso en vivo) |
|---|---|---|---|
| OpenAI | `GPTBot` | `OAI-SearchBot` | `ChatGPT-User` |
| Anthropic | `ClaudeBot` | `Claude-SearchBot` | `Claude-User` |
| Perplexity | — (dice que no entrena con el contenido rastreado) | `PerplexityBot` | `Perplexity-User` |
| Google | `Google-Extended` (token) | Googlebot (Búsqueda, AI Overviews) | `Google-Agent`, `Google-GeminiNotebook` |
| Apple | `Applebot-Extended` (token) | Applebot | — |
| Meta | `meta-externalagent` | `meta-webindexer` | `meta-externalfetcher` |
| Mistral | `MistralAI-Training` | `MistralAI-Index` | `MistralAI-User` |
| Amazon | `Amazonbot` (también otros usos) | `Amzn-SearchBot` | `Amzn-User` |

Los rastreadores y tokens de **entrenamiento** deciden si tus páginas pueden acabar en los datos de entrenamiento de un modelo. Los agentes de **búsqueda** deciden si un producto de IA puede encontrarte y citarte: de ahí viene el tráfico de referencia de la IA. Los agentes de **usuario** abren una página porque una persona la ha pedido; varios operadores dicen que robots.txt puede no aplicarse a ellos.

## El robots.txt

El primer objetivo del [generador](page:home) crea esta política para todos los agentes documentados. Su núcleo es así:

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

Nada nombra a los agentes de búsqueda: no tienen grupo propio, así que siguen `User-agent: *` igual que Google y Bing. Es intencionado. Si le das a un agente de búsqueda su propio grupo —por ejemplo, para cerrarle `/premium/`—, deja de leer por completo el grupo `*`, así que tienes que repetir todas las reglas de `*` en su grupo. El generador lo hace por ti cuando añades una excepción de ruta solo para IA.

## Rastreadores de uso mixto

Algunos agentes sirven a varias finalidades con un solo nombre. `Amazonbot` mejora los productos de Amazon y puede usarse para entrenamiento; `meta-externalagent` entrena modelos y además indexa contenido; el archivo de `CCBot` alimenta la investigación además del entrenamiento de IA. En este ajuste predefinido, el generador los trata como rastreadores de entrenamiento, lo que mantiene una política estricta, y te indica qué agentes entran en este grupo para que puedas cambiar algunos a *permitir* en el modo personalizado.

Los rastreadores generales son otro caso: `Googlebot`, `Bingbot` y `Applebot` alimentan los buscadores y, a través de ellos, funciones de IA como AI Overviews y Copilot. Nunca los bloquees para frenar el entrenamiento de IA: usa `Google-Extended`, `Applebot-Extended` y, para Bing, las etiquetas `noarchive`/`nocache` o el grupo `__usage_ai-training`, que Bing admite a partir de 2027.

## Comprueba el resultado

1. Pega el archivo en el [verificador](page:tester) y mira la tabla de rastreadores: los agentes de entrenamiento deben salir **Bloqueado** y los de búsqueda, **Permitido**.
2. Prueba algunas URL importantes con `OAI-SearchBot` y `PerplexityBot`.
3. Si usas Cloudflare, revisa también su configuración de AI Crawl Control: un bloqueo en la CDN prevalece sobre un permiso en robots.txt.
4. Para los agentes que ignoran robots.txt, añade [reglas de servidor](page:server-rules).
