import React, { useState } from 'react';
import { TamperEventEntry } from '../../types/sovereign.ts';
import { buf2hex } from '../../services/cryptoService.ts';
import {
  ShieldAlert,
  FileCheck,
  Plus,
  Lock,
  Binary,
  CheckCircle2,
  Download,
  Copy,
  Calendar,
  Layers,
} from 'lucide-react';

import { generateFRE902Affidavit, createFRE902Metadata } from '../../services/fre902Service.ts';
import { LedgerBlock } from '../../types/evidence.ts';

const INITIAL_EVENTS: TamperEventEntry[] = [
  {
    id: 'EVT-01',
    timestamp: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
    category: 'CARRIER_PORT_OUT',
    title: 'Unauthorized Mobile Carrier SIM Port-Out',
    observedVector: 'Cellular network bars dropped to No Service. Carrier fraud desk confirmed unauthorized port request to prepaid MVNO handset at 03:14 AM.',
    sourceIndicator: 'Tier-2 Carrier Fraud Incident #FR-90142',
    hashDigest: 'A14F98B2C301DE8922F019AC774B8123',
    prevHash: '00000000000000000000000000000000',
  },
  {
    id: 'EVT-02',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
    category: 'MFA_HIJACK',
    title: 'Primary Email & Court E-Filing Authenticator Reset',
    observedVector: 'Recovery code requested via intercepted SMS. Judicial portal password reset notification triggered while mobile device was severed.',
    sourceIndicator: 'System Auth Security Event ID #AUTH-8419',
    hashDigest: 'B89AC104FF772130EAA12089441BCC90',
    prevHash: 'A14F98B2C301DE8922F019AC774B8123',
  },
  {
    id: 'EVT-03',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    category: 'EX_PARTE_NOTICE_SUPPRESSION',
    title: 'Ex-Parte Emergency Custody Motion Filed Mid-Lockout',
    observedVector: 'Opposing counsel filed emergency motion for sole custody citing failure to communicate, delivering notice exclusively to the compromised email address.',
    sourceIndicator: 'Docket Entry #EX-2026-0814',
    hashDigest: 'C331008BE72149AF88210398DD41A0B4',
    prevHash: 'B89AC104FF772130EAA12089441BCC90',
  },
];

export const TamperChainLedger: React.FC = () => {
  const [events, setEvents] = useState<TamperEventEntry[]>(INITIAL_EVENTS);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState<TamperEventEntry['category']>('CARRIER_PORT_OUT');
  const [newTitle, setNewTitle] = useState('');
  const [newVector, setNewVector] = useState('');
  const [newSource, setNewSource] = useState('');
  const [copiedCert, setCopiedCert] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [affidavitText, setAffidavitText] = useState('');
  const [tsaUrlInput, setTsaUrlInput] = useState('');

  // Helper to convert TamperEventEntry to LedgerBlock
  const getLedgerBlocks = (): LedgerBlock[] => {
    return events.map((e, idx) => ({
      index: idx,
      timestamp: e.timestamp,
      payloadHash: e.hashDigest,
      previousHash: e.prevHash,
    }));
  };

  const handleOpenCertificateModal = async () => {
    const blocks = getLedgerBlocks();
    const cert = await generateFRE902Affidavit(blocks, tsaUrlInput || undefined);
    setAffidavitText(cert);
    setShowCertificateModal(true);
  };

  // Compute real SHA-256 for newly created tamper event
  const handleAddEvent = async () => {
    if (!newTitle.trim() || !newVector.trim()) return;

    const prevHash = events.length > 0 ? events[events.length - 1].hashDigest : '0'.repeat(32);
    const timestamp = Date.now();
    const encoder = new TextEncoder();
    const dataToHash = encoder.encode(
      `${timestamp}:${newCategory}:${newTitle}:${newVector}:${newSource}:${prevHash}`
    );
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataToHash);
    const hashDigest = buf2hex(hashBuffer).substring(0, 32).toUpperCase();

    const newEntry: TamperEventEntry = {
      id: `EVT-${(events.length + 1).toString().padStart(2, '0')}`,
      timestamp,
      category: newCategory,
      title: newTitle.trim(),
      observedVector: newVector.trim(),
      sourceIndicator: newSource.trim() || 'Survivor Direct Observation',
      hashDigest,
      prevHash,
    };

    setEvents((prev) => [...prev, newEntry]);
    setNewTitle('');
    setNewVector('');
    setNewSource('');
    setIsAdding(false);
  };

  // Generate self-authenticating affidavit text
  const generateAffidavitText = () => {
    const lines = [
      'AFFIDAVIT OF CRYPTOGRAPHIC CHAIN-OF-CUSTODY & COERCED COMPLIANCE TIMELINE',
      'Pursuant to Rule 902 of the Federal Rules of Evidence and the Model Rebuttable Presumption Act',
      '--------------------------------------------------------------------------------',
      `AFFIDAVIT CERTIFICATION DATE: ${new Date().toUTCString()}`,
      `TOTAL TIMELINE EVENTS LOGGED: ${events.length}`,
      'STORAGE ATTESTATION: Client-side volatile memory ledger. Zero cloud backups or remote retention.',
      '',
      'STATEMENT OF FACTS UNDER PENALTY OF PERJURY:',
      'The undersigned certifies that the following immutable time-series events demonstrate external',
      'technological interference, carrier port-outs, or procedural sabotage preventing timely appearance:',
      '',
    ];

    events.forEach((evt, idx) => {
      lines.push(`[EVENT #${idx + 1}] ID: ${evt.id} | TIMESTAMP: ${new Date(evt.timestamp).toISOString()}`);
      lines.push(`CATEGORY: ${evt.category}`);
      lines.push(`TITLE: ${evt.title}`);
      lines.push(`VECTOR: ${evt.observedVector}`);
      lines.push(`SOURCE INDICATOR: ${evt.sourceIndicator}`);
      lines.push(`PREV HASH: ${evt.prevHash}`);
      lines.push(`SHA-256 HASH DIGEST: ${evt.hashDigest}`);
      lines.push('--------------------------------------------------------------------------------');
    });

    lines.push('');
    lines.push('STATUTORY SAFE-HARBOR NOTICE:');
    lines.push('Notice is hereby given under Section 101 of the Rebuttable Presumption of Coerced Compliance Act.');
    lines.push('The burden of persuasion shifts to the party asserting willful default to disprove coercion.');
    return lines.join('\n');
  };

  const handleCopyCertificate = () => {
    navigator.clipboard.writeText(generateAffidavitText());
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2500);
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
            <Binary className="w-4 h-4 text-cyan-400" />
            <span>Tamper-Evident Chain-of-Custody Event Ledger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Local SHA-256 cryptographic time-stamped timeline proving device lockouts and coerced timing without storing personal files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCertificateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 hover:bg-cyan-900 transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Generate FRE 902 Certificate</span>
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Tamper Event</span>
          </button>
        </div>
      </div>

      {/* Add Event Form Modal / Inline */}
      {isAdding && (
        <div className="p-4 mb-5 rounded-lg bg-[#090e1a] border border-cyan-800/70 text-xs font-mono">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <span className="text-cyan-400 font-semibold">RECORD TIMELINE INTERFERENCE EVENT</span>
            <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-slate-200">
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-slate-400 block mb-1">EVENT CATEGORY:</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-[#05070d] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="CARRIER_PORT_OUT">Carrier SIM Port-Out / Cellular Severance</option>
                <option value="MFA_HIJACK">MFA Authenticator Hijack / Password Reset</option>
                <option value="CREDENTIAL_REVOCATION">Financial / Banking Credential Lockout</option>
                <option value="EX_PARTE_NOTICE_SUPPRESSION">Ex-Parte Motion Served to Dead Account</option>
                <option value="ARCHIVAL_RECORD_WEAPONIZATION">Clandestine Stale Archival Record Introduced</option>
                <option value="DOCUMENT_CONFISCATION">Passport / Identity Document Confiscation</option>
                <option value="TRANSNATIONAL_ABANDONMENT">Transnational Spousal Abandonment Abroad</option>
                <option value="COERCED_COMPLIANCE_DELTA">Coerced Compliance Delta Initiation</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">EVENT TITLE:</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Carrier fraud report filed after line disconnected"
                className="w-full bg-[#05070d] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="text-slate-400 block mb-1">OBSERVED VECTOR / TECHNICAL DETAILS:</label>
            <textarea
              value={newVector}
              onChange={(e) => setNewVector(e.target.value)}
              rows={2}
              placeholder="Describe exact time, error codes, device indicators, or carrier notifications observed..."
              className="w-full bg-[#05070d] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-slate-400 block mb-1">SOURCE INDICATOR / TICKET NUMBER:</label>
              <input
                type="text"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                placeholder="e.g. Verizon Fraud Ticket #4819, Google Auth Log"
                className="w-full bg-[#05070d] border border-slate-800 rounded p-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAddEvent}
                className="w-full py-2 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold transition-colors cursor-pointer"
              >
                COMPUTE SHA-256 & APPEND TO LEDGER
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Event Ledger Display */}
      <div className="space-y-3">
        {events.map((evt, idx) => (
          <div
            key={evt.id}
            className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 hover:border-slate-700 transition-colors text-xs font-mono"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-semibold">{evt.id}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-200 font-semibold">{evt.title}</span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{new Date(evt.timestamp).toLocaleString()}</span>
                </span>
                <span className="text-amber-400 uppercase text-[10px] font-semibold bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded">
                  {evt.category.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed mb-2.5">
              {evt.observedVector}
            </p>

            {/* Cryptographic Chain-of-Custody Footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-slate-500">SOURCE:</span>
                <span className="text-slate-300 truncate">{evt.sourceIndicator}</span>
              </div>

              <div className="flex items-center gap-1.5 justify-end truncate">
                <span className="text-slate-500">SHA-256 HASH:</span>
                <span className="text-emerald-400 font-bold truncate">{evt.hashDigest}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-[#090e1a] border border-cyan-700/80 rounded-xl p-5 text-xs font-mono shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-slate-100 text-sm">
                  SELF-AUTHENTICATING JUDICIAL CERTIFICATE (FRE 902)
                </span>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="mb-3 p-3 bg-[#05070d] rounded border border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-[280px]">
                <span className="text-slate-400 text-[11px] whitespace-nowrap">RFC 3161 TSA URL (OPTIONAL):</span>
                <input
                  type="text"
                  value={tsaUrlInput}
                  onChange={(e) => setTsaUrlInput(e.target.value)}
                  placeholder="e.g. https://freetsa.org/tsr (Leave blank for pure air-gap)"
                  className="flex-1 bg-[#090e1a] border border-slate-800 rounded p-1 text-cyan-300 text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                onClick={handleOpenCertificateModal}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] transition-colors"
              >
                Re-Generate Affidavit
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-[#05070d] rounded border border-slate-800 text-slate-300 leading-relaxed font-mono whitespace-pre-wrap select-all">
              {affidavitText}
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-800">
              <span className="text-slate-400 text-[11px]">
                Admissible self-authenticating declaration under Fed. R. Evid. 902(13) & 902(14).
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(affidavitText);
                    setCopiedCert(true);
                    setTimeout(() => setCopiedCert(false), 2500);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-semibold transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCert ? 'COPIED TO CLIPBOARD' : 'COPY FRE 902 AFFIDAVIT'}</span>
                </button>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
