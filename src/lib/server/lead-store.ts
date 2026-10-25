import "server-only";
import { randomUUID } from "node:crypto";
import { acceptedSchema, type LeadRequest } from "../lead/contract.ts";
import { sheetsRequest } from "./sheets.ts";
import { sanitizeAcquisition, excludeContactSignals } from "../lead/acquisition.ts";
import { sanitizeGaIdentifiers } from "../lead/ga.ts";

export const leadColumns = ["submission_id", "lead_id", "created_at", "updated_at", "status", "lifecycle_stage", "first_name", "last_name", "email", "phone", "company_name", "company_type", "ad_spend", "problem_to_solve", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "landing_page", "referrer", "gclid", "gbraid", "wbraid", "fbp", "fbc", "ga_client_id", "ga_session_id", "analytics_storage", "ad_storage", "ad_user_data", "ad_personalization", "consent_timestamp", "consent_version", "external_id", "gads_session_attributes"] as const;
type Column = typeof leadColumns[number];
export class LeadStoreError extends Error {
  readonly state: "recoverable_error" | "unconfirmed_reception";
  readonly code: string;
  constructor(state: "recoverable_error" | "unconfirmed_reception", code: string) { super(code); this.state = state; this.code = code; }
}
export function normalizedContact(input: LeadRequest["contact"]) {
  const at = input.email.lastIndexOf("@");
  const phone = input.phone.replace(/[ ()-]/g, "");
  return { ...input, email: input.email.slice(0, at) + "@" + input.email.slice(at + 1).toLowerCase(), phone, problem_to_solve: input.problem_to_solve ?? "" };
}
const contactColumns = ["first_name", "last_name", "email", "phone", "company_name", "company_type", "ad_spend", "problem_to_solve"] as const;
function contactValues(input: LeadRequest) {
  const { monthly_ad_spend, ...rest } = normalizedContact(input.contact);
  return { ...rest, ad_spend: monthly_ad_spend };
}
export function newLeadRow(input: LeadRequest) {
  const now = new Date().toISOString();
  const acquisition = excludeContactSignals(sanitizeAcquisition(input.acquisition), input.contact);
  const ga = sanitizeGaIdentifiers(input.ga);
  const record: Partial<Record<Column, string>> = { ...acquisition, ...contactValues(input), ga_client_id: ga.client_id, ga_session_id: ga.session_id, submission_id: input.submission_id, lead_id: randomUUID(), created_at: now, updated_at: now, status: "received" };
  // GA opcional privado; consentimiento/Meta/lifecycle sin fuente permanecen vacíos.
  return leadColumns.map((column) => record[column] ?? "");
}
export function markerId(submissionId: string) { return `submission_${submissionId.replaceAll("-", "")}`; }
export function atomicCreate(sheetId: number, input: LeadRequest, row: string[]) {
  const marker = markerId(input.submission_id);
  return { requests: [
    { addNamedRange: { namedRange: { namedRangeId: marker, name: marker, range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 1 } } } },
    { appendCells: { sheetId, rows: [{ values: row.map((value) => ({ userEnteredValue: { stringValue: value } })) }], fields: "userEnteredValue" } },
  ] };
}
const tabName = () => {
  const name = process.env.GOOGLE_SHEETS_LEADS_TAB;
  if (!name) throw new LeadStoreError("recoverable_error", "CONFIGURATION_REQUIRED");
  return name;
};
export async function readLeadRows() {
  const range = `'${tabName().replaceAll("'", "''")}'!A:AJ`;
  const data = await sheetsRequest(`/values/${encodeURIComponent(range)}?valueRenderOption=UNFORMATTED_VALUE`);
  const rows: string[][] = data.values ?? [];
  if (JSON.stringify(rows[0]) !== JSON.stringify(leadColumns)) throw new LeadStoreError("recoverable_error", "SCHEMA_MISMATCH");
  return rows.slice(1);
}
function findExisting(rows: string[][], input: LeadRequest, replayed: boolean) {
  const matches = rows.filter((row) => row[0] === input.submission_id);
  if (!matches.length) return undefined;
  if (matches.length !== 1) throw new LeadStoreError("unconfirmed_reception", "INTEGRITY_ERROR");
  const row = matches[0];
  const contact = contactValues(input);
  if (contactColumns.some((column) => (row[leadColumns.indexOf(column)] ?? "") !== contact[column])) throw new LeadStoreError("recoverable_error", "SUBMISSION_CONFLICT");
  const parsed = acceptedSchema.safeParse({ status: "accepted", submission_id: row[0], lead_id: row[1], accepted_at: row[2], replayed });
  if (!parsed.success) throw new LeadStoreError("unconfirmed_reception", "INTEGRITY_ERROR");
  return parsed.data;
}
export async function persistLead(input: LeadRequest) {
  let writeAttempted = false;
  try {
    const existing = findExisting(await readLeadRows(), input, true);
    if (existing) return existing;
    const metadata = await sheetsRequest("?fields=sheets(properties(sheetId,title))");
    const sheet = metadata.sheets.find((s: { properties: { title: string } }) => s.properties.title === tabName());
    if (!sheet) throw new LeadStoreError("recoverable_error", "CONFIGURATION_REQUIRED");
    const row = newLeadRow(input);
    writeAttempted = true;
    try { await sheetsRequest(":batchUpdate", atomicCreate(sheet.properties.sheetId, input, row)); }
    catch {
      // No segundo append: reconciliar solo mediante lectura tras error/timeout/conflicto concurrente.
      const replay = findExisting(await readLeadRows(), input, true);
      if (replay) return replay;
      throw new LeadStoreError("unconfirmed_reception", "PERSISTENCE_UNCONFIRMED");
    }
    const confirmed = findExisting(await readLeadRows(), input, false);
    if (!confirmed || confirmed.lead_id !== row[1]) throw new LeadStoreError("unconfirmed_reception", "PERSISTENCE_UNCONFIRMED");
    return confirmed;
  } catch (error) {
    if (error instanceof LeadStoreError) throw error;
    throw new LeadStoreError(writeAttempted ? "unconfirmed_reception" : "recoverable_error", "RECEIVER_UNAVAILABLE");
  }
}
