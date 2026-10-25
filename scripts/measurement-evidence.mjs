import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import console from 'node:console';
import { createHash } from 'node:crypto';
import { readLeadRows, leadColumns } from '../src/lib/server/lead-store.ts';

const folder='docs/evidence/measurement';
const walk=async directory=>{
  const result=[];
  for(const entry of await fs.readdir(directory,{withFileTypes:true}).catch(()=>[])) {
    const file=path.join(directory,entry.name);
    if(entry.isDirectory())result.push(...await walk(file));else result.push(file);
  }
  return result;
};
let stage='browser-evidence';
const results=[];
try {
  if(!process.argv.includes('--security-only')) {
  const browser=JSON.parse(await fs.readFile(`${folder}/browser-replay.json`,'utf8'));
  const isolation=JSON.parse(await fs.readFile(`${folder}/browser-isolation.json`,'utf8'));
  assert.equal(browser.uncertain.leadCount,0);assert.equal(browser.replay.leadCount,1);
  assert.equal(browser.replay.identicalRetry,true);assert.equal(browser.dedupe.duplicateLead,false);
  assert.equal(browser.dedupe.piiOutsideRestricted,false);
  assert.equal(isolation.result.confirmed,true);assert.ok(isolation.result.pushFailures>=2);
  stage='sheets-read';
  const rows=await readLeadRows();
  for(const evidence of [browser.replay,isolation.result]) {
    const matches=rows.filter(row=>row[0]===evidence.submission_id);
    assert.equal(matches.length,1);const row=matches[0];assert.equal(row[1],evidence.lead_id);
    for(const [key,value] of Object.entries(evidence.acquisition))assert.equal(row[leadColumns.indexOf(key)],value);
    for(const key of ['ga_client_id','ga_session_id','fbp','fbc','analytics_storage','ad_storage','ad_user_data','ad_personalization','consent_timestamp','consent_version'])assert.equal(row[leadColumns.indexOf(key)]??'','');
    // Replays reales del mismo fixture existente: no crea otra fila ni almacena PII en evidencia.
    stage='concurrent-replay';
    const field=key=>row[leadColumns.indexOf(key)]??'';
    const contact=Object.fromEntries(['first_name','last_name','email','phone','company_name','company_type','problem_to_solve'].map(key=>[key,field(key)]));
    contact.monthly_ad_spend=field('ad_spend');
    const origin='http://127.0.0.1:3000';
    const responses=await Promise.all(Array.from({length:4},async()=>{
      const response=await globalThis.fetch(`${origin}/api/leads`,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({submission_id:row[0],contact,acquisition:{utm_campaign:'changed_context_must_not_apply'}})});
      const body=await response.json();assert.equal(response.status,200);assert.equal(body.replayed,true);assert.equal(body.lead_id,row[1]);return response.status;
    }));
    const after=(await readLeadRows()).filter(value=>value[0]===row[0]);assert.equal(after.length,1);assert.deepEqual(after[0],row);
    results.push({submission_id:row[0],lead_id:row[1],rows:1,acquisitionMapping:'PASS',gaConsentMetaAbsent:'PASS',concurrentExistingReplayHttp:responses,contextUnchanged:'PASS'});
  }
  await fs.writeFile(`${folder}/sheets-verification.json`,JSON.stringify({status:'PASS',environment:'real private Sheets / synthetic fixtures from browser / no new row by replay audit',cases:results},null,2));
  }
  stage='security-scan';
  const credential=JSON.parse(await fs.readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS,'utf8'));
  const fragments=credential.private_key.split('\n').filter(line=>line.length>40&&!line.startsWith('---'));
  const files=[...await walk('.next/static'),...await walk('.next/dev/static')];
  let secrets=false;let fixtureInBundle=false;
  const markers=['qa-webmeasurement@example.com','qa-webmeasurement-isolation@example.com','WM_PRIVATE_COMPANY','WM_PRIVATE_PROBLEM','WM_PRIVATE_ISOLATION_COMPANY','+56 9 0000 0005','+56 9 0000 0006'];
  for(const file of files){const value=await fs.readFile(file,'utf8');if(fragments.some(fragment=>value.includes(fragment))||value.includes('BEGIN PRIVATE KEY')||value.includes(credential.client_email)||value.includes(process.env.GOOGLE_SHEETS_SPREADSHEET_ID))secrets=true;if(markers.some(marker=>value.includes(marker)))fixtureInBundle=true;}
  const logs=await walk('.next/dev/logs');let fixtureInLogs=false;
  for(const file of logs){const value=await fs.readFile(file,'utf8');if(markers.some(marker=>value.includes(marker)))fixtureInLogs=true;}
  const security={assets:files.length,logFiles:logs.length,secretsFound:secrets,fixturePIIInBundle:fixtureInBundle,fixturePIIInLogs:fixtureInLogs,scope:'available local assets/logs only; not hosting/provider logs'};
  await fs.writeFile(`${folder}/security.json`,JSON.stringify(security,null,2));assert.ok(files.length>0);assert.equal(secrets,false);assert.equal(fixtureInBundle,false);assert.equal(fixtureInLogs,false);
  const sources=['AGENTS.md','docs/decisions.md','docs/strategy.md','docs/product.md','docs/wireframe.md','docs/content.md','docs/design.md','docs/technical.md','docs/measurement.md','acceptance.md','docs/web-measurement-review.md'];
  const hashes=await Promise.all(sources.map(async file=>({path:file,sha256:createHash('sha256').update(await fs.readFile(file)).digest('hex')})));
  await fs.writeFile(`${folder}/source-hashes.json`,JSON.stringify({date:'2026-10-20',sources:hashes},null,2));
  console.log(JSON.stringify({status:'PASS',verifiedFixtures:results.length,concurrentReplays:results.length*4,security}));
}catch{console.error(`MEASUREMENT_EVIDENCE_FAILED stage=${stage}; no private error output`);process.exitCode=1;}
