# Preparación Vercel Preview QA — 25/10/2026

Estado: checks locales de preparación PASS; deployment externo y QA end-to-end en Vercel NOT VALIDATED. Objetivo Local → Preview HTTPS protegido → futura Production. Esta preparación no acredita recepción externa ni autoriza producción.

## Revisión inicial sin cambios

- Current Deployment Blockers: next.config rechazaba no-local; UI, adquisición, runtime, GTM y receptor dependían de development; Origin solo loopback; credencial solo archivo.
- Current Environment Model: local implícito; no Preview aprobado. NODE_ENV=production no distinguía build QA de producción.
- Current Google Credentials Strategy: archivo externo server-only y OAuth JWT; Sheet/tab por variables; batch atómico con namedRange y appendCells, lectura/reconciliación.
- Required Vercel Changes: gates QA explícitos, JSON privado, origen HTTPS exacto, formulario/medición en build QA, mantener noindex y protección.
- Security Risks: contacto restringido en dataLayer QA; mapping externo debe excluirlo de GA4. Preview requiere acceso restringido, fixtures sintéticos, Sheet privado separado, limpieza coordinada de filas+marcadores. Sin rate limit público durable, CMP ni política final.
- Proposed QA Deployment Architecture: Preview aprobado → Next Node /api/leads → OAuth → Sheets QA; browser → dataLayer → GTM → GA4 QA. Sin config Google duplicada ni dispatcher.

## Environment Variables Required

Configurar **solo en Preview**; no copiar secretos de QA a Production. Valores públicos quedan congelados al build; cambios requieren redeploy.

| Variable | Visibilidad | Preview | Local |
| --- | --- | --- | --- |
| NEXT_PUBLIC_SITE_ENV | Pública | qa | local |
| QA_DEPLOYMENT_ENABLED | Servidor, flag sin secreto | true | false/ausente |
| LEAD_FORM_PREVIEW | Servidor, flag | true | true para formulario |
| LEAD_SHEETS_QA_ENABLED | Servidor, flag | true | true para receptor |
| GOOGLE_SERVICE_ACCOUNT_JSON | **Secreto servidor** | JSON completo de cuenta QA | Opcional; si presente tiene prioridad |
| GOOGLE_APPLICATION_CREDENTIALS | Privada, ruta local | **No configurar** | Archivo externo existente |
| GOOGLE_SHEETS_SPREADSHEET_ID | Privada servidor | ID del Sheet QA privado | ID QA existente |
| GOOGLE_SHEETS_LEADS_TAB | Privada servidor | Nombre exacto tab leads | Existente |
| NEXT_PUBLIC_WEB_MEASUREMENT_QA_ENABLED | Pública | true para QA medición | Flag existente |
| GTM_QA_ENABLED | Servidor, flag | true para QA GTM | Flag existente |
| NEXT_PUBLIC_GTM_ID | Pública | Contenedor QA autorizado | Existente |
| NEXT_PUBLIC_MEASUREMENT_ENABLED | Pública | false | false |
| CRM_ENABLED | Servidor, flag | false | false |
| VERCEL_ENV / VERCEL_URL / VERCEL_BRANCH_URL | Sistema Vercel | Automáticas; habilitar exposición de variables sistema | No simular en uso normal |
| NEXT_PUBLIC_QA_BUILD_APPROVED | Pública, derivada por next.config | **No definir manualmente** | Derivada |

No variable GA4 Measurement ID nueva: destino configurado en GTM. No configurar GOOGLE_SHEETS_OFFLINE_EVENTS_TAB: dispatcher fuera de alcance. SITE_URL no requerido por esta implementación, no inventar dominio. HEADER_NAVIGATION_PREVIEW/DESIGN_SYSTEM_PREVIEW son laboratorios locales: dejarlos ausentes en Preview. Variables Supabase/email/jobs/CRM restantes de .env.example no se activan ni son requisito de este receptor QA.

## Local Behavior

npm run dev conserva archivo externo, flags opt-in y Origin/Host loopback HTTP. JSON privado opcional tiene prioridad; JSON inválido falla sin fallback. npm run build sin entorno QA genera foundation sin receptor activo. npm run start sigue ligado a loopback local; Vercel ejecuta su adaptador de Next, no ese servidor.

## Vercel Preview Behavior

Requiere conjuntamente siteEnv=qa, VERCEL_ENV=preview, aprobación QA y flags de cada función. Receptor exige HTTPS, Origin igual a Host y host en VERCEL_URL o VERCEL_BRANCH_URL; usar URL generada o alias de branch, no custom domains. No confiar en x-forwarded-host enviado por cliente. Esto no sustituye auth: activar Deployment Protection. No fallback a archivo de credenciales, localhost ni ruta Windows. maxDuration60s; timeout cliente puede ocurrir antes y conserva retry inmutable. No hay retry automático de escritura ni cola en memoria.

## Production Behavior / Remaining Production Blockers

Build rechaza VERCEL_ENV=production o siteEnv=production; API y Sheets también fallan cerrados. No promover artefacto QA ni usar --prod. Noindex de header y metadata permanece. Bloqueos: H-03/H-06 operaciones/infra y avisos; H-04/H-05 privacidad/contactos; H-07/H-08 Consent/CMP/revocación; H-10 Storage Governance/retención/borrado/backups. También rate limit/antispam público, capacidad/cuotas/marcadores Sheets, auditoría de mappings/URL GA4 y criterios release no validados. Responsables: José/proveedores y futuro implementador; cierre con decisiones y evidencia real, no flags.

## Google Credentials Strategy / Security Review

Service Account QA con acceso solo al Sheet privado requerido. Pegar JSON completo como secret privado en Vercel; conservar escapes JSON de private_key, no convertirlo en NEXT_PUBLIC ni configuración env pública de next.config. No imprimirlo en comandos/logs/docs. JSON inválido o ausente falla saneado; endpoint OAuth fijo y scope Sheets fijo. Nunca usar token_uri del JSON. Módulo server-only; API no devuelve credenciales ni errores de proveedor. .env*, .vercel y patrones comunes de credenciales ignorados; los nombres arbitrarios requieren seguir fuera del repo. Mantener credencial local fuera del directorio subido; .gitignore no reemplaza revisión del artefacto. Rotar si se detectara exposición. La excepción QA de user_data exige inspección Network y mapping remoto; no afirmar ausencia de PII en todo dataLayer.

## Exact Deployment Steps

1. Revisar diff y ejecutar instalación reproducible npm ci, npm run test, npm run typecheck, npm run lint y npm run build en checkout limpio. Versiones conservadas del lockfile; Vercel Node22.x (no garantiza patch local22.17.0).
2. En Vercel seleccionar equipo/proyecto QA correcto y preset Next.js, raíz del repositorio. Mantener variables de sistema disponibles. Configurar Install Command npm ci y Build Command npm run typecheck && npm run lint && npm run test && npm run build. No static export ni Output Directory personalizado.
3. Evitar deployment Production inicial: desactivar deploy automático de la rama Production durante preparación. Crear Preview desde rama QA o CLI autenticado con vercel (sin --prod), confirmando proyecto/equipo. No añadir dominio productivo.
4. Antes del deploy, activar Deployment Protection para Preview. Preparar Sheet QA con cabeceras exactas de docs/google-sheets-schema.md; compartirlo solo con la cuenta QA. Conservar marcadores de idempotencia. No modificar Sheets productivo.
5. Añadir variables de la tabla al scope Preview y secret JSON en la interfaz segura; nunca copiar .env.local a Git ni a archivos de despliegue. No definir NODE_ENV manualmente.
6. Crear deployment Preview. Revisar logs saneados y obtener URL HTTPS de ese deployment. Si cambia una variable pública o scope, redeploy. No promover ese artefacto a Production.
7. Ejecutar checklist siguiente con sesión autorizada de Deployment Protection. Registrar deployment ID/SHA/URL/entorno/fecha y evidencia saneada en validation-report. No registrar valores de campos/cookies/tokens/keys.

## Validated

36 tests, typecheck, lint, build Preview y npm ci en instalación limpia aislada PASS. Smoke HTTP del build: formulario/ancla únicos, noindex, validación API, fallo saneado de credenciales y bloqueo de build Production PASS. JSON/OAuth/Sheets probado con mock y RSA sintético; canario privado ausente en16 archivos cliente. Firmas de claves:0 coincidencias en327 archivos rastreados/11 commits. Evidencia y fallos iniciales de tooling en validation-report.md. /privacidad sigue404, pendiente fuera de esta preparación.

## QA post-deploy / Not Validated

- Verificar acceso bloqueado sin sesión; noindex header y meta; /, /privacidad, 404, teclado/responsive y ancla #diagnostico única.
- Network + Tag Assistant: GTM una carga, Google Tag único, page_view automático sin duplicación hash/rerender; GA4 QA/DebugView y cookies first-party. No enviar user_data, GA IDs privados ni query PII como params GA4.
- Confirmar analytics_identity_ready par real → snapshot privado → columnas existentes Sheet; ausencia no bloquea lead.
- Abrir /?utm_source=qa&utm_medium=test&gclid=Qa_Test&gbraid=Qa_Gb&wbraid=Qa_Wb#diagnostico; verificar valores dinámicos, no hash parser, no mezcla en retry.
- Enviar fixture sintético: validación cliente/servidor, accepted201 y confirmed_success solo con respuesta válida; replay200 mismo lead, conflicto409, concurrencia una fila/marcador, timeout tras commit y retry idéntico, generate_lead una vez por documento.
- Probar Origin externo403, content-type415, body413, receptor desactivado503; ningún éxito falso. Sin GTM/GA o errores analíticos, captación opera.
- Revisar ausencia de secretos en cliente/Network/logs; comprobar destino QA separado. Limpiar fixtures coordinando filas y marcadores bajo responsable. No ejecutar pruebas con PII de terceros.

Fuentes operativas verificadas: [variables de sistema](https://vercel.com/docs/environment-variables/system-environment-variables), [entornos](https://vercel.com/docs/deployments/environments), [Deployment Protection](https://vercel.com/docs/deployment-protection). Guías Next leídas desde node_modules/next/dist/docs. Estas fuentes no acreditan configuración de la cuenta del usuario.
