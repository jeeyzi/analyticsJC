# Evidencia saneada — Header + Navigation

Fecha 10/10/2026, America/Santiago. Windows, Chromium Codex In-app Browser; localhost:3000, Next development, HEADER_NAVIGATION_PREVIEW=true. Base 0df3ab5 + cambios locales sin commit. Destinos sintéticos rotulados, sin formulario ni proveedor. No acredita producción ni Home completa. Observaciones recogidas mediante DOM snapshot, estilos/rectángulos calculados, teclado Playwright y CDP de navegador. Capturas desktop y móvil inspeccionadas durante la sesión; no se archivaron PNG.

## Responsive (R-01/R-02, subcaso Header)

| innerWidth | clientWidth / scrollWidth cerrado | Tipo | Altura header cerrado |
| --- | --- | --- | --- |
| 320 | 305 / 305 | Menú | 66.4 |
| 375 | 360 / 360 | Menú | 66.4 |
| 767 | 752 / 752 | Menú | 66.4 |
| 768 | 753 / 753 | Menú | 66.4 |
| 1023 | 1008 / 1008 | Menú | 66.4 |
| 1024 | 1009 / 1009 | Links | 80 |
| 1280 | 1265 / 1265 | Links | 80 |
| 1440 | 1425 / 1425 | Links | 80 |

Los 15px de diferencia corresponden al scrollbar vertical de Chromium; comparar scrollWidth con clientWidth, no exigir igualdad con innerWidth. Header position:static. Links 16px/500; identidad 18px/600; desktop gap 24. Desktop a 1024: enlaces 66.21/62.73/89.58px de ancho, CTA 245.54, todos >=48px de alto. Sin abreviar ni reducir fuente. Inspección visual: identidad izquierda, navegación/CTA derecha y sin solapamiento a 1024.

Menú abierto probado a 320,375,767,768,1023: clientWidth=scrollWidth en todos. Altura header 412px a 320 y 388px en restantes: expansión en flujo, no superpuesta al contenido. A 320, identidad 107.08×44; botón 84.85×49.60; links 232.80×48; CTA 232.80×73.60 (dos líneas completas). A 375 CTA 288×49.60; a 768 656.80×49.60. Panel blanco, sombra token existente; separación 24px. No elemento fixed, drawer ni overlay. No safe area de barra/modal aplicable; móvil físico pendiente.

## Teclado, semántica y estados (N-03/N-04, A-01/A-02/A-05 parciales)

- DOM: banner/header, nav llamado «Menú», lista de tres enlaces y CTA, main/footer existentes; un H1/lang es conservados. Botón nativo y enlaces nativos; no tabindex positivo. Panel cerrado display:none y ausente de snapshot accesible; desktop nav visible sin botón visible.
- Enter abre y deja foco en Menú: aria-expanded=true y aria-label=Cerrar menú. aria-controls=_R_ilb_ coincide con id del nav; identificador generado por React, no constante del contrato.
- Tab desde control→Solución; Shift+Tab desde Solución→Menú. Foco doble visible: blanco 2px + azul 5px exterior calculado. Escape desde Solución cierra, aria-expanded=false y foco en Menú. Click explícito de cierre abre/cierra correctamente en todos los viewports móviles anteriores.
- Space abre; Enter en cada enlace cierra y enfoca id destino. Hash/foco observados: #solucion/solucion, #proceso/proceso, #experiencia/experiencia, #diagnostico/diagnostico. Títulos visibles; top observado con reduce: 24.2,101.24,326.27,551.31px respectivamente. Los últimos destinos no alcanzan top 24 por límite de scroll al final, pero son visibles. Header estático no los oculta.
- Identidad activada vuelve a /#inicio existente. CTA desktop por mouse actualiza #diagnostico y enfoca diagnostico. No envío/lead/conversión.
- Breakpoint: foco en control móvil→desktop se mueve a Solución. Foco en Proceso desktop→375 se mueve a botón Menú cerrado tras corrección. Primera prueba perdió foco al body al ocultarse el link; corrección con referencia del foco dentro de nav, repetición PASS. No se atrapa Tab ni se añade modal.

## Contraste y preferencias (A-04/A-05 parciales)

Contraste WCAG mediante luminancia relativa sRGB de colores calculados: identidad #17212B/blanco 16.29; links y botón #1D4ED8/blanco 6.70; CTA blanco/#1D4ED8 6.70. Foco azul/blanco 6.70. Hover CTA calculado rgb(30,64,175), active rgb(30,58,138), coinciden con tokens. Hover/active ejecutados por CDP Input.dispatchMouseEvent, sin depender de ellos para usar el menú. No se declara medición de todos los estados de todo el MVP.

Emulación prefers-reduced-motion:reduce: scroll auto, transition 0s. Emulación forced-colors: foco outline Highlight (color calculado rgb(26,235,255), ancho 1.6 CSS px calculado por Chromium), box-shadow none. Operaciones anteriores disponibles. Emulaciones y viewport restaurados al finalizar.

## Console y Network (B-06/M-11 parciales)

Console warn/error tras carga, reload, menú, anclas, breakpoint y mouse: []. Sin warnings de hidratación observados. CDP Network.enable + cursor antes de reload: 21 requestWillBeSent GET, todos a http://127.0.0.1:3000; documento, CSS, scripts Next/HMR/DevTools y dos fuentes locales (Inter y Geist de DevTools). hasMore=false, truncated=false. Sin GTM/GA/píxeles ni proveedores externos en esta carga. No interpreta ausencia de tags como validación de consentimiento/analytics.

## Límites y errores de herramienta

Conexión inicial antes de servidor: ERR_CONNECTION_REFUSED; repetición con servidor activo PASS. Un intento de recuperar esa pestaña falló por política sobre el data: de la página de error; se abrió pestaña HTTP local nueva. body.press(Control+Home) no operó en el wrapper de navegador; se usó identidad.press(Control+Home), con captura desktop estable al comienzo. Una captura inmediata tras resize se tomó antes del repintado/scroll y se repitió con snapshot y Control+Home. No son fallos de navegación de la app; no se usa la captura transitoria como evidencia de responsive.

NOT VALIDATED: lector de pantalla, axe, zoom 200% real, iOS Safari/Android Chrome físicos y paisaje; sin JS con nav habilitada; Home/privacidad/404 completas, formulario, barra contextual, servicios reales, medición, performance, producción/campo. El panel móvil necesita JS para apertura; no se acredita aquí una navegación móvil sin JS.
