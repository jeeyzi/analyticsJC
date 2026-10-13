# Checks — Solution + Services

13/10/2026, Windows/PowerShell, Node 22.17.0/npm 10.9.2. Base b272782 y cambios locales, sin commit nuevo.

- `npm run typecheck`: primer intento FAIL ambiental (SWC: canonicalize jsc.baseUrl, Acceso denegado os error 5); repetición fuera del sandbox PASS, exit 0. `next typegen && tsc --noEmit`.
- `npm run lint`: PASS, exit 0, ESLint --max-warnings=0.
- `npm run build`: PASS, exit 0, fuera del sandbox. Repetido después de la corrección del conector; build final PASS. `/` y `/_not-found` estáticos. Sin actualización de dependencias.
- Siete hashes SHA256 de source-manifest: 7/7 coincidentes. Fuentes originales intactas.
- Primer conector desktop FAIL visual: regla global svg max-width:100% comprimía la continuidad. Corrección local max-width:none para ese SVG; revisión final 1024/1440 PASS con salida desde CRM y llegada a Oportunidad. Capturas archivadas corresponden al resultado final.
- Inicio QA adicional en 3004 FAIL ambiental: ya existía next dev en 3000, PID 6924. No se detuvo el proceso existente; su muestra activa permitió validar el CTA. No indica fallo de la sección.
- Arranque de revisión del build: `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3003`, fuera del sandbox. Reiniciado tras rebuild; servidor de esta sesión detenido al terminar.
- Navegación inicial antes de iniciar servidor: ERR_CONNECTION_REFUSED; repetición con servidor activo correcta. No fallo de app.
- `next-env.d.ts` cambia automáticamente con typegen/build/dev; restaurado a la base para evitar diff ajeno a esta fase.

No tests unitarios que dupliquen el copy/estilos estáticos. La comprobación relevante es build, DOM, revisión visual y flujos locales del CTA preparado. No pruebas de recepción o proveedores por alcance.
