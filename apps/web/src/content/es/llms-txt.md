---
title: "Generador de llms.txt gratis: crea tu archivo llms.txt"
description: "Generador gratuito de llms.txt: crea un llms.txt según llmstxt.org (H1, resumen y secciones de enlaces en Markdown) con validación. Funciona en tu navegador."
h1: "Generador de llms.txt"
nav: "Generador de llms.txt"
lead: "Crea un archivo `llms.txt` con el formato propuesto en llmstxt.org —un título, un resumen de un párrafo y secciones de enlaces a las páginas más útiles para los modelos de lenguaje— y comprueba su estructura mientras escribes."
steps:
  - "Introduce el nombre del sitio o del proyecto; será el único H1."
  - "Escribe un resumen breve: qué es el sitio y qué enumera el archivo. Se convierte en la cita en bloque que los modelos leen primero."
  - "Añade secciones (`## Documentación`, `## Guías` …) con enlaces: título, URL absoluta y una descripción opcional de una línea. Enlaza a versiones en Markdown de las páginas cuando las tengas."
  - "Marca las secciones menos importantes como **opcionales**: los lectores con poco espacio de contexto pueden omitirlas."
  - "Descarga el archivo y súbelo a la raíz del sitio como `/llms.txt`. Si quieres, publica también `/llms-full.txt` con el texto completo."
capabilities:
  - feature: "Estructura de llmstxt.org"
    status: "yes"
    note: "H1, resumen en cita en bloque, notas opcionales, secciones H2 con listas de enlaces en Markdown y una sección `Optional`."
  - feature: "Validación"
    status: "yes"
    note: "Comprueba que haya un solo H1, secciones H2 y destinos de enlace absolutos o relativos a la raíz."
  - feature: "Rastrear tu sitio para rellenar la lista"
    status: "no"
    note: "Tú eliges las páginas; no se obtiene nada."
  - feature: "Efecto en el posicionamiento o en las respuestas de IA"
    status: "no"
    note: "llms.txt es una propuesta; ningún gran buscador ni ninguna gran empresa de IA ha dicho que use el archivo para decidir el posicionamiento o el entrenamiento."
faq:
  - q: "¿Qué es llms.txt?"
    a: "Un archivo Markdown en la raíz de un sitio, propuesto por Jeremy Howard en septiembre de 2024 en llmstxt.org, que ofrece a los modelos de lenguaje un mapa seleccionado del sitio: qué es y qué páginas leer. No es un estándar ni un archivo de control de acceso."
  - q: "¿llms.txt es lo mismo que robots.txt?"
    a: "No. robots.txt indica a los rastreadores qué pueden obtener; llms.txt sugiere qué merece la pena leer. Una página incluida en llms.txt pero bloqueada en robots.txt sigue bloqueada para los rastreadores que respetan robots.txt."
  - q: "¿Leen llms.txt las empresas de IA?"
    a: "Algunas herramientas y asistentes de programación con IA lo leen cuando un usuario les indica un sitio, y las plataformas de documentación lo generan automáticamente. Ninguna gran empresa de IA se ha comprometido a usarlo para entrenamiento o búsqueda. Publicarlo cuesta poco."
  - q: "¿Debo enlazar páginas HTML o Markdown?"
    a: "Markdown cuando sea posible: es lo que mejor manejan los modelos de lenguaje. Este sitio publica una versión `.md` de cada página y las enlaza desde su propio [llms.txt](/llms.txt)."
related: ["home", "content-signals", "meta-tags", "guide-training-search"]
updated: "2026-11-04"
---

## Qué contiene un buen llms.txt

Mantenlo breve y seleccionado: las entre 10 y 40 páginas que un modelo necesita para entender tu producto o tu contenido, cada una con una descripción de una línea que diga qué encontrará el lector. Pon primero el material de referencia, después los ejemplos, y el historial, los registros de cambios o las páginas legales en **Optional**. Si tienes documentación extensa, publica también `llms-full.txt` —la misma estructura con el texto completo de las páginas— e indícalo en el resumen.

Este sitio sigue su propio consejo: consulta [/llms.txt](/llms.txt) y [/llms-full.txt](/llms-full.txt); además, cada página tiene una versión en Markdown en la misma dirección terminada en `.md`.
