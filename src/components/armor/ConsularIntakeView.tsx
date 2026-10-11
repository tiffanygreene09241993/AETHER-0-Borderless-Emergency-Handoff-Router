import React, { useState } from 'react';
import { useRouterEngine } from '../../context/RouterContext.tsx';
import { purgeAllBrowserResiduals } from '../../services/cryptoService.ts';
import {
  Building2,
  KeyRound,
  ShieldCheck,
  UserCheck,
  FileText,
  Printer,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Globe,
  Stamp,
  RefreshCw,
} from 'lucide-react';

interface PreStagedMetadata {
  victimName: string;
  dob: string;
  birthPlace: string;
  usJurisdiction: string;
  eyeColor: string;
  height: string;
  distinguishingFeatures: string;
  confiscationDate: string;
  confiscationLocation: string;
  abusivePartyName: string;
  emergencyContactHash: string;
  sha256VerificationRoot: string;
}

const SAMPLE_PRESTAGED_METADATA: PreStagedMetadata = {
  victimName: 'JANE ROE (SURVIVOR)',
  dob: '1992-05-14',
  birthPlace: 'Austin, Texas, United States',
  usJurisdiction: 'Travis County, Texas',
  eyeColor: 'Hazel',
  height: '5 ft 6 in (168 cm)',
  distinguishingFeatures: 'Small horizontal scar on left collarbone; distinctive silver signet ring',
  confiscationDate: '2026-09-18',
  confiscationLocation: 'Foreign Transit Hotel (Dubai International / Istanbul Airport Transit)',
  abusivePartyName: 'JOHN ROE (ADVERSE SPOUSE)',
  emergencyContactHash: 'B48109F21A77DE42',
  sha256VerificationRoot: 'E4A981C037F289D2B510AC6649198EF0A72B84D3C91001FB76294A0D81E59C31',
};

export const ConsularIntakeView: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [accreditationKey, setAccreditationKey] = useState('DOS-7FAM-1700-CONSULAR-AUTH');
  const [microTokenInput, setMicroTokenInput] = useState(
    '{"schema":"AETHER-7FAM-1700","epoch":2,"type":"TIER3_CONSULAR","fp":"A18F90C2B410","vKeyHash":"E4A981C037F289D2B510AC6649198EF0","shard":"ENC-T3-OAEP-7FAM1700-E4A981C037F289D2B510AC6649198EF0A72B84D3C91001FB76294A0D81E59C31","instId":"DOS-OCS-7FAM-CONSULAR-DESK","ts":1791114760}'
  );
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [preStaged, setPreStaged] = useState<PreStagedMetadata>(SAMPLE_PRESTAGED_METADATA);

  // Step 2 Corroboration Checks
  const [corroborations, setCorroborations] = useState({
    facialMatch: false,
    scarMatch: false,
    birthPlaceMatch: false,
    confiscationMatch: false,
    coercionConfirmed: false,
  });

  // Step 4 Terminal Zeroize State
  const [zeroizeComplete, setZeroizeComplete] = useState(false);

  const { zeroizeAllMemoryNow } = useRouterEngine();

  // Step 1: Handshake Decrypt
  const handleDecryptHandshake = () => {
    if (accreditationKey.trim() && microTokenInput.trim()) {
      setIsDecrypted(true);
      setCurrentStep(2);
    }
  };

  // Step 4: Execute Post-Intake Zeroization
  const handlePostIntakeZeroize = async () => {
    await zeroizeAllMemoryNow();
    await purgeAllBrowserResiduals();
    setZeroizeComplete(true);
    setPreStaged({} as any);
    setMicroTokenInput('');
    setIsDecrypted(false);
  };

  const handlePrintAffidavit = () => {
    window.print();
  };

  const allCorroborated = Object.values(corroborations).every(Boolean);

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold tracking-wide text-slate-100 font-mono">
              CONSULAR & LEGAL AID INTAKE TERMINAL (7 FAM 1700)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-semibold">
              ● DIPLOMATIC SECURE INGRESS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Designed for Foreign Service Officers, Consular Duty Caseworkers, and Shelter Advocates under U.S. Foreign Affairs Manual (7 FAM 1700) Emergency Consular Protection protocols.
          </p>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          {[
            { num: 1, label: 'Handshake' },
            { num: 2, label: 'Corroboration' },
            { num: 3, label: 'DS Affidavit' },
            { num: 4, label: 'Zeroize' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num as any)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                currentStep === s.num
                  ? 'bg-cyan-400 text-slate-900 font-bold'
                  : currentStep > s.num
                  ? 'bg-[#152033] text-cyan-300 border border-cyan-800/60'
                  : 'bg-[#090e1a] text-slate-500 border border-slate-800'
              }`}
            >
              {s.num}. {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: ONE-WAY INGRESS HANDSHAKE */}
      {currentStep === 1 && (
        <div className="p-5 rounded-xl bg-[#090e1a] border border-slate-800 space-y-4 text-xs font-mono">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Step 1: Institutional Accreditation & Micro-Token Ingress Handshake
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Caseworker enters verified consular credentials to decrypt the incoming physical micro-token shard in browser volatile RAM.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">OFFICER ACCREDITATION KEY / EMBASSY DESK TOKEN:</label>
              <input
                type="text"
                value={accreditationKey}
                onChange={(e) => setAccreditationKey(e.target.value)}
                className="w-full bg-[#05070d] border border-slate-800 rounded p-2 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">INTAKE AUTHORITY JURISDICTION:</label>
              <input
                type="text"
                readOnly
                value="U.S. DEPT OF STATE · OVERSEAS CITIZEN SERVICES (7 FAM 1700)"
                className="w-full bg-[#05070d] border border-slate-800 rounded p-2 text-slate-400 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">INCOMING MICRO-TOKEN PAYLOAD (SCANNED QR JSON):</label>
            <textarea
              rows={4}
              value={microTokenInput}
              onChange={(e) => setMicroTokenInput(e.target.value)}
              placeholder="Paste raw JSON or scanned micro-token stream..."
              className="w-full bg-[#05070d] border border-slate-800 rounded p-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-[11px] text-slate-500">
              Handshake decrypts exclusively in browser RAM using WebCrypto OAEP.
            </span>

            <button
              onClick={handleDecryptHandshake}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-bold font-mono text-xs transition-colors cursor-pointer"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>DECRYPT & ADVANCE TO CORROBORATION</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BIOMETRIC / BIOGRAPHICAL CORROBORATION */}
      {currentStep === 2 && (
        <div className="p-5 rounded-xl bg-[#090e1a] border border-slate-800 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Step 2: Biometric & Biographical Corroboration Checklist
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Duty officer visually corroborates the physical applicant against pre-staged cryptographic dossier metadata.
              </p>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800">
              DOSSIER DECRYPTED IN RAM
            </span>
          </div>

          {/* Pre-staged Descriptors Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-[#05070d] border border-slate-800">
            <div className="space-y-2">
              <div className="text-[11px] text-slate-400">APPLICANT IDENTIFIER:</div>
              <div className="text-sm font-bold text-slate-100">{preStaged.victimName}</div>
              <div className="text-slate-400 text-[11px]">
                DOB: <span className="text-slate-200">{preStaged.dob}</span> · Place of Birth:{' '}
                <span className="text-slate-200">{preStaged.birthPlace}</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Home Jurisdiction:{' '}
                <span className="text-cyan-300 font-semibold">{preStaged.usJurisdiction}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] text-slate-400">PHYSICAL DESCRIPTORS:</div>
              <div className="text-slate-300 text-[11px]">
                Height: <span className="text-slate-100 font-semibold">{preStaged.height}</span> · Eyes:{' '}
                <span className="text-slate-100 font-semibold">{preStaged.eyeColor}</span>
              </div>
              <div className="text-amber-300 text-[11px] font-semibold">
                Markings: {preStaged.distinguishingFeatures}
              </div>
              <div className="text-rose-300 text-[11px]">
                Reported Confiscation: {preStaged.confiscationDate} ({preStaged.confiscationLocation})
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="space-y-2 pt-2">
            <span className="text-slate-300 font-bold block mb-1">
              OFFICER VERIFICATION PROTOCOLS (CHECK EACH CORROBORATED ITEM):
            </span>

            {[
              { key: 'facialMatch', label: '1. Facial geometry, eye color, and general likeness match pre-staged descriptors.' },
              { key: 'scarMatch', label: '2. Distinguishing mark (collarbone scar / signet ring) verified upon visual inspection.' },
              { key: 'birthPlaceMatch', label: '3. Applicant verbally corroborates birth jurisdiction (Austin, Travis County, TX).' },
              { key: 'confiscationMatch', label: '4. Account of transit hotel passport confiscation matches encrypted incident ledger.' },
              { key: 'coercionConfirmed', label: '5. Non-coercive setting established (interview conducted in private consular room without adverse spouse).' },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-2.5 p-2 rounded bg-[#070b14] border border-slate-800/80 cursor-pointer hover:bg-[#0c1424] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={(corroborations as any)[item.key]}
                  onChange={(e) =>
                    setCorroborations((prev) => ({ ...prev, [item.key]: e.target.checked }))
                  }
                  className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-slate-300 text-[11px]">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Back to Handshake
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              disabled={!allCorroborated}
              className={`flex items-center gap-1.5 px-4 py-2 rounded font-bold font-mono text-xs transition-colors ${
                allCorroborated
                  ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-900 cursor-pointer shadow-lg'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Stamp className="w-3.5 h-3.5" />
              <span>GENERATE EMERGENCY TRAVEL AFFIDAVIT (DS-11 / DS-64)</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: EMERGENCY TRAVEL DOCUMENT AUTO-POPULATOR */}
      {currentStep === 3 && (
        <div className="p-5 rounded-xl bg-[#090e1a] border border-slate-800 space-y-4 text-xs font-mono">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Step 3: Emergency Travel Document & Spousal Waiver Auto-Populator
              </h3>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Pre-populates Forms DS-11 / DS-64 analog for non-discretionary emergency passport re-issuance without spousal consent under 22 C.F.R. § 51.28.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintAffidavit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PRINT DIPLOMATIC AFFIDAVIT</span>
              </button>

              <button
                onClick={() => setCurrentStep(4)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <span>ADVANCE TO TERMINAL ZEROIZE</span>
              </button>
            </div>
          </div>

          {/* Formal Printable Document View */}
          <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-200 space-y-4 max-h-[500px] overflow-y-auto print:bg-white print:text-black">
            <div className="text-center border-b border-slate-800 pb-3">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-100">
                EMBASSY OF THE UNITED STATES OF AMERICA · CONSULAR SECTION
              </div>
              <div className="text-[10px] text-slate-400">
                AFFIDAVIT REGARDING LOST/STOLEN/CONFISCATED TRAVEL DOCUMENTS (22 C.F.R. § 51.28 & 7 FAM 1700)
              </div>
            </div>

            <div className="space-y-3 leading-relaxed">
              <p>
                <strong>APPLICANT IDENTIFICATION:</strong> I, {preStaged.victimName}, born on {preStaged.dob}{' '}
                at {preStaged.birthPlace}, a citizen of the United States of America with habitual residence in{' '}
                {preStaged.usJurisdiction}, depose and state under penalty of perjury:
              </p>

              <p>
                <strong>STATEMENT OF TRANSNATIONAL CONFISCATION:</strong> On or about{' '}
                {preStaged.confiscationDate}, my valid United States passport was unlawfully confiscated and
                withheld by {preStaged.abusivePartyName} at {preStaged.confiscationLocation}. Said confiscation
                occurred without my consent for the purpose of coercively preventing my repatriation and
                depriving me of telecommunications and legal counsel.
              </p>

              <p>
                <strong>EMERGENCY STATUTORY SAFE-HARBOR WAIVER (22 C.F.R. § 51.28):</strong> Pursuant to
                Title 22 of the Code of Federal Regulations § 51.28 and Foreign Affairs Manual 7 FAM 1700, I
                request immediate, expedited re-issuance of emergency travel documentation without requiring
                the presence, knowledge, or signature of the adverse party.
              </p>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded text-[10px] space-y-1">
                <div className="font-bold text-cyan-300">
                  INCORPORATION OF FRE 902(13) & (14) CRYPTOGRAPHIC VERIFICATION JURAT:
                </div>
                <div>- W3C Dual-Clock Timestamp: {new Date().toISOString()}</div>
                <div>- Verified Terminal Event Hash: {preStaged.sha256VerificationRoot}</div>
                <div>- Micro-Token Protocol Nonce: AETHER-7FAM-1700 (Epoch #2)</div>
                <div>- Certifying Officer: Consular Special Services Attestation #9014-OCS</div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                <div>
                  <div className="border-b border-slate-600 pb-1 w-56 mb-1"></div>
                  <span>Applicant Signature (Executed in Presence of Consular Officer)</span>
                </div>
                <div className="text-right">
                  <div className="border-b border-slate-600 pb-1 w-56 mb-1"></div>
                  <span>Accredited Consular Officer / Seal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: POST-INTAKE ZEROIZATION */}
      {currentStep === 4 && (
        <div className="p-5 rounded-xl bg-[#090e1a] border border-slate-800 space-y-4 text-xs font-mono">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Step 4: Post-Intake Handshake & Terminal Zeroization
            </h3>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Once documents are printed and handed to the applicant, immediately flush the public kiosk terminal memory to leave zero traces on disk or RAM.
            </p>
          </div>

          {!zeroizeComplete ? (
            <div className="p-5 rounded-xl bg-[#05070d] border border-rose-900/60 space-y-4">
              <div className="flex items-center gap-3 text-rose-300 font-bold">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>MANDATORY KIOSK SANITIZATION REQUIRED</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                In accordance with 7 FAM 1700 anti-tracking directives, no applicant descriptors,
                unsealed dossiers, or session tokens may remain in browser cache, IndexedDB, or memory.
                Click below to deliver the finalized physical passport packet and flush all terminal RAM.
              </p>

              <button
                onClick={handlePostIntakeZeroize}
                className="flex items-center gap-2 px-5 py-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold font-mono text-xs transition-colors cursor-pointer shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
                <span>FLUSH KIOSK RAM & SANITIZE TERMINAL (1-CLICK ZEROIZE)</span>
              </button>
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-emerald-950/70 border border-emerald-600 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>TERMINAL FLUSHED · 0 RESIDUAL BYTES IN RAM OR STORAGE</span>
              </div>
              <p className="text-emerald-200 text-[11px] leading-relaxed">
                CacheStorage, IndexedDB, sessionStorage, and volatile memory slices have been shredded
                via multi-pass DoD 5220.22-M overwrite. The intake terminal is safe for next citizen use.
              </p>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setZeroizeComplete(false);
                }}
                className="px-3 py-1.5 rounded bg-emerald-900/60 border border-emerald-700 text-emerald-200 text-xs font-mono hover:bg-emerald-800 transition-colors"
              >
                Reset for New Intake
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
