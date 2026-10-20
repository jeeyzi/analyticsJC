import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { LeadForm } from "@/components/lead/LeadForm";
import { site } from "@/content/site";
import typography from "@/styles/typography.module.css";

export function LeadFormPreview() {
  return <Section aria-labelledby="titulo-formulario-local"><Container>
    <div className={typography.titleText}><h2 id="titulo-formulario-local">{site.leadForm.heading}</h2><p className={typography.body}>{site.leadForm.introduction}</p></div>
    <LeadForm />
  </Container></Section>;
}
