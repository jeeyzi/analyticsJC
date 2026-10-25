import { z } from "zod";
import { possibleInternationalPhone } from "./phone.ts";

// Contrato compartido cliente/servidor de QA; normalización conservadora sin inferir país.
export const limits = { first_name: 100, last_name: 100, email: 254, phone: 40, company_name: 150, problem_to_solve: 2000 } as const;
export const companyTypes = ["lead_business", "agency", "other"] as const;
export const adSpendValues = ["under_2000_usd", "2000_5000_usd", "over_5000_usd"] as const;
const text = (max: number) => z.string().max(max).trim().min(1);
export const stepOneSchema = z.object({
  first_name: text(limits.first_name), last_name: text(limits.last_name),
  email: z.string().max(limits.email).trim().pipe(z.email()),
  phone: text(limits.phone).refine((value) => {
    if (value.startsWith("+")) return possibleInternationalPhone(value);
    // Compatibilidad con submissions QA previas sin prefijo: no inferir país ni
    // cambiar su normalización, para no invalidar retries de payload congelado.
    const digits = value.replace(/\D/g, "");
    return /^[\d ()-]+$/.test(value) && digits.length >= 8 && digits.length <= 15;
  }),
  company_name: text(limits.company_name), company_type: z.enum(companyTypes),
}).strict();
export const stepTwoSchema = z.object({
  monthly_ad_spend: z.enum(adSpendValues),
  problem_to_solve: z.string().max(limits.problem_to_solve).trim().optional(),
}).strict();
export const contactDraftSchema = stepOneSchema.extend(stepTwoSchema.shape).strict();
export const stepOneFields = ["first_name", "last_name", "email", "phone", "company_name", "company_type"] as const;
export const contactFields = [...stepOneFields, "monthly_ad_spend", "problem_to_solve"] as const;
export type ContactField = typeof contactFields[number];
export type ContactDraft = Record<ContactField, string>;
export type LocalFormState = "idle" | "editing" | "validation_error" | "submitting" | "recoverable_error" | "unconfirmed_reception" | "confirmed_success";
