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
  FileCode,
  Globe,
  BadgeAlert,
  Terminal,
  ExternalLink,
  Check,
  X,
} from 'lucide-react';

import { generateFRE902Affidavit } from '../../services/fre902Service.ts';
import { LedgerBlock } from '../../types/evidence.ts';
import {
  EvidenceCoreEventCert,
  JurisdictionProfile,
  JURISDICTION_PROFILES,
  DEFAULT_JURISDICTION_PROFILE_CODE,
} from '../../types/jurisdictionProfile.ts';
import {
  createEvidenceCoreEventCert,
  formatEvidenceCoreFilename,
  serializeToMarkdown,
  downloadArtifactFile,
} from '../../services/evidenceCoreAdapter.ts';

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

  // Evidence Core & Multi-Jurisdictional State
  const [caseId, setCaseId] = useState('CASE2026_SYNTH_0491');
  const [activeProfileCode, setActiveProfileCode] = useState<string>(DEFAULT_JURISDICTION_PROFILE_CODE);
  const [evidenceCoreCert, setEvidenceCoreCert] = useState<EvidenceCoreEventCert | null>(null);
  const [showEvidenceCoreModal, setShowEvidenceCoreModal] = useState(false);
  const [certModalTab, setCertModalTab] = useState<'json' | 'markdown' | 'intake'>('json');
  const [copiedArtifact, setCopiedArtifact] = useState(false);

  const activeProfile: JurisdictionProfile =
    JURISDICTION_PROFILES[activeProfileCode] || JURISDICTION_PROFILES[DEFAULT_JURISDICTION_PROFILE_CODE];

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

  // Generate an Evidence Core Event Certificate for a specific ledger event
  const handleExportEvidenceCore = async (event?: TamperEventEntry) => {
    const selectedEvent = event || events[events.length - 1];
    const eventType = selectedEvent ? selectedEvent.category : 'EMERGENCY_HANDOFF_INITIATED';
    const label = selectedEvent ? selectedEvent.title : 'Interstate Emergency Handoff Telemetry';
    const timestamp = selectedEvent ? selectedEvent.timestamp : Date.now();

    const cert = await createEvidenceCoreEventCert({
      caseId,
      eventType,
      label,
      profile: activeProfile,
      timestamp,
      version: 1,
    });

    setEvidenceCoreCert(cert);
    setShowEvidenceCoreModal(true);
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5 space-y-5">
      {/* Jurisdiction Profile Selector & Case ID Bar */}
      <div className="p-3.5 rounded-lg bg-[#090e1a] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">JURISDICTION PROFILE:</span>
          </div>

          <select
            value={activeProfileCode}
            onChange={(e) => setActiveProfileCode(e.target.value)}
            className="bg-[#05070d] border border-slate-700 rounded px-2.5 py-1 text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
          >
            {Object.values(JURISDICTION_PROFILES).map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>

          <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-semibold">
            PROTOCOL: {activeProfile.handoff_protocol}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">CASE ID:</span>
          <input
            type="text"
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            className="w-40 bg-[#05070d] border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-cyan-500 font-bold"
            placeholder="CASE2026_0491"
          />
        </div>
      </div>

      {/* Governing Statutes Summary Banner */}
      <div className="px-3 py-2 rounded bg-black/40 border border-slate-800/80 text-[11px] font-mono flex flex-wrap items-center justify-between gap-2 text-slate-400">
        <div>
          <span className="text-cyan-400 font-semibold">GOVERNING STATUTES: </span>
          <span>{activeProfile.relevant_statutes.join(' · ')}</span>
        </div>
        <span className="text-emerald-400 text-[10px]">● ZERO-RETENTION LOCAL MODE</span>
      </div>

      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800/80 gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
            <Binary className="w-4 h-4 text-cyan-400" />
            <span>Tamper-Evident Chain-of-Custody Event Ledger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Local SHA-256 cryptographic time-stamped timeline proving lockouts and handoffs without storing personal files.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleExportEvidenceCore()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-purple-300 bg-purple-950/60 border border-purple-800/80 hover:bg-purple-900 transition-colors cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Emit Evidence Core EventCert</span>
          </button>

          <button
            onClick={handleOpenCertificateModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/80 hover:bg-cyan-900 transition-colors cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>FRE 902 Certificate</span>
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Tamper Event</span>
          </button>
        </div>
      </div>

      {/* Add Event Form Modal / Inline */}
      {isAdding && (
        <div className="p-4 rounded-lg bg-[#090e1a] border border-cyan-800/70 text-xs font-mono">
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
        {events.map((evt) => (
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
                <button
                  onClick={() => handleExportEvidenceCore(evt)}
                  className="px-2 py-0.5 rounded bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 text-[10px] font-semibold transition-colors cursor-pointer"
                >
                  Evidence Core
                </button>
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

      {/* Evidence Core Export Modal */}
      {showEvidenceCoreModal && evidenceCoreCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-[#090e1a] border border-purple-700/80 rounded-xl p-5 text-xs font-mono shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-purple-400" />
                <span className="font-semibold text-slate-100 text-sm">
                  EVIDENCE CORE EVENT CERTIFICATE ARTIFACT
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                  STATUS: {evidenceCoreCert.approval.status.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setShowEvidenceCoreModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contract Filename & Metadata Pills */}
            <div className="p-3 mb-3 rounded bg-[#05070d] border border-slate-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-400">ARTIFACT FILENAME:</span>
                  <span className="text-cyan-300 font-bold select-all">
                    {formatEvidenceCoreFilename(evidenceCoreCert.case_id, evidenceCoreCert.utc_timestamp, evidenceCoreCert.version, 'json')}
                  </span>
                </div>
                <span className="text-emerald-400 text-[10px] font-bold">
                  personal_content_stored: false
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-800/80 text-slate-300">
                <div>
                  <span className="text-slate-500">PROVES: </span>
                  <span className="text-slate-200">{evidenceCoreCert.proves}</span>
                </div>
                <div>
                  <span className="text-slate-500">DOES NOT PROVE: </span>
                  <span className="text-slate-200">{evidenceCoreCert.does_not_prove}</span>
                </div>
              </div>
            </div>

            {/* Format Switcher Tabs */}
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800 text-[11px]">
              <button
                onClick={() => setCertModalTab('json')}
                className={`px-3 py-1 rounded transition-colors ${
                  certModalTab === 'json'
                    ? 'bg-purple-950 text-purple-300 font-bold border border-purple-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Evidence Core JSON
              </button>
              <button
                onClick={() => setCertModalTab('markdown')}
                className={`px-3 py-1 rounded transition-colors ${
                  certModalTab === 'markdown'
                    ? 'bg-purple-950 text-purple-300 font-bold border border-purple-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Markdown + YAML Front-Matter
              </button>
              <button
                onClick={() => setCertModalTab('intake')}
                className={`px-3 py-1 rounded transition-colors ${
                  certModalTab === 'intake'
                    ? 'bg-purple-950 text-purple-300 font-bold border border-purple-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Downstream Intake & GROUNDING.md
              </button>
            </div>

            {/* Content Display */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#05070d] rounded border border-slate-800 text-slate-300 leading-relaxed font-mono whitespace-pre-wrap select-all text-[11px]">
              {certModalTab === 'json' && JSON.stringify(evidenceCoreCert, null, 2)}
              {certModalTab === 'markdown' && serializeToMarkdown(evidenceCoreCert)}
              {certModalTab === 'intake' && (
                <div className="space-y-3 font-mono text-[11px] text-slate-300 select-text">
                  <div className="p-3 bg-black/60 rounded border border-purple-900/60 space-y-1">
                    <span className="text-purple-300 font-bold">1. DOWNSTREAM INTAKE VIA EVIDENCE CORE (PYTHON):</span>
                    <pre className="text-emerald-300 text-[10px] overflow-x-auto select-all">
{`from tools.evidence_core.evidence_core import EvidenceCore

core = EvidenceCore(case_dir="./cases/${evidenceCoreCert.case_id}")

# Intake the draft artifact exported from AETHER-0
artifact_path = core.intake("${formatEvidenceCoreFilename(evidenceCoreCert.case_id, evidenceCoreCert.utc_timestamp, evidenceCoreCert.version, 'json')}")`}
                    </pre>
                  </div>

                  <div className="p-3 bg-black/60 rounded border border-amber-900/60 space-y-1">
                    <span className="text-amber-300 font-bold">2. MANDATORY HUMAN APPROVAL GATE:</span>
                    <p className="text-[10px] text-slate-400">
                      Per GROUNDING.md, AETHER-0 emits artifacts as draft. A human must explicitly approve before any AI agent (Forensic Dossier, MindPal) may cite it:
                    </p>
                    <pre className="text-cyan-300 text-[10px] overflow-x-auto select-all">
{`core.set_approval("${formatEvidenceCoreFilename(evidenceCoreCert.case_id, evidenceCoreCert.utc_timestamp, evidenceCoreCert.version, 'json')}", "approved")`}
                    </pre>
                  </div>

                  <div className="p-3 bg-black/60 rounded border border-slate-800 space-y-1">
                    <span className="text-slate-300 font-bold">3. GROUNDING.md COMPLIANCE:</span>
                    <p className="text-[10px] text-slate-400">
                      Agents must mark any unapproved or ungrounded facts strictly as <strong className="text-rose-400">[UNREFERENCED]</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between pt-4 mt-3 border-t border-slate-800 gap-2">
              <span className="text-slate-400 text-[10px]">
                Contract compliant with tools/evidence-core/GROUNDING.md
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    const content =
                      certModalTab === 'markdown'
                        ? serializeToMarkdown(evidenceCoreCert)
                        : JSON.stringify(evidenceCoreCert, null, 2);
                    navigator.clipboard.writeText(content);
                    setCopiedArtifact(true);
                    setTimeout(() => setCopiedArtifact(false), 2500);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedArtifact ? 'COPIED TO CLIPBOARD' : 'COPY ARTIFACT'}</span>
                </button>

                <button
                  onClick={() => {
                    const filename = formatEvidenceCoreFilename(
                      evidenceCoreCert.case_id,
                      evidenceCoreCert.utc_timestamp,
                      evidenceCoreCert.version,
                      'json'
                    );
                    downloadArtifactFile(JSON.stringify(evidenceCoreCert, null, 2), filename, 'application/json');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-950 border border-purple-700 text-purple-200 hover:bg-purple-900 transition-colors cursor-pointer font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD .JSON</span>
                </button>

                <button
                  onClick={() => {
                    const filename = formatEvidenceCoreFilename(
                      evidenceCoreCert.case_id,
                      evidenceCoreCert.utc_timestamp,
                      evidenceCoreCert.version,
                      'md'
                    );
                    downloadArtifactFile(serializeToMarkdown(evidenceCoreCert), filename, 'text/markdown');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD .MD</span>
                </button>

                <button
                  onClick={() => setShowEvidenceCoreModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FRE 902 Affidavit Modal */}
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
