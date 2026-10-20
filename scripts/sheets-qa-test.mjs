import assert from 'node:assert/strict';
import console from 'node:console';
import process from 'node:process';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { readLeadRows, leadColumns, normalizedContact } from '../src/lib/server/lead-store.ts';

const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:3000';
const input = { submission_id: randomUUID(), contact: { first_name: 'QA Sintético', last_name: 'Integración', email: 'qa-lead-integration@example.com', phone: '+56 9 0000 0000', company_name: '=QA_SYNTHETIC()', company_type: 'agency', monthly_ad_spend: '2000_5000_usd', problem_to_solve: 'Prueba sintética; no contactar.' } };
const results = {};
let stage = 'read-before';
async function post(body, headers = {}) {
  const response = await globalThis.fetch(origin + '/api/leads', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  return { http: response.status, body: await response.json() };
}
try {
  const before = await readLeadRows();
  assert.equal(before.filter(r => r[0] === input.submission_id).length, 0);
  stage = 'concurrent-http';
  const concurrent = await Promise.all(Array.from({length: 4}, () => post(input)));
  results.http = concurrent.map(r => ({http:r.http,code:r.body.code,state:r.body.state}));
  assert.ok(concurrent.every(r => [200,201].includes(r.http) && r.body.status === 'accepted'));
  const ids = new Set(concurrent.map(r => r.body.lead_id));
  assert.equal(ids.size, 1);
  const replay = await post(input);
  assert.equal(replay.http, 200); assert.equal(replay.body.replayed, true);
  assert.equal(replay.body.lead_id, concurrent[0].body.lead_id);
  const after = await readLeadRows();
  const rows = after.filter(r => r[0] === input.submission_id);
  assert.equal(rows.length, 1);
  assert.equal(after.length, before.length + 1);
  const expected = normalizedContact(input.contact);
  const row = rows[0];
  for (const key of ['first_name','last_name','email','phone','company_name','company_type','problem_to_solve']) assert.equal(row[leadColumns.indexOf(key)], expected[key]);
  assert.equal(row[leadColumns.indexOf('ad_spend')], input.contact.monthly_ad_spend);
  for (const key of leadColumns.slice(14)) assert.equal(row[leadColumns.indexOf(key)] ?? '', '');
  assert.ok(row[0] && row[1]);
  results.persistence = { status:'PASS', submission_id: input.submission_id, lead_id: row[1], rowCount: rows.length, requests: concurrent.map(r=>r.http), replay: replay.http, mapping:'PASS', unavailableSignals:'EMPTY', literalFormula:'PASS' };
  const conflict = await post({...input,contact:{...input.contact,company_name:'Cambio sintético'}});
  assert.equal(conflict.http,409);
  const invalid = await post({...input, contact:{...input.contact,email:'invalid'}});
  assert.equal(invalid.http,422);
  const oversized = await post({...input,extra:'x'.repeat(17000)});
  assert.equal(oversized.http,413);
  const originDenied = await post(input,{Origin:'https://example.com'});
  assert.equal(originDenied.http,403);
  const typeDenied = await post(input,{'Content-Type':'text/plain'});
  assert.equal(typeDenied.http,415);
  const get = await globalThis.fetch(origin+'/api/leads'); assert.equal(get.status,405);
  assert.equal((await readLeadRows()).filter(r=>r[0]===input.submission_id).length,1);
  results.security = { conflict:409, validation:422, payload:413, origin:403, contentType:415, method:405, noAdditionalRow:true };
  await mkdir('docs/evidence/lead-sheets',{recursive:true});
  await writeFile('docs/evidence/lead-sheets/real-qa.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results));
} catch {
  console.error(JSON.stringify({status:'FAIL',stage,completed:results,submission_id:input.submission_id,code:'QA_ASSERTION_OR_CONNECTION_FAILED'}));
  process.exitCode=1;
}
