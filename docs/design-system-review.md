# Design System base — revisión incremental

Fecha: 10/10/2026, America/Santiago. Implementador: Codex. Base: `1a14f7f`, checkout limpio al comenzar. Foundation conservada; esta fase no acredita Home completa ni release.

## Fuente y alcance

Autorización registrada en decisions.md. Se implementan Typography, Color System, Layout/Container/Grid, Spacing, Border Radius/Borders/Shadows, Buttons, presentación base de Forms, Cards y preferencias de Accessibility/Motion de design.md. Las siete fuentes del snapshot no se reescriben. La matriz raíz conserva sus estados globales; validation-report añade únicamente subcasos.

Tokens, Inter local, Container, Header, Footer, metadata y muestra original se reutilizan. Los nuevos tokens `--focus-ring`, `--motion-duration` y `--motion-easing` nombran valores ya especificados. No se añaden colores, dependencias, rutas, secretos ni servicios.

## API mínima reutilizable

- `Actions.tsx`: Button (type button por defecto), ActionLink (href obligatorio), TextLink subrayado y ActionGroup. Primary/secondary, hover/active/disabled, labels multilínea; ancho móvil en grupos. La aplicación futura decide copy, destinos y handlers. Ningún enlace disabled ficticio.
- `Field.tsx`: input/select/textarea nativos con id y label obligatorios, help/error opcionales, asociación aria-describedby y aria-invalid. Error estático provisto por el consumidor; no valida, no captura, no envía, no almacena. No añade resumen, máquina de estados ni controles CMP.
- `Card.tsx`: tarjeta informativa sin hover, interacción, sombra o alturas fijas. Acciones/cards interactivas no necesarias en esta fase.
- `Section.tsx`: sección semántica con padding estándar/primer bloque; CardGrid de 2/3 columnas. Reutiliza gutters/gaps y no altera orden DOM ni estira la tarjeta restante.
- `typography.module.css`: lead/body/UI/caption/eyebrow, identificadores técnicos, ancho de lectura y separación título-texto. H1/H2/H3 y fallback existentes continúan en globals/layout.

Muestra en `components/development/DesignSystemPreview.tsx`: solo con `NODE_ENV=development` **y** `DESIGN_SYSTEM_PREVIEW=true`. No hay ruta de laboratorio; `/` conserva la foundation y anexa la muestra solo bajo ese flag. Los enlaces internos son recorridos del laboratorio, no el menú ni anclas comerciales. Las etiquetas descriptivas de prueba no pertenecen a content/site ni a producción. Contiene cuatro controles aislados, sin elemento form ni receptor; no es diagnosis_request. El botón alterna disabled exclusivamente en un control de prueba. El error visible demuestra presentación, no validación de un intento.

## Clasificación

| ID | Clase | Interpretación / pendiente | Responsable / puerta |
| --- | --- | --- | --- |
| DS-01 | SAFE ASSUMPTION | Flag explícito + development para aislar la muestra sin añadir rutas. Etiquetas del laboratorio describen primitives; textos comerciales/campos son extractos literales. | Codex; fase local |
| DS-02 | SAFE ASSUMPTION | Hover de control oscurece borde con color-text, token existente; design exige estado hover pero no fija su color. No modifica radio, dimensión ni copy. Padding de tarjeta tablet conserva panel-padding de foundation (24px), hasta desktop (32px). | Codex; interpretación acotada revisable |
| DS-03 | FUTURE | Loading, indicador/avisos de envío, resumen, validación, feedback success/uncertain y foco de recepción dependen de la fase formulario y sus decisiones. No implementar por tener primitives. | Codex/José; formulario |
| DS-04 | FUTURE | Menú/sombra de menú, iconos Lucide, split 7/5, diagrama y cards interactivas se incorporarán cuando un componente del alcance los necesite. Tokens existentes conservados, sin librerías ni componentes anticipados. | Codex; fases correspondientes |
| FND-02 | DECISION NEEDED | Etiqueta visible de menú sigue sin resolución; no se implementa navegación funcional. | José; navegación |
| FND-03 | DECISION NEEDED | Copy 404 y privacidad final pendientes; 404 técnico de Next permanece temporal. | José; rutas finales |
| H-04/H-05/H-06 | BLOCKER | Contacto/dominio, privacidad, receptor y avisos reales siguen pendientes. | José; captación pública/release |
| H-07/H-08/H-09 | DECISION NEEDED / BLOCKER | CMP/política/revocación y cuentas QA no resueltas. | José; medición |
| H-10/H-11/H-14/H-15 | DECISION NEEDED | Parámetros, copy HTTP/retry, historial y OG no se resuelven aquí. | José; fases dependientes |

## Límites

PASS de responsive/teclado/styles corresponde a esta muestra local, con viewport emulado. No implica revisión de Home completa, privacidad, lector, axe, zoom 200%, móvil físico, performance, GA4 ni producción. Network de desarrollo incluye HMR/DevTools y su fuente Geist local, además de Inter; no se describe como tráfico de producción. El primer muestreo de foco leyó posiciones antes de terminar scroll suave; se repitió con reduce y repintado antes de medir, conservando el registro estable. El primer selector de CSS Modules no encontró grids; se verificaron después por display:grid y sus hijos reales, sin confundir ausencia de selector con prueba de layout.
