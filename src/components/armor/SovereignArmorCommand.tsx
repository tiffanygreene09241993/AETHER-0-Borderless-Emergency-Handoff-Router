import React, { useState } from 'react';
import { TamperChainLedger } from './TamperChainLedger.tsx';
import { CoercedLockoutTracker } from './CoercedLockoutTracker.tsx';
import { ConsularProtocolGuide } from './ConsularProtocolGuide.tsx';
import { DuressDecoyView } from './DuressDecoyView.tsx';
import { TriageRecoveryMatrix } from './TriageRecoveryMatrix.tsx';
import { DeadManTestament } from './DeadManTestament.tsx';
import { PhysicalMicroToken } from './PhysicalMicroToken.tsx';
import { ConsularIntakeView } from './ConsularIntakeView.tsx';
import { ChildhoodVictimShield } from './ChildhoodVictimShield.tsx';
import { useRouterEngine } from '../../context/RouterContext.tsx';
import {
  Shield,
  ShieldAlert,
  KeyRound,
  Trash2,
  Lock,
  Binary,
  Clock,
  Globe,
  AlertOctagon,
  CheckCircle2,
  EyeOff,
  Users,
  HeartPulse,
  QrCode,
  Building2,
} from 'lucide-react';

export const SovereignArmorCommand: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'tamper' | 'lockout' | 'recovery' | 'microtoken' | 'intake' | 'childhood_shield' | 'deadman' | 'consular' | 'duress'
  >('tamper');
  const [isDecoyActive, setIsDecoyActive] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isArmed, setIsArmed] = useState(true);

  const { zeroizeAllMemoryNow } = useRouterEngine();

  // Test PIN submission
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '9999') {
      // DURESS PIN ENTERED: Silently zeroize volatile RAM and render civilian decoy
      await zeroizeAllMemoryNow();
      setIsDecoyActive(true);
      setPinInput('');
      setPinError(null);
    } else if (pinInput === '1337') {
      // OPERATIONAL PIN ENTERED
      setIsArmed(false);
      setPinInput('');
      setPinError(null);
    } else {
      setPinError('Invalid PIN code. Access denied.');
      setPinInput('');
    }
  };

  if (isDecoyActive) {
    return <DuressDecoyView onExitDecoy={() => setIsDecoyActive(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Top Armor Banner & Duress Status */}
      <div className="p-4 rounded-xl bg-[#090e1c] border border-cyan-800/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-700/80 text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-100 font-mono tracking-wide">
                THE OPERATIONAL ARMOR · SOVEREIGN PWA COMMAND CENTER
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                ● AIR-GAPPED VOLATILE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Zero-retention client infrastructure: No cloud backups, zero disk persistence, social recovery, and dead-man dispatch.
            </p>
          </div>
        </div>

        {/* Quick Duress Test / Panic Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              await zeroizeAllMemoryNow();
              setIsDecoyActive(true);
            }}
            title="Simulate entering Duress PIN (9999)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold text-amber-300 bg-amber-950/60 border border-amber-800/80 hover:bg-amber-900 transition-colors"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>Simulate Duress PIN (9999)</span>
          </button>

          <button
            onClick={zeroizeAllMemoryNow}
            title="Instant multi-pass RAM overwrite"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold text-rose-300 bg-rose-950/60 border border-rose-800/80 hover:bg-rose-900 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Panic Shred RAM</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveSubTab('tamper')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'tamper'
              ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Binary className="w-3.5 h-3.5" />
          <span>Tamper Chain-of-Custody</span>
        </button>

        <button
          onClick={() => setActiveSubTab('lockout')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'lockout'
              ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Coerced Compliance Delta</span>
        </button>

        <button
          onClick={() => setActiveSubTab('recovery')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'recovery'
              ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Triage Recovery Matrix</span>
        </button>

        <button
          onClick={() => setActiveSubTab('microtoken')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'microtoken'
              ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Micro-Print Token</span>
        </button>

        <button
          onClick={() => setActiveSubTab('intake')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'intake'
              ? 'bg-[#152033] text-amber-300 font-semibold border border-amber-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Consular Intake Terminal (7 FAM)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('childhood_shield')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'childhood_shield'
              ? 'bg-[#152033] text-rose-300 font-semibold border border-rose-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Childhood Victim Shield (§ 206)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('deadman')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'deadman'
              ? 'bg-[#152033] text-rose-300 font-semibold border border-rose-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Dead-Man Dispatch</span>
        </button>

        <button
          onClick={() => setActiveSubTab('consular')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'consular'
              ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Consular Hub</span>
        </button>

        <button
          onClick={() => setActiveSubTab('duress')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'duress'
              ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Duress PIN Security Bench</span>
        </button>
      </div>

      {/* Main SubTab Content */}
      <div className="space-y-6">
        {activeSubTab === 'tamper' && <TamperChainLedger />}
        {activeSubTab === 'lockout' && <CoercedLockoutTracker />}
        {activeSubTab === 'recovery' && <TriageRecoveryMatrix />}
        {activeSubTab === 'microtoken' && <PhysicalMicroToken />}
        {activeSubTab === 'intake' && <ConsularIntakeView />}
        {activeSubTab === 'childhood_shield' && <ChildhoodVictimShield />}
        {activeSubTab === 'deadman' && <DeadManTestament />}
        {activeSubTab === 'consular' && <ConsularProtocolGuide />}
        {activeSubTab === 'duress' && (
          <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5 text-xs font-mono">
            <h2 className="text-sm font-semibold text-slate-100 mb-2 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>Dual-State PIN Authentication & Plausible Deniability Bench</span>
            </h2>
            <p className="text-slate-400 mb-4 leading-relaxed">
              When coerced to unlock your device by an abuser, hostile law enforcement, or an opposing attorney, enter your secret <strong>Duress PIN (9999)</strong>. The system instantly overwrites all volatile memory buffers with zeros and mounts a harmless civic transit/weather application.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="p-4 rounded-lg bg-[#090e1a] border border-cyan-900/60">
                <span className="text-cyan-400 font-semibold block mb-1">OPERATIONAL PIN: 1337</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Unlocks full forensic ledger, compliance delta calculators, and consular evacuation protocols.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#090e1a] border border-amber-900/60">
                <span className="text-amber-400 font-semibold block mb-1">DURESS PIN: 9999 (DECOY & PURGE)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Executes instant cryptographic zeroization of volatile RAM keys and loads plausible civilian weather/transit app.
                </p>
              </div>
            </div>

            <form onSubmit={handlePinSubmit} className="max-w-md p-4 bg-[#090e1a] rounded-lg border border-slate-800">
              <label className="block text-slate-300 font-semibold mb-2">
                TEST PIN AUTHENTICATION GATE:
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter 4-digit PIN..."
                  className="flex-1 bg-[#05070d] border border-slate-800 rounded p-2 text-cyan-300 focus:outline-none focus:border-cyan-500 font-mono text-center tracking-widest text-lg"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold transition-colors cursor-pointer"
                >
                  AUTHENTICATE
                </button>
              </div>
              {pinError && (
                <div className="mt-2 text-rose-400 text-[11px]">
                  {pinError}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
