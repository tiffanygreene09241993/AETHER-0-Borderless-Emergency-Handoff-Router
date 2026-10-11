import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
  NetworkNode,
  TelemetryEnvelope,
  EphemeralBufferSlot,
  RouterPolicyConfig,
  RouterStatistics,
  HopReceipt,
  TelemetryClassification,
} from '../types/router.ts';
import { INITIAL_NETWORK_NODES } from '../data/networkNodes.ts';
import { TELEMETRY_PRESETS } from '../data/telemetryPresets.ts';
import {
  generateEphemeralAesKey,
  encryptTelemetryPayload,
  decryptTelemetryPayload,
  shredVolatileBuffer,
  signHandoffReceipt,
  auditClientZeroPersistence,
  ZeroRetentionAuditReport,
  purgeAllBrowserResiduals,
} from '../services/cryptoService.ts';
import { soundFx } from '../services/soundFx.ts';

const BUFFER_SLOT_COUNT = 32;

interface DispatchOptions {
  sourceNodeId: string;
  targetNodeId: string;
  classification: TelemetryClassification;
  priority: 'EMERGENCY_CRITICAL' | 'HIGH_ALERT' | 'ROUTINE_METRIC';
  payload: Record<string, unknown>;
  simulateTamper?: boolean;
}

interface RouterContextType {
  nodes: NetworkNode[];
  activeEnvelopes: TelemetryEnvelope[];
  bufferSlots: EphemeralBufferSlot[];
  stats: RouterStatistics;
  policy: RouterPolicyConfig;
  recentReceipts: HopReceipt[];
  lastAuditReport: ZeroRetentionAuditReport | null;
  selectedNodeId: string | null;
  selectedSlotIndex: number | null;
  isStreaming: boolean;
  audioEnabled: boolean;
  // Actions
  setSelectedNodeId: (id: string | null) => void;
  setSelectedSlotIndex: (idx: number | null) => void;
  toggleNodeStatus: (nodeId: string) => void;
  updatePolicy: (newPolicy: Partial<RouterPolicyConfig>) => void;
  toggleAudio: () => void;
  toggleStreaming: () => void;
  dispatchTelemetry: (opts: DispatchOptions) => Promise<string | null>;
  broadcastEmergencyAlert: () => Promise<void>;
  zeroizeAllMemoryNow: () => Promise<void>;
  runZeroRetentionAudit: () => Promise<ZeroRetentionAuditReport>;
}

const RouterContext = createContext<RouterContextType | null>(null);

function generateHexDumpSlice(): string {
  const bytes: string[] = [];
  for (let i = 0; i < 8; i++) {
    const val = Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
    bytes.push(val);
  }
  return bytes.join(' ');
}

// Find path using BFS across online connected nodes
function findRoutePath(nodes: NetworkNode[], sourceId: string, targetId: string): string[] | null {
  if (sourceId === targetId) return [sourceId];
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const queue: string[][] = [[sourceId]];
  const visited = new Set<string>([sourceId]);

  while (queue.length > 0) {
    const currentPath = queue.shift()!;
    const currentNodeId = currentPath[currentPath.length - 1];
    const currentNode = nodeMap.get(currentNodeId);

    if (!currentNode || currentNode.status === 'severed' || currentNode.status === 'jammed') {
      continue;
    }

    for (const neighborId of currentNode.connectedNodeIds) {
      const neighbor = nodeMap.get(neighborId);
      if (!neighbor || neighbor.status === 'severed' || neighbor.status === 'jammed') {
        continue;
      }
      if (neighborId === targetId) {
        return [...currentPath, neighborId];
      }
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push([...currentPath, neighborId]);
      }
    }
  }
  return null;
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<NetworkNode[]>(INITIAL_NETWORK_NODES);
  const [activeEnvelopes, setActiveEnvelopes] = useState<TelemetryEnvelope[]>([]);
  const [recentReceipts, setRecentReceipts] = useState<HopReceipt[]>([]);
  const [lastAuditReport, setLastAuditReport] = useState<ZeroRetentionAuditReport | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [policy, setPolicy] = useState<RouterPolicyConfig>({
    ephemeralTtlMs: 1400,
    maxHops: 5,
    zeroizeAlgorithm: 'CRYPTO-RANDOM-WIPE',
    strictBorderAuthentication: true,
    dropOnTamper: true,
    tamperSimulationActive: false,
  });

  const [stats, setStats] = useState<RouterStatistics>({
    totalPacketsRouted: 8420,
    totalBytesEvaporated: 4182900,
    activeEnvelopesInRam: 0,
    meanHandoffLatencyMs: 24.6,
    zeroRetentionAuditCompliance: 100,
    diskPersistenceViolations: 0,
    activeNodesCount: INITIAL_NETWORK_NODES.filter((n) => n.status === 'online').length,
    tamperAttemptsBlocked: 14,
  });

  // Initialize Ephemeral RAM Buffer Slots
  const [bufferSlots, setBufferSlots] = useState<EphemeralBufferSlot[]>(() => {
    return Array.from({ length: BUFFER_SLOT_COUNT }, (_, idx) => {
      const hexBase = (0x7fff0000 + idx * 0x1000).toString(16).toUpperCase();
      return {
        slotIndex: idx,
        memoryAddress: `0x${hexBase}`,
        state: 'ZERO',
        envelopeId: null,
        byteCount: 0,
        hexDumpSlice: '00 00 00 00 00 00 00 00',
        dwellRemainingMs: 0,
        totalDwellMs: 0,
        lastWipeTimestamp: Date.now(),
      };
    });
  });

  // Keep ref for callbacks
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const policyRef = useRef(policy);
  policyRef.current = policy;
  const bufferSlotsRef = useRef(bufferSlots);
  bufferSlotsRef.current = bufferSlots;

  // Toggle sound fx
  const toggleAudio = useCallback(() => {
    soundFx.enabled = !audioEnabled;
    setAudioEnabled(!audioEnabled);
  }, [audioEnabled]);

  // Toggle node status (simulate outage / jammed border)
  const toggleNodeStatus = useCallback((nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== nodeId) return n;
        const nextStatus: NetworkNode['status'] =
          n.status === 'online'
            ? 'jammed'
            : n.status === 'jammed'
            ? 'severed'
            : 'online';
        return { ...n, status: nextStatus };
      })
    );
  }, []);

  // Update policy
  const updatePolicy = useCallback((newPolicy: Partial<RouterPolicyConfig>) => {
    setPolicy((prev) => ({ ...prev, ...newPolicy }));
  }, []);

  // Run Zero-Retention Audit
  const runZeroRetentionAudit = useCallback(async (): Promise<ZeroRetentionAuditReport> => {
    const report = await auditClientZeroPersistence();
    setLastAuditReport(report);
    setStats((prev) => ({
      ...prev,
      diskPersistenceViolations: report.persistedRouterBytes,
      zeroRetentionAuditCompliance: report.auditPassed ? 100 : 0,
    }));
    return report;
  }, []);

  // Emergency Zeroize All Memory Now (Panic shred)
  const zeroizeAllMemoryNow = useCallback(async () => {
    soundFx.playZeroizeSweep();

    // Shred volatile slots
    const now = Date.now();
    await shredVolatileBuffer(1024, policyRef.current.zeroizeAlgorithm);

    // Evict all ServiceWorker caches, IndexedDB, and web storage
    await purgeAllBrowserResiduals();

    setBufferSlots((prev) =>
      prev.map((slot) => ({
        ...slot,
        state: 'ZERO',
        envelopeId: null,
        byteCount: 0,
        hexDumpSlice: '00 00 00 00 00 00 00 00',
        dwellRemainingMs: 0,
        totalDwellMs: 0,
        lastWipeTimestamp: now,
      }))
    );

    setActiveEnvelopes([]);
    setNodes((prev) => prev.map((n) => ({ ...n, activeQueueCount: 0 })));

    setStats((prev) => ({
      ...prev,
      activeEnvelopesInRam: 0,
      totalBytesEvaporated: prev.totalBytesEvaporated + 8192,
    }));
  }, []);

  // Dispatch Telemetry Envelope across disparate nodes
  const dispatchTelemetry = useCallback(
    async (opts: DispatchOptions): Promise<string | null> => {
      const currentNodes = nodesRef.current;
      const currentPolicy = policyRef.current;
      const currentSlots = bufferSlotsRef.current;

      // Find path across online nodes
      const path = findRoutePath(currentNodes, opts.sourceNodeId, opts.targetNodeId);
      if (!path || path.length === 0) {
        soundFx.playTamperAlert();
        return null; // Route severed or unreachable
      }

      // Find free volatile RAM slot
      const freeSlotIndex = currentSlots.findIndex((s) => s.state === 'ZERO');
      const assignedSlot = freeSlotIndex !== -1 ? freeSlotIndex : Math.floor(Math.random() * BUFFER_SLOT_COUNT);

      // Perform real WebCrypto AES-256-GCM encryption
      const { cryptoKey, fingerprint } = await generateEphemeralAesKey();
      const encryptionResult = await encryptTelemetryPayload(opts.payload, cryptoKey);

      // Handle tamper simulation
      let ciphertextHex = encryptionResult.ciphertextHex;
      let authTagHex = encryptionResult.authTagHex;
      const isTampered = opts.simulateTamper || currentPolicy.tamperSimulationActive;

      if (isTampered) {
        // Corrupt auth tag or ciphertext
        authTagHex = 'DEADBEEF' + authTagHex.substring(8);
      }

      const envelopeId = 'ENV-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      const initialTtl = currentPolicy.ephemeralTtlMs;

      // Update Volatile Buffer Slot to ACTIVE_CIPHER
      setBufferSlots((prev) =>
        prev.map((slot) => {
          if (slot.slotIndex !== assignedSlot) return slot;
          return {
            ...slot,
            state: 'ACTIVE_CIPHER',
            envelopeId,
            byteCount: encryptionResult.byteLength,
            hexDumpSlice: generateHexDumpSlice(),
            dwellRemainingMs: initialTtl,
            totalDwellMs: initialTtl,
          };
        })
      );

      const newEnvelope: TelemetryEnvelope = {
        envelopeId,
        sourceNodeId: opts.sourceNodeId,
        targetNodeId: opts.targetNodeId,
        classification: opts.classification,
        priority: opts.priority,
        createdAt: Date.now(),
        ttlMs: initialTtl,
        initialTtlMs: initialTtl,
        path,
        currentHopIndex: 0,
        status: 'ENCRYPTING',
        cipher: {
          algorithm: 'AES-256-GCM',
          ivHex: encryptionResult.ivHex,
          ciphertextHex,
          authTagHex,
          keyFingerprint: fingerprint,
          originalPayloadSnippet: JSON.stringify(opts.payload).substring(0, 80) + '...',
          payloadByteLength: encryptionResult.byteLength,
        },
        receipts: [],
        allocatedSlotIndex: assignedSlot,
      };

      setActiveEnvelopes((prev) => [...prev, newEnvelope]);
      soundFx.playHandoffBlip();

      // Begin Step-by-Step Hop Handoff Sequence
      const hopDelayMs = Math.max(120, Math.floor(initialTtl / (path.length + 1)));

      const executeHop = async (hopIndex: number) => {
        if (hopIndex >= path.length) {
          // Final hop reached: Destination endpoint verification
          if (isTampered) {
            // Decryption will fail due to altered auth tag
            soundFx.playTamperAlert();
            setStats((prev) => ({
              ...prev,
              tamperAttemptsBlocked: prev.tamperAttemptsBlocked + 1,
            }));

            setActiveEnvelopes((prev) =>
              prev.map((env) =>
                env.envelopeId === envelopeId ? { ...env, status: 'TAMPER_REJECTED' } : env
              )
            );

            // Immediate zeroize slot
            setTimeout(async () => {
              await shredVolatileBuffer(encryptionResult.byteLength, currentPolicy.zeroizeAlgorithm);
              setBufferSlots((prev) =>
                prev.map((slot) =>
                  slot.slotIndex === assignedSlot
                    ? {
                        ...slot,
                        state: 'ZERO',
                        envelopeId: null,
                        byteCount: 0,
                        hexDumpSlice: '00 00 00 00 00 00 00 00',
                        dwellRemainingMs: 0,
                        lastWipeTimestamp: Date.now(),
                      }
                    : slot
                )
              );
              setActiveEnvelopes((prev) => prev.filter((env) => env.envelopeId !== envelopeId));
            }, 300);
            return;
          }

          // Verified Decryption at Destination
          const decrypted = await decryptTelemetryPayload(
            ciphertextHex,
            encryptionResult.ivHex,
            authTagHex,
            cryptoKey
          );

          if (decrypted) {
            soundFx.playBorderCross();
            // Perform Ephemeral Memory Zeroization
            const shredResult = await shredVolatileBuffer(
              encryptionResult.byteLength,
              currentPolicy.zeroizeAlgorithm
            );

            setActiveEnvelopes((prev) =>
              prev.map((env) =>
                env.envelopeId === envelopeId
                  ? {
                      ...env,
                      status: 'DELIVERED',
                      shreddedAt: Date.now(),
                      zeroRetentionProofHash: shredResult.finalHash,
                    }
                  : env
              )
            );

            // Clean RAM slot
            setTimeout(() => {
              setBufferSlots((prev) =>
                prev.map((slot) =>
                  slot.slotIndex === assignedSlot
                    ? {
                        ...slot,
                        state: 'ZERO',
                        envelopeId: null,
                        byteCount: 0,
                        hexDumpSlice: '00 00 00 00 00 00 00 00',
                        dwellRemainingMs: 0,
                        lastWipeTimestamp: Date.now(),
                      }
                    : slot
                )
              );
              setActiveEnvelopes((prev) => prev.filter((env) => env.envelopeId !== envelopeId));
            }, 250);

            // Update stats
            setStats((prev) => ({
              ...prev,
              totalPacketsRouted: prev.totalPacketsRouted + 1,
              totalBytesEvaporated: prev.totalBytesEvaporated + encryptionResult.byteLength,
            }));
          }
          return;
        }

        const currentNodeId = path[hopIndex];
        const currentNode = nodesRef.current.find((n) => n.id === currentNodeId);

        // Generate Ephemeral Border Handoff Signature
        const signature = await signHandoffReceipt(currentNodeId, envelopeId, Date.now());
        const receipt: HopReceipt = {
          nodeId: currentNodeId,
          nodeName: currentNode ? currentNode.name : currentNodeId,
          protocol: currentNode ? currentNode.protocol : 'DTN/BPv7',
          inboundTimestamp: Date.now(),
          handoffTimestamp: Date.now() + 15,
          verifiedSignature: signature,
          dwellTimeMs: 14 + Math.floor(Math.random() * 10),
        };

        setRecentReceipts((prev) => [receipt, ...prev.slice(0, 19)]);
        soundFx.playHandoffBlip();

        // Increment node packet counter
        setNodes((prev) =>
          prev.map((n) =>
            n.id === currentNodeId ? { ...n, packetsProcessed: n.packetsProcessed + 1 } : n
          )
        );

        setActiveEnvelopes((prev) =>
          prev.map((env) => {
            if (env.envelopeId !== envelopeId) return env;
            return {
              ...env,
              currentHopIndex: hopIndex,
              status: hopIndex === 0 ? 'IN_TRANSIT' : 'BORDER_HANDOFF',
              receipts: [...env.receipts, receipt],
            };
          })
        );

        // Next hop
        setTimeout(() => {
          executeHop(hopIndex + 1);
        }, hopDelayMs);
      };

      setTimeout(() => {
        executeHop(0);
      }, 50);

      return envelopeId;
    },
    []
  );

  // Broadcast Emergency Alert to All Available Nodes simultaneously
  const broadcastEmergencyAlert = useCallback(async () => {
    const preset = TELEMETRY_PRESETS[0]; // Mass casualty
    const targetNodes = nodesRef.current.filter((n) => n.id !== preset.sourceNodeId && n.status === 'online');

    for (const target of targetNodes) {
      await dispatchTelemetry({
        sourceNodeId: preset.sourceNodeId,
        targetNodeId: target.id,
        classification: preset.id,
        priority: 'EMERGENCY_CRITICAL',
        payload: {
          ...preset.defaultPayload,
          broadcast_mode: 'BORDERLESS_ALL_NODES',
          timestamp_utc: new Date().toISOString(),
        },
      });
    }
  }, [dispatchTelemetry]);

  // Toggle Continuous Stream Mode
  const toggleStreaming = useCallback(() => {
    setIsStreaming((prev) => !prev);
  }, []);

  // Continuous Stream Interval
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      // Pick random preset
      const preset = TELEMETRY_PRESETS[Math.floor(Math.random() * TELEMETRY_PRESETS.length)];
      const onlineNodes = nodesRef.current.filter((n) => n.status === 'online');
      if (onlineNodes.length < 2) return;

      const source = onlineNodes[Math.floor(Math.random() * onlineNodes.length)];
      let target = onlineNodes[Math.floor(Math.random() * onlineNodes.length)];
      while (target.id === source.id && onlineNodes.length > 1) {
        target = onlineNodes[Math.floor(Math.random() * onlineNodes.length)];
      }

      dispatchTelemetry({
        sourceNodeId: source.id,
        targetNodeId: target.id,
        classification: preset.id,
        priority: preset.priority,
        payload: {
          ...preset.defaultPayload,
          stream_seq: Math.floor(Math.random() * 99999),
          timestamp_ms: Date.now(),
        },
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isStreaming, dispatchTelemetry]);

  // Buffer TTL countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setBufferSlots((prev) =>
        prev.map((slot) => {
          if (slot.state !== 'ACTIVE_CIPHER') return slot;
          const nextDwell = Math.max(0, slot.dwellRemainingMs - 100);
          if (nextDwell === 0) {
            // Memory lifetime expired: Zeroize slot
            return {
              ...slot,
              state: 'ZERO',
              envelopeId: null,
              byteCount: 0,
              hexDumpSlice: '00 00 00 00 00 00 00 00',
              dwellRemainingMs: 0,
              lastWipeTimestamp: Date.now(),
            };
          }
          return {
            ...slot,
            dwellRemainingMs: nextDwell,
          };
        })
      );
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Update active envelopes count
  useEffect(() => {
    setStats((prev) => ({
      ...prev,
      activeEnvelopesInRam: activeEnvelopes.length,
      activeNodesCount: nodes.filter((n) => n.status === 'online').length,
    }));
  }, [activeEnvelopes, nodes]);

  // Initial zero-retention audit run
  useEffect(() => {
    runZeroRetentionAudit();
  }, [runZeroRetentionAudit]);

  return (
    <RouterContext.Provider
      value={{
        nodes,
        activeEnvelopes,
        bufferSlots,
        stats,
        policy,
        recentReceipts,
        lastAuditReport,
        selectedNodeId,
        selectedSlotIndex,
        isStreaming,
        audioEnabled,
        setSelectedNodeId,
        setSelectedSlotIndex,
        toggleNodeStatus,
        updatePolicy,
        toggleAudio,
        toggleStreaming,
        dispatchTelemetry,
        broadcastEmergencyAlert,
        zeroizeAllMemoryNow,
        runZeroRetentionAudit,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export function useRouterEngine(): RouterContextType {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouterEngine must be used within a RouterProvider');
  }
  return context;
}
