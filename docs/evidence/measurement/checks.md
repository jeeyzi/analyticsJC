# Checks — Web Measurement local/QA

20/10/2026, Windows/PowerShell. No deployment ni commit nuevo. Resultados de comandos ejecutados sobre esta implementación:

| Comando | Resultado |
| --- | --- |
| node --conditions=react-server --experimental-strip-types --test tests/*.test.mjs | PASS23/23; repetición final con reporter TAP en tests.tap |
| npm run typecheck | PASS exit0, repetido tras integración |
| npm run lint | PASS exit0 final; error inicial arguments del bridge documentado/corregido |
| npm run build | PASS exit0 final; Home estática,404 y API Node; no deployment |
| node scripts/measurement-production-audit.mjs | PASS production-artifact.json |
| node --env-file=.env.local --conditions=react-server --experimental-strip-types scripts/measurement-evidence.mjs | PASS2fixtures reales/8replays existentes, sin nueva fila; acceso red autorizado fuera sandbox |
| mismo script con --security-only tras último build | PASS139assets/1log;0secretos,0marcadores contacto de fase en bundle/logs; sin repetir writes |
| git diff --check | PASS sin errores de whitespace |

Browser: browser-replay.json (CTA,cliente,timeout inducido201→retry200, dedupe,104entradas Network locales); browser-isolation.json (422/503mock,201real con push roto); responsive.json (dimensiones reales y repetición click). No se copió contacto a JSON/evidencia. Las capturas solo muestran confirmación sin datos del formulario.

GTM/GA4 externo, page_view automático real, fuente GA IDs, Consent/Privacy y producción/campo NOT VALIDATED. Los warnings Node strip-types/module type son preexistentes y no hacen fallar los comandos. Archivo temporal QA retirado, .env.local preservado, viewport/inyecciones restaurados y pestaña sintética cerrada. Dos filas QA permanecen para revisión y eventual limpieza coordinada fila+marcador por responsable.
