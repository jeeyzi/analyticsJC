# Navegador — Solution + Services

13/10/2026, America/Santiago. Chromium 155, Codex In-app Browser, Windows. Build optimizado local `http://127.0.0.1:3003/`, base b272782 + cambios locales. QA sintético existente en `http://127.0.0.1:3000/`, development + HEADER_NAVIGATION_PREVIEW=true. Sin deployment ni mocks de servicios.

## Responsive / visual

responsive.json final: 320,375,767,768,1023,1024,1280,1440 CSS px, altura 900px. clientWidth=scrollWidth en los ocho; ningún elemento visible de Solution desborda. Capturas finales full-page y por sección de los cinco anchos solicitados inspeccionadas: contenido íntegro, gutters/spacing/tipografía compartidos; títulos sin truncamiento ni alturas artificiales.

Diagrama vertical bajo 1024; tres nodos + dos desde 1024, siempre en orden Campaña/Lead/CRM/Oportunidad/Venta. Continuidad de la fila desde CRM a Oportunidad, sin cruzar texto. Servicios: cinco filas, título→descripción en móvil/tablet y dos columnas dentro de cada fila desktop, mismo orden DOM/visual. Sin grid de tarjetas, carrusel o destinos comerciales.

## Semántica / texto / preferencias

semantics.json: lang=es, H1 único; anclas inicio→problema→solucion únicas; H2 asociado a la región seguido de cinco H3. Diagrama OL de cinco nodos con aria-label textual exacto; condición de retorno en párrafo accesible. Ocho SVG decorativos aria-hidden=true/focusable=false, cuatro visibles según breakpoint. Lista UL de cinco capacidades. Sin controles/tabindex en Solution normal.

copy.json: todos los H2/H3/p de la sección cotejados contra content.md, missingCopy=[]. “Esquema conceptual” procede de design. No resultados, claims ni servicios nuevos.

contrast.json: texto/fondo 15.57:1, texto/nodo 16.29:1, conectores/fondo 4.55:1. Borde de nodo decorativo, sin significado exclusivamente cromático. CTA default en QA 6.70:1. No auditoría integral de estados.

preferences.json / forced-colors.png: reduced motion, scroll auto y ninguna animación; forced-colors preserva texto, nodos y relaciones visibles. Emulación y viewport temporal restaurados.

## Consola / Network / CTA

console.json final de build: warn/error=[]. Network CDP tras recarga final: diez GET locales, sin POST, recursos externos, GTM/GA4/píxeles ni excepciones Runtime; buffer sin truncamiento ni eventos pendientes. network.json. Ausencia de tags no acredita medición ni consentimiento.

cta-qa.json: Enter sobre el CTA de Solution lleva a #diagnostico y enfoca su H2 sintético; label literal, enlace nativo, alto 49.6px. Un #solucion real y un #diagnostico sintético, cero formularios. cta-qa.png guarda el destino. No acredita formulario/recepción ni C-01 completo. Home de build mantiene el CTA oculto hasta destino real.

Sin zoom real 200%, iOS/Android físico, lector de pantalla, axe/WCAG integral, performance, GA4, producción ni campo validados. El servidor QA ya existente se conserva; solo se detiene el servidor de build iniciado para esta fase.
