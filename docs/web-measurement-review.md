# Web Measurement — contrato e implementación local/QA

## Estado vigente de cierre — 25/10/2026

**LOCAL / QA MEASUREMENT: VALIDATED**. Arquitectura dataLayer, eventos, GTM, GA4, page_view automático, generate_lead, prevención de duplicados, UTMs dinámicas, gclid/gbraid/wbraid, ga_client_id/ga_session_id y persistencia Sheets validados en alcance QA. Nueva evidencia manual confirmada por José: [WM-QA-FINAL-2026-10-25](evidence/acquisition/manual-final-qa-2026-10-25.json); pruebas del agente de identidad/retry/Sheets y contratos permanecen en evidence/identity y evidence/measurement. No se ejecutaron tests/build ni pruebas externas nuevas en esta actualización documental.

GTM/GA4 integrados y cookies first-party Google confirmados manualmente. Eventos vigentes: page_view automático, click_to_action, form_start, form_error, form_submit y generate_lead. No se implementó page_view manual. Continuar válido conserva click_to_action/continue_diagnosis según decisión21/10. La deduplicación validada es la de contratos/flujo documentados; no se inventan nuevas pruebas exhaustivas de cada variante pathname/hash.

Identidad real GTM: Analytics Client ID y Analytics Storage → Session ID → Measurement ID específico. analytics_identity_ready contiene ga_client_id/ga_session_id como bridge técnico a aplicación, nunca evento GA4. Último par válido histórico/futuro, snapshot por submission, retry inmutable y ausencia no bloqueante. Browser → GTM → identidad → app → /api/leads → Sheets VALIDATED QA con lead real de QA confirmado por José. Sustituye estado previo de origen Google real NOT VALIDATED y estrategia get/callback500ms.

Acquisition: query antes del hash; válido `/?utm_source=test&utm_medium=test#diagnostico`, no soportado `/#diagnostico?utm_source=test`. UTMs/click IDs disponibles y contexto privado persisten junto a submission_id/lead_id y GA IDs; no columnas ni captura nuevas. user_data mantiene únicamente email/phone_number y first_name/last_name dentro de address en generate_lead QA, excluido de GA4. GA IDs privados tampoco son custom params GA4.

**NOT VALIDATED / DEFERRED:** Meta Pixel/identifiers (_fbp/_fbc/fbp/fbc), Consent Mode, CMP, producción/tráfico real productivo, offline event delivery, Ads offline conversions, Enhanced Conversions, Meta CAPI y GA4 Measurement Protocol. Sin fuente Meta validada; columnas vacías, sin fabricación. H-09 resuelto para integración QA de esta fase; acceso/configuración/release productivos y privacidad/H-07/H-08 conservan puertas. No production-ready. No se acredita con este cierre key events/dimensiones, políticas de URL/retención/revocación ni cumplimiento legal no confirmado.

## Historial de implementación y evidencia anterior

Las secciones siguientes describen sus fechas originales. Ausencia de loader, GA4 futuro, get/callback y NOT VALIDATED de fuente real son estados anteriores sustituidos para QA por el cierre anterior; sus pruebas y límites originales se conservan.

Actualización21/10/2026: solicitud explícita posterior instala GTM-K5MZ4W66 en head local/QA; ver gtm-head-review.md y decisions.md. Las referencias siguientes a ausencia de loader/Container ID describen la fase20/10. No se modifica contrato de eventos, exposición de user_data, GA4 ni Consent. HTTP200 no acredita firing/recepción.

20/10/2026, America/Santiago. Fuente: solicitud explícita de José «Quiero actualizar y cerrar las decisiones…». Adopción en decisions.md. Esta revisión sustituye propuestas incompatibles, sin borrar resultados históricos. Sin publicación, CMP ni destinos externos activos.

## Implemented

- Application → dataLayer → GTM → GA4. Hoy solo Application → dataLayer local. events.ts: contrato Zod estricto/union TypeScript y mapper de referencia. runtime.ts: único push, inicialización segura, dedupe y lectura GA opcional. MeasurementBootstrap no renderiza UI.
- NEXT_PUBLIC_WEB_MEASUREMENT_QA_ENABLED=true solo funciona en NODE_ENV=development. Production ignora ese flag. NEXT_PUBLIC_MEASUREMENT_ENABLED mantiene el bloqueo existente para activación externa. Sin GTM loader, noscript remoto, segundo gtag.js, Google config, SDK publicitario ni eventos de página manuales. No IDs ficticios en runtime/config.
- DiagnosisActionLink instrumenta enlaces existentes de header/hero/solution/experience sin cambiar href, estilos o navegación. Un handler, click nativo de mouse/teclado; detail>=2 no genera segundo evento del doble click. Modificadores y botones alternativos no se cuentan como navegación local. No se añade barra móvil.
- LeadForm: primera edición → form_start; Continuar inválido → resumen; Continuar válido solo cambia paso; POST → form_submit initial/retry; accepted estricto de submission activa → generate_lead. Estado incierto, errores y valores de UI se conservan. PII sigue en memoria, sin cookies/storage persistente. El receptor sigue limitado a local/QA.
- GA opcional privado: lectura justo antes del primer POST, snapshot de contacto/Acquisition congelado y ga unido antes de serializar. Retry conserva JSON exacto. lead-store mapea IDs válidos a columnas existentes, sin modificar batch/idempotencia/comparación de contacto/replay. Validación sintáctica del servidor no autentica un ID cliente ni acredita procedencia Google.

## Final Event Dictionary

page_type=home en todos los eventos emitidos por la aplicación. No measurement_version. Schema interno documentado en código.

| Evento | Trigger/frecuencia | Parámetros específicos | Estado |
| --- | --- | --- | --- |
| page_view | Automático Google Tag/GA4; validar carga y pathname con App Router, sin duplicados/hash | Configuración del tag futuro; URL/referrer saneados antes de cualquier envío | NOT VALIDATED; sin emisión aplicación |
| click_to_action | Una activación del enlace comercial existente | cta_id=request_diagnosis, cta_location=header/hero/solution/experience (mobile_bar reservado), target_id=diagnostico | Implementado QA |
| form_start | Primera edición real; fallback justo antes del primer POST válido; documento/formulario lógico actual | form_id=diagnosis_request | Implementado QA |
| form_error | Un resumen por intento cliente inválido, 422 o fallo recepción | form_id, error_type, field_name, error_code | Implementado QA |
| form_submit | Cliente válido e inmediatamente antes del POST | form_id, attempt_type=initial/retry | Implementado QA |
| generate_lead | accepted válido HTTP200/201 y submission coincidente; máximo1 por lead_id/documento | form_id, lead_type=diagnosis_request, lead_id, company_type, monthly_ad_spend; user_data restringido | Implementado QA |

Excluidos site_page_view, service_view, faq_interaction, form_step/scroll_depth/section_view y nuevos eventos. Render, foco y cambio de paso no son eventos de página/inicio.

### Catálogos de error

- field_name: first_name/last_name/email/phone/company_name/company_type/monthly_ad_spend/problem_to_solve/multiple/none. Un campo inválido usa nombre+código específico; varios campos usan multiple+multiple_validation_errors.
- error_code: required/invalid_format/invalid_option/too_long/multiple_validation_errors/server_validation/recoverable_error/unconfirmed_reception. Campo enum vacío usa required; enum no vacío inválido, invalid_option. La UI conserva sus mensajes; analytics usa issues estructuradas, no texto de Zod/backend.
- error_type: validation (cliente), server (422), reception (fallo recuperable/incertidumbre). La incertidumbre ya acumulada domina errores posteriores conforme al baseline del Lead Flow.
- 422 sin campo permitido: none+server_validation. Varios campos422: multiple+multiple_validation_errors; un campo422: nombre+server_validation porque la API actual no expone subcódigo por campo. No se cambia API para inventarlo.

## dataLayer Payloads

```json
{"event":"click_to_action","page_type":"home","cta_id":"request_diagnosis","cta_location":"hero","target_id":"diagnostico"}
{"event":"form_start","page_type":"home","form_id":"diagnosis_request"}
{"event":"form_error","page_type":"home","form_id":"diagnosis_request","error_type":"validation","field_name":"email","error_code":"invalid_format"}
{"event":"form_submit","page_type":"home","form_id":"diagnosis_request","attempt_type":"initial"}
```

generate_lead contiene page_type/form_id/lead_type/lead_id/company_type/monthly_ad_spend y user_data:{email,phone_number,address:{first_name,last_name}}. Solo datos proporcionados de una submission realmente confirmada. Ejemplos y evidencia no copian contacto. company_type=lead_business/agency/other; monthly_ad_spend=under_2000_usd/2000_5000_usd/over_5000_usd (no label, cifra/revenue ni moneda inferida).

Cada push limpia con null parámetros específicos no aplicables, incluido user_data, para evitar herencia del modelo GTM. El mapper omite null y solo expone parámetros del evento. No string null/undefined. Esto no elimina el objeto de un generate_lead anterior del array dataLayer ni constituye borrado gobernado.

## GA4 Parameter Mapping

events.ts/ga4Parameters es mapper local ejecutable de referencia, NO un contenedor GTM desplegado.

| Evento | Únicos parámetros permitidos GA4 |
| --- | --- |
| click_to_action | page_type, cta_id, cta_location, target_id |
| form_start | page_type, form_id |
| form_error | page_type, form_id, error_type, field_name, error_code |
| form_submit | page_type, form_id, attempt_type |
| generate_lead | page_type, form_id, lead_type, lead_id, company_type, monthly_ad_spend |

GTM futuro debe configurar esas allowlists explícitas; sin mapper genérico de objeto dataLayer ni variable user_data en GA4. No user_id ni dimensión inicial lead_id; company_type/monthly_ad_spend candidatos de baja cardinalidad, no dimensiones creadas ahora. Desactivar Enhanced Measurement de formularios para no duplicar form_start/form_submit. page_view automático conserva su configuración; no send_page_view=false ni History trigger manual paralelo. QA decidirá si auto history genera hash/duplicados o pierde pathnames antes de cualquier cambio de estrategia.

Saneamiento futuro obligatorio antes de cargar Google tag: page_location propia sin query/hash y page_referrer solo origin. La nueva decisión de pageview automático no autoriza enviar URL cruda con PII/click IDs. No incluir UTMs custom automáticamente ni sobrescribir adquisición privada. Activación externa requiere verificar también recogida automática de datos proporcionados por usuarios DESACTIVADA; no basta con excluir parámetros de evento.

## Restricted user_data Handling

Excepción explícita local/QA a la antigua prohibición absoluta de PII en dataLayer. Solo generate_lead permite contacto dentro de user_data con las cuatro claves adoptadas. company_name y problem_to_solve nunca se copian a measurement. Sin dirección adicional, geo-IP, país por defecto, hashing, Enhanced Conversions ni envío publicitario. La estructura address solo contiene nombres.

dataLayer no es almacenamiento privado ni aislamiento entre scripts; cualquier script del documento podría leerlo. Por eso no se cargan destinos en esta fase y las pruebas usan sintéticos. Los eventos de lead anteriores permanecen en memoria hasta destruir documento; limpiarlos/persistirlos/borrarlos conforme Consent/Storage Governance es fase futura. Sin logging de payloads en runtime. Evidencia guarda conteos, claves, IDs operativos y comprobaciones booleanas, nunca contacto. No prometer cumplimiento legal por allowlists.

## Duplicate Prevention

Set por documento para form_id iniciado y lead_id observado, compartido por consumidores mediante ventana. Sobrevive inicialización repetida/Strict Mode/remount no significativo y navegación SPA; recarga destruye memoria. Se reserva antes de push para evitar reentrancia; si push falla, no hay replay diferido (medición puede perderse, captación continúa). No depende de GA4 event_id ni de submission_id como parámetro analítico. Una nueva interacción intencional requerirá contrato si se incorpora UI para otra solicitud.

Guard inFlight original impide POST paralelo/doble submit. attempt_type cuenta POST iniciados, no clicks ni pasos; un reintento real es retry incluso tras422. Retry conserva submission_id y JSON. Replay accepted primera confirmación permite evento; posteriores accepted del mismo lead no repiten.

## GA Identifier Status

OBSOLETO desde25/10/2026: la estrategia get/callback readiness se retiró por decisión explícita de José. Fuente única vigente analytics_identity_ready histórico/futuro; snapshot privado síncrono sin Measurement ID/get/espera500ms. Ver identity-review.md. La evidencia anterior sigue siendo histórica y no acredita la nueva fuente real externa.

Bridge get central al MISMO dataLayer, formato arguments documentado Google. client_id/session_id se solicitan con límite TOTAL500ms, callbacks tardíos se ignoran. Valores numéricos seguros devueltos por API se convierten a string, no se infieren. undefined/error/timeout → ausencia; contacto se envía igual. Sanitización privada permite strings opacos de máximo128 (alfanumérico/punto/guion/underscore); entradas de contexto inválidas se descartan completas, sin bloquear lead. No parseo cookies ni ID sintético en producción. Tests mock no acreditan identificadores reales. collected_at no se persiste: decisión acotada documentada sin columna nueva.

## Validated

Resultados y métodos actuales en docs/validation-report.md y docs/evidence/measurement/. No convertir PASS local en PASS externo. Matriz WM-* en aceptación.

## Not Validated

GTM Preview/Tag Assistant/Network Google/GA4 DebugView/key event/Custom Dimensions; pageviews automáticos iniciales/Next pathname/hash; IDs GA reales y persistencia de esos IDs reales; Consent/revocación; producción/campo, dispositivos físicos, rendimiento/CWV y certificación WCAG. No contenedor/propiedad configurados por este trabajo.

## Consent Dependencies / Public Launch Blockers

LOCAL/QA únicamente. No granted/denied ni timestamps/versiones fabricados: seis campos DEFERRED. Excepción local no autoriza enviar user_data a plataforma alguna. H-07/H-08/H-09, privacidad/contactos/retención/operación y condiciones de Deployment siguen abiertos según decisiones. No CMP/Consent Mode productivo ni delivery offline.

## Recommended Next Step

Revisar evidencia local; después aportar configuración GTM/GA4 QA y resolver cómo se autoriza esa prueba externa antes de cargar tags. Implementar Consent + Storage Governance y política real antes de lanzamiento. Solo QA real puede motivar cambiar page_view automático.

## Reproducción local

Servidor development existente: añadir temporalmente NEXT_PUBLIC_WEB_MEASUREMENT_QA_ENABLED=true, LEAD_FORM_PREVIEW=true, HEADER_NAVIGATION_PREVIEW=true y LEAD_SHEETS_QA_ENABLED=true al entorno local, sin copiar credenciales. Los últimos tres conservan las puertas QA anteriores. El archivo .env.development.local creado únicamente para esta prueba se retiró al terminar; .env.local previo se preservó. No se detuvo el servidor previo. En PowerShell puede usarse $env:VARIABLE='true' antes de npm run dev; no habilitar NEXT_PUBLIC_MEASUREMENT_ENABLED.

- Unitarios: node --conditions=react-server --experimental-strip-types --test tests/*.test.mjs.
- Checks: npm run typecheck; npm run lint; npm run build.
- Artefacto productivo: node scripts/measurement-production-audit.mjs (tras build). No reemplaza navegador/hosting productivo.
- Verificación filas/replays/secretos: node --env-file=.env.local --conditions=react-server --experimental-strip-types scripts/measurement-evidence.mjs. Solo replays de los2fixtures ya identificados; no crea filas nuevas. Requiere receptor QA activo y acceso Sheets previo. Evidencia saneada; nunca console.log(dataLayer) con user_data real.
- Recorrido reproducible: CTA por cada ubicación; Continuar vacío; completar Step1 sintético; Step2/Volver; gasto vacío; gasto válido; inducir pérdida de respuesta después de commit en harness de navegador; verificar uncertain/0lead; retry con mismo JSON; verificar200replay/1lead. Retirar inyecciones al terminar. Datos exactos no forman parte de la evidencia compartida.

El viewport soportado solicitado375×812 reportó417×902 CSSpx en este IAB; click Continuar/Volver PASS y sin overflow, sin nueva submission. La emulación CDP anterior sí reportó375px y se recorrió por teclado; sus clicks no activaron Continuar. No atribuirlo a producto sin comprobar dispositivo/touch real. Dimensiones y límites en responsive.json.
