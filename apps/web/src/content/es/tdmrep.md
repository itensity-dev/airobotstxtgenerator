---
title: "Generador TDMRep: tdmrep.json y cabecera tdm-reservation"
description: "Genera tdmrep.json, las cabeceras HTTP tdm-reservation y tdm-policy y metaetiquetas HTML para reservar la minería de textos y datos (art. 4 Directiva 2019/790)."
h1: "Generador de TDMRep"
nav: "TDMRep"
lead: "Crea los archivos del TDM Reservation Protocol (TDMRep), una especificación de un Community Group del W3C para declarar, de forma legible por máquina, que te reservas los derechos de minería de textos y datos conforme al derecho de autor de la UE."
steps:
  - "Elige `tdm-reservation: 1` para reservar tus derechos, o `0` para declarar que no los reservas."
  - "Si quieres, añade la URL de una `tdm-policy`: un documento legible por máquina que explica cómo obtener una licencia."
  - "Publica `/.well-known/tdmrep.json` en la raíz de tu sitio, añade las cabeceras HTTP o las metaetiquetas HTML, o haz ambas cosas."
  - "Mantén las reglas de robots.txt para los rastreadores que quieras detener: TDMRep reserva derechos, no bloquea nada."
capabilities:
  - feature: "Archivo para todo el sitio"
    status: "yes"
    note: "`/.well-known/tdmrep.json` con `location`, `tdm-reservation` y `tdm-policy`."
  - feature: "Cabeceras y metaetiquetas por respuesta"
    status: "yes"
    note: "`tdm-reservation` y `tdm-policy` como cabeceras HTTP (fragmentos para nginx y Apache) y como etiquetas HTML `<meta>`."
  - feature: "Asesoramiento jurídico"
    status: "no"
    note: "Que una reserva sea efectiva depende del derecho nacional y de los hechos. Esta página es información, no asesoramiento jurídico."
faq:
  - q: "¿Qué es TDMRep?"
    a: "El TDM Reservation Protocol, publicado por un Community Group del W3C (informe final de 2024). Define cómo puede expresar un titular de derechos —en un archivo, una cabecera HTTP o el HTML— que se reserva la minería de textos y datos de su contenido, tal como permite el artículo 4, apartado 3, de la Directiva (UE) 2019/790."
  - q: "¿Necesito TDMRep si ya bloqueo los rastreadores de IA en robots.txt?"
    a: "robots.txt dice quién puede obtener el contenido; TDMRep dice qué puede hacerse con él, lo haya obtenido quien lo haya obtenido. El Código de buenas prácticas de IA de uso general de la UE compromete a los firmantes a seguir robots.txt y otros protocolos adecuados legibles por máquina; publicar ambos es la opción de máxima precaución."
  - q: "¿Qué empresas de IA leen TDMRep?"
    a: "El soporte es limitado y rara vez está documentado. Lo usan editores europeos y algunos proveedores de datos; la mayoría de los grandes desarrolladores de IA solo documentan robots.txt. Tómalo como una declaración adicional y estandarizada de tu reserva."
related: ["content-signals", "guide-eu-ai-act", "meta-tags", "home"]
updated: "2026-11-04"
---

## Dónde encaja TDMRep

La Directiva (UE) 2019/790 permite la minería de textos y datos de contenido al que se accede de forma lícita, salvo que el titular de derechos se la haya **reservado expresamente** de manera adecuada —por ejemplo, por medios de lectura mecánica— en el caso del contenido publicado en línea. robots.txt es uno de esos medios; TDMRep es otro, diseñado específicamente con este fin. Un archivo `tdmrep.json` puede cubrir todo el sitio o partes de él (patrones `location`), las cabeceras pueden cubrir cualquier tipo de archivo, incluidos PDF e imágenes, y las metaetiquetas funcionan cuando solo controlas el HTML.
