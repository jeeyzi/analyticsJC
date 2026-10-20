import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { leadRequestSchema, classifyResponse } from '../src/lib/lead/contract.ts';
import { atomicCreate, newLeadRow, leadColumns } from '../src/lib/server/lead-store.ts';

const id=randomUUID();
const contact={first_name:'QA',last_name:'Test',email:'qa@EXAMPLE.COM',phone:'+56 (9) 0000-0000',company_name:'=1+1',company_type:'other',monthly_ad_spend:'under_2000_usd',problem_to_solve:''};
test('HTTP accepted estricto: malformed,202 y otra submission nunca confirman',()=>{
  const accepted={status:'accepted',submission_id:id,lead_id:randomUUID(),accepted_at:new Date().toISOString(),replayed:false};
  assert.equal(classifyResponse(201,accepted,id),'confirmed_success');
  for(const body of [{},null,{...accepted,lead_id:''},{...accepted,submission_id:randomUUID()}]) assert.equal(classifyResponse(200,body,id),'unconfirmed_reception');
  assert.equal(classifyResponse(202,accepted,id),'unconfirmed_reception');
  assert.equal(classifyResponse(503,{state:'unconfirmed_reception'},id),'unconfirmed_reception');
});
test('schema no acepta IDs de plataforma ni consentimiento fabricados; normalización conservadora',()=>{
  const input=leadRequestSchema.parse({submission_id:id,contact});
  assert.equal(leadRequestSchema.safeParse({...input,gclid:'inventado'}).success,false);
  const row=newLeadRow(input);
  assert.equal(row[leadColumns.indexOf('email')],'qa@example.com');
  assert.equal(row[leadColumns.indexOf('phone')],'+56900000000');
  assert.ok(row.slice(14).every(v=>v===''));
});
test('marcador único y fila forman un solo batch; entradas siempre stringValue',()=>{
  const input=leadRequestSchema.parse({submission_id:id,contact});
  const row=newLeadRow(input);
  const batch=atomicCreate(123,input,row);
  assert.equal(batch.requests.length,2);
  assert.equal(batch.requests[0].addNamedRange.namedRange.namedRangeId,atomicCreate(123,input,newLeadRow(input)).requests[0].addNamedRange.namedRange.namedRangeId);
  assert.equal(batch.requests[1].appendCells.rows[0].values[leadColumns.indexOf('company_name')].userEnteredValue.stringValue,'=1+1');
});
