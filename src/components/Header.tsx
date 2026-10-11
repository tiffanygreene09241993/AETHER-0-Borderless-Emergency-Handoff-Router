import React from 'react';
import { useRouterEngine } from '../context/RouterContext.tsx';
import { Volume2, VolumeX, ShieldAlert, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab }) => {
  const {
    audioEnabled,
    toggleAudio,
    zeroizeAllMemoryNow,
    activeEnvelopes,
    stats,
  } = useRouterEngine();

  const navLinks = [
    { id: 'topology', label: 'Router Mesh' },
    { id: 'armor', label: 'The Armor (Sovereign PWA)' },
    { id: 'sword', label: 'The Sword (Policy & Red-Team)' },
    { id: 'memory-pool', label: 'RAM Matrix' },
    { id: 'audit', label: 'Zero-Retention Audit' },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5 bg-[#07090e]/95 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('topology');
          }}
          className="text-lg font-bold tracking-tight text-slate-100 flex items-center gap-2 hover:text-cyan-400 transition-colors"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          AETHER-0 Emergency Router
        </a>
        <span className="hidden sm:inline text-xs text-slate-500 font-mono">
          [ZERO-RETENTION / BORDERLESS]
        </span>
      </div>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`transition-colors text-xs font-semibold uppercase tracking-wider ${
                isActive
                  ? 'text-cyan-400 border-b border-cyan-400 pb-0.5'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {link.label}
              {link.id === 'handoff-feed' && activeEnvelopes.length > 0 && (
                <span className="ml-1.5 font-mono text-[10px] text-cyan-300">
                  ({activeEnvelopes.length})
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleAudio}
          title={audioEnabled ? 'Mute Telemetry Audio' : 'Unmute Telemetry Audio'}
          className="p-2 text-xs font-medium text-slate-400 bg-slate-900 border border-slate-800 rounded-lg hover:text-slate-200 hover:border-slate-700 transition-colors"
        >
          {audioEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        <button
          onClick={zeroizeAllMemoryNow}
          title="Instantly overwrite all volatile RAM buffers with zeroes and destroy all active keys"
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-lg hover:bg-rose-900 hover:text-rose-100 transition-colors shadow-sm"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">Zeroize RAM</span>
        </button>
      </div>
    </header>
  );
};
