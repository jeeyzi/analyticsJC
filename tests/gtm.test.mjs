import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { gtmQaContainerId, gtmHeadSnippet, installGtmHead } from '../src/lib/measurement/gtm.ts';

const config={nodeEnv:'development',siteEnv:'local',measurementQaEnabled:'true',gtmQaEnabled:'true',containerId:'GTM-K5MZ4W66'};
test('GTM requiere ID válido y gates QA/local; producción siempre excluida',()=>{
  assert.equal(gtmQaContainerId(config),config.containerId);
  for(const overrides of [{nodeEnv:'production'},{siteEnv:'production'},{gtmQaEnabled:'false'},{measurementQaEnabled:'false'},{containerId:''},{containerId:"GTM-X');alert(1);//"}]) assert.equal(gtmQaContainerId({...config,...overrides}),undefined);
  assert.equal(gtmHeadSnippet('<script>'),'');
});
test('snippet head conserva array, async y un solo gtm.start/script tras ejecución repetida',()=>{
  const scripts=[];const events=[{event:'form_start'}];
  const window={location:{hostname:'127.0.0.1'},dataLayer:events};
  const bodyScripts=[];
  const document={getElementById:id=>scripts.find(s=>s.id===id),createElement:()=>({}),head:{appendChild:s=>{s.parentNode=document.head;scripts.push(s);}},getElementsByTagName:()=>[{parentNode:{insertBefore:s=>bodyScripts.push(s)}}]};
  const script=gtmHeadSnippet(config.containerId);
  runInNewContext(script,{window,document});runInNewContext(script,{window,document});
  assert.equal(window.dataLayer,events);assert.equal(events.length,2);assert.equal(events[1].event,'gtm.js');assert.equal(typeof events[1]['gtm.start'],'number');
  assert.equal(scripts.length,1);assert.equal(scripts[0].async,true);assert.equal(scripts[0].src,'https://www.googletagmanager.com/gtm.js?id=GTM-K5MZ4W66');
  assert.equal(scripts[0].parentNode,document.head);assert.equal(bodyScripts.length,0);
});
test('host externo/datalayer inválido/DOM bloqueado no cargan GTM ni lanzan a UI',()=>{
  for(const window of [{location:{hostname:'example.com'}},{location:{hostname:'localhost'},dataLayer:{}},{location:{hostname:'localhost'},dataLayer:[]}]) {
    assert.doesNotThrow(()=>runInNewContext(gtmHeadSnippet(config.containerId),{window,document:{getElementById:()=>{throw Error('blocked');}}}));
  }
});
test('instalación tras hidratación/Strict Mode/remount inserta bootstrap y contenedor una vez en HEAD',()=>{
  const scripts=[];const window={location:{hostname:'localhost'},dataLayer:[]};
  const document={getElementById:id=>scripts.find(s=>s.id===id),createElement:()=>({}),head:{appendChild:s=>{
    s.parentNode=document.head;scripts.push(s);
    if(s.text)runInNewContext(s.text,{window,document});
  }}};
  assert.equal(installGtmHead(document,'localhost',config.containerId),true);
  assert.equal(installGtmHead(document,'localhost',config.containerId),false);
  assert.equal(scripts.length,2);assert.ok(scripts.every(s=>s.parentNode===document.head));
  assert.equal(window.dataLayer.filter(x=>x.event==='gtm.js').length,1);
  assert.equal(installGtmHead(document,'example.com',config.containerId),false);
});
