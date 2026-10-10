# Checks — Design System base

10/10/2026, America/Santiago. Windows, Node 22.17.0 / npm 10.9.2. Base Git `1a14f7f`; modificaciones locales sin nuevo commit. Sin instalación/cambio de dependencias.

| Comando / método | Resultado |
| --- | --- |
| `npm run typecheck` sandbox | FAIL ambiental: SWC failed to canonicalize jsc.baseUrl, Acceso denegado (os error 5). |
| `npm run typecheck` fuera sandbox | PASS exit 0, tipos generados, tsc sin errores. |
| `npm run lint` | PASS exit 0, sin warnings. |
| `npm run build` sandbox | FAIL ambiental con el mismo error SWC. |
| `npm run build` fuera sandbox | PASS exit 0; rutas static `/` y `/_not-found`. |
| Build fuera sandbox con `DESIGN_SYSTEM_PREVIEW=true` | PASS exit 0; muestra excluida de HTML/RSC. No valida publicación. |
| SHA256 contra source-manifest | PASS 7/7 fuentes coinciden; no se modificaron especificaciones. |
| `git diff --check` | PASS; avisos informativos de normalización LF/CRLF de Git no son errores de whitespace. |

Servidor dev: loopback http://127.0.0.1:3000 con flag explícito. Un intento `npm run dev -- --port 3100` falló: npm/PowerShell pasó 3100 como directorio. Se inició con script dev estándar en 3000. La pestaña inicial 3100 dio connection refused; la muestra real se comprobó en 3000. No se cambió configuración ni se debilitó aislamiento. `next dev` añadió un bloque automático a AGENTS.md; retirado ese cambio generado al terminar. next-env fue regenerado por build y conserva su contenido inicial.

Browser QA: Codex In-app Browser/Chromium, viewports emulados; capturas 320/768/1024/1440 y estilos en ocho anchos. Network observado mediante CDP desde cursor previo a reload, GETs únicamente locales, sin POST/integraciones; incluye recursos HMR/DevTools (Geist local) de desarrollo. Console warnings/errors vacío en la ventana observada. No servicios reales, mocks, navegador móvil físico ni pruebas de campo.

`responsive.json`: primera serie acredita viewport/overflow/tipo/sección/controles; sus arrays grids/cards vacíos son selectores de CSS Modules no coincidentes. La serie cardMeasures usa display:grid e hijos reales y acredita columnas/padding/radio/sombra en 320/768/1024/1440. `keyboard.json` conserva el segundo recorrido estable tras screenshot, con reduced motion; todas las posiciones dentro del viewport y focus-visible. No se conserva como evidencia válida el muestreo previo al final de smooth scroll.

Contraste: calculado con luminancia relativa sRGB sobre estilos del DOM en estados presentes; no auditora axe ni todos los estados hover/active. Texto primary 6.70:1; disabled 5.64:1; input 16.29:1 y borde 4.76:1; error 6.18:1; ayuda 6.07:1. Borde disabled es decorativo/inactivo, no control operativo. No se concluye PASS global A-04.
