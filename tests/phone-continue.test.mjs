import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultPhoneCountry, phoneCountries, phonePrefix, maxNationalPhoneLength, normalizeNationalPhoneInput, nationalPhoneValue, phoneWithCountry, possibleInternationalPhone } from '../src/lib/lead/phone.ts';
import { contactDraftSchema } from '../src/lib/lead/schema.ts';
import { continueFormEvent, measurementEventSchema, ga4Parameters } from '../src/lib/measurement/events.ts';
import { createMeasurement } from '../src/lib/measurement/runtime.ts';

test('selector global Chile por defecto y longitudes nacionales según país',()=>{
  assert.equal(defaultPhoneCountry,'CL');assert.ok(phoneCountries.includes('CL'));assert.ok(phoneCountries.length>200);
  for(const [country,prefix,length] of [['CL','+56',9],['US','+1',10],['ES','+34',9],['BR','+55',11]]) {
    assert.equal(phonePrefix(country),prefix);assert.equal(maxNationalPhoneLength(country),length);
  }
});
test('entrada/paste solo dígitos; acepta prefijo correcto sin duplicarlo, no trunca ni cambia país',()=>{
  assert.equal(normalizeNationalPhoneInput('+56 9 0000 0000','CL'),'900000000');
  assert.equal(normalizeNationalPhoneInput('9000000000','CL'),undefined);
  assert.equal(normalizeNationalPhoneInput('+1 2025550123','CL'),undefined);
  assert.equal(normalizeNationalPhoneInput('texto900000000','CL'),undefined);
  assert.equal(normalizeNationalPhoneInput('','CL'),'');
  assert.equal(normalizeNationalPhoneInput('1234567890','US'),'1234567890');
  // Cambiar desde país de11dígitos a9 no borra: se permite corregir borrando.
  assert.equal(normalizeNationalPhoneInput('1234567890','CL','12345678901'),'1234567890');
  assert.equal(nationalPhoneValue('+56900000000','CL'),'900000000');
  assert.equal(phoneWithCountry('900000000','CL'),'+56900000000');
  assert.equal(phoneWithCountry('','CL'),'');
});
test('schema compartido rechaza longitud/prefijo incorrectos y solo comprueba posibilidad, no existencia',()=>{
  const contact={first_name:'QA',last_name:'Test',email:'qa@example.com',phone:'+56900000000',company_name:'QA',company_type:'other',monthly_ad_spend:'under_2000_usd'};
  for(const phone of ['+56900000000','+1 2025550123','+34 612345678']) assert.equal(contactDraftSchema.safeParse({...contact,phone}).success,true);
  for(const phone of ['+56','+5690000000','+569000000000','+1 20255501234']) assert.equal(contactDraftSchema.safeParse({...contact,phone}).success,false);
  // Payload previo sin prefijo conserva compatibilidad para retry; la UI nueva
  // nunca lo genera y no se inventa +56 al procesarlo.
  assert.equal(contactDraftSchema.parse({...contact,phone:'900000000'}).phone,'900000000');
  assert.equal(possibleInternationalPhone('+56900000000'),true);
});
test('CTA Continuar es contrato controlado separado de navegación; mapper sin PII y sin conversión',()=>{
  assert.equal(measurementEventSchema.safeParse(continueFormEvent).success,true);
  for(const overrides of [{cta_id:'request_diagnosis'},{target_id:'diagnostico'},{cta_location:'hero'},{form_id:undefined}]) assert.equal(measurementEventSchema.safeParse({...continueFormEvent,...overrides}).success,false);
  const host={};createMeasurement(host,true).track(continueFormEvent);
  assert.equal(host.dataLayer.length,1);assert.equal(host.dataLayer[0].event,'click_to_action');
  assert.deepEqual(ga4Parameters(host.dataLayer[0]),{page_type:'home',form_id:'diagnosis_request',cta_id:'continue_diagnosis',cta_location:'form_step_1',target_id:'diagnosis_step_2'});
});
