import React, { useState, useMemo } from 'react';
import { ACCESSORY_CATALOG } from '../data/accessories';
import { getReviewsForAccessory } from '../data/reviews';
import { Accessory, CategoryType } from '../types';
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  Check, 
  X, 
  ShieldAlert, 
  ShoppingCart, 
  ExternalLink, 
  HelpCircle, 
  ShieldCheck, 
  MessageSquare, 
  Filter,
  Search,
  Trophy,
  ArrowRightLeft,
  Zap,
  TrendingUp,
  CheckCircle2,
  Plus,
  Layers,
  ThumbsUp
} from 'lucide-react';

type CompareGroup = 'all' | 'mouse' | 'keyboard' | 'headset' | 'others';

const CATEGORY_GROUPS: { id: CompareGroup; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '⚡' },
  { id: 'mouse', label: 'Mouse', icon: '🖱️' },
  { id: 'keyboard', label: 'Keyboard', icon: '⌨️' },
  { id: 'headset', label: 'Headset', icon: '🎧' },
  { id: 'others', label: 'Others', icon: '🔌' },
];

const getCategoryGroup = (category: CategoryType): 'mouse' | 'keyboard' | 'headset' | 'others' => {
  if (category === 'mouse') return 'mouse';
  if (category === 'keyboard') return 'keyboard';
  if (category === 'headset') return 'headset';
  return 'others';
};

export default function CompareAccessories() {
  const [leftCategory, setLeftCategory] = useState<CompareGroup>('all');
  const [rightCategory, setRightCategory] = useState<CompareGroup>('all');

  const [leftId, setLeftId] = useState<string>(ACCESSORY_CATALOG[0].id);
  const [rightId, setRightId] = useState<string>(ACCESSORY_CATALOG[1].id);

  // Search state for Item A and Item B
  const [searchQueryA, setSearchQueryA] = useState('');
  const [searchQueryB, setSearchQueryB] = useState('');
  const [showSearchModalFor, setShowSearchModalFor] = useState<'A' | 'B' | null>(null);
  const [globalSearchModalQuery, setGlobalSearchModalQuery] = useState('');

  const mouseItems = useMemo(() => ACCESSORY_CATALOG.filter(i => getCategoryGroup(i.category) === 'mouse'), []);
  const keyboardItems = useMemo(() => ACCESSORY_CATALOG.filter(i => getCategoryGroup(i.category) === 'keyboard'), []);
  const headsetItems = useMemo(() => ACCESSORY_CATALOG.filter(i => getCategoryGroup(i.category) === 'headset'), []);
  const otherItems = useMemo(() => ACCESSORY_CATALOG.filter(i => getCategoryGroup(i.category) === 'others'), []);

  const getFilteredItems = (catGroup: CompareGroup, query: string = '') => {
    let items = ACCESSORY_CATALOG;
    if (catGroup === 'mouse') items = mouseItems;
    if (catGroup === 'keyboard') items = keyboardItems;
    if (catGroup === 'headset') items = headsetItems;
    if (catGroup === 'others') items = otherItems;

    if (!query.trim()) return items;

    const q = query.toLowerCase();
    return items.filter(i => 
      i.name.toLowerCase().includes(q) || 
      i.brand.toLowerCase().includes(q) || 
      i.category.toLowerCase().includes(q) ||
      i.specs.some(s => s.toLowerCase().includes(q))
    );
  };

  const filteredItemsA = useMemo(() => getFilteredItems(leftCategory, searchQueryA), [leftCategory, searchQueryA]);
  const filteredItemsB = useMemo(() => getFilteredItems(rightCategory, searchQueryB), [rightCategory, searchQueryB]);

  const handleLeftCategoryChange = (newCat: CompareGroup) => {
    setLeftCategory(newCat);
    const items = getFilteredItems(newCat, searchQueryA);
    if (items.length > 0 && !items.some(i => i.id === leftId)) {
      setLeftId(items[0].id);
    }
  };

  const handleRightCategoryChange = (newCat: CompareGroup) => {
    setRightCategory(newCat);
    const items = getFilteredItems(newCat, searchQueryB);
    if (items.length > 0 && !items.some(i => i.id === rightId)) {
      setRightId(items[0].id);
    }
  };

  const swapItems = () => {
    const tempId = leftId;
    setLeftId(rightId);
    setRightId(tempId);
  };

  const leftItem = useMemo(() => {
    return ACCESSORY_CATALOG.find(i => i.id === leftId) || ACCESSORY_CATALOG[0];
  }, [leftId]);

  const rightItem = useMemo(() => {
    return ACCESSORY_CATALOG.find(i => i.id === rightId) || ACCESSORY_CATALOG[1];
  }, [rightId]);

  const leftReviewsData = useMemo(() => getReviewsForAccessory(leftItem), [leftItem]);
  const rightReviewsData = useMemo(() => getReviewsForAccessory(rightItem), [rightItem]);

  const leftProsAndCons = useMemo(() => {
    const isLocalBrand = ['Rakk', 'Tecware'].includes(leftItem.brand);
    const isBudget = leftItem.pricePhp < 1500;
    
    const pros = [
      leftItem.isWireless ? 'Zero cable drag (Wireless setup)' : 'Reliable wired connection (No battery anxiety)',
      isLocalBrand ? 'Affordable local PH warranty & replacement' : 'Global trusted brand & premium build standard',
      isBudget ? 'Excellent entry price for beginners' : 'Elite performance components'
    ];
    
    const cons = [
      isLocalBrand ? 'Slightly plastic/light casing shell' : 'Import pricing carries brand premium',
      isBudget ? 'Basic micro-switches' : 'Requires higher initial budget save-up'
    ];
    return { pros, cons };
  }, [leftItem]);

  const rightProsAndCons = useMemo(() => {
    const isLocalBrand = ['Rakk', 'Tecware'].includes(rightItem.brand);
    const isBudget = rightItem.pricePhp < 1500;
    
    const pros = [
      rightItem.isWireless ? 'Zero cable drag (Wireless setup)' : 'Reliable wired connection (No battery anxiety)',
      isLocalBrand ? 'Affordable local PH warranty & replacement' : 'Global trusted brand & premium build standard',
      isBudget ? 'Excellent entry price for beginners' : 'Elite performance components'
    ];
    
    const cons = [
      isLocalBrand ? 'Slightly plastic/light casing shell' : 'Import pricing carries brand premium',
      isBudget ? 'Basic micro-switches' : 'Requires higher initial budget save-up'
    ];
    return { pros, cons };
  }, [rightItem]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  // Automated Winner & Recommendation Analysis
  const comparisonRecommendation = useMemo(() => {
    const priceDiff = Math.abs(leftItem.pricePhp - rightItem.pricePhp);
    const cheaperItem = leftItem.pricePhp <= rightItem.pricePhp ? leftItem : rightItem;
    const higherRatedItem = leftItem.rating >= rightItem.rating ? leftItem : rightItem;
    
    let verdictTitle = "";
    let verdictDetail = "";
    let recommendedChoice = leftItem;

    if (leftItem.category === rightItem.category) {
      if (leftItem.pricePhp < rightItem.pricePhp && leftItem.rating >= rightItem.rating) {
        verdictTitle = `${leftItem.brand} ${leftItem.name} takes the Value Victory!`;
        verdictDetail = `Costs ₱${priceDiff.toLocaleString()} less while maintaining equal or higher community rating (${leftItem.rating}★ vs ${rightItem.rating}★).`;
        recommendedChoice = leftItem;
      } else if (rightItem.pricePhp < leftItem.pricePhp && rightItem.rating >= leftItem.rating) {
        verdictTitle = `${rightItem.brand} ${rightItem.name} wins the Value-for-Money Matchup!`;
        verdictDetail = `Save ₱${priceDiff.toLocaleString()} without compromising on user feedback (${rightItem.rating}★ vs ${leftItem.rating}★).`;
        recommendedChoice = rightItem;
      } else {
        verdictTitle = `Balanced Matchup between ${leftItem.brand} & ${rightItem.brand}`;
        verdictDetail = `Both items cater to distinct budget tiers. ${cheaperItem.brand} is better for entry savings, while ${higherRatedItem.brand} offers premium enthusiast specs.`;
        recommendedChoice = higherRatedItem;
      }
    } else {
      verdictTitle = `Cross-Category Comparison: ${leftItem.category.toUpperCase()} vs ${rightItem.category.toUpperCase()}`;
      verdictDetail = `Comparing different gear categories! Ensure your overall build has a balanced allocation between mouse, keyboard, and audio.`;
      recommendedChoice = higherRatedItem;
    }

    return {
      verdictTitle,
      verdictDetail,
      recommendedChoice,
      priceDiff,
      cheaperItem,
      higherRatedItem
    };
  }, [leftItem, rightItem]);

  // Modal search results
  const globalSearchResults = useMemo(() => {
    if (!globalSearchModalQuery.trim()) return ACCESSORY_CATALOG;
    const q = globalSearchModalQuery.toLowerCase();
    return ACCESSORY_CATALOG.filter(i => 
      i.name.toLowerCase().includes(q) ||
      i.brand.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      i.specs.some(s => s.toLowerCase().includes(q))
    );
  }, [globalSearchModalQuery]);

  return (
    <div id="accessory-comparison-section" className="space-y-8 bg-[var(--color-glass)] backdrop-blur-2xl p-6 sm:p-8 rounded-[32px] border border-[var(--color-glass-border)] shadow-xl relative overflow-hidden">
      
      {/* Subtle top edge highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Header & Swap Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5 w-max mb-2">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Side-by-Side Gear Matchup
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Side-by-Side Equipment Comparison</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Search or select any two accessories to inspect specifications, pricing, community sentiment, and spec winner badges.
          </p>
        </div>

        {/* Action Controls: Swap & Global Search */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={swapItems}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition flex items-center gap-2 cursor-pointer"
            title="Swap Item A and Item B"
          >
            <ArrowRightLeft className="w-4 h-4 text-primary-400" />
            <span>Swap Positions</span>
          </button>
        </div>
      </div>

      {/* AI Comparison Recommendation Banner */}
      <div className="bg-gradient-to-r from-[var(--theme-color)]/20 via-purple-950/30 to-black p-5 sm:p-6 rounded-2xl border border-[var(--theme-color)]/40 shadow-lg space-y-3 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-500 text-black shrink-0">
              <Trophy className="w-5 h-5 fill-black" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-primary-400 uppercase tracking-wider block">
                AI Matchup Analysis & Smart Verdict
              </span>
              <h3 className="text-base font-extrabold text-white">{comparisonRecommendation.verdictTitle}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recommended: {comparisonRecommendation.recommendedChoice.brand} {comparisonRecommendation.recommendedChoice.name}</span>
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          {comparisonRecommendation.verdictDetail}
        </p>

        {/* Feature Roadmap & Suggestions */}
        <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Latency & Switch Matchup</span>
              <span className="text-[10px] text-zinc-400">Compares 1000Hz vs 4000Hz polling rates</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Price Savings Differential</span>
              <span className="text-[10px] text-zinc-400">Difference: ₱{comparisonRecommendation.priceDiff.toLocaleString()}</span>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/8 flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-primary-400 shrink-0" />
            <div>
              <span className="font-bold text-white block">Community Sentiment</span>
              <span className="text-[10px] text-zinc-400">Verified reviews & durability notes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Left Item Selector & Presentation (Item A) */}
        <div className="space-y-5">
          <div className="space-y-3 p-4 rounded-2xl bg-[var(--app-bg)]/30 border border-white/10">
            <div className="flex justify-between items-center">
              <label htmlFor="compare-select-left" className="text-xs font-bold text-zinc-300 tracking-wider uppercase flex items-center gap-1.5">
                <span>Compare Item A</span>
                {leftItem.pricePhp < rightItem.pricePhp && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                    Cheaper Option
                  </span>
                )}
              </label>
              
              <button
                type="button"
                onClick={() => {
                  setGlobalSearchModalQuery('');
                  setShowSearchModalFor('A');
                }}
                className="text-xs text-primary-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Specific Item...</span>
              </button>
            </div>

            {/* Direct Specific Item Search Box A */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Type model name (e.g. VXE, G304, R65, Razer)..."
                value={searchQueryA}
                onChange={(e) => setSearchQueryA(e.target.value)}
                className="w-full bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] border border-white/15 text-white pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-primary-500"
              />
              {searchQueryA && (
                <button 
                  onClick={() => setSearchQueryA('')} 
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills for Item A */}
            <div className="flex flex-wrap gap-1 p-1 bg-[var(--app-bg)]/40 rounded-xl border border-white/10">
              {CATEGORY_GROUPS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleLeftCategoryChange(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    leftCategory === cat.id
                      ? 'bg-[var(--theme-color)] text-white shadow-md shadow-[var(--theme-color)]/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Item Drop List for Item A */}
            <select
              id="compare-select-left"
              value={leftId}
              onChange={(e) => setLeftId(e.target.value)}
              className="w-full bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] border border-white/15 text-white py-3 px-3 rounded-xl text-xs focus:outline-none focus:border-[var(--theme-color)] font-medium cursor-pointer"
            >
              {filteredItemsA.length === 0 ? (
                <option value="" disabled className="bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] text-zinc-500">No matching items found</option>
              ) : (
                filteredItemsA.map((item) => (
                  <option key={item.id} value={item.id} className="bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] text-white">
                    [{item.category.toUpperCase()}] {item.brand} {item.name} - ₱{item.pricePhp.toLocaleString()}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Item A Card Detail */}
          <div className="border border-white/10 bg-white/5 p-6 rounded-[24px] space-y-6 shadow-lg relative">
            {leftItem.imageUrl && (
              <div className="w-full h-48 rounded-xl overflow-hidden bg-white/5 relative group">
                <img 
                  src={leftItem.imageUrl} 
                  alt={leftItem.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(leftItem.category)}&background=18181b&color=00e5ff&size=150`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
              </div>
            )}

            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-semibold tracking-widest text-[var(--theme-color)] bg-[var(--theme-color)]/10 px-3 py-1 rounded-full uppercase">
                  {leftItem.category}
                </span>
                <h4 className="font-extrabold text-xl text-white mt-3 leading-tight">{leftItem.brand} {leftItem.name}</h4>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-bold text-white">{formatCurrency(leftItem.pricePhp)}</span>
                <div className="flex items-center gap-1.5 justify-end text-sm font-semibold text-primary-400 mt-1">
                  <Star className="w-4 h-4 fill-primary-400 text-primary-400" />
                  <span>{leftItem.rating}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-400 italic leading-relaxed">"{leftItem.description}"</p>

            {/* Specifications comparison list */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider block uppercase">Key Specifications</span>
              <ul className="space-y-2">
                {leftItem.specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-[var(--theme-color)] shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pros & Cons comparison list */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-emerald-400 tracking-wider block uppercase">Local Pros</span>
                  <ul className="space-y-1.5">
                    {leftProsAndCons.pros.map((pro, i) => (
                      <li key={i} className="text-xs text-zinc-400 leading-relaxed font-medium">
                        • {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[var(--color-brand-red)] tracking-wider block uppercase">Local Cons</span>
                  <ul className="space-y-1.5">
                    {leftProsAndCons.cons.map((con, i) => (
                      <li key={i} className="text-xs text-zinc-400 leading-relaxed font-medium">
                        • {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Community Sentiment & Opinions Comparison */}
            <div className="space-y-4 pt-4 border-t border-white/10 bg-[var(--app-bg)]/20 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary-400 tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>PH Community Opinion</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed italic">
                "{leftReviewsData.communitySentiment}"
              </p>

              <div className="space-y-3 mt-4">
                <span className="text-xs font-semibold text-zinc-400 tracking-wider block uppercase">Top Review Feedback</span>
                {leftReviewsData.reviews.slice(0, 2).map((rev, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-3 rounded-xl text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">{rev.user}</span>
                      <div className="flex items-center gap-1 text-primary-400 font-semibold">
                        <Star className="w-3 h-3 fill-primary-400 text-primary-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-zinc-400 italic font-medium leading-relaxed">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="pt-5 border-t border-white/10 space-y-3">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider block uppercase">E-Shop Availability</span>
              <div className="grid grid-cols-3 gap-2">
                {leftItem.links.map((link) => (
                  <a
                    key={link.storeName}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition py-2.5 px-2 rounded-xl text-xs font-semibold tracking-wider"
                  >
                    {link.storeName}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Item Selector & Presentation (Item B) */}
        <div className="space-y-5">
          <div className="space-y-3 p-4 rounded-2xl bg-[var(--app-bg)]/30 border border-white/10">
            <div className="flex justify-between items-center">
              <label htmlFor="compare-select-right" className="text-xs font-bold text-zinc-300 tracking-wider uppercase flex items-center gap-1.5">
                <span>Compare Item B</span>
                {rightItem.pricePhp < leftItem.pricePhp && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">
                    Cheaper Option
                  </span>
                )}
              </label>

              <button
                type="button"
                onClick={() => {
                  setGlobalSearchModalQuery('');
                  setShowSearchModalFor('B');
                }}
                className="text-xs text-primary-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Specific Item...</span>
              </button>
            </div>

            {/* Direct Specific Item Search Box B */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Type model name (e.g. VXE, G304, R65, Razer)..."
                value={searchQueryB}
                onChange={(e) => setSearchQueryB(e.target.value)}
                className="w-full bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] border border-white/15 text-white pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-primary-500"
              />
              {searchQueryB && (
                <button 
                  onClick={() => setSearchQueryB('')} 
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills for Item B */}
            <div className="flex flex-wrap gap-1 p-1 bg-[var(--app-bg)]/40 rounded-xl border border-white/10">
              {CATEGORY_GROUPS.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleRightCategoryChange(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    rightCategory === cat.id
                      ? 'bg-[var(--theme-color)] text-white shadow-md shadow-[var(--theme-color)]/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-xs">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Item Drop List for Item B */}
            <select
              id="compare-select-right"
              value={rightId}
              onChange={(e) => setRightId(e.target.value)}
              className="w-full bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] border border-white/15 text-white py-3 px-3 rounded-xl text-xs focus:outline-none focus:border-[var(--theme-color)] font-medium cursor-pointer"
            >
              {filteredItemsB.length === 0 ? (
                <option value="" disabled className="bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] text-zinc-500">No matching items found</option>
              ) : (
                filteredItemsB.map((item) => (
                  <option key={item.id} value={item.id} className="bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] text-white">
                    [{item.category.toUpperCase()}] {item.brand} {item.name} - ₱{item.pricePhp.toLocaleString()}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Item B Card Detail */}
          <div className="border border-white/10 bg-white/5 p-6 rounded-[24px] space-y-6 shadow-lg relative">
            {rightItem.imageUrl && (
              <div className="w-full h-48 rounded-xl overflow-hidden bg-white/5 relative group">
                <img 
                  src={rightItem.imageUrl} 
                  alt={rightItem.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rightItem.category)}&background=18181b&color=00e5ff&size=150`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
              </div>
            )}

            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-semibold tracking-widest text-[var(--theme-color)] bg-[var(--theme-color)]/10 px-3 py-1 rounded-full uppercase">
                  {rightItem.category}
                </span>
                <h4 className="font-extrabold text-xl text-white mt-3 leading-tight">{rightItem.brand} {rightItem.name}</h4>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-bold text-white">{formatCurrency(rightItem.pricePhp)}</span>
                <div className="flex items-center gap-1.5 justify-end text-sm font-semibold text-primary-400 mt-1">
                  <Star className="w-4 h-4 fill-primary-400 text-primary-400" />
                  <span>{rightItem.rating}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-zinc-400 italic leading-relaxed">"{rightItem.description}"</p>

            {/* Specifications comparison list */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider block uppercase">Key Specifications</span>
              <ul className="space-y-2">
                {rightItem.specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-[var(--theme-color)] shrink-0 mt-0.5" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pros & Cons comparison list */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-emerald-400 tracking-wider block uppercase">Local Pros</span>
                  <ul className="space-y-1.5">
                    {rightProsAndCons.pros.map((pro, i) => (
                      <li key={i} className="text-xs text-zinc-400 leading-relaxed font-medium">
                        • {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[var(--color-brand-red)] tracking-wider block uppercase">Local Cons</span>
                  <ul className="space-y-1.5">
                    {rightProsAndCons.cons.map((con, i) => (
                      <li key={i} className="text-xs text-zinc-400 leading-relaxed font-medium">
                        • {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Community Sentiment & Opinions Comparison */}
            <div className="space-y-4 pt-4 border-t border-white/10 bg-[var(--app-bg)]/20 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-primary-400 tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>PH Community Opinion</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed italic">
                "{rightReviewsData.communitySentiment}"
              </p>

              <div className="space-y-3 mt-4">
                <span className="text-xs font-semibold text-zinc-400 tracking-wider block uppercase">Top Review Feedback</span>
                {rightReviewsData.reviews.slice(0, 2).map((rev, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-3 rounded-xl text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">{rev.user}</span>
                      <div className="flex items-center gap-1 text-primary-400 font-semibold">
                        <Star className="w-3 h-3 fill-primary-400 text-primary-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-zinc-400 italic font-medium leading-relaxed">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="pt-5 border-t border-white/10 space-y-3">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider block uppercase">E-Shop Availability</span>
              <div className="grid grid-cols-3 gap-2">
                {rightItem.links.map((link) => (
                  <a
                    key={link.storeName}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition py-2.5 px-2 rounded-xl text-xs font-semibold tracking-wider"
                  >
                    {link.storeName}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Quick Search Modal */}
      {showSearchModalFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--app-bg)]/80 backdrop-blur-xl">
          <div className="bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] border border-white/20 rounded-[32px] p-6 max-w-xl w-full shadow-2xl space-y-4 relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Select Specific Gear for Position {showSearchModalFor}</h3>
                <p className="text-xs text-zinc-400">Search through all 33+ catalog items by name, switch, or price</p>
              </div>
              <button 
                onClick={() => setShowSearchModalFor(null)} 
                className="p-2 rounded-full bg-white/10 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Type brand or model (e.g., RAKK, Razer, Tecware, IEM, Monitor)..."
                value={globalSearchModalQuery}
                onChange={(e) => setGlobalSearchModalQuery(e.target.value)}
                autoFocus
                className="w-full bg-[var(--app-bg)]/50 border border-white/15 text-white pl-10 pr-4 py-3 rounded-2xl text-xs focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="overflow-y-auto space-y-2 pr-1 flex-1 max-h-[400px]">
              {globalSearchResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (showSearchModalFor === 'A') {
                      setLeftId(item.id);
                    } else {
                      setRightId(item.id);
                    }
                    setShowSearchModalFor(null);
                  }}
                  className="w-full text-left p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-xl border border-white/10 shrink-0" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.category)}&background=18181b&color=00e5ff&size=150`;
                        }}
                      />
                    )}
                    <div>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">{item.brand} • {item.category}</span>
                      <h4 className="text-xs font-bold text-white group-hover:text-primary-400 transition">{item.name}</h4>
                      <span className="text-xs font-bold text-primary-400">₱{item.pricePhp.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary-400 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-primary-400" />
                    <span>{item.rating}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


