import { sanitizeGaIdentifiers, type GaIdentifiers } from "../lead/ga.ts";

type Host = { dataLayer?: unknown };

// Un par completo por evento: nunca mezclar client/session de actualizaciones distintas.
export function identityFromEvent(value: unknown): GaIdentifiers | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const event = value as Record<string, unknown>;
  if (event.event !== "analytics_identity_ready") return;
  const client = event.ga_client_id;
  const session = typeof event.ga_session_id === "number" && Number.isSafeInteger(event.ga_session_id) && event.ga_session_id > 0
    ? String(event.ga_session_id) : event.ga_session_id;
  if (typeof client !== "string" || !/^\d+\.\d+$/.test(client) || typeof session !== "string" || !/^\d+$/.test(session) || !/[1-9]/.test(session)) return;
  const parsed = sanitizeGaIdentifiers({ client_id: client, session_id: session });
  return parsed.client_id && parsed.session_id ? parsed : undefined;
}

export function createIdentityObserver(host: Host) {
  let current: GaIdentifiers = {};
  const observed = new WeakSet<unknown[]>();
  function consume(value: unknown) {
    try { const next = identityFromEvent(value); if (next) current = next; } catch { /* Identidad opcional. */ }
  }
  function initialize() {
    try {
      const layer = host.dataLayer;
      if (!Array.isArray(layer)) return;
      // Escanear también al leer: recupera historia previa o una cola reinstalada.
      for (const value of layer) consume(value);
      if (observed.has(layer)) return;
      const previousPush = layer.push;
      layer.push = function (...values: unknown[]) {
        // Antes de delegar: soporta callbacks GTM reentrantes sin retrasar el snapshot.
        if (this === layer) for (const value of values) consume(value);
        return Reflect.apply(previousPush, this, values);
      };
      observed.add(layer);
    } catch { /* Array/push bloqueados: nunca impedir captación. */ }
  }
  function snapshot(): GaIdentifiers {
    initialize();
    return { ...current };
  }
  return { initialize, snapshot };
}
