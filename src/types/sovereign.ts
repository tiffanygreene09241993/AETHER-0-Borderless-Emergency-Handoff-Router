/**
 * Types for the Sovereign Armor & Institutional Safe-Harbor Framework
 */

export type InstitutionalTargetDomain =
  | 'family-court'
  | 'child-welfare'
  | 'university-board'
  | 'consular-immigration';

export interface TamperEventEntry {
  id: string;
  timestamp: number;
  category:
    | 'CARRIER_PORT_OUT'
    | 'MFA_HIJACK'
    | 'CREDENTIAL_REVOCATION'
    | 'EX_PARTE_NOTICE_SUPPRESSION'
    | 'ARCHIVAL_RECORD_WEAPONIZATION'
    | 'DOCUMENT_CONFISCATION'
    | 'TRANSNATIONAL_ABANDONMENT'
    | 'COERCED_COMPLIANCE_DELTA';
  title: string;
  observedVector: string;
  sourceIndicator: string;
  hashDigest: string; // SHA-256 of timestamp + category + vector
  prevHash: string;   // Cryptographic chain-of-custody pointer
  coercedWindowStart?: number;
  coercedWindowEnd?: number;
}

export interface RedTeamExploitStep {
  stepNumber: number;
  actor: 'ABUSER' | 'AUTOMATED_ALGORITHM' | 'AGENCY_CLERK' | 'TARGET_SURVIVOR';
  action: string;
  institutionalVulnerability: string;
  statutoryFailurePoint: string;
}

export interface InstitutionalVulnerabilityModel {
  id: string;
  domain: InstitutionalTargetDomain;
  title: string;
  subsystem: string;
  severityLevel: 'CRITICAL_SYSTEMIC' | 'HIGH_EXPLOIT' | 'PROCEDURAL_DENIAL';
  exploitSummary: string;
  victimCriminalizationVector: string;
  attackTree: RedTeamExploitStep[];
  auditRecommendation: string;
  remedialStatutoryClause: string;
}

export interface StatutoryClause {
  id: string;
  sectionCode: string;
  title: string;
  text: string;
  isActive: boolean;
  isMandatoryCore: boolean;
  legalObjective: string;
}

export interface ModelStatutoryBill {
  id: string;
  billNumber: string;
  shortTitle: string;
  formalTitle: string;
  targetJurisdiction: 'STATE_MODEL_ACT' | 'FEDERAL_US_CODE' | 'INTERNATIONAL_DIRECTIVE';
  legislativeFindings: string[];
  statutoryDefinitions: { term: string; definition: string }[];
  clauses: StatutoryClause[];
  sovereignImmunityWaiver: string;
  civilLiabilitySection: string;
}

export interface CongressionalBriefingKit {
  billId: string;
  committee: string;
  onePageExecutiveSummary: string;
  fiscalImpactAssessment: string;
  expertWitnessTestimony: string[];
  hearingQaPrep: { question: string; response: string }[];
}

export interface DuressSessionState {
  isArmed: boolean;
  isUnlocked: boolean;
  isDuressDecoyActive: boolean;
  unlockedAt: number | null;
}

export type DecoyPersona = 'transit_weather' | 'recipe_box' | 'tip_calculator' | 'scratchpad';

export interface DecoyConfig {
  activePersona: DecoyPersona;
  silentBeaconEnabled: boolean;
  beaconRelayNodeId?: string;
}

export interface GuardianNode {
  id: string;
  name: string;
  role: 'LEGAL_AID' | 'ADVOCATE' | 'OMBUDSMAN' | 'TRUSTED_CONTACT' | 'CONSULAR_OFFICER';
  status: 'ACTIVE' | 'REVOKED' | 'PENDING';
  epoch: number;
  shardFingerprint: string;
  contactChannel: string;
  oneTimeTokenApproved?: boolean;
}

export interface ShamirShard {
  index: number;
  threshold: number;
  totalShares: number;
  shareHex: string;
  epoch: number;
  guardianId: string;
}

export interface RecoveryEpoch {
  epochNumber: number;
  timestamp: number;
  activeGuardiansCount: number;
  revokedGuardianIds: string[];
  masterKeyFingerprint: string;
}

export interface DeadManRecipient {
  name: string;
  organization: string;
  channelType: 'LEGAL_COUNSEL' | 'HUMAN_RIGHTS_WATCHDOG' | 'CONSULAR_DESK';
  endpointUri: string;
  status: 'STANDBY' | 'TRANSMITTED' | 'SIMULATED';
}

export interface DeadManConfig {
  intervalDays: 30 | 60 | 90;
  lastCheckInMs: number;
  nextExpirationMs: number;
  status: 'ARMED' | 'DISPATCHED' | 'PAUSED';
  recipients: DeadManRecipient[];
}

