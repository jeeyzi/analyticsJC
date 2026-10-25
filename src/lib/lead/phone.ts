import { Metadata, getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/core";
import metadata from "libphonenumber-js/metadata.min.json";

export type { CountryCode };
export const defaultPhoneCountry: CountryCode = "CL";
export const phoneCountries = getCountries(metadata);
export function phonePrefix(country: CountryCode) { return `+${getCountryCallingCode(country, metadata)}`; }
export function nationalPhoneLengths(country: CountryCode): number[] {
  // Contacto chileno fijo/móvil: SUBTEL9; metadata general también incluye servicios especiales.
  if (country === "CL") return [9];
  const plan = new Metadata(metadata);
  plan.selectNumberingPlan(country);
  return plan.numberingPlan!.possibleLengths();
}
export function maxNationalPhoneLength(country: CountryCode) { return Math.max(...nationalPhoneLengths(country)); }
export function nationalPhoneValue(value: string, country: CountryCode): string {
  const compact = value.replace(/[ ()-]/g, "");
  const prefix = phonePrefix(country);
  return compact.startsWith(prefix) ? compact.slice(prefix.length) : compact;
}
export function phoneWithCountry(national: string, country: CountryCode) { return national ? `${phonePrefix(country)}${national}` : ""; }
// Sin letras, extensiones o truncado: un pegado incompatible se rechaza entero.
export function normalizeNationalPhoneInput(raw: string, country: CountryCode, previous = ""): string | undefined {
  if (!raw.trim()) return "";
  if (!/^\+?[\d ()-]+$/.test(raw.trim())) return;
  let digits = raw.trim().replace(/[ ()-]/g, "");
  if (digits.startsWith("+")) {
    if (!digits.startsWith(phonePrefix(country))) return;
    digits = digits.slice(phonePrefix(country).length);
  }
  if (!/^\d*$/.test(digits)) return;
  if (digits.length > maxNationalPhoneLength(country) && digits.length >= previous.length) return;
  return digits;
}
export function possibleInternationalPhone(value: string): boolean {
  if (!/^\+[\d ()-]+$/.test(value)) return false;
  const parsed = parsePhoneNumberFromString(value, metadata);
  return !!parsed && parsed.isPossible() && (parsed.countryCallingCode !== "56" || parsed.nationalNumber.length === 9);
}
