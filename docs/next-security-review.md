# Actualización de seguridad Next.js — 23/10/2026

<!-- next-upgrade: security; path="." -->

## Implemented

Solicitud explícita: ejecutar `next upgrade --agent=security` y seguir instrucciones. Ejecución local vía `npx --no-install next upgrade --agent=security`; preparación requiere acceso npm fuera de sandbox. Herramienta canary16.5.0-canary.25 selecciona versión estable exacta16.4.3 para reemplazar16.4.0. Canary solo herramienta temporal, no dependencia del proyecto. Guías preparadas shared.md/same-major.md leídas; sin codemods, cambio major ni Future Defaults.

Comprobación de duplicados: checkout actual sin actualización equivalente, master única rama inicial, historial local y git worktree list revisados, búsqueda de marcadores/16.4.3/agentUpgrade sin equivalentes. git remote -v vacío: remotos/PRs no aplican; sin publicación. Worktree administrado next-security-16-4-3 desde HEAD, rama codex/next-security-16-4-3. Commit aislado a47d26a contiene solo package.json, package-lock.json y next.config.ts. Cambios previos no incluidos.

Se aplica también Next.js16.4.3 y política experimental.agentUpgrade=security al checkout local actual, conservando libphonenumber-js y todos sus cambios de UI/medición pendientes. npm10.9.2/Node22.17.0 y versiones React19.3.0 existentes conservadas. Lock actual solo añade el parche Next/env/SWC y su mínimo sharp^0.35.5 a los cambios previos; sin npm audit fix masivo. Sin cambios comerciales ni activación productiva.

Corrección de validación local: eslint.config.mjs declara structuredClone/URL/console readonly para deliverables/gtm/build-ga4.mjs, script Node existente no presente en HEAD aislado. No se ignora el archivo, no se modifica su lógica ni se alteran tests. Configuración solo reconoce globals reales del runtime.

Referencia primaria consultada: https://nextjs.org/blog/nextjs-security-update-october-14-2026 (parches desde16.4.1; CLI selecciona16.4.3 según política security/registro actual).

## Validated

Worktree baseline: npm install --save-exact next@16.4.3 exit0, versión Next.js v16.4.3; typecheck/lint/build PASS; 6/6 tests con --conditions=react-server PASS. Commit a47d26a guardado tras verificar. Sin credenciales ni integración externa en worktree.

Checkout actual: instalación exit0, Next.js v16.4.3, 31/31 tests PASS (evidence/next-security/tests.tap); npm audit exit0 y vulnerabilidades total0 (npm-audit.json). Estado de checks y servidor final en validation-report.md.

## Not Validated

Despliegue, GA4/Ads/GTM externo/Consent/privacidad, servicios Sheets y concurrencia/timeout reales no reejecutados por este parche. npm audit sin avisos solo refleja advisories conocidos al ejecutar, no certifica ausencia universal de vulnerabilidades. No se realizaron pruebas de explotación.

## Pending

Sin remoto no hay PR. Commit de actualización aislado disponible; checkout de trabajo mantiene otros cambios anteriores sin commit. Operación/privacidad/medición productiva conservan puertas existentes. Worktree se conserva adjunto para revisar el commit.

## Known Issues

Prueba navegador final: Home/formulario cargan en servidor16.4.3; CL9, scripts GTM HEAD y avance válido único sin API final. Console error observado solo404/favicon.ico (sin favicon), fuera del parche. Sin aviso de hidratación observado. typecheck/lint/build finales checkout actual PASS. Servidor local permanece en127.0.0.1:3000.

Primer intento sandbox no accede npm; reejecución con red autorizada completa preparación. Una repetición del comando durante espera generó dos IDs de tarea, sin doble instalación ni dos upgrades; reporte final usa solo el último ID. Tests iniciales baseline sin --conditions=react-server: FAIL por guard server-only; corregido comando, 6/6 PASS, sin tocar tests. Lint actual inicialmente FAIL por globals Node del script GTM existente; corrección declarativa descrita arriba. Runner emite advertencias experimentales/tipo módulo ya existentes.
