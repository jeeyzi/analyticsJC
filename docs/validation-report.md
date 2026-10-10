# Completion Report — foundation local

Fecha: 10/10/2026, America/Santiago. Windows, Node 22.17.0, npm 10.9.2. Build optimizado en http://127.0.0.1:3000. Navegador: Codex In-app Browser (Chromium), viewports emulados; no dispositivos móviles reales. Commit: no existe; carpeta sin Git/remoto. Sin despliegue, mocks ni servicios de recepción.

Los sufijos `/foundation` identifican subcasos limitados de criterios existentes; no son nuevos requisitos ni PASS del criterio completo del MVP. Foundation implementada y checks locales aprobados; MVP y release no terminados.

### Implemented

- Next.js 16.4.0 App Router, React 19.3.0, TypeScript 6.0.3 strict; npm único, versiones exactas y package-lock.json. Zod 4.6.5 y server-only disponibles. Fuente: technical/decisions.
- `src/app/layout.tsx`, `page.tsx` y CSS Module: layout server, metadata literal de content, lang es, noindex y muestra mínima. Sin canonical/OG inventados ni landing completa.
- `src/components/layout`: Container, Header y Footer server; enlaces a destinos existentes, sin mailto provisional ni CTA sin formulario.
- `src/styles/tokens.css` y `globals.css`: paleta, escala espacial, radios, tipografía, gutters, breakpoints, foco, reduced motion y forced colors de design.
- `public/fonts`: Inter variable Latin local (uso 400–600), licencia y procedencia. `src/content/site.ts`: extractos literales del copy.
- `.env.example`, `.nvmrc`, `.npmrc`, TypeScript, ESLint y scripts locales; `next.config.ts`: headers básicos, rechazo de entorno no local y medición activada. No sustituye autorización de despliegue.
- Revisión en `foundation-review.md`; autorización acotada en decisions/handoff-review. `docs/acceptance.md` remite a matriz raíz. Siete fuentes originales intactas y hashes coincidentes.

### Validated

Evidencia: [checks](evidence/checks.md), [responsive.json](evidence/responsive.json), [Network](evidence/network.json), [Console](evidence/console.json), [DOM](evidence/dom.txt). Capturas: [320 px](evidence/foundation-320.png), [768 px](evidence/foundation-768.png), [1440 px](evidence/foundation-1440.png); también 375/767/1023/1024/1280.

| ID / subcaso | Estado | Método / resultado observado |
| --- | --- | --- |
| B-01/foundation | PASS | Lectura completa, 7/7 SHA256 coinciden; autorización local registrada. No adopta pendientes operativos. |
| B-02/instalación local | PASS | npm ci exit 0; 126 paquetes instalados, 127 auditados, cero vulnerabilidades. Lockfile presente, no versionado aún. |
| B-03/typecheck | PASS | npm run typecheck fuera del sandbox, exit 0; tipos generados y tsc sin errores. |
| B-03/lint | PASS | npm run lint, repetido tras npm ci, exit 0 sin warnings. Core/TypeScript; límites del preset abajo. |
| B-03/build | PASS | npm run build exit 0; compilación 6.7 s, TypeScript 6.0 s; `/` y `/_not-found` static. Sin pruebas API/formulario. |
| B-04/foundation | PASS | Build e inspección src: componentes propios server; sin CMS/ORM/estado global/animación. |
| B-06/carga local | PASS | Console en carga/reload/salto: warnings/errors vacío. No cubre flujos pendientes. |
| B-07/foundation | PASS | Comparar DOM/src/content/rutas: muestra `/`, wordmark, footer, skip link; sin campos/promesas añadidos. |
| R-01/foundation | PASS | Viewports efectivos 320,375,767,768,1023,1024,1280,1440; scrollWidth igual al ancho. Capturas guardadas. |
| R-02/foundation | PASS | H1 36px móvil, 44px a 768, 56px a 1280/1440; body 16/18px; gutters 20/32/40px. Un WOFF2 local, rango CSS 400–600. |
| N-01/home | PASS | HTTP 200 + navegador; H1 y lang es en HTML inicial. |
| A-01/foundation, A-02/skip link | PASS | Un H1/header/main/footer; Tab muestra skip link, Enter actualiza #contenido y enfoca main. No lector de pantalla. |
| A-05/preferencias | PASS | Emulación reduce: scroll auto; forced colors: outline visible. Overrides restaurados. |
| S-01/metadata local, S-02/HTML local | PASS | HTTP/DOM: title/description literales, lang es, noindex/nofollow y contenido SSR. Sin canonical placeholder. |
| M-11/foundation, P-03/fuente local | PASS | Network tras reload: 9 requests locales (documento, WOFF2, 2 CSS, 5 scripts Next). Sin GTM/GA/píxeles/fuentes remotas. No valida consentimiento. |
| D-08 | PASS | Informe con cinco secciones, IDs, evidencia y límites. |
| B-03/dependencias iniciales | FAIL, corregido | Peers inválidos TS7/ESLint10 con preset Next; audit con 5 high transitivos. Instalación final compatible y sin vulnerabilidades. |
| B-03/typecheck sandbox | FAIL ambiental, repetición PASS | SWC: canonicalizar ruta, Acceso denegado. Mismo código pasó fuera del sandbox. |
| N-01/HTTP sandbox | FAIL ambiental, repetición PASS | Socket bloqueado; mismo request fuera devolvió 200. |

### Not Validated

Estado global de criterios MVP: NOT VALIDATED salvo D-08; los subcasos anteriores acreditan únicamente foundation. Enumeración por grupos:

| IDs | Motivo / límite |
| --- | --- |
| B-01–B-07 | Adopción total, Git/lockfile versionado, CI, servicios privados y flujos críticos pendientes. Checks foundation ejecutados arriba. |
| R-01–R-06 | Muestra parcial; faltan privacidad, formulario, menú/barra/diagrama, zoom 200% y dispositivos iOS/Android. |
| N-01–N-06 | Solo home comprobada; privacidad, anclas, menú, soporte y 404 final pendientes. |
| C-01–C-03 | CTA/formulario/tracking no implementados en esta fase. |
| F-01–F-11 | Sin formulario, API, DB ni recepción; ningún mock acredita integración. |
| E-01–E-07 | Sin contratos adoptados/servicios para timeout, replay, errores y avisos. |
| A-01–A-07 | Semántica/foco parciales; faltan lector, axe, contraste de todos los estados, zoom y recorridos completos. Sin afirmación WCAG. |
| S-01–S-04 | Metadata local sí; faltan rutas, dominio, canonical, OG y preview protegido. |
| P-01–P-05 | Sin Lighthouse, análisis gzip completo ni campo; fuente local/prerender comprobados únicamente. |
| M-01–M-12 | Medición no implementada, sin cuentas/tags/GA4 QA. Ausencia de tags no acredita analytics. |
| CO-01–CO-07 | Política, UI/CMP y revocación pendientes; no consentimiento simulado. |
| PR-01–PR-07 | Sin captación/proveedores; privacidad, RLS, retención, API y CSP efectiva pendientes. Headers básicos no equivalen a PR-06. |
| D-01–D-07 | Sin infraestructura, Git/CI, publicación, smoke productivo, scheduler ni backup/restore. |

### Pending

| IDs | Responsable | Condición de cierre / puerta |
| --- | --- | --- |
| H-01/Git | José / implementador | Definir versionado/remoto para commit y CI; no bloquea revisión local. |
| H-02 restante | José | Adoptar decisiones pendientes antes del código dependiente; foundation autorizada. |
| H-03/H-04/H-05/H-06 | José | Plan/región/proveedores/dominio/contacto, privacidad final y receptor/aviso probados; bloquean integración/captación pública y lanzamiento. |
| H-07/H-08/H-09 | José | Mecanismo/copy/política/revocación, cuentas GTM/GA y QA; bloquean medición. |
| H-10/H-11/H-14 | José | Adoptar límites/retries/retenciones, catálogo HTTP/retry e historial; bloquean API/formulario/operación dependientes. |
| H-15 | José | Activo OG autorizado o alcance acordado; bloquea S-04. |
| FND-02/FND-03 | José | Label visible de menú y copy 404/privacidad; bloquean componentes finales. |
| H-21/H-22 | José | Fases futuras; no implementar aquí ni añadir promesas. |

### Known Issues

- `/privacidad` no existe; desconocidas usan 404 por defecto de Next con copy no aprobado y estilo propio. No aceptada como página final española. Cerrar FND-03 antes de construirla.
- No formulario, CTA, captación, backend, navegación de secciones ni medición: límite solicitado de foundation, no flujo operativo.
- Compatibilidad/auditoría iniciales fallaron y se corrigieron con la combinación documentada en foundation-review. No se modificaron tests para ocultar fallos. Preset específico Next/JSX-a11y pendiente de versión compatible; lint actual no sustituye QA de accesibilidad.
- SWC y socket fallaron en sandbox Windows; repetidos fuera con éxito. Instalación requiere red autorizada.
- npm ls lista dos opcionales Sharp como extraneous (`@emnapi/runtime`, `@img/sharp-wasm32`) incluso tras npm ci; exit 0 y build correcto, sin peers inválidos. Revisar al cambiar npm/plataforma; esta base no procesa imágenes.
- Sin Git/commit/CI. Noindex no protege preview público; no publicar esta base. CSP, privacidad y operación productiva pendientes.
- Primer muestreo responsive leyó tamaños previos al repintado. Se repitió con screenshot antes de medir; las ocho filas conservadas tienen requested=width. No fallo de layout.
- Sin evidencia de campo, proveedores ni accesibilidad completa. Limitaciones futuras de idempotencia, avisos y revocación del handoff siguen vigentes.
