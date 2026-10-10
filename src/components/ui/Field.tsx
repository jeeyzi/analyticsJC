import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import styles from "./Field.module.css";

type Shared = { id: string; label: string; help?: string; error?: string; className?: string };
type FieldProps = Shared & (
  | ({ kind?: "input" } & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className" | "children">)
  | ({ kind: "select"; children: ReactNode } & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "className">)
  | ({ kind: "textarea" } & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">)
);

// Solo presentación y asociación accesible. Sin formulario, validación o envío.
export function Field({ id, label, help, error, className = "", ...props }: FieldProps) {
  const describedBy = [props["aria-describedby"], help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const common = { id, className: styles.control, "aria-describedby": describedBy, "aria-invalid": error ? true : props["aria-invalid"] };
  let control;
  if (props.kind === "select") {
    const { kind: _kind, ...attributes } = props;
    void _kind;
    control = <select {...attributes} {...common} />;
  } else if (props.kind === "textarea") {
    const { kind: _kind, ...attributes } = props;
    void _kind;
    control = <textarea {...attributes} {...common} />;
  } else {
    const { kind: _kind, ...attributes } = props;
    void _kind;
    control = <input {...attributes} {...common} />;
  }
  return (
    <div className={`${styles.field} ${className}`}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      {control}
      {help && <p className={styles.help} id={`${id}-help`}>{help}</p>}
      {error && <p className={styles.error} id={`${id}-error`}>{error}</p>}
    </div>
  );
}
