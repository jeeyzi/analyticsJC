"""Cliente local GTM v2: solo lectura, OAuth desktop y secretos DPAPI por usuario."""
from __future__ import annotations

import argparse
import ctypes
from ctypes import wintypes
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
import json
import logging
import os
from pathlib import Path
import random
import re
import sys
import tempfile
import time

import requests
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPE = "https://www.googleapis.com/auth/tagmanager.readonly"
SCOPES = [SCOPE]
BASE = "https://tagmanager.googleapis.com/tagmanager/v2/"
REPO = Path(__file__).resolve().parents[2]


class SafeError(Exception):
    """Mensaje controlado, sin cuerpos HTTP, URLs OAuth ni secretos."""


def outside_repo(path):
    path = Path(path).expanduser().resolve()
    if path == REPO or REPO in path.parents:
        raise SafeError("Las credenciales deben estar fuera del repositorio.")
    return path


def dpapi(data: bytes, decrypt=False) -> bytes:
    if os.name != "nt":
        raise SafeError("El almacén seguro requiere Windows DPAPI; no hay fallback en texto plano.")

    class Blob(ctypes.Structure):
        _fields_ = [("cbData", wintypes.DWORD), ("pbData", ctypes.POINTER(ctypes.c_ubyte))]

    buffer = ctypes.create_string_buffer(data)
    source = Blob(len(data), ctypes.cast(buffer, ctypes.POINTER(ctypes.c_ubyte)))
    target = Blob()
    library = ctypes.WinDLL("crypt32", use_last_error=True)
    kernel = ctypes.WinDLL("kernel32", use_last_error=True)
    function = library.CryptUnprotectData if decrypt else library.CryptProtectData
    function.argtypes = [ctypes.POINTER(Blob), ctypes.c_void_p, ctypes.c_void_p,
                         ctypes.c_void_p, ctypes.c_void_p, wintypes.DWORD, ctypes.POINTER(Blob)]
    function.restype = wintypes.BOOL
    kernel.LocalFree.argtypes = [ctypes.c_void_p]
    kernel.LocalFree.restype = ctypes.c_void_p
    if not function(ctypes.byref(source), None, None, None, None, 1, ctypes.byref(target)):
        raise SafeError("DPAPI no pudo proteger o recuperar las credenciales.")
    try:
        return ctypes.string_at(target.pbData, target.cbData)
    finally:
        kernel.LocalFree(target.pbData)


class SecureStore:
    def __init__(self, root=None):
        if root is None:
            local = os.environ.get("LOCALAPPDATA")
            if not local:
                raise SafeError("LOCALAPPDATA no está disponible.")
            root = Path(local) / "Codex" / "gtm-readonly"
        self.root = outside_repo(root)

    def _path(self, name):
        if name not in ("client", "token"):
            raise SafeError("Entrada de almacén no permitida.")
        return outside_repo(self.root / (name + ".dpapi"))

    def read(self, name):
        path = self._path(name)
        if not path.exists():
            return None
        return json.loads(dpapi(path.read_bytes(), decrypt=True))

    def write(self, name, value):
        encrypted = dpapi(json.dumps(value).encode("utf-8"))
        self.root.mkdir(parents=True, exist_ok=True)
        destination = self._path(name)
        fd, temporary = tempfile.mkstemp(dir=self.root, suffix=".tmp")
        try:
            with os.fdopen(fd, "wb") as stream:
                stream.write(encrypted)
            os.replace(temporary, destination)
        finally:
            if os.path.exists(temporary):
                os.unlink(temporary)


def validate_client(config):
    installed = config.get("installed", {})
    if not all(installed.get(k) for k in ("client_id", "client_secret")):
        raise SafeError("Se requiere un JSON OAuth de aplicación de escritorio (installed).")
    if installed.get("auth_uri") != "https://accounts.google.com/o/oauth2/auth" or installed.get("token_uri") != "https://oauth2.googleapis.com/token":
        raise SafeError("Endpoints OAuth de Google no válidos.")
    return config


class Auth:
    def __init__(self, store):
        self.store = store
        self.credentials = None

    def _save(self):
        self.store.write("token", json.loads(self.credentials.to_json()))

    def _validate_scopes(self):
        credentials = self.credentials
        granted = credentials.granted_scopes
        if set(credentials.scopes or []) != {SCOPE} or (granted is not None and set(granted) != {SCOPE}):
            raise SafeError("Credencial rechazada: debe autorizar exclusivamente tagmanager.readonly.")

    def load(self):
        data = self.store.read("token")
        if not data:
            raise SafeError("Falta autorización. Importa el cliente y ejecuta auth; consulta README.md.")
        # Nunca reutilizar credenciales de GA4/ADC ni tokens con permisos adicionales.
        if set(data.get("scopes", [])) != {SCOPE} or data.get("token_uri") != "https://oauth2.googleapis.com/token":
            raise SafeError("Token almacenado incompatible con esta integración de solo lectura.")
        self.credentials = Credentials.from_authorized_user_info(data, scopes=SCOPES)
        self._validate_scopes()
        if not self.credentials.valid:
            self.refresh()
        return self

    def refresh(self):
        try:
            self.credentials.refresh(Request())
            self._validate_scopes()
            self._save()
        except Exception:
            raise SafeError("No se pudo renovar la autorización. Ejecuta auth para autorizar de nuevo.") from None

    def authorize(self):
        config = self.store.read("client")
        if not config:
            raise SafeError("Falta cliente OAuth desktop. Usa import-client con un archivo externo al repo.")
        flow = InstalledAppFlow.from_client_config(validate_client(config), SCOPES,
                                                  autogenerate_code_verifier=True)
        try:
            self.credentials = flow.run_local_server(
                host="127.0.0.1", port=0, open_browser=True, timeout_seconds=180,
                authorization_prompt_message="", success_message="Autorización recibida. Puedes cerrar esta ventana.",
                access_type="offline", prompt="consent", include_granted_scopes="false")
            self._validate_scopes()
            if not self.credentials.refresh_token:
                raise SafeError("Google no entregó refresh token; vuelve a autorizar.")
            self._save()
        except SafeError:
            raise
        except Exception:
            raise SafeError("Autorización incompleta o cancelada; vuelve a ejecutar auth.") from None

    def token(self):
        if not self.credentials.valid:
            self.refresh()
        return self.credentials.token


class GTMClient:
    def __init__(self, auth, session=None, sleep=time.sleep, clock=time.monotonic, jitter=random.random):
        self.auth = auth
        self.session = session or requests.Session()
        self.sleep, self.clock, self.jitter = sleep, clock, jitter
        self.last_request = None

    def _get(self, path, params):
        renewed = False
        retries = 0
        while True:
            token = self.auth.token()
            # Cuota documentada: 0.25 QPS por proyecto. Otros procesos comparten esa cuota.
            if self.last_request is not None:
                self.sleep(max(0, 4.1 - (self.clock() - self.last_request)))
            self.last_request = self.clock()
            try:
                response = self.session.get(BASE + path, params=params,
                    headers={"Authorization": "Bearer " + token}, timeout=(10, 30), allow_redirects=False)
            except requests.RequestException:
                raise SafeError("Error de red o timeout al consultar GTM; no se registró la respuesta.") from None
            if response.status_code == 401:
                if renewed:
                    raise SafeError("HTTP 401: autorización rechazada después de renovar; ejecuta auth.")
                self.auth.refresh()
                renewed = True
                continue
            if response.status_code == 403:
                raise SafeError("HTTP 403: comprueba acceso GTM, API habilitada y cuotas del proyecto; no se reintenta automáticamente.")
            if response.status_code == 429:
                if retries >= 4:
                    raise SafeError("HTTP 429: límite de reintentos alcanzado; inténtalo más tarde.")
                delay = min(60, 2 ** retries + self.jitter())
                retry_after = response.headers.get("Retry-After")
                if retry_after:
                    try:
                        delay = float(retry_after)
                    except ValueError:
                        try:
                            delay = (parsedate_to_datetime(retry_after) - datetime.now(timezone.utc)).total_seconds()
                        except (ValueError, TypeError):
                            pass
                    if not 0 <= delay <= 60:
                        raise SafeError("HTTP 429: espera solicitada superior al límite local; inténtalo más tarde.")
                self.sleep(delay)
                retries += 1
                continue
            if response.status_code != 200:
                raise SafeError(f"HTTP {response.status_code}: consulta GTM no completada.")
            try:
                payload = response.json()
                if not isinstance(payload, dict):
                    raise ValueError()
                return payload
            except ValueError:
                raise SafeError("Respuesta GTM no válida; contenido omitido.") from None

    def _list(self, path, key):
        result, seen, params = [], set(), {}
        while True:
            payload = self._get(path, params)
            items = payload.get(key, [])
            if not isinstance(items, list) or any(not isinstance(item, dict) for item in items):
                raise SafeError("Colección GTM no válida.")
            result.extend(items)
            token = payload.get("nextPageToken")
            if not token:
                return result
            if not isinstance(token, str) or token in seen:
                raise SafeError("Paginación GTM inválida o repetida.")
            seen.add(token)
            params = {"pageToken": token}

    @staticmethod
    def _parent(value, level):
        patterns = {"account": r"accounts/[0-9]+", "container": r"accounts/[0-9]+/containers/[0-9]+",
                    "workspace": r"accounts/[0-9]+/containers/[0-9]+/workspaces/[0-9]+"}
        if not re.fullmatch(patterns[level], value):
            raise SafeError("Parent inválido: usa el path numérico de la API, no el ID GTM- público.")
        return value

    def list_accounts(self):
        return self._list("accounts", "account")

    def list_containers(self, account):
        return self._list(self._parent(account, "account") + "/containers", "container")

    def list_workspaces(self, container):
        return self._list(self._parent(container, "container") + "/workspaces", "workspace")

    def list_tags(self, workspace):
        return self._list(self._parent(workspace, "workspace") + "/tags", "tag")

    def list_triggers(self, workspace):
        return self._list(self._parent(workspace, "workspace") + "/triggers", "trigger")

    def list_variables(self, workspace):
        return self._list(self._parent(workspace, "workspace") + "/variables", "variable")

    def list_versions(self, container):
        # API v2 lista metadatos por version_headers; no existe versions.list en v2.
        return self._list(self._parent(container, "container") + "/version_headers", "containerVersionHeader")


def main(argv=None):
    # Bloquea logs de dependencias (OAuth, URLs y cuerpos nunca deben ir a logs).
    logging.disable(logging.CRITICAL)
    parser = argparse.ArgumentParser(description="GTM v2 local, exclusivamente readonly")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("import-client").add_argument("file")
    sub.add_parser("auth")
    sub.add_parser("check")
    sub.add_parser("accounts")
    for name in ("containers", "workspaces", "tags", "triggers", "variables", "versions"):
        sub.add_parser(name).add_argument("parent")
    args = parser.parse_args(argv)
    try:
        store = SecureStore()
        if args.command == "import-client":
            config = validate_client(json.loads(outside_repo(args.file).read_text(encoding="utf-8-sig")))
            store.write("client", config)
            print("Cliente desktop guardado con DPAPI fuera del repositorio.")
        elif args.command == "auth":
            Auth(store).authorize()
            print("Autorización readonly guardada con DPAPI.")
        else:
            client = GTMClient(Auth(store).load())
            name = "accounts" if args.command == "check" else args.command
            method = getattr(client, "list_" + name)
            items = method(args.parent) if hasattr(args, "parent") else method()
            # Salida intencional mínima; nunca imprime parámetros de tags/variables ni cuerpos HTTP.
            allowed = ("path", "accountId", "containerId", "workspaceId", "tagId", "triggerId", "variableId", "containerVersionId")
            print(json.dumps({"status": "ok", "count": len(items), "items": [
                {key: item[key] for key in allowed if key in item} for item in items]}, ensure_ascii=False, indent=2))
        return 0
    except SafeError as exc:
        print(str(exc), file=sys.stderr)
    except Exception:
        print("Operación no completada. Detalle sensible omitido; revisa configuración y README.md.", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
