import type { HTMLAttributes } from "react";
import styles from "./Card.module.css";

// Tarjeta informativa: sin destino, hover ni interacción implícita.
export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`${styles.card} ${className}`} />;
}
