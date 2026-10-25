import { site } from "@/content/site";
import Link from "next/link";
import { Container } from "./Container";
import styles from "./Header.module.css";
import { HeaderNavigation } from "./HeaderNavigation";

// Activar solo cuando todos los destinos estén presentes en la página.
export function Header({ navigationReady = false }: { navigationReady?: boolean }) {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.row}>
          <Link className={styles.identity} href="/#inicio">{site.identity}</Link>
          {navigationReady && <HeaderNavigation />}
        </div>
      </Container>
    </header>
  );
}
