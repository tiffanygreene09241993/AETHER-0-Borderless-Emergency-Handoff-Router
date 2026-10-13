# AETHER-0 // Encrypted Cold-Vault Export Design

This document details the architectural design for the **AETHER-0 Encrypted Cold-Vault Export**, extending the PsychEdge `ENCRYPTED_STORE.md` specification.

---

## 1. Objective & Security Invariants

The Cold-Vault Export provides high-risk survivors with a safe transit mechanism across physical borders and hostile checkpoints:

1. **Approved Artifacts Only**: The vault contains **only approved Evidence Core Event Certificates** and the signed `manifest.json`.
2. **Zero Personal Content**: No message text, phone numbers, contact names, raw photos, or audio recordings ever enter the vault bundle.
3. **Local Encryption**: Encrypted client-side using `age` (X25519 recipient public keys) or local AES-256-GCM before touching disk.
4. **Duress Protocol**: Under duress (such as coercion at a border or airport), entering the secondary Duress PIN triggers `zeroizeColdVaultKeys()`, permanently shredding active passphrase buffers and private key material from volatile memory.

---

## 2. Vault Bundle Specification

```
[CaseID]_AETHER_ColdVault_[YYYY-MM-DD].age
```

### Unencrypted Payload Structure
```json
{
  "_format": "AETHER-0-COLD-VAULT-v1",
  "case_id": "CASE2026_SYNTH_0491",
  "exported_at": "2026-10-13T02:00:00.000Z",
  "manifest": {
    "case_id": "CASE2026_SYNTH_0491",
    "generated_at": "2026-10-13T02:00:00.000Z",
    "generator": "AETHER-0",
    "total_artifacts": 2,
    "artifacts": [
      {
        "filename": "CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1.json",
        "sha256": "48de527de83034ea5b4a7a95517fdb1d4c4d9697e29289b2e0797caf2efc58fc"
      }
    ]
  },
  "certificates": [
    { /* Full EvidenceCoreEventCert with status == 'approved' */ }
  ]
}
```

---

## 3. Duress & Key Zeroization Protocol

When entering the Duress PIN (`9999`) or clicking Panic Shred:
```typescript
import { zeroizeColdVaultKeys } from './services/coldVaultExport';

// 1. Instantly overwrite and delete all ephemeral key buffers
zeroizeColdVaultKeys();

// 2. Wipe volatile event ledger
zeroizeAllMemoryNow();

// 3. Switch screen to harmless civilian weather/productivity decoy
renderDecoyView();
```
An examiner acquiring the physical hardware cannot decrypt the exported `.age` file because no key material or decrypted buffers persist on the device.

---

## 4. Implementation Status

- **Current State**: Stub signature and bundle builder implemented in `src/services/coldVaultExport.ts`.
- **Future Work**: Integration of `age-wasm` for native X25519 identity encryption in the browser sandbox.
