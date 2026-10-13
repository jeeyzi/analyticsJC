import { Hero } from "@/components/sections/Hero";
import { ProblemImpact } from "@/components/sections/ProblemImpact";
import { DesignSystemPreview } from "@/components/development/DesignSystemPreview";
import { HeaderNavigationPreview } from "@/components/development/HeaderNavigationPreview";

export default function Home() {
  const headerPreview = process.env.NODE_ENV === "development" && process.env.HEADER_NAVIGATION_PREVIEW === "true";
  return (
    <>
      <Hero diagnosisReady={headerPreview} />
      <ProblemImpact />
      {process.env.NODE_ENV === "development" && process.env.DESIGN_SYSTEM_PREVIEW === "true" && <DesignSystemPreview />}
      {headerPreview && <HeaderNavigationPreview />}
    </>
  );
}
