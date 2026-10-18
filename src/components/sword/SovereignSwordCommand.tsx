import React, { useState } from 'react';
import { InstitutionalRedTeaming } from './InstitutionalRedTeaming.tsx';
import { ModelStatutoryDrafter } from './ModelStatutoryDrafter.tsx';
import { OversightHearingBuilder } from './OversightHearingBuilder.tsx';
import { EcfPleadingPopulator } from './EcfPleadingPopulator.tsx';
import { JurisdictionalUccjeaMap } from './JurisdictionalUccjeaMap.tsx';
import {
  Scale,
  ShieldAlert,
  FileText,
  Mic,
  Award,
  BookOpen,
  FolderPlus,
  Compass,
} from 'lucide-react';

export const SovereignSwordCommand: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'jurisdictional-map' | 'red-teaming' | 'statutes' | 'hearings' | 'pleadings'>('jurisdictional-map');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-[#0e121d] border border-amber-800/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-950/80 border border-amber-700/80 text-amber-400">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-100 font-mono tracking-wide">
                THE STRUCTURAL SWORD · INSTITUTIONAL RED-TEAMING & STATUTORY SUITE
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-semibold">
                ● MANDATORY SAFE HARBORS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified statutory defense suite: Enacted interstate safe harbors, procedural due process firewalls, and formal court pleadings.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>STATUTORY FRAMEWORK: </span>
          <span className="text-cyan-300 font-bold">UCCJEA · PKPA · 42 U.S.C. § 1983</span>
        </div>
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-mono">
        <button
          onClick={() => setActiveSubTab('jurisdictional-map')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'jurisdictional-map'
              ? 'bg-[#152033] text-cyan-300 font-bold border border-cyan-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>UCCJEA Jurisdictional Map</span>
        </button>

        <button
          onClick={() => setActiveSubTab('red-teaming')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'red-teaming'
              ? 'bg-[#152033] text-amber-300 font-semibold border border-amber-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Institutional Red-Teaming</span>
        </button>

        <button
          onClick={() => setActiveSubTab('statutes')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'statutes'
              ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Enacted Statutory Authorities</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pleadings')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'pleadings'
              ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>ECF Pleading Populator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hearings')}
          className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
            activeSubTab === 'hearings'
              ? 'bg-[#152033] text-cyan-300 font-semibold border border-cyan-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Congressional Hearing Kits</span>
        </button>
      </div>

      {/* Active Tab Panel */}
      <div className="space-y-6">
        {activeSubTab === 'jurisdictional-map' && (
          <JurisdictionalUccjeaMap
            onSelectPleadingPreset={() => {
              setActiveSubTab('pleadings');
            }}
          />
        )}
        {activeSubTab === 'red-teaming' && <InstitutionalRedTeaming />}
        {activeSubTab === 'statutes' && <ModelStatutoryDrafter />}
        {activeSubTab === 'pleadings' && <EcfPleadingPopulator />}
        {activeSubTab === 'hearings' && <OversightHearingBuilder />}
      </div>
    </div>
  );
};
