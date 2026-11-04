---
title: "AIRobotsTxtChecker: el bot que comprueba tu robots.txt"
description: "AIRobotsTxtChecker, el User-Agent de nuestro verificador de robots.txt: qué obtiene (solo /robots.txt), con qué frecuencia, desde dónde y cómo bloquearlo."
h1: "Nuestro bot verificador: AIRobotsTxtChecker"
nav: "Bot verificador"
lead: "Cuando alguien usa la comprobación en vivo de nuestro verificador de robots.txt, nuestro servidor obtiene una vez el /robots.txt de ese sitio con este User-Agent. Nunca obtiene nada más."
related: ["tester", "privacy", "about"]
updated: "2026-11-04"
---

## User-Agent

```
Mozilla/5.0 (compatible; AIRobotsTxtChecker/1.0; +https://airobotstxtgenerator.com/checker-bot)
```

## Qué hace

- Obtiene **solo** el `/robots.txt` del host que ha introducido un usuario; nunca páginas, imágenes ni sitemaps.
- Hace una petición por comprobación; los resultados se guardan en caché 10 minutos, así que repetir la comprobación del mismo host en ese tiempo no genera ninguna petición nueva.
- Sigue como máximo 5 redirecciones, espera como máximo 5 segundos y lee como máximo 512 KiB.
- Solo se conecta a direcciones IP públicas en los puertos 80 y 443.
- No es un rastreador: no sigue enlaces, no guarda tu archivo más allá de la caché ni lo usa para nada más.

## ¿Respeta robots.txt?

Lee robots.txt; no rastrea nada que robots.txt pueda regular. Igual que el agente con el que Google obtiene robots.txt, no aplica tu robots.txt al propio archivo robots.txt.

## Cómo bloquearlo

Si no quieres que tu robots.txt se compruebe a través de nuestro sitio, devuelve `403` al User-Agent `AIRobotsTxtChecker`, por ejemplo en nginx:

```nginx
if ($http_user_agent ~* "AIRobotsTxtChecker") { return 403; }
```

Preguntas o avisos de abuso: {{contact}}.
