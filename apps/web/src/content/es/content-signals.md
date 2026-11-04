---
title: "Generador de Content-Signal y Content-Usage para robots.txt"
description: "Crea líneas Content-Signal (Cloudflare) y Content-Usage (borrador aipref del IETF) para robots.txt y cabeceras HTTP: search, ai-input, ai-train y su soporte."
h1: "Generador de Content-Signal y Content-Usage"
nav: "Señales de contenido"
lead: "Indica cómo puede usarse tu contenido después de obtenerlo —para búsqueda, como base de respuestas de IA o para entrenamiento— en las dos sintaxis propuestas hasta ahora: `Content-Signal` de Cloudflare y `Content-Usage`, del borrador aipref del IETF."
steps:
  - "Elige una preferencia para cada uso: `search`, `ai-input` (respuestas creadas a partir de tus páginas) y `ai-train`. Deja uno sin definir para no expresar ninguna preferencia."
  - "Copia el bloque de robots.txt. Las líneas Content-Signal van dentro de un grupo `User-agent`, normalmente `User-agent: *`."
  - "Si quieres, copia también la línea `Content-Usage` o la cabecera HTTP del borrador del IETF."
  - "Recuerda que estas líneas expresan preferencias; si necesitas que los rastreadores no accedan, bloquéalos con reglas `Disallow`."
capabilities:
  - feature: "Sintaxis Content Signals de Cloudflare"
    status: "yes"
    note: "`Content-Signal: search=yes, ai-input=yes, ai-train=no`, dentro de un grupo y con el comentario explicativo que recomienda Cloudflare."
  - feature: "Sintaxis aipref del IETF"
    status: "yes"
    note: "`Content-Usage: train-ai=n` (regla de robots.txt con ruta opcional) y la cabecera HTTP `Content-Usage`, según draft-ietf-aipref-attach."
  - feature: "Efecto garantizado"
    status: "no"
    note: "Ninguna de las dos sintaxis es un estándar. Google ha dicho que Content-Signal no tiene efecto en sus rastreadores; OpenAI, Anthropic y Perplexity no lo mencionan en su documentación."
faq:
  - q: "¿Qué es Content-Signal?"
    a: "Una extensión de robots.txt que Cloudflare publicó en septiembre de 2025 como Content Signals Policy. Nombra tres usos —`search`, `ai-input` y `ai-train`—, cada uno con el valor `yes` o `no`. Cloudflare añade `search=yes, ai-train=no` al robots.txt gestionado de millones de dominios."
  - q: "¿Qué es Content-Usage?"
    a: "La sintaxis que desarrolla el grupo de trabajo AI Preferences (aipref) del IETF: un vocabulario con las categorías `train-ai`, `ai-use` y `search` y los valores `y` o `n`, que se asocia al contenido mediante una regla de robots.txt o una cabecera HTTP. Los borradores siguen en elaboración; todavía no hay RFC."
  - q: "¿Debería usar los dos?"
    a: "No entran en conflicto, y ninguno se respeta todavía de forma generalizada. Si usas Cloudflare, Content-Signal ya está en tu robots.txt gestionado. Añadir Content-Usage cuesta una línea y sigue la vía con más posibilidades de convertirse en estándar."
  - q: "¿Y `__usage_ai-training`?"
    a: "Es una propuesta distinta, de octubre de 2026: un grupo de robots.txt (`User-agent: __usage_ai-training` con `Disallow: /`) que varias empresas de IA han dicho que tratarán como exclusión del entrenamiento. A diferencia de Content-Signal, usa reglas Allow y Disallow normales. Consulta su [entrada en el registro](bot:usage-ai-training)."
related: ["home", "tdmrep", "meta-tags", "guide-eu-ai-act", "bots"]
updated: "2026-11-04"
---

## Tres generaciones de preferencias de IA en robots.txt

1. **Nombres de rastreadores** (desde 2023): bloquear `GPTBot`, `ClaudeBot`, `Google-Extended`… empresa por empresa. Es fiable con quienes respetan robots.txt, pero tienes que conocer todos los nombres.
2. **Señales basadas en el uso** (desde 2025): `Content-Signal` y `Content-Usage` describen usos en lugar de rastreadores. Se colocan dentro de un grupo e indican qué puede hacerse con el contenido que se obtiene de todos modos, por ejemplo con un rastreador de búsqueda general.
3. **Grupo de opt-out compartido** (desde 2026): `__usage_ai-training` se escribe como si fuera un rastreador, pero lo entienden varias empresas a la vez.

Hasta que una de ellas se convierta en estándar, el archivo más seguro usa las tres: los nombres de cada proveedor para los rastreadores que conoces, un grupo compartido para las empresas que lo admiten y una línea basada en el uso para el resto. El [generador](page:home) se encarga de las dos primeras; esta página añade la tercera.
