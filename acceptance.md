# Acceptance Criteria

## Cierre documental Web Measurement — 25/10/2026

**LOCAL / QA MEASUREMENT: VALIDATED**. WM-* de arquitectura/eventos/accepted/dedupe, GTM/GA4 QA/page_view automático, ACQ-* de UTMs dinámicas/click IDs/Sheets e ID-* de identidad/bridge/snapshot/retry/Sheets documentados según tabla final de validation-report.md. Confirmación manual de José complementa pruebas previas y cierra pendiente de fuente real/lead real QA; no nueva ejecución del agente. Evidencia WM-QA-FINAL-2026-10-25 (docs/evidence/acquisition/manual-final-qa-2026-10-25.json). No altera criterios de consentimiento/privacidad/producción ni acredita subcasos no reportados (pathname/hash, dimensiones/key events, etc.). Meta/Consent/CMP/producción/offline/Ads offline/Enhanced Conversions/CAPI/MP/tráfico productivo NOT VALIDATED/DEFERRED. Query antes de hash; query en fragmento no soportada. Detalles históricos siguientes conservados.

## GA identity GTM — 25/10/2026

ID-01 historia previa y último par válido; ID-02 actualizaciones posteriores sin polling ni romper push GTM; ID-03 validación client/session y rechazo templates/ausentes; ID-04 nuevo POST válido contiene IDs privados y Sheets los persiste en columnas existentes; ID-05 retry/timeout/replay byte-idénticos y evento posterior sin modificar snapshot; ID-06 ausencia no bloquea recepción; ID-07 evento técnico/IDs aislados de eventos/custom params GA4 y Network; ID-08 tests/typecheck/lint/build PASS. Evidencia saneada docs/evidence/identity y docs/identity-review.md; no acredita producción/consentimiento ni convierte validación aportada por José en observación propia.

## Actualización de seguridad — 23/10/2026

SEC-UP-01: versión instalada y lockfile exactamente Next.js16.4.3 según CLI security, política security y manager conservados. SEC-UP-02: typecheck/lint/build y tests existentes PASS tanto en baseline aislada como checkout actual; no cambiar tests para ocultar fallos. SEC-UP-03: servidor local actualizado responde, formulario/gates/contratos conservados; integración externa/producción no acreditadas por este cambio. Evidencia en docs/evidence/next-security y next-security-review.md.

## CTA Step1 y teléfono — 21/10/2026

PHONE-01: selector países por metadata fijada, CL por defecto y +56 listo sin form_start por render; Chile9dígitos, otros países con longitud propia. PHONE-02: typing/paste/longitud inválida rechazada, sin truncar silenciosamente; país diferente cambia prefijo/límite y no infiere dirección. Validación internacional compartida; compatibilidad de teléfonos sin prefijo QA anteriores preservada. PHONE-03: país solo UI, phone privado, no PII en CTA ni nueva columna. CTA-F1-01: click_to_action con continue_diagnosis/form_step_1/diagnosis_step_2 solo avance válido; error no CTA y paso no submit/lead; mouse/Enter y dobleclick sin duplicación. Fuente decisions.md; evidencia docs/evidence/form-phone y form-phone-review.md. No PASS global GA4/Consent/lanzamiento.

Corrección React/HMR GTM21/10: GTM-H-01 requiere HEAD en DOM hidratado y conservación tras Fast Refresh/remount, sin renderizar scripts ejecutables en JSX. Instalación via efecto DOM, return null; bootstrap externo/local único. Script JSX SSR anterior=FAIL en HMR; browser-head-effect.json acredita corrección (HEAD, mismo documento, un recurso/start, consola sin error). HTTP no sustituye DOM hidratado. Sin cambio de gates/lanzamiento.

Corrección GTM HEAD21/10: GTM-H-01 exige etiquetas script reales en HEAD para bootstrap inline y loader externo; no basta ID serializado por Next. Caso previo BODY=FAIL aportado por José, corregido a script nativo + document.head.appendChild. Browser-native-head.json acredita parents HEAD, conteo1/1, un gtm.js/dataLayer y HTTP200 sin aviso. No PASS global de GA4/PII/Consent.

## GTM head local/QA — 21/10/2026

GTM-H-01: contenedor real proporcionado en bootstrap único de head local200; gates inválidos/producción no renderizan loader; prueba VM mantiene array y una carga/start tras ejecuciones repetidas. GTM-H-02: gtm.js público200 no equivale a ejecución o firing. GTM-H-03: Tag Assistant, destinos/GA4/PII, consentimiento y producción NOT VALIDATED. Fuente/autorización: docs/decisions.md; evidencia docs/evidence/gtm-head y revisión docs/gtm-head-review.md. No PASS global M-02 ni cierre H-09.

## Web Measurement local/QA — 20/10/2026

Decisiones explícitas en docs/decisions.md y contrato en docs/web-measurement-review.md sustituyen propuestas contradictorias sin borrar pruebas históricas. En particular M-03/site_page_view/manual/send_page_view=false queda obsoleto; page_view será automático y NOT VALIDATED hasta Google Tag real. M-01/M-07 ya no requieren measurement_version; page_type=home; PR-02 admite excepción restringida user_data local/QA sin enviarlo a GA4, pero company_name/problem_to_solve/contacto fuera de esa estructura siguen prohibidos. M-09 admite contrato GA opcional/500ms con fuente real aún NOT VALIDATED. CO-* no se cierran ni inventan estados. Los criterios globales de lanzamiento no pasan por esta fase.

| ID | Criterio incremental | Método / límite |
| --- | --- | --- |
| WM-01 | dataLayer único, contrato runtime+tipos allowlisted, flag local; sin eventos de página manuales ni measurement_version | Tests y código; producción deshabilitada aun con flagQA |
| WM-02 | CTA mouse/teclado/dobleclick una emisión; solo ubicaciones existentes | Navegador desktop/móvil emulado; no barra nueva |
| WM-03 | form_start único edición/fallback, no foco/pasos/error/retry/remount no significativo | Tests + recorrido local; dedupe documento actual |
| WM-04 | form_error catálogos nuevos sin valores; Continuar inválido no POST | Tests schema y navegador;422/503 mock se declaran |
| WM-05 | form_submit inicial/retry solo POST válido, doble submit una petición activa | Navegador/Network; UI preservada |
| WM-06 | accepted estricto solo confirmado, pérdida de respuesta no lead, retry confirma una vez | Proveedor Sheets real + fallo de respuesta inducido y tests de duplicados |
| WM-07 | user_data restringido cuatro campos; GA4 mapper solo allowlist; sin empresa/problema/logging de contacto | Payloads sintéticos y mapper local; GTM externo NOT VALIDATED |
| WM-08 | GA get ready real o ausencia inmediata;500ms total; contexto congelado/replay sin cambio | Tests mock y contrato; IDs Google reales NOT VALIDATED |
| WM-09 | Bloqueo/fallo de analytics no rompe recepción, idempotencia/Acquisition preservadas | Fallo inducido y recepción real; suite baseline |
| WM-10 | Checks/secretos/bundle y producción sin bootstrap/eventos | tests/typecheck/lint/build + inspección output; no despliegue |

Resultados/evidencia: docs/validation-report.md. H-07/H-08/H-09 y lanzamiento abiertos.

Corrección20/10 valores dinámicos: ACQ-01/03/04/05/06/09/10 revalidados con valores creados en runtime; pruebas de límites/PII en acquisition-dynamic-values-review.md y validation-report.md. No catálogo cerrado de valores UTM/click IDs. ACQ-07 conserva evidencia previa y prueba unitaria de snapshot, sin reejecución UI en esta corrección. Consent/CMP y persistencia entre reloads pendientes.

## Alcance incremental Acquisition QA — 20/10/2026

ACQ-01..ACQ-10 y evidencia en [docs/acquisition-review.md](docs/acquisition-review.md): captura URL sintética → memoria del documento → lead Sheets, bajo excepción local explícita en decisions.md. PASS limitado a los casos allí ejecutados. M-09/M-10, CO-* y criterios de producción siguientes no se cierran por esta excepción. Sin CMP/GA/Meta reales ni retención entre documentos adoptada.

Proyecto: AnalyticsXXXXX · José Cubillo. Revisión de handoff: 10 de octubre de 2026. Stack base, diagrama y form_start confirmados en `docs/decisions.md`; otros pendientes mantienen su estado.

Esta es la matriz de pruebas del MVP definido por las fuentes de `docs/`. No aprueba propuestas ni modifica producto, copy o diseño. Leer primero `docs/handoff-review.md`; resolver la decisión vinculada antes de ejecutar la parte afectada. H-16 a H-20 documentan interpretaciones limitadas; el resto de vacíos no se rellena por código.

**Estado inicial de todas las pruebas: NOT VALIDATED.** No existe implementación evaluada en esta entrega. Las filas son criterios futuros, no resultados.

Estados únicos: **PASS** = prueba ejecutada con resultado esperado y evidencia; **FAIL** = prueba ejecutada con resultado distinto; **NOT VALIDATED** = no ejecutada, dependencia/decisión ausente o evidencia insuficiente. No sustituir con “debería funcionar”. Un mock no valida un proveedor real; el alcance de evidencia debe declararse.

Registrar por ID: `Estado | commit | entorno/URL | navegador/dispositivo | fecha | método/comando | resultado observado | evidencia saneada | pendiente/responsable`. Mantener reporte en `docs/validation-report.md` cuando se implemente. Para listas de casos, PASS requiere probar todos; desglosar subcasos si hay resultados distintos.

**Puertas:** Implementación requiere fuentes adoptadas y decisiones aplicables cerradas. Release requiere PASS en criterios Release y en criterios Medición si se activa tracking. Los de campo requieren muestra real; la ausencia de campo en un lanzamiento nuevo se reporta NOT VALIDATED y no se sustituye con laboratorio. Captación sin medición solo se acepta como alcance explícito documentado: criterios Medición permanecen NOT VALIDATED, no PASS. Los requisitos generales de privacidad, CMP/UI y formulario siguen vigentes según flujo realmente habilitado. No retirar requisitos pendientes para obtener una matriz verde.

Referencias por dominio: strategy→negocio; product/wireframe→rutas/interacción; content→texto; design→presentación; technical→backend/stack; measurement→eventos/consentimiento. Este documento define verificaciones. Ante contradicción entre fuentes, registrar conflicto y detener únicamente esa parte; no elegir por fecha.

## Build

| ID | Criterio para PASS | Verificación mínima | Puerta | Estado |
| --- | --- | --- | --- | --- |
| B-01 | Las versiones de las siete fuentes están adoptadas y los pendientes que afectan el trabajo están cerrados en handoff-review.md. | Revisar decisiones con fecha/responsable; archivos presentes y hashes coincidentes con snapshot o cambio documentado. | Implementación | NOT VALIDATED |
| B-02 | Instalación reproducible con un gestor, lockfile versionado y versión Node compatible fijada. | Instalar desde checkout limpio con modo frozen/ci; registrar Node y comando. | Release | NOT VALIDATED |
| B-03 | Typecheck strict, lint, build de producción y pruebas críticas terminan con exit code 0. | Ejecutar scripts documentados y adjuntar salida saneada; no omitir checks para obtener verde. | Release | NOT VALIDATED |
| B-04 | Contenido prerenderizado y Client Components limitados a interactividad; stack coincide con technical adoptado. | Inspeccionar output/build y límites server/client; sin CMS/ORM/animación/estado global añadidos. | Release | NOT VALIDATED |
| B-05 | Secretos y módulos DB/email/jobs no llegan a bundle cliente; .env.example contiene solo valores vacíos/documentados. | Inspeccionar imports server-only, bundles y archivos versionados con credenciales sintéticas. | Release | NOT VALIDATED |
| B-06 | Consola no presenta errores no manejados ni warnings de hidratación durante todos los flujos. | Registrar Console al cargar ambas rutas y navegar/enviar/reintentar; explicar cualquier aviso externo. | Release | NOT VALIDATED |
| B-07 | No existen rutas, campos, promesas o componentes comerciales fuera del scope. | Comparar rutas/DOM/copy contra docs/product, wireframe y content completos. | Release | NOT VALIDATED |

## Responsive

| ID | Criterio para PASS | Verificación mínima | Puerta | Estado |
| --- | --- | --- | --- | --- |
| R-01 | Home y privacidad conservan todo el contenido y orden a 320, 375, 768, 1024, 1280 y 1440 CSS px. | Capturas con contenido real; explorar 767/768 y 1023/1024; sin recorte ni scroll horizontal. | Release | NOT VALIDATED |
| R-02 | Tokens, fuentes locales, jerarquía y tamaños coinciden con design; formulario permanece en una columna. | Inspección visual y estilos calculados; Inter 400–600, container/gutters y breakpoints correctos. | Release | NOT VALIDATED |
| R-03 | Zoom 200% y reflow equivalente a 320 px permiten lectura y operaciones sin scroll en dos ejes. | Prueba en navegador; títulos/labels/errores completos y campos accesibles. | Release | NOT VALIDATED |
| R-04 | Diagrama de cinco nodos Campaña→Lead→CRM→Oportunidad→Venta mantiene orden y texto equivalente en móvil; FAQ visible, sin carruseles/acordeones. | Comparar desktop/móvil y DOM con decisión H-12; no añadir ramas como decoración. | Release | NOT VALIDATED |
| R-05 | Barra móvil aparece al salir CTA hero por arriba y se oculta con menú, campo enfocado, formulario o éxito visible. | Scroll en ambos sentidos, menú, teclado real y éxito; comprobar safe area y footer no tapado. | Release | NOT VALIDATED |
| R-06 | Menú y envío funcionan en navegador móvil real, retrato y paisaje; controles táctiles ≥44×44 px. | Probar iOS Safari y Android Chrome o registrar explícitamente cada dispositivo no disponible. | Release | NOT VALIDATED |

## Navigation

| ID | Criterio para PASS | Verificación mínima | Puerta | Estado |
| --- | --- | --- | --- | --- |
| N-01 | Rutas `/`, `/privacidad` y 404 funcionan al abrir URL directamente; ruta inexistente devuelve HTTP 404. | Requests HTTP y navegador; 404 permite volver a home. | Release | NOT VALIDATED |
| N-02 | Anclas inicio/problema/solucion/agencias/proceso/experiencia/preguntas/diagnostico existen una vez y en orden. | Inspección DOM y links; títulos visibles tras navegación. | Release | NOT VALIDATED |
| N-03 | Header no fijo; Solución/Proceso/Experiencia y wordmark enlazan a destinos definidos. | Activación mouse/teclado y URL hash; sin links `#` vacíos. | Release | NOT VALIDATED |
| N-04 | Menú no modal expande en flujo; Escape/cierre vuelve a botón; seleccionar destino cierra y enfoca título. | Recorrido con Tab/Shift+Tab/Enter/Escape; aria-expanded/controls actualizados y sin focus trap. | Release | NOT VALIDATED |
| N-05 | Todos los enlaces internos/externos y soporte operativo resuelven; no destinos ficticios. | Inventario de href; verificar targets/rel y no habilitar mailto placeholder. | Release | NOT VALIDATED |
| N-06 | Consultar privacidad desde formulario conserva entradas en memoria de la pestaña original. | Editar, abrir enlace con aviso de pestaña nueva, volver y enviar; no almacenamiento de PII. | Release | NOT VALIDATED |

## CTA

| ID | Criterio para PASS | Verificación mínima | Puerta | Estado |
| --- | --- | --- | --- | --- |
| C-01 | Header, hero, solución, experiencia y barra móvil usan “Solicitar diagnóstico inicial” y llevan al único formulario. | Activar cada ubicación; no modales/calendarios/WhatsApp ni rutas alternativas. | Release | NOT VALIDATED |
| C-02 | CTA de navegación es enlace real; submit es botón; no duplicar CTA en tarjetas o bloques extra. | Inspección semántica y activaciones con teclado. | Release | NOT VALIDATED |
| C-03 | Cada activación consentida emite un click_to_action con ubicación correcta; submit no lo emite. | Interceptar track/dataLayer; mouse y Enter; solo un handler y sin trigger GTM paralelo. | Medición | NOT VALIDATED |

## Forms

| ID | Criterio para PASS | Verificación mínima | Puerta | Estado |
| --- | --- | --- | --- | --- |
| F-01 | Formulario diagnosis_request tiene cinco obligatorios y dos opcionales, tipos/opciones/orden/copy exactos. | Comparar docs/content y technical; email personal válido, no teléfono/adjuntos/captcha inicial. | Release | NOT VALIDATED |
| F-02 | Cliente y servidor comparten schema y límites adoptados; entradas vacías, límites y enums inválidos se rechazan. | Casos parametrizados y POST directo sin JS cliente; 422 sin eco de valores. | Release | NOT VALIDATED |
| F-03 | Dominio sin protocolo se normaliza a HTTPS; solo HTTP/HTTPS válido; no credenciales ni esquemas ejecutables. | Casos URL válidos/host inválido/javascript/data; verificar backend no fetch/resuelve sitio enviado. | Release | NOT VALIDATED |
| F-04 | Validación al submit y corrección tras primer error; resumen y foco al primer campo; sin doble UI nativa/inline. | Enviar vacío y corregir; mensajes aprobados, aria-invalid/describedby asociados. | Release | NOT VALIDATED |
| F-05 | Loading anuncia envío, bloquea peticiones simultáneas y usa copy aprobado sin salto innecesario. | Doble click/Enter con red lenta; un POST activo, ancho/feedback estables. | Release | NOT VALIDATED |
| F-06 | Éxito solo con accepted válido 201/200 y lead_id/accepted_at; no por cualquier 2xx. | Interceptar respuestas malformed/202/error; verificar no éxito ni generate_lead. | Release | NOT VALIDATED |
| F-07 | Transacción guarda lead y job; accepted_at/lead_id proceden del servidor; fallo de job revierte ambos. | Integración DB real QA y fallo inducido en job; contar registros y jobs por request_id. | Release | NOT VALIDATED |
| F-08 | Misma llave/payload, incluidos envíos concurrentes, devuelve un lead/job; contacto distinto da 409. | Test de concurrencia en DB; replay 200 conserva ID y contacto/contexto original, no reabre job. | Release | NOT VALIDATED |
| F-09 | Deduplicación no usa email/GA ID; solicitudes intencionales con nuevas llaves son registros diferentes. | Dos UUID con mismo email sintético; dos registros permitidos. | Release | NOT VALIDATED |
| F-10 | Éxito reemplaza formulario, elimina valores de memoria, anuncia recepción y enfoca confirmación. | Recorrido real y lector; barra oculta, sin promesas de reunión/plazo no aprobadas. | Release | NOT VALIDATED |
| F-11 | Sin JS hay contenido/anclas y soporte real con limitación visible; no botón de envío que aparente funcionar. | Desactivar JS; verificar HTML inicial y aviso noscript. No exigir POST sin JS en v1. | Release | NOT VALIDATED |

## Error Handling

| ID | Criterio para PASS | Verificación mínima | Puerta | Estado |
| --- | --- | --- | --- | --- |
| E-01 | 422/409/429/503 muestran mensaje aprobado, conservan entradas y no generan lead analítico. | E2E con respuestas simuladas y API QA; 429 respeta Retry-After y no retry en loop. | Release | NOT VALIDATED |
| E-02 | 413/403/415 se manejan como error de solicitud sin datos internos; API rechaza cuerpo/tipo/origin inválidos. | POST directo >límite, text/plain y Origin fuera allowlist; códigos previstos y no insert. | Release | NOT VALIDATED |
| E-03 | Timeout/pérdida de respuesta tras commit muestra uncertain; reintento mantiene request_id y payload. | Inducir commit y cortar respuesta; retry confirma mismo lead; no anunciar fracaso definitivo. | Release | NOT VALIDATED |
| E-04 | Intento incierto bloquea cambios comerciales mientras se verifica; límites tras recarga están documentados. | Intentar editar/retry/recargar; no nueva llave automática en timeout ni promesa de dedupe entre recargas. | Release | NOT VALIDATED |
| E-05 | Email caído no pierde lead confirmado; job durable reintenta bajo scheduler protegido. | Inducir fallo proveedor; comprobar lease/retries/final failed y revisión manual; sin segundo lead. | Release | NOT VALIDATED |
| E-06 | Bloqueo GA/GTM, IDs ausentes y fallo storage no impiden POST/confirmación. | Bloquear destinos y lanzar excepciones storage; IDs null, espera IDs ≤límite adoptado. | Release | NOT VALIDATED |
| E-07 | Errores/logs/respuestas están saneados y job endpoint rechaza acceso no autorizado. | Inspeccionar evidencia con datos sintéticos; no stack/SQL/secretos/contacto ni payload en logs. | Release | NOT VALIDATED |

## Accessibility

| ID | Criterio para PASS | Verificación mínima | Puerta | Estado |
| --- | --- | --- | --- | --- |
| A-01 | Un H1 por página, lang=es, landmarks, jerarquía semántica y skip link funcionan. | Inspección DOM y lector; salto lleva a main; orden DOM igual al visual. | Release | NOT VALIDATED |
| A-02 | Todo recorrido, incluido CMP y errores/retry/éxito, funciona con teclado sin tabindex positivo. | Tab/Shift+Tab/Enter/Space/Escape en home/privacidad; no trampas y foco visible/no oculto. | Release | NOT VALIDATED |
| A-03 | Labels persistentes, ayudas y errores asociados; estados se anuncian una vez y con sentido. | Lector de pantalla identificado; invalid/submitting/error/uncertain/success y menú/CMP. | Release | NOT VALIDATED |
| A-04 | Contraste real ≥4.5:1 texto normal, ≥3:1 grande/indicadores esenciales; estados no dependen de color. | Medir combinaciones utilizadas; incluir hover/error/focus/disabled y fondos suaves. | Release | NOT VALIDATED |
| A-05 | Targets ≥44×44, reduced motion y forced colors mantienen operaciones y foco. | Inspección dimensional y emulación/manual; no animación o smooth scroll con reduce. | Release | NOT VALIDATED |
| A-06 | Diagrama tiene equivalente textual y decorativos se ocultan del lector; imágenes autorizadas tienen alt adecuado. | Árbol de accesibilidad y revisión de relación conceptual adoptada. | Release | NOT VALIDATED |
| A-07 | Auditoría automatizada no deja violaciones sin resolver; revisión manual WCAG 2.2 AA queda documentada. | axe + teclado/lector/zoom; no afirmar certificación o cumplimiento completo solo por axe. | Release | NOT VALIDATED |

## SEO

| ID | Criterio para PASS | Verificación mínima | Puerta | Estado |
| --- | --- | --- | --- | --- |
| S-01 | Título/descripción por ruta, canonical absoluto y lang corresponden a contenido y dominio real. | Inspeccionar HTML SSR de rutas; canonical sin query/hash y sin dominio de ejemplo. | Release | NOT VALIDATED |
| S-02 | Contenido significativo existe en HTML inicial; robots/sitemap listan únicamente rutas públicas válidas. | HTTP sin JS; sitemap/robots producción, 404 y previews revisados. | Release | NOT VALIDATED |
| S-03 | Preview está protegido y no indexable; producción pública no hereda noindex accidentalmente. | Revisar auth y headers/meta robots por entorno; robots por sí solo no protege preview. | Release | NOT VALIDATED |
| S-04 | Open Graph usa metadata coherente y activo real autorizado acordado; no schema/reviews ficticios. | Abrir URL del activo y revisar meta; decisión H-15 cerrada; no asumir FAQ rich results. | Release | NOT VALIDATED |

## Performance

| ID | Criterio para PASS | Verificación mínima | Puerta | Estado |
| --- | --- | --- | --- | --- |
| P-01 | Pruebas de laboratorio reproducibles móvil/desktop, sin consentimiento y tras aceptar, registran entorno y resultados. | Build producción; al menos tres corridas por escenario con red/CPU/perfil documentados; reportar mediana y dispersión. | Release | NOT VALIDATED |
| P-02 | Objetivos campo p75 LCP≤2.5s, INP≤200ms, CLS≤0.1 se evalúan solo con datos de campo suficientes. | Registrar origen/ventana/muestra; sin datos→NOT VALIDATED. TBT/Lighthouse no acredita INP. | Campo | NOT VALIDATED |
| P-03 | Fuentes locales, dimensiones reservadas, contenido prerenderizado y scripts consentidos fuera del camino crítico. | Network/build; sin fuentes remotas, vídeo/librería de gráficos; medir shifts barra/éxito. | Release | NOT VALIDATED |
| P-04 | Se informa JS propio gzip contra presupuesto orientativo 100 KiB y total con runtime/vendors/GTM. | Analizar build y tráfico tras permiso; exceso requiere decisión registrada, no exclusión silenciosa. | Release | NOT VALIDATED |
| P-05 | Tags/espera IDs no retrasan recepción más allá del presupuesto adoptado; timeout y UX bajo red lenta operan. | Medir submit con SDK ready/no ready/bloqueado; registrar espera IDs separada del tiempo servidor. | Release | NOT VALIDATED |

## Analytics

| ID | Criterio para PASS | Verificación mínima | Puerta | Estado |
| --- | --- | --- | --- | --- |
| M-01 | Array.isArray(window.dataLayer) es true; inicialización única, track tipado y parámetros allowlisted. | Consola y pruebas schema; no reemplazar array tras cargar GTM; fallback no rompe UI. | Medición | NOT VALIDATED |
| M-02 | GTM carga una vez tras permiso; Google tag y eventos solo GTM, sin segunda config/gtag.js. | Network/Tag Assistant y código; callback ready probado en contenedor QA. | Medición | NOT VALIDATED |
| M-03 | Una page_view por pathname consentido; hash/render no duplica; site_page_view no llega como evento GA4. | Tag Assistant/DebugView y Network al aceptar/navegar; send_page_view=false y auto history/forms desactivados. | Medición | NOT VALIDATED |
| M-04 | form_start se emite una vez por instancia montada, no por reintento (H-13 cerrado); foco no emite, autofill/edit sí y fallback válido antes del primer submit. | Pruebas edición/foco/autofill/retry con conteos; no lectura de valores para analytics. | Medición | NOT VALIDATED |
| M-05 | Inválido emite solo resumen form_error, sin POST/form_submit/generate_lead; retry válido usa attempt_type=retry. | Casos cliente/servidor y varios campos; catálogos cerrados, un error por intento. | Medición | NOT VALIDATED |
| M-06 | generate_lead se emite una vez por lead_id en vida de página tras accepted; solo éste es key event del formulario. | Commit/timeout/replay/doble submit; verificar Set de memoria y configuración QA de key event. | Medición | NOT VALIDATED |
| M-07 | Eventos no aplicables no heredan parámetros previos; null se omite en transporte GA4. | Secuencia CTA→error→submit→lead; revisar pushes y mapping por evento en requests reales. | Medición | NOT VALIDATED |
| M-08 | URL/referrer se sanea antes de cualquier envío; query PII y click IDs no llegan a GA4. | URL sintética con email/teléfono/IDs y UTMs desconocidas; revisar config y todos los requests. | Medición | NOT VALIDATED |
| M-09 | GA IDs vienen de API gtag get tras permiso/ready, timeout a null; no parsing de cookie ni ID fabricado. | Pruebas callback, bloqueador y revocación durante espera; client/session IDs solo backend privado. | Medición | NOT VALIDATED |
| M-10 | Adquisición first/last/submission es atómica, consentida, sin mezcla; direct no pisa non-direct; vencidos se purgan. | Tests taxonomy, campaign/referral/direct, TTL adoptado, storage fallido; validación servidor. | Medición | NOT VALIDATED |
| M-11 | No service_view/faq_interaction/scroll automático ni píxeles/CAPI/MP/offline/BQ instalados en v1. | Revisar scripts, tags, env y Network; Ads denied, CRM false sin integración. | Release | NOT VALIDATED |
| M-12 | DB vs leads GA4 se reconcilia por entorno/fecha/permiso y diferencias se explican sin fabricar eventos. | Consulta de datos sintéticos y DebugView; pruebas GA4 no confirman ingestión producción. | Medición | NOT VALIDATED |

## Consent

| ID | Criterio para PASS | Verificación mínima | Puerta | Estado |
| --- | --- | --- | --- | --- |
| CO-01 | Sin decidir y al rechazar inicialmente no hay requests GTM/GA/pixels ni adquisición persistida; formulario opera. | Contexto limpio y Network; comparar cookies/storage antes/después y enviar lead sin permiso. | Medición | NOT VALIDATED |
| CO-02 | Defaults denied preceden a tags; aceptar analytics carga página actual y ads quedan denied. | Tag Assistant/Network; una pageview y ningún replay de acciones/páginas previas. | Medición | NOT VALIDATED |
| CO-03 | Rechazar es tan accesible como aceptar; footer permite cambiar; preferencias válidas versionadas expiran según decisión. | Teclado/lector, reload, vencimiento y cambio de versión; solo necesarios+analytics en v1. | Release | NOT VALIDATED |
| CO-04 | Revocar bloquea nuevos eventos de aplicación, limpia stores/cookies propios definidos y elimina contexto analítico futuro. | Aceptar→revocar→click/submit; revisar update denied, storage y backend; sin replay al reaceptar. | Medición | NOT VALIDATED |
| CO-05 | Comportamiento de pings tras revocación y recarga coincide con decisión H-08 sin perder formulario activo. | Network de tag ya cargado y escenarios edited/submitting/uncertain; no inferir cero requests al quitar script. | Medición | NOT VALIDATED |
| CO-06 | Backend descarta contexto con snapshot inválido/denied y permiso cambiado durante lectura IDs. | POST sintéticos con IDs/contexto no permitido; registro lead conservado, contexto eliminado. | Release | NOT VALIDATED |
| CO-07 | Aceptar después de éxito no reenvía generate_lead ni recupera adquisición previa. | Enviar sin permiso→éxito→aceptar; cero lead retrospectivo, pageview actual solamente. | Medición | NOT VALIDATED |

## Privacy

| ID | Criterio para PASS | Verificación mínima | Puerta | Estado |
| --- | --- | --- | --- | --- |
| PR-01 | Política final y aviso del formulario corresponden a responsable/contacto/proveedores/finalidades reales. | Cerrar H-04/H-05; comparar datos guardados, cookies y destinatarios con texto fechado/versionado. | Release | NOT VALIDATED |
| PR-02 | PII, textos/URLs del formulario, hashes contacto y secretos no salen en dataLayer/GA4/logs/URL/storage navegador. | Datos sintéticos únicos y búsqueda en pushes, Network, logs y storage; no prueba solo por regex. | Release | NOT VALIDATED |
| PR-03 | DB leads/jobs/historial es privada con RLS y sin acceso público; backend mantiene service role fuera cliente. | Probar acceso anon/auth no autorizado en QA y revisar políticas/secretos; no enlaces públicos a registros. | Release | NOT VALIDATED |
| PR-04 | Retención, borrado y backups adoptados tienen operación probada, no solo texto de política. | Ejecutar borrado sintético y revisión backups/logs/context TTL; registrar responsable y frecuencia. | Release | NOT VALIDATED |
| PR-05 | API verifica origin/schema/body/type; rate limit durable y antispam no provocan éxito falso. | Casos spoof/abuso en QA; fuente IP confiable, HMAC temporal y expiración adoptada. | Release | NOT VALIDATED |
| PR-06 | HTTPS/headers/CSP efectiva son compatibles con Next y destinos reales sin comodines globales/unsafe-eval. | Inspección response headers y navegación/formulario; revisar política aplicada y justificar excepciones. | Release | NOT VALIDATED |
| PR-07 | No session replay/autocapture/auto user-provided data ni automatización AI de solicitudes. | Inspeccionar app/GTM/proveedores; ninguna extracción de formulario hacia herramientas extra. | Release | NOT VALIDATED |

## Deployment

| ID | Criterio para PASS | Verificación mínima | Puerta | Estado |
| --- | --- | --- | --- | --- |
| D-01 | Entornos, DB, secretos, GTM/GA y email QA/producción están separados; preview no recibe leads reales. | Revisar configuración sin exponer valores; enviar fixture QA y verificar destino/ausencia en producción. | Release | NOT VALIDATED |
| D-02 | Dominio HTTPS, planes/regiones, proveedor email, remitente y soporte están operativos. | Cerrar H-03/H-04/H-06; prueba aviso recibido y bandeja privada accesible al responsable. | Release | NOT VALIDATED |
| D-03 | CI ejecuta instalación/typecheck/lint/build/tests; migraciones preceden release y son compatibles con rollback. | Run CI y staging; registrar release SHA, migration IDs y evidencia. | Release | NOT VALIDATED |
| D-04 | Scheduler autenticado procesa jobs con lease, recupera vencidos y respeta reintentos configurados. | QA concurrente/worker interrumpido/proveedor caído; ningún job perdido, operación failed visible. | Release | NOT VALIDATED |
| D-05 | Tras publicar se prueba carga, navegación, privacidad, lead persistido/aviso, errores y consentimiento en URL final. | Smoke test identificado como prueba, sin PII terceros ni conversiones Ads; registrar limpieza de fixture. | Release | NOT VALIDATED |
| D-06 | Rollback app y backup/restore DB se ensayan y existe procedimiento de recuperación compatible con retención. | Staging: volver release y restaurar backup de prueba; no destruir producción para comprobarlo. | Release | NOT VALIDATED |
| D-07 | Release no contiene placeholders públicos, bloqueos abiertos ni criterios requeridos FAIL/NOT VALIDATED. | Revisar matriz y decisiones; excepciones de alcance explícitas sin convertir NV en PASS. | Release | NOT VALIDATED |
| D-08 | Completion Report usa cinco secciones, IDs/estado/evidencia y límites de validación. | Revisar informe: Implemented, Validated, Not Validated, Pending, Known Issues; no “todo funciona” sin pruebas. | Release | NOT VALIDATED |


## Archivo GTM para GA4 — 21/10/2026

Alcance adoptado en docs/decisions.md: artefacto local, sin publicar. GTM-J-01 PASS estructura/referencias/allowlists; GTM-J-02 PASS funciones URL/referrer y form_id opcional en VM sintética; GTM-J-03 PASS original intacto, destino preservado, sin page_view manual, automatismos de formularios/contacto desactivados en JSON. GTM-J-04 importación UI, GTM-J-05 Preview/Network/GA4, GTM-J-06 page_view inicial/SPA/saneamiento previo y GTM-J-07 Consent/producción: NOT VALIDATED. No cierra M-02/M-03/M-07/M-08/PR-07 globales ni H-09. Evidencia: deliverables/gtm/validation.json; revisión: deliverables/gtm/README.md; reporte: docs/validation-report.md.
