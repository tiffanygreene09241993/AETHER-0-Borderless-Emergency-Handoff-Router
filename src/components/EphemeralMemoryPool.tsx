import React from 'react';
import { useRouterEngine } from '../context/RouterContext.tsx';
import { Cpu, ShieldCheck, Trash2, Zap, Lock, ShieldAlert } from 'lucide-react';

export const EphemeralMemoryPool: React.FC = () => {
  const {
    bufferSlots,
    selectedSlotIndex,
    setSelectedSlotIndex,
    zeroizeAllMemoryNow,
    policy,
    stats,
  } = useRouterEngine();

  const selectedSlot =
    selectedSlotIndex !== null ? bufferSlots[selectedSlotIndex] : null;

  const activeSlotsCount = bufferSlots.filter((s) => s.state === 'ACTIVE_CIPHER').length;
  const totalOccupiedBytes = bufferSlots.reduce((acc, s) => acc + s.byteCount, 0);

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#070a12] p-5">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Volatile RAM Matrix & Ephemeral Buffer Pool</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict zero-retention physical RAM simulator: volatile memory slots are overwritten with zeroes upon downstream handoff.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={zeroizeAllMemoryNow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-medium text-rose-300 bg-rose-950/60 border border-rose-800/80 hover:bg-rose-900 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Force Purge & Zeroize All</span>
          </button>
        </div>
      </div>

      {/* Volatile Performance Metric Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="p-3 bg-[#0a0f1d] border border-slate-800/80 rounded-lg">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
            Active Volatile Slots
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-slate-100 tabular-nums">
              {activeSlotsCount}
            </span>
            <span className="text-xs font-mono text-slate-500">/ 32 SLOTS</span>
          </div>
        </div>

        <div className="p-3 bg-[#0a0f1d] border border-slate-800/80 rounded-lg">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
            Volatile RAM In-Flight
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-cyan-400 tabular-nums">
              {(totalOccupiedBytes / 1024).toFixed(2)}
            </span>
            <span className="text-xs font-mono text-slate-400">KB</span>
          </div>
        </div>

        <div className="p-3 bg-[#0a0f1d] border border-slate-800/80 rounded-lg">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
            Total Evaporated Bytes
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-emerald-400 tabular-nums">
              {(stats.totalBytesEvaporated / 1024).toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400">KB SHREDDED</span>
          </div>
        </div>

        <div className="p-3 bg-[#0a0f1d] border border-slate-800/80 rounded-lg">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
            Disk Persistence Leaks
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-semibold text-emerald-400 tabular-nums">
              0.00
            </span>
            <span className="text-xs font-mono text-emerald-500">STRICT ZERO</span>
          </div>
        </div>
      </div>

      {/* 32-Slot RAM Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-16 gap-2 mb-4">
        {bufferSlots.map((slot) => {
          const isSelected = selectedSlotIndex === slot.slotIndex;
          const isOccupied = slot.state === 'ACTIVE_CIPHER';
          const dwellPercent =
            slot.totalDwellMs > 0
              ? Math.max(0, Math.min(100, (slot.dwellRemainingMs / slot.totalDwellMs) * 100))
              : 0;

          return (
            <button
              key={slot.slotIndex}
              onClick={() => setSelectedSlotIndex(isSelected ? null : slot.slotIndex)}
              className={`relative flex flex-col items-center justify-between p-2 rounded border text-left transition-all ${
                isSelected
                  ? 'border-cyan-400 ring-2 ring-cyan-500/30 bg-[#0e172a]'
                  : isOccupied
                  ? 'border-cyan-500/60 bg-[#0c182b] hover:border-cyan-400'
                  : 'border-slate-800/70 bg-[#080d18] hover:border-slate-700'
              }`}
            >
              <div className="w-full flex items-center justify-between text-[9px] font-mono text-slate-500">
                <span>#{slot.slotIndex.toString().padStart(2, '0')}</span>
                {isOccupied && <Lock className="w-2.5 h-2.5 text-cyan-400" />}
              </div>

              {/* Status Visualizer */}
              <div className="my-1.5 flex flex-col items-center justify-center">
                <span
                  className={`text-[10px] font-mono font-semibold ${
                    isOccupied ? 'text-cyan-300' : 'text-slate-600'
                  }`}
                >
                  {isOccupied ? `${slot.byteCount}B` : '0x00'}
                </span>
              </div>

              {/* Dwell bar */}
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ${
                    isOccupied ? 'bg-cyan-400' : 'bg-slate-700'
                  }`}
                  style={{ width: isOccupied ? `${dwellPercent}%` : '0%' }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Slot Detailed Hex & Volatile Inspection Drawer */}
      {selectedSlot && (
        <div className="mt-4 p-4 rounded-lg bg-[#090e1c] border border-cyan-800/60 text-xs font-mono">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-semibold">
                MEMORY BUFFER SLOT #{selectedSlot.slotIndex.toString().padStart(2, '0')}
              </span>
              <span className="text-slate-500">[{selectedSlot.memoryAddress}]</span>
            </div>
            <button
              onClick={() => setSelectedSlotIndex(null)}
              className="text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            <div>
              <span className="text-slate-500 block text-[11px]">ALLOCATION STATE:</span>
              <span
                className={`font-semibold ${
                  selectedSlot.state === 'ACTIVE_CIPHER'
                    ? 'text-cyan-300'
                    : 'text-emerald-400'
                }`}
              >
                {selectedSlot.state === 'ACTIVE_CIPHER'
                  ? 'OCCUPIED (AES-256 ENVELOPE)'
                  : 'ZEROIZED (0x00 PRISTINE)'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">ASSIGNED ENVELOPE ID:</span>
              <span className="text-slate-200">
                {selectedSlot.envelopeId || 'NONE (FLUSHED)'}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">REMAINING DWELL TIME:</span>
              <span className="text-slate-200 tabular-nums">
                {selectedSlot.state === 'ACTIVE_CIPHER'
                  ? `${selectedSlot.dwellRemainingMs} ms`
                  : '0 ms (ZEROIZED)'}
              </span>
            </div>
          </div>

          {/* Hex Slice Representation */}
          <div>
            <span className="text-slate-500 block text-[11px] mb-1">
              VOLATILE RAM SLICE PREVIEW:
            </span>
            <div className="p-2.5 bg-[#05070d] rounded border border-slate-800/80 text-cyan-400 text-xs tracking-widest font-mono">
              {selectedSlot.state === 'ACTIVE_CIPHER'
                ? selectedSlot.hexDumpSlice
                : '00 00 00 00 00 00 00 00  (PRISTINE ZERO BUFFER)'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
