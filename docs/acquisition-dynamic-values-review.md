# Corrección Acquisition — valores dinámicos, 20/10/2026

## Current Behavior

La versión anterior contenía campaignTaxonomy y comparación includes en el saneador compartido: una campaña desconocida se descartaba incluso en servidor. No eran solamente fixtures. Click IDs ya eran dinámicos. No hay implementación pública activa: receptor sigue exclusivamente QA, pero el contrato compartido deja de exigir despliegues por nueva campaña.

## Changes Required

Eliminada allowlist de valores; utmKeys/clickKeys permiten solamente nombres soportados. Las cinco UTMs aceptan strings dinámicos con máximo100 unidades UTF-16 antes y después de NFC/trim; preservan case. Rechazo (no truncado) de tipos incorrectos, vacío, controles, markup, email/URL, escapes residuales, patrones telefónicos y caracteres fuera de letras/marcas Unicode, números, espacio ASCII, punto, guion/underscore. URLSearchParams decodifica una sola vez; duplicados se omiten.

gclid/gbraid/wbraid: strings dinámicos opacos, máximo512, caracteres alfanuméricos/guion/underscore; sin trim/case/hash ni catálogo. Patrones telefónicos evidentes se descartan, UUID canónico no se confunde con teléfono. Estos controles pueden descartar algunos identificadores ambiguos; no acreditan autenticidad publicitaria.

Servidor compara además señales con valores de contacto normalizados (diacríticos/case/separadores), coincidencias delimitadas de longitud>=3: nombres, apellidos, email, teléfono, empresa y problema. Se omite la señal coincidente y se conserva contacto. No logs nuevos ni contacto en analytics. Esto reduce PII conocida, pero no garantiza detectar nombres de terceros, PII codificada o términos sensibles ambiguos; prohibición de PII en origen sigue vigente. No afirmar ausencia universal mediante regex.

Snapshot/memoria, payload congelado, replay, transacción Sheets, columnas y estados no cambian. No nuevas dependencias ni rutas. Referrer sigue limitado a orígenes QA previamente admitidos: no forma parte de la instrucción de valores UTM/click IDs.

## Validated

13 tests unitarios: valores creados en runtime sin catálogo, límites100/101 y512/513, sanitización idempotente, patrones PII y contacto conocido, ausencia/duplicados, snapshot estable, mapping y contrato/idempotencia existentes. Una primera prueba detectó falso positivo telefónico en segmento numérico UUID: corregido y añadido caso determinista de regresión.

Suite real scripts/acquisition-qa.mjs actualizada para generar campaña y gclid nuevos en runtime; verifica aceptación, mapeo, concurrencia, replay/contexto inmutable, una fila y ausencia de señales faltantes. Evidencia separada dynamic-values-qa.json; no sustituir evidencia histórica. Ver validation-report para resultado ejecutado. No se revalida GA/Meta real ni producción.

## Remaining Consent Dependency

Sin persistencia entre reloads: memoria del documento se pierde al recargar/cerrar o navegar con carga completa. Cualquier cookie/sessionStorage/localStorage o continuidad entre documentos requiere futura decisión Consent/CMP, duración, finalidad y borrado. Excepción actual solo QA y sin estados de consentimiento inventados. Las referencias previas a catálogo de campañas pendiente/QA-only se sustituyen para UTM/click IDs por esta decisión; no autorizan producción ni delivery.
