# Design System

Actualización 10/10/2026: decisiones confirmadas y alcance en `decisions.md`. La confirmación es parcial; no convierte otros pendientes en aprobaciones ni acredita una implementación.

Sistema visual del MVP de José Cubillo · Digital Analytics & Tracking.

Estado: propuesta v1 lista para implementación y revisión visual. No implica aprobación previa del cliente.

Este documento gobierna presentación, componentes y comportamiento responsive. No redefine ICP, posicionamiento, servicios, arquitectura, orden de secciones, CTA ni copy. Los documentos aprobados de estrategia, arquitectura y copy son la fuente de contenido. No se han revisado sus versiones completas para esta entrega; las reglas son independientes de su contenido y deben aplicarse cuando estén disponibles. Los ejemplos de etiquetas técnicas aquí incluidos ilustran diagramas, no sustituyen copy comercial.

Si un contenido aprobado no cabe, ampliar o reordenar el componente dentro de su sección; no abreviar el contenido ni añadir páginas por decisión de diseño. Si una regla impide accesibilidad, prevalece accesibilidad y se documenta el ajuste.

## Visual Direction

Dirección: **precisión editorial + sistemas de medición visibles**.

Una consultoría boutique técnica, con una interfaz clara y sobria. Predominan superficies claras, texto grafito, jerarquía tipográfica y espacio. El azul indica acciones; el verde petróleo destaca relaciones de medición. El diseño debe hacer comprensible cómo se conectan las fuentes y los resultados del negocio.

- Tema único claro para el MVP. No implementar selector de tema ni variante oscura automática.
- Contenido alineado a la izquierda; evitar páginas compuestas enteramente por titulares centrados y tarjetas.
- Identidad provisional: wordmark tipográfico «José Cubillo», con el descriptor aprobado cuando corresponda. No crear un logo adicional, monograma ni símbolo sin un encargo específico.
- Titulares con contraste de tamaño y peso, sin degradados, contornos ni palabras decorativas de otro color.
- La sensación técnica nace de relaciones explícitas, nodos etiquetados y anotaciones precisas; no de fondos tecnológicos.
- Si la arquitectura contempla un visual principal, usar un diagrama conceptual. No añadir una nueva sección para alojarlo.

## Brand Attributes

| Atributo | Regla visual | Evitar |
| --- | --- | --- |
| Precisión | Alineación consistente, tokens compartidos, etiquetas claras | Elementos flotantes sin alineación |
| Confianza | Contraste alto, lectura cómoda, estados explícitos | Métricas, clientes o certificaciones inventados |
| Expertise | Diagramas explicativos y detalles técnicos contextualizados | Listados de herramientas como decoración |
| Tecnología | Tipografía sans, iconos lineales, implementación ligera | Circuitos, robots y efectos futuristas |
| Analytics | Relaciones entre campañas, eventos y resultados | Gráficos sin fuente o unidad |
| Innovación | Claridad del sistema y feedback de interacción | Estética de «agencia de IA» |
| Profundidad técnica | Información progresiva dentro de la arquitectura aprobada | Mostrar código donde no ayude a decidir |

## Visual References

Referencias de lenguaje visual, no marcas externas ni plantillas que deban copiarse:

| Referencia | Adoptar | No adoptar |
| --- | --- | --- |
| Diseño editorial profesional | Titulares claros, bloques de texto con ancho contenido, ritmo vertical | Columnas de lectura estrechas en todas las secciones |
| Documentación técnica | Etiquetas, conectores, agrupaciones y leyendas explícitas | Densidad propia de una consola o API reference |
| Diagramas de arquitectura de datos | Dependencias y transferencias con significado | Diagramas complejos sin relación con el servicio |
| Interfaces B2B de trabajo | Controles previsibles y estados completos | Sidebar, dashboards o tablas que el MVP no necesita |

No requiere referencias externas para implementarse. Si posteriormente se incorpora una referencia, extraer una cualidad concreta; no reproducir su página.

## Typography

Familia principal: **Inter**, local en WOFF2, subconjunto Latin que incluya español. Un archivo variable con pesos 400–600. `font-display: swap`. Fallback: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.

Familia técnica: `ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace`. Usar solo para identificadores reales de eventos o campos; no para títulos ni párrafos comerciales. No cargar otra fuente.

Escala con base del navegador de 16px; implementar en rem. No fijar el tamaño base del usuario.

| Rol | <768px | ≥768px | Peso | Interlineado | Tracking |
| --- | --- | --- | --- | --- | --- |
| H1 | 36px | Fluido 44–56px | 600 | 1.10 | -0.035em |
| H2 | 28px | Fluido 32–40px | 600 | 1.18 | -0.025em |
| H3 | 22px | 24px | 600 | 1.30 | -0.015em |
| Lead | 18px | 20px | 400 | 1.55 | 0 |
| Body | 16px | 18px | 400 | 1.65 | 0 |
| UI / botones / campos | 16px | 16px | 500 / 400 en campos | 1.50 | 0 |
| Caption / ayuda | 14px | 14px | 400 | 1.50 | 0 |
| Eyebrow | 14px | 14px | 500 | 1.50 | 0.02em |

- H1 desktop: `clamp(2.75rem, 4.5vw, 3.5rem)`; H2 desktop: `clamp(2rem, 3.2vw, 2.5rem)`.
- Máximo 600 de peso. No usar 700–900 ni mayúsculas sostenidas en párrafos o botones.
- H1 con `max-width: 20ch`; H2 28ch; párrafos 65ch. Son máximos de lectura, no alturas fijas.
- No imponer saltos `<br>` para lograr una composición. Usar `text-wrap: balance` en titulares como mejora opcional.
- Separación título→texto: 16px; párrafo→párrafo: 16px; lead→acciones: 24px.
- Usar `font-variant-numeric: tabular-nums` solo cuando haya cifras comparables reales.
- No truncar titulares, textos comerciales ni labels. URLs y cadenas técnicas: `overflow-wrap: anywhere`.

## Color System

| Token CSS | Hex | Uso |
| --- | --- | --- |
| `--color-bg` | `#F8FAFC` | Fondo general |
| `--color-surface` | `#FFFFFF` | Formularios, tarjetas y navegación |
| `--color-surface-muted` | `#EEF2F6` | Fondo alternativo y controles disabled |
| `--color-text` | `#17212B` | Texto principal |
| `--color-text-muted` | `#526171` | Texto secundario y ayuda |
| `--color-primary` | `#1D4ED8` | CTA, links y foco |
| `--color-primary-hover` | `#1E40AF` | Hover de acción primaria |
| `--color-primary-active` | `#1E3A8A` | Acción presionada |
| `--color-primary-soft` | `#EFF6FF` | Hover secundario y selección suave |
| `--color-accent` | `#0F766E` | Conexión de medición destacada |
| `--color-accent-soft` | `#F0FDFA` | Fondo de nodo destacado |
| `--color-border` | `#D6DEE7` | Separadores y tarjetas no interactivas |
| `--color-border-control` | `#64748B` | Contorno de campos y controles |
| `--color-success` | `#166534` | Confirmación explícita |
| `--color-success-soft` | `#F0FDF4` | Fondo de confirmación |
| `--color-error` | `#B91C1C` | Error de campo o envío |
| `--color-error-soft` | `#FEF2F2` | Fondo de error |
| `--color-warning` | `#92400E` | Advertencia relevante |
| `--color-warning-soft` | `#FFFBEB` | Fondo de advertencia |

Texto sobre botón primario: `#FFFFFF`. Texto sobre superficie suave: principal o el color semántico correspondiente, nunca blanco. No usar `--color-border` como único límite de un campo; su contraste es solo decorativo.

Distribución: superficies neutras dominantes; azul restringido a interacción; verde petróleo restringido a significado técnico. No asignar un color distinto a cada tarjeta. No añadir colores fuera de la tabla sin actualizar este documento.

El foco usa dos capas: blanco de 2px y azul de 3px exterior. En CSS: `box-shadow: 0 0 0 2px #fff, 0 0 0 5px var(--color-primary)`. Aplicar con `:focus-visible`; conservar un outline visible como fallback en colores forzados.

## Backgrounds

- Página: `--color-bg`; superficies acotadas: `--color-surface`.
- Sección alterna: `--color-surface-muted` solo cuando la arquitectura necesite una separación clara entre bloques. No alternar fondos mecánicamente en todas las secciones.
- Sin degradados, imágenes ambientales, ruido, cuadrículas decorativas, puntos, partículas o vídeo de fondo.
- No incluir secciones oscuras en v1. Si se requiere una variante futura, definir todos sus tokens y verificar contraste antes de usarla.
- Diagramas transparentes sobre el fondo de sección; sus nodos pueden tener fondo blanco o accent-soft.

## Layout

- Conservar exactamente páginas, orden de secciones y ubicaciones de CTA aprobados en arquitectura.
- Jerarquía de cada sección: título, contexto si existe, contenido. No inventar eyebrows o subtítulos para llenar espacio.
- Alineación izquierda como norma. Una confirmación de formulario puede centrarse dentro de su región.
- Secciones estándar: padding vertical 96px desktop, 72px tablet, 56px móvil.
- Primer bloque: 72px desktop, 56px tablet, 40px móvil de padding superior e inferior. No fijar altura a una pantalla.
- Contenido de lectura aislado: máximo 760px; formulario: máximo 640px.
- Separación entre encabezado de sección y contenido: 40px desktop, 32px tablet, 24px móvil.
- No utilizar posicionamiento absoluto para contenido o controles. Reservarlo para conectores de diagramas y elementos decorativos no esenciales.

## Container

`width: min(100% - 2 * var(--page-gutter), 75rem); margin-inline: auto;`.

| Viewport | Gutter lateral | Máximo |
| --- | --- | --- |
| 320–767px | 20px | 1200px |
| 768–1023px | 32px | 1200px |
| ≥1024px | 40px | 1200px |

Todos los bloques, navegación y footer comparten bordes de container. Un fondo puede ocupar todo el ancho; su contenido permanece dentro del container. No aplicar gutter doble a un componente anidado.

## Grid

- Desktop ≥1024px: 12 columnas, gap 32px.
- Tablet 768–1023px: 8 columnas, gap 24px.
- Móvil <768px: 4 columnas, gap 16px; la mayoría de componentes ocupa las 4.
- Bloque dividido, cuando ya esté previsto: texto 7/12 y visual 5/12 en desktop; apilar texto→visual bajo 1024px.
- Grupos de 3 tarjetas: 3 columnas desktop, 2 tablet, 1 móvil. La tarjeta restante conserva ancho de columna; no estirarla para simular una oferta más importante.
- Grupos de 2 tarjetas: 2 columnas a partir de 768px, 1 debajo.
- No usar masonry ni carruseles para información esencial. No reordenar visualmente elementos respecto del DOM.
- Hijos de grid/flex: `min-width: 0`; imágenes/SVG: `max-width: 100%`.

## Spacing Scale

Unidad de 4px. Tokens: `--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 20px`, `--space-6: 24px`, `--space-8: 32px`, `--space-10: 40px`, `--space-12: 48px`, `--space-14: 56px`, `--space-16: 64px`, `--space-18: 72px`, `--space-24: 96px`.

| Relación | Espaciado |
| --- | --- |
| Icono→label | 8px |
| Label→input | 8px |
| Input→ayuda/error | 8px |
| Campos consecutivos | 24px |
| Acciones agrupadas | 12px |
| Elementos de lista | 12px |
| Título tarjeta→texto | 12px |
| Padding tarjeta | 24px móvil / 32px desktop |
| Padding formulario | 24px móvil / 32px desktop |

No introducir valores intermedios por ajuste visual aislado. Dimensiones de tipografía, contornos y conectores se gobiernan por sus propias reglas.

## Border Radius

| Token | Valor | Aplicación |
| --- | --- | --- |
| `--radius-control` | 6px | Botones y campos |
| `--radius-card` | 10px | Tarjetas y formulario |
| `--radius-node` | 6px | Nodos de diagrama |
| `--radius-badge` | 4px | Etiquetas de estado |

Sin botones pill, esquinas gigantes ni mezcla de radios distintos entre componentes equivalentes. Checkboxes nativos pueden conservar su forma de navegador.

## Borders

- Tarjetas, separadores y nodos: 1px solid `--color-border`.
- Inputs y botones secundarios: 1px solid `--color-border-control`.
- Nodo técnico destacado: borde `--color-accent`, 1px.
- Error en campo: borde `--color-error`, 1px más texto explícito; no depender solo del color.
- Sin bordes animados, dobles ni contornos brillantes. Los anillos de foco son una excepción funcional.

## Shadows

- Sin sombras en secciones, diagramas, botones ni tarjetas informativas.
- Menú desplegable: `0 8px 24px rgb(23 33 43 / 10%)`.
- No aplicar `backdrop-filter`. La jerarquía procede de espacio, tipografía y borde.

## Buttons

Los labels y destinos provienen del copy y arquitectura aprobados. Un `<a>` para navegación; `<button>` para acciones. No dar aspecto de acción a una etiqueta informativa.

Base: font 16px/1.5, peso 500, padding 12px 20px, min-height 48px, radio 6px, gap icono 8px. Ancho según contenido; admitir dos líneas si el label lo necesita. No fijar altura máxima.

| Variante | Default | Hover | Active |
| --- | --- | --- | --- |
| Primary | Fondo primary, texto blanco, borde transparente | Fondo primary-hover | Fondo primary-active |
| Secondary | Fondo blanco, texto primary, borde control | Fondo primary-soft | Fondo primary-soft y texto primary-active |
| Text | Link primary subrayado, sin contenedor | Texto primary-hover | Texto primary-active |

- Un primario por grupo de acciones. Repetir la misma conversión en otros lugares solo según arquitectura.
- Iconos opcionales de 18px: flecha para destino, ningún icono si no agrega significado.
- `:focus-visible`: anillo definido en Color System. Hover nunca es requisito para entender o usar el control.
- Disabled: fondo surface-muted, texto text-muted y borde border; sin opacidad global. Usar atributo `disabled` para botones, no enlaces sin funcionalidad.
- Loading: conservar label y ancho, añadir indicador de 16px, `aria-busy=true`, impedir envíos repetidos. Anunciar estado con texto accesible.
- No bloquear submit porque faltan campos: permitir submit y mostrar validación, salvo envío en curso.
- Móvil: CTA principal del grupo a ancho completo; secundario también si ambos están juntos. No añadir una barra flotante si no figura en arquitectura.

## Forms

La arquitectura define campos, obligatoriedad y destino. Este sistema no añade campos de cualificación ni nuevos checkboxes.

- Layout de una columna por defecto. Dos columnas desde 768px solo para campos cortos y relacionados ya existentes; textarea y errores globales ocupan todo el ancho.
- Label visible encima; peso 500, 16px. Indicar campos opcionales u obligatorios según copy aprobado, sin depender exclusivamente de asteriscos.
- Input/select: min-height 48px, padding 12px 16px, texto 16px, fondo blanco, borde control, radio 6px. Textarea: min-height 144px y resize vertical.
- Placeholder opcional con text-muted; nunca sustituye label ni contiene instrucciones esenciales.
- Ayuda/error: 14px, debajo del campo. Error con prefijo o mensaje explícito; `aria-invalid=true`, `aria-describedby` enlazado al mensaje.
- Tipos y autofill adecuados: email, tel y `autocomplete` cuando corresponda. No restringir nombres o teléfonos con reglas innecesarias.
- Checkbox nativo de al menos 20px visuales; label clicable y zona de interacción de al menos 44px de alto. Conservar el indicador de foco.
- Estados: vacío, hover, foco, completo, inválido, enviando, éxito y fallo de envío. Completo no necesita check verde en cada campo.
- Validar al submit y, tras el primer error, al corregir ese campo. No mostrar errores antes de que el usuario interactúe.
- Submit inválido: mostrar resumen y llevar foco al primer campo inválido. Fallo de servidor: preservar todos los valores y permitir reintento.
- Éxito solo tras confirmación del backend; conservar la región ocupada y anunciar con `role=status`. Mensaje y siguiente paso provienen del copy aprobado.
- Un feedback global por envío. No combinar toast, modal y mensaje inline para la misma acción.
- No insertar un email genérico ficticio como si recibiera mensajes. Un contacto provisional debe identificarse en la implementación y no habilitarse como destino real.

## Cards

- Usar tarjetas solo para unidades comparables ya definidas: servicios, entregables o evidencia. No convertir todo párrafo en una tarjeta.
- Fondo blanco, borde 1px border, radio 10px, padding 24/32px; sin sombra.
- Orden interno: icono opcional, título, texto, lista si existe, link si está previsto. Espaciado según escala.
- Icono opcional: 24px, text-muted; no badge circular de color por defecto.
- Altura automática. En una misma fila, stretch para bordes alineados; acciones al final con `margin-top:auto` sin alturas fijas.
- Informativa: sin hover, cursor ni elevación. Interactiva: borde control en hover y foco visible; no desplazar la tarjeta.
- Si toda la tarjeta es un link, usar un único link accesible sin otros controles anidados. Si contiene varias acciones, enlazar únicamente cada control.
- No destacar una oferta como «recomendada» si esa decisión no existe en la estrategia.

## Icons

- Usar Lucide como única familia. Importar solo los iconos empleados; no cargar toda la biblioteca en producción.
- Tamaños: 18px en botones, 20px en UI, 24px en tarjetas; stroke 1.75, `currentColor`.
- Mapeo conceptual: campañas `megaphone`; web `globe`; tracking `waypoints`; analytics `chart-no-axes-combined`; CRM `database`; oportunidad `git-branch`; revenue `badge-dollar-sign`.
- El icono acompaña al label; no representa por sí solo un concepto complejo. Los nombres son identificadores de la biblioteca y deben comprobarse al instalarla; si alguno falta, usar un equivalente semántico de esa misma familia.
- Decorativos: `aria-hidden=true`. Botón solo icono: nombre accesible y zona mínima 44×44px.
- No usar logos de plataformas, clientes o certificaciones como prueba de relación sin evidencia y contenido aprobado.

## Diagrams

El diagrama debe explicar una relación verificable o un proceso conceptual. No simular datos de un cliente. Indicar «Esquema conceptual» cuando pueda confundirse con una implementación real.

Modelo confirmado para el MVP: Campaña → Lead → CRM → Oportunidad → Venta, exactamente como content.md. No añadir Website, Tracking o Analytics como nodos. Si se representa el retorno offline, conexión separada desde el resultado comercial a Campaña, condicionada por el texto existente «Cuando la integración lo permite». Representa una capacidad, no una integración ya instalada.

- Desktop: organizar de izquierda a derecha, con máximo 4 nodos por fila; continuar en otra fila o usar ramas. No comprimir los 5 nodos en una sola línea.
- <768px: flujo vertical de cinco nodos en el mismo orden. El retorno opcional permanece separado y rotulado; no convertirlo en otro paso ni añadir bifurcaciones.
- Nodos: min-height 64px, padding 16px, radio 6px, borde 1px border. Texto 14–16px, label principal peso 500; máximo dos líneas sin truncar.
- Separación entre nodos: mínimo 24px; ramas: gap 24px. Labels de conectores a 8px de la línea; nunca cruzar texto.
- Conectores neutros: 1.5px border-control con punta de flecha. Acento teal solo en una relación o grupo destacado con significado.
- Línea sólida = transferencia representada; línea discontinua = retorno offline o conexión propuesta, siempre rotulada. No usar discontinuidad meramente decorativa.
- Preferir HTML/CSS para nodos y SVG ligero para conectores. No incluir librería de diagramas, canvas o WebGL para este esquema.
- Texto accesible en DOM y descripción equivalente que explique recorrido y retorno condicional. Si el SVG solo conecta nodos ya descritos, marcarlo decorativo.
- Sin animación de partículas o flujo continuo. Sin KPIs, porcentajes o curvas inventadas. Un gráfico real necesita fuente, período, unidades y contexto aprobado.
- El diagrama es estático salvo que la arquitectura exija interacción; ninguna explicación esencial depende de hover.

## Navigation

- Mostrar solo destinos de la arquitectura aprobada y CTA con el label aprobado.
- Header: min-height 80px desktop, 64px móvil, fondo blanco, borde inferior border. Contenido en container. Wordmark 18px, peso 600; links 16px/500.
- Header estático por defecto. No introducir sticky nav, scrollspy ni ocultación al hacer scroll en v1.
- Desktop desde 1024px: wordmark izquierda, enlaces y CTA derecha, gap 24px. Si el copy aprobado no cabe, activar menú colapsado antes; no reducir fuente ni abreviar labels.
- Bajo 1024px: wordmark y botón «Menú», zona de 44px mínimo, con `aria-expanded` y `aria-controls`.
- Menú móvil expandido en el flujo, fondo blanco; links en una columna con min-height 48px y CTA al ancho disponible. Sin drawer o modal de pantalla completa.
- Abrir mantiene foco en el botón; Tab accede a links. Escape cierra y devuelve foco al botón. Cerrar al navegar a un destino. No atrapar foco en un panel no modal.
- Link de salto a contenido visible al recibir foco. Anclas con `scroll-margin-top:24px`; scroll suave solo si el usuario no solicita movimiento reducido.
- Footer conserva contenido aprobado: misma alineación y escala; sin nuevos enlaces sociales o legales ficticios.

## Motion

- Solo feedback funcional. No animaciones de entrada, parallax, marquee, contadores, loops ambientales ni scroll hijacking.
- Color, fondo y borde: 150ms `ease-out`. Expandir menú puede ser inmediato; no necesita animación de altura.
- No animar `all`, layout, tamaño de texto ni posición de tarjetas.
- Indicador de envío opcional: giro de 800ms lineal solo mientras se envía; acompañar de texto. Con reduced motion, sustituir por indicador estático y texto.
- `prefers-reduced-motion: reduce`: desactivar animaciones, transiciones y scroll suave. El contenido y feedback permanecen completos.

## Responsive Rules

Breakpoints: móvil <768px, tablet 768–1023px, desktop ≥1024px. Probar también 320, 375, 768, 1024 y 1440px como anchos de control, no como únicos dispositivos admitidos.

| Elemento | Móvil | Tablet | Desktop |
| --- | --- | --- | --- |
| Navegación | Menú expandible | Menú expandible | Links visibles si caben |
| Layout dividido | Texto→visual apilado | Texto→visual apilado | 7/5 columnas |
| Grupo de 3 tarjetas | 1 columna | 2 columnas | 3 columnas |
| Formulario | 1 columna | Hasta 2 si corresponde | Hasta 2 si corresponde |
| Diagrama | Vertical con ramas | Vertical o compacto sin clipping | Horizontal con ramas |
| Acciones juntas | Apiladas y ancho completo | Fila con wrap | Fila con wrap |
| Padding de sección | 56px | 72px | 96px |

- El orden de lectura sigue el DOM y la arquitectura. No ocultar contenido para simplificar móvil.
- Nada de ancho/alto fijo para bloques de texto. No usar `100vw` dentro del container.
- Sin overflow horizontal a 320px ni al aumentar texto. Diagramas cambian composición; no se miniaturizan como una imagen.
- En zoom 200% deben seguir operables controles y navegación; en reflow equivalente a 320px no debe requerirse desplazamiento en dos ejes.
- Áreas táctiles mínimas de 44×44px, separadas al menos 8px cuando son controles independientes.
- No depender de hover, orientación apaisada ni gestos de swipe.
- Imágenes opcionales: dimensiones explícitas, `aspect-ratio`, `srcset`; contenido visible completo si contiene información. Nunca añadir stock photography para ocupar huecos.

## Accessibility

Objetivo: WCAG 2.2 AA. Es un criterio de implementación y revisión, no una certificación de este documento.

- Texto normal: contraste ≥4.5:1; texto grande ≥3:1; límites e indicadores esenciales de controles ≥3:1 respecto a superficies adyacentes.
- Verificar cada combinación efectivamente utilizada, incluidos hover, error, foco y fondos alternos. No aprobar solo la paleta aislada.
- Un H1 por página; jerarquía semántica sin saltos para conseguir tamaños. Usar landmarks header, nav, main y footer, y `lang=es`.
- Navegación y acciones operables por teclado; foco visible y nunca oculto. Sin tabindex positivo.
- Links comprensibles por su contexto. Links de texto dentro de párrafos siempre subrayados.
- Labels persistentes, mensajes asociados a campos, error explícito y feedback de envío anunciado.
- No comunicar categorías o estados solamente con color o icono; acompañar de texto.
- Respetar reduced motion, zoom, tamaño de texto y modo de colores forzados. En forced-colors usar `outline: 2px solid Highlight` para foco; no depender de box-shadow.
- Imágenes informativas con alt apropiado; diagramas con equivalente textual. Decorativos con alt vacío o aria-hidden.
- Confirmaciones en `role=status`; errores globales en `role=alert`. Evitar anuncios redundantes.
- Verificación mínima antes de entrega del sitio: recorrido completo por teclado, envío inválido/exitoso/fallido, zoom/reflow, comprobación automatizada de contraste y accesibilidad, revisión manual de labels y orden de lectura.

## Do

- Aplicar tokens compartidos; no resolver cada componente con estilos aislados.
- Hacer que cada elemento visual explique una relación o facilite una acción.
- Mantener copy, CTA y destinos aprobados; adaptar el contenedor a su longitud.
- Mostrar evidencia real con fuente y contexto cuando esté disponible.
- Priorizar HTML semántico y CSS; JS solo para interacción funcional.
- Alojar tipografía localmente y cargar solo recursos utilizados. No añadir framework de animación ni visualización para componentes estáticos.
- Reservar espacio para recursos antes de cargarlos y mantener estable el layout.
- Validar el resultado con contenido completo, móvil y estados de formulario, no solo con un hero vacío.
- Cuando falte contenido o integración, marcarlo como pendiente en documentación de desarrollo; no publicarlo como real.

## Don't

- No redefinir servicios, promesa, segmentos, arquitectura, CTA ni copy desde UI.
- No robots, cerebros, circuitos, partículas, neones, glassmorphism o degradados decorativos.
- No dashboards falsos, métricas de ejemplo presentadas como resultados, testimonios ficticios ni logos sin respaldo.
- No convertir cada sección en una cuadrícula idéntica de tarjetas.
- No usar cifras de ahorro o mejora sin evidencia y contexto aprobados.
- No superficies oscuras, tema alternativo o configurador de diseño en este MVP.
- No añadir chatbots, popups, widgets de WhatsApp, calendarios o formularios nuevos sin que estén en la arquitectura.
- No cambiar contenido por problemas de ajuste; no recortar labels ni esconder información en móvil.
- No interacciones decorativas, controles sin función, autoplay o navegación dependiente de hover.
- No introducir nuevos colores, radios, sombras o espaciados fuera de este sistema sin modificar sus reglas compartidas.
