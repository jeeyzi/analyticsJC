# Navegador — Hero, 13/10/2026

Chromium Codex In-app Browser; viewports emulados, sin dispositivo físico. Base `13fcac9` + working tree. URLs loopback 3000 (muestra sintética existente) y 3001 (build normal). Capturas inspeccionadas mobile y desktop; archivos *-qa muestran CTA hacia destino sintético y *-normal el alcance real sin CTA.

- Responsive: responsive-qa.json y responsive-normal.json, ocho anchos 320/375/767/768/1023/1024/1280/1440. scrollWidth = clientWidth en todas las filas; viewport innerWidth puede incluir scrollbar de 15px. Container/gutter 20/32/40, lectura máxima 760, primer bloque 40/56/72; H1 36–56, lead 18/20, body 16/18. Contenido completo, sin br, truncado o altura fija. CTA QA ≥49.6px alto y ancho completo móvil.
- Teclado QA a 375: identidad → Tab al botón Menú → Tab al CTA Hero (panel cerrado). Foco visible blanco 2px + azul 5px exterior; CTA dentro del viewport tras scroll nativo. Enter actualizó hash a #diagnostico y foco al h2 sintético id=diagnostico, título visible; clic de mouse también actualizó hash. Captura focus-qa.png. La navegación nativa no captura el envío ni genera lead. No acredita formulario real.
- Build normal: un H1, lang=es, region nombrada por H1, landmarks existentes; cero CTA del Hero y ningún destino sintético en DOM. Shift+Tab desde identidad al skip, foco inset azul; Enter al skip actualiza #contenido y enfoca main id=contenido.
- Preferencias QA: reduced motion + forced colors emulados. CTA al Tab: outline Highlight visible, boxShadow none, transition 0s, html scroll auto. Captura forced-colors-qa.png. Emulación retirada al finalizar.
- Texto al 200%: cambio temporal de font-size raíz a 200% (32px), posteriormente retirado. Build normal y CTA QA a 320/375/768/1024/1440: scrollWidth=clientWidth y copy íntegro. CTA multilínea crece hasta 193.6px sin recorte. text-200.json y cta-text-200-qa.json. Esto prueba aumento de texto; NO acredita zoom real del navegador al 200% ni R-03 global.
- Contraste de estilos usados: texto/H1 sobre fondo 15.57:1; captions 6.07:1; CTA default 6.70:1. contrast.json. No auditoría WCAG completa ni estados hover/active nuevos recertificados.
- Console warn/error=[] durante cargas, anchos, teclado y preferencias observados; console.json. Sin auditoría integral de otros flujos.
- Network del build tras reload: 10 GET locales, documento/CSS/JS/Inter; sin tags, píxeles, fuentes externas ni POST. network-normal.json no truncado. QA también observó GET locales (Next/HMR/DevTools/Geist); ausencia de integración no valida consentimiento ni GA4.

Restaurados tamaño de texto, emulación de preferencias y viewport al acabar. Limitaciones: sin lector de pantalla, axe, zoom real, Safari/iOS/Android físico, performance/campo o publicación.
