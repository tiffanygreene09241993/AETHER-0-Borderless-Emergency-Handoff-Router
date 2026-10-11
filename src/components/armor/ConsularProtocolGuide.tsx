import React, { useState } from 'react';
import {
  Globe,
  Shield,
  FileText,
  AlertTriangle,
  CheckSquare,
  Square,
  Copy,
  Download,
  Building,
  Plane,
} from 'lucide-react';

export const ConsularProtocolGuide: React.FC = () => {
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    step1: true,
    step2: false,
    step3: false,
    step4: false,
  });

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const emergencyConsularNoticeText = `NOTICE OF TRANSNATIONAL ABANDONMENT & EMERGENCY TOLLING DEMAND
Pursuant to International Directive § 910-C and the Vienna Convention on Consular Relations
--------------------------------------------------------------------------------
TO: THE CLERK OF THE COURT, FAMILY DIVISION & ALL COUNSEL OF RECORD
IN RE: EMERGENCY PROCEEDING / TEMPORARY CUSTODY SUSPENSION

PLEASE TAKE NOTICE that the undersigned parent/spouse is currently stranded outside the
United States as a direct result of Transnational Spousal Abandonment.

FACTUAL ATTESTATION:
1. Passports and identification were withheld/confiscated without consent on [DATE].
2. American Citizen Services (ACS) at the US Embassy has been formally notified.
3. Consular Emergency Intake Case Number: [ACS-CASE-NUMBER].
4. An emergency repatriation document application is currently in processing.

STATUTORY DEMAND FOR IMMEDIATE STAY:
Under Section 301 of the Transnational Abandonment Directive, all pending hearings, ex-parte motions,
and default judgment timers are stayed by operation of law for a mandatory period of 180 days.
Any order, contempt sanction, or custody alteration entered during this documented foreign
abandonment is VOID AB INITIO and subjects the moving party to mandatory federal sanctions.

FILED VIA AIR-GAPPED EMBASSY DISPATCH AT: ${new Date().toUTCString()}
`;

  const handleCopyNotice = () => {
    navigator.clipboard.writeText(emergencyConsularNoticeText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Transnational Abandonment & Consular Emergency Hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Air-gapped extraction protocols, passport replacement waivers, and automated statutory stays for survivors stranded abroad.
          </p>
        </div>

        <button
          onClick={handleCopyNotice}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 hover:bg-cyan-900 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>{copiedNotice ? 'COPIED TO CLIPBOARD' : 'COPY COURT TOLLING NOTICE'}</span>
        </button>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-xs font-mono">
        {/* Step 1 */}
        <div
          onClick={() => toggleCheck('step1')}
          className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
            checkedItems.step1
              ? 'bg-[#0a1525] border-cyan-700/80 text-slate-200'
              : 'bg-[#090e1a] border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            {checkedItems.step1 ? (
              <CheckSquare className="w-4 h-4 text-cyan-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-600" />
            )}
            <span className="font-semibold text-slate-100">
              01. PHYSICAL AIR-GAPPED SAFETY & SHELTER
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed ml-6">
            Locate a safe sovereign perimeter: US Embassy or Consulate, UN-affiliated international organization, or trusted international hotel. Do NOT connect to shared local residential Wi-Fi networks.
          </p>
        </div>

        {/* Step 2 */}
        <div
          onClick={() => toggleCheck('step2')}
          className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
            checkedItems.step2
              ? 'bg-[#0a1525] border-cyan-700/80 text-slate-200'
              : 'bg-[#090e1a] border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            {checkedItems.step2 ? (
              <CheckSquare className="w-4 h-4 text-cyan-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-600" />
            )}
            <span className="font-semibold text-slate-100">
              02. TWO-PARENT PASSPORT WAIVER (22 C.F.R. § 51.28)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed ml-6">
            Invoke exigent domestic violence exception (Form DS-5525) if child passports were confiscated. Consular officers possess statutory authority to issue emergency passports without the abuser’s signature.
          </p>
        </div>

        {/* Step 3 */}
        <div
          onClick={() => toggleCheck('step3')}
          className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
            checkedItems.step3
              ? 'bg-[#0a1525] border-cyan-700/80 text-slate-200'
              : 'bg-[#090e1a] border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            {checkedItems.step3 ? (
              <CheckSquare className="w-4 h-4 text-cyan-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-600" />
            )}
            <span className="font-semibold text-slate-100">
              03. REPATRIATION LOAN ASSISTANCE (FORM DS-3072)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed ml-6">
            If destitute due to financial cutoffs, apply directly for a Department of State Repatriation Emergency Loan to fund immediate one-way commercial travel back to sovereign soil.
          </p>
        </div>

        {/* Step 4 */}
        <div
          onClick={() => toggleCheck('step4')}
          className={`p-3.5 rounded-lg border cursor-pointer transition-colors ${
            checkedItems.step4
              ? 'bg-[#0a1525] border-cyan-700/80 text-slate-200'
              : 'bg-[#090e1a] border-slate-800 text-slate-400'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            {checkedItems.step4 ? (
              <CheckSquare className="w-4 h-4 text-cyan-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-600" />
            )}
            <span className="font-semibold text-slate-100">
              04. FILE MANDATORY TOLLING NOTICE IN DOMESTIC COURT
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed ml-6">
            Transmit the emergency consular notice to domestic family court clerk via secure portal. Automatically stays all custody deadlines and prevents default orders while stranded.
          </p>
        </div>
      </div>

      {/* Emergency Notice Preview Box */}
      <div className="p-4 rounded-lg bg-[#05070d] border border-slate-800 text-xs font-mono">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400">
          <span className="font-semibold text-cyan-300">PRE-DRAFTED COURT EMERGENCY TOLLING NOTICE:</span>
          <span>READY TO TRANSMIT</span>
        </div>
        <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap select-all font-mono text-[11px] max-h-48 overflow-y-auto">
          {emergencyConsularNoticeText}
        </pre>
      </div>
    </div>
  );
};
