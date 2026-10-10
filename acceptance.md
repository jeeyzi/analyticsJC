# Acceptance Criteria

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

