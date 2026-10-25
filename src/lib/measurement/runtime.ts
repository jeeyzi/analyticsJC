import { measurementEventSchema, confirmedLeadEvent, formContext, type MeasurementEvent } from "./events.ts";
import type { ContactDraft } from "../lead/schema.ts";
import { createIdentityObserver } from "./identity.ts";

type Host = { dataLayer?: unknown };
const cleared = { cta_id: null, cta_location: null, target_id: null, form_id: null, attempt_type: null, error_type: null, field_name: null, error_code: null, lead_type: null, lead_id: null, company_type: null, monthly_ad_spend: null, user_data: null };

export function createMeasurement(host: Host, enabled: boolean) {
  const started = new Set<string>();
  const leads = new Set<string>();
  const identity = createIdentityObserver(host);
  function initialize() {
    try {
      if (!enabled) return false;
      host.dataLayer ??= [];
      identity.initialize();
      return Array.isArray(host.dataLayer);
    } catch { return false; }
  }
  function push(value: unknown): boolean {
    try {
      if (!initialize()) return false;
      (host.dataLayer as unknown[]).push(value);
      return true;
    } catch { return false; }
  }
  function track(input: MeasurementEvent): boolean {
    try {
      if (!enabled) return false;
      const parsed = measurementEventSchema.safeParse(input);
      if (!parsed.success) return false;
      const event = parsed.data;
      if (event.event === "form_start" && started.has(event.form_id)) return false;
      if (event.event === "generate_lead" && leads.has(event.lead_id)) return false;
      // Reservar ANTES de push: protege también contra callbacks reentrantes.
      if (event.event === "form_start") started.add(event.form_id);
      if (event.event === "generate_lead") leads.add(event.lead_id);
      return push({ ...cleared, ...event });
    } catch { return false; }
  }
  function gaIdentifiers() { return enabled ? identity.snapshot() : {}; }
  return { initialize, track, gaIdentifiers };
}
type Measurement = ReturnType<typeof createMeasurement>;
declare global { interface Window { __analyticsJCMeasurementQA?: Measurement } }

export function measurementQaEnabled() {
  return (process.env.NODE_ENV === "development" || (process.env.NEXT_PUBLIC_SITE_ENV === "qa" && process.env.NEXT_PUBLIC_QA_BUILD_APPROVED === "true")) && process.env.NEXT_PUBLIC_WEB_MEASUREMENT_QA_ENABLED === "true";
}
function runtime() {
  if (typeof window === "undefined" || !measurementQaEnabled()) return;
  // Documento completo: mantiene dedupe tras Strict Mode, remount y navegación SPA.
  return window.__analyticsJCMeasurementQA ??= createMeasurement(window as Window & Host, true);
}
export function initializeMeasurement() { try { runtime()?.initialize(); } catch { /* Captación independiente. */ } }
export function track(input: MeasurementEvent) { try { return runtime()?.track(input) ?? false; } catch { return false; } }
export function trackFormStart() { return track({ ...formContext, event: "form_start" }); }
export function trackConfirmedLead(http: number, body: unknown, submissionId: string, contact: ContactDraft) {
  try { const event = confirmedLeadEvent(http, body, submissionId, contact); if (event) track(event); } catch { /* Sin logging de contacto. */ }
}
export function readGaIdentifiers() {
  try { return runtime()?.gaIdentifiers() ?? {}; } catch { return {}; }
}
