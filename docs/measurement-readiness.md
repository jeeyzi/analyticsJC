# Measurement readiness — Lead Flow / Sheets

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
