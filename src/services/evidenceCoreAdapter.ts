/**
 * Evidence Core Adapter for AETHER-0
 * 
 * Bridges AETHER-0 zero-retention events to PsychEdge Evidence Core contracts:
 * https://github.com/tiffanygreene09241993/psychedge-core
 * 
 * Invariants:
 * 1. Filename format: [CaseID]_AETHER_EventCert_[YYYY-MM-DD]_v[N].json
 * 2. Status is ALWAYS 'draft' (AETHER never self-approves)
 * 3. personal_content_stored is ALWAYS false
 * 4. proves and does_not_prove are strings
 * 5. sha256 is 64-character hex string computed over canonical non-personal fields
 */

import {
  EvidenceCoreEventCert,
  JurisdictionProfile,
  MinimalJurisdictionMetadata,
} from '../types/jurisdictionProfile.ts';

export interface CreateEventCertOptions {
  caseId: string;
  eventType: string;
  label: string;
  profile: JurisdictionProfile;
  timestamp?: string | number | Date;
  version?: number;
  proves?: string;
  does_not_prove?: string;
}

/**
 * Normalizes case ID into valid, safe filename characters
 */
export function sanitizeCaseId(caseId: string): string {
  const cleaned = caseId.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  return cleaned || 'CASE_UNKNOWN';
}

/**
 * Formats standard Evidence Core artifact filename:
 * [CaseID]_[Source]_[Type]_[YYYY-MM-DD]_[vN].[ext]
 */
export function formatEvidenceCoreFilename(
  caseId: string,
  dateIso: string,
  version: number = 1,
  extension: 'json' | 'md' = 'json'
): string {
  const safeId = sanitizeCaseId(caseId);
  const dateStr = dateIso.substring(0, 10);
  return `${safeId}_AETHER_EventCert_${dateStr}_v${version}.${extension}`;
}

/**
 * Generates canonical JSON string with recursively sorted keys
 */
export function canonicalStringify(obj: unknown): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map((item) => canonicalStringify(item)).join(',') + ']';
  }
  const record = obj as Record<string, unknown>;
  const sortedKeys = Object.keys(record).sort();
  const entries = sortedKeys.map(
    (k) => `${JSON.stringify(k)}:${canonicalStringify(record[k])}`
  );
  return '{' + entries.join(',') + '}';
}

/**
 * Computes SHA-256 hash across Browser and Node.js environments
 */
export async function computeSha256Hex(content: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(content);

  // Check Web Crypto API (Browser & modern Node.js)
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    const hashBuf = await globalThis.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Node.js fallback via dynamic require/import
  try {
    const nodeCrypto = await import('node:crypto');
    return nodeCrypto.createHash('sha256').update(content).digest('hex');
  } catch {
    throw new Error('Cryptographic environment unavailable: SHA-256 requires WebCrypto or node:crypto.');
  }
}

/**
 * Builds the canonical non-personal payload for hashing
 */
export function buildCanonicalHashPayload(
  caseId: string,
  eventType: string,
  utcTimestamp: string,
  label: string,
  jurisdictionCode: string,
  proves: string,
  doesNotProve: string
): Record<string, unknown> {
  return {
    case_id: sanitizeCaseId(caseId),
    does_not_prove: doesNotProve,
    event_type: eventType,
    jurisdiction_code: jurisdictionCode,
    label,
    personal_content_stored: false,
    proves,
    source: 'AETHER',
    type: 'EventCert',
    utc_timestamp: utcTimestamp,
  };
}

/**
 * Extracts non-sensitive metadata from profile
 */
export function extractMinimalJurisdictionMetadata(
  profile: JurisdictionProfile
): MinimalJurisdictionMetadata {
  return {
    code: profile.code,
    name: profile.name,
    category: profile.category,
    relevant_statutes: [...profile.relevant_statutes],
    handoff_protocol: profile.handoff_protocol,
  };
}

/**
 * Creates a fully compliant Evidence Core Event Certificate
 */
export async function createEvidenceCoreEventCert(
  options: CreateEventCertOptions
): Promise<EvidenceCoreEventCert> {
  const version = options.version ?? 1;
  const safeCaseId = sanitizeCaseId(options.caseId);

  // Normalize timestamp
  let dateObj: Date;
  if (!options.timestamp) {
    dateObj = new Date();
  } else if (options.timestamp instanceof Date) {
    dateObj = options.timestamp;
  } else if (typeof options.timestamp === 'number') {
    dateObj = new Date(options.timestamp);
  } else {
    dateObj = new Date(options.timestamp);
  }
  if (isNaN(dateObj.getTime())) {
    dateObj = new Date();
  }

  const utcTimestamp = dateObj.toISOString();
  const dateStr = utcTimestamp.substring(0, 10);
  const artifactId = `${safeCaseId}_AETHER_EventCert_${dateStr}_v${version}`;

  // Default proves / does_not_prove strings if not provided
  const proves =
    options.proves ||
    `Cryptographic recording of ${options.label} at exact UTC timestamp under active JurisdictionProfile ${options.profile.code}`;

  const doesNotProve =
    options.does_not_prove ||
    'Does not prove message content, physical location of any party, or a judicial custody determination';

  // Compute canonical non-personal hash
  const canonicalPayload = buildCanonicalHashPayload(
    safeCaseId,
    options.eventType,
    utcTimestamp,
    options.label,
    options.profile.code,
    proves,
    doesNotProve
  );
  const canonicalJson = canonicalStringify(canonicalPayload);
  const sha256 = await computeSha256Hex(canonicalJson);

  const cert: EvidenceCoreEventCert = {
    case_id: safeCaseId,
    source: 'AETHER',
    type: 'EventCert',
    date: dateStr,
    version,
    artifact_id: artifactId,
    event_type: options.eventType,
    utc_timestamp: utcTimestamp,
    label: options.label,
    proves,
    does_not_prove: doesNotProve,
    sha256,
    approval: {
      status: 'draft',
      approved_at: null,
      audit_id: null,
      notes:
        'Requires human review before downstream citation per GROUNDING.md. A human must call set_approval(filename, "approved") in Evidence Core.',
    },
    personal_content_stored: false,
    jurisdiction_profile: extractMinimalJurisdictionMetadata(options.profile),
  };

  return cert;
}

/**
 * Serializes Event Certificate into Markdown with YAML front-matter
 */
export function serializeToMarkdown(cert: EvidenceCoreEventCert): string {
  const statutesList = cert.jurisdiction_profile.relevant_statutes
    .map((s) => `    - "${s.replace(/"/g, '\\"')}"`)
    .join('\n');

  return `---
case_id: "${cert.case_id}"
source: "${cert.source}"
type: "${cert.type}"
date: "${cert.date}"
version: ${cert.version}
artifact_id: "${cert.artifact_id}"
event_type: "${cert.event_type}"
utc_timestamp: "${cert.utc_timestamp}"
label: "${cert.label.replace(/"/g, '\\"')}"
proves: "${cert.proves.replace(/"/g, '\\"')}"
does_not_prove: "${cert.does_not_prove.replace(/"/g, '\\"')}"
sha256: "${cert.sha256}"
approval:
  status: "${cert.approval.status}"
  approved_at: ${cert.approval.approved_at ? `"${cert.approval.approved_at}"` : 'null'}
  audit_id: ${cert.approval.audit_id ? `"${cert.approval.audit_id}"` : 'null'}
personal_content_stored: ${cert.personal_content_stored}
jurisdiction_profile:
  code: "${cert.jurisdiction_profile.code}"
  name: "${cert.jurisdiction_profile.name.replace(/"/g, '\\"')}"
  category: "${cert.jurisdiction_profile.category}"
  handoff_protocol: "${cert.jurisdiction_profile.handoff_protocol}"
  relevant_statutes:
${statutesList}
---

# AETHER-0 Event Certificate: ${cert.label}

- **Artifact ID**: \`${cert.artifact_id}\`
- **Event Type**: \`${cert.event_type}\`
- **UTC Timestamp**: \`${cert.utc_timestamp}\`
- **Approval State**: \`${cert.approval.status}\` *(Human approval required before citation under GROUNDING.md)*
- **Personal Content Stored**: \`${cert.personal_content_stored}\`
- **SHA-256 Digest**: \`${cert.sha256}\`

## Evidentiary Scope
- **Proves**: ${cert.proves}
- **Does Not Prove**: ${cert.does_not_prove}

## Active Jurisdiction Profile
- **Code**: ${cert.jurisdiction_profile.code}
- **Name**: ${cert.jurisdiction_profile.name}
- **Handoff Protocol**: \`${cert.jurisdiction_profile.handoff_protocol}\`
- **Governing Statutes**:
${cert.jurisdiction_profile.relevant_statutes.map((s) => `  * ${s}`).join('\n')}

> **Notice to Downstream Agents & Reviewers**:
> This artifact is emitted in \`draft\` status by the AETHER-0 local router.
> Per \`GROUNDING.md\`, downstream agents (Forensic Evidence Dossier, CogniVault, MindPal) may cite ONLY approved artifacts.
> Missing or unapproved facts must be marked as \`[UNREFERENCED]\`.
`;
}

/**
 * Triggers browser download of generated artifact
 */
export function downloadArtifactFile(
  content: string,
  filename: string,
  mimeType: string = 'application/json'
): void {
  if (typeof document === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
