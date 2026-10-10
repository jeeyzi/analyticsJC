# AnalyticsJC — foundation local

Base del MVP según `docs/technical.md`, con alcance registrado en `docs/decisions.md`. No es la landing completa ni una versión lista para publicar. No recibe solicitudes y no carga medición.

## Desarrollo

Node 22.17.0 y npm 10.9.2. Usar un único gestor y conservar `package-lock.json`.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Abrir http://127.0.0.1:3000. El servidor escucha solo en loopback. La muestra usa copy literal de content.md. No requiere credenciales.

```powershell
npm run typecheck
npm run lint
npm run build
npm run start
```

`build` genera una compilación optimizada para inspección local. No acredita producción. La configuración rechaza `NEXT_PUBLIC_SITE_ENV` distinto de `local` y activación de medición; omitir la variable conserva el alcance local. Todas las respuestas incluyen noindex. Noindex no es autenticación: no publicar esta base ni exponer el servidor.

## Estructura implementada

- `src/app`: layout server, metadata local y muestra mínima en `/`.
- `src/components/layout`: Container, Header y Footer server, con CSS Modules.
- `src/content/site.ts`: extractos literales del copy aprobado.
- `src/styles`: tokens de design.md y estilos globales accesibles.
- `public/fonts`: Inter variable Latin local y licencia.
- `docs/foundation-review.md`: consistencia, clasificación y decisiones pendientes.
- `acceptance.md`: matriz canónica; `docs/acceptance.md` apunta a ella.

No crear carpetas vacías, rutas API, adapters, migraciones, formularios o tests simulados para aparentar integraciones. Zod y server-only quedan disponibles para contratos futuros; Supabase, Vitest, Playwright/axe y proveedores se añadirán al implementar y probar sus responsabilidades. Inter se obtiene de un paquete de desarrollo; el navegador solo descarga el WOFF2 local.

## Pendientes

Privacidad, soporte, dominio, receptor, correo, scheduler, consentimiento, parámetros operativos y copy de estados requieren cierre según H-03 a H-15. Menú y 404 tienen vacíos de copy FND-02/FND-03. Sin Git inicializado: no hay commit, remoto, CI ejecutada ni lockfile versionado. Resultados y límites por criterio en `docs/validation-report.md`.
