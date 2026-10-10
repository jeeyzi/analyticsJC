# Website MVP Conceptual Wireframe

Actualización 10/10/2026: decisiones confirmadas y alcance en `decisions.md`. La confirmación es parcial; no convierte otros pendientes en aprobaciones ni acredita una implementación.

Fecha: 6 de octubre de 2026. Proyecto: AnalyticsXXXXX. Versión propuesta: v1.
Fuentes: `strategy.md` de Chat 04 y arquitectura en `product.md`.

Este documento define contenido, jerarquía e interacción. Los textos entre corchetes son funciones de contenido, no copy final. “Solicitar diagnóstico inicial” es el CTA ya confirmado por estrategia. No define colores, tipografías, estilos ni programación. Las estructuras de escritorio y móvil son propuestas UX pendientes de validación con visitantes.

Orden de la home: header → relevancia → problema → solución → agencias → proceso → experiencia → objeciones → solicitud → footer. La página de privacidad es apoyo informativo.

## Header y navegación

### Purpose
Permitir reconocer la identidad, explorar la información relevante o solicitar contacto directamente.

### Visitor Question
¿Dónde encuentro la solución, el proceso o quién está detrás?

### Content Required
[Identidad de marca pendiente]. Etiquetas funcionales: Solución, Proceso, Experiencia. CTA confirmado.

### Components
Header, enlace al inicio, tres enlaces de ancla a `#solucion`, `#proceso` y `#experiencia`, CTA a `#diagnostico`, enlace para saltar al contenido. Control de menú en móvil.

### Primary Action
Solicitar diagnóstico inicial → `#diagnostico`.

### Secondary Action
Navegar a una sección; no hay CTA comercial secundario.

### Desktop Structure
Identidad al inicio de la fila; enlaces y CTA al final. Header sin posición fija.

### Mobile Structure
Identidad y botón de menú. Desplegable con enlaces y CTA, en orden vertical. No sumar un CTA fuera del menú que duplique la futura barra contextual.

### Notes
El menú tiene nombre accesible, estado expandido y cierre con control o Escape. Cerrar al elegir destino; manejar foco. Todos los enlaces existen y el título del destino queda visible. No incluir buscador ni megamenú.

## 01 — Relevancia y resultado (`#inicio`)

### Purpose
Explicar el resultado buscado, a quién sirve y qué acción inicia la relación.

### Visitor Question
¿Esto es para mi empresa y qué problema comercial pueden ayudarme a resolver?

### Content Required
H1: [explicar conexión de campañas con oportunidades y ventas y utilidad para decidir inversión].
Texto de apoyo: [empresas que captan leads mediante publicidad y utilizan CRM].
Contexto: [medición y trazabilidad de extremo a extremo, no garantía de ahorro].
Identificación breve: [consultora boutique liderada por José Cubillo].
Microtexto: [solicitud breve y revisión de encaje; no auditoría técnica completa].

### Components
Un H1, párrafo breve, línea de encaje, identificación del responsable, CTA y microtexto de expectativas.

### Primary Action
Solicitar diagnóstico inicial → `#diagnostico`.

### Secondary Action
Continuar leyendo mediante scroll; sin segundo botón.

### Desktop Structure
Bloque principal de lectura con H1, apoyo, encaje, CTA y expectativas. Evitar una segunda columna decorativa sin función informativa.

### Mobile Structure
Mismo orden, una columna. Priorizar H1, apoyo y CTA; identificación y expectativa inmediatamente asociadas. Sin imagen o animación que desplace la explicación inicial.

### Notes
No abrir con logos de herramientas, IA, porcentajes de ahorro o promesas cuantificadas. La experiencia breve identifica al responsable sin sustituir la sección de prueba. La barra móvil aparece después de que el CTA del hero salga por arriba.

## 02 — Problema e impacto (`#problema`)

### Purpose
Ayudar al visitante a reconocer su situación y comprender por qué la brecha de medición afecta decisiones.

### Visitor Question
¿Entienden lo que me pasa y por qué merece atención?

### Content Required
H2: [presentar la falta de conexión entre captación y resultados comerciales].
Tres pares síntoma → consecuencia:
- [se miden formularios pero no oportunidades/ventas] → [difícil comparar campañas por negocio].
- [sitio, publicidad y CRM ofrecen datos difíciles de conciliar] → [decisiones basadas en información incompleta].
- [las señales utilizadas para optimizar no reflejan calidad comercial] → [riesgo de priorizar leads con poco valor].
Cierre breve: [mejor medición permite evaluar reasignación y optimización, con resultados sujetos al caso].

### Components
Título, introducción breve, tres bloques de síntoma/consecuencia y nota de alcance del impacto.

### Primary Action
Ninguna; preparar la comprensión de la solución.

### Secondary Action
Continuar a solución.

### Desktop Structure
Título e introducción sobre tres bloques comparables. Cada consecuencia junto a su síntoma, sin separar en dos listas.

### Mobile Structure
Tres bloques apilados. Síntoma primero y consecuencia inmediatamente debajo; no carrusel.

### Notes
Los síntomas son situaciones de encaje, no hallazgos demostrados sobre el visitante. No afirmar que toda discrepancia representa dinero perdido ni que el tracking por sí solo mejora campañas.

## 03 — Solución y capacidades (`#solucion`)

### Purpose
Mostrar el alcance completo con foco en la conexión campañas–CRM–ventas y permitir reconocer una intervención posible.

### Visitor Question
¿Qué conectan y qué pueden resolver en mi caso?

### Content Required
H2: [presentar una solución central de medición y trazabilidad].
Recorrido conceptual: campañas → lead → CRM/oportunidad → venta/revenue; retorno de señales comerciales a publicidad cuando sea viable.
Cinco capacidades, cada una con problema y resultado de información:
1. [auditoría de trazabilidad].
2. [auditoría de calidad de datos web/publicidad].
3. [implementación y corrección de medición].
4. [reporting comercial y marketing].
5. [conexión de campañas, CRM y ventas, incluidas señales de conversión viables].
Nota: [el diagnóstico orienta qué capacidades requiere cada caso; no todas forman parte de todo proyecto].
Profundidad técnica breve: [ejemplos de sistemas y mecanismos realmente cubiertos, por verificar; no catálogo de compatibilidad universal].

### Components
Título, explicación, diagrama conceptual estático con equivalente textual, cinco filas de capacidades, nota de alcance y CTA.

### Primary Action
Solicitar diagnóstico inicial → `#diagnostico`, después del alcance.

### Secondary Action
Continuar hacia encaje para agencias y proceso.

### Desktop Structure
Explicación arriba; recorrido debajo; capacidades agrupadas en una lista compacta. Priorizar conexión con ventas en la explicación aunque la lista empiece por diagnóstico. CTA al cierre.

### Mobile Structure
Recorrido vertical legible con retorno de señales explicado en texto. Capacidades apiladas; títulos y resultados visibles sin expandir tarjetas. CTA al cierre.

### Notes
El diagrama describe una posibilidad de trabajo, no una integración lista para cualquier CRM. No ofrecer checkout, precios ni enlaces a páginas de servicio. Los cinco bloques son capacidades de una oferta central.

## 04 — Encaje para agencias (`#agencias`)

### Purpose
Permitir que una agencia reconozca su encaje sin desplazar el foco del comprador principal.

### Visitor Question
¿Pueden colaborar con mi equipo de performance y con los sistemas de mis clientes?

### Content Required
H2: [aplicación de la solución al trabajo de agencias de performance con generación de leads].
[Brechas de medición que requieren apoyo técnico].
[Colaboración con equipos existentes y responsabilidades acordadas por proyecto].
[La conexión con resultados del CRM depende también del acceso y proceso del cliente].

### Components
Bloque breve con título, párrafo y hasta tres condiciones de colaboración.

### Primary Action
Ninguna adicional; el CTA global atiende también este perfil.

### Secondary Action
Continuar al proceso.

### Desktop Structure
Bloque compacto de ancho de lectura, después de la solución; sin convertirlo en una landing dentro de la landing.

### Mobile Structure
Título, párrafo y condiciones en una columna. Sin selector de audiencia que esconda contenido.

### Notes
No prometer marca blanca, exclusividad, capacidad de equipo, SLA ni retainer sin definición comercial. El formulario permite seleccionar agencia e indicar si la inversión corresponde a un cliente o cartera.

## 05 — Proceso y alcance inicial (`#proceso`)

### Purpose
Reducir incertidumbre sobre el primer contacto y la participación necesaria.

### Visitor Question
¿Cómo empieza esto y qué necesitarán de mi equipo?

### Content Required
H2: [explicar el recorrido desde solicitud hasta alcance acordado].
Pasos:
1. [solicitud con contexto de negocio y medición].
2. [revisión de encaje por José].
3. [conversación posterior si corresponde para aclarar problema, sistemas y viabilidad].
4. [propuesta de intervención con entregables, responsabilidades y dependencias acordados].
Aclaración: [diagnóstico inicial no equivale a auditoría técnica completa].
Participación: [primero contexto; accesos y responsables se acuerdan en una fase posterior].
Método: [IA y automatización como apoyo a tareas reales de análisis/documentación/QA, con validación humana].

### Components
Título, lista numerada de cuatro pasos, bloque de alcance inicial y nota breve de método.

### Primary Action
Ninguna nueva; conservar continuidad hacia la prueba profesional.

### Secondary Action
Continuar a experiencia.

### Desktop Structure
Pasos en lista ordenada o distribución que conserve claramente 1–4; alcance y participación al cierre. Nota de IA subordinada.

### Mobile Structure
Lista numerada vertical, sin línea horizontal de cuatro pasos ni scroll lateral. Aclaración visible junto al paso inicial.

### Notes
No asignar días, gratuidad o entregables al diagnóstico sin acuerdo. No solicitar contraseñas o accesos en el formulario. Diferenciar procesos AI operativos de planes futuros; omitir afirmaciones de mayor velocidad no medidas.

## 06 — Responsable y evidencia (`#experiencia`)

### Purpose
Construir confianza mediante experiencia profesional verificable y responsabilidad directa.

### Visitor Question
¿Quién hará el trabajo y qué experiencia pertinente tiene?

### Content Required
H2: [presentar a José Cubillo como responsable directo].
[Resumen profesional breve centrado en B2B, lead tracking, medición y trazabilidad].
[Dos o tres ejemplos publicables que indiquen contexto, participación individual y tipo de problema trabajado].
[Formación o credenciales solo si se verifican y aportan].
[Foto profesional autorizada, opcional].

### Components
Identificación personal, resumen, lista de evidencia profesional y CTA. Foto opcional; la sección funciona sin ella.

### Primary Action
Solicitar diagnóstico inicial → `#diagnostico`.

### Secondary Action
Continuar a objeciones; sin abrir una nueva vía de captación.

### Desktop Structure
Resumen de la persona y evidencia cercana, con posible foto lateral de tamaño contenido. CTA después de la evidencia.

### Mobile Structure
Nombre y resumen, foto opcional, ejemplos y CTA. Ningún activo gráfico debe interrumpir la relación entre experiencia y evidencia.

### Notes
Los placeholders de prueba deben completarse antes de publicar. No convertir empleadores en clientes de la consultora, ni experiencia en certificaciones. No inventar equipo, testimonios o resultados. Si no hay ejemplos publicables, reducir a antecedentes verificables y específicos; no dejar tarjetas vacías.

## 07 — Objeciones prioritarias (`#preguntas`)

### Purpose
Resolver las tres dudas previstas antes de pedir datos personales.

### Visitor Question
¿Tiene sentido si ya tengo agencia? ¿Cómo evalúo si compensa? ¿Será muy complejo?

### Content Required
H2: [preguntas previas a solicitar diagnóstico].
Tres respuestas funcionales:
- [complementar al equipo existente revisando calidad, trazabilidad y resultados posteriores al formulario].
- [evaluar la brecha y su posible impacto antes de definir una intervención; sin garantía de ahorro].
- [acordar fases, responsables, accesos y participación para delimitar el trabajo].

### Components
Tres pares pregunta/respuesta, visibles y breves.

### Primary Action
Ninguna; la siguiente sección contiene el formulario.

### Secondary Action
Continuar a solicitud.

### Desktop Structure
Columna de lectura con preguntas y respuestas completas. No usar una parrilla que dificulte comparar la secuencia.

### Mobile Structure
Los tres pares apilados, sin acordeón en v1; evitar ocultar información decisiva por ahorro mínimo de altura.

### Notes
No duplicar todo el proceso. Si el copy puede responder una duda en la sección correspondiente con suficiente claridad, conservar aquí una respuesta breve, no una nueva sección extensa. Añadir preguntas solo a partir de objeciones reales.

## 08 — Solicitud de diagnóstico (`#diagnostico`)

### Purpose
Convertir intención en una solicitud recibida con contexto suficiente para revisar el encaje.

### Visitor Question
¿Qué debo enviar, para qué usarán mis datos y qué pasará después?

### Content Required
H2: [invitar a solicitar diagnóstico inicial].
[Qué evalúa el primer contacto y qué queda fuera].
[Siguiente paso: revisión y conversación cuando corresponda; plazo solo si se acuerda].
Labels: nombre, email de contacto, sitio de empresa/agencia, tipo de organización, inversión mensual aproximada (opcional), CRM utilizado (opcional), problema que quieres resolver.
Ayudas: [monto/rango y moneda; aclarar cliente/cartera para agencias], [admitir desconocimiento o ausencia de CRM], [problema en 2–3 frases].
[Información de tratamiento de datos y enlace a `/privacidad`].
[Canal operativo para incidencias, pendiente].

### Components
Introducción, formulario único, labels persistentes, ayudas, mensajes por campo, botón de envío, aviso de privacidad, región de estado y confirmación inline.

### Primary Action
Botón **Solicitar diagnóstico inicial** → enviar al receptor; no navegar a otra página.

### Secondary Action
Leer privacidad; resolver una incidencia con el canal de soporte. No añadir agenda, WhatsApp ni newsletter como CTA.

### Desktop Structure
Contexto breve sobre el formulario, ancho de lectura limitado. Campos en una columna para conservar una secuencia simple. Textarea, privacidad y envío al final.

### Mobile Structure
La misma columna y orden. Labels arriba, ayudas junto al campo, teclado/autocompletado adecuados y envío con área táctil amplia. Barra móvil oculta al entrar en la zona o enfocar un campo.

### Notes
Cinco campos obligatorios y dos opcionales. No bloquear emails personales válidos ni solicitudes por umbral de inversión pendiente. No formularios de varios pasos, adjuntos ni campos ocultos de datos personales para analítica.

Estados funcionales:

| Estado | Qué entiende el visitante | Comportamiento |
| --- | --- | --- |
| Inicial/edición | Qué se pide y qué es opcional | Campos disponibles; ayudas no dependen del placeholder |
| Validación fallida | Qué debe corregir | Error junto al campo y foco al primero; conservar entradas |
| Enviando | La solicitud está en proceso | Botón ocupado, sin envíos simultáneos; anunciar estado |
| Error de recepción confirmado | No se ha podido recibir | Conservar datos en sesión, explicar reintento y soporte |
| Resultado incierto | No se puede confirmar aún si se recibió | No anunciar éxito ni fracaso definitivo; verificación/reintento con el mismo ID |
| Éxito | Solicitud recibida y siguiente paso | Reemplazar formulario por confirmación, anunciarla y llevar foco; ocultar barra móvil |

La confirmación incluye [recepción confirmada], [revisión de encaje], [contacto posterior si corresponde], [plazo real si acordado] y [soporte]. No mostrar acceso automático a una reunión ni prometer aceptación comercial. Generar la conversión solo tras recepción persistente confirmada. Medición confirmada el 10/10/2026: form_start una vez por instancia montada, no por reintento; foco no lo dispara y un submit válido sin edición capturada usa el fallback de measurement.md.

## Footer

### Purpose
Cerrar la página con identidad y acceso a información de apoyo.

### Visitor Question
¿Quién es el responsable y dónde consulto privacidad o una incidencia?

### Content Required
[Identidad profesional/comercial verificada], enlace Privacidad, [contacto operativo real].

### Components
Footer semántico, información de identificación, enlace a `/privacidad` y contacto de soporte.

### Primary Action
Ninguna comercial adicional.

### Secondary Action
Leer privacidad o contactar por una incidencia.

### Desktop Structure
Fila o agrupación simple después del formulario; sin sitemap de páginas inexistentes.

### Mobile Structure
Elementos apilados con espacio táctil. No ocultar información bajo la barra contextual.

### Notes
No añadir iconos sociales decorativos, newsletter o catálogo de servicios. La sección de solicitud ya cierra el recorrido comercial.

## Página de apoyo — Privacidad (`/privacidad`)

### Purpose
Permitir comprender el uso real de datos del formulario y mecanismos de medición antes de enviar.

### Visitor Question
¿Quién trata mis datos, con qué finalidad y cómo puedo consultar o ejercer las opciones aplicables?

### Content Required
H1: [información de privacidad].
[Responsable y contacto real].
[Datos recogidos y finalidad de contacto/cualificación].
[Sistemas receptores, destinatarios, conservación y tratamiento realmente implementados].
[Información sobre medición y opciones disponibles según la configuración real].
[Fecha y mecanismo de contacto correspondiente].

### Components
Página de lectura con títulos, información estructurada, contacto y enlace de regreso al formulario.

### Primary Action
Regresar a la solicitud → `/#diagnostico`; acción de navegación, no conversión nueva.

### Secondary Action
Usar el contacto de privacidad cuando corresponda.

### Desktop Structure
Una columna de lectura, header reducido con enlace a home y footer básico. Sin elementos de captación adicionales.

### Mobile Structure
La misma estructura, párrafos legibles, enlaces táctiles y sin barra comercial sticky.

### Notes
Este wireframe reserva funciones informativas, no redacta una política legal ni presupone un régimen aplicable. Completar con el flujo real antes del lanzamiento. Al consultar privacidad durante la edición, conservar la sesión del formulario; si se abre otra pestaña, indicarlo de forma accesible.

## Reglas comunes y validación conceptual

- Mantener exactamente las anclas y el orden de `product.md`.
- Desktop y móvil comparten contenido y jerarquía semántica.
- Solo existe una conversión comercial y un destino de los CTA de navegación.
- La barra móvil sigue las condiciones especificadas en `product.md`; no crea un formulario alternativo.
- Todo componente no textual que explique el recorrido tiene un equivalente legible.
- Los placeholders deben resolverse en copy, evidencia o configuración antes de publicar.
- Las promesas comerciales pendientes no se completan por conveniencia visual.
- Entrega validada por coherencia documental. Pendientes: copy, diseño, implementación, pruebas responsive/accesibilidad, recepción real y validación de uso con visitantes.
