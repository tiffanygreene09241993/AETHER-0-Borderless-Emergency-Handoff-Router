# AETHER-0 // Borderless Emergency Handoff Router

A mission-critical, zero-retention emergency telemetry and handoff router engineered for protective parents, domestic violence survivors, and individuals facing cross-border abandonment or jurisdictional warfare.

---

## Key Features

- **Zero-Retention Volatile Architecture**: Runs completely in client-side volatile memory with zero server-side database storage. Subpoenas for stored personal data yield mathematical certainty: **zero data exists**.
- **Duress PIN & Decoy Civilian Mode**: Entering a secondary Duress PIN seamlessly switches the interface to a harmless, non-sensitive civilian weather/productivity dashboard while quietly zeroizing active crisis tokens.
- **Panic Shred Engine**: One-click, multi-pass memory wipe permanently scrubbing all temporary buffers, cryptographic handles, and active session keys.
- **Runtime-Swappable `JurisdictionProfile` Pattern**: Dynamically adapts legal routing parameters, statutory frameworks (UCCJEA, VAWA, Hague Convention, 7 FAM 1700), and handoff protocols to interstate and international situations.
- **PsychEdge Evidence Core Contract Compatibility**: Emits tamper-evident Event Certificates (`[CaseID]_AETHER_EventCert_[YYYY-MM-DD]_v[N].json`) formatted for direct intake into downstream forensic tools.
- **Downstream Agent Validation Sandbox**: Local testing harness validating that reasoning agents cite only approved artifacts and mark ungrounded assertions strictly as `[UNREFERENCED]` per `GROUNDING.md`.
- **Batch Manifest Generator**: Aggregates approved Event Certificates into an Evidence Core `manifest.json`, strictly refusing any unapproved or draft artifacts.
- **Cold-Vault Transit Export (Design + Stub)**: Cryptographic export path to an encrypted container (`age` X25519) with automated duress key zeroization.

---

## Multi-Jurisdictional Routing with `JurisdictionProfile`

AETHER-0 supports runtime profile selection to ensure that emergency handoffs and cryptographic event certificates reflect the exact governing statutory framework:

| Profile Code | Scope | Primary Governing Authorities | Handoff Protocol |
| :--- | :--- | :--- | :--- |
| **`US_INTERSTATE_FL_NV`** | Domestic Interstate | Fla. Stat. §§ 61.501–61.542 · Nev. Rev. Stat. §§ 125A.005–125A.605 · 18 U.S.C. § 2265 (VAWA) · 28 U.S.C. § 1738A (PKPA) | `SECURE_UCCJEA_INTERSTATE_RELAY` |
| **`CROSS_BORDER_MX_US`** | Transnational Cross-Border | 1980 Hague Convention Art. 13(b) · 22 U.S.C. §§ 9001–9011 (ICARA) · U.S. State Dept. 7 FAM 1700 · Form DS-5507 | `EMBASSY_ACS_CONSULAR_ESCORT` |

### How to Select a Profile
In the UI header or via code:
```typescript
import { JURISDICTION_PROFILES } from './types/jurisdictionProfile';

const activeProfile = JURISDICTION_PROFILES['CROSS_BORDER_MX_US'];
```

---

## Evidence Core Integration (`psychedge-core`)

AETHER-0 adheres to the shared Evidence Core contracts defined in [psychedge-core](https://github.com/tiffanygreene09241993/psychedge-core).

### Contract Rules
1. **Filename Standard**: `[CaseID]_AETHER_EventCert_[YYYY-MM-DD]_v[N].json`
2. **Approval Gate**: All emitted artifacts start strictly with `"status": "draft"`. AETHER-0 never self-approves evidence.
3. **GROUNDING.md Rule**: Downstream agents (Forensic Evidence Dossier, CogniVault, MindPal) may cite **ONLY approved artifacts**. Any missing or unapproved fact must be marked explicitly as `[UNREFERENCED]`.
4. **Zero Personal Content**: `personal_content_stored` is `false`. Only non-personal cryptographic hashes (SHA-256), timestamps, labels, and objective jurisdictional metadata are stored.
5. **Dual Scope Strings**: `proves` and `does_not_prove` are required string fields defining the precise evidentiary boundary.

### Downstream Intake Example
```python
from tools.evidence_core.evidence_core import EvidenceCore

core = EvidenceCore(case_dir="./cases/2026-0491")

# Intake artifact from AETHER-0
core.intake("CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json")

# Mandatory Human Review Gate before AI citation
core.set_approval("CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json", "approved")
```

---

## Validation Sandbox & Batch Manifest

### Validating Downstream Agent Outputs
```typescript
import { validateAgentGrounding } from './src/services/groundingValidator';

const report = validateAgentGrounding(agentDraftText, approvedInventoryFilenames);
if (!report.passed) {
  console.error("Grounding contract violations:", report.issues);
}
```

### Generating Batch Manifest (`manifest.json`)
```typescript
import { generateBatchManifest } from './src/services/manifestGenerator';

// Throws error if any artifact is in 'draft' or 'rejected' status
const manifest = generateBatchManifest("CASE2026_SYNTH_0491", approvedArtifacts);
```

Matching Python helper available in `tools/evidence_core_manifest.py`.

---

## Running Tests

Verify all Evidence Core contracts, Grounding Validators, and Batch Manifest rules:
```bash
npm test
```
Test suites executed:
- `evidenceCoreAdapter.test.ts`: Filename formatting, draft approval status, string scopes, canonical SHA-256.
- `groundingValidator.test.ts`: Rejection of unapproved artifacts and enforcement of `[UNREFERENCED]`.
- `manifestGenerator.test.ts`: Manifest structure and refusal of draft artifacts.
