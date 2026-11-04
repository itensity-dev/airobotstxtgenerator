---
title: "Sintaxis de robots.txt (RFC 9309): guía con ejemplos"
description: "Sintaxis de robots.txt con ejemplos: grupos, User-agent, Allow y Disallow, comodines * y $, la regla más larga, grupos propios frente a * y errores frecuentes."
h1: "Sintaxis de robots.txt según RFC 9309, con ejemplos"
nav: "Sintaxis de robots.txt"
lead: "robots.txt se convirtió en estándar de internet en septiembre de 2022 como RFC 9309. Sus reglas son breves, pero algunas —la coincidencia más larga, un grupo por rastreador, las líneas en blanco— sorprenden a casi todo el mundo. Puedes pegar cada ejemplo de abajo en el verificador."
related: ["tester", "home", "guide-bad-bots", "bots"]
updated: "2026-11-04"
faq:
  - q: "¿robots.txt distingue entre mayúsculas y minúsculas?"
    a: "En los nombres de las directivas (`User-agent`, `Disallow`) y de los bots, no; en las rutas, sí. `Disallow: /Private/` no bloquea `/private/`."
  - q: "¿Puedo usar expresiones regulares?"
    a: "No. Solo tienen un significado especial `*` (cualquier secuencia de caracteres) y `$` al final de un patrón (final de la URL)."
  - q: "¿Necesito una línea Allow?"
    a: "Solo para volver a abrir una ruta dentro de otra bloqueada. Todo lo que no está bloqueado está permitido."
  - q: "¿robots.txt se aplica a los subdominios?"
    a: "No. Cada combinación de esquema, host y puerto tiene su propio archivo: `https://example.com/robots.txt` no cubre `https://blog.example.com/`."
---

## El archivo

robots.txt es un archivo de texto plano en UTF-8 situado en la raíz de un host: `https://example.com/robots.txt`. Los rastreadores lo obtienen antes de rastrear. Las líneas tienen la forma `clave: valor`; `#` inicia un comentario. Google lee hasta **500 KiB** e ignora el resto.

## Grupos

Un **grupo** es una o varias líneas `User-agent` seguidas de reglas:

```
User-agent: GPTBot
User-agent: CCBot
Disallow: /

User-agent: *
Disallow: /admin/
```

- Un rastreador usa el grupo o los grupos que lo **nombran**. La coincidencia no distingue mayúsculas y minúsculas y solo usa el token de producto: `User-agent: GPTBot/1.4` se lee como `GPTBot`.
- Si varios grupos nombran al mismo rastreador, sus reglas se **combinan**.
- Solo un rastreador al que no nombra ningún grupo usa `User-agent: *`.
- Un rastreador con grupo propio **ignora `*` por completo**. En el ejemplo, `GPTBot` no puede obtener nada; pero si su grupo dijera solo `Disallow: /blog/`, podría obtener `/admin/`, porque la regla de `*` ya no se le aplica.

**Las líneas en blanco no terminan un grupo.** Este archivo le da a `GPTBot` las reglas de `*`, porque ambas líneas User-agent pertenecen al mismo grupo:

```
User-agent: GPTBot

User-agent: *
Disallow: /private/
```

## Reglas: Allow y Disallow

`Disallow: /path` bloquea todas las URL cuya ruta empieza por `/path`, incluidas `/path.html`, `/path/` y `/pathology`. Un `Disallow:` vacío lo permite todo. `Allow` vuelve a abrir una ruta.

Cuando coinciden varias reglas, **gana el patrón más largo**; si un patrón Allow y uno Disallow tienen la misma longitud, **gana Allow**. El orden de las líneas no importa.

```
User-agent: *
Disallow: /shop/
Allow: /shop/catalog/
```

`/shop/cart` queda bloqueada; `/shop/catalog/shoes` queda permitida (14 caracteres ganan a 6).

## Comodines

- `*` coincide con cualquier secuencia de caracteres: `Disallow: /*.pdf` bloquea todas las URL que contienen `.pdf`.
- `$` al final ancla el final de la URL: `Disallow: /*.pdf$` bloquea `/a.pdf`, pero no `/a.pdf?download=1`.
- Un `*` final no cambia nada: `/private*` equivale a `/private`.
- Los patrones se comparan con la ruta **y la cadena de consulta**: `Disallow: /*?sort=` bloquea las páginas de listados ordenados.

## Otras líneas

- `Sitemap: https://example.com/sitemap.xml`: una URL completa; se aplica a todos los rastreadores y puede ir en cualquier parte del archivo.
- `Crawl-delay`: Google lo ignora; Bing, Yandex, Anthropic y Common Crawl lo respetan.
- `Noindex` en robots.txt: no se admite desde 2019; usa una metaetiqueta robots.
- `Content-Signal`, `Content-Usage`: propuestas de preferencias de IA; consulta [señales de contenido](page:content-signals).

## Cuando el archivo falta o está roto

| Respuesta para /robots.txt | Comportamiento de Google |
|---|---|
| 200 | Se aplican las reglas |
| 3xx | Sigue hasta 5 redirecciones y después lo trata como un 404 |
| 4xx (salvo 429) | Sin restricciones: se puede rastrear todo |
| 5xx, 429 | Rastreo en pausa; tras unos 30 días, copia en caché o sin restricciones |
| Inaccesible | Se trata como un 5xx |

## Errores que Google perdona y otros quizá no

Google acepta `Dissallow`, `User agent`, la falta de dos puntos (`Disallow /admin`) y una marca de orden de bytes. Otros rastreadores quizá no, por eso el [verificador](page:tester) los señala aunque el analizador de Google los lea. También señala las reglas situadas antes de cualquier línea `User-agent` (todos las ignoran), las URL completas en `Disallow` (nunca coinciden) y las rutas sin barra inicial.
