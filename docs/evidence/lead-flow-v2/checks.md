# Evidencia Lead Flow v2 — 19/10/2026

Windows, Node22.17/npm10.9.2. Working tree con cambios previos, sin commit nuevo. Solo local http://127.0.0.1:3000. No mock/proveedor/API/producción.

## Checks ejecutados

- node --experimental-strip-types --test tests/lead-draft.test.mjs: exit0, 3 tests PASS/0FAIL. Opcionalidad, seis obligatorios de paso1, inversión requerida, tres presupuestos aceptados, catálogos, Unicode/trim, límites y rechazo de campos retirados. Runner emite avisos experimentales/type-less ya conocidos; sin fallo de prueba.
- npm run typecheck: exit0, next typegen + tsc.
- npm run lint: exit0, max-warnings=0.
- npm run build: exit0, Next16.4.0/Turbopack, / y /_not-found estáticas. No endpoint de leads.
- git diff --check: exit0; avisos CRLF sin errores de whitespace. next-env generado restaurado al contenido previo tras build.

## Navegador — Chromium In-app Browser

Datos sintéticos, solo memoria. La captura step2.png no contiene contacto.

1. Continuar vacío: seis errores, permanece paso1 y foco Nombre.
2. Completar seis controles y Agencia: paso2, foco heading Paso2de2.
3. Submit sin radio: error, foco primer radio. No solicitud de recepción.
4. Flecha derecha desde primer radio selecciona segundo (USD2.000–5.000), foco en él; error desaparece.
5. Volver: paso1 con seis valores preservados y foco heading. Continuar: segundo radio conserva selección.
6. Submit con textarea vacío: mensaje exacto de validación LOCAL, no recepción confirmada. Opcionalidad observada.
7. Shift+Tab desde submit enfoca Volver. Sin navegación browser-back utilizada.
8. Console warn/error capturada por tab.dev.logs: []. Captura visual a viewport aproximado732x726; no recorte de campos/radios en vista observada. No sustituye matriz320/375/768/1024/1440 ni móvil físico.

Primer intento de rellenado con setValue no acreditó transición; se repitió con fill de controles y click con estado actualizado, obteniendo el resultado descrito. No fallo atribuido a aplicación sin evidencia.

## Inspección estática acotada

PII solo values React/control; UUID useRef con asignación ??= en edit/submit, no cambia al navegar pasos. No fetch/storage/logs ni analytics en componente. No garantía de idempotencia backend por esto; identidad no inspeccionada en runtime. No secretos configurados (.env.example único archivo env visible). No prueba exhaustiva de Network, storage o bundle con credencial sintética.

## NOT VALIDATED

Servidor/POST y límites body; normalización server; Sheets privado/acceso/persistencia; doble POST, concurrency, timeout/replay y idempotencia real; loading/error de red/uncertain/success. No se simulan esas pruebas sin receptor. Network/PII operacional/secretos integrados pendientes.

Responsive matriz completa, zoom, contraste medido de nuevos radios/estados, targets medidos, teclado móvil real/desktop exhaustivo, lector/axe. No recertificar PASS de formulario antiguo. GA4/GoogleAds/Meta/CMP/ConsentMode NOT VALIDATED y fuera de activación.
