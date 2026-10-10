# Decision Log

Fecha: 10 de octubre de 2026 (America/Santiago). Fuente: confirmación explícita «si» de José Cubillo en Chat 09 a la tabla de recomendaciones y pregunta sobre stack, diagrama y form_start.

## Confirmado

- Next.js App Router + React + TypeScript strict.
- CSS Modules y tokens de design.md; Zod para validación.
- API same-origin en runtime Node; Supabase/PostgreSQL como receptor de solicitudes.
- Vercel como hosting previsto. No se han contratado planes ni creado infraestructura.
- Diagrama: Campaña → Lead → CRM → Oportunidad → Venta. Sin nodos adicionales de herramientas/analytics. Retorno de resultados a publicidad únicamente con la condición textual existente de content.md; no integración activa.
- form_start: una vez por instancia montada del formulario; no repetir en reintentos. Fallback antes del primer submit válido si no se detectó edición/autofill; nunca por foco.

## Alcance de la confirmación

Cierra H-12 y H-13. Cierra la elección del framework, estilos, validación, DB y hosting de H-03; planes, regiones, email, CMP y scheduler siguen pendientes. No adopta automáticamente todas las propuestas de los siete documentos (H-02), mensajes nuevos H-11, OG H-15, retenciones, consentimiento ni política de revocación.

No certifica implementación, build, QA, activación GA4 ni despliegue. Todos los criterios funcionales permanecen NOT VALIDATED.

## Autorización de foundation — 10/10/2026

Fuente: solicitud de José en este chat de revisar las fuentes y preparar framework, estructura, TypeScript, estilos, fuentes, tokens, layout, metadata y componentes mínimos sin construir toda la página ni integraciones publicitarias.

Se adopta el uso de las fuentes actuales para esa foundation local en `C:\Users\jose cubillo\Documents\AnalyticsJC`. H-01 queda resuelto para trabajo local; no hay repositorio Git ni remoto configurado. H-02 queda resuelto únicamente para los elementos de foundation solicitados, no para decisiones operativas pendientes de consentimiento, retención, parámetros de API o copy nuevo. No autoriza publicación.

Se conserva `acceptance.md` raíz como matriz canónica existente; `docs/acceptance.md` será una referencia a esa matriz, sin duplicar criterios. La revisión y las limitaciones de esta fase se registran en `foundation-review.md`.

## Autorización de Design System base — 10/10/2026

Fuente: solicitud explícita de José en este chat de implementar exclusivamente los primitives, tokens y componentes reutilizables de `docs/design.md`, sobre la foundation completada y validada. Se adopta esa fuente para este alcance local; H-02 no se cierra para el resto del MVP. No autoriza la Home completa, publicación, navegación funcional, formulario, backend, measurement, CMP ni integraciones.

Base actual verificada: commit `1a14f7f` (`chore: initialize website foundation`), checkout limpio al iniciar. La mención histórica de ausencia de Git en la revisión de foundation ya no describe el estado actual; no implica remoto/CI verificados.

Se permite una muestra local de desarrollo aislada, sin contenido comercial nuevo. Interpretaciones acotadas y subcasos de aceptación: `docs/design-system-review.md` y actualización incremental de `docs/validation-report.md`. FND-02/FND-03 y hallazgos H-* de fases posteriores conservan sus puertas.

