---
title: "Verificador de robots.txt: prueba URLs y bots de IA"
description: "Verificador gratuito de robots.txt: obtén el archivo de cualquier sitio o pega el tuyo, mira qué rastreadores de IA acceden, prueba URLs y detecta errores."
h1: "Verificador y validador de robots.txt"
nav: "Verificador de robots.txt"
lead: "Obtén el robots.txt de cualquier sitio web o pega un archivo, prueba una URL con cualquier rastreador, mira cuáles de los {{agents}} agentes de IA pueden rastrear el sitio y consigue una lista de errores, con la línea exacta que decide cada respuesta."
steps:
  - "Introduce un dominio o cualquier URL del sitio (solo se usa el host) y pulsa **Obtener robots.txt**, o cambia a **Pegar robots.txt** para probar un borrador sin subirlo."
  - "Lee la línea de estado: Google trata una respuesta **4xx** como «no hay robots.txt» y una **5xx** como «no rastrear nada por ahora»; también se comprueban las redirecciones, el tamaño y el tipo de contenido."
  - "Escribe una ruta o una URL completa y elige un rastreador: el resultado indica la **línea decisiva** y el grupo que se aplica, y resalta ambos en el archivo."
  - "Revisa la tabla de rastreadores de IA: la página de inicio y tu ruta, cada una **Permitido**, **Bloqueado** o **Parcial**, y si el rastreador tiene grupo propio."
  - "Corrige lo que señale el **informe de validación** y vuelve a probar. ¿Necesitas un archivo nuevo? Abre el [generador](page:home)."
capabilities:
  - feature: "Las mismas respuestas que el analizador de Google"
    status: "yes"
    note: "Incluye todos los casos de prueba del analizador de robots.txt de código abierto de Google y coincide con sus veredictos en 46 archivos robots.txt reales de sitios grandes."
  - feature: "Obtención en vivo de cualquier sitio"
    status: "yes"
    note: "A través de nuestro verificador: solo hosts http/https públicos, puertos estándar, hasta 5 redirecciones, 5 segundos y 512 KiB. Los resultados se guardan en caché 10 minutos."
  - feature: "Pegar y probar sin conexión"
    status: "yes"
    note: "El texto pegado se analiza en tu navegador y nunca se sube."
  - feature: "Validación"
    status: "yes"
    note: "Más de 35 comprobaciones: sintaxis, erratas que Google tolera, grupos que descartan sin avisar las reglas de `*`, trampas de las líneas en blanco, URL completas en las reglas, límite de 500 KiB, sintaxis de Content-Signal y Content-Usage y bloques gestionados por Cloudflare."
  - feature: "Páginas tras un inicio de sesión o un cortafuegos"
    status: "no"
    note: "Solo obtenemos `/robots.txt` desde internet, como haría un rastreador. Un WAF o una CDN pueden bloquear rastreadores que robots.txt permite: revisa la configuración de tu CDN."
  - feature: "Metaetiquetas robots y X-Robots-Tag"
    status: "no"
    note: "Las reglas a nivel de página no se comprueban aquí; consulta [metaetiquetas para IA](page:meta-tags)."
faq:
  - q: "¿Qué pasó con el probador de robots.txt de Google?"
    a: "Google retiró el probador de robots.txt de Search Console a finales de 2023 y lo sustituyó por un informe de robots.txt que muestra el archivo obtenido y los errores, pero no permite probar una URL con un user-agent. Esta página cubre ese hueco y usa las mismas reglas de coincidencia que el analizador de código abierto de Google."
  - q: "¿Por qué se permite una URL aunque `User-agent: *` la bloquee?"
    a: "Porque el rastreador que elegiste tiene su propio grupo. Un rastreador solo obedece el grupo más específico que lo nombra, así que las reglas bajo `User-agent: *` dejan de aplicársele. El informe de validación señala cada agente para el que esto descarta una regla de `*`."
  - q: "¿Qué pasa si robots.txt devuelve 404, 403 o 500?"
    a: "Google trata las respuestas 4xx (salvo 429) como si no hubiera robots.txt: se puede rastrear todo. 5xx y 429 significan «no rastrear por ahora»; Google lo reintenta y, tras unos 30 días, puede usar una copia en caché o tratar el sitio como sin restricciones."
  - q: "¿Importa el orden de las líneas Allow y Disallow?"
    a: "No. Gana el patrón coincidente más largo, sea cual sea el orden; si un patrón Allow y uno Disallow tienen la misma longitud, gana Allow. `*` coincide con cualquier secuencia de caracteres y `$` ancla el final de la URL."
  - q: "¿Se guarda mi robots.txt o el dominio que compruebo?"
    a: "El texto pegado nunca sale de tu navegador. En las comprobaciones en vivo, nuestro servidor obtiene el archivo y lo mantiene en memoria hasta 10 minutos para que las comprobaciones repetidas sean rápidas; los dominios no se escriben en registros ni en herramientas de analítica."
  - q: "¿Qué user-agent envía el verificador?"
    a: "`Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)`. Solo obtiene `/robots.txt`, una vez por comprobación. Consulta [nuestro bot verificador](page:checker-bot)."
related: ["home", "bots", "server-rules", "guide-syntax", "guide-bad-bots"]
updated: "2026-11-04"
---

## Cómo lee un rastreador robots.txt

El verificador aplica las reglas de [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) exactamente igual que el analizador de código abierto de Google:

1. **Encontrar el grupo.** Un grupo es una o varias líneas `User-agent` seguidas de reglas. El rastreador usa todos los grupos que nombran su token de producto (sin distinguir mayúsculas y minúsculas e ignorando los números de versión) y los combina. Solo si ningún grupo lo nombra usa `User-agent: *`. Las líneas en blanco no terminan un grupo.
2. **Encontrar las reglas que coinciden.** Cada patrón `Allow` y `Disallow` se compara con la ruta y la cadena de consulta de la URL. Los patrones coinciden desde el inicio de la ruta; `*` representa cualquier secuencia de caracteres y un `$` final, el final de la URL. La coincidencia distingue mayúsculas y minúsculas.
3. **Elegir la coincidencia más larga.** Gana la regla con el patrón más largo. Si un `Allow` y un `Disallow` tienen la misma longitud, gana `Allow`. Si ninguna regla coincide, la URL está permitida.

Google también tolera errores comunes —`Dissallow`, `User agent`, la falta de dos puntos— e ignora todo lo que va después de 500 KiB. El verificador reproduce este comportamiento e informa de cada caso para que otros rastreadores, que pueden ser más estrictos, lean tu archivo de la misma manera.

## Cómo funcionan las comprobaciones en vivo

Nuestro servidor solicita `https://your-host/robots.txt` (y recurre a `http://` si no puede conectar por HTTPS), sigue hasta cinco redirecciones, se detiene tras 5 segundos o 512 KiB y devuelve los bytes tal cual para que puedan inspeccionarse las marcas de orden de bytes y las codificaciones. Antes de cada conexión resuelve él mismo el nombre de host y rechaza las direcciones privadas, locales y reservadas. Todo lo demás —análisis, coincidencia, validación— ocurre en tu navegador.
