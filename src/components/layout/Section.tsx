import type { HTMLAttributes } from "react";
import styles from "./Section.module.css";

export function Section({ first = false, className = "", ...props }: HTMLAttributes<HTMLElement> & { first?: boolean }) {
  return <section {...props} className={`${first ? styles.first : styles.section} ${className}`} />;
}

export function CardGrid({ columns = 3, className = "", ...props }: HTMLAttributes<HTMLDivElement> & { columns?: 2 | 3 }) {
  return <div {...props} className={`${styles.grid} ${columns === 2 ? styles.two : styles.three} ${className}`} />;
}
