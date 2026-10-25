"use client";

import { useState } from "react";
import { Field } from "@/components/ui/Field";
import { defaultPhoneCountry, phoneCountries, phonePrefix, maxNationalPhoneLength, nationalPhoneValue, phoneWithCountry, normalizeNationalPhoneInput, type CountryCode } from "@/lib/lead/phone";

export type PhoneCountryOption = { country: CountryCode; label: string };

export function PhoneField({ value, onChange, disabled, error, options }: { value: string; onChange: (value: string) => void; disabled: boolean; error?: string; options: PhoneCountryOption[] }) {
  const [country, setCountry] = useState<CountryCode>(defaultPhoneCountry);
  const national = nationalPhoneValue(value, country);
  function update(raw: string): boolean {
    const next = normalizeNationalPhoneInput(raw, country, national);
    if (next === undefined) return false;
    onChange(phoneWithCountry(next, country));
    return true;
  }
  return <>
    <Field id="diagnosis-phone-country" name="phone_country_ui" kind="select" label="País del teléfono" autoComplete="off" disabled={disabled} value={country} onChange={(event) => {
      const next = event.target.value as CountryCode;
      if (!phoneCountries.includes(next)) return;
      setCountry(next);
      onChange(phoneWithCountry(national, next));
    }}>
      {options.map(({ country, label }) => <option key={country} value={country}>{label}</option>)}
    </Field>
    <Field id="diagnosis-phone" name="phone" label="Teléfono" prefix={phonePrefix(country)} type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={maxNationalPhoneLength(country)} required disabled={disabled} error={error} value={national} onChange={(event) => {
      if (!update(event.target.value)) event.currentTarget.value = national;
    }} onPaste={(event) => {
      event.preventDefault();
      const input = event.currentTarget;
      const pasted = event.clipboardData.getData("text");
      const replacement = pasted.trim().startsWith("+") ? pasted : national.slice(0, input.selectionStart ?? 0) + pasted + national.slice(input.selectionEnd ?? national.length);
      update(replacement);
    }} />
  </>;
}
