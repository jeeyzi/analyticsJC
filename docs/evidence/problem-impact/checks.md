# Checks — Problem + Impact

13/10/2026, America/Santiago. Windows, Node v22.17.0, npm 10.9.2. Base `40a9e71` más cambios locales sin commit nuevo.

| Comando | Resultado |
| --- | --- |
| `npm run typecheck` en sandbox | Exit 1: SWC no puede canonicalizar jsc.baseUrl por Acceso denegado (os error 5). |
| `npm run typecheck` fuera del sandbox | Exit 0: next typegen + tsc --noEmit. |
| `npm run lint` | Exit 0: eslint . --max-warnings=0. |
| `npm run build` en sandbox | Exit 1: mismo error ambiental SWC al cargar next.config.ts. |
| `npm run build` fuera del sandbox | Exit 0: compilación y TypeScript aprobados; `/` y `/_not-found` estáticos. |
| `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3002` en sandbox | Exit 1 tras Ready: mismo error ambiental SWC. |
| Mismo start fuera del sandbox | Ready, build inspeccionado en navegador en 3002. Servidor de esta sesión detenido al finalizar. |
| `git diff --check` | Exit 0; avisos de normalización LF/CRLF no son errores de diff. |
| Get-FileHash contra source-manifest.json | Siete de siete hashes coincidentes; fuentes intactas. |
| Comparación content §Problem/§Impact contra DOM archivado | Título, introducción, tres H3, sus tres párrafos y cierre literales. Sin copy añadido. |

No se modificaron configuración, dependencias, lockfile, reglas o pruebas para ocultar errores. El build regeneró next-env.d.ts; restaurado al contenido de la base. No pruebas nuevas para presentación estática; verificación visual y DOM en browser.md.
