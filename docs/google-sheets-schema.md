# Google Sheets — contrato Lead Flow MVP

19/10/2026. Contrato documental, sin Sheet/tab creada ni API integrada. Adopción en decisions.md. Nombres lógicos leads/offline_events; nombres físicos e ID pendientes. No claves/tokens/PII de prueba en este documento.

## leads

Una fila por submission_id; lead_id estable durante su lifecycle. No deduplicar por email. Las filas no deben usarse como identificador (ordenar/eliminar cambia índices).

| Grupo | Columnas | Tipo/origen y reglas |
| --- | --- | --- |
| Operación | submission_id, lead_id | Strings opacos: UUID de submission cliente; lead_id asignado por servidor al persistir. No reutilizar IDs para otra solicitud |
| Operación | created_at, updated_at | Timestamps UTC ISO 8601 del servidor; replay conserva created_at e identidad |
| Operación | status, lifecycle_stage | Catálogos operativos por cerrar antes de receptor; no inventar eventos comerciales |
| Contacto | first_name, last_name | Texto privado; referencias max100 cada uno |
| Contacto | email | Texto privado sin sustituir por hash; referencia max254, trim; normalización de plataforma diferida |
| Contacto | phone | Texto privado; política final de formato/normalización pendiente, preservar + y ceros; no conversión numérica |
| Empresa | company_name, company_type | Nombre ref150; company_type lead_business/agency/other por correspondencia de catálogo reconfirmado |
| Cualificación | ad_spend | Enum under_2000_usd / 2000_5000_usd / over_5000_usd; mapear desde monthly_ad_spend UI, no persistir label ni deducir revenue |
| Cualificación | problem_to_solve | Texto opcional ref2000; solo first-party, nunca builders de plataformas |
| Adquisición | utm_source, utm_medium, utm_campaign, utm_content, utm_term, landing_page, referrer | Strings saneadas y permitidas; ausencia cuando no hay fuente legítima. No URL cruda con query/fragmento PII |
| Google Ads | gclid, gbraid, wbraid | Identificadores reales, fuente y uso autorizados; nunca fabricados |
| Meta | fbp, fbc | Identificadores reales, nunca construir sin mecanismo autorizado |
| GA4 | ga_client_id, ga_session_id | API válida tras permiso/readiness; no parseo ad hoc de cookies ni fallback aleatorio |
| Consentimiento | analytics_storage, ad_storage, ad_user_data, ad_personalization | Estados reales de fuente válida; sin CMP = DEFERRED/ausencia, no asumir denied/granted |
| Consentimiento | consent_timestamp, consent_version | Instante/versión reales del snapshot; no usar created_at como consentimiento |
| Preparación P1 | external_id, gads_session_attributes | Derivación futura de lead_id según plataforma y atributos de sesión cuando se implementen; sin valores ahora |

Ausencia lógica propuesta: null; representación en celda vacía para campos opcionales/diferidos, nunca literal 'null'/'undefined'. La adopción del contrato de transporte definitivo sigue pendiente. No escribir datos ahora. Si contexto original válido existe, replay lo conserva; no mezclar fuentes ni sobrescribirlo con null, vacío o contexto menos fiable. Validar/sanear en servidor, no confiar en contexto cliente para consentimiento verificado.

P2 city/state/postal_code/country/client_ip_address/client_user_agent quedan fuera del dataset activo hasta autorización. No enriquecer geografía desde teléfono/IP ni solicitar nuevos campos. No copiar PII a historial u offline_events.

## offline_events

Contrato mínimo documental, sin creación física ni dispatch. Una fila por transición futura con offline_event_id nuevo; submission_id/lead_id referencian el lead, no su posición. No generar registros de lifecycle ahora.

| Columnas | Tipo/regla futura |
| --- | --- |
| offline_event_id, submission_id, lead_id | Identificadores string; evento único y referencias estables |
| event_name, lifecycle_stage | Catálogo por adoptar en measurement antes de activar; ejemplos del brief no son catálogo productivo |
| event_time, created_at | Timestamp real del evento y de registro, UTC; no convertirlos en una fecha ficticia |
| value, currency | Valor/moneda reales cuando apliquen; no derivar de ad_spend ni default a 0/USD |
| source_system | Fuente real; no inventar CRM conectado |
| ga4_status, ga4_sent_at, ga4_error_code | Resultado real específico; sin envío no registrar sent/success |
| gads_status, gads_sent_at, gads_error_code | Estado independiente Google Ads |
| meta_status, meta_sent_at, meta_error_code | Estado independiente Meta |
| attempt_count | Conteo real de intentos del proceso futuro; no worker activo |

## Escrituras y seguridad requeridas

Servidor exclusivo y módulo server-only. Verificar método, Content-Type, origen permitido, bytes del cuerpo (referencia16KiB pendiente de contrato), schema estricto y allowlist. No logs de body/valores, errores sin eco ni secretos. Celdas de entrada como RAW o stringValue, nunca USER_ENTERED: evitar ejecución de fórmulas =/+/-/@ y conversión de teléfono/IDs. Prueba de fórmula obligatoria antes de integración.

No implementar lookup+append como garantía concurrente: debe protegerse consulta+creación y reconciliar timeout tras commit. Resultado accepted solo después de confirmar escritura e identidad verificable; ante respuesta perdida, unconfirmed_reception y retry con misma submission_id/datos. No confiar solo en 2xx. El lead existente debe retornarse sin una segunda fila; conflicto de payload/procedimiento de edición tras envío incierto por adoptar. No sobrescribir silenciosamente contacto persistido.

La atomicidad batch de Google Sheets cubre subrequests del batch, no una consulta anterior ni unicidad por columna. Fuentes: [batch](https://developers.google.com/workspace/sheets/api/guides/batch), [append](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append). Diseñar y adoptar exclusión compatible antes de backend. UUID/doble-click guard por sí solos no prueban idempotencia.

## Configuración QA que debe crear José

1. Crear un spreadsheet desde su cuenta personal, acceso general Restringido. Solo datos sintéticos mientras privacidad/operación QA no esté cerrada.
2. Crear/elegir proyecto Google Cloud y habilitar Google Sheets API.
3. Crear Service Account dedicada al receptor. Compartir únicamente el spreadsheet de QA con el email de esa Service Account como Editor; no usar contraseña personal ni enlace público. No necesita delegación global de dominio para este archivo compartido.
4. Elegir mecanismo de credenciales server-side: para local, credencial privada guardada fuera del repo y del chat; para hosting, secreto protegido apropiado al proveedor. No incluir nada NEXT_PUBLIC ni en Sheets. Los nombres definitivos de variables se acordarán al configurar, no se inventan en .env.example.
5. Aportar ID no secreto del spreadsheet y confirmar nombres físicos de tabs (leads/offline_events propuestos), cabeceras y acceso de escritura. offline_events puede quedarse solo documentado hasta fase posterior.
6. Adoptar mecanismo de serialización, política teléfono/normalización, estados operativos y errores/timeout; probar escritura/lectura, concurrencia y pérdida de respuesta con datos sintéticos y limpieza acordada.

La cuenta personal es propietaria posible de QA; no acredita políticas/propiedad/continuidad productivas. Acceso servidor: [Service Accounts de Google](https://developers.google.com/identity/protocols/oauth2/service-account). No se creó recurso remoto ni se solicitó clave en el chat.

## Estado implementado — 19/10/2026

leads ya provisionado y validado en QA. Cabeceras exactas en src/lib/server/lead-store.ts (36 columnas A:AJ). Configuración runtime en .env.local ignorado, credencial fuera del proyecto. offline_events sigue contrato documental sin escritores ni envíos.

Corrección al análisis previo: unicidad de columna no existe, pero Sheets sí rechaza un addNamedRange con ID existente. El receptor combina ese marcador y appendCells en un solo batch atómico; prueba real concurrente PASS. Marcador no contiene contacto y no almacena fila/índice. Conservarlo durante toda vida idempotente de la submission, junto con su fila. No borrar/editar IDs o rangos técnicos desde operación manual; backups deben incluirlos. Borrado y retención finales siguen pendientes.

POST v2: {submission_id: UUID, contact: ocho campos del schema}. No contexto inventado. Campos de plataforma/consentimiento/adquisición vacíos por falta de fuente autorizada, no strings null/undefined. No acepta ni confía en IDs de plataforma enviados arbitrariamente desde clientes. Status received; lifecycle_stage sin catálogo permanece vacío.

Normalización: email trim y dominio lowercase; teléfono solo elimina espacios/paréntesis/guiones, conserva + y ceros. Valores de texto como stringValue en appendCells, incluyendo =/+/-/@; no ejecutar fórmulas. Límites y errores HTTP detallados en lead-form-review LF3. No HMAC adicional de contacto: replay compara contra los campos privados ya almacenados, evitando duplicar PII/digest en otra columna.

Utilidades: scripts/sheets-qa-setup.mjs solo crea cabeceras si hoja vacía, nunca sobrescribe esquema diferente; scripts/sheets-qa-test.mjs genera una submission sintética y comprueba concurrencia/replay/mapping; scripts/sheets-qa-timeout.mjs induce pérdida de respuesta tras commit real. Requieren entorno .env.local, --conditions=react-server y --experimental-strip-types en Node22. No correr repetidamente sin necesidad: cada suite conserva una nueva fila QA.
