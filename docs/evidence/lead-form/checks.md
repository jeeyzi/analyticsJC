# Checks — Lead Form local

13/10/2026 America/Santiago. Windows, Node 22.17.0/npm 10.9.2. Base 2d2766e + working tree. Sin commit nuevo ni despliegue.

- `npm run typecheck`: sandbox falló (SWC canonicalize jsc.baseUrl / Acceso denegado os error 5); mismo código fuera PASS exit 0, repetición final exit 0.
- `npm run lint`: inicial PASS; al agregar tests falló por dos variables destructuradas sin uso. Ajuste del fixture, sin omitir reglas/casos; final PASS exit 0.
- `npm run build`: sandbox FAIL ambiental SWC, repetido fuera PASS exit 0. Build final con LEAD_FORM_PREVIEW=true y HEADER_NAVIGATION_PREVIEW=true: PASS exit 0, / y /_not-found static. `build-gate.json`: laboratorio/formulario ausentes de HTML y RSC.
- `node --experimental-strip-types --test tests/lead-draft.test.mjs`: inicial 2 PASS/1 FAIL por barra invertida normalizada por URL; se corrigió schema para rechazar ambigüedad. Final 3 PASS/0 FAIL, exit 0. Warnings experimental/ESM del runner conservados como límite, sin cambios de dependencias/configuración.
- `git diff --check`: exit 0. `source-hashes.json`: 7/7 coinciden. Fuentes originales/dependencias/lockfile intactos. next-env generado restaurado al contenido base.
- Dev 3007 no arrancó porque existe otro next dev en 3000/PID 6924. Se conservó y reutilizó ese servidor con HEADER_NAVIGATION_PREVIEW activo; intento browser 3007 dio connection refused antes de resolverlo. Ninguna recepción simulada.

## Navegador

Chromium Codex In-app Browser, http://127.0.0.1:3000. Viewports emulados; no móvil físico ni QA productiva.

- Vacío: cinco errores literales, resumen alert y foco diagnosis-name. Corrección al editar elimina error correspondiente.
- Válido sintético: siete campos, cero errores; status explícitamente local, sin POST/lead/success.
- Email/URL inválidos: foco diagnosis-email, dos mensajes asociados y nombre conservado. `validation.json`.
- Tab/Shift+Tab: email→website→organization_type→ad_spend_context→crm_context→problem→BUTTON; vuelta a problem. `keyboard.json`.
- 320/375/768/1024/1440 y 767/1023/1280: scrollWidth=clientWidth (scrollbar ocupa 15 px); controles ≥48 px, fuente 16 px, una columna. `responsive.json`, `breakpoints.json`, cinco capturas de viewport. Capturas iniciales largas desalineadas se reemplazaron por vistas de viewport; sin atribuirlo a defecto UI.
- `contrast.json`: texto 16.29, ayuda 6.35, error 6.47/error sobre panel 5.91, borde 4.76, botón 6.70. Combinaciones actuales, no auditoría integral de estados.
- Console warn/error vacío: `console.json`. Network observado sin POST, sin destinos externos analytics; buffer no truncado en `network.json`/`network-final.json`.
- Runtime: dataLayer undefined; datos sintéticos no encontrados en local/sessionStorage ni URL. `privacy.json`. Inspección código: sin storage, console, fetch, secrets, GA/GTM ni atributos data con contacto. No acredita logs/DB/backend inexistentes.
- Sin JS: botón disabled y noscript explica limitación; `nojs.json`. JS restaurado, reload limpia fixture. Emulación responsive/reduced-motion restaurada; servidor preexistente conservado.

Loading, red lenta, doble POST, HTTP/API, uncertain/retry, success/accepted, servicios reales y medición no implementados ni simulados. Sin PASS global.
