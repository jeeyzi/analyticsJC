# GTM en head — 21/10/2026

## Corrección vigente React/HMR

FAIL aportado por José: script JSX nativo en RootLayout dispara el error de React al renderizar/actualizar cliente. La prueba anterior de recarga había acreditado HEAD pero no cubría Fast Refresh; se conserva como evidencia limitada.

Implementación vigente: componente cliente GtmHead retorna null y en useEffect llama installGtmHead. Este crea el bootstrap ejecutable mediante DOM y lo agrega a document.head; el bootstrap inserta gtm.js también en head. No se devuelve script JSX ni se ejecuta script inerte de render React. Ambos nodos se mantienen por documento sin cleanup que reinicie GTM; guards evitan duplicación por Strict Mode/remount/HMR. La carga comienza después de hidratación; HTTP por sí solo no puede demostrar ubicación del DOM hidratado.

Evidencia browser-head-effect.json: recarga limpia con2nodos (uno bootstrap/uno contenedor) padres HEAD y1gtm.start; Fast Refresh confirmado por logs rebuilding/done, mismo performance.timeOrigin, HEAD preservado,1recurso GTM y0errors/warnings nuevos. No se recargó para ocultar el error de HMR ni se suprimió console.error. Sin formularios/PII enviados por estas pruebas.

Tests ahora incluyen instalador de efecto doble/Strict Mode/remount con4/4GTM; suite27/27. Typecheck/lint/build y artefacto producción comprobados de nuevo. HTTP actualizado exige ausencia de script JSX en head, ID local configurado y exclusión en producción; DOM se valida separadamente en navegador. http-client-head.json no sustituye evidencia histórica. Los apartados anteriores sobre script inline SSR/beforeInteractive son históricos y quedan obsoletos como implementación activa.

## Corrección vigente: script real en HEAD

José aporta captura con aviso «This GTM Snippet is not inside the HEAD element. It is in a BODY element». FAIL de ubicación de la implementación beforeInteractive previa. La referencia serializada dentro del HTML head NO probaba la ubicación del script ejecutado; el PASS HTTP histórico queda limitado a esa referencia, no DOM.

Corregido: layout renderiza script inline HTML nativo directamente en head, sin next/script/cola beforeInteractive para este bootstrap. El loader inserta gtm.js mediante document.head.appendChild, sin depender del primer script encontrado (que podía estar en body). Mismos gates/local/ID, array y dedupe; sin cambios de UI/Lead Flow/destinos/consentimiento.

PASS navegador IAB Chromium tras recarga: analyticsjc-gtm-bootstrap y analyticsjc-gtm-container tienen parentElement.tagName=HEAD; una instancia de cada uno, un gtm.js en dataLayer, un recurso gtm.js y una request con200. Contenedor registrado; warnings/errors vacíos, captura Network final sin truncación. Evidencia browser-native-head.json. No submits ni contacto. Nueva pestaña local válida aportada por el usuario permitió inspección; no se accedió a la pestaña de error previamente bloqueada.

Tests de gtm actualizados verifican head como destino incluso con un primer script body;3/3 PASS. typecheck/lint/build PASS en esta corrección. Script HTTP ahora exige una etiqueta script REAL id=analyticsjc-gtm-bootstrap en head y appendChild(head), no mera presencia del ID dentro de JSON. Resultado independiente http-native-head.json. Producción sigue excluyendo GTM QA; GA4/Consent/Preview completo pendientes.

Los apartados siguientes conservan implementación/evidencia anterior a esta corrección; beforeInteractive queda obsoleto para este bootstrap. H-09 no se cierra por ubicación correcta.

## Implemented

José proporciona snippet con GTM-K5MZ4W66 y solicita head. Autorización contextual para el local/QA existente, sin lanzamiento ni configuración de plataforma. decisions.md registra la adopción parcial de H-09; no se solicita otra aprobación para ese alcance.

src/app/layout.tsx usa next/script beforeInteractive en root head. src/lib/measurement/gtm.ts valida ID, requiere development + sitio local + NEXT_PUBLIC_WEB_MEASUREMENT_QA_ENABLED=true + GTM_QA_ENABLED=true. .env.development.local ignorado por Git configura NEXT_PUBLIC_GTM_ID=GTM-K5MZ4W66 y activa GTM_QA_ENABLED; .env.example documenta flag desactivado. No credenciales nuevas.

Snippet conserva la secuencia proporcionada: dataLayer existente, gtm.start/gtm.js, script async al primer script. Añade guard loopback, script con ID único y salida segura si array/DOM inválido. No reinicia el array; segunda evaluación no duplica carga. Root layout evita remontajes por página. next/script gestiona ejecución única según guía instalada de Next16.4, leída antes de editar.

Sin segundo gtag.js/config, Google/Ads/Meta tags de aplicación, CMP/defaults de consentimiento, noscript remoto o evento de página propio. Cargar gtm.js no registra readiness de Google tag. Lead Flow y payloads de medición no cambiaron. No se hicieron submits, escrituras Sheets ni pushes de contacto para validar este loader.

## Validated

- GTM-H-01 PASS: tests/gtm.test.mjs cubre gates/ID, producción aun con flags, ejecución repetida del snippet VM, mismo array, un solo gtm.start/script async, host externo y DOM inválido. VM no ejecuta GTM externo.
- Suite completa26/26 PASS; npm run typecheck/lint/build PASS. Build productivo sigue excluyendo medición QA; inspección de artefacto adicional en script HTTP.
- HTTP localhost200: bootstrap único en head, ID correcto y estrategia beforeInteractive. Archivo público de Google devuelve200,335081bytes en esta lectura. Sin referencias G-* detectadas por patrón estático; esto NO prueba ausencia de tags ni sustituye auditoría del contenedor.
- Evidencia saneada docs/evidence/gtm-head/http.json. Comando: node --use-system-ca scripts/gtm-qa-verify.mjs fuera sandbox; utiliza almacén de confianza Windows, sin desactivar TLS. Sin contacto en esa lectura.

## Not Validated

Ejecución real navegador, petición gtm.js desde navegador, Preview/Tag Assistant, versión/workspace/permisos/configuración de tags, destinos/firing, GA4 DebugView, automática page_view/AppRouter/hash, recogida automática user_data y exclusión real PII en tráfico de tags, GA IDs reales, Consent, producción/campo. H-09 no cerrado globalmente. Un container ID y HTTP200 no prueban GA4 instalado.

## Pending

José: conectar Preview/Tag Assistant y revisar qué tags/configuración tiene este contenedor antes de probar leads con contacto. No mapear user_data en GA4 ni activar recogida automática/Enhanced Conversions. La aplicación no configura ni garantiza comportamiento del contenedor remoto. Mantener pruebas sintéticas. GA4 Measurement ID y readiness real siguen pendientes; no inventarlos.

H-07/H-08/Privacy/Storage Governance y condiciones operativas bloquean lanzamiento. No publicar por esta solicitud. El loader es de desarrollo exclusivamente aunque se proporcionen flags/ID en producción.

## Known Issues

Lint inicial del script de verificación FAIL por AbortSignal/Buffer globales no declarados; corregidos mediante globalThis/import node:buffer. No se cambian tests ni regla global para silenciarlo.

Navegador: herramienta rechazó observar pestaña en página de error por política de URL; no se intentó otro navegador/raw CDP ni workaround. Por eso se inspeccionó HTML por HTTP sin automatizar esa página.

Servidor inicial en sandbox no respondía fuera; se detuvo solo el proceso iniciado para esta prueba y se inició fuera en3000. Intento previo con mismo puerto dio EADDRINUSE, resuelto al detener ese proceso. HTTP inicial falló por aislamiento; lectura Google falló por UNABLE_TO_GET_ISSUER_CERT_LOCALLY. Repetición con certificados de Windows PASS; TLS no deshabilitado. Warning filesystem lento al iniciar Next; no prueba de rendimiento.

GTM puede acceder al dataLayer compartido; instalar loader no verifica que tags remotos respeten la restricción de user_data. No se probaron formularios/contacto con este contenedor. Consent continúa DEFERRED y no se declara producción lista.
