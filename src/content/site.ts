// Copy de docs/content.md; label Menú adoptado en header-navigation-review.md.
export const site = {
  identity: "José Cubillo",
  specialty: "Digital Analytics & Tracking",
  title: "José Cubillo · Digital Analytics & Tracking",
  description: "Conectamos campañas, CRM y resultados comerciales.",
  skipLink: "Saltar al contenido",
  navigation: {
    links: [
      { label: "Solución", href: "#solucion" },
      { label: "Proceso", href: "#proceso" },
      { label: "Experiencia", href: "#experiencia" },
    ],
    cta: { label: "Solicitar diagnóstico inicial", href: "#diagnostico" },
    menu: "Menú",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
  },
  hero: {
    eyebrow: "Medición y trazabilidad para generación de leads",
    heading: "Conecta tus campañas con las oportunidades y ventas de tu CRM.",
    supportingCopy: "Identifica qué campañas generan negocio y utiliza señales de resultados comerciales para orientar tu inversión publicitaria. Revisamos la medición, corregimos brechas y conectamos la captación con lo que ocurre después del formulario.",
    audience: "Para empresas que captan leads con publicidad y utilizan un CRM.",
    cta: { label: "Solicitar diagnóstico inicial", href: "#diagnostico" },
    microcopy: "Cuéntanos qué necesitas resolver. Revisaremos tu solicitud y te contactaremos si hay encaje para una conversación.",
    identity: "José Cubillo · Digital Analytics & Tracking",
  },
} as const;
