import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { site } from "@/content/site";
import typography from "@/styles/typography.module.css";
import styles from "./FAQ.module.css";

export function FAQ() {
  return (
    <Section id="preguntas" aria-labelledby="titulo-preguntas">
      <Container>
        <div className={`${typography.reading} ${styles.content}`}>
          <h2 id="titulo-preguntas">{site.faq.heading}</h2>
          {site.faq.items.map((item) => (
            <div key={item.question} className={typography.titleText}>
              <h3>{item.question}</h3>
              <p className={typography.body}>{item.answer}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
