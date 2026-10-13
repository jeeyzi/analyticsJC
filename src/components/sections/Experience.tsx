import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ActionGroup, ActionLink } from "@/components/ui/Actions";
import { site } from "@/content/site";
import typography from "@/styles/typography.module.css";
import styles from "./Experience.module.css";

// HN-01 / HERO-01: habilitar el CTA cuando exista el destino real.
export function Experience({ diagnosisReady = false }: { diagnosisReady?: boolean }) {
  return (
    <Section id="experiencia" aria-labelledby="titulo-experiencia">
      <Container>
        <div className={`${typography.reading} ${styles.content}`}>
          <div className={typography.titleText}>
            <h2 id="titulo-experiencia">{site.experience.heading}</h2>
            {site.experience.paragraphs.map((paragraph) => (
              <p key={paragraph} className={typography.body}>{paragraph}</p>
            ))}
          </div>
          <ul className={`${styles.evidence} ${typography.body}`}>
            {site.experience.evidence.map((item) => <li key={item}>{item}</li>)}
          </ul>
          {diagnosisReady && (
            <ActionGroup>
              <ActionLink href={site.experience.cta.href}>{site.experience.cta.label}</ActionLink>
            </ActionGroup>
          )}
        </div>
      </Container>
    </Section>
  );
}
