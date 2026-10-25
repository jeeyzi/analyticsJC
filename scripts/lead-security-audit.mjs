import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import console from 'node:console';
const walk=async directory=>{
  const result=[];
  for(const item of await fs.readdir(directory,{withFileTypes:true}).catch(()=>[])) {
    const name=path.join(directory,item.name);
    if(item.isDirectory()) result.push(...await walk(name)); else result.push(name);
  }
  return result;
};
try {
  const credential=JSON.parse(await fs.readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS,'utf8'));
  const fragments=credential.private_key.split('\n').filter(line=>line.length>40 && !line.startsWith('---'));
  const files=[...await walk('.next/static'),...await walk('.next/dev/static')];
  let leaked=false;
  for(const file of files) {
    const value=await fs.readFile(file,'utf8');
    if(fragments.some(secret=>value.includes(secret)) || value.includes('BEGIN PRIVATE KEY') || value.includes(credential.client_email) || value.includes(process.env.GOOGLE_SHEETS_SPREADSHEET_ID)) leaked=true;
  }
  const logs=await walk('.next/dev/logs');
  let pii=false;
  for(const file of logs) {
    const value=await fs.readFile(file,'utf8');
    if(['qa-attribution@example.com','qa-attribution-browser@example.com','Browser Attribution','QA Attribution','+56900000003','+56900000004','qa-lead-integration@example.com','qa-timeout@example.com','qa-browser@example.com','QA Navegador','QA_SYNTHETIC','Prueba sintética; no contactar.','+56900000000','+56 9 0000 0000','+56900000002'].some(marker=>value.includes(marker))) pii=true;
  }
  const result={clientFilesScanned:files.length,credentialOrSheetDataFound:leaked,logFilesScanned:logs.length,syntheticPIIFound:pii,scope:'Build/dev static assets and available Next dev logs; not production logs'};
  await fs.writeFile('docs/evidence/lead-sheets/security.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
  if(leaked||pii||files.length===0) process.exitCode=1;
} catch { console.error('SECURITY_AUDIT_FAILED_NO_SECRET_OUTPUT');process.exitCode=1; }
