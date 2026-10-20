# Project Instructions

Implementar el MVP especificado, sin reinterpretar negocio, UX, copy ni diseño. Idioma de interfaz e informes: español; conservar nombres técnicos del contrato.

## Source of Truth

Leer antes de editar:

- `docs/decisions.md`: confirmaciones explícitas y alcance; stack base, diagrama y form_start ya confirmados, no volver a pedirlos.
- `docs/handoff-review.md`: estado de las fuentes, conflictos, decisiones y bloqueos. No constituye aprobación de propuestas.
- `docs/strategy.md`: ICP, oferta, posicionamiento y restricciones comerciales.
- `docs/product.md` y `docs/wireframe.md`: páginas, secciones, rutas, campos e interacción.
- `docs/content.md`: texto de interfaz, mensajes y CTA.
- `docs/design.md`: tokens, componentes y responsive.
- `docs/technical.md`: stack, API, persistencia, seguridad y operación.
- `docs/measurement.md`: eventos, adquisición, IDs, consentimiento y destinos.
- `acceptance.md`: criterios de aceptación y evidencias.

Las propuestas restantes necesitan adopción registrada; las decisiones confirmadas en decisions.md ya la tienen. `docs/source-manifest.json` identifica el snapshot; no sustituye futuras decisiones. Si cambia una fuente, documentar revisión y actualizar aceptación afectada. No usar prompts antiguos, benchmarks o memoria como sustituto de especificaciones.

## Priorities

Preservar decisiones explícitas del usuario. Resolver cada dominio con su fuente: producto/UX→product y wireframe; texto→content; presentación→design; funcionamiento→technical; medición→measurement. Accesibilidad, privacidad e integridad de recepción deben cumplirse. Si dos obligaciones chocan, reportar y detener solo esa parte, sin resolverla silenciosamente ni alegar precedencia por fecha.

## Scope Rules

Solo landing `/`, `/privacidad`, 404 y endpoints definidos. Una acción comercial, un formulario, cinco campos obligatorios y dos opcionales; éxito inline. No añadir rutas comerciales, precios, SLA, equipos, pruebas sociales, promesas de ahorro, calendario, WhatsApp, chatbot, blog o dashboard. No construir CRM, sGTM, CAPI, MP, Ads/TikTok offline ni BQ en v1. Prohibido inventar contenido, contactos operativos, credenciales o aprobaciones.

## Development Rules

Antes de código dependiente, cerrar decisiones aplicables del registro. Continuar tareas independientes; registrar faltantes como BLOCKER, DECISION NEEDED, SAFE ASSUMPTION o FUTURE. Solo interpretaciones acotadas documentadas, sin alterar fuentes silenciosamente.

Usar stack adoptado, versiones soportadas verificadas, un gestor y lockfile. Interactividad localizada, contratos compartidos, secretos server-only. Persistir lead+job en una transacción; mantener request_id en reintentos y deduplicación por llave, nunca por email. No confirmar éxito sin accepted válido. No almacenar contacto en navegador ni logs. No habilitar email ficticio ni integración simulada como real. No publicar por este handoff: una solicitud de implementación/despliegue determina el alcance autorizado.

## Analytics Rules

Aplicar exactamente measurement y su política consentida adoptada. dataLayer único y track allowlisted; no PII ni valores de campos. GTM único, sin segunda config. Una page_view por pathname, ninguna por hash. generate_lead solo después de accepted y una vez por lead_id en vida de página. No convertir clic/submit en lead, no replay previo a consentimiento y no duplicar browser/server. Fallos analytics nunca impiden captación. Revocación debe seguir la decisión documentada; no prometer cero tráfico con tags ya cargados sin comprobarlo.

## Quality Rules

Ejecutar checks y flujos críticos de acceptance con datos sintéticos: concurrencia, timeout+replay, fallo de aviso, consentimiento, exclusión de PII, teclado y responsive. Probar servicios reales para acreditar integración. Inspeccionar Network además de dataLayer. No modificar tests para esconder un fallo ni afirmar WCAG/performance/GA/deployment sin evidencia. Mantener evidencia saneada por criterio en `docs/validation-report.md`.

## Definition of Done

Done exige scope implementado, fuentes adoptadas y coherentes, checks aprobados, criterios requeridos PASS y bloqueos correspondientes cerrados. NOT VALIDATED nunca equivale a PASS. Si faltan permisos, cuentas, dispositivo o datos de campo, entregar trabajo concreto con limitaciones; no declarar esa parte terminada. Implementación local no acredita producción. Release requiere las condiciones de Deployment y privacidad; medición desactivada es un alcance explícito, no analytics completado.

## Completion Report

Usar siempre estas cinco secciones:

### Implemented

Cambios concretos, archivos y fuente cumplida; commit cuando exista.

### Validated

IDs PASS/FAIL, comandos/métodos, entorno y evidencia; un fallo ejecutado se reporta también aquí y en Known Issues.

### Not Validated

IDs NOT VALIDATED, motivo y límite de la evidencia; distinguir mock, QA, producción y campo.

### Pending

Decisiones/dependencias por ID, responsable y condición para cerrar. Indicar si bloquean implementación, medición o lanzamiento.

### Known Issues

Fallos y limitaciones conocidos, impacto y siguiente acción. Si no se detectaron, indicar alcance revisado, sin afirmar ausencia universal.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
