# Validación GTM API readonly — 25/10/2026

Entorno: Windows, PowerShell, Python 3.12.14, venv local aislado; dependencias exactas en `requirements.lock.txt`. No se utilizaron credenciales reales ni se cambiaron recursos Google o código del sitio.

| ID | Estado | Evidencia y límite |
| --- | --- | --- |
| GTM-API-01 | PASS | 21 tests unittest, 0 fallos, ejecución fuera del sandbox. Siete listados con paginación y rutas GET verificadas mediante mocks; parents externos rechazados y redirects bloqueados. |
| GTM-API-02 | PASS | Mocks: OAuth desktop con PKCE/loopback/scope único; token expirado se renueva y persiste; scopes extra rechazados; errores de renovación saneados. No acredita OAuth real. |
| GTM-API-03 | PASS | Windows DPAPI real: roundtrip de bytes y archivo cifrado con secreto sintético, entrada corrupta rechazada, almacén dentro del repo rechazado. No se guardaron secretos reales. |
| GTM-API-04 | PASS | Mocks HTTP: 401 renovación única; 401 persistente falla; 403 sin retry ni cuerpo de error; 429 con Retry-After, backoff y límite; red y redirects fallan sin filtración; paginación repetida falla. |
| GTM-API-05 | PASS | CLI `check` con mock lista únicamente IDs/paths; excluye nombre/configuración/secretos sintéticos. CLI real sin credenciales sale con código 1 y mensaje de autorización faltante, sin traceback. |
| GTM-API-06 | PASS | `pip check`: No broken requirements found. Resolución fijada con `pip freeze` en lockfile; entorno aislado del gestor npm del sitio. |
| GTM-API-07 | NOT VALIDATED | `python gtm_readonly.py check`: falta token; no se consultaron cuentas Google. Requiere crear/importar cliente desktop y completar consentimiento por el propietario. |
| GTM-API-08 | NOT VALIDATED | Renovación, paginación y errores contra Google real. Pruebas locales usan mocks; validar con cuenta autorizada sin forzar límites ni revocar permisos innecesariamente. |

Comandos ejecutados desde la raíz:

```powershell
& tools/gtm_readonly/.venv/Scripts/python.exe -m unittest discover -s tools/gtm_readonly -p 'test_*.py' -v
& tools/gtm_readonly/.venv/Scripts/python.exe -m pip check
& tools/gtm_readonly/.venv/Scripts/python.exe tools/gtm_readonly/gtm_readonly.py check
```

Incidencias ambientales ejecutadas: creación de venv falló inicialmente en `ensurepip` dentro del sandbox, resuelta fuera de él; pip falló por DNS restringido, resuelto mediante instalación autorizada fuera del sandbox. La primera suite quedó detenida en prueba de almacén temporal dentro del sandbox y se interrumpió; la suite completa fuera del sandbox pasó en 0.037 s. No se alteraron pruebas para ocultar fallos.

BLOCKER GTM-API-07: José debe habilitar API, crear cliente OAuth desktop dedicado con scope readonly, importar su JSON externo y completar `auth`. Bloquea la conexión real de esta herramienta; no cambia los bloqueos de lanzamiento/medición del sitio.

SAFE ASSUMPTION: herramienta Windows local, un proceso por almacén; DPAPI de usuario actual y paginación secuencial. Metadatos de versiones vía version_headers, variables de usuario del workspace. No se implementa MCP, coordinación entre procesos ni contenido completo de versiones.

No acredita GTM Preview, transmisión o recepción GA4, consentimiento del sitio, despliegue ni producción. El directorio `src`, la instrumentación y dependencias npm no fueron editados por esta tarea; los cambios existentes antes de iniciarla se conservaron. Sin commit.
