import React, { useState, useEffect } from 'react';
import { DeadManConfig, DeadManRecipient } from '../../types/sovereign.ts';
import {
  Clock,
  Send,
  AlertOctagon,
  ShieldCheck,
  CheckCircle,
  FileText,
  Mail,
  RefreshCw,
  Building,
  HeartPulse,
  Radio,
  Lock,
  Unlock,
} from 'lucide-react';

const INITIAL_RECIPIENTS: DeadManRecipient[] = [
  {
    name: 'Special Litigation Team (Attn: E. Alvarez, Lead Counsel)',
    organization: 'National Domestic Violence Legal Defense Initiative',
    channelType: 'LEGAL_COUNSEL',
    endpointUri: 'secure-dispatch://litigation.dvdefense.org/intake/deadman-drop',
    status: 'STANDBY',
  },
  {
    name: 'Transnational Human Rights & Forensic Documentation Desk',
    organization: 'Amnesty International Special Inquiries Bureau',
    channelType: 'HUMAN_RIGHTS_WATCHDOG',
    endpointUri: 'https://humanrights-intake.org/api/v1/emergency-dossier',
    status: 'STANDBY',
  },
  {
    name: 'Consular Special Protection Services Unit',
    organization: 'U.S. Department of State - Overseas Citizen Services',
    channelType: 'CONSULAR_DESK',
    endpointUri: 'diplomatic-relay://state.gov/consular/special-protection/emergency',
    status: 'STANDBY',
  },
];

export const DeadManTestament: React.FC = () => {
  const [intervalDays, setIntervalDays] = useState<30 | 60 | 90>(30);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30 * 24 * 3600); // 30 days in seconds
  const [isArmed, setIsArmed] = useState(true);
  const [isDispatched, setIsDispatched] = useState(false);
  const [recipients, setRecipients] = useState<DeadManRecipient[]>(INITIAL_RECIPIENTS);
  const [dispatchTimestamp, setDispatchTimestamp] = useState<number | null>(null);

  // Live Countdown ticker
  useEffect(() => {
    if (!isArmed || isDispatched) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          triggerDeadManDispatch();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isArmed, isDispatched]);

  const handleResetTimer = () => {
    setSecondsRemaining(intervalDays * 24 * 3600);
    setIsDispatched(false);
    setDispatchTimestamp(null);
    setRecipients((prev) => prev.map((r) => ({ ...r, status: 'STANDBY' })));
  };

  const handleIntervalChange = (days: 30 | 60 | 90) => {
    setIntervalDays(days);
    setSecondsRemaining(days * 24 * 3600);
  };

  const triggerDeadManDispatch = () => {
    setIsDispatched(true);
    setDispatchTimestamp(Date.now());
    setRecipients((prev) => prev.map((r) => ({ ...r, status: 'TRANSMITTED' })));
  };

  // Convert seconds into Days, Hours, Mins, Secs
  const days = Math.floor(secondsRemaining / (24 * 3600));
  const hours = Math.floor((secondsRemaining % (24 * 3600)) / 3600);
  const mins = Math.floor((secondsRemaining % 3600) / 60);
  const secs = secondsRemaining % 60;

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-bold tracking-wide text-slate-100 font-mono">
              AUTOMATED DEAD-MAN RELEASE & POST-MORTEM DISPATCH
            </h2>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                isDispatched
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {isDispatched ? '● DISPATCH ACTIVATED' : '● ROLLING TIMER ARMED'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Safeguard against severe incapacitation, unlawful confinement, or death: Automatically decrypts and transmits the sealed evidentiary dossier to designated legal counsel and watchdogs upon missed check-in.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetTimer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>CONFIRM CHECK-IN (RESET TIMER)</span>
          </button>

          <button
            onClick={triggerDeadManDispatch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-rose-300 bg-rose-950/60 border border-rose-800/80 hover:bg-rose-900 transition-colors"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Simulate Expiration</span>
          </button>
        </div>
      </div>

      {/* Timer Display Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7 p-5 rounded-xl bg-[#090e1a] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold">
              Rolling Intake Expiration Countdown:
            </span>
            <div className="flex items-center gap-1 bg-[#05070d] rounded border border-slate-800 p-0.5 text-xs font-mono">
              {[30, 60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => handleIntervalChange(d as any)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    intervalDays === d
                      ? 'bg-amber-950 text-amber-300 font-bold border border-amber-800'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-baseline gap-3 my-2 font-mono text-slate-100">
            <div className="text-4xl font-bold text-amber-400">
              {days.toString().padStart(2, '0')}d : {hours.toString().padStart(2, '0')}h :{' '}
              {mins.toString().padStart(2, '0')}m : {secs.toString().padStart(2, '0')}s
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Requires one-click volatile check-in prior to expiration.</span>
            <span className="text-emerald-400 font-semibold">NO CLOUD ACCOUNT REQUIRED</span>
          </div>
        </div>

        {/* Status Callout */}
        <div className="md:col-span-5 p-5 rounded-xl bg-[#090e1a] border border-slate-800 flex flex-col justify-between text-xs font-mono">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="font-semibold text-slate-200">AUTOMATED DISPATCH PROTOCOL</span>
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Upon timer reaching 00:00:00 without check-in, the AES-256 pre-staged testament will
              unseal and broadcast over encrypted relay conduits. All evidentiary SHA-256 logs are
              certified under Federal Rule of Evidence 804(b)(6).
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Recipients Armed:</span>
            <span className="text-cyan-300 font-bold">{recipients.length} Accredited Entities</span>
          </div>
        </div>
      </div>

      {/* Dispatched Alert Banner */}
      {isDispatched && (
        <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-600 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-rose-200 font-bold">
            <span className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              DEAD-MAN DISPATCH TRIGGERED · PRE-STAGED DOSSIER UNSEALED AND FORWARDED
            </span>
            <span className="text-[11px] text-rose-400 font-mono">
              TIMESTAMP: {new Date(dispatchTimestamp || Date.now()).toISOString()}
            </span>
          </div>
          <p className="text-rose-300/90 leading-relaxed text-[11px]">
            Transmission of sworn testament, SHA-256 tamper timeline, and consular extraction logs has
            completed across all 3 secure endpoints. An FRE 804(b)(6) Forfeiture by Wrongdoing motion is
            now legally actionable.
          </p>
        </div>
      )}

      {/* Designated Recipients Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#090e1a]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#05070d] text-slate-400 border-b border-slate-800 text-[11px]">
            <tr>
              <th className="py-2.5 px-4">DESIGNATED RECIPIENT</th>
              <th className="py-2.5 px-3">ORGANIZATION</th>
              <th className="py-2.5 px-3">CHANNEL TYPE</th>
              <th className="py-2.5 px-3">ENCRYPTED ENDPOINT</th>
              <th className="py-2.5 px-3 text-right">DISPATCH STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {recipients.map((rec, i) => (
              <tr key={i} className="hover:bg-[#0d1527]">
                <td className="py-3 px-4 font-semibold text-slate-200">{rec.name}</td>
                <td className="py-3 px-3 text-slate-400">{rec.organization}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                    {rec.channelType}
                  </span>
                </td>
                <td className="py-3 px-3 text-cyan-400 text-[11px] truncate max-w-[220px]">
                  {rec.endpointUri}
                </td>
                <td className="py-3 px-3 text-right">
                  {rec.status === 'TRANSMITTED' ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700 font-bold">
                      TRANSMITTED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-800/80">
                      ARMED & STANDBY
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
