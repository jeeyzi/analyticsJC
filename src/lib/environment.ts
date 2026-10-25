// Preview usa NODE_ENV=production; la aprobación QA es explícita.
export type EnvironmentConfig = { nodeEnv?: string; siteEnv?: string; vercelEnv?: string; qaEnabled?: string };
export function qaEnvironmentAllowed(c: EnvironmentConfig) {
  if (c.vercelEnv === "production" || c.siteEnv === "production") return false;
  if (c.siteEnv === "qa") return c.vercelEnv === "preview" && c.qaEnabled === "true";
  return (!c.siteEnv || c.siteEnv === "local") && c.nodeEnv === "development" && (!c.vercelEnv || c.vercelEnv === "development");
}
export function serverQaAllowed() {
  return qaEnvironmentAllowed({ nodeEnv: process.env.NODE_ENV, siteEnv: process.env.NEXT_PUBLIC_SITE_ENV, vercelEnv: process.env.VERCEL_ENV, qaEnabled: process.env.QA_DEPLOYMENT_ENABLED });
}
export function leadOriginAllowed(request: Request) {
  if (!serverQaAllowed()) return false;
  try {
    const raw = request.headers.get("origin"); const origin = new URL(raw ?? "");
    if (raw !== origin.origin || origin.host !== request.headers.get("host")) return false;
    if (process.env.NEXT_PUBLIC_SITE_ENV === "qa") return origin.protocol === "https:" && [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL].filter(Boolean).includes(origin.host);
    return origin.protocol === "http:" && ["localhost", "127.0.0.1"].includes(origin.hostname);
  } catch { return false; }
}
