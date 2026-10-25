import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import process from 'node:process';
import { createMeasurement, track, trackFormStart, measurementQaEnabled } from '../src/lib/measurement/runtime.ts';
import { confirmedLeadEvent, clientValidationError, receptionError, ga4Parameters, formContext } from '../src/lib/measurement/events.ts';
import { leadRequestSchema } from '../src/lib/lead/contract.ts';
import { newLeadRow, leadColumns } from '../src/lib/server/lead-store.ts';

const contact = { first_name:'QA Measurement', last_name:'Synthetic', email:'qa-measurement@example.com', phone:'+56 9 0000 0005', company_name:'PRIVATE_COMPANY_SENTINEL', company_type:'agency', monthly_ad_spend:'2000_5000_usd', problem_to_solve:'PRIVATE_PROBLEM_SENTINEL' };
const submission = randomUUID();
const accepted = { status:'accepted', submission_id:submission, lead_id:randomUUID(), accepted_at:new Date().toISOString(), replayed:false };
const lead = confirmedLeadEvent(201,accepted,submission,contact);
const cta = { event:'click_to_action', page_type:'home', cta_id:'request_diagnosis', cta_location:'hero', target_id:'diagnostico' };

test('contrato rechaza eventos/keys no adoptados y PII fuera de user_data',()=>{
  const host={}; const runtime=createMeasurement(host,true);
  for(const event of [{...cta,email:contact.email},{...cta,measurement_version:'1'},{...cta,page_type:'landing'},{event:'site_page_view'},{event:'page_view'},{event:'service_view'},{event:'faq_interaction'},{...lead,company_name:contact.company_name},{...lead,user_data:{...lead.user_data,address:{...lead.user_data.address,country:'CL'}}}]) assert.equal(runtime.track(event),false);
  assert.equal(host.dataLayer,undefined);
  assert.equal(runtime.track(cta),true);
});
test('secuencia CTA→inicio→error→submit→lead: tipos, reset de estado GTM y mapper GA4 sin PII',()=>{
  const host={dataLayer:[]}; const runtime=createMeasurement(host,true); const original=host.dataLayer;
  runtime.track(cta); runtime.track({...formContext,event:'form_start'});
  runtime.track(clientValidationError({...contact,email:'invalid'},false));
  runtime.track({...formContext,event:'form_submit',attempt_type:'initial'});runtime.track(lead);
  runtime.track({...cta,cta_location:'experience'});
  assert.equal(host.dataLayer,original);
  assert.deepEqual(host.dataLayer.map(e=>e.event),['click_to_action','form_start','form_error','form_submit','generate_lead','click_to_action']);
  assert.equal(host.dataLayer.at(-1).user_data,null);
  assert.equal(host.dataLayer[3].error_code,null);
  for(const event of host.dataLayer) {
    const mapped=ga4Parameters(event);
    for(const key of ['ga_client_id','ga_session_id']) {
      assert.deepEqual(ga4Parameters({...event,[key]:'123.456'}),{});
      assert.equal(runtime.track({...event,[key]:'123.456'}),false);
    }
    assert.ok(!JSON.stringify(mapped).includes(contact.email));
    for(const key of ['user_data','email','phone_number','first_name','last_name','company_name','problem_to_solve','submission_id','request_id','measurement_version','ga_client_id','gclid']) assert.equal(key in mapped,false);
    assert.ok(!JSON.stringify(event).includes(contact.company_name));
    assert.ok(!JSON.stringify(event).includes(contact.problem_to_solve));
  }
  assert.deepEqual(ga4Parameters(host.dataLayer[4]),{page_type:'home',form_id:'diagnosis_request',lead_type:'diagnosis_request',lead_id:accepted.lead_id,company_type:'agency',monthly_ad_spend:'2000_5000_usd'});
});
test('errores controlados: required/formato/opción/longitud/múltiples, Step1 y servidor sin eco',()=>{
  for(const [draft,field,code] of [
    [{...contact,first_name:''},'first_name','required'],[{...contact,email:'invalid'},'email','invalid_format'],
    [{...contact,company_type:'unapproved'},'company_type','invalid_option'],[{...contact,first_name:'x'.repeat(101)},'first_name','too_long'],
    [{...contact,email:'invalid',phone:'no'},'multiple','multiple_validation_errors'],
  ]) { const event=clientValidationError(draft,false);assert.equal(event.field_name,field);assert.equal(event.error_code,code);assert.ok(!JSON.stringify(event).includes(contact.email)); }
  assert.equal(clientValidationError({...contact,monthly_ad_spend:''},true),undefined);
  assert.equal(clientValidationError({...contact,monthly_ad_spend:''},false).error_code,'required');
  assert.equal(receptionError('validation_error',{fields:['email'],message:contact.email}).error_type,'server');
  assert.equal(receptionError('validation_error',{fields:['email','phone']}).error_code,'multiple_validation_errors');
  assert.equal(receptionError('validation_error',{fields:['submission_id',contact.email]}).field_name,'none');
  assert.equal(receptionError('unconfirmed_reception').error_code,'unconfirmed_reception');
});
test('accepted estricto, timeout no lead, replay puede confirmar por primera vez; dedupe documento',()=>{
  const host={};const runtime=createMeasurement(host,true);
  for(const [status,body] of [[202,accepted],[200,{}],[503,{state:'unconfirmed_reception'}],[201,{...accepted,lead_id:'invalid'}],[201,{...accepted,submission_id:randomUUID()}]]) assert.equal(confirmedLeadEvent(status,body,submission,contact),undefined);
  runtime.track(receptionError('unconfirmed_reception'));
  const replay=confirmedLeadEvent(200,{...accepted,replayed:true},submission,contact);
  runtime.track(replay);runtime.track(replay);runtime.track(lead);
  assert.equal(host.dataLayer.filter(e=>e.event==='generate_lead').length,1);
  runtime.track({...lead,lead_id:randomUUID()});
  assert.equal(host.dataLayer.filter(e=>e.event==='generate_lead').length,2);
});
test('fallo de push/array bloqueado/deshabilitado nunca lanza; reentrancia no duplica',()=>{
  for(const host of [{dataLayer:{}},{dataLayer:Object.freeze([])},{get dataLayer(){throw Error('blocked');}}]) {
    const runtime=createMeasurement(host,true);assert.doesNotThrow(()=>runtime.track(lead));
  }
  const disabled={};assert.equal(createMeasurement(disabled,false).track(lead),false);assert.equal(disabled.dataLayer,undefined);
  const host={dataLayer:[]};const runtime=createMeasurement(host,true);const push=host.dataLayer.push;
  host.dataLayer.push=function(value){runtime.track(lead);return push.call(this,value);};
  assert.equal(runtime.track(lead),true);assert.equal(host.dataLayer.length,1);
});
test('GA contexto privado estricto opcional mapea columnas sin cambiar adquisición/contacto; mock no prueba IDs reales',()=>{
  const input=leadRequestSchema.parse({submission_id:submission,contact,acquisition:{utm_campaign:'runtime_new'},ga:{client_id:'123.456',session_id:'789'}});
  const row=newLeadRow(input);assert.equal(row[leadColumns.indexOf('ga_client_id')],'123.456');assert.equal(row[leadColumns.indexOf('ga_session_id')],'789');assert.equal(row[leadColumns.indexOf('utm_campaign')],'runtime_new');
  for(const ga of [{client_id:contact.email},{session_id:null},{client_id:'123',email:contact.email}]) assert.deepEqual(leadRequestSchema.parse({submission_id:submission,contact,ga}).ga,{});
  assert.ok(row.slice(28,34).every(v=>v===''));
});
test('runtime compartido sobrevive consumidores/remount; producción nunca inicializa aun con flagQA',()=>{
  const previous={node:process.env.NODE_ENV,flag:process.env.NEXT_PUBLIC_WEB_MEASUREMENT_QA_ENABLED,window:globalThis.window};
  try {
    process.env.NODE_ENV='development';process.env.NEXT_PUBLIC_WEB_MEASUREMENT_QA_ENABLED='true';globalThis.window={};
    trackFormStart();trackFormStart();track(lead);track(lead);
    assert.equal(globalThis.window.dataLayer.filter(e=>e.event==='form_start').length,1);
    assert.equal(globalThis.window.dataLayer.filter(e=>e.event==='generate_lead').length,1);
    process.env.NODE_ENV='production';globalThis.window={};assert.equal(measurementQaEnabled(),false);trackFormStart();assert.equal(globalThis.window.dataLayer,undefined);
  } finally {
    if(previous.node===undefined) delete process.env.NODE_ENV;else process.env.NODE_ENV=previous.node;
    if(previous.flag===undefined) delete process.env.NEXT_PUBLIC_WEB_MEASUREMENT_QA_ENABLED;else process.env.NEXT_PUBLIC_WEB_MEASUREMENT_QA_ENABLED=previous.flag;
    if(previous.window===undefined) delete globalThis.window;else globalThis.window=previous.window;
  }
});
