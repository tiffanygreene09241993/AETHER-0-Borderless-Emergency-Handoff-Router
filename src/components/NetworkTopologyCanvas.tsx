import React, { useState } from 'react';
import { useRouterEngine } from '../context/RouterContext.tsx';
import { NetworkNode } from '../types/router.ts';
import {
  Satellite,
  Radio,
  Anchor,
  Building2,
  Crosshair,
  Shield,
  Plane,
  AlertTriangle,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';

export const NetworkTopologyCanvas: React.FC = () => {
  const {
    nodes,
    activeEnvelopes,
    selectedNodeId,
    setSelectedNodeId,
    toggleNodeStatus,
    dispatchTelemetry,
  } = useRouterEngine();

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  // Domain icon mapping
  const getNodeIcon = (protocol: NetworkNode['protocol']) => {
    switch (protocol) {
      case 'DTN/BPv7':
        return <Satellite className="w-4 h-4 text-cyan-400" />;
      case '802.11ah HaLow':
        return <Radio className="w-4 h-4 text-amber-400" />;
      case 'Acoustic/AIS':
        return <Anchor className="w-4 h-4 text-blue-400" />;
      case 'VLF-Seismic':
        return <Shield className="w-4 h-4 text-purple-400" />;
      case 'COTS-LoRa-Mesh':
        return <Plane className="w-4 h-4 text-emerald-400" />;
      case 'Isolated-TLS-Cell':
      default:
        return <Building2 className="w-4 h-4 text-rose-400" />;
    }
  };

  // Find all unique links
  const links: { source: NetworkNode; target: NetworkNode; key: string }[] = [];
  const processedPairs = new Set<string>();

  nodes.forEach((source) => {
    source.connectedNodeIds.forEach((targetId) => {
      const target = nodes.find((n) => n.id === targetId);
      if (target) {
        const pairKey = [source.id, target.id].sort().join('--');
        if (!processedPairs.has(pairKey)) {
          processedPairs.add(pairKey);
          links.push({ source, target, key: pairKey });
        }
      }
    });
  });

  // Calculate packet positions for live envelopes
  const packetDots = activeEnvelopes.flatMap((env) => {
    if (!env.path || env.path.length < 2) return [];
    const fromIndex = Math.min(env.currentHopIndex, env.path.length - 2);
    const toIndex = fromIndex + 1;
    const fromNode = nodes.find((n) => n.id === env.path[fromIndex]);
    const toNode = nodes.find((n) => n.id === env.path[toIndex]);

    if (!fromNode || !toNode) return [];

    // Simple progress based on time
    const elapsed = Date.now() - env.createdAt;
    const progress = Math.min(1, Math.max(0, (elapsed % 600) / 600));

    const cx = fromNode.x + (toNode.x - fromNode.x) * progress;
    const cy = fromNode.y + (toNode.y - fromNode.y) * progress;

    return [
      {
        id: env.envelopeId,
        cx,
        cy,
        classification: env.classification,
        isTampered: env.status === 'TAMPER_REJECTED',
      },
    ];
  });

  return (
    <div className="relative w-full rounded-xl border border-slate-800 bg-[#070a12] p-4 overflow-hidden">
      {/* Topology Header & Protocol Bar */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800/80 gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
            <span>Borderless Network Topology & Heterogeneous Protocol Mesh</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-domain routing graph with zero-knowledge border gateways and dynamic rerouting.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Jammed / Attacked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Severed Outage</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map Stage */}
      <div className="relative w-full h-[480px] bg-[#05070d] rounded-lg border border-slate-900 overflow-hidden cursor-crosshair">
        {/* Domain Background Grid & Labels */}
        <svg
          viewBox="0 0 1000 550"
          className="w-full h-full select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#101726" strokeWidth="0.8" />
            </pattern>
            {/* Gradient for active packet */}
            <radialGradient id="packetGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1000" height="550" fill="url(#grid)" />

          {/* Border Division Guides */}
          <line x1="0" y1="210" x2="1000" y2="210" stroke="#162033" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="0" y1="410" x2="1000" y2="410" stroke="#162033" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="330" y1="0" x2="330" y2="550" stroke="#162033" strokeDasharray="4 4" strokeWidth="1" />
          <line x1="680" y1="0" x2="680" y2="550" stroke="#162033" strokeDasharray="4 4" strokeWidth="1" />

          {/* Domain Zone Labels */}
          <text x="20" y="30" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
            ORBITAL DOMAIN (LEO DTN)
          </text>
          <text x="350" y="30" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
            ALPINE TACTICAL RF
          </text>
          <text x="700" y="30" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
            AIRBORNE DRONE SWARM
          </text>
          <text x="20" y="235" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
            OFFSHORE MARITIME HAVEN
          </text>
          <text x="350" y="235" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
            CIVIC DISASTER CELL
          </text>
          <text x="700" y="235" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
            REGIONAL TRAUMA INTAKE
          </text>
          <text x="20" y="435" fill="#334155" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
            SUBTERRANEAN VLF SCADA
          </text>

          {/* Network Links */}
          {links.map(({ source, target, key }) => {
            const isSevered = source.status === 'severed' || target.status === 'severed';
            const isJammed = source.status === 'jammed' || target.status === 'jammed';

            // Check if active envelope is currently traversing this link
            const isActiveRouting = activeEnvelopes.some((env) => {
              if (!env.path) return false;
              const idx = env.currentHopIndex;
              const hopSource = env.path[idx];
              const hopTarget = env.path[idx + 1];
              return (
                (hopSource === source.id && hopTarget === target.id) ||
                (hopSource === target.id && hopTarget === source.id)
              );
            });

            return (
              <g key={key}>
                <line
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={
                    isSevered
                      ? '#ef4444'
                      : isJammed
                      ? '#f59e0b'
                      : isActiveRouting
                      ? '#06b6d4'
                      : '#1e293b'
                  }
                  strokeWidth={isActiveRouting ? 2.5 : isSevered ? 1.5 : 1.2}
                  strokeDasharray={isSevered ? '5,5' : isJammed ? '3,3' : undefined}
                  className="transition-all duration-300"
                />

                {/* Flow indicator when actively routing */}
                {isActiveRouting && (
                  <circle
                    r="4"
                    fill="#38bdf8"
                    className="animate-ping"
                    cx={(source.x + target.x) / 2}
                    cy={(source.y + target.y) / 2}
                  />
                )}
              </g>
            );
          })}

          {/* Animated In-Transit Telemetry Packets */}
          {packetDots.map((dot) => (
            <g key={dot.id}>
              <circle
                cx={dot.cx}
                cy={dot.cy}
                r="10"
                fill="url(#packetGlow)"
                className="animate-pulse"
              />
              <circle
                cx={dot.cx}
                cy={dot.cy}
                r="3.5"
                fill={dot.isTampered ? '#ef4444' : '#ffffff'}
              />
            </g>
          ))}

          {/* Network Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const isHovered = hoveredNodeId === node.id;
            const isSevered = node.status === 'severed';
            const isJammed = node.status === 'jammed';

            const statusColor = isSevered
              ? '#ef4444'
              : isJammed
              ? '#f59e0b'
              : '#10b981';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="cursor-pointer group"
              >
                {/* Node Outer Halo on Selection / Hover */}
                {(isSelected || isHovered) && (
                  <circle
                    r="28"
                    fill="none"
                    stroke={statusColor}
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    className="animate-spin-slow opacity-80"
                  />
                )}

                {/* Node Base Circle */}
                <circle
                  r="20"
                  fill="#0c1220"
                  stroke={statusColor}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  className="transition-colors duration-200"
                />

                {/* Central Status Dot */}
                <circle r="4" fill={statusColor} />

                {/* Node Label Text */}
                <text
                  x="0"
                  y="34"
                  textAnchor="middle"
                  fill="#f1f5f9"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="JetBrains Mono"
                >
                  {node.callsign}
                </text>
                <text
                  x="0"
                  y="46"
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                >
                  {node.protocol}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer / Popover */}
        {selectedNode && (
          <div className="absolute bottom-3 left-3 max-w-sm bg-[#0a0f1d]/95 backdrop-blur-md border border-slate-700/80 rounded-lg p-3.5 shadow-2xl text-xs z-20">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <div className="flex items-center gap-2">
                {getNodeIcon(selectedNode.protocol)}
                <span className="font-semibold text-slate-100 font-mono">
                  {selectedNode.callsign}
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  ({selectedNode.name})
                </span>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-slate-500 hover:text-slate-200 p-0.5"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 mb-3">
              <div>
                <span className="text-slate-500 block">DOMAIN:</span>
                <span>{selectedNode.domain}</span>
              </div>
              <div>
                <span className="text-slate-500 block">TRANSPORT:</span>
                <span className="text-cyan-300">{selectedNode.protocol}</span>
              </div>
              <div>
                <span className="text-slate-500 block">KEY THUMBPRINT:</span>
                <span className="text-slate-400 truncate">{selectedNode.ephemeralKeyFingerprint}</span>
              </div>
              <div>
                <span className="text-slate-500 block">HOP LATENCY:</span>
                <span className="text-emerald-400 tabular-nums">{selectedNode.latencyMs} ms</span>
              </div>
            </div>

            {/* Actions for this node */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => toggleNodeStatus(selectedNode.id)}
                className={`flex-1 py-1 px-2 rounded text-[11px] font-mono font-medium transition-colors ${
                  selectedNode.status === 'online'
                    ? 'bg-amber-950/70 text-amber-300 border border-amber-800/80 hover:bg-amber-900'
                    : selectedNode.status === 'jammed'
                    ? 'bg-rose-950/70 text-rose-300 border border-rose-800/80 hover:bg-rose-900'
                    : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900'
                }`}
              >
                {selectedNode.status === 'online'
                  ? 'Simulate Jamming'
                  : selectedNode.status === 'jammed'
                  ? 'Sever Node Link'
                  : 'Restore Online State'}
              </button>

              <button
                onClick={() => {
                  const target = nodes.find((n) => n.id !== selectedNode.id && n.status === 'online');
                  if (target) {
                    dispatchTelemetry({
                      sourceNodeId: selectedNode.id,
                      targetNodeId: target.id,
                      classification: 'MASS-CASUALTY',
                      priority: 'EMERGENCY_CRITICAL',
                      payload: { test_origin: selectedNode.callsign, timestamp: Date.now() },
                    });
                  }
                }}
                className="py-1 px-2.5 rounded text-[11px] font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 transition-colors"
              >
                Dispatch Test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
