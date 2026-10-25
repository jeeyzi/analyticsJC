import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ActionGroup } from "@/components/ui/Actions";
import { DiagnosisActionLink } from "@/components/measurement/DiagnosisActionLink";
import { site } from "@/content/site";
import typography from "@/styles/typography.module.css";
import styles from "./Hero.module.css";

// HN-01 / HERO-01: activar solo cuando #diagnostico tenga un destino real.
export function Hero({ diagnosisReady = false }: { diagnosisReady?: boolean }) {
  return (
    <Section first id="inicio" aria-labelledby="titulo-inicio">
      <Container>
        <div className={typography.reading}>
          <div className={`${typography.titleText} ${styles.copy}`}>
            <p className={typography.eyebrow}>{site.hero.eyebrow}</p>
            <h1 id="titulo-inicio">{site.hero.heading}</h1>
            <p className={typography.lead}>{site.hero.supportingCopy}</p>
            <p className={typography.body}>{site.hero.audience}</p>
          </div>
          {diagnosisReady && (
            <ActionGroup className={styles.actions}>
              <DiagnosisActionLink location="hero" href={site.hero.cta.href}>{site.hero.cta.label}</DiagnosisActionLink>
            </ActionGroup>
          )}
          <div className={styles.context}>
            <p className={typography.caption}>{site.hero.microcopy}</p>
            <p className={typography.caption}>{site.hero.identity}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
