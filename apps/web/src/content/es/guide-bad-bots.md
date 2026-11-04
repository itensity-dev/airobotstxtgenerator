---
title: "Por qué robots.txt no te protege de los bots maliciosos"
description: "robots.txt es una petición, no un control de acceso: qué bots lo ignoran, por qué se falsifican los User-Agent y qué usar en su lugar (reglas de servidor, WAF)."
h1: "Por qué robots.txt no te protege de los bots maliciosos"
nav: "robots.txt frente a bots maliciosos"
lead: "robots.txt es un cartel en la puerta, no una cerradura. Funciona porque los rastreadores responsables deciden leerlo; no detiene a los scrapers a los que les da igual ni a los que se hacen pasar por otros."
related: ["server-rules", "tester", "bots", "guide-syntax"]
updated: "2026-11-04"
faq:
  - q: "¿Puede robots.txt hacer privada una página?"
    a: "No. Cualquiera puede abrir una URL bloqueada, y ponerla en robots.txt la da a conocer. Protege el contenido privado con autenticación."
  - q: "¿Cómo sé si un bot ignora mi robots.txt?"
    a: "Busca en los registros de tu servidor peticiones a rutas bloqueadas con el User-Agent de ese bot y verifica la IP: una petición desde fuera de los rangos publicados por el operador no viene del bot real."
  - q: "¿Debería bloquear sin más todo lo que parezca un bot?"
    a: "No: perderías los buscadores, las vistas previas de enlaces, los servicios de monitorización y las herramientas de accesibilidad. Bloquea por nombre cuando puedas, verifica cuando los operadores lo permitan y limita la frecuencia de todo lo demás."
---

## Qué es robots.txt

RFC 9309 lo dice claramente: las reglas «no son una forma de autorización de acceso». Un rastreador obtiene `/robots.txt`, lee el grupo que lo nombra y decide obedecer. Nada en HTTP obliga a cumplir esa decisión.

## Quién lo ignora

- **Scrapers y recolectores de datos** que nunca han pedido permiso. Muchos usan User-Agents de navegador normales.
- **Agentes que actúan para un usuario.** OpenAI, Perplexity, Google y Meta dicen que sus agentes activados por usuarios (`ChatGPT-User`, `Perplexity-User`, `Google-Agent`, `meta-externalfetcher`) pueden no seguir robots.txt, porque una persona pidió la página. Anthropic dice que su `Claude-User` sí lo sigue.
- **Rastreadores que no publican ninguna política**: `Bytespider`, por ejemplo, no tiene documentación oficial, y hay propietarios de sitios que han informado de que ignora robots.txt.
- **Impostores.** Cualquiera puede enviar `User-Agent: GPTBot` o `Googlebot`. Los User-Agents falsos de buscadores son una forma clásica de esquivar bloqueos ingenuos.

## Qué revela robots.txt

El archivo es público. Una línea `Disallow: /admin-backup-2024/` le dice a todo el mundo que esa ruta existe. No enumeres secretos: protégelos.

## Qué usar en su lugar, o además

| Medida | Detiene a | Notas |
|---|---|---|
| robots.txt | Rastreadores que lo respetan | La señal estándar y documentada. Mantenla. |
| [Reglas de servidor](page:server-rules) por User-Agent | Bots que se identifican | Barato y eficaz con los rastreadores de IA conocidos por su nombre |
| Verificación por IP o DNS inverso | Impostores que dicen ser un bot conocido | Usa los rangos publicados por el operador; consulta cada [página de bot](page:bots) |
| Limitación de frecuencia | Scrapers de gran volumen, se llamen como se llamen | Por IP o por red; protege el servidor |
| Gestión de bots de la CDN / WAF | Redes maliciosas conocidas, automatización de navegadores | Cloudflare, Fastly, Akamai y otros clasifican los bots |
| Autenticación | Cualquiera que no tenga cuenta | La única protección real para el contenido privado |

## Un orden sensato

1. Publica un robots.txt honesto: documenta tu decisión y es a lo que remite el Código de buenas prácticas de la UE.
2. Bloquea por nombre, en el servidor o en la CDN, los agentes de IA que no quieras.
3. Verifica los bots que permites, para que se rechace a los impostores que usan sus nombres.
4. Limita la frecuencia de todo lo demás y vigila tus registros.
