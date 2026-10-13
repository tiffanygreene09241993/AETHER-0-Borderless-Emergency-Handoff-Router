# AETHER-0 BORDERLESS EMERGENCY HANDOFF ROUTER
## Multi-Jurisdictional Architecture & Shared Evidence Core Integration Plan (Approved)

A finalized architectural blueprint updating **AETHER-0** to support runtime-swappable **JurisdictionProfiles** and emit standardized **Evidence Core Event Certificates** compatible with the shared contract standards used across PsychEdge Solutions projects (Forensic Evidence Dossier, CogniVault, MindPal).

---

## User Review & Approved Adjustments

> [!IMPORTANT]
> The implementation plan incorporates all approved adjustments:
> 1. **Filename Pattern**: Exactly `[CaseID]_AETHER_EventCert_[YYYY-MM-DD]_v[N].json` (e.g. `CASE2026_AETHER_EventCert_2026-10-13_v1.json`).
> 2. **Proves / Does Not Prove Type**: Strongly typed **strings** (not arrays) to match current Evidence Core schemas.
> 3. **Canonical SHA-256**: Computed over canonical JSON of non-personal fields (`case_id`, `event_type`, `utc_timestamp`, `label`, `jurisdiction_profile.code`).
> 4. **Approval Block**: Strict structure: `{"status": "draft", "approved_at": null, "audit_id": null}`. Requires human `set_approval(filename, "approved")` before downstream citation per `GROUNDING.md`.
> 5. **Jurisdiction Metadata**: Clean, non-sensitive object embedding only `code`, `name`, `category`, `relevant_statutes`, and `handoff_protocol`.

---

## 1. Overview & Core Concept

AETHER-0 acts as a local-first, zero-retention emergency router. This implementation enables:
1. **Runtime Swappable `JurisdictionProfile`**: Switching between Domestic Interstate (UCCJEA §§ 201/208, VAWA 18 U.S.C. § 2265, PKPA) and Cross-Border Transnational (1980 Hague Art. 13(b), 7 FAM 1700) modes.
2. **Evidence Core Event Certificate Generation**: Emitting strictly drafted, non-personal, tamper-evident JSON and Markdown artifacts.
3. **Local-First Zero-Retention Integrity**: Retaining zero personal content or message data (`personal_content_stored: false`).

---

## 2. Technical Contract Specification

### Event Certificate Schema
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
  "proves": "Cryptographic recording of emergency handoff dispatch at exact UTC timestamp under active JurisdictionProfile",
  "does_not_prove": "Does not prove message content, physical location of any party, or a judicial determination",
  "sha256": "3b25f82a1b947c92b23a9689e47ff3a34a179576c99c85264b387efceeb10e12",
  "approval": {
    "status": "draft",
    "approved_at": null,
    "audit_id": null
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

## 3. Implementation Order & Deliverables

1. **`src/types/jurisdictionProfile.ts`**:
   - `JurisdictionProfile`, `JurisdictionCategory`, `ArtifactApproval`, `EvidenceCoreEventCert`.
   - Seed profiles: `US_INTERSTATE_FL_NV` and `CROSS_BORDER_MX_US`.
2. **`src/services/evidenceCoreAdapter.ts`**:
   - `createEvidenceCoreEventCert()` (computes canonical SHA-256 over non-personal keys, sets `status: "draft"`).
   - `formatEvidenceCoreFilename()`.
   - `serializeToMarkdown()`.
3. **`src/tests/evidenceCoreAdapter.test.ts`**:
   - Unit tests verifying filename pattern, draft status, string types for `proves`/`does_not_prove`, and 64-char hex SHA-256.
4. **UI Integration (`src/components/armor/TamperLedger.tsx` & Handoff Views)**:
   - Profile switcher dropdown + "Export Evidence Core Event Certificate" button.
5. **Documentation**:
   - `docs/EVIDENCE_CORE_INTEGRATION.md` & `README.md` with one-line Evidence Core intake example.
