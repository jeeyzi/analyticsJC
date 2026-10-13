# Hero de Home — revisión incremental

Fecha: 13/10/2026, America/Santiago. Base Git: `13fcac9`; checkout limpio al iniciar. Responsable: Codex. Autorización: solicitud explícita de José para implementar únicamente el Hero sobre el repositorio actual. Adopción limitada de las fuentes vigentes para este alcance local; sin publicación ni adopción de pendientes operativos del MVP.

## Reconciliación previa

Revisados AGENTS, strategy, product, wireframe, content, design, technical, measurement, decisions, handoff-review, acceptance raíz/referencia, validation-report y revisiones de Foundation, Design System y Header/Navigation. Las fuentes originales se conservan. La matriz raíz sigue siendo canónica; la evidencia nueva se desglosa por subcaso `/Hero`.

| ID | Clase | Decisión / interpretación acotada | Responsable / condición |
| --- | --- | --- | --- |
| HERO-01 | SAFE ASSUMPTION | Aplicar al Hero la puerta vigente HN-01: preparar el CTA exacto hacia `#diagnostico` y mostrarlo cuando exista el destino. En Home normal se mantiene oculto; no enlace roto, botón disabled ni ancla vacía. | Codex; habilitar al componer el formulario real y validar navegación integrada. Bloquea C-01 final, no el bloque de lectura. |
| HERO-02 | SAFE ASSUMPTION | Wireframe §01 define bloque de lectura, una columna y ningún visual requerido. El diagrama confirmado pertenece a §03 Solución; design define split 7/5 únicamente cuando esté previsto. Hero sin diagrama ni segunda columna; máximo de lectura 760px. | Codex; no trasladar el diagrama de una fase futura. |
| HERO-03 | SAFE ASSUMPTION | Eyebrow → H1 → supporting copy → audience → CTA cuando disponible → microcopy → identity. Textos literales de content §Hero, sin segundo botón. Typography y spacing existentes (16px entre textos; 24px antes del grupo de acción; padding first 40/56/72px). | Codex; jerarquía sustentada por wireframe/content/design. |
| HERO-04 | SAFE ASSUMPTION | Reutilizar únicamente para QA la muestra existente `HEADER_NAVIGATION_PREVIEW=true` + development: su destino sintético permite inspeccionar el CTA del Hero. No añadir fixture, sección comercial ni formulario. | Codex; pruebas de CTA sintético no acreditan diagnóstico real. |
| HERO-05 | FUTURE | Formulario/destino, barra móvil, diagrama de Solución y tracking del CTA. Header permanece intacto y con su puerta vigente. | Codex en fases autorizadas; no implementar aquí. |

## Implementación prevista

Hero Server Component con Section first, Container, typography, ActionGroup y ActionLink existentes. Contenido literal centralizado en site.hero. Sustituye la muestra de foundation en `/`; no nuevas rutas, dependencias, tokens, cliente, backend, tracking ni modificaciones al Header. La API `diagnosisReady` queda falsa por defecto; composición normal no la activa hasta disponer de destino real.

## Límites

Este alcance entrega el bloque de lectura y prepara su CTA; no acredita Home completa, recepción, integraciones, publicación, WCAG integral ni performance de campo. Resultados y pendientes en validation-report.
