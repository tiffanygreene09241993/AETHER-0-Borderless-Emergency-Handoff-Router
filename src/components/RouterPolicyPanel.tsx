import React from 'react';
import { useRouterEngine } from '../context/RouterContext.tsx';
import { Sliders, Shield, Zap, RefreshCw, KeyRound, AlertTriangle } from 'lucide-react';

export const RouterPolicyPanel: React.FC = () => {
  const { policy, updatePolicy } = useRouterEngine();

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Router Policy & Cryptographic Boundary Governance</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure ephemeral time-to-live boundaries, shredder algorithms, and border handoff constraints.
          </p>
        </div>

        <button
          onClick={() =>
            updatePolicy({
              ephemeralTtlMs: 1400,
              maxHops: 5,
              zeroizeAlgorithm: 'CRYPTO-RANDOM-WIPE',
              strictBorderAuthentication: true,
              dropOnTamper: true,
              tamperSimulationActive: false,
            })
          }
          className="text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Volatile Lifetime & Hop Limits */}
        <div className="space-y-4">
          {/* Ephemeral Buffer TTL Slider */}
          <div className="p-4 bg-[#090e1a] rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase text-slate-300">
                Ephemeral Buffer TTL (RAM Lifespan):
              </label>
              <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">
                {policy.ephemeralTtlMs} ms
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="100"
              value={policy.ephemeralTtlMs}
              onChange={(e) => updatePolicy({ ephemeralTtlMs: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>200 ms (Rapid Purge)</span>
              <span>1400 ms (Standard)</span>
              <span>5000 ms (High Latency Links)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Maximum allowable dwell duration in volatile memory before automatic shredding triggers.
            </p>
          </div>

          {/* Max Hops Constraint */}
          <div className="p-4 bg-[#090e1a] rounded-lg border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono uppercase text-slate-300">
                Max Border Hops Limit:
              </label>
              <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">
                {policy.maxHops} Hops
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="8"
              step="1"
              value={policy.maxHops}
              onChange={(e) => updatePolicy({ maxHops: Number(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-2">
              Envelopes exceeding this hop count are immediately zeroized to prevent routing loops.
            </p>
          </div>
        </div>

        {/* Right Column: Shredding Algorithm & Security Invariants */}
        <div className="space-y-4">
          {/* Zeroization Algorithm Selection */}
          <div className="p-4 bg-[#090e1a] rounded-lg border border-slate-800">
            <label className="block text-xs font-mono uppercase text-slate-300 mb-2">
              RAM Shredding / Zeroization Algorithm:
            </label>
            <div className="space-y-2">
              {[
                {
                  id: 'CRYPTO-RANDOM-WIPE',
                  title: 'Cryptographic Random Wipe (2-Pass)',
                  desc: 'Overwrites buffer with CSPRNG entropy, followed by uniform 0x00 zero-fill.',
                },
                {
                  id: 'DOD-5220.22-M-3PASS',
                  title: 'DoD 5220.22-M Ephemeral Standard (3-Pass)',
                  desc: 'Multi-pass destruction: random bytes, inverted complement (0xFF), and strict zeroes.',
                },
                {
                  id: 'SINGLE-PASS-ZERO',
                  title: 'Single-Pass 0x00 Zero-Fill (Ultra Low Latency)',
                  desc: 'Direct single-cycle memory write of 0x00 for minimal latency overhead.',
                },
              ].map((algo) => (
                <label
                  key={algo.id}
                  className={`flex items-start gap-3 p-2.5 rounded border cursor-pointer transition-colors ${
                    policy.zeroizeAlgorithm === algo.id
                      ? 'border-cyan-400 bg-cyan-950/30 text-slate-100'
                      : 'border-slate-800 bg-[#070a13] text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="zeroizeAlgorithm"
                    value={algo.id}
                    checked={policy.zeroizeAlgorithm === algo.id}
                    onChange={(e) => updatePolicy({ zeroizeAlgorithm: e.target.value as any })}
                    className="mt-1 accent-cyan-400"
                  />
                  <div>
                    <span className="text-xs font-mono font-semibold block text-slate-200">
                      {algo.title}
                    </span>
                    <span className="text-[11px] text-slate-400 leading-snug block mt-0.5">
                      {algo.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Border Security Invariant Toggles */}
          <div className="p-4 bg-[#090e1a] rounded-lg border border-slate-800 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-mono text-slate-300">
                Enforce Authenticated Hop Signatures:
              </span>
              <input
                type="checkbox"
                checked={policy.strictBorderAuthentication}
                onChange={(e) => updatePolicy({ strictBorderAuthentication: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-cyan-400"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-300">
                Drop & Zeroize on Ingress Tamper:
              </span>
              <input
                type="checkbox"
                checked={policy.dropOnTamper}
                onChange={(e) => updatePolicy({ dropOnTamper: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-cyan-400"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
