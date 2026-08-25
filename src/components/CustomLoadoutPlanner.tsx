import React, { useState } from 'react';
import { CategoryType, AICustomPlannerResponse, Accessory } from '../types';
import { ACCESSORY_CATALOG } from '../data/accessories';
import { getReviewsForAccessory } from '../data/reviews';
import { Sparkles, Brain, DollarSign, HelpCircle, ArrowRight, Star, ExternalLink, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomLoadoutPlannerProps {
  onSaveLoadout: (name: string, budget: number, playstyle: string, items: any[]) => void;
}

/**
 * CustomLoadoutPlanner Component
 * AI-powered gaming accessory setup advisor. Collects user budget, target playstyle,
 * preferred peripheral categories, and custom notes, then queries the Gemini backend endpoint
 * `/api/gemini/suggest-accessories` for recommendations formatted in authentic PH Taglish.
 * 
 * @whereUsed
 * - `src/App.tsx` (rendered under the 'ai-planner' active tab)
 */
export default function CustomLoadoutPlanner({ onSaveLoadout }: CustomLoadoutPlannerProps) {
  const [budget, setBudget] = useState<number>(7500);
  const [preferences, setPreferences] = useState<string>('');
  const [requiredCategories, setRequiredCategories] = useState<CategoryType[]>(['mouse', 'keyboard', 'headset', 'mousepad']);
  const [playstyle, setPlaystyle] = useState<string>('Competitive FPS (Valorant)');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AICustomPlannerResponse | null>(null);

  const categories: { label: string; value: CategoryType }[] = [
    { label: 'Mouse', value: 'mouse' },
    { label: 'Keyboard', value: 'keyboard' },
    { label: 'Headset', value: 'headset' },
    { label: 'Mousepad', value: 'mousepad' },
    { label: 'Standalone Microphone', value: 'mic' },
    { label: 'Gaming Monitor', value: 'monitor' },
    { label: 'Controller', value: 'controller' },
    { label: 'Stereo Speakers', value: 'speakers' }
  ];

  /** Toggles category inclusion in requested AI loadout recommendations */
  const handleCategoryToggle = (value: CategoryType) => {
    if (requiredCategories.includes(value)) {
      setRequiredCategories(requiredCategories.filter(c => c !== value));
    } else {
      setRequiredCategories([...requiredCategories, value]);
    }
  };

  /** Dispatches suggestion request to backend `/api/gemini/suggest-accessories` endpoint */
  const handleSuggest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (budget <= 0) {
      setError("Please input a valid budget in PHP.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsApiKeyMissing(false);

    try {
      const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
      const response = await fetch(`${API_BASE}/api/gemini/suggest-accessories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          budget,
          preferences,
          requiredCategories,
          playstyle
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to retrieve custom AI recommendations.");
      }

      setAiResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please check your internet connection.");
      if (err.message?.includes("GEMINI_API_KEY") || err.message?.includes("key") || err.message?.includes("API key")) {
        setIsApiKeyMissing(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /** Formats a numeric value into Philippine Peso currency string */
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  /**
   * Adapts the AI accessory loadout response into standard Accessory objects
   * and invokes the onSaveLoadout callback to save to Firestore.
   */
  const handleSaveAiLoadout = () => {
    if (!aiResult) return;
    
    // Map AI result items into appropriate structure for saving
    const mappedItems = aiResult.items.map((item, index) => ({
      id: `ai-item-${index}`,
      name: item.name,
      brand: item.brand,
      category: item.category,
      pricePhp: item.pricePhp,
      description: item.description,
      specs: ['Recommended by AI'],
      rating: 4.8,
      tier: 'midrange' as const,
      isWireless: item.description.toLowerCase().includes('wireless'),
      links: item.storeSearchLinks.map(l => ({
        storeName: l.storeName as any,
        url: l.url
      }))
    }));

    onSaveLoadout(aiResult.loadoutName, budget, playstyle, mappedItems);
  };

  return (
    <div id="ai-planner-section" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Inputs Form */}
        <form onSubmit={handleSuggest} className="lg:col-span-5 bg-[#141821]/70 backdrop-blur-md p-6 rounded-3xl border border-white/8 shadow-lg space-y-6">
          <div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-predator-cyan animate-pulse" />
              <h2 className="text-xl font-extrabold text-white tracking-tight uppercase font-display">AI Accessory Consultant</h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Harness Gemini AI to formulate custom gear combinations specifically available in Philippine retail.
            </p>
          </div>

          {/* Budget Input */}
          <div className="space-y-1.5">
            <label htmlFor="ai-budget" className="text-[10px] font-bold text-predator-cyan/85 uppercase tracking-widest block font-mono">Custom PHP Budget</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-predator-cyan font-mono">₱</span>
              <input
                id="ai-budget"
                type="number"
                min="500"
                max="100000"
                value={budget}
                onChange={(e) => setBudget(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full bg-[var(--app-bg)]/40 border border-white/8 rounded-2xl py-3.5 pl-10 pr-12 font-bold text-white focus:outline-none focus:border-predator-cyan focus:ring-1 focus:ring-predator-cyan/30 font-mono"
              />
            </div>
          </div>

          {/* Playstyle Input */}
          <div className="space-y-1.5">
            <label htmlFor="ai-playstyle" className="text-[10px] font-bold text-predator-cyan/85 uppercase tracking-widest block font-mono">Playstyle or Favorite Games</label>
            <input
              id="ai-playstyle"
              type="text"
              value={playstyle}
              onChange={(e) => setPlaystyle(e.target.value)}
              placeholder="e.g. Valorant, DOTA 2, casual simulation, flight sim, cozy office"
              className="w-full bg-[var(--app-bg)]/40 border border-white/8 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-predator-cyan focus:ring-1 focus:ring-predator-cyan/30"
            />
          </div>

          {/* Custom Requirements Text */}
          <div className="space-y-1.5">
            <label htmlFor="ai-preferences" className="text-[10px] font-bold text-predator-cyan/85 uppercase tracking-widest block font-mono">Specific Design Preferences (Optional)</label>
            <textarea
              id="ai-preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g. White-themed accessories only, silent linear switches, or ultra-lightweight wireless mouse focus."
              className="w-full bg-[var(--app-bg)]/40 border border-white/8 rounded-2xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-predator-cyan focus:ring-1 focus:ring-predator-cyan/30 h-24 resize-none"
            />
          </div>

          {/* Required Categories Checklist */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-predator-cyan/85 uppercase tracking-widest block font-mono">Include in suggestion</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  id={`cat-toggle-${cat.value}`}
                  onClick={() => handleCategoryToggle(cat.value)}
                  className={`py-2.5 px-3 text-left rounded-xl text-xxs font-bold uppercase tracking-wider transition border flex items-center justify-between cursor-pointer ${
                    requiredCategories.includes(cat.value)
                      ? 'bg-predator-cyan/10 border-predator-cyan text-predator-cyan'
                      : 'bg-[var(--app-bg)]/10 border-white/5 text-zinc-400 hover:text-white hover:bg-[var(--app-bg)]/30'
                  }`}
                >
                  <span>{cat.label}</span>
                  {requiredCategories.includes(cat.value) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-predator-cyan shadow-[0_0_8px_rgba(0,242,255,0.8)] shrink-0 ml-1.5" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="ai-submit-btn"
            disabled={isLoading}
            className="w-full py-3.5 bg-[var(--theme-color)] hover:bg-[#0090e0] text-white font-extrabold rounded-2xl text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(0,163,255,0.2)]"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Planning Your Loadout...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 text-white" />
                <span>Analyze & Design Setup</span>
              </>
            )}
          </button>
        </form>

        {/* Right Hand: Presentation / Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading-panel"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#141821]/70 backdrop-blur-md border border-white/8 rounded-3xl p-12 text-center space-y-4"
              >
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-white/5" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-predator-cyan animate-spin" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-white text-lg uppercase font-display">Consulting local PH e-shops...</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Gemini is calculating Gilmore street pricing, checking keyboard modding favorites, and balancing your PHP budget limit.
                  </p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-predator-danger/10 border border-predator-danger/30 p-6 rounded-3xl text-center space-y-4"
              >
                <div className="p-3 bg-predator-danger/20 text-predator-danger rounded-full w-12 h-12 mx-auto flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="font-extrabold text-predator-danger text-base uppercase font-display">Unable to generate suggestions</h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {error}
                  </p>
                  {isApiKeyMissing && (
                    <div className="mt-4 p-4 bg-[var(--app-bg)]/40 border border-white/5 text-xxs text-zinc-400 rounded-2xl space-y-2 text-left">
                      <p className="font-bold text-white uppercase tracking-wider font-mono">💡 Action Required:</p>
                      <p className="leading-relaxed">
                        Please supply a valid Google Gemini API key by going to the **Secrets** or **Settings** panel on your AI Studio dashboard, and defining a key named <code className="bg-white/5 px-1.5 py-0.5 rounded text-predator-cyan font-mono">GEMINI_API_KEY</code>.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {!isLoading && !error && !aiResult && (
              <motion.div
                key="empty-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#141821]/40 border border-dashed border-white/10 rounded-3xl p-12 text-center space-y-3"
              >
                <Brain className="w-10 h-10 text-white/20 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-extrabold text-white uppercase font-display text-sm tracking-wider">Design an AI Recommendation Setup</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                    Input your target budget and specific preferences to see custom recommended, highly-rated Philippine gaming gear combinations.
                  </p>
                </div>
              </motion.div>
            )}

            {!isLoading && !error && aiResult && (
              <motion.div
                key="result-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Header Information Card */}
                <div className="bg-[#141821]/70 backdrop-blur-md p-6 rounded-3xl border border-white/8 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-predator-cyan bg-predator-cyan/10 px-2.5 py-0.5 rounded-full">
                        AI Recommended Loadout
                      </span>
                      <h3 className="text-xl font-extrabold text-white mt-1.5 uppercase font-display">{aiResult.loadoutName}</h3>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Estimated Cost</span>
                      <p className="text-xl font-extrabold text-predator-cyan font-mono mt-0.5">{formatCurrency(aiResult.totalCostPhp)}</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed italic bg-[var(--app-bg)]/40 p-4 rounded-2xl border border-white/5 font-sans">
                    "{aiResult.rationale}"
                  </p>

                  <div className="flex justify-end pt-1">
                    <button
                      id="save-ai-loadout"
                      onClick={handleSaveAiLoadout}
                      className="flex items-center gap-2 bg-[var(--theme-color)] hover:bg-[#0090e0] text-white font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition shadow-[0_0_15px_rgba(0,163,255,0.25)] active:scale-95 cursor-pointer"
                    >
                      Save AI Setup to Dashboard
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {aiResult.items.map((item, idx) => {
                    const matchedCatalogItem = ACCESSORY_CATALOG.find(
                      catItem => catItem.name.toLowerCase().includes(item.name.toLowerCase()) || 
                                 item.name.toLowerCase().includes(catItem.name.toLowerCase())
                    );
                    const reviewData = matchedCatalogItem ? getReviewsForAccessory(matchedCatalogItem) : null;
                    
                    const CATEGORY_IMAGES: Record<string, string> = {
                      mouse: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=400&q=80',
                      keyboard: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80',
                      headset: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=400&q=80',
                      mousepad: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=400&q=80',
                      mic: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80',
                      monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
                      controller: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=400&q=80',
                      speakers: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80'
                    };
                    const itemImageUrl = matchedCatalogItem?.imageUrl || CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES['mouse'];

                    return (
                      <div
                        key={idx}
                        className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row justify-between gap-6 hover:border-[var(--theme-color)]/50 transition-all shadow-xl group"
                      >
                        <div className="flex gap-4 md:max-w-[70%]">
                          <div className="hidden sm:block shrink-0 w-24 h-24 rounded-2xl overflow-hidden bg-white/5">
                            <img 
                              src={itemImageUrl} 
                              alt={item.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.category)}&background=18181b&color=00e5ff&size=150`;
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-widest text-[var(--theme-color)] bg-[var(--theme-color)]/10 px-2.5 py-0.5 rounded-full">
                                {item.category}
                              </span>
                              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">{item.brand}</span>
                            </div>
                            <h4 className="text-lg font-bold text-white">{item.name}</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed mt-1 font-medium">{item.description}</p>

                            {reviewData && (
                              <div className="mt-3 p-3 rounded-2xl bg-[var(--app-bg)]/20 border border-white/5 text-xs flex flex-col gap-1 max-w-lg">
                                <span className="font-semibold uppercase text-[10px] text-[var(--theme-color)] tracking-widest flex items-center gap-1.5">
                                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--theme-color)]" />
                                  PH Gamer Sentiment
                                </span>
                                <p className="text-zinc-400 italic">
                                  "{reviewData.communitySentiment}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col justify-between items-start md:items-end shrink-0 text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-white/8">
                          <div>
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-mono block">Estimated Price</span>
                            <span className="text-base font-extrabold text-predator-cyan font-mono">{formatCurrency(item.pricePhp)}</span>
                          </div>

                          <div className="mt-4 space-y-1.5 w-full md:w-auto">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Buy on PH Stores:</span>
                            <div className="flex flex-wrap justify-start md:justify-end gap-1.5">
                              {item.storeSearchLinks.map((store) => (
                                <a
                                  key={store.storeName}
                                  href={store.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-1 border border-white/5 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition py-2 px-3 rounded-xl text-xxs font-bold uppercase tracking-wider"
                                >
                                  {store.storeName}
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
