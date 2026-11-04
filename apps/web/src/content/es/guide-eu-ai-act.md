---
title: "Opt-out de IA en la UE: art. 67 RDL 24/2021 y robots.txt"
description: "robots.txt como reserva de derechos ante la IA: Reglamento de IA, art. 4 Directiva 2019/790 y art. 67 RDL 24/2021. Información, no asesoramiento jurídico."
h1: "Reserva de derechos ante la IA: minería de textos y datos"
nav: "Bots de IA y Reglamento de IA"
lead: "El derecho de la UE permite a cualquiera hacer minería de textos y datos con contenido disponible públicamente, con cualquier fin, salvo que el titular se haya reservado ese derecho de forma legible por máquina. Desde agosto de 2025, los proveedores de modelos de IA deben demostrar que respetan esas reservas, y el Código de buenas prácticas menciona expresamente robots.txt."
related: ["tdmrep", "content-signals", "home", "guide-training-search"]
updated: "2026-11-04"
faq:
  - q: "¿Un Disallow en robots.txt es una reserva de derechos válida legalmente?"
    a: "El Código de buenas prácticas trata robots.txt según RFC 9309 como un protocolo que los firmantes deben respetar, y los tribunales han examinado reservas legibles por máquina, pero el efecto jurídico depende del derecho nacional y de los hechos de cada caso. Esto es información, no asesoramiento jurídico."
  - q: "¿Se aplica el Reglamento de IA a empresas de IA de fuera de la UE?"
    a: "Las obligaciones se aplican a los proveedores que introducen modelos de IA de uso general en el mercado de la UE, estén donde estén establecidos. Su política de derechos de autor debe cubrir las reservas de los titulares de derechos de la UE."
  - q: "¿Qué debería publicar?"
    a: "Un robots.txt que bloquee los rastreadores de entrenamiento de IA que no quieras, opcionalmente un archivo TDMRep y una declaración en tus condiciones de uso. Guarda copias fechadas de tu robots.txt para poder demostrar desde cuándo estaba vigente la reserva."
  - q: "¿Dónde está regulada la reserva de derechos en España?"
    a: "En el artículo 67 del Real Decreto-ley 24/2021, no en la Ley de Propiedad Intelectual. Su apartado 3 excluye el límite general de minería de textos y datos cuando los titulares han reservado expresamente ese uso."
---

*Esta página es información, no asesoramiento jurídico.*

## Dos normas, un mismo mecanismo

**La Directiva (UE) 2019/790, sobre los derechos de autor en el mercado único digital, en su artículo 4,** permite la minería de textos y datos de obras a las que se accede de forma lícita —la base jurídica en la que se apoya buena parte del entrenamiento de IA en la UE— salvo que el titular de derechos haya **reservado expresamente** ese uso. Para el contenido puesto a disposición del público en línea, la reserva debe hacerse de manera adecuada, por ejemplo por medios de **lectura mecánica**. Todos los Estados miembros han incorporado esta norma a su derecho nacional; España lo hizo fuera de su ley de propiedad intelectual (lo vemos más abajo).

**El Reglamento de IA (RIA), en su artículo 53, apartado 1, letra c),** obliga a los proveedores de modelos de IA de uso general a establecer una política para cumplir el derecho de la UE en materia de derechos de autor y, en particular, para detectar y respetar las reservas de derechos del artículo 4, apartado 3, de la Directiva, también mediante tecnologías de vanguardia. Las obligaciones se aplican desde el **2 de agosto de 2025**; la Oficina de IA puede hacerlas cumplir con multas a partir del **2 de agosto de 2026**.

## Cómo lo ha incorporado España: el art. 67 del RDL 24/2021

España no llevó la minería de textos y datos al texto refundido de la Ley de Propiedad Intelectual (TRLPI). Transpuso las dos excepciones de la Directiva (artículos 3 y 4) en un único precepto: el **artículo 67 del Real Decreto-ley 24/2021**, de 2 de noviembre, una norma independiente.

- **Art. 67.3:** el permiso general para la minería de textos y datos no se aplica cuando el titular de derechos **ha reservado expresamente** ese uso. Esa es la **reserva de derechos** (el *opt-out*) que expresas con robots.txt.
- Para el contenido publicado en línea, lo prudente es expresar la reserva por medios de lectura mecánica, como describe la Directiva: un `Disallow` en robots.txt para los rastreadores de entrenamiento y, si quieres, [TDMRep](page:tdmrep).

**Si tu sitio está en Latinoamérica:** ningún país latinoamericano tiene hoy una reserva de minería de textos y datos al estilo europeo (Chile, entre otros, debate una). Aun así, robots.txt sigue siendo la señal técnica que los grandes proveedores de IA dicen respetar, y el Código de buenas prácticas de la UE compromete a sus firmantes a seguirlo.

## Qué dice el Código de buenas prácticas

El Código de buenas prácticas de IA de uso general (capítulo de derechos de autor, julio de 2025) es la vía por la que la mayoría de los grandes proveedores demuestran que cumplen. Los firmantes se comprometen, entre otras cosas, a:

1. usar rastreadores que **lean y respeten robots.txt tal como lo especifica RFC 9309** y las versiones posteriores del estándar;
2. detectar y respetar **otros protocolos adecuados legibles por máquina** para reservar derechos, adoptados por organismos de normalización o de uso generalizado entre los titulares de derechos;
3. publicar información sobre sus rastreadores y sobre cómo tratan robots.txt.

La Comisión abrió una consulta sobre qué otros protocolos cuentan; en el momento de escribir esto no se había publicado ninguna lista oficial.

## Qué significa en la práctica

- Un `Disallow` para el rastreador de entrenamiento de un proveedor (por ejemplo `GPTBot`, `ClaudeBot`, `MistralAI-Training`, `CCBot`) es la reserva legible por máquina más reconocida.
- Un token como `Google-Extended` o `Applebot-Extended` expresa la reserva sin sacarte de la búsqueda.
- **robots.txt reserva derechos frente a los rastreadores que nombras.** Un rastreador de entrenamiento que no conoces no queda cubierto. Los grupos compartidos como `__usage_ai-training` y las líneas basadas en el uso como `Content-Usage: train-ai=n` intentan cerrar ese hueco; [TDMRep](page:tdmrep) es un protocolo diseñado específicamente para las reservas del artículo 4.
- Las declaraciones en lenguaje natural en las condiciones de uso pueden no bastar para el contenido publicado en línea; los tribunales han buscado una forma legible por máquina.

## Una configuración defendible

1. Un robots.txt con tus rastreadores de entrenamiento bloqueados: usa el [generador](page:home).
2. Opcionalmente, un `tdmrep.json` y una línea `Content-Usage`.
3. Una frase en tus condiciones de uso que reserve la minería de textos y datos conforme al artículo 4, apartado 3, de la Directiva (UE) 2019/790 (en España, el art. 67.3 del RDL 24/2021).
4. Un archivo histórico de tu robots.txt con fechas (por ejemplo, una copia en un sistema de control de versiones).
