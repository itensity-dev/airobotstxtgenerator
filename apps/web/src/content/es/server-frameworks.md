---
title: "Bloquear bots de IA en Express, Next.js, Django y PHP"
description: "Middleware para bloquear GPTBot, ClaudeBot y otros bots de IA por User-Agent en Express, Next.js (proxy.ts), Django y PHP/WordPress, sin bloquear robots.txt."
h1: "Bloquear rastreadores de IA en tu aplicación"
nav: "Frameworks"
lead: "Cuando no puedes cambiar el servidor web, bloquea los rastreadores de IA en la propia aplicación: middleware para Express, Next.js, Django y PHP o WordPress, generado a partir del registro."
steps:
  - "Elige el framework y los agentes, y copia el código."
  - "Express: registra el middleware antes de tus rutas. Next.js: guárdalo como `proxy.ts` en la raíz del proyecto (`middleware.ts` antes de Next.js 16). Django: añade la clase a `MIDDLEWARE`. PHP: incluye el archivo al principio de `index.php` o colócalo en `wp-content/mu-plugins/`."
  - "Despliega y prueba con `curl -I -A \"GPTBot\" https://example.com/`."
capabilities:
  - feature: "Sin acceso al servidor"
    status: "yes"
    note: "Funciona en plataformas en las que solo controlas el código (Vercel, Render, alojamiento PHP compartido)."
  - feature: "Archivos estáticos servidos por una CDN"
    status: "partly"
    note: "Las peticiones que responde la CDN o un servidor de archivos estáticos nunca llegan a tu middleware; bloquea también allí."
  - feature: "Rendimiento"
    status: "yes"
    note: "Una expresión regular compilada por petición."
faq:
  - q: "¿El middleware es tan bueno como una regla de servidor?"
    a: "Rechaza las mismas peticiones, pero más tarde: tu aplicación ya ha empezado a procesarlas. Las reglas de servidor o de CDN salen más baratas. El middleware es la opción adecuada cuando no puedes cambiar el servidor."
  - q: "¿El proxy de Next.js se ejecuta también para los recursos estáticos?"
    a: "Por defecto se ejecuta en todas las rutas; añade un `config.matcher` que excluya `_next/static` y las imágenes si quieres ahorrar invocaciones."
related: ["server-rules", "server-nginx", "server-cloudflare", "bots"]
updated: "2026-11-04"
---

## Cómo decide el middleware

Cada fragmento crea una única expresión regular, sin distinción de mayúsculas, a partir de los nombres de User-Agent de los agentes seleccionados, omite la ruta `/robots.txt` y responde a las peticiones que coinciden con el código de estado que elegiste y un breve mensaje de texto plano. Nada más cambia en tu aplicación.
