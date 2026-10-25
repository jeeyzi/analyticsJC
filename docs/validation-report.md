# Completion Report — foundation local

## Cierre final Web Measurement local/QA — 25/10/2026

### Documentation Updated

Actualización exclusivamente documental. Nueva evidencia manual aportada por José en el chat: [WM-QA-FINAL-2026-10-25](evidence/acquisition/manual-final-qa-2026-10-25.json). Fecha de registro, sin inventar fecha de prueba, capturas, IDs ni nueva ejecución del agente. Evidencia histórica conservada; este cierre sustituye solo sus estados QA ya resueltos.

### Final Measurement Status

**LOCAL / QA MEASUREMENT: VALIDATED**. Recorrido Browser → GTM → GA identity → application → /api/leads → Google Sheets VALIDATED QA, incluyendo lead real QA con IDs reales confirmado por José. No production-ready. H-09 resuelto para integración QA de esta fase, no para producción ni toda configuración de plataforma.

### Validated

| Alcance / criterio | Resultado QA | Procedencia |
| --- | --- | --- |
| WM-01/02/03/04/05 arquitectura dataLayer, CTA/start/error/submit | VALIDATED | Pruebas previas del agente + confirmación manual final de eventos |
| WM-06 generate_lead / prevención de duplicados / retry | VALIDATED | accepted válido, dedupe, timeout/replay previos; sin nueva ejecución |
| GTM + GA4 + cookies first-party Google | VALIDATED | Confirmación manual José |
| page_view automático | VALIDATED | Confirmación manual José; no implementación manual ni nueva matriz pathname/hash atribuida al agente |
| ACQ-01/03/04/10 UTMs dinámicas / gclid / gbraid / wbraid → Sheets | VALIDATED | End-to-end manual José + fixtures/lecturas reales previas |
| ID-01/02/03 último contexto válido / actualizaciones / fuente GTM | VALIDATED | Implementación/tests/recorridos previos y fuente real confirmada por José |
| ID-04 GA IDs reales → Sheets | VALIDATED | Lead real QA confirmado por José con ambos IDs, submission_id/lead_id, acquisition disponible y contacto privado |
| ID-05/06 snapshot/retry/ausencia | VALIDATED | identity/browser.json y sheets.json; retry idéntico, una fila y captación sin IDs |
| ID-07 bridge / aislamiento de GA4 | VALIDATED en contrato QA | Usuario confirma evento técnico no enviado a GA4; mapper/tests previos sin user_data/GA IDs custom |

GTM confirmado: Analytics Client ID; Analytics Storage → Session ID → Measurement ID específico de GA4. analytics_identity_ready entrega ga_client_id/ga_session_id solo a aplicación. get/callback500ms retirados; sin dos fuentes concurrentes ni parseo manual de cookies.

Query antes del hash: `/?utm_source=test&utm_medium=test#diagnostico` soportado; `/#diagnostico?utm_source=test` no soportado. No cambia parser. generate_lead.user_data solo QA: email/phone_number y first_name/last_name en estructura existente (nombres en address); excluido de GA4. GA IDs exclusivamente contexto privado; GA4 solo parámetros analíticos aprobados.

Checks técnicos anteriores:34/34tests, typecheck/lint/build PASS en implementación de identidad. No se ejecutaron otra vez para editar documentación. Revisión de esta tarea: JSON parseable, enlaces locales existentes, coherencia/diff documental y hashes SHA256 de archivos técnicos sin cambios.

### Deferred

NOT VALIDATED / DEFERRED: Meta Pixel/_fbp/_fbc/fbp/fbc, Consent Mode, CMP, producción/tráfico productivo real, offline event delivery, Google Ads offline conversions, Enhanced Conversions, Meta CAPI y GA4 Measurement Protocol. Sin fuente Meta validada; columnas vacías válidas, sin fabricación. No se infieren pruebas nuevas de dimensiones/key events, cada variante pathname/hash, saneamiento automático de URL/PII, revocación, dispositivos físicos, rendimiento o certificación de accesibilidad.

### Production Blockers

H-07/H-08: mecanismo/copy/política de consentimiento y revocación, a resolver por José con mecanismo/proveedor adoptado. H-04/H-05: dominio/contactos operativos e información real de privacidad, finalidades/destinos/retención/borrado. Operación/seguridad/credenciales y condiciones de Deployment pendientes según alcance vigente de Sheets, sin reintroducir arquitectura histórica sustituida. H-09 producción: permisos/configuración/entorno y validación de release no se cierran por QA. No despliegue ni tráfico productivo autorizados por este registro.

### Known Issues / límites

Nueva evidencia externa es confirmación manual del usuario, no captura Preview/DebugView/Network ni nueva lectura de proveedor por el agente. Los NOT VALIDATED antiguos de fuente/integración QA quedan cerrados mediante esta evidencia adicional; sus resultados originales, errores corregidos y fixtures sintéticos permanecen intactos. Sin afirmación de cumplimiento legal o readiness productivo.

## GA identity mediante GTM — 25/10/2026

### Implemented

Solicitud explícita de José y arquitectura adoptada en decisions.md. Root cause: aplicación solo tenía gtag get/GoogleTagReady, no consumidor del evento GTM validado por José. Nuevo identity.ts observa último par completo válido histórico y push futuro, memoria documento y copia síncrona; runtime retira get/readiness/500ms y usa esa única fuente. LeadForm retira await previo al frozen JSON, sin cambiar demás contrato/retry. Env example deja de pedir Measurement ID. Backend/columnas/GA4mapper/UI/user_data/acquisition sin cambios. Informe completo con nueve secciones solicitadas en identity-review.md. Sin commit de esta tarea.

### Validated

ID-01/02/03 PASS:34tests totales y navegador pre/post-mount; validación de ambosIDs, inválidos/templates/ausentes, wrappers, par atómico y snapshots aislados. ID-04 PASS: tres leads sintéticos contra receptor y Sheets reales, exactamente una fila/submission; pre/post guardan ambosIDs, missing vacíos; cabecera36columnas intacta. ID-05 PASS: primer POST201 persistido, respuesta retrasada16s provoca timeout cliente15s/unconfirmed/0lead; evento posterior cambia memoria; retry JSON byte-idéntico,200replayed, mismo lead_id/una fila/1generate_lead. ID-06 PASS: ausenciaIDs no bloquea accepted ni confirmed_success. ID-07 PASS aplicación: evento técnico no allowlisted ni mapeado; IDs rechazados por mapper/eventos, sin keysIDs en eventos web de QA. ID-08 PASS:34/34tests, typecheck/lint/build exit0, git diff --check exit0, Next16.4.3. Evidencia docs/evidence/identity/browser.json,sheets.json,tests.tap; script identity-sheets-verify.mjs lee servicio real sin exponer contacto/credenciales.

Fallos QA ejecutados:2tests iniciales por factory con defaults que ocultaban undefined explícito; corregida factory, expectativas preservadas y suite34/34PASS. Primera observación navegador antes de efecto daba runtime ausente: espera explícita de bootstrap solucionó harness. Primer ensayo timeout esperó mensaje histórico equivocado y agotó selector; aplicación sí mostró unconfirmed_reception correcto. Se repitió con copy real sin cambiar UI; ensayo previo dejó una fila sintética adicional no borrada.

### Not Validated

Origen Google real y destino GA4/Preview no repetidos por agente: carga normal localhost no tenía analytics_identity_ready. José aporta validación manual Preview de IDs reales y ningún tag para evento; se registra como evidencia aportada. QA inyectó identidades sintéticas y bloqueó Google en contextos aislados para evitar envío de fixtures. Por tanto ID-07 extremo externo/GA4/producción/Consent/campo NOT VALIDATED; PASS local no acredita recepción/ausencia de evento en propiedad GA4. Sin prueba de dispositivos físicos ni matriz responsive completa por cambio sin UI.

### Pending

José: confirmar Preview con aplicación actualizada/origen real y, si corresponde, revisar DebugView/Network sin analytics_identity_ready ni ep.ga_client_id/ep.ga_session_id (IDs nativos GA cid/sid son distintos de custom params). No bloquea implementación local; cierre externo H-09/activación conserva condiciones Privacy/H-07/H-08 y producción existentes.

### Known Issues

Sin polling/cookies/fallback get ni fuente concurrente. Terceros que reemplacen push sin delegar podrían evitar observación inmediata; snapshot rescanea historia y recupera último evento disponible. Documento nuevo sin IDs continúa sin medición privada. Node sigue con warnings experimentales/tipo módulo preexistentes. No se atribuye al agente validación real de fuente GTM aportada por José. Ver identity-review.md para Root Cause/Architecture/Sheets/Retry/Isolation/Fallback y límites.

## Actualización de seguridad Next.js — 23/10/2026

### Implemented

Solicitud explícita de ejecutar next upgrade --agent=security. CLI selecciona Next.js16.4.3 exacto desde16.4.0. Instalado con npm y lockfile fijado; política experimental.agentUpgrade=security. Worktree aislado codex/next-security-16-4-3, commit a47d26a (solo package.json/lock/config). Mismo parche aplicado al checkout actual sin incorporar cambios previos al commit aislado. eslint.config.mjs declara tres globals reales para script Node GTM existente. decisions/technical/acceptance y next-security-review.md registran alcance. Sin despliegue ni cambios de UI/contratos.

### Validated

SEC-UP-01 PASS: npm install exit0 y next --version=16.4.3 en ambos árboles; npm audit actual exit0 con total0 conocidas (evidence/next-security/npm-audit.json). SEC-UP-02 PASS: worktree typecheck/lint/build y6/6tests; checkout actual typecheck/lint/build y31/31tests (tests.tap). SEC-UP-03 PASS parcial local: dev reiniciado en127.0.0.1:3000 muestra Next16.4.3; navegador Chromium abre Home/formulario, ChileCL/límite9; GTM bootstrap/externo ambos HEAD; vacío no CTA/API; sintéticos válidos avanzan Step2 con un click_to_action/continue_diagnosis y0form_submit/lead/API. Network gtm.js200 y ninguna solicitud /api/leads. browser.json/continue.json/network.txt. Sin error de hidratación observado.

Fallos ejecutados: preparación sandbox sin npm; tests baseline sin condición react-server fallan guard server-only; repetir con condición correcta6/6PASS; lint checkout actual falla4globals Node del script deliverables/gtm existente. Entorno ESLint corregido declarativamente y lint/build repetidosPASS. No se modificaron tests para esconder fallos.

### Not Validated

SEC-UP-03 integración/producción/campo NOT VALIDATED: no envíos reales Sheets, concurrencia/timeout, GA4/Ads/Preview/Consent/despliegue ni pruebas de explotación por este parche. npm audit0 es estado del registro conocido, no certificación universal. No repetida matriz completa responsive/teclado/dispositivos físicos.

### Pending

Sin remoto: PR no aplica hasta configurar repositorio remoto. Commit aislado disponible a47d26a; checkout actual conserva cambios previos sin commit. H-07/H-08/H-09/Privacy y puertas de lanzamiento existentes conservadas; no bloquean parche local, sí activación correspondiente.

### Known Issues

Browser solicita /favicon.ico y recibe404; sin favicon en app actual, no bloquea formulario. Se deja fuera del parche de seguridad. Sin otros warnings/errores de consola observados en ventana probada. Warnings Node strip-types/tipo módulo existentes. Worktree/checkout preservan React19.3.0; CLI eligió Next16.4.3 y audit no reporta vulnerabilidades actuales. Script Node requiere globals ESLint; corregidos sin alterar ejecución. Historial completo de fallos y límites en next-security-review.md.

## Primer CTA y teléfono internacional — 21/10/2026

### Implemented

Confirmaciones de José registradas en decisions.md: Continuar emite evento solo si Step1 válido permite avanzar; selector de países con Chile inicial. LeadForm/PhoneField/Field, schema compartido y contrato measurement implementan click_to_action (continue_diagnosis/form_step_1/diagnosis_step_2), prefijo +56 y 9 dígitos nacionales CL; otros países usan metadata fijada libphonenumber-js1.13.15. Opciones españolas serializadas por LeadFormPreview para mismo render servidor/cliente. Sin nuevas columnas/contacto en analytics ni cambios al accepted/replay. Detalle en form-phone-review.md. Sin commit.

### Validated

PHONE-01/02/03 y CTA-F1-01 PASS en alcance local: browser-final.json registra Chile inicial, límite9, US+1/límite10, inválido sin CTA, dobleclick válido con un CTA, Enter válido, form_start1 y cero form_submit/generate_lead/recursos API. No se envió formulario final. 31/31 tests PASS con `node --conditions=react-server --experimental-strip-types --test tests/*.test.mjs`; tests-final.tap. npm run typecheck/lint/build exit0. git diff --check exit0. Recarga final sin warnings/errors en consola durante ventana observada.

FAIL ejecutados y resueltos: import metadata con atributo JSON incompatible con wrapper exportado; hidratación por diferencias ICU de Intl.DisplayNames servidor/navegador; comando de tests sin condición react-server. Corregidos import, opciones serializadas y comando respectivamente; repetición completa PASS sin modificar tests para ocultar fallos. browser.json conserva evidencia anterior del aviso de hidratación; browser-final.json documenta repetición limpia. phone-field.png muestra control vacío sin PII.

### Not Validated

GA4/Preview externo/Consent/producción/campo y existencia/titularidad telefónica NOT VALIDATED. No se repitió integración real Sheets ni concurrencia/timeout por esta modificación; no equivalen a PASS actual de esos flujos. No acredita dispositivos físicos, lector completo ni rendimiento de campo.

### Pending

José: H-09, configurar/validar parámetros CTA en GTM/GA4 para cerrar destino externo. H-07/H-08/Privacy y demás condiciones de lanzamiento mantienen sus puertas. No bloquean esta prueba local; sí la activación productiva correspondiente.

### Known Issues

Aviso de hidratación corregido usando props serializadas; ningún warning/error en recarga final observada. Runner Node emite advertencias experimentales de strip-types/tipo módulo; suite exit0. Longitud posible no acredita número real. Mensajes genéricos aprobados conservados; futuros cambios de planes telefónicos requieren actualizar metadata. Captura IAB incluye área vacía de su superficie; prueba de controles también documentada por DOM/CDP.

## Corrección React script/HMR — 21/10/2026

### Implemented

RootLayout deja de renderizar script JSX. GtmHead devuelve null y useEffect instala bootstrap/gtm.js directamente en document.head con createElement. Gtm helper conserva gates, dedupe, dataLayer y exclusión de producción. Sin cambios UI/Lead Flow/GA4/Consent.

### Validated

GTM-H-01: FAIL anterior aportado por José (Encountered a script tag...) durante render cliente. Corregido; PASS IAB recarga y Fast Refresh real (logs rebuilding/done, mismo timeOrigin): ambos scripts HEAD, un gtm.start/recurso, sin console error/warning tras cambio. Evidencia browser-head-effect.json;4/4testsGTM y suite27/27, typecheck/lint/build PASS. No silenciar logs ni cambiar tests para esconder fallo. HTTP-client-head.json distingue instalador cliente de script SSR. Sin submits/PII.

### Not Validated

GA4/Tag Assistant completo/Consent/productivo/campo y flujos de captación completos no revalidados por este cambio. Carga tras hidratación: ausencia de snippet en HTML SSR es esperada y no equivale a ausencia en HEAD del navegador.

### Pending

H-09 destinos/configuración/QA externa y H-07/H-08/Privacy/operación conservan sus puertas. Ninguna autorización nueva de tracking productivo.

### Known Issues

La corrección anterior de HEAD omitió probar Fast Refresh; se reconoce y conserva evidencia. Error React corregido sin mover scripts a BODY. No errores/warnings en ventanas de recarga/HMR observadas; no afirmación universal sobre tags remotos.

## Corrección ubicación real GTM HEAD — 21/10/2026

### Implemented

Bootstrap inline HTML nativo en root head, retirado next/script para ese snippet; gtm.js se inserta explícitamente en document.head. Gates/ID/dataLayer/dedupe/producción preservados. tests/gtm y verificador HTTP comprueban HEAD real, no ID serializado. Fuentes/adopción en decisions y gtm-head-review.

### Validated

GTM-H-01 previo FAIL: captura de José muestra script en BODY; verificación HTTP anterior insuficiente para DOM. Corregido y PASS IAB Chromium localhost tras recarga: parent HEAD para ambos scripts, bootstrap1/container1/gtm.start1/recurso1; una petición gtm.js200, contenedor registrado, warnings/errors=[] y Network sin truncación. Evidencia docs/evidence/gtm-head/browser-native-head.json.3/3tests helper, typecheck/lint/build PASS. Sin submits/contacto para QA. HTTP nativo/producción en http-native-head.json.

### Not Validated

GA4 DebugView/recepción/pageviews, tags remotos/Preview completo/PII, Consent/producción/campo no se acreditan por ubicar snippet. No nuevo QA de formulario/Sheets por este cambio aislado.

### Pending

H-09 configuración y QA de destinos por José; H-07/H-08/Privacy/lanzamiento siguen abiertos. Usuario puede comprobar document.getElementById('analyticsjc-gtm-bootstrap').parentElement.tagName y analyticsjc-gtm-container: ambos HEAD.

### Known Issues

Fallo BODY anterior corregido y limitación del verificador antiguo reconocida; evidencia histórica conservada. La nueva pestaña local válida se inspeccionó; no se reutilizó ni sorteó pestaña error bloqueada. Sin errores/warnings en la recarga observada; no afirmación universal sobre tags. El cambio no habilita producción.

## GTM head QA — 21/10/2026

### Implemented

GTM-K5MZ4W66 solicitado por José integrado en root head mediante next/script beforeInteractive y helper gtm.ts. ID por entorno; GTM_QA_ENABLED únicamente development/local y guard navegador loopback/script único. .env.development.local local habilitado; no credenciales ni activación productiva. Contrato/Lead Flow anteriores preservados. Revisión en gtm-head-review.md.

### Validated

GTM-H-01 PASS:3tests nuevos gates/duplicación/mismo array/async/fallo seguro; suite26/26, typecheck/lint/build PASS. HTTP local200:1bootstrap en head con ID/estrategia correctos; gtm.js público200,335081bytes (lectura, no ejecución navegador). Artefacto producción sin GTM QA. Evidencia docs/evidence/gtm-head/http.json; script reproducible node --use-system-ca scripts/gtm-qa-verify.mjs con acceso red fuera sandbox y CA Windows, TLS verificado. Sin submits/contacto en QA loader.

### Not Validated

GTM-H-02 navegador/Preview/Tag Assistant/Network de tags, GA4 y su recepción/configuración/pageviews/PII/GA IDs, Consent y producción/campo. HTTP200 no PASS global M-02, H-09 ni ingestión GA4.

### Pending

José: revisar/configurar contenedor real y Preview, GA4 y readiness, allowlists y recogida automática desactivada antes de pruebas de lead. H-09 parcial (ID aportado); H-07/H-08/Privacy/operación bloquean lanzamiento. No autorización de Ads/Meta/user_data hacia plataformas.

### Known Issues

Lint del script HTTP inicialmente FAIL (AbortSignal/Buffer sin declarar), corregido con referencias/import explícitos; repetición final registrada. No cambios de tests para ocultar fallos.

Política de navegador rechazó acceso a pestaña error; no workaround, ejecución navegador NOT VALIDATED. LocalHTTP inicialmente inaccesible por proceso sandbox; reinicio de proceso propio fuera en3000 resolvió. EADDRINUSE intermedio, resuelto. Google TLS inicial FAIL de CA Node; --use-system-ca PASS sin desactivar TLS. Warning filesystem lento, no medición de performance. Datos restringidos siguen en dataLayer compartido; comportamiento de tags remotos no acreditado.

## Web Measurement local/QA — 20/10/2026

### Implemented

Decisiones explícitas registradas en decisions.md; contrato/diccionario/payloads/mapping y límites en web-measurement-review.md. Sin commit nuevo; cambios anteriores preservados. src/lib/measurement/{events,runtime}.ts y componentes measurement implementan dataLayer central/allowlist/dedupe/QA gates, CTA y eventos del formulario sin cambiar UI. ga privado opcional en contrato/lead-store mapea columnas existentes; no toca operación atómica, llave, adquisición ni replay. Sin tag loader ni eventos manuales de página, measurement_version, Ads/Meta/CMP/offline.

### Validated

Windows, Node22.17.0/npm10.9.2; desarrollo local existente http://127.0.0.1:3000, IAB Chromium desktop y375px emulado por teclado. Solo fixtures sintéticos; Sheets privado real. Evidencia saneada en docs/evidence/measurement: browser-replay.json, browser-isolation.json, sheets-verification.json, security.json, source-hashes.json y capturas de éxito. La pérdida de respuesta es inyección cliente DESPUÉS de HTTP201/commit real, no caída observada de Google. 422/503 de segundo recorrido son MOCKS explícitos; POST final201/lectura de fila sí reales.

| ID | Resultado | Método/evidencia y límite |
| --- | --- | --- |
| WM-01/M-01 local | PASS | Inicialización idempotente, mismo array, schema runtime/tipos; rechaza eventos/keys no adoptados, sin measurement_version ni eventos de página propios |
| WM-02/C-03 local | PASS | Hero dblclick →1evento, solución click →1, experiencia Enter →1, header click →1; cuatro ubicaciones correctas, sin evento submit como CTA |
| WM-03/M-04 local | PASS | Foco por validación sin start; editar→1start, Step2/Volver/corrección/retry sin otro; bootstrap repetido y runtime compartido; unidad fallback+dedupe. Strict Mode desarrollo, no prueba de remount React completo entre rutas |
| WM-04/M-05 local | PASS | Cliente vacío multiple, inversión requerida solo campo; Continuar inválido sin POST. 422mock→server/email/server_validation;503mock→reception/none/recoverable_error. Unitarios de formatos/opciones/límites y múltiples campos |
| WM-05 local | PASS | POST initial y retry observados; doble click de submit →1POST activo. No submit de cambio de paso |
| WM-06/M-06 local | PASS | 201real con respuesta descartada→uncertain/0lead; retry JSON idéntico→200replay/1lead. Nuevo accepted/evento de mismo lead rechazado por Set; unitarios malformed/202/otra submission |
| WM-07/M-07/PR-02 local | PASS | PII solo cuatro campos user_data al generar lead; empresa/problema ausentes en measurement, sin PII fuera de estructura. Mapper probado con payloads/reset null; allowlist GA4 exacta sin user_data. No acredita contenedor externo |
| WM-08/M-09 contrato | PASS parcial | get mock con ambos campos, undefined/error/timeout total500ms, bridge mismo array, callbacks tardíos ignorados; mapping privado unitario. Navegador sin tag: IDs omitidos/celdas vacías. Fuente real Google NOT VALIDATED |
| WM-09/E-06 local | PASS | Push lanza2veces (submit/lead), UI confirma201real con foco éxito y fila real; medición perdida no se reenvía. Ocho replays HTTP concurrentes sobre2fixtures existentes→200/mismo lead/una fila/contexto inmutable |
| ACQ/Lead baseline acotado | PASS | Cinco campos/IDs opcionales siguen saneador;2filas reales conservan snapshot esperado y retry exacto. Suite previa13tests incluida. GA/Meta/consent ausentes; no afirmar revisión global de baseline |
| WM-10/B-03 | PASS | node --conditions=react-server --experimental-strip-types --test tests/*.test.mjs:23/23; npm run typecheck, npm run lint y npm run build exit0. Tests GA callbacks son mocks, no integración |
| B-05/PR-02 escaneo local | PASS parcial |139assets y1log inspeccionados:sin credencial/SheetID ni marcadores contacto de esta fase. No logs de hosting/proveedor |
| B-06/Network local | PASS parcial |104entradas request/response, sin truncación ni destinos externos; POST201/200; warn/error=[] en recorrido. Solo ventana observada |
| Responsive/teclado local | PASS parcial |375px:sin overflow y errores/retry/éxito operables por teclado. No dispositivos físicos ni validación táctil |

### Not Validated

page_view automático inicial/pathname/hash en Google Tag real (M-03 sustituido), GTM/GA4 recepción real/Preview/Tag Assistant/DebugView/key event/Custom Dimensions; GA IDs reales y su persistencia real; H-07/H-08/CO-*, privacidad productiva, producción/campo/CWV/seguridad pública/CI/servicios excluidos. Remount React real entre rutas y autofill nativo completo pendientes (runtime/dedupe y fallback probados unitariamente). Fuente de GA no disponible no equivale a PASS integración. Ausencia de requests externos no acredita consentimiento. Móviles físicos, touch, lector de pantalla y auditoría WCAG completa no ejecutados.

### Pending

- José: H-09 contenedor/propiedad QA y permisos, autorización/configuración de prueba externa; verificar pageviews automáticos y URL/referrer saneados antes de cualquier request. Bloquea medición externa, no contrato local.
- José: H-07/H-08 Consent/Storage Governance, revocación y política final; contactos/privacidad/retención/protección/operación productivas. Bloquean lanzamiento público.
- Responsable QA/José: revisar2fixtures sintéticos nuevos y limpieza coordinada fila+marcador. No se borran registros ni rangos en esta fase;8replays de auditoría no crearon filas nuevas.

### Known Issues

- Lint inicial FAIL por prefer-rest-params en bridge arguments oficial; regla localizada/documentada y repetición PASS. No cambio de tests para ocultar fallos.
- Intentos de servidor3100 fallaron: npm/PowerShell perdió --port; CLI directa detectó servidor previo3000. Acceso localhost restringido en sandbox. Se reutilizó servidor existente mediante flags QA temporales, sin detenerlo. Auditoría Sheets fuera sandbox PASS.
- IAB device emulation375px: clicks de Continuar no activaron cambio visible; teclado Enter funcionó, sin overflow ni errores de consola. FAIL de recorrido inicial por click emulado. Repetición con capability viewport soportada: Continuar/Volver por click PASS, sin cambio de código ni nueva submission; solicitados375×812, observados417×902 CSSpx. Evidencia responsive.json; no afirmar375px por click/touch ni atribuir fallo inicial definitivamente a producto. Touch/dispositivo real pendiente.
- Node22 conserva warnings experimentales strip-types/module type, tests exit0. No cambios de stack/dependencias para silenciarlos.
- dataLayer es memoria compartida y conserva PII restringida de lead hasta destruir documento; sin tags de terceros activos. Fallo de push puede perder eventos, deliberadamente sin replay. No rendimiento ni cumplimiento universal acreditados.

Actualización final: segundo typecheck/build PASS y tests23/23 PASS con salida tests.tap. production-artifact.json PASS sobre HTML generado: sin preview de formulario, MeasurementBootstrap, scripts GTM/GA ni eventos de página manuales/measurement_version. No es prueba de deployment. Archivo temporal .env.development.local retirado; .env.local y servidor previo preservados; fetch/push de QA y viewport restaurados. Secrets/log scan final se registra por separado con su conteo real. Los2fixtures de Sheets permanecen para revisión, sin limpieza destructiva.

## Corrección valores dinámicos — 20/10/2026

Ver acquisition-dynamic-values-review.md. 13/13 tests PASS, lint PASS, build con TypeScript PASS. Suite Sheets real con campaña/ID generados en runtime PASS: mapping, una fila por submission concurrente, replay sin cambios y ausencias vacías. Evidencia docs/evidence/acquisition/dynamic-values-qa.json. Dos filas sintéticas nuevas conservadas. Auditoría124 assets/1 log sin credenciales ni marcadores de PII de QA. Primera prueba UUID/defensa teléfono FAIL por falso positivo, corregida y regresión PASS. No nueva prueba de navegador en esta corrección; snapshot/retry UI no modificados. No garantías de ausencia universal de PII ni validación productiva/CMP/plataformas. Persistencia entre reloads no implementada, dependiente de futura decisión Consent/CMP.

## Actualización Acquisition QA — 20/10/2026

Clasificación, excepción local adoptada y evidencia ACQ-01..10: [acquisition-review.md](acquisition-review.md). PASS limitado a captura sintética, navegación interna corregida, persistencia real y replay. M-09/M-10/CO-* y producción NOT VALIDATED. Prueba inicial navegación FAIL; enlace corregido y repetición PASS. Baseline Sheets preservado. El informe foundation siguiente es histórico.

Fecha: 10/10/2026, America/Santiago. Windows, Node 22.17.0, npm 10.9.2. Build optimizado en http://127.0.0.1:3000. Navegador: Codex In-app Browser (Chromium), viewports emulados; no dispositivos móviles reales. Commit: no existe; carpeta sin Git/remoto. Sin despliegue, mocks ni servicios de recepción.

Los sufijos `/foundation` identifican subcasos limitados de criterios existentes; no son nuevos requisitos ni PASS del criterio completo del MVP. Foundation implementada y checks locales aprobados; MVP y release no terminados.

### Implemented

- Next.js 16.4.0 App Router, React 19.3.0, TypeScript 6.0.3 strict; npm único, versiones exactas y package-lock.json. Zod 4.6.5 y server-only disponibles. Fuente: technical/decisions.
- `src/app/layout.tsx`, `page.tsx` y CSS Module: layout server, metadata literal de content, lang es, noindex y muestra mínima. Sin canonical/OG inventados ni landing completa.
- `src/components/layout`: Container, Header y Footer server; enlaces a destinos existentes, sin mailto provisional ni CTA sin formulario.
- `src/styles/tokens.css` y `globals.css`: paleta, escala espacial, radios, tipografía, gutters, breakpoints, foco, reduced motion y forced colors de design.
- `public/fonts`: Inter variable Latin local (uso 400–600), licencia y procedencia. `src/content/site.ts`: extractos literales del copy.
- `.env.example`, `.nvmrc`, `.npmrc`, TypeScript, ESLint y scripts locales; `next.config.ts`: headers básicos, rechazo de entorno no local y medición activada. No sustituye autorización de despliegue.
- Revisión en `foundation-review.md`; autorización acotada en decisions/handoff-review. `docs/acceptance.md` remite a matriz raíz. Siete fuentes originales intactas y hashes coincidentes.

### Validated

Evidencia: [checks](evidence/checks.md), [responsive.json](evidence/responsive.json), [Network](evidence/network.json), [Console](evidence/console.json), [DOM](evidence/dom.txt). Capturas: [320 px](evidence/foundation-320.png), [768 px](evidence/foundation-768.png), [1440 px](evidence/foundation-1440.png); también 375/767/1023/1024/1280.

| ID / subcaso | Estado | Método / resultado observado |
| --- | --- | --- |
| B-01/foundation | PASS | Lectura completa, 7/7 SHA256 coinciden; autorización local registrada. No adopta pendientes operativos. |
| B-02/instalación local | PASS | npm ci exit 0; 126 paquetes instalados, 127 auditados, cero vulnerabilidades. Lockfile presente, no versionado aún. |
| B-03/typecheck | PASS | npm run typecheck fuera del sandbox, exit 0; tipos generados y tsc sin errores. |
| B-03/lint | PASS | npm run lint, repetido tras npm ci, exit 0 sin warnings. Core/TypeScript; límites del preset abajo. |
| B-03/build | PASS | npm run build exit 0; compilación 6.7 s, TypeScript 6.0 s; `/` y `/_not-found` static. Sin pruebas API/formulario. |
| B-04/foundation | PASS | Build e inspección src: componentes propios server; sin CMS/ORM/estado global/animación. |
| B-06/carga local | PASS | Console en carga/reload/salto: warnings/errors vacío. No cubre flujos pendientes. |
| B-07/foundation | PASS | Comparar DOM/src/content/rutas: muestra `/`, wordmark, footer, skip link; sin campos/promesas añadidos. |
| R-01/foundation | PASS | Viewports efectivos 320,375,767,768,1023,1024,1280,1440; scrollWidth igual al ancho. Capturas guardadas. |
| R-02/foundation | PASS | H1 36px móvil, 44px a 768, 56px a 1280/1440; body 16/18px; gutters 20/32/40px. Un WOFF2 local, rango CSS 400–600. |
| N-01/home | PASS | HTTP 200 + navegador; H1 y lang es en HTML inicial. |
| A-01/foundation, A-02/skip link | PASS | Un H1/header/main/footer; Tab muestra skip link, Enter actualiza #contenido y enfoca main. No lector de pantalla. |
| A-05/preferencias | PASS | Emulación reduce: scroll auto; forced colors: outline visible. Overrides restaurados. |
| S-01/metadata local, S-02/HTML local | PASS | HTTP/DOM: title/description literales, lang es, noindex/nofollow y contenido SSR. Sin canonical placeholder. |
| M-11/foundation, P-03/fuente local | PASS | Network tras reload: 9 requests locales (documento, WOFF2, 2 CSS, 5 scripts Next). Sin GTM/GA/píxeles/fuentes remotas. No valida consentimiento. |
| D-08 | PASS | Informe con cinco secciones, IDs, evidencia y límites. |
| B-03/dependencias iniciales | FAIL, corregido | Peers inválidos TS7/ESLint10 con preset Next; audit con 5 high transitivos. Instalación final compatible y sin vulnerabilidades. |
| B-03/typecheck sandbox | FAIL ambiental, repetición PASS | SWC: canonicalizar ruta, Acceso denegado. Mismo código pasó fuera del sandbox. |
| N-01/HTTP sandbox | FAIL ambiental, repetición PASS | Socket bloqueado; mismo request fuera devolvió 200. |

### Not Validated

Estado global de criterios MVP: NOT VALIDATED salvo D-08; los subcasos anteriores acreditan únicamente foundation. Enumeración por grupos:

| IDs | Motivo / límite |
| --- | --- |
| B-01–B-07 | Adopción total, Git/lockfile versionado, CI, servicios privados y flujos críticos pendientes. Checks foundation ejecutados arriba. |
| R-01–R-06 | Muestra parcial; faltan privacidad, formulario, menú/barra/diagrama, zoom 200% y dispositivos iOS/Android. |
| N-01–N-06 | Solo home comprobada; privacidad, anclas, menú, soporte y 404 final pendientes. |
| C-01–C-03 | CTA/formulario/tracking no implementados en esta fase. |
| F-01–F-11 | Sin formulario, API, DB ni recepción; ningún mock acredita integración. |
| E-01–E-07 | Sin contratos adoptados/servicios para timeout, replay, errores y avisos. |
| A-01–A-07 | Semántica/foco parciales; faltan lector, axe, contraste de todos los estados, zoom y recorridos completos. Sin afirmación WCAG. |
| S-01–S-04 | Metadata local sí; faltan rutas, dominio, canonical, OG y preview protegido. |
| P-01–P-05 | Sin Lighthouse, análisis gzip completo ni campo; fuente local/prerender comprobados únicamente. |
| M-01–M-12 | Medición no implementada, sin cuentas/tags/GA4 QA. Ausencia de tags no acredita analytics. |
| CO-01–CO-07 | Política, UI/CMP y revocación pendientes; no consentimiento simulado. |
| PR-01–PR-07 | Sin captación/proveedores; privacidad, RLS, retención, API y CSP efectiva pendientes. Headers básicos no equivalen a PR-06. |
| D-01–D-07 | Sin infraestructura, Git/CI, publicación, smoke productivo, scheduler ni backup/restore. |

### Pending

| IDs | Responsable | Condición de cierre / puerta |
| --- | --- | --- |
| H-01/Git | José / implementador | Definir versionado/remoto para commit y CI; no bloquea revisión local. |
| H-02 restante | José | Adoptar decisiones pendientes antes del código dependiente; foundation autorizada. |
| H-03/H-04/H-05/H-06 | José | Plan/región/proveedores/dominio/contacto, privacidad final y receptor/aviso probados; bloquean integración/captación pública y lanzamiento. |
| H-07/H-08/H-09 | José | Mecanismo/copy/política/revocación, cuentas GTM/GA y QA; bloquean medición. |
| H-10/H-11/H-14 | José | Adoptar límites/retries/retenciones, catálogo HTTP/retry e historial; bloquean API/formulario/operación dependientes. |
| H-15 | José | Activo OG autorizado o alcance acordado; bloquea S-04. |
| FND-02/FND-03 | José | Label visible de menú y copy 404/privacidad; bloquean componentes finales. |
| H-21/H-22 | José | Fases futuras; no implementar aquí ni añadir promesas. |

### Known Issues

- `/privacidad` no existe; desconocidas usan 404 por defecto de Next con copy no aprobado y estilo propio. No aceptada como página final española. Cerrar FND-03 antes de construirla.
- No formulario, CTA, captación, backend, navegación de secciones ni medición: límite solicitado de foundation, no flujo operativo.
- Compatibilidad/auditoría iniciales fallaron y se corrigieron con la combinación documentada en foundation-review. No se modificaron tests para ocultar fallos. Preset específico Next/JSX-a11y pendiente de versión compatible; lint actual no sustituye QA de accesibilidad.
- SWC y socket fallaron en sandbox Windows; repetidos fuera con éxito. Instalación requiere red autorizada.
- npm ls lista dos opcionales Sharp como extraneous (`@emnapi/runtime`, `@img/sharp-wasm32`) incluso tras npm ci; exit 0 y build correcto, sin peers inválidos. Revisar al cambiar npm/plataforma; esta base no procesa imágenes.
- Sin Git/commit/CI. Noindex no protege preview público; no publicar esta base. CSP, privacidad y operación productiva pendientes.
- Primer muestreo responsive leyó tamaños previos al repintado. Se repitió con screenshot antes de medir; las ocho filas conservadas tienen requested=width. No fallo de layout.
- Sin evidencia de campo, proveedores ni accesibilidad completa. Limitaciones futuras de idempotencia, avisos y revocación del handoff siguen vigentes.

---

## Completion Report — Design System base, 10/10/2026

Actualización incremental: la foundation anterior se conserva como informe histórico. Estado actual verificado: base commit `1a14f7f`, checkout limpio al iniciar; cambios de esta fase en working tree, sin nuevo commit. Windows / Node 22.17.0 / npm 10.9.2. QA en http://127.0.0.1:3000, Codex In-app Browser Chromium, desarrollo con flag explícito; build optimizado inspeccionado en disco. Sin deploy, proveedores, mocks ni medición. Sufijo `/DS` = subcaso acotado, nunca PASS global.

### Implemented

- Reutilizados tokens, Inter, Container, estilos H1/H2/H3, Header/Footer y Home mínima de foundation. Nuevos aliases de foco y transición con los valores de design; controles se incorporan a la transición consentida por preferencias del sistema.
- `components/ui/Actions`, `Field`, `Card` y sus CSS Modules; `layout/Section` y CardGrid; `styles/typography.module.css`. Fuentes: design (presentación), technical (CSS Modules y límites server/client), content (extractos de muestra) y wireframe (sin formulario implementado).
- Muestra claramente rotulada en `components/development`, solo development + `DESIGN_SYSTEM_PREVIEW=true`; sin ruta nueva, form, envío, almacenamiento o navegación comercial. `/` de build conserva contenido de foundation.
- Autorización en decisions, API/clasificación en design-system-review y procedimiento en README. Siete fuentes originales mantienen hashes. No nuevas dependencias, carpetas vacías ni cierres de hallazgos posteriores.

### Validated

Evidencia: [checks](evidence/design-system/checks.md), [responsive](evidence/design-system/responsive.json), [teclado y preferencias](evidence/design-system/keyboard.json), [contraste parcial](evidence/design-system/contrast.json), [Network](evidence/design-system/network.json), [Console](evidence/design-system/console.json). Capturas [320](evidence/design-system/320.png), [768](evidence/design-system/768.png), [1024](evidence/design-system/1024.png), [1440](evidence/design-system/1440.png), [foco](evidence/design-system/focus.png), [forced colors](evidence/design-system/forced-colors.png).

| ID / subcaso | Estado | Método / evidencia observada |
| --- | --- | --- |
| B-01/DS | PASS | Lectura y alcance registrados; SHA256 7/7 coinciden. No adopta otras propuestas. |
| B-03/typecheck-DS | PASS | next typegen + tsc strict, exit 0 fuera sandbox. |
| B-03/lint-DS | PASS | ESLint con max-warnings=0, exit 0. |
| B-03/build-DS | PASS | Build exit 0, static `/` y `/_not-found`; repetido con flag true, sin muestra en HTML/RSC. |
| B-04/DS, B-07/DS | PASS | Inspección código/rutas: primitives sin estado propio; único client nuevo es laboratorio. Sin API, formulario ni rutas comerciales añadidas. |
| B-06/carga-interacción-DS | PASS | Console warnings/errors vacío en cargas y toggle observados. No prueba flujos MVP. |
| R-01/muestra-DS | PASS | Anchos efectivos 320/375/767/768/1023/1024/1280/1440; scrollWidth igual al viewport, contenido sin recorte observado. Solo muestra. |
| R-02/DS | PASS | H1 36–56, H2 28–40; gutter 20/32/40; sección 56/72/96; input/select ≥48 y textarea 144, UI 16; grids 1/2/3 y 1/2/2; cards 24/32, radio 10, shadow none en serie cardMeasures. |
| A-02/teclado-primitives-DS | PASS | Tab en nueve destinos desde skip hasta textarea, Shift+Tab y Space en toggle; disabled omitido; foco doble visible. Recorrido estable con reduce, sin foco fuera del viewport. No menú/CMP. |
| A-03/asociaciones-DOM-DS | PASS | Labels for/id; ayuda/error por aria-describedby; error explícito y aria-invalid. Solo DOM, sin lector ni avisos funcionales. |
| A-04/default-error-disabled-DS | PASS | Contraste de texto usado 5.64–16.29; borde input 4.76; error con texto además de borde. Subconjunto calculado, no todos los estados. |
| A-05/botones-campos-preferencias-DS | PASS | Botones multilinea ≥48, input/select ≥48; reduce scroll auto/transition 0s/animation none; forced-colors outline visible sin shadow. No cubre todos los links/targets del MVP. |
| M-11/ausencia-integraciones-DS | PASS | Fuente y Network: sin GTM/GA/píxeles, requests locales GET. Ausencia no acredita tracking o consentimiento. |
| B-03/typecheck-build-sandbox-DS | FAIL ambiental, repetición PASS | SWC canonicalize jsc.baseUrl, Acceso denegado. Mismo código ejecutado con permisos fuera sandbox. |

### Not Validated

Los criterios globales de la matriz mantienen NOT VALIDATED; ninguno recibe PASS global por esta fase. B-02 instalación limpia nueva/CI; B-03 flujos críticos; R-01/R-02 Home/privacidad/formulario completos; R-03 zoom 200%; R-04–R-06 diagrama/barra/móvil físico; N-01–N-06 navegación/rutas finales; C-01–C-03; F-01–F-11; E-01–E-07; A-01–A-07 recorrido integral, lector/axe, hover/active completos y targets; S/P, M/CO/PR y D siguen fuera de esta evidencia. Los resultados históricos foundation no se recertifican por inferencia. No se acredita WCAG, performance, GA4, integración, producción o campo.

### Pending

| IDs | Responsable / condición | Bloquea |
| --- | --- | --- |
| FND-02 / FND-03 | José: label visible del menú y copy 404/privacidad adoptados. | Navegación/rutas finales, no primitives entregados |
| H-02 restante | José: adoptar decisiones aplicables antes del código dependiente. | Implementación de fases correspondientes |
| H-03/H-04/H-05/H-06 | José: proveedores/planes/regiones, contacto/dominio, privacidad, receptor y aviso reales probados. | Captación pública/lanzamiento |
| H-07/H-08/H-09 | José: política, CMP/copy/revocación y cuentas/configuración QA. | Medición |
| H-10/H-11/H-14/H-15 | José: parámetros/retries, mensajes HTTP, historial manual y OG. | API/formulario/operación/SEO respectivos |
| DS-03 / DS-04 | Codex al autorizar fase: estados funcionales, iconos, navegación/diagrama/cards adicionales solo si necesarios. | FUTURE, no esta fase |

### Known Issues

- Error ambiental SWC dentro sandbox reportado y repetido con éxito fuera; no se modificaron reglas/tests para ocultarlo.
- Primer arranque con puerto personalizado falló por forwarding npm/PowerShell; muestra validada en 3000. Connection refused inicial correspondía al puerto sin servidor. Procedimiento README usa script estándar.
- DevTools de Next aparece en las capturas y carga Geist local además de Inter; recursos de desarrollo, sin afirmar que pertenezcan a producción. Next generó cambios en AGENTS/next-env; retirado el bloque automático y regenerados tipos con build.
- La muestra muestra un error estático inicial y controles de prueba; no demuestra validación ni un formulario operativo. Activación de loading/feedback es futura.
- FND-02/FND-03 y bloqueos operativos existentes siguen abiertos. No hay Home completa, privacidad final, captación ni release. Sin fallos de layout detectados en la muestra y anchos revisados; no afirmación universal.

### Recommended Next Step

Revisar los primitives con la evidencia guardada y autorizar una fase acotada de composición de secciones de Home. Antes de incorporar navegación, cerrar FND-02; antes de rutas/captación, cerrar sus decisiones aplicables. No comenzar formulario, backend o medición por esta entrega.

# Completion Report — Header + Navigation

10/10/2026, America/Santiago. Base `0df3ab5` + cambios locales, sin commit nuevo. Windows, Node 22.17.0/npm 10.9.2. Chromium Codex In-app Browser, viewports emulados. QA: http://127.0.0.1:3000 con NODE_ENV=development y HEADER_NAVIGATION_PREVIEW=true; destinos sintéticos rotulados. Build optimizado comprobado por salida y HTML/RSC, sin deployment. Servidor QA detenido al finalizar.

### Implemented

- Header server, identidad a /#inicio, estructura responsive estática con Container/tokens existentes. HeaderNavigation client localizado: tres enlaces y CTA exactos, Button/TextLink/ActionLink del Design System, menú en flujo, aria-expanded/controls, Escape/cierre, foco al título al navegar y foco visible al cambiar breakpoint. Fuentes: product/wireframe/content/design/technical.
- `src/components/layout/Header.tsx`, Header.module.css, HeaderNavigation.tsx y HeaderNavigation.module.css; copy en site.ts. No modificaciones a primitives, dependencias o tooling.
- Composición de layout/page habilita nav exclusivamente en fixture de desarrollo HeaderNavigationPreview. Por HN-01 confirmado, build/página normal no muestran enlaces/CTA mientras falten destinos. No se implementó Hero ni secciones, formulario, backend, medición o integraciones.
- FND-02 cerrado por respuesta explícita: visible Menú, accesible Abrir menú/Cerrar menú. Registro y supuestos en [header-navigation-review](header-navigation-review.md); fuentes originales y matriz canónica preservadas.

### Validated

Subcasos de Header, sin PASS global del MVP. Evidencias: [checks](evidence/header-navigation/checks.md) y [navegador](evidence/header-navigation/browser.md). Capturas inspeccionadas en sesión, no PNG archivados. Sin servicios reales/mocks de captación.

| ID / subcaso | Estado | Método y evidencia |
| --- | --- | --- |
| B-01/Header | PASS | Fuentes completas, decisión de esta fase registrada y 7/7 hashes coincidentes. |
| B-03/typecheck-Header | PASS | next typegen + tsc strict exit 0, fuera sandbox, tras correcciones. |
| B-03/lint-Header | PASS | ESLint --max-warnings=0 exit 0, repetido final. |
| B-03/build-Header | PASS | Exit 0 fuera sandbox; build final con flag QA=true no incluye fixture, nav ni destinos pendientes en HTML/RSC. Solo / y /_not-found static. |
| B-04/Header, B-07/Header | PASS | Header/layout/página server; cliente localizado a navegación. Sin nueva ruta comercial, Hero, captación ni dependencia. |
| B-06/QA-Header | PASS | Console warn/error=[] en carga, menú, destinos, resize y mouse observados. |
| R-01/Header, R-02/Header | PASS | 320,375,767,768,1023,1024,1280,1440; clientWidth=scrollWidth. Menú abierto también sin overflow en cinco anchos inferiores a 1024. Desktop cabe con fuente/copy íntegros. |
| N-03/Header-fixture | PASS | Header static, identidad a inicio existente; tres enlaces y CTA a destinos sintéticos correctos. No acredita destinos de Home final. |
| N-04/Header-fixture | PASS | Enter/Space abre, Tab/Shift+Tab, Escape al botón, control cierra, cuatro anclas cierran/enfocan título; aria-controls coincide. Breakpoint conserva foco visible tras corrección. |
| C-01/Header-fixture, C-02/Header-fixture | PASS | CTA literal, enlace a único #diagnostico sintético, teclado y mouse; ningún envío/lead. |
| A-01/DOM-Header, A-02/foco-Header | PASS | Landmarks/nombre de nav, orden DOM, controles nativos, foco doble visible en el subconjunto ejecutado. No lector/recorrido integral. |
| A-04/default-Header | PASS | Contraste calculado: identidad 16.29, links/botón/CTA 6.70 sobre blanco; foco azul/blanco 6.70. Hover/active CTA ejecutados, coinciden con tokens. |
| A-05/targets-preferencias-Header | PASS | Identidad 44px alto, botón 49.6, links 48 y CTA 49.6/73.6; reduce scroll auto/0s, forced-colors outline visible sin shadow. |
| M-11/ausencia-integraciones-Header | PASS | Network CDP tras reload: 21 GET locales, sin GTM/GA/píxeles. Incluye Next/HMR/DevTools/Geist de desarrollo; no acredita consentimiento. |
| B-03/sandbox-Header | FAIL ambiental, repetición PASS | Typecheck/build: SWC canonicalize jsc.baseUrl, Acceso denegado. Fuera del sandbox pasó. |
| B-03/ref-Header | FAIL corregido | TS2322 por ref no admitido en primitive Button. Retirado sin cambiar el primitive; repetición PASS. |
| N-04/breakpoint-inicial-Header | FAIL corregido | Desktop→móvil dejaba foco en body. Corrección local conserva último foco interno y restaura al botón; repetición PASS. |
| B-03/diff-format-Header | FAIL corregido | Línea vacía en AGENTS tras retirar bloque generado; eliminada, git diff --check final PASS. |

### Not Validated

- N-02/N-03/N-04/N-05 y C-01 completos: faltan secciones/formulario reales; fixture no los acredita. Header normal contiene identidad/skip únicamente por HN-01.
- R-03 zoom 200% real; R-06 iOS Safari/Android Chrome físicos y paisaje; A-03 lector/A-07 axe y revisión WCAG integral. No certificación de accesibilidad. Navegación móvil con JS desactivado no probada; el control preparado necesita JS.
- R-01/R-02, A-01/A-02/A-04/A-05 y B-06 globales: solo subconjunto Header, no Home/privacidad/formulario/CMP.
- B-02 nueva instalación limpia/CI; B-03 pruebas críticas del MVP; N-01 rutas finales; R-04/R-05, N-06, C-03, F-*, E-*, S-*, P-*, M/CO/PR y D de integración/release siguen fuera de esta evidencia. No mock acredita servicios; sin producción/campo. Estados históricos no se recertifican por inferencia.

### Pending

| ID | Responsable / condición | Bloquea |
| --- | --- | --- |
| HN-04 | Codex en fase autorizada posterior: cuatro destinos reales únicos con encabezados y pruebas integradas; habilitar navigationReady en composición. | Navegación integrada y aceptación final; no componente preparado |
| FND-03, H-04/H-05/H-06 | José: copy/rutas finales, dominio/contacto, privacidad y receptor operativo. | Rutas/captación pública/lanzamiento |
| H-03/H-07/H-08/H-09/H-10/H-11/H-14/H-15 | José: decisiones/proveedores/configuración según registro vigente. | Fases correspondientes de medición/API/operación/SEO; no resueltos por Header |

### Known Issues

- Navegación completa intencionalmente no aparece en página normal/build hasta disponer de destinos. Esta fase prepara el componente y prueba fixture; no se declara Header integrado listo para producción ni lanzamiento completo.
- Typecheck/ref, foco breakpoint y línea vacía fallaron inicialmente y se corrigieron con repetición PASS. SWC falla dentro del sandbox Windows; checks fuera pasaron. No se alteraron tests ni reglas para esconder fallos.
- Primer browser abrió antes del servidor y dio conexión rechazada; repetición con servidor activo funcionó. Un wrapper no ejecutó Control+Home sobre body; se ejecutó desde identidad. Captura transitoria tras resize se repitió con estado estable. Límites de herramienta, no fallos de la app.
- Next dev añadió bloque a AGENTS y generó imports next-env; restaurados a la base al terminar, sin cambiar configuración. Sin fallos pendientes detectados en los estados de Header ejecutados; no afirmación universal.

### Decisions Needed

Ninguna decisión nueva pendiente para el componente preparado. FND-02 y HN-01 cerrados por José en este chat y trazados en header-navigation-review. Pendientes históricos del resto del MVP conservan sus puertas.

### Recommended Next Step

Revisar esta fase con su evidencia y autorizar por separado la siguiente composición de Home. Activar navegación en la página normal cuando existan sus destinos y ejecutar validación integrada; completar lector/axe/zoom/dispositivos antes de aceptar los criterios correspondientes. No iniciar Hero, formulario, backend o medición sin su fase autorizada.

---

## Completion Report — Hero de Home, 13/10/2026

America/Santiago. Base `13fcac9`, checkout limpio al iniciar; cambios sin commit nuevo. Windows / Node 22.17.0 / npm 10.9.2. Chromium Codex In-app Browser emulado. QA development en 3000 con fixture Header existente; build normal en 3001 sin destinos sintéticos. Sin deployment, captación, proveedores ni mocks de servicios. Subcasos `/Hero` no cambian estados globales de acceptance.

### Implemented

- Hero server en `src/components/sections/Hero.tsx` y CSS Module mínimo; Section first, Container, typography y Actions del Design System. Página `/` sustituye muestra de foundation por Hero; elimina CSS de página reemplazado por primitives. Copy completo literal de content §Hero centralizado en site.hero.
- Una columna de lectura (máximo 760px), sin visual: wireframe reserva el diagrama para Solución. H1, eyebrow, supporting copy, audience, microcopy e identidad; sin claims nuevos ni CTA secundario. Tokens responsive existentes, sin nuevos valores visuales.
- CTA exacto preparado a `#diagnostico`; puerta HERO-01 basada en HN-01: oculto en página normal hasta existir el destino. QA lo activa únicamente contra fixture de desarrollo existente. Header/layout y sus decisiones intactos. Sin tracking, backend, sección futura, dependencia o cambio de fuentes originales.
- Reconciliación, autorización limitada y clasificaciones en [hero-review.md](hero-review.md); evidencia en [checks](evidence/hero/checks.md) y [browser](evidence/hero/browser.md).

### Validated

| ID / subcaso | Estado | Método / evidencia |
| --- | --- | --- |
| B-01/Hero | PASS | Solicitud explícita limita adopción a Hero; registro previo y hashes 7/7 coincidentes. Fuentes/matriz intactas. |
| B-03/typecheck-Hero | PASS | next typegen + tsc strict exit 0 fuera sandbox; checks.md. |
| B-03/lint-Hero | PASS | ESLint max-warnings=0 exit 0, repetición final. |
| B-03/build-Hero | PASS | Build exit 0, `/` prerenderizada; DOM del build normal sin fixture/CTA futuro. |
| B-04/Hero, B-07/Hero | PASS | Hero server, semántico; únicamente componente/copy de esta fase. Header/DS/dependencias intactos. |
| B-06/Hero | PASS | Console warn/error=[] en cargas/interacciones ejecutadas, console.json. |
| R-01/Hero, R-02/Hero | PASS | Capturas mobile/desktop y estilos calculados en ocho anchos; scrollWidth=clientWidth, texto completo, Inter/tokens/lectura/padding correctos. responsive-qa/normal.json y capturas *-normal/*-qa.png. |
| R-03/texto-Hero | PASS parcial | Font-size raíz temporal 200%, cinco anchos sin overflow; texto completo y CTA multilínea. text-200.json y cta-text-200-qa.json; no zoom real. |
| N-02/inicio-Hero, N-05/puerta-Hero | PASS | Un #inicio con H1; build normal sin links a destinos pendientes. No ocho anclas completas. |
| C-01/CTA-fixture-Hero, C-02/CTA-fixture-Hero | PASS parcial | Label literal, enlace nativo único en Hero a #diagnostico sintético; Enter/clic navegan, foco en h2 sintético. No formulario real. |
| A-01/DOM-Hero, A-02/teclado-Hero | PASS parcial | Un H1, lang/landmarks; skip enfoca main normal. Tab/Enter y foco visible del CTA en QA. browser.md y focus-qa.png. |
| A-04/default-Hero | PASS | Contraste usado 6.07–15.57:1; CTA default 6.70:1, contrast.json. No auditoría integral de estados. |
| A-05/targets-preferencias-Hero | PASS parcial | CTA ≥49.6px alto; reduced motion auto/0s y forced colors outline visible, screenshot archivado. |
| M-11/ausencia-integraciones-Hero | PASS parcial | Network build 10 GET locales sin GA/GTM/píxeles/POST; fuente sin instrumentación. No acredita medición ni consentimiento. |
| B-03/sandbox-Hero | FAIL ambiental, repetición PASS | SWC Acceso denegado al canonicalizar jsc.baseUrl; mismo código fuera del sandbox pasó. |

### Not Validated

- C-01/C-02 integrados, N-02/N-03/N-04 completos: faltan secciones/formulario; CTA normal permanece oculto. QA sintético no demuestra captación ni navegación final.
- R-03 zoom real 200%, R-06 móviles físicos Safari/iOS y Chrome/Android; A-03 lector y A-07 axe/revisión WCAG integral. Aumento de texto no sustituye zoom real.
- C-03/tracking y M/CO/PR; no se instrumentan por alcance explícito. B-02 reinstalación/CI, B-03 tests críticos de captación, R/A globales, R-04 diagrama de Solución, R-05 barra móvil, N-01/rutas finales, F/E/S/P/D permanecen NOT VALIDATED en lo no cubierto. No GA4, servicios reales, performance, producción ni campo acreditados.

### Pending

| ID | Responsable / condición | Bloquea |
| --- | --- | --- |
| HERO-01 / HN-04 | Codex en fase autorizada: construir #diagnostico real y destinos del Header; habilitar respectivas puertas y repetir CTA/teclado integrados. | CTA/navegación final; no bloque de lectura |
| R-03/R-06/A-03/A-07 | Implementador/QA: zoom real, dispositivos, lector y auditoría automatizada antes de aceptación integral. | Aceptación accesibilidad/responsive completa |
| H-03/H-04/H-05/H-06/FND-03 | José: proveedores, dominio/contacto, privacidad y recepción/rutas finales. | Captación pública/lanzamiento; fuera de Hero |
| H-07/H-08/H-09/H-10/H-11/H-14/H-15 | José: decisiones/configuración según registros vigentes. | Medición/API/operación/SEO respectivos; fuera de Hero |

### Known Issues

- CTA oculto en Home normal hasta contar con destino; microcopy literal conservado. No declarar recorrido de solicitud operativo ni Hero comercial integrado final.
- Typecheck inicial falló por sandbox SWC y pasó fuera; no alteración de tests/configuración para ocultarlo. Arranque npm ignoró puerto y dio EADDRINUSE; Next directo en 3001 funcionó. Cambios automáticos next-env restaurados al contenido previo.
- Sin overflow ni errores de consola detectados en los estados/ancho revisados; sin afirmación universal. Zoom, lector, auditoría completa y móviles físicos siguen sin evidencia. Fuentes originales, Header y primitives preservados.

### Decisions Needed

Ninguna decisión nueva necesaria para este alcance. HERO-01/02/03/04 son interpretaciones acotadas explícitas en hero-review, no nueva estrategia/copy/diseño. Pendientes históricos mantienen sus puertas y responsables.

### Recommended Next Step

Revisar el Hero y su evidencia; autorizar por separado la siguiente sección según el orden del wireframe (Problema e impacto). Mantener CTA y navegación condicionados a destinos reales; no adelantar formulario, diagrama ni medición por esta entrega.

---

## Completion Report — Problem + Impact, 13/10/2026

America/Santiago. Base `40a9e71`, checkout limpio al iniciar; cambios locales sin commit nuevo. Windows, Node v22.17.0/npm 10.9.2. Chromium Codex In-app Browser emulado, build optimizado local en `http://127.0.0.1:3002`. Sin deployment, proveedores o mocks de captación. Servidor de esta sesión detenido al finalizar. Subcasos `/ProblemImpact` no cambian estados globales de acceptance.

### Implemented

- `src/components/sections/ProblemImpact.tsx` y CSS Module mínimo; Server Component con Section, Container, CardGrid y typography existentes. Composición después de Hero en page.tsx.
- `site.problem` y `site.impact`: título, introducción, tres síntomas con sus consecuencias y cierre de Impact literales de content. Wireframe §02: una sola sección `#problema`, H2 y tres H3, sin CTA ni visual requerido. Impact sin título inventado, dentro de la misma progresión narrativa.
- Grid textual sin Card, conforme a design §Cards; spacing, tipografía y responsive del Design System. Sin Header/Hero refactorizados, nuevas dependencias, tokens, rutas, servicios o instrumentación. Fuentes originales intactas.
- Autorización limitada y PI-01/02/03 SAFE ASSUMPTION documentadas en [problem-impact-review.md](problem-impact-review.md). Evidencia: [checks](evidence/problem-impact/checks.md), [browser](evidence/problem-impact/browser.md), JSON y capturas en esa carpeta.

### Validated

| ID / subcaso | Estado | Método / evidencia |
| --- | --- | --- |
| B-01/ProblemImpact | PASS | Solicitud explícita y revisión previa; siete hashes coincidentes con snapshot. Adopción solo para esta fase. |
| B-03/typecheck-ProblemImpact | PASS | next typegen + tsc --noEmit, exit 0 fuera del sandbox. |
| B-03/lint-ProblemImpact | PASS | ESLint max-warnings=0, exit 0. |
| B-03/build-ProblemImpact | PASS | Build optimizado exit 0 fuera del sandbox; `/` prerenderizada e inspeccionada en navegador. |
| B-04/ProblemImpact, B-07/ProblemImpact | PASS | Componente server, copy literal cotejado contra DOM, sin nueva interactividad ni contenido fuera del alcance. |
| B-06/ProblemImpact | PASS parcial | Cargas/recargas/resize: console warn/error=[] y sin excepciones CDP capturadas. console.json/network.json. |
| R-01/ProblemImpact, R-02/ProblemImpact | PASS parcial | 320,375,767,768,1023,1024,1280,1440 medidos; cinco anchos solicitados revisados visualmente. Sin overflow; grid 1/2/3, orden lógico y cierre continuo. responsive.json y capturas. No Home/privacidad completa. |
| N-02/problema-ProblemImpact | PASS parcial | #inicio→#problema únicos en DOM; H2 asociado a región. No ocho anclas finales. |
| A-01/DOM-ProblemImpact | PASS parcial | lang=es, H1 único, H2→tres H3; bloques estáticos con contenido textual completo. Sin lector ni auditoría integral. |
| A-04/default-ProblemImpact | PASS parcial | Contraste de todo el contenido nuevo 15.57:1; sin controles/estados nuevos. semantics-contrast.json. |
| M-11/ausencia-integraciones-ProblemImpact | PASS parcial | Network observado: 50 GET locales de cinco cargas, sin POST/GTM/GA4/píxeles. No acredita medición o consentimiento. |
| B-03/sandbox-ProblemImpact | FAIL ambiental, repetición PASS | Typecheck/build/start: SWC canonicalize jsc.baseUrl, Acceso denegado os error 5. Mismo código fuera del sandbox pasó. |

### Not Validated

- R-03 zoom real 200%, R-06 iOS Safari/Android Chrome físicos; A-03 lector, A-07 axe y revisión WCAG integral. No PASS global de accesibilidad.
- B-02 nueva instalación limpia/CI, B-03 pruebas críticas del MVP, B-06 flujos finales, R/A globales, N-01/rutas finales y N-02 ocho anclas. La evidencia solo cubre ProblemImpact y su composición visible con Hero.
- R-04/diagrama, R-05/barra, C/F/E/S/P/M/CO/PR/D funcionales de fases futuras. No backend, captación, servicios reales, GA4, performance, producción ni campo acreditados. Sin simulación de integración.

### Pending

| ID | Responsable / condición | Bloquea |
| --- | --- | --- |
| HN-04 / HERO-01 | Codex en fases autorizadas: destinos reales de Header y formulario; habilitar puertas y repetir recorrido integrado. | CTA/navegación final, no esta fase |
| R-03/R-06/A-03/A-07 | Implementador/QA: zoom, dispositivos, lector y auditoría integral. | Aceptación responsive/accesibilidad completa |
| H-03/H-04/H-05/H-06/FND-03 | José: proveedores/planes, dominio/contacto, privacidad/copy de rutas y recepción reales. | Captación/lanzamiento; no ProblemImpact |
| H-07/H-08/H-09/H-10/H-11/H-14/H-15 | José: decisiones/configuración operativa según registros vigentes. | Medición/API/operación/SEO de fases correspondientes |

### Known Issues

- SWC falla en sandbox Windows; validaciones requeridas repetidas fuera con exit 0. Start local también requirió esa ejecución. No cambios a reglas/configuración para ocultarlo. next-env.d.ts generado por build restaurado a la base.
- CTA/navegación normal siguen condicionados a destinos reales, por decisiones previas. No recorrido comercial completo ni lanzamiento acreditado.
- Sin overflow, problemas de legibilidad o errores de consola detectados en la muestra revisada; no afirmación universal. Validaciones integrales y dispositivos siguen pendientes.

### Decisions Needed

Ninguna decisión nueva bloquea Problem + Impact. PI-01/02/03 documentan interpretaciones acotadas sustentadas por fuentes; PI-04 FUTURE conserva límites. Pendientes históricos no quedan adoptados por esta fase.

### Recommended Next Step

Revisar esta entrega y su evidencia; autorizar por separado Solution + capacidades según wireframe §03 y decisiones del diagrama ya confirmadas. No iniciar Services, formulario, backend ni medición por esta solicitud.

---

## Completion Report — Solution + Services, 13/10/2026

America/Santiago. Base `b272782`, checkout limpio al iniciar, cambios locales sin commit nuevo. Windows, Node 22.17.0/npm 10.9.2. Chromium 155 emulado: build optimizado en `http://127.0.0.1:3003/`; CTA en muestra de desarrollo existente en `http://127.0.0.1:3000/`. Sin deployment ni proveedores/mocks. Servidor de build de esta sesión detenido al finalizar; servidor de desarrollo preexistente conservado. Sufijo `/SolutionServices` delimita subcasos, sin PASS global.

### Implemented

- `src/components/sections/SolutionServices.tsx` y CSS Module: Section/Container/typography/Actions existentes. Una sección `#solucion` después de ProblemImpact, H2 de Solution y cinco H3/filas de Services; explicación general seguida por capacidades concretas, detalle técnico y alcance literales de content. Fuentes: product/wireframe §03, content §Solution/Services y design.
- `src/components/MeasurementJourney.tsx` y CSS Module: Server Component HTML/CSS/SVG ligero; cinco nodos adoptados por H-12, tres+dos desktop/vertical móvil y tablet, equivalente textual y condición de retorno literal. No tecnología adicional ni diagrama de integración activa.
- Copy centralizado en site.solution y composición en page.tsx. Header/Hero/ProblemImpact, primitives, tokens, dependencias/lockfile y fuentes originales intactos. Ajuste mínimo de HeaderNavigationPreview para no duplicar #solucion real. CTA condicionado a destino real según puerta previa; solo visible en QA sintético existente.
- Adopción limitada y SS-01–05 en [solution-services-review.md](solution-services-review.md). Evidencia final en [checks](evidence/solution-services/checks.md), [navegador](evidence/solution-services/browser.md), JSON/capturas de esa carpeta. No Process, Trust, Agencias, AI-First, FAQ, formulario, backend ni medición.

### Validated

| ID / subcaso | Estado | Método / evidencia |
| --- | --- | --- |
| B-01/SolutionServices | PASS | Solicitud explícita/reconciliación limitada y siete hashes coincidentes con snapshot. |
| B-03/typecheck-SolutionServices | PASS | npm run typecheck, next typegen + tsc --noEmit, exit 0 fuera del sandbox. |
| B-03/lint-SolutionServices | PASS | npm run lint, max-warnings=0, exit 0. |
| B-03/build-SolutionServices | PASS | npm run build, exit 0; repetición final tras fix del conector; Home estática. checks.md. |
| B-04/SolutionServices, B-07/SolutionServices | PASS | Server Components, contenido prerenderizado, copy literal (missingCopy=[]), cero nuevos destinos, servicios o dependencias. copy.json/static.json. |
| B-06/carga-SolutionServices | PASS parcial | Console warn/error=[], sin excepciones Runtime durante cargas/resize observados del build. console.json/network.json. |
| R-01/SolutionServices, R-02/SolutionServices | PASS parcial | Ocho anchos 320/375/767/768/1023/1024/1280/1440 sin overflow; cinco solicitados revisados visualmente. responsive.json, section-*.png y full-*.png. Filas/diagrama respetan orden, tokens y legibilidad. |
| R-04/diagrama-SolutionServices | PASS parcial | Cinco nodos exactos, lectura vertical móvil/tablet y continuidad desktop en dos filas. No FAQ ni Home completa. |
| N-02/solucion-SolutionServices | PASS parcial | inicio→problema→solucion únicos; preview omite duplicado; no ocho anclas reales finales. semantics.json/cta-qa.json. |
| A-01/DOM-SolutionServices, A-06/diagrama-SolutionServices | PASS parcial | H1 único/lang=es/H2→cinco H3; OL con nombre textual exacto y condición legible; SVG decorativos excluidos del árbol accesible. DOM/árbol revisados, sin lector. |
| A-04/default-SolutionServices | PASS parcial | Texto 15.57/16.29:1; conectores 4.55:1; CTA default QA 6.70:1. contrast.json. Sin PASS integral de estados. |
| A-05/preferencias-SolutionServices | PASS parcial | Reduced motion sin animaciones/scroll auto y forced-colors visual legible. preferences.json/forced-colors.png. |
| C-01/CTA-QA-SolutionServices, C-02/CTA-QA-SolutionServices, A-02/CTA-QA-SolutionServices | PASS parcial | Enter activa enlace literal de 49.6px, hash y foco en H2 sintético de diagnóstico; un destino de cada tipo, cero formularios. cta-qa.json/png. No captación real. |
| M-11/ausencia-integraciones-SolutionServices | PASS parcial | Network final diez GET locales, sin POST/GTM/GA4/píxeles/externos; buffer completo. No acredita medición ni consentimiento. |
| B-03/sandbox-SolutionServices | FAIL ambiental, repetición PASS | SWC canonicalize jsc.baseUrl, acceso denegado os error 5; mismo código fuera del sandbox pasó. |
| R-04/conector-inicial-SolutionServices | FAIL corregido, repetición PASS | SVG limitado por max-width global hacía partir continuidad del nodo incorrecto. Excepción local para conector y recaptura final 1024/1440 correctas. |

### Not Validated

- C-01/C-02 finales y C-03: destino/formulario real y tracking fuera de alcance. QA no acredita recepción; CTA normal oculto. N-02–04 integrados completos siguen pendientes de destinos reales.
- R-03 zoom real 200%, R-06 iOS Safari/Android Chrome físicos, A-03 lector, A-07 axe y revisión WCAG integral. No PASS global de accesibilidad.
- B-02 instalación limpia/CI, B-03 pruebas críticas de captación, B-06 flujos finales, Home/privacidad/rutas completas y sus criterios R/N/A; R-04 FAQ y R-05 barra; F/E/S/P/M/CO/PR/D de fases futuras. Sin backend, servicios reales, GA4, performance, producción ni campo acreditados. Matriz global sin cambios.

### Pending

| ID | Responsable / condición de cierre | Bloquea |
| --- | --- | --- |
| SS-04 / HERO-01 / HN-04 | Codex en fases autorizadas: formulario/destinos reales, activar puertas y repetir CTA/navegación integrados. #solucion real ya implementado. | CTA/navegación final; no contenido de esta fase |
| R-03/R-06/A-03/A-07 | Implementador/QA: zoom real, dispositivos, lector y auditoría integral antes de aceptación global. | Responsive/accesibilidad completa |
| H-03/H-04/H-05/H-06/FND-03 | José: planes/proveedores, dominio/contacto, privacidad, copy de rutas y recepción/avisos reales. | Captación pública/lanzamiento; no esta fase |
| H-07/H-08/H-09/H-10/H-11/H-14/H-15 | José: decisiones/configuración vigente de consentimiento, cuentas, parámetros, mensajes, operación y OG. | Medición/API/operación/SEO correspondientes |
| SS-05 | José: autorizar siguiente fase acotada según product/wireframe; agencias es §04. | Implementación posterior, FUTURE |

### Known Issues

- Fallo visual inicial del conector corregido y revisado de nuevo; capturas conservadas corresponden al build final. Sin overflow o errores de consola detectados en el subconjunto observado, sin afirmación universal.
- SWC falla dentro del sandbox Windows; typecheck pasó fuera. Intento adicional de dev en 3004 falló por servidor preexistente en 3000; se reutilizó su muestra y se conservó el proceso. Navegación antes de iniciar 3003 dio connection refused y pasó con servidor activo. Sin cambios de configuración/tests para ocultar fallos.
- CTA normal oculto por ausencia de formulario real; MVP/recorrido comercial y lanzamiento incompletos. Tecnologías citadas en copy son capacidades, no integraciones instaladas.
- next-env generado restaurado; emulación/viewport temporales restablecidos. Sin evidencia integral de zoom, lector, móviles físicos o servicios/producción.

### Decisions Needed

Ninguna decisión nueva bloquea este alcance. SS-01–04 son interpretaciones acotadas registradas, no cambios de negocio/copy/diseño. Pendientes operativos históricos conservan responsable y puerta.

### Recommended Next Step

Revisar Solution + Services y su evidencia. La siguiente sección canónica es Encaje para agencias (§04); autorizar su alcance por separado antes de avanzar a Process (§05). Mantener las puertas del CTA/formulario y no activar medición por esta entrega.

---

## Completion Report — Process + Trust / Expertise, 13/10/2026

America/Santiago. Base 192b9a4, checkout limpio al iniciar; cambios locales sin commit. Windows/Node 22.17.0/npm 10.9.2. Build optimizado local 3005 y QA sintético dev previo 3000, Chromium emulado. Sufijo /ProcessTrust delimita evidencia parcial; matriz global intacta.

### Implemented

- Process.tsx y CSS Module: #proceso, H2 y cuatro H3 en OL vertical, alcance inicial y participación literales de content. Fuentes product/wireframe §05, content §Process, design/technical.
- Experience.tsx y CSS Module: #experiencia, H2 y primera persona, rol directo y tres antecedentes existentes. Fuentes product/wireframe §06, content §Expertise/Trust y strategy. Sin casos, cifras, logos, credenciales o foto inventados.
- site.process/site.experience y composición después de Solution. Section/Container/typography/Actions/tokens reutilizados; Server Components. CTA con diagnosisReady falso salvo QA existente. Preview omite anclas sintéticas duplicadas. Header y secciones anteriores intactos.
- Solo revisión/evidencia/documentación de esta fase: process-trust-review.md y evidence/process-trust/. PT-01–05 registrados. Sin AI-First, Agencias, FAQ, formulario, backend, analytics, dependencias o cambios de fuentes.

### Validated

| ID / subcaso | Estado | Método / evidencia |
| --- | --- | --- |
| B-01/ProcessTrust | PASS parcial | Solicitud explícita/reconciliación limitada, siete hashes coincidentes. process-trust-review.md/checks.md. |
| B-03/typecheck-ProcessTrust | PASS | npm run typecheck fuera sandbox, exit 0. |
| B-03/lint-ProcessTrust | PASS | npm run lint, exit 0. |
| B-03/build-ProcessTrust | PASS | npm run build fuera sandbox, exit 0, Home prerenderizada. |
| B-04/ProcessTrust, B-07/ProcessTrust | PASS parcial | Server Components, copy literal, sin integraciones/interactividad nuevas. copy-semantics.json. |
| B-06/carga-ProcessTrust | PASS parcial | Sin excepciones ni console warnings/errors en cargas/resize build registrados. network-console.json. |
| R-01/ProcessTrust, R-02/ProcessTrust | PASS parcial | Ocho anchos medidos, cinco solicitados inspeccionados visualmente, sin overflow, orden y lectura conservados. responsive.json/capturas. |
| N-02/proceso-experiencia-ProcessTrust, A-01/DOM-ProcessTrust | PASS parcial | Anclas únicas; H1 único y H2→H3, listas semánticas/árbol accesible; no ocho secciones finales ni lector. |
| A-04/default-ProcessTrust | PASS parcial | Contraste 15.57:1 texto/marcadores sobre fondo, sin PASS global de estados. |
| C-01/CTA-QA-ProcessTrust, C-02/CTA-QA-ProcessTrust, A-02/CTA-QA-ProcessTrust | PASS parcial | Label literal, enlace real, Tab/Shift+Tab/Enter, foco y hash al destino sintético. cta-qa.json/png; no formulario real. |
| A-05/target-QA-ProcessTrust | PASS parcial | CTA QA 49.6px alto, anillo de foco visible; sin dispositivos físicos. |
| M-11/ausencia-integraciones-ProcessTrust | PASS parcial | Network build local sin destinos externos/POST; no medición acreditada. |
| B-03/sandbox-ProcessTrust | FAIL ambiental, repetición PASS | SWC canonicalize jsc.baseUrl, acceso denegado os error 5. Mismo código pasó fuera. |

### Not Validated

- R-03 zoom real 200%, R-06 móviles iOS/Android físicos; A-03 lector y A-07 axe/WCAG integral. No PASS global de accesibilidad.
- C-01/C-02 finales, C-03, N-02–04 integrados: sin formulario real. QA sintético no acredita captación. Agencias/FAQ y ocho anclas completas pendientes.
- B-02 reinstalación/CI, B-03 pruebas críticas del MVP, B-06 flujos finales, Home/privacidad/rutas completas y F/E/S/P/M/CO/PR/D correspondientes. Sin servicios reales, GA4, producción o campo.
- Trayectoria profesional específica/publicable no verificada externamente: se conservan antecedentes literales existentes, sin convertirlos en casos probados.

### Pending

| ID | Responsable / condición | Bloquea |
| --- | --- | --- |
| PT-03/HN-04/HERO-01 | Codex: formulario/destino real en fase autorizada, activar puertas y repetir navegación/CTA integrados. | CTA/navegación final, no contenido actual |
| PT-02/H-15 | José: especificar antecedentes/proyectos verificables y autorización publicable. | Evidencia profesional de lanzamiento; no presentación local del copy existente |
| PT-04 | José: autorizar Agencias, AI-First y FAQ por separado. | Home completa; fuera del alcance actual |
| R-03/R-06/A-03/A-07 | QA: zoom, dispositivos, lector y auditoría integral. | Aceptación responsive/accesibilidad global |
| H-03/H-04/H-05/H-06/FND-03 | José: proveedores, dominio/contacto, privacidad/copy de rutas y receptor reales. | Captación pública/lanzamiento |
| H-07/H-08/H-09/H-10/H-11/H-14/H-15 | José: decisiones/configuración según registros vigentes. | Medición/API/operación/SEO correspondientes |

### Known Issues

- SWC falló dentro del sandbox; repetición fuera pasó sin cambios para esconderlo. next-env generado restaurado.
- Muestreo inicial de viewport/scroll fue inestable; se repitió y las capturas finales corresponden a tamaños/scroll estables. No defecto de UI identificado por ese muestreo.
- CTA normal sigue oculto por ausencia del destino real; Agencias permanece pendiente. Home no completa ni publicada.
- No overflow o errores de consola detectados en el alcance revisado; no afirmación universal. Sin evidencia global de accesibilidad o de trayectoria profesional específica.

### Decisions Needed

Ninguna decisión nueva bloquea el contenido local autorizado. PT-01–05 documentan interpretaciones y exclusiones; pendientes operativos y evidencia profesional mantienen sus puertas.

### Recommended Next Step

Revisar esta fase y su evidencia. Resolver evidencia profesional publicable y completar Agencias según el orden canónico en una fase autorizada. Mantener AI-First/FAQ/formulario/medición para solicitudes posteriores.

---

## Completion Report — AI-First + FAQ, 13/10/2026

America/Santiago. Base `751bbb3`, checkout limpio al iniciar; cambios locales sin commit. Windows/Node 22.17.0/npm 10.9.2; Chromium Codex In-app Browser emulado, build optimizado local `http://127.0.0.1:3006/`. Sin deployment, captación ni proveedores/mocks. Sufijo `/AIFirstFAQ` delimita subcasos, no PASS global. Servidor de esta sesión detenido al finalizar; servidor dev preexistente conservado.

### Implemented

- `src/components/sections/AIFirst.tsx`: H2 y dos párrafos literales de content. Expertise y supervisión humana conservados, apoyo a análisis/documentación/QA sin claims nuevos. Ubicación después de Experience y antes de FAQ adoptada explícitamente por José (AF-01); excepción registrada en `ai-first-faq-review.md`, fuentes originales intactas.
- `src/components/sections/FAQ.tsx` y CSS Module: #preguntas, título literal y tres preguntas/respuestas completas, H2→H3, columna de lectura sin acordeón. Server Components; Section/Container/typography/tokens existentes. Ningún control, visual de IA, animación, CTA o dependencia nueva.
- `site.aiFirst/site.faq` y composición en page.tsx. Archivos de las secciones anteriores intactos; puertas de Header/CTA preservadas. No Agencias, formulario, backend, API, email, CRM, CMP ni medición.
- Solo documentación de revisión/evidencia/validación de esta fase; aceptación raíz/referencia y fuentes estratégicas, copy, diseño, dependencias y lockfile intactos. Evidencia en `evidence/ai-first-faq/`.

### Validated

| ID / subcaso | Estado | Método / evidencia |
| --- | --- | --- |
| B-01/AIFirstFAQ | PASS parcial | Reconciliación de fuentes y decisión AF-01 cerrada; siete SHA-256 coincidentes. review/source-hashes.json. |
| B-03/typecheck-AIFirstFAQ | PASS | npm run typecheck fuera del sandbox, exit 0; next typegen + tsc --noEmit. checks.md. |
| B-03/lint-AIFirstFAQ | PASS | npm run lint, max-warnings=0, exit 0. checks.md. |
| B-03/build-AIFirstFAQ | PASS | npm run build fuera del sandbox, exit 0; Home prerenderizada. checks.md. |
| B-04/AIFirstFAQ, B-07/AIFirstFAQ | PASS parcial | Server Components, diez textos literales y en orden en DOM/HTML inicial; sin nuevos controles, destinos o claims. copy.json/static.json. |
| B-06/carga-AIFirstFAQ | PASS parcial | Cero excepciones Runtime, console entries o logs warn/error en cargas/navegación/resize observados. network-console.json. |
| R-01/AIFirstFAQ, R-02/AIFirstFAQ | PASS parcial | Ocho anchos medidos, cinco solicitados inspeccionados visualmente, sin overflow; copy, jerarquía, gutters, spacing y orden conservados. responsive.json y ai/faq-*.png. |
| R-04/FAQ-AIFirstFAQ | PASS parcial | Tres respuestas visibles a todos los anchos, sin carrusel/acordeón; ningún contenido depende de expansión. DOM/capturas. No recertifica diagrama ni Home completa. |
| N-02/preguntas-AIFirstFAQ, A-01/DOM-AIFirstFAQ | PASS parcial | #preguntas único; orden Experience→AI-First→FAQ por AF-01, H1 único/lang es y H2→tres H3, regiones con nombre. semantics.json/árbol accesible. No ocho anclas finales ni lector. |
| A-02/teclado-AIFirstFAQ | PASS parcial | A 375px: Tab al skip link, Enter a MAIN/#contenido, End lectura, Tab/Shift+Tab sin trampa; cero tabindex positivo y controles nuevos. keyboard.json/skip-focus.png. No recorrido final completo. |
| A-04/default-AIFirstFAQ | PASS parcial | Texto y títulos sobre bg: 15.57:1. contrast.json; sin estados interactivos nuevos ni PASS global. |
| A-05/preferencias-AIFirstFAQ | PASS parcial | Reduced motion: none/scroll auto; forced-colors mantiene lectura; foco visible del skip link de 50.4px. preferences.json/png. Sin nuevos touch targets en secciones. |
| M-11/ausencia-integraciones-AIFirstFAQ | PASS parcial | Network: 20 GET locales, cero externos/POST/GTM/GA4/píxeles, buffer no truncado. network-console.json. No acredita consentimiento/medición activa. |
| B-03/sandbox-AIFirstFAQ | FAIL ambiental, repetición PASS | SWC canonicalize jsc.baseUrl, acceso denegado os error 5; mismo código fuera pasó. checks.md. |
| B-06/inicio-local-AIFirstFAQ | FAIL de comando, corregido | npm no transmitió --port y trató 3006 como directorio; inicio directo Next y nueva carga PASS. Navegación previa al servidor dio connection refused. checks.md. |

### Not Validated

- R-03 zoom real 200%, R-06 Safari iOS/Chrome Android físicos; A-03 lector y A-07 axe/WCAG integral. Sin PASS global de accesibilidad. Viewports son emulados.
- Procesos IA reales y resultados operativos de consultoría: render/copy no verifican herramientas, ejecución, velocidad, ahorros ni capacidades propias. AF-05 conserva esa dependencia comercial de lanzamiento.
- B-02 reinstalación/CI, B-03 flujos críticos del MVP, B-06 flujos finales, R/N/A globales y privacidad/rutas completas. C-01/C-02/N-02–04 integrados pendientes de formulario; no captación acreditada.
- F/E/S/P/M/CO/PR/D operativos, servicios reales, GA4, performance, producción y campo. No simulación de integración. Matriz global conserva NOT VALIDATED.

### Pending

| ID | Responsable / condición para cerrar | Bloquea |
| --- | --- | --- |
| AF-05 | José: distinguir y verificar procesos IA operativos/publicables frente a capacidades planificadas. | Veracidad comercial de lanzamiento, no UI local |
| AF-06 / HN-04 / HERO-01 | José autoriza fases posteriores; Codex implementa Agencias/formulario/destinos reales y repite CTA/navegación integrados. | Home y recorrido comercial completos |
| R-03/R-06/A-03/A-07 | QA: zoom real, dispositivos, lector y auditoría integral. | Aceptación responsive/accesibilidad global |
| H-03/H-04/H-05/H-06/FND-03 | José: proveedores/planes, dominio/contacto, privacidad/copy de rutas y receptor/avisos reales. | Captación pública/lanzamiento |
| H-07/H-08/H-09/H-10/H-11/H-14/H-15 | José: decisiones/cuentas/configuración operativa según registros vigentes. | Medición/API/operación/SEO correspondientes |

### Known Issues

- SWC dentro del sandbox y argumento npm de inicio fallaron; repetición fuera e inicio directo aprobaron sin modificar configuración/tests. next-env generado restaurado.
- Clips iniciales inconsistentes por scrollbar/repintado, corregidos en el muestreo final mediante override temporal; intento requestAnimationFrame no disponible descartado. No defecto de UI atribuido a esas capturas. Overrides restaurados y capturas finales estables en browser.md.
- Sin overflow ni errores de consola detectados en el alcance observado, sin afirmación universal. CTA normal sigue oculto hasta destino real; Agencias y formulario pendientes. No MVP completo ni release acreditado.
- Copy IA conserva compromisos del contenido solicitado; su operación real queda pendiente de verificación por José antes de publicar (AF-05).

### Decisions Needed

AF-01 cerrado por respuesta explícita de José: AI-First después de Experience y antes de FAQ. Ninguna decisión nueva bloquea estas secciones locales. AF-05 y pendientes operativos históricos conservan sus puertas de lanzamiento/fases posteriores.

### Recommended Next Step

Revisar esta entrega y resolver prácticas IA publicables. Completar Agencias en una fase autorizada; preparar decisiones/copy/privacidad del Lead Form antes de implementar captación. No activar backend ni medición por esta fase.

---

## Completion Report — Lead Form + Lead Flow local, 13/10/2026

America/Santiago. Base `2d2766e`, checkout limpio al comenzar; working tree sin commit nuevo. Windows/Node 22.17.0/npm 10.9.2, Chromium In-app Browser emulado en http://127.0.0.1:3000. Build local inspeccionado en disco; no producción, backend, mocks ni proveedores. Sufijo /LeadLocal define únicamente subcasos: criterios globales conservan NOT VALIDATED.

### Pre-flight Decisions

José respondió explícitamente: «Mantener pendientes; solo UI y validación independiente». H-01 resuelto local; H-02 adoptado solo para ese alcance; H-13 resuelto documentalmente. H-03 DECISION NEEDED (stack confirmado, operación pendiente); H-04/H-05/H-06 BLOCKER para captación/backend real; H-10/H-11/H-14 DECISION NEEDED. H-07/H-08/H-09 siguen afectando medición; H-16/H-19 y LF-01/02/03 SAFE ASSUMPTION; H-21/H-22 FUTURE. Responsable de decisiones operativas: José. Clasificación completa y condiciones en [lead-form-review.md](lead-form-review.md).

### Implemented

- `src/components/lead/LeadForm.tsx` y CSS Module: siete campos exactos, cinco required/dos optional, labels/ayudas/errores literales, tipos/autocomplete, una columna y primitives/tokens existentes. Validación al submit y corrección de campo tras error, resumen alert, foco al primero y valores en memoria React. Estados idle/editing/validation_error/locally_valid, este último explica que no hubo envío. Sin request_id/POST/loading/error de recepción/uncertain/success ficticios.
- `src/lib/lead/schema.ts`: schema parcial Zod de reglas independientes, trim y normalización URL sin visita. Sin límites H-10 ni contrato HTTP final. `tests/lead-draft.test.mjs`: obligatorios, formato, enum, extras, Unicode/opcionales y URLs inseguras/ambiguas.
- `LeadFormPreview.tsx`, site.leadForm y dos líneas de integración en page: solo development + LEAD_FORM_PREVIEW o fixture HEADER_NAVIGATION_PREVIEW existente. Home normal/producción conserva puertas y no incluye laboratorio. No #diagnostico comercial, privacidad ficticia, mailto, backend, integraciones, dependencias nuevas o cambios a fuentes/aceptación. Secciones previas intactas.
- Revisión y evidencia en [checks](evidence/lead-form/checks.md) y `evidence/lead-form/`. Copy de laboratorio identificado como QA; no nuevo copy comercial publicado.

### Validated

| ID / subcaso | Estado | Método / evidencia |
| --- | --- | --- |
| B-01/LeadLocal | PASS | Lectura/reconciliación, autorización limitada y siete hashes coincidentes. review/source-hashes.json. |
| B-03/typecheck-LeadLocal | PASS | npm run typecheck final fuera sandbox, exit 0. |
| B-03/lint-LeadLocal | PASS | npm run lint final, exit 0; reglas intactas. |
| B-03/build-LeadLocal | PASS | npm run build fuera sandbox exit 0; ambos flags QA activos, laboratorio ausente de HTML/RSC. build-gate.json. |
| B-03/schema-LeadLocal | PASS | node --experimental-strip-types --test tests/lead-draft.test.mjs: 3 PASS, 0 FAIL, exit 0. Solo schema local. |
| B-04/LeadLocal, B-07/LeadLocal | PASS | Home sigue server/prerenderizada; cliente solo laboratorio. Sin rutas/dependencias/campos extra. |
| F-01/campos-LeadLocal | PASS | Siete campos/orden/opciones/required correctos, labels literales; semantics.json y capturas. No formulario operativo. |
| F-02/schema-cliente-LeadLocal, F-03/URL-cliente-LeadLocal | PASS | Casos del schema y rechazo de formatos en navegador. Sin límites/POST directo ni servidor: criterios globales NV. |
| F-04/LeadLocal, A-03/asociaciones-DOM-LeadLocal | PASS | Vacío muestra cinco errores, foco name; email/URL inválidos enfocan email; aria-invalid/describedby y textos correctos. validation.json. Sin lector. |
| F-11/botón-sin-JS-LeadLocal | PASS | Sin JS, disabled SSR + noscript; nojs.json. Soporte real sigue pendiente. |
| R-01/LeadLocal, R-02/LeadLocal | PASS | Ocho anchos emulados sin overflow, una columna, controles ≥48 px/fuente 16 px. responsive/breakpoints/capturas. |
| A-02/teclado-LeadLocal | PASS | Tab y Shift+Tab recorren siete campos y submit sin trampa, foco visible. keyboard.json/capturas. |
| A-04/combinaciones-LeadLocal | PASS | Contrastes utilizados 4.76–16.29; error sobre panel 5.91. contrast.json. No todos los estados futuros. |
| B-06/LeadLocal, M-11/ausencia-tags-LeadLocal | PASS | Console warn/error=[]; Network sin POST/GTM/GA/píxeles observado, buffer no truncado. No acredita consentimiento/medición. |
| PR-02/cliente-local-LeadLocal | PASS | Sin datos sintéticos en storage/URL, sin dataLayer, fuente sin logs/fetch. privacy.json/network. No backend ni prueba de logs operativos. |
| B-03/sandbox-LeadLocal | FAIL ambiental, repetición PASS | Typecheck/build fallaron SWC Acceso denegado os error 5; mismo código fuera pasó. |
| B-03/schema-URL-inicial-LeadLocal | FAIL corregido, repetición PASS | Parser reinterpretaba barra invertida. Schema rechaza ambigüedad; mismo caso final pasa. |
| B-03/lint-tests-inicial-LeadLocal | FAIL corregido, repetición PASS | Dos variables destructuradas sin uso en fixture; ajuste sin retirar pruebas/reglas, final exit 0. |

### Not Validated

- F-02/F-03 completos: máximos/servidor no adoptados ni implementados. F-05–F-10: loading, doble POST, accepted, transacción, idempotencia y success no disponibles; ningún PASS de backend.
- E-01–E-07: catálogo HTTP, rate limit, payload/origin, timeout/replay, avisos y jobs reales pendientes. No se inventa recepción incierta cuando no hubo solicitud.
- N-06 privacidad final/soporte, C-01–C-03 navegación comercial integrada/tracking y F-11 soporte operativo. #diagnostico existente en fixture sigue siendo sintético, no formulario real.
- R-03 zoom/reflow real; R-05 barra, R-06 iOS/Android físicos; A-03 lector/avisos reales y A-07 axe/WCAG integral. No teclado móvil físico ni éxito/red lenta emulados.
- M/CO/PR/D operativos, GA4, servicios reales, producción, rendimiento/campo, CI y aceptación global. Ausencia de eventos no equivale a implementación analytics. Matriz canónica intacta.

### Pending

| ID | Responsable / condición | Bloquea |
| --- | --- | --- |
| H-03/H-04/H-06 | José: región/plan/email/scheduler, dominio/remitente/destinatario/soporte y receptor QA probado. | Backend/captación/lanzamiento |
| H-05 | José: privacidad final, proveedores/retención/borrado/backups y responsable operativo. | Captación pública/lanzamiento |
| H-10 | José: adoptar límites, timeouts, antispam/rate limit y calendario retries. | Schema/API/flujo dependientes |
| H-11 | José: catálogo HTTP/retry y mensajes opcionales de longitud. | Errores de red/uncertain/retry UI |
| H-14 | José: historial/actor atómico y procedimiento manual. | Operación DB |
| H-07/H-08/H-09 | José: consentimiento/revocación/cuentas QA. | Medición, desactivada en esta fase |
| HN-04/HERO-01/LF-01 | Codex tras cierres: destino real, captación, navegación integrada y validación final. | Flujo comercial, no laboratorio |
| R-03/R-06/A-03/A-07 | QA: dispositivos/zoom/lector/auditoría. | Aceptación integral |

### Known Issues

- Schema deliberadamente parcial sin máximos; no usar como protección servidor final. Sin API/DB ni captación: Lead Flow real no terminado.
- Fallos SWC, test URL y lint descritos arriba, corregidos/repetidos con evidencia. Dev 3007 falló por servidor existente; se conservó/reutilizó 3000. Navegación inicial 3007 dio connection refused. No modificaciones para ocultar fallos.
- Runner Node avisa sobre type stripping experimental y ESM sin type; tests pasan, configuración/dependencias intactas. No error de consola de la aplicación observado en flujos locales.
- Privacidad/soporte todavía sin destinos operativos; laboratorio lo indica. Capturas iniciales largas desalineadas reemplazadas por screenshots de viewport; evidencia final no muestra overflow en tamaños revisados, sin afirmación universal.

### Decisions Needed

Se mantienen explícitamente H-03/H-04/H-05/H-06/H-10/H-11/H-14 y pendientes de medición. No se solicita otra adopción del stack ni de form_start. LF-01/02/03 son interpretaciones locales documentadas, sin resolver decisiones de José.

### Recommended Next Step

Cerrar decisiones de parámetros/mensajes/operación y configurar receptor privado QA con privacidad/contactos reales. Después implementar API/transacción/jobs y flujo cliente, probar concurrency/timeout+replay/fallo de aviso con servicios reales y habilitar destino comercial. No publicar ni activar tracking por esta entrega.

---

## Completion Report — Lead Flow v2 / Sheets readiness, 19/10/2026

Working tree con cambios previos preservados, sin commit nuevo. Revisión previa entregada antes de código en chat; decisiones posteriores de José: tres categorías reconfirmadas y problema opcional; todavía no hay Sheet/Service Account. Evidencia actual: [checks](evidence/lead-flow-v2/checks.md), [captura paso2](evidence/lead-flow-v2/step2.png). Los PASS anteriores no se trasladan al nuevo flujo.

### Implemented

- LeadForm.tsx/CSS: dos pasos, seis obligatorios paso1, radios de inversión obligatorios paso2, problema opcional; conserva valores/selección, foco al heading/primer inválido, UUID en memoria estable por instancia. Formulario exclusivo del laboratorio development existente.
- schema.ts y tests: nuevo contrato local estricto y máximos de referencia; no URL/CRM ni campos antiguos. Reglas teléfono locales explícitamente provisionales en LF2-LIMIT, no API final.
- decisions.md: decisiones nuevas y cierres H-11/H-14 documentales, H-10 parcial. lead-form-review.md registra conflictos/sustituciones, pendientes y alcance. google-sheets-schema.md contiene ambos datasets y pasos de configuración; measurement-readiness.md separa señales/finalidades.
- Sin API/adapter/DB/GTM/CMP, sin estados de red ni éxito simulado. Sin cambios de estrategia, diseño general, dependencias o lockfile.

### Validated

| ID / subcaso | Estado | Método / alcance |
| --- | --- | --- |
| B-03/typecheck-LF2 | PASS | npm run typecheck exit0 |
| B-03/lint-LF2 | PASS | npm run lint exit0 |
| B-03/build-LF2 | PASS | npm run build exit0, rutas estáticas |
| F-02/schema-local-LF2 | PASS | tres tests Node: reglas, límites, catálogo y rechazo campos retirados; no servidor HTTP |
| F-01/nuevo-schema-local-LF2 | PASS parcial | Navegador: dos pasos y ocho campos nuevos, problema opcional; criterio histórico incompatible documentado |
| F-04/pasos-local-LF2 | PASS parcial | Vacío bloquea ambos pasos, foco primer inválido; avance y vuelta enfocan heading |
| A-02/radios-vuelta-LF2 | PASS parcial | Flecha cambia selección, Volver conserva datos, Continuar conserva radio, ShiftTab llega a Volver |
| B-06/console-local-LF2 | PASS parcial | tab.dev.logs warn/error vacío durante flujos observados |
| git-diff/whitespace-LF2 | PASS | git diff --check exit0 |

### Not Validated

F-02 servidor; F-05–F-10, E-01–E-07 de recepción, idempotencia/concurrencia/doble POST/timeout/replay, estados loading/recoverable/uncertain/success; no receptor/configuración y LF2-IDEM abierto. F-03 URL, F-07 lead+job y E-05 scheduler requieren reconciliar criterio con alcance nuevo, no PASS ni retirada silenciosa.

UUID estático revisado, estabilidad runtime no instrumentada. Sin prueba de secretos con credencial sintética, Network exhaustivo/storage/logs servidor (PR-02/B-05 completos). Responsive320/375/768/1024/1440, contraste y targets medidos, zoom, lector, axe y móviles reales NOT VALIDATED; solo captura del viewport actual. No QA/producción de Sheets ni plataformas/consentimiento. Matriz global sigue NOT VALIDATED.

### Pending

- LF2-STORE BLOCKER, José: crear Sheet privado/proyectoAPI/ServiceAccount, acceso servidor, ID y tabs configurados; bloquea recepción QA. Instrucciones en google-sheets-schema.md.
- LF2-IDEM BLOCKER, José/implementador: adoptar exclusión/reconciliación que garantice idempotencia concurrente con Sheets; bloquea backend conforme. No mutex multiinstancia ficticio.
- LF2-PHONE/LF2-OPS DECISION NEEDED, José/implementador: teléfono/normalización/mensajes, contrato HTTP/timeout y estados operativos; cerrar antes de API final.
- LF2-IPUA DECISION NEEDED, José: privacidad/retención/necesidad; no persistir por defecto.
- H-04/H-05 y Production Privacy / Retention BLOCKER FOR LAUNCH: contactos, privacidad, retención/borrado, receptor productivo y controles operativos.
- H-07/H-08/H-09 pendientes de medición. H-10 parcial, H-11/H-14 resueltos documentalmente; no reabrir por informes históricos ni convertirlos en PASS.

### Known Issues

Flujo real incompleto: local valida pero no envía. Se informa antes del formulario y tras validar. Catálogo de errores por campo todavía genérico con título aprobado; teléfono aplica filtro de formato local, no validación/normalización definitiva. Dependencias backend no resueltas.

Fuentes antiguas y acceptance contienen reglas sustituidas; mapa en lead-form-review.md señala cada documento afectado. Se mantienen intactas por alcance de documentación solicitado; usar addendum vigente, no tomar las reglas antiguas como implementación aprobada. No pruebas de recepción ni métricas de rendimiento, conversiones o cumplimiento. Avisos Node experimentales/CRLF no son fallos de checks.

## Verificación de acceso a Google Sheets QA — 19/10/2026

### Implemented

Prueba puntual de autenticación servidor con la credencial local fuera del repositorio. No se copiaron secretos al proyecto, no se modificaron filas ni se conectó todavía el formulario. Sin cambios de código/configuración.

### Validated

LF2-STORE/auth-read: PASS. Identidad de Service Account coincide con la proporcionada por José; token OAuth de alcance spreadsheets.readonly obtenido y solicitud de metadata a Sheets API completada HTTP200. Archivo: analyticsJC - leads QA; pestañas leads y offline_events. Solo nombres/resultado saneado en salida, sin clave/token/filas.

### Not Validated

Permiso de escritura, persistencia de lead, schema físico/cabeceras, POST /api/leads, concurrencia, timeout/replay y éxito real. Lectura no acredita rol Editor ni idempotencia.

### Pending

LF2-STORE parcialmente resuelto: archivo y acceso lector acreditados. Configuración runtime y escritura QA pendientes. LF2-IDEM continúa BLOCKER de persistencia conforme. No cierres de privacidad/medición/lanzamiento.

### Known Issues

Primer intento restringido devolvió CONNECTION_CHECK_FAILED; repetición autorizada fuera del sandbox pasó. No cambio de código para ocultar el fallo. Formulario sigue solo local, sin envío.

## Completion Report — Sheets server-side QA, 19/10/2026

Solicitud explícita: integración real y prueba de persistencia; no deployment. Cambios previos preservados, sin commit nuevo. Evidencia [checks](evidence/lead-sheets/checks.md), [QA real](evidence/lead-sheets/real-qa.json), [timeout/replay](evidence/lead-sheets/timeout-replay.json), [seguridad](evidence/lead-sheets/security.json), [éxito navegador](evidence/lead-sheets/confirmed-success.png).

### Implemented

- src/app/api/leads/route.ts: POST Node server-only indirecto, gate QA local, Origin/Host, tipoJSON y body16KiB, validación compartida estricta, respuestas saneadas sin contacto. Sin logs body/proveedor.
- src/lib/server/sheets.ts: OAuth JWT de Service Account exclusivamente servidor, ruta credencial externa, timeout8s, cache de token solo memoria, sin errores privados expuestos.
- src/lib/server/lead-store.ts: lead_id UUID servidor y submission_id en fila; statusreceived, lifecycle sin decisión vacío; appendCells stringValue protege fórmulas y ceros. Unicidad mediante addNamedRange determinista+appendCells en mismo batch atómico; no DB adicional. Reconciliación por lectura tras error, sin segundo append automático; replay original y conflicto409. Señales ausentes permanecen vacías.
- src/lib/lead/contract.ts y LeadForm: accepted estricto de submission activa; timeout15s ->unconfirmed, retry manual mismo ID/payload, guard de peticiones simultáneas, campos congelados tras envío, cuatro estados H11, foco a éxito y eliminación de contacto. Una incertidumbre anterior no se rebaja a fracaso definitivo por fallo posterior de retry.
- .env.local privado/ignorado con ruta/ID/configuración QA, sin clave embebida; .env.example nombres vacíos. allowImportingTsExtensions permite ejecutar los mismos módulos TypeScript en Node22 sin segunda implementación ni dependencias nuevas. Scripts setup/tests/auditoría; offline_events contrato documental sin envío.
- Registro decisions y revisiones actualizado con configuración suministrada y resolución técnica LF2-IDEM para QA probado. No cambios estrategia/generalcopy/DS ni medición.

### Validated

| ID / subcaso LF3 | Estado | Evidencia |
| --- | --- | --- |
| B-03/typecheck, lint, build | PASS | comandos exit0 finales;6testsPASS |
| F-02/server-validation | PASS parcial | schema compartido,422 inválido,413>16KiB, catálogos/límites en unit tests |
| F-07/Sheets-atomic | PASS | escritura real confirma fila+IDs, mapeo correcto; nueva semántica Sheets sustituye DB/job previo |
| F-08/concurrency-replay | PASS |4POST simultáneos ->1fila/1lead_id; replay200; conflicto409 sin otra fila |
| F-06/strict-accepted | PASS parcial | contrato rechaza202/malformed/otra submission; navegador éxito tras recepción real |
| E-03/timeout-replay | PASS parcial | commit real con fallo inducido de respuesta+lectura ->uncertain; retry recupera mismo lead/fila |
| E-02/request-security | PASS |403origen,415tipo,413body,405GET; sin insert extra |
| B-05/client-secrets | PASS parcial | assets build/dev sin fragmentos de clave/ServiceAccount/SheetID;server-only; .env.local ignorado |
| PR-02/local-logs | PASS parcial |log local disponible sin marcadores contacto QA; fuente sin logging de PII; no logs producción |
| F-05/loading, F-10/success-focus | PASS parcial | navegador bloquea envío y enfoca éxito real, sustituye campos |
| B-06/browser-console | PASS parcial |warn/error vacíos durante recorrido observado |
| B-03/inicial / E-02/inicial | FAIL corregidos |lint globals, TS narrowing y403local por URL interna; repetidosPASS |
| B-03/red-sandbox | FAIL ambiental, repeticiónPASS |setup/QA/timeout fallaron con restricción; autorizados fuera pasaron |

### Not Validated

Prueba de carga/volumen/cuotas/rangos, backup/restore y borrado/retención coordinados; privacidad/producción/hosting. Network navegador exhaustivo, pruebas con móviles físicos/viewport matrix/lector/axe/contraste de todos los nuevos estados. Timeout validado con fallo inducido y persistencia real, no caída observada de Google. Logs externos no accesibles.

F-09 segunda solicitud intencional mismo email no probada en suite específica; el código deduplica solo submission_id. E-05 avisos/workers excluidos por alcance. GA4/Ads/Meta/CMP/ConsentMode/MP/CAPI/offline_events y métricas de campo NOT VALIDATED. Matriz original contiene criterios anteriores (DB/job/request_id); los subcasos LF3 no acreditan esos contratos obsoletos ni PASS global del MVP.

### Pending

- QA local: sin nueva credencial ni configuración necesaria para repetir uso normal. Utilizar solo sintéticos; revisar y retirar fixtures con sus marcadores mediante procedimiento coordinado tras revisión.
- Public Launch: José debe cerrar privacidad/retención/contactos/receptor productivo, controles contra abuso, permisos/protección/backup y capacidad operativa. Gate producción permanece cerrado.
- LF2-STORE cerrado para escritura/lectura QA. LF2-IDEM resuelto técnicamente para escenario probado; mantener marcadores/IDs íntegros y evaluar volumen antes de lanzar.
- H-10 retenciones pendientes; H11 implementado en QA; H14 mínimos operativos sin política final de conservación. H07/H08/H09 siguen abiertos para medición.

### Known Issues

No flujo productivo. Lectura O(n), marcador técnico por submission y dependencia de cuotas/rangos; no prometer escalabilidad sin carga. Alterar/borrar manualmente filas e IDs/marcadores puede invalidar integridad; no restaurar solo CSV. No deduplicación tras recarga con IDnuevo. Mensajes por campo siguen genéricos, teléfono normaliza separadores sin validar existencia/país. Se conservan tres filas sintéticas para revisión; no datos de terceros ni eventos de plataformas.

Fallos iniciales y límites descritos arriba. No secreto o PII detectados en el alcance escaneado; no afirmación universal sobre servicios externos o producción.

Actualización final LF3: el último build restringido falló EPERM al crear carpeta generada de /_not-found (FAIL ambiental, Known Issue). Repetición del mismo código fuera del sandbox PASS exit0, TypeScript incluido; lint final PASS. Auditoría de secretos/logs repetida sobre build final PASS en su alcance. Sin cambios de código para ocultar el fallo ambiental.

## Configuración exportable GTM → GA4 — 21/10/2026

### Implemented

Archivo deliverables/gtm/GTM-K5MZ4W66_workspace3_GA4.json generado desde el original de Downloads; 17 variables, 5 activadores Custom Event y 5 tags GA4 Event hacia el destino existente G-N0GCP60M3V. Eventos click_to_action/form_start/form_error/form_submit/generate_lead; mapeo explícito por evento, CTA Continuar incluido, sin user_data. Formularios automáticos y ogt_1p_data_v2 desactivados en el export. Fuentes: contrato vigente decisions/measurement/web-measurement-review/events.ts. Sin cambios de aplicación ni publicación. Generador y revisión en deliverables/gtm/build-ga4.mjs y README.md; sin commit.

### Validated

GTM-J-01/02/03 PASS local: node deliverables/gtm/build-ga4.mjs, Windows/Node22.17.0. JSON, IDs, referencias, destino conservado, tablas parameter/parameterValue, parámetros permitidos, ausencia de mapeo de contacto; funciones URL/referrer y opcional form_id ejecutadas con fixtures sintéticos en VM; hash del original intacto. Evidencia saneada deliverables/gtm/validation.json con hashes. Primer intento del generador FAIL por ENOENT/ruta %20, corregido con fileURLToPath; repetición PASS. No se ejecutan builds/tests frontend al no modificarlo.

### Not Validated

GTM-J-04: importación UI/formato optimizado. GTM-J-05: Preview/Tag Assistant/Network, omisión undefined y recepción GA4 DebugView. GTM-J-06: page_view automático inicial/SPA, saneamiento previo y duplicación por pathname/hash. GTM-J-07: Consent/revocación, producción/campo y dispositivos físicos. Ningún evento enviado a Google por esta tarea. Validación estática no equivale a integración acreditada.

### Pending

José/admin GTM: importar en workspace QA con Combinar, revisar conflictos y ajustes gtagConfig; no duplicar el destino al renombrar. Configurar/verificar saneamiento antes del page_view automático y probar los cinco eventos sintéticos con Network y DebugView. José/admin GA4: comprobar que el destino es el entorno autorizado, configurar dimensiones necesarias/evento clave cuando proceda; el JSON no modifica propiedad GA4. H-07/H-08/privacidad bloquean lanzamiento, H-09 sigue parcial hasta configuración y QA reales. Ver instrucciones completas en deliverables/gtm/README.md.

### Known Issues

El destino automático original no contiene saneamiento de URL/referrer previo al page_view. Los overrides de las cinco etiquetas añadidas solo cubren esos eventos; no corrigen ese page_view. Este límite bloquea declarar el contenedor listo para publicación. Otras detecciones automáticas del original se conservan y requieren revisar su payload. Error local de ruta corregido, no un fallo GTM observado. No se afirma exclusión universal de PII ni recepción GA4 sin Network real.

## GTM API v2 readonly Python — 25/10/2026

Solicitud independiente del sitio, registrada en decisions.md. Evidencia detallada y comandos: tools/gtm_readonly/validation.md. Windows + Python3.12.14, venv y dependencias fijadas; sin credenciales reales ni cambios de instrumentación.

- GTM-API-01/02/04/05 PASS local: 21 tests unittest completos fuera del sandbox; siete listados paginados, OAuth desktop/PKCE/scope único y refresh mediante mocks, 401/403/429, límites, saneamiento y CLI mínimo.
- GTM-API-03 PASS Windows real con datos sintéticos: DPAPI de usuario, archivo cifrado y roundtrip, corrupción rechazada, credenciales dentro del repo rechazadas.
- GTM-API-06 PASS: pip check sin dependencias incompatibles; requirements.lock.txt generado desde venv.
- GTM-API-07 NOT VALIDATED: check real devuelve código1 y falta autorización; no se listaron cuentas Google. BLOCKER, responsable José: crear/habilitar cliente desktop en Google Cloud, importar JSON fuera del repo y autorizar navegador.
- GTM-API-08 NOT VALIDATED: renovación/paginación/errores contra Google real, comprobados solo con mocks. No prueba GTM Preview, Network del sitio, GA4, consentimiento ni producción y no cierra H-09.
- Incidencias ejecutadas del entorno: ensurepip y DNS pip fallaron dentro del sandbox; rerun autorizado fuera del sandbox resuelto. Suite inicial bloqueada en almacén temporal del sandbox, interrumpida; rerun completo PASS (21 tests,0 fallos). Sin fallos funcionales detectados en esos 21 casos; límites: Windows, un proceso por almacén, cuotas compartidas entre instancias, OAuth real pendiente.

## Preparación Vercel Preview QA — 25/10/2026

### Implemented

Revisión read-only terminada y reportada antes de edición. Solicitud adoptada en decisions.md; technical/measurement ampliados solo para excepción Preview QA. next.config + lib/environment separan local/qa/production; flags separados y build/receptor/Sheets bloquean producción. Formulario/adquisición/medición/GTM disponibles en Preview aprobado; laboratorios visuales locales conservados. Ancla real #diagnostico; sin destino sintético en Preview. GOOGLE_SERVICE_ACCOUNT_JSON privado server-only sin fallback QA a archivo; soporte local mantenido. /api/leads Node maxDuration60 conserva contrato/persistencia/reconciliación. .env.example, ignore, script npm test y guía qa-deployment.md. Sin commit ni deployment.

### Validated

- VQA-01 PASS: matriz de entorno, flags inválidos/production y origen HTTPS exacto. Build con VERCEL_ENV=production rechazado pese a siteEnv=qa/aprobación=true.
- VQA-02 PASS: credencial JSON sintética RSA, firma JWT/OAuth y Sheets con fetch mock; archivo inexistente y JSON inválido no causan fallback ni exponen error. No request Google real.
- VQA-03 PASS: npm ci --no-audit --no-fund en directorio aislado limpio con package.json/lockfile idénticos (127 paquetes); npm run test36/36; npm run typecheck; npm run lint; npm run build Preview. Windows/Node22; no Linux ni Vercel. Build con NEXT_PUBLIC_SITE_ENV=qa, VERCEL_ENV=preview, QA_DEPLOYMENT_ENABLED=true, flags formulario/receptor/medición/GTM true, GTM sintético, JSON canario y ruta Windows inexistente.
- VQA-04/VQA-05 PASS: servidor compilado local, HTTP transporte y Origin HTTPS sintético con Host explícito; formulario/ancla única y noindex header/meta; API403/415/422/413 y503 saneado con credencial inválida. Evidencia docs/evidence/qa-deployment/smoke.json. No prueba TLS externo ni recepción Sheets.
- VQA-06 PASS acotado: .env.local/.vercel/JSON común ignorados; firmas de claves en327 archivos rastreados y11 commits,0 coincidencias; canario secreto, ruta QA y PEM ausentes en16 archivos .next/static. git-security.json y smoke.json. No equivale a scanner universal de secretos ni Network remoto.
- git diff --check PASS.
- Fallos ejecutados: npm ci inicial FAIL EPERM sobre SWC en uso; recuperación restringida npm install FAIL Exit handler never called; recuperación fuera de sandbox PASS con aviso de limpieza SWC; instalación limpia aislada PASS. Lint inicial FAIL globals del test y JS de .venv; corregidos imports y exclusión de dependencia vendorizada, lint final PASS. Smoke inicial FAIL por EACCES/red sandbox; fetch posterior403 por Host no reproducido; HTTP nativo explícito PASS. Se conservan estos límites, sin modificar tests para ocultarlos.

### Not Validated

VQA-07/08/09 NOT VALIDATED: sin URL Preview/deployment ID, protección autenticada, configuración de secrets en Vercel ni pruebas nuevas de Google real. GTM/GA4/cookies/page_view/analytics_identity_ready/UTMs/click IDs/Sheets/retry/generate_lead requieren ejecutar checklist en nuevo origen. Pruebas de unidad con mock no son integración. No regresión visual/teclado exhaustiva nueva ni prueba servicios reales en este turno. D-01/D-03/D-05/S-03 globales permanecen parciales/no validados; no promover VQA PASS local a release.

### Pending

VQA-07 José: seleccionar equipo/proyecto QA, configurar Deployment Protection y secrets Preview, desplegar rama QA; cierre con URL HTTPS privada y revisión de variables sin valores en evidencia. VQA-08/09 implementador + José: checklist qa-deployment.md con datos sintéticos y evidencia externa saneada. H-03/H-04/H-05/H-06/H-07/H-08/H-10 siguen bloqueando lanzamiento según registro; VQA-10 NOT VALIDATED.

### Known Issues

/privacidad no implementada,404 observado: bloquea privacidad/lanzamiento; no se inventó política. No protección auth/rate limit durable implementada en app: QA depende de Deployment Protection externo, aún no verificado. Lecturas Sheets O(n), cuotas y marcadores requieren revisión antes de producción. user_data QA restringido permanece en dataLayer por excepción adoptada; excluirlo de GA4 exige validar contenedor/Network remoto. Timeout cliente15s menor al máximo de función60s: estado incierto/retry conservado, no promesa de respuesta antes de15s. Fallos de tooling iniciales resueltos o aislados arriba; sin afirmación universal de ausencia de problemas.
