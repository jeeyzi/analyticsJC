import { Container } from "@/components/layout/Container";
import { CardGrid, Section } from "@/components/layout/Section";
import { site } from "@/content/site";
import typography from "@/styles/typography.module.css";
import styles from "./ProblemImpact.module.css";

export function ProblemImpact() {
  return (
    <Section id="problema" aria-labelledby="titulo-problema">
      <Container>
        <div className={styles.content}>
          <div className={`${typography.reading} ${typography.titleText}`}>
            <h2 id="titulo-problema">{site.problem.heading}</h2>
            <p className={typography.body}>{site.problem.introduction}</p>
          </div>
          <CardGrid>
            {site.problem.symptoms.map((symptom) => (
              <div key={symptom.heading} className={styles.symptom}>
                <h3>{symptom.heading}</h3>
                <p className={typography.body}>{symptom.body}</p>
              </div>
            ))}
          </CardGrid>
          <p className={`${typography.reading} ${typography.body}`}>{site.impact}</p>
        </div>
      </Container>
    </Section>
  );
}
