---
title: "Metaetiqueta noai, X-Robots-Tag e IA: qué funciona de verdad"
description: "¿Qué metaetiquetas y cabeceras HTTP controlan el uso de una página por la IA? noai no es estándar; nosnippet, noarchive y X-Robots-Tag varían según la empresa."
h1: "Metaetiquetas para IA y X-Robots-Tag: qué funciona"
nav: "Metaetiquetas para IA"
lead: "Los controles de IA a nivel de página son un mosaico: algunas etiquetas las respeta una sola empresa, otras solo plataformas pequeñas y otras nadie. Esta página recoge qué hace hoy cada etiqueta, con fuentes."
steps:
  - "Decide si de verdad necesitas control a nivel de página: las reglas de robots.txt por ruta cubren la mayoría de los casos."
  - "Usa la tabla para elegir las etiquetas que respetan realmente las empresas que te interesan."
  - "Añádelas como `<meta name=\"robots\" content=\"…\">` en el HTML, o como cabecera HTTP `X-Robots-Tag` para PDF, imágenes y otros archivos."
  - "Prueba una página mirando su código fuente y sus cabeceras de respuesta; el [verificador](page:tester) comprueba robots.txt, no metaetiquetas."
capabilities:
  - feature: "Estado honesto de cada etiqueta"
    status: "yes"
    note: "Cada fila indica quién documenta que admite la etiqueta."
  - feature: "Una etiqueta universal «sin IA»"
    status: "no"
    note: "No existe. `noai` se copia mucho, pero ni Google, ni OpenAI, ni Anthropic, ni Microsoft, ni Apple la documentan."
faq:
  - q: "¿Funciona `<meta name=\"robots\" content=\"noai\">`?"
    a: "Solo en las plataformas que la han adoptado, como algunas comunidades de arte. No forma parte de ningún estándar y las grandes empresas de IA no la documentan. No hace daño, pero no sustituye a robots.txt."
  - q: "¿Cómo excluyo una página de AI Overviews de Google?"
    a: "Las funciones de IA de la Búsqueda de Google siguen los controles de fragmentos habituales: `nosnippet` (ningún fragmento), `max-snippet:0` o `data-nosnippet` en elementos concretos limitan lo que se puede mostrar. Google-Extended en robots.txt no afecta a AI Overviews."
  - q: "¿Cómo limito el uso de mi página en Copilot?"
    a: "Bing documenta que con `nocache` Copilot solo muestra la URL, el título y el fragmento, y que `noarchive` excluye la página de las respuestas y del entrenamiento de Copilot. Bing también ha anunciado nuevas preferencias de entrenamiento y grounding de IA para 2027."
  - q: "¿Qué aporta X-Robots-Tag?"
    a: "Las mismas directivas que la metaetiqueta robots, enviadas como cabecera HTTP; es la única forma de controlar archivos que no tienen `<head>` HTML, como los PDF y las imágenes: `X-Robots-Tag: noarchive, nosnippet`."
related: ["content-signals", "tdmrep", "home", "guide-training-search"]
updated: "2026-11-04"
---

## Etiquetas y cabeceras, una a una

| Etiqueta o cabecera | Qué hace | Quién documenta que la admite |
|---|---|---|
| `noai`, `noimageai` | Intención: «no usar para IA» / «no usar las imágenes para IA» | No la documentan Google, OpenAI, Anthropic, Microsoft ni Apple; la han adoptado algunas plataformas. No es estándar. |
| `nosnippet` | Sin fragmento de texto ni vista previa en los resultados; además excluye la página de AI Overviews y AI Mode como fuente de fragmentos | Google, Bing |
| `max-snippet:N` | Limita la longitud del fragmento; `0` equivale a `nosnippet` | Google, Bing |
| `data-nosnippet` (atributo HTML) | Excluye una parte de la página de los fragmentos y de las funciones de IA de la Búsqueda de Google | Google |
| `noarchive` | Sin copia en caché. Bing: excluye la página de las respuestas y del entrenamiento de Copilot; Amazon: no usarla para entrenar modelos | Bing, Amazon |
| `nocache` | Bing: Copilot solo puede usar la URL, el título y el fragmento | Bing |
| `noindex` | Elimina la página de la búsqueda por completo y, por tanto, de las funciones de búsqueda con IA basadas en ese índice | Todos los grandes buscadores |
| `X-Robots-Tag: …` | Cualquiera de las anteriores como cabecera HTTP, para cualquier tipo de archivo | Google, Bing |
| `tdm-reservation: 1` | Reserva los derechos de minería de textos y datos (UE); consulta [TDMRep](page:tdmrep) | Quienes han adoptado TDMRep |
| `Content-Usage: train-ai=n` | Preferencia del borrador aipref del IETF como cabecera HTTP; consulta [señales de contenido](page:content-signals) | Borrador; sin implantación consolidada |

Ejemplo para una página que debe seguir en la búsqueda pero quedar fuera de las respuestas y del entrenamiento de Copilot:

```html
<meta name="robots" content="noarchive">
<meta name="bingbot" content="nocache">
```

Cabecera de ejemplo para una carpeta de PDF en nginx:

```nginx
location /reports/ {
    add_header X-Robots-Tag "noarchive, nosnippet" always;
}
```
