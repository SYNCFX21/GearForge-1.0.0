import React, { useState } from 'react';
import { Bot, Cpu, Monitor, Zap, Loader2, Sparkles, ExternalLink, ShieldCheck, Download, Share2, X, Copy, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { AIPCBuildRequest, AIPCBuildResponse, Accessory, CategoryType } from '../types';

interface PCBuilderProps {
  onSaveLoadout?: (name: string, budget: number, playstyle: string, items: Accessory[]) => void;
}

export default function PCBuilder({ onSaveLoadout }: PCBuilderProps) {
  const [budget, setBudget] = useState<number>(40000);
  const [resolution, setResolution] = useState<string>('1080p');
  const [preferences, setPreferences] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIPCBuildResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(val);
  };

  const handleGenerateBuild = async () => {
    setIsLoading(true);
    setError(null);
    setAiResult(null);

    try {
      const requestBody: AIPCBuildRequest = {
        budget,
        preferences,
        resolution
      };

      const API_BASE = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_BASE}/api/gemini/build-pc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate PC build');
      }

      setAiResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const generateShareText = () => {
    if (!aiResult) return '';
    return `🔥 Check out my AI-Generated PC Build: ${aiResult.buildName}!\n\n` +
      `💰 Total Cost: ${formatCurrency(aiResult.totalCostPhp)}\n` +
      `🎮 Target: ${resolution}\n` +
      `${aiResult.estimatedFps1080p ? `⚡ ${aiResult.estimatedFps1080p}\n` : ''}\n` +
      `Parts:\n` +
      aiResult.parts.map(p => `- ${p.category.toUpperCase()}: ${p.brand} ${p.name}`).join('\n') +
      `\n\nBuilt with GearForge AI`;
  };

  const handleCopyText = () => {
    const shareText = generateShareText();
    if (shareText) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareBuild = () => {
    if (!aiResult) return;
    setShowShareModal(true);
  };

  const handleSaveAiLoadout = () => {
    if (!aiResult || !onSaveLoadout) return;

    // Convert PC parts into Accessory type for saving
    const mappedItems: Accessory[] = aiResult.parts.map(part => ({
      id: `ai-${part.name}-${Date.now()}-${Math.random()}`,
      name: part.name,
      brand: part.brand,
      category: part.category as any, // Using 'any' here since PC parts aren't strict Accessory categories, or map them to close matches
      pricePhp: part.pricePhp,
      description: part.description,
      specs: ['Recommended AI PC Build'],
      rating: 4.9,
      tier: 'premium' as const,
      isWireless: false,
      links: part.storeSearchLinks.map(l => ({
        storeName: l.storeName as any,
        url: l.url
      }))
    }));

    onSaveLoadout(aiResult.buildName, budget, `Resolution: ${resolution}`, mappedItems);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
        
        {/* Input Panel */}
        <div className="w-full md:w-[360px] shrink-0 bg-[var(--color-glass)] backdrop-blur-2xl border border-[var(--color-glass-border)] rounded-[32px] p-6 shadow-2xl self-start sticky top-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary-500/10 p-2.5 rounded-2xl border border-primary-500/20 shadow-inner shadow-[var(--theme-color)]/10">
              <Cpu className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">Build a PC</h2>
              <p className="text-xs text-zinc-400 font-semibold mt-0.5">AI-Powered PC Parts Picker</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2 font-mono">
                Budget (PHP)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₱</span>
                <input
                  type="number"
                  min={10000}
                  step={500}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full bg-[var(--app-bg)]/40 border border-white/10 rounded-2xl py-3 pl-8 pr-4 text-white font-extrabold font-mono focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-[var(--theme-color)] transition-all shadow-inner"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2 font-mono">
                Target Resolution
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['1080p', '1440p', '4K'].map(res => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`py-2 rounded-xl text-xs font-extrabold transition-all border ${
                      resolution === res 
                        ? 'bg-primary-500/20 border-primary-500/50 text-primary-400' 
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest block mb-2 font-mono">
                Preferences (Optional)
              </label>
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g., 'RGB everything', 'Stealth black build', 'Intel/Nvidia only', 'Need Wi-Fi'"
                rows={3}
                className="w-full bg-[var(--app-bg)]/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-[var(--theme-color)] transition-all resize-none shadow-inner custom-scrollbar"
              />
            </div>

            <button
              onClick={handleGenerateBuild}
              disabled={isLoading || budget < 10000}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-extrabold text-sm transition-all duration-300 shadow-xl ${
                isLoading || budget < 10000
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                  : 'bg-gradient-to-r from-[var(--theme-color)] to-[var(--theme-color)] text-black hover:opacity-90 active:scale-[0.98] cursor-pointer'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Build...
                </>
              ) : (
                <>
                  <Bot className="w-5 h-5" />
                  Generate PC Build
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="flex-1 min-h-[400px]">
          <AnimatePresence mode="wait">
            {!aiResult && !isLoading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 p-8 border border-white/5 rounded-[32px] bg-[var(--app-bg)]/20"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Monitor className="w-8 h-8 text-zinc-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Ready to Build</h3>
                  <p className="text-sm text-zinc-400 mt-1 max-w-sm mx-auto">Set your budget and preferences on the left to get a custom AI-recommended PC parts list tailored for local PH prices.</p>
                </div>
              </motion.div>
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full flex flex-col items-center justify-center space-y-6"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-[var(--theme-color)] animate-spin" />
                  <Cpu className="w-8 h-8 text-primary-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-extrabold text-white animate-pulse">SariSariGamerPH is thinking...</h3>
                  <p className="text-sm font-semibold text-primary-400">Canvassing prices in Gilmore & EasyPC...</p>
                </div>
              </motion.div>
            )}

            {error && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-950/30 border border-red-500/30 p-6 rounded-3xl text-center"
              >
                <Zap className="w-10 h-10 text-red-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white">Error</h3>
                <p className="text-red-400 text-sm mt-1">{error}</p>
              </motion.div>
            )}

            {aiResult && !isLoading && (
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
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary-400 bg-primary-500/10 px-2.5 py-0.5 rounded-full">
                        AI Recommended PC Build
                      </span>
                      <h3 className="text-xl font-extrabold text-white mt-1.5 uppercase font-display">{aiResult.buildName}</h3>
                      {aiResult.estimatedFps1080p && (
                        <p className="text-xs font-semibold text-emerald-400 mt-2">⚡ {aiResult.estimatedFps1080p}</p>
                      )}
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Estimated Cost</span>
                      <p className="text-xl font-extrabold text-primary-400 font-mono mt-0.5">{formatCurrency(aiResult.totalCostPhp)}</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed italic bg-[var(--app-bg)]/40 p-4 rounded-2xl border border-white/5 font-sans">
                    "{aiResult.rationale}"
                  </p>
                  
                  <div className="flex justify-end gap-3 pt-1">
                    <button
                      onClick={handleShareBuild}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition border border-white/10 active:scale-95 cursor-pointer"
                    >
                      {copied ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-zinc-400" />}
                      {copied ? 'Copied to Clipboard' : 'Share Build'}
                    </button>
                    {onSaveLoadout && (
                      <button
                        onClick={handleSaveAiLoadout}
                        className="flex items-center gap-2 bg-primary-500 hover:bg-[#00c8e0] text-black font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl transition shadow-[0_0_15px_rgba(0,229,255,0.25)] active:scale-95 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Save Build to Dashboard
                      </button>
                    )}
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {aiResult.parts.map((part, idx) => {
                    const CATEGORY_ICONS: Record<string, string> = {
                      cpu: 'https://images.unsplash.com/photo-1591799264318-f6a3611861c8?auto=format&fit=crop&w=150&q=80',
                      motherboard: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80',
                      gpu: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=150&q=80',
                      ram: 'https://images.unsplash.com/photo-1562976540-1502f7592383?auto=format&fit=crop&w=150&q=80',
                      storage: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=150&q=80',
                      case: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=150&q=80',
                      psu: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&w=150&q=80',
                      cooler: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=150&q=80'
                    };
                    const itemImageUrl = CATEGORY_ICONS[part.category.toLowerCase()] || CATEGORY_ICONS['cpu'];

                    return (
                      <div
                        key={idx}
                        className="bg-white/5 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row justify-between gap-6 hover:border-primary-500/50 transition-all shadow-xl group"
                      >
                        <div className="flex gap-4 md:max-w-[70%]">
                          <div className="hidden sm:block shrink-0 w-24 h-24 rounded-2xl overflow-hidden bg-white/5">
                            <img 
                              src={itemImageUrl} 
                              alt={part.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(part.category)}&background=18181b&color=00e5ff&size=150`;
                              }}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold uppercase tracking-widest text-primary-400 bg-primary-500/10 px-2.5 py-0.5 rounded-full">
                                {part.category}
                              </span>
                              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">{part.brand}</span>
                            </div>
                            <h4 className="text-lg font-bold text-white">{part.name}</h4>
                            <p className="text-sm text-zinc-400 leading-relaxed mt-1 font-medium">{part.description}</p>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between items-start md:items-end shrink-0 text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-white/8">
                          <div>
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-mono block">Estimated Price</span>
                            <span className="text-base font-extrabold text-primary-400 font-mono">{formatCurrency(part.pricePhp)}</span>
                          </div>
                          <div className="mt-4 space-y-1.5 w-full md:w-auto">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest font-mono block">Buy on PH Stores:</span>
                            <div className="flex flex-wrap justify-start md:justify-end gap-1.5">
                              {part.storeSearchLinks.map((store) => (
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

                <div className="flex justify-center pt-2 pb-6">
                  <button
                    onClick={handleGenerateBuild}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-extrabold text-sm px-6 py-3 rounded-2xl transition shadow-xl active:scale-95 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-primary-400" />
                    Try More AI Builds
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-[var(--app-bg)]/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#0a0a0c] border border-white/10 rounded-[32px] shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-extrabold text-white">Share Build</h3>
                <button onClick={() => setShowShareModal(false)} className="text-zinc-500 hover:text-white transition">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-center p-4 bg-white rounded-2xl">
                  {/* For QR code we encode a URL to our app with query params, or just the text if too long. 
                      Since text is long, let's just encode a placeholder link to the app for now or a shortened version */}
                  <QRCodeSVG 
                    value={window.location.origin + "/?shared=" + encodeURIComponent(aiResult?.buildName || "build")} 
                    size={200}
                    level={"L"}
                    includeMargin={false}
                  />
                </div>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-zinc-400 font-medium">Scan QR to view this build on your phone, or copy the build details below.</p>
                </div>
                
                <button
                  onClick={handleCopyText}
                  className="w-full flex justify-center items-center gap-2 bg-primary-500 hover:bg-[#00c8e0] text-black font-extrabold text-sm uppercase tracking-wider px-6 py-4 rounded-2xl transition shadow-[0_0_15px_rgba(0,229,255,0.25)] active:scale-95"
                >
                  {copied ? <ShieldCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Build Details'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
