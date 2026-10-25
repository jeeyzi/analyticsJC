# Primer CTA y teléfono — 21/10/2026

## Implemented

Solicitud: evento de primer CTA y teléfono con prefijo/longitud. José confirma: solo al avanzar válidamente a Step2, selector países con Chile por defecto. decisions.md registra alcance y nombres técnicos de identificación. Sin nuevos eventos de pasos ni conversión por avance.

LeadForm valida Step1 y llama track(continueFormEvent) inmediatamente antes de changeStep(2). Contrato click_to_action ampliado de forma controlada: page_type=home, form_id=diagnosis_request, cta_id=continue_diagnosis, cta_location=form_step_1, target_id=diagnosis_step_2. Combinaciones cruzadas con CTA navegación rechazadas por Zod. Mapper GA4 local incluye solo esos parámetros, sin contacto. Dobleclick detail>1 no activa otra acción del botón que cambia de paso; Enter usa mismo submit validado. Volver/Continuar válido es una nueva activación; form_start no se reinicia. Submit final sigue su contrato POST.

PhoneField reutiliza Field/tokens/CSS. País y teléfono separados visualmente, prefijo fijo junto a entrada nacional; selector global de países soportados, nombres español, CL por defecto. Sin bandera remota/SDK ni geolocalización. Nuevo prefix opcional de Field no modifica otros campos. País solo estado UI: no nuevo dato comercial, columna, contexto analítico ni user_data.address.country. Cambio de país conserva dígitos, sin truncarlos; longitud incompatible impide avanzar hasta corregir. Retry congela phone como antes y deshabilita ambos controles.

libphonenumber-js1.13.15 exacto, npm/package-lock existentes; metadata min y APIs públicas Metadata/getCountries/getCountryCallingCode/parsePhoneNumberFromString. Sin índices internos/heurísticas de país. Import metadata usa wrapper JS exportado por paquete. Chile fijo/móvil9dígitos según [SUBTEL](https://www.subtel.gob.cl/de-manera-exitosa-ya-opera-en-chile-la-nueva-forma-de-marcar-desde-telefonos-moviles/); metadata general incluye servicios especiales9/10/11, por eso override CL explícito. Otros países usan máximo/longitudes posibles disponibles. No se impone patrón único global ni se certifica número real.

Entrada filtra dígitos y normaliza separadores al pegar; acepta +prefijo del país elegido sin duplicarlo, rechaza prefijo distinto sin auto cambiar país, no trunca pegados largos. maxlength nacional y guard de handler; un número demasiado largo conservado por cambio de país puede corregirse borrando. Prefijo siempre visible aunque teléfono vacío; ese valor inicial no se guarda como contacto ni genera eventos. `autoComplete=tel-national`, label y prefijo asociados a entrada para teclado/lector.

Schema compartido valida posibilidad/longitud de internacionales nuevos. Conservar teléfonos QA históricos sin + de8–15dígitos evita invalidar replay anterior; no se infiere país ni se cambia normalización de backend. La UI nueva siempre compone phone internacional. API/accepted/submission_id/Sheets/Acquisition no se rediseñan ni añaden columnas.

## Validated

Pruebas unitarias de longitudesCL9/US10/ES9/BR11, prefijo/paste/no truncado, schema cliente-servidor/compatibilidad legacy, combinaciones CTA y mapper sin PII. Suite anterior incorporada; resultados finales en validation-report.md.

Navegador local IAB Chromium con sintéticos: prefijo inicial+56 y maxlength9; vacío inválido→0CTA/0submit/0start; selecciónUS→+1/max10; typing10dígitos enCL deja9; Step1válido/dblclick→1CTA yStep2/0POST/0lead; Volver/seleccionarUS con9→error/CTA sin cambio; corregir10/Enter→segundoCTA válido/Step2; form_start total1. No se envió solicitud ni contacto a Sheets en estas pruebas. Evidencia browser.json sin valores de contacto.

Observación de herramienta: evaluate de Playwright redacciona .value como <redacted> y daba longitud10 aparente. Se midió longitud con Runtime CDP sin devolver dígitos y se verificó9 real. No ocultar fallo de UI por esa observación ni afirmar que la redacción era el valor real.

## Not Validated

Entrega/recepción en GA4, configuración GTM mapping, Consent/Privacy/producción/campo, existencia o titularidad telefónica, validez de cada plan/país con teléfonos reales, dispositivos táctiles físicos/lector completo. No se repitieron writes Sheets, concurrencia real o timeout tras commit: backend idempotente no cambió. Tests de contrato/mapping no acreditan proveedor real.

## Pending

José: configurar parámetros CTA nuevos en GTM si desea medirlos en GA4 y validar Preview/Network/DebugView sin PII. H-07/H-08/H-09/Privacy/lanzamiento mantienen sus puertas. Mantener metadata fijada y revisar cambios de numeración en futuras actualizaciones, sin prometer validación permanente.

## Known Issues

Revisión final detectó FAIL de hidratación: Intl.DisplayNames/ICU nombraba y ordenaba HK/MO distinto en Node y Chromium. LeadFormPreview ahora crea y serializa opciones españolas hacia LeadForm/PhoneField; no se calcula una segunda lista cliente ni se suprimen warnings. Repetición navegador en browser-final.json sin warnings/errors, controles y CTA PASS. Intento de suite sin --conditions=react-server falló por guard server-only; comando correcto repitió31/31PASS, sin cambios a tests.

Primeros tests FAIL por import attribute type=json: el paquete exporta metadata.min.json como wrapperJS. Se retiró atributo, tests repetidosPASS; no se alteraron pruebas para ocultarlo. Metadatos generalesCL permitían servicios especiales; acotados9por SUBTEL para campo contacto, cubierto por test. Mensajes de error siguen genéricos aprobados. Prefijo requiere hidratación para cambiar país; no cambia limitación previa de formulario con JS. Nueva dependencia suma metadata al bundle; no CWV/performance de campo acreditados.
