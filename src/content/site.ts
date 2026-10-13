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
  solution: {
    heading: "Una medición que conecta la captación con el resultado comercial.",
    supportingCopy: "Conectamos la información de tus campañas, tu sitio y tu CRM para seguir el recorrido del lead hasta la oportunidad y la venta. Según las brechas de tu operación, el proyecto puede incluir auditoría, implementación, corrección de datos y reporting.",
    journey: "Campaña → Lead → CRM → Oportunidad → Venta",
    nodes: ["Campaña", "Lead", "CRM", "Oportunidad", "Venta"],
    conceptualLabel: "Esquema conceptual",
    conditionalReturn: "Cuando la integración lo permite, los resultados comerciales también se envían a las plataformas publicitarias como señales de conversión.",
    services: [
      { heading: "Auditoría de trazabilidad", body: "Identificamos dónde se pierde la conexión entre una campaña, el contacto que genera y su resultado en el CRM." },
      { heading: "Auditoría de calidad de datos", body: "Revisamos eventos y conversiones del sitio y las plataformas publicitarias para detectar registros duplicados, datos incompletos y diferencias que necesitan explicación." },
      { heading: "Implementación y corrección de medición", body: "Implementamos o corregimos eventos, conversiones e integraciones para recoger la información que necesita tu negocio." },
      { heading: "Reporting de marketing y ventas", body: "Organizamos los datos para comparar campañas por leads, oportunidades y ventas, con definiciones claras de cada indicador." },
      { heading: "Conexión entre campañas y CRM", body: "Vinculamos el origen de los leads con su avance comercial y evaluamos qué resultados pueden devolverse a las plataformas para optimizar." },
    ],
    technicalDetail: "Según el alcance, trabajamos con GA4, Google Tag Manager, integraciones con CRM, BigQuery y mecanismos de conversión online y offline. La tecnología se define después de entender qué información falta y para qué se necesita.",
    scope: "Cada proyecto aborda las capacidades que requiere el problema detectado. El diagnóstico inicial orienta el alcance; la auditoría técnica detallada se acuerda por separado.",
    cta: { label: "Solicitar diagnóstico inicial", href: "#diagnostico" },
  },
} as const;
