/**
 * Types and schema for AETHER-0 Zero-Retention Borderless Emergency Handoff Router
 */

export type ProtocolType =
  | 'DTN/BPv7'           // Delay-Tolerant Networking Bundle Protocol v7 (Space/Orbital)
  | '802.11ah HaLow'     // Long-range sub-1GHz Wi-Fi (Tactical Mesh)
  | 'Acoustic/AIS'       // Underwater acoustic + Maritime VHF
  | 'VLF-Seismic'        // Very Low Frequency subterranean waveguide
  | 'COTS-LoRa-Mesh'     // Airborne UAV swarm spread spectrum
  | 'Isolated-TLS-Cell'; // Civic hospital / mobile emergency gateway

export type DomainZone =
  | 'Orbital Domain (LEO)'
  | 'Alpine Tactical Mesh'
  | 'Offshore Maritime Haven'
  | 'Civic Intake Zone'
  | 'Subterranean Deep Vault'
  | 'Airborne UAV Perimeter'
  | 'Mobile Disaster Unit';

export interface NetworkNode {
  id: string;
  name: string;
  callsign: string;
  domain: DomainZone;
  protocol: ProtocolType;
  x: number; // 0..1000 coordinate on network canvas
  y: number; // 0..600 coordinate on network canvas
  status: 'online' | 'degraded' | 'severed' | 'jammed';
  latencyMs: number;
  ephemeralKeyFingerprint: string;
  connectedNodeIds: string[];
  packetsProcessed: number;
  activeQueueCount: number;
}

export type TelemetryClassification =
  | 'MASS-CASUALTY'
  | 'SEISMIC-FAULT'
  | 'WILDFIRE-PERIMETER'
  | 'GRID-COLLAPSE'
  | 'MARITIME-SOS'
  | 'CUSTOM-PAYLOAD';

export interface TelemetryCipherData {
  algorithm: 'AES-256-GCM';
  ivHex: string;
  ciphertextHex: string;
  authTagHex: string;
  keyFingerprint: string;
  originalPayloadSnippet?: string;
  payloadByteLength: number;
}

export interface HopReceipt {
  nodeId: string;
  nodeName: string;
  protocol: ProtocolType;
  inboundTimestamp: number;
  handoffTimestamp: number;
  verifiedSignature: string;
  dwellTimeMs: number;
}

export interface TelemetryEnvelope {
  envelopeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  classification: TelemetryClassification;
  priority: 'EMERGENCY_CRITICAL' | 'HIGH_ALERT' | 'ROUTINE_METRIC';
  createdAt: number;
  ttlMs: number; // Remaining volatile memory lifetime
  initialTtlMs: number;
  path: string[];
  currentHopIndex: number;
  status:
    | 'ENCRYPTING'
    | 'IN_TRANSIT'
    | 'BORDER_HANDOFF'
    | 'DELIVERED'
    | 'ZEROIZED'
    | 'TAMPER_REJECTED';
  cipher: TelemetryCipherData;
  receipts: HopReceipt[];
  allocatedSlotIndex?: number;
  shreddedAt?: number;
  zeroRetentionProofHash?: string;
}

export interface EphemeralBufferSlot {
  slotIndex: number;
  memoryAddress: string;
  state: 'ZERO' | 'ACTIVE_CIPHER' | 'PURGING';
  envelopeId: string | null;
  byteCount: number;
  hexDumpSlice: string;
  dwellRemainingMs: number;
  totalDwellMs: number;
  lastWipeTimestamp: number;
}

export interface RouterPolicyConfig {
  ephemeralTtlMs: number;         // 200 - 5000 ms
  maxHops: number;                // 2 - 8
  zeroizeAlgorithm: 'CRYPTO-RANDOM-WIPE' | 'DOD-5220.22-M-3PASS' | 'SINGLE-PASS-ZERO';
  strictBorderAuthentication: boolean;
  dropOnTamper: boolean;
  tamperSimulationActive: boolean;
}

export interface RouterStatistics {
  totalPacketsRouted: number;
  totalBytesEvaporated: number;
  activeEnvelopesInRam: number;
  meanHandoffLatencyMs: number;
  zeroRetentionAuditCompliance: number; // e.g. 100%
  diskPersistenceViolations: number;   // strictly 0
  activeNodesCount: number;
  tamperAttemptsBlocked: number;
}
