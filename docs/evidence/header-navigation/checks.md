# Checks — Header + Navigation

10/10/2026, Windows, Node 22.17.0/npm 10.9.2, base 0df3ab5 + cambios locales sin commit. No cambios de dependencias, gestor, lockfile, versiones o configuración. Siete SHA256 de fuentes coinciden con manifest.

| Método | Resultado |
| --- | --- |
| npm run typecheck, sandbox | FAIL ambiental: SWC failed to canonicalize jsc.baseUrl, Acceso denegado (os error 5). |
| npm run typecheck, fuera sandbox, primer código | FAIL de código TS2322: ref no pertenece a ButtonProps. Corregido usando root del menú, sin alterar primitive. |
| npm run typecheck, fuera sandbox, final | PASS exit 0; next typegen + tsc --noEmit, repetido tras corrección de foco responsive. |
| npm run lint, sandbox | PASS exit 0, --max-warnings=0. Repetido para código final. |
| npm run build, sandbox | FAIL ambiental: mismo error SWC al cargar next.config. |
| npm run build, fuera sandbox | PASS exit 0. |
| HEADER_NAVIGATION_PREVIEW=true + npm run build, fuera sandbox, final | PASS exit 0; compilación 663ms, TS 1899ms, prerender 3/3. Rutas static / y /_not-found únicamente. NODE_ENV de build gestionado por Next. |
| HTML/RSC .next/server/app/index.html | Sin muestra QA, id=solucion/proceso/experiencia/diagnostico, href a anclas pendientes, nav ni control móvil. Identidad /#inicio y skip #contenido presentes. Flag true no publica fixture. |
| git diff --check | Primer control PASS; al retirar el bloque generado apareció FAIL por línea vacía final en AGENTS. Eliminada, repetición final PASS exit 0. Warnings de normalización LF/CRLF no son fallos de formato. |

Next dev añadió un bloque generado a AGENTS.md; se retiró sin cambiar las instrucciones originales. next-env cambió imports entre dev/types y types durante checks; se restauró el archivo de base tras terminar. Documentación local Next consultada: server-and-client-components y use-client. No se modificaron reglas, fuentes o tests para ocultar fallos. Servidor de QA detenido al terminar; sin deploy ni pruebas contra proveedores.
