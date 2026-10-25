import { z } from "zod";
import { adSpendValues, companyTypes, contactDraftSchema, stepOneFields, type ContactDraft } from "../lead/schema.ts";
import { acceptedSchema } from "../lead/contract.ts";

export const ctaLocations = ["header", "hero", "solution", "experience", "mobile_bar"] as const;
export type CtaLocation = typeof ctaLocations[number];
export const errorFields = ["first_name", "last_name", "email", "phone", "company_name", "company_type", "monthly_ad_spend", "problem_to_solve", "multiple", "none"] as const;
export const errorCodes = ["required", "invalid_format", "invalid_option", "too_long", "multiple_validation_errors", "server_validation", "recoverable_error", "unconfirmed_reception"] as const;
const base = { page_type: z.literal("home") };
const form = { ...base, form_id: z.literal("diagnosis_request") };
export const measurementEventSchema = z.discriminatedUnion("event", [
  z.object({ ...base, event: z.literal("click_to_action"), cta_id: z.enum(["request_diagnosis", "continue_diagnosis"]), cta_location: z.enum([...ctaLocations, "form_step_1"]), target_id: z.enum(["diagnostico", "diagnosis_step_2"]), form_id: z.literal("diagnosis_request").optional() }).strict().refine((value) => value.cta_id === "continue_diagnosis"
    ? value.cta_location === "form_step_1" && value.target_id === "diagnosis_step_2" && value.form_id === "diagnosis_request"
    : value.cta_location !== "form_step_1" && value.target_id === "diagnostico" && value.form_id === undefined),
  z.object({ ...form, event: z.literal("form_start") }).strict(),
  z.object({ ...form, event: z.literal("form_submit"), attempt_type: z.enum(["initial", "retry"]) }).strict(),
  z.object({ ...form, event: z.literal("form_error"), error_type: z.enum(["validation", "server", "reception"]), field_name: z.enum(errorFields), error_code: z.enum(errorCodes) }).strict(),
  z.object({ ...form, event: z.literal("generate_lead"), lead_type: z.literal("diagnosis_request"), lead_id: z.uuid(), company_type: z.enum(companyTypes), monthly_ad_spend: z.enum(adSpendValues), user_data: z.object({
    email: z.email().max(254), phone_number: z.string().min(1).max(40),
    address: z.object({ first_name: z.string().min(1).max(100), last_name: z.string().min(1).max(100) }).strict(),
  }).strict() }).strict(),
]);
export type MeasurementEvent = z.infer<typeof measurementEventSchema>;
export type FormError = Extract<MeasurementEvent, { event: "form_error" }>;
export const formContext = { page_type: "home", form_id: "diagnosis_request" } as const;
export const continueFormEvent = { ...formContext, event: "click_to_action", cta_id: "continue_diagnosis", cta_location: "form_step_1", target_id: "diagnosis_step_2" } as const satisfies MeasurementEvent;

// Mapper local de referencia: nunca transmite user_data al tag GA4.
export function ga4Parameters(input: unknown): Record<string, string> {
  const cleaned = input && typeof input === "object" ? Object.fromEntries(Object.entries(input).filter(([, value]) => value !== null)) : input;
  const parsed = measurementEventSchema.safeParse(cleaned);
  if (!parsed.success) return {};
  return Object.fromEntries(Object.entries(parsed.data).filter(([key]) => key !== "event" && key !== "user_data")) as Record<string, string>;
}

export function clientValidationError(draft: ContactDraft, stepOneOnly: boolean): FormError | undefined {
  const parsed = contactDraftSchema.safeParse(draft);
  if (parsed.success) return;
  const issues = parsed.error.issues.filter((issue) => !stepOneOnly || (stepOneFields as readonly unknown[]).includes(issue.path[0]));
  const fields = [...new Set(issues.map((issue) => issue.path[0]))];
  if (!fields.length) return;
  if (fields.length > 1) return { ...formContext, event: "form_error", error_type: "validation", field_name: "multiple", error_code: "multiple_validation_errors" };
  const field = fields[0] as keyof ContactDraft;
  const fieldIssues = issues.filter((issue) => issue.path[0] === field);
  const code = !draft[field].trim() ? "required" : fieldIssues.some((issue) => issue.code === "too_big") ? "too_long" : field === "company_type" || field === "monthly_ad_spend" ? "invalid_option" : "invalid_format";
  return { ...formContext, event: "form_error", error_type: "validation", field_name: field, error_code: code };
}

export function receptionError(state: "validation_error" | "recoverable_error" | "unconfirmed_reception", body?: unknown): FormError {
  if (state !== "validation_error") return { ...formContext, event: "form_error", error_type: "reception", field_name: "none", error_code: state };
  const raw = body && typeof body === "object" && "fields" in body && Array.isArray(body.fields) ? body.fields : [];
  const fields = [...new Set(raw.filter((key) => (errorFields as readonly unknown[]).slice(0, 8).includes(key)))];
  return { ...formContext, event: "form_error", error_type: "server", field_name: fields.length > 1 ? "multiple" : fields.length === 1 ? fields[0] as FormError["field_name"] : "none", error_code: fields.length > 1 ? "multiple_validation_errors" : "server_validation" };
}

export function confirmedLeadEvent(http: number, body: unknown, submissionId: string, contact: ContactDraft): MeasurementEvent | undefined {
  const accepted = acceptedSchema.safeParse(body);
  const draft = contactDraftSchema.safeParse(contact);
  if (![200, 201].includes(http) || !accepted.success || accepted.data.submission_id !== submissionId || !draft.success) return;
  const value = draft.data;
  return measurementEventSchema.parse({ ...formContext, event: "generate_lead", lead_type: "diagnosis_request", lead_id: accepted.data.lead_id,
    company_type: value.company_type, monthly_ad_spend: value.monthly_ad_spend,
    user_data: { email: value.email, phone_number: value.phone, address: { first_name: value.first_name, last_name: value.last_name } },
  });
}
