# Handoff Consistency Review

Proyecto: AnalyticsXXXXX. Revisión de decisiones: 10 de octubre de 2026, America/Santiago.
Estado: stack base, diagrama y frecuencia de form_start confirmados; restantes decisiones pendientes. No declarar repositorio listo para implementación completa ni producción.

Decisiones vigentes y alcance: `decisions.md`. H-12 y H-13 cerrados documentalmente el 10/10/2026; H-03 parcialmente cerrado. Ningún criterio funcional pasó a PASS.

## Fuentes revisadas

Se leyeron completas las versiones actuales de los siete archivos. Las copias de `docs/` preservan su contenido textual recuperado; no son versiones reescritas ni aprobaciones nuevas. Identificadores permiten resolver sus originales; los hashes en `source-manifest.json` fijan estas copias para el handoff.

| Documento | Referencia original | Papel / estado observado |
| --- | --- | --- |
| strategy.md | libfile_998ab71a1d788191ad3a0fa9181ff71b | Estrategia con decisiones confirmadas, hipótesis y pendientes |
| product.md | libfile_ce731fe1f4988191a30115b56437d92a | Especificación UX propuesta v1 |
| wireframe.md | libfile_e673b2a46e08819181064c3b40294a4b | Wireframe conceptual propuesto, sin mockup visual aprobado |
| content.md | libfile_5ba63d19b17481919e1c93f5292226ac | Copy completo con email provisional y privacidad incompleta |
| design.md | libfile_618185221b7c8191b16eb64883f7c355 | Propuesta visual v1; explícitamente no implica aprobación |
| technical.md | libfile_1571d94366688191bbfca2b8a8752d2a | Stack y contratos propuestos; no stack previamente aprobado |
| measurement.md | libfile_fb26d2aaed5c819183e6168d2c945db8 | Contrato propuesto; naming, límites y retenciones pendientes de adopción |

## Consistencia confirmada

Las fuentes coinciden en ICP de generación de leads con CRM, problema campañas→resultados comerciales, agencias como audiencia secundaria, José Cubillo como identidad provisional y diagnóstico inicial como única acción comercial. No hay garantía de ahorro ni auditoría completa incluida en el primer contacto.

Coinciden en `/`, `/privacidad`, 404, ocho anclas, header estático, FAQ visible, formulario de cinco campos obligatorios y dos opcionales, éxito inline y recepción persistente como conversión. El backend propuesto añade idempotencia y outbox durable sin redefinir la oferta. La medición consentida observa el lead; la base privada conserva la verdad operativa. CRM y publicidad offline son extensiones futuras, aunque su conexión sea parte de las capacidades comerciales ofrecidas.

## Clasificación y puertas

- **BLOCKER**: impide iniciar una parte concreta o aceptar/lanzar esa parte; indicar cuál. No detiene trabajo independiente.
- **DECISION NEEDED**: opciones o propuesta sin adopción explícita. Registrar decisión en su fuente antes de implementar la parte afectada.
- **SAFE ASSUMPTION**: interpretación limitada sustentada por las fuentes; se declara aquí, puede corregirse y no cambia el negocio.
- **FUTURE**: fuera del MVP; no implementar ahora.

Cada pendiente se cierra con responsable, decisión, fecha y referencia a la fuente actualizada. Un PASS técnico no cierra una decisión comercial. La confirmación explícita del 10/10/2026 adopta únicamente las decisiones enumeradas en decisions.md. No inferir aprobación del resto por tener un archivo generado.

## Registro de vacíos y conflictos

| ID | Clase | Hallazgo / evidencia | Parte afectada y resolución necesaria |
| --- | --- | --- | --- |
| H-01 | BLOCKER | No se proporcionó un repositorio destino. Las fuentes existen como documentos, no como checkout identificado. | Integración al repo: indicar repositorio/rama o copiar el paquete al nuevo repo. No se ha modificado ni preparado un repositorio remoto. |
| H-02 | DECISION NEEDED | product, wireframe, design, technical y measurement se declaran propuestas. | Antes de implementar integralmente: José adopta esas versiones o indica cambios. No convertir las propuestas en decisiones históricas confirmadas. |
| H-03 | DECISION NEEDED | PARCIALMENTE CERRADO 10/10: Next.js/React/TypeScript, CSS Modules/tokens, Zod, Node, Supabase/PostgreSQL y Vercel confirmados. Email/CMP carecen de proveedor. | Elección base cerrada; antes de integración real faltan planes/regiones, scheduler, email y mecanismo CMP. No requiere otra aprobación del stack base. |
| H-04 | BLOCKER | `contacto@dominio.cl` está autorizado solo como provisional en content. SITE_URL y contacto real faltan. | Producción: dominio, soporte/privacidad operativo, remitente autenticado, destinatario y credenciales. No habilitar mailto ficticio ni producir canonical de ejemplo. |
| H-05 | BLOCKER | `/privacidad` carece de texto final; retenciones 180/30 días y proveedores son propuestas. | Captación pública: responsable, finalidades, destinos, transferencias, conservación, borrado y backups deben corresponder al flujo real. Resolver con José; no redactar datos legales como hechos inventados. |
| H-06 | BLOCKER | Receptor, scheduler y aviso todavía no están provisionados ni probados. | Aceptación del flujo real: DB privada, migraciones, cuenta operativa, email, job protegido y revisión de fallos. Mocks solo validan lógica, no recepción operativa. |
| H-07 | DECISION NEEDED | Consentimiento propone CMP mantenida o controles propios. Copy de sus controles no está en content; vigencia/versiones no adoptadas. | Antes de activar medición: elegir mecanismo, textos, vigencia, política y mapping de estados. Publicidad continúa denied; no añadir categoría vacía. |
| H-08 | DECISION NEEDED | measurement distingue rechazo inicial sin tráfico y revocación de un tag ya cargado, que puede emitir pings técnicos. | Elegir si se aceptan pings técnicos documentados tras update denied o se exige recarga; resolver cuándo recargar con formulario editado/petición activa. No prometer cero tráfico tras revocación con solo quitar script. |
| H-09 | BLOCKER | GTM/GA4, permisos de configuración, callback ready y contenedor QA/producción no están disponibles. | Validación/activación de analytics: aportar destinos y configurar tags, Enhanced Measurement y key event. Puede desarrollarse el contrato y lanzar captación con medición explícitamente desactivada; eso no valida Analytics. |
| H-10 | DECISION NEEDED | Technical propone límites 16 KiB, timeouts 10 s/500 ms, rate limit y calendario de retries; measurement propone TTLs. | Adoptar parámetros en sus documentos; comprobar capacidad del plan/scheduler. No prometer SLA de retries ni aplicar silenciosamente retenciones propuestas. |
| H-11 | DECISION NEEDED | content carece de mensajes específicos para 409/429/413/403/415, timeout+retry y textos CMP; el mensaje de recepción dice fracaso definitivo. | Aprobar catálogo UI y ubicación de retry; distinguir fallo confirmado de resultado incierto. Puede borradorarse texto en documentación, no alterar copy publicado por cuenta propia. |
| H-12 | DECISION NEEDED | CERRADO 10/10: se mantiene Campaña → Lead → CRM → Oportunidad → Venta. | design/technical alineados con content; no agregar nodos. Decisión documental cerrada, ejecución visual NOT VALIDATED. |
| H-13 | DECISION NEEDED | CERRADO 10/10: form_start una vez por instancia montada; no por reintento. | product/wireframe/measurement alineados; fallback válido y exclusión de foco preservados. Implementación NOT VALIDATED. |
| H-14 | DECISION NEEDED | Technical exige lead_status_history y revisión manual en consola, pero no detalla cómo cada cambio manual produce historial/actor de forma atómica. | Definir operación mínima y esquema de historial inicial; no UI admin. Registrar quién/cómo actualiza estados sin destruir historial; offline sigue fuera de scope. |
| H-15 | DECISION NEEDED | Technical solicita imagen OG real autorizada; no hay activo entregado. Experiencia genérica en content no confirma permiso para logos, empleadores o foto. | OG/evidencia: aportar activo autorizado o acordar alcance mínimo. Mantener texto de content; no inventar casos, cifras ni logos. |
| H-16 | SAFE ASSUMPTION | Design permite dos columnas de campos solo si corresponde; wireframe pide expresamente una columna. | Mantener una columna en todas las resoluciones: regla específica del wireframe, sin cambiar campos. |
| H-17 | SAFE ASSUMPTION | Product pide devolver foco al cerrar menú; technical indica foco en destino tras navegación. | Escape/cierre explícito→botón menú; selección de ancla→encabezado destino. No devolver foco al header tras navegar. |
| H-18 | SAFE ASSUMPTION | Design pide conservar label/ancho durante loading; content define “Enviando solicitud…”. | Usar texto de content y reservar anchura, evitando salto; no mostrar dos mensajes duplicados. |
| H-19 | SAFE ASSUMPTION | Privacidad durante edición debe conservar formulario; technical guarda PII solo en memoria. | Abrir enlace del formulario en pestaña nueva, con aviso accesible. Footer puede navegar normalmente. No introducir sessionStorage de contacto. |
| H-20 | SAFE ASSUMPTION | Fuentes tienen criterios de viewport complementarios, no incompatibles. | Verificar unión: 320, 375, 768, 1024, 1280 y 1440 CSS px; explorar límites 767/768 y 1023/1024. |
| H-21 | FUTURE | CRM, sGTM, CAPI, Ads/TikTok offline, GA4 MP y BigQuery son fases posteriores. | No elegir CRM ni implementar adapters/publicidad ahora. DB privada + operación manual es el receptor inicial propuesto. |
| H-22 | FUTURE | Umbral comercial, precios, SLA, mercados/industria, métricas objetivo pendientes en estrategia. | No bloquean landing sin esas promesas ni clasificación manual. No añadir rangos, rechazo por gasto, pricing o traducciones. Resolver en validación comercial posterior. |

## Riesgos concretos a conservar en la entrega

La idempotencia solo cubre la misma llave mantenida en memoria; no garantiza ausencia de duplicados tras recarga u otro dispositivo. La notificación externa puede duplicarse si el proveedor carece de idempotencia. DB y GA4 pueden diferir legítimamente. Un timeout puede seguir a un commit. Los pings tras revocación requieren tratamiento explícito. Validar con navegador y servicios reales además de pruebas locales.

## Estado y siguiente paso

Actualización foundation 10/10/2026: la solicitud del chat identifica carpeta local y autoriza preparar la foundation. H-01 queda cerrado para trabajo local, no para Git/remoto; H-02 queda adoptado para ese alcance limitado. Ver `decisions.md` y `foundation-review.md` para nuevos hallazgos FND-01/02/03 y alcance exacto. H-11 tiene texto Unconfirmed Reception existente, pero sigue faltando catálogo/retry. El registro anterior conserva el estado histórico del handoff; esta nota documenta su revisión sin aprobar pendientes operativos.

Se puede utilizar el paquete para resolver decisiones y preparar implementación independiente. Para afirmar **READY FOR IMPLEMENTATION**, cerrar H-01, adoptar versiones H-02 y resolver las decisiones que afectan el código a iniciar. Para **READY FOR LAUNCH**, cerrar bloqueos operativos, privacidad y criterios de release en acceptance.md. Si la medición se deja desactivada, documentar expresamente ese alcance y sus criterios NOT VALIDATED; no declarar medición terminada.

Esta revisión valida consistencia documental y localiza conflictos. No acredita build, QA de una web, consentimiento real, recepción, rendimiento ni despliegue.
