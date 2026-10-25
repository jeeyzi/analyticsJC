import { serverQaAllowed } from "@/lib/environment";
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
  const qaForm = serverQaAllowed() && process.env.LEAD_FORM_PREVIEW === "true";
  const diagnosisReady = headerPreview || (process.env.NEXT_PUBLIC_SITE_ENV === "qa" && qaForm);
  return (
    <>
      <Hero diagnosisReady={diagnosisReady} />
      <ProblemImpact />
      <SolutionServices diagnosisReady={diagnosisReady} />
      <Process />
      <Experience diagnosisReady={diagnosisReady} />
      <AIFirst />
      <FAQ />
      {(qaForm || headerPreview) && <LeadFormPreview />}
      {process.env.NODE_ENV === "development" && process.env.DESIGN_SYSTEM_PREVIEW === "true" && <DesignSystemPreview />}
      {headerPreview && !qaForm && <HeaderNavigationPreview solutionReady processTrustReady />}
    </>
  );
}
