import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { LeadForm } from "@/components/lead/LeadForm";
import { site } from "@/content/site";
import typography from "@/styles/typography.module.css";
import { phoneCountries, phonePrefix } from "@/lib/lead/phone";

export function LeadFormPreview() {
  // Serializar una sola lista evita diferencias de ICU entre Node y navegador.
  const countryNames = new Intl.DisplayNames(["es"], { type: "region" });
  const phoneCountryOptions = phoneCountries.map((country) => ({ country, label: `${countryNames.of(country) ?? country} (${phonePrefix(country)})` })).sort((a, b) => a.label.localeCompare(b.label, "es"));
  return <Section id="diagnostico" aria-labelledby="titulo-formulario-local"><Container>
    <div className={typography.titleText}><h2 id="titulo-formulario-local">{site.leadForm.heading}</h2><p className={typography.body}>{site.leadForm.introduction}</p></div>
    <LeadForm phoneCountryOptions={phoneCountryOptions} />
  </Container></Section>;
}
