import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import console from 'node:console';
import process from 'node:process';
import { Buffer } from 'node:buffer';
const result={date:'2026-10-21',containerId:'GTM-K5MZ4W66',environment:'local development / HTTP inspection, not browser runtime'};
let stage='local-http';
try {
  const response=await globalThis.fetch('http://127.0.0.1:3000/',{signal:globalThis.AbortSignal.timeout(15000)});
  assert.equal(response.status,200);const html=await response.text();const head=html.slice(0,html.indexOf('</head>'));
  stage='head-assertions';
  result.localHttp=response.status;
  result.reactRenderedBootstrapAbsent=!/<script\b[^>]*\bid="analyticsjc-gtm-bootstrap"/.test(head);
  result.localContainerConfigured=html.includes(result.containerId);
  result.locationRequiresHydratedDom=true;
  assert.equal(result.reactRenderedBootstrapAbsent,true);assert.equal(result.localContainerConfigured,true);
  const productionHtml=await fs.readFile('.next/server/app/index.html','utf8');
  result.productionExcludesGtm=!productionHtml.includes('analyticsjc-gtm-bootstrap')&&!productionHtml.includes(result.containerId);
  assert.equal(result.productionExcludesGtm,true);
  stage='published-container';
  const published=await globalThis.fetch(`https://www.googletagmanager.com/gtm.js?id=${result.containerId}`,{signal:globalThis.AbortSignal.timeout(15000)});
  result.gtmHttp=published.status;
  const content=await published.text();
  result.publishedScriptAvailable=published.ok;
  result.publicScriptBytes=Buffer.byteLength(content);
  // Indicadores estáticos, no auditoría de tags ni prueba de firing/recepción.
  result.gaIdReferences=[...new Set(content.match(/\bG-[A-Z0-9]{6,}\b/g)||[])];
  result.browserRuntime='Not evaluated by HTTP script; separate hydration/HMR proof in browser-head-effect.json';
  result.submissionsSent=0;
  await fs.mkdir('docs/evidence/gtm-head',{recursive:true});
  await fs.writeFile('docs/evidence/gtm-head/http-client-head.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
}catch(error){console.error(JSON.stringify({status:'FAIL',stage,result,errorType:error?.name,code:error?.code,causeCode:error?.cause?.code}));process.exitCode=1;}
