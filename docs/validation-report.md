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

---

## Completion Report — Design System base, 10/10/2026

Actualización incremental: la foundation anterior se conserva como informe histórico. Estado actual verificado: base commit `1a14f7f`, checkout limpio al iniciar; cambios de esta fase en working tree, sin nuevo commit. Windows / Node 22.17.0 / npm 10.9.2. QA en http://127.0.0.1:3000, Codex In-app Browser Chromium, desarrollo con flag explícito; build optimizado inspeccionado en disco. Sin deploy, proveedores, mocks ni medición. Sufijo `/DS` = subcaso acotado, nunca PASS global.

### Implemented

- Reutilizados tokens, Inter, Container, estilos H1/H2/H3, Header/Footer y Home mínima de foundation. Nuevos aliases de foco y transición con los valores de design; controles se incorporan a la transición consentida por preferencias del sistema.
- `components/ui/Actions`, `Field`, `Card` y sus CSS Modules; `layout/Section` y CardGrid; `styles/typography.module.css`. Fuentes: design (presentación), technical (CSS Modules y límites server/client), content (extractos de muestra) y wireframe (sin formulario implementado).
- Muestra claramente rotulada en `components/development`, solo development + `DESIGN_SYSTEM_PREVIEW=true`; sin ruta nueva, form, envío, almacenamiento o navegación comercial. `/` de build conserva contenido de foundation.
- Autorización en decisions, API/clasificación en design-system-review y procedimiento en README. Siete fuentes originales mantienen hashes. No nuevas dependencias, carpetas vacías ni cierres de hallazgos posteriores.

### Validated

Evidencia: [checks](evidence/design-system/checks.md), [responsive](evidence/design-system/responsive.json), [teclado y preferencias](evidence/design-system/keyboard.json), [contraste parcial](evidence/design-system/contrast.json), [Network](evidence/design-system/network.json), [Console](evidence/design-system/console.json). Capturas [320](evidence/design-system/320.png), [768](evidence/design-system/768.png), [1024](evidence/design-system/1024.png), [1440](evidence/design-system/1440.png), [foco](evidence/design-system/focus.png), [forced colors](evidence/design-system/forced-colors.png).

| ID / subcaso | Estado | Método / evidencia observada |
| --- | --- | --- |
| B-01/DS | PASS | Lectura y alcance registrados; SHA256 7/7 coinciden. No adopta otras propuestas. |
| B-03/typecheck-DS | PASS | next typegen + tsc strict, exit 0 fuera sandbox. |
| B-03/lint-DS | PASS | ESLint con max-warnings=0, exit 0. |
| B-03/build-DS | PASS | Build exit 0, static `/` y `/_not-found`; repetido con flag true, sin muestra en HTML/RSC. |
| B-04/DS, B-07/DS | PASS | Inspección código/rutas: primitives sin estado propio; único client nuevo es laboratorio. Sin API, formulario ni rutas comerciales añadidas. |
| B-06/carga-interacción-DS | PASS | Console warnings/errors vacío en cargas y toggle observados. No prueba flujos MVP. |
| R-01/muestra-DS | PASS | Anchos efectivos 320/375/767/768/1023/1024/1280/1440; scrollWidth igual al viewport, contenido sin recorte observado. Solo muestra. |
| R-02/DS | PASS | H1 36–56, H2 28–40; gutter 20/32/40; sección 56/72/96; input/select ≥48 y textarea 144, UI 16; grids 1/2/3 y 1/2/2; cards 24/32, radio 10, shadow none en serie cardMeasures. |
| A-02/teclado-primitives-DS | PASS | Tab en nueve destinos desde skip hasta textarea, Shift+Tab y Space en toggle; disabled omitido; foco doble visible. Recorrido estable con reduce, sin foco fuera del viewport. No menú/CMP. |
| A-03/asociaciones-DOM-DS | PASS | Labels for/id; ayuda/error por aria-describedby; error explícito y aria-invalid. Solo DOM, sin lector ni avisos funcionales. |
| A-04/default-error-disabled-DS | PASS | Contraste de texto usado 5.64–16.29; borde input 4.76; error con texto además de borde. Subconjunto calculado, no todos los estados. |
| A-05/botones-campos-preferencias-DS | PASS | Botones multilinea ≥48, input/select ≥48; reduce scroll auto/transition 0s/animation none; forced-colors outline visible sin shadow. No cubre todos los links/targets del MVP. |
| M-11/ausencia-integraciones-DS | PASS | Fuente y Network: sin GTM/GA/píxeles, requests locales GET. Ausencia no acredita tracking o consentimiento. |
| B-03/typecheck-build-sandbox-DS | FAIL ambiental, repetición PASS | SWC canonicalize jsc.baseUrl, Acceso denegado. Mismo código ejecutado con permisos fuera sandbox. |

### Not Validated

Los criterios globales de la matriz mantienen NOT VALIDATED; ninguno recibe PASS global por esta fase. B-02 instalación limpia nueva/CI; B-03 flujos críticos; R-01/R-02 Home/privacidad/formulario completos; R-03 zoom 200%; R-04–R-06 diagrama/barra/móvil físico; N-01–N-06 navegación/rutas finales; C-01–C-03; F-01–F-11; E-01–E-07; A-01–A-07 recorrido integral, lector/axe, hover/active completos y targets; S/P, M/CO/PR y D siguen fuera de esta evidencia. Los resultados históricos foundation no se recertifican por inferencia. No se acredita WCAG, performance, GA4, integración, producción o campo.

### Pending

| IDs | Responsable / condición | Bloquea |
| --- | --- | --- |
| FND-02 / FND-03 | José: label visible del menú y copy 404/privacidad adoptados. | Navegación/rutas finales, no primitives entregados |
| H-02 restante | José: adoptar decisiones aplicables antes del código dependiente. | Implementación de fases correspondientes |
| H-03/H-04/H-05/H-06 | José: proveedores/planes/regiones, contacto/dominio, privacidad, receptor y aviso reales probados. | Captación pública/lanzamiento |
| H-07/H-08/H-09 | José: política, CMP/copy/revocación y cuentas/configuración QA. | Medición |
| H-10/H-11/H-14/H-15 | José: parámetros/retries, mensajes HTTP, historial manual y OG. | API/formulario/operación/SEO respectivos |
| DS-03 / DS-04 | Codex al autorizar fase: estados funcionales, iconos, navegación/diagrama/cards adicionales solo si necesarios. | FUTURE, no esta fase |

### Known Issues

- Error ambiental SWC dentro sandbox reportado y repetido con éxito fuera; no se modificaron reglas/tests para ocultarlo.
- Primer arranque con puerto personalizado falló por forwarding npm/PowerShell; muestra validada en 3000. Connection refused inicial correspondía al puerto sin servidor. Procedimiento README usa script estándar.
- DevTools de Next aparece en las capturas y carga Geist local además de Inter; recursos de desarrollo, sin afirmar que pertenezcan a producción. Next generó cambios en AGENTS/next-env; retirado el bloque automático y regenerados tipos con build.
- La muestra muestra un error estático inicial y controles de prueba; no demuestra validación ni un formulario operativo. Activación de loading/feedback es futura.
- FND-02/FND-03 y bloqueos operativos existentes siguen abiertos. No hay Home completa, privacidad final, captación ni release. Sin fallos de layout detectados en la muestra y anchos revisados; no afirmación universal.

### Recommended Next Step

Revisar los primitives con la evidencia guardada y autorizar una fase acotada de composición de secciones de Home. Antes de incorporar navegación, cerrar FND-02; antes de rutas/captación, cerrar sus decisiones aplicables. No comenzar formulario, backend o medición por esta entrega.

# Completion Report — Header + Navigation

10/10/2026, America/Santiago. Base `0df3ab5` + cambios locales, sin commit nuevo. Windows, Node 22.17.0/npm 10.9.2. Chromium Codex In-app Browser, viewports emulados. QA: http://127.0.0.1:3000 con NODE_ENV=development y HEADER_NAVIGATION_PREVIEW=true; destinos sintéticos rotulados. Build optimizado comprobado por salida y HTML/RSC, sin deployment. Servidor QA detenido al finalizar.

### Implemented

- Header server, identidad a /#inicio, estructura responsive estática con Container/tokens existentes. HeaderNavigation client localizado: tres enlaces y CTA exactos, Button/TextLink/ActionLink del Design System, menú en flujo, aria-expanded/controls, Escape/cierre, foco al título al navegar y foco visible al cambiar breakpoint. Fuentes: product/wireframe/content/design/technical.
- `src/components/layout/Header.tsx`, Header.module.css, HeaderNavigation.tsx y HeaderNavigation.module.css; copy en site.ts. No modificaciones a primitives, dependencias o tooling.
- Composición de layout/page habilita nav exclusivamente en fixture de desarrollo HeaderNavigationPreview. Por HN-01 confirmado, build/página normal no muestran enlaces/CTA mientras falten destinos. No se implementó Hero ni secciones, formulario, backend, medición o integraciones.
- FND-02 cerrado por respuesta explícita: visible Menú, accesible Abrir menú/Cerrar menú. Registro y supuestos en [header-navigation-review](header-navigation-review.md); fuentes originales y matriz canónica preservadas.

### Validated

Subcasos de Header, sin PASS global del MVP. Evidencias: [checks](evidence/header-navigation/checks.md) y [navegador](evidence/header-navigation/browser.md). Capturas inspeccionadas en sesión, no PNG archivados. Sin servicios reales/mocks de captación.

| ID / subcaso | Estado | Método y evidencia |
| --- | --- | --- |
| B-01/Header | PASS | Fuentes completas, decisión de esta fase registrada y 7/7 hashes coincidentes. |
| B-03/typecheck-Header | PASS | next typegen + tsc strict exit 0, fuera sandbox, tras correcciones. |
| B-03/lint-Header | PASS | ESLint --max-warnings=0 exit 0, repetido final. |
| B-03/build-Header | PASS | Exit 0 fuera sandbox; build final con flag QA=true no incluye fixture, nav ni destinos pendientes en HTML/RSC. Solo / y /_not-found static. |
| B-04/Header, B-07/Header | PASS | Header/layout/página server; cliente localizado a navegación. Sin nueva ruta comercial, Hero, captación ni dependencia. |
| B-06/QA-Header | PASS | Console warn/error=[] en carga, menú, destinos, resize y mouse observados. |
| R-01/Header, R-02/Header | PASS | 320,375,767,768,1023,1024,1280,1440; clientWidth=scrollWidth. Menú abierto también sin overflow en cinco anchos inferiores a 1024. Desktop cabe con fuente/copy íntegros. |
| N-03/Header-fixture | PASS | Header static, identidad a inicio existente; tres enlaces y CTA a destinos sintéticos correctos. No acredita destinos de Home final. |
| N-04/Header-fixture | PASS | Enter/Space abre, Tab/Shift+Tab, Escape al botón, control cierra, cuatro anclas cierran/enfocan título; aria-controls coincide. Breakpoint conserva foco visible tras corrección. |
| C-01/Header-fixture, C-02/Header-fixture | PASS | CTA literal, enlace a único #diagnostico sintético, teclado y mouse; ningún envío/lead. |
| A-01/DOM-Header, A-02/foco-Header | PASS | Landmarks/nombre de nav, orden DOM, controles nativos, foco doble visible en el subconjunto ejecutado. No lector/recorrido integral. |
| A-04/default-Header | PASS | Contraste calculado: identidad 16.29, links/botón/CTA 6.70 sobre blanco; foco azul/blanco 6.70. Hover/active CTA ejecutados, coinciden con tokens. |
| A-05/targets-preferencias-Header | PASS | Identidad 44px alto, botón 49.6, links 48 y CTA 49.6/73.6; reduce scroll auto/0s, forced-colors outline visible sin shadow. |
| M-11/ausencia-integraciones-Header | PASS | Network CDP tras reload: 21 GET locales, sin GTM/GA/píxeles. Incluye Next/HMR/DevTools/Geist de desarrollo; no acredita consentimiento. |
| B-03/sandbox-Header | FAIL ambiental, repetición PASS | Typecheck/build: SWC canonicalize jsc.baseUrl, Acceso denegado. Fuera del sandbox pasó. |
| B-03/ref-Header | FAIL corregido | TS2322 por ref no admitido en primitive Button. Retirado sin cambiar el primitive; repetición PASS. |
| N-04/breakpoint-inicial-Header | FAIL corregido | Desktop→móvil dejaba foco en body. Corrección local conserva último foco interno y restaura al botón; repetición PASS. |
| B-03/diff-format-Header | FAIL corregido | Línea vacía en AGENTS tras retirar bloque generado; eliminada, git diff --check final PASS. |

### Not Validated

- N-02/N-03/N-04/N-05 y C-01 completos: faltan secciones/formulario reales; fixture no los acredita. Header normal contiene identidad/skip únicamente por HN-01.
- R-03 zoom 200% real; R-06 iOS Safari/Android Chrome físicos y paisaje; A-03 lector/A-07 axe y revisión WCAG integral. No certificación de accesibilidad. Navegación móvil con JS desactivado no probada; el control preparado necesita JS.
- R-01/R-02, A-01/A-02/A-04/A-05 y B-06 globales: solo subconjunto Header, no Home/privacidad/formulario/CMP.
- B-02 nueva instalación limpia/CI; B-03 pruebas críticas del MVP; N-01 rutas finales; R-04/R-05, N-06, C-03, F-*, E-*, S-*, P-*, M/CO/PR y D de integración/release siguen fuera de esta evidencia. No mock acredita servicios; sin producción/campo. Estados históricos no se recertifican por inferencia.

### Pending

| ID | Responsable / condición | Bloquea |
| --- | --- | --- |
| HN-04 | Codex en fase autorizada posterior: cuatro destinos reales únicos con encabezados y pruebas integradas; habilitar navigationReady en composición. | Navegación integrada y aceptación final; no componente preparado |
| FND-03, H-04/H-05/H-06 | José: copy/rutas finales, dominio/contacto, privacidad y receptor operativo. | Rutas/captación pública/lanzamiento |
| H-03/H-07/H-08/H-09/H-10/H-11/H-14/H-15 | José: decisiones/proveedores/configuración según registro vigente. | Fases correspondientes de medición/API/operación/SEO; no resueltos por Header |

### Known Issues

- Navegación completa intencionalmente no aparece en página normal/build hasta disponer de destinos. Esta fase prepara el componente y prueba fixture; no se declara Header integrado listo para producción ni lanzamiento completo.
- Typecheck/ref, foco breakpoint y línea vacía fallaron inicialmente y se corrigieron con repetición PASS. SWC falla dentro del sandbox Windows; checks fuera pasaron. No se alteraron tests ni reglas para esconder fallos.
- Primer browser abrió antes del servidor y dio conexión rechazada; repetición con servidor activo funcionó. Un wrapper no ejecutó Control+Home sobre body; se ejecutó desde identidad. Captura transitoria tras resize se repitió con estado estable. Límites de herramienta, no fallos de la app.
- Next dev añadió bloque a AGENTS y generó imports next-env; restaurados a la base al terminar, sin cambiar configuración. Sin fallos pendientes detectados en los estados de Header ejecutados; no afirmación universal.

### Decisions Needed

Ninguna decisión nueva pendiente para el componente preparado. FND-02 y HN-01 cerrados por José en este chat y trazados en header-navigation-review. Pendientes históricos del resto del MVP conservan sus puertas.

### Recommended Next Step

Revisar esta fase con su evidencia y autorizar por separado la siguiente composición de Home. Activar navegación en la página normal cuando existan sus destinos y ejecutar validación integrada; completar lector/axe/zoom/dispositivos antes de aceptar los criterios correspondientes. No iniciar Hero, formulario, backend o medición sin su fase autorizada.
