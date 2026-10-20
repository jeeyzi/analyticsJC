# Evidencia — receptor Sheets real QA, 19/10/2026

Windows/Node22.17/npm10.9.2, Next16.4.0, working tree sin commit nuevo. Sheet QA privado facilitado por José; server-only con credencial externa al repositorio. Captura de éxito sin PII: confirmed-success.png.

## Pruebas reales

- scripts/sheets-qa-setup.mjs: cabeceras leads creadas únicamente tras verificar hoja vacía. offline_events sin cambios ni writers.
- scripts/sheets-qa-test.mjs: cuatro POST HTTP concurrentes a127.0.0.1:3000/api/leads ->200,200,201,200. Una fila nueva, un lead_id. Replay posterior200/replayedtrue, mismo lead_id. Los ocho campos correctamente mapeados (monthly_ad_spend ->ad_spend); normalización conservadora de email/teléfono. Company con =QA_SYNTHETIC() guardado como texto literal, no fórmula. Señales no disponibles todas vacías. Evidencia real-qa.json sin contacto.
- Mismo ID/contacto distinto409; email inválido422; cuerpo>16KiB413; origen externo403; text/plain415; GET405. Ningún registro adicional.
- scripts/sheets-qa-timeout.mjs: escritura REAL y luego fallo INDUCIDO de respuesta+lectura; persistLead devuelve unconfirmed_reception. Reintento manual con mismo input devuelve accepted/replayedtrue, una fila, mismo lead_id. No acredita una incidencia real del proveedor; sí prueba tolerancia a pérdida de respuesta tras commit. timeout-replay.json.
- Navegador Chromium IAB: formulario con datos sintéticos nuevos; Continuar válido enfoca paso2; radio elegido; submit bloquea controles y anuncia Enviando solicitud; posteriormente Solicitud recibida sustituye formulario y recibe foco. No success simulado. Console warn/error=[] en ventana observada.

## Checks

- node --conditions=react-server --experimental-strip-types --test tests/lead-draft.test.mjs tests/lead-contract.test.mjs:6PASS/0FAIL, exit0.
- npm run typecheck: exit0 final; build también ejecuta TypeScript.
- npm run lint: exit0 final, sin retirar reglas.
- npm run build: exit0; Home/404 estáticas y /api/leads dinámico Node. API rechaza NODE_ENV production aunque el flag QA estétrue.
- scripts/lead-security-audit.mjs: inspección de fragmentos de clave real (sin mostrarlos), email de service account y Sheet ID en assets cliente build/dev: ninguno encontrado. Búsqueda de marcadores sintéticos en logs Next disponibles: ninguno encontrado. Conteos actuales en security.json. No prueba de logs hosting/Google/producción ni de cualquier dato arbitrario.
- .env.local confirmado ignorado por Git. Clave privada nunca copiada al repo. Módulos sheets/lead-store importan server-only. No imports cliente a esos módulos; no console en receptor ni proveedor. Evidencia contiene IDs operativos, sin payload de contacto ni clave/token.

## Fallos ejecutados y correcciones

- Entorno restringido bloqueó acceso proveedor en setup/QA/timeout; repetición fuera autorizada pasó. No configuración alterada para ocultarlo.
- Primera prueba HTTP:403 por comparar Origin con URL interna reconstruida por Next. Corregido a Origin canónico local y Host de request coincidentes; casos localPASS/externo403.
- Lint inicial scripts: globals process/console/fetch no definidos; imports node explícitos y globalThis.fetch. No supresión de regla.
- Typecheck inicial manejo de422: narrowing de body.fields perdido en callback. Referencia local tipada por guard antes de callback; repeticiónPASS.
- Avisos Node type stripping experimental/type-less y CRLF no son fallos funcionales; se conservan sin cambiar dependencias.

## Límites

Solo QA local, sin deployment ni tráfico real. Se conservan tres submissions sintéticas de pruebas exitosas (concurrencia, timeout, navegador) para revisión; cada una debe tener su propio ID, no son duplicados. Retención/borrado coordinado de fila+marcador pendiente de procedimiento definitivo; no limpieza automática prometida.

No prueba de carga sostenida, cuotas/límite de rangos, modificación manual destructiva, backup/restore, Network browser exhaustivo, móvil físico, responsive completo, lector/axe, performance, aviso email ni plataformas. Logs del proveedor/hosting no disponibles. Propietario puede alterar filas/marcadores; no borrar submission_* ni IDs/cabeceras. CSV solo no preserva mecanismo idempotente. Recargar formulario pierde UUID/memoria y no se garantiza dedupe entre sesiones.

### Repetición final de build

Tras el ajuste que conserva incertidumbre durante retries posteriores, build dentro del sandbox falló EPERM mkdir en .next/server/app/_not-found.segments/_not-found. Mismo código repetido fuera del sandbox: exit0, TypeScriptPASS y rutas /,/_not-found,/api/leads generadas. Lint final exit0. Auditoría de assets/log repetida sobre build final sin coincidencias. next-env generado restaurado a contenido previo. FAIL ambiental conservado; no ajuste de tests/reglas para ocultarlo.
