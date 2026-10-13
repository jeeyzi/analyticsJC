# Checks — Hero, 13/10/2026

Base `13fcac9` + working tree sin commit nuevo. Windows / Node v22.17.0 / npm 10.9.2. No dependencias actualizadas.

| Comando / método | Resultado |
| --- | --- |
| `npm run typecheck` en sandbox | FAIL ambiental: SWC canonicalize jsc.baseUrl, Acceso denegado (os error 5). |
| `npm run typecheck` fuera sandbox | PASS, exit 0; next typegen + tsc strict. |
| `npm run lint` (inicial y final) | PASS, exit 0; ESLint max-warnings=0. |
| `npm run build` fuera sandbox | PASS, exit 0; compilación, TypeScript y prerenderizado `/` y `/_not-found`. |
| `git diff --check` | PASS, exit 0. |
| SHA256 de las siete fuentes vs source-manifest.json | PASS, 7/7 coincidentes. |
| Inspección de archivos/imports | Hero server; sin rutas, dependencias, tokens, formulario, integraciones o cliente nuevos. Header/layout sin cambios. |

Servidor QA preexistente: 3000, development + HEADER_NAVIGATION_PREVIEW=true. Servidor de build normal: `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3001`. Solo loopback, sin deployment. Intento previo `npm run start -- --port=3001`: FAIL de arranque, npm omitió argumento y trató de usar 3000 ocupado (EADDRINUSE); comando directo funcionó. No fallo de aplicación.

Next regeneró next-env hacia tipos de build; se conserva el contenido previo al finalizar. No cambios a AGENTS ni fuentes originales.
