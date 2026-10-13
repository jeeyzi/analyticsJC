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
  problem: {
    heading: "Tu medición puede terminar donde empieza la venta.",
    introduction: "Un formulario enviado muestra que alguien se interesó. Para evaluar la inversión, necesitas saber qué ocurrió después: si ese contacto se convirtió en una oportunidad y si terminó comprando.",
    symptoms: [
      {
        heading: "Mides contactos, pero no resultados comerciales",
        body: "Sabes cuántos leads genera cada campaña, pero no cuáles avanzan a oportunidades o ventas. Comparar solo el costo por lead puede favorecer campañas que traen contactos baratos con poco valor comercial.",
      },
      {
        heading: "Los datos de publicidad, web y CRM no encajan",
        body: "Las plataformas reportan cifras distintas y cuesta explicar las diferencias. Sin revisar cómo se registra cada conversión, resulta difícil saber qué información utilizar para decidir.",
      },
      {
        heading: "Tus campañas reciben señales incompletas",
        body: "Si las plataformas solo reciben el envío del formulario, la optimización no incorpora qué contactos avanzan o compran. Conectar esos resultados puede aportar señales más útiles, cuando la integración sea viable.",
      },
    ],
  },
  impact: "Con esa conexión, puedes evaluar dónde reasignar presupuesto y qué campañas priorizar por su aporte comercial. El efecto depende también de las campañas, la oferta y el proceso de ventas.",
} as const;
