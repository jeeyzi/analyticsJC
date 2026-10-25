# Google Tag Manager API v2 — cliente Python local

Alcance autorizado el 25/10/2026: herramienta administrativa local, independiente de Next.js y del dataLayer. Solo `https://www.googleapis.com/auth/tagmanager.readonly`. No crea, edita, elimina ni publica recursos GTM. No modifica la configuración MCP de Codex ni reutiliza credenciales GA4/ADC. Codex puede ejecutar estos comandos de Python desde su terminal.

## Dependencias y entorno

Windows, Python 3.12 o posterior compatible con las dependencias. Entorno virtual independiente, gestionado con pip; no cambia npm ni el lockfile del sitio. `requirements.txt` declara rangos compatibles y `requirements.lock.txt` fija la resolución completa probada. Desde la raíz del repositorio, PowerShell:

```powershell
python -m venv tools/gtm_readonly/.venv
& tools/gtm_readonly/.venv/Scripts/python.exe -m pip install -r tools/gtm_readonly/requirements.lock.txt
& tools/gtm_readonly/.venv/Scripts/python.exe -m unittest discover -s tools/gtm_readonly -p 'test_*.py' -v
```

Si `python` es un alias de Microsoft Store, usa la ruta absoluta de un intérprete instalado. En este entorno se detectó Python 3.12.14 en `C:\Users\jose cubillo\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe`; puedes sustituir `python` por `& 'ruta absoluta/python.exe'`. No depende de Python 3.15 ni del entorno GA4.

## Configuración en Google Cloud (acción del propietario)

1. En [Google Cloud Console](https://console.cloud.google.com/), selecciona o crea un proyecto dedicado a esta herramienta de lectura.
2. En **APIs y servicios → Biblioteca**, habilita **Tag Manager API**.
3. En **Google Auth Platform**, configura el nombre de aplicación, correo de soporte y contacto real. Selecciona la audiencia que corresponda a tu organización; si es External y está en Testing, añade tu cuenta como usuario de prueba.
4. En **Data Access**, añade exclusivamente `https://www.googleapis.com/auth/tagmanager.readonly`. No añadas Analytics, Drive, OpenID, email ni scopes de edición/publicación.
5. En **Clients → Create client**, selecciona **Desktop app / Aplicación de escritorio**. Descarga el JSON de ese cliente. No uses una cuenta de servicio ni un cliente Web.
6. Guarda el JSON en una carpeta privada **fuera de este repositorio**, por ejemplo `%LOCALAPPDATA%\Codex\gtm-readonly-import\client_secret.json`. No lo adjuntes al chat, no lo pegues en un comando ni en `.env`, no lo sincronices con una carpeta pública. Restringe el acceso de esa carpeta a tu usuario desde las propiedades de seguridad de Windows.
7. La cuenta Google que autorices debe tener acceso de lectura a las cuentas/contenedores GTM correspondientes. OAuth no concede acceso a un contenedor al que tu usuario no está invitado.

El programa configura PKCE, `state` gestionado por la biblioteca, acceso offline y callback efímero `http://127.0.0.1:<puerto>/`. No requiere un servidor público ni registrar una URI Web. En aplicaciones externas en Testing, los refresh tokens pueden caducar a los siete días según la política de Google; volver a ejecutar `auth` es una recuperación prevista.

## Importar y autorizar sin compartir secretos

```powershell
& tools/gtm_readonly/.venv/Scripts/python.exe tools/gtm_readonly/gtm_readonly.py import-client "$env:LOCALAPPDATA/Codex/gtm-readonly-import/client_secret.json"
& tools/gtm_readonly/.venv/Scripts/python.exe tools/gtm_readonly/gtm_readonly.py auth
& tools/gtm_readonly/.venv/Scripts/python.exe tools/gtm_readonly/gtm_readonly.py check
```

`auth` abre tu navegador para que autorices directamente con Google. El proceso espera como máximo 180 segundos. No imprime la URL OAuth, código de autorización ni tokens. Si cancelas o caduca, repite `auth`. La importación no borra tu descarga original: después de confirmar que se importó, elimina de forma habitual ese JSON y cualquier copia de Descargas si no necesitas conservarlos en un almacén seguro.

El cliente y el token se almacenan cifrados en `%LOCALAPPDATA%\Codex\gtm-readonly\client.dpapi` y `token.dpapi`. DPAPI usa el usuario Windows actual, sin `CRYPTPROTECT_LOCAL_MACHINE`. Escritura atómica de blobs cifrados, sin temporales de texto plano. No hay fallback en claro. No se puede trasladar el almacén a otro usuario/equipo esperando que funcione. DPAPI no protege frente a procesos maliciosos ejecutados como el mismo usuario o administradores que controlen su sesión.

Los access tokens vencidos se renuevan y se persiste el resultado cifrado. Un 401 fuerza como máximo una renovación y un reintento. No utiliza consentimiento incremental y rechaza scopes adicionales. Usa un cliente OAuth dedicado para evitar grants previos compartidos. La revocación puede hacerse desde las conexiones de tu cuenta Google; después, `auth` solicita autorización otra vez.

## Consultas

```powershell
$gtmPython = 'tools/gtm_readonly/.venv/Scripts/python.exe'
$gtmScript = 'tools/gtm_readonly/gtm_readonly.py'
& $gtmPython $gtmScript accounts
& $gtmPython $gtmScript containers accounts/123
& $gtmPython $gtmScript workspaces accounts/123/containers/456
& $gtmPython $gtmScript tags accounts/123/containers/456/workspaces/7
& $gtmPython $gtmScript triggers accounts/123/containers/456/workspaces/7
& $gtmPython $gtmScript variables accounts/123/containers/456/workspaces/7
& $gtmPython $gtmScript versions accounts/123/containers/456
```

Los números son ejemplos sintéticos; usa los paths devueltos por la API. El ID público `GTM-...` no sustituye `containerId`. `check` lista todas las cuentas accesibles mediante paginación y devuelve sus IDs/paths, sin nombres. Cero cuentas con HTTP 200 es una conexión válida pero sin cuentas accesibles.

Funciones Python: `GTMClient(Auth(SecureStore()).load())` y métodos `list_accounts`, `list_containers(account)`, `list_workspaces(container)`, `list_tags(workspace)`, `list_triggers(workspace)`, `list_variables(workspace)`, `list_versions(container)`. Los métodos retornan las colecciones completas en memoria; pueden contener configuración sensible (Custom HTML, parámetros y nombres). No las vuelques en logs ni en el chat sin saneamiento. La CLI limita su salida a IDs/paths mediante una allowlist; no imprime nombres, código de tags ni parámetros. Las variables son las definidas por el usuario en el workspace, no `built_in_variables`.

`list_versions` devuelve metadatos `containerVersionHeader` desde `/version_headers`, el endpoint de listado de versiones en v2. No descarga cada versión ni lee su contenido completo.

## Paginación, errores y límites

- `nextPageToken` se sigue en las siete funciones; tokens repetidos o respuestas malformadas interrumpen con error saneado.
- Solo GET a un host fijo, parents numéricos validados, sin redirects. Los POST de OAuth se limitan a autorización/renovación; no son escrituras de recursos GTM.
- Timeout de conexión 10 s y lectura 30 s por intento; no es un plazo total del inventario. Llamadas secuenciales: mínimo 4.1 s entre solicitudes de cada instancia (cuota publicada 0.25 QPS por proyecto). Procesos/instancias adicionales comparten cuota y requieren coordinación externa.
- 401: renovar y reintentar una vez; persistencia del error exige reautorizar.
- 403: no se reintenta; revisar permisos, API habilitada y cuota. GTM también usa 403 para exceso de cuota, por lo que no equivale siempre a falta de permisos.
- 429: hasta cuatro reintentos con backoff exponencial y jitter; respeta `Retry-After` numérico o fecha HTTP hasta 60 s. Si pide más tiempo, falla sin adelantar el reintento. No reintenta automáticamente otros errores HTTP, problemas de red ni timeouts.
- Mensajes controlados; no se imprimen cuerpos de error, headers, tokens, URLs OAuth ni tracebacks. No activar debug HTTP/OAuth. El CLI desactiva los logs de dependencias en su proceso.
- Una instancia y un proceso por almacén durante OAuth/renovación. La sustitución de archivos es atómica; no se implementa coordinación multiproceso de refresh tokens.

## Validación y límites

Ver `validation.md` y `docs/validation-report.md`. Los tests sintéticos acreditan el comportamiento local, no la conexión Google. `check` es la prueba real y requiere cliente + consentimiento. No se valida disparo de tags, Preview, recepción GA4 ni producción con esta API.

## Fuentes oficiales

- [Autorización y scopes GTM](https://developers.google.com/tag-platform/tag-manager/api/v2/authorization)
- [OAuth para aplicaciones de escritorio](https://developers.google.com/identity/protocols/oauth2/native-app)
- [Biblioteca Python OAuth](https://google-auth-oauthlib.readthedocs.io/en/latest/reference/google_auth_oauthlib.flow.html)
- [Referencia API v2](https://developers.google.com/tag-platform/tag-manager/api/reference/rest/v2/)
- [Cuotas GTM](https://developers.google.com/tag-platform/tag-manager/api/v2/limits-quotas)
- [Windows DPAPI](https://learn.microsoft.com/en-us/windows/win32/api/dpapi/nf-dpapi-cryptprotectdata)
