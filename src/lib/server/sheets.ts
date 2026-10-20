import "server-only";
import { readFile } from "node:fs/promises";
import { sign } from "node:crypto";

export class SheetsError extends Error {
  readonly status: number;
  constructor(status = 0) { super("SHEETS_UNAVAILABLE"); this.status = status; }
}
let cachedToken: { value: string; expires: number } | undefined;
async function accessToken() {
  if (cachedToken && cachedToken.expires > Date.now() + 60000) return cachedToken.value;
  try {
    const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!path) throw new SheetsError();
    const credential = JSON.parse(await readFile(path, "utf8"));
    if (credential.type !== "service_account" || !credential.client_email || !credential.private_key) throw new SheetsError();
    const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
    const now = Math.floor(Date.now() / 1000);
    const jwt = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({ iss: credential.client_email, scope: "https://www.googleapis.com/auth/spreadsheets", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 })}`;
    const assertion = `${jwt}.${sign("RSA-SHA256", Buffer.from(jwt), credential.private_key).toString("base64url")}`;
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
      signal: AbortSignal.timeout(8000), cache: "no-store",
    });
    if (!response.ok) throw new SheetsError(response.status);
    const token = await response.json();
    if (typeof token.access_token !== "string") throw new SheetsError();
    cachedToken = { value: token.access_token, expires: Date.now() + 3500000 };
    return cachedToken.value;
  } catch { throw new SheetsError(); }
}

// No logs ni errores de proveedor: pueden contener celdas, tokens o credenciales.
export async function sheetsRequest(path: string, body?: unknown) {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id || !/^[\w-]+$/.test(id)) throw new SheetsError();
  try {
    const token = await accessToken();
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(8000), cache: "no-store",
    });
    if (!response.ok) throw new SheetsError(response.status);
    return await response.json();
  } catch (error) { throw error instanceof SheetsError ? error : new SheetsError(); }
}
