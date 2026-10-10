# Revisión previa de foundation

Fecha: 10/10/2026, America/Santiago. Responsable de implementación: Codex. Decisiones de negocio/operación: José Cubillo.

Lectura completa: AGENTS.md, decisions, handoff-review, strategy, product, wireframe, content, design, technical, measurement, acceptance raíz y validation-report. Los siete SHA-256 coinciden con source-manifest.json. Las siete fuentes originales se conservan sin cambios.

## Consistencia y alcance

Stack, server components, CSS Modules y tokens son coherentes con una base local de Next.js. El árbol técnico es un mapa incremental: exige no crear carpetas vacías. Se crearán solo app, componentes estructurales, content, styles y fuente utilizada. API, migraciones, formulario, menú, consentimiento y diagrama se incorporarán cuando se implemente su alcance; no habrá handlers ni integraciones simulados.

La solicitud actual autoriza foundation según decisions.md. No existe bloqueo para ese subconjunto. Una muestra local con identidad y H1 existentes permite revisar tipografía y layout sin desplegar la landing completa. No incluir navegación a anclas o privacidad aún no implementadas. Metadata local con texto existente, noindex y sin canonical/OG inventados. La compilación para revisión local no acredita autorización de producción.

## Clasificación

| ID | Clase | Hallazgo y acción mínima | Responsable / puerta |
| --- | --- | --- | --- |
| H-01 | SAFE ASSUMPTION | Carpeta local elegida por el usuario; resuelto para foundation. No inicializar remoto ni inventar commit. | Codex; Git/remoto pendiente para CI y versionado |
| H-02 | SAFE ASSUMPTION | Autorización explícita para foundation registrada; no adoptar automáticamente los pendientes operativos. | José; resto del MVP |
| FND-01 | SAFE ASSUMPTION | docs/acceptance.md no existía. Añadir referencia a matriz raíz; mantener IDs y exigencias originales. | Codex; resuelto documentalmente |
| H-03 | DECISION NEEDED | Stack base confirmado; planes/regiones, email, CMP y scheduler pendientes. Instalar solo dependencias usadas por foundation o aprobadas para validación. | José; integración/lanzamiento |
| H-04/H-05/H-06 | BLOCKER | Dominio, soporte, privacidad y receptor real faltan. No captación ni publicación; no mailto provisional. | José; captación y lanzamiento |
| H-07/H-08/H-09 | DECISION NEEDED / BLOCKER | Política/CMP/revocación pendientes; cuentas y ready callback ausentes. No implementar tracking en esta fase. | José; medición |
| H-10/H-14 | DECISION NEEDED | Límites, retenciones, retries e historial manual requieren adopción. | José; API/operación dependiente |
| H-11 | DECISION NEEDED | Existe Unconfirmed Reception, pero faltan retry y catálogo completo HTTP/CMP. El reporte previo exageraba la ausencia de texto incierto. | José; interacción del formulario |
| FND-02 | DECISION NEEDED | design pide botón «Menú»; content solo ofrece «Abrir menú»/«Cerrar menú». Resolver etiqueta visible antes de construir menú; foundation sin menú. | José; navegación interactiva |
| FND-03 | DECISION NEEDED | content no contiene copy de 404 ni texto completo de privacidad. Next aporta 404 técnico por defecto temporal; no se considera 404 final aprobado. | José; páginas completas |
| H-15 | DECISION NEEDED | OG necesita activo autorizado. Omitir OG/canonical en foundation local. | José; SEO de lanzamiento |
| H-16 a H-20 | SAFE ASSUMPTION | Mantener interpretaciones del handoff sobre columna de formulario, foco, loading, pestaña privacidad y unión de viewports. | Codex; al implementar componentes |
| H-21/H-22 | FUTURE | CRM, offline, BQ, precios, SLA y validación comercial fuera de foundation. | José; fases futuras |

## Contradicciones técnicas revisadas

Una exportación estática no serviría la API Node futura: conservar build estándar de Next. La transacción de lead+job y la notificación asíncrona son compatibles; no sustituirlas por email directo. Timeout tras commit exige estado incierto y replay, no el mensaje de fracaso definitivo. Revocación de tags ya ejecutados no garantiza ausencia de tráfico: H-08 sigue abierto. Los cinco nodos del diagrama caben con continuidad en dos filas, no requieren cambiar contenido. La petición de conservar label en loading se interpreta según H-18. Ninguno de estos puntos bloquea tokens/layout local.

## Ajustes mínimos de aceptación

Herramientas verificadas el 10/10/2026: Next 16.4.0, React 19.3.0, Zod 4.6.5, TypeScript 6.0.3, ESLint 10.12.0 y typescript-eslint 8.71.1. El primer intento con latest detectó TS 7 fuera del rango del parser y plugins de eslint-config-next incompatibles con ESLint 10. ESLint 9 apareció deprecated/sin soporte. Se usa ESLint 10 con recommended de core y typescript-eslint, sin preset Next: technical exige ESLint compatible, no ese preset. No se desactivaron reglas por un fallo de código. Las reglas específicas Next/JSX-a11y quedan pendientes de un preset compatible y de QA de accesibilidad al ampliar la UI. npm audit inicial tuvo cinco high transitivos de braces/fast-glob en el preset; retirado el preset, instalación final reportó cero vulnerabilidades. No usar audit fix --force ni bajar Next para conservar ese preset.

Verificación de soporte: [Next instalación](https://nextjs.org/docs/app/getting-started/installation), [Node Release](https://github.com/nodejs/Release), [typescript-eslint versiones](https://typescript-eslint.io/users/dependency-versions/) y metadatos engines/peerDependencies del registry npm. Node local 22.17.0 cumple los engines comprobados y su rama 22 está en Maintenance LTS; no se afirma que sea el último parche disponible.

No rebajar criterios del MVP. Registrar subcasos foundation bajo IDs existentes, dejando el criterio completo NOT VALIDATED cuando incluya formulario, privacidad, proveedores, CI o producción. B-02 exige instalación limpia y lockfile versionado: la instalación puede verificarse, pero sin Git no se acredita versionado. B-03 requiere flujos críticos del MVP: checks de foundation no equivalen a su PASS global.
