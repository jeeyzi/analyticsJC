import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/content/site";
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
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <a className="skip-link" href="#contenido">{site.skipLink}</a>
        <Header />
        <main id="contenido" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
