import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ActionGroup } from "@/components/ui/Actions";
import { DiagnosisActionLink } from "@/components/measurement/DiagnosisActionLink";
import { MeasurementJourney } from "@/components/MeasurementJourney";
import { site } from "@/content/site";
import typography from "@/styles/typography.module.css";
import styles from "./SolutionServices.module.css";

// HN-01 / HERO-01: el CTA requiere un destino real; QA conserva su puerta explícita.
export function SolutionServices({ diagnosisReady = false }: { diagnosisReady?: boolean }) {
  return (
    <Section id="solucion" aria-labelledby="titulo-solucion">
      <Container>
        <div className={styles.content}>
          <div className={`${typography.reading} ${typography.titleText}`}>
            <h2 id="titulo-solucion">{site.solution.heading}</h2>
            <p className={typography.body}>{site.solution.supportingCopy}</p>
          </div>
          <MeasurementJourney />
          <ul className={styles.services}>
            {site.solution.services.map((service) => (
              <li key={service.heading} className={styles.service}>
                <h3>{service.heading}</h3>
                <p className={typography.body}>{service.body}</p>
              </li>
            ))}
          </ul>
          <div className={`${typography.reading} ${typography.titleText}`}>
            <p className={typography.body}>{site.solution.technicalDetail}</p>
            <p className={typography.body}>{site.solution.scope}</p>
          </div>
          {diagnosisReady && (
            <ActionGroup>
              <DiagnosisActionLink location="solution" href={site.solution.cta.href}>{site.solution.cta.label}</DiagnosisActionLink>
            </ActionGroup>
          )}
        </div>
      </Container>
    </Section>
  );
}
