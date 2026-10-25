# Acquisition + Attribution — 20/10/2026

## Cierre vigente — 25/10/2026

**LOCAL / QA MEASUREMENT: VALIDATED**. José confirma manualmente end-to-end UTMs dinámicas y gclid/gbraid/wbraid hasta Google Sheets; complementa pruebas sintéticas y lecturas reales anteriores. Registro aportado: [WM-QA-FINAL-2026-10-25](evidence/acquisition/manual-final-qa-2026-10-25.json), sin nueva ejecución del agente. Señales disponibles persisten con submission_id/lead_id, GA IDs y contacto privado; ausentes no se fabrican. Sin cambio de código ni captura.

Parámetros antes del hash: `/?utm_source=test&utm_medium=test#diagnostico` válido; `/#diagnostico?utm_source=test` no soportado. Mantener primer contexto/snapshot/retry adoptados; no parser de hash ni persistencia entre documentos.

GTM/GA4 y GA IDs reales ya VALIDATED QA según cierre manual e identity-review.md; ausencias GA de fixtures anteriores siguen siendo ciertas para esos ensayos. Meta Pixel/_fbp/_fbc/fbp/fbc/CAPI DEFERRED sin fuente validada; Consent/CMP/producción/offline también. No production-ready. Revisión/evidencia de fecha original conservadas a continuación como historia.

Revisión posterior vigente: [acquisition-dynamic-values-review.md](acquisition-dynamic-values-review.md). El catálogo cerrado UTM documentado abajo fue eliminado por instrucción explícita. Valores UTM/click IDs dinámicos con límites/defensa PII; fixtures son únicamente casos de prueba. Este informe conserva evidencia histórica anterior a esa corrección. Persistencia entre recargas sigue pendiente Consent/CMP.

## Architecture Review

Baseline d7f3aa9. Se mantienen receptor server-only, validación de contacto, batch atómico marcador+fila, comparación de contacto en replay y estados de recepción. acquisition opcional al POST; saneamiento compartido y revalidación en newLeadRow. LeadForm congela contexto con JSON original. Replay nunca modifica atribución.

Fuentes revisadas: AGENTS, decisions, technical, measurement, docs/acceptance (matriz raíz), Lead Flow LF3, schema Sheets y código vigente. Referencias históricas Supabase/job/request_id no sustituyen decisiones activas. Guías Next locales use-client y Link revisadas. source-manifest10/10 no representa esta revisión incremental de measurement.

## Available Signals

submission_id: UUID cliente estable por intento. lead_id: UUID servidor confirmado en Sheets. No identifican sesión de plataforma.

## Available With Conditions

| Señal | Fuente exacta | Condición QA |
| --- | --- | --- |
| utm_source | searchParams URL entrada | qa_source / qa_google |
| utm_medium | misma URL | qa_medium / qa_cpc |
| utm_campaign | misma URL | qa_campaign / qa_second |
| utm_content | misma URL | qa_content |
| utm_term | misma URL | qa_term |
| landing_page | pathname entrada | / o /privacidad; sin query/hash |
| referrer | document.referrer → URL.origin | https://example.org o https://example.com, externo, sin credenciales/path/query/hash |
| gclid | parámetro único URL entrada | exacto tras una decodificación URL |
| gbraid | parámetro único URL entrada | misma regla |
| wbraid | parámetro único URL entrada | misma regla |

Click IDs:1–512 caracteres alfanuméricos/guion/underscore; formato defensivo QA, no acreditación de validez publicitaria. Sin trim/case/hash/truncado. Parámetros duplicados ambiguos se omiten. Catálogo evita UTM libre con PII; valores comerciales desconocidos se omiten. Captura inválida produce ausencia, no bloquea contacto. Sin defaults direct/organic/paid.

## Deferred Signals

fbp/fbc: fuente futura cookies _fbp/_fbc realmente existentes bajo permiso/mecanismo autorizado. Sin lector activado ni construcción desde fbclid. Referencia Meta no pudo revalidarse (HTTP429), sin afirmar contrato productivo validado.

ga_client_id/ga_session_id: futura API gtag get, propiedad/ready/permiso real; sin parsing de cookies ni reloj. [Referencia oficial Google](https://developers.google.com/tag-platform/gtagjs/reference#get) confirma campos y ausencia undefined. No tag/get activo.

analytics_storage, ad_storage, ad_user_data, ad_personalization, consent_timestamp, consent_version: ausentes, no CMP. offline_events sin escritores. Sin MP, Ads uploads, Enhanced Conversions, CAPI, hashing, CRM ni BQ.

## Decisions Needed

- ACQ-PROD: José define catálogo real campañas/referrers y política pública; bloquea producción, no QA.
- ACQ-DURATION: supervivencia a recarga/nueva pestaña requiere mecanismo/duración/borrado/consentimiento adoptados.
- ACQ-MODEL: columnas guardan primer contexto del documento, no histórico ni sesión GA4/last-touch. Modelo múltiple requiere contrato separado.
- H-07/H-08/H-09 y retención/lanzamiento siguen pendientes/bloqueados.

## Implemented

acquisition.ts captura/sanea; AcquisitionCapture en layout development+QA conserva contexto tras hidratación hasta destruir documento. LeadForm envía snapshot congelado; contract/lead-store mapean columnas existentes. Ausencia omitida en JSON/celda vacía. Sin cookies/localStorage/sessionStorage.

Header identity usa Next Link con igual href/clases: evita recarga de /#inicio desde query. Sin nuevo destino/copy. Memoria sobrevive navegación Next/anclas; recarga/navegación completa reinician documento. Nunca rellenar señales vacías con otra campaña ni mezclar first/last touch.

## Validated

| ID / caso solicitado | Resultado |
| --- | --- |
| ACQ-01 UTMs → lead | PASS QA sintético cinco UTMs en fila real |
| ACQ-02 sin UTMs | PASS campaña ausente; landing_page real / |
| ACQ-03 gclid | PASS transporte exacto sintético, no Google Ads real |
| ACQ-04 gbraid/wbraid | PASS transporte exacto sintético |
| ACQ-05 retry | PASS HTTP real conserva contexto aun con intento de cambio; cliente congela JSON |
| ACQ-06 idempotencia | PASS dos concurrentes+retries, una fila/lead |
| ACQ-07 navegación | FAIL inicial enlace nativo; corregido Next Link; PASS navegador sin query conserva payload y fila |
| ACQ-08 secretos/PII | PASS alcance124 assets sin credencial/SA/Sheet ID;1 log sin marcadores contacto sintético; Network observado local |
| ACQ-09 ausencias | PASS celdas vacías; Meta/GA/consent no fabricados |
| ACQ-10 mapping | PASS lectura real comparada con Network/columnas |

10 tests PASS: node --conditions=react-server --experimental-strip-types --test tests/lead-draft.test.mjs tests/lead-contract.test.mjs tests/acquisition.test.mjs. typecheck, lint, build PASS. Timeout baseline reejecutado: commit real + pérdida de respuesta/reconciliación inducidas → unconfirmed_reception → replay accepted una fila; no caída real de Google.

Evidencia: docs/evidence/acquisition/{real-qa.json,browser.json,browser-sheet.json,confirmed-success.png} y lead-sheets/{security.json,timeout-replay.json}. Sin contacto/secretos en JSON. Network desde navegación interna hasta éxito sin truncación, POST201 y solo origen local. No acredita recursos previos a habilitar Network.

## Not Validated

GA/Meta IDs reales, campañas reales, ingestión plataformas, CMP/Consent Mode, privacidad/retención/borrado y carga productiva. /privacidad no implementada por esta fase; no recorrido real por esa ruta. Retry manual UI no inducido: JSON congelado revisado y replay HTTP real probado. M-09/M-10/CO-* no PASS global.

## Privacy / Consent Dependencies

José responde «excluir esa regla de momento» a excepción solo QA. Registro decisions/measurement; no aprobación productiva. Contacto separado de acquisition en POST privado; sin copia a URL/dataLayer/logs. No estado consentimiento fabricado ni almacenamiento persistente navegador.

## Known Issues

Recarga/pestaña nueva pierde contexto; catálogo/referrers solo QA. Pérdida por enlace nativo corregida/verificada. Primeros intentos suite fallaron sin servidor accesible/aislamiento red; Next iniciado fuera sandbox y suite PASS. Lint detectó fetch no declarado en script, corregido globalThis.fetch. Node22 warnings strip-types/module type, tests exit0. No garantía logs producción ni validez publicitaria de IDs.

Cinco filas sintéticas nuevas conservadas: dos HTTP, navegador antes/después del arreglo y timeout. Limpieza coordinada fila+marcador pendiente del responsable QA; no borrar por separado.

## Measurement Readiness

Capture → persist → associate validado para catálogo QA. Sin analytics/delivery activos ni readiness pública.

## Recommended Next Step

Revisar local con UTMs QA y adoptar catálogo real y política duración/consentimiento antes de salir del laboratorio. GA/Meta requieren fuentes y permisos verificables.
