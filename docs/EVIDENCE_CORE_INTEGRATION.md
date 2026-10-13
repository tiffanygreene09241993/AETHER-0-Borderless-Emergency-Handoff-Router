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
   - **Governing Law**: 1980 Hague Convention Article 13(b) (Grave Risk of Harm), 22 U.S.C. §§ 9001–9011 (ICARA), U.S. State Dept. 7 FAM 1700 (Victims of Crime Abroad), Form DS-5507.
   - **Handoff Protocol**: `EMBASSY_ACS_CONSULAR_ESCORT`.

---

## 4. Downstream Intake Example (`evidence_core.py`)

The Python Evidence Core expects a store path and an artifact metadata dict.  
AETHER emits a JSON file whose contents become that dict.

```python
from pathlib import Path
import json
from tools.evidence_core.evidence_core import EvidenceCore

core = EvidenceCore(Path("./case_store"))

# 1. Load the Event Certificate JSON emitted by AETHER-0
with open("CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json") as f:
    meta = json.load(f)

# Ensure the filename field is present for intake
meta["filename"] = "CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json"

# 2. Intake (starts as draft; content bytes optional)
art = core.intake(meta)
print(art["approval"]["status"])  # draft

# 3. Human approval gate (mandatory before AI citation)
core.set_approval(meta["filename"], "approved")

# 4. Downstream agents may now cite it
inventory = core.get_approved_inventory("CASE2026_SYNTH_0491")
```

---

## 5. Verification & Testing

Run the adapter test suite locally:

```bash
npm test
```
Asserts strict compliance with filename regex, draft status, string-typed `proves`/`does_not_prove`, and canonical SHA-256 calculation.
