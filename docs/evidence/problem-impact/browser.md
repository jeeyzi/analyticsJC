# Navegador — Problem + Impact

13/10/2026, America/Santiago. Chromium Codex In-app Browser emulado. URL `http://127.0.0.1:3002/` y `/#problema`, build optimizado local, sin deployment ni mocks de servicios. Base `40a9e71` más cambios locales.

## Responsive y revisión visual

Medidos 320, 375, 767, 768, 1023, 1024, 1280 y 1440 CSS px; altura de medición 900px. Capturas inspeccionadas en 320, 375, 768 y 1024 (full-page) y 1440 (viewport de 1000px, sección completa). Ver responsive.json y full-*.jpg/desktop-1440.jpg.

- scrollWidth = clientWidth en los ocho anchos; ningún texto ni sección desborda. Scrollbar vertical consume 15px del clientWidth: no se confunde con overflow horizontal.
- Grid: 1 columna bajo 768; 2 desde 768, tercera unidad conserva ancho; 3 desde 1024. Orden visual y DOM igual: cada H3 seguido por su párrafo. Sin carrusel ni cards: bloques informativos sin borde, sombra o affordance interactiva, según PI-02.
- Padding 56/72/96px; gap de contenido 24/32/40px; gap de grid 16/24/32px. Container y gutters compartidos, lectura ≤760px. H2 28px móvil, clamp 32–40px desde tablet; H3 22/24px y cuerpo 16/18px. Inter local.
- Títulos y párrafos largos completos. Introducción → síntomas/consecuencias → Impact dentro de una única sección; sin salto de padding de una segunda sección ni copy puente inventado. Hero/Header sin cambios.

## Semántica, contraste y consola

semantics-contrast.json: lang=es, un H1; orden H1→H2→H3/H3/H3, un #problema y aria-labelledby apunta al H2 existente. Home normal contiene únicamente #inicio/#problema. Texto completo coincide con content. Cero controles interactivos dentro de ProblemImpact y cero visuales/decorativos que requieran texto alternativo. No pruebas globales de teclado/lector/axe.

Texto #17212B sobre #F8FAFC: contraste calculado 15.57:1 para todo el contenido de esta fase. No estados de foco/hover nuevos. Console warn/error=[] durante cargas y redimensionamientos; sin excepciones en eventos CDP capturados. console.json.

Network CDP tras reload y cuatro recargas visuales: 50 GET locales, sin POST, GTM, GA4, píxeles ni destinos externos; buffer completo, sin truncamiento ni páginas pendientes. network.json. Esto acredita solo ausencia de integraciones en las cargas observadas; no consentimiento ni funcionamiento de medición.

Viewport temporal restablecido al finalizar. Sin zoom real 200%, iOS/Android físico, lector, axe, performance, producción o campo validados. Los criterios globales de acceptance mantienen sus estados.
