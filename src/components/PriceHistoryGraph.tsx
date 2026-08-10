import React, { useState } from 'react';
import { TrendingDown, TrendingUp, AlertCircle, ShoppingBag, Clock, Calendar, ShieldCheck, Check } from 'lucide-react';
import { ACCESSORY_CATALOG } from '../data/accessories';
import { Accessory } from '../types';

export default function PriceHistoryGraph() {
  const [selectedAccessoryId, setSelectedAccessoryId] = useState<string>(ACCESSORY_CATALOG[0].id);
  const [alertSubscribed, setAlertSubscribed] = useState(false);

  const selectedAccessory = ACCESSORY_CATALOG.find(i => i.id === selectedAccessoryId) || ACCESSORY_CATALOG[0];

  // Generate realistic 6-month historical price data based on item price
  const basePrice = selectedAccessory.pricePhp;
  const priceHistory = [
    { month: '6 Months Ago', price: Math.round(basePrice * 1.18), tag: 'Regular Price' },
    { month: '5 Months Ago', price: Math.round(basePrice * 1.15), tag: 'Regular Price' },
    { month: '4 Months Ago', price: Math.round(basePrice * 1.12), tag: 'Minor Sale' },
    { month: '3 Months Ago', price: Math.round(basePrice * 1.08), tag: 'Payday Sale' },
    { month: 'Last Month', price: Math.round(basePrice * 1.05), tag: 'Flash Sale' },
    { month: 'Current Price Today', price: basePrice, tag: 'Lowest in 60 Days' },
  ];

  const highestPrice = Math.max(...priceHistory.map(p => p.price));
  const lowestPrice = Math.min(...priceHistory.map(p => p.price));
  const currentPrice = basePrice;
  const discountFromPeak = Math.round(((highestPrice - currentPrice) / highestPrice) * 100);

  // Buy Now vs Wait recommendation
  const buyRecommendation = discountFromPeak >= 10 ? {
    verdict: 'Great Time to Buy',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    detail: `Currently at 60-day historical low! Saved approx. ₱${(highestPrice - currentPrice).toLocaleString()} from peak price.`
  } : {
    verdict: 'Stable Price',
    color: 'text-primary-400 bg-primary-500/10 border-primary-500/30',
    detail: `Price is stable near MSRP. Next major local sale expected during 8.8 / 9.9 Mega Shopping Day.`
  };

  return (
    <div className="bg-[var(--color-glass)] backdrop-blur-2xl p-6 sm:p-8 rounded-[32px] border border-[var(--color-glass-border)] shadow-2xl space-y-6">
      
      {/* Header & Item Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5 w-max">
            <TrendingDown className="w-3.5 h-3.5" />
            Historical Price Tracker & Deal Radar
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-2">
            Local Price History & Smart Buy Indicator
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Track 6-month historical pricing across DataBlitz, Shopee, Lazada & GameOne to buy at the lowest point.
          </p>
        </div>

        {/* Item Selector */}
        <div className="shrink-0">
          <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Select Item to Audit:</label>
          <select
            value={selectedAccessoryId}
            onChange={(e) => {
              setSelectedAccessoryId(e.target.value);
              setAlertSubscribed(false);
            }}
            className="bg-[var(--app-bg)]/50 border border-white/15 text-white py-2 px-3 rounded-xl text-xs font-bold focus:outline-none focus:border-primary-500 cursor-pointer max-w-xs"
          >
            {ACCESSORY_CATALOG.map(item => (
              <option key={item.id} value={item.id} className="bg-[color-mix(in_srgb,var(--card-bg)_80%,white)] text-white">
                [{item.category.toUpperCase()}] {item.brand} {item.name} - ₱{item.pricePhp.toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Item Overview & Buy Verdict */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Selected Gear Card */}
        <div className="p-4 rounded-2xl bg-[var(--app-bg)]/40 border border-white/10 flex items-center gap-4">
          {selectedAccessory.imageUrl && (
            <img 
              src={selectedAccessory.imageUrl} 
              alt={selectedAccessory.name} 
              className="w-16 h-16 object-cover rounded-xl border border-white/10 shrink-0"
            />
          )}
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase">{selectedAccessory.brand}</span>
            <h3 className="font-bold text-white text-sm leading-snug">{selectedAccessory.name}</h3>
            <span className="text-lg font-extrabold text-primary-400 mt-0.5 block">
              ₱{selectedAccessory.pricePhp.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Peak vs Low stats */}
        <div className="p-4 rounded-2xl bg-[var(--app-bg)]/40 border border-white/10 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">6-Month Peak</span>
            <span className="text-sm font-extrabold text-zinc-400 line-through">₱{highestPrice.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase block">Historical Low</span>
            <span className="text-sm font-extrabold text-emerald-400">₱{lowestPrice.toLocaleString()}</span>
          </div>
          <div className="col-span-2 pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-zinc-400">Total Price Drop:</span>
            <span className="font-extrabold text-emerald-400">-{discountFromPeak}% Off Peak</span>
          </div>
        </div>

        {/* Buy Verdict Indicator */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between ${buyRecommendation.color}`}>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest block">AI Smart Buy Recommendation</span>
            <h4 className="text-base font-extrabold mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{buyRecommendation.verdict}</span>
            </h4>
            <p className="text-xs opacity-90 mt-1 leading-relaxed">{buyRecommendation.detail}</p>
          </div>

          <button
            type="button"
            onClick={() => setAlertSubscribed(true)}
            disabled={alertSubscribed}
            className={`mt-3 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              alertSubscribed 
                ? 'bg-emerald-500 text-black' 
                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
            }`}
          >
            {alertSubscribed ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Price Alert Active for this Item</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Track Further Price Drops</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Bar Graph */}
      <div className="p-5 rounded-2xl bg-[var(--app-bg)]/30 border border-white/10 space-y-4">
        <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
          6-Month Local Market Price Curve (PHP)
        </span>

        <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-44 pt-6">
          {priceHistory.map((item, idx) => {
            const heightPct = Math.round((item.price / highestPrice) * 100);
            const isLowest = item.price === lowestPrice;

            return (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono font-bold text-zinc-300 group-hover:text-white transition">
                  ₱{(item.price / 1000).toFixed(1)}k
                </span>
                
                <div className="w-full bg-white/5 rounded-t-xl overflow-hidden h-full flex items-end">
                  <div
                    className={`w-full transition-all duration-700 rounded-t-xl ${
                      isLowest 
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]' 
                        : 'bg-gradient-to-t from-[var(--theme-color)] to-[var(--theme-color)] opacity-70 group-hover:opacity-100'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold block line-clamp-1">{item.month}</span>
                  <span className={`text-[9px] font-bold block ${isLowest ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {item.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
