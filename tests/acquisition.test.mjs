import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { captureAcquisition, createAcquisitionSession, sanitizeAcquisition } from '../src/lib/lead/acquisition.ts';
import { leadRequestSchema } from '../src/lib/lead/contract.ts';
import { newLeadRow, leadColumns } from '../src/lib/server/lead-store.ts';

test('captura URL una vez, preserva case IDs y elimina query/referrer sensibles', () => {
  const context = captureAcquisition('http://localhost:3000/?utm_source=qa_source&utm_medium=qa_medium&utm_campaign=qa_campaign&utm_content=qa_content&utm_term=qa_term&gclid=Qa_Gc-123&gbraid=Qa_Gb-456&wbraid=Qa_Wb-789&email=private%40example.net#secret', 'https://example.org/private?email=private@example.net');
  assert.deepEqual(context, {utm_source:'qa_source',utm_medium:'qa_medium',utm_campaign:'qa_campaign',utm_content:'qa_content',utm_term:'qa_term',gclid:'Qa_Gc-123',gbraid:'Qa_Gb-456',wbraid:'Qa_Wb-789',landing_page:'/',referrer:'https://example.org'});
});
test('ausentes, duplicados, no autorizados y PII no se convierten en señales', () => {
  assert.deepEqual(captureAcquisition('http://localhost:3000/',''), {landing_page:'/'});
  assert.deepEqual(captureAcquisition('http://localhost:3000/?utm_source=qa_source&utm_source=qa_google&gclid=bad%20id&utm_term=private%40example.net','https://unknown.example/private'), {landing_page:'/'});
  assert.deepEqual(sanitizeAcquisition({email:'private@example.net',utm_campaign:'unknown',fbp:'fake',ga_client_id:'fake',analytics_storage:'granted',gclid:'a'.repeat(513),landing_page:'/?email=private'}), {utm_campaign:'unknown'});
});
test('valores dinámicos sin catálogo, límites exactos y saneamiento idempotente', () => {
  const campaign='campana_'+randomUUID();
  const values={utm_source:'nuevo_canal',utm_medium:'social_paid',utm_campaign:campaign,utm_content:' Creatividad Ágil ',utm_term:'medición avanzada',gclid:'NewClick_'+randomUUID(),gbraid:'NewBraid_'+randomUUID(),wbraid:'NewWeb_'+randomUUID()};
  const clean=sanitizeAcquisition(values);
  assert.deepEqual(clean,{...values,utm_content:'Creatividad Ágil'});
  assert.deepEqual(sanitizeAcquisition(clean),clean);
  assert.equal(sanitizeAcquisition({utm_campaign:'campana_73460906-aab1-4f19-bfdb-8264ca24a6ad'}).utm_campaign,'campana_73460906-aab1-4f19-bfdb-8264ca24a6ad');
  assert.equal(sanitizeAcquisition({utm_campaign:'a'.repeat(100)}).utm_campaign.length,100);
  assert.deepEqual(sanitizeAcquisition({utm_campaign:'a'.repeat(101),utm_term:42,utm_content:['campaign'],utm_medium:null}),{});
  assert.equal(sanitizeAcquisition({gclid:'a'.repeat(512)}).gclid.length,512);
});
test('rechazo defensivo PII, controles, markup y encoding residual', () => {
  for(const value of ['private@example.net','56912345678','56-9-1234-5678','lead_56912345678','hola\nsecreto','x\u0000y','<script>','https://example.com','private%40example.net','private%2540example.net','=FORMULA()']) assert.deepEqual(sanitizeAcquisition({utm_campaign:value}),{});
  for(const value of ['56912345678','private@example.net','a%2Fb','bad id','a'.repeat(513)]) assert.deepEqual(sanitizeAcquisition({gclid:value}),{});
});
test('PII coincidente con contacto se excluye al persistir sin afectar contacto ni otras señales', () => {
  const contact={first_name:'Mariana',last_name:'Ejemplo',email:'qa@example.com',phone:'+56900000000',company_name:'Empresa Prueba',company_type:'other',monthly_ad_spend:'under_2000_usd',problem_to_solve:'Problema privado'};
  const input=leadRequestSchema.parse({submission_id:randomUUID(),contact,acquisition:{utm_source:'nuevo_canal',utm_campaign:'mariana_campana',utm_content:'empresa_prueba',utm_term:'problema_privado',gclid:'ejemplo'}});
  const row=newLeadRow(input);
  assert.equal(row[leadColumns.indexOf('utm_source')],'nuevo_canal');
  for(const key of ['utm_campaign','utm_content','utm_term','gclid']) assert.equal(row[leadColumns.indexOf(key)],'');
  assert.equal(row[leadColumns.indexOf('first_name')],'Mariana');
});
test('navegación y query vacía no pisan primer contexto; snapshot aislado y nueva vida no hereda', () => {
  const session = createAcquisitionSession();
  session.capture('http://localhost:3000/?utm_source=qa_source&gclid=Qa_First','');
  const frozen = JSON.stringify(session.snapshot());
  session.capture('http://localhost:3000/privacidad?utm_source=qa_google','');
  session.capture('http://localhost:3000/','');
  session.snapshot().gclid='changed';
  assert.equal(JSON.stringify(session.snapshot()),frozen);
  assert.deepEqual(createAcquisitionSession().snapshot(),{});
});
test('servidor mapea señales permitidas, descarta campos ajenos y no inventa consentimiento', () => {
  const input=leadRequestSchema.parse({submission_id:randomUUID(),contact:{first_name:'QA',last_name:'Test',email:'qa@example.com',phone:'+56900000000',company_name:'QA',company_type:'other',monthly_ad_spend:'under_2000_usd'},acquisition:{utm_source:'qa_source',gclid:'Qa_Exact',analytics_storage:'granted',fbp:'fabricated'}});
  const row=newLeadRow(input);
  assert.equal(row[leadColumns.indexOf('utm_source')],'qa_source');
  assert.equal(row[leadColumns.indexOf('gclid')],'Qa_Exact');
  for(const key of ['fbp','fbc','ga_client_id','ga_session_id','analytics_storage','ad_storage','ad_user_data','ad_personalization','consent_timestamp','consent_version']) assert.equal(row[leadColumns.indexOf(key)],'');
});
