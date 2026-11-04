---
title: "Bloquear bots de IA en Caddy (Caddyfile header_regexp)"
description: "Regla de Caddyfile para bloquear GPTBot, ClaudeBot y otros bots de IA con un matcher sobre la cabecera User-Agent: 403 para los bots y robots.txt accesible."
h1: "Bloquear rastreadores de IA en Caddy"
nav: "Caddy"
lead: "Un matcher con nombre con `header_regexp User-Agent` selecciona los rastreadores de IA y excluye `/robots.txt`, y `respond` les contesta antes que cualquier otro handler."
steps:
  - "Selecciona los agentes y copia el fragmento."
  - "Pégalo dentro del bloque de tu sitio en el Caddyfile, antes de `reverse_proxy`, `php_fastcgi` o `file_server`."
  - "Ejecuta `caddy validate --config /etc/caddy/Caddyfile` y después `caddy reload --config /etc/caddy/Caddyfile`."
  - "Prueba con `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Expresión regular sin distinción de mayúsculas"
    status: "yes"
    note: "`(?i)` al principio del patrón hace que la coincidencia no distinga mayúsculas y minúsculas."
  - feature: "Orden de las directivas"
    status: "yes"
    note: "Caddy ordena las directivas por sí mismo; `respond` se ejecuta antes que `reverse_proxy` y `file_server`."
  - feature: "Configuración JSON"
    status: "partly"
    note: "El fragmento es para el Caddyfile; `caddy adapt` lo convierte a JSON."
faq:
  - q: "¿Puedo reutilizar el matcher en varios sitios?"
    a: "Sí: ponlo en un snippet —`(ai_bots) { … }`— y añade `import ai_bots` en cada bloque de sitio."
  - q: "¿Cómo registro las peticiones bloqueadas?"
    a: "Caddy registra cada petición con su código de estado; filtra el registro de accesos por el estado 403 y los User-Agents detectados."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Qué hace el fragmento

`@ai_bots` es un matcher con nombre: una petición coincide solo si se cumplen todas las condiciones que contiene, es decir, si la cabecera User-Agent coincide con la expresión y la ruta no es `/robots.txt`. `respond @ai_bots 403` termina esas peticiones de inmediato con una respuesta 403 vacía. Todo lo demás sigue hacia tus handlers habituales.
