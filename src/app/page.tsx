import { Hero } from "@/components/sections/Hero";
import { ProblemImpact } from "@/components/sections/ProblemImpact";
import { SolutionServices } from "@/components/sections/SolutionServices";
import { Process } from "@/components/sections/Process";
import { Experience } from "@/components/sections/Experience";
import { AIFirst } from "@/components/sections/AIFirst";
import { FAQ } from "@/components/sections/FAQ";
import { DesignSystemPreview } from "@/components/development/DesignSystemPreview";
import { HeaderNavigationPreview } from "@/components/development/HeaderNavigationPreview";
import { LeadFormPreview } from "@/components/development/LeadFormPreview";

export default function Home() {
  const headerPreview = process.env.NODE_ENV === "development" && process.env.HEADER_NAVIGATION_PREVIEW === "true";
  return (
    <>
      <Hero diagnosisReady={headerPreview} />
      <ProblemImpact />
      <SolutionServices diagnosisReady={headerPreview} />
      <Process />
      <Experience diagnosisReady={headerPreview} />
      <AIFirst />
      <FAQ />
      {process.env.NODE_ENV === "development" && (process.env.LEAD_FORM_PREVIEW === "true" || headerPreview) && <LeadFormPreview />}
      {process.env.NODE_ENV === "development" && process.env.DESIGN_SYSTEM_PREVIEW === "true" && <DesignSystemPreview />}
      {headerPreview && <HeaderNavigationPreview solutionReady processTrustReady />}
    </>
  );
}
