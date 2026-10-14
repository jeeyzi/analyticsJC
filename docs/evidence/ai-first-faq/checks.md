# Checks — AIFirstFAQ

13/10/2026, Windows, Node 22.17.0/npm 10.9.2. Base Git `751bbb3`; cambios locales sin commit. Sin actualización de dependencias.

- Siete SHA-256 coincidentes con source-manifest: source-hashes.json.
- `npm run typecheck`: primer intento FAIL ambiental, SWC canonicalize jsc.baseUrl / Acceso denegado (os error 5), exit 1. Repetición fuera del sandbox PASS, exit 0; next typegen y tsc --noEmit.
- `npm run lint`: PASS, exit 0, max-warnings=0.
- `npm run build`: PASS fuera del sandbox, exit 0; compilación y TypeScript completos, `/` y `/_not-found` prerenderizados.
- Inicio mediante `npm run start -- --port 3006`: FAIL de comando; npm transmitió 3006 como directorio. Inicio directo `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3006`: PASS, build disponible en localhost. Navegación inicial antes del servidor: connection refused; nueva carga con servidor activo PASS. No cambios de código/configuración para esconder los fallos.
- next-env.d.ts generado por build restaurado a su base; no cambio de configuración.
- `git diff --check`: PASS, exit 0. Archivos de secciones anteriores, siete fuentes, matrices de aceptación, dependencias y lockfile sin modificaciones. Build local de esta sesión detenido al finalizar.

Esta evidencia acredita los checks de esta fase, no B-03 global ni flujos de captación, CI, servicios reales o deployment.
