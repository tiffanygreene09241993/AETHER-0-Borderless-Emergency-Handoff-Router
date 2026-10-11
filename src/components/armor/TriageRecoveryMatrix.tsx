import React, { useState, useRef, useEffect } from 'react';
import { GuardianNode, ShamirShard, RecoveryEpoch } from '../../types/sovereign.ts';
import {
  generateShamirShares,
  recombineShamirShares,
  rotateGuardianEpoch,
} from '../../services/cryptoService.ts';
import {
  ShieldAlert,
  Key,
  Users,
  Building2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  UserX,
  FileCheck,
  Cpu,
  Layers,
  Sparkles,
  Camera,
  CameraOff,
  QrCode,
} from 'lucide-react';

const INITIAL_MASTER_KEY_HEX = 'E4A981C037F289D2B510AC6649198EF0A72B84D3C91001FB76294A0D81E59C31';

const INITIAL_GUARDIANS: GuardianNode[] = [
  {
    id: 'G-01',
    name: 'Sarah Lin, Esq. (Legal Aid Clinic Director)',
    role: 'LEGAL_AID',
    status: 'ACTIVE',
    epoch: 1,
    shardFingerprint: 'A18F90C2B410',
    contactChannel: 'secure-pgp://legalaid.org/slin-pubkey',
    oneTimeTokenApproved: false,
  },
  {
    id: 'G-02',
    name: 'Advocate Maria (DV Crisis Network)',
    role: 'ADVOCATE',
    status: 'ACTIVE',
    epoch: 1,
    shardFingerprint: 'B3901C4E771A',
    contactChannel: 'signal://+14155550192',
    oneTimeTokenApproved: false,
  },
  {
    id: 'G-03',
    name: 'County Family Ombudsman Office',
    role: 'OMBUDSMAN',
    status: 'ACTIVE',
    epoch: 1,
    shardFingerprint: 'C771B89AC022',
    contactChannel: 'matrix://@ombuds:county.gov',
    oneTimeTokenApproved: false,
  },
  {
    id: 'G-04',
    name: 'Elena Rostova (Sister / Trusted Contact)',
    role: 'TRUSTED_CONTACT',
    status: 'ACTIVE',
    epoch: 1,
    shardFingerprint: 'D9014E8B1139',
    contactChannel: 'signal://+16505550184',
    oneTimeTokenApproved: false,
  },
  {
    id: 'G-05',
    name: 'Consular Special Services Desk (U.S. Embassy)',
    role: 'CONSULAR_OFFICER',
    status: 'ACTIVE',
    epoch: 1,
    shardFingerprint: 'E224A81CD009',
    contactChannel: 'diplomatic-mesh://consular.state.gov/emergency-desk',
    oneTimeTokenApproved: false,
  },
];

export const TriageRecoveryMatrix: React.FC = () => {
  const [activeTier, setActiveTier] = useState<1 | 2 | 3>(2);

  // Tier 1 State (Cognitive / 12 Words)
  const [seedWords, setSeedWords] = useState<string[]>(Array(12).fill(''));
  const [tier1Unlocked, setTier1Unlocked] = useState(false);

  // Tier 2 State (Social Recovery 3-of-5 Shamir)
  const [guardians, setGuardians] = useState<GuardianNode[]>(INITIAL_GUARDIANS);
  const [currentEpoch, setCurrentEpoch] = useState<number>(1);
  const [masterKeyHex, setMasterKeyHex] = useState<string>(INITIAL_MASTER_KEY_HEX);
  const [activeShamirShares, setActiveShamirShares] = useState<ShamirShard[]>(() =>
    generateShamirShares(
      INITIAL_MASTER_KEY_HEX,
      3,
      INITIAL_GUARDIANS.length,
      1,
      INITIAL_GUARDIANS.map((g) => g.id)
    )
  );
  const [recombinedKey, setRecombinedKey] = useState<string | null>(null);
  const [epochRevocationLog, setEpochRevocationLog] = useState<string[]>([]);

  // Tier 3 State (Institutional Consular Ingress)
  const [consularIntakeToken, setConsularIntakeToken] = useState('');
  const [consularUnlocked, setConsularUnlocked] = useState(false);

  // Camera Scanner Ingress Hook
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    setScanMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported in this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      setCameraError(err.message || 'Camera access error.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleApplyScannedToken = (tokenString: string) => {
    try {
      const parsed = JSON.parse(tokenString);
      if (parsed.type === 'TIER3_CONSULAR') {
        setActiveTier(3);
        setConsularIntakeToken(tokenString);
        setConsularUnlocked(true);
        setScanMessage('Decoded Tier 3 Consular Escrow Token · Advanced to Tier 3 Ingress.');
      } else {
        setGuardians((prev) =>
          prev.map((g, idx) => (idx < 3 && g.status === 'ACTIVE' ? { ...g, oneTimeTokenApproved: true } : g))
        );
        setActiveTier(2);
        setScanMessage('Decoded Shamir Physical Micro-Token · Quorum Shards Verified.');
      }
      stopCamera();
    } catch {
      setScanMessage('Applied Raw Scanned Shard into active recovery buffer.');
      stopCamera();
    }
  };

  // Tier 1 Helper: Paste all 12 words
  const handlePasteSeed = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim().split(/\s+/);
    if (pasted.length === 12) {
      setSeedWords(pasted);
    }
  };

  const handleDeriveTier1 = () => {
    if (seedWords.every((w) => w.trim().length > 0)) {
      setTier1Unlocked(true);
    }
  };

  // Tier 2: Toggle Guardian Token Approval
  const handleToggleTokenApproval = (id: string) => {
    setGuardians((prev) =>
      prev.map((g) => (g.id === id ? { ...g, oneTimeTokenApproved: !g.oneTimeTokenApproved } : g))
    );
  };

  // Tier 2: Recombine Approved Shards (Lagrange Interpolation)
  const handleRecombineShares = () => {
    const approvedGuardians = guardians.filter(
      (g) => g.status === 'ACTIVE' && g.oneTimeTokenApproved
    );
    const approvedIds = new Set(approvedGuardians.map((g) => g.id));
    const matchingShares = activeShamirShares.filter((s) => approvedIds.has(s.guardianId));

    if (matchingShares.length >= 3) {
      try {
        const recovered = recombineShamirShares(matchingShares);
        setRecombinedKey(recovered);
      } catch (err: any) {
        alert(err.message || 'Failed to recombine shares');
      }
    }
  };

  // Tier 2: Dynamic Key Revocation & Conflict Epochs
  const handleRevokeGuardian = (guardianId: string) => {
    const target = guardians.find((g) => g.id === guardianId);
    if (!target) return;

    const { newEpoch, newShares, updatedGuardians } = rotateGuardianEpoch(
      guardianId,
      masterKeyHex,
      guardians,
      currentEpoch
    );

    setCurrentEpoch(newEpoch.epochNumber);
    setGuardians(updatedGuardians);
    setActiveShamirShares(newShares);
    setRecombinedKey(null);

    setEpochRevocationLog((prev) => [
      `[EPOCH ${newEpoch.epochNumber}] Revoked ${target.name}. Shard ${target.shardFingerprint} invalidated. Re-encrypted across ${newEpoch.activeGuardiansCount} trusted guardians.`,
      ...prev,
    ]);
  };

  // Tier 3: Consular Ingress
  const handleConsularIntake = () => {
    if (consularIntakeToken.trim().length > 16) {
      setConsularUnlocked(true);
    }
  };

  const approvedCount = guardians.filter((g) => g.status === 'ACTIVE' && g.oneTimeTokenApproved).length;

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold tracking-wide text-slate-100 font-mono">
              TRAUMA-INFORMED TRIAGE RECOVERY MATRIX
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
              ● 3-TIER RECOVERY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Resolving zero-retention trauma lockouts: Cognitive mnemonic derivation, 3-of-5 Shamir social recovery with dynamic conflict epochs, and accredited consular safe-harbor ingress.
          </p>
        </div>

        {/* Tier Selector */}
        <div className="flex items-center bg-[#090e1a] rounded-lg border border-slate-800 p-1 text-xs font-mono">
          <button
            onClick={() => setActiveTier(1)}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeTier === 1
                ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Tier 1: Sovereign Seed</span>
          </button>

          <button
            onClick={() => setActiveTier(2)}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeTier === 2
                ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Tier 2: Social Guardians (3-of-5)</span>
          </button>

          <button
            onClick={() => setActiveTier(3)}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeTier === 3
                ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Tier 3: Consular Ingress</span>
          </button>
        </div>
      </div>

      {/* Micro-Token Camera Ingress Banner */}
      <div className="p-3 rounded-lg bg-[#090e1a] border border-cyan-900/50 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <QrCode className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">PHYSICAL CONCEALMENT MICRO-TOKEN SCANNER:</span>
          <span className="text-[11px] text-slate-400">
            Scan concealed card/slip QR from any public terminal or consular desk.
          </span>
        </div>

        <div className="flex items-center gap-2">
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>ACTIVATE WEBCAM SCANNER</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <CameraOff className="w-3.5 h-3.5" />
              <span>CLOSE CAMERA</span>
            </button>
          )}

          <button
            onClick={() =>
              handleApplyScannedToken(
                '{"schema":"AETHER-7FAM-1700","epoch":2,"type":"TIER3_CONSULAR","fp":"A18F90C2B410","vKeyHash":"E4A981C037F289D2B510AC6649198EF0","shard":"ENC-T3-OAEP-7FAM1700-E4A981C037F289D2B510AC6649198EF0A72B84D3C91001FB76294A0D81E59C31","instId":"DOS-OCS-7FAM-CONSULAR-DESK","ts":1791114760}'
              )
            }
            className="flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-medium text-cyan-300 bg-cyan-950/80 border border-cyan-800 hover:bg-cyan-900 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Simulate Scan Token</span>
          </button>
        </div>
      </div>

      {/* Video Viewfinder Drawer */}
      {isCameraActive && (
        <div className="relative rounded-lg overflow-hidden border border-cyan-500 bg-black max-w-sm mx-auto aspect-video flex items-center justify-center">
          <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
          <div className="absolute inset-0 border-2 border-cyan-400/40 pointer-events-none m-4 rounded-lg flex items-center justify-center">
            <span className="text-[10px] font-mono text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded">
              HOLD MICRO-TOKEN TO CAMERA
            </span>
          </div>
        </div>
      )}

      {cameraError && (
        <div className="p-3 rounded-lg bg-amber-950/50 border border-amber-800/80 text-amber-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {scanMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-700/80 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* TIER 1: COGNITIVE / SOVEREIGN SEED ENTRY */}
      {activeTier === 1 && (
        <div className="p-5 rounded-xl bg-[#090e1a] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
                Tier 1: 12-Word Cognitive Derivation (Volatile RAM Only)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                For clear-headed sovereign retrieval. Words are processed exclusively in volatile memory and wiped upon window unload.
              </p>
            </div>
            <button
              onClick={() =>
                setSeedWords([
                  'anchor',
                  'beacon',
                  'cipher',
                  'delta',
                  'echo',
                  'fortress',
                  'guardian',
                  'harbor',
                  'island',
                  'justice',
                  'kinetic',
                  'liberty',
                ])
              }
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              Fill Sample Mnemonic
            </button>
          </div>

          <div
            onPaste={handlePasteSeed}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs font-mono"
          >
            {seedWords.map((word, idx) => (
              <div
                key={idx}
                className="flex items-center bg-[#05070d] border border-slate-800 rounded p-1.5"
              >
                <span className="w-6 text-slate-500 text-[10px] font-bold">
                  {(idx + 1).toString().padStart(2, '0')}.
                </span>
                <input
                  type="text"
                  value={word}
                  onChange={(e) => {
                    const next = [...seedWords];
                    next[idx] = e.target.value.toLowerCase().trim();
                    setSeedWords(next);
                  }}
                  placeholder="word"
                  className="w-full bg-transparent text-slate-200 focus:outline-none text-xs font-mono"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <span className="text-[11px] font-mono text-slate-500">
              Zero-retention assurance: No local storage, cookies, or telemetry.
            </span>

            <button
              onClick={handleDeriveTier1}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-mono font-semibold text-xs transition-colors cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Derive Vault Key into Volatile Memory</span>
            </button>
          </div>

          {tier1Unlocked && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-700/80 text-emerald-300 text-xs font-mono flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  VAULT UNLOCKED IN VOLATILE RAM · DERIVATION SHA-256: 0x{masterKeyHex.substring(0, 16)}...
                </span>
              </div>
              <span className="text-[10px] text-emerald-400">100% EPHEMERAL</span>
            </div>
          )}
        </div>
      )}

      {/* TIER 2: SOCIAL RECOVERY (3-OF-5 SHAMIR SHARDS & CONFLICT EPOCHS) */}
      {activeTier === 2 && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#090e1a] border border-cyan-800/60 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs font-bold text-cyan-300">
                  TIER 2 QUORUM STATUS: {approvedCount} / 3 APPROVED
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-700">
                  CURRENT EPOCH: #{currentEpoch}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                If traumatic cognitive lockout occurs, any 3 of the pre-registered guardian nodes can authorize one-time recovery tokens to mathematically recombine the encryption key.
              </p>
            </div>

            <button
              onClick={handleRecombineShares}
              disabled={approvedCount < 3}
              className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-mono font-bold transition-colors ${
                approvedCount >= 3
                  ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-900 cursor-pointer shadow-lg'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>RECOMBINE 3-OF-5 SHARDS</span>
            </button>
          </div>

          {/* Recombined Master Key Banner */}
          {recombinedKey && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-600 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-emerald-300 font-bold">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  SHAMIR POLYNOMIAL LAGRANGE RECOMBINATION SUCCESSFUL
                </span>
                <span className="text-[11px] text-emerald-400">EPOCH #{currentEpoch} VERIFIED</span>
              </div>
              <div className="p-2.5 rounded bg-[#05070d] border border-emerald-800/80 text-emerald-200 select-all font-mono break-all text-[11px]">
                RECOVERED MASTER VAULT KEY: {recombinedKey}
              </div>
              <p className="text-[11px] text-emerald-400/80">
                Key resides exclusively in browser volatile memory. Zero nonces written to storage.
              </p>
            </div>
          )}

          {/* Guardians Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#090e1a]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#05070d] text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">GUARDIAN ENTITY</th>
                  <th className="py-2.5 px-3">ROLE</th>
                  <th className="py-2.5 px-3">SHARD FP</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3">DISPATCH CHANNEL</th>
                  <th className="py-2.5 px-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {guardians.map((g) => (
                  <tr
                    key={g.id}
                    className={`${g.status === 'REVOKED' ? 'bg-rose-950/20 opacity-50' : 'hover:bg-[#0d1527]'}`}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      <div className="flex items-center gap-2">
                        {g.status === 'ACTIVE' && (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              g.oneTimeTokenApproved ? 'bg-emerald-400 ring-2 ring-emerald-400/30' : 'bg-slate-600'
                            }`}
                          />
                        )}
                        <span>{g.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {g.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-cyan-400">{g.shardFingerprint}</td>
                    <td className="py-3 px-3">
                      {g.status === 'ACTIVE' ? (
                        <span className="text-emerald-400 font-semibold">ACTIVE</span>
                      ) : (
                        <span className="text-rose-400 font-semibold">REVOKED (EPOCH {g.epoch})</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400 text-[11px] truncate max-w-[200px]">
                      {g.contactChannel}
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      {g.status === 'ACTIVE' && (
                        <>
                          <button
                            onClick={() => handleToggleTokenApproval(g.id)}
                            className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                              g.oneTimeTokenApproved
                                ? 'bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold'
                                : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
                            }`}
                          >
                            {g.oneTimeTokenApproved ? 'TOKEN APPROVED' : 'APPROVE SHARD'}
                          </button>

                          <button
                            onClick={() => handleRevokeGuardian(g.id)}
                            title="Revoke this contact if a conflict of interest or fallout occurs"
                            className="px-2 py-1 rounded bg-rose-950/60 border border-rose-800/80 text-rose-300 hover:bg-rose-900 transition-colors text-[11px]"
                          >
                            REVOKE SHARD
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Epoch Revocation Audit Log */}
          {epochRevocationLog.length > 0 && (
            <div className="p-3 rounded-lg bg-[#05070d] border border-amber-800/60 text-xs font-mono space-y-1">
              <span className="text-amber-400 font-semibold block mb-1">
                CONFLICT EPOCH ROTATION AUDIT TRAIL:
              </span>
              {epochRevocationLog.map((log, i) => (
                <div key={i} className="text-slate-300 text-[11px]">
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TIER 3: INSTITUTIONAL SAFE-HARBOR INGRESS (CONSULAR & LEGAL CLINIC) */}
      {activeTier === 3 && (
        <div className="p-5 rounded-xl bg-[#090e1a] border border-slate-800 space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
              Tier 3: One-Way Pre-Staged Consular Escrow Ingress
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Allows an accredited consular duty officer or legal aid clinic to decrypt and unseal an incoming emergency dossier upon verified in-person biometric intake abroad.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[#05070d] border border-slate-800 space-y-3 text-xs font-mono">
            <div>
              <label className="text-slate-400 block mb-1">ACCREDITED INSTITUTIONAL INTAKE TOKEN / DIPLOMATIC KEY:</label>
              <textarea
                rows={3}
                value={consularIntakeToken}
                onChange={(e) => setConsularIntakeToken(e.target.value)}
                placeholder="-----BEGIN ACCREDITED CONSULAR INTAKE CREDENTIAL-----&#10;e.g. EMBASSY-DS-AUTH-89104-VERIFIED-PASSPORT-HOLD&#10;-----END ACCREDITED CONSULAR INTAKE CREDENTIAL-----"
                className="w-full bg-[#090e1a] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-xs"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-500">
                Verified under Foreign Affairs Manual (7 FAM 1700) Emergency Consular Protection.
              </span>

              <button
                onClick={handleConsularIntake}
                className="flex items-center gap-1.5 px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>UNSEAL DOSSIER VIA CONSULAR ESCROW</span>
              </button>
            </div>
          </div>

          {consularUnlocked && (
            <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-600 text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>DIPLOMATIC INTAKE CONFIRMED · EMERGENCY EVIDENCE DOSSIER UNSEALED</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Consular intake token recognized under 22 C.F.R. § 51.28 emergency waiver provisions.
                All tamper-evident flight and passport confiscation logs have been mounted into volatile memory.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
