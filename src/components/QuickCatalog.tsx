import React, { useState, useMemo } from 'react';
import { ACCESSORY_CATALOG, BUDGET_TIERS } from '../data/accessories';
import { CategoryType, Accessory } from '../types';
import { Search, Star, ExternalLink, ShieldAlert, SlidersHorizontal, Gamepad, Sparkles, MessageSquare } from 'lucide-react';
import AccessoryReviewSection from './AccessoryReviewSection';

export default function QuickCatalog() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  const categories: { label: string; value: string }[] = [
    { label: 'All Peripherals', value: 'all' },
    { label: 'Mice', value: 'mouse' },
    { label: 'Keyboards', value: 'keyboard' },
    { label: 'Headsets', value: 'headset' },
    { label: 'Mousepads', value: 'mousepad' },
    { label: 'Microphones', value: 'mic' },
    { label: 'Monitors', value: 'monitor' },
    { label: 'Controllers', value: 'controller' },
    { label: 'Speakers', value: 'speakers' }
  ];

  const filteredItems = useMemo(() => {
    return ACCESSORY_CATALOG.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = selectedCategory === 'all' ? true : item.category === selectedCategory;
      const matchTier = selectedTier === 'all' ? true : item.tier === selectedTier;

      return matchSearch && matchCategory && matchTier;
    });
  }, [searchTerm, selectedCategory, selectedTier]);

  const toggleReviews = (id: string) => {
    setExpandedReviewId(prev => prev === id ? null : id);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div id="quick-catalog-section" className="space-y-6">
      {/* Filters Toolbar */}
      <div className="bg-[#141821]/70 backdrop-blur-md p-5 rounded-3xl border border-white/8 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-predator-cyan" />
          <input
            id="catalog-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search model, brand (e.g. Rakk)..."
            className="w-full bg-[var(--app-bg)]/40 border border-white/8 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-predator-cyan focus:ring-1 focus:ring-predator-cyan/30"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 font-mono uppercase tracking-widest">
            <SlidersHorizontal className="w-3.5 h-3.5 text-predator-cyan" />
            <span>Filters:</span>
          </div>

          {/* Category Selector */}
          <select
            id="catalog-cat-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[var(--app-bg)]/40 border border-white/8 text-white py-2 px-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-predator-cyan focus:ring-1 focus:ring-predator-cyan/30 font-mono"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value} className="bg-[#141821] text-white">
                {c.label}
              </option>
            ))}
          </select>

          {/* Budget Tier Selector */}
          <select
            id="catalog-tier-select"
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-[var(--app-bg)]/40 border border-white/8 text-white py-2 px-3 rounded-xl text-xs font-semibold focus:outline-none focus:border-predator-cyan focus:ring-1 focus:ring-predator-cyan/30 font-mono"
          >
            <option value="all" className="bg-[#141821] text-white">All Budgets</option>
            {BUDGET_TIERS.map((tier) => (
              <option key={tier.id} value={tier.id} className="bg-[#141821] text-white">
                {tier.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#141821]/70 backdrop-blur-md border border-white/8 rounded-3xl p-16 text-center space-y-2">
          <Gamepad className="w-8 h-8 text-white/20 mx-auto" />
          <h3 className="font-extrabold text-white uppercase font-display">Walang Nakita (No accessories found)</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Try resetting your search query or choosing another peripheral category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#141821]/70 backdrop-blur-md p-5 rounded-3xl border border-white/8 hover:border-predator-cyan/20 hover:shadow-lg transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-semibold text-[var(--theme-color)] bg-[var(--theme-color)]/10 px-3 py-1 rounded-full uppercase tracking-widest relative z-10 backdrop-blur-sm">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-400 relative z-10 bg-[var(--app-bg)]/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <Star className="w-3.5 h-3.5 fill-primary-400" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                {item.imageUrl && (
                  <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden bg-white/5 group">
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

                <div className="mt-3">
                  <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">{item.brand}</span>
                  <h3 className="font-bold text-white text-lg leading-tight mt-1">{item.name}</h3>
                  <p className="text-lg font-bold text-primary-400 mt-1.5">{formatCurrency(item.pricePhp)}</p>
                </div>

                <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">{item.description}</p>

                {/* Specs list */}
                <div className="mt-4 pt-3 border-t border-white/8 space-y-1.5">
                  <span className="text-[10px] font-bold text-predator-cyan/85 uppercase tracking-widest block font-mono">Key Specs</span>
                  <div className="flex flex-wrap gap-1">
                    {item.specs.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-zinc-300 bg-[var(--app-bg)]/40 px-2 py-1 border border-white/5 rounded-lg"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Purchase e-stores */}
              <div className="mt-6 pt-4 border-t border-white/8">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 font-mono">Check availability & pricing</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {item.links.map((link) => (
                    <a
                      key={link.storeName}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 border border-white/5 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition py-2 px-1 rounded-xl text-xxs font-bold uppercase tracking-wider font-mono"
                    >
                      {link.storeName}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Interactive Reviews Drawer */}
              <div className="mt-4 pt-3 border-t border-white/8">
                <button
                  type="button"
                  id={`btn-reviews-${item.id}`}
                  onClick={() => toggleReviews(item.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[var(--app-bg)]/40 hover:bg-[#141821]/80 border border-white/5 text-zinc-300 hover:text-white rounded-2xl text-xxs font-extrabold uppercase tracking-wider transition font-mono cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>
                    {expandedReviewId === item.id ? "Hide Gamer Reviews" : "Show Gamer Reviews & Opinions"}
                  </span>
                </button>

                {expandedReviewId === item.id && (
                  <AccessoryReviewSection accessory={item} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
