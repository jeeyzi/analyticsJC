import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { site } from "@/content/site";
import typography from "@/styles/typography.module.css";
import styles from "./Process.module.css";

export function Process() {
  return (
    <Section id="proceso" aria-labelledby="titulo-proceso">
      <Container>
        <div className={`${typography.reading} ${styles.content}`}>
          <h2 id="titulo-proceso">{site.process.heading}</h2>
          <ol className={styles.steps}>
            {site.process.steps.map((step) => (
              <li key={step.heading} className={styles.step}>
                <div className={typography.titleText}>
                  <h3>{step.heading}</h3>
                  <p className={typography.body}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className={typography.titleText}>
            <p className={typography.body}>{site.process.initialScope}</p>
            <p className={typography.body}>{site.process.participation}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
