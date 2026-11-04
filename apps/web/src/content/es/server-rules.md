---
title: "Bloquear bots de IA en el servidor: nginx, Apache, Caddy"
description: "Reglas de servidor que devuelven 403 a los bots de IA por User-Agent (nginx, Apache, Caddy, Cloudflare, Express, Next.js, Django, PHP) y verificación por IP."
h1: "Bloquear rastreadores de IA en el servidor"
nav: "Reglas de servidor"
lead: "robots.txt solo pide; estas reglas hacen que tu servidor rechace a los rastreadores de IA por su User-Agent. Elige un servidor y los agentes que quieres bloquear, copia la regla y verifica los bots auténticos por IP o DNS inverso."
steps:
  - "Elige tu servidor o framework: nginx, Apache, Caddy, Cloudflare WAF, Express, Next.js, Django o PHP."
  - "Elige los agentes: solo los rastreadores de entrenamiento, todos los agentes de IA o tu propia selección del registro."
  - "Elige el código de respuesta: `403 Forbidden` es la señal más clara; `404` o `410` ocultan que estás bloqueando."
  - "Pega la regla donde indican los comentarios, recarga el servidor y comprueba con `curl -A \"GPTBot\" -I https://your-site/`: deberías obtener el código que elegiste, mientras `/robots.txt` sigue accesible."
capabilities:
  - feature: "Omite los tokens exclusivos de robots.txt"
    status: "yes"
    note: "Google-Extended, Applebot-Extended, FirecrawlAgent y `__usage_ai-training` nunca aparecen en una cabecera User-Agent, así que se dejan fuera en lugar de generar reglas inútiles."
  - feature: "Nunca bloquea buscadores ni vistas previas de enlaces"
    status: "yes"
    note: "Googlebot, Bingbot, Applebot y facebookexternalhit no se ofrecen en los ajustes predefinidos; los nombres comunitarios genéricos (Code, Spider, OpenAI…) se dejan fuera para no bloquear tráfico que no tiene nada que ver."
  - feature: "Mantiene /robots.txt accesible"
    status: "yes"
    note: "Todas las reglas excluyen `/robots.txt`, para que los rastreadores puedan seguir leyendo tu política."
  - feature: "Detiene bots falsificados o no declarados"
    status: "no"
    note: "La coincidencia por User-Agent solo detiene a los bots que se identifican. Para los bots que usan el User-Agent de un navegador hacen falta límites de frecuencia, gestión de bots o reglas por IP."
  - feature: "Longitud de la expresión de Cloudflare"
    status: "partly"
    note: "Las expresiones de las reglas personalizadas tienen un límite de 4096 caracteres; la herramienta avisa cuando una selección es demasiado larga."
faq:
  - q: "¿Debo bloquear los rastreadores de IA en robots.txt o en el servidor?"
    a: "En ambos, por motivos distintos. robots.txt es la forma documentada y legible por máquina de expresar tu decisión —es a lo que remite el Código de buenas prácticas de IA de uso general de la UE— y los rastreadores que se portan bien lo respetan. Las reglas de servidor hacen cumplir esa decisión frente a los rastreadores que ignoran robots.txt u obtienen páginas en nombre de un usuario."
  - q: "¿Puede un bot esquivar el bloqueo por User-Agent?"
    a: "Sí, enviando otro User-Agent. Por eso los operadores publican rangos de IP o firman sus peticiones: así puedes permitir solo las peticiones auténticas de un bot en el que confías, o bloquear un bot por su red. La tabla de abajo recoge todas las listas de IP y nombres de host publicados."
  - q: "¿Bloquear con un 403 perjudica mi SEO?"
    a: "No, si solo bloqueas agentes específicos de IA. Nunca bloquees así Googlebot, Bingbot ni Applebot; Google-Extended y Applebot-Extended controlan el uso para IA sin tocar la búsqueda."
  - q: "¿Qué código de respuesta debería usar?"
    a: "`403 Forbidden` indica claramente que se deniega el acceso. Algunos propietarios de sitios prefieren `404` o `410` para que el rastreador no registre nada útil. Los tres impiden que se entregue el contenido."
related: ["server-nginx", "server-apache", "server-cloudflare", "bots", "guide-bad-bots"]
updated: "2026-11-04"
---

## Cómo se crean las reglas

Las reglas salen del mismo [registro](page:bots) que el generador. Para cada agente seleccionado tomamos las subcadenas que su operador documenta en la cabecera User-Agent (por ejemplo `GPTBot` o `ClaudeBot`), eliminamos los duplicados y los nombres que ya cubre otro más corto, y escribimos una coincidencia sin distinción de mayúsculas para tu servidor. Los agentes que solo son tokens de robots.txt se omiten con una nota, porque ninguna petición lleva su nombre.

## Verificar que un bot es auténtico

Una cadena User-Agent es solo texto, y las peticiones falsas de «GPTBot» o «Googlebot» son habituales. Los operadores ofrecen tres formas de demostrar que una petición es real:

- **Listas de IP**: archivos JSON con los rangos de direcciones que usa el rastreador (OpenAI, Anthropic, Perplexity, Google, Common Crawl, DuckDuckGo y otros). Compara la IP del cliente con los rangos y actualiza la lista con regularidad.
- **DNS inverso**: busca el nombre de host de la IP del cliente, comprueba que termina en el dominio del operador (por ejemplo `googlebot.com` o `applebot.apple.com`) y después resuelve ese nombre de host en sentido directo y confirma que devuelve la misma IP.
- **Peticiones firmadas (Web Bot Auth)**: la petición lleva una HTTP Message Signature que puede comprobarse con la clave publicada por el operador (Exa, You.com, el agente de ChatGPT, algunas peticiones de Google-Agent).

Cada [página de bot](page:bots) incluye un fragmento de Node.js listo para usar con su método.
