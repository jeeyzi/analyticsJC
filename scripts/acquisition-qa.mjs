import assert from 'node:assert/strict';
import console from 'node:console';
import process from 'node:process';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { captureAcquisition } from '../src/lib/lead/acquisition.ts';
import { readLeadRows, leadColumns } from '../src/lib/server/lead-store.ts';
const origin='http://127.0.0.1:3000';
const contact={first_name:'QA',last_name:'Attribution',email:'qa-attribution@example.com',phone:'+56900000003',company_name:'QA Attribution',company_type:'other',monthly_ad_spend:'under_2000_usd',problem_to_solve:''};
const evidence={environment:'local QA / real Sheets / synthetic URL identifiers',cases:[]};
let stage='start';
async function post(input){const response=await globalThis.fetch(origin+'/api/leads',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(input)});return {http:response.status,body:await response.json()};}
try {
  const dynamicCampaign='new_campaign_'+randomUUID();
  const dynamicClick='new_click_'+randomUUID();
  for(const query of [`?utm_source=new_source&utm_medium=new_medium&utm_campaign=${dynamicCampaign}&utm_content=new_creative&utm_term=new_keyword&gclid=${dynamicClick}&gbraid=New_Braid&wbraid=New_Web`,'']) {
    const acquisition=captureAcquisition(origin+'/'+query,query?'https://example.org/test':'');
    if(query) { assert.equal(acquisition.utm_campaign,dynamicCampaign); assert.equal(acquisition.gclid,dynamicClick); }
    const input={submission_id:randomUUID(),contact,acquisition};
    stage='concurrent-write';
    const replies=await Promise.all([post(input),post(input)]);
    assert.ok(replies.every(r=>[200,201].includes(r.http)));
    assert.equal(replies[0].body.lead_id,replies[1].body.lead_id);
    stage='replay';
    const retry=await post(input);
    assert.equal(retry.http,200);
    assert.equal(retry.body.lead_id,replies[0].body.lead_id);
    // Incluso un cliente alterado no puede cambiar la atribución del lead ya recibido.
    assert.equal((await post({...input,acquisition:{utm_campaign:'qa_second',gclid:'Changed'}})).http,200);
    stage='read-confirmation';
    const rows=(await readLeadRows()).filter(r=>r[0]===input.submission_id);
    assert.equal(rows.length,1);
    for(const key of leadColumns.slice(14)) assert.equal(rows[0][leadColumns.indexOf(key)]??'',acquisition[key]??'');
    evidence.cases.push({case:query?'all_url_signals':'no_campaign',status:'PASS',submission_id:input.submission_id,lead_id:rows[0][1],rows:1,mapping:'PASS',replay:'PASS',contextImmutable:'PASS',missingSignals:'EMPTY'});
  }
  await mkdir('docs/evidence/acquisition',{recursive:true});
  await writeFile('docs/evidence/acquisition/dynamic-values-qa.json',JSON.stringify(evidence,null,2));
  console.log(JSON.stringify(evidence));
} catch {console.error(JSON.stringify({status:'FAIL',stage,code:'QA_CHECK_FAILED',completed:evidence}));process.exitCode=1;}
