# Profile-Driven Guided Flow Sketches (Design Only)

This document outlines the architectural sketches for two optional guided flows in AETHER-0. Both flows adhere to the zero-retention invariant: they emit **only Evidence Core Event Certificates** or reference already-approved artifacts, and **never create personal-content stores**.

---

## 1. Florida E-Portal Filing Packet Template

* **Activation Condition**: Available when a profile covering Florida is active (e.g., `US_INTERSTATE_FL_NV`).
* **Purpose**: Generates a standard 28-line numbered Florida Circuit Court motion header and attaches a **Notice of Confidential Information within Court Filing (Fla. R. Gen. Prac. & Jud. Admin. 2.420)** placeholder.

### Workflow Sketch
1. **Statutory Extraction**:
   - Pulls governing citations from `activeProfile.relevant_statutes`:
     * Fla. Stat. § 61.514 (UCCJEA § 201 Home-State Primacy)
     * Fla. Stat. § 61.521 (UCCJEA § 208 Misconduct Bar)
     * 18 U.S.C. § 2265 (VAWA Full Faith and Credit)
2. **Rule 2.420 Confidential Notice Placeholder**:
   - Generates the standard Florida court notice checking box 11 (victim domestic violence safe-harbor address) or box 1 (Chapter 39 juvenile dependency records).
3. **Exhibit A Attachment**:
   - References an approved Event Certificate (e.g., `[CaseID]_AETHER_EventCert_2026-10-13_v1.json`) as Exhibit A, providing self-authenticating cryptographic proof of carrier lockout or notice suppression.
4. **Output Constraint**:
   - Emits an `EMERGENCY_MOTION_STAGED` Event Certificate in draft status. Zero personal names or message logs are written to disk.

---

## 2. DS-5507 Consular Jurat & Grave Risk Helper

* **Activation Condition**: Offered **ONLY** when the `CROSS_BORDER_MX_US` (or other transnational profile) is active.
* **Purpose**: Guides protective parents stranded abroad in executing an official sworn declaration before an American Consular Officer under U.S. State Department **7 FAM 1700** and 22 U.S.C. § 4221.

### Workflow Sketch
1. **Statutory & Treaty Foundation**:
   - Cites 1980 Hague Convention Article 13(b) (Grave Risk Defense).
   - Cites 22 U.S.C. § 9003 (ICARA) and 7 FAM 1700 (Consular Emergency Assistance).
2. **Form DS-5507 Presence Schedule**:
   - Guides the parent in recording physical presence dates and the exact date/time travel documents were confiscated by the adverse party.
3. **Consular Affidavit Formatting**:
   - Formats a verified jurat ready for consular attestation at a U.S. Embassy or Consulate.
4. **Evidence Core Output**:
   - Emits an `AETHER_EventCert` with event type `CONSULAR_JURAT_STAGED`, recording the timestamp and active consular post.
   - `proves`: `"Cryptographic record of consular jurat execution under 7 FAM 1700 and Hague Art. 13(b)"`.
   - `does_not_prove`: `"Does not prove foreign custody decrees issued by foreign state tribunals"`.
