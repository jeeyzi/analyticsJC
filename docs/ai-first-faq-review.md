# AI-First + FAQ — revisión incremental

13/10/2026, America/Santiago. Base Git `751bbb3`, checkout limpio al iniciar. Autorización: solicitud explícita adjunta de José para estas dos secciones sobre el repositorio actual; adopción limitada de las fuentes para contenido local. Sin publicación.

Revisados AGENTS, decisions, handoff-review, strategy, product, wireframe, content, design, technical, measurement, acceptance raíz/referencia, validation-report y todas las revisiones anteriores. La matriz raíz sigue siendo canónica. Fuentes estratégicas, copy y diseño se conservan; esta revisión registra la excepción adoptada y los subcasos aplicables, sin cambiar estados globales.

## Decisión explícita de esta fase

| ID | Estado | Fuente / responsable / alcance |
| --- | --- | --- |
| AF-01 | CERRADO: AI-First después de Experience y antes del FAQ. | José, respuesta explícita 13/10/2026: «Después de Experience y antes del FAQ, como indica la solicitud». Resuelve el conflicto con product/wireframe §05 y el comentario de content que lo ubicaban dentro de Process. Cambia únicamente esta ubicación; no reescribe ni adopta nuevos claims. |

## Interpretaciones y puertas

| ID | Clase | Interpretación / condición | Responsable / puerta |
| --- | --- | --- | --- |
| AF-02 | SAFE ASSUMPTION | AI-First usa título y dos párrafos literales de content: validación/documentación, apoyo a análisis/documentación/QA y supervisión humana. H2 después de Experience, bloque de lectura sin CTA ni ancla comercial nueva. No lista de monitoring, anomalías, velocidad u otras capacidades sin copy aprobado. | Codex; alcance local |
| AF-03 | SAFE ASSUMPTION | Product/wireframe/technical/acceptance exigen FAQ visible sin acordeón: H2 y tres H3 con respuestas completas, apilados en columna de lectura. Sin estados expandido/colapsado, botones o Client Component innecesarios. | Codex; R-04/FAQ y B-04 parciales |
| AF-04 | SAFE ASSUMPTION | Section, Container, typography y tokens existentes. Sin tarjetas para párrafos, visual conceptual prescrito para AI-First, iconos, animaciones ni dependencias nuevas. No reutilizar el diagrama de Solution como visual de IA. | Codex; presentación local |
| AF-05 | DECISION NEEDED | Strategy distingue procesos IA operativos de capacidades planificadas. Se conserva el copy solicitado, pero esta ejecución no verifica operaciones de consultoría ni acredita ventajas medidas. José debe verificar prácticas publicables antes de lanzamiento. | José; veracidad comercial de lanzamiento, no render local |
| AF-06 | FUTURE | Agencias, diagnóstico, backend, privacidad final y medición no se implementan. Puertas HN-04/HERO-01 intactas. | José/Codex en fases autorizadas |

## Implementación y aceptación afectada

AIFirst y FAQ son Server Components; copy centralizado en site.aiFirst/site.faq. Única modificación de composición: Experience → AIFirst → FAQ. Ningún archivo de sección anterior modificado. AF-01 altera el subcaso N-02 de esta fase únicamente para situar esta nota después de Experience; las anclas canónicas conservan su orden relativo y #preguntas aparece una sola vez. Agencias/diagnóstico siguen pendientes. B-01, B-03/04/06/07, R-01/02/04, A-01/02/04/05 y M-11 se desglosan en validation-report por sufijo /AIFirstFAQ. No PASS global ni aprobación de release.

Evidencia en `evidence/ai-first-faq/`. Pruebas locales no acreditan procesos IA reales, lector, WCAG integral, dispositivos físicos, GA4, captación, producción o campo.
