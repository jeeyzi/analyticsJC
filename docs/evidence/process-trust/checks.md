# Checks — ProcessTrust

13/10/2026, Windows, Node 22.17.0/npm 10.9.2. Base 192b9a4. Sin actualización de dependencias.

- Snapshot: siete SHA-256 coinciden con source-manifest.
- npm run typecheck: FAIL ambiental en sandbox (SWC canonicalize jsc.baseUrl, Acceso denegado os error 5); repetición fuera PASS, exit 0.
- npm run lint: PASS, exit 0, max-warnings=0.
- npm run build: PASS fuera del sandbox, exit 0, Home estática.
- git diff --check: PASS; next-env generado restaurado a base.

Sin pruebas de captación/servicios, fuera del alcance. No acredita B-03 global, CI o deployment.
