import { z } from "zod";
import { contactDraftSchema } from "./schema.ts";
import { sanitizeAcquisition } from "./acquisition.ts";
import { sanitizeGaIdentifiers } from "./ga.ts";

export const MAX_BODY_BYTES = 16 * 1024;
export const leadRequestSchema = z.object({
  submission_id: z.uuid().transform((id) => id.toLowerCase()),
  contact: contactDraftSchema,
  acquisition: z.unknown().transform(sanitizeAcquisition).optional(),
  ga: z.unknown().transform(sanitizeGaIdentifiers).optional(),
}).strict();
export type LeadRequest = z.infer<typeof leadRequestSchema>;
export const acceptedSchema = z.object({
  status: z.literal("accepted"), submission_id: z.uuid(), lead_id: z.uuid(),
  accepted_at: z.iso.datetime(), replayed: z.boolean(),
}).strict();
export const feedback = {
  validation_error: { title: "Revisa los campos indicados", message: "Hay información que necesitamos corregir antes de enviar la solicitud." },
  recoverable_error: { title: "No pudimos enviar la solicitud", message: "Tus datos se mantienen en el formulario. Intenta nuevamente." },
  unconfirmed_reception: { title: "No pudimos confirmar la recepción", message: "La solicitud pudo haberse recibido, pero no logramos confirmarlo. Puedes volver a intentarlo sin necesidad de completar nuevamente la información." },
  confirmed_success: { title: "Solicitud recibida", message: "Recibimos correctamente tu información. Te indicaremos el siguiente paso utilizando los datos de contacto proporcionados." },
} as const;

export function classifyResponse(http: number, body: unknown, submissionId: string) {
  const parsed = acceptedSchema.safeParse(body);
  if ((http === 200 || http === 201) && parsed.success && parsed.data.submission_id === submissionId) return "confirmed_success";
  if (http === 422) return "validation_error";
  if (body && typeof body === "object" && "state" in body && body.state === "recoverable_error" && http >= 400) return "recoverable_error";
  return "unconfirmed_reception";
}
