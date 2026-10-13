/**
 * Batch Manifest Generator for Evidence Core
 * 
 * Aggregates approved Event Certificates into a single Evidence Core manifest.json.
 * 
 * Strict Invariants:
 * 1. REFUSES to include any artifact whose approval status is not 'approved'.
 * 2. Emits ONLY filename and sha256 pairs. Zero personal content.
 * 3. Case ID and ISO 8601 generation timestamp are embedded.
 */

import { EvidenceCoreEventCert } from '../types/jurisdictionProfile.ts';
import { formatEvidenceCoreFilename } from './evidenceCoreAdapter.ts';

export interface ManifestItem {
  filename: string;
  sha256: string;
}

export interface EvidenceCoreManifest {
  case_id: string;
  generated_at: string;
  generator: 'AETHER-0';
  total_artifacts: number;
  artifacts: ManifestItem[];
}

/**
 * Generates an Evidence Core manifest from a collection of approved Event Certificates.
 * Throws an explicit error if ANY certificate is in 'draft' or 'rejected' state.
 */
export function generateBatchManifest(
  caseId: string,
  artifacts: EvidenceCoreEventCert[]
): EvidenceCoreManifest {
  if (!artifacts || artifacts.length === 0) {
    throw new Error('Cannot generate manifest: at least one approved artifact is required.');
  }

  const manifestItems: ManifestItem[] = [];

  for (const cert of artifacts) {
    if (cert.approval.status !== 'approved') {
      throw new Error(
        `Refusing to generate manifest: Artifact "${cert.artifact_id}" has status "${cert.approval.status}". Per GROUNDING.md, only approved artifacts may be included in the Evidence Core manifest.`
      );
    }

    if (!cert.sha256 || cert.sha256.length !== 64) {
      throw new Error(
        `Invalid artifact "${cert.artifact_id}": sha256 must be a valid 64-character hex digest.`
      );
    }

    const filename = formatEvidenceCoreFilename(
      cert.case_id,
      cert.utc_timestamp,
      cert.version,
      'json'
    );

    manifestItems.push({
      filename,
      sha256: cert.sha256,
    });
  }

  return {
    case_id: caseId.trim() || artifacts[0].case_id,
    generated_at: new Date().toISOString(),
    generator: 'AETHER-0',
    total_artifacts: manifestItems.length,
    artifacts: manifestItems,
  };
}

/**
 * Serializes manifest into clean, indented JSON for manifest.json
 */
export function serializeManifestJson(manifest: EvidenceCoreManifest): string {
  return JSON.stringify(manifest, null, 2);
}
