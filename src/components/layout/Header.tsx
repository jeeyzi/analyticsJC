import { site } from "@/content/site";
import { Container } from "./Container";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <a className={styles.identity} href="/">{site.identity}</a>
      </Container>
    </header>
  );
}
