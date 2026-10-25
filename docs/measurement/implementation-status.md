# Full-Stack Tracking — estado y plan incremental

Fecha: 21/10/2026, America/Santiago. Inventario y propuesta; no adopta nuevas decisiones ni autoriza implementación/publicación. Evidencia técnica, límites y comando de pruebas en [foundation.md](foundation.md). La matriz canónica sigue siendo `../../acceptance.md`; no se cambian sus estados por este informe.

## Resumen ejecutivo

La aplicación dispone de una base local/QA de captación y eventos. Falta la cadena comprobada hasta los destinos, el consentimiento operativo y la entrega server-side durable. GA4/GTM están preparados parcialmente; Ads, Pixel, CAPI y Clarity no tienen implementación propia encontrada. El estado remoto del contenedor no se conoce, por lo que ausencia en código no prueba ausencia de tags remotos.

Siguiente incremento recomendado: cerrar y especificar la frontera de datos y consentimiento, preservar los eventos y la idempotencia actuales y preparar pruebas locales que intercepten toda salida. No empezar por activar píxeles. Clarity requiere resolver expresamente la exclusión actual de session replay/autocapture; CAPI requiere ampliar el alcance futuro, con reglas propias de identidad, entrega y deduplicación.

## Estados y matriz de gaps

IMPLEMENTED = existe en el alcance indicado; no implica validación de producción. PARTIAL = existen piezas, faltan integración o cobertura. MISSING = implementación no localizada. BLOCKED = decisión/condición pendiente impide activar o implementar responsablemente esa parte. Se separan existencia y bloqueo: un componente MISSING puede tener activación BLOCKED. NOT VALIDATED es un estado de prueba, distinto del estado de implementación.

| ID | Componente / alcance | Estado | Evidencia | Gap o dependencia |
| --- | --- | --- | --- | --- |
| FS-01 | Contrato y emisor dataLayer QA | IMPLEMENTED | `src/lib/measurement/events.ts:11`, `runtime.ts:8,26,85`; tests measurement | Cinco eventos estrictos, resets y singleton. Producción/consentimiento no habilitados. |
| FS-02 | Instrumentación CTA/formulario QA | IMPLEMENTED | `DiagnosisActionLink.tsx:8`; `LeadForm.tsx:59-118` | Triggers de aplicación existentes; mobile_bar solo enum. No acredita tags GTM. |
| FS-03 | Recepción e idempotencia QA | IMPLEMENTED | `api/leads/route.ts:9`; `lead-store.ts:33-86`; evidencia histórica lead-sheets | No productivo; concurrencia real no reejecutada. Marcador y fila requieren gobierno operativo. |
| FS-04 | Loader GTM QA | PARTIAL | `layout.tsx:28-40`; `gtm.ts:9-40`; `GtmHead.tsx:6` | Dedupe y HEAD implementados. No export/versionado del contenedor ni auditoría de sus tags/permisos; H-09 parcial. |
| FS-05 | Google tag / GA4 extremo a extremo | PARTIAL | `events.ts:29`, `runtime.ts:40-72,96`; `.env.example` | Mapper y bridge locales; mapper no conecta un envío real y callback ready sin caller en src. Propiedad/config/firing/ingestión desconocidos; activación BLOCKED H-07/08/09. |
| FS-06 | page_view automática / navegación SPA | BLOCKED | `decisions.md:29-40`, `acceptance.md:17`; no emisor manual | Objetivo automático adoptado; falta Google tag real y QA de pathname/hash, sin duplicar con History/manual. `/privacidad` no está implementada en árbol app actual. |
| FS-07 | Consent Mode + CMP/controles + revocación | BLOCKED | `runtime.ts:79-85`; `decisions.md:40,56`; H-07/H-08 | Mecanismo ausente; flags QA no son default/update ni permiso. Seis columnas vacías, no snapshot válido ni validación backend por finalidad. |
| FS-08 | Adquisición por documento QA | IMPLEMENTED | `AcquisitionCapture.tsx:7`; `acquisition.ts:29-70`; `lead-store.ts:25` | Snapshot + mapping server. Referrer acotado a fixtures, sin fuente Meta/MS. |
| FS-09 | Adquisición productiva / persistencia consentida | BLOCKED | `decisions.md:44-56`; H-05/H-07/H-10 | TTL, first/last touch, consentimiento, retención y borrado no adoptados. No añadir storage por defecto. |
| FS-10 | Google Ads web / Enhanced Conversions | MISSING | Sin tag/adapter propio en src; solo click IDs/columnas preparadas | Alcance Ads, cuentas/acciones, consentimiento publicitario y origen único de conversión pendientes. Activación BLOCKED. No prometer Enhanced Conversions por disponer de email. |
| FS-11 | Google Ads offline / entrega server-side | MISSING | `docs/google-sheets-schema.md`: offline_events documental; sin writer/dispatcher src | FUTURE: autorización, contrato/API vigente, cuentas, IDs y operación. No elegir API/versión sin revisión oficial posterior. |
| FS-12 | Meta Pixel browser | MISSING | No fbq/loader/config Meta localizado en src | Alcance, cuenta/dataset, mapping de eventos y consentimiento pendientes. Columnas fbp/fbc vacías no son integración. |
| FS-13 | Meta CAPI / dedupe browser-server | MISSING | Sin adapter/endpoint/worker/event_id Meta en src | FUTURE, activación BLOCKED: contrato event_name/event_id estable del mismo hecho, privacidad, token privado, estados por destino y QA real. |
| FS-14 | Microsoft Clarity | BLOCKED | Sin loader/SDK en src; `measurement.md:270`, `acceptance.md:194` | Ausente y excluido por política MVP de replay/autocapture. Requiere adopción explícita de finalidad, masking, exclusiones, consentimiento, retención y revisión de datos/URLs. |
| FS-15 | Outbox / retries server / reconciliación destinos | MISSING | `lead-store.ts:34-39` solo marcador+lead; sin dispatcher | No existe entrega durable atómica ni estado por destino. No confundir atomicidad de recepción con delivery exactly-once. Diseño del almacenamiento/scheduler pendiente. |
| FS-16 | Frontera PII y saneamiento de URL para tags | PARTIAL | `events.ts:18-34,56`; `acquisition.ts:7-61` | Mapper local sin contacto; user_data crudo en array compartido; sin control comprobado de tags/auto-capture/page_location. Ampliación de destinos BLOCKED hasta resolver. |
| FS-17 | QA local automatizado | IMPLEMENTED | 31 tests PASS actuales; ver foundation | Tests unitarios/VM; no acreditan backend real, navegación browser, tags ni Network. |
| FS-18 | Readiness público / operación y privacidad | BLOCKED | `next.config.ts`, `api/leads/route.ts:11`, H-04/H-05/H-10; PR-*/D-* | Receptor solo local, privacidad/ruta y contacto operativo pendientes, sin rate limit durable/CSP específica. Release fuera de esta solicitud. |

## Registro de riesgos

| ID / prioridad | Hallazgo y evidencia | Impacto / siguiente acción propuesta |
| --- | --- | --- |
| R-01 / Alta | `generate_lead.user_data` incluye contacto; dataLayer y GTM comparten documento (`events.ts:18,56`; `gtm.ts:21`). El mapper es solo referencia. | Cualquier tag/script podría leer contacto, incluso histórico. Resolver frontera y auditar contenedor antes de probar nuevos destinos/contacto. No hay exfiltración observada en esta auditoría. |
| R-02 / Alta | Sin CMP/default/update ni revalidación de consentimiento en track/get/API (`runtime.ts`, `contract.ts`). | Excepción QA no permite activar producción ni CAPI. Especificar H-07/H-08 y denegar exportación ante contexto inválido; no inventar snapshots. |
| R-03 / Alta | Saneamiento acquisition no configura page_location/page_referrer de tag automático. | Query PII/click IDs podrían salir por tags remotos. Verificar todos los requests iniciales y SPA, no solo pushes/mapper. |
| R-04 / Alta | No export GTM, acciones Ads, mapping Meta ni ownership de conversión acreditados. | Firing duplicado o lead contado por web + import GA4 + API. Definir un origen por acción y validar configuración real, incluido auto form measurement. |
| R-05 / Alta | Recepción no tiene outbox/dispatcher ni event_id por destino. | Accepted no garantiza delivery; retries futuros pueden perder/duplicar conversiones. Diseñar durable event + estado por destino + reconciliación, sin segundo lead. |
| R-06 / Media | Sets por documento, UUID/payload por instancia; se pierden en reload/remount real (`LeadForm.tsx:27-34`, `runtime.ts:85`). | Dedupe local no es dedupe entre documentos ni Meta. Documentar límite; no persistir PII en navegador para resolverlo. |
| R-07 / Media | Set reserva form_start/lead antes de push (`runtime.ts:32-37`). Push fallido no libera reserva. | Puede faltar evento y no se reintenta dentro del documento; es protección contra reentrancia, no entrega garantizada. Mantener captación independiente y reconciliar pérdidas; no fabricar eventos posteriores. |
| R-08 / Media | NamedRange+fila dependen de integridad manual; lectura completa A:AJ en cada persistencia. | Borrado/edición o backup incompleto comprometen replay; cuotas/escala no probadas. Definir retención conjunta y backup/restore, no dedupe por email. |
| R-09 / Media | Adquisición primera por documento/referrer QA; sin msclkid/fbclid/fbp/fbc ni TTL. | Cobertura multicanal limitada. Determinar señales necesarias por destino; Clarity no implica Microsoft Ads. No recopilar todas por anticipado. |
| R-10 / Media | Fuentes mezclan bloques históricos (manual pageview, request_id, PostgreSQL, beforeInteractive) y cambios actuales. | Riesgo de reimplementar contratos sustituidos. Seguir adopciones explícitas y reconciliar documentación por criterio, sin elegir solo por fecha. |
| R-11 / Alta para Clarity | Replay/autocapture excluidos; masking/consentimiento no definidos. | Captura de interacción/DOM/formulario requiere decisión nueva y QA de datos realmente transmitidos. No tratarlo como instalación neutra. |
| R-12 / Alta para lanzamiento | Sin privacidad final/ruta, protección pública ni operación productiva probada. | No publicar ni retirar gates para hacer funcionar plataformas. Cerrar PR-*/D-* y dependencias operativas por separado. |

## Decisiones y dependencias

| ID / clase | Responsable propuesto | Condición de cierre / qué bloquea |
| --- | --- | --- |
| H-07 / DECISION NEEDED | José + responsable de privacidad | Adoptar mecanismo, textos, finalidades/categorías, versiones/vigencia y snapshot. Bloquea medición productiva y contexto publicitario. |
| H-08 / DECISION NEEDED | José + ingeniería/privacidad | Adoptar revocación/pings o recarga y tratamiento de formulario activo; probarlo. Bloquea activación consentida. |
| H-09 / BLOCKER parcial | José / propietario GTM-GA4 | ID GTM ya recibido, no se vuelve a pedir; falta export/config QA, permisos, propiedad/Google tag real, ready y evidencias. Bloquea validación externa. |
| H-04/H-05/H-10 / BLOCKER lanzamiento | José + operación/privacidad | Dominio/contacto/política, receptor productivo, retención/borrado/backups; plazos no inferidos del documento histórico. |
| FS-D01 / DECISION NEEDED | José + ingeniería/privacidad | Resolver user_data QA coexistiendo con loader; adoptar frontera antes de ampliar tags. Bloquea próximo código dependiente y pruebas externas con contacto. |
| FS-D02 / FUTURE | José + responsables de campañas | Adoptar alcance Ads/Meta, evento por hecho, acciones/origen primario/secundario, match y consentimiento. Bloquea implementaciones publicitarias; sin atribuir valor a inversión mensual. |
| FS-D03 / DECISION NEEDED | José + privacidad | Autorizar o mantener excluido Clarity; finalidad, masking, categorías, retención y exclusiones. Mantener BLOCKED mientras no exista adopción. |
| FS-D04 / DECISION NEEDED | Ingeniería + José/operación | Contrato de entrega durable, almacenamiento aprobado, scheduler, retries, retención y responsable. No elegir nueva DB/sGTM automáticamente. |
| FS-A01 / SAFE ASSUMPTION | Auditoría | Reutilizar contratos/IDs actuales; medir ausencia en src separada de remoto desconocido. No implica permiso de implementación. |

## Plan propuesto, sin implementación en esta entrega

Los IDs FS-AC siguientes son criterios propuestos, todos NOT VALIDATED; deben adoptarse y vincularse a acceptance/validation-report antes de ejecutar el incremento correspondiente. No cambian decisiones de producto. Ninguna fase exige añadir campos, rutas comerciales, precios, UX o copy no aprobados.

| Incremento | Dependencias y entregable | Criterios y pruebas de aceptación propuestos |
| --- | --- | --- |
| I-1 — Frontera y contrato de consentimiento (recomendado) | Cerrar FS-D01 y H-07/H-08; reconciliar decisiones y criterios afectados. Diseñar control por finalidad y aislamiento de datos, preservando captación/eventos. | FS-AC01: catálogo actual preservado; ninguna PII fuera de canal privado permitido; rechazo inicial no carga destinos. FS-AC02: aceptar/revocar/reaceptar, sin replay anterior ni pérdida de formulario; decidir y comprobar pings. FS-AC03: backend elimina IDs/contexto no permitido; cambio de permiso durante get no conserva IDs. Tests locales con transporte interceptado, tiempo controlado y marcadores sintéticos en dataLayer/Network/storage/logs; timeout<=500ms, lead no depende de analytics. Relación M-01/07/08/09, CO-01..07, PR-02. |
| I-2 — GTM + GA4 en QA aislado | I-1 + H-09 y autorización explícita de pruebas externas sintéticas. Export/versionado de contenedor, mapping allowlisted, callback ready real, URL/referrer saneados antes de primer hit. | FS-AC04: un contenedor y una config, sin segundo gtag.js; cuatro ubicaciones CTA y Continuar correctos. FS-AC05: una page_view por pathname, cero por hash/render/remount; mecanismo automático aprobado, sin manual paralelo. `/privacidad` requiere su implementación autorizada. FS-AC06: invalid→sin POST/lead; retry→form_submit retry; accepted→un generate_lead. Tag Assistant + Network completo + DebugView, sin user_data en GA4; bloqueo de tag no impide captación. No habilitar auto captura de datos de formulario. Relación M-02..09, E-06. |
| I-3 — Base durable server-side | Ampliación aprobada FS-D02/04, consentimiento y operación definidos; diseño compatible con Sheets adoptado o cambio de almacenamiento explícito. | FS-AC07: evento durable del hecho confirmado, timestamp real, ID estable, intento/estado por destino; no recrear lead/evento al retry. Crash entre persistencia y dispatch, timeout tras recepción remota, concurrencia multiworker, duplicado y 4xx/429/5xx simulados; política de backoff/terminal/reconciliación adoptada, secretos server-only, evidencia sin contacto. Fallo del destino no invalida accepted. Pruebas locales antes de proveedores; integración real posterior separada. |
| I-4 — Google Ads | I-2/3 según origen elegido, acciones QA/cuentas/consentimiento aprobados. Elegir web/importación/API según contrato y documentación oficial vigente al implementarlo. | FS-AC08: un origen de conversión por acción y hecho; sin doble conteo GA4+web+offline; IDs ausentes no se fabrican. Si Enhanced Conversions se aprueba, normalización/hash solo en frontera autorizada, nunca GA4/logs. Pruebas de mapping, elegibilidad, revocación, diagnóstico y reconciliación de errores reales; HTTP 2xx solo no acredita atribución. |
| I-5 — Meta Pixel + CAPI | FS-D02 + I-1/3, cuenta/dataset y contrato oficial revisado al implementar. Sin asumir endpoint/versión/ventanas actuales por memoria. | FS-AC09: browser/server comparten event_name/event_id del mismo hecho, estables en retries; submission_id, lead_id y evento publicitario tienen roles documentados. Timeout/replay/doble click no producen otro hecho; dedupe comprobada en entorno de prueba Meta. IDs/match solo con fuente permitida; ausencia/denegación/revocación bloquean uso; tokens privados y sin libre texto. Reconciliar aceptados, rechazados y pendientes por destino. |
| I-6 — Clarity, solo si se adopta | FS-D03 resuelto, privacidad/consentimiento y exclusiones implementados. No requisito para cerrar GA4 ni CAPI. | FS-AC10: inspección DOM/Network/storage de sesión sintética verifica masking de inputs, errores, confirmación, URLs y eventos; sin identify con email/teléfono. Carga única SPA, rechazo/revocación conforme política, teclado y captación intactos; medir impacto laboratorio antes/después. Sin cierre por screenshot o script 200 únicamente. |
| I-7 — Operación y lanzamiento | H-04/05/10, PR-*/D-* cerrados, rutas reales, permisos productivos y solicitud de publicación independiente. | FS-AC11: separación QA/producción, secretos, protección pública, backup+restore con marcadores, retención/borrado operativo, kill switch y responsable de fallos. Reconciliar conteos por entorno/fecha/permiso; explicar pérdidas browser sin fabricar conversiones. Smoke real solo tras autorización; performance campo permanece NOT VALIDATED hasta datos suficientes. |

No incorporar GA4 MP para duplicar generate_lead browser. No elegir revenue/moneda, etapas cualificadas/venta, IP/UA/geografía ni persistencia entre reloads por conveniencia técnica. Los requisitos de versiones/APIs/políticas de proveedores se revisarán en documentación oficial cuando se autorice su acceso; no hubo consulta externa en esta auditoría.

## Implemented

Únicamente `foundation.md` y este informe: inventario, matriz, riesgos y plan. Sin implementación funcional, cambios de flags, plataformas, commits ni publicación. Se preservan cambios previos del working tree.

## Validated

- AUD-UNIT-01 PASS: 31/31 pruebas existentes, Node 22.17.0/PowerShell local, comando y distribución en foundation. Alcance funciones puras, VM y mocks, sin servicios externos.
- AUD-SOURCE-01 PASS: contraste estático de eventos, emitters, contrato HTTP, idempotencia, adquisición, loaders y callers de mapper/readiness. Ausencia limitada a archivos inspeccionados; configuración remota desconocida.
- AUD-SNAPSHOT-01 PASS como verificación de divergencia: 4/7 fuentes coinciden con snapshot y 3 difieren; no se convierte esto en aprobación del contenido nuevo. Hashes registrados en foundation.
- AUD-SCOPE-01 PASS: comparación SHA-256 antes/después de redactar los informes sobre 296 archivos preexistentes rastreados/no ignorados: cero modificados y cero eliminados. Solo se añaden los dos informes solicitados; no se leyeron valores de archivos de entorno privados ni credenciales.
- Los intentos auxiliares iniciales de búsqueda con glob PowerShell y de cálculo de hashes dieron error de sintaxis; corregidos usando glob de rg y colección antes de pipe. No fueron fallos funcionales ni pruebas de producto; no alteraron archivos.

## Not Validated

M-02/M-03/M-08/M-09/M-12 extremo a extremo, CO-*, PR-* globales y D-* de lanzamiento siguen NOT VALIDATED aquí. Tampoco se reejecutan API/Sheets real, concurrencia real, UI/teclado/responsive, build/lint/typecheck, Network/Tag Assistant/DebugView, Ads/Meta/Clarity ni pruebas de campo. Evidencias históricas se identifican como tales en foundation. FS-AC01..11 son futuras, no PASS. Auditoría estática y unitarios no equivalen a QA de plataformas ni a cumplimiento legal.

## Pending

José y responsables propuestos: cerrar H-07/08/09 y FS-D01 antes del siguiente código dependiente. FS-D02/03/04 condicionan ampliaciones Ads/Meta/Clarity/delivery; H-04/05/10 y PR-*/D-* condicionan lanzamiento. Se pueden preparar documentación y casos locales independientes sin configurar destinos, una vez autorizado ese incremento.

## Known Issues

R-01..12 registran exposición potencial, consentimiento faltante, duplicación/pérdida de delivery, límites de identidad/persistencia y contradicciones históricas. No se ejecutó ninguna prueba funcional con resultado FAIL en esta auditoría: 31 unitarios PASS. Advertencias Node experimentales/type-less persisten. No se afirma ausencia universal de PII, tags remotos, fallos o problemas productivos.
