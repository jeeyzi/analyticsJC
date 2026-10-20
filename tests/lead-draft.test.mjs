import test from 'node:test';
import assert from 'node:assert/strict';
import { contactDraftSchema, stepOneSchema, stepTwoSchema, limits } from '../src/lib/lead/schema.ts';
const valid = { first_name: ' Persona ', last_name: 'Sintética', email: 'qa@example.com', phone: '+56 9 1234 5678', company_name: 'Empresa sintética', company_type: 'agency', monthly_ad_spend: 'under_2000_usd', problem_to_solve: '' };
test('dos pasos: seis obligatorios al continuar, inversión obligatoria y problema opcional', () => {
  const { monthly_ad_spend, problem_to_solve, ...first } = valid;
  assert.ok(stepOneSchema.safeParse(first).success);
  assert.ok(stepTwoSchema.safeParse({ monthly_ad_spend, problem_to_solve }).success);
  for (const field of Object.keys(first)) assert.equal(stepOneSchema.safeParse({ ...first, [field]: '' }).success, false);
  assert.equal(stepTwoSchema.safeParse({ monthly_ad_spend: '' }).success, false);
  assert.ok(stepTwoSchema.safeParse({ monthly_ad_spend }).success);
  assert.equal(contactDraftSchema.parse(valid).first_name, 'Persona');
});
test('límites en el schema compartible, sin confiar en maxlength del navegador', () => {
  for (const field of ['first_name', 'last_name', 'company_name', 'problem_to_solve']) {
    assert.ok(contactDraftSchema.safeParse({ ...valid, [field]: 'a'.repeat(limits[field]) }).success);
    assert.equal(contactDraftSchema.safeParse({ ...valid, [field]: 'a'.repeat(limits[field] + 1) }).success, false);
  }
  assert.equal(contactDraftSchema.safeParse({ ...valid, email: 'a'.repeat(255) + '@example.com' }).success, false);
  assert.equal(contactDraftSchema.safeParse({ ...valid, phone: '1'.repeat(41) }).success, false);
});
test('rechaza formatos/enums y campos retirados; no rechaza por presupuesto', () => {
  for (const monthly_ad_spend of ['under_2000_usd', '2000_5000_usd', 'over_5000_usd']) assert.ok(contactDraftSchema.safeParse({ ...valid, monthly_ad_spend }).success);
  for (const company_type of ['lead_business', 'agency', 'other']) assert.ok(contactDraftSchema.safeParse({ ...valid, company_type }).success);
  for (const extra of ['name', 'website', 'organization_type', 'crm_context', 'ad_spend_context', 'problem']) assert.equal(contactDraftSchema.safeParse({ ...valid, [extra]: 'retirado' }).success, false);
  for (const phone of ['abc12345678', '123', '++56912345678', '1234567890123456']) assert.equal(contactDraftSchema.safeParse({ ...valid, phone }).success, false);
  assert.equal(contactDraftSchema.safeParse({ ...valid, email: 'inválido' }).success, false);
  assert.equal(contactDraftSchema.safeParse({ ...valid, company_type: 'inventado' }).success, false);
  assert.equal(contactDraftSchema.safeParse({ ...valid, monthly_ad_spend: 'inventado' }).success, false);
});
