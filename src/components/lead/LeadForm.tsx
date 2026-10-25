"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ChangeEvent } from "react";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Actions";
import { contactDraftSchema, contactFields, stepOneFields, limits, adSpendValues, type ContactDraft, type ContactField, type LocalFormState } from "@/lib/lead/schema";
import { site } from "@/content/site";
import { classifyResponse, feedback } from "@/lib/lead/contract";
import styles from "./LeadForm.module.css";
import { acquisitionSnapshot } from "./AcquisitionCapture";
import { PhoneField, type PhoneCountryOption } from "./PhoneField";
import { readGaIdentifiers, track, trackFormStart, trackConfirmedLead } from "@/lib/measurement/runtime";
import { clientValidationError, receptionError, formContext, continueFormEvent } from "@/lib/measurement/events";

const empty: ContactDraft = { first_name: "", last_name: "", email: "", phone: "", company_name: "", company_type: "", monthly_ad_spend: "", problem_to_solve: "" };
type Errors = Partial<Record<ContactField, string>>;
const subscribe = () => () => {};
const spendLabels = ["Menos de USD 2.000", "USD 2.000–5.000", "Más de USD 5.000"];

// Receptor QA server-side. Contacto únicamente en memoria de esta instancia.
export function LeadForm({ phoneCountryOptions }: { phoneCountryOptions: PhoneCountryOption[] }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [values, setValues] = useState<ContactDraft>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<LocalFormState>("idle");
  const [step, setStep] = useState<1 | 2>(1);
  const submissionId = useRef<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  const inFlight = useRef(false);
  const receptionUncertain = useRef(false);
  const frozen = useRef<string | null>(null);
  const submittedContact = useRef<ContactDraft | null>(null);
  const attempted = useRef(false);
  const [locked, setLocked] = useState(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const serverErrorFocus = useRef<string | null>(null);
  const copy = site.leadForm;
  useEffect(() => {
    if (moveFocus.current) { heading.current?.focus(); moveFocus.current = false; }
  }, [step]);
  useEffect(() => {
    if (state === "confirmed_success") resultHeading.current?.focus();
    if (state === "validation_error" && serverErrorFocus.current) {
      document.getElementById(`diagnosis-${serverErrorFocus.current}`)?.focus();
      serverErrorFocus.current = null;
    }
  }, [state, step]);
  function ensureSubmission() { submissionId.current ??= crypto.randomUUID(); }
  function validate(draft: ContactDraft, firstStepOnly = false): Errors {
    const result = contactDraftSchema.safeParse(draft);
    const next: Errors = {};
    if (!result.success) for (const issue of result.error.issues) {
      const field = issue.path[0] as ContactField;
      if (contactFields.includes(field) && (!firstStepOnly || (stepOneFields as readonly string[]).includes(field))) next[field] = "Revisa los campos indicados";
    }
    return next;
  }
  function edit(field: ContactField, value: string) {
    ensureSubmission();
    trackFormStart();
    const next = { ...values, [field]: value };
    setValues(next); setState("editing");
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: validate(next)[field] }));
  }
  function changeStep(next: 1 | 2) {
    moveFocus.current = true; setStep(next); setState("editing");
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    ensureSubmission();
    const next = validate(values, step === 1);
    setErrors(next);
    const first = contactFields.find((field) => next[field]);
    if (first) {
      const summary = clientValidationError(values, step === 1);
      if (summary) track(summary);
      setState("validation_error");
      document.getElementById(`diagnosis-${first}`)?.focus();
      return;
    }
    if (step === 1) { track(continueFormEvent); changeStep(2); return; }
    inFlight.current = true;
    setState("submitting");
    setLocked(true);
    try {
      if (!frozen.current) {
        submittedContact.current = { ...values };
        const acquisition = acquisitionSnapshot();
        const ga = readGaIdentifiers();
        frozen.current = JSON.stringify({ submission_id: submissionId.current, contact: submittedContact.current, acquisition, ...(Object.keys(ga).length ? { ga } : {}) });
      }
      trackFormStart();
      track({ ...formContext, event: "form_submit", attempt_type: attempted.current ? "retry" : "initial" });
      attempted.current = true;
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: frozen.current, signal: AbortSignal.timeout(15000) });
      const body: unknown = await response.json();
      const classified = classifyResponse(response.status, body, submissionId.current!);
      const result = receptionUncertain.current && classified !== "confirmed_success" ? "unconfirmed_reception" : classified;
      if (result === "unconfirmed_reception") receptionUncertain.current = true;
      setState(result);
      if (result === "confirmed_success") {
        trackConfirmedLead(response.status, body, submissionId.current!, submittedContact.current ?? values);
        setValues(empty); frozen.current = null; submittedContact.current = null;
      } else track(receptionError(result, body));
      if (result === "validation_error") {
        frozen.current = null; setLocked(false);
        if (body && typeof body === "object" && "fields" in body && Array.isArray(body.fields)) {
          const returnedFields = body.fields;
          const fields = contactFields.filter((field) => returnedFields.includes(field));
          setErrors(Object.fromEntries(fields.map((field) => [field, feedback.validation_error.title])));
          serverErrorFocus.current = fields[0] ?? null;
          if (fields.some((field) => (stepOneFields as readonly string[]).includes(field))) setStep(1);
        }
      }
    } catch { receptionUncertain.current = true; setState("unconfirmed_reception"); track(receptionError("unconfirmed_reception")); }
    finally { inFlight.current = false; }
  }
  const props = (field: ContactField) => ({ id: `diagnosis-${field}`, name: field, value: values[field], disabled: locked, error: errors[field], onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => edit(field, event.target.value) });
  if (state === "confirmed_success") return <div className={styles.panel} role="status"><h3 ref={resultHeading} tabIndex={-1}>{feedback.confirmed_success.title}</h3><p>{feedback.confirmed_success.message}</p></div>;
  return (
    <div className={styles.panel}>
      <p className={styles.local}>Prueba QA: utiliza solo datos sintéticos. Las solicitudes se guardan en el receptor privado de pruebas.</p>
      <noscript>El envío requiere JavaScript.</noscript>
      <form id="diagnosis_request" noValidate onSubmit={submit}>
        <h3 ref={heading} tabIndex={-1} className={styles.step}>Paso {step} de 2</h3>
        {state === "validation_error" && <div className={styles.feedback} role="alert"><strong>Revisa los campos indicados</strong><p>Hay información que necesitamos corregir antes de enviar la solicitud.</p></div>}
        {(state === "recoverable_error" || state === "unconfirmed_reception") && <div className={styles.feedback} role="alert"><strong>{feedback[state].title}</strong><p>{feedback[state].message}</p></div>}
        <div hidden={step !== 1}>
          <Field {...props("first_name")} label="Nombre" autoComplete="given-name" maxLength={limits.first_name} required />
          <Field {...props("last_name")} label="Apellido" autoComplete="family-name" maxLength={limits.last_name} required />
          <Field {...props("email")} label="Email" type="email" autoComplete="email" maxLength={limits.email} required />
          <PhoneField options={phoneCountryOptions} value={values.phone} onChange={(value) => edit("phone", value)} disabled={locked} error={errors.phone} />
          <Field {...props("company_name")} label="Nombre de la empresa" autoComplete="organization" maxLength={limits.company_name} required />
          <Field {...props("company_type")} kind="select" label="Tipo de empresa" required>
            <option value="">Selecciona una opción</option><option value="lead_business">Empresa que capta leads</option><option value="agency">Agencia</option><option value="other">Otro</option>
          </Field>
        </div>
        <div hidden={step !== 2}>
          <fieldset className={styles.radios} aria-describedby={errors.monthly_ad_spend ? "spend-error" : undefined}>
            <legend>Inversión publicitaria mensual</legend>
            {adSpendValues.map((value, index) => <label key={value} className={styles.radio}>
              <input disabled={locked} id={index === 0 ? "diagnosis-monthly_ad_spend" : undefined} type="radio" name="monthly_ad_spend" value={value} checked={values.monthly_ad_spend === value} onChange={() => edit("monthly_ad_spend", value)} required aria-invalid={!!errors.monthly_ad_spend} aria-describedby={errors.monthly_ad_spend ? "spend-error" : undefined} />
              <span>{spendLabels[index]}</span>
            </label>)}
            {errors.monthly_ad_spend && <p id="spend-error" className={styles.error}>Revisa los campos indicados</p>}
          </fieldset>
          <Field {...props("problem_to_solve")} kind="textarea" label="¿Qué problema quieres resolver?" help="Opcional" maxLength={limits.problem_to_solve} />
        </div>
        <p className={styles.notice}>{copy.privacyNotice}</p>
        <p className={styles.local}>Solo QA local. Privacidad y captación pública pendientes.</p>
        {state === "submitting" && <p role="status">Enviando solicitud…</p>}
        <div className={styles.actions}>
          {step === 2 && <Button variant="secondary" disabled={locked} onClick={() => changeStep(1)}>Volver</Button>}
          <Button type="submit" disabled={!hydrated || state === "submitting"} onClick={(event) => { if (event.detail > 1) event.preventDefault(); }} className={styles.submit}>{step === 1 ? "Continuar" : state === "submitting" ? "Enviando solicitud…" : copy.submit}</Button>
        </div>
      </form>
    </div>
  );
}
