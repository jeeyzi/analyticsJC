# Header + Navigation — revisión incremental

Fecha: 10/10/2026, America/Santiago. Base: `0df3ab5`, checkout limpio al comenzar. Implementador: Codex. Decisiones: José Cubillo.

## Alcance y fuentes

Solicitud adjunta de esta fase: implementar exclusivamente Header + Navigation sobre Foundation y Design System. Adopción limitada de product/wireframe/content/design/technical para este componente; sin autorización de publicación ni adopción de decisiones operativas restantes. Leídos AGENTS, decisiones vigentes, handoff, strategy, product, wireframe, content, design, technical, measurement, acceptance raíz/referencia, foundation-review, design-system-review y validation-report. SHA256 de las siete fuentes coincide con source-manifest. No se modifican fuentes estratégicas ni matrices canónicas.

## Decisiones explícitas de esta fase

| ID | Estado / decisión | Fuente / responsable / alcance |
| --- | --- | --- |
| FND-02 | CERRADO para Header + Navigation: label visible «Menú»; nombre accesible «Abrir menú» cerrado y «Cerrar menú» abierto. | Respuesta explícita de José en este chat, 10/10/2026. No inferir elección de una fuente sobre otra. |
| HN-01 | CONFIRMADO: preparar enlaces y CTA en el componente y mostrarlos cuando existan sus destinos. | Respuesta explícita de José, 10/10/2026. No crear anclas vacías en la página normal ni secciones comerciales en esta fase. |
| HN-02 | SAFE ASSUMPTION: muestra sintética de QA bajo NODE_ENV=development + HEADER_NAVIGATION_PREVIEW=true, usando las cuatro anclas documentadas y títulos de navegación literales. | Codex; permite probar interacción sin implementar secciones. No son Solución/Proceso/Experiencia/formulario reales. Nunca producción. |
| HN-03 | SAFE ASSUMPTION: nav recibe nombre accesible «Menú», reutilizando el label explícitamente adoptado, sin inventar copy. Cambiar breakpoint restaura foco en un control visible si estaba dentro de nav. | Codex; accesibilidad localizada. Sin modal/drawer/focus trap. |
| HN-04 | PENDING: habilitar navigationReady en la composición real solo cuando existan los cuatro destinos con encabezado. | Codex al implementar fases autorizadas posteriores; bloquea aceptación integrada N-02/N-03/N-04/C-01, no pruebas del componente sintético. |
| HN-05 | FUTURE: enlazar Header completo por página al componer Home/privacidad/404 finales. | No expandir scope ni resolver FND-03 aquí. |

Los registros históricos FND-02 de foundation/Design System describen sus fases; este registro documenta su cierre vigente sin reescribir esas revisiones.

## Implementación

- Header permanece Server Component; Container existente, identidad José Cubillo a /#inicio (destino existente), fila y tamaños 64/80 mínimos, fondo blanco/borde/tokens existentes.
- HeaderNavigation contiene la interacción localizada: Button secondary, TextLink y ActionLink reutilizados. Un nav y una lista, sin duplicar DOM desktop/mobile. Bajo 1024 panel cerrado fuera del árbol accesible por display:none; abierto en flujo, CTA a ancho disponible. Desktop visible con gap 24.
- aria-expanded/controls con useId; abrir conserva foco; Escape y cierre explícito al botón; navegación cierra y enfoca encabezado, conservando href/hash y desplazamiento nativos. Activaciones modificadas conservan comportamiento del navegador. No tracking, dataLayer, almacenamiento, proveedor o dependencia nuevos.
- Layout solo habilita navegación en la muestra de desarrollo; página normal/build mantiene identidad y skip link. La muestra original de foundation no se amplía a Hero; muestra Design System existente intacta.
- Muestra de QA en components/development/HeaderNavigationPreview: cuatro encabezados sintéticos, aviso visible, sin formulario ni contenido comercial nuevo. Reproducir en PowerShell: `$env:HEADER_NAVIGATION_PREVIEW='true'; npm run dev`; quitar variable para revisión normal. NODE_ENV no se sobrescribe.

## Límites

Componente preparado y validado localmente en muestra sintética; navegación integrada de Home sigue pendiente de destinos reales. No declarar fase publicada o MVP terminado. No navegación a anclas inexistentes en build normal. Sin medición, backend, captación, GTM/GA4/CMP ni servicios simulados. QA en Chromium emulado, sin Safari/iOS/Android físico, lector de pantalla, axe ni zoom 200% real. Evidencia por subcaso en validation-report y evidence/header-navigation.
