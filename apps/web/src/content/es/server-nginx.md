---
title: "Bloquear bots de IA en nginx (map $http_user_agent)"
description: "Configuración de nginx para bloquear GPTBot, ClaudeBot, CCBot y otros bots de IA con un map sobre $http_user_agent: 403 para los bots y robots.txt accesible."
h1: "Bloquear rastreadores de IA en nginx"
nav: "nginx"
lead: "Un `map` sobre `$http_user_agent` marca una sola vez los rastreadores de IA en el bloque `http`; un `if` de dos líneas en cada bloque `server` les responde con un 403, mientras `/robots.txt` sigue abierto."
steps:
  - "Selecciona los agentes y copia la configuración."
  - "Pon el bloque `map` en el contexto `http {}`, por ejemplo en un archivo nuevo `/etc/nginx/conf.d/ai-bots.conf`, que la mayoría de las distribuciones incluyen automáticamente."
  - "Pon el bloque `location = /robots.txt` y las líneas `if ($is_ai_bot)` dentro de cada bloque `server {}` que deba rechazar a los rastreadores de IA."
  - "Ejecuta `nginx -t` para comprobar la sintaxis y después `systemctl reload nginx`."
  - "Prueba: `curl -I -A \"Mozilla/5.0 (compatible; GPTBot/1.4)\" https://example.com/` devuelve 403; `curl -I https://example.com/robots.txt` sigue devolviendo 200."
capabilities:
  - feature: "Coincidencia sin distinción de mayúsculas"
    status: "yes"
    note: "Cada línea usa `~*`, la expresión regular de nginx que no distingue mayúsculas y minúsculas."
  - feature: "Una sola lista para todos los sitios"
    status: "yes"
    note: "El `map` está en `http {}`, así que todos los bloques server pueden usar `$is_ai_bot`."
  - feature: "Uso seguro de if"
    status: "yes"
    note: "`if` con `return` es uno de los usos que nginx documenta como seguros dentro de `server`."
  - feature: "Funciona detrás de una CDN"
    status: "partly"
    note: "nginx ve el User-Agent que reenvía la CDN, normalmente el original. Los bots bloqueados en la CDN nunca llegan a nginx."
faq:
  - q: "¿Por qué un map en lugar de una condición if larga?"
    a: "nginx evalúa `map` de forma diferida y una sola vez por petición, la lista sigue siendo legible con un bot por línea y puedes reutilizar la variable en varios bloques server o en los registros (`access_log ... if=$is_ai_bot`)."
  - q: "¿Puedo registrar las peticiones de bots de IA en lugar de bloquearlas?"
    a: "Sí: mantén el `map` y sustituye el `if` por un registro aparte, por ejemplo `access_log /var/log/nginx/ai-bots.log combined if=$is_ai_bot;`."
  - q: "¿Cómo permito un bot solo desde sus direcciones IP reales?"
    a: "Usa el módulo `geo` con los rangos publicados por el operador, combínalo con el map de User-Agent y rechaza las peticiones que dicen ser el bot pero llegan desde otras direcciones. Los rangos cambian, así que actualízalos con un script."
related: ["server-rules", "server-apache", "server-caddy", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Dónde va cada parte

nginx lee la configuración por contextos. La directiva `map` solo se permite en `http {}`; las directivas `if` y `location` van en `server {}`. Si gestionas varios sitios, define el map una vez y añade las tres líneas a cada sitio. Pon `location = /robots.txt` antes de otros bloques location que puedan reescribir la petición o pasarla a un proxy: en nginx, un location de coincidencia exacta siempre gana.

Si nginx es un proxy inverso delante de una aplicación, la regla detiene la petición antes de que llegue a la aplicación, lo que además le ahorra recursos.
