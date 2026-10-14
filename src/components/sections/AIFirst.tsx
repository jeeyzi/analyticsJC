import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { site } from "@/content/site";
import typography from "@/styles/typography.module.css";

export function AIFirst() {
  return (
    <Section aria-labelledby="titulo-metodo">
      <Container>
        <div className={`${typography.reading} ${typography.titleText}`}>
          <h2 id="titulo-metodo">{site.aiFirst.heading}</h2>
          {site.aiFirst.paragraphs.map((paragraph) => (
            <p key={paragraph} className={typography.body}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </Section>
  );
}
