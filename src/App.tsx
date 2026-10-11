import React, { useState } from 'react';
import { RouterProvider, useRouterEngine } from './context/RouterContext.tsx';
import { Header } from './components/Header.tsx';
import { TopTelemetryRibbon } from './components/TopTelemetryRibbon.tsx';
import { NetworkTopologyCanvas } from './components/NetworkTopologyCanvas.tsx';
import { EphemeralMemoryPool } from './components/EphemeralMemoryPool.tsx';
import { TelemetryDispatcher } from './components/TelemetryDispatcher.tsx';
import { LiveHandoffFeed } from './components/LiveHandoffFeed.tsx';
import { ZeroRetentionAuditor } from './components/ZeroRetentionAuditor.tsx';
import { RouterPolicyPanel } from './components/RouterPolicyPanel.tsx';
import { SovereignArmorCommand } from './components/armor/SovereignArmorCommand.tsx';
import { SovereignSwordCommand } from './components/sword/SovereignSwordCommand.tsx';
import { GeminiLegalCopilot } from './components/sword/GeminiLegalCopilot.tsx';
import {
  ShieldCheck,
  Cpu,
  Radio,
  Sliders,
  Layers,
  Activity,
  HardDrive,
  Lock,
  Shield,
  Scale,
} from 'lucide-react';

const DashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('topology');
  const { stats, activeEnvelopes, bufferSlots } = useRouterEngine();

  const activeRamSlots = bufferSlots.filter((s) => s.state === 'ACTIVE_CIPHER').length;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      {/* Top Bar Contract (3 zones) */}
      <Header activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Top Telemetry Ribbon */}
      <TopTelemetryRibbon />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Metric Cards Banner */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-[#090e1c] border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-1">
              <span>Total Packets Routed</span>
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-slate-100 tabular-nums">
                {stats.totalPacketsRouted.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-emerald-400">100% FORWARDED</span>
            </div>
          </div>

          <div className="p-4 bg-[#090e1c] border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-1">
              <span>Volatile Buffer Slots</span>
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-cyan-400 tabular-nums">
                {activeRamSlots}
              </span>
              <span className="text-xs font-mono text-slate-500">/ 32 IN RAM</span>
            </div>
          </div>

          <div className="p-4 bg-[#090e1c] border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-1">
              <span>Zero-Retention Audit</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                100.0%
              </span>
              <span className="text-xs font-mono text-slate-400">0 DISK BYTES</span>
            </div>
          </div>

          <div className="p-4 bg-[#090e1c] border border-slate-800/80 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase mb-1">
              <span>Statutory Safe Harbors</span>
              <Scale className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold text-amber-300 tabular-nums">
                § 402-A
              </span>
              <span className="text-xs font-mono text-amber-400">ENACTABLE</span>
            </div>
          </div>
        </section>

        {/* Tab Navigation (Responsive Mobile & Desktop Segmented Bar) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#090e1a] rounded-lg border border-slate-800 overflow-x-auto">
          {[
            { id: 'topology', label: 'Router Mesh', icon: Layers },
            { id: 'armor', label: 'The Armor (Sovereign PWA)', icon: Shield },
            { id: 'sword', label: 'The Sword (Red-Team & Policy)', icon: Scale },
            { id: 'dispatcher', label: 'Telemetry Dispatcher', icon: Radio },
            { id: 'memory-pool', label: 'RAM Matrix', icon: Cpu },
            { id: 'handoff-feed', label: 'Live Handoffs', icon: Activity },
            { id: 'audit', label: 'Zero-Retention Audit', icon: ShieldCheck },
            { id: 'policy', label: 'Router Policy', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium font-mono whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#152033] text-cyan-300 shadow-sm border border-cyan-800/60 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e1626]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.id === 'handoff-feed' && activeEnvelopes.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-700 text-[10px]">
                    {activeEnvelopes.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab Panel Stage */}
        <section className="space-y-6">
          {activeTab === 'topology' && (
            <div className="space-y-6">
              <NetworkTopologyCanvas />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TelemetryDispatcher />
                <EphemeralMemoryPool />
              </div>
            </div>
          )}

          {activeTab === 'armor' && (
            <div className="space-y-6">
              <SovereignArmorCommand />
            </div>
          )}

          {activeTab === 'sword' && (
            <div className="space-y-6">
              <SovereignSwordCommand />
            </div>
          )}

          {activeTab === 'dispatcher' && (
            <div className="space-y-6">
              <TelemetryDispatcher />
              <LiveHandoffFeed />
            </div>
          )}

          {activeTab === 'memory-pool' && (
            <div className="space-y-6">
              <EphemeralMemoryPool />
              <ZeroRetentionAuditor />
            </div>
          )}

          {activeTab === 'handoff-feed' && (
            <div className="space-y-6">
              <LiveHandoffFeed />
              <NetworkTopologyCanvas />
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <ZeroRetentionAuditor />
              <EphemeralMemoryPool />
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="space-y-6">
              <RouterPolicyPanel />
              <ZeroRetentionAuditor />
            </div>
          )}
        </section>
      </main>

      {/* Quiet Domain-Compliant Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-[#05070d] py-6 px-6 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">AETHER-0 EMERGENCY ROUTER</span>
            <span>·</span>
            <span>ZERO-RETENTION ARCHITECTURE</span>
            <span>·</span>
            <span className="text-emerald-400">EPHEMERAL RAM PROTOCOL v2.4</span>
          </div>

          <div className="text-slate-400">
            <span>ISOLATED FROM PERSISTENT STORAGE · NO DISK STATE RETAINED</span>
          </div>
        </div>
      </footer>

      {/* Floating Gemini Legal Copilot & Voice Dictation Drawer */}
      <GeminiLegalCopilot />
    </div>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <DashboardContent />
    </RouterProvider>
  );
}
