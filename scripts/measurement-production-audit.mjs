import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import console from 'node:console';
import process from 'node:process';

try {
  const html=await fs.readFile('.next/server/app/index.html','utf8');
  const result={environment:'local production build artifact; no deployment',noFormPreview:!html.includes('id="diagnosis_request"'),noMeasurementBootstrap:!html.includes('MeasurementBootstrap'),noManualPageEvents:!html.includes('site_page_view'),noMeasurementVersion:!html.includes('measurement_version'),noGtmGaScripts:!/<script[^>]+src=["'][^"']*(?:googletagmanager|google-analytics)/i.test(html),noRemoteNoscript:!/<noscript>\s*<iframe/i.test(html),productionDisabledWithQaFlag:'PASS: runtime production gate covered by measurement.test.mjs'};
  for(const value of Object.values(result))if(typeof value==='boolean')assert.equal(value,true);
  await fs.writeFile('docs/evidence/measurement/production-artifact.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
}catch{console.error('MEASUREMENT_PRODUCTION_ARTIFACT_AUDIT_FAILED');process.exitCode=1;}
