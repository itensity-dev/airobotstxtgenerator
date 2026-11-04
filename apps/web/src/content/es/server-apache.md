---
title: "Bloquear bots de IA con .htaccess (Apache mod_rewrite)"
description: "Reglas .htaccess para bloquear GPTBot, ClaudeBot, CCBot, Bytespider y otros bots de IA en Apache con mod_rewrite: 403 para los bots y robots.txt accesible."
h1: "Bloquear rastreadores de IA con .htaccess en Apache"
nav: "Apache .htaccess"
lead: "Tres líneas de `mod_rewrite` en `.htaccess` rechazan con un 403 a los rastreadores de IA según su User-Agent, excluyen `/robots.txt` y funcionan en alojamiento compartido sin acceso a la configuración principal."
steps:
  - "Selecciona los agentes y copia las reglas."
  - "Abre el `.htaccess` de la raíz de documentos (créalo si no existe) y pega el bloque cerca del principio, antes de las reglas de reescritura de WordPress o de tu framework."
  - "Guarda. No hace falta reiniciar: Apache lee `.htaccess` en cada petición."
  - "Prueba con `curl -I -A \"ClaudeBot\" https://example.com/` (debería devolver 403) y `curl -I https://example.com/robots.txt` (debería devolver 200)."
capabilities:
  - feature: "Alojamiento compartido"
    status: "yes"
    note: "Solo necesita `AllowOverride FileInfo` (activado en casi todos los proveedores) y `mod_rewrite`."
  - feature: "Configuración del servidor en lugar de .htaccess"
    status: "yes"
    note: "Las mismas líneas funcionan dentro de `<VirtualHost>` o `<Directory>`, y allí son más rápidas."
  - feature: "LiteSpeed y OpenLiteSpeed"
    status: "yes"
    note: "LiteSpeed lee las reglas de reescritura de Apache en `.htaccess`."
  - feature: "Alojamiento solo con nginx"
    status: "no"
    note: "nginx ignora `.htaccess`; usa las [reglas para nginx](page:server-nginx)."
faq:
  - q: "¿En qué parte del .htaccess va el bloque?"
    a: "Antes de otras reglas de reescritura. El bloque de WordPress termina con `RewriteRule . /index.php [L]`, que de lo contrario procesaría la petición primero."
  - q: "¿Qué significa [F,L]?"
    a: "`F` responde 403 Forbidden y `L` deja de procesar más reglas. `[G,L]` responde 410 Gone en su lugar."
  - q: "¿Puedo usar SetEnvIf en lugar de mod_rewrite?"
    a: "Sí: `SetEnvIfNoCase User-Agent \"GPTBot\" ai_bot` seguido de `<RequireAll> Require all granted Require not env ai_bot </RequireAll>` funciona sin mod_rewrite, pero necesitas una línea `SetEnvIfNoCase` por bot y una excepción aparte para `/robots.txt`."
related: ["server-rules", "server-nginx", "server-cloudflare", "tester"]
updated: "2026-11-04"
---

## Cómo funciona la regla

`RewriteCond %{REQUEST_URI} !^/robots\.txt$` excluye el archivo robots.txt. `RewriteCond %{HTTP_USER_AGENT} (GPTBot|ClaudeBot|…) [NC]` coincide con cualquiera de los nombres de la lista en cualquier parte del User-Agent, sin distinguir mayúsculas y minúsculas. Después, `RewriteRule ^ - [F,L]` rechaza la petición sin reescribir la URL. Todas las condiciones deben cumplirse para que se aplique la regla.

En WordPress, los plugins de caché a veces sirven las páginas antes de que se ejecute PHP, pero siempre después de `.htaccess`, así que el bloqueo también se aplica a las páginas en caché.
