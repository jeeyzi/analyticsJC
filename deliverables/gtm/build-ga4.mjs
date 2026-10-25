import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const input = 'C:/Users/jose cubillo/Downloads/GTM-K5MZ4W66_workspace3.json';
const directory = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(directory, 'GTM-K5MZ4W66_workspace3_GA4.json');
const raw = fs.readFileSync(input);
const source = JSON.parse(raw.toString('utf8').replace(/^\uFEFF/, ''));
const result = structuredClone(source);
const cv = result.containerVersion;
const identity = { accountId: cv.accountId, containerId: cv.containerId };
const template = (key, value) => ({ type: 'TEMPLATE', key, value });
const boolean = (key, value) => ({ type: 'BOOLEAN', key, value: String(value) });
const list = (key, entries) => ({ type: 'LIST', key, list: entries });
const row = (name, value) => ({ type: 'MAP', map: [template('parameter', name), template('parameterValue', value)] });
const contract = {
  click_to_action: ['page_type', 'cta_id', 'cta_location', 'target_id', 'form_id'],
  form_start: ['page_type', 'form_id'],
  form_error: ['page_type', 'form_id', 'error_type', 'field_name', 'error_code'],
  form_submit: ['page_type', 'form_id', 'attempt_type'],
  generate_lead: ['page_type', 'form_id', 'lead_type', 'lead_id', 'company_type', 'monthly_ad_spend'],
};
// This generator is intentionally specific to the supplied export, never a merger.
assert.equal(cv.container.publicId, 'GTM-K5MZ4W66');
assert.equal(cv.tag.length, 1);
assert.equal(cv.tag[0].type, 'dest_ga');
assert.equal((cv.trigger ?? []).length, 0);
assert.equal((cv.variable ?? []).length, 0);
assert.equal(cv.tag[0].parameter.find(p => p.key === 'destinationId').value, 'G-N0GCP60M3V');
const destinationId = 'G-N0GCP60M3V';
const fields = [...new Set(Object.values(contract).flat())];
cv.variable = fields.map((field, index) => ({
  ...identity, variableId: String(100 + index), name: `DLV - ${field}`, type: 'v',
  parameter: [template('name', field), { type: 'INTEGER', key: 'dataLayerVersion', value: '2' }, boolean('setDefaultValue', false)],
}));
cv.variable.push({ ...identity, variableId: '120', name: 'CONST - GA4 Measurement ID', type: 'c', parameter: [template('value', destinationId)] });
const safeLocation = 'function() { return window.location.origin + window.location.pathname; }';
const safeReferrer = 'function() { if (!document.referrer) return ""; var a = document.createElement("a"); a.href = document.referrer; return /^https?:$/.test(a.protocol) ? a.protocol + "//" + a.host : ""; }';
// null is cleared by the application; optional CTA form_id must become undefined.
const optionalFormId = 'function() { var value = {{DLV - form_id}}; return value === "diagnosis_request" ? value : undefined; }';
for (const [id, name, code] of [
  ['121', 'JS - page_location sin query ni hash', safeLocation],
  ['122', 'JS - page_referrer solo origin', safeReferrer],
  ['123', 'JS - form_id opcional', optionalFormId],
]) cv.variable.push({ ...identity, variableId: id, name, type: 'jsm', parameter: [template('javascript', code)] });

const equals = (arg0, arg1) => ({ type: 'EQUALS', parameter: [template('arg0', arg0), template('arg1', arg1)] });
cv.trigger = Object.keys(contract).map((event, index) => ({
  ...identity, triggerId: String(200 + index), name: `CE - ${event}`, type: 'CUSTOM_EVENT',
  customEventFilter: [equals('{{_event}}', event)],
  filter: [equals('{{DLV - page_type}}', 'home')],
}));
Object.entries(contract).forEach(([event, params], index) => {
  const parameters = params.map(key => row(key, key === 'form_id' ? '{{JS - form_id opcional}}' : `{{DLV - ${key}}}`));
  // Transport context is separate from the analytical event parameter contract.
  parameters.push(row('page_location', '{{JS - page_location sin query ni hash}}'), row('page_referrer', '{{JS - page_referrer solo origin}}'));
  cv.tag.push({
    ...identity, tagId: String(300 + index), name: `GA4 - Evento - ${event}`, type: 'gaawe',
    parameter: [boolean('sendEcommerceData', false), boolean('enhancedUserId', false), template('measurementIdOverride', '{{CONST - GA4 Measurement ID}}'), template('eventName', event), list('eventSettingsTable', parameters)],
    firingTriggerId: [String(200 + index)], tagFiringOption: 'ONCE_PER_EVENT',
    monitoringMetadata: { type: 'MAP' }, consentSettings: { consentStatus: 'NOT_SET' },
  });
});
const autoEvents = cv.gtagConfig.find(config => config.type === 'ogt_auto_events');
assert(autoEvents);
autoEvents.parameter.find(p => p.key === 'enableForm').value = 'false';
const contact = cv.gtagConfig.find(config => config.type === 'ogt_1p_data_v2');
assert(contact);
for (const parameter of contact.parameter) if (parameter.type === 'BOOLEAN') parameter.value = 'false';
// Fingerprints identify the exported server revision, not the modified local draft.
for (const config of [autoEvents, contact]) delete config.fingerprint;
delete cv.fingerprint;
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', 'utf8');

const artifact = JSON.parse(fs.readFileSync(output, 'utf8'));
const actual = artifact.containerVersion;
const names = new Set([...actual.variable, ...actual.builtInVariable].map(v => v.name));
const ids = new Set(actual.trigger.map(t => t.triggerId));
for (const collection of [actual.tag, actual.trigger, actual.variable]) {
  const key = collection === actual.tag ? 'tagId' : collection === actual.trigger ? 'triggerId' : 'variableId';
  assert.equal(new Set(collection.map(x => x[key])).size, collection.length);
}
const references = [...JSON.stringify(artifact).matchAll(/\{\{([^{}]+)\}\}/g)].map(match => match[1]);
for (const reference of references) assert(reference === '_event' || names.has(reference), `Unknown variable: ${reference}`);
assert.deepEqual(actual.tag[0], source.containerVersion.tag[0]);
assert.deepEqual(actual.builtInVariable, source.containerVersion.builtInVariable);
for (const tag of actual.tag.slice(1)) {
  assert(tag.firingTriggerId.every(id => ids.has(id)));
  const event = tag.parameter.find(p => p.key === 'eventName').value;
  const rows = tag.parameter.find(p => p.key === 'eventSettingsTable').list;
  for (const entry of rows) assert.deepEqual(entry.map.map(p => p.key), ['parameter', 'parameterValue']);
  const keys = rows.map(r => r.map.find(p => p.key === 'parameter').value);
  assert.deepEqual(keys, [...contract[event], 'page_location', 'page_referrer']);
  assert(!keys.some(key => /user_data|email|phone|first_name|last_name|company_name|problem_to_solve|user_id/.test(key)));
  assert.equal(tag.tagFiringOption, 'ONCE_PER_EVENT');
}
assert(!actual.variable.some(v => /user_data|email|phone|first_name|last_name/.test(v.name)));
assert.equal(autoEvents.parameter.find(p => p.key === 'enableForm').value, 'false');
assert(contact.parameter.filter(p => p.type === 'BOOLEAN').every(p => p.value === 'false'));
assert(!actual.tag.some(tag => tag.parameter?.some(p => p.key === 'eventName' && p.value === 'page_view')));

const cases = [
  { url: 'https://example.test/?email=synthetic%40example.test#gclid', ref: 'https://ref.example.test/path?phone=synthetic#fragment', location: 'https://example.test/', referrer: 'https://ref.example.test' },
  { url: 'http://localhost:3000/privacidad?gclid=synthetic#fragment', ref: '', location: 'http://localhost:3000/privacidad', referrer: '' },
  { url: 'https://example.test/', ref: 'about:blank', location: 'https://example.test/', referrer: '' },
];
for (const fixture of cases) {
  const context = { window: { location: new URL(fixture.url) }, document: {
    referrer: fixture.ref, createElement() { return { set href(value) { const url = new URL(value); this.protocol = url.protocol; this.host = url.host; } }; },
  } };
  assert.equal(vm.runInNewContext(`(${safeLocation})()`, context), fixture.location);
  assert.equal(vm.runInNewContext(`(${safeReferrer})()`, context), fixture.referrer);
}
for (const value of [null, undefined, 'diagnosis_request', 'other']) {
  const js = optionalFormId.replace('{{DLV - form_id}}', 'input');
  assert.equal(vm.runInNewContext(`(${js})()`, { input: value }), value === 'diagnosis_request' ? value : undefined);
}
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(sha256(fs.readFileSync(input)), sha256(raw), 'Source was modified');
const evidence = {
  scope: 'Validación estática local del JSON; no importación GTM, Preview, Network ni recepción GA4',
  source: input, source_sha256: sha256(raw), output: path.basename(output), output_sha256: sha256(fs.readFileSync(output)),
  measurement_id: destinationId, events: contract,
  counts: { tags: actual.tag.length, ga4_event_tags: 5, triggers: actual.trigger.length, variables: actual.variable.length },
  checks: { json_parse: 'PASS', unique_ids: 'PASS', variable_references: 'PASS', trigger_references: 'PASS', event_parameter_contract: 'PASS', no_contact_mapping: 'PASS', automatic_contact_disabled_in_export: 'PASS', automatic_forms_disabled_in_export: 'PASS', no_manual_page_view: 'PASS', existing_destination_preserved: 'PASS', event_url_sanitizers_synthetic: 'PASS', optional_form_id_null_omitted: 'PASS', source_unchanged: 'PASS' },
  not_validated: ['Importación en GTM y compatibilidad del formato optimizado', 'Preview/Tag Assistant y Network', 'Recepción GA4 DebugView', 'page_view automático inicial y SPA: saneamiento previo, pathname/hash/duplicados', 'Consentimiento y producción'],
};
fs.writeFileSync(path.join(directory, 'validation.json'), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify(evidence, null, 2));
