/**
 * Unit Tests for Downstream Agent Validation Sandbox (GROUNDING.md)
 */

import { validateAgentGrounding } from '../services/groundingValidator.ts';

async function runTests() {
  console.log('🧪 Starting Grounding Validator Contract Tests...\n');
  let failures = 0;

  function assert(condition: boolean, msg: string) {
    if (!condition) {
      console.error(`❌ FAILED: ${msg}`);
      failures++;
    } else {
      console.log(`✅ PASSED: ${msg}`);
    }
  }

  const approvedInventory = [
    'CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json',
    'CASE2026_INTL_MX_099_AETHER_EventCert_2026-10-13_v1.json',
  ];

  // Test 1: Fully Grounded Agent Output (Pass)
  console.log('--- Test 1: Fully Grounded Agent Output ---');
  const validOutput = `
# Executive Timeline Report
At 03:14 UTC, a carrier SIM port-out was recorded [CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json].
The victim was disconnected from mobile services during the ex-parte hearing window [CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json].
An uncorroborated third-party witness reported seeing the vehicle in transit [UNREFERENCED].
All primary findings are fully grounded.
`;
  const report1 = validateAgentGrounding(validOutput, approvedInventory);
  assert(report1.passed === true, 'Valid output passes validation');
  assert(report1.issues.length === 0, 'Zero issues flagged for valid output');
  assert(report1.unreferencedCount === 1, 'Recognized 1 [UNREFERENCED] tag');
  assert(report1.citationsFound.length === 1, 'Extracted 1 unique approved citation');

  // Test 2: Unapproved Artifact Citation (Fail)
  console.log('\n--- Test 2: Unapproved Artifact Citation ---');
  const unapprovedCitationOutput = `
# Forensic Analysis
At 04:00 UTC, a device replacement was logged [CASE2026_UNAPPROVED_DRAFT_AETHER_EventCert_2026-10-13_v1.json].
The carrier confirmed line disconnection.
`;
  const report2 = validateAgentGrounding(unapprovedCitationOutput, approvedInventory);
  assert(report2.passed === false, 'Fails when citing an unapproved artifact');
  assert(report2.unapprovedCitations.includes('CASE2026_UNAPPROVED_DRAFT_AETHER_EventCert_2026-10-13_v1.json'), 'Identified unapproved citation name');
  const unapprovedIssue = report2.issues.find((i) => i.type === 'UNAPPROVED_CITATION');
  assert(unapprovedIssue !== undefined && unapprovedIssue.line === 3, 'Correctly flags line 3 for unapproved citation');

  // Test 3: Uncited Factual Claim Without [UNREFERENCED] (Fail)
  console.log('\n--- Test 3: Uncited Factual Assertion ---');
  const uncitedClaimOutput = `
# Timeline Summary
The adverse party filed an emergency motion to seize the children at approx 10:00 AM without notice.
All claims must be referenced.
`;
  const report3 = validateAgentGrounding(uncitedClaimOutput, approvedInventory);
  assert(report3.passed === false, 'Fails when factual claim lacks citation and lacks [UNREFERENCED]');
  const uncitedIssue = report3.issues.find((i) => i.type === 'UNCITED_ASSERTION');
  assert(uncitedIssue !== undefined && uncitedIssue.line === 3, 'Correctly flags line 3 for uncited assertion');

  // Test 4: Same Claim Corrected With [UNREFERENCED] (Pass)
  console.log('\n--- Test 4: Same Claim With [UNREFERENCED] Marker ---');
  const correctedClaimOutput = `
# Timeline Summary
The adverse party filed an emergency motion to seize the children at approx 10:00 AM without notice [UNREFERENCED].
All claims are marked.
`;
  const report4 = validateAgentGrounding(correctedClaimOutput, approvedInventory);
  assert(report4.passed === true, 'Passes when unreferenced claim is explicitly marked with [UNREFERENCED]');

  console.log('\n======================================');
  if (failures === 0) {
    console.log('🎉 ALL GROUNDING VALIDATOR TESTS PASSED!');
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
