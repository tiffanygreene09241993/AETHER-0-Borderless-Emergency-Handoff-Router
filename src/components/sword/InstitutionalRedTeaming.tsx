import React, { useState } from 'react';
import { INSTITUTIONAL_EXPLOIT_MODELS } from '../../data/institutionalExploits.ts';
import { InstitutionalTargetDomain, InstitutionalVulnerabilityModel } from '../../types/sovereign.ts';
import {
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  Building2,
  GraduationCap,
  Globe,
  FileCheck,
  CheckCircle,
  Copy,
} from 'lucide-react';

export const InstitutionalRedTeaming: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<InstitutionalTargetDomain>('family-court');
  const [selectedModelId, setSelectedModelId] = useState<string>('FAMILY_COURT_EX_PARTE_TRAP');
  const [copiedAudit, setCopiedAudit] = useState(false);

  const filteredModels = INSTITUTIONAL_EXPLOIT_MODELS.filter((m) => m.domain === selectedDomain);
  const activeModel =
    INSTITUTIONAL_EXPLOIT_MODELS.find((m) => m.id === selectedModelId) || filteredModels[0];

  const handleSelectDomain = (domain: InstitutionalTargetDomain) => {
    setSelectedDomain(domain);
    const first = INSTITUTIONAL_EXPLOIT_MODELS.find((m) => m.domain === domain);
    if (first) setSelectedModelId(first.id);
  };

  const generateAuditReportText = () => {
    const lines = [
      `INSTITUTIONAL RED-TEAM AUDIT REPORT: ${activeModel.title.toUpperCase()}`,
      `TARGET SUBSYSTEM: ${activeModel.subsystem}`,
      `SYSTEMIC SEVERITY: ${activeModel.severityLevel}`,
      '--------------------------------------------------------------------------------',
      'EXPLOIT SUMMARY & COMPLIANCE FAILURE:',
      activeModel.exploitSummary,
      '',
      'VICTIM-CRIMINALIZATION VECTOR:',
      activeModel.victimCriminalizationVector,
      '',
      'ALGORITHMIC ATTACK TREE & CHAIN-OF-EXPLOITATION:',
    ];

    activeModel.attackTree.forEach((step) => {
      lines.push(`STEP ${step.stepNumber} [${step.actor}]: ${step.action}`);
      lines.push(`  -> INSTITUTIONAL VULNERABILITY: ${step.institutionalVulnerability}`);
      lines.push(`  -> STATUTORY FAILURE POINT: ${step.statutoryFailurePoint}`);
    });

    lines.push('');
    lines.push('SYSTEMIC REMEDIAL RECOMMENDATION:');
    lines.push(activeModel.auditRecommendation);
    lines.push('');
    lines.push('MANDATORY STATUTORY SAFE HARBOR:');
    lines.push(activeModel.remedialStatutoryClause);
    return lines.join('\n');
  };

  const handleCopyAudit = () => {
    navigator.clipboard.writeText(generateAuditReportText());
    setCopiedAudit(true);
    setTimeout(() => setCopiedAudit(false), 2500);
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Institutional Red-Teaming & Algorithmic Failure Engine</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Exposing how automated administrative policies in courts, universities, and consulates act as involuntary proxies for abusers.
          </p>
        </div>

        <button
          onClick={handleCopyAudit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-amber-300 bg-amber-950/60 border border-amber-800/80 hover:bg-amber-900 transition-colors"
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>{copiedAudit ? 'COPIED TO CLIPBOARD' : 'EXPORT RED-TEAM AUDIT'}</span>
        </button>
      </div>

      {/* Target Institutional Domain Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => handleSelectDomain('family-court')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            selectedDomain === 'family-court'
              ? 'bg-amber-950/80 text-amber-300 border border-amber-700 font-semibold'
              : 'bg-[#090e1a] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Family Courts & Archival Dockets</span>
        </button>

        <button
          onClick={() => handleSelectDomain('university-board')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            selectedDomain === 'university-board'
              ? 'bg-amber-950/80 text-amber-300 border border-amber-700 font-semibold'
              : 'bg-[#090e1a] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>University Title IX & Visa Boards</span>
        </button>

        <button
          onClick={() => handleSelectDomain('consular-immigration')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            selectedDomain === 'consular-immigration'
              ? 'bg-amber-950/80 text-amber-300 border border-amber-700 font-semibold'
              : 'bg-[#090e1a] text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Consular & Transnational Visas</span>
        </button>
      </div>

      {/* Specific Exploit Model Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {filteredModels.map((model) => {
          const isSelected = activeModel.id === model.id;
          return (
            <button
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              className={`p-3 rounded-lg border text-left transition-colors text-xs font-mono ${
                isSelected
                  ? 'bg-[#0e1626] border-amber-500/80 text-slate-100'
                  : 'bg-[#090e1a] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-amber-400 font-semibold truncate">{model.title}</span>
                <span className="text-[10px] text-rose-400 font-bold ml-2">
                  {model.severityLevel.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {model.exploitSummary}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Attack Tree Walkthrough */}
      <div className="p-4 rounded-lg bg-[#090e1a] border border-slate-800 text-xs font-mono mb-5">
        <div className="flex flex-wrap items-center justify-between pb-2 mb-3 border-b border-slate-800 gap-2">
          <div>
            <span className="text-amber-400 font-bold text-sm block">
              {activeModel.title}
            </span>
            <span className="text-slate-400 text-[11px]">
              SUBSYSTEM: {activeModel.subsystem}
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-semibold">
            {activeModel.severityLevel}
          </span>
        </div>

        {/* Victim Criminalization Highlight */}
        <div className="p-3 rounded bg-[#0f0c18] border border-rose-900/60 mb-4 text-[11px] text-rose-200">
          <strong className="text-rose-400 block mb-1">HOW THE VICTIM IS CRIMINALIZED BY THE SYSTEM:</strong>
          {activeModel.victimCriminalizationVector}
        </div>

        {/* Step-by-Step Attack Tree */}
        <div className="space-y-3 mb-4">
          <span className="text-slate-400 uppercase text-[11px] font-semibold block">
            Algorithmic Chain of Inversion (Attack Tree Steps):
          </span>

          {activeModel.attackTree.map((step) => {
            const actorColor =
              step.actor === 'ABUSER'
                ? 'text-rose-400 bg-rose-950/60 border-rose-800'
                : step.actor === 'AUTOMATED_ALGORITHM'
                ? 'text-amber-400 bg-amber-950/60 border-amber-800'
                : step.actor === 'AGENCY_CLERK'
                ? 'text-purple-400 bg-purple-950/60 border-purple-800'
                : 'text-cyan-400 bg-cyan-950/60 border-cyan-800';

            return (
              <div
                key={step.stepNumber}
                className="p-3 rounded bg-[#05070d] border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-bold text-slate-200">STEP {step.stepNumber}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${actorColor}`}>
                    {step.actor}
                  </span>
                  <span className="text-slate-300 font-semibold flex-1 truncate">{step.action}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pl-4 border-l border-slate-800 mt-2">
                  <div>
                    <span className="text-slate-500 block text-[10px]">INSTITUTIONAL FLAW:</span>
                    <span className="text-amber-300/90">{step.institutionalVulnerability}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">STATUTORY VOID:</span>
                    <span className="text-rose-300/90">{step.statutoryFailurePoint}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Remedial Statutory Bridge */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px]">
          <div>
            <span className="text-slate-500 block text-[10px]">REMEDIAL STATUTORY SAFE HARBOR:</span>
            <span className="text-emerald-400 font-bold">{activeModel.remedialStatutoryClause}</span>
          </div>

          <div className="text-slate-400">
            {activeModel.auditRecommendation}
          </div>
        </div>
      </div>
    </div>
  );
};
