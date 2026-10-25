import assert from 'node:assert/strict';
import console from 'node:console';
import { readFile, writeFile } from 'node:fs/promises';
import { readLeadRows, leadColumns } from '../src/lib/server/lead-store.ts';

const browser=JSON.parse(await readFile('docs/evidence/identity/browser.json','utf8'));
const rows=await readLeadRows();
const results=[];
for(const fixture of browser.cases) {
  const matches=rows.filter(row=>row[0]===fixture.submission_id);
  assert.equal(matches.length,1);
  const row=matches[0];assert.equal(row[1],fixture.lead_id);
  assert.equal(row[leadColumns.indexOf('ga_client_id')]??'',fixture.ga.client_id??'');
  assert.equal(row[leadColumns.indexOf('ga_session_id')]??'',fixture.ga.session_id??'');
  assert.equal(fixture.accepted,true);assert.equal(fixture.webIdsLeaked,false);assert.equal(fixture.identicalRetry,true);
  results.push({mode:fixture.mode,submission_id:fixture.submission_id,lead_id:fixture.lead_id,rows:1,clientMatches:true,sessionMatches:true,idsEmpty:!fixture.ga.client_id});
}
const result={environment:'real Google Sheets QA; synthetic contacts/identities; read-only verification',columnsUnchanged:leadColumns.length===36,cases:results};
assert.equal(result.columnsUnchanged,true);
await writeFile('docs/evidence/identity/sheets.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
