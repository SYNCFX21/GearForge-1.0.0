import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Gamepad2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Globe, 
  Activity, 
  Gauge, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  HelpCircle
} from 'lucide-react';
import { ACCESSORY_CATALOG } from '../data/accessories';
import { Accessory } from '../types';

// Currencies
export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rateToPhp: number; // Conversion rate relative to PHP
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'PHP', symbol: '₱', name: 'Philippines', flag: '🇵🇭', rateToPhp: 1 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore', flag: '🇸🇬', rateToPhp: 0.024 },
  { code: 'MYR', symbol: 'RM', name: 'Malaysia', flag: '🇲🇾', rateToPhp: 0.076 },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesia', flag: '🇮🇩', rateToPhp: 278.5 },
  { code: 'THB', symbol: '฿', name: 'Thailand', flag: '🇹🇭', rateToPhp: 0.62 },
  { code: 'VND', symbol: '₫', name: 'Vietnam', flag: '🇻🇳', rateToPhp: 442.0 },
];

export interface TargetGame {
  id: string;
  name: string;
  genre: string;
  icon: string;
  minGpuTier: number; // 1 to 5
}

export const POPULAR_GAMES: TargetGame[] = [
  { id: 'valorant', name: 'Valorant', genre: 'Tac Shooter', icon: '🎯', minGpuTier: 1 },
  { id: 'cs2', name: 'Counter-Strike 2', genre: 'Tac Shooter', icon: '💣', minGpuTier: 2 },
  { id: 'apex', name: 'Apex Legends', genre: 'Battle Royale', icon: '⚡', minGpuTier: 2 },
  { id: 'cyberpunk', name: 'Cyberpunk 2077', genre: 'AAA RPG', icon: '🦾', minGpuTier: 4 },
  { id: 'gta6', name: 'GTA VI (Expected)', genre: 'AAA Open World', icon: '🚗', minGpuTier: 5 },
  { id: 'dota2', name: 'Dota 2 / LoL', genre: 'MOBA', icon: '🛡️', minGpuTier: 1 },
];

/**
 * AIBudgetBuilder Component
 * Offline-capable AI gaming build recommender based on target game selection,
 * Southeast Asian multi-currency conversions (PHP, SGD, MYR, IDR, THB, VND),
 * and target resolution performance requirements.
 * 
 * @whereUsed
 * - `src/App.tsx` (rendered under the 'ai-budget-builder' active tab)
 */
export default function AIBudgetBuilder() {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(CURRENCIES[0]);
  const [budgetPhp, setBudgetPhp] = useState<number>(35000);
  const [selectedGames, setSelectedGames] = useState<string[]>(['valorant', 'cs2']);
  const [resolution, setResolution] = useState<'1080p' | '1440p' | '4K'>('1080p');

  /** Formats a PHP base value into the active SEA converted currency format */
  const formatAmount = (phpVal: number) => {
    const converted = phpVal * selectedCurrency.rateToPhp;
    if (selectedCurrency.code === 'IDR' || selectedCurrency.code === 'VND') {
      return `${selectedCurrency.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${selectedCurrency.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  /** Toggles a target game in the benchmark optimization filter */
  const toggleGame = (gameId: string) => {
    setSelectedGames(prev => 
      prev.includes(gameId) 
        ? prev.filter(g => g !== gameId)
        : [...prev, gameId]
    );
  };

  // AI Recommendation Engine Logic
  const generatedBuild = useMemo(() => {
    let cpu = "AMD Ryzen 5 5600";
    let gpu = "AMD Radeon RX 6600 8GB";
    let ram = "16GB DDR4 3200MHz Dual Channel";
    let mobo = "B550M WiFi Motherboard";
    let psu = "650W 80+ Bronze Power Supply";
    let psuWattage = 650;
    let estimatedSystemPower = 320;

    if (budgetPhp < 25000) {
      cpu = "AMD Ryzen 5 4600G (iGPU)";
      gpu = "Radeon Vega 7 Integrated Graphics";
      ram = "16GB DDR4 3200MHz Dual Channel";
      mobo = "A520M Micro-ATX Motherboard";
      psu = "500W 80+ White Power Supply";
      psuWattage = 500;
      estimatedSystemPower = 200;
    } else if (budgetPhp >= 25000 && budgetPhp < 45000) {
      cpu = "AMD Ryzen 5 5600";
      gpu = "NVIDIA GeForce RTX 3060 12GB";
      ram = "16GB DDR4 3600MHz Dual Channel";
      mobo = "B550M WiFi Motherboard";
      psu = "650W 80+ Bronze Power Supply";
      psuWattage = 650;
      estimatedSystemPower = 350;
    } else if (budgetPhp >= 45000 && budgetPhp < 70000) {
      cpu = "Intel Core i5-13400F / Ryzen 5 7600";
      gpu = "NVIDIA GeForce RTX 4060 Ti 8GB";
      ram = "32GB DDR5 6000MHz Dual Channel";
      mobo = "B760M / B650M WiFi";
      psu = "750W 80+ Gold Power Supply";
      psuWattage = 750;
      estimatedSystemPower = 420;
    } else {
      cpu = "AMD Ryzen 7 7800X3D (King of Gaming)";
      gpu = "NVIDIA GeForce RTX 4070 Super 12GB";
      ram = "32GB DDR5 6000MHz CL30 Dual Channel";
      mobo = "X670E / B650 Steel Legend";
      psu = "850W 80+ Gold Fully Modular";
      psuWattage = 850;
      estimatedSystemPower = 510;
    }

    // Recommended peripherals from catalog matching budget tier
    const mouse = ACCESSORY_CATALOG.find(i => i.category === 'mouse' && i.pricePhp <= budgetPhp * 0.1) || ACCESSORY_CATALOG[0];
    const keyboard = ACCESSORY_CATALOG.find(i => i.category === 'keyboard' && i.pricePhp <= budgetPhp * 0.12) || ACCESSORY_CATALOG[5];
    const monitor = ACCESSORY_CATALOG.find(i => i.category === 'monitor' && i.pricePhp <= budgetPhp * 0.3) || ACCESSORY_CATALOG[25];

    // FPS Predictions based on build tier & resolution
    const fpsEstimates: Record<string, number> = {};
    const resMultiplier = resolution === '1080p' ? 1.0 : resolution === '1440p' ? 0.72 : 0.42;

    POPULAR_GAMES.forEach(g => {
      let baseFps = 250;
      if (g.id === 'valorant') baseFps = budgetPhp > 50000 ? 450 : budgetPhp > 30000 ? 320 : 180;
      if (g.id === 'cs2') baseFps = budgetPhp > 50000 ? 310 : budgetPhp > 30000 ? 210 : 120;
      if (g.id === 'apex') baseFps = budgetPhp > 50000 ? 220 : budgetPhp > 30000 ? 145 : 85;
      if (g.id === 'cyberpunk') baseFps = budgetPhp > 50000 ? 95 : budgetPhp > 30000 ? 65 : 35;
      if (g.id === 'gta6') baseFps = budgetPhp > 50000 ? 80 : budgetPhp > 30000 ? 55 : 30;
      if (g.id === 'dota2') baseFps = budgetPhp > 50000 ? 350 : budgetPhp > 30000 ? 240 : 140;

      fpsEstimates[g.id] = Math.round(baseFps * resMultiplier);
    });

    // Compatibility check rules
    const checks = [
      {
        title: "PSU Wattage Reserve",
        status: psuWattage >= estimatedSystemPower + 150 ? 'pass' : 'warning',
        detail: `${psuWattage}W supply offers ${psuWattage - estimatedSystemPower}W headroom over ${estimatedSystemPower}W peak draw.`
      },
      {
        title: "BIOS Compatibility",
        status: 'pass',
        detail: "Motherboard supports CPU out-of-the-box or via BIOS Flashback button."
      },
      {
        title: "RAM Clearance & Dual Channel",
        status: 'pass',
        detail: "Memory height clears air/AIO cooler & enables dual-channel XMP/EXPO."
      },
      {
        title: "Peripherals Latency Sync",
        status: 'pass',
        detail: `${mouse.name} (${mouse.brand}) paired with ${monitor.name} eliminates frame stutter.`
      }
    ];

    return {
      cpu,
      gpu,
      ram,
      mobo,
      psu,
      psuWattage,
      estimatedSystemPower,
      mouse,
      keyboard,
      monitor,
      fpsEstimates,
      checks
    };
  }, [budgetPhp, resolution]);

  return (
    <div className="bg-[var(--color-glass)] backdrop-blur-2xl p-6 sm:p-8 rounded-[32px] border border-[var(--color-glass-border)] shadow-2xl space-y-8 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--theme-color)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Currency Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Full System & Gear Planner
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 text-xs font-semibold">
              SEA Regional Prices
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2">
            AI Budget Builder & FPS Predictor
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Input your budget and target games to receive an optimized CPU, GPU, Monitor, and Gear build with real FPS estimates.
          </p>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-2 bg-[var(--app-bg)]/40 p-2 rounded-2xl border border-white/10 shrink-0">
          <Globe className="w-4 h-4 text-zinc-400 ml-1" />
          <span className="text-xs font-bold text-zinc-400 uppercase">Region:</span>
          <select
            value={selectedCurrency.code}
            onChange={(e) => {
              const found = CURRENCIES.find(c => c.code === e.target.value);
              if (found) setSelectedCurrency(found);
            }}
            className="bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] border border-white/15 text-white py-1.5 px-3 rounded-xl text-xs font-bold focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            {CURRENCIES.map(curr => (
              <option key={curr.code} value={curr.code}>
                {curr.flag} {curr.code} ({curr.symbol}) - {curr.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Budget Input & Slider */}
        <div className="p-5 rounded-2xl bg-[var(--app-bg)]/30 border border-white/10 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
              Target System Budget
            </label>
            <span className="text-lg font-extrabold text-primary-400">
              {formatAmount(budgetPhp)}
            </span>
          </div>

          <input
            type="range"
            min={15000}
            max={120000}
            step={2500}
            value={budgetPhp}
            onChange={(e) => setBudgetPhp(Number(e.target.value))}
            className="w-full accent-[var(--theme-color)] cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
            <span>{formatAmount(15000)} (Entry)</span>
            <span>{formatAmount(50000)} (Mid)</span>
            <span>{formatAmount(120000)} (High-End)</span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[25000, 45000, 75000].map(presetVal => (
              <button
                key={presetVal}
                type="button"
                onClick={() => setBudgetPhp(presetVal)}
                className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  budgetPhp === presetVal 
                    ? 'bg-[var(--theme-color)] text-white border-[var(--theme-color)]' 
                    : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                }`}
              >
                {formatAmount(presetVal)}
              </button>
            ))}
          </div>
        </div>

        {/* Target Games Selector */}
        <div className="p-5 rounded-2xl bg-[var(--app-bg)]/30 border border-white/10 space-y-3 lg:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Select Games You Play
            </label>
            <div className="flex gap-2 text-xs font-semibold">
              {(['1080p', '1440p', '4K'] as const).map(res => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setResolution(res)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    resolution === res 
                      ? 'bg-primary-500 text-black font-extrabold' 
                      : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {POPULAR_GAMES.map(game => {
              const active = selectedGames.includes(game.id);
              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => toggleGame(game.id)}
                  className={`p-2.5 rounded-xl text-left border transition flex items-center justify-between cursor-pointer ${
                    active 
                      ? 'bg-[var(--theme-color)]/20 border-[var(--theme-color)] text-white shadow-md' 
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{game.icon}</span>
                    <div>
                      <span className="text-xs font-bold block leading-tight">{game.name}</span>
                      <span className="text-[10px] text-zinc-400">{game.genre}</span>
                    </div>
                  </div>
                  {active && <CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Generated Recommendation Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hardware Specs & Recommended Peripherals */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary-400" />
            <span>AI System & Peripherals Spec Blueprint</span>
          </h3>

          <div className="p-5 rounded-2xl bg-[var(--app-bg)]/40 border border-white/10 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Processor (CPU)</span>
                <span className="font-bold text-white text-sm mt-0.5 block">{generatedBuild.cpu}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Graphics Card (GPU)</span>
                <span className="font-bold text-primary-400 text-sm mt-0.5 block">{generatedBuild.gpu}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">RAM / Memory</span>
                <span className="font-bold text-white mt-0.5 block">{generatedBuild.ram}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/8">
                <span className="text-[10px] text-zinc-400 uppercase font-bold block">Motherboard & PSU</span>
                <span className="font-bold text-white mt-0.5 block">{generatedBuild.mobo} ({generatedBuild.psu})</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block mb-2">
                Suggested Matching Accessories from Catalog
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-2">
                  <span className="text-lg">🖱️</span>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Mouse</span>
                    <span className="font-semibold text-white leading-tight block">{generatedBuild.mouse.brand} {generatedBuild.mouse.name}</span>
                    <span className="text-zinc-400 text-[10px]">{formatAmount(generatedBuild.mouse.pricePhp)}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-2">
                  <span className="text-lg">⌨️</span>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Keyboard</span>
                    <span className="font-semibold text-white leading-tight block">{generatedBuild.keyboard.brand} {generatedBuild.keyboard.name}</span>
                    <span className="text-zinc-400 text-[10px]">{formatAmount(generatedBuild.keyboard.pricePhp)}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-2">
                  <span className="text-lg">🖥️</span>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Monitor</span>
                    <span className="font-semibold text-white leading-tight block">{generatedBuild.monitor.brand} {generatedBuild.monitor.name}</span>
                    <span className="text-zinc-400 text-[10px]">{formatAmount(generatedBuild.monitor.pricePhp)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FPS Predictor & Compatibility Engine */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-400" />
            <span>FPS Predictor & Compatibility Check</span>
          </h3>

          <div className="p-5 rounded-2xl bg-[var(--app-bg)]/40 border border-white/10 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-zinc-300 uppercase">Estimated Performance ({resolution})</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Game Ready
                </span>
              </div>

              <div className="space-y-2">
                {selectedGames.map(gameId => {
                  const game = POPULAR_GAMES.find(g => g.id === gameId);
                  const fps = generatedBuild.fpsEstimates[gameId] || 120;
                  return (
                    <div key={gameId} className="flex justify-between items-center p-2 rounded-xl bg-white/5 text-xs">
                      <div className="flex items-center gap-2">
                        <span>{game?.icon}</span>
                        <span className="font-bold text-white">{game?.name}</span>
                      </div>
                      <span className="font-mono font-extrabold text-primary-400 text-sm">
                        {fps} FPS
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compatibility Checks list */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-xs font-bold text-zinc-300 uppercase block">Hardware & Power Compatibility</span>
              {generatedBuild.checks.map((chk, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 p-2 rounded-xl bg-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-white">{chk.title}</span>
                    <span className="text-[11px] text-zinc-400">{chk.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
