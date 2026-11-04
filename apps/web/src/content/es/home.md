---
title: "Generador de robots.txt para IA: bloquea GPTBot y más"
description: "Generador gratuito de robots.txt para IA: bloquea el entrenamiento (GPTBot, ClaudeBot, Google-Extended, CCBot) y sigue visible en la búsqueda con IA."
h1: "Generador de robots.txt para rastreadores de IA"
nav: "Generador de robots.txt"
lead: "Elige el tipo de sitio y tu objetivo: el generador escribe un robots.txt para {{all}} rastreadores y tokens de IA documentados, explica cada línea y comprueba el resultado con un analizador conforme a RFC 9309 antes de que lo copies."
steps:
  - "Elige el **tipo de sitio**: define unas rutas iniciales razonables (una tienda cierra `/cart/` y `/checkout/` a todos los rastreadores; un sitio de noticias cierra `/premium/` a los bots de IA)."
  - "Elige el **objetivo**: sin entrenamiento de IA pero visible en la búsqueda con IA, nada de IA, permitir todo o decidir bot por bot."
  - "Añade **excepciones de rutas**, por ejemplo abre `/blog/` a todos los bots de IA o cierra `/members/` a todos ellos."
  - "Copia o descarga el archivo y súbelo como `robots.txt` a la raíz de cada host (`https://example.com/robots.txt`). ¿Ya tienes un archivo? Usa **Añadir a mi robots.txt**: agrega la sección de IA y demuestra que tus reglas actuales siguen funcionando igual."
  - "Prueba el archivo publicado con el [verificador de robots.txt](page:tester) y, para los rastreadores que ignoran robots.txt, añade [reglas de servidor](page:server-rules)."
capabilities:
  - feature: "Lista de rastreadores de IA"
    status: "yes"
    note: "{{all}} agentes y tokens con la documentación de su propio operador y la fecha de la última comprobación; {{community}} más de la lista comunitaria de ai.robots.txt si lo pides."
  - feature: "Ajustes predefinidos por finalidad"
    status: "yes"
    note: "El entrenamiento, la búsqueda con IA, los accesos a petición del usuario y los tokens exclusivos de robots.txt se tratan por separado."
  - feature: "Autocomprobación"
    status: "yes"
    note: "Cada archivo se analiza con las mismas reglas que el analizador de código abierto de Google; cada agente se prueba en `/`, en tus rutas de excepción y en tus rutas cerradas."
  - feature: "Combinar con un archivo existente"
    status: "yes"
    note: "Agrega una sección de IA, muestra las diferencias y compara las decisiones antiguas y nuevas para cada agente que ya está en tu archivo."
  - feature: "Líneas Content-Signal"
    status: "partly"
    note: "`Content-Signal` opcional para el grupo `*`. Es una propuesta de Cloudflare, no un estándar."
  - feature: "Detener a los bots que ignoran robots.txt"
    status: "no"
    note: "robots.txt es una petición. Para hacerla cumplir, usa [reglas de servidor](page:server-rules) o un WAF."
  - feature: "Registro, subida de archivos o seguimiento de lo que escribes"
    status: "no"
    note: "La generación se ejecuta en tu navegador y funciona sin conexión; tus rutas y archivos no se envían a ninguna parte."
faq:
  - q: "¿Cómo bloqueo el entrenamiento de IA y sigo visible en las búsquedas de ChatGPT, Claude y Perplexity?"
    a: "Bloquea los rastreadores y tokens de entrenamiento —`GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `meta-externalagent` y otros— y deja permitidos los agentes de búsqueda (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`). Es el primer objetivo del generador. Tienes los detalles en la guía [Bloquear el entrenamiento de IA y seguir visible en la búsqueda con IA](page:guide-training-search)."
  - q: "¿Bloquear Google-Extended saca mi sitio de la Búsqueda de Google o de AI Overviews?"
    a: "No. `Google-Extended` es un token de robots.txt, no un rastreador: controla si Google puede usar el contenido para entrenar Gemini y fundamentar sus respuestas (grounding). La Búsqueda de Google, incluidos AI Overviews y AI Mode, usa `Googlebot`."
  - q: "¿Por qué el archivo generado repite algunas reglas?"
    a: "Un rastreador que tiene su propio grupo ignora por completo el grupo `User-agent: *`. Cuando los bots de IA necesitan su propio grupo (por ejemplo, para cerrarles `/premium/`), el generador copia tus reglas de `*` en ese grupo para que no se pierda nada."
  - q: "¿Respetarán este archivo todas las empresas de IA?"
    a: "La mayoría de los grandes operadores afirman que sus rastreadores respetan robots.txt. Los agentes que actúan a petición de un usuario (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`) quizá no lo hagan, y algunos rastreadores no publican ninguna declaración. El registro de bots muestra la declaración de cada operador con un enlace a la fuente."
  - q: "¿Dónde se pone el archivo robots.txt?"
    a: "En la raíz de cada host y protocolo que quieras cubrir: `https://example.com/robots.txt` no se aplica a `https://shop.example.com/`. Para Google, el archivo debe ser texto plano, estar en UTF-8 y ocupar menos de 500 KiB."
  - q: "¿Se guardan los datos que introduzco?"
    a: "No. El generador funciona por completo en tu navegador. Solo contamos que se generó un archivo y qué ajuste predefinido se usó, sin tus rutas ni tu texto."
  - q: "¿Sirve robots.txt como reserva de derechos frente a la minería de textos y datos en la UE?"
    a: "Es el medio legible por máquina más reconocido. En la UE, la minería de textos y datos de contenido accesible de forma lícita está permitida salvo que el titular se haya reservado expresamente ese uso (art. 4 de la Directiva (UE) 2019/790; en España, art. 67.3 del Real Decreto-ley 24/2021), y el Reglamento de IA obliga a los proveedores de modelos de IA de uso general a respetar esas reservas. Lo explicamos en [Bots de IA y Reglamento de IA](page:guide-eu-ai-act). Es información, no asesoramiento jurídico."
related: ["tester", "bots", "server-rules", "guide-training-search", "llms-txt"]
updated: "2026-11-04"
---

## Cómo decide el generador

Cada agente del registro tiene una **finalidad** tomada de la documentación de su operador:

- **Entrenamiento de IA**: recopila páginas que pueden usarse para entrenar modelos (`GPTBot`, `ClaudeBot`, `CCBot`, `MistralAI-Training`).
- **Tokens de robots.txt**: no son rastreadores, sino nombres que controlan cómo puede usarse el contenido que obtiene un rastreador general (`Google-Extended`, `Applebot-Extended`, `__usage_ai-training`).
- **Búsqueda con IA**: indexa páginas para que un producto de IA pueda citarlas y enlazarlas (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`).
- **Accesos a petición del usuario**: abren una página porque una persona se lo pidió a un asistente (`ChatGPT-User`, `Claude-User`, `Perplexity-User`).
- **Rastreadores generales**: `Googlebot`, `Bingbot`, `Applebot` y los agentes que generan vistas previas de enlaces nunca se bloquean con un ajuste predefinido, porque bloquearlos te saca de la búsqueda normal o rompe las vistas previas de enlaces.

El objetivo decide qué finalidades se cierran. Después, el generador escribe un grupo por finalidad, para que el archivo siga siendo legible, y añade tus excepciones de rutas a cada grupo.

## Por qué el archivo se comprueba antes de que lo veas

robots.txt tiene algunas reglas que sorprenden: **gana la regla coincidente más larga**, **en caso de empate gana Allow**, un rastreador con **grupo propio ignora `User-agent: *`** y **las líneas en blanco no separan grupos**. Tras crear el archivo, el generador lo analiza con el mismo algoritmo que el analizador de código abierto de Google (lo probamos con los casos de prueba del propio Google y con 46 archivos robots.txt reales) y comprueba, para cada agente y cada ruta relevante, si la respuesta coincide con la política que elegiste. El sello bajo el archivo muestra cuántas comprobaciones se hicieron.

## Lo que robots.txt no puede hacer

robots.txt es una petición pública, definida en [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html). Los rastreadores que se portan bien la siguen; otros no, y cualquiera puede enviar un User-Agent falso. Para hacerla cumplir, bloquea en el servidor o en la CDN —la página de [reglas de servidor](page:server-rules) crea reglas para nginx, Apache, Caddy y Cloudflare a partir del mismo registro— y verifica los bots por IP o DNS inverso.
