# GA identifiers GTM — 25/10/2026

## Cierre manual adicional de QA — 25/10/2026

**LOCAL / QA MEASUREMENT: VALIDATED**. José confirma ahora lead real QA con ga_client_id/ga_session_id reales persistidos en Sheets junto a submission_id/lead_id, acquisition disponible y contacto. GTM: Analytics Client ID y Analytics Storage → Session ID → Measurement ID específico de GA4; analytics_identity_ready solo bridge a aplicación, sin envío a GA4. Evidencia [WM-QA-FINAL-2026-10-25](evidence/acquisition/manual-final-qa-2026-10-25.json) cierra NOT VALIDATED anterior de origen real/recorrido completo QA, complementando pruebas del agente de snapshot/retry/ausencia/mapper. No nueva ejecución del agente ni modificación de fixtures. Producción/Consent/CMP/Meta/offline conservan límites. Las nueve secciones siguientes preservan el estado observado durante implementación, antes de esta confirmación final.

## Root Cause Confirmed

runtime.ts todavía exigía readyId de googleTagReady + NEXT_PUBLIC_GA4_MEASUREMENT_ID y gtag get. No había consumidor de analytics_identity_ready. José aporta validación manual en GTM Preview de IDs reales y ausencia intencional de tags para ese evento. Esa validación es evidencia aportada por José, no observación externa repetida por esta tarea. En carga normal localhost del navegador de QA no apareció el evento de identidad real.

## Architecture Change

GTM → analytics_identity_ready (par ga_client_id/ga_session_id) → observador en memoria → snapshot privado ga.client_id/session_id → API existente → columnas ga_client_id/ga_session_id existentes. Se retira get/callback/espera500ms y configuración Measurement ID de ejemplo. Una sola fuente; sin cookies, polling, almacenamiento entre documentos ni nuevo evento web.

## Implemented

identity.ts valida par completo: client string numérico con punto; session string de dígitos no cero o entero positivo seguro convertido a string; límite privado128. Rechaza undefined/null/vacíos/templates y pares parciales; no combina identidad/sesión de eventos distintos. Escanea historia en orden y mantiene último par válido. Encadena push preservando array, this, argumentos y retorno, también batch/reentrancia; instalación idempotente. Errores de acceso/push no bloquean captación. Snapshot devuelve copia.

runtime.ts consume ese observador con gates QA existentes. LeadForm solo retira await al leer IDs: snapshot síncrono dentro del mismo frozen JSON antes de fetch. No se modificaron UI, eventos/user_data, acquisition, contrato API, backend, columnas, claves, idempotencia ni estados de recepción. Tests gtag/get obsoletos sustituidos por pruebas del nuevo contrato, sin eliminar pruebas de recepción/acquisition/Sheets/eventos. Scripts identity-sheets-verify.mjs y evidencia saneada añadidos. Sin commit de esta tarea.

## Validated

ID-01/02/03 PASS unitario y navegador Chromium: evento pre-mount con initScript, evento post-mount por dataLayer.push, ambos IDs; último par válido/invalidación/templates/ausentes/valores numéricos, wrappers antes/después, array bloqueado, copia defensiva y gates. ID-04/05/06 PASS navegador contra receptor/Sheets reales con contactos e identidades SINTÉTICOS. Google bloqueado en contextos QA aislados para no transmitir sintéticos a plataformas. No se fabricaron IDs en implementación.

ID-08 PASS:34/34tests con node --conditions=react-server --experimental-strip-types --test tests/*.test.mjs; npm run typecheck/lint/build exit0, Next16.4.3. docs/evidence/identity/tests.tap. Fallo inicial de2tests: factory de fixture tenía valores por defecto que ocultaban undefined explícito; corregida factory para probar ausentes de verdad, expectativas intactas, repetición34/34PASS. Primer ensayo navegador falló por esperar copy histórico incorrecto; se corrigió selector al mensaje existente sin cambiar UI. Ese ensayo alcanzó persistencia QA y dejó una fila sintética adicional; no se borró.

## Google Sheets Result

Lectura real de Sheets mediante credencial server-only existente: tres submission_id del browser.json tienen exactamente una fila cada una, lead_id coincide. Casos pre_mount_timeout y post_mount guardan ambos IDs idénticos al snapshot; missing guarda columnas vacías. readLeadRows verificó cabecera completa existente36columnas, sin creación/migración de esquema. sheets.json refleja igualdad/filas, sin contacto ni credenciales. Script de lectura reproducible: node --env-file=.env.local --conditions=react-server --experimental-strip-types --use-system-ca scripts/identity-sheets-verify.mjs.

## Retry Behavior

Primer POST pre_mount_timeout: servidor real respondió201 accepted y persistió. Navegador QA retrasó respuesta16s para provocar AbortSignal de15s real: unconfirmed_reception y0generate_lead. Después entró otro par válido diferente. Segundo POST conservó JSON byte-idéntico al primero, incluidos IDs/contacto/acquisition/submission_id;200replayed, mismo lead_id y una fila. Confirmó un generate_lead único. Memoria ya reflejaba par nuevo pero snapshot/replay/Sheets conservaron par inicial. Mecanismo de retry no se cambió.

## GA4 Isolation

ID-07 PASS aplicación: analytics_identity_ready no está allowlisted como MeasurementEvent; track lo rechaza, mapper GA4 devuelve{}. Tests sobre eventos web completos comprueban rechazo de ga_client_id/ga_session_id como custom params. En secuencias navegador ningún evento web lleva esas claves; el evento técnico original sí las contiene por contrato GTM. Observador no emite nada a Google, ni llama get/config/event. No se modificó generate_lead/user_data. El transporte nativo GA puede contener cid/sid propios; no son custom params y no se alteran.

NOT VALIDATED externo: al bloquear Google en QA sintética no se acredita recepción/ausencia en GA4 real, configuración final o firing de tags. José ya valida Preview sin tags para evento técnico; ese resultado no se atribuye a esta ejecución. No cambios ni publicación del contenedor.

## Fallback Strategy

Sin evento válido retorna{} inmediatamente; nuevo lead missing accepted real, una fila y IDs vacíos. Sin gtag fallback: fuente única evita carreras y sesiones inconsistentes. Medición deshabilitada/inaccesible no impide formulario. Si IDs llegan después de congelar no se añaden al mismo envío; solo disponibles para un siguiente snapshot nuevo. No replay/relleno retroactivo de identidad.

## Known Issues

No se reprodujo fuente con IDs reales desde GTM Preview en esta sesión; navegador normal no recibió evento. Evidencia end-to-end usa inyección controlada sintética + Sheets real, no integración de origen Google validada por el agente. Producción/Consent/GA4 externo/campo mantienen NOT VALIDATED y puertas existentes H-07/H-08/H-09/Privacy. Si un tercero reemplaza push sin delegar, observación inmediata no es garantizable; lectura final rescanea historia. No se añade polling ni descriptor global para forzar terceros. Warnings Node strip-types/tipo módulo preexistentes. No nuevas dependencias ni cambios de UI para esta tarea.
