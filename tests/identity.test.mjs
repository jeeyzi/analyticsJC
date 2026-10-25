import test from 'node:test';
import assert from 'node:assert/strict';
import { createIdentityObserver, identityFromEvent } from '../src/lib/measurement/identity.ts';
import { createMeasurement } from '../src/lib/measurement/runtime.ts';
import { ga4Parameters } from '../src/lib/measurement/events.ts';

const event=(...values)=>({event:'analytics_identity_ready',ga_client_id:values.length?values[0]:'123.456',ga_session_id:values.length?values[1]:'789'});
test('historia previa: último par válido, no último evento inválido ni mezcla de campos',()=>{
  const host={dataLayer:[event(),event('234.567',890),event('{{Client ID}}','999'),event('333.444',undefined)]};
  const observer=createIdentityObserver(host);observer.initialize();
  assert.deepEqual(observer.snapshot(),{client_id:'234.567',session_id:'890'});
  assert.equal(host.dataLayer.length,4);
});
test('validación de ambos IDs: null/undefined/vacío/templates/infinito y formato incorrecto rechazados',()=>{
  for(const invalid of [undefined,null,'','{{id}}',' id ','private@example.test',-1,Infinity,{},[],true]) {
    assert.equal(identityFromEvent(event(invalid,'123')),undefined);
    assert.equal(identityFromEvent(event('123.456',invalid)),undefined);
  }
  for(const invalid of ['0','-1','12.3','a', '1'.repeat(129)])assert.equal(identityFromEvent(event('123.456',invalid)),undefined);
  assert.equal(identityFromEvent({...event(),event:'form_start'}),undefined);
  assert.deepEqual(identityFromEvent(event()),{client_id:'123.456',session_id:'789'});
});
test('actualizaciones futuras, batch push, this/retorno/argumentos originales y montaje repetido',()=>{
  const layer=[];let calls=0;const native=layer.push;
  layer.push=function(...items){assert.equal(this,layer);calls++;return native.apply(this,items);};
  const observer=createIdentityObserver({dataLayer:layer});observer.initialize();const wrapper=layer.push;observer.initialize();assert.equal(layer.push,wrapper);
  assert.equal(layer.push({event:'gtm.js'},event()),2);assert.equal(calls,1);
  const frozen=observer.snapshot();frozen.client_id='mutated';
  layer.push(event('999.888','777'));assert.deepEqual(observer.snapshot(),{client_id:'999.888',session_id:'777'});
  layer.push(event('999.888','{{session}}'));assert.equal(observer.snapshot().session_id,'777');
});
test('GTM wrappers antes/después: sin perder push y snapshot congelado/retry inmutable',()=>{
  const host={dataLayer:[]};const runtime=createMeasurement(host,true);runtime.initialize();
  const prior=host.dataLayer.push;host.dataLayer.push=function(...items){return prior.apply(this,items);};
  host.dataLayer.push(event());
  const frozen=JSON.stringify({ga:runtime.gaIdentifiers()});
  host.dataLayer.push(event('999.888','999'));runtime.initialize();
  assert.equal(frozen,JSON.stringify({ga:{client_id:'123.456',session_id:'789'}}));
  assert.deepEqual(runtime.gaIdentifiers(),{client_id:'999.888',session_id:'999'});
  host.dataLayer=[event('111.222','333')];assert.equal(runtime.gaIdentifiers().client_id,'111.222');
});
test('ausencia/bloqueo/disabled no bloquean ni crean gtag/cookies/timers; lectura síncrona',()=>{
  for(const host of [{},{dataLayer:{}},{dataLayer:Object.freeze([event()])},{get dataLayer(){throw Error('blocked');}}]) {
    const runtime=createMeasurement(host,true);assert.doesNotThrow(()=>runtime.gaIdentifiers());assert.equal('gtag' in host,false);
  }
  assert.deepEqual(createMeasurement({dataLayer:[event()]},false).gaIdentifiers(),{});
  assert.deepEqual(createMeasurement({},true).gaIdentifiers(),{});
});
test('evento identidad no es web event; IDs no admitidos como custom parameters GA4',()=>{
  const host={dataLayer:[]};const runtime=createMeasurement(host,true);runtime.initialize();host.dataLayer.push(event());
  assert.equal(runtime.track(event()),false);assert.deepEqual(ga4Parameters(event()),{});
  for(const name of ['page_view','click_to_action','form_start','form_error','form_submit','generate_lead']) {
    assert.deepEqual(ga4Parameters({event:name,page_type:'home',ga_client_id:'123.456',ga_session_id:'789'}),{});
  }
  runtime.track({event:'form_start',page_type:'home',form_id:'diagnosis_request'});
  assert.equal('ga_client_id' in host.dataLayer.at(-1),false);assert.equal('ga_session_id' in host.dataLayer.at(-1),false);
});
