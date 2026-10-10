import { Container } from "@/components/layout/Container";
import { site } from "@/content/site";
import styles from "./page.module.css";

// Muestra de foundation local: el recorrido y formulario se implementan después.
export default function Home() {
  return (
    <section id="inicio" className={styles.introduction} aria-labelledby="titulo-inicio">
      <Container>
        <p className={styles.eyebrow}>{site.hero.eyebrow}</p>
        <h1 id="titulo-inicio">{site.hero.heading}</h1>
        <p className={styles.lead}>{site.hero.supportingCopy}</p>
      </Container>
    </section>
  );
}
