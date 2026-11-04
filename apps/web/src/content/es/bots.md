---
title: "Lista de rastreadores de IA: user agents y cómo bloquearlos"
description: "Registro de {{all}} rastreadores, agentes y tokens de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Bytespider…) con operador, finalidad, robots.txt e IP."
h1: "Registro de rastreadores de IA"
nav: "Registro de bots"
lead: "Todos los rastreadores de IA, agentes de IA y tokens de control de robots.txt que hemos podido documentar: quién los opera, qué recopilan, si su operador dice que respetan robots.txt y cómo verificarlos, con un enlace a la fuente y la fecha de nuestra última comprobación."
steps:
  - "Busca en el registro por nombre o empresa, o recórrelo por operador."
  - "Abre la página de un agente para ver su User-Agent, su token de robots.txt, su lista de IP y reglas listas para copiar."
  - "Usa la columna de finalidad para decidir: los rastreadores de entrenamiento suelen poder bloquearse sin perder visibilidad; los de búsqueda con IA y los agentes de usuario aportan citas y visitas."
  - "Crea un archivo completo con el [generador](page:home) o prueba el que tienes con el [verificador](page:tester)."
capabilities:
  - feature: "Fuente en cada entrada"
    status: "yes"
    note: "Cada entrada revisada enlaza a la documentación del propio operador; si no existe, la página lo dice."
  - feature: "Fecha de la última comprobación"
    status: "yes"
    note: "Se muestra para cada agente, junto con cómo se comprobó (página abierta o leída a través del índice de un buscador)."
  - feature: "Legible por máquina"
    status: "yes"
    note: "Todo el registro está disponible como [/bots.json](/bots.json) bajo CC BY 4.0."
  - feature: "Actualización semanal"
    status: "yes"
    note: "Una tarea semanal compara la lista comunitaria con ai.robots.txt y abre una pull request; las entradas revisadas se comprueban a mano."
  - feature: "Prueba de que una petición es auténtica"
    status: "partly"
    note: "Solo cuando el operador publica rangos de IP, nombres de host de DNS inverso o firmas. Cualquiera puede falsificar una cadena User-Agent."
faq:
  - q: "¿Qué rastreadores de IA debería bloquear?"
    a: "Depende de lo que quieras. Para que tu contenido no se use en el entrenamiento de IA pero siga visible en las respuestas de IA, bloquea los rastreadores y tokens de entrenamiento (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, CCBot, meta-externalagent, Bytespider, MistralAI-Training) y permite los agentes de búsqueda (OAI-SearchBot, Claude-SearchBot, PerplexityBot). La [guía](page:guide-training-search) explica los pros y los contras."
  - q: "¿Qué diferencia hay entre un rastreador y un token de robots.txt?"
    a: "Un rastreador envía peticiones con su propio User-Agent. Un token como Google-Extended o Applebot-Extended nunca visita tu sitio: es un nombre en robots.txt que le indica al operador cómo puede usarse el contenido que obtiene su rastreador habitual. Los tokens solo se pueden controlar en robots.txt, no con reglas de servidor."
  - q: "¿Por qué algunos agentes ignoran robots.txt?"
    a: "Los operadores tratan como si fueran un navegador a los agentes que actúan a petición de una persona —ChatGPT-User, Perplexity-User, Google-Agent, meta-externalfetcher—, y estos pueden no seguir robots.txt. Algunos rastreadores no publican ninguna política. En esos casos, bloquea en el servidor o en la CDN."
  - q: "¿Está actualizada la lista?"
    a: "Las entradas revisadas se comprobaron con la documentación de los operadores el {{updated}}; cada página muestra su propia fecha. La lista comunitaria se sincroniza con ai.robots.txt cada semana."
  - q: "¿Puedo usar los datos?"
    a: "Sí. El registro se publica como JSON en /bots.json bajo CC BY 4.0; por favor, cita a airobotstxtgenerator.com. Las entradas de la comunidad proceden del proyecto ai.robots.txt bajo la licencia MIT."
related: ["home", "tester", "server-rules", "guide-training-search"]
updated: "2026-11-04"
---

## Cómo se elabora el registro

Cada entrada revisada parte de la documentación del propio operador: OpenAI, Anthropic, Google, Apple, Perplexity, Meta, Amazon, Mistral, DuckDuckGo, Microsoft, Common Crawl y otros publican páginas que describen sus rastreadores. De esas páginas tomamos el token de robots.txt, una cadena User-Agent documentada, la finalidad, la declaración del operador sobre robots.txt, las listas de IP o nombres de host publicados y la fecha de nuestra comprobación. Cuando un operador no publica nada —ByteDance con Bytespider, por ejemplo—, la entrada se marca como basada en observaciones independientes.

Las **finalidades** siguen las categorías que usan ahora los operadores y Cloudflare: *entrenamiento de IA*, *búsqueda con IA* (indexar y citar), *accesos a petición del usuario* (un asistente que abre una página para una persona) y *tokens de robots.txt*. Los rastreadores generales como Googlebot, Bingbot y Applebot aparecen como referencia, porque muchas funciones de IA dependen de ellos.

La **lista comunitaria**, bajo la tabla principal, procede del proyecto abierto [ai.robots.txt](https://github.com/ai-robots-txt/ai.robots.txt). Es más amplia, pero sus entradas no se verifican una a una; los propios operadores contradicen algunos de sus nombres (Cohere dice que no opera ningún rastreador, Brave no tiene un User-Agent propio y el rastreador de Exa se llama ExaSearchBot).
