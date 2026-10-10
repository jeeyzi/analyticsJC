# Website MVP Specification

Actualización 10/10/2026: decisiones confirmadas y alcance en `decisions.md`. La confirmación es parcial; no convierte otros pendientes en aprobaciones ni acredita una implementación.

Fecha: 6 de octubre de 2026. Proyecto: AnalyticsXXXXX.
Fuente estratégica: `strategy.md`, Website Strategy Brief de Chat 04, leído el 6 de octubre de 2026. Documento complementario: `wireframe.md`.

Estado: especificación UX propuesta v1. Las decisiones comerciales confirmadas proceden del brief; las decisiones de arquitectura y comportamiento de este documento son propuestas para el MVP, no resultados de investigación con usuarios. No incluye copy final, diseño visual ni implementación.

## Objective

Generar solicitudes de diagnóstico inicial con encaje comercial y facilitar su avance hacia conversaciones, propuestas y servicios pagados.

Prioridad: empresas con captación de leads mediante publicidad, CRM e inversión sostenida que permita justificar una intervención de medición. Foco: campañas → leads → oportunidades → ventas. Agencias de performance son un público secundario dentro de la misma experiencia.

La arquitectura debe permitir entender relevancia, problema, impacto, solución, proceso, confianza y siguiente paso. La web respalda referidos, contactos, prospección personalizada y LinkedIn. No presupone tráfico masivo ni demanda orgánica.

## Primary Conversion

Solicitud de diagnóstico inicial aceptada por el sistema receptor. CTA confirmado: **Solicitar diagnóstico inicial**.

Un clic, una validación local o una visita al mensaje de éxito no constituyen un lead confirmado. Una solicitud recibida tampoco equivale a una oportunidad cualificada: José revisa su encaje posteriormente.

Indicador comercial principal: solicitudes con encaje y avance hacia oportunidades. Indicadores de apoyo: envíos recibidos, inicio y finalización del formulario, reuniones, propuestas y clientes. Definiciones y metas numéricas pendientes; no fijar objetivos inventados.

## MVP Pages

| Ruta | Función | Decisión |
| --- | --- | --- |
| `/` | Landing comercial con toda la explicación y formulario integrado | Necesaria |
| `/privacidad` | Explicar el tratamiento real de los datos del contacto y los mecanismos de medición que se utilicen | Página de apoyo necesaria; contenido pendiente del funcionamiento real |

No crear `/servicios`, `/nosotros`, `/agencias` ni `/contacto`: sus funciones caben en la landing. No crear `/gracias`: usar confirmación inline para reducir estados y evitar conversiones por visitas directas. Los errores de ruta deben ofrecer retorno a la home mediante un estado 404 sencillo.

Una única landing comercial es suficiente como hipótesis inicial porque hay una oferta central, una acción comercial y tráfico principalmente dirigido. Si las agencias requieren una oferta distinta tras validación, evaluar entonces una página específica.

## Navigation

Header: [identidad de marca pendiente], enlaces de ancla **Solución** (`#solucion`), **Proceso** (`#proceso`), **Experiencia** (`#experiencia`) y CTA principal a `#diagnostico`.

Los nombres de navegación son etiquetas funcionales provisionales. La identidad enlaza al inicio. No añadir menú de herramientas ni catálogo desplegable.

Móvil: identidad y botón de menú; menú desplegable con los tres enlaces y el mismo CTA. Cerrar al seleccionar, al usar Escape o el control de cierre; devolver foco al botón al cerrar. El menú no debe tapar el formulario después de navegar. Header no fijo en v1.

Enlaces de ancla actualizan la URL y posicionan el título de destino sin ocultarlo. La navegación no impide leer o enviar la solicitud si JavaScript no gestiona desplazamientos especiales.

Footer: identidad profesional, enlace a privacidad y canal de contacto operativo pendiente. El contacto de soporte resuelve incidencias; no se presenta como un segundo embudo de ventas.

## Home Sections

Orden canónico compartido con `wireframe.md`:

| Orden / ancla | Sección | Pregunta que responde | Información y función | CTA |
| --- | --- | --- | --- | --- |
| 1 / `#inicio` | Relevancia y resultado | ¿Esto es para mí? | Resultado principal, perfil de cliente, alcance de medición y responsable identificable | Principal |
| 2 / `#problema` | Problema e impacto | ¿Entienden lo que me pasa y por qué importa? | Tres síntomas observables y sus consecuencias en decisiones de inversión | Ninguno |
| 3 / `#solucion` | Solución y capacidades | ¿Qué conectan y qué pueden resolver? | Recorrido campaña–CRM–venta; cinco capacidades subordinadas al resultado central | Principal al final |
| 4 / `#agencias` | Encaje para agencias | ¿Pueden colaborar con mi agencia? | Colaboración técnica y responsabilidades acordadas, sin paquetes white-label no definidos | Ninguno |
| 5 / `#proceso` | Proceso y alcance inicial | ¿Cómo empieza y cuánto requiere de mi equipo? | Solicitud, revisión de encaje, conversación si corresponde y propuesta de alcance; distinguir diagnóstico de auditoría técnica | Ninguno |
| 6 / `#experiencia` | Responsable y evidencia | ¿Por qué confiar en esta persona? | José Cubillo, experiencia profesional verificable, rol individual y evidencia autorizada | Principal al final |
| 7 / `#preguntas` | Objeciones prioritarias | ¿Qué pasa si ya tengo tracking, si no compensa o si es complejo? | Tres respuestas breves sobre complementariedad, justificación económica y participación | Ninguno |
| 8 / `#diagnostico` | Solicitud | ¿Qué debo enviar y qué ocurrirá después? | Expectativas, formulario breve, privacidad y confirmación | Enviar solicitud |

No añadir una sección autónoma de herramientas ni una sección hero de IA. La profundidad técnica pertenece a la solución; IA y automatización se explican brevemente dentro del proceso, solo cuando sean prácticas reales.

## CTA Architecture

Una acción comercial: solicitar diagnóstico. Todas sus apariciones llevan al mismo formulario, sin modales, calendario ni rutas alternativas.

Ubicaciones: header, hero, final de solución, final de experiencia y barra móvil contextual. El botón de envío ejecuta la solicitud y se distingue del CTA de navegación. No repetir botones en cada tarjeta.

Lectura progresiva: el visitante con intención alta puede ir directo al formulario; quien necesita entender la oferta puede recorrer las secciones. Los enlaces del menú son navegación, no conversiones alternativas. El enlace a privacidad es informativo.

Barra móvil: aparece cuando el CTA del hero sale por encima del viewport; se oculta mientras el formulario o su confirmación están visibles, mientras el menú esté abierto o haya un campo enfocado/teclado abierto. Una sola acción, sin badge, cuenta atrás ni segundo botón. Respetar safe area y reservar espacio para no tapar contenido ni footer.

## Lead Flow

1. Entrada desde referido, contacto, prospección o LinkedIn; conservar contexto de origen permitido, sin mostrarlo en el formulario.
2. Comprensión de oferta o salto directo a `#diagnostico`.
3. Completar formulario; validar datos y mostrar errores junto a sus campos.
4. Enviar al receptor persistente configurado; bloquear envíos simultáneos y mostrar estado de procesamiento.
5. Confirmar recepción solo tras aceptación. Mostrar confirmación inline con siguiente paso y canal de soporte. Conservar el registro aunque una notificación falle.
6. José revisa manualmente inversión, CRM, problema y posibilidad de actuar. Si encaja, contacta para una conversación; el calendario se coordina después.
7. Registrar estado comercial: recibido, revisión pendiente, con encaje/sin encaje/por aclarar, conversación, propuesta y ganado/perdido cuando aplique.

No rechazar automáticamente por gasto: el umbral está pendiente y una agencia puede declarar inversión agregada. No pedir accesos ni credenciales para este primer contacto. No prometer atención inmediata, auditoría completa, gratuidad, ahorro o fecha de entrega sin decisión comercial.

## Form Role

Recoger contexto suficiente para revisar el encaje, sin sustituir una auditoría ni un discovery completo. Una pantalla, sin pasos condicionales en v1.

| Campo | Tipo | Obligatorio | Función |
| --- | --- | --- | --- |
| Nombre | Texto con autocompletado | Sí | Identificar a la persona |
| Email de contacto | Email con autocompletado | Sí | Responder; admitir emails personales válidos |
| Sitio de empresa o agencia | URL | Sí | Identificar contexto y revisar sitio; admitir dominio sin protocolo y normalizar |
| Tipo de organización | Select: empresa que capta leads / agencia / otro | Sí | Interpretar la solicitud sin crear un segundo flujo |
| Inversión publicitaria mensual aproximada | Texto corto | No | Señal de encaje; indicar monto/rango y moneda, y si corresponde a cartera o cliente |
| CRM utilizado | Texto corto | No | Conocer sistema o ausencia; permitir “no sé” y “no usamos” |
| Problema que quieres resolver | Textarea breve | Sí | Entender brecha y resultado buscado; orientar a 2–3 frases |

Campos opcionales identificados explícitamente. No pedir teléfono, cargo, presupuesto de consultoría, adjuntos o listados de herramientas en esta fase. La inversión no usa rangos numéricos hasta acordar mercados y umbral; no inventar moneda global.

Junto al envío: [información sobre uso de datos y enlace a privacidad], [siguiente paso y plazo real si se acuerda]. El mecanismo de consentimiento aplicable se resolverá con la configuración de privacidad real; no añadir aceptación de marketing obligatoria ni consentimientos preseleccionados.

Estados: vacío, edición, error de campo, envío en curso, error de recepción, resultado incierto por timeout y éxito. En errores conservar entradas durante la sesión; no persistir datos personales en localStorage. En éxito reemplazar formulario por confirmación accesible. Tras timeout no afirmar fracaso definitivo: prevenir duplicados con un identificador de solicitud y verificar/reintentar sobre la misma operación.

## Mobile Behavior

Orden de contenido igual al desktop. Una columna; sin carruseles ni tarjetas que requieran swipe. Hero permite reconocer resultado, encaje y CTA sin grandes elementos decorativos. El contenido sustantivo continúa mediante scroll normal.

Diagrama del recorrido apilado verticalmente. Capacidades en filas compactas, proceso en lista numerada y experiencia con la evidencia cerca de la persona. Las tres respuestas a objeciones permanecen visibles; no necesitan acordeón.

Formulario con etiquetas persistentes arriba de los campos, teclado adecuado, autocompletado y envío de ancho disponible. Foco y errores no quedan ocultos por la barra móvil. Áreas táctiles mínimas propuestas de 44 × 44 CSS px, controles accesibles con teclado y zoom sin pérdida de contenido. Sin scroll horizontal a 320 CSS px. La animación de scroll, si existe después, respeta preferencia de movimiento reducido.

## Functional Requirements

| Área | Requisito verificable |
| --- | --- |
| Estructura | Un H1, jerarquía de títulos, landmarks y enlace para saltar al contenido; todos los destinos de navegación existen |
| Formulario | Validación en cliente y receptor, labels asociados, mensajes comprensibles, estado anunciado y foco al primer error o confirmación |
| Recepción | Persistencia en receptor antes de confirmar; identificador de solicitud, control de duplicados y notificación a José; integración exacta pendiente |
| Continuidad | Fallos conservan entradas en memoria de la sesión; no exigir repetir campos sin motivo ni anunciar éxito local falso |
| Medición | Registrar clics por ubicación, inicio del formulario una vez por instancia montada (sin repetir por reintento; fallback antes del primer submit válido si no se capturó edición/autofill) y envío confirmado; sin valores de campos, emails, nombres ni texto libre en analítica |
| Trazabilidad comercial | Asociar la solicitud con fuente permitida y estado comercial mediante ID interno; especificación de herramientas y esquema corresponde a una fase posterior |
| Privacidad | Información real publicada, acceso desde formulario y footer; comportamiento de medición sujeto a la configuración aplicable; ausencia de cookies de analytics no bloquea envío |
| Robustez | Protección antispam sin fricción inicial innecesaria, validación de URLs y entradas, mensajes de error sin detalles internos |
| Responsive | Verificar 320, 375, 768 y 1280 CSS px; foco, teclado móvil, safe area, zoom y menú; barra contextual nunca tapa controles |
| Evidencia | Solo experiencia y activos publicables verificados; diferenciar empleadores/proyectos previos de clientes de la consultora |

Dependencias antes de desarrollo o lanzamiento: nombre comercial, evidencia profesional publicable, destino de solicitudes, contacto operativo, procedimiento de revisión y contenido de privacidad. Copy, rangos de inversión, plazo de respuesta y promesas de servicio pendientes. Estos pendientes no cambian la arquitectura propuesta, pero impiden publicar promesas o un formulario sin receptor operativo.

Validación de esta entrega: coherencia documental entre rutas, anclas, secciones, CTA y estados. No se ha probado usabilidad, conversión ni funcionamiento de una web; todavía no existe implementación.

## Out of Scope

- Blog, CMS complejo, login, portal cliente, chatbot, herramientas AI y dashboards interactivos.
- Páginas por servicio, industria, herramienta o país; ecommerce como mensaje prioritario.
- Calendario público como conversión alternativa, WhatsApp flotante y captación de newsletter.
- Paquetes, precios cerrados, contratación online, auditoría automática y recomendaciones instantáneas.
- Testimonios, logos de clientes, certificaciones o cifras de ahorro no verificadas.
- Colores, tipografías, diseño visual, copy final, código y stack técnico.

## Future Scope

| Posible extensión | Condición para reconsiderarla |
| --- | --- |
| Página para agencias | Oportunidades repetidas que requieran oferta, proceso o pruebas diferentes |
| Casos de trabajo | Evidencia y autorización publicable con participación individual clara |
| Páginas de servicio | Oferta comprable validada y demanda que necesite más explicación |
| Agenda tras solicitud | Revisión manual identifica que la coordinación retrasa conversaciones con encaje |
| Campos/rangos de cualificación | Datos reales muestran qué información permite decidir encaje sin abandono innecesario |
| Seguimiento automatizado | Volumen y proceso estandarizados justifican automatización, con revisión humana |
| Contenido SEO o idioma adicional | Canal/mercado comercial validado y capacidad de mantener contenido |

Priorizar cambios por problema observado, impacto esperado y esfuerzo. No usar experimentos A/B con poco tráfico como sustituto de conversaciones y revisión de leads.
