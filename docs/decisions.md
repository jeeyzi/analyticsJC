# Decision Log

## Cierre documental Web Measurement local/QA — 25/10/2026

Estado vigente de fase: **LOCAL / QA MEASUREMENT: VALIDATED**. Fuente: José confirma manualmente en este chat integración GTM+GA4 QA, cookies first-party Google, page_view automático (sin implementación manual), eventos web acordados, acquisition dinámica y persistencia de un lead real de QA con GA IDs. Evidencia aportada, no nueva ejecución del agente: `docs/evidence/acquisition/manual-final-qa-2026-10-25.json`. Se combina con pruebas previas del agente de arquitectura dataLayer, accepted/generate_lead, deduplicación, snapshot/retry/timeout y Sheets. Resuelve para QA los pendientes de origen real GTM/GA4/GA IDs de revisiones anteriores; no borra sus límites históricos ni cierra H-09 productivo.

Fuente única de identidad GTM confirmada: variable integrada Analytics Client ID; Analytics Storage → Session ID → Measurement ID específico de GA4. analytics_identity_ready entrega ga_client_id/ga_session_id a aplicación; no etiqueta/evento GA4. App recupera último par válido, acepta actualizaciones, congela IDs por submission y conserva retry; ausencia no bloquea Lead Flow. Columnas existentes Sheets persisten IDs junto a submission_id/lead_id, UTMs/click IDs disponibles y contacto privado. Sin get concurrente ni cookies parseadas por aplicación.

UTMs dinámicas, gclid, gbraid y wbraid validados end-to-end QA. Query antes de hash: `/?utm_source=test&utm_medium=test#diagnostico` soportado; `/#diagnostico?utm_source=test` no soportado. No nuevo parser de fragmentos ni cambio acquisition.

generate_lead.user_data conserva excepción QA restringida: email, phone_number, first_name/last_name (nombres en address del contrato existente); no mapeado a GA4. GA4 solo parámetros analíticos aprobados, sin GA IDs privados custom. Meta Pixel/_fbp/_fbc/fbp/fbc/CAPI sin fuente validada, vacíos y DEFERRED; no fabricar valores. Consent Mode/CMP, producción/tráfico productivo, delivery offline, Ads offline, Enhanced Conversions, Meta CAPI y GA4 MP NOT VALIDATED/DEFERRED. No production-ready ni nueva activación/publicación/cambio de código.

## GA identifiers mediante GTM — 25/10/2026

José confirma validación manual GTM Preview del evento técnico analytics_identity_ready con ga_client_id/ga_session_id reales; no dispara etiquetas intencionalmente. Autoriza consumo como fuente primaria única: GTM → dataLayer → aplicación → snapshot privado → /api/leads → columnas existentes Sheets. Sustituye estrategia gtag get/callback GoogleTagReady/espera500ms; se retira, sin fallback concurrente ni cookies. No cambia eventos web, user_data, adquisición ni persistencia.

Observador en memoria de documento (gates QA existentes): escanea último evento con par completo válido al iniciar, encadena push preservando array/this/argumentos/retorno para actualizaciones futuras, sin polling. Se rechazan ausentes/null/vacíos/templates; client string numérico con punto, session string de dígitos no cero o entero positivo seguro normalizado a string, límites privados existentes128. Actualización parcial inválida no reemplaza par ni mezcla sesiones. Interpretación técnica acotada documentada; no fabrica identificadores.

Al POST válido, copia síncrona de IDs actualmente disponibles dentro del mismo frozen JSON de contacto/acquisition/submission_id. Retry/timeout/replay conservan ese string; eventos posteriores solo afectan una futura submission. Ausencia retorna{} inmediatamente y no bloquea lead. No nuevo evento GA4 ni custom params IDs. Validación manual de fuente aportada por José no sustituye pruebas de aplicación/Sheets/Network.

## Actualización de seguridad Next.js — 23/10/2026

José solicita ejecutar `next upgrade --agent=security` y seguir sus instrucciones. CLI selecciona exactamente Next.js16.4.3 desde16.4.0; actualización dentro del mismo major, sin codemods ni adopción de Future Defaults. Política `experimental.agentUpgrade: "security"` registrada, npm y lockfile conservados. Actualización aislada en rama codex/next-security-16-4-3 y aplicada también al checkout local con cambios previos sin incorporarlos al commit aislado. No cambia UX, copy, GTM, adquisición, recepción ni autoriza despliegue. Ver docs/next-security-review.md y validation-report.md para evidencia y límites.

## Primer CTA del formulario y teléfono internacional — 21/10/2026

Precisiones de implementación: Chile de contacto fijo/móvil usa9dígitos nacionales (SUBTEL); los posibles9/10/11 de metadata general incluyen servicios especiales fuera de este campo de contacto. Los demás países usan possibleLengths de la API Metadata pública. Schema valida longitud por prefijo en números internacionales nuevos; conserva la regla QA previa8–15dígitos SIN prefijo para no invalidar replay de payloads antiguos. No les agrega ni infiere +56 y no altera normalización/replay. Country solo UI, sin columna nueva. Validación de longitud posible no certifica asignación/existencia/titularidad. Fuente: https://www.subtel.gob.cl/de-manera-exitosa-ya-opera-en-chile-la-nueva-forma-de-marcar-desde-telefonos-moviles/; biblioteca: https://github.com/catamphetamine/libphonenumber-js.

José solicita evento del primer CTA y prefijo/longitud de teléfono; confirma explícitamente: evento SOLO cuando datos válidos permiten avanzar a Step2; selector de países con Chile por defecto.

Adopción acotada: conservar click_to_action, ampliar su contrato con cta_id=continue_diagnosis, cta_location=form_step_1, target_id=diagnosis_step_2 y form_id=diagnosis_request. Son identificadores técnicos documentados para el control solicitado, no alias/nuevo evento ni conversión. Evento ocurre después de validación Step1 y antes de avanzar; Enter/mouse comparten único onSubmit. No emite en error, render, foco o POST final. Volver y continuar válidamente es otra activación real, no otro form_start ni lead.

Teléfono: países/prefijos/longitudes de libphonenumber-js/min versión exacta1.13.15; Chile seleccionado por defecto explícito de UI, no inferencia de residencia ni user_data.address.country. Selector pertenece al componente teléfono, no nuevo campo comercial/payload. Prefijo separado y listo; entrada nacional numérica acotada por país. Longitud y prefijo revalidados en schema compartido cliente/servidor. País no se persiste por separado; phone sigue único string internacional. No geolocalización ni enriquecimiento de dirección. Cambio de país conserva dígitos sin truncado silencioso: longitud incompatible se marca inválida hasta corregirla. Pegar un número internacional del país seleccionado elimina solo ese prefijo; prefijo diferente no cambia país automáticamente.

No modifica accepted/submission_id/retry/idempotencia/Acquisition/Sheets ni autoriza GA4/Ads/Consent productivo. Nueva biblioteca por necesidad del selector global, sin catálogos de numeración inventados ni regex nacional universal. No se valida existencia/propiedad del teléfono, solo estructura/longitud posible.

## Corrección React/HMR GTM — 21/10/2026

José reporta «Encountered a script tag while rendering React component» en RootLayout. La colocación nativa SSR anterior se sustituye: GtmHead es Client Component sin HTML (return null), cuyo useEffect instala bootstrap y contenedor vía createElement/appendChild directamente en document.head. El snippet aparece tras hidratación, no como script JSX/SSR. Sin next/script en body ni scripts ejecutables renderizados por React. Dedupe de documento, gates QA/local/loopback, dataLayer y exclusión productiva se conservan. Se verifica tanto recarga como Fast Refresh sin cambiar documento ni cargar dos veces. No modifica contrato comercial/GA4/Consent ni autoriza destinos nuevos.

## Corrección DOM head GTM — 21/10/2026

José muestra aviso de GTM indicando snippet en BODY y reitera que debe quedar en HEAD. Corrección de implementación de la decisión existente, sin nueva autorización de destinos: script HTML inline nativo dentro de head SSR, sin cola next/script que recree bootstrap en body; script externo insertado explícitamente en document.head. Mantener ID/gates/dedupe/dataLayer y exclusión producción. La evidencia HTTP anterior solo vio ID serializado en head, no demostró ubicación del script ejecutado; ese PASS de ubicación DOM queda sustituido por comprobación de etiqueta real/DOM. No cambia UI/Lead Flow/consentimiento.

## GTM head local/QA — 21/10/2026

RESOLVED por solicitud explícita de José: proporciona snippet de GTM-K5MZ4W66 y solicita colocarlo en head. Autoriza cargar ese contenedor en el local/QA existente; sustituye solo la prohibición anterior de loader externo para este alcance. No autoriza publicación, modificar tags/workspaces GTM, configurar GA4/Ads, transferir user_data ni inventar consentimiento. H-09 queda parcialmente resuelto (Container ID recibido); configuración/publicación/permisos/tag ready/GA4 y QA de destinos siguen pendientes.

Implementación acotada: NEXT_PUBLIC_GTM_ID configura el contenedor; GTM_QA_ENABLED=true + WEB_MEASUREMENT_QA existente + development/local habilitan loader en root head vía Next Script beforeInteractive. Guard adicional loopback y script único; mismo dataLayer, sin segunda config/gtag.js. Sin noscript remoto por no solicitarse y requerir gate independiente. Producción excluye loader aun con flags. No se considera Google tag ready por cargar GTM. QA de carga inicial sin datos de formulario; sin reenvío de contacto ni leads sintéticos a plataformas por esta validación. Consent seis campos DEFERRED.

## Web Measurement local/QA — 20/10/2026

RESOLVED por solicitud explícita de José (adjunto «Quiero actualizar y cerrar las decisiones de Web Measurement…», esta sesión). Autoriza comenzar implementación local/QA; sustituye propuestas incompatibles de measurement/technical/AGENTS/acceptance, sin borrar evidencia histórica. Contrato vigente detallado en web-measurement-review.md.

- V1: page_view automático Google Tag/GA4; aplicación solo click_to_action, form_start, form_error, form_submit, generate_lead. Excluidos site_page_view, page_view manual, send_page_view=false, service_view, faq_interaction y eventos adicionales. Navegación automática real de Next y duplicados pendientes QA externo.
- Sin measurement_version en dataLayer/GTM/GA4. page_type=home para eventos Home. Abstracción única tipada Application → dataLayer → GTM → GA4; sin calls de eventos a plataformas en componentes.
- form_start: primer cambio real (no foco), fallback antes de primer POST válido, una vez por interacción lógica; Step2, volver, error, retry y remount no significativo no reinician. Formulario único actual: guarda por documento/form_id, sin almacenamiento persistente. Nueva interacción intencional requerirá definición si se añade UI para otra solicitud.
- form_submit solo inmediatamente antes de POST válido; initial/retry. Continuar inválido puede emitir form_error, nunca form_submit. field_name corresponde a ocho campos actuales/multiple/none. error_code: required/invalid_format/invalid_option/too_long/multiple_validation_errors/server_validation/recoverable_error/unconfirmed_reception. Interpretación acotada del catálogo error_type ejemplificado: validation (cliente), server (422), reception (otros fallos); errores resumidos una vez por intento.
- generate_lead solo tras accepted estricto de submission activa y persistencia confirmada; Set de lead_id por documento evita duplicados/replay/remount. lead_id autorizado como parámetro GA4, no user_id/persona ni dimensión custom inicial. company_type y monthly_ad_spend usan enums existentes, autorizados para GA4; no value/currency.
- EXCEPCIÓN LOCAL/QA a prohibición previa de PII en dataLayer: generate_lead puede contener user_data.email/phone_number/address.first_name/address.last_name proporcionados. Estructura restringida: nunca GA4, logs, URL ni otras plataformas. Sin company_name/problem_to_solve/geografía/hashing. Se autoriza diagnóstico local con sintéticos sin inventar consentimiento. No habilita GTM/GA/Ads ni producción. dataLayer es memoria compartida accesible a scripts: no constituye aislamiento de seguridad; sin scripts de terceros en esta fase.
- GA IDs: get oficial client_id/session_id mediante mismo dataLayer/tag, ready real, espera total máxima500ms. Sin esperar readiness/polling, sin cookie parsing/fallback. Ausencia/error no bloquea lead. Contexto opcional privado ga se congela con submission, persiste en columnas existentes, replay no actualiza. collected_at no se añade a Sheet: lectura justo antes del primer POST, IDs string; no nueva columna ni timestamp ficticio.
- H-09 abierto: sin contenedor/propiedad/configuración real no loader ni llamadas externas activadas; mapping GA4 preparado como allowlist local, NOT VALIDATED externo. Consent seis campos DEFERRED. H-07/H-08 y Privacy/Public Launch siguen abiertos. No Enhanced Conversions, CMP, hashing, Meta, Ads, MP, sGTM, BQ, CRM ni delivery offline.

WM-01/02/03/04/05 de revisión previa quedan resueltos para este alcance con las reglas anteriores. No se reabren stack, Sheets, idempotencia ni adquisición. Pruebas mock no acreditan proveedores; pruebas sintéticas Sheets deben distinguirse de GA real.

## Corrección valores Acquisition — 20/10/2026

RESOLVED por instrucción explícita de José: allowlist únicamente de nombres UTM y click IDs soportados, nunca catálogo de valores. Campañas nuevas no requieren despliegue. Sustituye la restricción de valores QA descrita abajo y en measurement. Valores UTM dinámicos string, máximo100 unidades UTF-16 antes/después de saneamiento, NFC/trim, defensa PII/formato. Click IDs dinámicos máximo512, preservados exactamente o descartados. Validación compartida y defensa adicional servidor contra contacto enviado. Fixtures QA son solo pruebas, no decisiones comerciales. Persistencia entre reloads no implementada; dependiente de Consent/CMP futura. Referrer conserva alcance QA previo, fuera de esta corrección. Sin activación productiva.

## Acquisition QA — 20/10/2026

Solicitud: capture → persist → associate, preservando baseline Sheets. Ante la pregunta explícita sobre excepción local/QA a la regla de consentimiento previo, José responde «excluir esa regla de momento». RESOLVED para esta fase local/QA: captura URL en memoria y asociación al lead sintético sin CMP. No inventar estados de consentimiento. No habilita producción ni delivery.

Interpretación acotada: primer contexto del documento conservado en memoria hasta recarga/cierre; navegación SPA/hash o eliminación posterior de query no lo modifica. Las columnas planas representan FIRST LANDING del documento, no first touch histórico ni sesión GA4 ni last-touch. No mezclar campos de distintas visitas. Navegación con carga completa reinicia contexto; persistencia entre documentos y retención siguen DECISION NEEDED.

Catálogo cerrado QA en src/lib/lead/acquisition.ts, separado de catálogo comercial pendiente. Solo UTMs sintéticas conocidas; referrer solo origin de example.org/example.com para pruebas, sin path/query/hash. Landing solo pathname propio permitido. Click IDs presentes, caracteres URL-safe y máximo defensivo512, sin transformación ni truncado; sintéticos prueban transporte, no validez de plataforma. Ausencia se omite en JSON y representa con celda vacía. Señales no permitidas se descartan sin impedir recepción.

Meta/GA y seis campos de consentimiento DEFERRED sin fuente real. H-07/H-08/H-09 y privacidad/retención productiva no se cierran. Sin cookies ni almacenamiento persistente navegador. Receptor productivo continúa deshabilitado.

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

## JSON GTM para eventos GA4 — 21/10/2026

Solicitud explícita de José: modificar GTM-K5MZ4W66_workspace3.json para configurar variables, activadores y etiquetas de los eventos creados hacia GA4. Adopción limitada a generar un archivo local importable en deliverables/gtm; destino real G-N0GCP60M3V leído del export, sin inventar propiedad/entorno. No publicación ni edición remota ni modificación frontend. Se mantiene contrato vigente events.ts, incluido CTA Continuar/form_id opcional; user_data excluido. Se desactivan captura automática de formularios y datos proporcionados en el export. Page_view automático original conservado; saneamiento previo y comportamiento SPA pendientes de configuración/QA externa, no se introduce otra config ni page_view manual. H-09 parcial: ID recibido no acredita firing/recepción. H-07/H-08/privacidad y lanzamiento siguen abiertos. Detalle, instrucciones y límites: deliverables/gtm/README.md.

## Herramienta Python local GTM API v2 readonly — 25/10/2026

Adopción explícita por solicitud de José en esta sesión: integrar Google Tag Manager API v2 con el entorno local mediante Python y OAuth 2.0 de aplicación de escritorio, exclusivamente https://www.googleapis.com/auth/tagmanager.readonly. Alcance separado de la aplicación Next.js: autenticación y renovación, almacenamiento cifrado Windows DPAPI fuera del repositorio, listados de cuentas/contenedores/workspaces/tags/triggers/variables/version_headers con paginación, errores 401/403/429 y prueba de conexión. No acciones de escritura, eliminación ni publicación; no cambios al sitio, instrumentación, dataLayer o configuración MCP.

Interpretación técnica acotada: tools/gtm_readonly usa venv/pip y lockfile propios; no sustituye npm del sitio. DPAPI de usuario actual bajo LOCALAPPDATA, sin fallback en claro; CLI muestra solo IDs/paths. SAFE ASSUMPTION: uso Windows con un proceso por almacén; versiones se listan como metadatos version_headers y variables como variables de usuario. BLOCKER GTM-API-07: creación/configuración del cliente Google Cloud y consentimiento requieren al propietario; no se fabrican ni reutilizan credenciales GA4/ADC. Guía y evidencia: tools/gtm_readonly/README.md, tools/gtm_readonly/validation.md. No autoriza activación ni release del sitio.

## Vercel Preview QA explícito — 25/10/2026

Solicitud actual de José adopta preparación de deployment QA real, sin lanzamiento productivo. Sustituye únicamente gates development/local para QA aprobado: NEXT_PUBLIC_SITE_ENV=qa, VERCEL_ENV=preview y QA_DEPLOYMENT_ENABLED=true. NODE_ENV conserva semántica de build de Next; no usar development en Vercel. Flags existentes de receptor, formulario y medición permanecen independientes. Producción bloqueada en build y receptor, incluso con flags QA. No CMP/Consent productivo ni nuevos destinos.

Credenciales privadas GOOGLE_SERVICE_ACCOUNT_JSON completas para Preview; archivo GOOGLE_APPLICATION_CREDENTIALS solo local, sin fallback a archivo en QA ni ante JSON inválido. Sheet/tab existentes configurables; offline_events no activo. Origen de receptor QA exige HTTPS, Origin/Host exactos y URL de deployment o branch aportadas por Vercel, además de gates; hostname no autoriza por sí solo. Sin URLs hardcodeadas.

Mantener noindex y exigir Deployment Protection configurado por propietario antes de probar; noindex no es control de acceso. Solo fixtures sintéticos y Sheet QA privado. H-03/H-04/H-05/H-06/H-07/H-08/H-10 y readiness productivo no se cierran. Fuente técnica y pasos: qa-deployment.md. Registro nuevo complementa snapshot, no reescribe fuentes históricas ni acredita URL desplegada.
