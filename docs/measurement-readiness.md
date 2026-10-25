# Measurement readiness — Lead Flow / Sheets

## Estado vigente — 25/10/2026

**LOCAL / QA MEASUREMENT: VALIDATED**. Cierre basado en confirmaciones manuales de José más pruebas previas del agente; no nueva ejecución. Fuente [WM-QA-FINAL-2026-10-25](evidence/acquisition/manual-final-qa-2026-10-25.json), web-measurement-review.md, identity-review.md y validation-report.md.

| Capacidad | Estado vigente | Evidencia / límite |
| --- | --- | --- |
| dataLayer, eventos, dedupe, accepted/generate_lead | VALIDATED QA | Contratos/tests y recorridos previos; sin lead por clic ni doble emisión por replay |
| GTM + GA4 + cookies first-party Google | VALIDATED QA | Confirmación manual José; no evidencia de activación productiva |
| page_view | VALIDATED QA automático | Google Tag/GA4; ninguna implementación manual |
| click_to_action/form_start/form_error/form_submit/generate_lead | VALIDATED QA | Eventos acordados; user_data restringido solo QA y excluido de GA4 |
| UTMs dinámicas / gclid / gbraid / wbraid → Sheets | VALIDATED QA | End-to-end confirmado manualmente; presentes antes del hash |
| ga_client_id / ga_session_id → Sheets | VALIDATED QA | Analytics Client ID + Analytics Storage Session ID del Measurement ID GA4; bridge analytics_identity_ready |
| Snapshot / retry / ausencia IDs | VALIDATED QA | Último contexto válido, par congelado y retry idéntico; ausencia no bloquea lead |
| submission_id / lead_id / contacto privado → Sheets | VALIDATED QA | Persistencia real con señales disponibles, columnas existentes |
| Meta Pixel / _fbp / _fbc / fbp / fbc / CAPI | DEFERRED, sin fuente validada | Columnas pueden estar vacías; no fabricar |
| Consent Mode / CMP / producción / tráfico productivo | NOT VALIDATED / DEFERRED | H-07/H-08, privacidad, operación y release pendientes |
| Offline delivery / Ads offline / Enhanced Conversions / GA4 MP | DEFERRED / NOT VALIDATED | Fuera de esta fase |

Query soportada: `/?utm_source=test&utm_medium=test#diagnostico`. Fragmento `/#diagnostico?utm_source=test` no es acquisition soportada. Los GA IDs se usan solo como contexto privado; analytics_identity_ready no va a GA4 ni sus IDs a custom params. H-09 QA resuelto para esta integración; H-09 producción conserva configuración/permisos/release por verificar. No production-ready ni autorización de publicar. No se cierran por inferencia revisiones de privacidad, URL/PII automática, revocación, key events/dimensiones u operación no confirmadas.

## Historial de estados anteriores

Las tablas/notas siguientes conservan su fecha y evidencia; no son el estado actual. GA4/IDs DEFERRED/get500ms y ausencia de tags quedan sustituidos para QA por la matriz anterior. No se reescribe evidencia histórica.

21/10/2026: GTM-K5MZ4W66 recibido e integrado en head exclusivamente local/QA. HTTP local200 con1bootstrap head y archivo público gtm.js200 (lectura con CA de Windows); no prueba de ejecución en navegador/Tag Assistant ni de tags/destinos. Producción sigue excluida. H-09 parcial; GA4 real, GA IDs, Consent y lanzamiento pendientes. gtm-head-review.md documenta la revisión; resultados anteriores sin loader son históricos.

Web Measurement20/10/2026: contrato local/dataLayer implementado según web-measurement-review.md; user_data restringido solo local/QA, mapper GA4 explícito sin contacto. page_view AUTOMÁTICO futuro, no evento de aplicación; sin measurement_version/site_page_view. GA IDs AVAILABLE WITH CONDITIONS (get oficial/ready real/500ms), transporte y columnas preparados; fuente Google real NOT VALIDATED. No tags cargados. H-09 externo abierto, Consent seis campos DEFERRED y lanzamiento bloqueado. Estados históricos siguientes no sustituyen esta revisión; evidencia y resultados actuales en validation-report.

Corrección posterior20/10: las cinco UTMs y click IDs aceptan valores dinámicos; no catálogo cerrado ni despliegues por nueva campaña. Límites y defensa PII en acquisition-dynamic-values-review.md. Referrer mantiene alcance QA anterior; consentimiento/producción siguen pendientes. Persistencia entre reloads depende de Consent/CMP futura.

Vigente 20/10/2026: acquisition-review.md. AVAILABLE: submission_id/lead_id. AVAILABLE WITH CONDITIONS: cinco UTMs del catálogo sintético, landing_page/referrer saneados, Google click IDs presentes. Captura y persistencia reales verificadas con datos sintéticos tras excepción local adoptada. DEFERRED: GA4, Meta y consentimiento. Tablas19/10 históricas, no captura actual. Producción/delivery desactivados.

19/10/2026. Preparación documental; no tracking ni delivery activos. La nueva instrucción amplía el schema, no concede consentimiento ni acceso a destinos. Política vigente de measurement conserva permisos por finalidad y saneamiento; cambios de esa política necesitan adopción.

| Señal | Estado actual | Dependencia / regla |
| --- | --- | --- |
| submission_id | AVAILABLE local | UUID creado una vez al primer edit/submit, memoria de instancia; no dato de analytics |
| Campos aprobados | AVAILABLE local | Introducidos por visitante; solo memoria, validación local; no guardados todavía |
| lead_id | DEFERRED | Servidor y persistencia real; no emitir lead confirmado antes |
| UTMs / landing_page / referrer | DEFERRED para captura | Técnicamente legibles sin GTM; falta captura consentida/saneada y contrato activo. URL presente no es permiso; no query libre/PII |
| gclid / gbraid / wbraid | DEFERRED | Existencia real + permiso aplicable + política/fuente implementada; no fabricar ni inferir de UTM |
| fbp / fbc | DEFERRED | Fuente real Meta y consentimiento/privacidad; sin pixel/cookies implementados, no inventar valores |
| ga_client_id / ga_session_id | DEFERRED | GA4/gtag get listo tras consentimiento, sin IDs sintéticos; ausencia no bloquea captación futura |
| consent snapshot completo | DEFERRED | CMP/Consent Mode fuera de esta fase; no inventar denied/granted ni timestamp/version |
| IP / User-Agent | DECISION NEEDED | Disponibilidad técnica no autoriza persistencia; IP depende de proxy confiable. No capturar/guardar ahora |
| city/state/postal_code/country | DEFERRED | Sin fuente/permiso ni necesidad aprobada; no añadir controles |
| external_id / gads_session_attributes | DEFERRED P1 | Contrato futuro plataforma, base lead_id cuando corresponda |
| offline_event_id/event_time/value/currency | DEFERRED P1 | Evento comercial real futuro; no deducir revenue ni generar lifecycle automático |

## Separación futura

Sheets -> modelo interno -> builders independientes. Cada builder usa allowlist de finalidad/plataforma, no un payload universal de PII.

- GA4: identificadores/contexto permitidos no PII. Nunca email, teléfono, nombres, empresa de contacto, direcciones, texto libre ni hashes como sustituto de PII.
- Google Ads: click IDs y datos first-party permitidos, normalización/hash específica al construir payload futuro; sin hashing/upload/Enhanced Conversions ahora.
- Meta: IDs reales y first-party permitida; external_id derivado según contrato futuro, IP/UA solo si aprobados. Sin CAPI/hash ni deduplicación browser/server ahora.
- problem_to_solve queda exclusivamente en first-party; no sale hacia ninguno de los tres builders.
- Las fechas/nombres/valor/moneda de eventos requieren definición real. Estados delivery por destino independientes; no marcar sent con un mock.

form_start sigue una vez por experiencia montada, nunca al cambiar a paso2. No se instrumenta ni inventa evento de progreso. generate_lead futuro solo tras accepted válido y una vez por lead_id en vida de página, sujeto a política de consentimiento. Fallos analytics nunca deben bloquear recepción. No replay de eventos previos al consentimiento.

## Puertas

H-07/H-08/H-09 pendientes; cuentas, tags, CMP, revocación, parámetros de captura/retención y pruebas Network/dataLayer siguen NOT VALIDATED. No declarar PASS GA4/Google Ads/Meta/CMP por schema preparado o ausencia de requests. No MP, CAPI, offline uploads, CRM, BQ, scheduler o dispatcher por esta fase.

## Actualización de persistencia QA — 19/10/2026

submission_id y lead_id ya se persisten realmente, junto a campos aprobados. lead_id UUID generado servidor; external_id permanece vacío, no hash ni ID de plataforma generado. Las señales marcadas DEFERRED siguen vacías en Sheets: no CMP/GTM/GA fuente válida. Persistencia de contacto no concede consentimiento publicitario. No se emiten form_start/generate_lead ni delivery offline por esta implementación. Contrato/guardado operativo probado no equivale a PASS de plataformas.
