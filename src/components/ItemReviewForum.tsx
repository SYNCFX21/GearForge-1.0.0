import React, { useState } from 'react';
import { ACCESSORY_CATALOG } from '../data/accessories';
import AccessoryReviewSection from './AccessoryReviewSection';
import { MessageSquare, Star, Search, Filter, ShieldCheck, Flame, Layers } from 'lucide-react';
import { CategoryType, Accessory, UserProfile } from '../types';

interface ItemReviewForumProps {
  currentUser?: UserProfile | null;
}

export default function ItemReviewForum({ currentUser }: ItemReviewForumProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Accessory>(ACCESSORY_CATALOG[0]);

  const filteredAccessories = ACCESSORY_CATALOG.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-[var(--color-glass)] backdrop-blur-2xl p-6 sm:p-8 rounded-[32px] border border-[var(--color-glass-border)] shadow-2xl space-y-6">
      
      {/* Forum Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5 w-max">
            <MessageSquare className="w-3.5 h-3.5" />
            PH Gaming Gear Review Forum
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-2">
            Item Review Hub & Community Discussions
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Share real user experiences, durability notes, and switch/sensor opinions for specific gear items.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative shrink-0 w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search gear model or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--app-bg)]/40 border border-white/15 text-white pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Main Forum Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Gear List Selector */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Select Gear Item ({filteredAccessories.length})
            </span>
            {/* Category Filter Pills */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[var(--app-bg)]/50 border border-white/10 text-zinc-300 py-1 px-2 rounded-lg text-xs font-semibold focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="mouse">Mice</option>
              <option value="keyboard">Keyboards</option>
              <option value="headset">Headsets</option>
              <option value="mousepad">Mousepads</option>
              <option value="monitor">Monitors</option>
              <option value="chair">Chairs</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredAccessories.map(item => {
              const isSelected = item.id === selectedItem.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                    isSelected 
                      ? 'bg-[var(--theme-color)]/20 border-[var(--theme-color)] text-white shadow-lg' 
                      : 'bg-[var(--app-bg)]/30 border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-10 h-10 object-cover rounded-lg border border-white/10 shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.category)}&background=18181b&color=00e5ff&size=150`;
                        }}
                      />
                    )}
                    <div>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">{item.brand} • {item.category}</span>
                      <h4 className="text-xs font-bold leading-tight text-white">{item.name}</h4>
                      <span className="text-xs font-bold text-primary-400">₱{item.pricePhp.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-primary-400 shrink-0">
                    <Star className="w-3.5 h-3.5 fill-primary-400" />
                    <span>{item.rating}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Embedded Forum & Review Thread */}
        <div className="lg:col-span-7 bg-[var(--app-bg)]/40 border border-white/10 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                Item Discussion Thread
              </span>
              <h3 className="text-lg font-extrabold text-white">{selectedItem.brand} {selectedItem.name}</h3>
            </div>
            <span className="text-lg font-extrabold text-primary-400">
              ₱{selectedItem.pricePhp.toLocaleString()}
            </span>
          </div>

          {/* Render Full Item Review & Comment Section */}
          <AccessoryReviewSection accessory={selectedItem} currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}
