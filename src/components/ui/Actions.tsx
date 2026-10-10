import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes } from "react";
import styles from "./Actions.module.css";

type Variant = "primary" | "secondary";
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: Variant };

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return <button {...props} type={type} className={`${styles.action} ${styles[variant]} ${className}`} />;
}

export function ActionLink({ variant = "primary", className = "", ...props }: LinkProps) {
  return <a {...props} className={`${styles.action} ${styles[variant]} ${className}`} />;
}

export function TextLink({ className = "", ...props }: Omit<LinkProps, "variant">) {
  return <a {...props} className={`${styles.textLink} ${className}`} />;
}

// El agrupador aplica el ancho móvil; no impone CTA ni destinos.
export function ActionGroup({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`${styles.group} ${className}`} />;
}
