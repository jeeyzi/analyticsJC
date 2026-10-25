import { serverQaAllowed } from "@/lib/environment";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/content/site";
import { AcquisitionCapture } from "@/components/lead/AcquisitionCapture";
import { MeasurementBootstrap } from "@/components/measurement/MeasurementBootstrap";
import { gtmQaContainerId } from "@/lib/measurement/gtm";
import { GtmHead } from "@/components/measurement/GtmHead";
import "@/styles/tokens.css";
import "@/styles/globals.css";

const inter = localFont({
  src: "../../public/fonts/inter-latin-wght-normal.woff2",
  weight: "400 600",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gtmId = gtmQaContainerId({
    nodeEnv: process.env.NODE_ENV,
    siteEnv: process.env.NEXT_PUBLIC_SITE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    qaEnabled: process.env.QA_DEPLOYMENT_ENABLED,
    measurementQaEnabled: process.env.NEXT_PUBLIC_WEB_MEASUREMENT_QA_ENABLED,
    gtmQaEnabled: process.env.GTM_QA_ENABLED,
    containerId: process.env.NEXT_PUBLIC_GTM_ID,
  });
  return (
    <html lang="es" className={inter.variable}>
      <body>
        {gtmId && <GtmHead containerId={gtmId} preview={process.env.NEXT_PUBLIC_SITE_ENV === "qa"} />}
        {serverQaAllowed() && process.env.NEXT_PUBLIC_WEB_MEASUREMENT_QA_ENABLED === "true" && <MeasurementBootstrap />}
        {serverQaAllowed() && process.env.LEAD_SHEETS_QA_ENABLED === "true" && <AcquisitionCapture />}
        <a className="skip-link" href="#contenido">{site.skipLink}</a>
        <Header navigationReady={serverQaAllowed() && ((process.env.NEXT_PUBLIC_SITE_ENV === "qa" && process.env.LEAD_FORM_PREVIEW === "true") || process.env.HEADER_NAVIGATION_PREVIEW === "true")} />
        <main id="contenido" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
