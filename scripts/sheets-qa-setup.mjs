import { sheetsRequest } from '../src/lib/server/sheets.ts';
import { leadColumns } from '../src/lib/server/lead-store.ts';
import process from 'node:process';
import console from 'node:console';

try {
  const title = process.env.GOOGLE_SHEETS_LEADS_TAB;
  const meta = await sheetsRequest('?fields=sheets(properties(sheetId,title,gridProperties))');
  const sheet = meta.sheets.find(s => s.properties.title === title)?.properties;
  if (!sheet) throw new Error('LEADS_TAB_MISSING');
  const data = await sheetsRequest('/values/' + encodeURIComponent("'" + title.replaceAll("'", "''") + "'"));
  if (data.values?.length) {
    if (JSON.stringify(data.values[0]) !== JSON.stringify(leadColumns)) throw new Error('EXISTING_SCHEMA_MISMATCH');
    console.log('SCHEMA_ALREADY_READY');
  } else {
    await sheetsRequest(':batchUpdate', { requests: [
      { updateSheetProperties: { properties: { sheetId: sheet.sheetId, gridProperties: { columnCount: Math.max(sheet.gridProperties.columnCount, leadColumns.length) } }, fields: 'gridProperties.columnCount' } },
      { updateCells: { start: { sheetId: sheet.sheetId, rowIndex: 0, columnIndex: 0 }, rows: [{ values: leadColumns.map(value => ({ userEnteredValue: { stringValue: value } })) }], fields: 'userEnteredValue' } },
    ] });
    console.log('LEADS_SCHEMA_CREATED');
  }
} catch { console.error('QA_SETUP_FAILED_NO_DETAILS_LOGGED'); process.exitCode = 1; }
