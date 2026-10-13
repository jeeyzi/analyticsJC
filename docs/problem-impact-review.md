# Problem + Impact — revisión incremental

Fecha: 13/10/2026, America/Santiago. Responsable: Codex. Autorización: solicitud explícita de José para implementar únicamente Problem + Impact en el repositorio actual. Adopción limitada de las fuentes vigentes para esta fase; sin publicación.

Base Git verificada: `40a9e71` (`feat: implement hero section`), checkout limpio al iniciar. Las cuatro fases anteriores están versionadas. Los siete SHA-256 del snapshot coinciden en esta ejecución.

## Reconciliación previa

Revisados AGENTS, strategy, product, wireframe, content, design, technical, measurement, decisions, handoff-review, acceptance raíz/referencia, validation-report y revisiones de Foundation, Design System, Header/Navigation y Hero. La matriz raíz permanece canónica. Las fuentes de negocio, copy y diseño no se modifican.

| ID | Clase | Interpretación / condición | Responsable |
| --- | --- | --- | --- |
| PI-01 | SAFE ASSUMPTION | Product y wireframe §02 agrupan problema e impacto bajo una única ancla `#problema`. Content §Impact solo define un párrafo, sin título. Implementar H2, introducción, tres H3 con su texto literal y cierre Impact dentro de la misma sección; sin segunda sección/ancla/título inventados. | Codex; composición local |
| PI-02 | SAFE ASSUMPTION | Wireframe pide tres bloques comparables; design §Cards restringe tarjetas a servicios, entregables o evidencia. Reutilizar CardGrid para tres bloques de texto sin Card, borde, iconos ni interacción; columnas 1/2/3 y orden DOM intacto. | Codex; composición local |
| PI-03 | SAFE ASSUMPTION | Cierre de Impact inmediatamente después de los síntomas, dentro del mismo container y con ancho de lectura existente. Usar section-content-gap para continuidad, sin padding de segunda sección ni copy puente añadido. | Codex; composición local |
| PI-04 | FUTURE | Solution, Services y resto de Home, CTA/destinos reales, formulario, backend, medición e integraciones permanecen fuera de alcance. HN-04/HERO-01 conservan sus puertas. | Codex/José en fases autorizadas |

## Implementación

Server Component ProblemImpact, Section y Container existentes, CardGrid y typography. CSS Module local solo para separación de contenido y bloques, con tokens existentes. Copy literal centralizado en site.problem y site.impact. Integración después de Hero; sin refactorizar Header/Hero, alterar dependencias o construir visualizaciones. El wireframe no prescribe recursos visuales para §02; el diagrama pertenece a Solution.

## Límites

Resultados por subcaso `/ProblemImpact` en validation-report. Evidencia local no acredita MVP completo, accesibilidad global, medición, proveedores, producción ni campo. No se recertifican fases previas por inferencia.
