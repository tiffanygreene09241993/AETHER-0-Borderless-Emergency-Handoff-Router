export interface DualClockAnchor {
  monotonicOffsetMs: number;       // performance.now() relative to timeOrigin
  wallClockTimestampUTC: number;   // Date.now() absolute nominal time
  timeOriginMs: number;            // performance.timeOrigin
}

export interface SessionKeyAttestation {
  keyAlgorithm: 'ECDSA P-256 (SHA-256)';
  publicKeySpkiBase64: string;
  terminalSignatureBase64: string;
  signedAtEpochDelta: number;
}

export interface FRE902Certification {
  recordId: string;
  ruleCitation: 'FRE 902(13) & 902(14) BIFURCATED' | 'CAL_EVID_CODE_1552_1553' | 'TEX_R_EVID_902';
  systemProcessDescription: string;
  genesisBlockHash: string;
  terminalBlockHash: string;
  dualClockAnchor: DualClockAnchor;
  sessionAttestation?: SessionKeyAttestation;
  rfc3161TimestampToken?: string; // Base64 DER token
  verifiedEventCount: number;
  juratStatement: string;
}

export interface LedgerBlock {
  index: number;
  timestamp: number;
  monotonicOffsetMs?: number;
  payloadHash: string;
  previousHash: string;
}

export interface FREDeclarationPayload {
  rule13SystemMetrics: {
    runtimeEnvironment: 'Browser WebCrypto API (NIST FIPS 180-4 SHA-256)';
    monotonicEpochStart: number;
    wallClockTimestampUTC: number;
    timeOriginMs: number;
    genesisRootHash: string;
    chainDepth: number;
    clockSource: 'W3C Dual-Clock (performance.now() + Date.now())';
  };
  rule14ExtractedArtifacts: Array<{
    fileName: string;
    byteSize: number;
    sha256Digest: string;
    captureTimestampUTC: string;
  }>;
  sessionAttestation?: SessionKeyAttestation;
  rfc3161Anchor?: {
    tsaAuthorityURI: string;
    tsaDerResponseBase64: string;
    verificationStatus: 'VERIFIED' | 'SELF_ANCHORED_AIRGAP';
  };
}
