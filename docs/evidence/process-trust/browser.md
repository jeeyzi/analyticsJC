# Navegador — ProcessTrust

13/10/2026. Chromium Codex In-app Browser emulado, Windows. Build optimizado http://127.0.0.1:3005/; QA sintético preexistente http://127.0.0.1:3000/. Sin producción.

- responsive.json: anchos reales 320/375/767/768/1023/1024/1280/1440, scrollWidth=clientWidth. Cajas, orden, títulos, cuatro pasos y tres antecedentes registrados.
- process-*.png/trust-*.png: cinco tamaños solicitados inspeccionados visualmente. Muestreo inicial leyó viewport anterior y capturas durante smooth scroll; repetido tras repintado y scroll instantáneo. Evidencia final estable. Preferencia reduce y viewport temporales restablecidos.
- copy-semantics.json: missingCopy=[], H1 único/lang es, anclas únicas, OL decimal/UL disc. Build normal sin controles enfocables nuevos ni CTA roto. Árbol accesible revisado, sin lector.
- Contraste default texto rgb(23,33,43) sobre rgb(248,250,252): 15.57:1, incluidos marcadores. No estados nuevos en build normal.
- cta-qa.json/cta-focus.png: Tab/Shift+Tab, foco blanco+azul, altura 49.6px; Enter lleva a #diagnostico y foco en H2 sintético. Anclas QA únicas. Cero formularios; no recepción real.
- network-console.json: buffer completo sin truncamiento, cero excepciones Runtime y console warnings/errors; tráfico local sin destinos externos/POST/tags. No prueba consentimiento.

Sin zoom real 200%, lector, axe/WCAG integral, móviles físicos, performance, campo o servicios externos. Servidor build de esta sesión detenido al finalizar; servidor dev previo conservado.
