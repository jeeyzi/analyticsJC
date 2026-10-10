import type { NextConfig } from "next";

// Esta foundation solo permite revisión local. El gate de producción completo
// se implementará al cerrar H-03/H-04/H-05/H-06 y los criterios de Deployment.
if (process.env.NEXT_PUBLIC_SITE_ENV && process.env.NEXT_PUBLIC_SITE_ENV !== "local") {
  throw new Error("Foundation disponible solo para desarrollo y revisión local.");
}
if (process.env.NEXT_PUBLIC_MEASUREMENT_ENABLED === "true") {
  throw new Error("Medición pendiente de implementación y decisiones H-07/H-08/H-09.");
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
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
