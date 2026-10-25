import { qaEnvironmentAllowed } from "../environment.ts";
type GtmQaConfig = {
  vercelEnv?: string;
  qaEnabled?: string;
  nodeEnv: string | undefined;
  siteEnv: string | undefined;
  measurementQaEnabled: string | undefined;
  gtmQaEnabled: string | undefined;
  containerId: string | undefined;
};

export function gtmQaContainerId(config: GtmQaConfig): string | undefined {
  if (!qaEnvironmentAllowed(config) || config.measurementQaEnabled !== "true" || config.gtmQaEnabled !== "true") return;
  return config.containerId && /^GTM-[A-Z0-9]+$/.test(config.containerId) ? config.containerId : undefined;
}

// Snippet proporcionado por José, conservando dataLayer y carga async única.
// El contenedor no implica readiness GA ni permiso para enviar contacto.
export function gtmHeadSnippet(containerId: string, preview = false): string {
  if (!/^GTM-[A-Z0-9]+$/.test(containerId)) return "";
  return `(function(w,d,s,l,i){try{
if(!${preview}&&!['localhost','127.0.0.1','[::1]'].includes(w.location.hostname))return;
w[l]=w[l]||[];if(!Array.isArray(w[l])||d.getElementById('analyticsjc-gtm-container'))return;
w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.id='analyticsjc-gtm-container';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
d.head.appendChild(j);
}catch{}})(window,document,'script','dataLayer','${containerId}');`;
}

// React no renderiza scripts: el efecto cliente crea nodos ejecutables en HEAD.
// No remover en cleanup: GTM ya cargado y dedupe viven durante todo el documento.
export function installGtmHead(document: Document, hostname: string, containerId: string, preview = false): boolean {
  try {
    if ((!preview && !["localhost", "127.0.0.1", "[::1]"].includes(hostname)) || !/^GTM-[A-Z0-9]+$/.test(containerId)) return false;
    if (document.getElementById("analyticsjc-gtm-bootstrap")) return false;
    const script = document.createElement("script");
    script.id = "analyticsjc-gtm-bootstrap";
    script.text = gtmHeadSnippet(containerId, preview);
    document.head.appendChild(script);
    return true;
  } catch { return false; }
}
