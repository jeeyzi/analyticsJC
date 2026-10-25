import process from "node:process";
const { Request, Response } = globalThis;
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { qaEnvironmentAllowed, leadOriginAllowed } from '../src/lib/environment.ts';
import { resolveGoogleCredentials, sheetsRequest } from '../src/lib/server/sheets.ts';
import { gtmQaContainerId, gtmHeadSnippet } from '../src/lib/measurement/gtm.ts';
import { runInNewContext } from 'node:vm';
const qa={nodeEnv:'production',siteEnv:'qa',vercelEnv:'preview',qaEnabled:'true'};
test('matriz de entornos: QA requiere aprobación y Preview; producción falla cerrada',()=>{
 assert.equal(qaEnvironmentAllowed(qa),true);
 assert.equal(qaEnvironmentAllowed({nodeEnv:'development'}),true);
 for(const c of [{...qa,qaEnabled:'false'},{...qa,vercelEnv:undefined},{...qa,vercelEnv:'production'},{...qa,siteEnv:'production'},{nodeEnv:'production',siteEnv:'local'},{nodeEnv:'development',vercelEnv:'preview'}]) assert.equal(qaEnvironmentAllowed(c),false);
 assert.equal(gtmQaContainerId({...qa,measurementQaEnabled:'true',gtmQaEnabled:'true',containerId:'GTM-QA123'}),'GTM-QA123');
 const scripts=[];const window={location:{hostname:'qa.example.test'},dataLayer:[]};
 const document={getElementById:id=>scripts.find(s=>s.id===id),createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}};
 runInNewContext(gtmHeadSnippet('GTM-QA123',true),{window,document});runInNewContext(gtmHeadSnippet('GTM-QA123',true),{window,document});
 assert.equal(scripts.length,1);assert.equal(window.dataLayer.length,1);
});
test('origen QA HTTPS exacto, credenciales JSON y OAuth/Sheets mock sin filesystem',async()=>{
 const saved={...process.env};const originalFetch=globalThis.fetch;
 try {
 Object.assign(process.env,{NODE_ENV:'production',NEXT_PUBLIC_SITE_ENV:'qa',VERCEL_ENV:'preview',QA_DEPLOYMENT_ENABLED:'true',VERCEL_URL:'qa.example.test',VERCEL_BRANCH_URL:'branch.example.test',GOOGLE_APPLICATION_CREDENTIALS:'Z:/missing/credentials.json',GOOGLE_SHEETS_SPREADSHEET_ID:'synthetic-sheet'});
 const request=(origin,host='qa.example.test')=>new Request('https://qa.example.test/api/leads',{headers:{origin,host}});
 assert.equal(leadOriginAllowed(request('https://qa.example.test')),true);
 for(const origin of ['http://qa.example.test','https://evil.test','null','https://qa.example.test/path'])assert.equal(leadOriginAllowed(request(origin)),false);
 assert.equal(leadOriginAllowed(request('https://qa.example.test','evil.test')),false);
 delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
 await assert.rejects(resolveGoogleCredentials(),/SHEETS_UNAVAILABLE/);
 process.env.GOOGLE_SERVICE_ACCOUNT_JSON='malformed';await assert.rejects(resolveGoogleCredentials(),/SHEETS_UNAVAILABLE/);
 const {privateKey}=generateKeyPairSync('rsa',{modulusLength:2048,privateKeyEncoding:{type:'pkcs8',format:'pem'},publicKeyEncoding:{type:'spki',format:'pem'}});
 process.env.GOOGLE_SERVICE_ACCOUNT_JSON=JSON.stringify({type:'service_account',client_email:'qa@example.invalid',private_key:privateKey});
 assert.equal((await resolveGoogleCredentials()).client_email,'qa@example.invalid');
 const urls=[];globalThis.fetch=async(url,options)=>{urls.push(url);if(url.includes('oauth2')){assert.ok(options.body.get('assertion'));return Response.json({access_token:'synthetic-token'});}assert.equal(options.headers.Authorization,'Bearer synthetic-token');return Response.json({values:[['synthetic']]});};
 assert.deepEqual(await sheetsRequest('/values/leads'),{values:[['synthetic']]});assert.equal(urls.length,2);
 process.env.VERCEL_ENV='production';assert.equal(leadOriginAllowed(request('https://qa.example.test')),false);await assert.rejects(sheetsRequest('/values/leads'),/SHEETS_UNAVAILABLE/);await assert.rejects(resolveGoogleCredentials(),/SHEETS_UNAVAILABLE/);
 } finally { globalThis.fetch=originalFetch;for(const k of Object.keys(process.env))if(!(k in saved))delete process.env[k];Object.assign(process.env,saved); }
});
