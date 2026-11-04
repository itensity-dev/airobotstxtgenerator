---
title: "Bloquear bots de IA con una regla WAF de Cloudflare"
description: "Regla del WAF de Cloudflare para bloquear GPTBot, ClaudeBot y otros bots de IA por User-Agent sin bloquear robots.txt, y cómo encaja con AI Crawl Control."
h1: "Bloquear rastreadores de IA con una regla WAF de Cloudflare"
nav: "Cloudflare WAF"
lead: "Una expresión de regla personalizada para el WAF de Cloudflare que bloquea por User-Agent los rastreadores de IA que elijas, mantiene accesible `/robots.txt` y cabe en el límite de 4096 caracteres de Cloudflare."
steps:
  - "Selecciona los agentes y copia la expresión."
  - "En el panel de Cloudflare, abre tu dominio → **Security** → **WAF** → **Custom rules** → **Create rule** → **Edit expression** y pégala."
  - "Elige la acción **Block** (o **Managed Challenge**, si lo prefieres) e implementa la regla."
  - "Al cabo de un día, revisa **Security → Events** para ver qué agentes se han bloqueado."
capabilities:
  - feature: "Plan gratuito"
    status: "yes"
    note: "Las reglas personalizadas con `contains` y `lower()` están disponibles en todos los planes; `matches` con expresiones regulares requiere un plan de pago, así que la herramienta no lo usa."
  - feature: "Comprobación de la longitud de la expresión"
    status: "yes"
    note: "Cloudflare permite 4096 caracteres por expresión; la herramienta avisa y propone dividir la regla."
  - feature: "Sustituye a AI Crawl Control"
    status: "no"
    note: "AI Crawl Control, la función propia de Cloudflare, bloquea por categorías los rastreadores de IA verificados y puede escribir un bloque gestionado en tu robots.txt. Usa esta regla para los agentes que Cloudflare no cubre o cuando quieras un control exacto."
faq:
  - q: "Cloudflare ya bloquea los rastreadores de IA: ¿necesito esta regla?"
    a: "Quizá no. Desde julio de 2025, los dominios nuevos bloquean por defecto los rastreadores de IA, y desde 2026 Cloudflare ofrece ajustes separados para búsqueda, agentes y entrenamiento (Search, Agent y Training). Su lista cubre los bots verificados. Una regla personalizada añade agentes que no están en esa lista y bloquea por nombre, estén verificados o no."
  - q: "¿Por qué se excluye robots.txt?"
    a: "Para que los rastreadores puedan seguir leyendo tu política. Un rastreador que no puede obtener robots.txt no puede saber que lo has bloqueado."
  - q: "Cloudflare ha añadido líneas a mi robots.txt: ¿qué son?"
    a: "Es el robots.txt gestionado de Cloudflare (Bot Preference Sync): un bloque entre comentarios BEGIN y END, colocado antes de tus propias reglas, con líneas `Content-Signal` y `Disallow` para rastreadores de IA. Pega el archivo publicado en el [verificador](page:tester) para ver cómo se comporta el archivo combinado."
related: ["server-rules", "content-signals", "tester", "guide-bad-bots"]
updated: "2026-11-04"
---

## Sobre la expresión

Cada condición es `(lower(http.user_agent) contains "gptbot")`: el User-Agent se pasa a minúsculas y se busca en él el nombre del bot, así que las mayúsculas no importan. Las condiciones se unen con `or`, y todo el grupo se combina con `and not (http.request.uri.path eq "/robots.txt")`. Si también usas las funciones de bots verificados de Cloudflare, puedes añadir `and not cf.client.bot` para dejar los bots verificados en manos de los ajustes propios de Cloudflare.
