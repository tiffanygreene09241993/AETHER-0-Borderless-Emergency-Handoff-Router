import React from 'react';
import { useRouterEngine } from '../context/RouterContext.tsx';
import { Activity, Radio, Play, Square, RadioTower, CheckCircle2, AlertOctagon } from 'lucide-react';

export const TopTelemetryRibbon: React.FC = () => {
  const {
    stats,
    nodes,
    isStreaming,
    toggleStreaming,
    broadcastEmergencyAlert,
    policy,
  } = useRouterEngine();

  const onlineNodesCount = nodes.filter((n) => n.status === 'online').length;
  const isHealthy = onlineNodesCount >= 5;

  return (
    <div className="border-b border-slate-800/80 bg-[#090d16] px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Left Status & Calibration Group */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isHealthy ? 'bg-emerald-400 ring-4 ring-emerald-500/20' : 'bg-amber-400 ring-4 ring-amber-500/20'
              }`}
            />
            <span className="font-mono text-slate-300 font-semibold tracking-wider">
              {isHealthy ? '● NOMINAL ROUTING' : '▲ COMPROMISED MESH'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-400 font-mono">
            <span>ISOLATION:</span>
            <span className="text-emerald-400 font-semibold">100.0% ZERO-RETENTION</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-slate-400 font-mono">
            <span>CIPHER:</span>
            <span className="text-cyan-300">AES-256-GCM / 96b-IV</span>
          </div>

          <div className="hidden xl:flex items-center gap-2 text-slate-400 font-mono">
            <span>RAM DWELL:</span>
            <span className="text-slate-200 tabular-nums">{policy.ephemeralTtlMs}ms</span>
          </div>
        </div>

        {/* Right Stream Controls & Broadcast Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleStreaming}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
              isStreaming
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white'
            }`}
          >
            {isStreaming ? (
              <>
                <Square className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
                <span>HALT STREAM</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                <span>STREAM TELEMETRY</span>
              </>
            )}
          </button>

          <button
            onClick={broadcastEmergencyAlert}
            className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 hover:bg-cyan-900 hover:text-white transition-colors"
          >
            <RadioTower className="w-3.5 h-3.5 text-cyan-400" />
            <span>FANOUT BROADCAST</span>
          </button>
        </div>
      </div>
    </div>
  );
};
