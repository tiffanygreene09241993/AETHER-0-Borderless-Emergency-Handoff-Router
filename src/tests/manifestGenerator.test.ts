/**
 * Unit Tests for Batch Manifest Generator
 */

import { generateBatchManifest } from '../services/manifestGenerator.ts';
import { EvidenceCoreEventCert } from '../types/jurisdictionProfile.ts';

async function runTests() {
  console.log('🧪 Starting Batch Manifest Generator Contract Tests...\n');
  let failures = 0;

  function assert(condition: boolean, msg: string) {
    if (!condition) {
      console.error(`❌ FAILED: ${msg}`);
      failures++;
    } else {
      console.log(`✅ PASSED: ${msg}`);
    }
  }

  const approvedCert1: EvidenceCoreEventCert = {
    case_id: 'CASE2026_SYNTH_0491',
    source: 'AETHER',
    type: 'EventCert',
    date: '2026-10-13',
    version: 1,
    artifact_id: 'CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1',
    event_type: 'SIM_PORT_OUT',
    utc_timestamp: '2026-10-13T01:00:00.000Z',
    label: 'Carrier SIM port-out',
    proves: 'Tamper timestamp',
    does_not_prove: 'Message body',
    sha256: '48de527de83034ea5b4a7a95517fdb1d4c4d9697e29289b2e0797caf2efc58fc',
    approval: { status: 'approved', approved_at: '2026-10-13T02:00:00.000Z', audit_id: 'REV-01' },
    personal_content_stored: false,
    jurisdiction_profile: {
      code: 'US_INTERSTATE_FL_NV',
      name: 'United States Interstate',
      category: 'DOMESTIC_INTERSTATE',
      relevant_statutes: ['Fla. Stat. § 61.501'],
      handoff_protocol: 'SECURE_UCCJEA_INTERSTATE_RELAY',
    },
  };

  const approvedCert2: EvidenceCoreEventCert = {
    case_id: 'CASE2026_SYNTH_0491',
    source: 'AETHER',
    type: 'EventCert',
    date: '2026-10-13',
    version: 2,
    artifact_id: 'CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v2',
    event_type: 'EMERGENCY_HANDOFF_INITIATED',
    utc_timestamp: '2026-10-13T02:00:00.000Z',
    label: 'Handoff dispatch',
    proves: 'Handoff timestamp',
    does_not_prove: 'Location of party',
    sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    approval: { status: 'approved', approved_at: '2026-10-13T02:15:00.000Z', audit_id: 'REV-02' },
    personal_content_stored: false,
    jurisdiction_profile: {
      code: 'US_INTERSTATE_FL_NV',
      name: 'United States Interstate',
      category: 'DOMESTIC_INTERSTATE',
      relevant_statutes: ['Fla. Stat. § 61.501'],
      handoff_protocol: 'SECURE_UCCJEA_INTERSTATE_RELAY',
    },
  };

  const draftCert: EvidenceCoreEventCert = {
    ...approvedCert1,
    artifact_id: 'CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v3',
    approval: { status: 'draft', approved_at: null, audit_id: null },
  };

  // Test 1: Generate Manifest with Approved Artifacts
  console.log('--- Test 1: Successful Manifest Generation ---');
  const manifest = generateBatchManifest('CASE2026_SYNTH_0491', [approvedCert1, approvedCert2]);
  assert(manifest.generator === 'AETHER-0', 'Manifest generator tag is AETHER-0');
  assert(manifest.total_artifacts === 2, 'Total artifacts count is 2');
  assert(manifest.artifacts.length === 2, 'Artifacts list length matches');
  assert(manifest.artifacts[0].filename === 'CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json', 'Filename matches contract');
  assert(manifest.artifacts[0].sha256 === approvedCert1.sha256, 'SHA-256 matches artifact digest');
  assert(
    !('proves' in manifest.artifacts[0]) && !('personal_content' in manifest.artifacts[0]),
    'Manifest contains ONLY filename and sha256 pairs'
  );

  // Test 2: Refuse Unapproved / Draft Artifacts
  console.log('\n--- Test 2: Rejection of Draft Artifacts ---');
  let draftErrorCaught = false;
  try {
    generateBatchManifest('CASE2026_SYNTH_0491', [approvedCert1, draftCert]);
  } catch (err: any) {
    draftErrorCaught = true;
    assert(err.message.includes('Refusing to generate manifest'), 'Throws explicit refusal message');
    assert(err.message.includes('draft'), 'Identifies draft status in error');
  }
  assert(draftErrorCaught === true, 'Successfully blocked manifest generation with draft artifact');

  console.log('\n======================================');
  if (failures === 0) {
    console.log('🎉 ALL BATCH MANIFEST GENERATOR TESTS PASSED!');
    return true;
  } else {
    console.error(`❌ ${failures} TEST(S) FAILED.`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
