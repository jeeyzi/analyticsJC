import contextlib
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import Mock, patch

import gtm_readonly as g


def response(status=200, body=None, headers=None):
    result = Mock(status_code=status, headers=headers or {})
    result.json.return_value = body if body is not None else {}
    return result


class ClientTests(unittest.TestCase):
    def client(self, responses):
        auth = Mock()
        auth.token.return_value = "synthetic-secret"
        session = Mock()
        session.get.side_effect = responses
        sleep = Mock()
        return g.GTMClient(auth, session, sleep=sleep, clock=lambda: 10, jitter=lambda: 0), session, auth, sleep

    def test_all_lists_paginate_and_only_get(self):
        cases = [("accounts", [], "accounts", "account"),
                 ("containers", ["accounts/1"], "accounts/1/containers", "container"),
                 ("workspaces", ["accounts/1/containers/2"], "accounts/1/containers/2/workspaces", "workspace"),
                 ("tags", ["accounts/1/containers/2/workspaces/3"], "accounts/1/containers/2/workspaces/3/tags", "tag"),
                 ("triggers", ["accounts/1/containers/2/workspaces/3"], "accounts/1/containers/2/workspaces/3/triggers", "trigger"),
                 ("variables", ["accounts/1/containers/2/workspaces/3"], "accounts/1/containers/2/workspaces/3/variables", "variable"),
                 ("versions", ["accounts/1/containers/2"], "accounts/1/containers/2/version_headers", "containerVersionHeader")]
        for method, args, path, key in cases:
            with self.subTest(method=method):
                client, session, _, _ = self.client([response(body={key: [{"id": 1}], "nextPageToken": "p2"}), response(body={key: [{"id": 2}]})])
                self.assertEqual(len(getattr(client, "list_" + method)(*args)), 2)
                self.assertEqual(session.get.call_args_list[0].args[0], g.BASE + path)
                self.assertEqual(session.get.call_args.kwargs["params"], {"pageToken": "p2"})
                self.assertFalse(session.get.call_args.kwargs["allow_redirects"])
                self.assertTrue(all(call[0] == "get" for call in session.method_calls))

    def test_401_refresh_once(self):
        client, session, auth, _ = self.client([response(401), response(body={"account": []})])
        self.assertEqual(client.list_accounts(), [])
        auth.refresh.assert_called_once()
        self.assertEqual(session.get.call_count, 2)

    def test_persistent_401_stops(self):
        client, session, auth, _ = self.client([response(401), response(401)])
        with self.assertRaisesRegex(g.SafeError, "401"):
            client.list_accounts()
        auth.refresh.assert_called_once()
        self.assertEqual(session.get.call_count, 2)

    def test_403_no_retry_or_body_leak(self):
        client, session, auth, _ = self.client([response(403, {"secret": "do-not-expose"})])
        with self.assertRaisesRegex(g.SafeError, "403") as caught:
            client.list_accounts()
        self.assertNotIn("do-not-expose", str(caught.exception))
        self.assertEqual(session.get.call_count, 1)
        auth.refresh.assert_not_called()

    def test_429_retry_after_and_backoff(self):
        client, _, _, sleep = self.client([response(429, headers={"Retry-After": "7"}), response(429), response()])
        client.list_accounts()
        waits = [call.args[0] for call in sleep.call_args_list]
        self.assertIn(7, waits)
        self.assertIn(2, waits)

    def test_429_bounded(self):
        client, session, _, _ = self.client([response(429)] * 5)
        with self.assertRaisesRegex(g.SafeError, "429"):
            client.list_accounts()
        self.assertEqual(session.get.call_count, 5)

    def test_long_retry_after_stops(self):
        client, session, _, _ = self.client([response(429, headers={"Retry-After": "120"})])
        with self.assertRaises(g.SafeError):
            client.list_accounts()
        self.assertEqual(session.get.call_count, 1)

    def test_network_error_sanitized(self):
        client, _, _, _ = self.client([g.requests.ConnectionError("synthetic-secret")])
        with self.assertRaises(g.SafeError) as caught:
            client.list_accounts()
        self.assertNotIn("synthetic-secret", str(caught.exception))

    def test_repeated_page_token_stops(self):
        client, _, _, _ = self.client([response(body={"nextPageToken": "x"})] * 2)
        with self.assertRaisesRegex(g.SafeError, "Paginación"):
            client.list_accounts()

    def test_redirect_not_followed(self):
        client, _, _, _ = self.client([response(302)])
        with self.assertRaisesRegex(g.SafeError, "302"):
            client.list_accounts()

    def test_parent_injection_rejected_before_network(self):
        for value in ("https://evil.test", "accounts/1?secret=x", "accounts/1/../2", "GTM-TEST"):
            client, session, _, _ = self.client([])
            with self.assertRaises(g.SafeError):
                client.list_containers(value)
            session.get.assert_not_called()


class AuthTests(unittest.TestCase):
    def test_rejects_extra_scopes_before_credentials_loaded(self):
        store = Mock()
        store.read.return_value = {"scopes": [g.SCOPE, "other"]}
        with self.assertRaises(g.SafeError):
            g.Auth(store).load()

    def test_expired_token_refreshes_and_persists(self):
        store, credentials = Mock(), Mock()
        store.read.return_value = {"scopes": g.SCOPES, "token_uri": "https://oauth2.googleapis.com/token"}
        credentials.scopes, credentials.granted_scopes, credentials.valid = g.SCOPES, g.SCOPES, False
        credentials.to_json.return_value = '{"synthetic": true}'
        with patch.object(g.Credentials, "from_authorized_user_info", return_value=credentials), patch.object(g, "Request"):
            auth = g.Auth(store).load()
        self.assertIs(auth.credentials, credentials)
        credentials.refresh.assert_called_once()
        store.write.assert_called_once_with("token", {"synthetic": True})

    def test_failed_refresh_sanitized(self):
        auth = g.Auth(Mock())
        auth.credentials = Mock()
        auth.credentials.refresh.side_effect = RuntimeError("synthetic-secret")
        with self.assertRaises(g.SafeError) as caught:
            auth.refresh()
        self.assertNotIn("synthetic-secret", str(caught.exception))

    def test_desktop_oauth_scope_pkce_and_loopback(self):
        store = Mock()
        config = {"installed": {"client_id": "synthetic", "client_secret": "synthetic", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token"}}
        store.read.return_value = config
        credentials = Mock(scopes=g.SCOPES, granted_scopes=g.SCOPES, refresh_token="synthetic")
        credentials.to_json.return_value = '{}'
        with patch.object(g.InstalledAppFlow, "from_client_config") as create:
            create.return_value.run_local_server.return_value = credentials
            g.Auth(store).authorize()
        create.assert_called_once_with(config, g.SCOPES, autogenerate_code_verifier=True)
        options = create.return_value.run_local_server.call_args.kwargs
        self.assertEqual(options["host"], "127.0.0.1")
        self.assertEqual(options["include_granted_scopes"], "false")
        self.assertEqual(options["authorization_prompt_message"], "")

    def test_missing_token_actionable(self):
        store = Mock()
        store.read.return_value = None
        with self.assertRaisesRegex(g.SafeError, "auth"):
            g.Auth(store).load()

    def test_rejects_external_oauth_endpoint(self):
        with self.assertRaises(g.SafeError):
            g.validate_client({"installed": {"client_id": "x", "client_secret": "x", "auth_uri": "https://evil.test", "token_uri": "https://evil.test"}})


class StoreAndCliTests(unittest.TestCase):
    def test_repository_store_rejected(self):
        with self.assertRaises(g.SafeError):
            g.SecureStore(g.REPO / "credentials")

    @unittest.skipUnless(g.os.name == "nt", "Windows DPAPI")
    def test_dpapi_real_roundtrip_and_tamper(self):
        encrypted = g.dpapi(b"synthetic-secret")
        self.assertNotIn(b"synthetic-secret", encrypted)
        self.assertEqual(g.dpapi(encrypted, decrypt=True), b"synthetic-secret")
        with self.assertRaises(g.SafeError):
            g.dpapi(b"invalid", decrypt=True)

    @unittest.skipUnless(g.os.name == "nt", "Windows DPAPI")
    def test_store_real_encrypted_roundtrip(self):
        with tempfile.TemporaryDirectory() as folder:
            store = g.SecureStore(folder)
            store.write("token", {"refresh_token": "synthetic-secret"})
            self.assertEqual(store.read("token")["refresh_token"], "synthetic-secret")
            self.assertNotIn(b"synthetic-secret", (Path(folder) / "token.dpapi").read_bytes())

    def test_cli_check_lists_only_identifiers(self):
        output = io.StringIO()
        with patch.object(g, "SecureStore"), patch.object(g, "Auth"), patch.object(g, "GTMClient") as client, contextlib.redirect_stdout(output):
            client.return_value.list_accounts.return_value = [{"accountId": "1", "path": "accounts/1", "name": "private-name", "parameter": "synthetic-secret"}]
            self.assertEqual(g.main(["check"]), 0)
        self.assertEqual(json.loads(output.getvalue())["count"], 1)
        self.assertNotIn("synthetic-secret", output.getvalue())
        self.assertNotIn("private-name", output.getvalue())


if __name__ == "__main__":
    unittest.main()
