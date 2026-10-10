# Evidencia de checks de foundation

10/10/2026. Windows / Node v22.17.0 / npm 10.9.2. Carpeta AnalyticsJC, sin commit. Salidas resumidas del terminal de este chat, sin secretos ni datos de contacto.

| Comando | Resultado final |
| --- | --- |
| Get-FileHash de las siete rutas source-manifest.json | 7 Match=True |
| npm ci --fetch-retries=0 --fetch-timeout=30000 | exit 0; added 126 packages, audited 127; found 0 vulnerabilities |
| npm run typecheck | exit 0 fuera del sandbox; Types generated successfully; tsc sin errores |
| npm run lint | exit 0 sin warnings; repetido tras npm ci |
| npm run build | exit 0; Compiled successfully in 6.7s; TypeScript 6.0s; static pages 3/3; `/` y `/_not-found` static |
| npm run start | Ready in 524ms en 127.0.0.1:3000 |
| Invoke-WebRequest http://127.0.0.1:3000 | 200; X-Robots-Tag noindex,nofollow; H1Present=True; Spanish=True |
| npm ls eslint typescript --depth=1 | ESLint 10.12.0 y TS 6.0.3 deduped bajo typescript-eslint 8.71.1; sin invalid |

Fallos históricos ejecutados:

- npm view en sandbox: ENOTFOUND registry.npmjs.org. Fuera con permiso: exit 0.
- TS7/ESLint10 + preset Next: npm ls ELSPROBLEMS por peers fuera de rango. npm audit exit 1: 5 high en cadena eslint-config-next → plugin-next → fast-glob → micromatch → braces (GHSA-vfj7-8cjw-p6xm). ESLint 9.39.5 compatible pero deprecated/sin soporte. Se retiró preset y se fijaron ESLint10/typescript-eslint/TS6; npm ci final cero vulnerabilidades. Sin audit fix --force.
- Typecheck sandbox: SWC failed to canonicalize jsc.baseUrl, Acceso denegado os error 5. Mismo código fuera: PASS.
- HTTP sandbox: socket no permitido por permisos. Fuera: HTTP 200.

Browser: Network.requestWillBeSent tras reload, sin truncamiento: 9 requests same-origin. Console warnings/errors vacío. responsive.json conserva anchos efectivos tras screenshot. Tab→skip link→Enter enfoca #contenido. Reduce muestra scroll auto; forced colors outline visible. Overrides restaurados. Sin envíos ni datos personales.

Teardown: servidor de QA detenido mediante Ctrl+C (exit 1 de interrupción intencional, no fallo de aplicación); pestaña temporal cerrada. Las capturas permanecen en esta carpeta. Reiniciar con npm run dev para revisión local.
