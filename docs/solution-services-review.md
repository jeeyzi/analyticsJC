# Solution + Services — revisión incremental

13/10/2026, America/Santiago. Base `b272782` (`feat: implement problem and impact sections`), checkout limpio al iniciar. Implementador: Codex. Decisiones comerciales y operativas: José Cubillo.

## Fuentes y autorización

Solicitud explícita adjunta: implementar únicamente Solution + Services sobre el repositorio actual. Adopción limitada de las fuentes vigentes para esta fase local; no publicación ni adopción de pendientes operativos. Revisados AGENTS, decisions, handoff-review, strategy, product, wireframe, content, design, technical, measurement, acceptance raíz/referencia, validation-report y revisiones de las cinco fases previas. Los siete SHA-256 coinciden con source-manifest. Las fuentes estratégicas, copy, diseño y matrices permanecen intactas.

## Reconciliación

| ID | Clase | Interpretación / condición | Responsable |
| --- | --- | --- | --- |
| SS-01 | SAFE ASSUMPTION | Product/wireframe §03 agrupan solución y cinco capacidades bajo `#solucion`. H2 de Solution, cinco H3 de Services; sin H2 “Servicios” ni ancla nueva no definida. Orden: explicación → diagrama/condición → capacidades → detalle técnico → alcance → CTA cuando disponible. El cierre de Impact conecta con el copy existente; no añadir una frase puente. | Codex; composición local |
| SS-02 | SAFE ASSUMPTION | Wireframe exige cinco filas compactas. Lista semántica, sin Card/CardGrid, destinos o hover. Desktop: título y descripción en columnas 5/7 de la cuadrícula de 12; bajo 1024, título seguido de descripción. Tokens de grid, typography, Container y Section existentes; sin alturas fijas. | Codex; interpretación acotada de filas, revisable |
| SS-03 | SAFE ASSUMPTION | H-12 ya cerrado: Campaña → Lead → CRM → Oportunidad → Venta. Desktop: tres nodos en primera fila y dos en segunda, con conector CRM → Oportunidad. Bajo 1024: vertical, permitido también para tablet. Etiqueta “Esquema conceptual” de design. Lista ordenada con nombre equivalente textual; SVG de conexiones decorativos. Retorno explicado solo con el texto condicional literal, sin dibujar una integración activa. | Codex; no nuevas herramientas/nodos |
| SS-04 | SAFE ASSUMPTION | Conservar HN-01/HERO-01: CTA exacto preparado, oculto en Home normal hasta existir `#diagnostico` real. `diagnosisReady` solo true en la muestra de desarrollo existente. Ajuste mínimo de HeaderNavigationPreview: omitir su destino sintético Solución cuando la sección real existe; mantener las otras tres anclas QA. Header/Hero/ProblemImpact sin cambios. | Codex; bloquea C-01 final, no contenido de esta fase |
| SS-05 | FUTURE | Agencias es §04 separado aunque figure dentro de Services en content. La solicitud limita a Solution + Services: no construir #agencias, Process, Trust, AI-First, FAQ, formulario, backend, tracking o integraciones. | José autoriza fases posteriores |

## Implementación y límites

SolutionServices y MeasurementJourney son Server Components. HTML/CSS con SVG ligero para conectores; sin iconos ni dependencia nueva. Todos los textos comerciales coinciden literalmente con content; GA4/GTM/CRM/BigQuery aparecen únicamente en el párrafo técnico aprobado. Su mención describe capacidades comerciales, no herramientas instaladas en esta web.

Evidencia final en `evidence/solution-services/`; subcasos `/SolutionServices` en validation-report. QA del CTA utiliza destino sintético, no captación. Sin certificación WCAG, lector, axe, zoom real, dispositivos físicos, performance, producción o campo. No se modifica el estado global de acceptance.
