import { Container } from "@/components/layout/Container";
import { site } from "@/content/site";

// Destinos sintéticos de QA, nunca se incluyen en un build de producción.
// No representan las secciones comerciales ni un formulario implementado.
export function HeaderNavigationPreview() {
  return <Container>
    <p>Muestra local de Header + Navigation. Destinos sintéticos de validación.</p>
    {[...site.navigation.links, site.navigation.cta].map((link) => (
      <div key={link.href} style={{ paddingBlock: "var(--space-24)" }}>
        <h2 id={link.href.slice(1)} tabIndex={-1}>{link.label}</h2>
      </div>
    ))}
  </Container>;
}
