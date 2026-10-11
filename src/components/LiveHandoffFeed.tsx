import React from 'react';
import { useRouterEngine } from '../context/RouterContext.tsx';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  Lock,
  Clock,
  CheckCircle,
  XCircle,
  FileCheck,
} from 'lucide-react';

export const LiveHandoffFeed: React.FC = () => {
  const { activeEnvelopes, recentReceipts, nodes } = useRouterEngine();

  const getNodeCallsign = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    return node ? node.callsign : nodeId;
  };

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Active Ephemeral Handoffs & Hop Receipts</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Non-repudiable borderless hop receipts signed during transit without decrypting or persisting payload contents.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400">
          <span>ACTIVE IN RAM: </span>
          <span className="text-cyan-400 font-semibold">{activeEnvelopes.length}</span>
        </div>
      </div>

      {/* Active In-Transit Envelopes */}
      <div className="mb-6">
        <h3 className="text-xs font-mono uppercase text-slate-400 mb-2">
          In-Flight Envelopes (Volatile Dwell Countdown):
        </h3>

        {activeEnvelopes.length === 0 ? (
          <div className="p-6 text-center rounded-lg border border-dashed border-slate-800 bg-[#090e1a]">
            <p className="text-xs font-mono text-slate-500">
              No active envelopes currently buffered in volatile RAM. All previous packets have been successfully delivered and zeroized.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeEnvelopes.map((env) => (
              <div
                key={env.envelopeId}
                className="p-3.5 rounded-lg bg-[#0a0f1d] border border-cyan-900/60 text-xs font-mono"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-semibold">{env.envelopeId}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-300">{env.classification}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        env.status === 'DELIVERED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : env.status === 'TAMPER_REJECTED'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                      }`}
                    >
                      {env.status}
                    </span>
                  </div>
                </div>

                {/* Path Visualizer */}
                <div className="flex items-center gap-1.5 flex-wrap my-2">
                  <span className="text-slate-500 text-[11px] mr-1">PATH:</span>
                  {env.path.map((nodeId, idx) => {
                    const isPassed = idx <= env.currentHopIndex;
                    const isCurrent = idx === env.currentHopIndex;

                    return (
                      <React.Fragment key={nodeId}>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            isCurrent
                              ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50'
                              : isPassed
                              ? 'text-slate-300'
                              : 'text-slate-600'
                          }`}
                        >
                          {getNodeCallsign(nodeId)}
                        </span>
                        {idx < env.path.length - 1 && (
                          <ArrowRight
                            className={`w-3 h-3 ${
                              isPassed ? 'text-cyan-400' : 'text-slate-700'
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Cipher Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div>
                    <span className="text-slate-500 block">KEY THUMBPRINT:</span>
                    <span className="text-slate-200">{env.cipher.keyFingerprint}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">IV / AUTH TAG:</span>
                    <span className="text-slate-300 truncate block">
                      {env.cipher.ivHex} / {env.cipher.authTagHex.substring(0, 12)}...
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">VOLATILE RESIDENCE:</span>
                    <span className="text-emerald-400 tabular-nums">
                      {env.ttlMs} ms until zeroize
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Handoff Receipts Table */}
      <div>
        <h3 className="text-xs font-mono uppercase text-slate-400 mb-2">
          Hop Receipts Stream (Cryptographic Verification Ledger):
        </h3>

        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-[#090e1a]">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-[#0c1322] text-[11px] text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Node Callsign</th>
                <th className="py-2.5 px-3">Transport Protocol</th>
                <th className="py-2.5 px-3">Dwell Latency</th>
                <th className="py-2.5 px-3">Handoff Signature</th>
                <th className="py-2.5 px-3">Zero-Retention Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentReceipts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-slate-500">
                    Awaiting initial packet handoffs...
                  </td>
                </tr>
              ) : (
                recentReceipts.slice(0, 8).map((receipt, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="py-2 px-3 font-semibold text-slate-200">
                      {receipt.nodeName}
                    </td>
                    <td className="py-2 px-3 text-cyan-400">
                      {receipt.protocol}
                    </td>
                    <td className="py-2 px-3 tabular-nums text-slate-300">
                      {receipt.dwellTimeMs} ms
                    </td>
                    <td className="py-2 px-3 text-slate-400 truncate max-w-[140px]">
                      {receipt.verifiedSignature}
                    </td>
                    <td className="py-2 px-3 text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Purged & Forwarded</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
