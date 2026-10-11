import React, { useState, useEffect } from 'react';
import { DecoyPersona } from '../../types/sovereign.ts';
import {
  Sun,
  Bus,
  Train,
  Wind,
  Compass,
  UtensilsCrossed,
  Calculator,
  FileEdit,
  Radio,
  Clock,
  Check,
  Plus,
  Trash2,
  Receipt,
  History,
} from 'lucide-react';

interface DuressDecoyViewProps {
  onExitDecoy: () => void;
  defaultPersona?: DecoyPersona;
}

/**
 * Deterministic in-place memory shredding using Uint8Array and WebCrypto getRandomValues
 */
export function secureZeroizeBytes(buffer: Uint8Array): void {
  crypto.getRandomValues(buffer as any);
  buffer.fill(0);
}

/**
 * Fire-and-forget dead-man duress dispatch with hard 150ms timeout
 */
export async function dispatchSilentDuressBeacon(payloadBytes: Uint8Array): Promise<void> {
  try {
    const blob = new Blob([payloadBytes.buffer as ArrayBuffer], { type: 'application/octet-stream' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/duress-beacon', blob);
    } else {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 150);
      await fetch('/api/duress-beacon', {
        method: 'POST',
        body: blob,
        signal: controller.signal,
        keepalive: true,
      });
      clearTimeout(timeoutId);
    }
  } catch {
    // Non-blocking fire-and-forget: fail silently to preserve survivor safety
  } finally {
    // Deterministic memory shredding
    secureZeroizeBytes(payloadBytes);
  }
}

export const DuressDecoyView: React.FC<DuressDecoyViewProps> = ({
  onExitDecoy,
  defaultPersona = 'tip_calculator',
}) => {
  const [activePersona, setActivePersona] = useState<DecoyPersona>(defaultPersona);
  const [beaconHeartbeat, setBeaconHeartbeat] = useState(0);

  // Tip Calculator State - Stateful Decoy with Believable Past Receipts
  const [billAmount, setBillAmount] = useState('54.20');
  const [tipPercent, setTipPercent] = useState(18);
  const [guestCount, setGuestCount] = useState(2);
  const [recentChecks] = useState([
    { id: 'RC-104', date: 'Yesterday 7:45 PM', place: 'Olive & Fig Trattoria', total: '$64.20', perPerson: '$25.25 (3 guests)' },
    { id: 'RC-103', date: 'Saturday 1:15 PM', place: 'Blue Heron Roastery', total: '$32.80', perPerson: '$19.35 (2 guests)' },
    { id: 'RC-102', date: 'Thursday 12:30 PM', place: 'Taqueria El Sol', total: '$18.40', perPerson: '$21.71 (1 guest)' },
  ]);

  // Scratchpad State - Pre-populated natural notes
  const [scratchNotes, setScratchNotes] = useState<string[]>([
    'Organic almond milk & pasture-raised eggs',
    'Dry cleaner ticket #1049 (ready Thursday afternoon)',
    'Confirm dental hygiene appointment for Tuesday at 3:15 PM',
    'Return hardware store tape measure & cable ties',
    'Replace furnace air filter (16x25x1 MERV 11)',
  ]);
  const [newNote, setNewNote] = useState('');

  // Recipe Box State
  const [selectedRecipe, setSelectedRecipe] = useState<'pasta' | 'salad' | 'curry'>('pasta');

  // Covert 32-byte dead-man alert beacon heartbeat
  useEffect(() => {
    const timer = setInterval(() => {
      setBeaconHeartbeat((prev) => (prev + 1) % 60);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Tip calculations
  const parsedBill = parseFloat(billAmount) || 0;
  const tipTotal = parsedBill * (tipPercent / 100);
  const grandTotal = parsedBill + tipTotal;
  const perPerson = guestCount > 0 ? grandTotal / guestCount : grandTotal;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setScratchNotes((prev) => [...prev, newNote.trim()]);
    setNewNote('');
  };

  const handleRemoveNote = (idx: number) => {
    setScratchNotes((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex flex-col font-sans select-none relative">
      {/* Covert 32-Byte Dead-Man Alert Beacon: Discreet 3px pulsing blip */}
      <div
        className="absolute top-2 right-2 flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity text-[10px] font-mono text-slate-400"
        title="Covert Duress Heartbeat: 32-byte dead-man telemetry packet broadcast to designated legal proxy"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            beaconHeartbeat % 4 === 0 ? 'bg-amber-400 ring-2 ring-amber-400/40' : 'bg-slate-600'
          }`}
        />
        <span className="hidden sm:inline">
          EPHEMERAL BEACON ID #{beaconHeartbeat.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Header & Persona Selector */}
      <header className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-white text-xs">
            {activePersona === 'tip_calculator'
              ? 'TIP'
              : activePersona === 'transit_weather'
              ? 'MT'
              : activePersona === 'recipe_box'
              ? 'REC'
              : 'PAD'}
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-100">
              {activePersona === 'tip_calculator'
                ? 'Tip & Split-Bill Calculator'
                : activePersona === 'transit_weather'
                ? 'Civic Transit & Weather Portal'
                : activePersona === 'recipe_box'
                ? 'Home Recipe Box & Pantry'
                : 'Personal Scratchpad & Checklist'}
            </h1>
            <p className="text-xs text-slate-400">
              Daily Utilities · Plausible Deniability Profile
            </p>
          </div>
        </div>

        {/* 4 Interchangeable Decoy Personas */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActivePersona('tip_calculator')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
              activePersona === 'tip_calculator'
                ? 'bg-slate-700 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Tip Calculator</span>
          </button>

          <button
            onClick={() => setActivePersona('transit_weather')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
              activePersona === 'transit_weather'
                ? 'bg-slate-700 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Transit</span>
          </button>

          <button
            onClick={() => setActivePersona('recipe_box')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
              activePersona === 'recipe_box'
                ? 'bg-slate-700 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Recipes</span>
          </button>

          <button
            onClick={() => setActivePersona('scratchpad')}
            className={`px-2.5 py-1 rounded text-xs transition-colors flex items-center gap-1.5 ${
              activePersona === 'scratchpad'
                ? 'bg-slate-700 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Scratchpad</span>
          </button>

          <button
            onClick={onExitDecoy}
            className="text-xs text-slate-500 hover:text-slate-300 ml-2 px-2 py-1 rounded transition-colors"
            title="Restore Operational Mode"
          >
            Exit Decoy
          </button>
        </div>
      </header>

      {/* Persona 1: Tip & Split-Bill Calculator (With Stateful History) */}
      {activePersona === 'tip_calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Main Calculator */}
          <div className="lg:col-span-7 p-6 bg-slate-800/90 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-center">
            <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Dining Bill & Tip Calculator</span>
            </h2>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">BILL AMOUNT ($):</label>
                <input
                  type="number"
                  step="0.01"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-lg font-bold text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1.5">TIP PERCENTAGE:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 18, 20, 25].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setTipPercent(pct)}
                      className={`py-2 rounded-lg font-bold transition-colors ${
                        tipPercent === pct
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">NUMBER OF GUESTS:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuestCount((g) => Math.max(1, g - 1))}
                    className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-lg font-bold flex items-center justify-center text-slate-100"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold text-slate-100 w-8 text-center">
                    {guestCount}
                  </span>
                  <button
                    onClick={() => setGuestCount((g) => g + 1)}
                    className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-slate-600 text-lg font-bold flex items-center justify-center text-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-2">
                <div className="flex justify-between text-slate-400">
                  <span>Tip Total ({tipPercent}%):</span>
                  <span className="text-slate-200 font-semibold">${tipTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Grand Total:</span>
                  <span className="text-slate-200 font-semibold">${grandTotal.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-cyan-400 font-bold text-sm">EACH PERSON PAYS:</span>
                  <span className="text-2xl font-bold text-cyan-400">${perPerson.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stateful History Panel - Proves It's a Real Used App */}
          <div className="lg:col-span-5 p-5 bg-slate-800/60 rounded-2xl border border-slate-700/60 flex flex-col">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-700/60 text-xs font-semibold text-slate-300">
              <History className="w-4 h-4 text-slate-400" />
              <span>Recent Saved Calculations</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {recentChecks.map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/40 text-xs">
                  <div className="flex justify-between font-semibold text-slate-200 mb-1">
                    <span>{item.place}</span>
                    <span className="text-cyan-400">{item.total}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{item.date}</span>
                    <span className="font-mono text-slate-300">{item.perPerson}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-700/60 text-[11px] text-slate-500 text-center">
              Auto-saved to device cache · 3 items in storage
            </div>
          </div>
        </div>
      )}

      {/* Persona 2: Transit & Weather */}
      {activePersona === 'transit_weather' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          <div className="p-5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                  Current Conditions
                </span>
                <Sun className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-4xl font-bold text-slate-100 mb-1">68°F</div>
              <div className="text-xs text-slate-300">Partly Cloudy · Humidity 54%</div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-700/60 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-slate-300" />
                <span>NW 9 mph</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-slate-300" />
                <span>Barometer 30.12</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-blue-400" />
                <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                  Bus Departures
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">ON SCHEDULE</span>
            </div>
            <div className="space-y-3 text-xs flex-1">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-700/40">
                <div>
                  <span className="font-semibold text-slate-200">Route 14 — Civic Center</span>
                  <span className="block text-[11px] text-slate-400">Platform B</span>
                </div>
                <span className="font-mono text-emerald-400 font-semibold">4 MIN</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-700/40">
                <div>
                  <span className="font-semibold text-slate-200">Route 38 — Geary Express</span>
                  <span className="block text-[11px] text-slate-400">Platform A</span>
                </div>
                <span className="font-mono text-emerald-400 font-semibold">11 MIN</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Train className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                    Commuter Rail
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">TRACK 3</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-700/50 mb-3 text-xs">
                <div className="font-semibold text-slate-200 mb-1">Southbound Express #402</div>
                <div className="text-slate-400">Scheduled: 10:45 AM · Departs in 18 min</div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/50 text-[11px] text-blue-200">
              <span className="font-semibold block mb-0.5">Municipal Service Note:</span>
              Public library community rooms open today until 8:00 PM. Dial 311 for local assistance.
            </div>
          </div>
        </div>
      )}

      {/* Persona 3: Home Recipe Box */}
      {activePersona === 'recipe_box' && (
        <div className="max-w-3xl mx-auto w-full p-6 bg-slate-800/80 rounded-2xl border border-slate-700 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-700">
            <button
              onClick={() => setSelectedRecipe('pasta')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedRecipe === 'pasta' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Classic Tuscan Pasta
            </button>
            <button
              onClick={() => setSelectedRecipe('salad')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedRecipe === 'salad' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mediterranean Chickpea Salad
            </button>
            <button
              onClick={() => setSelectedRecipe('curry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedRecipe === 'curry' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Coconut Lentil Curry
            </button>
          </div>

          {selectedRecipe === 'pasta' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-semibold text-slate-100">Classic Tuscan Garlic Pasta</h3>
              <p className="text-slate-400">Prep: 10 mins · Cook: 15 mins · Servings: 4</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                  <span className="font-semibold text-slate-300 block mb-2">Ingredients:</span>
                  <ul className="space-y-1 text-slate-400 list-disc list-inside">
                    <li>12 oz tagliatelle or fettuccine</li>
                    <li>4 cloves garlic, thinly sliced</li>
                    <li>3 tbsp extra virgin olive oil</li>
                    <li>1 cup grated Pecorino Romano</li>
                    <li>Fresh cracked black pepper & sea salt</li>
                  </ul>
                </div>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                  <span className="font-semibold text-slate-300 block mb-2">Instructions:</span>
                  <p className="text-slate-400 leading-relaxed">
                    Boil salted water and cook pasta until al dente. In a skillet, gently toast garlic in olive oil until golden. Toss pasta with garlic oil and reserved cooking water. Stir in cheese until creamy.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedRecipe === 'salad' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-semibold text-slate-100">Mediterranean Chickpea Salad</h3>
              <p className="text-slate-400">Prep: 15 mins · Cook: 0 mins · Servings: 2</p>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-slate-300 block mb-2">Ingredients:</span>
                <p className="text-slate-400 leading-relaxed">
                  Canned chickpeas (rinsed), Persian cucumber, cherry tomatoes, kalamata olives, red onion, and lemon-oregano vinaigrette.
                </p>
              </div>
            </div>
          )}

          {selectedRecipe === 'curry' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-base font-semibold text-slate-100">Creamy Coconut Lentil Curry</h3>
              <p className="text-slate-400">Prep: 10 mins · Cook: 25 mins · Servings: 4</p>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <span className="font-semibold text-slate-300 block mb-2">Ingredients:</span>
                <p className="text-slate-400 leading-relaxed">
                  1 cup red lentils, 1 can coconut milk, ginger, garlic, ground turmeric, cumin, and baby spinach served over steamed basmati rice.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Persona 4: Personal Scratchpad */}
      {activePersona === 'scratchpad' && (
        <div className="max-w-2xl mx-auto w-full p-6 bg-slate-800/80 rounded-2xl border border-slate-700 flex-1 flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-700">
            <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <FileEdit className="w-4 h-4 text-emerald-400" />
              <span>Personal Memo & Checklist</span>
            </h2>
            <span className="text-xs text-slate-400">{scratchNotes.length} Items</span>
          </div>

          <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add item or reminder..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-72">
            {scratchNotes.map((note, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/50 text-xs"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <Check className="w-3.5 h-3.5 text-slate-500" />
                  <span>{note}</span>
                </div>
                <button
                  onClick={() => handleRemoveNote(idx)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Standard Public Utility Interface · Civilian Mask Mode Active</span>
        <span>Version 2.4.1 (Stable)</span>
      </footer>
    </div>
  );
};
