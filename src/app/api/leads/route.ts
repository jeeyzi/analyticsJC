import { serverQaAllowed, leadOriginAllowed } from "@/lib/environment";
import { leadRequestSchema, MAX_BODY_BYTES } from "@/lib/lead/contract";
import { LeadStoreError, persistLead } from "@/lib/server/lead-store";
import { contactFields } from "@/lib/lead/schema";

export const runtime = "nodejs";
export const maxDuration = 60;
const reply = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const fail = (code: string, status: number, state = "recoverable_error") => reply({ status: "error", code, state }, status);

export async function POST(request: Request) {
  if (!serverQaAllowed() || process.env.LEAD_SHEETS_QA_ENABLED !== "true") return fail("RECEIVER_DISABLED", 503);
  if (!leadOriginAllowed(request)) return fail("INVALID_ORIGIN", 403);
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return fail("INVALID_CONTENT_TYPE", 415);
  const reader = request.body?.getReader();
  if (!reader) return fail("INVALID_JSON", 400);
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) { await reader.cancel(); return fail("PAYLOAD_TOO_LARGE", 413); }
      chunks.push(value);
    }
    let body: unknown;
    try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return fail("INVALID_JSON", 400); }
    const parsed = leadRequestSchema.safeParse(body);
    if (!parsed.success) return reply({ status: "error", state: "validation_error", code: "INVALID_FIELDS", fields: [...new Set(parsed.error.issues.map((issue) => issue.path[0] === "contact" ? issue.path[1] : "submission_id"))].filter((field) => typeof field === "string" && (field === "submission_id" || (contactFields as readonly string[]).includes(field))) }, 422);
    try {
      const accepted = await persistLead(parsed.data);
      return reply(accepted, accepted.replayed ? 200 : 201);
    } catch (error) {
      if (error instanceof LeadStoreError) return fail(error.code, error.code === "SUBMISSION_CONFLICT" ? 409 : 503, error.state);
      return fail("PERSISTENCE_UNCONFIRMED", 503, "unconfirmed_reception");
    }
  } catch { return fail("INVALID_REQUEST", 400); }
}
