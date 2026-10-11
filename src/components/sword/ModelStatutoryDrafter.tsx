import React, { useState } from 'react';
import { MODEL_STATUTORY_BILLS } from '../../data/statutorySafeHarbors.ts';
import { ModelStatutoryBill, StatutoryClause } from '../../types/sovereign.ts';
import {
  FileText,
  CheckSquare,
  Square,
  Copy,
  Download,
  Scale,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const ModelStatutoryDrafter: React.FC = () => {
  const [selectedBillId, setSelectedBillId] = useState<string>('REBUTTABLE_PRESUMPTION_ACT');
  const [bills, setBills] = useState<ModelStatutoryBill[]>(MODEL_STATUTORY_BILLS);
  const [copiedText, setCopiedText] = useState(false);

  const activeBill = bills.find((b) => b.id === selectedBillId) || bills[0];

  const toggleClause = (clauseId: string) => {
    setBills((prev) =>
      prev.map((b) => {
        if (b.id !== activeBill.id) return b;
        return {
          ...b,
          clauses: b.clauses.map((c) =>
            c.id === clauseId && !c.isMandatoryCore ? { ...c, isActive: !c.isActive } : c
          ),
        };
      })
    );
  };

  // Build full formal statutory text
  const compileBillText = () => {
    const lines = [
      activeBill.billNumber,
      activeBill.formalTitle.toUpperCase(),
      '================================================================================',
      'Be it enacted by the Legislature:',
      '',
      'SECTION 1. LEGISLATIVE FINDINGS AND PURPOSE.',
      ...activeBill.legislativeFindings.map((f, i) => `  (${String.fromCharCode(97 + i)}) ${f}`),
      '',
      'SECTION 2. STATUTORY DEFINITIONS.',
      'For the purposes of this Act, the following definitions shall apply:',
      ...activeBill.statutoryDefinitions.map(
        (d, i) => `  (${i + 1}) "${d.term}" means: ${d.definition}`
      ),
      '',
      'SECTION 3. SUBSTANTIVE STATUTORY PROTECTIONS & MANDATORY SAFE HARBORS.',
    ];

    activeBill.clauses
      .filter((c) => c.isActive)
      .forEach((c) => {
        lines.push('');
        lines.push(c.sectionCode);
        lines.push(`[${c.title}]`);
        lines.push(c.text);
      });

    lines.push('');
    lines.push('SECTION 4. WAIVER OF SOVEREIGN IMMUNITY.');
    lines.push(activeBill.sovereignImmunityWaiver);
    lines.push('');
    lines.push('SECTION 5. DIRECT CIVIL CAUSE OF ACTION & AGENCY LIABILITY.');
    lines.push(activeBill.civilLiabilitySection);
    lines.push('');
    lines.push('SECTION 6. SEVERABILITY AND IMMEDIATE EFFECT.');
    lines.push('If any provision of this Act or its application is held invalid, the remainder of the Act shall remain in full force and effect. This Act shall take effect immediately upon enactment.');

    return lines.join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(compileBillText());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Model Statutory Safe-Harbor Drafter & Bill Compiler</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Model statutory text establishing mandatory burden-shifting presumptions, archival due process firewalls, and agency civil liability.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>{copiedText ? 'COPIED BILL TO CLIPBOARD' : 'COPY FULL STATUTORY TEXT'}</span>
        </button>
      </div>

      {/* Bill Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {bills.map((bill) => {
          const isSelected = bill.id === activeBill.id;
          return (
            <button
              key={bill.id}
              onClick={() => setSelectedBillId(bill.id)}
              className={`p-3 rounded-lg border text-left transition-colors text-xs font-mono ${
                isSelected
                  ? 'bg-[#0f172a] border-cyan-400 text-slate-100 shadow-md'
                  : 'bg-[#090e1a] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] text-cyan-400 font-bold mb-1">
                {bill.billNumber} · {bill.targetJurisdiction.replace(/_/g, ' ')}
              </div>
              <div className="font-semibold text-slate-200 line-clamp-1 mb-1">
                {bill.shortTitle}
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                {bill.formalTitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Drafting Workspace: Left Clauses, Right Live Bill Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Clause Customization Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-mono uppercase text-slate-400 block font-semibold">
            Configurable Statutory Provisions:
          </span>

          {activeBill.clauses.map((clause) => (
            <div
              key={clause.id}
              onClick={() => toggleClause(clause.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors text-xs font-mono ${
                clause.isActive
                  ? 'bg-[#091222] border-cyan-800/80 text-slate-200'
                  : 'bg-[#070b14] border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  {clause.isActive ? (
                    <CheckSquare className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-200">{clause.sectionCode}</span>
                    {clause.isMandatoryCore && (
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded uppercase">
                        Core Provision
                      </span>
                    )}
                  </div>
                  <div className="font-semibold text-cyan-300 text-[11px] mb-1">
                    {clause.title}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {clause.legalObjective}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Immunity & Liability Badges */}
          <div className="p-3 rounded-lg bg-[#0d1220] border border-slate-800 text-xs font-mono space-y-2">
            <div>
              <span className="text-amber-400 font-semibold text-[11px] block">
                IMMUNITY WAIVER PROVISION:
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {activeBill.sovereignImmunityWaiver}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-rose-400 font-semibold text-[11px] block">
                DIRECT AGENCY CIVIL LIABILITY:
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {activeBill.civilLiabilitySection}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Compiled Formal Statutory Text (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 text-xs font-mono text-slate-400">
            <span>COMPILED LEGISLATIVE DRAFT:</span>
            <span className="text-emerald-400">READY FOR INTRODUCTORY SPONSORSHIP</span>
          </div>

          <div className="flex-1 p-4 bg-[#05070d] rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 leading-relaxed overflow-y-auto max-h-[580px] whitespace-pre-wrap select-all">
            {compileBillText()}
          </div>
        </div>
      </div>
    </div>
  );
};
