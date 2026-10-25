// Allowlist de nombres, nunca de valores de campaña.
export const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export const acquisitionLimits = { utm: 100, clickId: 512 } as const;
export const clickKeys = ["gclid", "gbraid", "wbraid"] as const;
export type Acquisition = Partial<Record<typeof utmKeys[number] | typeof clickKeys[number] | "landing_page" | "referrer", string>>;

const phoneLike = /(?:^|[^\p{L}\p{N}])\d(?:[ ._-]*\d){6,}(?:$|[^\p{L}\p{N}])/u;
const hasPhoneLike = (value: string) => phoneLike.test(value.replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, "opaque_uuid"));
function sanitizeUtm(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length > acquisitionLimits.utm) return;
  const cleaned = value.normalize("NFC").trim();
  // Sin controles, escapes %, email/URL, markup ni expresiones ejecutables.
  if (!cleaned || cleaned.length > acquisitionLimits.utm || !/^[\p{L}\p{M}\p{N} ._-]+$/u.test(cleaned) || hasPhoneLike(cleaned)) return;
  return cleaned;
}

const comparable = (value: string) => value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
export function excludeContactSignals(acquisition: Acquisition, contact: Record<string, unknown>): Acquisition {
  const privateValues = ["first_name", "last_name", "email", "phone", "problem_to_solve", "company_name"]
    .map((key) => typeof contact[key] === "string" ? comparable(contact[key]) : "")
    .filter((value) => value.length >= 3);
  return Object.fromEntries(Object.entries(acquisition).filter(([, value]) => {
    const normalized = ` ${comparable(value)} `;
    return !privateValues.some((privateValue) => normalized.includes(` ${privateValue} `));
  }));
}

// Compartido cliente/servidor. Un contexto inválido se omite sin impedir la captación.
export function sanitizeAcquisition(value: unknown): Acquisition {
  const result: Acquisition = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return result;
  const input = value as Record<string, unknown>;
  for (const key of utmKeys) {
    const item = sanitizeUtm(input[key]);
    if (item !== undefined) result[key] = item;
  }
  for (const key of clickKeys) {
    const item = input[key];
    // No trim/lowercase/hash ni truncado: preservar exactamente o descartar.
    if (typeof item === "string" && item.length <= acquisitionLimits.clickId && /^[A-Za-z0-9_-]+$/.test(item) && !hasPhoneLike(item)) result[key] = item;
  }
  if (input.landing_page === "/" || input.landing_page === "/privacidad") result.landing_page = input.landing_page;
  // Orígenes de pruebas conocidos. Catálogo productivo pendiente; no persistir hosts arbitrarios.
  if (input.referrer === "https://example.org" || input.referrer === "https://example.com") result.referrer = input.referrer;
  return result;
}

export function captureAcquisition(href: string, referrer: string): Acquisition {
  try {
    const url = new URL(href);
    const raw: Record<string, unknown> = { landing_page: url.pathname };
    for (const key of [...utmKeys, ...clickKeys]) {
      const values = url.searchParams.getAll(key);
      // URLSearchParams decodifica una vez; parámetros duplicados son ambiguos.
      if (values.length === 1) raw[key] = values[0];
    }
    if (referrer) {
      const source = new URL(referrer);
      if (!source.username && !source.password && source.origin !== url.origin) raw.referrer = source.origin;
    }
    return sanitizeAcquisition(raw);
  } catch { return {}; }
}

export function createAcquisitionSession() {
  let first: Acquisition | undefined;
  return {
    capture(href: string, referrer: string) { first ??= captureAcquisition(href, referrer); },
    snapshot(): Acquisition { return { ...first }; },
  };
}
