#!/usr/bin/env python3
"""
Evidence Core Manifest Generator (Python Helper)
Matches AETHER-0 TypeScript Batch Manifest Generator contracts.

Rules:
1. Rejects any artifact where approval.status != 'approved'.
2. Writes a single manifest.json containing only filename + sha256 pairs.
3. Zero personal content is included.
"""

from datetime import datetime, timezone
import json
import sys
from typing import Any, Dict, List


def generate_batch_manifest(case_id: str, approved_artifacts: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generates an Evidence Core manifest.json from approved Event Certificates.
    
    Raises ValueError if any artifact is unapproved or lacks a valid sha256.
    """
    if not approved_artifacts:
        raise ValueError("Cannot generate manifest: at least one approved artifact is required.")

    manifest_items = []

    for art in approved_artifacts:
        artifact_id = art.get("artifact_id") or "UNKNOWN_ARTIFACT"
        approval = art.get("approval", {})
        status = approval.get("status")

        if status != "approved":
            raise ValueError(
                f"Refusing to generate manifest: Artifact '{artifact_id}' has status '{status}'. "
                "Per GROUNDING.md, only approved artifacts may be included in the manifest."
            )

        sha256 = art.get("sha256")
        if not sha256 or len(sha256) != 64:
            raise ValueError(
                f"Invalid artifact '{artifact_id}': sha256 must be a valid 64-character hex digest."
            )

        filename = f"{art.get('case_id')}_AETHER_EventCert_{art.get('date')}_v{art.get('version', 1)}.json"

        manifest_items.append({
            "filename": filename,
            "sha256": sha256
        })

    manifest = {
        "case_id": case_id,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "generator": "AETHER-0",
        "total_artifacts": len(manifest_items),
        "artifacts": manifest_items
    }

    return manifest


def write_manifest_file(manifest: Dict[str, Any], output_path: str = "manifest.json") -> str:
    """Writes the manifest dictionary to a formatted JSON file."""
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    return output_path


if __name__ == "__main__":
    # Self-test using synthetic approved artifacts
    synthetic_approved = [
        {
            "case_id": "CASE2026_SYNTH_0491",
            "date": "2026-10-13",
            "version": 1,
            "artifact_id": "CASE2026_SYNTH_0491_AETHER_EventCert_2026-10-13_v1",
            "sha256": "48de527de83034ea5b4a7a95517fdb1d4c4d9697e29289b2e0797caf2efc58fc",
            "approval": {"status": "approved", "approved_at": "2026-10-13T02:00:00Z", "audit_id": "AUDIT-001"}
        }
    ]
    manifest = generate_batch_manifest("CASE2026_SYNTH_0491", synthetic_approved)
    print("Python manifest generated successfully:")
    print(json.dumps(manifest, indent=2))
