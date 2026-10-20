import assert from 'node:assert/strict';
import console from 'node:console';
import process from 'node:process';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { persistLead, readLeadRows, LeadStoreError } from '../src/lib/server/lead-store.ts';
const input={submission_id:randomUUID(),contact:{first_name:'QA',last_name:'Timeout',email:'qa-timeout@example.com',phone:'+56 9 0000 0001',company_name:'QA Timeout',company_type:'other',monthly_ad_spend:'under_2000_usd',problem_to_solve:''}};
const originalFetch=globalThis.fetch;
try {
  await readLeadRows();
  let committed=false;
  globalThis.fetch=async (...args)=>{
    if(committed) throw new Error('INJECTED_CONNECTION_LOSS');
    const response=await originalFetch(...args);
    if(String(args[0]).endsWith(':batchUpdate') && response.ok) { committed=true; throw new Error('INJECTED_RESPONSE_LOSS'); }
    return response;
  };
  await assert.rejects(persistLead(input), error=>error instanceof LeadStoreError && error.state==='unconfirmed_reception');
  assert.equal(committed,true);
  globalThis.fetch=originalFetch;
  const replay=await persistLead(input);
  assert.equal(replay.replayed,true);
  const rows=(await readLeadRows()).filter(r=>r[0]===input.submission_id);
  assert.equal(rows.length,1); assert.equal(rows[0][1],replay.lead_id);
  const result={status:'PASS',method:'Real Sheets commit followed by injected lost response and failed reconciliation; manual replay',submission_id:input.submission_id,lead_id:replay.lead_id,rows:1,stateBeforeRetry:'unconfirmed_reception',stateAfterRetry:'accepted'};
  await writeFile('docs/evidence/lead-sheets/timeout-replay.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
} catch { console.error(JSON.stringify({status:'FAIL',submission_id:input.submission_id,code:'TIMEOUT_TEST_FAILED'}));process.exitCode=1; }
finally { globalThis.fetch=originalFetch; }
