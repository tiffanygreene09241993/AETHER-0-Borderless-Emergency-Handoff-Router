/**
 * JurisdictionProfile and Evidence Core Event Certificate Contracts
 * 
 * Strict contracts conforming to PsychEdge Evidence Core standard:
 * https://github.com/tiffanygreene09241993/psychedge-core
 * 
 * Contract Invariants:
 * 1. Filename pattern: [CaseID]_AETHER_EventCert_[YYYY-MM-DD]_v[N].json
 * 2. Artifact approval starts strictly as 'draft'
 * 3. personal_content_stored is ALWAYS false
 * 4. proves and does_not_prove are strings
 * 5. sha256 is computed over canonical non-personal fields
 */

export type JurisdictionCategory =
  | 'DOMESTIC_INTERSTATE'
  | 'TRANSNATIONAL_CROSS_BORDER'
  | 'TRIBAL_SOVEREIGN'
  | 'CUSTOM';

export interface JurisdictionProfile {
  code: string;
  name: string;
  category: JurisdictionCategory;
  relevant_statutes: string[];
  handoff_protocol: string;
  metadata_requirements?: string[];
  summary?: string;
}

export type ApprovalStatus = 'draft' | 'approved' | 'rejected';

export interface ArtifactApproval {
  status: ApprovalStatus;
  approved_at: string | null;
  audit_id: string | null;
  notes?: string;
}

export interface MinimalJurisdictionMetadata {
  code: string;
  name: string;
  category: JurisdictionCategory;
  relevant_statutes: string[];
  handoff_protocol: string;
}

export interface EvidenceCoreEventCert {
  case_id: string;
  source: 'AETHER';
  type: 'EventCert';
  date: string; // YYYY-MM-DD
  version: number;
  artifact_id: string;
  event_type: string;
  utc_timestamp: string; // ISO 8601
  label: string;
  proves: string;
  does_not_prove: string;
  sha256: string;
  approval: ArtifactApproval;
  personal_content_stored: false;
  jurisdiction_profile: MinimalJurisdictionMetadata;
}

/**
 * Standard Presets conforming to real-world UCCJEA, VAWA, and Transnational Consular law.
 */
export const US_INTERSTATE_FL_NV: JurisdictionProfile = {
  code: 'US_INTERSTATE_FL_NV',
  name: 'United States Interstate (Florida Home State / Nevada Adverse Forum)',
  category: 'DOMESTIC_INTERSTATE',
  relevant_statutes: [
    'Fla. Stat. §§ 61.501–61.542 (UCCJEA Florida)',
    'Nev. Rev. Stat. §§ 125A.005–125A.605 (UCCJEA Nevada)',
    '18 U.S.C. § 2265 (VAWA Full Faith and Credit)',
    '28 U.S.C. § 1738A (Parental Kidnapping Prevention Act)',
  ],
  handoff_protocol: 'SECURE_UCCJEA_INTERSTATE_RELAY',
  metadata_requirements: ['home_state', 'adverse_state', 'lockout_duration_hours'],
  summary: 'Interstate child custody and protective order handoff. Invokes UCCJEA § 201 home-state primacy and § 208 mandatory decline for petitioner misconduct.',
};

export const CROSS_BORDER_MX_US: JurisdictionProfile = {
  code: 'CROSS_BORDER_MX_US',
  name: 'Transnational Cross-Border (Mexico Stranding / United States Repatriation)',
  category: 'TRANSNATIONAL_CROSS_BORDER',
  relevant_statutes: [
    '1980 Hague Convention Article 13(b) (Grave Risk Defense)',
    '22 U.S.C. §§ 9001–9011 (ICARA)',
    'U.S. Dept. of State 7 FAM 1700 (Victims of Crime Abroad)',
    'Form DS-5507 Physical Presence Jurat',
  ],
  handoff_protocol: 'EMBASSY_ACS_CONSULAR_ESCORT',
  metadata_requirements: ['consular_post', 'passport_status', 'hague_notice_filed'],
  summary: 'Cross-border emergency stranding protocol for protective parents trapped abroad. Invokes 7 FAM 1700 consular evacuation and Hague Art. 13(b) grave risk defenses.',
};

export const JURISDICTION_PROFILES: Record<string, JurisdictionProfile> = {
  US_INTERSTATE_FL_NV,
  CROSS_BORDER_MX_US,
};

export const DEFAULT_JURISDICTION_PROFILE_CODE = 'US_INTERSTATE_FL_NV';
