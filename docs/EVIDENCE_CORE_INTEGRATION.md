# AETHER-0 // Evidence Core Integration & Multi-Jurisdictional Protocol

This document specifies how **AETHER-0 Borderless Emergency Handoff Router** integrates with the shared Evidence Core contracts across **PsychEdge Solutions** projects (Forensic Evidence Dossier, CogniVault, MindPal).

Shared Contract Repository: [psychedge-core](https://github.com/tiffanygreene09241993/psychedge-core)

---

## 1. Core Invariants & Security Architecture

1. **Zero Personal Content Retention (`personal_content_stored: false`)**:
   - AETHER-0 never stores personal messages, raw identity credentials, photos, or audio recordings.
   - Only cryptographic SHA-256 hashes, UTC timestamps, provenance labels, and jurisdictional metadata leave the volatile client boundary.
2. **Mandatory Human Approval Gate (`approval.status: "draft"`)**:
   - AETHER-0 **never self-approves artifacts**. All emitted Event Certificates start strictly as `"draft"`.
   - Before any downstream AI agent or legal tool may cite an artifact, a human reviewer must execute:
     ```python
     core.set_approval("CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json", "approved")
     ```
3. **Mandatory GROUNDING.md Compliance**:
   - Per `tools/evidence-core/GROUNDING.md`, downstream reasoning agents may cite **ONLY approved artifacts**.
   - Any assertion not substantiated by an approved artifact MUST be tagged explicitly as `[UNREFERENCED]`.
4. **Bidirectional Evidentiary Scope (`proves` vs. `does_not_prove`)**:
   - Every artifact explicitly defines what the cryptographic telemetry proves and what it does *not* prove, preventing over-claiming in court or adversarial hearings.

---

## 2. Artifact Contract Specification

### Filename Pattern
```
[CaseID]_[Source]_[Type]_[YYYY-MM-DD]_[vN].json
```
Example: `CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json`

### JSON Schema
```json
{
  "case_id": "CASE2026_SYNTH_0491",
  "source": "AETHER",
  "type": "EventCert",
  "date": "2026-10-13",
  "version": 1,
  "artifact_id": "CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1",
  "event_type": "EMERGENCY_HANDOFF_INITIATED",
  "utc_timestamp": "2026-10-13T01:42:00.000Z",
  "label": "Interstate emergency handoff dispatch initiated under UCCJEA § 208",
  "proves": "Cryptographic recording of emergency handoff dispatch at exact UTC timestamp under active JurisdictionProfile US_INTERSTATE_FL_NV",
  "does_not_prove": "Does not prove message content, physical location of any party, or a judicial custody determination",
  "sha256": "48de527de83034ea5b4a7a95517fdb1d4c4d9697e29289b2e0797caf2efc58fc",
  "approval": {
    "status": "draft",
    "approved_at": null,
    "audit_id": null,
    "notes": "Requires human review before downstream citation per GROUNDING.md. A human must call set_approval(filename, \"approved\") in Evidence Core."
  },
  "personal_content_stored": false,
  "jurisdiction_profile": {
    "code": "US_INTERSTATE_FL_NV",
    "name": "United States Interstate (Florida Home State / Nevada Adverse Forum)",
    "category": "DOMESTIC_INTERSTATE",
    "relevant_statutes": [
      "Fla. Stat. §§ 61.501–61.542 (UCCJEA Florida)",
      "Nev. Rev. Stat. §§ 125A.005–125A.605 (UCCJEA Nevada)",
      "18 U.S.C. § 2265 (VAWA Full Faith and Credit)",
      "28 U.S.C. § 1738A (Parental Kidnapping Prevention Act)"
    ],
    "handoff_protocol": "SECURE_UCCJEA_INTERSTATE_RELAY"
  }
}
```

---

## 3. JurisdictionProfile Pattern

AETHER-0 supports runtime-swappable profiles to dynamically adapt handoff telemetry and statutory citations to multi-jurisdictional and transnational cases.

### Standard Presets
1. **`US_INTERSTATE_FL_NV` (Domestic Interstate)**:
   - **Context**: Child custody or protective order conflict crossing state lines.
   - **Governing Law**: UCCJEA § 201 (Home State Primacy), UCCJEA § 208 (Misconduct Bar), 18 U.S.C. § 2265 (VAWA Full Faith & Credit), 28 U.S.C. § 1738A (PKPA).
   - **Handoff Protocol**: `SECURE_UCCJEA_INTERSTATE_RELAY`.

2. **`CROSS_BORDER_MX_US` (Transnational Cross-Border)**:
   - **Context**: Cross-border abandonment or international child abduction risk.
   - **Governing Law**: 1980 Hague Convention Article 13(b) (Grave Risk Defense), 22 U.S.C. §§ 9001–9011 (ICARA), U.S. State Dept. 7 FAM 1700 (Victims of Crime Abroad), Form DS-5507.
   - **Handoff Protocol**: `EMBASSY_ACS_CONSULAR_ESCORT`.

---

## 4. Downstream Intake Example (`evidence_core.py`)

Downstream tools intake AETHER-0 Event Certificates with standard Evidence Core commands:

```python
from tools.evidence_core.evidence_core import EvidenceCore

core = EvidenceCore(case_dir="/path/to/case")

# 1. Intake the draft Event Certificate emitted by AETHER-0
artifact_path = core.intake("CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json")

# 2. Human approval gate (mandatory before AI citation)
core.set_approval("CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json", "approved")

# 3. Downstream AI agents (Forensic Dossier, MindPal) can now cite the approved certificate
approved_inventory = core.get_approved_inventory()
```

---

## 5. Downstream Agent Validation Sandbox (`GROUNDING.md`)

The validation sandbox (`src/services/groundingValidator.ts`) checks agent outputs against an approved inventory, enforcing that unapproved artifacts are never cited and missing assertions are flagged.

### TypeScript Usage Example
```typescript
import { validateAgentGrounding } from './src/services/groundingValidator';

// List of approved artifact filenames from Evidence Core inventory
const approvedInventory = [
  'CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json',
  'CASE2026_INTL_MX_099_AETHER_EventCert_2026-10-13_v1.json'
];

// Synthetic draft text produced by a downstream reasoning agent
const agentOutput = `
# Forensic Timeline Assessment
At 03:14 UTC, a carrier SIM port-out was recorded [CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json].
The victim's communication was severed prior to the ex-parte hearing [CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json].
An uncorroborated third-party witness observed the adverse party in transit [UNREFERENCED].
`;

const report = validateAgentGrounding(agentOutput, approvedInventory);

if (report.passed) {
  console.log("✅ Report passed validation!");
  console.log(`Citations verified: ${report.citationsFound.length}`);
  console.log(`Unreferenced claims safely tagged: ${report.unreferencedCount}`);
} else {
  console.error("❌ Contract violation detected:");
  report.issues.forEach(issue => {
    console.error(`Line ${issue.line} [${issue.type}]: ${issue.message}`);
    console.error(`  Snippet: "${issue.snippet}"`);
  });
}
```

### Validation Report Output
```json
{
  "passed": true,
  "totalLines": 7,
  "approvedInventoryCount": 2,
  "citationsFound": [
    "CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json"
  ],
  "unapprovedCitations": [],
  "unreferencedCount": 1,
  "issues": [],
  "summary": "PASSED: All 1 citations are grounded in approved inventory. Total unreferenced tags: 1."
}
```

---

## 6. Batch Manifest Generator (`manifest.json`)

To aggregate multiple approved Event Certificates into a single inventory manifest for bulk intake.

### TypeScript Usage Example
```typescript
import { generateBatchManifest, serializeManifestJson } from './src/services/manifestGenerator';
import { EvidenceCoreEventCert } from './src/types/jurisdictionProfile';

// Assume approvedCertificates is a list of EvidenceCoreEventCert objects
// where every item has cert.approval.status === 'approved'
try {
  const manifest = generateBatchManifest("CASE2026_SYNTH_0491", approvedCertificates);
  const jsonOutput = serializeManifestJson(manifest);
  console.log("Manifest ready:", jsonOutput);
} catch (err) {
  // Throws if ANY artifact has status !== 'approved'
  console.error("Refused to generate manifest:", err.message);
}
```

### Python Helper Usage Example (`tools/evidence_core_manifest.py`)
```python
from tools.evidence_core_manifest import generate_batch_manifest, write_manifest_file

# Load or retrieve approved artifacts
synthetic_approved_artifacts = [
    {
        "case_id": "CASE2026_SYNTH_0491",
        "date": "2026-10-13",
        "version": 1,
        "artifact_id": "CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1",
        "sha256": "48de527de83034ea5b4a7a95517fdb1d4c4d9697e29289b2e0797caf2efc58fc",
        "approval": {
            "status": "approved",
            "approved_at": "2026-10-13T02:00:00Z",
            "audit_id": "AUDIT-001"
        }
    }
]

try:
    manifest = generate_batch_manifest("CASE2026_SYNTH_0491", synthetic_approved_artifacts)
    write_manifest_file(manifest, "manifest.json")
    print(f"Manifest written successfully with {manifest['total_artifacts']} artifacts.")
except ValueError as err:
    print(f"Manifest generation refused: {err}")
```

### Output `manifest.json` Structure
```json
{
  "case_id": "CASE2026_SYNTH_0491",
  "generated_at": "2026-10-13T09:31:40.033307+00:00",
  "generator": "AETHER-0",
  "total_artifacts": 1,
  "artifacts": [
    {
      "filename": "CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json",
      "sha256": "48de527de83034ea5b4a7a95517fdb1d4c4d9697e29289b2e0797caf2efc58fc"
    }
  ]
}
```

---

## 7. Verification & CI Workflow

All contract suites run in GitHub Actions on push and pull request to `main`:

```bash
npm test
python3 tools/evidence_core_manifest.py
```

Test Suites:
1. **`src/tests/evidenceCoreAdapter.test.ts`**: Verifies filename regex matching, immutable `draft` status, string-typed `proves`/`does_not_prove`, and canonical SHA-256 calculation.
2. **`src/tests/groundingValidator.test.ts`**: Verifies that citations of unapproved artifacts are blocked and that unreferenced claims require the exact `[UNREFERENCED]` tag.
3. **`src/tests/manifestGenerator.test.ts`**: Verifies that manifest generation succeeds with approved certificates and refuses unapproved/draft certificates.
