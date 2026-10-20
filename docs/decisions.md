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

# Lead Flow MVP — Decisions

## H-10 — Limits, retries and retention

Status: PARTIALLY RESOLVED

Decisions:

- All form fields must have explicit server-side maximum lengths.
- The request payload must have an explicit maximum size.
- The browser must not perform automatic submission retries.
- Each submission must receive a unique `submission_id`.
- Retries of the same submission must reuse the same `submission_id`.
- Backend processing must be idempotent.
- The same `submission_id` must never create multiple leads.
- QA data must use short-lived/test retention.
- Production retention remains unresolved until the privacy policy and operational retention policy are approved.

Open:

- Final production retention period.
- Final operational retention policy.

---

## H-11 — Form response states

Status: RESOLVED

The form must distinguish these states:

1. `validation_error`
2. `recoverable_error`
3. `unconfirmed_reception`
4. `confirmed_success`

A timeout must NOT automatically be treated as definitive submission failure.

### Confirmed success

Title:

`Solicitud recibida`

Message:

`Recibimos correctamente tu información. Te indicaremos el siguiente paso utilizando los datos de contacto proporcionados.`

### Unconfirmed reception

Title:

`No pudimos confirmar la recepción`

Message:

`La solicitud pudo haberse recibido, pero no logramos confirmarlo. Puedes volver a intentarlo sin necesidad de completar nuevamente la información.`

### Recoverable error

Title:

`No pudimos enviar la solicitud`

Message:

`Tus datos se mantienen en el formulario. Intenta nuevamente.`

### Validation error

Title:

`Revisa los campos indicados`

Message:

`Hay información que necesitamos corregir antes de enviar la solicitud.`

---

## H-14 — Operational history

Status: RESOLVED

Store only the minimum operational history required to diagnose lead processing.

Allowed operational fields:

- `submission_id`
- `lead_id`
- `status`
- `created_at`
- `updated_at`
- `attempt_number`
- processing timestamps
- provider/result code when applicable
- sanitized error code

Rules:

- Do not duplicate form PII in operational logs.
- Do not log form field values unnecessarily.
- Operational history must follow the final retention/governance policy once approved.

---

## QA Lead Receiver

Status: DECISION NEEDED

For QA, use a private receiver controlled by José.

Requirements:

- Must not be exposed publicly on the website.
- Must be configured server-side.
- Must use environment variables when applicable.
- QA receiver must not be hardcoded into frontend code.

Production receiver remains pending until explicitly approved.

---

## Production Privacy / Retention

Status: BLOCKER FOR LAUNCH

The following remain unresolved:

- final privacy policy;
- final production retention period;
- final production lead receiver;
- final operational retention policy.

These items do not necessarily block isolated local/QA implementation,
but they block public production launch.

## Actualización explícita — Lead Flow con Google Sheets, 19/10/2026

Fuente: solicitud adjunta de José y respuestas en este chat. Esta sección sustituye únicamente las decisiones contradictorias del Lead Flow anterior; no adopta pendientes restantes ni acredita QA/producción.

- RESOLVED: Google Sheets privado es datastore principal del MVP y staging para futuras conversiones; reemplaza Supabase/PostgreSQL en este flujo. Dos datasets lógicos leads y offline_events; sus nombres físicos/configuración siguen pendientes. Sin DB adicional/CRM.
- RESOLVED: un formulario lógico con dos pasos. Paso 1 obligatorio: first_name, last_name, email, phone, company_name, company_type. Paso 2: monthly_ad_spend obligatorio (under_2000_usd / 2000_5000_usd / over_5000_usd), persistido como ad_spend; problem_to_solve opcional.
- RESOLVED por respuesta explícita: company_type = Empresa que capta leads / Agencia / Otro; problem_to_solve opcional. La correspondencia técnica lead_business / agency / other conserva los valores anteriores para las mismas categorías (interpretación documentada, no catálogo comercial nuevo).
- RESOLVED: submission_id canónico, estable entre pasos/reintentos; lead_id estable del registro; offline_event_id único por evento futuro; request_id solo correlación técnica. No deduplicar por email.
- RESOLVED: acceso exclusivamente servidor, POST /api/leads, validación y enriquecimiento, persistencia confirmada antes de accepted/éxito. Sin retries automáticos cliente, schedulers ni envíos offline en esta fase.
- H-11 RESOLVED: se mantienen literalmente los cuatro estados y textos de la solicitud: validation_error, recoverable_error, unconfirmed_reception y confirmed_success. H-14 RESOLVED documental para historial mínimo; implementación y retención no acreditadas.
- H-10 PARTIALLY RESOLVED: máximos explícitos requeridos. La nueva solicitud aporta referencias 100/100/254/150/2000 y aproximadamente 16 KB; no confirma política final de teléfono, timeout, retención ni protección pública. Ver interpretaciones locales LF2-LIMIT en lead-form-review.md; no cerrar H-10 íntegro.
- P0 condicionado a disponibilidad legítima: adquisición, IDs y consentimiento reales; no fabricar señales. Sin CMP implementada, snapshot DEFERRED. IP/UA no autorizados para persistencia. Datos de contacto privados, nunca GA4/dataLayer/logs/URL; normalización/hash por plataforma en fase futura.
- José confirma que todavía no existen Sheet/Service Account configurados; puede utilizar un Sheet de su cuenta personal. Esto no constituye receptor productivo ni credenciales configuradas.
- BLOCKER LF2-STORE: falta provisionar/configurar acceso QA. BLOCKER LF2-IDEM: falta mecanismo que garantice exclusión concurrente y replay tras respuesta perdida con Sheets. No sustituirlo por lookup+append o mutex local en un despliegue multiinstancia.
- Production Privacy / Retention continúa BLOCKER FOR LAUNCH. IP/UA, configuración física y operación siguen DECISION NEEDED. H-07/H-08/H-09 no cerrados. Medición y delivery permanecen desactivados.

Revisión autoritativa del cambio y conflictos: lead-form-review.md, google-sheets-schema.md y measurement-readiness.md. Los informes anteriores conservan valor histórico, no resultados vigentes de este nuevo formulario.

## Implementación real QA — 19/10/2026

Solicitud explícita de José: implementar integración server-side, leads primero, probar persistencia/replay reales, sin platform delivery. Autoriza configuración QA y solicitudes sintéticas; no producción. Receptor proporcionado por José y acceso lector acreditado en la sesión previa; pestañas físicas leads/offline_events verificadas. Se configura únicamente leads.

- RESOLVED LF2-STORE para QA: credencial externa al repo, Sheet privado facilitado, cabeceras creadas y escritura/lectura reales probadas. No receptor productivo aprobado.
- LF2-IDEM resuelto técnicamente para el flujo QA probado: addNamedRange con ID determinista de submission_id y appendCells en el MISMO batch atómico de Sheets; el ID duplicado rechaza el batch completo. No lookup+append desprotegido, mutex de proceso, cola ni DB adicional. Replay lee fila existente y devuelve lead_id original, conflicto de contacto409. Validación concurrente real y pérdida de respuesta inducida descritas en evidencia. No afirmar prueba de carga productiva.
- La solicitud adopta la implementación funcional de límites/validación/retries en este alcance: parámetros técnicos concretos documentados en revisión LF3, sin presentarlos como política de lanzamiento ni cerrar retenciones H-10.
- Estado operacional inicial received (technical), lifecycle_stage vacío hasta catálogo comercial; señales/consentimiento sin fuente válida vacíos. Sin IP/UA ni eventos GA4/Ads/Meta.
- Configuración solo servidor mediante GOOGLE_APPLICATION_CREDENTIALS (ruta externa), GOOGLE_SHEETS_SPREADSHEET_ID, GOOGLE_SHEETS_LEADS_TAB y LEAD_SHEETS_QA_ENABLED. .env.local ignorado por Git; ninguna clave copiada a código ni cliente. Nombres definidos ahora como parte de la integración solicitada, no credenciales inventadas.
- H-11 cuatro estados implementados. H-14 mínimos operacionales en leads y marcador técnico sin duplicar PII; no logs de contacto ni historial de valores. No schedulers/email.
- Production Privacy / Retention mantiene BLOCKER FOR LAUNCH; no cierres de H-07/H-08/H-09 ni garantías de producción.
