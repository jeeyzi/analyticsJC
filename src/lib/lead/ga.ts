import { z } from "zod";

// Contexto privado opcional; ausencia/entrada inválida nunca bloquea recepción.
const identifier = z.string().min(1).max(128).regex(/^[A-Za-z0-9._-]+$/);
const gaSchema = z.object({ client_id: identifier.optional(), session_id: identifier.optional() }).strict();
export type GaIdentifiers = z.infer<typeof gaSchema>;
export function sanitizeGaIdentifiers(value: unknown): GaIdentifiers {
  const parsed = gaSchema.safeParse(value);
  return parsed.success ? parsed.data : {};
}
