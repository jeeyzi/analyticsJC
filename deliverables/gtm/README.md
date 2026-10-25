# Configuración GA4 — GTM-K5MZ4W66

## Implemented

Solicitud de José del 21/10/2026: modificar el JSON facilitado para configurar los eventos existentes y enviarlos a GA4. Se prepara un archivo local para importar; no se accede ni se publica en GTM. El original de Downloads permanece intacto.

Archivo: `GTM-K5MZ4W66_workspace3_GA4.json`. Destino existente conservado: `G-N0GCP60M3V`, etiqueta `dest_ga`; no se agrega una segunda configuración Google tag ni gtag.js.

17 variables: 13 Data Layer Variables v2, una constante Measurement ID, dos JavaScript de URL/referrer saneados y una JavaScript que omite form_id cuando no aplica. Cinco activadores Custom Event de coincidencia exacta, restringidos a page_type=home. Cinco etiquetas GA4 Event (`gaawe`), una por evento:

| Evento | Parámetros analíticos |
| --- | --- |
| click_to_action | page_type, cta_id, cta_location, target_id, form_id solo cuando aplica |
| form_start | page_type, form_id |
| form_error | page_type, form_id, error_type, field_name, error_code |
| form_submit | page_type, form_id, attempt_type |
| generate_lead | page_type, form_id, lead_type, lead_id, company_type, monthly_ad_spend |

Se respeta el CTA Continuar vigente con form_id opcional, según decisions.md y src/lib/measurement/events.ts. No se crean triggers de click, submit nativo, visibilidad ni History. La aplicación conserva la responsabilidad de emitir solo tras validación/accepted y deduplicar por lead_id; ONCE_PER_EVENT no deduplica dos pushes distintos.

Cada etiqueta de evento añade page_location sin query/hash y page_referrer solo origin como contexto de transporte. No se mapea user_data, contacto, texto libre, user_id, IDs privados de adquisición ni el objeto dataLayer completo. Se desactivan enableForm en ogt_auto_events y todas las opciones BOOLEAN de ogt_1p_data_v2 (incluidas recogida automática/manual y email/teléfono/dirección). El resto de la detección automática existente se conserva.

Fuentes actuales: docs/decisions.md, docs/measurement.md, docs/web-measurement-review.md y events.ts. Los textos antiguos incompatibles de measurement no se adoptan. No se modifica frontend, copy, backend, secretos ni flags de producción.

## Validated

GTM-J-01 PASS: `node deliverables/gtm/build-ga4.mjs` en Windows/Node v22.17.0. JSON parseable, IDs únicos, referencias de variables y activadores resueltas; destino original conservado; tablas con claves parameter/parameterValue; contratos por evento y ausencia de mapeo de contacto. Evidencia y SHA-256 en validation.json.

GTM-J-02 PASS local sintético: funciones de saneamiento de URL/referrer ejecutadas en VM y form_id no aplicable convertido a undefined. Estas pruebas no ejecutan las plantillas de Google ni acreditan requests reales.

GTM-J-03 PASS: original sin cambios; sin page_view manual ni nueva configuración base. Recogida automática de formularios y contacto desactivada en el archivo generado. No se ejecutan builds/tests del frontend al no modificarlo.

Referencias de Google: [eventos GA4 en GTM](https://support.google.com/tagmanager/answer/13034206?hl=es), [configuración del Google tag](https://support.google.com/tagmanager/answer/12131703?hl=es). Referencia primaria del autor de un contenedor exportado para la estructura gaawe/eventSettingsTable: [Addingwell](https://github.com/addingwell/gtm-container-web-shopify/blob/master/template.json).

## Not Validated

GTM-J-04 NOT VALIDATED: importación en la UI y compatibilidad del export optimizado gtagConfig con el workspace destino. No hay sesión GTM conectada utilizada en esta tarea. Una validación JSON no acredita importación.

GTM-J-05 NOT VALIDATED: Tag Assistant/Preview, orden de ejecución del destino/eventos, omisión efectiva de undefined, Network sin PII y recepción GA4 DebugView. No se ha enviado ningún evento a Google en este trabajo.

GTM-J-06 NOT VALIDATED: page_view automático inicial y navegación Next pathname/hash, configuración de adquisición/URL de ese page_view y ausencia de duplicados. Las variables de saneamiento de las cinco etiquetas de eventos NO cambian la configuración de página del destino existente.

GTM-J-07 NOT VALIDATED: consentimiento/revocación, dispositivos físicos, producción/campo y ajustes remotos del flujo GA4 que no aparecen en el JSON. NOT_SET no concede consentimiento ni demuestra que un tag esté bloqueado.

## Pending

José/administrador GTM: importar mediante Administrar → Importar contenedor, seleccionar un workspace de QA y **Combinar**; revisar la vista previa de cambios. Si se usa el workspace del export, sobrescribir entidades coincidentes deliberadamente para actualizar el destino y los ajustes globales. No elegir renombrar como solución automática: puede duplicar el destino. Revisar que gtagConfig conserve formularios y datos proporcionados desactivados. Si la UI omite esos ajustes, desactivarlos en Settings antes de probar contactos sintéticos. No publicar todavía.

José/administrador GTM: cerrar GTM-J-06 antes de probar URLs con datos personales o publicar. Configurar saneamiento previo al page_view automático en los ajustes compatibles del contenedor optimizado y verificarlo en Network. No adivinar un tipo ogt ni añadir otra config para suplir esa revisión.

José/administrador GA4: verificar que el Measurement ID corresponde al entorno de prueba autorizado; el JSON no permite distinguir QA de producción. Después de la importación, probar los cinco eventos con datos sintéticos en Preview, comprobar parámetros y recepción en DebugView. Si se requiere ver parámetros personalizados en informes, crear las dimensiones de evento necesarias; no registrar lead_id como dimensión de alta cardinalidad. Marcar generate_lead como evento clave solo desde GA4 según la configuración acordada; el JSON GTM no configura la propiedad.

H-07/H-08 y privacidad: resolver política/mecanismo de consentimiento antes de lanzamiento público. H-09 permanece parcial hasta importación, firing, recepción y readiness reales. La solicitud actual autoriza preparar el archivo, no publicar ni transferir user_data.

## Known Issues

El page_view automático original mantiene pendiente el saneamiento previo de URL/referrer: podría enviar query/hash o contexto no autorizado. Bloquea considerar este contenedor listo para publicación, aunque las cinco etiquetas añadidas tengan contexto saneado. También permanecen otras detecciones automáticas del original, que requieren revisar su payload y necesidad antes de lanzamiento.

Primer intento del generador FAIL: ENOENT por espacio de ruta codificado como %20. Corregido usando fileURLToPath; repetición PASS. No hay un fallo de importación observado porque esa prueba no se ha ejecutado. Las comprobaciones de referencias y allowlists son estáticas; no acreditan exclusión universal de PII ni recepción GA4.
