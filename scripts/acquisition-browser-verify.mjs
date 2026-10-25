import assert from 'node:assert/strict';
import console from 'node:console';
import process from 'node:process';
import { readFile, writeFile } from 'node:fs/promises';
import { readLeadRows, leadColumns } from '../src/lib/server/lead-store.ts';
try {
  const evidence=JSON.parse(await readFile('docs/evidence/acquisition/browser.json','utf8'));
  const rows=(await readLeadRows()).filter(row=>row[0]===evidence.submission_id);
  assert.equal(rows.length,1);
  for(const key of leadColumns.slice(14)) assert.equal(rows[0][leadColumns.indexOf(key)]??'',evidence.acquisition[key]??'');
  const result={status:'PASS',submission_id:evidence.submission_id,lead_id:rows[0][1],rows:1,browserToSheetMapping:'PASS'};
  await writeFile('docs/evidence/acquisition/browser-sheet.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
} catch {console.error('BROWSER_SHEET_CHECK_FAILED');process.exitCode=1;}
