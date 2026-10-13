/**
 * Unit Tests for EvidenceCoreAdapter
 * 
 * Verifies compliance with PsychEdge Evidence Core contracts:
 * 1. Filename pattern matches [CaseID]_AETHER_EventCert_[YYYY-MM-DD]_v[N].json
 * 2. Status is strictly 'draft'
 * 3. personal_content_stored is false
 * 4. proves and does_not_prove are non-empty strings
 * 5. sha256 is 64-character hex string
 * 6. Dual JSON + Markdown export integrity
 */

import {
  createEvidenceCoreEventCert,
  formatEvidenceCoreFilename,
  serializeToMarkdown,
  canonicalStringify,
} from '../services/evidenceCoreAdapter.ts';
import {
  US_INTERSTATE_FL_NV,
  CROSS_BORDER_MX_US,
} from '../types/jurisdictionProfile.ts';

async function runTests() {
  console.log('🧪 Starting EvidenceCoreAdapter Contract Tests...\n');
  let failures = 0;

  function assert(condition: boolean, msg: string) {
    if (!condition) {
      console.error(`❌ FAILED: ${msg}`);
      failures++;
    } else {
      console.log(`✅ PASSED: ${msg}`);
    }
  }

  // Test 1: Filename Pattern
  console.log('--- Test 1: Filename Formatting ---');
  const filenameJson = formatEvidenceCoreFilename('CASE2026_SYNTH_0491', '2026-10-13T01:42:00.000Z', 1, 'json');
  assert(
    filenameJson === 'CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json',
    `Filename matches pattern: expected "CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json", got "${filenameJson}"`
  );

  const filenameMd = formatEvidenceCoreFilename('CASE-FL-NV-002', '2026-10-13T05:00:00.000Z', 2, 'md');
  assert(
    filenameMd === 'CASE-FL-NV-002_AETHER_EventCert_2026-10-13_v2.md',
    `Filename with hyphens and v2 matches: got "${filenameMd}"`
  );

  // Test 2: Domestic Interstate Profile Event Creation
  console.log('\n--- Test 2: Domestic Interstate Event Certificate ---');
  const domesticCert = await createEvidenceCoreEventCert({
    caseId: 'CASE2026_SYNTH_0491',
    eventType: 'EMERGENCY_HANDOFF_INITIATED',
    label: 'Interstate emergency handoff dispatch initiated under UCCJEA § 208',
    profile: US_INTERSTATE_FL_NV,
    timestamp: '2026-10-13T01:42:00.000Z',
    version: 1,
  });

  assert(domesticCert.approval.status === 'draft', 'Approval status is strictly "draft"');
  assert(domesticCert.approval.approved_at === null, 'Approval approved_at is null');
  assert(domesticCert.approval.audit_id === null, 'Approval audit_id is null');
  assert(domesticCert.personal_content_stored === false, 'personal_content_stored is false');
  assert(typeof domesticCert.proves === 'string' && domesticCert.proves.length > 0, 'proves is non-empty string');
  assert(typeof domesticCert.does_not_prove === 'string' && domesticCert.does_not_prove.length > 0, 'does_not_prove is non-empty string');
  assert(typeof domesticCert.sha256 === 'string' && domesticCert.sha256.length === 64, `sha256 is 64-char hex string: got ${domesticCert.sha256.length} chars (${domesticCert.sha256})`);
  assert(/^[0-9a-f]{64}$/.test(domesticCert.sha256), 'sha256 is valid lowercase hex format');
  assert(domesticCert.jurisdiction_profile.code === 'US_INTERSTATE_FL_NV', 'jurisdiction profile is US_INTERSTATE_FL_NV');
  assert(domesticCert.jurisdiction_profile.category === 'DOMESTIC_INTERSTATE', 'jurisdiction category matches');

  // Test 3: Transnational Cross-Border Profile Event Creation
  console.log('\n--- Test 3: Cross-Border Transnational Event Certificate ---');
  const crossBorderCert = await createEvidenceCoreEventCert({
    caseId: 'CASE2026_INTL_MX_099',
    eventType: 'TRANSNATIONAL_STRANDING_DETECTED',
    label: 'U.S. Embassy American Citizen Services consular escort dispatch under 7 FAM 1700',
    profile: CROSS_BORDER_MX_US,
    timestamp: '2026-10-13T02:00:00.000Z',
    proves: 'Cryptographic attestation of consular emergency request and 7 FAM 1700 protocol activation',
    does_not_prove: 'Does not prove foreign legal custody status in Mexican civil courts',
  });

  assert(crossBorderCert.approval.status === 'draft', 'Cross-border approval status is draft');
  assert(crossBorderCert.jurisdiction_profile.code === 'CROSS_BORDER_MX_US', 'Cross-border profile code is CROSS_BORDER_MX_US');
  assert(crossBorderCert.jurisdiction_profile.category === 'TRANSNATIONAL_CROSS_BORDER', 'Cross-border category is TRANSNATIONAL_CROSS_BORDER');
  assert(crossBorderCert.proves === 'Cryptographic attestation of consular emergency request and 7 FAM 1700 protocol activation', 'Custom proves string preserved');
  assert(crossBorderCert.does_not_prove === 'Does not prove foreign legal custody status in Mexican civil courts', 'Custom does_not_prove string preserved');

  // Test 4: Markdown with YAML Front-Matter Serialization
  console.log('\n--- Test 4: Markdown Serialization ---');
  const markdown = serializeToMarkdown(domesticCert);
  assert(markdown.startsWith('---'), 'Markdown starts with YAML front-matter delimiter');
  assert(markdown.includes('status: "draft"'), 'YAML front-matter contains status: "draft"');
  assert(markdown.includes('personal_content_stored: false'), 'YAML front-matter contains personal_content_stored: false');
  assert(markdown.includes('sha256: "' + domesticCert.sha256 + '"'), 'YAML front-matter contains sha256 hash');
  assert(markdown.includes('GROUNDING.md'), 'Markdown documentation references GROUNDING.md constraint');

  // Test 5: Canonical Stringify Determinism
  console.log('\n--- Test 5: Canonical Stringify Determinism ---');
  const obj1 = { z: 1, a: 2, m: { b: 3, a: 4 } };
  const obj2 = { a: 2, z: 1, m: { a: 4, b: 3 } };
  const s1 = canonicalStringify(obj1);
  const s2 = canonicalStringify(obj2);
  assert(s1 === s2, `Canonical stringify is key-order independent: ${s1}`);

  console.log('\n======================================');
  if (failures === 0) {
    console.log('🎉 ALL EVIDENCE CORE ADAPTER TESTS PASSED!');
    return true;
  } else {
    console.error(`❌ ${failures} TEST(S) FAILED.`);
    process.exit(1);
  }
}

// Execute test suite when run directly via tsx
runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
