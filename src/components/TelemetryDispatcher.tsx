import React, { useState } from 'react';
import { useRouterEngine } from '../context/RouterContext.tsx';
import { TELEMETRY_PRESETS, TelemetryPreset } from '../data/telemetryPresets.ts';
import { TelemetryClassification } from '../types/router.ts';
import {
  Send,
  Lock,
  Radio,
  AlertTriangle,
  FileCode,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const TelemetryDispatcher: React.FC = () => {
  const {
    nodes,
    dispatchTelemetry,
    policy,
    updatePolicy,
  } = useRouterEngine();

  const [selectedPresetId, setSelectedPresetId] = useState<TelemetryClassification>('MASS-CASUALTY');
  const [sourceNodeId, setSourceNodeId] = useState<string>('UAV-PERIMETER-SWARM');
  const [targetNodeId, setTargetNodeId] = useState<string>('HOSPITAL-TRAUMA-CENTER');
  const [priority, setPriority] = useState<'EMERGENCY_CRITICAL' | 'HIGH_ALERT' | 'ROUTINE_METRIC'>('EMERGENCY_CRITICAL');
  const [customPayloadText, setCustomPayloadText] = useState<string>(() => {
    const p = TELEMETRY_PRESETS[0];
    return JSON.stringify(p.defaultPayload, null, 2);
  });
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);

  // Handle Preset Selection
  const handleSelectPreset = (preset: TelemetryPreset) => {
    setSelectedPresetId(preset.id);
    setSourceNodeId(preset.sourceNodeId);
    setTargetNodeId(preset.targetNodeId);
    setPriority(preset.priority);
    setCustomPayloadText(JSON.stringify(preset.defaultPayload, null, 2));
    setJsonError(null);
  };

  // Dispatch Action
  const handleDispatch = async () => {
    try {
      const parsed = JSON.parse(customPayloadText);
      setJsonError(null);

      const envelopeId = await dispatchTelemetry({
        sourceNodeId,
        targetNodeId,
        classification: selectedPresetId,
        priority,
        payload: parsed,
        simulateTamper: policy.tamperSimulationActive,
      });

      if (envelopeId) {
        setDispatchSuccessMsg(`DISPATCHED ENVELOPE ${envelopeId} VIA EPHEMERAL ROUTE`);
        setTimeout(() => setDispatchSuccessMsg(null), 3000);
      } else {
        setJsonError('Routing error: No online path exists between source and target nodes.');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setJsonError(`JSON Syntax Error: ${err.message}`);
      } else {
        setJsonError('Invalid JSON payload');
      }
    }
  };

  const onlineNodes = nodes.filter((n) => n.status === 'online');

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Encrypted Telemetry Dispatcher & Ingress Gateway</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Construct authenticated AES-256-GCM telemetry payloads for instantaneous volatile border transit.
          </p>
        </div>

        {/* Tamper Simulation Toggle */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-slate-300">
            <input
              type="checkbox"
              checked={policy.tamperSimulationActive}
              onChange={(e) => updatePolicy({ tamperSimulationActive: e.target.checked })}
              className="rounded border-slate-700 bg-slate-900 text-rose-500 focus:ring-rose-500"
            />
            <span className={policy.tamperSimulationActive ? 'text-rose-400 font-semibold' : 'text-slate-400'}>
              Tamper Ingress Envelope (Test Adversary Detection)
            </span>
          </label>
        </div>
      </div>

      {/* Preset Selector Bar */}
      <div className="mb-5">
        <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
          Emergency Telemetry Presets:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {TELEMETRY_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 text-slate-100'
                    : 'border-slate-800 bg-[#090e1a] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="text-[11px] font-mono font-semibold truncate mb-1">
                  {preset.label}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Node Routing Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
            Ingress Source Node:
          </label>
          <select
            value={sourceNodeId}
            onChange={(e) => setSourceNodeId(e.target.value)}
            className="w-full bg-[#090e1a] border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id} disabled={node.status !== 'online'}>
                {node.callsign} — {node.name} ({node.protocol}) {node.status !== 'online' ? `[${node.status.toUpperCase()}]` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
            Egress Destination Node:
          </label>
          <select
            value={targetNodeId}
            onChange={(e) => setTargetNodeId(e.target.value)}
            className="w-full bg-[#090e1a] border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {nodes.map((node) => (
              <option key={node.id} value={node.id} disabled={node.status !== 'online'}>
                {node.callsign} — {node.name} ({node.protocol}) {node.status !== 'online' ? `[${node.status.toUpperCase()}]` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
            Emergency Priority Level:
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="w-full bg-[#090e1a] border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="EMERGENCY_CRITICAL">EMERGENCY CRITICAL (P0 - IMMEDIATE)</option>
            <option value="HIGH_ALERT">HIGH ALERT (P1 - RAPID TRANSIT)</option>
            <option value="ROUTINE_METRIC">ROUTINE METRIC (P2 - EXPEDITED)</option>
          </select>
        </div>
      </div>

      {/* JSON Payload Editor */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telemetry Payload Schema (JSON):</span>
          </label>
          <span className="text-[11px] font-mono text-slate-500">
            {customPayloadText.length} bytes
          </span>
        </div>

        <textarea
          value={customPayloadText}
          onChange={(e) => {
            setCustomPayloadText(e.target.value);
            setJsonError(null);
          }}
          rows={6}
          className="w-full bg-[#05070d] border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 leading-relaxed resize-y"
          spellCheck={false}
        />

        {jsonError && (
          <div className="mt-2 text-xs font-mono text-rose-400 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{jsonError}</span>
          </div>
        )}

        {dispatchSuccessMsg && (
          <div className="mt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{dispatchSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Dispatch Action Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
          <span>CIPHER: <strong className="text-slate-200">AES-256-GCM</strong></span>
          <span>KEY RETENTION: <strong className="text-emerald-400">VOLATILE ONLY (EPHEMERAL)</strong></span>
        </div>

        <button
          onClick={handleDispatch}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/10 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>ENCRYPT & INJECT EPHEMERAL ROUTE</span>
        </button>
      </div>
    </div>
  );
};
