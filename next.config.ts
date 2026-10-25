import type { NextConfig } from "next";

import { qaEnvironmentAllowed } from "./src/lib/environment";
const qa = qaEnvironmentAllowed({ nodeEnv: process.env.NODE_ENV, siteEnv: process.env.NEXT_PUBLIC_SITE_ENV, vercelEnv: process.env.VERCEL_ENV, qaEnabled: process.env.QA_DEPLOYMENT_ENABLED });
if (process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_SITE_ENV === "production") throw new Error("Producción bloqueada: Consent, Privacy, Storage Governance y operaciones pendientes.");
if (process.env.NEXT_PUBLIC_SITE_ENV && !["local", "qa"].includes(process.env.NEXT_PUBLIC_SITE_ENV)) throw new Error("Entorno no reconocido.");
if (process.env.NEXT_PUBLIC_SITE_ENV === "qa" && !qa) throw new Error("QA requiere Vercel Preview y QA_DEPLOYMENT_ENABLED=true.");
if (process.env.VERCEL_ENV === "preview" && !qa) throw new Error("Preview requiere entorno QA explícito.");
if (process.env.NEXT_PUBLIC_MEASUREMENT_ENABLED === "true") throw new Error("Medición productiva bloqueada.");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: { NEXT_PUBLIC_QA_BUILD_APPROVED: qa ? "true" : "false" },
  experimental: { agentUpgrade: "security" },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
      ],
    }];
  },
};

export default nextConfig;
