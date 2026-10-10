import { site } from "@/content/site";
import { Container } from "./Container";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <p>{site.identity}</p>
        <p>{site.specialty}</p>
        <p>{site.description}</p>
      </Container>
    </footer>
  );
}
