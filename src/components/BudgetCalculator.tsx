import React, { useState, useMemo } from 'react';
import { PlaystylePreset, Accessory, CategoryType } from '../types';
import { PLAYSTYLE_PRESETS, ACCESSORY_CATALOG, getRecommendedPresetLoadout } from '../data/accessories';
import { getReviewsForAccessory } from '../data/reviews';
import { Gamepad2, Crosshair, Tv, Monitor, Sparkles, ShoppingBag, Star, CheckCircle, Info, ExternalLink, ShieldCheck, Shuffle, RotateCcw, ArrowLeftRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BudgetCalculatorProps {
  initialBudget: number;
  onSaveLoadout: (name: string, budget: number, playstyle: string, items: Accessory[]) => void;
}

/**
 * BudgetCalculator Component
 * Interactive gaming gear budget calculator. Dynamically builds accessory loadouts
 * within the specified budget using playstyle category weightings, supports shuffling combinations,
 * manual item lock overrides, and direct save to Firestore loadouts.
 * 
 * @whereUsed
 * - `src/App.tsx` (rendered under the 'calculator' active tab)
 */
export default function BudgetCalculator({ initialBudget, onSaveLoadout }: BudgetCalculatorProps) {
  const [budget, setBudget] = useState<number>(initialBudget);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('allrounder');
  const [tempBudgetText, setTempBudgetText] = useState<string>(initialBudget.toString());
  
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);
  const [itemOverrides, setItemOverrides] = useState<Partial<Record<CategoryType, string>>>({});

  const activePreset = useMemo(() => {
    return PLAYSTYLE_PRESETS.find(p => p.id === selectedPresetId) || PLAYSTYLE_PRESETS[0];
  }, [selectedPresetId]);

  const recommendedItems = useMemo(() => {
    return getRecommendedPresetLoadout(budget, selectedPresetId, shuffleSeed, itemOverrides);
  }, [budget, selectedPresetId, shuffleSeed, itemOverrides]);

  const totalCost = useMemo(() => {
    return recommendedItems.reduce((acc, item) => acc + item.pricePhp, 0);
  }, [recommendedItems]);

  const remainingBudget = budget - totalCost;

  /** Clamps and updates the active budget limit */
  const handleBudgetChange = (value: number) => {
    const clamped = Math.max(500, Math.min(500000, value));
    setBudget(clamped);
    setTempBudgetText(clamped.toString());
  };

  /** Increments shuffle seed to cycle through alternative gear combinations */
  const handleShuffleCombinations = () => {
    setShuffleSeed(prev => prev + 1);
  };

  /** Resets shuffle seeds and removes all category item locks */
  const handleResetCombinations = () => {
    setShuffleSeed(0);
    setItemOverrides({});
  };

  /** Swaps a category item to the next alternative in the catalog */
  const handleSwapItem = (cat: CategoryType, currentId: string) => {
    const categoryCandidates = ACCESSORY_CATALOG.filter(i => i.category === cat);
    if (categoryCandidates.length <= 1) return;

    const currentIndex = categoryCandidates.findIndex(i => i.id === currentId);
    const nextIndex = (currentIndex + 1) % categoryCandidates.length;
    const nextItem = categoryCandidates[nextIndex];

    setItemOverrides(prev => ({
      ...prev,
      [cat]: nextItem.id
    }));
  };

  const handleTextBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(tempBudgetText, 10);
    if (!isNaN(parsed) && parsed > 0) {
      handleBudgetChange(parsed);
    }
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2': return <Gamepad2 className="w-5 h-5" />;
      case 'Crosshair': return <Crosshair className="w-5 h-5" />;
      case 'Tv': return <Tv className="w-5 h-5" />;
      case 'Monitor': return <Monitor className="w-5 h-5" />;
      default: return <Gamepad2 className="w-5 h-5" />;
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSave = () => {
    const loadoutName = `${activePreset.name} Setup (₱${budget.toLocaleString()})`;
    onSaveLoadout(loadoutName, budget, activePreset.name, recommendedItems);
  };

  return (
    <div id="budget-calculator-section" className="space-y-8">
      {/* Budget Input & Playstyle Selector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[var(--color-glass)] backdrop-blur-2xl p-8 rounded-[32px] border border-[var(--color-glass-border)] shadow-xl relative overflow-hidden">
        
        {/* Subtle top edge highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Left Column: Budget Tuning */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Set Your Gear Budget</h2>
            <p className="text-sm text-zinc-400 mt-1">Adjust your maximum spending limit.</p>
          </div>

          <form onSubmit={handleTextBudgetSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-[var(--theme-color)]">₱</span>
              <input
                id="budget-numeric-input"
                type="text"
                value={tempBudgetText}
                onChange={(e) => setTempBudgetText(e.target.value.replace(/[^0-9]/g, ''))}
                onBlur={() => {
                  const parsed = parseInt(tempBudgetText, 10);
                  if (!isNaN(parsed)) {
                    handleBudgetChange(parsed);
                  } else {
                    setTempBudgetText(budget.toString());
                  }
                }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-16 text-3xl font-extrabold text-white focus:outline-none focus:border-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)]/50 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold tracking-wider text-zinc-400">PHP</span>
            </div>

            <div className="space-y-3">
              <input
                id="budget-slider"
                type="range"
                min="1000"
                max="500000"
                step="500"
                value={budget}
                onChange={(e) => handleBudgetChange(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--theme-color)] focus:outline-none"
              />
              <div className="flex justify-between text-xs text-zinc-500 font-medium">
                <span>₱1,000</span>
                <span>₱250,000</span>
                <span>₱500,000</span>
              </div>
            </div>
          </form>

          {/* Quick Budget Presets */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-400">Quick Limits</label>
            <div className="grid grid-cols-4 gap-2">
              {[10000, 50000, 100000, 500000].map((presetVal) => (
                <button
                  key={presetVal}
                  id={`preset-btn-${presetVal}`}
                  onClick={() => handleBudgetChange(presetVal)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                    budget === presetVal
                      ? 'bg-[var(--theme-color)] border-[var(--theme-color)] text-white shadow-lg shadow-[var(--theme-color)]/30'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  ₱{(presetVal / 1000).toFixed(0)}K
                </button>
              ))}
            </div>
          </div>

          {/* Total Summary Mini Metric */}
          <div className="pt-6 border-t border-[var(--color-glass-border)] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-zinc-400">Total Setup Cost</span>
              <p className="text-2xl font-bold text-primary-400 mt-1">{formatCurrency(totalCost)}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-zinc-400">Remaining</span>
              <p className={`text-sm font-semibold mt-1 ${remainingBudget >= 0 ? 'text-[#00ff88]' : 'text-[var(--color-brand-red)]'}`}>
                {remainingBudget >= 0 ? '+' : ''}{formatCurrency(remainingBudget)}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Playstyle Presets */}
        <div className="lg:col-span-7 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Gaming Style</h2>
            <p className="text-sm text-zinc-400 mt-1">Adjusts item priorities and spending ratio.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLAYSTYLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                id={`playstyle-preset-${preset.id}`}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`p-5 text-left rounded-2xl border transition-all cursor-pointer ${
                  selectedPresetId === preset.id
                    ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-[var(--theme-color)]/10'
                    : 'border-white/10 hover:bg-white/5 bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl shrink-0 ${
                    selectedPresetId === preset.id
                      ? 'bg-[var(--theme-color)] text-white'
                      : 'bg-white/10 text-zinc-300'
                  }`}>
                    {getPresetIcon(preset.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{preset.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-1 font-medium">{preset.description}</p>
                  </div>
                </div>

                {/* Micro visual bars of percentages */}
                <div className="mt-4 flex gap-1 h-2 rounded-full overflow-hidden bg-white/5">
                  {Object.entries(preset.distribution).map(([cat, val]) => {
                    if (val === 0) return null;
                    let color = 'bg-primary-500';
                    if (cat === 'mouse') color = 'bg-[#00ff88]';
                    if (cat === 'keyboard') color = 'bg-[var(--theme-color)]';
                    if (cat === 'headset') color = 'bg-primary-500';
                    if (cat === 'mousepad') color = 'bg-[var(--color-brand-red)]';
                    if (cat === 'mic') color = 'bg-primary-500';
                    if (cat === 'monitor') color = 'bg-primary-400';
                    return (
                      <div
                        key={cat}
                        style={{ width: `${val}%` }}
                        title={`${cat}: ${val}%`}
                        className={`${color} h-full`}
                      />
                    );
                  })}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested Gear Outcome Cards */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--color-glass)] backdrop-blur-2xl p-6 rounded-[28px] border border-[var(--color-glass-border)] shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Suggested Equipment Combination</h2>
              {(shuffleSeed > 0 || Object.keys(itemOverrides).length > 0) && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/40 text-[10px] font-extrabold uppercase tracking-wider">
                  Custom Mix Active
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-400 mt-0.5">Handpicked local gear optimized for your ₱{budget.toLocaleString()} budget.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              id="shuffle-combinations-btn"
              onClick={handleShuffleCombinations}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-3 rounded-2xl transition-all border border-white/10 cursor-pointer active:scale-95 shadow-md"
              title="Rotate equipment brands and models within your budget range"
            >
              <Shuffle className="w-4 h-4 text-primary-400" />
              <span>Try More Combinations</span>
            </button>

            {(shuffleSeed > 0 || Object.keys(itemOverrides).length > 0) && (
              <button
                type="button"
                id="reset-mix-btn"
                onClick={handleResetCombinations}
                className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-semibold text-xs px-3.5 py-3 rounded-2xl transition-all border border-red-500/30 cursor-pointer active:scale-95"
                title="Reset to default best match combination"
              >
                <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                <span>Reset Mix</span>
              </button>
            )}

            <button
              id="save-loadout-btn"
              onClick={handleSave}
              className="flex items-center justify-center gap-2 bg-[var(--theme-color)] hover:bg-[#0090e0] text-white font-semibold text-xs px-5 py-3 rounded-2xl transition-all shadow-lg shadow-[var(--theme-color)]/30 active:scale-95 cursor-pointer shrink-0"
            >
              <CheckCircle className="w-4 h-4 text-white shrink-0" />
              <span>Save Setup</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {recommendedItems.map((item, index) => {
              const categoryItems = ACCESSORY_CATALOG.filter(i => i.category === item.category);
              const isOverridden = itemOverrides[item.category] === item.id;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="bg-[var(--color-glass)] backdrop-blur-2xl rounded-3xl border border-[var(--color-glass-border)] p-6 shadow-xl hover:border-white/20 transition flex flex-col justify-between relative overflow-hidden"
                >
                  <div>
                    {/* Category pill & Swap brand dropdown */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold text-zinc-300 bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider relative z-10 backdrop-blur-sm">
                        {item.category}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isOverridden && (
                          <span className="text-[10px] font-bold text-primary-400 bg-primary-500/10 px-2 py-0.5 rounded-md border border-primary-500/30">
                            Swapped
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-xs font-semibold text-primary-400 bg-[var(--app-bg)]/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                          <Star className="w-3.5 h-3.5 fill-primary-400" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Inline Item Selector / Brand Changer */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1 text-[11px] font-semibold text-zinc-400">
                        <span>Swap {item.category}:</span>
                        <button
                          type="button"
                          onClick={() => handleSwapItem(item.category, item.id)}
                          className="text-primary-400 hover:underline flex items-center gap-1 cursor-pointer"
                          title="Cycle to next brand or item in this category"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Cycle Brand</span>
                        </button>
                      </div>
                      <select
                        value={item.id}
                        onChange={(e) => {
                          setItemOverrides(prev => ({
                            ...prev,
                            [item.category]: e.target.value
                          }));
                        }}
                        className="w-full bg-[var(--app-bg)]/40 border border-white/15 text-white py-2 px-2.5 rounded-xl text-xs font-medium focus:outline-none focus:border-primary-500 transition-all cursor-pointer truncate"
                      >
                        {categoryItems.map(catItem => (
                          <option key={catItem.id} value={catItem.id} className="bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] text-white">
                            {catItem.brand} {catItem.name} - ₱{catItem.pricePhp.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>

                    {item.imageUrl && (
                      <div className="relative w-full h-36 mb-4 rounded-xl overflow-hidden bg-white/5 group">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.category)}&background=18181b&color=00e5ff&size=150`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                      </div>
                    )}

                    <div className="mt-1">
                      <span className="text-xs text-zinc-500 font-bold tracking-widest uppercase">{item.brand}</span>
                      <h3 className="font-extrabold text-white text-base leading-tight mt-0.5">{item.name}</h3>
                      <p className="text-xl font-bold text-primary-400 mt-1.5">{formatCurrency(item.pricePhp)}</p>
                    </div>

                    <p className="text-xs text-zinc-400 mt-2.5 line-clamp-3 leading-relaxed font-medium">{item.description}</p>

                    <div className="mt-3 space-y-1.5">
                      {item.specs.slice(0, 3).map((spec, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-zinc-300 font-medium">
                          <span className="text-primary-400 mt-0.5">•</span>
                          <span className="line-clamp-1">{spec}</span>
                        </div>
                      ))}
                    </div>

                    {/* Local Sentiment Highlight */}
                    <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1">
                      <span className="font-semibold text-[11px] text-zinc-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[var(--theme-color)]" />
                        Community Sentiment
                      </span>
                      <p className="text-xs text-zinc-400 italic line-clamp-2 leading-relaxed">
                        "{getReviewsForAccessory(item).communitySentiment}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[var(--color-glass-border)]">
                    <div className="grid grid-cols-3 gap-1.5">
                      {item.links.map((link) => (
                        <a
                          key={link.storeName}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 text-center font-medium text-[10px] py-2 px-1 rounded-xl border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/20 hover:text-white transition"
                        >
                          {link.storeName}
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
