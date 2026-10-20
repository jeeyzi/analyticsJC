# Lead Form + Lead Flow — revisión incremental

13/10/2026, America/Santiago. Base `2d2766e`, checkout limpio. Solicitud explícita de José: fase Lead Form + Lead Flow. Respuesta explícita en este chat: «Mantener pendientes; solo UI y validación independiente». No autoriza backend, publicación ni adopción de límites propuestos.

Leídos AGENTS, las siete fuentes, decisiones/handoff, aceptación raíz/referencia, validation-report, foundation y todas las revisiones posteriores. Las fuentes canónicas se conservan.

## Pre-flight Decisions

| ID | Clasificación | Alcance / condición / responsable |
| --- | --- | --- |
| H-01 | RESOLVED local | Repositorio actual identificado y versionado. Remoto/CI no acreditados. |
| H-02 | RESOLVED para UI local | Solicitud y respuesta adoptan únicamente este subconjunto; José mantiene pendientes operativos. |
| H-03 | DECISION NEEDED | Stack adoptado; planes/regiones/email/scheduler pendientes de José. |
| H-04 | BLOCKER | Dominio y contactos reales faltan; no soporte ficticio. José, captación/lanzamiento. |
| H-05 | BLOCKER | Política final/retención/borrado/proveedores no adoptados. José, captación pública. |
| H-06 | BLOCKER | DB/avisos/scheduler no provisionados y probados. José, backend real. |
| H-10 | DECISION NEEDED | Límites de campos/cuerpo, timeout, rate limit, retries y retención no adoptados. José los mantiene pendientes explícitamente. |
| H-11 | DECISION NEEDED | Catálogo HTTP/retry y errores de longitud opcionales sin copy. José; no implementar ese flujo ni inventar mensajes. |
| H-14 | DECISION NEEDED | Operación e historial atómico pendientes de José; no migraciones anticipadas. |
| H-13 | RESOLVED documental | form_start una vez por instancia. No se emiten eventos en esta fase. |
| H-07/H-08/H-09 | DECISION NEEDED / BLOCKER | Consentimiento/revocación/cuentas pendientes; medición desactivada. |
| H-16/H-19 | SAFE ASSUMPTION | Una columna y PII solo en memoria; enlace privacidad no habilitado sin página real. |
| LF-01 | SAFE ASSUMPTION | Muestra rotulada solo development + LEAD_FORM_PREVIEW=true o HEADER_NAVIGATION_PREVIEW=true existente. Se reutiliza el servidor QA previo sin interrumpirlo. No destino comercial real ni activación nueva de navigationReady; el destino #diagnostico del fixture sigue siendo sintético y separado. |
| LF-02 | SAFE ASSUMPTION | Validación independiente: obligatorios, trim, email, enums y URL HTTP/HTTPS sin credenciales. Sin máximos no adoptados. Validación local válida no crea request_id, POST, loading, recepción incierta ni éxito. Aviso de laboratorio explica el límite. |
| H-21/H-22 | FUTURE | CRM/offline/BQ, precios/umbrales/SLA fuera de fase. |

## Límite de implementación

Se prepara el formulario de siete campos y su schema parcial Zod compartible, errores locales/foco/corrección y conservación en memoria. No hay receptor, transporte, datos persistidos, captación operativa ni estados de red simulados. Loading, doble POST, timeout/retry, success y generate_lead quedan pendientes del contrato/servicio real. Privacy Notice conserva copy literal en laboratorio, pero no acredita política final; privacidad/soporte no se enlazan a destinos inexistentes. Sin JS, laboratorio informa limitación y no ofrece submit operativo.

No se cambian las secciones anteriores, fuentes estratégicas, dependencias o matrices. La Home normal/build no incluye este laboratorio. Evidencia y subcasos en validation-report; ningún PASS global.

## Interpretación de URL y reproducción

LF-03 SAFE ASSUMPTION: rechazar barras invertidas que el parser WHATWG reinterpretaba como slash, para evitar normalización ambigua. Test inicial falló y el schema se corrigió sin retirar el caso. URLs se normalizan en el resultado del schema; el input original permanece en memoria y nunca se visita. No hay schema HTTP final ni validación servidor acreditada.

QA: `LEAD_FORM_PREVIEW=true` y `npm run dev` (PowerShell: `$env:LEAD_FORM_PREVIEW='true'`). También visible en el laboratorio existente HeaderNavigation; nunca production, incluso con ambos flags. Formulario comercial #diagnostico no habilitado. Pruebas del schema: `node --experimental-strip-types --test tests/lead-draft.test.mjs`, sin dependencia nueva. El runner experimental de Node 22 avisa sobre type stripping/ESM; no se cambia package.json para silenciarlo.

---

## Revisión previa v2 — 19/10/2026

Entregada en el chat ANTES de editar código. Leídos AGENTS, decisiones, technical, measurement, content, design, product, wireframe, aceptación raíz y referencia, revisión y reportes vigentes, implementación y guía Next local. Las respuestas nuevas cierran catálogo y opcionalidad. No sustituir fuentes con informes históricos.

### Architecture Review

Estado inicial: laboratorio client sin API/DB. Arquitectura adoptada: form -> POST /api/leads -> validación servidor -> comprobación idempotente -> enriquecimiento permitido -> Sheets API -> Sheet privado. Falta receptor y garantía concurrente. UI independiente puede avanzar sin afirmar captación.

Una lectura seguida de append no constituye operación condicional única. Dos requests pueden leer ausencia e insertar dos filas; batch atómico no protege una lectura anterior. Un mutex del proceso no cubre otras instancias/reinicios; un timeout tras escritura no debe iniciar otro append sin reconciliar. Se necesita mecanismo aprobado de único escritor con exclusión duradera y recuperación verificable, o adaptación explícita de arquitectura. No se introduce DB, Apps Script, cola o servicio adicional por inferencia. LF2-IDEM BLOCKER del backend conforme, no de UI. Fuente: https://developers.google.com/workspace/sheets/api/guides/batch y https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append (consultadas 19/10).

### Form Schema Changes

Ocho campos, siete obligatorios/uno opcional. Retirados website y crm_context. name se divide first_name/last_name; organization_type -> company_type; problem -> problem_to_solve opcional; ad_spend_context libre -> monthly_ad_spend enum. Se añaden phone y company_name. No inferencia revenue ni rechazo comercial por gasto.

### Schema Compatibility

El schema anterior no compatible: no migración acreditada de datos porque no existe receptor configurado. Contratos en google-sheets-schema.md. monthly_ad_spend se mapea a ad_spend una sola vez al preparar fila; no duplicar columnas. request_id no reemplaza submission_id. offline_events no es outbox activo ni historial automático.

### Available Signals

Campos introducidos y UUID aleatorio en memoria al primer edit/submit; conservado hasta desmontar la instancia. Sin persistencia/analytics, no lead_id aún. Parámetros URL/referrer técnicamente accesibles no implican permiso de captura.

### Deferred Signals

Adquisición saneada/consentida y todos los IDs de plataforma pendientes de fuente válida; consent snapshot no sustituido por denied/granted ficticio. IP/UA DECISION NEEDED. Ver measurement-readiness.md.

### Decisions Needed

| ID | Estado / responsable / cierre | Puerta |
| --- | --- | --- |
| LF2-CATALOG | RESOLVED: José confirma Empresa que capta leads, Agencia, Otro | UI |
| LF2-PROBLEM | RESOLVED: José confirma opcional | UI |
| LF2-STORE | BLOCKER: José crea Sheet privado, proyecto/API, Service Account y acceso servidor; configurar ID/tabs/secretos sin publicarlos | Recepción QA |
| LF2-IDEM | BLOCKER: José/implementador adoptan arquitectura de serialización compatible y demuestran replay/concurrencia | Persistencia conforme |
| LF2-PHONE | DECISION NEEDED: formato/normalización/máximo definitivos, mensajes específicos por campo | API final |
| LF2-OPS | DECISION NEEDED: estados operativos/lifecycle iniciales, timestamps, política edición tras timeout, timeout HTTP, mapeo HTTP definitivo, protección pública | API/operación |
| LF2-IPUA | DECISION NEEDED: necesidad, base de tratamiento/retención, fuente IP confiable | Captura P2 |
| H-10 | PARTIALLY RESOLVED: límites/retries parcialmente adoptados; no cerrar privacidad/retención/rate-limit por esta fase | API/lanzamiento |
| H-11/H-14 | RESOLVED documental: cuatro copys/historial mínimo; implementación no probada | No PASS operativo |
| H-04/H-05 | BLOCKER FOR PUBLIC LAUNCH: contactos, privacidad, retención/borrado, proveedor y receptor productivo | Lanzamiento |
| H-07/H-08/H-09 | DECISION NEEDED / BLOCKER según registro: consentimiento, revocación, cuentas y QA | Medición |

### Contradictions

| Documento afectado | Regla previa | Nueva regla explícita / tratamiento |
| --- | --- | --- |
| decisions.md / technical.md / AGENTS.md | Supabase, transacción lead+job, scheduler | Sheets principal; sin DB adicional ni worker ficticio. Addendum decisions vigente; fuente antigua conservada |
| product.md / wireframe.md / content.md / AGENTS.md | siete campos, cinco obligatorios, una pantalla, sin teléfono/rangos | ocho campos, siete obligatorios, dos pasos, teléfono y radios; nuevo copy solo del formulario |
| technical.md / measurement.md / acceptance.md | request_id como idempotencia | submission_id canónico; request_id técnico |
| content.md | textos anteriores de recepción | catálogo H-11/nueva solicitud prevalece |
| technical.md / measurement.md | esquema anterior/DB e IDs ausentes de v1 | schemas Sheets y readiness condicionada; no autorización global de tracking |
| acceptance.md F-01/F-03/F-07/F-08/E-03/E-05 | URL obligatoria, transacción/job y llave anterior | criterios necesitan revisión para nuevo scope; no PASS global ni retiro silencioso de requisitos |
| implementación/tests anteriores | siete campos y URL | reemplazados por schema de dos pasos, pruebas actualizadas por cambio explícito |

### Interpretaciones locales acotadas

LF2-LIMIT: para el laboratorio se usan las referencias 100/100/254/150/2000 de la solicitud. Longitud contada como unidades UTF-16 de HTML/JS, incluyendo espacios antes de trim. Teléfono local: máximo 40 caracteres de presentación, + inicial opcional, dígitos/espacios/paréntesis/guiones y 8–15 dígitos; admite +56 y formato nacional, NO prueba existencia ni normaliza país. Política final servidor sigue pendiente. No se presenta como decisión adoptada de H-10. Aproximadamente 16 KB se concreta como propuesta 16 KiB para futuro API, NO límite aplicado aún.

LF2-MAPPING: se reutilizan lead_business/agency/other para las tres categorías reconfirmadas. LF2-UX: botón secundario Volver; ayuda Opcional; errores locales usan el título aprobado sin inventar mensajes comerciales específicos. Necesitan catálogo más orientativo para flujo final. Campo problem max2000, no required.

UUID se crea una sola vez por instancia al primer cambio/submit y no se expone en URL/storage/logs/atributos. Atrás/adelante y validación reiterada no lo cambian. Recargar pierde valores/UUID; no prometer idempotencia entre sesiones. No hay request ni retry de red en esta muestra. No form_start ni evento adicional de pasos.

### Alcance entregable

Solo UI local dos pasos/validación, documentación y pruebas independientes. No POST /api/leads ni adapter que aparente asegurar unicidad. Los estados de red y confirmed_success quedan documentados, no disparados sin requests reales. La puerta development existente permanece; no se activa destino comercial #diagnostico. No secreto, dependencia, integración, general copy ni DS nuevo.

## LF3 — Integración server-side QA, 19/10/2026

La nueva solicitud autoriza receptor real y prueba sintética. Se supera el bloqueo técnico anterior mediante una operación propia de Sheets: addNamedRange con namedRangeId único y appendCells en un batch. Google documenta error por ID de rango existente y atomicidad de subrequests. Esto cambia la evaluación anterior (lookup+append aislado seguía siendo inseguro), no la decisión de usar Sheets. Fuentes: https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#AddNamedRangeRequest y https://developers.google.com/workspace/sheets/api/guides/batch.

### Contrato y decisiones técnicas acotadas

POST {submission_id, contact}; schema estricto compartido. Los campos UI mantienen los límites100/100/254/40/150/2000 y catálogos ya revisados. Body16KiB medido durante lectura, no solo Content-Length. UUID canónico en minúsculas. Email trim y dominio en minúsculas (local-part conservado); teléfono elimina espacios/paréntesis/guiones, preserva +/dígitos, no infiere país ni validez operativa. Estos son parámetros técnicos QA, no criterios comerciales ni política final de lanzamiento.

Timeout proveedor8s y cliente15s, sin retries automáticos. Después de intentar escritura, cualquier incertidumbre devuelve unconfirmed_reception; una lectura de reconciliación puede confirmar fila ya guardada. No repetir escritura automáticamente. Retry manual conserva ID y JSON exactos. Campos/Volver congelados tras iniciar envío hasta confirmar o recibir422 (previo a escritura); no reabrir edición tras posible commit.409 muestra recoverable_error pero no crea otra operación. Esto evita alterar payload de submission ya persistida.

Respuestas accepted estrictas201 nuevo/200 replay incluyen submission_id,lead_id,accepted_at,replayed; solo coincidencia con la submission activa permite UI de éxito. Cliente borra contacto al confirmar y enfoca título.422 muestra campos permitidos sin valores; 400/403/413/415 errores saneados;503 estado según fase. GET405. No logs de proveedor/body/tokens. Solo QA development, flag explícito y Origin/Host local coincidentes; producción siempre503. No usar localhost expuesto por túnel como receptor público.

### Idempotencia y operación

Marcador submission_<UUID sin guiones> sin PII referencia A1 como metadato de reserva, NO como localizador del lead. Fila se busca por submission_id, nunca por posición ni email. Marcador y fila se guardan juntos mediante batch atómico. En caso de límite de rangos/cuota/error, se falla sin éxito falso. Si falta fila pero permanece marcador, no se crea otra: requiere revisión de integridad. No borrar rangos submission_* ni editar IDs/cabeceras; el responsable propietario puede alterar el archivo, lo cual queda fuera de garantía de integridad de la aplicación.

El replay compara campos normalizados y conserva toda adquisición original sin update. Sin fuente consentida, columnas de señales vacías. Método O(n) de lectura del Sheet adecuado a QA; requiere revisar volumen/cuotas/capacidad de rangos y permisos antes de producción. Exportar CSV no preserva marcadores: backup/restore debe incluir rangos y filas coordinadamente.

### Evidencia y alcance

Cuatro POST concurrentes y replay real: una fila, un lead_id. Cambio de contacto con mismo ID409 sin fila extra. Inyección de pérdida de respuesta y lectura fallida DESPUÉS de commit real: uncertain y replay aceptado misma fila. No son fallos reales de Google simulados como disponibilidad observada; es prueba de tolerancia a fallos con persistencia real. Formulario navegador confirmó recepción real con foco correcto. Pruebas en docs/evidence/lead-sheets y validation-report.

Permanecen pendientes privacidad/retención/limpieza QA programada, operación productiva, seguridad pública y medición; no activar offline_events. La hoja conserva únicamente fixtures sintéticos de esta sesión para revisión, sin datos de terceros; limpiar tras revisar usando operación coordinada de fila+marcador, no purga automática no acordada.
