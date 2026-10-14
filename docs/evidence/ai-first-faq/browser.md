# Navegador — AIFirstFAQ

13/10/2026. Windows, Chromium del Codex In-app Browser emulado. Build optimizado `http://127.0.0.1:3006/`. Base Git `751bbb3`, sin producción, formulario ni mock de recepción.

- responsive.json: 320/375/767/768/1023/1024/1280/1440 CSS px; scrollWidth=clientWidth, texto completo, orden y medidas registrados. ai-*.png y faq-*.png de los cinco anchos solicitados inspeccionados visualmente. Columna de lectura, H2/H3, gutters y spacing de tokens, sin controles ni targets nuevos.
- Captura inicial desplazada: Page.captureScreenshot ocultaba scrollbar y recalculaba el ancho/alto móvil, invalidando el clip medido antes. Se repitió con scrollbar oculto temporalmente para obtener clips y medidas estables; capturas finales corresponden al ancho exacto solicitado. También se observó ausencia de overflow con scrollbar en el muestreo previo. Preferencia, scrollbar y viewport restaurados. Intento de sincronizar con requestAnimationFrame no disponible en evaluate; descartado y sustituido por captura/inspección estable, sin modificar la página.
- copy.json: diez textos de AI-First/FAQ comparados con los bloques de content, igualdad literal y en orden, missing=[]/unexpected=[]. semantics.json: lang es, H1 único, H2 de método y FAQ, tres H3; regiones con nombres; #preguntas único. Experience→AI-First→FAQ según AF-01. Árbol accesible inspeccionado; no lector de pantalla.
- FAQ sin acordeón: tres respuestas block en todos los anchos, sin details, botones, aria-expanded ni controles nuevos. La lectura no requiere activación. Sin JS de interacción añadido. No aplica una prueba de expansión/colapso.
- keyboard.json / skip-focus.png: a 375px, Tab enfoca «Saltar al contenido» con foco visible y altura 50.4px; Enter actualiza #contenido y enfoca MAIN. End permite continuar lectura del FAQ sin ocultar respuestas. Tab/Shift+Tab continúan hasta el enlace de identidad, sin tabindex positivo ni controles de FAQ. No acredita menú/formulario/CMP finales.
- preferences.json / forced-colors.png: reduce mantiene cinco párrafos, animaciones none y scroll auto; forced-colors conserva respuestas visibles y legibles, blanco sobre negro. Overrides restablecidos.
- contrast.json: texto rgb(23,33,43) sobre rgb(248,250,252), 15.57:1; mismos colores de H2/H3 y párrafos observados. Sin nuevos estados interactivos que acreditar; no contraste global.
- network-console.json: 20 GET locales durante recargas/navegación; cero externos, excepciones Runtime y console entries. Logs warn/error vacíos, buffer no truncado. Sin POST, GTM, GA4 o píxeles observados. No prueba consentimiento ni medición activa.

Sin zoom real 200%, lector, axe/WCAG integral, móviles físicos, medición/performance de campo o servicios reales. La matriz global conserva NOT VALIDATED.
